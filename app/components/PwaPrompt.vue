<template>
  <div v-if="showPrompt" data-pwa-prompt class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-om-dark text-om-paper p-4 shadow-retro-hover border-2 border-om-gold z-[60] animate-slide-up">
    <div class="flex items-start gap-3">
      <Icon name="mdi:download" size="24" class="text-om-gold flex-shrink-0 mt-1" />
      <div class="flex-1">
        <h3 class="font-serif font-bold text-lg mb-1">Installer l'application</h3>
        <p class="text-sm text-om-paper/80 mb-3">Installez Blog IA sur votre appareil pour un accès rapide et hors ligne.</p>
        <div class="flex gap-2">
          <button 
            @click="install" 
            class="px-4 py-2 bg-om-gold text-om-dark font-mono text-sm font-bold uppercase hover:bg-om-sepia transition-colors"
          >
            Installer
          </button>
          <button 
            @click="dismiss" 
            class="px-4 py-2 border-2 border-om-paper/30 font-mono text-sm uppercase hover:bg-om-paper/10 transition-colors"
          >
            Plus tard
          </button>
        </div>
      </div>
      <button @click="dismiss" class="text-om-paper/60 hover:text-om-paper transition-colors">
        <Icon name="mdi:close" size="20" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const showPrompt = ref(false)
let deferredPrompt: any = null

const isIOS = () => {
  if (!process.client) return false
  const ua = navigator.userAgent || ''
  return /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream
}

onMounted(() => {
  if (!process.client) return
  
  // Ne pas afficher sur iOS (géré par IosInstallPrompt)
  if (isIOS()) return
  
  // Écouter l'événement beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    
    // Vérifier le cooldown localStorage
    const dismissedTimestamp = localStorage.getItem('pwa-prompt-dismissed')
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000
    
    if (dismissedTimestamp) {
      const dismissedTime = parseInt(dismissedTimestamp)
      const now = Date.now()
      
      // Si moins de 7 jours, ne pas afficher
      if (now - dismissedTime < sevenDaysMs) {
        return
      } else {
        // Nettoyage automatique si expiré
        localStorage.removeItem('pwa-prompt-dismissed')
      }
    }
    
    // Attendre 3 secondes avant d'afficher le prompt
    setTimeout(() => {
      showPrompt.value = true
    }, 3000)
  })

  // Écouter l'installation réussie
  window.addEventListener('appinstalled', () => {
    showPrompt.value = false
    deferredPrompt = null
  })
})

const install = async () => {
  if (!deferredPrompt) return
  
  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  
  if (outcome === 'accepted') {
    console.log('PWA installée')
  }
  
  deferredPrompt = null
  showPrompt.value = false
}

const dismiss = () => {
  showPrompt.value = false
  if (process.client) {
    // Stocker le timestamp pour vérification au prochain chargement
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString())
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
