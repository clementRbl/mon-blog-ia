// Composable pour ajouter des boutons "Copier" aux blocs de code
export function useCodeCopyButtons() {
  const addCopyButtons = () => {
    if (!process.client) return

    // Attendre que le DOM soit prêt
    nextTick(() => {
      // Sélectionner tous les blocs de code dans le contenu de l'article
      const codeBlocks = document.querySelectorAll('[itemprop="articleBody"] pre')
      
      codeBlocks.forEach((pre) => {
        // Éviter les doublons
        if (pre.parentElement?.classList.contains('code-block-wrapper')) return

        // Créer le wrapper
        const wrapper = document.createElement('div')
        wrapper.className = 'code-block-wrapper relative group'
        
        // Créer le bouton
        const button = document.createElement('button')
        button.className = 'absolute top-2 right-2 p-2 bg-om-gold/90 dark:bg-om-darkGold/90 hover:bg-om-gold dark:hover:bg-om-darkGold text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 flex items-center gap-1'
        button.setAttribute('aria-label', 'Copier le code')
        button.setAttribute('title', 'Copier le code')
        
        // Icône copier (SVG inline)
        const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12z"/></svg>`
        
        // Icône check (SVG inline)
        const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"/></svg>`
        
        button.innerHTML = copyIcon
        
        // Fonction de copie
        button.addEventListener('click', async () => {
          const code = pre.querySelector('code')?.textContent || ''
          
          try {
            await navigator.clipboard.writeText(code)
            button.innerHTML = checkIcon
            button.setAttribute('aria-label', 'Code copié')
            button.setAttribute('title', 'Copié !')
            
            setTimeout(() => {
              button.innerHTML = copyIcon
              button.setAttribute('aria-label', 'Copier le code')
              button.setAttribute('title', 'Copier le code')
            }, 2000)
          } catch (err) {
            console.error('Erreur lors de la copie:', err)
          }
        })
        
        // Insérer le wrapper autour du pre
        pre.parentNode?.insertBefore(wrapper, pre)
        wrapper.appendChild(pre)
        wrapper.appendChild(button)
      })
    })
  }

  return {
    addCopyButtons
  }
}
