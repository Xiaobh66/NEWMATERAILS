import RssParser from 'rss-parser'
import { ScrapedArticle } from './types'

const parser = new RssParser()

export async function scrapeRss(feedUrl: string, sourceName: string): Promise<ScrapedArticle[]> {
  const feed = await parser.parseURL(feedUrl)
  return feed.items
    .map(item => ({
      title: item.title || '',
      url: item.link || '',
      content: item.contentSnippet || item.content || '',
      publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : undefined,
      source: sourceName,
    }))
    .filter(a => a.title && a.url)
}
