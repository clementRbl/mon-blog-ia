# Déploiement GitHub Pages

Ce document explique comment déployer le blog sur GitHub Pages.

## ✅ Configuration actuelle

Le projet est **prêt pour le déploiement** avec :

### GitHub Pages

- ✅ Workflow GitHub Actions configuré (`.github/workflows/deploy.yml`)
- ✅ `baseURL` configuré pour `/mon-blog-ia/`
- ✅ Site URL : `https://clementRbl.github.io/mon-blog-ia`

### SEO

- ✅ Meta tags optimisés (description, robots, theme-color, etc.)
- ✅ Sitemap.xml généré automatiquement
- ✅ Robots.txt configuré
- ✅ Favicon personnalisé (initiales CR)
- ✅ Open Graph metadata
- ✅ Langue : Français (fr)
- ✅ Google fonts : Playfair Display, Lora, JetBrains Mono

### Contenu

- ✅ 5 articles avec sources réelles et vérifiables
- ✅ Système de tags fonctionnel
- ✅ Design vintage/papier vieilli
- ✅ Responsive design

## 🚀 Étapes de déploiement

### 1. Activer GitHub Pages

1. Aller sur https://github.com/clementRbl/mon-blog-ia/settings/pages
2. Dans "Build and deployment" :
   - **Source** : GitHub Actions
3. Sauvegarder

### 2. Push vers GitHub

```bash
# Ajouter tous les fichiers
git add .

# Commit
git commit -m "feat: blog IA prêt pour déploiement avec 5 articles sourcés"

# Push vers main
git push origin main
```

### 3. Vérification du déploiement

1. Aller dans l'onglet "Actions" : https://github.com/clementRbl/mon-blog-ia/actions
2. Attendre que le workflow "Deploy to GitHub Pages" se termine (2-3 minutes)
3. Une fois ✅ vert, le site est accessible sur : **https://clementRbl.github.io/mon-blog-ia/**

## 🔧 Commandes utiles

```bash
# Développement local
npm run dev

# Build de production
npm run generate

# Preview du build
npx serve .output/public
```

## 📊 Statistiques SEO

- **Pages pré-rendues** : 53 routes
- **Articles** : 5
- **Pages de tags** : 15+
- **Sitemap** : ✅ Généré
- **Robots.txt** : ✅ Configuré
- **Meta descriptions** : ✅ Sur toutes les pages

## 🎯 Vérifications post-déploiement

Après le premier déploiement, vérifier :

1. **Accessibilité** : https://clementRbl.github.io/mon-blog-ia/
2. **Sitemap** : https://clementRbl.github.io/mon-blog-ia/sitemap.xml
3. **Robots.txt** : https://clementRbl.github.io/mon-blog-ia/robots.txt
4. **Articles** : Navigation et affichage correct
5. **Tags** : Filtrage fonctionnel

## 🔍 Indexation Google

Pour accélérer l'indexation :

1. Aller sur [Google Search Console](https://search.google.com/search-console)
2. Ajouter la propriété : `https://clementRbl.github.io/mon-blog-ia`
3. Soumettre le sitemap : `https://clementRbl.github.io/mon-blog-ia/sitemap.xml`

## 📝 Notes

- Le déploiement est **automatique** à chaque push sur `main`
- La génération prend environ **2 minutes**
- Les fonts Google sont **téléchargées et cachées** pour de meilleures performances
- Le mode production **minifie** CSS et JS automatiquement
