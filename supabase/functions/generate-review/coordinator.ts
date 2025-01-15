import { generateSearchTerms } from './searchTerms.ts';
import { performSearch } from './serper.ts';
import { synthesizeLiteratureReview } from './literatureReview.ts';
import { generateTitleAndObjectives } from './titleAndObjectives.ts';
import { generateMethodology } from './methodology.ts';
import { generateAbstract } from './abstract.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

export async function coordinateResearchGeneration(
  description: string,
  userId: string,
  requestId: string,
  apiKeys: { openrouterKey: string; serperKey: string }
) {
  console.log('Starting research generation process for request:', requestId);
  
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    // Step 1: Generate search terms and perform search
    console.log('Generating search terms...');
    const searchTerms = await generateSearchTerms(description, apiKeys.openrouterKey);
    
    console.log('Performing search with terms:', searchTerms);
    const searchResults = await performSearch(searchTerms, apiKeys.serperKey);
    
    // Store search results
    await supabaseClient
      .from('search_results')
      .insert({
        research_request_id: requestId,
        search_provider: 'serper',
        search_terms: searchTerms,
        results: searchResults
      });

    // Step 2: Generate literature review
    console.log('Generating literature review...');
    const literatureReview = await synthesizeLiteratureReview(
      searchResults,
      description,
      apiKeys.openrouterKey
    );

    await supabaseClient
      .from('research_proposal_components')
      .insert({
        research_request_id: requestId,
        component_type: 'literature_review',
        content: literatureReview,
        status: 'completed'
      });

    // Step 3: Generate title and objectives
    console.log('Generating title and objectives...');
    const titleAndObjectives = await generateTitleAndObjectives(
      description,
      literatureReview,
      apiKeys.openrouterKey
    );

    await supabaseClient
      .from('research_proposal_components')
      .insert({
        research_request_id: requestId,
        component_type: 'title_and_objectives',
        content: titleAndObjectives,
        status: 'completed'
      });

    // Step 4: Generate methodology
    console.log('Generating methodology...');
    const methodology = await generateMethodology(
      description,
      apiKeys.openrouterKey
    );

    await supabaseClient
      .from('research_proposal_components')
      .insert({
        research_request_id: requestId,
        component_type: 'methodology',
        content: methodology,
        status: 'completed'
      });

    // Step 5: Generate abstract
    console.log('Generating abstract...');
    const abstract = await generateAbstract(
      titleAndObjectives,
      literatureReview,
      apiKeys.openrouterKey
    );

    await supabaseClient
      .from('research_proposal_components')
      .insert({
        research_request_id: requestId,
        component_type: 'abstract',
        content: abstract,
        status: 'completed'
      });

    // Update research request status
    await supabaseClient
      .from('research_requests')
      .update({ 
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);

    console.log('Research generation process completed successfully');
    return true;
  } catch (error) {
    console.error('Error in research generation process:', error);
    
    // Update research request status to failed
    await supabaseClient
      .from('research_requests')
      .update({ 
        status: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);
    
    throw error;
  }
}