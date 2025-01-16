import { generateSearchTerms } from './searchTerms.ts';
import { performSearch } from './serper.ts';
import { synthesizeLiteratureReview } from './literatureReview.ts';
import { generateTitleAndObjectives } from './titleAndObjectives.ts';
import { generateMethodology } from './methodology.ts';
import { generateAbstract } from './abstract.ts';
import { generateIntroduction } from './introduction.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

interface LiteratureRequiredSchema {
  metadata: {
    researchDescription: string;
    creationDate: string;
    sectionSchemas: Array<{
      sectionName: string;
      schemaUrl: string;
    }>;
  };
  queries: Array<{
    id: string;
    queryText: string;
    relatedSections: string[];
    contextTags: string[];
    priority: 'high' | 'medium' | 'low';
    expectedFields: string[];
    results?: {
      summary: string;
      fullText?: string;
      citations: Array<{
        citationText: string;
        url?: string;
      }>;
    };
  }>;
}

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
    // Step 1: Generate Literature Required Schema
    console.log('Generating Literature Required Schema...');
    const literatureSchema = await generateLiteratureRequiredSchema(description, apiKeys.openrouterKey);
    
    // Store the schema
    await supabaseClient
      .from('literature_required_schemas')
      .insert({
        research_request_id: requestId,
        metadata: literatureSchema.metadata,
        queries: literatureSchema.queries,
      });

    // Step 2: Perform search with structured queries
    console.log('Performing structured search...');
    const searchResults = await Promise.all(
      literatureSchema.queries.map(query => 
        performSearch(query.queryText, apiKeys.serperKey)
      )
    );

    // Store search results
    await supabaseClient
      .from('search_results')
      .insert({
        research_request_id: requestId,
        search_provider: 'serper',
        search_terms: literatureSchema.queries.map(q => q.queryText).join('\n'),
        results: searchResults
      });

    // Step 3: Generate literature review with structured data
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

    // Step 4: Generate title and objectives using literature review
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

    // Generate introduction after title and literature review
    console.log('Generating introduction...');
    const introduction = await generateIntroduction(
      description,
      literatureReview,
      titleAndObjectives,
      apiKeys.openrouterKey
    );

    await supabaseClient
      .from('research_proposal_components')
      .insert({
        research_request_id: requestId,
        component_type: 'introduction',
        content: introduction,
        status: 'completed'
      });

    // Step 5: Generate methodology
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

    // Step 6: Generate abstract
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
