<template>
  <div class="min-h-screen bg-om-paper">
    <!-- Loading initial -->
    <div v-if="initialLoading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-om-rust mx-auto mb-4"></div>
        <p class="font-mono text-om-ink/70">Chargement...</p>
      </div>
    </div>

    <!-- Contenu -->
    <div v-else>
    <!-- Header -->
    <header class="bg-om-dark text-om-paper border-b-4 border-om-rust">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="font-serif text-2xl font-black">
          {{ isNew ? 'Nouvel article' : 'Éditer l\'article' }}
        </h1>
        <NuxtLink
          to="/admin"
          class="px-4 py-2 bg-om-rust text-white font-mono text-sm uppercase hover:bg-om-sepia transition-colors"
        >
          ← Retour
        </NuxtLink>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-4 py-8">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Titre -->
        <div>
          <label class="block font-mono text-sm uppercase tracking-wider text-om-dark mb-2">
            Titre *
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full px-4 py-3 border-2 border-om-dark focus:outline-none focus:ring-2 focus:ring-om-rust font-sans"
            placeholder="Le titre de votre article"
          />
        </div>

        <!-- Slug -->
        <div>
          <label class="block font-mono text-sm uppercase tracking-wider text-om-dark mb-2">
            Slug * <span class="text-xs text-om-ink/60">(URL de l'article)</span>
          </label>
          <input
            v-model="form.slug"
            type="text"
            required
            pattern="[a-z0-9\-]+"
            class="w-full px-4 py-3 border-2 border-om-dark focus:outline-none focus:ring-2 focus:ring-om-rust font-mono"
            placeholder="mon-article-ia"
          />
          <p class="text-xs text-om-ink/60 mt-1 font-mono">
            Uniquement minuscules, chiffres et tirets
          </p>
        </div>

        <!-- Description -->
        <div>
          <label class="block font-mono text-sm uppercase tracking-wider text-om-dark mb-2">
            Description *
          </label>
          <textarea
            v-model="form.description"
            required
            rows="3"
            class="w-full px-4 py-3 border-2 border-om-dark focus:outline-none focus:ring-2 focus:ring-om-rust font-sans"
            placeholder="Résumé de votre article (pour le SEO et les cartes)"
          ></textarea>
        </div>

        <!-- Tags -->
        <div>
          <label class="block font-mono text-sm uppercase tracking-wider text-om-dark mb-2">
            Tags
          </label>
          
          <!-- Tags sélectionnés -->
          <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-2 mb-3">
            <span
              v-for="tag in selectedTags"
              :key="tag"
              class="inline-flex items-center gap-2 px-3 py-1 bg-om-gold text-white font-mono text-sm"
            >
              {{ tag }}
              <button
                type="button"
                @click="removeTag(tag)"
                class="hover:text-om-rust"
              >
                ×
              </button>
            </span>
          </div>

          <!-- Select existants -->
          <select
            v-model="selectedTagFromList"
            @change="addTagFromList"
            class="w-full px-4 py-3 border-2 border-om-dark focus:outline-none focus:ring-2 focus:ring-om-rust font-sans mb-2"
          >
            <option value="">Sélectionner un tag existant...</option>
            <option v-for="tag in availableTags" :key="tag" :value="tag">
              {{ tag }}
            </option>
          </select>

          <!-- Ajout manuel -->
          <div class="flex gap-2">
            <input
              v-model="newTagInput"
              type="text"
              placeholder="Ou créer un nouveau tag..."
              class="flex-1 px-4 py-3 border-2 border-om-dark focus:outline-none focus:ring-2 focus:ring-om-rust font-sans"
              @keyup.enter="addNewTag"
            />
            <button
              type="button"
              @click="addNewTag"
              class="px-4 sm:px-6 py-3 bg-om-sepia text-white font-mono uppercase text-xs sm:text-sm hover:bg-om-rust transition-colors whitespace-nowrap"
            >
              Ajouter
            </button>
          </div>
        </div>

        <!-- Date -->
        <div>
          <label class="block font-mono text-sm uppercase tracking-wider text-om-dark mb-2">
            Date de publication *
          </label>
          <input
            v-model="form.date"
            type="datetime-local"
            required
            class="w-full px-4 py-3 border-2 border-om-dark focus:outline-none focus:ring-2 focus:ring-om-rust font-mono"
          />
        </div>

        <!-- Contenu Markdown -->
        <div>
          <label class="block font-mono text-sm uppercase tracking-wider text-om-dark mb-2">
            Contenu Markdown *
          </label>
          <textarea
            v-model="form.content"
            required
            rows="20"
            class="w-full px-4 py-3 border-2 border-om-dark focus:outline-none focus:ring-2 focus:ring-om-rust font-mono text-sm"
            placeholder="# Votre contenu en Markdown

Écrivez votre article ici en utilisant la syntaxe Markdown...

## Sous-titre

Paragraphe avec **gras** et *italique*."
          ></textarea>
        </div>

        <!-- Publié -->
        <div class="flex items-center gap-3">
          <input
            v-model="form.published"
            type="checkbox"
            id="published"
            class="w-5 h-5 border-2 border-om-dark text-om-gold focus:ring-2 focus:ring-om-rust"
          />
          <label for="published" class="font-mono text-sm uppercase tracking-wider text-om-dark">
            Publier l'article
          </label>
        </div>

        <!-- Message d'erreur -->
        <div v-if="error" class="p-4 bg-red-50 border-2 border-red-500 text-red-700 text-sm">
          {{ error }}
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 px-6 py-3 bg-om-gold text-white font-mono uppercase text-sm tracking-wider hover:bg-om-sepia transition-colors shadow-retro hover:shadow-retro-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Enregistrement...' : (isNew ? 'Créer l\'article' : 'Mettre à jour') }}
          </button>
          <button
            v-if="!isNew"
            type="button"
            @click="previewArticle"
            class="px-6 py-3 bg-om-rust text-white font-mono uppercase text-sm tracking-wider hover:bg-om-sepia transition-colors shadow-retro hover:shadow-retro-hover flex items-center justify-center gap-2"
          >
            <Icon name="mdi:eye" size="20" />
            Prévisualiser
          </button>
          <NuxtLink
            to="/admin"
            class="px-6 py-3 bg-gray-300 text-om-dark font-mono uppercase text-sm tracking-wider hover:bg-gray-400 transition-colors text-center flex items-center justify-center"
          >
            Annuler
          </NuxtLink>
        </div>
      </form>
    </div>
    </div>

    <!-- Modal de prévisualisation -->
    <ArticlePreviewModal
      :is-open="showPreview"
      :article="previewData"
      @close="closePreview"
    />
  </div>
