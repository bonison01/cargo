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
      invoice_items: {
        Row: {
          created_at: string | null
          description: string
          dimensions: string
          id: number
          invoice_id: string
          quantity: number
          updated_at: string | null
          weight: number
        }
        Insert: {
          created_at?: string | null
          description: string
          dimensions: string
          id?: number
          invoice_id: string
          quantity: number
          updated_at?: string | null
          weight: number
        }
        Update: {
          created_at?: string | null
          description?: string
          dimensions?: string
          id?: number
          invoice_id?: string
          quantity?: number
          updated_at?: string | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          basic_freight: number
          cgst: number
          cod: number
          consignment_number: string
          contents: string
          created_at: string | null
          cwb_charge: number
          date: string
          destination_city: string
          dimensions: string
          freight_handling: number
          gross_weight: number
          id: string
          origin_city: string
          other_charges: number
          packaging: number
          payment_status: string
          pickup_delivery: number
          receiver_address: string
          receiver_name: string
          receiver_phone: string
          sender_address: string
          sender_name: string
          sender_phone: string
          status: string
          total: number
          total_items: number
          updated_at: string | null
          user_id: string
          waybill_number: string
          weight: number
        }
        Insert: {
          basic_freight: number
          cgst: number
          cod: number
          consignment_number: string
          contents: string
          created_at?: string | null
          cwb_charge: number
          date: string
          destination_city: string
          dimensions: string
          freight_handling: number
          gross_weight: number
          id?: string
          origin_city: string
          other_charges: number
          packaging: number
          payment_status: string
          pickup_delivery: number
          receiver_address: string
          receiver_name: string
          receiver_phone: string
          sender_address: string
          sender_name: string
          sender_phone: string
          status: string
          total: number
          total_items: number
          updated_at?: string | null
          user_id: string
          waybill_number: string
          weight: number
        }
        Update: {
          basic_freight?: number
          cgst?: number
          cod?: number
          consignment_number?: string
          contents?: string
          created_at?: string | null
          cwb_charge?: number
          date?: string
          destination_city?: string
          dimensions?: string
          freight_handling?: number
          gross_weight?: number
          id?: string
          origin_city?: string
          other_charges?: number
          packaging?: number
          payment_status?: string
          pickup_delivery?: number
          receiver_address?: string
          receiver_name?: string
          receiver_phone?: string
          sender_address?: string
          sender_name?: string
          sender_phone?: string
          status?: string
          total?: number
          total_items?: number
          updated_at?: string | null
          user_id?: string
          waybill_number?: string
          weight?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
