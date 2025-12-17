<template>
  <div class="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
    <!-- Loading -->
    <div v-if="!user" class="text-center py-12">
      <Icon name="mdi:loading" size="48" class="animate-spin text-om-rust dark:text-om-darkGold" />
      <p class="mt-4 text-om-ink/60 dark:text-om-darkText/60 font-mono">Chargement...</p>
    </div>

    <div v-else>
      <!-- Header -->
      <div class="mb-8 sm:mb-12 text-center">
        <div class="relative inline-block mb-4">
          <div class="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-om-gold dark:bg-om-darkGold overflow-hidden">
            <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
            <Icon v-else name="mdi:account" size="48" class="text-white dark:text-om-darkBg absolute inset-0 m-auto" />
          </div>
          <label class="absolute bottom-0 right-0 bg-om-rust dark:bg-om-darkGold text-white dark:text-om-darkBg rounded-full p-2 cursor-pointer shadow-lg hover:scale-110 transition-transform" title="Changer l'avatar">
            <input type="file" accept="image/jpeg,image/png,image/webp" class="hidden" @change="onAvatarSelect" :disabled="uploadingAvatar" />
            <Icon name="mdi:camera" size="20" />
          </label>
        </div>
        <div v-if="uploadingAvatar" class="text-xs text-om-rust dark:text-om-darkGold mb-2">
          <Icon name="mdi:loading" size="16" class="animate-spin inline" /> Upload en cours...
        </div>
        <h1 class="font-serif text-3xl sm:text-4xl font-bold text-om-dark dark:text-om-darkText mb-2 px-4">
          {{ user.user_metadata?.full_name || 'Mon Profil' }}
        </h1>
        <p class="text-om-ink/70 dark:text-om-darkText/70 font-mono text-sm sm:text-base break-all px-4">
          {{ user.email }}
        </p>
      </div>

      <!-- Info Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <!-- Account Info -->
        <div class="p-6 bg-om-paperDark dark:bg-om-darkPaper border-2 border-om-dark dark:border-om-darkGold">
          <h2 class="font-serif text-2xl font-bold text-om-dark dark:text-om-darkText mb-4 flex items-center gap-2">
            <Icon name="mdi:account-details" size="28" class="text-om-rust dark:text-om-darkGold" />
            Informations
          </h2>
          <div class="space-y-3">
            <div>
              <label class="block font-mono text-xs uppercase text-om-ink/70 dark:text-om-darkText/70 mb-1">
                Nom d'affichage public
              </label>
              <div v-if="!editingName" class="flex items-center gap-2">
                <p class="text-om-dark dark:text-om-darkText">
                  {{ userDisplayName || 'Non défini' }}
                </p>
                <button
                  @click="startEditName"
                  class="px-2 py-1 text-xs bg-om-rust dark:bg-om-darkGold text-white dark:text-om-darkBg border border-om-rust dark:border-om-darkGold hover:opacity-80 transition-opacity"
                  title="Modifier le nom"
                >
                  ✏️
                </button>
              </div>
              <div v-else class="flex flex-col sm:flex-row gap-2">
                <input
                  v-model="newDisplayName"
                  type="text"
                  maxlength="50"
                  placeholder="Votre nom d'affichage"
                  class="flex-1 px-3 py-2 text-sm border-2 border-om-sepia/30 dark:border-om-darkGold/30 bg-om-paper dark:bg-om-darkBg text-om-dark dark:text-om-darkText focus:outline-none focus:ring-2 focus:ring-om-rust dark:focus:ring-om-darkGold"
                />
                <div class="flex gap-2">
                  <button
                    type="button"
                    @click="saveDisplayName"
                    :disabled="savingName"
                    title="Sauvegarder"
                    class="flex-1 sm:flex-none px-3 py-2 bg-om-rust dark:bg-om-darkGold text-white dark:text-om-darkBg border-2 border-om-rust dark:border-om-darkGold hover:bg-om-sepia dark:hover:bg-om-darkSepia hover:border-om-sepia dark:hover:border-om-darkSepia transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon v-if="savingName" name="mdi:loading" size="18" class="animate-spin" />
                    <Icon v-else name="mdi:check" size="18" />
                  </button>
                  <button
                    type="button"
                    @click="cancelEditName"
                    :disabled="savingName"
                    title="Annuler"
                    class="flex-1 sm:flex-none px-3 py-2 bg-om-paperDark dark:bg-om-darkPaper text-om-dark dark:text-om-darkText border-2 border-om-dark dark:border-om-darkGold hover:bg-om-sepia/10 dark:hover:bg-om-darkSepia/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon name="mdi:close" size="18" />
                  </button>
                </div>
              </div>
              <p v-if="editingName" class="text-xs text-om-ink/60 dark:text-om-darkText/60 font-mono mt-1">
                {{ newDisplayName.length }}/50 caractères
              </p>
              <p v-if="displayNameError" class="text-xs text-om-rust mt-1">
                {{ displayNameError }}
              </p>
            </div>
            <div>
              <label class="block font-mono text-xs uppercase text-om-ink/70 dark:text-om-darkText/70 mb-1">
                Email
              </label>
              <p class="text-om-dark dark:text-om-darkText">
                {{ user.email }}
              </p>
            </div>
            <div>
              <label class="block font-mono text-xs uppercase text-om-ink/70 dark:text-om-darkText/70 mb-1">
                Compte créé le
              </label>
              <p class="text-om-dark dark:text-om-darkText">
                {{ formatDate(user.created_at) }}
              </p>
            </div>
            <div>
              <label class="block font-mono text-xs uppercase text-om-ink/70 dark:text-om-darkText/70 mb-1">
                Fournisseur
              </label>
              <p class="text-om-dark dark:text-om-darkText capitalize flex items-center gap-2">
                <Icon v-if="user.app_metadata?.provider === 'google'" name="mdi:google" size="18" class="text-red-500" />
                <Icon v-else-if="user.app_metadata?.provider === 'facebook'" name="mdi:facebook" size="18" class="text-blue-600" />
                <Icon v-else-if="user.app_metadata?.provider === 'linkedin_oidc'" name="mdi:linkedin" size="18" class="text-blue-700" />
                <Icon v-else name="mdi:email" size="18" class="text-om-rust dark:text-om-darkGold" />
                {{ getProviderName(user.app_metadata?.provider) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="p-6 bg-om-paperDark dark:bg-om-darkPaper border-2 border-om-dark dark:border-om-darkGold">
          <h2 class="font-serif text-2xl font-bold text-om-dark dark:text-om-darkText mb-4 flex items-center gap-2">
            <Icon name="mdi:chart-box" size="28" class="text-om-rust dark:text-om-darkGold" />
            Statistiques
          </h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="font-mono text-sm text-om-ink/70 dark:text-om-darkText/70">Commentaires</span>
              <span class="font-serif text-3xl font-bold text-om-dark dark:text-om-darkText">
                {{ userComments.length }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-mono text-sm text-om-ink/70 dark:text-om-darkText/70">Notif. activées</span>
              <span class="font-serif text-3xl font-bold text-om-dark dark:text-om-darkText">
                {{ pushEnabled ? 'Oui' : 'Non' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="mb-8 sm:mb-12 flex flex-wrap gap-4 justify-center px-4">
        <button
          @click="handleSignOut"
          class="w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-mono uppercase text-sm tracking-wider border-2 border-red-600 hover:bg-red-700 hover:border-red-700 transition-all shadow-retro hover:shadow-retro-hover"
        >
          <Icon name="mdi:logout" size="16" class="inline mr-2" />
          Déconnexion
        </button>
      </div>

      <!-- User Comments -->
      <div>
        <h2 class="font-serif text-3xl font-bold text-om-dark dark:text-om-darkText mb-6 flex items-center gap-3">
          <Icon name="mdi:comment-multiple" size="32" class="text-om-rust dark:text-om-darkGold" />
          Mes commentaires
          <span v-if="userComments.length > 0" class="text-lg text-om-rust dark:text-om-darkGold font-mono">
            ({{ userComments.length }})
          </span>
        </h2>

        <!-- Loading comments -->
        <div v-if="loadingComments" class="text-center py-12">
          <Icon name="mdi:loading" size="32" class="animate-spin text-om-rust dark:text-om-darkGold" />
          <p class="mt-4 text-om-ink/60 dark:text-om-darkText/60 font-mono text-sm">
            Chargement des commentaires...
          </p>
        </div>

        <!-- No comments -->
        <div v-else-if="userComments.length === 0" class="text-center py-12 border-2 border-dashed border-om-sepia/30 dark:border-om-darkGold/30 bg-om-paperDark dark:bg-om-darkPaper">
          <Icon name="mdi:comment-off-outline" size="48" class="text-om-sepia dark:text-om-darkSepia mb-4" />
          <p class="text-om-ink/60 dark:text-om-darkText/60 font-mono text-sm">
            Vous n'avez pas encore publié de commentaire
          </p>
        </div>

        <!-- Comments list -->
        <div v-else class="space-y-4">
          <article
            v-for="comment in userComments"
            :key="comment.id"
            class="p-6 bg-om-paper dark:bg-om-darkPaper border-2 border-om-sepia/30 dark:border-om-darkGold/30"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <NuxtLink
                  :to="`/blog/${comment.article_slug}`"
                  class="font-serif text-lg font-bold text-om-rust dark:text-om-darkGold hover:underline"
                >
                  {{ comment.article_title }}
                </NuxtLink>
                <p class="text-xs text-om-ink/60 dark:text-om-darkText/60 font-mono mt-1">
                  {{ formatDate(comment.created_at) }}
                </p>
              </div>
              <span
                v-if="comment.approved"
                class="px-2 py-1 bg-om-gold/20 dark:bg-om-darkGold/20 text-om-gold dark:text-om-darkGold text-xs font-mono uppercase"
              >
                ✓ Publié
              </span>
              <span
                v-else
                class="px-2 py-1 bg-om-rust/20 text-om-rust text-xs font-mono uppercase"
              >
                En attente
              </span>
            </div>
            <p class="text-om-dark dark:text-om-darkText leading-relaxed whitespace-pre-wrap">
              {{ comment.content }}
            </p>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { supabase, auth } = useSupabase()
const user = useSupabaseUser()
const router = useRouter()

// Rediriger si pas connecté (avec watch qui attend que la session soit chargée)
const isInitialLoad = ref(true)
watch(user, (newUser) => {
  // Ignorer le premier changement (initial load)
  if (isInitialLoad.value) {
    isInitialLoad.value = false
    return
  }
  
  // Rediriger seulement si vraiment déconnecté (après le premier chargement)
  if (newUser === null && process.client) {
    router.push('/')
  }
})

const userComments = ref<any[]>([])
const loadingComments = ref(true)
const pushEnabled = ref(false)

// Avatar upload
const avatarUrl = ref('')
const uploadingAvatar = ref(false)

// Display name editing
const userDisplayName = ref('')
const editingName = ref(false)
const newDisplayName = ref('')
const savingName = ref(false)
const displayNameError = ref('')

// Charger le display_name et l'avatar de l'utilisateur
const loadDisplayName = async () => {
  if (!user.value) return

  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('display_name, avatar_url')
      .eq('user_id', user.value.id)
      .single()

    if (error) throw error

    userDisplayName.value = data?.display_name || user.value.user_metadata?.full_name || user.value.email?.split('@')[0] || ''
    newDisplayName.value = userDisplayName.value
    avatarUrl.value = data?.avatar_url || ''
  } catch (error) {
    console.error('Erreur chargement display_name:', error)
  }
}

// Sélectionner et uploader un avatar
const onAvatarSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || !input.files[0] || !user.value) return

  const file = input.files[0]
  
  // Validation taille (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert('L\'image ne doit pas dépasser 2 MB')
    return
  }

  uploadingAvatar.value = true

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `avatar.${fileExt}`
    const filePath = `${user.value.id}/${fileName}`

    // Upload vers Supabase Storage (bucket: images)
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file, { 
        upsert: true,
        cacheControl: '3600'
      })

    if (uploadError) throw uploadError

    // Récupérer l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    // Mettre à jour l'URL dans user_roles
    const { error: updateError } = await supabase
      .from('user_roles')
      .update({ avatar_url: publicUrl })
      .eq('user_id', user.value.id)

    if (updateError) throw updateError

    avatarUrl.value = publicUrl
    alert('Avatar mis à jour avec succès !')
  } catch (error) {
    console.error('Erreur upload avatar:', error)
    alert('Erreur lors de l\'upload de l\'avatar')
  } finally {
    uploadingAvatar.value = false
    input.value = '' // Reset input
  }
}

