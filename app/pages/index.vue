<template>
  <div>
    <h1 class="sr-only">Blog IA Engineering - Articles sur l'Intelligence Artificielle par Clément Reboul</h1>
    
    <!-- Citation avec espace réservé et animation -->
    <div class="mb-8 min-h-[120px] md:min-h-[160px]">
      <ClientOnly>
        <Transition
          enter-active-class="transition-all duration-1000 ease-out"
          enter-from-class="opacity-0 -translate-x-8"
          enter-to-class="opacity-100 translate-x-0"
        >
          <section v-if="quote" class="border-l-4 border-om-gold dark:border-om-darkGold pl-6 py-2" aria-label="Citation d'introduction">
            <blockquote class="font-serif text-2xl md:text-4xl italic leading-tight mb-4 text-om-dark dark:text-om-darkText">
              « <span ref="typewriterText" class="typewriter-text"></span><span class="typewriter-cursor">|</span> »
            </blockquote>
            <cite class="font-mono text-sm text-om-rust dark:text-om-darkGold not-italic">— {{ quote.author }}</cite>
          </section>
        </Transition>
      </ClientOnly>
    </div>

    <!-- Navigation des catégories -->
    <section v-if="popularTags && popularTags.length > 0" class="mb-8 p-6 bg-om-paperDark dark:bg-om-darkPaper border-2 border-om-sepia/30 dark:border-om-darkGold/30 scroll-animate" aria-label="Catégories populaires">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-mono uppercase text-xs tracking-widest text-om-ink dark:text-om-darkText flex items-center gap-2">
          <Icon name="mdi:tag-multiple" size="16" aria-hidden="true" />
          Catégories populaires
        </h2>
        <NuxtLink to="/tags" 
          class="font-mono text-xs uppercase text-om-sepia dark:text-om-darkSepia hover:text-om-rust dark:hover:text-om-darkGold transition-colors flex items-center gap-1"
          aria-label="Voir toutes les catégories d'articles">
          Voir tout
          <Icon name="mdi:arrow-right" size="14" aria-hidden="true" />
        </NuxtLink>
      </div>
      <nav class="flex flex-wrap gap-2" aria-label="Navigation des tags populaires">
        <TagBadge v-for="tag in popularTags" :key="tag" :tag="tag" />
      </nav>
    </section>

    <div class="flex items-center justify-between border-b-2 border-om-sepia/30 dark:border-om-darkGold/30 pb-2 mb-6">
      <h2 class="font-mono uppercase text-xs tracking-widest text-om-ink dark:text-om-darkText">
        Dernières publications
      </h2>
      
      <!-- Toggle vue grille/liste (desktop uniquement) -->
      <div class="hidden md:flex items-center gap-2 bg-om-paperDark dark:bg-om-darkPaper border border-om-dark/20 dark:border-om-darkGold/20 rounded">
        <button
          @click="viewMode = 'list'"
          :class="[
            'p-2 transition-colors',
            viewMode === 'list' 
              ? 'bg-om-gold dark:bg-om-darkGold text-white' 
              : 'text-om-ink/60 dark:text-om-darkText/60 hover:text-om-rust dark:hover:text-om-darkGold'
          ]"
          aria-label="Vue liste"
          title="Vue liste"
        >
          <Icon name="mdi:view-list" size="18" />
        </button>
        <button
          @click="viewMode = 'grid'"
          :class="[
            'p-2 transition-colors',
            viewMode === 'grid' 
              ? 'bg-om-gold dark:bg-om-darkGold text-white' 
              : 'text-om-ink/60 dark:text-om-darkText/60 hover:text-om-rust dark:hover:text-om-darkGold'
          ]"
          aria-label="Vue grille"
          title="Vue grille"
        >
          <Icon name="mdi:view-grid" size="18" />
        </button>
      </div>
    </div>

    <!-- Liste des articles (scroll naturel) -->
    <div role="feed" aria-label="Liste des derniers articles publiés">
      <template v-if="articles && articles.length > 0">
        <!-- Toujours liste par défaut en SSR, puis appliquer viewMode après hydration -->
        <div :class="isViewModeLoaded && viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-8'">
          <article v-for="(article, index) in articles" :key="article.id" 
            :class="[
              'group relative border-2 border-om-dark dark:border-om-darkGold bg-om-paper dark:bg-om-darkPaper cursor-pointer overflow-hidden',
              'animate-fade-in-up animated-gradient-card',
              'transition-all duration-300 ease-out',
              'hover:-translate-y-2 hover:shadow-retro-hover hover:border-om-rust dark:hover:border-om-darkGold',
              'shadow-retro',
              viewMode === 'grid' ? 'p-4' : 'p-8'
            ]"
            :style="{ animationDelay: `${index * 100}ms` }"
            :aria-label="`Article: ${article.title}`">
            
            <NuxtLink :to="`/blog/${article.slug}`" class="absolute inset-0 z-10" :aria-label="`Lire l'article: ${article.title}`"></NuxtLink>

            <div class="flex justify-between items-start mb-4 gap-4">
              <div class="flex gap-2 flex-wrap relative z-20" role="list" aria-label="Tags de l'article">
                <TagBadge v-for="tag in article.tags" :key="tag" :tag="tag" size="sm" />
              </div>
              <div class="text-right relative z-20">
                <!-- Badge NEW pour le premier article (desktop uniquement) -->
                <div v-if="index === 0" class="hidden md:inline-block bg-om-rust text-white px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider mb-1">
                  New
                </div>
                <time class="font-mono text-xs text-om-rust dark:text-om-darkGold font-bold whitespace-nowrap block" :datetime="article.date">
                  {{ formatDate(article.date) }}
                </time>
                <span v-if="article.reading_time" class="font-mono text-xs text-om-ink/60 dark:text-om-darkText/60 flex items-center justify-end gap-1 mt-1">
                  <Icon name="mdi:clock-outline" size="14" aria-hidden="true" />
                  {{ article.reading_time }} min
                </span>
              </div>
            </div>

            <!-- Badge NEW pour mobile (sous les tags, au-dessus du titre) -->
            <div v-if="index === 0" class="md:hidden inline-block bg-om-rust text-white px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider mb-3 relative z-20 shadow-sm">
              New
            </div>

            <h3 :class="[
              'font-serif font-bold text-om-dark dark:text-om-darkText transition-all duration-300',
              'group-hover:text-om-rust dark:group-hover:text-om-darkGold group-hover:translate-x-1',
              viewMode === 'grid' ? 'text-lg mb-2 line-clamp-2' : 'text-xl md:text-2xl mb-3'
            ]">
              {{ article.title }}
            </h3>
            
            <!-- Toujours afficher la description en SSR (viewMode=list par défaut), masquer uniquement après hydration si grid -->
            <p v-if="!isViewModeLoaded || viewMode === 'list'" class="font-sans text-om-ink/80 dark:text-om-darkText/80 leading-relaxed line-clamp-3">
              {{ article.description }}
            </p>
            
            <div class="mt-4 text-xs font-mono text-om-sepia dark:text-om-darkSepia group-hover:text-om-rust dark:group-hover:text-om-darkGold transition-all duration-300 md:hidden flex items-center gap-1">
              <span class="group-hover:translate-x-1 transition-transform">Lire la suite</span>
              <span class="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </article>
        </div>

        <!-- Trigger pour charger plus (mobile uniquement) -->
        <ClientOnly>
          <div v-if="hasMoreArticles && isHydrated" ref="loadMoreTrigger" class="md:hidden py-8 text-center">
            <div v-if="isLoadingMore" class="flex flex-col items-center gap-3">
              <Icon name="mdi:loading" size="32" class="text-om-rust dark:text-om-darkGold animate-spin" />
              <p class="font-mono text-xs text-om-ink/60 dark:text-om-darkText/60">Chargement...</p>
            </div>
          </div>

          <!-- Indicateur fin de liste (mobile uniquement) -->
          <div v-if="!hasMoreArticles && isMobile && isHydrated && allArticles.length > MOBILE_PAGE_SIZE" class="md:hidden py-8 text-center border-t-2 border-om-sepia/20 dark:border-om-darkGold/20">
            <p class="font-mono text-xs text-om-ink/60 dark:text-om-darkText/60">
              ✨ Vous avez tout lu !
            </p>
          </div>
        </ClientOnly>
      </template>

      <div v-else class="text-center py-12 border-2 border-dashed border-om-gold/50 dark:border-om-darkGold/50 rounded bg-om-paperDark dark:bg-om-darkPaper">
        <Icon name="mdi:text-box-edit-outline" size="48" class="text-om-gold dark:text-om-darkGold mb-4" />
        <p class="font-mono text-om-dark dark:text-om-darkText">Aucun article trouvé.</p>
        <p class="text-sm mt-2 text-gray-500 dark:text-gray-400">Connectez-vous à /admin pour créer votre premier article</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { articles: articlesAPI, quotes: quotesAPI } = useSupabase()

