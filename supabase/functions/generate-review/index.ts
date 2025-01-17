import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders, handleError } from './utils.ts';
import { coordinateResearchGeneration } from './coordinator.ts';
import type { ResearchRequest, ApiKeys } from './types.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      }
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { description, userId, useMedResearchKeys } = await req.json();
    console.log('Received request:', { description, userId, useMedResearchKeys });

    if (!description || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    let apiKeys: ApiKeys;

    if (useMedResearchKeys) {
      console.log('Using MedResearch API keys');
      const openrouterKey = Deno.env.get('MEDRESEARCH_OPENROUTER_KEY');
      const serperKey = Deno.env.get('MEDRESEARCH_SERPER_KEY');
      
      if (!openrouterKey || !serperKey) {
        return new Response(
          JSON.stringify({ error: 'MedResearch API keys not configured' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      apiKeys = {
        openrouter_key: openrouterKey,
        serper_key: serperKey,
      };

      await supabaseClient.rpc('increment_api_key_usage', { user_id_param: userId });
    } else {
      console.log('Fetching user API keys');
      const { data: userApiKeys, error: apiKeysError } = await supabaseClient
        .from('api_keys')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (apiKeysError || !userApiKeys) {
        return new Response(
          JSON.stringify({ 
            error: 'API keys not found. Please ensure you have set up your OpenRouter API key in the settings.' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      apiKeys = userApiKeys;
    }

    if (!apiKeys.openrouter_key) {
      return new Response(
        JSON.stringify({ 
          error: 'OpenRouter API key is not set. Please add your OpenRouter API key in the settings.' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create research request
    const { data: requestData, error: requestError } = await supabaseClient
      .from('research_requests')
      .insert({
        user_id: userId,
        description,
        status: 'pending'
      })
      .select()
      .single();

    if (requestError) {
      console.error('Error creating research request:', requestError);
      return new Response(
        JSON.stringify({ error: 'Failed to create research request' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Add request to queue
    const { data: queueData, error: queueError } = await supabaseClient
      .from('request_queue')
      .insert({
        user_id: userId,
        research_request_id: requestData.id,
        status: 'pending'
      })
      .select()
      .single();

    if (queueError) {
      console.error('Error adding to queue:', queueError);
      return new Response(
        JSON.stringify({ error: 'Failed to queue request' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check rate limits for each API
    const { data: openrouterLimit } = await supabaseClient.rpc('check_rate_limit', {
      api_name_param: 'openrouter'
    });

    const { data: serperLimit } = await supabaseClient.rpc('check_rate_limit', {
      api_name_param: 'serper'
    });

    try {
      // If we're under rate limits, process immediately
      if (openrouterLimit && serperLimit) {
        console.log('Processing request immediately - under rate limits');
        await coordinateResearchGeneration(
          description,
          userId,
          requestData.id,
          {
            openrouterKey: apiKeys.openrouter_key,
            serperKey: apiKeys.serper_key ?? '',
          }
        );

        // Update queue status
        await supabaseClient
          .from('request_queue')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', queueData.id);
      } else {
        console.log('Request queued - rate limits reached');
      }

      return new Response(
        JSON.stringify({ 
          message: 'Research request submitted successfully',
          requestId: requestData.id,
          queueId: queueData.id,
          status: openrouterLimit && serperLimit ? 'processing' : 'queued'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      console.error('Error in research generation:', error);
      
      // Update queue status to failed
      await supabaseClient
        .from('request_queue')
        .update({ 
          status: 'failed',
          error_message: error.message,
          completed_at: new Date().toISOString()
        })
        .eq('id', queueData.id);

      return new Response(
        JSON.stringify({ 
          error: 'Failed to process research request',
          details: error.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Error in generate-review function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});