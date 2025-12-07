import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/supabase'

export const useSupabase = () => {
  const config = useRuntimeConfig()
  
  const supabaseUrl = config.public.supabaseUrl
  const supabaseKey = config.public.supabaseAnonKey
  
  const supabase = createClient<Database>(
    supabaseUrl,
    supabaseKey
  )

  return {
    supabase,
    
    // Helper pour l'authentification
    auth: {
      signIn: async (email: string, password: string) => {
        return await supabase.auth.signInWithPassword({ email, password })
      },
      
      signUp: async (email: string, password: string) => {
        return await supabase.auth.signUp({ email, password })
      },
      
      signOut: async () => {
        return await supabase.auth.signOut()
      },
      
      getUser: async () => {
        return await supabase.auth.getUser()
      },
      
      onAuthStateChange: (callback: (event: string, session: any) => void) => {
        return supabase.auth.onAuthStateChange(callback)
      }
    },
    
    // Helper pour les articles
    articles: {
      // Récupérer tous les articles publiés
      getPublished: async () => {
        return await supabase
          .from('articles')
          .select('*')
          .eq('published', true)
          .order('date', { ascending: false })
      },
      
      // Récupérer tous les articles (pour l'admin)
      getAll: async () => {
        return await supabase
          .from('articles')
          .select('*')
          .order('date', { ascending: false })
      },
      
      // Récupérer un article par slug
      getBySlug: async (slug: string) => {
        return await supabase
          .from('articles')
          .select('*')
          .eq('slug', slug)
          .single()
      },
      
      // Créer un article
      create: async (article: Database['public']['Tables']['articles']['Insert']) => {
        return await supabase
          .from('articles')
          .insert(article)
          .select()
          .single()
      },
      
      // Mettre à jour un article
      update: async (id: string, article: Database['public']['Tables']['articles']['Update']) => {
        return await supabase
          .from('articles')
          .update(article)
          .eq('id', id)
          .select()
          .single()
      },
      
      // Supprimer un article
      delete: async (id: string) => {
        return await supabase
          .from('articles')
          .delete()
          .eq('id', id)
      },
      
      // Récupérer les articles par tag
      getByTag: async (tag: string) => {
        return await supabase
          .from('articles')
          .select('*')
          .eq('published', true)
          .contains('tags', [tag])
          .order('date', { ascending: false })
      }
    }
  }
}
