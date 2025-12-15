import { createClient } from '@supabase/supabase-js'
import { writeFileSync, readFileSync } from 'fs'
import { resolve } from 'path'
import type { Database } from '../types/supabase'

// Charger les variables d'environnement depuis .env
const envPath = resolve(process.cwd(), '.env')
try {
  const envContent = readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/^["']|["']$/g, '')
      process.env[key] = value
    }
  })
} catch (error) {
  console.warn('⚠️  Fichier .env non trouvé, utilisation des variables d\'environnement système')
}

// Configuration Supabase depuis les variables d'environnement
const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  process.exit(1)
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey)
const baseUrl = 'https://clementreboul.netlify.app'

// Fonction slugify
const slugify = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function generateSitemap() {
  console.log('🔄 Génération du sitemap...')

  try {
    // Récupérer tous les articles publiés
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('slug, date, updated_at')
      .eq('published', true)
      .order('date', { ascending: false })

    if (articlesError) {
      console.error('❌ Erreur Supabase articles:', articlesError)
      throw articlesError
    }

    // Récupérer tous les tags uniques
    const { data: allArticles, error: tagsError } = await supabase
      .from('articles')
      .select('tags')
      .eq('published', true)

    if (tagsError) {
      console.error('❌ Erreur Supabase tags:', tagsError)
      throw tagsError
    }

    const uniqueTags = new Set<string>()
    allArticles?.forEach(article => {
      article.tags?.forEach((tag: string) => {
        uniqueTags.add(tag)
      })
    })

    // Construire le XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    // Page d'accueil
    xml += `  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>\n`

    // Page des tags
    xml += `  <url>
    <loc>${baseUrl}/tags</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`

    // Articles
    articles?.forEach(article => {
      const lastmod = article.updated_at || article.date
      xml += `  <url>
    <loc>${baseUrl}/blog/${article.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>\n`
    })

    // Pages de tags
    Array.from(uniqueTags).forEach(tag => {
      xml += `  <url>
    <loc>${baseUrl}/tags/${slugify(tag)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`
    })

    xml += '</urlset>'

    // Écrire le fichier
    const outputPath = resolve(process.cwd(), 'public', 'sitemap.xml')
    writeFileSync(outputPath, xml, 'utf-8')

    console.log(`✅ Sitemap généré avec succès!`)
    console.log(`   - ${articles?.length || 0} articles`)
    console.log(`   - ${uniqueTags.size} tags`)
    console.log(`   - Total: ${(articles?.length || 0) + uniqueTags.size + 2} URLs`)
    console.log(`   - Fichier: ${outputPath}`)
  } catch (error) {
    console.error('❌ Erreur lors de la génération du sitemap:', error)
    process.exit(1)
  }
}

generateSitemap()
