// Endpoint sécurisé pour sauvegarder une subscription push
// L'email est automatiquement récupéré depuis la session auth
// Impossible pour un client de falsifier son email

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  try {
    const body = await readBody(event)
    const { endpoint, p256dh, auth } = body

    if (!endpoint || !p256dh || !auth) {
      throw createError({
        statusCode: 400,
        message: 'Données de subscription manquantes'
      })
    }

    // Récupérer l'email depuis la session Supabase (sécurisé, non falsifiable)
    const authHeader = getHeader(event, 'authorization')
    let userEmail: string | null = null

    if (authHeader) {
      const supabase = getSupabaseClient()
      const token = authHeader.replace('Bearer ', '')
      const { data: { user }, error } = await supabase.auth.getUser(token)
      
      if (!error && user) {
        userEmail = user.email || null
      }
    }

    // Sauvegarder la subscription avec l'email (pooling réutilisé)
    const supabaseAdmin = getSupabaseServiceClient()

    // Vérifier si la subscription existe déjà
    const { data: existing } = await supabaseAdmin
      .from('push_subscriptions')
      .select('id')
      .eq('endpoint', endpoint)
      .single()

    if (existing) {
      // Mettre à jour avec le nouvel email si connecté
      const { error } = await supabaseAdmin
        .from('push_subscriptions')
        .update({
          p256dh,
          auth,
          user_email: userEmail,
          enabled: true
        })
        .eq('endpoint', endpoint)

      if (error) throw error
    } else {
      // Créer nouvelle subscription
      const { error } = await supabaseAdmin
        .from('push_subscriptions')
        .insert({
          endpoint,
          p256dh,
          auth,
          user_email: userEmail,
          enabled: true
        })

      if (error) throw error
    }

    return { success: true, userEmail }
  } catch (error) {
    console.error('Erreur sauvegarde subscription:', error)
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la sauvegarde de la subscription'
    })
  }
})
