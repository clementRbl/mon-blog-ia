<template>
  <div v-if="showPrompt" data-pwa-prompt class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-om-dark text-om-paper p-4 shadow-retro-hover border-2 border-om-gold z-[60] animate-slide-up">
    <div class="flex items-start gap-3">
      <Icon name="mdi:apple" size="24" class="text-om-gold flex-shrink-0 mt-1" />
      <div class="flex-1">
        <h3 class="font-serif font-bold text-lg mb-1">Installer l'application</h3>
        <p class="text-sm text-om-paper/80 mb-3">
          Appuyez sur 
          <Icon name="mdi:export-variant" size="16" class="inline mx-1" />
          puis "Sur l'écran d'accueil"
        </p>
        <button 
          @click="dismiss" 
          class="w-full px-4 py-2 bg-om-gold text-om-dark font-mono text-sm font-bold uppercase hover:bg-om-sepia transition-colors"
        >
          Compris
        </button>
      </div>
      <button @click="dismiss" class="text-om-paper/60 hover:text-om-paper transition-colors">
        <Icon name="mdi:close" size="20" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const showPrompt = ref(false)

const isIOS = () => {
  if (!process.client) return false
  const ua = navigator.userAgent || ''
  return /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream
}

const isInStandaloneMode = () => {
  if (!process.client) return false
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true
}

onMounted(() => {
  if (!process.client) return
  
  // Afficher uniquement sur iOS, si pas déjà en mode standalone
  if (!isIOS() || isInStandaloneMode()) {
    return
  }
  
  // Vérifier le cooldown localStorage
  const dismissedTimestamp = localStorage.getItem('ios-install-prompt-dismissed')
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000
  
  if (dismissedTimestamp) {
    const dismissedTime = parseInt(dismissedTimestamp)
    const now = Date.now()
    
    // Si moins de 7 jours, ne pas afficher
    if (now - dismissedTime < sevenDaysMs) {
      return
    } else {
      // Nettoyage automatique si expiré
      localStorage.removeItem('ios-install-prompt-dismissed')
    }
  }
  
  // Attendre 3 secondes avant d'afficher
  setTimeout(() => {
    showPrompt.value = true
  }, 3000)
})

const dismiss = () => {
  showPrompt.value = false
  if (process.client) {
    // Stocker le timestamp pour vérification au prochain chargement
    localStorage.setItem('ios-install-prompt-dismissed', Date.now().toString())
  }
}
</script>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
</style>
