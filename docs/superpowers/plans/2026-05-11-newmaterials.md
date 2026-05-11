# NEWMATERIALS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new materials industry news aggregation website modeled after AIHOT, with timeline feed, category filtering, and admin review workflow.

**Architecture:** Next.js App Router with Tailwind CSS, SQLite for storage, API routes for CRUD. Semi-automatic content pipeline: AI scrape → editor review → publish.

**Tech Stack:** Next.js 14+, Tailwind CSS, TypeScript, SQLite (better-sqlite3), Vercel deployment

---

## File Structure

```
NEWMATERIALS/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with nav
│   │   ├── page.tsx                # Homepage timeline feed
│   │   ├── latest/page.tsx         # Daily news page
│   │   ├── companies/page.tsx      # Company dynamics page
│   │   ├── policy/page.tsx         # Policy analysis page
│   │   ├── admin/
│   │   │   ├── layout.tsx          # Admin layout
│   │   │   └── page.tsx            # Admin dashboard
│   │   └── api/
│   │       └── articles/route.ts   # Articles CRUD API
│   ├── components/
│   │   ├── Header.tsx              # Top nav with logo + tabs + search
│   │   ├── ArticleCard.tsx         # Single article card
│   │   ├── Timeline.tsx            # Timeline with date separators
│   │   ├── CategoryFilter.tsx      # Category tab filter
│   │   ├── SearchBar.tsx           # Search input
│   │   └── AdminArticleRow.tsx     # Admin list row with actions
│   ├── lib/
│   │   ├── db.ts                   # SQLite connection + init
│   │   └── types.ts                # TypeScript interfaces
│   └── styles/
│       └── globals.css             # Tailwind imports + base styles
├── scripts/
│   └── scrape.ts                   # Content scraping script
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## Task 1: Project Initialization

**Files:**
- Create: `package.json`
- Create: `next.config.js`
- Create: `tailwind.config.js`
- Create: `tsconfig.json`
- Create: `src/styles/globals.css`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd D:/ClaudeProject/NEWMATERIALS
npm init -y
npm install next@latest react@latest react-dom@latest
npm install -D typescript @types/react @types/node tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- [ ] **Step 2: Configure package.json scripts**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

- [ ] **Step 3: Create tailwind.config.js**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a5f',
        }
      }
    }
  },
  plugins: []
}
```

- [ ] **Step 4: Create globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-50 text-gray-900;
}

.dark body {
  @apply bg-gray-900 text-gray-100;
}
```

- [ ] **Step 5: Create root layout.tsx**

```tsx
import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'NEWMATERIALS - 新材料行业资讯',
  description: '新材料行业资讯聚合平台',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 6: Create placeholder page.tsx**

```tsx
export default function Home() {
  return <div className="p-8">NEWMATERIALS - Coming Soon</div>
}
```

- [ ] **Step 7: Run dev server to verify**

```bash
npm run dev
```
Expected: Server starts, page shows "NEWMATERIALS - Coming Soon"

- [ ] **Step 8: Commit**

```bash
git init
git add .
git commit -m "feat: initialize Next.js project with Tailwind CSS"
```

---

## Task 2: TypeScript Types and SQLite Database

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/db.ts`

- [ ] **Step 1: Create types.ts**

```typescript
export interface Article {
  id: number
  title: string
  summary: string
  source: string
  sourceUrl: string
  category: 'daily' | 'company' | 'policy'
  tags: string
  editorNote: string
  publishedAt: string
  status: 'draft' | 'pending' | 'published'
  createdAt: string
  updatedAt: string
}

export type ArticleInput = Omit<Article, 'id' | 'createdAt' | 'updatedAt'>

export interface ArticleFilters {
  category?: string
  status?: string
  search?: string
  date?: string
}
```

- [ ] **Step 2: Install SQLite dependency**

```bash
npm install better-sqlite3
npm install -D @types/better-sqlite3
```

- [ ] **Step 3: Create db.ts**

```typescript
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

