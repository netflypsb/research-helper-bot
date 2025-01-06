export interface ResearchRequest {
  id: string;
  user_id: string;
  description: string;
  status: string;
}

export interface SearchResult {
  snippet: string;
  title?: string;
  link?: string;
}

export interface ApiKeys {
  openrouter_key: string;
  serper_key: string;
}