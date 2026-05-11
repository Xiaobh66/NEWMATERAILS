'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Timeline from '@/components/Timeline'
import { Article } from '@/lib/types'

interface CategoryPageProps {
  category: string
  title: string
  description: string
}

export default function CategoryPage({ category, title, description }: CategoryPageProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('category', category)
    if (search) params.set('search', search)

    fetch(`/api/articles?${params}`)
      .then(res => res.json())
      .then(data => setArticles(data))
  }, [category, search])

  return (
    <>
      <Header
        activeCategory={category}
        onCategoryChange={() => {}}
        onSearch={setSearch}
      />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <Timeline articles={articles} />
      </main>
    </>
  )
}
