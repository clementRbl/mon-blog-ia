<template>
  <div>
    <!-- Boutons de scroll -->
    <ScrollButtons />
    
    <!-- Bandeau de prévisualisation -->
    <div v-if="isPreview" class="bg-om-rust dark:bg-om-darkGold text-white py-3 px-4 border-b-4 border-om-dark dark:border-om-darkText sticky top-0 z-50">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Icon name="mdi:eye" size="24" />
          <span class="font-mono text-sm uppercase tracking-wider">
            Mode prévisualisation{{ !article?.published ? ' - Article non publié' : '' }}
          </span>
        </div>
        <button
          @click="$router.back()"
          class="px-4 py-2 bg-white text-om-dark font-mono text-xs uppercase tracking-wider hover:bg-om-paper transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
    
    <!-- Layout avec TOC -->
    <div v-if="article" class="lg:flex lg:gap-8 max-w-[1600px] mx-auto">
      <!-- Article principal -->
      <article class="flex-1 lg:max-w-5xl" itemscope itemtype="https://schema.org/BlogPosting">
        <!-- Fil d'ariane -->
        <nav class="mb-6 flex items-center gap-2 text-sm font-mono" aria-label="Fil d'ariane">
          <NuxtLink to="/" class="text-om-sepia dark:text-om-darkSepia hover:text-om-rust dark:hover:text-om-darkGold transition-colors">
            Accueil
          </NuxtLink>
          <Icon name="mdi:chevron-right" size="16" class="text-om-ink/40 dark:text-om-darkText/40" />
          <NuxtLink to="/" class="text-om-sepia dark:text-om-darkSepia hover:text-om-rust dark:hover:text-om-darkGold transition-colors">
            Blog
          </NuxtLink>
          <Icon name="mdi:chevron-right" size="16" class="text-om-ink/40 dark:text-om-darkText/40" />
          <span class="text-om-ink/60 dark:text-om-darkText/60 truncate max-w-[200px] md:max-w-none">{{ article.title }}</span>
        </nav>

        <!-- En-tête de l'article -->
        <header class="mb-12 pb-8 border-b-2 border-om-dark dark:border-om-darkGold">
          <div class="flex gap-2 mb-4 flex-wrap" role="list" aria-label="Catégories de l'article">
            <TagBadge v-for="tag in article.tags" :key="tag" :tag="tag" />
          </div>
          
          <h1 class="font-serif text-3xl md:text-5xl font-black mb-4 leading-tight text-om-dark dark:text-om-darkText" itemprop="headline">
            {{ article.title }}
          </h1>
          
          <div class="flex items-center gap-4 text-sm text-om-ink/70 dark:text-om-darkText/70">
            <time class="font-mono text-om-rust dark:text-om-darkGold font-bold" :datetime="new Date(article.date).toISOString()" itemprop="datePublished">
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

        <!-- Table des matières mobile uniquement -->
        <div class="lg:hidden mb-8">
          <TableOfContents :content="htmlContent" />
        </div>

        <!-- Contenu de l'article -->
      <div class="prose md:prose-lg max-w-none
        prose-headings:font-serif prose-headings:font-bold prose-headings:text-om-dark dark:prose-headings:text-om-darkText
        prose-h1:text-2xl prose-h1:md:text-4xl prose-h2:text-xl prose-h2:md:text-3xl prose-h3:text-lg prose-h3:md:text-2xl
        prose-p:text-om-ink/90 dark:prose-p:text-om-darkText/90 prose-p:leading-relaxed prose-p:font-sans
        prose-a:text-om-sepia dark:prose-a:text-om-darkSepia prose-a:underline prose-a:decoration-2 prose-a:underline-offset-2 hover:prose-a:text-om-rust dark:hover:prose-a:text-om-darkGold
        prose-code:bg-om-paperDark dark:prose-code:bg-om-darkPaper prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-om-ink dark:prose-code:text-om-darkText
        prose-pre:bg-om-paperDark dark:prose-pre:bg-om-darkPaper prose-pre:border-2 prose-pre:border-om-sepia dark:prose-pre:border-om-darkGold prose-pre:shadow-paper
        prose-blockquote:border-l-4 prose-blockquote:border-om-rust dark:prose-blockquote:border-om-darkGold prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-om-ink/80 dark:prose-blockquote:text-om-darkText/80
        prose-img:border-2 prose-img:border-om-dark dark:prose-img:border-om-darkGold prose-img:shadow-paper
        prose-strong:text-om-dark dark:prose-strong:text-om-darkText prose-strong:font-bold
        prose-ul:text-om-ink/90 dark:prose-ul:text-om-darkText/90 prose-ol:text-om-ink/90 dark:prose-ol:text-om-darkText/90 prose-li:text-om-ink/90 dark:prose-li:text-om-darkText/90
        [&_table]:text-xs [&_table]:md:text-base
        [&_th]:px-2 [&_th]:py-1 [&_th]:md:px-4 [&_th]:md:py-2 [&_th]:border [&_th]:border-om-dark dark:[&_th]:border-om-darkGold [&_th]:bg-om-paperDark dark:[&_th]:bg-om-darkPaper
        [&_td]:px-2 [&_td]:py-1 [&_td]:md:px-4 [&_td]:md:py-2 [&_td]:border [&_td]:border-om-dark/30 dark:[&_td]:border-om-darkGold/30"
        v-html="htmlContent"
        itemprop="articleBody">
      </div>

        <!-- Boutons de partage -->
        <ShareButtons :title="article.title" :url="articleUrl" class="my-8" />

        <!-- Articles similaires -->
        <ClientOnly>
          <section v-if="similarArticles.length > 0" class="my-12 p-6 md:p-8 bg-om-paperDark dark:bg-om-darkPaper border-2 border-om-gold/30 dark:border-om-darkGold/30">
            <h2 class="font-serif text-2xl md:text-3xl font-bold mb-6 text-om-dark dark:text-om-darkText flex items-center gap-3">
              <Icon name="mdi:book-open-variant" size="28" class="text-om-gold dark:text-om-darkGold" />
              Articles similaires
            </h2>
            
            <div class="grid gap-4 md:grid-cols-3">
              <NuxtLink 
                v-for="similarArticle in similarArticles" 
                :key="similarArticle.id"
                :to="`/blog/${similarArticle.slug}`"
                class="group p-4 bg-om-paper dark:bg-om-darkBg border-2 border-om-dark dark:border-om-darkGold hover:shadow-retro-hover hover:-translate-y-1 transition-all"
              >
                <div class="flex gap-2 flex-wrap mb-3">
                  <TagBadge v-for="tag in similarArticle.tags.slice(0, 2)" :key="tag" :tag="tag" size="sm" />
                </div>
                
                <h3 class="font-serif text-lg font-bold mb-2 text-om-dark dark:text-om-darkText group-hover:text-om-sepia dark:group-hover:text-om-darkSepia transition-colors line-clamp-2">
                  {{ similarArticle.title }}
                </h3>
                
                <p class="text-sm text-om-ink/70 dark:text-om-darkText/70 line-clamp-2 mb-3">
                  {{ similarArticle.description }}
                </p>
                
                <div class="flex items-center justify-between text-xs">
                  <time class="font-mono text-om-rust dark:text-om-darkGold font-bold">
                    {{ new Date(similarArticle.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) }}
                  </time>
                  <span v-if="similarArticle.reading_time" class="font-mono text-om-ink/60 dark:text-om-darkText/60">
                    {{ similarArticle.reading_time }} min
                  </span>
                </div>
              </NuxtLink>
            </div>
          </section>
        </ClientOnly>

        <!-- Section commentaires -->
        <ClientOnly>
          <Comments v-if="article" :article-id="article.id" />
        </ClientOnly>
      </article>
    </div>

    <!-- Erreur 404 -->
    <div v-else class="text-center py-20">
      <Icon name="mdi:alert-circle-outline" size="64" class="text-om-rust dark:text-om-darkGold mb-4" />
      <h1 class="font-serif text-3xl font-bold mb-4 text-om-dark dark:text-om-darkText">Article introuvable</h1>
      <p class="text-om-ink/70 dark:text-om-darkText/70 mb-8">Cet article n'existe pas ou a été supprimé.</p>
      <NuxtLink to="/" 
        class="inline-block px-6 py-3 bg-om-gold dark:bg-om-darkGold text-white font-mono uppercase text-sm tracking-wider hover:bg-om-sepia dark:hover:bg-om-darkSepia transition-colors shadow-retro hover:shadow-retro-hover">
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

