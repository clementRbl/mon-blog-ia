<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- Section fixe (non-scrollable) -->
    <div class="flex-shrink-0">
      <h1 class="sr-only">Blog IA Engineering - Articles sur l'Intelligence Artificielle par Clément Reboul</h1>
      <section class="mb-8 border-l-4 border-om-gold pl-6 py-2" aria-label="Citation d'introduction">
        <blockquote class="font-serif text-3xl md:text-4xl italic leading-tight mb-4 text-om-dark">
          "L'IA n'est pas de la magie, c'est des mathématiques et du code."
        </blockquote>
      </section>

      <!-- Navigation des catégories -->
      <section v-if="popularTags && popularTags.length > 0" class="mb-8 p-6 bg-om-paperDark border-2 border-om-sepia/30" aria-label="Catégories populaires">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-mono uppercase text-xs tracking-widest text-om-ink flex items-center gap-2">
            <Icon name="mdi:tag-multiple" size="16" aria-hidden="true" />
            Catégories populaires
          </h2>
          <NuxtLink to="/tags" 
            class="font-mono text-xs uppercase text-om-sepia hover:text-om-rust transition-colors flex items-center gap-1"
            aria-label="Voir toutes les catégories d'articles">
            Voir tout
            <Icon name="mdi:arrow-right" size="14" aria-hidden="true" />
          </NuxtLink>
        </div>
        <nav class="flex flex-wrap gap-2" aria-label="Navigation des tags populaires">
          <TagBadge v-for="tag in popularTags" :key="tag" :tag="tag" />
        </nav>
      </section>

      <h2 class="font-mono uppercase text-xs tracking-widest text-om-ink border-b-2 border-om-sepia/30 pb-2 mb-6">
        Dernières publications
      </h2>
    </div>

    <!-- Section scrollable (liste des articles) -->
    <div class="flex-1 overflow-y-auto pr-2" role="feed" aria-label="Liste des derniers articles publiés">
      <div v-if="articles && articles.length > 0" class="space-y-8">
        <article v-for="article in articles" :key="article.id" 
          class="group relative border-2 border-om-dark bg-om-paper p-8 transition-all hover:-translate-y-1 hover:shadow-retro-hover shadow-retro cursor-pointer"
          :aria-label="`Article: ${article.title}`">
          
          <NuxtLink :to="`/blog/${article.slug}`" class="absolute inset-0 z-10" :aria-label="`Lire l'article: ${article.title}`"></NuxtLink>

          <div class="flex justify-between items-start mb-4 gap-4">
            <div class="flex gap-2 flex-wrap relative z-20" role="list" aria-label="Tags de l'article">
              <TagBadge v-for="tag in article.tags" :key="tag" :tag="tag" size="sm" />
            </div>
            <div class="text-right">
              <time class="font-mono text-xs text-om-rust font-bold whitespace-nowrap block" :datetime="new Date(article.date).toISOString()">
                {{ new Date(article.date).toLocaleDateString('fr-FR') }}
              </time>
              <span v-if="article.reading_time" class="font-mono text-xs text-om-ink/60 flex items-center justify-end gap-1 mt-1">
                <Icon name="mdi:clock-outline" size="14" aria-hidden="true" />
                {{ article.reading_time }} min
              </span>
            </div>
          </div>

          <h3 class="font-serif text-2xl font-bold mb-3 text-om-dark group-hover:text-om-sepia transition-colors">
            {{ article.title }}
          </h3>
          
          <p class="font-sans text-om-ink/80 leading-relaxed line-clamp-3">
            {{ article.description }}
          </p>
        </article>
      </div>

      <div v-else class="text-center py-12 border-2 border-dashed border-om-gold/50 rounded bg-om-paperDark">
        <Icon name="mdi:text-box-edit-outline" size="48" class="text-om-gold mb-4" />
        <p class="font-mono text-om-dark">Aucun article trouvé.</p>
        <p class="text-sm mt-2 text-gray-500">Connectez-vous à /admin pour créer votre premier article</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { articles: articlesAPI } = useSupabase()