// Sauvegarder le nouveau display_name
const saveDisplayName = async () => {
  displayNameError.value = ''
  
  if (newDisplayName.value.trim().length < 2) {
    displayNameError.value = 'Le nom doit contenir au moins 2 caractères'
    return
  }

  savingName.value = true
  
  try {
    const { data: { session } } = await auth.getSession()
    
    if (!session) {
      displayNameError.value = 'Session expirée'
      return
    }

    const response = await $fetch('/api/user/profile', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session.access_token}`
      },
      body: {
        displayName: newDisplayName.value.trim()
      }
    })

    if (response.success) {
      userDisplayName.value = response.displayName
      editingName.value = false
    }
  } catch (error: any) {
    displayNameError.value = error.data?.statusMessage || 'Erreur lors de la sauvegarde'
  } finally {
    savingName.value = false
  }
}

const startEditName = () => {
  newDisplayName.value = userDisplayName.value
  editingName.value = true
  displayNameError.value = ''
}

const cancelEditName = () => {
  editingName.value = false
  newDisplayName.value = userDisplayName.value
  displayNameError.value = ''
}

// Charger les commentaires de l'utilisateur
const loadUserComments = async () => {
  if (!user.value) return

  loadingComments.value = true
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        id,
        content,
        created_at,
        approved,
        article_id,
        articles!inner (
          title,
          slug
        )
      `)
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Transformer les données pour faciliter l'affichage
    userComments.value = data?.map((comment: any) => ({
      ...comment,
      article_title: comment.articles.title,
      article_slug: comment.articles.slug
    })) || []
  } catch (error) {
    console.error('Erreur chargement commentaires:', error)
  } finally {
    loadingComments.value = false
  }
}

// Vérifier si les notifications sont activées
const checkPushStatus = async () => {
  if (!user.value?.email) return

  try {
    const { data } = await supabase
      .from('push_subscriptions')
      .select('enabled')
      .eq('user_email', user.value.email)
      .eq('enabled', true)
      .limit(1)

    pushEnabled.value = (data && data.length > 0) || false
  } catch (error) {
    console.error('Erreur vérification push:', error)
  }
}

// Déconnexion
const handleSignOut = async () => {
  await auth.signOut()
  router.push('/')
}

// Formater la date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Nom du fournisseur
const getProviderName = (provider: string | undefined) => {
  if (!provider) return 'Email'
  const providers: Record<string, string> = {
    google: 'Google',
    facebook: 'Facebook',
    linkedin_oidc: 'LinkedIn',
    email: 'Email'
  }
  return providers[provider] || provider
}

// Charger les données quand l'utilisateur est disponible (une seule fois)
const dataLoaded = ref(false)
watch(user, (newUser) => {
  if (newUser && !dataLoaded.value) {
    dataLoaded.value = true
    loadDisplayName()
    loadUserComments()
    checkPushStatus()
  }
}, { immediate: true })

// Metadata SEO
useHead({
  title: 'Mon Profil',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
