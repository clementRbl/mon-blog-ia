// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  
  compatibilityDate: '2024-05-07',
  devtools: { enabled: true },

  // Active le SSR (Server-Side Rendering)
  ssr: true,

  experimental: {
    payloadExtraction: false,
    viewTransition: true
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
    url: 'https://clementreboul.netlify.app', // URL Netlify
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
        image: '/images/og-image-social.png'
      }
    }
  },

  sitemap: {
    enabled: true,
    sources: [
      '/api/__sitemap__/urls'
    ]
  },

  robots: {
    robotsTxt: false // Désactiver la génération automatique car on a déjà robots.txt
  },

  // Configuration Nitro pour Netlify (auto-détection)
  nitro: {
    compatibilityDate: '2024-05-07',
    compressPublicAssets: true,
    minify: true
  },

  // Route Rules pour cache SSR optimisé
  routeRules: {
    // Page d'accueil : 10 minutes (nouveaux articles apparaissent rapidement)
    '/': { 
      swr: 600,
      cache: {
        maxAge: 600,
        staleMaxAge: 1200 // 20 min en mode stale (si serveur down)
      }
    },
    
    // Articles individuels : 30 minutes (ne changent jamais après publication)
    '/blog/**': { 
      swr: 1800,
      cache: {
        maxAge: 1800,
        staleMaxAge: 3600 // 1h en mode stale
      }
    },
    
    // Pages de tags : 5 minutes (changent plus souvent)
    '/tags/**': { 
      swr: 300,
      cache: {
        maxAge: 300,
        staleMaxAge: 600 // 10 min en mode stale
      }
    },

    // API comments : pas de cache (données en temps réel)
    '/api/comments/**': { cache: false },
    
    // Admin : jamais de cache
    '/admin/**': { 
      cache: false,
      ssr: true 
    },

    // Assets statiques : cache long
    '/_nuxt/**': { 
      cache: {
        maxAge: 31536000 // 1 an (avec hash dans le nom de fichier)
      }
    }
  },

  // --- Configuration pour Netlify (pas de baseURL) ---
  app: {
    baseURL: '/', 
    head: {
      htmlAttrs: {
        lang: 'fr'
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'google-site-verification', content: 'tg8CdhDjNK7PnB_T95GUxGmpFO7MconWYqf7Xh_c3Ug' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#Fdfbf7' },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'googlebot', content: 'index, follow' },
        // iOS PWA Support
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Blog IA' },
        // Open Graph
        { property: 'og:image', content: 'https://clementreboul.netlify.app/images/og-image-social.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://clementreboul.netlify.app/images/og-image-social.png' },
        // Confidentialité et sécurité
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        { name: 'referrer', content: 'strict-origin-when-cross-origin' },
      ],
      link: [
        // Preconnect pour réduire la latence
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        { rel: 'dns-prefetch', href: 'https://cloud.umami.is' },
        { rel: 'dns-prefetch', href: 'https://gqkjpflpqghujliqkzts.supabase.co' },
        // Favicons
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
      ],
      script: [
        // Script inline pour éviter le flash blanc en dark mode (DOIT être en premier)
        {
          innerHTML: `
            (function() {
              const stored = document.cookie.split('; ').find(row => row.startsWith('darkMode='))?.split('=')[1];
              if (stored === 'true') {
                document.documentElement.classList.add('dark');
              } else if (stored === undefined && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
              }
            })();
          `,
          type: 'text/javascript'
        },
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
      siteUrl: 'https://clementreboul.netlify.app',
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
    ],
    defaults: {
      preload: true,
      fallbacks: {
        'serif': ['Georgia', 'Times New Roman'],
        'sans-serif': ['Arial', 'Helvetica'],
        'monospace': ['Courier New', 'monospace']
      }
    }
  },

  pwa: {
    registerType: 'autoUpdate',
    base: '/',
    scope: '/',
    manifest: {
      name: 'Blog IA Engineering - Clément Reboul',
      short_name: 'Blog IA',
      description: 'Blog personnel sur l\'intelligence artificielle et le machine learning',
      theme_color: '#Fdfbf7',
      background_color: '#Fdfbf7',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/?standalone=true',
      lang: 'fr',
      icons: [
        {
          src: '/images/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/images/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/images/icon-maskable-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: '/images/icon-maskable-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ],
      screenshots: [
        {
          src: '/images/og-image-social.png',
          sizes: '1200x630',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      cleanupOutdatedCaches: true,
      skipWaiting: true,
      clientsClaim: true,
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,ico,woff,woff2}'],
      // Importer le script de gestion des push
      importScripts: ['/push-handlers.js'],
      runtimeCaching: [
        {
          // Page d'accueil : toujours vérifier le réseau en premier
          urlPattern: ({ url }) => url.pathname === '/',
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
          // Autres pages du blog (SSR)
          urlPattern: ({ url, request }) => request.mode === 'navigate',
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
  },

  // Optimisation Vite pour réduire le JS/CSS non utilisé
  vite: {
    build: {
      cssCodeSplit: true,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', 'vue-router'],
            'supabase': ['@supabase/supabase-js'],
            'icons': ['@iconify/vue'],
            'utils': ['marked', 'fuse.js']
          }
        }
      }
    }
  },

  // Configuration image optimization
  image: {
    format: ['webp', 'avif'],
    quality: 80,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  }
})