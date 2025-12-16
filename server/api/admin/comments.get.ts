import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const articleId = query.articleId
  
  // Connexion à Supabase avec la service role key pour voir tous les commentaires
  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey || config.public.supabaseAnonKey
  )
  
  let queryBuilder = supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false })
  
  // Filtrer par article si fourni
  if (articleId) {
    queryBuilder = queryBuilder.eq('article_id', articleId)
  }
  
  const { data, error } = await queryBuilder
  
  if (error) {
    console.error('Erreur Supabase:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des commentaires'
    })
  }
  
  return {
    success: true,
    comments: data || []
  }
})
