import filter from 'leo-profanity'

export default defineEventHandler(async (event) => {
  
  // Configuration du filtre multi-langues
  // Charge les dictionnaires français, anglais, espagnol
  filter.loadDictionary('fr')
  filter.add(filter.getDictionary('en')) // Anglais
  filter.add(filter.getDictionary('es')) // Espagnol
  
  // Récupérer le body de la requête
  const body = await readBody(event)
  const { articleId, authorName, content } = body
  
  // Validation basique
  if (!articleId || !authorName || !content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Données manquantes'
    })
  }
  
  // Vérifier la longueur du nom
  if (authorName.length < 2 || authorName.length > 50) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le nom doit contenir entre 2 et 50 caractères'
    })
  }
  
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
  
  // Modération : détection de profanités dans le nom
  if (filter.check(authorName)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le nom d\'auteur contient du contenu inapproprié'
    })
  }
  
  // Connexion à Supabase avec la service role key (bypass RLS, pooling réutilisé)
  const supabase = getSupabaseServiceClient()
  
  // Insérer le commentaire dans la base de données
  // approved=true car leo-profanity a déjà validé le contenu
  const { data, error } = await supabase
    .from('comments')
    .insert({
      article_id: articleId,
      author_name: authorName,
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
        commentAuthor: authorName,
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
