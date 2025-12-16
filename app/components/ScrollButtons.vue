<template>
  <div class="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col gap-3">
    <!-- Bouton Scroll to Bottom (visible en haut) -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-90"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-90"
    >
      <button
        v-if="showScrollDown"
        @click="scrollToBottom"
        class="group w-10 h-10 md:w-12 md:h-12 bg-om-rust dark:bg-om-darkGold text-white dark:text-om-darkBg border-2 border-om-dark dark:border-om-darkText shadow-retro hover:shadow-retro-hover active:scale-95 transition-all flex items-center justify-center"
        aria-label="Aller en bas de la page"
        title="Aller en bas"
      >
        <Icon name="mdi:arrow-down" :size="isLargeScreen ? 24 : 20" class="group-hover:translate-y-1 transition-transform" />
      </button>
    </Transition>

    <!-- Bouton Back to Top (visible en bas) -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-90"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-90"
    >
      <button
        v-if="showScrollUp"
        @click="scrollToTop"
        class="group w-10 h-10 md:w-12 md:h-12 bg-om-gold dark:bg-om-darkGold text-white dark:text-om-darkBg border-2 border-om-dark dark:border-om-darkText shadow-retro hover:shadow-retro-hover active:scale-95 transition-all flex items-center justify-center"
        aria-label="Retour en haut de la page"
        title="Retour en haut"
      >
        <Icon name="mdi:arrow-up" :size="isLargeScreen ? 24 : 20" class="group-hover:-translate-y-1 transition-transform" />
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const showScrollUp = ref(true)
const showScrollDown = ref(true)
const isLargeScreen = ref(true)

const updateButtonsVisibility = () => {
  if (!process.client) return
  
  const scrollTop = window.scrollY
  
  // Afficher le bouton "haut" après 300px de scroll
  showScrollUp.value = scrollTop > 300
  
  // Afficher le bouton "bas" quand on est en haut
  showScrollDown.value = scrollTop < 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const scrollToBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth'
  })
}

onMounted(() => {
  if (process.client) {
    // Détecter la taille d'écran
    isLargeScreen.value = window.innerWidth >= 768
    const handleResize = () => {
      isLargeScreen.value = window.innerWidth >= 768
    }
    window.addEventListener('resize', handleResize)
    
    updateButtonsVisibility()
    window.addEventListener('scroll', updateButtonsVisibility, { passive: true })
    
    onBeforeUnmount(() => {
      window.removeEventListener('scroll', updateButtonsVisibility)
      window.removeEventListener('resize', handleResize)
    })
  }
})
</script>