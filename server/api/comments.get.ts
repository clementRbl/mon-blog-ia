export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const articleId = query.articleId
  
  if (!articleId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'articleId manquant'
    })
  }
  
  // Connexion à Supabase (pooling réutilisé)
  const supabase = getSupabaseClient()
  
  // Récupérer uniquement les commentaires approuvés (triés du plus récent au plus ancien)
  const { data: comments, error } = await supabase
    .from('comments')
    .select('*')
    .eq('article_id', articleId)
    .eq('approved', true)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Erreur Supabase:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des commentaires'
    })
  }

  // Récupérer les avatars des utilisateurs (si commentaires existent)
  if (comments && comments.length > 0) {
    const userIds = [...new Set(comments.map(c => c.user_id).filter(Boolean))]
    
    if (userIds.length > 0) {
      // Utiliser le service client pour bypasser les RLS policies
      const supabaseService = getSupabaseServiceClient()
      const { data: userRoles, error: avatarError } = await supabaseService
        .from('user_roles')
        .select('user_id, avatar_url')
        .in('user_id', userIds)
      
      if (avatarError) {
        console.error('Erreur récupération avatars:', avatarError)
      }
      
      // Enrichir les commentaires avec les avatars
      if (userRoles && userRoles.length > 0) {
        const avatarMap = new Map(userRoles.map(ur => [ur.user_id, ur.avatar_url]))
        comments.forEach(comment => {
          if (comment.user_id) {
            comment.avatar_url = avatarMap.get(comment.user_id) || null
          }
        })
      }
    }
  }
  
  return {
    success: true,
    comments: comments || []
  }
})
