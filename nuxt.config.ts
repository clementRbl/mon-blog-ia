// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  experimental: {
    payloadExtraction: false // Désactiver le preload de payload
  },

  modules: [
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxtjs/tailwindcss', 
    '@nuxtjs/seo',
    '@vite-pwa/nuxt'
  ],

  // Configuration du module SEO
  site: {
    url: 'https://clementRbl.github.io',
    name: 'Blog IA Engineering - Clément Reboul',
    description: 'Blog personnel sur l\'intelligence artificielle et le machine learning',
    defaultLocale: 'fr',
    trailingSlash: false
  },

  ogImage: {
    enabled: true,
    defaults: {
      component: 'OgImage',
      props: {
        image: '/mon-blog-ia/images/og-image.png'
      }
    }
  },

  sitemap: {
    enabled: false // Désactivé - on utilise le sitemap statique généré par le script
  },

  robots: {
    robotsTxt: false // Désactiver la génération automatique car on a déjà robots.txt
  },

  // Ignorer les erreurs de prerendering (Supabase non dispo en build)
  nitro: {
    prerender: {
      failOnError: false
    }
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
        { name: 'google-site-verification', content: 'fq0xGAOYCJCn4criCTkLFxOaN2nQyw-DGwc-JypJpcg' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#Fdfbf7' },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'googlebot', content: 'index, follow' },
        // Open Graph
        { property: 'og:image', content: 'https://clementRbl.github.io/mon-blog-ia/images/og-image.png' },
        { property: 'og:image:width', content: '1024' },
        { property: 'og:image:height', content: '1024' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://clementRbl.github.io/mon-blog-ia/images/og-image.png' },
        // Confidentialité et sécurité
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        { name: 'referrer', content: 'strict-origin-when-cross-origin' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/mon-blog-ia/favicon.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/mon-blog-ia/favicon.svg' },
        { rel: 'manifest', href: '/mon-blog-ia/manifest.webmanifest' },
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
    vapidPrivateKey: '', // Clé privée VAPID (serveur uniquement)
    adminKey: '', // Clé secrète pour l'API d'envoi de notifications (serveur uniquement)
    adminEmail: '', // Email admin pour les notifications (serveur uniquement)
    supabaseServiceRoleKey: '', // Service role key Supabase (serveur uniquement)
    public: {
      siteUrl: 'https://clementRbl.github.io/mon-blog-ia',
      siteName: 'Clément Reboul',
      siteDescription: 'Blog personnel IA Engineering.',
      language: 'fr',
      // Configuration Supabase (chargée depuis .env en dev/build)
      supabaseUrl: '',
      supabaseAnonKey: '',
      // Configuration Web Push
      vapidPublicKey: ''
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
  },

  pwa: {
    registerType: 'autoUpdate',
    base: '/mon-blog-ia/',
    scope: '/mon-blog-ia/',
    manifest: {
      name: 'Blog IA Engineering - Clément Reboul',
      short_name: 'Blog IA',
      description: 'Blog personnel sur l\'intelligence artificielle et le machine learning',
      theme_color: '#Fdfbf7',
      background_color: '#Fdfbf7',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/mon-blog-ia/',
      start_url: '/mon-blog-ia/',
      lang: 'fr',
      icons: [
        {
          src: '/mon-blog-ia/images/logo.png',
          sizes: '1024x1024',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/mon-blog-ia/images/logo.png',
          sizes: '1024x1024',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: '/mon-blog-ia/images/logo.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/mon-blog-ia/images/logo.png',
          sizes: '192x192',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/mon-blog-ia/',
      globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,ico,woff,woff2}'],
      // Importer le script de gestion des push
      importScripts: ['/mon-blog-ia/push-handlers.js'],
      runtimeCaching: [
        {
          // Page d'accueil : toujours vérifier le réseau en premier
          urlPattern: /^https:\/\/clementRbl\.github\.io\/mon-blog-ia\/?$/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'blog-home',
            networkTimeoutSeconds: 3,
            expiration: {
              maxEntries: 1,
              maxAgeSeconds: 60 * 5 // 5 minutes seulement
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          // Autres pages du blog
          urlPattern: /^https:\/\/clementRbl\.github\.io\/mon-blog-ia\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'blog-pages',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 7 // 7 jours
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
          handler: 'NetworkOnly', // Toujours fetch le réseau pour les données fraîches
          options: {
            cacheName: 'supabase-api'
          }
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30 jours
            }
          }
        },
        {
          urlPattern: /\.(?:woff|woff2|ttf|eot)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'fonts',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 an
            }
          }
        }
      ]
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  }
})