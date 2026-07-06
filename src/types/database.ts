// =============================================================================
// Tipos do banco para o Supabase client tipado.
// Espelham supabase/schema.sql. Se preferir gerar automaticamente:
//   supabase gen types typescript --project-id <id> > src/types/database.ts
// =============================================================================

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      operating_systems: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          os_type: string;
          distribution: string | null;
          version: string | null;
          architecture: string | null;
          package_manager: string | null;
          terminal: string | null;
          shell: string | null;
          notes: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          os_type: string;
          distribution?: string | null;
          version?: string | null;
          architecture?: string | null;
          package_manager?: string | null;
          terminal?: string | null;
          shell?: string | null;
          notes?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["operating_systems"]["Insert"]>;
        Relationships: [];
      };
      tools: {
        Row: {
          id: string;
          user_id: string;
          os_id: string;
          name: string;
          category: string | null;
          installed_version: string | null;
          version_check_command: string | null;
          install_command: string | null;
          update_command: string | null;
          documentation_url: string | null;
          status: string;
          notes: string | null;
          last_checked_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          os_id: string;
          name: string;
          category?: string | null;
          installed_version?: string | null;
          version_check_command?: string | null;
          install_command?: string | null;
          update_command?: string | null;
          documentation_url?: string | null;
          status?: string;
          notes?: string | null;
          last_checked_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tools"]["Insert"]>;
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          stack: string[];
          repository_url: string | null;
          os_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          stack?: string[];
          repository_url?: string | null;
          os_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
        Relationships: [];
      };
      npm_packages: {
        Row: {
          id: string;
          user_id: string;
          os_id: string | null;
          project_id: string | null;
          name: string;
          version: string | null;
          scope: string;
          reason: string | null;
          install_command: string | null;
          update_command: string | null;
          npm_url: string | null;
          tags: string[];
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          os_id?: string | null;
          project_id?: string | null;
          name: string;
          version?: string | null;
          scope?: string;
          reason?: string | null;
          install_command?: string | null;
          update_command?: string | null;
          npm_url?: string | null;
          tags?: string[];
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["npm_packages"]["Insert"]>;
        Relationships: [];
      };
      commands: {
        Row: {
          id: string;
          user_id: string;
          os_id: string | null;
          title: string;
          command: string;
          category: string | null;
          explanation: string | null;
          risk_level: string;
          requires_admin: boolean;
          is_favorite: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          os_id?: string | null;
          title: string;
          command: string;
          category?: string | null;
          explanation?: string | null;
          risk_level?: string;
          requires_admin?: boolean;
          is_favorite?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["commands"]["Insert"]>;
        Relationships: [];
      };
      setup_templates: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          compatible_os: string[];
          version: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          compatible_os?: string[];
          version?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["setup_templates"]["Insert"]>;
        Relationships: [];
      };
      setup_steps: {
        Row: {
          id: string;
          setup_id: string;
          order_index: number;
          title: string;
          description: string | null;
          command: string | null;
          os_target: string | null;
          risk_level: string;
          requires_confirmation: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          setup_id: string;
          order_index?: number;
          title: string;
          description?: string | null;
          command?: string | null;
          os_target?: string | null;
          risk_level?: string;
          requires_confirmation?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["setup_steps"]["Insert"]>;
        Relationships: [];
      };
      ai_recommendations: {
        Row: {
          id: string;
          user_id: string;
          os_id: string | null;
          setup_id: string | null;
          title: string;
          description: string | null;
          priority: string;
          category: string | null;
          status: string;
          sources: Json;
          suggested_commands: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          os_id?: string | null;
          setup_id?: string | null;
          title: string;
          description?: string | null;
          priority?: string;
          category?: string | null;
          status?: string;
          sources?: Json;
          suggested_commands?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["ai_recommendations"]["Insert"]>;
        Relationships: [];
      };
      change_logs: {
        Row: {
          id: string;
          user_id: string | null;
          entity_type: string;
          entity_id: string | null;
          action: string;
          old_value: Json | null;
          new_value: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          entity_type: string;
          entity_id?: string | null;
          action: string;
          old_value?: Json | null;
          new_value?: Json | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["change_logs"]["Insert"]>;
        Relationships: [];
      };
      ai_usage_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          model: string | null;
          os_id: string | null;
          tokens_input: number | null;
          tokens_output: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action?: string;
          model?: string | null;
          os_id?: string | null;
          tokens_input?: number | null;
          tokens_output?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["ai_usage_logs"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
