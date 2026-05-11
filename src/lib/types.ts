export interface Article {
  id: number
  title: string
  summary: string
  source: string
  sourceUrl: string
  category: 'daily' | 'company' | 'policy'
  tags: string
  editorNote: string
  publishedAt: string
  status: 'draft' | 'pending' | 'published'
  createdAt: string
  updatedAt: string
}

export type ArticleInput = Omit<Article, 'id' | 'createdAt' | 'updatedAt'>

export interface ArticleFilters {
  category?: string
  status?: string
  search?: string
  date?: string
}
