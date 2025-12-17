import type { User } from '@supabase/supabase-js'

export const useSupabaseUser = () => {
  const { supabase } = useSupabase()
  const user = useState<User | null>('supabase-user', () => null)

  // Initialiser immédiatement côté client
  if (process.client && !user.value) {
    // Gérer la redirection OAuth (exchange code for session)

    supabase.auth.getSession().then(({ data: { session } }) => {
      user.value = session?.user ?? null
    })

    // Écouter les changements d'authentification
    supabase.auth.onAuthStateChange((event, session) => {
      user.value = session?.user ?? null
    })
  }

  return user
}
