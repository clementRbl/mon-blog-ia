<template>
  <div v-if="showPrompt && !isPwaPromptVisible" class="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-om-paper border-2 border-om-gold p-4 shadow-retro-hover z-50 animate-slide-up">
    <div class="flex items-start gap-3">
      <Icon name="mdi:bell-ring" size="24" class="text-om-gold flex-shrink-0 mt-1" />
      <div class="flex-1">
        <h3 class="font-serif font-bold text-lg mb-1 text-om-dark">Restez informé</h3>
        <p class="text-sm text-om-ink/80 mb-3">Recevez une notification à chaque nouvel article.</p>
        <div class="flex gap-2">
          <button 
            @click="acceptNotifications" 
            :disabled="loading"
            class="px-4 py-2 bg-om-gold text-om-dark font-mono text-sm font-bold uppercase hover:bg-om-sepia transition-colors disabled:opacity-50"
          >
            {{ loading ? 'Activation...' : 'Activer' }}
          </button>
          <button 
            @click="dismiss" 
            class="px-4 py-2 border-2 border-om-dark font-mono text-sm uppercase hover:bg-om-paperDark transition-colors"
          >
            Plus tard
          </button>
        </div>
      </div>
      <button @click="dismiss" class="text-om-ink/60 hover:text-om-dark transition-colors">
        <Icon name="mdi:close" size="20" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const showPrompt = ref(false)
const loading = ref(false)
const isPwaPromptVisible = ref(false)

// Détecter les in-app browsers (WhatsApp, Messenger, etc.)
const isInAppBrowser = () => {
  if (!process.client) return false
  const ua = navigator.userAgent || ''
  return /FBAN|FBAV|Instagram|WhatsApp|Messenger/i.test(ua)
}

const { subscribe, isSupported, isSubscribed, permissionState } = usePushNotifications()

let checkPwaVisibility: NodeJS.Timeout | null = null

// Enregistrer le hook AVANT tout await
onBeforeUnmount(() => {
  if (checkPwaVisibility) {
    clearInterval(checkPwaVisibility)
  }
})

onMounted(async () => {
  // Ne pas afficher dans les in-app browsers
  if (isInAppBrowser()) {
    return
  }
  
  // Vérifier si déjà abonné immédiatement
  const alreadySubscribed = await isSubscribed()
  if (alreadySubscribed) {
    return // Ne rien faire si déjà abonné
  }
  
  // Surveiller la visibilité de PwaPrompt en continu
  checkPwaVisibility = setInterval(() => {
    isPwaPromptVisible.value = !!document.querySelector('[data-pwa-prompt]')
  }, 500)
  
  // Vérifier le cooldown localStorage
  const dismissedTimestamp = localStorage.getItem('push-prompt-dismissed')
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000
  
  if (dismissedTimestamp) {
    const dismissedTime = parseInt(dismissedTimestamp)
    const now = Date.now()
    
    // Si moins de 7 jours, ne pas afficher
    if (now - dismissedTime < sevenDaysMs) {
      return
    } else {
      // Nettoyage automatique si expiré
      localStorage.removeItem('push-prompt-dismissed')
    }
  }
  
  // Afficher uniquement si :
  // - Les notifications sont supportées
  // - L'utilisateur n'a pas déjà accepté/refusé
  // - L'utilisateur n'est pas déjà abonné
  if (
    isSupported.value && 
    permissionState.value === 'default'
  ) {
    // Attendre 15 secondes pour laisser le temps aux PWA prompts de disparaître
    // Le v-if gère automatiquement la visibilité par rapport à PwaPrompt
    setTimeout(() => {
      showPrompt.value = true
    }, 15000)
  }
})

const acceptNotifications = async () => {
  loading.value = true
  try {
    await subscribe()
    showPrompt.value = false
  } catch (error) {
    console.error('Erreur:', error)
    // Si refusé, ne plus demander
    if (permissionState.value === 'denied') {
      localStorage.setItem('push-prompt-dismissed', Date.now().toString())
    }
  } finally {
    loading.value = false
  }
}

const dismiss = () => {
  showPrompt.value = false
  // Stocker le timestamp pour vérification au prochain chargement
  localStorage.setItem('push-prompt-dismissed', Date.now().toString())
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
