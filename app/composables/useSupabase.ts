import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/supabase'

// Singleton pour éviter les instances multiples
let supabaseInstance: SupabaseClient<Database> | null = null

export const useSupabase = () => {
  const config = useRuntimeConfig()
  
  if (!supabaseInstance) {
    const supabaseUrl = config.public.supabaseUrl
    const supabaseKey = config.public.supabaseAnonKey
    
    supabaseInstance = createClient<Database>(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          // En SSR, pas de persistSession (localStorage indisponible)
          persistSession: process.client,
          storageKey: 'sb-auth-token'
        }
      }
    )
  }
  
  const supabase = supabaseInstance

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
        return await supabase.auth.signOut({ scope: 'local' })
      },
      
      getUser: async () => {
        return await supabase.auth.getUser()
      },
      
      getSession: async () => {
        return await supabase.auth.getSession()
      },
      
      signInWithOAuth: async (options: any) => {
        return await supabase.auth.signInWithOAuth(options)
      },
      
      onAuthStateChange: (callback: (event: string, session: any) => void) => {
        return supabase.auth.onAuthStateChange(callback)
      }
    },
    
    // Helper pour les articles
    articles: {
      // Récupérer tous les articles publiés (optimisé: seulement les champs nécessaires)
      getPublished: async () => {
        return await supabase
          .from('articles')
          .select('id, title, slug, description, date, tags, reading_time, published')
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
    },
    
    // Helper pour les citations
    quotes: {
      // Récupérer une citation aléatoire
      getRandom: async () => {
        const { data, error } = await supabase
          .from('quotes')
          .select('*')
        
        if (error || !data || data.length === 0) return null
        
        // Sélectionner une citation aléatoire
        const randomIndex = Math.floor(Math.random() * data.length)
        return data[randomIndex]
      },
      
      // Récupérer toutes les citations
      getAll: async () => {
        return await supabase
          .from('quotes')
          .select('*')
          .order('author', { ascending: true })
      }
    }
  }
}
