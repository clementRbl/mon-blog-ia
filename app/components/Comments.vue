<template>
  <section class="mt-16 pt-8 border-t-2 border-om-sepia/30 dark:border-om-darkGold/30">
    <!-- En-tête -->
    <div class="flex items-center justify-between mb-8">
      <h2 class="font-serif text-2xl md:text-3xl font-bold text-om-dark dark:text-om-darkText flex items-center gap-3">
        <Icon name="mdi:comment-multiple" size="28" class="text-om-rust dark:text-om-darkGold" />
        Commentaires
        <span v-if="comments.length > 0" class="text-lg text-om-rust dark:text-om-darkGold font-mono">
          ({{ comments.length }})
        </span>
      </h2>
    </div>

    <!-- Formulaire d'ajout -->
    <div class="mb-8 p-6 bg-om-paperDark dark:bg-om-darkPaper border-2 border-om-dark dark:border-om-darkGold">
      <h3 class="font-mono text-sm uppercase tracking-wider text-om-ink dark:text-om-darkText mb-4">
        Laisser un commentaire
      </h3>
      
      <form @submit.prevent="handleSubmit">
        <!-- Nom (optionnel) -->
        <div class="mb-4">
          <label for="author-name" class="block font-mono text-xs uppercase text-om-ink/70 dark:text-om-darkText/70 mb-2">
            Nom (optionnel)
          </label>
          <input
            id="author-name"
            v-model="authorName"
            type="text"
            placeholder="Anonyme"
            class="w-full px-4 py-2 border-2 border-om-sepia/30 dark:border-om-darkGold/30 bg-om-paper dark:bg-om-darkBg text-om-dark dark:text-om-darkText placeholder-om-ink/40 dark:placeholder-om-darkText/40 font-sans focus:outline-none focus:ring-2 focus:ring-om-rust dark:focus:ring-om-darkGold transition-all"
          />
        </div>

        <!-- Contenu -->
        <div class="mb-4">
          <label for="comment-content" class="block font-mono text-xs uppercase text-om-ink/70 dark:text-om-darkText/70 mb-2">
            Commentaire <span class="text-om-rust dark:text-om-darkGold">*</span>
          </label>
          <textarea
            id="comment-content"
            v-model="content"
            rows="4"
            placeholder="Votre commentaire..."
            required
            class="w-full px-4 py-2 border-2 border-om-sepia/30 dark:border-om-darkGold/30 bg-om-paper dark:bg-om-darkBg text-om-dark dark:text-om-darkText placeholder-om-ink/40 dark:placeholder-om-darkText/40 font-sans focus:outline-none focus:ring-2 focus:ring-om-rust dark:focus:ring-om-darkGold transition-all resize-none"
          ></textarea>
          <p class="text-xs text-om-ink/60 dark:text-om-darkText/60 font-mono mt-2">
            {{ content.length }}/1000 caractères
          </p>
        </div>

        <!-- Message de succès -->
        <div v-if="showSuccessMessage" class="mb-4 p-3 bg-om-gold/10 dark:bg-om-darkGold/10 border-2 border-om-gold dark:border-om-darkGold text-om-dark dark:text-om-darkText text-sm">
          <Icon name="mdi:check-circle" size="16" class="inline mr-2 text-om-gold dark:text-om-darkGold" />
          Commentaire envoyé ! Il sera visible après modération.
        </div>

        <!-- Message d'erreur -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-om-rust/10 border-2 border-om-rust text-om-rust text-sm">
          <Icon name="mdi:alert-circle" size="16" class="inline mr-2" />
          {{ errorMessage }}
        </div>

        <!-- Bouton -->
        <button
          type="submit"
          :disabled="isSubmitting || content.trim().length === 0 || content.length > 1000"
          class="px-6 py-3 bg-om-rust dark:bg-om-darkGold text-white dark:text-om-darkBg font-mono uppercase text-sm tracking-wider border-2 border-om-rust dark:border-om-darkGold hover:bg-om-sepia dark:hover:bg-om-darkSepia hover:border-om-sepia dark:hover:border-om-darkSepia transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-retro hover:shadow-retro-hover"
        >
          <Icon v-if="isSubmitting" name="mdi:loading" size="16" class="inline mr-2 animate-spin" />
          {{ isSubmitting ? 'Envoi...' : 'Envoyer' }}
        </button>
      </form>
    </div>

    <!-- Liste des commentaires -->
    <div v-if="isLoading" class="text-center py-12">
      <Icon name="mdi:loading" size="32" class="animate-spin text-om-rust dark:text-om-darkGold" />
      <p class="mt-4 text-om-ink/60 dark:text-om-darkText/60 font-mono text-sm">
        Chargement des commentaires...
      </p>
    </div>

    <div v-else-if="comments.length === 0" class="text-center py-12 border-2 border-dashed border-om-sepia/30 dark:border-om-darkGold/30 bg-om-paperDark dark:bg-om-darkPaper">
      <Icon name="mdi:comment-off-outline" size="48" class="text-om-sepia dark:text-om-darkSepia mb-4" />
      <p class="text-om-ink/60 dark:text-om-darkText/60 font-mono text-sm">
        Aucun commentaire pour le moment. Soyez le premier à commenter !
      </p>
    </div>

    <div v-else class="space-y-6">
      <article
        v-for="comment in comments"
        :key="comment.id"
        class="p-6 bg-om-paper dark:bg-om-darkPaper border-2 border-om-sepia/30 dark:border-om-darkGold/30"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
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
          </div>
        </div>

        <!-- Contenu -->
        <p class="text-om-dark dark:text-om-darkText leading-relaxed whitespace-pre-wrap">
          {{ comment.content }}
        </p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  articleId: string
}>()

