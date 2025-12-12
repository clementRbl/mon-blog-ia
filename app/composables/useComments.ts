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
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('article_id', articleId)
        .eq('approved', true)
        .order('created_at', { ascending: true })

      if (error) throw error
      comments.value = data || []
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

  // Ajouter un commentaire
  const addComment = async (content: string, authorName?: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          article_id: articleId,
          content: content.trim(),
          author_name: authorName?.trim() || null,
          approved: false // En attente de modération
        })
        .select()
        .single()

      if (error) throw error

      // Récupérer le titre de l'article pour la notification
      const { data: articleData } = await supabase
        .from('articles')
        .select('title')
        .eq('id', articleId)
        .single()

      // Envoyer une notification push à l'admin via Supabase Edge Function
      try {
        const config = useRuntimeConfig()
        const supabaseUrl = config.public.supabaseUrl.replace(/\/+$/, '')
        const supabaseKey = config.public.supabaseAnonKey
        
        await $fetch(`${supabaseUrl}/functions/v1/notify-admin-comment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: {
            articleTitle: articleData?.title || 'Article inconnu',
            commentAuthor: authorName?.trim() || 'Anonyme',
            commentContent: content.trim().substring(0, 100)
          }
        })
      } catch (notifError) {
        console.error('Erreur envoi notification:', notifError)
        // Ne pas bloquer si la notification échoue
      }

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