export function updateArticle(id: number, input: Partial<ArticleInput>): Article | null {
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
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/types.ts src/lib/db.ts
git commit -m "feat: add TypeScript types and SQLite database layer"
```

---

## Task 3: API Routes for Articles

**Files:**
- Create: `src/app/api/articles/route.ts`

- [ ] **Step 1: Create articles API route**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getArticles, createArticle } from '@/lib/db'
import { ArticleInput } from '@/lib/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filters = {
    category: searchParams.get('category') || undefined,
    status: searchParams.get('status') || undefined,
    search: searchParams.get('search') || undefined,
    date: searchParams.get('date') || undefined,
  }

  const articles = getArticles(filters)
  return NextResponse.json(articles)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const input: ArticleInput = {
    title: body.title,
    summary: body.summary,
    source: body.source,
    sourceUrl: body.sourceUrl || '',
    category: body.category || 'daily',
    tags: JSON.stringify(body.tags || []),
    editorNote: body.editorNote || '',
    publishedAt: body.publishedAt || new Date().toISOString(),
    status: body.status || 'pending',
  }

  const article = createArticle(input)
  return NextResponse.json(article, { status: 201 })
}
```

- [ ] **Step 2: Create [id] route for update/delete**

Create: `src/app/api/articles/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getArticleById, updateArticle, deleteArticle } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const article = getArticleById(Number(params.id))
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(article)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  const article = updateArticle(Number(params.id), body)
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(article)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const deleted = deleteArticle(Number(params.id))
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/
git commit -m "feat: add articles CRUD API routes"
```

---

## Task 4: Seed Sample Data

**Files:**
- Create: `scripts/seed.ts`

- [ ] **Step 1: Create seed script**

```typescript
import { createArticle } from '../src/lib/db'
import { ArticleInput } from '../src/lib/types'

const sampleArticles: ArticleInput[] = [
  {
    title: '碳纤维复合材料在新能源汽车领域应用取得突破',
    summary: '国内某研究团队成功开发出新型碳纤维复合材料，重量减轻40%的同时强度提升25%，已获多家新能源车企合作意向。该材料有望在2026年底前实现量产，推动电动汽车轻量化进程。',
    source: '新材料在线',
    sourceUrl: 'https://example.com/1',
    category: 'daily',
    tags: '["碳纤维","新能源汽车","轻量化","技术突破"]',
    editorNote: '碳纤维轻量化是新能源车降本增效的关键路径，这个突破如果量产落地，对产业链影响不小。',
    publishedAt: '2026-05-11T10:30:00Z',
    status: 'published',
  },
  {
    title: '工信部发布《新材料产业高质量发展行动计划（2026-2030）》',
    summary: '工信部联合发改委发布新材料产业五年规划，重点支持半导体材料、高端合金、生物基材料三大方向，计划到2030年产业规模突破10万亿元。',
    source: '工信部官网',
    sourceUrl: 'https://example.com/2',
    category: 'policy',
    tags: '["政策","半导体材料","高端合金","生物基材料"]',
    editorNote: '国家层面的五年规划，信号很明确：半导体材料和生物基材料是未来五年重点砸钱的方向。',
    publishedAt: '2026-05-11T09:00:00Z',
    status: 'published',
  },
  {
    title: '宁德时代投资20亿布局固态电池电解质材料',
    summary: '宁德时代宣布与某固态电解质材料企业签署战略合作协议，投资20亿元用于固态电池核心材料研发和产线建设，预计2027年实现小批量量产。',
    source: '36氪',
    sourceUrl: 'https://example.com/3',
    category: 'company',
    tags: '["固态电池","电解质","宁德时代","融资"]',
    editorNote: '宁德时代押注固态电池材料，20亿不是小数目，说明固态电池离量产又近了一步。',
    publishedAt: '2026-05-11T08:00:00Z',
    status: 'published',
  },
  {
    title: '稀土永磁材料价格持续上涨，行业景气度回升',
    summary: '受新能源车和风电需求拉动，稀土永磁材料价格连续三周上涨，钕铁硼磁材涨幅达15%。业内预计下半年供需格局将进一步收紧。',
    source: '财联社',
    sourceUrl: 'https://example.com/4',
    category: 'daily',
    tags: '["稀土","永磁材料","钕铁硼","价格"]',
    editorNote: '稀土涨价周期又来了，新能源+风电双轮驱动，做稀土产业链的可以关注。',
    publishedAt: '2026-05-10T16:00:00Z',
    status: 'published',
  },
  {
    title: '国内首条8英寸碳化硅衬底产线投产',
    summary: '某半导体材料企业宣布国内首条8英寸碳化硅衬底产线正式投产，年产能达10万片，打破了国外厂商在该领域的长期垄断。',
    source: '半导体行业观察',
    sourceUrl: 'https://example.com/5',
    category: 'company',
    tags: '["碳化硅","半导体材料","衬底","国产替代"]',
    editorNote: '碳化硅衬底国产化又进一步，8英寸产线投产意味着成本和规模都有了竞争力。',
    publishedAt: '2026-05-10T14:00:00Z',
    status: 'published',
  },
  {
    title: '发改委：将新材料纳入战略性新兴产业重点支持',
    summary: '国家发改委在新闻发布会上表示，新材料已被纳入战略性新兴产业目录，将享受税收优惠、研发补贴等多项政策支持。',
    source: '发改委官网',
    sourceUrl: 'https://example.com/6',
    category: 'policy',
    tags: '["政策","战略性新兴产业","税收优惠"]',
    editorNote: '政策面持续加码，新材料从"十四五"到"十五五"一直是重点，这次把税收优惠明确了。',
    publishedAt: '2026-05-10T11:00:00Z',
    status: 'published',
  },
]

console.log('Seeding database...')
for (const article of sampleArticles) {
  createArticle(article)
  console.log(`Created: ${article.title}`)
}
console.log('Done!')
```

- [ ] **Step 2: Run seed script**

```bash
npx tsx scripts/seed.ts
```
Expected: 6 articles created in database

- [ ] **Step 3: Commit**

```bash
git add scripts/seed.ts
git commit -m "feat: add seed script with sample articles"
```

---

## Task 5: Header and Navigation Component

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/SearchBar.tsx`
- Create: `src/components/CategoryFilter.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create SearchBar component**

```tsx
'use client'

import { useState } from 'react'

interface SearchBarProps {
  onSearch: (term: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [term, setTerm] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(term)
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="搜索资讯..."
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600"
      />
      <button
        type="submit"
        className="px-3 py-1.5 text-sm bg-primary-500 text-white rounded-r-lg hover:bg-primary-600"
      >
        搜索
      </button>
    </form>
  )
}
```

- [ ] **Step 2: Create CategoryFilter component**

```tsx
'use client'

interface CategoryFilterProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

const categories = [
  { key: 'all', label: '全部' },
  { key: 'daily', label: '日报' },
  { key: 'company', label: '企业' },
  { key: 'policy', label: '政策' },
]

export default function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onCategoryChange(cat.key)}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeCategory === cat.key
              ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Create Header component**

```tsx
'use client'

import Link from 'next/link'
import SearchBar from './SearchBar'
import CategoryFilter from './CategoryFilter'

interface HeaderProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
  onSearch: (term: string) => void
}

