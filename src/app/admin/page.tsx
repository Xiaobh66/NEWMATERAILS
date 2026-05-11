'use client'

import { useState, useEffect } from 'react'
import AdminArticleRow from '@/components/AdminArticleRow'
import { Article } from '@/lib/types'

type StatusFilter = 'pending' | 'published' | 'draft' | 'all'

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending')

  const fetchArticles = () => {
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.set('status', statusFilter)
    fetch(`/api/articles?${params}`)
      .then(res => res.json())
      .then(data => setArticles(data))
  }

  useEffect(() => {
    fetchArticles()
  }, [statusFilter])

  const handleStatusChange = async (id: number, status: string) => {
    await fetch(`/api/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchArticles()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除？')) return
    await fetch(`/api/articles/${id}`, { method: 'DELETE' })
    fetchArticles()
  }

  const tabs: { key: StatusFilter; label: string; count: number }[] = [
    { key: 'pending', label: '待审核', count: articles.length },
    { key: 'published', label: '已发布', count: 0 },
    { key: 'draft', label: '草稿', count: 0 },
  ]

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 text-sm rounded-lg ${
              statusFilter === tab.key
                ? 'bg-primary-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {articles.length === 0 ? (
          <p className="text-center py-8 text-gray-500">暂无内容</p>
        ) : (
          articles.map((article) => (
            <AdminArticleRow
              key={article.id}
              article={article}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}
