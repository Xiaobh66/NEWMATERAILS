import { createArticle } from '../src/lib/db'
import { ArticleInput } from '../src/lib/types'

const sampleArticles: ArticleInput[] = [
  {
    title: '碳纤维复合材料在新能源汽车领域应用取得突破',
    summary: '国内某研究团队成功开发出新型碳纤维复合材料，重量减轻40%的同时强度提升25%，已获多家新能源车企合作意向。该材料有望在2026年底前实现量产，推动电动汽车轻量化进程。',
    source: '新材料在线',
    sourceUrl: 'https://example.com/1',
    category: 'daily',
    tags: '["碳纤维","新能源汽车","轻量化","技术突破"]',
    editorNote: '碳纤维轻量化是新能源车降本增效的关键路径，这个突破如果量产落地，对产业链影响不小。',
    publishedAt: '2026-05-11T10:30:00Z',
    status: 'published',
  },
  {
    title: '工信部发布《新材料产业高质量发展行动计划（2026-2030）》',
    summary: '工信部联合发改委发布新材料产业五年规划，重点支持半导体材料、高端合金、生物基材料三大方向，计划到2030年产业规模突破10万亿元。',
    source: '工信部官网',
    sourceUrl: 'https://example.com/2',
    category: 'policy',
    tags: '["政策","半导体材料","高端合金","生物基材料"]',
    editorNote: '国家层面的五年规划，信号很明确：半导体材料和生物基材料是未来五年重点砸钱的方向。',
    publishedAt: '2026-05-11T09:00:00Z',
    status: 'published',
  },
  {
    title: '宁德时代投资20亿布局固态电池电解质材料',
    summary: '宁德时代宣布与某固态电解质材料企业签署战略合作协议，投资20亿元用于固态电池核心材料研发和产线建设，预计2027年实现小批量量产。',
    source: '36氪',
    sourceUrl: 'https://example.com/3',
    category: 'company',
    tags: '["固态电池","电解质","宁德时代","融资"]',
    editorNote: '宁德时代押注固态电池材料，20亿不是小数目，说明固态电池离量产又近了一步。',
    publishedAt: '2026-05-11T08:00:00Z',
    status: 'published',
  },
  {
    title: '稀土永磁材料价格持续上涨，行业景气度回升',
    summary: '受新能源车和风电需求拉动，稀土永磁材料价格连续三周上涨，钕铁硼磁材涨幅达15%。业内预计下半年供需格局将进一步收紧。',
    source: '财联社',
    sourceUrl: 'https://example.com/4',
    category: 'daily',
    tags: '["稀土","永磁材料","钕铁硼","价格"]',
    editorNote: '稀土涨价周期又来了，新能源+风电双轮驱动，做稀土产业链的可以关注。',
    publishedAt: '2026-05-10T16:00:00Z',
    status: 'published',
  },
  {
    title: '国内首条8英寸碳化硅衬底产线投产',
    summary: '某半导体材料企业宣布国内首条8英寸碳化硅衬底产线正式投产，年产能达10万片，打破了国外厂商在该领域的长期垄断。',
    source: '半导体行业观察',
    sourceUrl: 'https://example.com/5',
    category: 'company',
    tags: '["碳化硅","半导体材料","衬底","国产替代"]',
    editorNote: '碳化硅衬底国产化又进一步，8英寸产线投产意味着成本和规模都有了竞争力。',
    publishedAt: '2026-05-10T14:00:00Z',
    status: 'published',
  },
  {
    title: '发改委：将新材料纳入战略性新兴产业重点支持',
    summary: '国家发改委在新闻发布会上表示，新材料已被纳入战略性新兴产业目录，将享受税收优惠、研发补贴等多项政策支持。',
    source: '发改委官网',
    sourceUrl: 'https://example.com/6',
    category: 'policy',
    tags: '["政策","战略性新兴产业","税收优惠"]',
    editorNote: '政策面持续加码，新材料从"十四五"到"十五五"一直是重点，这次把税收优惠明确了。',
    publishedAt: '2026-05-10T11:00:00Z',
    status: 'published',
  },
]

console.log('Seeding database...')
for (const article of sampleArticles) {
  createArticle(article)
  console.log(`Created: ${article.title}`)
}
console.log('Done!')
