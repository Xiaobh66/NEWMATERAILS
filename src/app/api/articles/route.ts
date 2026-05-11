import { NextRequest, NextResponse } from 'next/server'
import { getArticles, createArticle } from '@/lib/db'
import { ArticleInput, ArticleFilters } from '@/lib/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filters = {
    category: (searchParams.get('category') || undefined) as ArticleFilters['category'],
    status: (searchParams.get('status') || undefined) as ArticleFilters['status'],
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
