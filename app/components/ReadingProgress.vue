<template>
  <div 
    class="fixed top-0 left-0 right-0 h-1 bg-om-ink/10 dark:bg-om-darkText/10 z-[110]"
    role="progressbar"
    :aria-valuenow="progress"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label="Progression de lecture"
  >
    <div 
      class="h-full bg-gradient-to-r from-om-rust via-om-gold to-om-rust dark:from-om-darkGold dark:via-om-darkGold dark:to-om-darkGold transition-all duration-150 ease-out"
      :style="{ width: `${progress}%` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
const progress = ref(0)

const updateProgress = () => {
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  const scrollTop = window.scrollY
  
  // Calculer le pourcentage de scroll
  const scrollableHeight = documentHeight - windowHeight
  const scrolled = (scrollTop / scrollableHeight) * 100
  
  progress.value = Math.min(100, Math.max(0, scrolled))
}

onMounted(() => {
  updateProgress()
  window.addEventListener('scroll', updateProgress, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>
