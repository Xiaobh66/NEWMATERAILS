'use client'

import { Article } from '@/lib/types'

interface AdminArticleRowProps {
  article: Article
  onStatusChange: (id: number, status: string) => void
  onDelete: (id: number) => void
}

function parseTags(tags: string): string[] {
  try {
    return JSON.parse(tags)
  } catch {
    return []
  }
}

export default function AdminArticleRow({ article, onStatusChange, onDelete }: AdminArticleRowProps) {
  const tags = parseTags(article.tags)

  const statusColors = {
    draft: 'bg-gray-100 text-gray-600',
    pending: 'bg-yellow-100 text-yellow-700',
    published: 'bg-green-100 text-green-700',
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[article.status]}`}>
              {article.status}
            </span>
            <span className="text-xs text-gray-500">{article.source}</span>
          </div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {article.title}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {article.summary}
          </p>
          <div className="flex gap-1 mt-2">
            {tags.map((tag, i) => (
              <span key={i} className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          {article.status === 'pending' && (
            <>
              <button
                onClick={() => onStatusChange(article.id, 'published')}
                className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
              >
                通过
              </button>
              <button
                onClick={() => onStatusChange(article.id, 'draft')}
                className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                驳回
              </button>
            </>
          )}
          <button
            onClick={() => onDelete(article.id)}
            className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  )
}
