<template>
  <div>
    <section class="mb-16 border-l-4 border-om-gold pl-6 py-2">
      <h2 class="font-serif text-3xl md:text-4xl italic leading-tight mb-4 text-om-dark">
        "L'IA n'est pas de la magie, c'est des mathématiques et du code."
      </h2>
    </section>

    <!-- Navigation des catégories -->
    <section v-if="popularTags.length > 0" class="mb-12 p-6 bg-om-paperDark border-2 border-om-sepia/30">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-mono uppercase text-xs tracking-widest text-om-ink flex items-center gap-2">
          <Icon name="mdi:tag-multiple" size="16" />
          Catégories populaires
        </h3>
        <NuxtLink to="/tags" 
          class="font-mono text-xs uppercase text-om-sepia hover:text-om-rust transition-colors flex items-center gap-1">
          Voir tout
          <Icon name="mdi:arrow-right" size="14" />
        </NuxtLink>
      </div>
      <div class="flex flex-wrap gap-2">
        <TagBadge v-for="tag in popularTags" :key="tag" :tag="tag" />
      </div>
    </section>

    <section class="space-y-8">
      <h3 class="font-mono uppercase text-xs tracking-widest text-om-ink border-b-2 border-om-sepia/30 pb-2">
        Dernières publications
      </h3>

      <div v-if="articles && articles.length" class="space-y-8">
        <article v-for="article in articles" :key="article.path" 
          class="group relative border-2 border-om-dark bg-om-paper p-8 transition-all hover:-translate-y-1 hover:shadow-retro-hover shadow-retro cursor-pointer">
          
          <NuxtLink :to="article.path" class="absolute inset-0 z-10"></NuxtLink>

          <div class="flex justify-between items-start mb-4 gap-4">
            <div class="flex gap-2 flex-wrap relative z-20">
              <TagBadge v-for="tag in article.tags" :key="tag" :tag="tag" size="sm" />
            </div>
            <time class="font-mono text-xs text-om-rust font-bold whitespace-nowrap">
              {{ new Date(article.date).toLocaleDateString('fr-FR') }}
            </time>
          </div>

          <h2 class="font-serif text-2xl font-bold mb-3 text-om-dark group-hover:text-om-sepia transition-colors">
            {{ article.title }}
          </h2>
          
          <p class="font-sans text-om-ink/80 leading-relaxed line-clamp-3">
            {{ article.description }}
          </p>
        </article>
      </div>

      <div v-else class="text-center py-12 border-2 border-dashed border-om-gold/50 rounded bg-om-paperDark">
        <Icon name="mdi:text-box-edit-outline" size="48" class="text-om-gold mb-4" />
        <p class="font-mono text-om-dark">Aucun article trouvé.</p>
        <p class="text-sm mt-2 text-gray-500">Ajoutez un fichier .md dans content/blog/</p>
      </div>

    </section>
  </div>
</template>

<script setup lang="ts">
// Récupération des articles via Nuxt Content v3
const { data: articles } = await useAsyncData('blog', async () => {
  const items = await queryCollection('blog').all()
  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

// Calculer les tags les plus populaires
const popularTags = computed(() => {
  if (!articles.value) return []
  
  const tagMap = new Map<string, number>()
  
  articles.value.forEach(article => {
    article.tags?.forEach((tag: string) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    })
  })
  
  return Array.from(tagMap.entries())
    .sort((a, b) => b[1] - a[1]) // Trier par fréquence
    .slice(0, 6) // Prendre les 6 premiers
    .map(([tag]) => tag)
})

// SEO pour la page d'accueil
const siteUrl = 'https://clementRbl.github.io/mon-blog-ia'

useHead({
  title: 'Blog IA Engineering - Clément Reboul',
  meta: [
    { name: 'description', content: 'Blog personnel sur l\'intelligence artificielle, le machine learning et l\'ingénierie IA. Découvrez des articles, tutoriels et réflexions sur l\'IA par Clément Reboul.' },
    { name: 'keywords', content: 'IA, Intelligence Artificielle, Machine Learning, Deep Learning, NLP, Engineering, Blog, Clément Reboul' },
    
    // OpenGraph
    { property: 'og:title', content: 'Blog IA Engineering - Clément Reboul' },
    { property: 'og:description', content: 'Blog personnel sur l\'IA et le machine learning' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: siteUrl },
    
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Blog IA Engineering - Clément Reboul' },
    { name: 'twitter:description', content: 'Articles et ressources sur l\'intelligence artificielle' },
  ],
  link: [
    { rel: 'canonical', href: siteUrl }
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
      url: siteUrl
    },
    inLanguage: 'fr-FR'
  }
])
</script>