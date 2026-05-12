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

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const tags = parseTags(article.tags)
  const time = formatTime(article.publishedAt)

  return (
    <div className="group relative">
      <div className="flex gap-4">
        {/* 时间 */}
        <div className="flex-shrink-0 w-12 text-right">
          <span className="text-sm text-gray-400 dark:text-gray-500 font-mono">
            {time}
          </span>
        </div>

        {/* 内容卡片 */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:border-primary-200 dark:hover:border-primary-800">
          {/* 来源和标签 */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded">
              {article.source}
            </span>
            {tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 标题 */}
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {article.title}
            </a>
          </h3>

          {/* 摘要 */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed line-clamp-2">
            {article.summary}
          </p>

          {/* 推荐理由 */}
          {article.editorNote && (
            <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded p-3 border-l-2 border-primary-400">
              <span className="font-medium text-primary-600 dark:text-primary-400">推荐理由:</span>{' '}
              {article.editorNote}
            </div>
          )}

          {/* 底部元信息 */}
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 dark:text-gray-500">
            <span>{formatDate(article.publishedAt)}</span>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-500 transition-colors"
            >
              原文链接 →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
