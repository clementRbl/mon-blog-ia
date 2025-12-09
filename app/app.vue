<template>
  <div class="min-h-screen bg-om-paper text-om-dark font-sans selection:bg-om-gold selection:text-white flex flex-col">
    <!-- Banner pour in-app browsers -->
    <ClientOnly>
      <InAppBrowserBanner />
    </ClientOnly>
    
    <header class="border-b-2 border-om-dark py-6 sticky top-0 bg-om-paper/95 backdrop-blur-sm z-50" role="banner">
      <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div class="text-center md:text-left">
          <p class="font-mono text-xs text-om-rust uppercase tracking-widest mb-1">Since 2025 • AI Engineering</p>
          <NuxtLink to="/" class="group" aria-label="Retour à l'accueil du blog de Clément Reboul">
            <h1 class="font-serif text-3xl md:text-4xl font-black tracking-tighter uppercase select-none">
              Clément <span class="text-om-gold group-hover:text-om-sepia transition-colors">Reboul</span>
              <span class="text-om-rust text-base md:text-lg align-top ml-1">●</span>
            </h1>
          </NuxtLink>
        </div>

        <nav class="flex flex-wrap justify-center gap-4 font-mono text-sm uppercase font-bold tracking-tight" role="navigation" aria-label="Navigation principale">
          <NuxtLink to="/" class="hover:text-om-sepia hover:underline decoration-2 underline-offset-4 transition-all flex items-center gap-1 whitespace-nowrap" aria-label="Voir tous les articles du journal">
            <Icon name="mdi:newspaper" size="18" aria-hidden="true" /> Journal
          </NuxtLink>
          <NuxtLink to="/tags" class="hover:text-om-sepia hover:underline decoration-2 underline-offset-4 transition-all flex items-center gap-1 whitespace-nowrap" aria-label="Explorer les catégories d'articles">
            <Icon name="mdi:tag-multiple" size="18" aria-hidden="true" /> Catégories
          </NuxtLink>
          <NuxtLink to="/admin" class="hover:text-om-rust flex items-center gap-2 transition-all text-om-gold whitespace-nowrap" aria-label="Accéder à l'interface d'administration">
            <Icon name="mdi:shield-account" size="18" aria-hidden="true" /> Admin
          </NuxtLink>
        </nav>
      </div>
    </header>

    <main class="container mx-auto px-4 py-12 flex-grow max-w-4xl" role="main" id="main-content">
      <NuxtPage :transition="{
        name: 'page-fade',
        mode: 'out-in'
      }" />
    </main>

    <footer class="border-t-2 border-om-dark py-8 text-center bg-om-paperDark" role="contentinfo">
      <div class="container mx-auto font-mono text-xs text-om-dark/60">
        <p class="mb-3">© 2025 Clément Reboul • France</p>
        <nav class="flex justify-center gap-4 text-[10px] uppercase" aria-label="Navigation secondaire">
          <a href="https://www.linkedin.com/in/clement-reboul" target="_blank" rel="noopener noreferrer" class="hover:text-om-sepia transition-colors flex items-center gap-1" aria-label="Profil LinkedIn de Clément Reboul">
            <Icon name="mdi:linkedin" size="14" aria-hidden="true" /> LinkedIn
          </a>
          <a href="https://github.com/clementRbl/mon-blog-ia" target="_blank" rel="noopener noreferrer" class="hover:text-om-sepia transition-colors flex items-center gap-1" aria-label="Voir le code source du blog sur GitHub">
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