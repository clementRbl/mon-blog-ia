-- Optimisation des index pour les requêtes SSR
-- Cette migration améliore les performances de la page d'accueil

-- Index composite pour la requête principale (published + date)
-- Remplace les deux index séparés pour une performance optimale
CREATE INDEX IF NOT EXISTS idx_articles_published_date 
  ON public.articles(published, date DESC)
  WHERE published = true;

-- Statistiques pour le query planner
ANALYZE public.articles;

-- Note: Cet index composite optimise spécifiquement :
-- SELECT * FROM articles WHERE published = true ORDER BY date DESC
-- Gain attendu: 20-40% sur les requêtes de listing
