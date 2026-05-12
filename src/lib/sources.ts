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
  {
    id: 'cls',
    name: '财联社',
    type: 'rss',
    enabled: false,
    feedUrl: 'https://rsshub.app/cls/telegraph',
    defaultCategory: 'daily',
    aiContext: `财联社电报快讯，筛选与新材料行业相关的快讯。
关键词：新材料、碳纤维、锂电池、固态电池、半导体材料、稀土、石墨烯、高分子、复合材料、合金、电池材料、光伏材料、碳化硅、氮化镓。
跳过：股市行情、金融政策、房地产、医药、消费电子。`,
  },
  {
    id: 'xcl',
    name: '新材料在线',
    type: 'rss',
    enabled: false,
    feedUrl: 'https://rsshub.app/xcl/news',
    defaultCategory: 'daily',
    aiContext: `新材料行业垂直媒体，保留所有文章。这是专业的新材料行业资讯来源。`,
  },
  {
    id: 'miit',
    name: '工信部',
    type: 'web',
    enabled: false,
    url: 'https://www.miit.gov.cn/',
    listSelector: '.article-list li',
    titleSelector: 'a',
    linkSelector: 'a',
    dateSelector: '.date',
    defaultCategory: 'policy',
    aiContext: `工信部官网，筛选与新材料产业政策相关的文章。
关键词：新材料、先进材料、半导体材料、新能源材料、碳纤维、锂电池、稀土、战略性新兴产业。`,
  },
  {
    id: 'ndrc',
    name: '发改委',
    type: 'web',
    enabled: false,
    url: 'https://www.ndrc.gov.cn/',
    listSelector: '.list-con li',
    titleSelector: 'a',
    linkSelector: 'a',
    dateSelector: '.date',
    defaultCategory: 'policy',
    aiContext: `发改委官网，筛选与新材料产业政策相关的文章。
关键词：新材料、先进材料、战略性新兴产业、新能源材料、半导体材料。`,
  },
  {
    id: 'gov',
    name: '国务院',
    type: 'web',
    enabled: false,
    url: 'https://www.gov.cn/',
    listSelector: '.news_list li',
    titleSelector: 'a',
    linkSelector: 'a',
    dateSelector: '.date',
    defaultCategory: 'policy',
    aiContext: `国务院官网，筛选与新材料产业政策相关的文章。
关键词：新材料、先进制造业、战略性新兴产业、新能源、半导体。`,
  },
  {
    id: 'caixin',
    name: '财新',
    type: 'rss',
    enabled: false,
    feedUrl: 'https://rsshub.app/caixin/latest',
    defaultCategory: 'daily',
    aiContext: `财新网，筛选与新材料行业相关的深度报道。
关键词：新材料、半导体材料、新能源材料、碳纤维、锂电池、稀土、产业政策。
跳过：宏观经济、房地产、金融监管、消费、医疗。`,
  },
]
