import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      wishlist_items: {
        Row: {
          id: string
          title: string
          description: string
          url: string
          store: string
          price: string
          image_url: string | null
          status: 'available' | 'purchased' | 'reserved'
          purchased_by: string | null
          purchase_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          url: string
          store: string
          price: string
          image_url?: string | null
          status?: 'available' | 'purchased' | 'reserved'
          purchased_by?: string | null
          purchase_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          url?: string
          store?: string
          price?: string
          image_url?: string | null
          status?: 'available' | 'purchased' | 'reserved'
          purchased_by?: string | null
          purchase_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      gifts: {
        Row: {
          id: string
          type: 'item' | 'cash'
          item_id: string | null
          item_title: string | null
          amount: string | null
          guest_name: string
          message: string
          from_name: string
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: 'item' | 'cash'
          item_id?: string | null
          item_title?: string | null
          amount?: string | null
          guest_name: string
          message: string
          from_name: string
          date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'item' | 'cash'
          item_id?: string | null
          item_title?: string | null
          amount?: string | null
          guest_name?: string
          message?: string
          from_name?: string
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
