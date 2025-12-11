<template>
  <button 
    @click="toggleDarkMode"
    class="p-2 rounded-lg hover:bg-om-paperDark dark:hover:bg-om-darkPaper transition-colors"
    :aria-label="isDark ? 'Activer le mode clair' : 'Activer le mode sombre'"
    type="button"
  >
    <Icon 
      :name="isDark ? 'mdi:weather-sunny' : 'mdi:weather-night'" 
      size="20"
      class="text-om-dark dark:text-om-darkText transition-colors"
      aria-hidden="true"
    />
  </button>
</template>

<script setup lang="ts">
const { isDark, toggleDarkMode, initDarkMode } = useDarkMode()

// Initialiser au montage du composant
onMounted(() => {
  initDarkMode()
})
</script>
