import filter from 'leo-profanity'

export default defineEventHandler(async (event) => {
  
  // Configuration du filtre multi-langues
  // Charge les dictionnaires français, anglais, espagnol
  filter.loadDictionary('fr')
  filter.add(filter.getDictionary('en')) // Anglais
  filter.add(filter.getDictionary('es')) // Espagnol
  
  // Vérifier l'authentification
  const supabaseClient = getSupabaseClient()
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Vous devez être connecté pour commenter'
    })
  }
  
  // Récupérer l'utilisateur depuis le token
  const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
    authHeader.replace('Bearer ', '')
  )
  
  if (authError || !user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Session invalide. Veuillez vous reconnecter.'
    })
  }
  
  // Récupérer le body de la requête
  const body = await readBody(event)
  const { articleId, content } = body
  
  // Validation basique
  if (!articleId || !content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Données manquantes'
    })
  }
  
  // Récupérer le display_name depuis user_roles
  const supabase = getSupabaseServiceClient()
  const { data: userRole, error: roleError } = await supabase
    .from('user_roles')
    .select('display_name')
    .eq('user_id', user.id)
    .single()
  
  if (roleError || !userRole?.display_name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Veuillez définir votre nom d\'affichage dans votre profil avant de commenter'
    })
  }
  
  const finalAuthorName = userRole.display_name
  
  // Vérifier la longueur du contenu
  if (content.length < 3 || content.length > 2000) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le commentaire doit contenir entre 3 et 2000 caractères'
    })
  }
  
  // Modération : détection de profanités dans le contenu
  if (filter.check(content)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Votre commentaire contient du contenu inapproprié'
    })
  }
  
  // Insérer le commentaire dans la base de données
  // approved=true car leo-profanity a déjà validé le contenu
  const { data, error } = await supabase
    .from('comments')
    .insert({
      article_id: articleId,
      author_name: finalAuthorName,
      author_email: user.email, // Stocker l'email de l'utilisateur authentifié
      user_id: user.id, // Stocker l'ID de l'utilisateur pour liaison future
      content,
      approved: true, // Approuvé automatiquement après filtrage leo-profanity
      created_at: new Date().toISOString()
    })
    .select()
    .single()
  
  if (error) {
    console.error('Erreur Supabase:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de l\'enregistrement du commentaire'
    })
  }
  
  // Récupérer le titre de l'article pour la notification
  const { data: articleData } = await supabase
    .from('articles')
    .select('title')
    .eq('id', articleId)
    .single()
  
  // Envoyer une notification à l'admin (en arrière-plan, ne pas bloquer)
  try {
    await $fetch('/api/notify-admin-comment', {
      method: 'POST',
      body: {
        articleTitle: articleData?.title || 'Article inconnu',
        commentAuthor: finalAuthorName,
        commentContent: content.substring(0, 100)
      }
    })
  } catch (notifError) {
    console.error('Erreur notification admin:', notifError)
    // Ne pas bloquer si la notification échoue
  }
  
  return {
    success: true,
    comment: data
  }
})
