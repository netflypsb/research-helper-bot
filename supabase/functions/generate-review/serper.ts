import { SearchResult } from './types.ts';

export async function performSearch(searchTerms: string, serperKey: string): Promise<SearchResult[]> {
  console.log('Performing search with terms:', searchTerms);
  
  if (!serperKey) {
    throw new Error('Serper API key is required');
  }

  try {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': serperKey,
      },
      body: JSON.stringify({
        q: searchTerms,
        num: 10, // Increased from 8 to get more comprehensive results
        type: 'search',
        gl: 'us', // Set to US results for academic consistency
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Serper API error response:', errorText);
      throw new Error(`Serper API returned status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Search results count:', data.organic?.length || 0);

    // Transform and filter results
    const results = (data.organic || []).map((result: any) => ({
      title: result.title || '',
      link: result.link || '',
      snippet: result.snippet || '',
      position: result.position || 0,
      date: result.date || null
    })).filter((result: SearchResult) => 
      // Filter out results without meaningful content
      result.snippet && result.snippet.length > 50
    );

    if (results.length === 0) {
      console.warn('No valid search results found for terms:', searchTerms);
    }

    return results;
  } catch (error) {
    console.error('Error performing search:', error);
    throw new Error(`Failed to perform search: ${error.message}`);
  }
}