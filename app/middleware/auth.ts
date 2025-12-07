export default defineNuxtRouteMiddleware(async (to, from) => {
  // Si on va vers /admin/login, on laisse passer
  if (to.path === '/admin/login' || to.path === '/mon-blog-ia/admin/login') {
    return
  }

  // Côté client uniquement
  if (process.client) {
    // Vérifier si l'utilisateur est authentifié
    const { auth } = useSupabase()
    const { data } = await auth.getUser()

    // Si pas authentifié, rediriger vers login
    if (!data.user) {
      return navigateTo('/admin/login')
    }
  }
})
