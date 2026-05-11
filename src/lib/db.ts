import Database from 'better-sqlite3'
import path from 'path'
import { Article, ArticleInput, ArticleFilters } from './types'

const DB_PATH = path.join(process.cwd(), 'newmaterials.db')

let db: Database.Database

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    initDb()
  }
  return db
}

function initDb() {
  db.exec(`
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
}

export function getArticles(filters: ArticleFilters = {}): Article[] {
  const db = getDb()
  let query = 'SELECT * FROM articles WHERE 1=1'
  const params: string[] = []

  if (filters.category) {
    query += ' AND category = ?'
    params.push(filters.category)
  }
  if (filters.status) {
    query += ' AND status = ?'
    params.push(filters.status)
  }
  if (filters.search) {
    query += ' AND (title LIKE ? OR summary LIKE ? OR tags LIKE ?)'
    const term = `%${filters.search}%`
    params.push(term, term, term)
  }
  if (filters.date) {
    query += ' AND date(publishedAt) = ?'
    params.push(filters.date)
  }

  query += ' ORDER BY publishedAt DESC'

  const stmt = db.prepare(query)
  return stmt.all(...params) as Article[]
}

export function getArticleById(id: number): Article | undefined {
  const db = getDb()
  return db.prepare('SELECT * FROM articles WHERE id = ?').get(id) as Article | undefined
}

export function createArticle(input: ArticleInput): Article {
  const db = getDb()
  const stmt = db.prepare(`
    INSERT INTO articles (title, summary, source, sourceUrl, category, tags, editorNote, publishedAt, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  const result = stmt.run(
    input.title, input.summary, input.source, input.sourceUrl,
    input.category, input.tags, input.editorNote, input.publishedAt, input.status
  )
  return getArticleById(result.lastInsertRowid as number)!
}

export function updateArticle(id: number, input: Partial<ArticleInput>): Article | undefined {
  const db = getDb()
  const fields = Object.keys(input).filter(k => input[k as keyof ArticleInput] !== undefined)
  if (fields.length === 0) return getArticleById(id)

  const setClause = fields.map(f => `${f} = ?`).join(', ')
  const values = fields.map(f => input[f as keyof ArticleInput])

  db.prepare(`UPDATE articles SET ${setClause}, updatedAt = datetime('now') WHERE id = ?`)
    .run(...values, id)

  return getArticleById(id)
}

export function deleteArticle(id: number): boolean {
  const db = getDb()
  const result = db.prepare('DELETE FROM articles WHERE id = ?').run(id)
  return result.changes > 0
}
