export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_key_usage: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
          uses_count: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          uses_count?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          uses_count?: number
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string | null
          id: string
          openrouter_key: string | null
          serp_key: string | null
          serper_key: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          openrouter_key?: string | null
          serp_key?: string | null
          serper_key?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          openrouter_key?: string | null
          serp_key?: string | null
          serper_key?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      literature_required_schemas: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json
          queries: Json
          research_request_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata: Json
          queries: Json
          research_request_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json
          queries?: Json
          research_request_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "literature_required_schemas_research_request_id_fkey"
            columns: ["research_request_id"]
            isOneToOne: false
            referencedRelation: "research_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      pubmed_search_results: {
        Row: {
          created_at: string | null
          id: string
          research_request_id: string
          results: Json
          search_terms: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          research_request_id: string
          results: Json
          search_terms: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          research_request_id?: string
          results?: Json
          search_terms?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pubmed_search_results_research_request_id_fkey"
            columns: ["research_request_id"]
            isOneToOne: false
            referencedRelation: "research_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limits: {
        Row: {
          api_name: string
          id: string
          last_request_time: string | null
          request_count: number | null
          reset_at: string | null
        }
        Insert: {
          api_name: string
          id?: string
          last_request_time?: string | null
          request_count?: number | null
          reset_at?: string | null
        }
        Update: {
          api_name?: string
          id?: string
          last_request_time?: string | null
          request_count?: number | null
          reset_at?: string | null
        }
        Relationships: []
      }
      request_queue: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          priority: number
          research_request_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["request_status"]
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          priority?: number
          research_request_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          priority?: number
          research_request_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_queue_research_request_id_fkey"
            columns: ["research_request_id"]
            isOneToOne: false
            referencedRelation: "research_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      research_proposal_components: {
        Row: {
          component_type: string
          content: string | null
          created_at: string | null
          id: string
          research_request_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          component_type: string
          content?: string | null
          created_at?: string | null
          id?: string
          research_request_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          component_type?: string
          content?: string | null
          created_at?: string | null
          id?: string
          research_request_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "research_proposal_components_research_request_id_fkey"
            columns: ["research_request_id"]
            isOneToOne: false
            referencedRelation: "research_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      research_requests: {
        Row: {
          created_at: string | null
          description: string
          id: string
          result: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          result?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          result?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      schema_templates: {
        Row: {
          created_at: string | null
          id: string
          name: string
          schema: Json
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          schema: Json
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          schema?: Json
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      search_results: {
        Row: {
          created_at: string | null
          id: string
          research_request_id: string
          results: Json
          search_provider: string
          search_terms: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          research_request_id: string
          results: Json
          search_provider: string
          search_terms: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          research_request_id?: string
          results?: Json
          search_provider?: string
          search_terms?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_results_research_request_id_fkey"
            columns: ["research_request_id"]
            isOneToOne: false
            referencedRelation: "research_requests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          api_name_param: string
        }
        Returns: boolean
      }
      get_next_request: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          research_request_id: string
          user_id: string
        }[]
      }
      increment_api_key_usage: {
        Args: {
          user_id_param: string
        }
        Returns: undefined
      }
    }
    Enums: {
      query_priority: "high" | "medium" | "low"
      request_status: "pending" | "processing" | "completed" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
