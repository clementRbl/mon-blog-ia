<script setup lang="ts">
// Structured data pour Google Search Console
// Permet d'afficher le logo à côté de l'URL dans les résultats de recherche
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'Clément Reboul - Blog IA Engineering',
        'url': 'https://clementreboul.netlify.app',
        'logo': 'https://clementreboul.netlify.app/images/logo.png',
        'sameAs': [
          // Ajoutez vos profils sociaux ici si vous en avez
          // 'https://twitter.com/votre_compte',
          // 'https://github.com/clementRbl',
          // 'https://linkedin.com/in/votre_profil'
        ],
        'contactPoint': {
          '@type': 'ContactPoint',
          'contactType': 'Author',
          'url': 'https://clementreboul.netlify.app'
        }
      })
    }
  ]
})
</script>

<template>
  <!-- Ce composant n'a pas de rendu visuel, seulement des structured data -->
</template>
