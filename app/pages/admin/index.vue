<template>
  <div class="min-h-screen bg-om-paper">
    <!-- Loading initial -->
    <div v-if="initialLoading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-om-rust mx-auto mb-4"></div>
        <p class="font-mono text-om-ink/70">Chargement...</p>
      </div>
    </div>

    <!-- Contenu admin -->
    <div v-else>
    <!-- Header Admin -->
    <header class="bg-om-dark text-om-paper border-b-4 border-om-rust">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="font-serif text-2xl font-black">Dashboard Admin</h1>
        <div class="flex items-center gap-4">
          <span class="font-mono text-sm">{{ user?.email }}</span>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-om-rust text-white font-mono text-sm uppercase hover:bg-om-sepia transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Actions -->
      <div class="mb-8 flex justify-between items-center">
        <h2 class="font-serif text-3xl font-bold text-om-dark">Mes articles</h2>
        <NuxtLink
          to="/admin/articles/new"
          class="inline-flex items-center gap-2 px-6 py-3 bg-om-gold text-white font-mono uppercase text-sm tracking-wider hover:bg-om-sepia transition-colors shadow-retro hover:shadow-retro-hover"
        >
          <Icon name="mdi:plus" size="20" />
          Nouvel article
        </NuxtLink>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <p class="font-mono text-om-ink/70">Chargement...</p>
      </div>

      <!-- Liste des articles -->
      <div v-else-if="articles.length > 0" class="space-y-4">
        <div
          v-for="article in articles"
          :key="article.id"
          class="bg-white border-2 border-om-dark shadow-paper p-6 hover:shadow-paper-hover transition-shadow"
        >
          <div class="flex justify-between items-start gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="font-serif text-xl font-bold text-om-dark">
                  {{ article.title }}
                </h3>
                <span
                  v-if="article.published"
                  class="px-2 py-1 bg-green-100 text-green-800 text-xs font-mono uppercase"
                >
                  Publié
                </span>
                <span
                  v-else
                  class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-mono uppercase"
                >
                  Brouillon
                </span>
              </div>
              
              <p class="text-om-ink/70 text-sm mb-3">{{ article.description }}</p>
              
              <div class="flex gap-2 mb-3 flex-wrap">
                <TagBadge v-for="tag in article.tags" :key="tag" :tag="tag" />
              </div>
              
              <p class="font-mono text-xs text-om-ink/50">
                {{ new Date(article.date).toLocaleDateString('fr-FR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <NuxtLink
                :to="`/admin/articles/${article.id}`"
                class="px-4 py-2 bg-om-sepia text-white font-mono text-sm uppercase hover:bg-om-rust transition-colors"
              >
                Éditer
              </NuxtLink>
              <button
                @click="handleDelete(article.id)"
                class="px-4 py-2 bg-red-600 text-white font-mono text-sm uppercase hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Vide -->
      <div v-else class="text-center py-20">
        <Icon name="mdi:file-document-outline" size="64" class="text-om-ink/30 mb-4" />
        <p class="font-mono text-om-ink/70 mb-6">Aucun article pour le moment</p>
        <NuxtLink
          to="/admin/articles/new"
          class="inline-block px-6 py-3 bg-om-gold text-white font-mono uppercase text-sm tracking-wider hover:bg-om-sepia transition-colors shadow-retro"
        >
          Créer mon premier article
        </NuxtLink>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Protection de la route
definePageMeta({
  middleware: 'auth'
})

const { auth, articles: articlesAPI } = useSupabase()
const router = useRouter()

const user = ref<any>(null)
const articles = ref<any[]>([])
const loading = ref(true)
const initialLoading = ref(true)

// Charger les données au montage
onMounted(async () => {
  const { data } = await auth.getUser()
  user.value = data.user
  await loadArticles()
  initialLoading.value = false
})

const loadArticles = async () => {
  loading.value = true
  try {
    const { data, error } = await articlesAPI.getAll()
    if (error) throw error
    articles.value = data || []
  } catch (e) {
    console.error('Erreur lors du chargement des articles:', e)
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  await auth.signOut()
  router.push('/admin/login')
}

const handleDelete = async (id: string) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return
  
  try {
    const { error } = await articlesAPI.delete(id)
    if (error) throw error
    await loadArticles()
  } catch (e) {
    console.error('Erreur lors de la suppression:', e)
    alert('Erreur lors de la suppression')
  }
}

// SEO
useHead({
  title: 'Dashboard Admin - Blog IA Engineering',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