// Helper pour formater les dates de manière cohérente SSR/client
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    timeZone: 'Europe/Paris'
  })
}

// Gestion du mode d'affichage (grille/liste)
// Utiliser 'list' par défaut pour SSR et client initial (évite hydration mismatch)
const viewMode = ref<'list' | 'grid'>('list')
const isViewModeLoaded = ref(false)

// Charger la préférence depuis localStorage après hydration
onMounted(() => {
  const saved = localStorage.getItem('articles-view-mode')
  if (saved === 'grid' || saved === 'list') {
    viewMode.value = saved
  }
  // Marquer comme chargé après avoir lu localStorage
  isViewModeLoaded.value = true
})

// Sauvegarder la préférence
watch(viewMode, (newMode) => {
  if (process.client) {
    localStorage.setItem('articles-view-mode', newMode)
  }
})

// Récupération d'une citation aléatoire (client-only pour éviter hydration mismatch)
const quote = ref(null)
const typewriterText = ref(null)

if (process.client) {
  try {
    quote.value = await quotesAPI.getRandom()
  } catch (e) {
    console.warn('Erreur lors du chargement de la citation:', e)
  }
}

// Effet machine à écrire réaliste
// Fonction de génération de nombres pseudo-aléatoires avec seed (pour hydration)
const seededRandom = (() => {
  let seed = 12345 // Seed fixe pour cohérence SSR/client
  return () => {
    const x = Math.sin(seed++) * 10000
    return x - Math.floor(x)
  }
})()

