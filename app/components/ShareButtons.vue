<template>
  <div class="flex items-center gap-3 py-6 border-t-2 border-om-dark/20 dark:border-om-darkGold/20">
    <span class="font-mono text-sm uppercase tracking-wider text-om-ink/70 dark:text-om-darkText/70">
      Partager :
    </span>
    
    <!-- Twitter/X -->
    <button
      @click="shareOnTwitter"
      class="group flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-mono text-sm uppercase tracking-wider border-2 border-om-dark dark:border-om-darkText shadow-retro hover:shadow-retro-hover active:scale-95 transition-all"
      aria-label="Partager sur Twitter"
      title="Partager sur Twitter"
    >
      <Icon name="mdi:twitter" size="20" />
      <span class="hidden sm:inline">Twitter</span>
    </button>

    <!-- LinkedIn -->
    <button
      @click="shareOnLinkedIn"
      class="group flex items-center gap-2 px-4 py-2 bg-[#0A66C2] hover:bg-[#004182] text-white font-mono text-sm uppercase tracking-wider border-2 border-om-dark dark:border-om-darkText shadow-retro hover:shadow-retro-hover active:scale-95 transition-all"
      aria-label="Partager sur LinkedIn"
      title="Partager sur LinkedIn"
    >
      <Icon name="mdi:linkedin" size="20" />
      <span class="hidden sm:inline">LinkedIn</span>
    </button>

    <!-- Copier le lien -->
    <button
      @click="copyLink"
      class="group flex items-center gap-2 px-4 py-2 bg-om-gold dark:bg-om-darkGold hover:bg-om-sepia dark:hover:bg-om-darkSepia text-white font-mono text-sm uppercase tracking-wider border-2 border-om-dark dark:border-om-darkText shadow-retro hover:shadow-retro-hover active:scale-95 transition-all"
      :aria-label="copied ? 'Lien copié !' : 'Copier le lien'"
      :title="copied ? 'Lien copié !' : 'Copier le lien'"
    >
      <Icon :name="copied ? 'mdi:check' : 'mdi:link'" size="20" 
        :class="copied ? 'text-green-200' : ''" />
      <span class="hidden sm:inline">{{ copied ? 'Copié !' : 'Copier' }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  url?: string
}>()

const copied = ref(false)

const getFullUrl = () => {
  if (props.url) return props.url
  if (process.client) {
    return window.location.href
  }
  return ''
}

const shareOnTwitter = () => {
  const url = getFullUrl()
  const text = encodeURIComponent(props.title)
  const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`
  window.open(twitterUrl, '_blank')
}

const shareOnLinkedIn = () => {
  const url = getFullUrl()
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  window.open(linkedInUrl, '_blank')
}

const copyLink = async () => {
  const url = getFullUrl()
  
  try {
    await navigator.clipboard.writeText(url)
    copied.value = true
    
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
  }
}
</script>
