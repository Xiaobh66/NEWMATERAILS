import { Article } from '@/lib/types'

interface ArticleCardProps {
  article: Article
}

function parseTags(tags: string): string[] {
  try {
    return JSON.parse(tags)
  } catch {
    return []
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const tags = parseTags(article.tags)
  const time = formatDate(article.publishedAt)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
        <span>{time}</span>
        <span className="text-gray-300">|</span>
        <span>{article.source}</span>
      </div>

      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 leading-snug">
        {article.title}
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
        {article.summary}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="px-2 py-0.5 text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {article.editorNote && (
        <div className="text-sm text-gray-500 dark:text-gray-400 italic border-t border-gray-100 dark:border-gray-700 pt-2">
          推荐理由: {article.editorNote}
        </div>
      )}
    </div>
  )
}
