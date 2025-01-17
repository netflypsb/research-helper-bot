import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from './utils.ts';
import { coordinateResearchGeneration } from './coordinator.ts';
import { createResearchRequest, validateRequest } from './services/requestService.ts';
import { createQueueEntry, handleQueuePosition } from './services/queueService.ts';
import { handleApiKeys } from './services/apiKeyService.ts';

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
    console.log('Received request to generate review');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { description, userId, useMedResearchKeys } = await req.json();
    
    // Validate request
    await validateRequest(description, userId);
    console.log('Request validated');

    // Create research request
    const requestData = await createResearchRequest(supabaseClient, userId, description);
    console.log('Research request created:', requestData.id);

    // Handle API keys
    const apiKeys = await handleApiKeys(supabaseClient, userId, useMedResearchKeys);
    console.log('API keys retrieved');

    // Create queue entry
    const queueData = await createQueueEntry(supabaseClient, userId, requestData.id);
    console.log('Queue entry created:', queueData.id);

    try {
      // Check rate limits
      const { data: openrouterLimit } = await supabaseClient.rpc('check_rate_limit', {
        api_name_param: 'openrouter'
      });

      const { data: serperLimit } = await supabaseClient.rpc('check_rate_limit', {
        api_name_param: 'serper'
      });

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

        return new Response(
          JSON.stringify({ 
            message: 'Research request submitted successfully',
            requestId: requestData.id,
            status: 'processing'
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      } else {
        // Handle queued state
        const position = await handleQueuePosition(supabaseClient, requestData, queueData);
        console.log('Request queued at position:', position);
        
        return new Response(
          JSON.stringify({ 
            message: 'Request queued successfully',
            requestId: requestData.id,
            queueId: queueData.id,
            status: 'queued',
            position
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
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

      throw error;
    }
  } catch (error) {
    console.error('Error in generate-review function:', error);
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
});