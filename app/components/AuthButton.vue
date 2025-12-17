<script setup lang="ts">
const { auth } = useSupabase()
const user = useSupabaseUser()

const showAuthModal = ref(false)
const showMenu = ref(false)
const avatarUrl = ref('')

// Récupérer le rôle depuis les custom claims du JWT
const userRole = ref<string>('user')

// Décoder le JWT pour accéder aux custom claims
const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  } catch (e) {
    console.error('Failed to decode JWT:', e)
    return null
  }
}

// Charger le rôle et l'avatar depuis la session
const loadUserRole = async () => {
  if (!user.value) {
    userRole.value = 'user'
    avatarUrl.value = ''
    return
  }
  
  const { data: { session } } = await auth.getSession()
  if (session?.access_token) {
    const decoded = decodeJWT(session.access_token)
    userRole.value = decoded?.user_role || 'user'
  }

  // Charger l'avatar depuis user_roles
  const { supabase } = useSupabase()
  try {
    const { data } = await supabase
      .from('user_roles')
      .select('avatar_url')
      .eq('user_id', user.value.id)
      .single()
    avatarUrl.value = data?.avatar_url || ''
  } catch (e) {
    avatarUrl.value = ''
  }
}

// Charger le rôle au montage et quand l'utilisateur change
watch(user, () => {
  loadUserRole()
}, { immediate: true })


import { useVintageToast } from '../composables/useVintageToast'
const { success: showToastSuccess } = useVintageToast()

const signOut = async () => {
  await auth.signOut()
  showMenu.value = false
  showToastSuccess('Déconnexion réussie !')
  navigateTo('/')
}

const closeMenu = () => {
  showMenu.value = false
}

// Close menu when clicking outside
onMounted(() => {
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (showMenu.value && !target.closest('.auth-menu-container')) {
      closeMenu()
    }
  }
  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<template>
  <div class="auth-menu-container relative">
    <!-- Not authenticated: Show login button -->
    <button
      v-if="!user"
      class="auth-button"
      @click="showAuthModal = true"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <span class="hidden sm:inline">Connexion</span>
    </button>

    <!-- Authenticated: Show user menu -->
    <div v-else class="relative">
      <button
        class="auth-button user-button"
        @click="showMenu = !showMenu"
      >
        <div v-if="avatarUrl" class="w-6 h-6 rounded-full overflow-hidden">
          <img :src="avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
        </div>
        <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
        </svg>
        <span class="hidden sm:inline truncate max-w-[150px]">
          {{ user.user_metadata?.full_name || user.email?.split('@')[0] || 'Mon compte' }}
        </span>
        <svg
          class="w-4 h-4 transition-transform"
          :class="{ 'rotate-180': showMenu }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Dropdown menu -->
      <Transition name="menu">
        <div v-if="showMenu" class="user-menu">
          <div class="menu-header">
            <div class="font-bold text-om-dark dark:text-om-darkText">
              {{ user.user_metadata?.full_name || 'Utilisateur' }}
            </div>
            <div class="text-xs text-om-dark/60 dark:text-om-darkText/60 truncate">
              {{ user.email }}
            </div>
          </div>

          <div class="menu-divider" />

          <NuxtLink
            to="/profile"
            class="menu-item"
            @click="closeMenu"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Mon profil</span>
          </NuxtLink>

          <!-- Admin link (only for admins) -->
          <NuxtLink
            v-if="userRole === 'admin'"
            to="/admin"
            class="menu-item text-om-gold dark:text-om-darkGold hover:bg-om-gold/10 dark:hover:bg-om-darkGold/10"
            @click="closeMenu"
          >
            <Icon name="mdi:shield-account" size="16" />
            <span>Administration</span>
          </NuxtLink>

          <div class="menu-divider" />

          <button
            class="menu-item text-om-rust dark:text-om-darkGold hover:bg-om-rust/10 dark:hover:bg-om-darkGold/10"
            @click="signOut"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Déconnexion</span>
          </button>
        </div>
      </Transition>
    </div>

    <!-- Auth Modal -->
    <AuthModal v-model:is-open="showAuthModal" />
  </div>
</template>

<style scoped>
.auth-button {
  @apply flex items-center gap-2 px-3 py-2 font-mono text-sm uppercase font-bold tracking-tight transition-all;
  @apply border-2 border-om-dark dark:border-om-darkGold;
  @apply bg-om-rust dark:bg-om-darkGold text-white dark:text-om-darkBg;
  @apply hover:bg-om-sepia dark:hover:bg-om-darkSepia hover:border-om-sepia dark:hover:border-om-darkSepia;
}

.user-button {
  @apply bg-om-paperDark dark:bg-om-darkPaper text-om-dark dark:text-om-darkText;
  @apply hover:bg-om-sepia/10 dark:hover:bg-om-darkSepia/10;
}

.user-menu {
  @apply absolute right-0 mt-2 w-64 shadow-xl z-50;
  @apply border-2 border-om-dark dark:border-om-darkGold;
  @apply bg-om-paper dark:bg-om-darkBg;
}

.menu-header {
  @apply px-4 py-3 border-b-2 border-om-sepia/20 dark:border-om-darkGold/20;
  @apply bg-om-paperDark dark:bg-om-darkPaper;
}

.menu-divider {
  @apply border-t-2 border-om-sepia/20 dark:border-om-darkGold/20 my-1;
}

.menu-item {
  @apply flex items-center gap-3 w-full px-4 py-2.5 text-left;
  @apply font-mono text-sm uppercase tracking-tight;
  @apply text-om-dark dark:text-om-darkText;
  @apply hover:bg-om-sepia/10 dark:hover:bg-om-darkSepia/10 transition-colors;
}

/* Menu transitions */
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
