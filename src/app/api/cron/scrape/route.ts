import { NextRequest, NextResponse } from 'next/server'
import { runScrape } from '@/lib/scrape-engine'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await runScrape()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Scrape cron failed:', error)
    return NextResponse.json(
      { error: 'Scrape failed', details: String(error) },
      { status: 500 }
    )
  }
}
