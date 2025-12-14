<template>
  <div>
    <!-- Fil d'ariane -->
    <nav class="mb-6 flex items-center gap-2 text-sm font-mono" aria-label="Fil d'ariane">
      <NuxtLink to="/" class="text-om-sepia dark:text-om-darkSepia hover:text-om-rust dark:hover:text-om-darkGold transition-colors">
        Accueil
      </NuxtLink>
      <Icon name="mdi:chevron-right" size="16" class="text-om-ink/40 dark:text-om-darkText/40" />
      <span class="text-om-ink/60 dark:text-om-darkText/60">Catégories</span>
    </nav>

    <!-- En-tête -->
    <header class="mb-12 pb-8 border-b-2 border-om-sepia/30 dark:border-om-darkGold/30">
      <div class="flex items-center gap-3 mb-4">
        <Icon name="mdi:tag-multiple" size="40" class="text-om-rust dark:text-om-darkGold" />
        <h1 class="font-serif text-4xl md:text-5xl font-black text-om-dark dark:text-om-darkText">
          Catégories
        </h1>
      </div>
      
      <p class="text-om-ink/70 dark:text-om-darkText/70 font-sans text-lg">
        Explorez {{ tagsWithCount.length }} catégories et {{ totalArticles }} articles
      </p>
    </header>

    <!-- Grille des tags -->
    <div v-if="tagsWithCount.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink 
        v-for="{ tag, count, slug } in tagsWithCount" 
        :key="slug"
        :to="`/tags/${slug}`"
        class="group relative border-2 border-om-dark dark:border-om-darkGold bg-om-paper dark:bg-om-darkPaper p-6 transition-all hover:-translate-y-1 hover:shadow-retro-hover shadow-retro">
        
        <div class="flex items-start justify-between mb-3">
          <h2 class="font-serif text-2xl font-bold text-om-dark dark:text-om-darkText group-hover:text-om-sepia dark:group-hover:text-om-darkSepia transition-colors capitalize">
            {{ tag }}
          </h2>
          <Icon name="mdi:arrow-right" size="24" class="text-om-rust dark:text-om-darkGold group-hover:translate-x-1 transition-transform" />
        </div>
        
        <p class="font-mono text-sm text-om-ink/70 dark:text-om-darkText/70">
          {{ count }} {{ count > 1 ? 'articles' : 'article' }}
        </p>
      </NuxtLink>
    </div>

    <!-- Aucun tag -->
    <div v-else class="text-center py-20 border-2 border-dashed border-om-rust/30 dark:border-om-darkGold/30 bg-om-paperDark dark:bg-om-darkPaper">
      <Icon name="mdi:tag-off" size="64" class="text-om-rust dark:text-om-darkGold mb-4" />
      <p class="text-om-ink/70 dark:text-om-darkText/70">Aucune catégorie disponible pour le moment.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { articles: articlesAPI } = useSupabase()

// Fonction pour slugifier
const slugify = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Récupérer tous les articles depuis Supabase
const allArticles = ref([])
try {
  const { data, error } = await articlesAPI.getPublished()
  if (error) {
    console.error('Erreur lors du chargement des articles:', error)
  } else {
    allArticles.value = data || []
  }
} catch (e) {
  console.error('Erreur lors du chargement des articles:', e)
}

// Calculer les tags avec leur nombre d'articles
const tagsWithCount = computed(() => {
  if (!allArticles.value) return []
  
  const tagMap = new Map<string, number>()
  
  allArticles.value.forEach(article => {
    article.tags?.forEach((tag: string) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    })
  })
  
  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({
      tag,
      count,
      slug: slugify(tag)
    }))
    .sort((a, b) => b.count - a.count) // Trier par nombre d'articles décroissant
})

const totalArticles = computed(() => allArticles.value?.length || 0)

// SEO optimization
const siteUrl = 'https://clementRbl.github.io/mon-blog-ia'
const pageUrl = `${siteUrl}/tags`

useHead({
  title: 'Catégories - Blog IA Engineering',
  meta: [
    { name: 'description', content: `Explorez ${tagsWithCount.value.length} catégories d'articles sur l'intelligence artificielle, le machine learning et l'ingénierie IA par Clément Reboul` },
    { name: 'keywords', content: 'IA, Intelligence Artificielle, Machine Learning, Deep Learning, NLP, Catégories, Tags, Blog Tech' },
    
    // OpenGraph
    { property: 'og:title', content: 'Catégories - Blog IA Engineering' },
    { property: 'og:description', content: `${tagsWithCount.value.length} catégories pour explorer l'univers de l'IA` },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: pageUrl },
    
    // Twitter Card
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'Catégories - Blog IA Engineering' },
    { name: 'twitter:description', content: `${tagsWithCount.value.length} catégories d'articles IA` },
  ],
  link: [
    { rel: 'canonical', href: pageUrl }
  ]
})

// Structured Data (JSON-LD)
useSchemaOrg([
  {
    '@type': 'CollectionPage',
    name: 'Catégories - Blog IA Engineering',
    description: 'Toutes les catégories d\'articles sur l\'intelligence artificielle',
    url: pageUrl,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Accueil',
          item: siteUrl
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Catégories',
          item: pageUrl
        }
      ]
    }
  }
])
</script>
