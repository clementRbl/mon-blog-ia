# Déploiement Netlify SSR

Ce document explique comment déployer le blog en mode SSR (Server-Side Rendering) sur Netlify.

## ✅ Configuration SSR terminée

Le projet a été migré de SSG (Static Site Generation) vers SSR pour Netlify.

### Modifications effectuées

#### 1. Configuration Nuxt (`nuxt.config.ts`)

```typescript
// Activation du SSR
ssr: true

// Compatibility date pour Netlify Functions 2.0
compatibilityDate: '2024-05-07'

// Configuration Nitro (auto-détection Netlify)
nitro: {
  compatibilityDate: '2024-05-07',
}

// URLs mises à jour pour Netlify
site: {
  url: 'https://mon-blog-ia.netlify.app',
}

// baseURL changé de '/mon-blog-ia/' à '/'
app: {
  baseURL: '/',
}

// PWA paths sans préfixe
pwa: {
  base: '/',
  scope: '/',
  start_url: '/',
}
```

#### 2. Composants adaptés pour SSR

Ajout de guards `process.client` dans :

- `app/pages/index.vue` (IntersectionObserver, window events)
- `app/pages/blog/[...slug].vue` (navigator.share)
- `app/components/ShareButtons.vue` (window, navigator)
- `app/components/TableOfContents.vue` (IntersectionObserver)
- `app/components/PwaPrompt.vue` (localStorage, window)
- `app/components/IosInstallPrompt.vue` (localStorage, navigator)
- `app/components/InAppBrowserBanner.vue` (navigator, clipboard)
- `app/composables/useSupabase.ts` (persistSession avec localStorage)

#### 3. Configuration Netlify (`netlify.toml`)

```toml
[build]
  command = "npm run build"
  publish = "dist"  # Important: pas ".output/public"

[build.environment]
  NODE_VERSION = "20"
```

Nitro génère automatiquement :

- `/dist` → Assets statiques (public directory)
- `/.output/server` → Serverless functions (géré automatiquement)

## 🚀 Déploiement sur Netlify

### Option 1 : Via l'interface Netlify (recommandé)

1. **Connecter le repository GitHub**

   - Aller sur https://app.netlify.com
   - Cliquer sur "Add new site" → "Import an existing project"
   - Connecter GitHub et sélectionner `clementRbl/mon-blog-ia`

2. **Configuration automatique**

   - Netlify détecte automatiquement Nuxt 4
   - Build command : `npm run build` ✅
   - Publish directory : `dist` ✅
   - Node version : Lire depuis `netlify.toml` ✅

3. **Variables d'environnement**

   - Dans "Site settings" → "Environment variables", ajouter :
     ```
     NUXT_PUBLIC_SUPABASE_URL=<ton_url_supabase>
     NUXT_PUBLIC_SUPABASE_ANON_KEY=<ta_clé_anon>
     NUXT_SUPABASE_SERVICE_ROLE_KEY=<ta_service_role_key>
     NUXT_PUBLIC_VAPID_PUBLIC_KEY=<ta_clé_vapid_publique>
     NUXT_VAPID_PRIVATE_KEY=<ta_clé_vapid_privée>
     NUXT_ADMIN_KEY=<ta_clé_admin>
     NUXT_ADMIN_EMAIL=<ton_email_admin>
     ```

4. **Déployer**
   - Cliquer sur "Deploy site"
   - Le premier déploiement prend 2-3 minutes

### Option 2 : Via Netlify CLI

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter à Netlify
netlify login

# Initialiser le site
netlify init

# Déployer
netlify deploy --prod
```

## 📊 Différences SSG vs SSR

### Avant (SSG - GitHub Pages)

- ❌ Pages générées au build (31 routes statiques)
- ❌ Contenu figé jusqu'au prochain build
- ❌ baseURL `/mon-blog-ia/` (sous-dossier)
- ❌ Pas de fonctions serverless
- ✅ Hébergement gratuit GitHub Pages

### Après (SSR - Netlify)

- ✅ Pages générées à la demande (SSR)
- ✅ Contenu frais à chaque requête
- ✅ baseURL `/` (racine du domaine)
- ✅ API routes et serverless functions
- ✅ Netlify Functions 2.0 (streaming, blobs)
- ✅ Hébergement gratuit Netlify (125k requêtes/mois)

## 🔍 Vérifications post-déploiement

### Tests à effectuer

1. **Page d'accueil**

   - [ ] Articles s'affichent correctement
   - [ ] Animations vintage fonctionnent (signature, toasts)
   - [ ] Fleur de lys en background

2. **Pages articles**

   - [ ] URL propres sans `/mon-blog-ia/`
   - [ ] Contenu markdown rendu
   - [ ] Table des matières fonctionnelle
   - [ ] Boutons de partage (Twitter, LinkedIn, copier)

3. **PWA**

   - [ ] Service Worker installé
   - [ ] Prompt d'installation affiché
   - [ ] Notifications push fonctionnelles

4. **Admin**

   - [ ] Login fonctionne
   - [ ] Création/édition d'articles
   - [ ] Preview en temps réel

5. **SEO**
   - [ ] Meta tags corrects (Open Graph, Twitter)
   - [ ] Sitemap accessible sur `/sitemap.xml`
   - [ ] RSS feed sur `/feed.xml`
   - [ ] Robots.txt correct

### Commandes de test local

```bash
# Build SSR
npm run build

# Preview local (simule production)
npm run preview

# Ouvrir http://localhost:3000
```

## 🔧 Maintenance

### Mettre à jour le contenu

Avec SSR, deux options :

1. **Push sur GitHub** (recommandé)

   - Commit & push sur `main`
   - Netlify rebuild automatiquement
   - Nouveau contenu visible après 2-3 min

2. **Webhooks manuels**
   - Configurer un webhook Netlify
   - Appeler le webhook après update Supabase
   - Rebuild déclenché automatiquement

### Rollback

Si problème après déploiement :

```bash
# Via CLI
netlify rollback

# Via interface
# Site settings → Deploys → Click sur deploy précédent → "Publish deploy"
```

## 📝 Notes importantes

- ✅ **Pas de `generate`** : Ne plus utiliser `npm run generate`, uniquement `npm run build`
- ✅ **Output directory** : Nitro génère dans `.output/`, Netlify publie `dist/`
- ✅ **Edge Functions** : Si besoin, changer preset vers `netlify_edge` dans nitro config
- ✅ **ISR** : Pour cache hybride, utiliser `routeRules` avec `isr: true`

## 🔗 Ressources

- [Netlify Nuxt Documentation](https://docs.netlify.com/build/frameworks/framework-setup-guides/nuxt/)
- [Nitro Netlify Deployment](https://nitro.build/deploy/providers/netlify)
- [Netlify Functions 2.0](https://docs.netlify.com/functions/overview/)
