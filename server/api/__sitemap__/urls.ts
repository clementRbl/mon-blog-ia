import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/supabase'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  
  // Créer le client Supabase côté serveur
  const supabase = createClient<Database>(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey
  )
  
  const baseUrl = 'https://clementreboul.netlify.app'
  
  // Récupérer tous les articles publiés
  const { data: articles, error: articlesError } = await supabase
    .from('articles')
    .select('slug, date, updated_at')
    .eq('published', true)
    .order('date', { ascending: false })
  
  if (articlesError) {
    console.error('Erreur Supabase articles:', articlesError)
  }
  console.log('Articles trouvés:', articles?.length || 0)
  
  // Récupérer tous les tags uniques
  const { data: allArticles, error: tagsError } = await supabase
    .from('articles')
    .select('tags')
    .eq('published', true)
  
  if (tagsError) {
    console.error('Erreur Supabase tags:', tagsError)
  }
  
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
  
  const urls = [
    // Page d'accueil
    {
      loc: baseUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0
    },
    // Page des tags
    {
      loc: `${baseUrl}/tags`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8
    },
    // Articles
    ...(articles?.map(article => ({
      loc: `${baseUrl}/blog/${article.slug}`,
      lastmod: article.updated_at || article.date,
      changefreq: 'monthly' as const,
      priority: 0.9
    })) || []),
    // Pages de tags
    ...Array.from(uniqueTags).map(tag => ({
      loc: `${baseUrl}/tags/${slugify(tag)}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly' as const,
      priority: 0.7
    }))
  ]
  
  return urls
})
