import { SearchResult } from './types.ts';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 2000; // 2 seconds

export async function performSearch(
  searchTerms: string, 
  serperKey: string, 
  retryCount = 0,
  retryDelay = INITIAL_RETRY_DELAY
): Promise<SearchResult[]> {
  console.log(`Performing search with terms: ${searchTerms}, attempt: ${retryCount + 1}`);
  
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

    // Handle rate limiting with exponential backoff
    if (response.status === 429 && retryCount < MAX_RETRIES) {
      console.log(`Rate limit hit, retrying in ${retryDelay}ms...`);
      await delay(retryDelay);
      return performSearch(
        searchTerms, 
        serperKey, 
        retryCount + 1,
        retryDelay * 2 // Exponential backoff
      );
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
    console.log(`Search results count: ${data.organic?.length || 0}`);

    const results = (data.organic || [])
      .map((result: any) => ({
        title: result.title || '',
        link: result.link || '',
        snippet: result.snippet || '',
        position: result.position || 0,
        date: result.date || null
      }))
      .filter((result: SearchResult) => result.snippet && result.snippet.length > 50);

    if (results.length === 0) {
      console.warn('No valid search results found for terms:', searchTerms);
    }

    return results;
  } catch (error) {
    console.error('Error performing search:', error);
    
    // If we've hit max retries, throw a user-friendly error
    if (retryCount >= MAX_RETRIES) {
      throw new Error('Search service is currently unavailable. Please try again in a few minutes.');
    }
    
    throw error;
  }
}