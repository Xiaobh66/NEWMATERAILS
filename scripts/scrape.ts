import { runScrape } from '../src/lib/scrape-engine'

async function main() {
  console.log('Starting scrape...')
  const { results } = await runScrape()
  for (const r of results) {
    console.log(`${r.source}: scraped=${r.scraped}, new=${r.new}, dupes=${r.duplicates}`)
    if (r.errors.length) {
      console.log(`  Errors: ${r.errors.join(', ')}`)
    }
  }
  console.log('Done.')
}

main()
