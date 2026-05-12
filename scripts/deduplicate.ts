import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
})

async function main() {
  // 删除重复文章（保留ID较小的）
  const duplicateIds = [7, 8, 9, 10, 11, 12] // 这些是重复的

  console.log(`将删除 ${duplicateIds.length} 条重复文章`)
  const deleteResult = await client.execute({
    sql: `DELETE FROM articles WHERE id IN (${duplicateIds.map(() => '?').join(',')})`,
    args: duplicateIds,
  })
  console.log(`成功删除: ${deleteResult.rowsAffected} 条重复文章`)

  // 检查最终结果
  const remainingResult = await client.execute('SELECT id, title, source, status FROM articles ORDER BY id')
  console.log(`\n最终文章列表: ${remainingResult.rows.length} 条`)
  remainingResult.rows.forEach(row => {
    console.log(`ID: ${row.id} | 标题: ${row.title} | 来源: ${row.source} | 状态: ${row.status}`)
  })
}

main().catch(console.error)
