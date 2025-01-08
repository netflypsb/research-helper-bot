export type ResearchProposalComponentsTable = {
  Row: {
    component_type: string;
    content: string | null;
    created_at: string | null;
    id: string;
    research_request_id: string;
    status: string | null;
    updated_at: string | null;
  };
  Insert: {
    component_type: string;
    content?: string | null;
    created_at?: string | null;
    id?: string;
    research_request_id: string;
    status?: string | null;
    updated_at?: string | null;
  };
  Update: {
    component_type?: string;
    content?: string | null;
    created_at?: string | null;
    id?: string;
    research_request_id?: string;
    status?: string | null;
    updated_at?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: "research_proposal_components_research_request_id_fkey";
      columns: ["research_request_id"];
      isOneToOne: false;
      referencedRelation: "research_requests";
      referencedColumns: ["id"];
    }
  ];
};