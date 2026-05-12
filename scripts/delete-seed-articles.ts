import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
})

// 种子脚本生成的文章ID（sourceUrl是example.com）
const SEED_IDS = [1, 2, 3, 4, 5, 6]

async function main() {
  console.log(`将删除 ${SEED_IDS.length} 条种子示例文章`)
  const deleteResult = await client.execute({
    sql: `DELETE FROM articles WHERE id IN (${SEED_IDS.map(() => '?').join(',')})`,
    args: SEED_IDS,
  })
  console.log(`成功删除: ${deleteResult.rowsAffected} 条文章`)

  // 检查剩余文章
  const result = await client.execute('SELECT id, title, source, sourceUrl, status FROM articles ORDER BY id')
  console.log(`\n剩余文章: ${result.rows.length} 条`)
  result.rows.forEach(row => {
    console.log(`ID: ${row.id} | ${row.title} | URL: ${row.sourceUrl}`)
  })
}

main().catch(console.error)
