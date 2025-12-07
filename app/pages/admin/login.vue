<template>
  <div class="min-h-screen flex items-center justify-center bg-om-paper px-4">
    <div class="max-w-md w-full">
      <!-- En-tête -->
      <div class="text-center mb-8">
        <h1 class="font-serif text-4xl font-black text-om-dark mb-2">Administration</h1>
        <p class="text-om-ink/70 font-mono">Connexion requise</p>
      </div>

      <!-- Formulaire de connexion -->
      <div class="bg-white border-4 border-om-dark shadow-retro p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="block font-mono text-sm uppercase tracking-wider text-om-dark mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 border-2 border-om-dark focus:outline-none focus:ring-2 focus:ring-om-rust font-sans"
              placeholder="votre@email.com"
            />
          </div>

          <!-- Mot de passe -->
          <div>
            <label for="password" class="block font-mono text-sm uppercase tracking-wider text-om-dark mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="w-full px-4 py-3 border-2 border-om-dark focus:outline-none focus:ring-2 focus:ring-om-rust font-sans"
              placeholder="••••••••"
            />
          </div>

          <!-- Message d'erreur -->
          <div v-if="error" class="p-4 bg-red-50 border-2 border-red-500 text-red-700 text-sm">
            {{ error }}
          </div>

          <!-- Bouton de connexion -->
          <button
            type="submit"
            :disabled="loading || isBlocked"
            class="w-full px-6 py-3 bg-om-gold text-white font-mono uppercase text-sm tracking-wider hover:bg-om-sepia transition-colors shadow-retro hover:shadow-retro-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Connexion...' : isBlocked ? 'Compte bloqué' : 'Se connecter' }}
          </button>
        </form>

        <!-- Lien retour -->
        <div class="mt-6 text-center">
          <NuxtLink to="/" class="text-om-sepia hover:text-om-rust text-sm font-mono underline">
            ← Retour au blog
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { auth } = useSupabase()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const failedAttempts = ref(0)
const isBlocked = ref(false)
const blockEndTime = ref(0)

// Vérifier si déjà connecté
onMounted(async () => {
  const { data } = await auth.getUser()
  if (data.user) {
    router.push('/admin')
  }
})

const handleLogin = async () => {
  // Vérifier si bloqué
  if (isBlocked.value) {
    const remainingTime = Math.ceil((blockEndTime.value - Date.now()) / 1000)
    if (remainingTime > 0) {
      error.value = `Trop de tentatives. Réessayez dans ${remainingTime} secondes.`
      return
    } else {
      // Débloquer
      isBlocked.value = false
      failedAttempts.value = 0
    }
  }

  loading.value = true
  error.value = ''

  try {
    const { data, error: signInError } = await auth.signIn(email.value, password.value)
    
    if (signInError) {
      // Incrémenter les échecs
      failedAttempts.value++
      
      // Bloquer après 5 tentatives
      if (failedAttempts.value >= 5) {
        const blockDuration = Math.min(Math.pow(2, failedAttempts.value - 5) * 30000, 300000) // Max 5 min
        blockEndTime.value = Date.now() + blockDuration
        isBlocked.value = true
        error.value = `Trop de tentatives échouées. Compte bloqué pendant ${Math.ceil(blockDuration / 1000)} secondes.`
      } else {
        error.value = `Email ou mot de passe incorrect (${failedAttempts.value}/5 tentatives)`
      }
      return
    }

    if (data.user) {
      // Réinitialiser les compteurs en cas de succès
      failedAttempts.value = 0
      isBlocked.value = false
      router.push('/admin')
    }
  } catch (e: any) {
    failedAttempts.value++
    error.value = e.message || 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}

// SEO
useHead({
  title: 'Connexion Admin - Blog IA Engineering',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
