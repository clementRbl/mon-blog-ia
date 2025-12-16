// API pour mettre à jour le profil utilisateur (display_name)
export default defineEventHandler(async (event) => {
  // Vérifier l'authentification
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Non authentifié'
    })
  }

  const supabaseClient = getSupabaseClient()
  const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
    authHeader.replace('Bearer ', '')
  )
  
  if (authError || !user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Session invalide'
    })
  }

  // Récupérer le nouveau display_name
  const body = await readBody(event)
  const { displayName } = body

  if (!displayName || typeof displayName !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'displayName requis'
    })
  }

  // Valider le display_name
  const trimmedName = displayName.trim()
  if (trimmedName.length < 2 || trimmedName.length > 50) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le nom doit contenir entre 2 et 50 caractères'
    })
  }

  // Pas de profanités
  // @ts-ignore - leo-profanity n'a pas de types officiels
  const filter = (await import('leo-profanity')).default
  filter.loadDictionary('fr')
  filter.add(filter.getDictionary('en'))
  
  if (filter.check(trimmedName)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le nom contient du contenu inapproprié'
    })
  }

  // Mettre à jour dans user_roles
  const supabase = getSupabaseServiceClient()
  const { error: updateError } = await supabase
    .from('user_roles')
    .update({ display_name: trimmedName })
    .eq('user_id', user.id)

  if (updateError) {
    console.error('Erreur update display_name:', updateError)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la mise à jour du profil'
    })
  }

  return {
    success: true,
    displayName: trimmedName
  }
})
