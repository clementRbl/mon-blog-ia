// Composable pour gérer les likes avec temps réel
export const useLikes = (articleId: string) => {
  const { supabase } = useSupabase()
  const user = useSupabaseUser()
  
  const likesCount = ref(0)
  const userHasLiked = ref(false)
  const loading = ref(false)
  
  // Charger l'état initial des likes
  const loadLikes = async () => {
    try {
      // Compter les likes
      const { count } = await supabase
        .from('user_likes')
        .select('*', { count: 'exact', head: true })
        .eq('article_id', articleId)
      
      likesCount.value = count || 0
      
      // Vérifier si l'utilisateur a liké
      if (user.value) {
        const { data } = await supabase
          .from('user_likes')
          .select('id')
          .eq('article_id', articleId)
          .eq('user_id', user.value.id)
          .maybeSingle() // maybeSingle() au lieu de single() pour gérer le cas où il n'y a pas de résultat
        
        userHasLiked.value = !!data
      }
    } catch (error) {
      console.error('Erreur chargement likes:', error)
    }
  }
  
  // Toggle like/dislike
  const toggleLike = async () => {
    if (!user.value) {
      // Si non connecté, on pourrait ouvrir le modal de connexion
      const { success } = useVintageToast()
      success('Connectez-vous pour liker cet article !')
      return
    }
    
    if (loading.value) return
    
    loading.value = true
    const previousState = userHasLiked.value
    const previousCount = likesCount.value
    
    // Optimistic update
    userHasLiked.value = !previousState
    likesCount.value += previousState ? -1 : 1
    
    try {
      if (previousState) {
        // Retirer le like (dislike)
        const { error } = await supabase
          .from('user_likes')
          .delete()
          .eq('user_id', user.value.id)
          .eq('article_id', articleId)
        
        if (error) throw error
      } else {
        // Ajouter un like
        const { error } = await supabase
          .from('user_likes')
          .insert({
            user_id: user.value.id,
            article_id: articleId
          })
        
        if (error) throw error
      }
    } catch (error: any) {
      // Rollback en cas d'erreur
      userHasLiked.value = previousState
      likesCount.value = previousCount
      console.error('Erreur toggle like:', error)
      const { success } = useVintageToast()
      success('Erreur lors du like')
    } finally {
      loading.value = false
    }
  }
  
  // Écouter les changements en temps réel (quand d'autres users likent)
  if (process.client) {
    const channel = supabase
      .channel(`article-likes-${articleId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_likes',
          filter: `article_id=eq.${articleId}`
        },
        (payload) => {
          // Recharger le count depuis le serveur
          loadLikes()
        }
      )
      .subscribe()
    
    // Cleanup
    onUnmounted(() => {
      supabase.removeChannel(channel)
    })
  }
  
  // Charger au montage
  onMounted(() => {
    loadLikes()
  })
  
  return {
    likesCount,
    userHasLiked,
    loading,
    toggleLike
  }
}
