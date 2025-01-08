export type ResearchRequestsTable = {
  Row: {
    created_at: string | null;
    description: string;
    id: string;
    result: string | null;
    status: string | null;
    updated_at: string | null;
    user_id: string;
  };
  Insert: {
    created_at?: string | null;
    description: string;
    id?: string;
    result?: string | null;
    status?: string | null;
    updated_at?: string | null;
    user_id: string;
  };
  Update: {
    created_at?: string | null;
    description?: string;
    id?: string;
    result?: string | null;
    status?: string | null;
    updated_at?: string | null;
    user_id?: string;
  };
  Relationships: [];
};