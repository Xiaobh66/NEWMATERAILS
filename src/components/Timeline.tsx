import { Article } from '@/lib/types'
import ArticleCard from './ArticleCard'

interface TimelineProps {
  articles: Article[]
}

function groupByDate(articles: Article[]): Map<string, Article[]> {
  const groups = new Map<string, Article[]>()
  for (const article of articles) {
    const date = new Date(article.publishedAt)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    let dateKey: string
    if (date.toDateString() === today.toDateString()) {
      dateKey = '今天'
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = '昨天'
    } else {
      dateKey = date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
    }

    if (!groups.has(dateKey)) {
      groups.set(dateKey, [])
    }
    groups.get(dateKey)!.push(article)
  }
  return groups
}

export default function Timeline({ articles }: TimelineProps) {
  const grouped = groupByDate(articles)

  if (articles.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        <div className="text-4xl mb-4">📰</div>
        <p>暂无资讯</p>
        <p className="text-sm mt-2">等待新内容抓取...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {Array.from(grouped.entries()).map(([date, dateArticles]) => (
        <div key={date}>
          {/* 日期标题 */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-500" />
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {date}
              </h2>
            </div>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {dateArticles.length} 条
            </span>
          </div>

          {/* 文章列表 */}
          <div className="space-y-3">
            {dateArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
