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
      articles: {
        Row: {
          id: string
          slug: string
          title: string
          description: string
          content: string
          tags: string[]
          date: string
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description: string
          content: string
          tags?: string[]
          date?: string
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string
          content?: string
          tags?: string[]
          date?: string
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
