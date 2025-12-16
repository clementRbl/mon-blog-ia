import type { RealtimeChannel } from '@supabase/supabase-js'

export const useComments = (articleId: string) => {
  const { supabase } = useSupabase()
  const comments = useState<any[]>(`comments-${articleId}`, () => [])
  const isLoading = useState<boolean>(`comments-loading-${articleId}`, () => false)
  const realtimeChannel = useState<RealtimeChannel | null>(`comments-channel-${articleId}`, () => null)

  // Charger les commentaires approuvés
  const loadComments = async () => {
    isLoading.value = true
    try {
      const response = await $fetch(`/api/comments?articleId=${articleId}`)
      comments.value = response.comments || []
    } catch (error) {
      console.error('Erreur chargement commentaires:', error)
      comments.value = []
    } finally {
      isLoading.value = false
    }
  }

  // S'abonner aux nouveaux commentaires en temps réel
  const subscribeToComments = () => {
    if (realtimeChannel.value) return

    realtimeChannel.value = supabase
      .channel(`comments-${articleId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `article_id=eq.${articleId}`
        },
        (payload: any) => {
          // Ajouter le nouveau commentaire s'il est approuvé
          if (payload.new && payload.new.approved) {
            comments.value.push(payload.new)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'comments',
          filter: `article_id=eq.${articleId}`
        },
        (payload: any) => {
          // Mettre à jour le commentaire si approuvé
          if (payload.new && payload.new.approved) {
            const index = comments.value.findIndex(c => c.id === payload.new.id)
            if (index !== -1) {
              comments.value[index] = payload.new
            } else {
              comments.value.push(payload.new)
            }
          }
        }
      )
      .subscribe()
  }

  // Se désabonner
  const unsubscribe = () => {
    if (realtimeChannel.value) {
      supabase.removeChannel(realtimeChannel.value)
      realtimeChannel.value = null
    }
  }

  // Ajouter un commentaire via l'API serveur (modération automatique)
  const addComment = async (content: string) => {
    try {
      // Récupérer le token de session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Vous devez être connecté pour commenter')
      }

      const response = await $fetch('/api/comments', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`
        },
        body: {
          articleId,
          content: content.trim()
        }
      })

      if (!response.success) throw new Error('Erreur lors de l\'ajout du commentaire')
      
      const data = response.comment

      // La notification admin est gérée côté serveur automatiquement
      return { success: true, data }
    } catch (error) {
      console.error('Erreur ajout commentaire:', error)
      return { success: false, error }
    }
  }

  return {
    comments,
    isLoading,
    loadComments,
    subscribeToComments,
    unsubscribe,
    addComment
  }
}
