<template>
  <div>
    <div class="mb-8">
      <h1 class="font-serif text-3xl md:text-4xl font-black text-om-dark dark:text-om-darkText mb-4">
        Modération des commentaires
      </h1>
      <p class="text-om-ink/70 dark:text-om-darkText/70">
        {{ stats.pending }} en attente • {{ stats.approved }} approuvés • {{ stats.total }} total
      </p>
    </div>

    <!-- Filtres -->
    <div class="flex gap-4 mb-8 flex-wrap">
      <button
        v-for="filter in filters"
        :key="filter.value"
        @click="currentFilter = filter.value"
        class="px-4 py-2 font-mono text-sm uppercase tracking-wider border-2 transition-all"
        :class="currentFilter === filter.value 
          ? 'bg-om-rust dark:bg-om-darkGold text-white dark:text-om-darkBg border-om-rust dark:border-om-darkGold' 
          : 'bg-om-paper dark:bg-om-darkPaper text-om-dark dark:text-om-darkText border-om-sepia/30 dark:border-om-darkGold/30 hover:border-om-rust dark:hover:border-om-darkGold'"
      >
        {{ filter.label }}
        <span v-if="filter.value === 'pending'" class="ml-2 px-2 py-0.5 bg-white dark:bg-om-darkBg text-om-rust dark:text-om-darkGold rounded-full text-xs font-bold">
          {{ stats.pending }}
        </span>
      </button>
    </div>

    <!-- Liste des commentaires -->
    <div v-if="isLoading" class="text-center py-12">
      <Icon name="mdi:loading" size="32" class="animate-spin text-om-rust dark:text-om-darkGold" />
      <p class="mt-4 text-om-ink/60 dark:text-om-darkText/60 font-mono text-sm">
        Chargement des commentaires...
      </p>
    </div>

    <div v-else-if="filteredComments.length === 0" class="text-center py-12 border-2 border-dashed border-om-sepia/30 dark:border-om-darkGold/30 bg-om-paperDark dark:bg-om-darkPaper">
      <Icon name="mdi:comment-off-outline" size="48" class="text-om-sepia dark:text-om-darkSepia mb-4" />
      <p class="text-om-ink/60 dark:text-om-darkText/60 font-mono text-sm">
        Aucun commentaire {{ currentFilter === 'pending' ? 'en attente' : currentFilter === 'approved' ? 'approuvé' : '' }}
      </p>
    </div>

    <div v-else class="space-y-4">
      <article
        v-for="comment in filteredComments"
        :key="comment.id"
        class="p-6 border-2 border-om-dark dark:border-om-darkGold bg-om-paper dark:bg-om-darkPaper"
        :class="comment.approved ? 'opacity-60' : ''"
      >
        <!-- En-tête -->
        <div class="flex items-start justify-between mb-4 gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 rounded-full bg-om-gold dark:bg-om-darkGold flex items-center justify-center">
                <Icon name="mdi:account" size="24" class="text-white dark:text-om-darkBg" />
              </div>
              <div>
                <p class="font-mono text-sm font-bold text-om-dark dark:text-om-darkText">
                  {{ comment.author_name || 'Anonyme' }}
                </p>
                <time class="text-xs text-om-ink/60 dark:text-om-darkText/60 font-mono">
                  {{ formatDate(comment.created_at) }}
                </time>
              </div>
              <span
                v-if="comment.approved"
                class="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500 text-xs font-mono uppercase"
              >
                Approuvé
              </span>
              <span
                v-else
                class="px-2 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500 text-xs font-mono uppercase"
              >
                En attente
              </span>
            </div>
            
            <!-- Article lié -->
            <p class="text-xs text-om-ink/60 dark:text-om-darkText/60 mb-2">
              Sur l'article : <span class="font-bold">{{ getArticleTitle(comment.article_id) }}</span>
            </p>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <button
              v-if="!comment.approved"
              @click="approveComment(comment.id)"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-mono text-xs uppercase tracking-wider transition-colors"
              title="Approuver"
            >
              <Icon name="mdi:check" size="18" />
            </button>
            <button
              v-if="comment.approved"
              @click="unapproveComment(comment.id)"
              class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-mono text-xs uppercase tracking-wider transition-colors"
              title="Retirer l'approbation"
            >
              <Icon name="mdi:close" size="18" />
            </button>
            <button
              @click="deleteComment(comment.id)"
              class="px-4 py-2 bg-om-rust hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider transition-colors"
              title="Supprimer"
            >
              <Icon name="mdi:delete" size="18" />
            </button>
          </div>
        </div>

        <!-- Contenu du commentaire -->
        <div class="p-4 bg-om-paperDark dark:bg-om-darkBg border-l-4 border-om-sepia dark:border-om-darkSepia">
          <p class="text-om-dark dark:text-om-darkText leading-relaxed whitespace-pre-wrap">
            {{ comment.content }}
          </p>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { supabase } = useSupabase()
