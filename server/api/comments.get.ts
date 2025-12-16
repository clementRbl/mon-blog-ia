import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const articleId = query.articleId
  
  if (!articleId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'articleId manquant'
    })
  }
  
  // Connexion à Supabase
  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey
  )
  
  // Récupérer uniquement les commentaires approuvés (triés du plus récent au plus ancien)
  const { data, error } = await supabase
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
  
  return {
    success: true,
    comments: data || []
  }
})
