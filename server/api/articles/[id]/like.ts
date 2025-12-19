// API pour gérer les likes d'un article
export default defineEventHandler(async (event) => {
  const articleId = getRouterParam(event, 'id')
  const method = event.method
  
  if (!articleId) {
    throw createError({
      statusCode: 400,
      message: 'Article ID requis'
    })
  }

  // Utiliser le client anon pour les requêtes publiques (GET)
  // et récupérer le token depuis les headers pour les requêtes authentifiées
  const supabaseClient = getSupabaseClient()
  
  // Récupérer le token depuis les cookies pour les requêtes authentifiées
  const authToken = getCookie(event, 'sb-auth-token')
  let session = null
  
  if (authToken) {
    try {
      const authData = JSON.parse(authToken)
      if (authData.access_token) {
        const { data: { user } } = await supabaseClient.auth.getUser(authData.access_token)
        if (user) {
          session = { user, access_token: authData.access_token }
        }
      }
    } catch (e) {
      console.error('Error parsing auth token:', e)
    }
  }
  
  // GET: Récupérer le nombre de likes et si l'utilisateur a liké
  if (method === 'GET') {
    const user = session?.user
    
    // Compter les likes
    const { count, error: countError } = await supabaseClient
      .from('user_likes')
      .select('*', { count: 'exact', head: true })
      .eq('article_id', articleId)
    
    if (countError) {
      throw createError({
        statusCode: 500,
        message: 'Erreur lors de la récupération des likes'
      })
    }
    
    let userHasLiked = false
    
    // Si l'utilisateur est connecté, vérifier s'il a liké
    if (user) {
      const { data: userLike } = await supabaseClient
        .from('user_likes')
        .select('id')
        .eq('article_id', articleId)
        .eq('user_id', user.id)
        .single()
      
      userHasLiked = !!userLike
    }
    
    return {
      likes: count || 0,
      userHasLiked
    }
  }
  
  // POST/DELETE: Toggle like (nécessite authentification)
  if (method === 'POST' || method === 'DELETE') {
    const user = session?.user
    
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Vous devez être connecté pour liker'
      })
    }
    
    if (method === 'POST') {
      // Ajouter un like
      const { error } = await supabaseClient
        .from('user_likes')
        .insert({
          user_id: user.id,
          article_id: articleId
        })
      
      if (error) {
        // Si erreur de contrainte unique (déjà liké), on ignore
        if (error.code === '23505') {
          return { success: true, liked: true }
        }
        throw createError({
          statusCode: 500,
          message: 'Erreur lors de l\'ajout du like'
        })
      }
      
      return { success: true, liked: true }
    }
    
    if (method === 'DELETE') {
      // Retirer un like
      const { error } = await supabaseClient
        .from('user_likes')
        .delete()
        .eq('user_id', user.id)
        .eq('article_id', articleId)
      
      if (error) {
        throw createError({
          statusCode: 500,
          message: 'Erreur lors de la suppression du like'
        })
      }
      
      return { success: true, liked: false }
    }
  }
  
  throw createError({
    statusCode: 405,
    message: 'Méthode non autorisée'
  })
})
