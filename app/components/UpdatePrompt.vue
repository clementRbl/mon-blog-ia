<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
    >
      <div
        v-if="needRefresh"
        class="fixed bottom-0 left-0 right-0 z-[9999] bg-om-rust dark:bg-om-darkGold text-white dark:text-om-darkBg shadow-2xl border-t-4 border-om-dark dark:border-om-darkText"
        role="alert"
        aria-live="polite"
      >
        <div class="max-w-7xl mx-auto px-4 py-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <!-- Message -->
            <div class="flex items-start gap-3 flex-1">
              <div class="flex-shrink-0 mt-0.5">
                <Icon name="mdi:refresh-circle" size="24" class="animate-spin-slow" />
              </div>
              <div>
                <p class="font-mono text-sm font-bold">
                  Nouvelle version disponible !
                </p>
                <p class="text-xs opacity-90 mt-0.5">
                  Mettez à jour pour profiter des dernières fonctionnalités
                </p>
              </div>
            </div>
            
            <!-- Boutons -->
            <div class="flex gap-2 w-full sm:w-auto flex-shrink-0">
              <button
                @click="handleUpdate"
                class="flex-1 sm:flex-initial px-4 py-2 bg-white dark:bg-om-darkBg text-om-rust dark:text-om-darkGold font-mono text-xs uppercase tracking-wider hover:bg-om-paper dark:hover:bg-om-darkPaper transition-colors shadow-md active:scale-95"
                aria-label="Mettre à jour l'application"
              >
                Mettre à jour
              </button>
              <button
                @click="close"
                class="flex-1 sm:flex-initial px-4 py-2 border-2 border-white dark:border-om-darkBg text-white dark:text-om-darkBg font-mono text-xs uppercase tracking-wider hover:bg-white/10 transition-colors active:scale-95"
                aria-label="Fermer et mettre à jour plus tard"
              >
                Plus tard
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

const {
  needRefresh,
  updateServiceWorker
} = useRegisterSW({
  immediate: true,
  onRegisteredSW(swUrl, registration) {
    console.log('✅ Service Worker enregistré:', swUrl)
    
    // Vérifier les mises à jour toutes les 6 heures
    // Compatible iOS, Android et Desktop
    if (registration) {
      setInterval(() => {
        console.log('🔍 Vérification mise à jour SW...')
        registration.update().catch(err => {
          console.warn('Erreur vérification mise à jour:', err)
        })
      }, 6 * 60 * 60 * 1000) // 6 heures
    }
  },
  onRegisterError(error) {
    console.error('❌ Erreur enregistrement SW:', error)
  },
  onNeedRefresh() {
    console.log('🔄 Nouvelle version détectée')
  },
  onOfflineReady() {
    console.log('📱 App prête pour utilisation hors ligne')
  }
})

// Wrapper pour les handlers de click
const handleUpdate = async () => {
  try {
    await updateServiceWorker()
  } catch (error) {
    console.error('Erreur mise à jour:', error)
  }
}

const close = () => {
  needRefresh.value = false
}

// Animation spin lente pour l'icône
if (process.client) {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin-slow {
      animation: spin-slow 3s linear infinite;
    }
  `
  document.head.appendChild(style)
}
</script>
