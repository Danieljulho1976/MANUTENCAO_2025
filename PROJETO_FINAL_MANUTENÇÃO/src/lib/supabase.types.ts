
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categorias_equipamentos: {
        Row: {
          created_at: string | null
          id: string
          nome: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      categorias_inspecoes: {
        Row: {
          created_at: string | null
          id: string
          nome: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      checklist_itens: {
        Row: {
          checklist_id: string | null
          created_at: string | null
          descricao: string
          id: string
          opcoes: Json | null
          ordem: number
          tipo: string
          unidade: string | null
        }
        Insert: {
          checklist_id?: string | null
          created_at?: string | null
          descricao: string
          id?: string
          opcoes?: Json | null
          ordem: number
          tipo: string
          unidade?: string | null
        }
        Update: {
          checklist_id?: string | null
          created_at?: string | null
          descricao?: string
          id?: string
          opcoes?: Json | null
          ordem?: number
          tipo?: string
          unidade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_itens_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_respostas: {
        Row: {
          created_at: string | null
          id: string
          item_id: string | null
          ordem_servico_id: string | null
          resposta_boolean: boolean | null
          resposta_numero: number | null
          resposta_opcao: string | null
          resposta_texto: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id?: string | null
          ordem_servico_id?: string | null
          resposta_boolean?: boolean | null
          resposta_numero?: number | null
          resposta_opcao?: string | null
          resposta_texto?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string | null
          ordem_servico_id?: string | null
          resposta_boolean?: boolean | null
          resposta_numero?: number | null
          resposta_opcao?: string | null
          resposta_texto?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_respostas_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "checklist_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_respostas_ordem_servico_id_fkey"
            columns: ["ordem_servico_id"]
            isOneToOne: false
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
        ]
      }
      checklists: {
        Row: {
          categoria_inspecao_id: string | null
          created_at: string | null
          id: string
          nome: string
        }
        Insert: {
          categoria_inspecao_id?: string | null
          created_at?: string | null
          id?: string
          nome: string
        }
        Update: {
          categoria_inspecao_id?: string | null
          created_at?: string | null
          id?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklists_categoria_inspecao_id_fkey"
            columns: ["categoria_inspecao_id"]
            isOneToOne: false
            referencedRelation: "categorias_inspecoes"
            referencedColumns: ["id"]
          },
        ]
      }
      equipamentos: {
        Row: {
          capacidade: string | null
          categoria_id: string | null
          created_at: string | null
          descricao: string | null
          id: string
          local_instalacao: string | null
          localizacao: string | null
          marca: string | null
          modelo: string | null
          nome: string | null
          numero_serie: string | null
          pavimento: string | null
          tag: string
          tipo_gas: string | null
        }
        Insert: {
          capacidade?: string | null
          categoria_id?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          local_instalacao?: string | null
          localizacao?: string | null
          marca?: string | null
          modelo?: string | null
          nome?: string | null
          numero_serie?: string | null
          pavimento?: string | null
          tag: string
          tipo_gas?: string | null
        }
        Update: {
          capacidade?: string | null
          categoria_id?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          local_instalacao?: string | null
          localizacao?: string | null
          marca?: string | null
          modelo?: string | null
          nome?: string | null
          numero_serie?: string | null
          pavimento?: string | null
          tag?: string
          tipo_gas?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipamentos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_equipamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      funcionarios: {
        Row: {
          created_at: string | null
          drt: string
          funcao: string
          id: string
          nome: string
        }
        Insert: {
          created_at?: string | null
          drt: string
          funcao: string
          id?: string
          nome: string
        }
        Update: {
          created_at?: string | null
          drt?: string
          funcao?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      ordens_servico: {
        Row: {
          categoria_inspecao_id: string | null
          checklist_id: string | null
          data_conclusao: string | null
          data_criacao: string | null
          equipamento_id: string | null
          funcionario_id: string | null
          id: string
          numero: string
          observacoes: string | null
          status: string
        }
        Insert: {
          categoria_inspecao_id?: string | null
          checklist_id?: string | null
          data_conclusao?: string | null
          data_criacao?: string | null
          equipamento_id?: string | null
          funcionario_id?: string | null
          id?: string
          numero: string
          observacoes?: string | null
          status?: string
        }
        Update: {
          categoria_inspecao_id?: string | null
          checklist_id?: string | null
          data_conclusao?: string | null
          data_criacao?: string | null
          equipamento_id?: string | null
          funcionario_id?: string | null
          id?: string
          numero?: string
          observacoes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "ordens_servico_categoria_inspecao_id_fkey"
            columns: ["categoria_inspecao_id"]
            isOneToOne: false
            referencedRelation: "categorias_inspecoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_servico_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "checklists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_servico_equipamento_id_fkey"
            columns: ["equipamento_id"]
            isOneToOne: false
            referencedRelation: "equipamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_servico_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

// Database schema types
// This interface is no longer needed as we're using the Database interface
// and mapping the data in our custom hooks
