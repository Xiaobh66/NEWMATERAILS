import { createClient, type Client } from '@libsql/client'
import { Article, ArticleInput, ArticleFilters } from './types'

let client: Client
let initialized = false

function getClient(): Client {
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL!.trim(),
      authToken: process.env.TURSO_AUTH_TOKEN!.trim(),
    })
  }
  return client
}

async function ensureInitialized(): Promise<Client> {
  const c = getClient()
  if (!initialized) {
    await c.execute(`
      CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        source TEXT NOT NULL,
        sourceUrl TEXT DEFAULT '',
        category TEXT NOT NULL DEFAULT 'daily',
        tags TEXT DEFAULT '[]',
        editorNote TEXT DEFAULT '',
        publishedAt TEXT DEFAULT (datetime('now')),
        status TEXT DEFAULT 'pending',
        createdAt TEXT DEFAULT (datetime('now')),
        updatedAt TEXT DEFAULT (datetime('now'))
      )
    `)
    initialized = true
  }
  return c
}

export async function getArticles(filters: ArticleFilters = {}): Promise<Article[]> {
  const c = await ensureInitialized()
  let sql = 'SELECT * FROM articles WHERE 1=1'
  const args: (string | number)[] = []

  if (filters.category) {
    sql += ' AND category = ?'
    args.push(filters.category)
  }
  if (filters.status) {
    sql += ' AND status = ?'
    args.push(filters.status)
  }
  if (filters.search) {
    sql += ' AND (title LIKE ? OR summary LIKE ? OR tags LIKE ?)'
    const term = `%${filters.search}%`
    args.push(term, term, term)
  }
  if (filters.date) {
    sql += ' AND date(publishedAt) = ?'
    args.push(filters.date)
  }

  sql += ' ORDER BY publishedAt DESC'

  const result = await c.execute({ sql, args })
  return result.rows as unknown as Article[]
}

export async function getArticleById(id: number): Promise<Article | undefined> {
  const c = await ensureInitialized()
  const result = await c.execute({ sql: 'SELECT * FROM articles WHERE id = ?', args: [id] })
  return result.rows[0] as unknown as Article | undefined
}

export async function findArticleByUrl(url: string): Promise<Article | undefined> {
  const c = await ensureInitialized()
  const result = await c.execute({ sql: 'SELECT * FROM articles WHERE sourceUrl = ? LIMIT 1', args: [url] })
  return result.rows[0] as unknown as Article | undefined
}

export async function createArticle(input: ArticleInput): Promise<Article> {
  const c = await ensureInitialized()
  const result = await c.execute({
    sql: `INSERT INTO articles (title, summary, source, sourceUrl, category, tags, editorNote, publishedAt, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      input.title, input.summary, input.source, input.sourceUrl,
      input.category, input.tags, input.editorNote, input.publishedAt, input.status,
    ],
  })
  const article = await getArticleById(Number(result.lastInsertRowid))
  if (!article) throw new Error('Failed to create article')
  return article
}

export async function updateArticle(id: number, input: Partial<ArticleInput>): Promise<Article | undefined> {
  const c = await ensureInitialized()
  const VALID_COLUMNS = ['title', 'summary', 'source', 'sourceUrl', 'category', 'tags', 'editorNote', 'publishedAt', 'status'] as const
  const fields = Object.keys(input).filter(
    (k): k is keyof ArticleInput => VALID_COLUMNS.includes(k as keyof ArticleInput) && input[k as keyof ArticleInput] !== undefined
  )
  if (fields.length === 0) return getArticleById(id)

  const setClause = fields.map(f => `${f} = ?`).join(', ')
  const values = fields.map(f => input[f as keyof ArticleInput] as string)

  await c.execute({
    sql: `UPDATE articles SET ${setClause}, updatedAt = datetime('now') WHERE id = ?`,
    args: [...values, id],
  })

  return getArticleById(id)
}

export async function deleteArticle(id: number): Promise<boolean> {
  const c = await ensureInitialized()
  const result = await c.execute({ sql: 'DELETE FROM articles WHERE id = ?', args: [id] })
  return result.rowsAffected > 0
}
