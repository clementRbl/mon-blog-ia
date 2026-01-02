<script setup lang="ts">
import { useVintageToast } from "../composables/useVintageToast";

const { auth } = useSupabase()
const { success: showToastSuccess } = useVintageToast()
const isOpen = defineModel<boolean>('isOpen', { default: false })

const loading = ref(false)
const error = ref<string | null>(null)

const signInWithProvider = async (provider: 'google' | 'facebook' | 'linkedin_oidc') => {
  loading.value = true
  error.value = null
  
  try {
    // Marquer qu'on lance une connexion OAuth pour afficher le toast au retour
    sessionStorage.setItem('oauth_in_progress', 'true')
    
    // Force l'utilisation de l'URL actuelle (window.location.origin) pour la redirection
    // Cela garantit localhost:3000 en dev et netlify en prod
    const { data, error: signInError } = await auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/`,
        skipBrowserRedirect: false
      }
    })
    
    if (signInError) throw signInError
    
    // Le modal se fermera automatiquement après la redirection OAuth
    // Le toast "Connexion réussie !" est géré dans app.vue
  } catch (e: any) {
    console.error('OAuth error:', e)
    sessionStorage.removeItem('oauth_in_progress')
    error.value = e.message || 'Une erreur est survenue lors de la connexion'
    loading.value = false
  }
}

const close = () => {
  if (!loading.value) {
    isOpen.value = false
    error.value = null
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="close"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="close" />
        
        <!-- Modal -->
        <div class="relative w-full max-w-md">
          <div class="vintage-modal">
            <!-- Close button -->
            <button
              v-if="!loading"
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              @click="close"
              aria-label="Fermer"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Header -->
            <div class="text-center mb-8">
              <h2 class="text-3xl font-serif text-gray-900 mb-2">
                Connexion
              </h2>
              <p class="text-sm text-gray-600">
                Connectez-vous pour commenter et activer les notifications
              </p>
            </div>

            <!-- Error message -->
            <div
              v-if="error"
              class="mb-6 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700"
            >
              {{ error }}
            </div>

            <!-- OAuth Buttons -->
            <div class="space-y-3">
              <button
                :disabled="loading"
                class="oauth-button oauth-google"
                @click="signInWithProvider('google')"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continuer avec Google</span>
              </button>

              

              
            </div>

            <!-- Loading state -->
            <div v-if="loading" class="mt-6 text-center">
              <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
              <p class="mt-2 text-sm text-gray-600">Redirection en cours...</p>
            </div>

            <!-- Footer -->
            <div class="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
              En vous connectant, vous acceptez nos conditions d'utilisation.
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.vintage-modal {
  @apply bg-amber-50 rounded-lg shadow-2xl p-8 relative;
  background-image: 
    linear-gradient(to bottom, rgba(255, 251, 235, 0.9), rgba(254, 243, 199, 0.9)),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(0, 0, 0, 0.02) 2px,
      rgba(0, 0, 0, 0.02) 4px
    );
  border: 2px solid rgba(120, 53, 15, 0.3);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.oauth-button {
  @apply w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200;
  @apply border-2 disabled:opacity-50 disabled:cursor-not-allowed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.oauth-button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.oauth-button:not(:disabled):active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.oauth-google {
  @apply bg-white text-gray-700 border-gray-300;
}

.oauth-google:not(:disabled):hover {
  @apply bg-gray-50 border-gray-400;
}

.oauth-facebook {
  @apply bg-[#1877F2] text-white border-[#1877F2];
}

.oauth-facebook:not(:disabled):hover {
  @apply bg-[#166FE5] border-[#166FE5];
}

.oauth-linkedin {
  @apply bg-[#0A66C2] text-white border-[#0A66C2];
}

.oauth-linkedin:not(:disabled):hover {
  @apply bg-[#095196] border-[#095196];
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .vintage-modal,
.modal-leave-active .vintage-modal {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .vintage-modal,
.modal-leave-to .vintage-modal {
  transform: scale(0.95);
  opacity: 0;
}
</style>
