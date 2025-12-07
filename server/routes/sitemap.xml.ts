import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/supabase'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // Créer le client Supabase côté serveur
  const supabase = createClient<Database>(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey
  )
  
  const baseUrl = 'https://clementRbl.github.io/mon-blog-ia'
  const currentDate = new Date().toISOString().split('T')[0]
  
  // Récupérer tous les articles publiés
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, date, updated_at')
    .eq('published', true)
    .order('date', { ascending: false })
  
  // Récupérer tous les tags uniques
  const { data: allArticles } = await supabase
    .from('articles')
    .select('tags')
    .eq('published', true)
  
  const uniqueTags = new Set<string>()
  allArticles?.forEach(article => {
    article.tags?.forEach((tag: string) => {
      uniqueTags.add(tag)
    })
  })
  
  // Fonction slugify
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
  
  // Générer le XML du sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  
  <!-- Page d'accueil -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Page des tags -->
  <url>
    <loc>${baseUrl}/tags</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Articles -->
  ${articles?.map(article => `
  <url>
    <loc>${baseUrl}/blog/${article.slug}</loc>
    <lastmod>${article.updated_at || article.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`).join('') || ''}
  
  <!-- Pages de tags -->
  ${Array.from(uniqueTags).map(tag => `
  <url>
    <loc>${baseUrl}/tags/${slugify(tag)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('') || ''}
  
</urlset>`
  
  event.node.res.setHeader('Content-Type', 'application/xml')
  return sitemap
})