// Récupération des articles depuis Supabase
const { data: articles } = await useAsyncData('blog', async () => {
  try {
    const { data, error } = await articlesAPI.getPublished()
    if (error) {
      console.error('Erreur lors du chargement des articles:', error)
      return []
    }
    return data || []
  } catch (e) {
    // En cas d'erreur (ex: prerender sans Supabase), retourner tableau vide
    console.warn('Supabase non disponible, mode dégradé:', e)
    return []
  }
})

// Calculer les tags les plus populaires
const popularTags = computed(() => {
  if (!articles.value || articles.value.length === 0) return []
  
  const tagMap = new Map<string, number>()
  
  articles.value.forEach(article => {
    if (article.tags && Array.isArray(article.tags)) {
      article.tags.forEach((tag: string) => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
      })
    }
  })
  
  return Array.from(tagMap.entries())
    .sort((a, b) => b[1] - a[1]) // Trier par fréquence
    .slice(0, 6) // Prendre les 6 premiers
    .map(([tag]) => tag)
})

// SEO pour la page d'accueil
const siteUrl = 'https://clementRbl.github.io/mon-blog-ia'
const articlesCount = computed(() => articles.value?.length || 0)

useHead({
  title: 'Blog IA Engineering - Clément Reboul | Articles & Ressources sur l\'Intelligence Artificielle',
  meta: [
    { name: 'description', content: `Blog personnel sur l'intelligence artificielle, le machine learning et l'ingénierie IA. Découvrez ${articlesCount.value} articles, tutoriels et réflexions sur l'IA par Clément Reboul.` },
    { name: 'keywords', content: 'IA, Intelligence Artificielle, Machine Learning, Deep Learning, NLP, Computer Vision, Engineering, Blog Tech, Clément Reboul, Autonome, Vision, Transport' },
    { name: 'author', content: 'Clément Reboul' },
    
    // OpenGraph
    { property: 'og:title', content: 'Blog IA Engineering - Clément Reboul' },
    { property: 'og:description', content: 'Blog personnel sur l\'IA et le machine learning - Articles et tutoriels' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: siteUrl },
    { property: 'og:locale', content: 'fr_FR' },
    { property: 'og:site_name', content: 'Blog IA Engineering' },
    
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Blog IA Engineering - Clément Reboul' },
    { name: 'twitter:description', content: 'Articles et ressources sur l\'intelligence artificielle, le machine learning et l\'ingénierie IA' },
    { name: 'twitter:creator', content: '@clementRbl' },
  ],
  link: [
    { rel: 'canonical', href: siteUrl },
    { rel: 'alternate', type: 'application/rss+xml', title: 'Blog IA Engineering RSS Feed', href: `${siteUrl}/feed.xml` }
  ]
})

// Structured Data (JSON-LD)
useSchemaOrg([
  {
    '@type': 'Blog',
    name: 'Blog IA Engineering',
    description: 'Blog personnel sur l\'intelligence artificielle et le machine learning',
    url: siteUrl,
    author: {
      '@type': 'Person',
      name: 'Clément Reboul',
      url: siteUrl,
      sameAs: ['https://github.com/clementRbl'],
      jobTitle: 'IA Engineer'
    },
    inLanguage: 'fr-FR',
    keywords: 'IA, Intelligence Artificielle, Machine Learning, Deep Learning, Blog Tech',
    blogPost: articles.value?.slice(0, 5).map(article => ({
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.description,
      datePublished: new Date(article.date).toISOString(),
      url: `${siteUrl}/blog/${article.slug}`,
      author: {
        '@type': 'Person',
        name: 'Clément Reboul'
      }
    })) || []
  },
  {
    '@type': 'WebSite',
    name: 'Blog IA Engineering - Clément Reboul',
    url: siteUrl,
    description: 'Blog personnel sur l\'intelligence artificielle et le machine learning',
    inLanguage: 'fr-FR',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/tags/{search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  }
])
</script>