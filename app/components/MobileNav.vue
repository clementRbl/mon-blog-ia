<script setup lang="ts">
import { useVintageToast } from '../composables/useVintageToast'

const { auth } = useSupabase()
const user = useSupabaseUser()
const { success: showToastSuccess } = useVintageToast()

const showAuthModal = ref(false)
const showMobileMenu = ref(false)

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
    return null
  }
}

// Charger le rôle depuis la session
const loadUserRole = async () => {
  if (!user.value) {
    userRole.value = 'user'
    return
  }
  
  const { data: { session } } = await auth.getSession()
  if (session?.access_token) {
    const decoded = decodeJWT(session.access_token)
    userRole.value = decoded?.user_role || 'user'
  }
}

watch(user, () => {
  loadUserRole()
}, { immediate: true })

const signOut = async () => {
  await auth.signOut()
  showMobileMenu.value = false
  showToastSuccess('Déconnexion réussie !')
  navigateTo('/')
}

const closeMenu = () => {
  showMobileMenu.value = false
}
</script>

<template>
  <div>
    <!-- Navigation mobile fixe en bas -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t-2 border-om-dark dark:border-om-darkGold bg-om-paper/95 dark:bg-om-darkBg/95 backdrop-blur-sm" role="navigation" aria-label="Navigation mobile">
      <div class="flex justify-around items-center py-1.5">
        <!-- Journal -->
        <NuxtLink to="/" class="flex flex-col items-center gap-0.5 px-2 py-1.5 text-xs font-mono uppercase font-bold tracking-tight hover:text-om-rust dark:hover:text-om-darkGold transition-colors" aria-label="Voir tous les articles">
          <Icon name="mdi:newspaper" size="22" aria-hidden="true" />
          <span class="text-[9px]">Journal</span>
        </NuxtLink>
        
        <!-- Catégories -->
        <NuxtLink to="/tags" class="flex flex-col items-center gap-0.5 px-2 py-1.5 text-xs font-mono uppercase font-bold tracking-tight hover:text-om-rust dark:hover:text-om-darkGold transition-colors" aria-label="Explorer les catégories">
          <Icon name="mdi:tag-multiple" size="22" aria-hidden="true" />
          <span class="text-[9px]">Tags</span>
        </NuxtLink>
        
        <!-- Menu utilisateur -->
        <button
          v-if="!user"
          @click="showAuthModal = true"
          class="flex flex-col items-center gap-0.5 px-2 py-1.5 text-xs font-mono uppercase font-bold tracking-tight hover:text-om-rust dark:hover:text-om-darkGold transition-colors"
          aria-label="Se connecter"
        >
          <Icon name="mdi:account-circle" size="22" aria-hidden="true" />
          <span class="text-[9px]">Connexion</span>
        </button>
        
        <button
          v-else
          @click="showMobileMenu = true"
          class="flex flex-col items-center gap-0.5 px-2 py-1.5 text-xs font-mono uppercase font-bold tracking-tight hover:text-om-rust dark:hover:text-om-darkGold transition-colors"
          aria-label="Menu utilisateur"
        >
          <Icon name="mdi:account-circle" size="22" aria-hidden="true" />
          <span class="text-[9px]">Menu</span>
        </button>
      </div>
    </nav>

    <!-- Menu utilisateur mobile (bottom sheet) -->
    <Transition name="menu-mobile">
      <div
        v-if="showMobileMenu && user"
        class="md:hidden fixed inset-0 z-[60] flex items-end"
        @click.self="closeMenu"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeMenu" />
        
        <!-- Menu sheet -->
        <div class="relative w-full bg-om-paper dark:bg-om-darkBg border-t-2 border-om-dark dark:border-om-darkGold rounded-t-2xl overflow-hidden">
          <!-- Header -->
          <div class="px-6 py-4 border-b-2 border-om-sepia/20 dark:border-om-darkGold/20 bg-om-paperDark dark:bg-om-darkPaper">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-bold text-om-dark dark:text-om-darkText font-mono uppercase">
                  {{ user.user_metadata?.full_name || 'Utilisateur' }}
                </div>
                <div class="text-xs text-om-dark/60 dark:text-om-darkText/60 truncate max-w-[250px]">
                  {{ user.email }}
                </div>
              </div>
              <button
                @click="closeMenu"
                class="p-2 hover:bg-om-sepia/10 dark:hover:bg-om-darkSepia/10 rounded transition-colors"
                aria-label="Fermer le menu"
              >
                <Icon name="mdi:close" size="24" />
              </button>
            </div>
          </div>

          <!-- Menu items -->
          <div class="py-2">
            <NuxtLink
              to="/profile"
              class="flex items-center gap-3 px-6 py-4 font-mono text-sm uppercase tracking-tight text-om-dark dark:text-om-darkText hover:bg-om-sepia/10 dark:hover:bg-om-darkSepia/10 transition-colors"
              @click="closeMenu"
            >
              <Icon name="mdi:account" size="20" />
              <span>Mon profil</span>
            </NuxtLink>

            <!-- Admin link (only for admins) -->
            <NuxtLink
              v-if="userRole === 'admin'"
              to="/admin"
              class="flex items-center gap-3 px-6 py-4 font-mono text-sm uppercase tracking-tight text-om-gold dark:text-om-darkGold hover:bg-om-gold/10 dark:hover:bg-om-darkGold/10 transition-colors"
              @click="closeMenu"
            >
              <Icon name="mdi:shield-account" size="20" />
              <span>Administration</span>
            </NuxtLink>

            <div class="border-t-2 border-om-sepia/20 dark:border-om-darkGold/20 my-2" />

            <button
              class="flex items-center gap-3 w-full px-6 py-4 font-mono text-sm uppercase tracking-tight text-om-rust dark:text-om-darkGold hover:bg-om-rust/10 dark:hover:bg-om-darkGold/10 transition-colors"
              @click="signOut"
            >
              <Icon name="mdi:logout" size="20" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Auth Modal -->
    <AuthModal v-model:is-open="showAuthModal" />
  </div>
</template>

<style scoped>
/* Menu mobile transitions */
.menu-mobile-enter-active,
.menu-mobile-leave-active {
  transition: opacity 0.3s ease;
}

.menu-mobile-enter-active .relative,
.menu-mobile-leave-active .relative {
  transition: transform 0.3s ease;
}

.menu-mobile-enter-from,
.menu-mobile-leave-to {
  opacity: 0;
}

.menu-mobile-enter-from .relative,
.menu-mobile-leave-to .relative {
  transform: translateY(100%);
}
</style>
