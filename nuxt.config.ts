// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Active le mode Nuxt 4 pour être pérenne
  future: {
    compatibilityVersion: 4,
  },
  
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxtjs/tailwindcss', 
    '@nuxtjs/seo'          
  ],

  // --- Configuration Spécifique GitHub Pages ---
  app: {
    baseURL: '/mon-blog-ia/', 
    
    head: {
      templateParams: {
        siteDescription: 'Le carnet de note d\'un futur IA Engineer.',
      },
      bodyAttrs: {
        class: 'bg-[#Fdfbf7]'
      }
    }
  },

  // --- Configuration SEO via runtimeConfig ---
  runtimeConfig: {
    public: {
      siteUrl: 'https://clementreboul.github.io/mon-blog-ia',
      siteName: 'Clément Reboul',
      siteDescription: 'Blog personnel IA Engineering.',
      language: 'fr',
    }
  },

  fonts: {
    families: [
      // Titres (Style Journal)
      { name: 'Playfair Display', provider: 'google', weights: [400, 700, 900] },
      // Corps de texte (Lisible)
      { name: 'Lora', provider: 'google', weights: [400, 600] },
      // Code (Technique)
      { name: 'JetBrains Mono', provider: 'google', weights: [400] }
    ]
  },

  // --- Configuration du contenu (Code Highlighting) ---
  content: {
    build: {
      markdown: {
        highlight: {
          // Thème clair pour aller avec le papier
          theme: 'github-light',
          langs: ['python', 'vue', 'bash', 'ts', 'json']
        }
      }
    }
  }
})