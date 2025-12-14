// Script pour pré-générer les routes depuis Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function getPrerenderRoutes() {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase credentials not found, skipping prerender routes')
    return []
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Récupérer tous les articles publiés
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('slug, tags')
      .eq('published', true)
      .order('date', { ascending: false })
    
    if (articlesError) throw articlesError

    const routes: string[] = [
      '/',
      '/tags',
      '/admin',
      '/admin/login'
    ]

    // Extraire tous les tags uniques
    const allTags = new Set<string>()
    
    // Ajouter les routes d'articles et collecter les tags
    if (articles && articles.length > 0) {
      articles.forEach(article => {
        routes.push(`/blog/${article.slug}`)
        
        if (article.tags && Array.isArray(article.tags)) {
          article.tags.forEach(tag => allTags.add(tag))
        }
      })
      
      // Ajouter les routes de tags
      allTags.forEach(tag => {
        routes.push(`/tags/${tag}`)
      })
    }

    console.log(`✅ ${routes.length} routes à pré-générer:`)
    console.log(`   - ${articles?.length || 0} articles`)
    console.log(`   - ${allTags.size} tags`)
    
    return routes
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des routes:', error)
    return ['/', '/tags', '/admin', '/admin/login']
  }
}
