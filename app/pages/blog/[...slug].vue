<template>
  <div>
    <article v-if="article" class="max-w-3xl mx-auto" itemscope itemtype="https://schema.org/BlogPosting">
      <!-- Bouton retour -->
      <nav class="mb-6" aria-label="Fil d'ariane">
        <NuxtLink to="/" 
          class="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-om-sepia hover:text-om-rust transition-colors group"
          aria-label="Retour à la liste des articles">
          <Icon name="mdi:arrow-left" size="20" class="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          Retour au journal
        </NuxtLink>
      </nav>

      <!-- En-tête de l'article -->
      <header class="mb-12 pb-8 border-b-2 border-om-dark">
        <div class="flex gap-2 mb-4 flex-wrap" role="list" aria-label="Catégories de l'article">
          <TagBadge v-for="tag in article.tags" :key="tag" :tag="tag" />
        </div>
        
        <h1 class="font-serif text-4xl md:text-5xl font-black mb-4 leading-tight text-om-dark" itemprop="headline">
          {{ article.title }}
        </h1>
        
        <div class="flex items-center gap-4 text-sm text-om-ink/70">
          <time class="font-mono text-om-rust font-bold" :datetime="new Date(article.date).toISOString()" itemprop="datePublished">
            {{ new Date(article.date).toLocaleDateString('fr-FR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) }}
          </time>
          <span v-if="article.reading_time" class="flex items-center gap-1 font-mono">
            <Icon name="mdi:clock-outline" size="16" aria-hidden="true" />
            {{ article.reading_time }} min de lecture
          </span>
          <meta itemprop="author" content="Clément Reboul" />
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
        prose-ul:text-om-ink/90 prose-ol:text-om-ink/90 prose-li:text-om-ink/90"
        v-html="htmlContent"
        itemprop="articleBody">
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
import { marked } from 'marked'

const route = useRoute()
const { articles: articlesAPI } = useSupabase()
const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug

// Récupérer l'article depuis Supabase
const { data: article } = await useAsyncData(`blog-${slug}`, async () => {
  try {
    const { data, error } = await articlesAPI.getBySlug(slug)
    if (error) throw error
    return data
  } catch (error) {
    console.error('Erreur lors du chargement de l\'article:', error)
    return null
  }
})

// Parser le Markdown en HTML
const htmlContent = computed(() => {
  if (!article.value?.content) return ''
  try {
    return marked.parse(article.value.content)
  } catch (e) {
    console.error('Erreur parsing Markdown:', e)
    return article.value.content
  }
})

// SEO complet pour les articles
const siteUrl = 'https://clementRbl.github.io/mon-blog-ia'
const articleUrl = computed(() => article.value ? `${siteUrl}/blog/${article.value.slug}` : '')

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
        url: siteUrl,
        sameAs: ['https://github.com/clementRbl']
      },
      datePublished: publishedDate,
      dateModified: article.value.updated_at || publishedDate,
      publisher: {
        '@type': 'Person',
        name: 'Clément Reboul',
        url: siteUrl
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': articleUrl.value
      },
      keywords: keywords,
      articleSection: article.value.tags?.[0] || 'IA',
      inLanguage: 'fr-FR',
      url: articleUrl.value,
      wordCount: article.value.content?.split(/\s+/).length || 0
    }
  ])
} else {
  // SEO pour page 404
  useHead({
    title: 'Article introuvable - Blog IA Engineering',
    meta: [
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  })
}
</script>
