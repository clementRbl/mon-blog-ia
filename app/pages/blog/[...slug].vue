<template>
  <div>
    <article v-if="article" class="max-w-3xl mx-auto">
      <!-- Bouton retour -->
      <div class="mb-6">
        <NuxtLink to="/" 
          class="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-om-sepia hover:text-om-rust transition-colors group">
          <Icon name="mdi:arrow-left" size="20" class="group-hover:-translate-x-1 transition-transform" />
          Retour au journal
        </NuxtLink>
      </div>

      <!-- En-tête de l'article -->
      <header class="mb-12 pb-8 border-b-2 border-om-dark">
        <div class="flex gap-2 mb-4 flex-wrap">
          <TagBadge v-for="tag in article.tags" :key="tag" :tag="tag" />
        </div>
        
        <h1 class="font-serif text-4xl md:text-5xl font-black mb-4 leading-tight text-om-dark">
          {{ article.title }}
        </h1>
        
        <div class="flex items-center gap-4 text-sm text-om-ink/70">
          <time class="font-mono text-om-rust font-bold">
            {{ new Date(article.date).toLocaleDateString('fr-FR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) }}
          </time>
        </div>
      </header>

      <!-- Contenu de l'article -->
      <div class="prose prose-lg max-w-none
        prose-headings:font-serif prose-headings:font-bold prose-headings:text-om-dark
        prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
        prose-p:text-om-ink/90 prose-p:leading-relaxed prose-p:font-sans
        prose-a:text-om-sepia prose-a:underline prose-a:decoration-2 prose-a:underline-offset-2 hover:prose-a:text-om-rust
        prose-code:bg-om-paperDark prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-om-ink
        prose-pre:bg-om-paperDark prose-pre:border-2 prose-pre:border-om-sepia prose-pre:shadow-paper
        prose-blockquote:border-l-4 prose-blockquote:border-om-rust prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-om-ink/80
        prose-img:border-2 prose-img:border-om-dark prose-img:shadow-paper
        prose-strong:text-om-dark prose-strong:font-bold
        prose-ul:text-om-ink/90 prose-ol:text-om-ink/90 prose-li:text-om-ink/90">
        <ContentRenderer :value="article" />
      </div>
    </article>

    <!-- Erreur 404 -->
    <div v-else class="text-center py-20">
      <Icon name="mdi:alert-circle-outline" size="64" class="text-om-rust mb-4" />
      <h1 class="font-serif text-3xl font-bold mb-4 text-om-dark">Article introuvable</h1>
      <p class="text-om-ink/70 mb-8">Cet article n'existe pas ou a été supprimé.</p>
      <NuxtLink to="/" 
        class="inline-block px-6 py-3 bg-om-gold text-white font-mono uppercase text-sm tracking-wider hover:bg-om-sepia transition-colors shadow-retro hover:shadow-retro-hover">
        Retour à l'accueil
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string[]

// Récupérer l'article
const { data: article } = await useAsyncData(`blog-${slug?.join('/')}`, async () => {
  try {
    const path = `/blog/${slug?.join('/')}`
    return await queryCollection('blog').path(path).first()
  } catch (error) {
    return null
  }
})

// SEO complet pour les articles
const siteUrl = 'https://clementRbl.github.io/mon-blog-ia'
const articleUrl = computed(() => article.value ? `${siteUrl}${article.value.path}` : '')

if (article.value) {
  const publishedDate = new Date(article.value.date).toISOString()
  const keywords = article.value.tags?.join(', ') || ''
  
  useHead({
    title: `${article.value.title} - Blog IA Engineering`,
    meta: [
      { name: 'description', content: article.value.description },
      { name: 'keywords', content: `${keywords}, IA, Intelligence Artificielle, Blog, Clément Reboul` },
      { name: 'author', content: 'Clément Reboul' },
      { name: 'publish_date', content: publishedDate },
      
      // OpenGraph
      { property: 'og:title', content: article.value.title },
      { property: 'og:description', content: article.value.description },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: articleUrl.value },
      { property: 'og:site_name', content: 'Blog IA Engineering' },
      { property: 'article:published_time', content: publishedDate },
      { property: 'article:author', content: 'Clément Reboul' },
      { property: 'article:tag', content: keywords },
      
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: article.value.title },
      { name: 'twitter:description', content: article.value.description },
    ],
    link: [
      { rel: 'canonical', href: articleUrl.value }
    ]
  })
  
  // Structured Data (JSON-LD) pour les articles
  useSchemaOrg([
    {
      '@type': 'BlogPosting',
      headline: article.value.title,
      description: article.value.description,
      author: {
        '@type': 'Person',
        name: 'Clément Reboul',
        url: siteUrl
      },
      datePublished: publishedDate,
      dateModified: publishedDate,
      publisher: {
        '@type': 'Person',
        name: 'Clément Reboul'
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': articleUrl.value
      },
      keywords: keywords,
      articleSection: article.value.tags?.[0] || 'IA',
      inLanguage: 'fr-FR',
      url: articleUrl.value
    }
  ])
}
</script>
