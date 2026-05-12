import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
})

async function main() {
  const result = await client.execute('SELECT id, title, source, sourceUrl, status FROM articles ORDER BY id DESC LIMIT 10')
  console.log('最新文章:')
  result.rows.forEach(row => {
    console.log(`ID: ${row.id} | ${row.title} | ${row.source} | ${row.status}`)
  })
}

main().catch(console.error)