const typeWriter = (text: string, element: HTMLElement) => {
  let i = 0
  element.textContent = ''
  
  const getTypingDelay = (char: string, nextChar: string) => {
    // Délai de base entre 40 et 90ms
    let delay = seededRandom() * 50 + 40
    
    // Pause plus longue après ponctuation
    if (char === '.' || char === '!' || char === '?') {
      delay = seededRandom() * 200 + 300 // 300-500ms
    } else if (char === ',' || char === ';') {
      delay = seededRandom() * 100 + 150 // 150-250ms
    } else if (char === ' ') {
      delay = seededRandom() * 30 + 60 // 60-90ms
    }
    
    // Accélération sur les voyelles successives
    const voyelles = 'aeiouyéèêëàâäôöûüïî'
    if (voyelles.includes(char.toLowerCase()) && voyelles.includes(nextChar?.toLowerCase())) {
      delay *= 0.7
    }
    
    // Parfois une petite hésitation (5% de chance)
    if (seededRandom() < 0.05) {
      delay += seededRandom() * 150 + 100
    }
    
    return delay
  }
  
  const type = () => {
    if (i < text.length) {
      element.textContent += text.charAt(i)
      const nextChar = text.charAt(i + 1)
      const delay = getTypingDelay(text.charAt(i), nextChar)
      i++
      setTimeout(type, delay)
    } else {
      // Masquer le curseur après la fin avec un petit délai
      setTimeout(() => {
        const cursor = document.querySelector('.typewriter-cursor')
        if (cursor) cursor.classList.add('fade-out')
      }, 500)
    }
  }
  
  type()
}

// Récupération des articles depuis Supabase avec pagination pour mobile
const allArticles = ref([]) // Tous les articles
const displayedArticles = ref([]) // Articles affichés (pagination mobile)
const isLoadingMore = ref(false)
const hasMoreArticles = ref(false)
const isMobile = ref(false)
const isHydrated = ref(false) // Flag pour éviter l'erreur d'hydratation

const MOBILE_PAGE_SIZE = 3