const comments = ref<any[]>([])
const articles = ref<any[]>([])
const isLoading = ref(true)
const currentFilter = ref<'all' | 'pending' | 'approved'>('pending')

const filters = [
  { label: 'En attente', value: 'pending' },
  { label: 'Approuvés', value: 'approved' },
  { label: 'Tous', value: 'all' }
]

// Charger les commentaires et articles
const loadData = async () => {
  isLoading.value = true
  try {
    // Charger tous les commentaires (admin peut tout voir)
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false })

    if (commentsError) throw commentsError
    comments.value = commentsData || []

    // Charger les articles pour afficher les titres
    const { data: articlesData, error: articlesError } = await supabase
      .from('articles')
      .select('id, title')

    if (articlesError) throw articlesError
    articles.value = articlesData || []
  } catch (error) {
    console.error('Erreur chargement données:', error)
  } finally {
    isLoading.value = false
  }
}

// Statistiques
const stats = computed(() => ({
  total: comments.value.length,
  pending: comments.value.filter(c => !c.approved).length,
  approved: comments.value.filter(c => c.approved).length
}))

// Commentaires filtrés
const filteredComments = computed(() => {
  if (currentFilter.value === 'pending') {
    return comments.value.filter(c => !c.approved)
  } else if (currentFilter.value === 'approved') {
    return comments.value.filter(c => c.approved)
  }
  return comments.value
})

// Obtenir le titre de l'article
const getArticleTitle = (articleId: string) => {
  const article = articles.value.find(a => a.id === articleId)
  return article?.title || 'Article inconnu'
}

// Approuver un commentaire
const approveComment = async (commentId: string) => {
  try {
    const { error } = await supabase
      .from('comments')
      .update({ approved: true })
      .eq('id', commentId)

    if (error) throw error

    // Mettre à jour localement
    const comment = comments.value.find(c => c.id === commentId)
    if (comment) comment.approved = true
  } catch (error) {
    console.error('Erreur approbation:', error)
    alert('Erreur lors de l\'approbation')
  }
}

// Retirer l'approbation
const unapproveComment = async (commentId: string) => {
  try {
    const { error } = await supabase
      .from('comments')
      .update({ approved: false })
      .eq('id', commentId)

    if (error) throw error

    // Mettre à jour localement
    const comment = comments.value.find(c => c.id === commentId)
    if (comment) comment.approved = false
  } catch (error) {
    console.error('Erreur retrait approbation:', error)
    alert('Erreur lors du retrait de l\'approbation')
  }
}

// Supprimer un commentaire
const deleteComment = async (commentId: string) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) return

  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)

    if (error) throw error

    // Retirer localement
    comments.value = comments.value.filter(c => c.id !== commentId)
  } catch (error) {
    console.error('Erreur suppression:', error)
    alert('Erreur lors de la suppression')
  }
}

// Formater la date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Charger au montage
onMounted(() => {
  loadData()
})
</script>
