import { sources } from './sources'
import { scrapeRss } from './scrapers/rss'
import { scrapeWeb } from './scrapers/web'
import { scrapeWeChat } from './scrapers/wechat'
import { analyzeArticle } from './ai'
import { createArticle, findArticleByUrl } from './db'
import type { ScrapedArticle } from './scrapers/types'
import type { ArticleInput } from './types'

interface ScrapeResult {
  source: string
  scraped: number
  new: number
  duplicates: number
  errors: string[]
}

export async function runScrape(): Promise<{ results: ScrapeResult[] }> {
  const results: ScrapeResult[] = []

  for (const source of sources.filter(s => s.enabled)) {
    const result: ScrapeResult = {
      source: source.name,
      scraped: 0,
      new: 0,
      duplicates: 0,
      errors: [],
    }

    try {
      let articles: ScrapedArticle[]

      switch (source.type) {
        case 'rss':
          articles = await scrapeRss(source.feedUrl!, source.name)
          break
        case 'web':
          articles = await scrapeWeb({
            url: source.url!,
            sourceName: source.name,
            listSelector: source.listSelector!,
            titleSelector: source.titleSelector,
            linkSelector: source.linkSelector,
            dateSelector: source.dateSelector,
            summarySelector: source.summarySelector,
          })
          break
        case 'wechat':
          articles = await scrapeWeChat({ name: source.name, feedUrl: source.feedUrl })
          break
        default:
          articles = []
      }

      result.scraped = articles.length

      for (const article of articles) {
        try {
          if (await findArticleByUrl(article.url)) {
            result.duplicates++
            continue
          }

          const aiResult = await analyzeArticle(article, source.aiContext)

          // 跳过与新材料无关的文章（AI返回空标签）
          if (!aiResult.tags || aiResult.tags.length === 0) {
            result.duplicates++
            continue
          }

          const input: ArticleInput = {
            title: aiResult.title,
            summary: aiResult.summary,
            source: article.source,
            sourceUrl: article.url,
            category: aiResult.category,
            tags: JSON.stringify(aiResult.tags),
            editorNote: '',
            publishedAt: article.publishedAt || new Date().toISOString(),
            status: 'pending',
          }

          await createArticle(input)
          result.new++
        } catch (err) {
          result.errors.push(`Article "${article.title}": ${String(err)}`)
        }
      }
    } catch (err) {
      result.errors.push(`Source-level error: ${String(err)}`)
    }

    results.push(result)
  }

  return { results }
}
