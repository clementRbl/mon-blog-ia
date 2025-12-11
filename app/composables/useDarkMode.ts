export const useDarkMode = () => {
  const isDark = useState<boolean>('darkMode', () => false)

  // Appliquer le mode sombre au document
  const applyDarkMode = (dark: boolean) => {
    if (process.client) {
      if (dark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  // Initialiser le mode sombre
  const initDarkMode = () => {
    if (process.client) {
      // Vérifier le localStorage en premier
      const stored = localStorage.getItem('darkMode')
      
      if (stored !== null) {
        isDark.value = stored === 'true'
      } else {
        // Sinon, détecter la préférence système
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      
      applyDarkMode(isDark.value)
    }
  }

  // Basculer le mode sombre
  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    
    if (process.client) {
      localStorage.setItem('darkMode', String(isDark.value))
      applyDarkMode(isDark.value)
    }
  }

  return {
    isDark: readonly(isDark),
    toggleDarkMode,
    initDarkMode
  }
}
