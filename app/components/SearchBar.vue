<template>
  <div class="relative hidden md:block">
    <!-- Barre de recherche desktop uniquement -->
    <div class="relative">
      <div class="relative">
        <Icon 
          name="mdi:magnify" 
          size="20" 
          class="absolute left-3 top-1/2 -translate-y-1/2 text-om-sepia dark:text-om-darkSepia pointer-events-none"
        />
        <input
          ref="searchInputDesktop"
          v-model="localQuery"
          @input="handleSearch"
          @focus="showResults = true"
          @keydown.escape="clearAndClose"
          type="text"
          placeholder="Rechercher..."
          class="w-64 pl-10 pr-10 py-2 border-2 border-om-dark dark:border-om-darkGold bg-om-paper dark:bg-om-darkPaper text-om-dark dark:text-om-darkText placeholder-om-ink/50 dark:placeholder-om-darkText/50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-om-rust dark:focus:ring-om-darkGold transition-all"
          aria-label="Rechercher un article"
        />
        <button
          v-if="localQuery"
          @click="clearAndClose"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-om-rust dark:text-om-darkGold hover:text-om-sepia dark:hover:text-om-darkSepia transition-colors"
          aria-label="Effacer la recherche"
        >
          <Icon name="mdi:close" size="20" />
        </button>
      </div>

      <!-- Résultats desktop -->
      <div
        v-if="showResults && (localQuery.length >= 2 || searchResults.length > 0)"
        class="absolute top-full mt-2 w-96 max-h-96 overflow-y-auto bg-om-paper dark:bg-om-darkPaper border-2 border-om-dark dark:border-om-darkGold shadow-retro z-50"
      >
        <div v-if="isSearching" class="p-4 text-center text-om-ink/60 dark:text-om-darkText/60 font-mono text-sm">
          Recherche...
        </div>
        
        <div v-else-if="searchResults.length === 0 && localQuery.length >= 2" class="p-4 text-center text-om-ink/60 dark:text-om-darkText/60 font-mono text-sm">
          Aucun résultat pour "{{ localQuery }}"
        </div>

        <div v-else class="divide-y-2 divide-om-sepia/20 dark:divide-om-darkGold/20">
          <NuxtLink
            v-for="article in searchResults"
            :key="article.id"
            :to="`/blog/${article.slug}`"
            @click="clearAndClose"
            class="block p-4 hover:bg-om-paperDark dark:hover:bg-om-darkBg transition-colors group"
          >
            <h3 class="font-serif text-lg font-bold text-om-dark dark:text-om-darkText group-hover:text-om-rust dark:group-hover:text-om-darkGold mb-1">
              {{ article.title }}
            </h3>
            <p class="text-sm text-om-ink/70 dark:text-om-darkText/70 line-clamp-2 mb-2">
              {{ article.description }}
            </p>
            <div class="flex gap-2 flex-wrap">
              <span
                v-for="tag in article.tags?.slice(0, 3)"
                :key="tag"
                class="text-xs font-mono text-om-rust dark:text-om-darkGold"
              >
                #{{ tag }}
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  articles: any[]
}>()

const { search, searchQuery, searchResults, isSearching, clearSearch } = useSearch()

const showResults = ref(false)
const localQuery = ref('')
const searchInputDesktop = ref<HTMLInputElement>()

// Synchroniser avec le state global
watch(localQuery, (newQuery) => {
  handleSearch()
})

// Gérer la recherche
const handleSearch = () => {
  search(localQuery.value, props.articles)
}

// Clear et fermer
const clearAndClose = () => {
  clearSearch()
  localQuery.value = ''
  showResults.value = false
}

// Fermer les résultats desktop au clic extérieur
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.relative')) {
      showResults.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>