const { comments, isLoading, loadComments, subscribeToComments, unsubscribe, addComment } = useComments(props.articleId)

const authorName = ref('')
const content = ref('')
const isSubmitting = ref(false)
const showSuccessMessage = ref(false)
const errorMessage = ref('')

// Charger les commentaires au montage
onMounted(async () => {
  await loadComments()
  subscribeToComments()
})

// Se désabonner au démontage
onBeforeUnmount(() => {
  unsubscribe()
})

// Rate limiting avec localStorage
const canSubmitComment = () => {
  if (!process.client) return true
  
  const lastCommentTime = localStorage.getItem(`last-comment-${props.articleId}`)
  if (!lastCommentTime) return true
  
  const now = Date.now()
  const timeSinceLastComment = now - parseInt(lastCommentTime)
  const ONE_MINUTE = 60 * 1000
  
  return timeSinceLastComment > ONE_MINUTE
}

const getTimeUntilNextComment = () => {
  if (!process.client) return 0
  
  const lastCommentTime = localStorage.getItem(`last-comment-${props.articleId}`)
  if (!lastCommentTime) return 0
  
  const now = Date.now()
  const timeSinceLastComment = now - parseInt(lastCommentTime)
  const ONE_MINUTE = 60 * 1000
  
  const remaining = ONE_MINUTE - timeSinceLastComment
  return Math.ceil(remaining / 1000) // en secondes
}

// Soumettre le commentaire
const handleSubmit = async () => {
  if (content.value.trim().length === 0 || content.value.length > 1000) return

  // Vérifier le rate limiting
  if (!canSubmitComment()) {
    const seconds = getTimeUntilNextComment()
    errorMessage.value = `Veuillez attendre ${seconds} secondes avant de commenter à nouveau.`
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''
  showSuccessMessage.value = false

  const result = await addComment(content.value, authorName.value)

  if (result.success) {
    // Enregistrer le timestamp
    if (process.client) {
      localStorage.setItem(`last-comment-${props.articleId}`, Date.now().toString())
    }
    
    // Réinitialiser le formulaire
    content.value = ''
    authorName.value = ''
    showSuccessMessage.value = true

    // Masquer le message après 5 secondes
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 5000)
  } else {
    errorMessage.value = 'Erreur lors de l\'envoi du commentaire. Veuillez réessayer.'
  }

  isSubmitting.value = false
}

// Formater la date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'À l\'instant'
  if (diffMins < 60) return `Il y a ${diffMins} min`
  if (diffHours < 24) return `Il y a ${diffHours}h`
  if (diffDays < 7) return `Il y a ${diffDays}j`
  
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  })
}
</script>
