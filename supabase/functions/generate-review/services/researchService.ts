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
  console.log('Starting search results generation for request:', requestId);
  
  const literatureSchema = await generateSearchTerms(description, apiKeys.openrouterKey);
  
  console.log('Generated literature schema:', literatureSchema);

  await supabaseClient
    .from('literature_required_schemas')
    .insert({
      research_request_id: requestId,
      metadata: literatureSchema.metadata,
      queries: literatureSchema.queries,
    });

  // Initialize arrays to store results
  let serperResults = [];
  let pubmedResults = [];

  try {
    // Perform SERPER searches if API key is available
    if (apiKeys.serperKey) {
      console.log('Performing SERPER searches...');
      serperResults = await Promise.all(
        literatureSchema.queries.map(query => 
          performSearch(query.queryText, apiKeys.serperKey)
            .catch(error => {
              console.error('Error in SERPER search:', error);
              return [];
            })
        )
      );
    }

    // Perform PubMed searches if API key is available
    if (apiKeys.pubmedKey) {
      console.log('Performing PubMed searches...');
      pubmedResults = await Promise.all(
        literatureSchema.queries.map(query =>
          performPubMedSearch(query.queryText, apiKeys.pubmedKey)
            .catch(error => {
              console.error('Error in PubMed search:', error);
              return [];
            })
        )
      );
    }

    // Store SERPER results if any
    if (serperResults.length > 0) {
      console.log('Storing SERPER results...');
      await supabaseClient
        .from('search_results')
        .insert({
          research_request_id: requestId,
          search_provider: 'serper',
          search_terms: literatureSchema.queries.map(q => q.queryText).join('\n'),
          results: serperResults
        });
    }

    // Store PubMed results if any
    if (pubmedResults.length > 0) {
      console.log('Storing PubMed results...');
      await supabaseClient
        .from('pubmed_search_results')
        .insert({
          research_request_id: requestId,
          search_terms: literatureSchema.queries.map(q => q.queryText).join('\n'),
          results: pubmedResults
        });
    }

    // Combine and filter out empty results
    const combinedResults = [
      ...(serperResults.flat().filter(Boolean) || []),
      ...(pubmedResults.flat().filter(Boolean) || [])
    ];

    console.log(`Total combined results: ${combinedResults.length}`);

    return { 
      literatureSchema, 
      searchResults: combinedResults
    };
  } catch (error) {
    console.error('Error in generateAndStoreSearchResults:', error);
    throw new Error(`Failed to generate search results: ${error.message}`);
  }
}