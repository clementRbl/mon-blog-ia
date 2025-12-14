<template>
  <div class="bg-om-paper dark:bg-om-darkBg text-om-dark dark:text-om-darkText font-sans selection:bg-om-gold selection:text-white transition-colors">
    <!-- Banner pour in-app browsers -->
    <ClientOnly>
      <InAppBrowserBanner />
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
              <span class="text-om-rust dark:text-om-darkGold text-base md:text-lg align-top ml-1">⚜</span>
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

    <main class="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)] max-w-6xl" role="main" id="main-content">
      <NuxtPage :transition="{
        name: 'page-fade',
        mode: 'out-in'
      }" />
    </main>

    <footer class="md:sticky md:bottom-0 border-t-2 border-om-dark dark:border-om-darkGold py-4 text-center bg-om-paperDark md:bg-om-paperDark/95 dark:bg-om-darkPaper md:dark:bg-om-darkPaper/95 md:backdrop-blur-sm md:z-40" role="contentinfo">
      <div class="container mx-auto font-mono text-xs text-om-dark/60 dark:text-om-darkText/60">
        <p class="opacity-60 text-[10px] uppercase mb-2">© 2025 Clément Reboul</p>
        <nav class="flex justify-center gap-4 text-[10px] uppercase" aria-label="Navigation secondaire">
          <a href="https://www.linkedin.com/in/clement-reboul" target="_blank" rel="noopener noreferrer" class="hover:text-om-sepia dark:hover:text-om-darkSepia transition-colors flex items-center gap-1" aria-label="Profil LinkedIn de Clément Reboul">
            <Icon name="mdi:linkedin" size="14" aria-hidden="true" /> LinkedIn
          </a>
          <a href="https://github.com/clementRbl/mon-blog-ia" target="_blank" rel="noopener noreferrer" class="hover:text-om-sepia dark:hover:text-om-darkSepia transition-colors flex items-center gap-1" aria-label="Voir le code source du blog sur GitHub">
            <Icon name="mdi:github" size="14" aria-hidden="true" /> GitHub
          </a>
        </nav>
      </div>
    </footer>

    <ClientOnly>
      <PwaPrompt />
      <IosInstallPrompt />
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
  /* Typographie avancée */
  font-feature-settings: 
    "liga" 1,      /* Ligatures standard */
    "clig" 1,      /* Ligatures contextuelles */
    "kern" 1,      /* Kerning optimisé */
    "onum" 1,      /* Chiffres old-style */
    "pnum" 1;      /* Chiffres proportionnels */
  font-variant-ligatures: common-ligatures contextual;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.dark body {
  background-color: #1A1612;
}

/* Transition élégante avec glissement */
.page-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Animation au scroll */
.scroll-animate {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.scroll-animate.scroll-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Curseur machine à écrire */
.typewriter-cursor {
  animation: blink 1s step-end infinite;
  color: theme('colors.om.rust');
  transition: opacity 0.3s ease-out;
}

.typewriter-cursor.fade-out {
  opacity: 0;
  animation: none;
}

.dark .typewriter-cursor {
  color: theme('colors.om.darkGold');
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Gradient animé sur les cartes */
.animated-gradient-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(190, 160, 100, 0.08) 0%,
    rgba(139, 115, 85, 0.15) 25%,
    rgba(160, 82, 45, 0.12) 50%,
    rgba(190, 160, 100, 0.08) 75%,
    transparent 100%
  );
  background-size: 300% 300%;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 1;
}

.dark .animated-gradient-card::before {
  background: linear-gradient(
    135deg,
    rgba(212, 181, 116, 0.1) 0%,
    rgba(184, 153, 104, 0.18) 25%,
    rgba(212, 181, 116, 0.14) 50%,
    rgba(184, 153, 104, 0.1) 75%,
    transparent 100%
  );
  background-size: 300% 300%;
}

.animated-gradient-card:hover::before {
  opacity: 1;
  animation: gradient-shift 2.5s ease-in-out infinite;
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Typographie avancée pour les titres */
h1, h2, h3, h4, h5, h6 {
  font-feature-settings: 
    "liga" 1,
    "dlig" 1,      /* Ligatures discrétionnaires */
    "kern" 1,
    "swsh" 1;      /* Lettres ornées (si dispo) */
  letter-spacing: -0.02em; /* Kerning légèrement serré pour les titres */
}

/* Small caps élégants pour les acronymes */
.small-caps {
  font-variant: small-caps;
  font-feature-settings: "smcp" 1, "c2sc" 1;
  letter-spacing: 0.05em;
}
</style>