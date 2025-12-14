<template>
  <div>
    <!-- Fil d'ariane -->
    <nav class="mb-6 flex items-center gap-2 text-sm font-mono" aria-label="Fil d'ariane">
      <NuxtLink to="/" class="text-om-sepia dark:text-om-darkSepia hover:text-om-rust dark:hover:text-om-darkGold transition-colors">
        Accueil
      </NuxtLink>
      <Icon name="mdi:chevron-right" size="16" class="text-om-ink/40 dark:text-om-darkText/40" />
      <NuxtLink to="/tags" class="text-om-sepia dark:text-om-darkSepia hover:text-om-rust dark:hover:text-om-darkGold transition-colors">
        Catégories
      </NuxtLink>
      <Icon name="mdi:chevron-right" size="16" class="text-om-ink/40 dark:text-om-darkText/40" />
      <span class="text-om-ink/60 dark:text-om-darkText/60 capitalize">{{ normalizedTag }}</span>
    </nav>

    <!-- En-tête de la catégorie -->
    <header class="mb-12 pb-8 border-b-2 border-om-sepia/30 dark:border-om-darkGold/30">
      <div class="flex items-center gap-3 mb-4">
        <Icon name="mdi:tag" size="32" class="text-om-rust dark:text-om-darkGold" />
        <h1 class="font-serif text-4xl md:text-5xl font-black text-om-dark dark:text-om-darkText capitalize">
          {{ normalizedTag }}
        </h1>
      </div>
      
      <p class="text-om-ink/70 dark:text-om-darkText/70 font-sans text-lg">
        {{ articlesCount }} {{ articlesCount > 1 ? 'articles' : 'article' }} dans cette catégorie
      </p>
    </header>

    <!-- Liste des articles -->
    <div v-if="filteredArticles && filteredArticles.length > 0" class="space-y-8">
      <article v-for="article in filteredArticles" :key="article.id" 
        class="group relative border-2 border-om-dark dark:border-om-darkGold bg-om-paper dark:bg-om-darkPaper p-8 transition-all hover:-translate-y-1 hover:shadow-retro-hover shadow-retro cursor-pointer">
        
        <NuxtLink :to="`/blog/${article.slug}`" class="absolute inset-0 z-10" />

        <div class="flex justify-between items-start mb-4 gap-4">
          <div class="flex gap-2 flex-wrap">
            <TagBadge v-for="tag in article.tags" :key="tag" :tag="tag" size="sm" />
          </div>
          <time class="font-mono text-xs text-om-rust dark:text-om-darkGold font-bold whitespace-nowrap">
            {{ new Date(article.date).toLocaleDateString('fr-FR', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            }) }}
          </time>
        </div>

        <h2 class="font-serif text-2xl font-bold mb-3 text-om-dark dark:text-om-darkText group-hover:text-om-sepia dark:group-hover:text-om-darkSepia transition-colors">
          {{ article.title }}
        </h2>
        
        <p class="font-sans text-om-ink/80 dark:text-om-darkText/80 leading-relaxed line-clamp-3">
          {{ article.description }}
        </p>
      </article>
    </div>

    <!-- Aucun article trouvé -->
    <div v-else class="text-center py-20 border-2 border-dashed border-om-rust/30 dark:border-om-darkGold/30 bg-om-paperDark dark:bg-om-darkPaper">
      <Icon name="mdi:alert-circle-outline" size="64" class="text-om-rust dark:text-om-darkGold mb-4" />
      <h2 class="font-serif text-2xl font-bold mb-4 text-om-dark dark:text-om-darkText">Aucun article trouvé</h2>
      <p class="text-om-ink/70 dark:text-om-darkText/70 mb-8">
        Aucun article n'a été trouvé pour le tag "{{ normalizedTag }}"
      </p>
      <NuxtLink to="/tags" 
        class="inline-block px-6 py-3 bg-om-gold dark:bg-om-darkGold text-white font-mono uppercase text-sm tracking-wider hover:bg-om-sepia dark:hover:bg-om-darkSepia transition-colors shadow-retro hover:shadow-retro-hover">
        Voir tous les tags
      </NuxtLink>
    </div>

    <!-- Navigation vers autres tags -->
    <div v-if="otherTags.length > 0" class="mt-16 pt-8 border-t-2 border-om-sepia/30 dark:border-om-darkGold/30">
      <h3 class="font-mono uppercase text-xs tracking-widest text-om-ink dark:text-om-darkText mb-4">
        Autres catégories
      </h3>
      <div class="flex flex-wrap gap-3">
        <TagBadge v-for="tag in otherTags" :key="tag" :tag="tag" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { articles: articlesAPI } = useSupabase()
const tagSlug = route.params.tag as string

// Dénormaliser le tag (de slug vers texte)
const normalizedTag = tagSlug
  .split('-')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ')

// Fonction pour slugifier (doit correspondre à TagBadge.vue)
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

// Filtrer les articles par tag
const filteredArticles = computed(() => {
  if (!allArticles.value) return []
  return allArticles.value.filter(article => 
    article.tags?.some((tag: string) => slugify(tag) === tagSlug)
  )
})

const articlesCount = computed(() => filteredArticles.value.length)

// Récupérer tous les autres tags
const otherTags = computed(() => {
  if (!allArticles.value) return []
  const allTags = new Set<string>()
  allArticles.value.forEach(article => {
    article.tags?.forEach((tag: string) => {
      if (slugify(tag) !== tagSlug) {
        allTags.add(tag)
      }
    })
  })
  return Array.from(allTags).sort()
})

// SEO optimization
const siteUrl = 'https://clementRbl.github.io/mon-blog-ia'
const pageUrl = `${siteUrl}/tags/${tagSlug}`

useHead({
  title: `${normalizedTag} - Articles et Ressources`,
  meta: [
    { name: 'description', content: `Découvrez ${articlesCount.value} article${articlesCount.value > 1 ? 's' : ''} sur ${normalizedTag} - Blog IA Engineering par Clément Reboul` },
    { name: 'keywords', content: `${normalizedTag}, IA, Intelligence Artificielle, Engineering, Blog Tech` },
    
    // OpenGraph
    { property: 'og:title', content: `${normalizedTag} - Articles` },
    { property: 'og:description', content: `${articlesCount.value} article${articlesCount.value > 1 ? 's' : ''} sur ${normalizedTag}` },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: pageUrl },
    
    // Twitter Card
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: `${normalizedTag} - Articles` },
    { name: 'twitter:description', content: `${articlesCount.value} article${articlesCount.value > 1 ? 's' : ''} sur ${normalizedTag}` },
    
  ],
  link: [
    { rel: 'canonical', href: pageUrl }
  ]
})

// Structured Data (JSON-LD) pour le SEO
useSchemaOrg([
  {
    '@type': 'CollectionPage',
    name: `Articles sur ${normalizedTag}`,
    description: `Collection d'articles sur ${normalizedTag}`,
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
          name: 'Tags',
          item: `${siteUrl}/tags`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: normalizedTag,
          item: pageUrl
        }
      ]
    }
  }
])
</script>
