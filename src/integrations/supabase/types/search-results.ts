export type SearchResultsTable = {
  Row: {
    id: string;
    research_request_id: string;
    search_provider: string;
    search_terms: string;
    results: any;
    created_at: string | null;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    research_request_id: string;
    search_provider: string;
    search_terms: string;
    results: any;
    created_at?: string | null;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    research_request_id?: string;
    search_provider?: string;
    search_terms?: string;
    results?: any;
    created_at?: string | null;
    updated_at?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: "search_results_research_request_id_fkey";
      columns: ["research_request_id"];
      isOneToOne: false;
      referencedRelation: "research_requests";
      referencedColumns: ["id"];
    }
  ];
};