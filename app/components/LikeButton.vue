<template>
  <button
    @click="handleClick"
    :disabled="loading"
    class="group inline-flex items-center gap-1.5 rounded-sm transition-all duration-200"
    :class="[
      size === 'sm' ? 'px-2.5 py-1.5' : 'px-4 py-2',
      userHasLiked 
        ? 'bg-om-rust text-white hover:bg-om-sepia' 
        : 'bg-om-paper border border-om-ink/20 text-om-ink hover:border-om-rust hover:text-om-rust',
      loading && 'opacity-50 cursor-not-allowed'
    ]"
  >
    <!-- Icône coeur avec animation -->
    <Icon 
      :name="userHasLiked ? 'mdi:heart' : 'mdi:heart-outline'" 
      :size="size === 'sm' ? '16' : '20'"
      class="transition-all duration-200 flex-shrink-0"
      :class="{ 'scale-110': isAnimating }"
    />
    
    <!-- Compteur -->
    <span 
      class="font-mono font-medium tabular-nums leading-none"
      :class="[
        size === 'sm' ? 'text-xs' : 'text-sm',
        { 'font-bold': userHasLiked }
      ]"
    >
      {{ formatCount(likesCount) }}
    </span>
    
    <!-- Label (optionnel) -->
    <span 
      v-if="showLabel" 
      class="hidden sm:inline font-mono text-xs uppercase tracking-wider"
    >
      {{ userHasLiked ? 'Liké' : 'J\'aime' }}
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  articleId: string
  size?: 'sm' | 'md'
  showLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showLabel: false
})

const { likesCount, userHasLiked, loading, toggleLike } = useLikes(props.articleId)
const isAnimating = ref(false)

const handleClick = async () => {
  // Animation au clic
  isAnimating.value = true
  setTimeout(() => {
    isAnimating.value = false
  }, 300)
  
  await toggleLike()
}

const formatCount = (count: number) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return count.toString()
}
</script>

<style scoped>
/* Animation pulse quand on like */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.scale-110 {
  animation: pulse 0.3s ease-in-out;
}
</style>
