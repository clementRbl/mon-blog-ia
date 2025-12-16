export default defineNuxtRouteMiddleware(async (to, from) => {
  // Si on va vers /admin/login, on laisse passer
  if (to.path === '/admin/login' || to.path === '/mon-blog-ia/admin/login') {
    return
  }

  // Côté client uniquement
  if (process.client) {
    // Vérifier si l'utilisateur est authentifié
    const { auth } = useSupabase()
    const { data: { session } } = await auth.getSession()

    // Si pas authentifié, rediriger vers login
    if (!session?.user) {
      return navigateTo('/admin/login')
    }

    // Vérifier le rôle admin depuis le JWT
    const decodeJWT = (token: string) => {
      try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
        return JSON.parse(jsonPayload)
      } catch (e) {
        return null
      }
    }

    const decoded = decodeJWT(session.access_token)
    const userRole = decoded?.user_role || 'user'

    // Si pas admin, rediriger vers la page d'accueil
    if (userRole !== 'admin') {
      return navigateTo('/')
    }
  }
})
