import OpenAI from 'openai'

const client = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
})

interface AIResult {
  title: string
  summary: string
  category: 'daily' | 'company' | 'policy'
  tags: string[]
}

interface RawArticle {
  title: string
  content?: string
  url: string
  source: string
}

const SYSTEM_PROMPT = `你是一个新材料行业资讯编辑。你的任务是：

1. 将文章标题精简为适合资讯卡片展示的短标题（15-25字）
2. 生成一句话摘要（50-80字），突出核心信息
3. 判断分类：daily（行业快讯）、company（企业动态）、policy（政策解读）
4. 生成 3-5 个标签，从以下类别中选择：
   - 材料类型：碳纤维、锂电池材料、半导体材料、高分子、稀土、石墨烯、固态电池材料、生物基材料
   - 应用领域：新能源、航空航天、电子信息、生物医药、汽车
   - 事件类型：融资、政策、技术突破、产品发布、合作签约、价格变动、产能扩张

以 JSON 格式返回，不要包含 markdown 代码块标记。格式：
{"title":"...","summary":"...","category":"...","tags":["..."]}`

export async function analyzeArticle(raw: RawArticle, sourceHint?: string): Promise<AIResult> {
  try {
    const userContent = `来源：${raw.source}
文章标题：${raw.title}
文章内容：${(raw.content || '').slice(0, 1500)}${sourceHint ? `\n编辑提示：${sourceHint}` : ''}`

    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      max_tokens: 500,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userContent },
      ],
    })

    const text = response.choices[0]?.message?.content || ''
    const result = JSON.parse(text) as AIResult
    return result
  } catch {
    return {
      title: raw.title.slice(0, 25),
      summary: raw.content?.slice(0, 80) || raw.title,
      category: 'daily',
      tags: [],
    }
  }
}
