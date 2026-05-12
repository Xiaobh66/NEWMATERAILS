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
  // === 以下源待验证后启用 ===
  // {
  //   id: 'ggbond',
  //   name: '高工锂电',
  //   type: 'rss',
  //   enabled: false,
  //   feedUrl: 'https://rsshub.app/ggbond/news',
  //   defaultCategory: 'company',
  //   aiContext: '高工锂电是锂电池行业权威媒体',
  // },
  // {
  //   id: 'icviews',
  //   name: '半导体行业观察',
  //   type: 'rss',
  //   enabled: false,
  //   feedUrl: 'https://rsshub.app/icviews/news',
  //   defaultCategory: 'company',
  //   aiContext: '半导体行业观察，涵盖半导体材料产业链',
  // },
]
