import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
})

async function main() {
  const result = await client.execute('SELECT id, title, source, sourceUrl, status FROM articles')
  console.log('数据库中的文章:')
  if (result.rows.length === 0) {
    console.log('没有文章')
    return
  }
  result.rows.forEach(row => {
    console.log(`ID: ${row.id} | 标题: ${row.title} | 来源: ${row.source} | 状态: ${row.status}`)
  })
  console.log(`\n共 ${result.rows.length} 条记录`)
}

main().catch(console.error)
