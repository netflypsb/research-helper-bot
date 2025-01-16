import { generateSearchTerms } from '../searchTerms.ts';
import { performSearch } from '../serper.ts';
import { ApiKeys } from '../types.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

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

  const searchResults = await Promise.all(
    literatureSchema.queries.map(query => 
      performSearch(query.queryText, apiKeys.serperKey)
    )
  );

  await supabaseClient
    .from('search_results')
    .insert({
      research_request_id: requestId,
      search_provider: 'serper',
      search_terms: literatureSchema.queries.map(q => q.queryText).join('\n'),
      results: searchResults
    });

  return { literatureSchema, searchResults };
}