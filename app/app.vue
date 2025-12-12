<template>
  <div class="min-h-screen bg-om-paper dark:bg-om-darkBg text-om-dark dark:text-om-darkText font-sans selection:bg-om-gold selection:text-white flex flex-col transition-colors">
    <!-- Banner pour in-app browsers -->
    <ClientOnly>
      <InAppBrowserBanner />
      <UpdatePrompt />
    </ClientOnly>
    
    <header class="border-b-2 border-om-dark dark:border-om-darkGold py-6 sticky top-0 bg-om-paper/95 dark:bg-om-darkBg/95 backdrop-blur-sm z-50" role="banner">
      <!-- Toggle en position fixe sur mobile uniquement -->
      <div class="md:hidden fixed top-4 right-4 z-[60]">
        <DarkModeToggle />
      </div>
      
      <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div class="text-center md:text-left">
          <p class="font-mono text-xs text-om-rust dark:text-om-darkGold uppercase tracking-widest mb-1">Since 2025 • AI Engineering</p>
          <NuxtLink to="/" class="group" aria-label="Retour à l'accueil du blog de Clément Reboul">
            <h1 class="font-serif text-3xl md:text-4xl font-black tracking-tighter uppercase select-none">
              Clément <span class="text-om-gold dark:text-om-darkGold group-hover:text-om-sepia dark:group-hover:text-om-darkSepia transition-colors">Reboul</span>
              <span class="text-om-rust dark:text-om-darkGold text-base md:text-lg align-top ml-1">●</span>
            </h1>
          </NuxtLink>
        </div>

        <div class="flex items-center gap-4">
          <nav class="flex flex-wrap justify-center gap-4 font-mono text-sm uppercase font-bold tracking-tight" role="navigation" aria-label="Navigation principale">
            <NuxtLink to="/" class="hover:text-om-sepia dark:hover:text-om-darkSepia hover:underline decoration-2 underline-offset-4 transition-all flex items-center gap-1 whitespace-nowrap" aria-label="Voir tous les articles du journal">
              <Icon name="mdi:newspaper" size="18" aria-hidden="true" /> Journal
            </NuxtLink>
            <NuxtLink to="/tags" class="hover:text-om-sepia dark:hover:text-om-darkSepia hover:underline decoration-2 underline-offset-4 transition-all flex items-center gap-1 whitespace-nowrap" aria-label="Explorer les catégories d'articles">
              <Icon name="mdi:tag-multiple" size="18" aria-hidden="true" /> Catégories
            </NuxtLink>
            <NuxtLink to="/admin" class="hover:text-om-rust dark:hover:text-om-darkGold flex items-center gap-2 transition-all text-om-gold dark:text-om-darkGold whitespace-nowrap" aria-label="Accéder à l'interface d'administration">
              <Icon name="mdi:shield-account" size="18" aria-hidden="true" /> Admin
            </NuxtLink>
            <!-- Toggle visible uniquement sur desktop -->
            <div class="hidden md:block">
              <DarkModeToggle />
            </div>
          </nav>
          
          <!-- Barre de recherche -->
          <SearchBar :articles="allArticles" />
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-12 flex-grow max-w-4xl" role="main" id="main-content">
      <NuxtPage :transition="{
        name: 'page-fade',
        mode: 'out-in'
      }" />
    </main>

    <footer class="border-t-2 border-om-dark dark:border-om-darkGold py-8 text-center bg-om-paperDark dark:bg-om-darkPaper" role="contentinfo">
      <div class="container mx-auto font-mono text-xs text-om-dark/60 dark:text-om-darkText/60">
        <p class="mb-3">© 2025 Clément Reboul • France</p>
        <nav class="flex justify-center gap-4 text-[10px] uppercase" aria-label="Navigation secondaire">
          <a href="https://www.linkedin.com/in/clement-reboul" target="_blank" rel="noopener noreferrer" class="hover:text-om-sepia dark:hover:text-om-darkSepia transition-colors flex items-center gap-1" aria-label="Profil LinkedIn de Clément Reboul">
            <Icon name="mdi:linkedin" size="14" aria-hidden="true" /> LinkedIn
          </a>
          <a href="https://github.com/clementRbl/mon-blog-ia" target="_blank" rel="noopener noreferrer" class="hover:text-om-sepia dark:hover:text-om-darkSepia transition-colors flex items-center gap-1" aria-label="Voir le code source du blog sur GitHub">
            <Icon name="mdi:github" size="14" aria-hidden="true" /> Code Source
          </a>
        </nav>
      </div>
    </footer>

    <ClientOnly>
      <PwaPrompt />
      <PushPrompt />
    </ClientOnly>
  </div>
</template>

<script setup>
const { articles: articlesAPI } = useSupabase()

// Charger tous les articles pour la recherche
const allArticles = ref([])
if (process.client) {
  try {
    const { data } = await articlesAPI.getPublished()
    allArticles.value = data || []
  } catch (e) {
    console.warn('Erreur chargement articles pour recherche:', e)
  }
}

// Gestion globale des erreurs pour iOS
if (process.client) {
  window.addEventListener('error', (event) => {
    console.error('Erreur globale capturée:', event.error)
    event.preventDefault()
  })
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rejetée:', event.reason)
    event.preventDefault()
  })
}
</script>

<style>
/* Force le fond couleur papier sur toute la page HTML pour éviter les bandes blanches */
body {
  background-color: #Fdfbf7;
}

.dark body {
  background-color: #1A1612;
}

/* Transition simple en fade pour éviter le "pop" */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>