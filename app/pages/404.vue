<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-16">
    <div class="max-w-2xl w-full">
      <!-- Cadre rétro avec bordure -->
      <div class="border-4 border-om-dark dark:border-om-darkGold bg-om-paper dark:bg-om-darkPaper p-8 md:p-12 shadow-retro">
        
        <!-- Code d'erreur -->
        <div class="text-center mb-8">
          <div class="inline-block border-2 border-om-rust dark:border-om-darkGold bg-om-rust/10 dark:bg-om-darkGold/10 px-6 py-3">
            <span class="font-mono text-6xl md:text-8xl font-bold text-om-rust dark:text-om-darkGold">
              404
            </span>
          </div>
        </div>

        <!-- Message d'erreur -->
        <div class="text-center mb-8">
          <h1 class="font-serif text-3xl md:text-4xl font-bold text-om-dark dark:text-om-darkText mb-4">
            Page introuvable
          </h1>
          <p class="font-sans text-om-ink/80 dark:text-om-darkText/80 text-lg leading-relaxed">
            Cette page semble s'être perdue dans les méandres du web. Peut-être a-t-elle été déplacée ou n'existe-t-elle plus.
          </p>
        </div>

        <!-- Citation décorative -->
        <div class="border-l-4 border-om-gold dark:border-om-darkGold pl-6 py-4 mb-8 bg-om-paperDark dark:bg-om-darkPaper">
          <blockquote class="font-serif text-xl italic text-om-sepia dark:text-om-darkSepia mb-2">
            « Tous les chemins mènent quelque part, mais certains mènent à Rome. »
          </blockquote>
          <cite class="font-mono text-xs text-om-rust dark:text-om-darkGold not-italic">
            — Proverbe adapté
          </cite>
        </div>

        <!-- Boutons d'action -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink 
            to="/"
            class="flex items-center justify-center gap-2 px-6 py-3 bg-om-rust dark:bg-om-darkGold text-white dark:text-om-darkBg font-mono text-sm uppercase tracking-wider hover:bg-om-sepia dark:hover:bg-om-darkSepia transition-colors shadow-md active:scale-95"
          >
            <Icon name="mdi:home" size="20" />
            Retour à l'accueil
          </NuxtLink>
          
          <NuxtLink 
            to="/tags"
            class="flex items-center justify-center gap-2 px-6 py-3 border-2 border-om-dark dark:border-om-darkGold text-om-dark dark:text-om-darkText font-mono text-sm uppercase tracking-wider hover:bg-om-dark hover:text-white dark:hover:bg-om-darkGold dark:hover:text-om-darkBg transition-colors active:scale-95"
          >
            <Icon name="mdi:tag-multiple" size="20" />
            Explorer les catégories
          </NuxtLink>
        </div>

        <!-- Ornement décoratif -->
        <div class="mt-8 pt-6 border-t border-om-dark/20 dark:border-om-darkGold/20 text-center">
          <div class="inline-flex items-center gap-2 text-om-ink/50 dark:text-om-darkText/50 text-sm font-mono">
            <span class="w-8 h-px bg-om-ink/30 dark:bg-om-darkText/30"></span>
            <span>404</span>
            <span class="w-8 h-px bg-om-ink/30 dark:bg-om-darkText/30"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Configuration SEO pour la page 404
useSeoMeta({
  title: 'Page introuvable - 404',
  description: 'La page que vous recherchez n\'existe pas ou a été déplacée.',
  robots: 'noindex, nofollow'
})
</script>
