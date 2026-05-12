import * as cheerio from 'cheerio'
import { ScrapedArticle } from './types'

interface WebScrapeConfig {
  url: string
  sourceName: string
  listSelector: string
  titleSelector?: string
  linkSelector?: string
  dateSelector?: string
  summarySelector?: string
}

export async function scrapeWeb(config: WebScrapeConfig): Promise<ScrapedArticle[]> {
  const response = await fetch(config.url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewMaterialsBot/1.0)' },
  })
  const html = await response.text()
  const $ = cheerio.load(html)
  const articles: ScrapedArticle[] = []

  $(config.listSelector).each((_, el) => {
    const $el = $(el)
    const title = config.titleSelector
      ? $el.find(config.titleSelector).text().trim()
      : $el.text().trim()

    const linkEl = config.linkSelector ? $el.find(config.linkSelector) : $el
    const href = linkEl.attr('href') || ''
    const url = href.startsWith('http') ? href : new URL(href, config.url).toString()

    const dateStr = config.dateSelector ? $el.find(config.dateSelector).text().trim() : undefined
    const summary = config.summarySelector ? $el.find(config.summarySelector).text().trim() : undefined

    if (title && url) {
      articles.push({
        title,
        url,
        content: summary,
        publishedAt: dateStr ? new Date(dateStr).toISOString() : undefined,
        source: config.sourceName,
      })
    }
  })

  return articles
}
