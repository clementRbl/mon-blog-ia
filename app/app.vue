<template>
  <div class="min-h-screen bg-om-paper text-om-dark font-sans selection:bg-om-gold selection:text-white flex flex-col">
    <header class="border-b-2 border-om-dark py-6 sticky top-0 bg-om-paper/95 backdrop-blur-sm z-50">
      <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div class="text-center md:text-left">
          <p class="font-mono text-xs text-om-rust uppercase tracking-widest mb-1">Since 2025 • AI Engineering</p>
          <NuxtLink to="/" class="group">
            <h1 class="font-serif text-4xl font-black tracking-tighter uppercase">
              Clément <span class="text-om-gold group-hover:text-om-sepia transition-colors">Reboul</span>
              <span class="text-om-rust text-lg align-top ml-1">●</span>
            </h1>
          </NuxtLink>
        </div>

        <nav class="flex gap-6 font-mono text-sm uppercase font-bold tracking-tight">
          <NuxtLink to="/" class="hover:text-om-sepia hover:underline decoration-2 underline-offset-4 transition-all">Journal</NuxtLink>
          <NuxtLink to="/tags" class="hover:text-om-sepia hover:underline decoration-2 underline-offset-4 transition-all flex items-center gap-1">
            <Icon name="mdi:tag-multiple" size="18" /> Catégories
          </NuxtLink>
          <a href="https://github.com/clementRbl" target="_blank" class="hover:text-om-sepia flex items-center gap-2 transition-all">
            <Icon name="mdi:github" size="18" /> GitHub
          </a>
        </nav>
      </div>
    </header>

    <main class="container mx-auto px-4 py-12 flex-grow max-w-4xl">
      <NuxtPage />
    </main>

    <footer class="border-t-2 border-om-dark py-8 text-center bg-om-paperDark">
      <div class="container mx-auto font-mono text-xs text-om-dark/60">
        <p class="mb-2">Généré avec Nuxt 4 & Intelligence Artificielle</p>
        <p class="mb-3">© 2025 Clément Reboul • France</p>
        <nav class="flex justify-center gap-4 text-[10px] uppercase">
          <a href="https://github.com/clementRbl/mon-blog-ia" target="_blank" rel="noopener noreferrer" class="hover:text-om-sepia transition-colors flex items-center gap-1">
            <Icon name="mdi:github" size="14" /> Code Source
          </a>
        </nav>
      </div>
    </footer>

  </div>
</template>

<style>
/* Force le fond couleur papier sur toute la page HTML pour éviter les bandes blanches */
body {
  background-color: #Fdfbf7;
}
</style>