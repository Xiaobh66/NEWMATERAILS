import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
})

async function main() {
  const result = await client.execute('SELECT id, title, source, sourceUrl FROM articles ORDER BY id')
  console.log('文章链接检查:')
  result.rows.forEach(row => {
    console.log(`ID: ${row.id} | ${row.title} | URL: ${row.sourceUrl}`)
  })
}

main().catch(console.error)
