import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
})

async function main() {
  // 先查看要删除的文章数量
  const countResult = await client.execute({
    sql: 'SELECT COUNT(*) as count FROM articles WHERE source = ?',
    args: ['IT之家']
  })
  const itHomeCount = countResult.rows[0].count as number
  console.log(`将删除 IT之家 来源的文章: ${itHomeCount} 条`)

  // 删除IT之家的文章
  const deleteResult = await client.execute({
    sql: 'DELETE FROM articles WHERE source = ?',
    args: ['IT之家']
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