</template>

<script setup lang="ts">
// Protection de la route
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { auth, articles: articlesAPI } = useSupabase()

const isNew = computed(() => route.params.id === 'new')
const articleId = computed(() => route.params.id as string)

// Fonction pour obtenir l'heure locale correcte
function getCurrentDateTime() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const form = ref({
  title: '',
  slug: '',
  description: '',
  content: '',
  date: getCurrentDateTime(),
  published: false
})

// Tags
const availableTags = ref<string[]>([])
const selectedTags = ref<string[]>([])
const selectedTagFromList = ref('')
const newTagInput = ref('')
const loading = ref(false)
const initialLoading = ref(true)
const error = ref('')

// Charger tous les tags existants depuis les articles
const loadAvailableTags = async () => {
  try {
    const { data: articles } = await articlesAPI.getAll()
    if (articles) {
      // Extraire tous les tags uniques de tous les articles
      const allTags = new Set<string>()
      articles.forEach(article => {
        if (article.tags && Array.isArray(article.tags)) {
          article.tags.forEach(tag => allTags.add(tag))
        }
      })
      // Convertir en tableau et trier alphabétiquement
      availableTags.value = Array.from(allTags).sort((a, b) => a.localeCompare(b, 'fr'))
    }
  } catch (e) {
    console.error('Erreur lors du chargement des tags:', e)
    // Liste par défaut en cas d'erreur
    availableTags.value = ['IA', 'Machine Learning', 'Deep Learning', 'NLP', 'Technologie']
  }
}

// Gestion des tags
const addTagFromList = () => {
  if (selectedTagFromList.value && !selectedTags.value.includes(selectedTagFromList.value)) {
    selectedTags.value.push(selectedTagFromList.value)
  }
  selectedTagFromList.value = ''
}

