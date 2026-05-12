import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
})

async function main() {
  // 将所有pending文章发布
  const updateResult = await client.execute({
    sql: "UPDATE articles SET status = 'published' WHERE status = 'pending'",
    args: [],
  })
  console.log(`发布文章: ${updateResult.rowsAffected} 条`)

  // 检查最终结果
  const result = await client.execute('SELECT id, title, source, status FROM articles ORDER BY id')
  console.log(`\n最终文章列表: ${result.rows.length} 条`)
  result.rows.forEach(row => {
    console.log(`ID: ${row.id} | ${row.title} | ${row.source} | ${row.status}`)
  })
}

main().catch(console.error)
