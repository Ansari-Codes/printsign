import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

export const INDEXNOW_KEY = 'c6f57e4fcf075d35f0eb311ccc7fb4ba'
export const INDEXNOW_HOST = 'printsign.org'
export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`

export function getSitemapUrls() {
  const distSitemap = path.resolve(rootDir, 'dist/sitemap.xml')
  const publicSitemap = path.resolve(rootDir, 'public/sitemap.xml')

  const sitemapPath = fs.existsSync(distSitemap) ? distSitemap : publicSitemap
  if (!fs.existsSync(sitemapPath)) {
    throw new Error(`Sitemap not found at ${distSitemap} or ${publicSitemap}`)
  }

  const xml = fs.readFileSync(sitemapPath, 'utf8')
  const matches = [...xml.matchAll(/<loc>(https:\/\/printsign\.org[^<]*)<\/loc>/g)]
  return matches.map(m => m[1])
}

export async function submitIndexNow(options = { dryRun: false }) {
  const urls = getSitemapUrls()
  console.log(`\n--- IndexNow Instant Indexing Submission ---`)
  console.log(`Host: ${INDEXNOW_HOST}`)
  console.log(`Key: ${INDEXNOW_KEY}`)
  console.log(`Key Location: ${INDEXNOW_KEY_LOCATION}`)
  console.log(`Discovered URLs: ${urls.length}`)

  if (urls.length === 0) {
    throw new Error('No URLs discovered to submit to IndexNow.')
  }

  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: urls
  }

  if (options.dryRun) {
    console.log(`[IndexNow] (dry-run) Prepared submission payload for ${urls.length} URLs.`)
    return { ok: true, status: 200, count: urls.length, dryRun: true }
  }

  console.log(`[IndexNow] Submitting ${urls.length} URLs to https://api.indexnow.org/indexnow ...`)

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    })

    // IndexNow responds with 200 (OK) or 202 (Accepted) upon success
    if (res.status === 200 || res.status === 202) {
      console.log(`✓ [IndexNow] Success! HTTP ${res.status}: ${urls.length} URLs queued for instant indexing across Bing, DuckDuckGo, Yandex, Seznam, and Naver.\n`)
      return { ok: true, status: res.status, count: urls.length }
    } else {
      const text = await res.text()
      console.warn(`⚠️ [IndexNow] Warning: HTTP ${res.status}: ${text}`)
      return { ok: false, status: res.status, error: text }
    }
  } catch (err) {
    console.error(`❌ [IndexNow] Network Error:`, err.message)
    return { ok: false, error: err.message }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  submitIndexNow().catch(err => {
    console.error('[IndexNow] Fatal:', err.message)
    process.exit(1)
  })
}
