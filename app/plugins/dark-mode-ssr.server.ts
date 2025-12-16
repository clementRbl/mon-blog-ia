export default defineNuxtPlugin(() => {
  // Lire le cookie darkMode côté serveur et injecter dans le head
  if (process.server) {
    const darkModeCookie = useCookie('darkMode')
    
    if (darkModeCookie.value === 'true') {
      useHead({
        htmlAttrs: {
          class: 'dark'
        }
      })
    }
  }
})
