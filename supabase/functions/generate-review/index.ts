import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders, handleError } from './utils.ts';
import { generateSearchTerms } from './searchTerms.ts';
import { performSearch } from './serper.ts';
import { synthesizeLiteratureReview } from './literatureReview.ts';
import { generateTitleAndObjectives } from './titleAndObjectives.ts';
import { generateAbstract } from './abstract.ts';
import { generateMethodology } from './methodology.ts';
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

    const { description, userId } = await req.json();
    console.log('Received request:', { description, userId });

    // Fetch API keys
    const { data: apiKeys, error: apiKeysError } = await supabaseClient
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (apiKeysError || !apiKeys) {
      console.error('API keys error:', apiKeysError);
      throw new Error('API keys not found. Please ensure you have set up your OpenRouter API key in the settings.');
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

    // Generate search terms and perform search
    const searchTerms = await generateSearchTerms(description, apiKeys.openrouter_key);
    console.log('Generated search terms:', searchTerms);

    const searchResults = await performSearch(searchTerms, apiKeys.serper_key);
    console.log('Search results retrieved:', searchResults.length);

    // Generate literature review
    const literatureReview = await synthesizeLiteratureReview(
      searchResults,
      description,
      apiKeys.openrouter_key
    );
    console.log('Literature review generated');

    // Store literature review
    const { error: litReviewError } = await supabaseClient
      .from('research_proposal_components')
      .insert({
        research_request_id: requestData.id,
        component_type: 'literature_review',
        content: literatureReview,
        status: 'completed'
      });

    if (litReviewError) throw litReviewError;

    // Generate title and objectives
    const titleAndObjectives = await generateTitleAndObjectives(
      description,
      literatureReview,
      apiKeys.openrouter_key
    );
    console.log('Title and objectives generated');

    // Store title and objectives
    const { error: objectivesError } = await supabaseClient
      .from('research_proposal_components')
      .insert({
        research_request_id: requestData.id,
        component_type: 'title_and_objectives',
        content: titleAndObjectives,
        status: 'completed'
      });

    if (objectivesError) throw objectivesError;

    // Generate methodology section
    const methodology = await generateMethodology(
      description,
      apiKeys.openrouter_key
    );
    console.log('Methodology section generated');

    // Store methodology
    const { error: methodologyError } = await supabaseClient
      .from('research_proposal_components')
      .insert({
        research_request_id: requestData.id,
        component_type: 'methodology',
        content: methodology,
        status: 'completed'
      });

    if (methodologyError) throw methodologyError;

    // Generate abstract using title, objectives and literature review
    const abstract = await generateAbstract(
      titleAndObjectives,
      literatureReview,
      apiKeys.openrouter_key
    );
    console.log('Abstract generated');

    // Store abstract
    const { error: abstractError } = await supabaseClient
      .from('research_proposal_components')
      .insert({
        research_request_id: requestData.id,
        component_type: 'abstract',
        content: abstract,
        status: 'completed'
      });

    if (abstractError) throw abstractError;

    // Update research request status
    const { error: updateError } = await supabaseClient
      .from('research_requests')
      .update({ 
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestData.id);

    if (updateError) throw updateError;

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
