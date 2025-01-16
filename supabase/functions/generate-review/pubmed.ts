interface PubMedSearchResult {
  title: string;
  link: string;
  snippet: string;
  position: number;
  date: string | null;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 2000;

export async function performPubMedSearch(
  searchTerms: string,
  pubmedKey: string,
  retryCount = 0,
  retryDelay = INITIAL_RETRY_DELAY
): Promise<PubMedSearchResult[]> {
  console.log(`Performing PubMed search with terms: ${searchTerms}, attempt: ${retryCount + 1}`);

  if (!pubmedKey) {
    throw new Error('PubMed API key is required');
  }

  try {
    // First, search for article IDs
    const searchResponse = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(searchTerms)}&retmax=10&api_key=${pubmedKey}&format=json`, {
      method: 'GET',
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('PubMed API error response:', errorText);
      throw new Error(`PubMed API returned status ${searchResponse.status}: ${errorText}`);
    }

    const searchData = await searchResponse.json();
    const ids = searchData.esearchresult?.idlist || [];

    if (ids.length === 0) {
      console.warn('No PubMed results found for terms:', searchTerms);
      return [];
    }

    // Then, fetch details for those IDs
    const summaryResponse = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&api_key=${pubmedKey}&format=json`, {
      method: 'GET',
    });

    if (!summaryResponse.ok) {
      throw new Error(`PubMed summary API returned status ${summaryResponse.status}`);
    }

    const summaryData = await summaryResponse.json();
    const results: PubMedSearchResult[] = [];

    Object.values(summaryData.result || {}).forEach((article: any, index) => {
      if (article.uid) {
        results.push({
          title: article.title || '',
          link: `https://pubmed.ncbi.nlm.nih.gov/${article.uid}/`,
          snippet: article.abstract || article.title || '',
          position: index + 1,
          date: article.pubdate || null
        });
      }
    });

    return results.filter(result => result.snippet && result.snippet.length > 50);
  } catch (error) {
    console.error('Error performing PubMed search:', error);

    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying PubMed search in ${retryDelay}ms...`);
      await delay(retryDelay);
      return performPubMedSearch(
        searchTerms,
        pubmedKey,
        retryCount + 1,
        retryDelay * 2
      );
    }

    throw new Error('PubMed search service is currently unavailable. Please try again in a few minutes.');
  }
}