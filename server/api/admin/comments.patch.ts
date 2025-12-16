import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // Récupérer le body de la requête
  const body = await readBody(event)
  const { commentId, action } = body
  
  if (!commentId || !action) {
    throw createError({
      statusCode: 400,
      statusMessage: 'commentId et action sont requis'
    })
  }
  
  if (!['approve', 'reject', 'delete'].includes(action)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Action invalide (approve, reject, ou delete)'
    })
  }
  
  // Connexion à Supabase avec la service role key
  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey || config.public.supabaseAnonKey
  )
  
  let result
  
  if (action === 'delete') {
    // Supprimer le commentaire
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
    
    if (error) throw error
    result = { message: 'Commentaire supprimé' }
  } else {
    // Approuver ou rejeter (modifier approved)
    const approved = action === 'approve'
    const { data, error } = await supabase
      .from('comments')
      .update({ approved })
      .eq('id', commentId)
      .select()
      .single()
    
    if (error) throw error
    result = { comment: data }
  }
  
  return {
    success: true,
    ...result
  }
})
