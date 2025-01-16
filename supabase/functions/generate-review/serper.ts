import { SearchResult } from './types.ts';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function performSearch(searchTerms: string, serperKey: string, retryCount = 0): Promise<SearchResult[]> {
  console.log('Performing search with terms:', searchTerms, 'attempt:', retryCount + 1);
  
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
        num: 10,
        type: 'search',
        gl: 'us',
      })
    });

    if (response.status === 429 && retryCount < 3) {
      console.log('Rate limit hit, retrying after delay...');
      await delay(2000 * (retryCount + 1)); // Exponential backoff
      return performSearch(searchTerms, serperKey, retryCount + 1);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Serper API error response:', errorText);
      
      if (response.status === 429) {
        throw new Error('Search API rate limit reached. Please try again in a few minutes.');
      }
      
      throw new Error(`Search API returned status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Search results count:', data.organic?.length || 0);

    const results = (data.organic || []).map((result: any) => ({
      title: result.title || '',
      link: result.link || '',
      snippet: result.snippet || '',
      position: result.position || 0,
      date: result.date || null
    })).filter((result: SearchResult) => 
      result.snippet && result.snippet.length > 50
    );

    if (results.length === 0) {
      console.warn('No valid search results found for terms:', searchTerms);
    }

    return results;
  } catch (error) {
    console.error('Error performing search:', error);
    throw error;
  }
}