try {
  const { data, error } = await articlesAPI.getPublished()
  if (error) {
    console.error('Erreur lors du chargement des articles:', error)
  } else {
    allArticles.value = data || []
    // Au chargement initial (SSR + première hydratation) : afficher TOUS les articles
    displayedArticles.value = allArticles.value
  }
} catch (e) {
  console.warn('Supabase non disponible, mode dégradé:', e)
}

// Fonction pour charger plus d'articles (mobile uniquement)
const loadMoreArticles = () => {
  if (!isMobile.value || isLoadingMore.value || !hasMoreArticles.value) return
  
  isLoadingMore.value = true
  
  // Délai pour UX fluide et visible
  setTimeout(() => {
    const currentLength = displayedArticles.value.length
    const nextBatch = allArticles.value.slice(currentLength, currentLength + MOBILE_PAGE_SIZE)
    
    displayedArticles.value = [...displayedArticles.value, ...nextBatch]
    hasMoreArticles.value = displayedArticles.value.length < allArticles.value.length
    isLoadingMore.value = false
  }, 600)
}

// Observer pour détecter le scroll en bas (mobile uniquement)
const loadMoreTrigger = ref<HTMLElement | null>(null)

// Configuration après hydratation pour éviter mismatch
const { observe } = useScrollAnimation()

onMounted(() => {
  if (!process.client) return
  
  isHydrated.value = true
  isMobile.value = window.innerWidth < 768
  
  // Si mobile, réduire à MOBILE_PAGE_SIZE articles
  if (isMobile.value && allArticles.value.length > MOBILE_PAGE_SIZE) {
    displayedArticles.value = allArticles.value.slice(0, MOBILE_PAGE_SIZE)
    hasMoreArticles.value = true
  }
  
  // Activer les animations au scroll
  nextTick(() => {
    const animatedElements = document.querySelectorAll('.scroll-animate')
    observe(animatedElements)
    
    // Lancer l'effet machine à écrire sur la citation
    if (quote.value && typewriterText.value) {
      setTimeout(() => {
        typeWriter(quote.value.text, typewriterText.value)
      }, 500) // Délai pour laisser l'animation de slide se terminer
    }
  })
  
  // Listener pour resize
  const handleResize = () => {
    const wasMobile = isMobile.value
    isMobile.value = window.innerWidth < 768
    
    // Si on passe de desktop à mobile, réinitialiser la pagination
    if (!wasMobile && isMobile.value && allArticles.value.length > MOBILE_PAGE_SIZE) {
      displayedArticles.value = allArticles.value.slice(0, MOBILE_PAGE_SIZE)
      hasMoreArticles.value = true
    }
    // Si on passe de mobile à desktop, afficher tous les articles
    else if (wasMobile && !isMobile.value) {
      displayedArticles.value = allArticles.value
      hasMoreArticles.value = false
    }
  }
  
  if (process.client) {
    window.addEventListener('resize', handleResize)
    
    // Setup IntersectionObserver
    if (isMobile.value && hasMoreArticles.value) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isLoadingMore.value && hasMoreArticles.value) {
            loadMoreArticles()
          }
        },
        { threshold: 0.1 }
      )
      
      nextTick(() => {
        if (loadMoreTrigger.value) {
          observer.observe(loadMoreTrigger.value)
        }
      })
      
      onBeforeUnmount(() => {
        observer.disconnect()
        window.removeEventListener('resize', handleResize)
      })
    }
  }
})

// Utiliser displayedArticles au lieu de articles pour l'affichage
const articles = computed(() => displayedArticles.value)

// Calculer les tags les plus populaires (basé sur TOUS les articles)
const popularTags = computed(() => {
  if (!allArticles.value || allArticles.value.length === 0) return []
  
  const tagMap = new Map<string, number>()
  
  allArticles.value.forEach(article => {
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

// SEO pour la page d'accueil (basé sur TOUS les articles)
const siteUrl = 'https://clementreboul.netlify.app'
const articlesCount = computed(() => allArticles.value?.length || 0)

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
      url: siteUrl,
      sameAs: ['https://github.com/clementRbl'],
      jobTitle: 'IA Engineer'
    },
    inLanguage: 'fr-FR',
    keywords: 'IA, Intelligence Artificielle, Machine Learning, Deep Learning, Blog Tech',
    blogPost: allArticles.value?.slice(0, 5).map(article => ({
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