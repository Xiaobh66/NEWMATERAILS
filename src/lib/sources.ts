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
    aiContext: `严格筛选标准：只保留与新材料行业直接相关的文章。
必须包含以下关键词之一：碳纤维、锂电池、固态电池、半导体材料、稀土、石墨烯、高分子、生物基材料、复合材料、合金、涂层、薄膜、电池材料、电解质、正负极、隔膜、光伏材料、LED材料、OLED材料、柔性显示、碳化硅、氮化镓、第三代半导体、新材料、先进材料、功能材料、结构材料、覆铜板、PCB、光刻胶、电子化学品、电解液、隔膜、铜箔、铝箔、钛合金、高温合金、粉末冶金、3D打印材料。
明确跳过：纯金融/股市、娱乐、消费电子、汽车整车、互联网平台、AI应用、生物医药（除非涉及材料）、房产、教育、招聘、机器人（除非涉及材料）、无人机（除非涉及材料）、创业融资（除非明确涉及新材料）、消费级产品。
如果文章与新材料无关，返回空数组。`,
  },
]
