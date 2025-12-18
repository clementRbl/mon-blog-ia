export default defineNuxtRouteMiddleware(async (to, from) => {
  // Si on va vers /admin/login, on laisse passer
  if (to.path === '/admin/login' || to.path === '/mon-blog-ia/admin/login') {
    return
  }

  // Côté client uniquement
  if (process.client) {
    // Vérifier si l'utilisateur est authentifié
    const { auth, client } = useSupabase()
    const { data: { session } } = await auth.getSession()

    // Si pas authentifié, rediriger vers login
    if (!session?.user) {
      return navigateTo('/admin/login')
    }

    // Vérifier le rôle admin directement dans la base de données
    const { data: userRole, error: roleError } = await client
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (roleError) {
      console.error('[Auth Middleware] Error fetching role:', roleError)
      return navigateTo('/')
    }

    console.log('[Auth Middleware] User role:', userRole?.role, 'for user:', session.user.id)

    // Si pas admin, rediriger vers la page d'accueil
    if (!userRole || userRole.role !== 'admin') {
      console.warn('[Auth Middleware] Access denied - not admin')
      return navigateTo('/')
    }
    
    console.log('[Auth Middleware] Access granted - user is admin')
  }
})
