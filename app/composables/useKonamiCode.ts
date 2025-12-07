export const useKonamiCode = () => {
  const isFireMode = useState('fireMode', () => {
    if (process.client) {
      return document.body.classList.contains('fire-mode')
    }
    return false
  })
  
  const toggleFireMode = () => {
    if (process.client) {
      document.body.classList.toggle('fire-mode')
      isFireMode.value = document.body.classList.contains('fire-mode')
      console.log(isFireMode.value ? '🔥 MODE POMPIER ACTIVÉ !' : '🧯 Mode pompier désactivé.')
    }
  }

  return {
    isFireMode: readonly(isFireMode),
    toggleFireMode
  }
}
