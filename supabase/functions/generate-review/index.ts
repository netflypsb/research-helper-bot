import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders, handleError } from './utils.ts';
import { coordinateResearchGeneration } from './coordinator.ts';
import type { ResearchRequest, ApiKeys } from './types.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { description, userId, useMedResearchKeys } = await req.json();
    console.log('Received request:', { description, userId, useMedResearchKeys });

    let apiKeys: ApiKeys;

    if (useMedResearchKeys) {
      console.log('Using MedResearch API keys');
      apiKeys = {
        openrouter_key: Deno.env.get('MEDRESEARCH_OPENROUTER_KEY') ?? '',
        serper_key: Deno.env.get('MEDRESEARCH_SERPER_KEY') ?? '',
      };

      // Increment usage count
      await supabaseClient.rpc('increment_api_key_usage', { user_id_param: userId });
    } else {
      console.log('Fetching user API keys');
      const { data: userApiKeys, error: apiKeysError } = await supabaseClient
        .from('api_keys')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (apiKeysError || !userApiKeys) {
        console.error('API keys error:', apiKeysError);
        throw new Error('API keys not found. Please ensure you have set up your OpenRouter API key in the settings.');
      }

      apiKeys = userApiKeys;
    }

    if (!apiKeys.openrouter_key) {
      throw new Error('OpenRouter API key is not set. Please add your OpenRouter API key in the settings.');
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
      throw requestError;
    }

    console.log('Starting research process...');

    await coordinateResearchGeneration(
      description,
      userId,
      requestData.id,
      {
        openrouterKey: apiKeys.openrouter_key,
        serperKey: apiKeys.serper_key ?? '',
      }
    );

    return new Response(
      JSON.stringify({ 
        message: 'Research proposal components generated successfully',
        requestId: requestData.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-review function:', error);
    return handleError(error);
  }
});