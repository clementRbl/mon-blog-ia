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
  const currentDate = new Date().toUTCString()
  
  // Récupérer tous les articles publiés
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .order('date', { ascending: false })
    .limit(20)
  
  // Générer le flux RSS
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Blog IA Engineering - Clément Reboul</title>
    <link>${baseUrl}</link>
    <description>Blog personnel sur l'intelligence artificielle, le machine learning et l'ingénierie IA</description>
    <language>fr-FR</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <copyright>© 2025 Clément Reboul</copyright>
    <managingEditor>clement@example.com (Clément Reboul)</managingEditor>
    <webMaster>clement@example.com (Clément Reboul)</webMaster>
    <category>Technology</category>
    <category>Artificial Intelligence</category>
    <category>Machine Learning</category>
    
    ${articles?.map(article => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${baseUrl}/blog/${article.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${article.slug}</guid>
      <description><![CDATA[${article.description}]]></description>
      <content:encoded><![CDATA[${article.content}]]></content:encoded>
      <dc:creator>Clément Reboul</dc:creator>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      ${article.tags?.map((tag: string) => `<category>${tag}</category>`).join('\n      ') || ''}
    </item>`).join('') || ''}
    
  </channel>
</rss>`
  
  event.node.res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  return rss
})
