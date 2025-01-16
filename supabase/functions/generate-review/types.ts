export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  position: number;
  date: string | null;
}

export interface ApiKeys {
  openrouterKey: string;
  serperKey: string;
  pubmedKey: string;
}

export interface LiteratureQuery {
  queryText: string;
  priority: 'high' | 'medium' | 'low';
  context?: string;
}

export interface LiteratureSchema {
  metadata: {
    topic: string;
    subtopics: string[];
    keyTerms: string[];
  };
  queries: LiteratureQuery[];
}