export default function Header({ activeCategory, onCategoryChange, onSearch }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <Link href="/" className="text-xl font-bold text-primary-700 dark:text-primary-400">
            NEWMATERIALS
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-4 text-sm">
              <Link href="/latest" className="hover:text-primary-600">日报</Link>
              <Link href="/companies" className="hover:text-primary-600">企业</Link>
              <Link href="/policy" className="hover:text-primary-600">政策</Link>
            </nav>
            <Link href="/admin" className="text-sm text-gray-500 hover:text-primary-600">
              管理
            </Link>
            <SearchBar onSearch={onSearch} />
          </div>
        </div>
        <CategoryFilter activeCategory={activeCategory} onCategoryChange={onCategoryChange} />
      </div>
    </header>
  )
}
```

- [ ] **Step 4: Update layout.tsx to include Header**

Replace the body content in `src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'NEWMATERIALS - 新材料行业资讯',
  description: '新材料行业资讯聚合平台',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ src/app/layout.tsx
git commit -m "feat: add Header, SearchBar, and CategoryFilter components"
```

---

## Task 6: ArticleCard and Timeline Components

**Files:**
- Create: `src/components/ArticleCard.tsx`
- Create: `src/components/Timeline.tsx`

- [ ] **Step 1: Create ArticleCard component**

```tsx
import { Article } from '@/lib/types'

interface ArticleCardProps {
  article: Article
}

