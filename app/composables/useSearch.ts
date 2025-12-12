import Fuse from 'fuse.js'

export const useSearch = () => {
  const searchQuery = useState<string>('search-query', () => '')
  const searchResults = useState<any[]>('search-results', () => [])
  const isSearching = useState<boolean>('is-searching', () => false)

  // Configuration Fuse.js
  const fuseOptions = {
    keys: [
      { name: 'title', weight: 3 },        // Priorité max au titre
      { name: 'tags', weight: 2 },         // Puis les tags
      { name: 'description', weight: 1 }   // Puis la description (pas le contenu complet)
    ],
    threshold: 0.3, // Strict pour éviter trop de résultats
    includeScore: true,
    minMatchCharLength: 2,
    ignoreLocation: true,
    distance: 100 // Limite la distance de recherche
  }

  // Fonction de recherche
  const search = (query: string, articles: any[]) => {
    searchQuery.value = query

    if (!query || query.length < 2) {
      searchResults.value = []
      isSearching.value = false
      return
    }

    isSearching.value = true

    const fuse = new Fuse(articles, fuseOptions)
    const results = fuse.search(query)
    
    // Extraire les articles des résultats Fuse
    searchResults.value = results.map(result => ({
      ...result.item,
      score: result.score
    }))

    isSearching.value = false
  }

  // Réinitialiser la recherche
  const clearSearch = () => {
    searchQuery.value = ''
    searchResults.value = []
    isSearching.value = false
  }

  return {
    searchQuery,
    searchResults,
    isSearching,
    search,
    clearSearch
  }
}
