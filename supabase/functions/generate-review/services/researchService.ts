import { generateSearchTerms } from '../searchTerms.ts';
import { performSearch } from '../serper.ts';
import { performPubMedSearch } from '../pubmed.ts';
import { ApiKeys } from '../types.ts';

export async function generateAndStoreSearchResults(
  description: string,
  requestId: string,
  apiKeys: ApiKeys,
  supabaseClient: any
) {
  const literatureSchema = await generateSearchTerms(description, apiKeys.openrouterKey);
  
  await supabaseClient
    .from('literature_required_schemas')
    .insert({
      research_request_id: requestId,
      metadata: literatureSchema.metadata,
      queries: literatureSchema.queries,
    });

  // Perform both SERPER and PubMed searches in parallel
  const [serperResults, pubmedResults] = await Promise.all([
    Promise.all(
      literatureSchema.queries.map(query => 
        performSearch(query.queryText, apiKeys.serperKey)
      )
    ),
    Promise.all(
      literatureSchema.queries.map(query =>
        performPubMedSearch(query.queryText, apiKeys.pubmedKey)
      )
    )
  ]);

  // Store SERPER results
  await supabaseClient
    .from('search_results')
    .insert({
      research_request_id: requestId,
      search_provider: 'serper',
      search_terms: literatureSchema.queries.map(q => q.queryText).join('\n'),
      results: serperResults
    });

  // Store PubMed results
  await supabaseClient
    .from('pubmed_search_results')
    .insert({
      research_request_id: requestId,
      search_terms: literatureSchema.queries.map(q => q.queryText).join('\n'),
      results: pubmedResults
    });

  return { 
    literatureSchema, 
    searchResults: [...serperResults.flat(), ...pubmedResults.flat()]
  };
}