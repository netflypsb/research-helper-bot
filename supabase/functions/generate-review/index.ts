import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders, handleError } from './utils.ts';
import { generateSearchTerms } from './searchTerms.ts';
import { performSearch } from './serper.ts';
import { synthesizeLiteratureReview } from './literatureReview.ts';
import { generateTitleAndObjectives } from './titleAndObjectives.ts';
import { generateAbstract } from './abstract.ts';
import { generateReferences } from './references.ts';
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
      throw new Error('API keys not found');
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

    if (requestError) throw requestError;

    // Generate search terms and perform search
    const searchTerms = await generateSearchTerms(description, apiKeys.openrouter_key);
    console.log('Generated search terms:', searchTerms);

    const searchResults = await performSearch(searchTerms, apiKeys.serper_key);
    console.log('Search results retrieved:', searchResults.length);

    // Store search results
    const { error: searchResultsError } = await supabaseClient
      .from('search_results')
      .insert({
        research_request_id: requestData.id,
        search_provider: 'serper',
        search_terms: searchTerms,
        results: { organic: searchResults }
      });

    if (searchResultsError) throw searchResultsError;

    // Generate literature review using search results
    const literatureReview = await synthesizeLiteratureReview(
      searchResults,
      description,
      apiKeys.openrouter_key
    );

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

    // Generate abstract
    const abstract = await generateAbstract(
      titleAndObjectives,
      literatureReview,
      apiKeys.openrouter_key
    );

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

    // Generate references from search results
    const references = await generateReferences(searchResults, apiKeys.openrouter_key);

    // Store references
    const { error: referencesError } = await supabaseClient
      .from('research_proposal_components')
      .insert({
        research_request_id: requestData.id,
        component_type: 'references',
        content: references,
        status: 'completed'
      });

    if (referencesError) throw referencesError;

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