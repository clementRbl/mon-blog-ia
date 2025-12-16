import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/supabase'

// Singleton global pour réutiliser la connexion Supabase
let supabaseClient: SupabaseClient<Database> | null = null
let supabaseServiceClient: SupabaseClient<Database> | null = null

/**
 * Client Supabase avec anon key (lecture publique)
 * Réutilise la même instance pour éviter les connexions multiples
 */
export const getSupabaseClient = () => {
  if (!supabaseClient) {
    const config = useRuntimeConfig()
    
    supabaseClient = createClient<Database>(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        },
        db: {
          schema: 'public'
        },
        global: {
          headers: {
            'x-client-info': 'nuxt-server'
          }
        }
      }
    )
  }
  
  return supabaseClient
}

/**
 * Client Supabase avec service role key (accès admin, bypass RLS)
 * Réutilise la même instance pour éviter les connexions multiples
 */
export const getSupabaseServiceClient = () => {
  if (!supabaseServiceClient) {
    const config = useRuntimeConfig()
    
    supabaseServiceClient = createClient<Database>(
      config.public.supabaseUrl,
      config.supabaseServiceRoleKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        },
        db: {
          schema: 'public'
        },
        global: {
          headers: {
            'x-client-info': 'nuxt-server-admin'
          }
        }
      }
    )
  }
  
  return supabaseServiceClient
}
