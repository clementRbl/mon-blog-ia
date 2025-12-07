// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxtjs/tailwindcss', 
    '@nuxtjs/seo'          
  ],

  // Configuration du module SEO
  site: {
    url: 'https://clementRbl.github.io',
    name: 'Blog IA Engineering - Clément Reboul',
    description: 'Blog personnel sur l\'intelligence artificielle et le machine learning',
    defaultLocale: 'fr'
  },

  ogImage: {
    enabled: true
  },

  sitemap: {
    enabled: true
  },

  robots: {
    robotsTxt: false // Désactiver la génération automatique car on a déjà robots.txt
  },

  // --- Configuration GitHub Pages ---
  app: {
    baseURL: '/mon-blog-ia/', 
    head: {
      htmlAttrs: {
        lang: 'fr'
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#Fdfbf7' },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'googlebot', content: 'index, follow' },
        // Confidentialité et sécurité
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        { name: 'referrer', content: 'no-referrer-when-downgrade' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/mon-blog-ia/favicon.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/mon-blog-ia/favicon.svg' },
      ],
      script: [
        {
          defer: true,
          src: 'https://cloud.umami.is/script.js',
          'data-website-id': 'd6a8ee08-52c7-4346-96f9-3fccf5c0fa87'
        }
      ],
      templateParams: {
        siteDescription: 'Le carnet de note d\'un futur IA Engineer.',
      },
      bodyAttrs: {
        class: 'bg-[#Fdfbf7]'
      }
    }
  },

  // --- Configuration SEO + Supabase via runtimeConfig ---
  // Les variables NUXT_PUBLIC_* sont automatiquement chargées depuis .env
  runtimeConfig: {
    public: {
      siteUrl: 'https://clementRbl.github.io/mon-blog-ia',
      siteName: 'Clément Reboul',
      siteDescription: 'Blog personnel IA Engineering.',
      language: 'fr',
      // Configuration Supabase (chargée depuis .env en dev/build)
      supabaseUrl: '',
      supabaseAnonKey: ''
    }
  },

  fonts: {
    families: [
      { name: 'Playfair Display', provider: 'google', weights: [400, 700, 900] },
      { name: 'Lora', provider: 'google', weights: [400, 600] },
      { name: 'JetBrains Mono', provider: 'google', weights: [400] }
    ]
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'github-light',
          langs: ['python', 'vue', 'bash', 'ts', 'json']
        }
      }
    }
  }
})