function parseTags(tags: string): string[] {
  try {
    return JSON.parse(tags)
  } catch {
    return []
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const tags = parseTags(article.tags)
  const time = formatDate(article.publishedAt)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
        <span>{time}</span>
        <span className="text-gray-300">|</span>
        <span>{article.source}</span>
      </div>

      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 leading-snug">
        {article.title}
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
        {article.summary}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="px-2 py-0.5 text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {article.editorNote && (
        <div className="text-sm text-gray-500 dark:text-gray-400 italic border-t border-gray-100 dark:border-gray-700 pt-2">
          推荐理由: {article.editorNote}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create Timeline component**

```tsx
import { Article } from '@/lib/types'
import ArticleCard from './ArticleCard'

interface TimelineProps {
  articles: Article[]
}

function groupByDate(articles: Article[]): Map<string, Article[]> {
  const groups = new Map<string, Article[]>()
  for (const article of articles) {
    const date = new Date(article.publishedAt).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    if (!groups.has(date)) {
      groups.set(date, [])
    }
    groups.get(date)!.push(article)
  }
  return groups
}

export default function Timeline({ articles }: TimelineProps) {
  const grouped = groupByDate(articles)

  if (articles.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        暂无资讯
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {Array.from(grouped.entries()).map(([date, dateArticles]) => (
        <div key={date}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{date}</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="space-y-3">
            {dateArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ArticleCard.tsx src/components/Timeline.tsx
git commit -m "feat: add ArticleCard and Timeline components"
```

---

## Task 7: Homepage with Data Fetching

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update page.tsx to fetch and display articles**

```tsx
'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Timeline from '@/components/Timeline'
import { Article } from '@/lib/types'

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (category !== 'all') params.set('category', category)
    if (search) params.set('search', search)

    fetch(`/api/articles?${params}`)
      .then(res => res.json())
      .then(data => setArticles(data))
  }, [category, search])

  return (
    <>
      <Header
        activeCategory={category}
        onCategoryChange={setCategory}
        onSearch={setSearch}
      />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            精选资讯
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            AI 自动挑选的高价值内容
          </p>
        </div>
        <Timeline articles={articles} />
      </main>
    </>
  )
}
```

- [ ] **Step 2: Run dev server and verify**

```bash
npm run dev
```
Expected: Homepage loads with sample articles in timeline layout

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: implement homepage with timeline feed and filtering"
```

---

## Task 8: Category Pages

**Files:**
- Create: `src/app/latest/page.tsx`
- Create: `src/app/companies/page.tsx`
- Create: `src/app/policy/page.tsx`

- [ ] **Step 1: Create a shared category page component**

Create: `src/components/CategoryPage.tsx`

```tsx
'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Timeline from '@/components/Timeline'
import { Article } from '@/lib/types'

interface CategoryPageProps {
  category: string
  title: string
  description: string
}

export default function CategoryPage({ category, title, description }: CategoryPageProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('category', category)
    if (search) params.set('search', search)

    fetch(`/api/articles?${params}`)
      .then(res => res.json())
      .then(data => setArticles(data))
  }, [category, search])

  return (
    <>
      <Header
        activeCategory={category}
        onCategoryChange={() => {}}
        onSearch={setSearch}
      />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <Timeline articles={articles} />
      </main>
    </>
  )
}
```

- [ ] **Step 2: Create latest page**

```tsx
import CategoryPage from '@/components/CategoryPage'

export default function LatestPage() {
  return (
    <CategoryPage
      category="daily"
      title="日报快讯"
      description="新材料行业每日要闻速览"
    />
  )
}
```

- [ ] **Step 3: Create companies page**

```tsx
import CategoryPage from '@/components/CategoryPage'

export default function CompaniesPage() {
  return (
    <CategoryPage
      category="company"
      title="企业动态"
      description="新材料企业融资、产品、合作动态"
    />
  )
}
```

- [ ] **Step 4: Create policy page**

```tsx
import CategoryPage from '@/components/CategoryPage'

