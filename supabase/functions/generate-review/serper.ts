import { SearchResult } from './types.ts';

export async function performSearch(searchTerms: string, serperKey: string): Promise<SearchResult[]> {
  console.log('Performing search with terms:', searchTerms);
  
  const response = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': serperKey,
    },
    body: JSON.stringify({
      q: searchTerms,
      num: 8
    })
  });

  if (!response.ok) {
    console.error('Serper API error:', await response.text());
    throw new Error(`Serper API returned status ${response.status}`);
  }

  const data = await response.json();
  console.log('Search results count:', data.organic?.length || 0);
  
  return data.organic || [];
}