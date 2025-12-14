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
  // Afficher uniquement sur iOS, si pas déjà en mode standalone et pas déjà refusé
  const dismissed = localStorage.getItem('ios-install-prompt-dismissed')
  
  if (isIOS() && !isInStandaloneMode() && !dismissed) {
    // Attendre 3 secondes avant d'afficher
    setTimeout(() => {
      showPrompt.value = true
    }, 3000)
  }
})

const dismiss = () => {
  showPrompt.value = false
  localStorage.setItem('ios-install-prompt-dismissed', Date.now().toString())
  
  // Réafficher dans 7 jours
  setTimeout(() => {
    localStorage.removeItem('ios-install-prompt-dismissed')
  }, 7 * 24 * 60 * 60 * 1000)
  
  // Autoriser l'affichage du PushPrompt après fermeture
  localStorage.setItem('pwa-prompt-closed', 'true')
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
