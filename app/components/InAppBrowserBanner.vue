<template>
  <Transition name="slide-down">
    <div 
      v-if="showBanner" 
      class="fixed top-0 left-0 right-0 z-[100] bg-om-gold text-white shadow-lg"
    >
      <div class="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <span class="text-2xl flex-shrink-0">📱</span>
          <p class="text-sm font-mono flex-1 min-w-0">
            <span class="font-bold">Ouvrez dans votre navigateur</span>
            <br class="sm:hidden">
            <span class="hidden sm:inline"> - </span>
            <span class="text-xs opacity-90">pour installer l'app et recevoir les notifications</span>
          </p>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <button
            @click="openInBrowser"
            class="px-3 py-1.5 bg-white text-om-gold font-mono text-xs font-bold uppercase tracking-wider hover:bg-om-paper transition-colors whitespace-nowrap"
          >
            Ouvrir
          </button>
          <button
            @click="closeBanner"
            class="p-1.5 hover:bg-white/20 transition-colors rounded"
            aria-label="Fermer"
          >
            <span class="text-xl leading-none">×</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const showBanner = ref(false)

const isInAppBrowser = () => {
  if (!process.client) return false
  const ua = navigator.userAgent || ''
  return /FBAN|FBAV|Instagram|WhatsApp|Messenger|Line/i.test(ua)
}

const isPWAInstalled = () => {
  if (!process.client) return false
  // Vérifier si l'app est lancée en mode standalone (PWA installée)
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true
}

const isBannerDismissed = () => {
  if (!process.client) return false
  return localStorage.getItem('inAppBrowserBannerDismissed') === 'true'
}

const openInBrowser = () => {
  if (!process.client) return
  
  // Copier l'URL dans le presse-papier
  const url = window.location.href
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      alert('✅ Lien copié ! Collez-le dans votre navigateur (Safari, Chrome...)')
    }).catch(() => {
      // Fallback si clipboard API échoue
      alert(`📋 Copiez ce lien et ouvrez-le dans votre navigateur :\n\n${url}`)
    })
  } else {
    // Fallback pour anciens navigateurs
    alert(`📋 Copiez ce lien et ouvrez-le dans votre navigateur :\n\n${url}`)
  }
  
  closeBanner()
}

const closeBanner = () => {
  showBanner.value = false
  if (process.client) {
    localStorage.setItem('inAppBrowserBannerDismissed', 'true')
  }
}

onMounted(() => {
  if (!process.client) return
  
  // Afficher le banner uniquement si :
  // 1. On est dans un in-app browser
  // 2. La PWA n'est pas installée
  // 3. L'utilisateur ne l'a pas déjà fermé
  if (isInAppBrowser() && !isPWAInstalled() && !isBannerDismissed()) {
    showBanner.value = true
  }
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
