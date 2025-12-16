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
      // Vérifier le cookie en premier
      const stored = document.cookie.split('; ').find(row => row.startsWith('darkMode='))?.split('=')[1]
      
      if (stored !== undefined) {
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
      // Stocker dans un cookie avec expiration de 1 an
      document.cookie = `darkMode=${isDark.value}; path=/; max-age=31536000; SameSite=Lax`
      applyDarkMode(isDark.value)
    }
  }

  return {
    isDark: readonly(isDark),
    toggleDarkMode,
    initDarkMode
  }
}
