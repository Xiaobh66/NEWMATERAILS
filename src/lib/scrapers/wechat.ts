import { ScrapedArticle } from './types'

interface WeChatConfig {
  name: string
  wechatId?: string
  feedUrl?: string
}

export async function scrapeWeChat(config: WeChatConfig): Promise<ScrapedArticle[]> {
  // MVP: use RSS bridge services (wechat2rss, WeRSS, etc.)
  if (config.feedUrl) {
    const { scrapeRss } = await import('./rss')
    return scrapeRss(config.feedUrl, config.name)
  }

  console.warn(`WeChat source ${config.name} has no feedUrl configured, skipping`)
  return []
}
