<template>
  <NuxtLayout>
    <div class="min-h-screen flex items-center justify-center px-4 py-16">
      <div class="max-w-2xl w-full">
        <!-- Cadre rétro avec bordure -->
        <div class="border-4 border-om-dark dark:border-om-darkGold bg-om-paper dark:bg-om-darkPaper p-8 md:p-12 shadow-retro">
          
          <!-- Code d'erreur -->
          <div class="text-center mb-8">
            <div class="inline-block border-2 border-om-rust dark:border-om-darkGold bg-om-rust/10 dark:bg-om-darkGold/10 px-6 py-3">
              <span class="font-mono text-6xl md:text-8xl font-bold text-om-rust dark:text-om-darkGold">
                {{ error?.statusCode || 404 }}
              </span>
            </div>
          </div>

          <!-- Message d'erreur -->
          <div class="text-center mb-8">
            <h1 class="font-serif text-3xl md:text-4xl font-bold text-om-dark dark:text-om-darkText mb-4">
              {{ errorTitle }}
            </h1>
            <p class="font-sans text-om-ink/80 dark:text-om-darkText/80 text-lg leading-relaxed">
              {{ errorMessage }}
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
              Explorer les tags
            </NuxtLink>
          </div>

          <!-- Message debug (dev uniquement) -->
          <div v-if="error?.message && isDev" class="mt-8 pt-6 border-t-2 border-om-sepia/20 dark:border-om-darkGold/20">
            <details class="font-mono text-xs text-om-ink/60 dark:text-om-darkText/60">
              <summary class="cursor-pointer hover:text-om-rust dark:hover:text-om-darkGold">
                Détails techniques (dev)
              </summary>
              <pre class="mt-2 p-4 bg-om-paperDark dark:bg-om-darkBg overflow-x-auto">{{ error }}</pre>
            </details>
          </div>
        </div>

        <!-- Décoration ornementale -->
        <div class="mt-8 text-center">
          <div class="inline-flex items-center gap-4 text-om-gold dark:text-om-darkGold opacity-50">
            <Icon name="mdi:fleur-de-lis" size="24" />
            <Icon name="mdi:circle-small" size="16" />
            <Icon name="mdi:fleur-de-lis" size="24" />
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const props = defineProps({
  error: Object
})

const isDev = process.dev

const errorTitle = computed(() => {
  const code = props.error?.statusCode || 404
  
  switch (code) {
    case 404:
      return 'Page introuvable'
    case 500:
      return 'Erreur serveur'
    case 403:
      return 'Accès refusé'
    default:
      return 'Une erreur est survenue'
  }
})

const errorMessage = computed(() => {
  const code = props.error?.statusCode || 404
  
  switch (code) {
    case 404:
      return 'La page que vous recherchez semble s\'être égarée dans les méandres du web. Elle n\'existe peut-être plus, ou son URL a changé.'
    case 500:
      return 'Nos serveurs semblent avoir besoin d\'une pause thé. Réessayez dans quelques instants.'
    case 403:
      return 'Vous n\'avez pas l\'autorisation d\'accéder à cette page. Peut-être cherchez-vous autre chose ?'
    default:
      return 'Quelque chose s\'est mal passé. Nos excuses pour le désagrément.'
  }
})

// SEO pour la page d'erreur
useHead({
  title: `${errorTitle.value} - Blog IA Engineering`,
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
