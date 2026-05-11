import { Article } from '@/lib/types'
import ArticleCard from './ArticleCard'

interface TimelineProps {
  articles: Article[]
}

function groupByDate(articles: Article[]): Map<string, Article[]> {
  const groups = new Map<string, Article[]>()
  for (const article of articles) {
    const date = new Date(article.publishedAt).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    if (!groups.has(date)) {
      groups.set(date, [])
    }
    groups.get(date)!.push(article)
  }
  return groups
}

export default function Timeline({ articles }: TimelineProps) {
  const grouped = groupByDate(articles)

  if (articles.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        暂无资讯
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {Array.from(grouped.entries()).map(([date, dateArticles]) => (
        <div key={date}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{date}</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>
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
