export type ApiKeysTable = {
  Row: {
    created_at: string | null;
    id: string;
    openrouter_key: string | null;
    serp_key: string | null;
    serper_key: string | null;
    updated_at: string | null;
    user_id: string;
  };
  Insert: {
    created_at?: string | null;
    id?: string;
    openrouter_key?: string | null;
    serp_key?: string | null;
    serper_key?: string | null;
    updated_at?: string | null;
    user_id: string;
  };
  Update: {
    created_at?: string | null;
    id?: string;
    openrouter_key?: string | null;
    serp_key?: string | null;
    serper_key?: string | null;
    updated_at?: string | null;
    user_id?: string;
  };
  Relationships: [];
};