export default function PolicyPage() {
  return (
    <CategoryPage
      category="policy"
      title="政策解读"
      description="国家和地方新材料相关政策解读"
    />
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/CategoryPage.tsx src/app/latest/ src/app/companies/ src/app/policy/
git commit -m "feat: add category pages for daily, companies, and policy"
```

---

## Task 9: Admin Dashboard

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/components/AdminArticleRow.tsx`

- [ ] **Step 1: Create AdminArticleRow component**

```tsx
'use client'

import { Article } from '@/lib/types'

interface AdminArticleRowProps {
  article: Article
  onStatusChange: (id: number, status: string) => void
  onDelete: (id: number) => void
}

function parseTags(tags: string): string[] {
  try {
    return JSON.parse(tags)
  } catch {
    return []
  }
}

export default function AdminArticleRow({ article, onStatusChange, onDelete }: AdminArticleRowProps) {
  const tags = parseTags(article.tags)

  const statusColors = {
    draft: 'bg-gray-100 text-gray-600',
    pending: 'bg-yellow-100 text-yellow-700',
    published: 'bg-green-100 text-green-700',
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[article.status]}`}>
              {article.status}
            </span>
            <span className="text-xs text-gray-500">{article.source}</span>
          </div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {article.title}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {article.summary}
          </p>
          <div className="flex gap-1 mt-2">
            {tags.map((tag, i) => (
              <span key={i} className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          {article.status === 'pending' && (
            <>
              <button
                onClick={() => onStatusChange(article.id, 'published')}
                className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
              >
                通过
              </button>
              <button
                onClick={() => onStatusChange(article.id, 'draft')}
                className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                驳回
              </button>
            </>
          )}
          <button
            onClick={() => onDelete(article.id)}
            className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create admin layout**

```tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold">后台管理</h1>
          <a href="/" className="text-sm text-primary-600 hover:underline">
            返回前台
          </a>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
```

- [ ] **Step 3: Create admin page**

```tsx
'use client'

import { useState, useEffect } from 'react'
import AdminArticleRow from '@/components/AdminArticleRow'
import { Article } from '@/lib/types'

type StatusFilter = 'pending' | 'published' | 'draft' | 'all'

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending')

  const fetchArticles = () => {
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.set('status', statusFilter)
    fetch(`/api/articles?${params}`)
      .then(res => res.json())
      .then(data => setArticles(data))
  }

  useEffect(() => {
    fetchArticles()
  }, [statusFilter])

  const handleStatusChange = async (id: number, status: string) => {
    await fetch(`/api/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchArticles()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除？')) return
    await fetch(`/api/articles/${id}`, { method: 'DELETE' })
    fetchArticles()
  }

  const tabs: { key: StatusFilter; label: string; count: number }[] = [
    { key: 'pending', label: '待审核', count: articles.length },
    { key: 'published', label: '已发布', count: 0 },
    { key: 'draft', label: '草稿', count: 0 },
  ]

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 text-sm rounded-lg ${
              statusFilter === tab.key
                ? 'bg-primary-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {articles.length === 0 ? (
          <p className="text-center py-8 text-gray-500">暂无内容</p>
        ) : (
          articles.map((article) => (
            <AdminArticleRow
              key={article.id}
              article={article}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/ src/components/AdminArticleRow.tsx
git commit -m "feat: add admin dashboard with review workflow"
```

---

## Task 10: Dark Mode Toggle

**Files:**
- Create: `src/components/ThemeToggle.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create ThemeToggle component**

```tsx
'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark'
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', next)
  }

  return (
    <button
      onClick={toggle}
      className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      aria-label="Toggle dark mode"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
```

- [ ] **Step 2: Add ThemeToggle to layout**

Update `src/app/layout.tsx` body to include ThemeToggle in the header area (or add to Header component).

- [ ] **Step 3: Commit**

```bash
git add src/components/ThemeToggle.tsx src/app/layout.tsx
git commit -m "feat: add dark mode toggle"
```

---

## Task 11: Mobile Responsive Polish

**Files:**
- Modify: `src/components/Header.tsx`

- [ ] **Step 1: Add mobile hamburger menu to Header**

Update Header to collapse nav links into a hamburger menu on mobile. Use a simple state toggle.

- [ ] **Step 2: Ensure all pages work on mobile viewport**

Test with browser dev tools at 375px width.

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat: add mobile responsive navigation"
```

---

## Task 12: Content Scraping Script

**Files:**
- Create: `scripts/scrape.ts`

- [ ] **Step 1: Create basic scraping script**

```typescript
import { createArticle } from '../src/lib/db'

interface ScrapeSource {
  name: string
  url: string
  selector: string
}

// Example: scrape from RSS feeds or web pages
// This is a placeholder - customize based on actual sources

async function scrapeRSS(feedUrl: string): Promise<void> {
  console.log(`Scraping ${feedUrl}...`)
  // Implementation: fetch RSS, parse XML, extract articles
  // For MVP, this can be manual or use a library like 'rss-parser'
}

async function scrapeWebPage(url: string, selector: string): Promise<void> {
  console.log(`Scraping ${url}...`)
  // Implementation: fetch page, use cheerio to extract content
}

async function main() {
  const sources: ScrapeSource[] = [
    // Add your sources here
    // { name: '新材料在线', url: 'https://...', selector: '.article-item' },
  ]

  for (const source of sources) {
    try {
      await scrapeWebPage(source.url, source.selector)
    } catch (err) {
      console.error(`Failed to scrape ${source.name}:`, err)
    }
  }

  console.log('Scraping complete!')
}

main()
```

- [ ] **Step 2: Commit**

```bash
git add scripts/scrape.ts
git commit -m "feat: add content scraping script skeleton"
```
