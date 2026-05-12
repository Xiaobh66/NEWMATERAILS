export type SourceType = 'rss' | 'web' | 'wechat'

export interface ScrapeSource {
  id: string
  name: string
  type: SourceType
  enabled: boolean

  // RSS
  feedUrl?: string

  // Web (cheerio)
  url?: string
  listSelector?: string
  titleSelector?: string
  linkSelector?: string
  dateSelector?: string
  summarySelector?: string

  // WeChat
  wechatId?: string

  // AI hints
  defaultCategory: 'daily' | 'company' | 'policy'
  aiContext?: string
}

export const sources: ScrapeSource[] = [
  {
    id: '36kr',
    name: '36氪',
    type: 'rss',
    enabled: true,
    feedUrl: 'https://36kr.com/feed',
    defaultCategory: 'daily',
    aiContext: '36氪科技财经媒体，筛选与新材料、新能源、半导体、碳纤维、锂电池、稀土、固态电池相关的内容。与新材料无关的文章跳过（如娱乐、纯金融等）。',
  },
  {
    id: 'ithome',
    name: 'IT之家',
    type: 'rss',
    enabled: true,
    feedUrl: 'https://www.ithome.com/rss/',
    defaultCategory: 'daily',
    aiContext: 'IT之家科技媒体，筛选与新材料、半导体材料、新能源材料、碳纤维、锂电池、稀土、光伏材料相关的内容。与新材料无关的文章跳过。',
  },
]