const addNewTag = () => {
  const tag = newTagInput.value.trim()
  if (tag && !selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag)
    if (!availableTags.value.includes(tag)) {
      availableTags.value.push(tag)
      // Trier la liste alphabétiquement après l'ajout
      availableTags.value.sort((a, b) => a.localeCompare(b, 'fr'))
    }
  }
  newTagInput.value = ''
}

const removeTag = (tag: string) => {
  selectedTags.value = selectedTags.value.filter(t => t !== tag)
}

// Charger les données au montage
onMounted(async () => {
  // Charger la liste des tags disponibles
  await loadAvailableTags()
  
  // Charger l'article si on édite
  if (!isNew.value) {
    await loadArticle()
  }
  initialLoading.value = false
})

// Charger l'article existant
const loadArticle = async () => {
  try {
    const { data, error: loadError } = await articlesAPI.getAll()
    if (loadError) throw loadError
    
    const article = data?.find(a => a.id === articleId.value)
    if (!article) {
      router.push('/admin')
      return
    }

    const articleDate = new Date(article.date)
    const year = articleDate.getFullYear()
    const month = String(articleDate.getMonth() + 1).padStart(2, '0')
    const day = String(articleDate.getDate()).padStart(2, '0')
    const hours = String(articleDate.getHours()).padStart(2, '0')
    const minutes = String(articleDate.getMinutes()).padStart(2, '0')
    
    form.value = {
      title: article.title,
      slug: article.slug,
      description: article.description,
      content: article.content,
      date: `${year}-${month}-${day}T${hours}:${minutes}`,
      published: article.published
    }
    selectedTags.value = [...article.tags]
    originalPublishedState.value = article.published
  } catch (e) {
    console.error('Erreur lors du chargement:', e)
    error.value = 'Impossible de charger l\'article'
  }
}

// Soumettre le formulaire
const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    // Préparer les données
    const tags = selectedTags.value

    const articleData = {
      ...form.value,
      tags,
      date: new Date(form.value.date).toISOString()
    }

    const wasPublished = !isNew.value && originalPublishedState.value
    const willBePublished = articleData.published

    if (isNew.value) {
      // Créer un nouvel article
      const { error: createError } = await articlesAPI.create(articleData)
      if (createError) throw createError
      
      // Si l'article est publié dès sa création, envoyer la notification
      if (willBePublished) {
        await sendPushNotification(articleData)
      }
    } else {
      // Mettre à jour l'article existant
      const { error: updateError } = await articlesAPI.update(articleId.value, articleData)
      if (updateError) throw updateError
      
      // Si l'article passe de non-publié à publié, envoyer la notification
      if (!wasPublished && willBePublished) {
        await sendPushNotification(articleData)
      }
    }

    router.push('/admin')
  } catch (e: any) {
    console.error('Erreur lors de la sauvegarde:', e)
    error.value = e.message || 'Une erreur est survenue lors de la sauvegarde'
  } finally {
    loading.value = false
  }
}

// Envoyer une notification push aux abonnés
const sendPushNotification = async (article: any) => {
  try {
    const { supabase } = useSupabase()
    const config = useRuntimeConfig()
    
    // Appeler la Edge Function Supabase
    const { data, error } = await supabase.functions.invoke('clever-handler', {
      body: {
        title: '📰 Nouvel article publié !',
        message: article.title,
        url: `${config.public.siteUrl}/blog/${article.slug}`
      }
    })
    
    if (error) throw error
  } catch (error) {
    // Erreur silencieuse, ne pas bloquer la publication
  }
}

// Garder l'état initial de publication pour détecter les changements
const originalPublishedState = ref(false)

// Modal de prévisualisation
const showPreview = ref(false)
const previewData = computed(() => ({
  ...form.value,
  tags: selectedTags.value,
  id: articleId.value
}))

const previewArticle = () => {
  showPreview.value = true
}

const closePreview = () => {
  showPreview.value = false
}

// Générer automatiquement le slug à partir du titre
watch(() => form.value.title, (newTitle) => {
  if (isNew.value && !form.value.slug) {
    form.value.slug = newTitle
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
})

// SEO
useHead({
  title: `${isNew.value ? 'Nouvel article' : 'Éditer l\'article'} - Admin`,
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