// Vérifier si on est en mode prévisualisation
const isPreview = computed(() => route.query.preview === 'true')

// Récupérer l'article depuis Supabase
const article = ref(null)
const allArticles = ref([])

try {
  if (isPreview.value) {
    // En mode preview, récupérer tous les articles (même non publiés)
    const { data, error } = await articlesAPI.getAll()
    if (error) throw error
    allArticles.value = data || []
    article.value = data?.find(a => a.slug === slug)
  } else {
    // En mode normal, uniquement les articles publiés
    const { data, error } = await articlesAPI.getBySlug(slug)
    if (error) throw error
    article.value = data
    
    // Récupérer aussi tous les articles pour les suggestions
    const { data: allData } = await articlesAPI.getPublished()
    allArticles.value = allData || []
  }
} catch (error) {
  console.error('Erreur lors du chargement de l\'article:', error)
}

// Trouver les articles similaires basés sur les tags communs
const similarArticles = computed(() => {
  if (!article.value || !allArticles.value.length) return []
  
  const currentTags = article.value.tags || []
  const currentId = article.value.id
  
  // Calculer le score de similarité pour chaque article
  const articlesWithScore = allArticles.value
    .filter(a => a.id !== currentId && a.published) // Exclure l'article actuel
    .map(a => {
      const commonTags = (a.tags || []).filter(tag => currentTags.includes(tag))
      return {
        ...a,
        score: commonTags.length // Nombre de tags en commun
      }
    })
    .filter(a => a.score > 0) // Garder seulement ceux avec au moins 1 tag commun
    .sort((a, b) => {
      // Trier par score puis par date
      if (b.score !== a.score) return b.score - a.score
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, 3) // Prendre les 3 meilleurs
  
  return articlesWithScore
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
