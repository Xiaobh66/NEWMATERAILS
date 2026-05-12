'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Timeline from '@/components/Timeline'
import { Article } from '@/lib/types'

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (category !== 'all') params.set('category', category)
    if (search) params.set('search', search)

    fetch(`/api/articles?${params}`)
      .then(res => res.json())
      .then(data => setArticles(data))
  }, [category, search])

  return (
    <>
      <Header
        activeCategory={category}
        onCategoryChange={setCategory}
        onSearch={setSearch}
      />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            精选资讯
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            AI 自动挑选的高价值内容
          </p>
        </div>
        <Timeline articles={articles} />
      </main>
    </>
  )
}
