import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
})

// 与新材料行业无关的文章ID（基于标题关键词判断）
const UNRELATED_IDS = [
  13, // 美国总统特朗普
  15, // AI购物
  16, // 理想汽车研发负责人
  17, // 万里汽车融资
  18, // SK海力士员工奖金
  19, // Ozon电商平台
  20, // 割草机器人
  21, // AI精神自留地
  24, // 娃哈哈更名
  25, // 微软OpenAI
  26, // A股三大指数
  27, // 央行逆回购
  28, // 恒指快手
  29, // 人民币汇率
  33, // 黑石房地产
  34, // PPI CPI
  35, // A股基金加仓
  36, // 传媒收购BuzzFeed
  37, // 券商板块
  38, // 美国高校签证
  39, // 融资余额
  40, // 消费医疗
  42, // 生猪养殖股
  43, // 中际旭创股价
  44, // 沪深成交额
  47, // 中保投资
  48, // 日本恩格尔系数
]

async function main() {
  console.log(`将删除 ${UNRELATED_IDS.length} 条与新材料无关的文章`)

  // 删除无关文章
  const deleteResult = await client.execute({
    sql: `DELETE FROM articles WHERE id IN (${UNRELATED_IDS.map(() => '?').join(',')})`,
    args: UNRELATED_IDS,
  })
  console.log(`成功删除: ${deleteResult.rowsAffected} 条文章`)

  // 检查剩余文章
  const remainingResult = await client.execute('SELECT id, title, source, status FROM articles')
  console.log(`\n剩余文章: ${remainingResult.rows.length} 条`)
  remainingResult.rows.forEach(row => {
    console.log(`ID: ${row.id} | 标题: ${row.title} | 来源: ${row.source} | 状态: ${row.status}`)
  })
}

main().catch(console.error)
