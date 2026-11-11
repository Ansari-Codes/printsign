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

async function postIndexNow(endpoint, payload) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(payload)
  })
  const text = await res.text()
  return { endpoint, ok: res.status === 200 || res.status === 202, status: res.status, body: text }
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

  // Ensure local key file matches exact 32-char key without trailing whitespace
  const keyFile = path.resolve(rootDir, 'public', `${INDEXNOW_KEY}.txt`)
  if (fs.existsSync(keyFile)) {
    const rawKey = fs.readFileSync(keyFile, 'utf8')
    if (rawKey !== INDEXNOW_KEY) {
      fs.writeFileSync(keyFile, INDEXNOW_KEY, 'utf8')
    }
  }

  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: urls
  }

  if (options.dryRun) {
    console.log(`[IndexNow] (dry-run) Prepared submission payload for ${urls.length} URLs.`)
    return { ok: true, status: 200, count: urls.length, payload, dryRun: true }
  }

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://yandex.com/indexnow'
  ]

  let anyAccepted = false
  const results = []

  for (const endpoint of endpoints) {
    console.log(`[IndexNow] Submitting ${urls.length} URLs to ${endpoint} ...`)
    try {
      const result = await postIndexNow(endpoint, payload)
      results.push(result)
      if (result.ok) {
        anyAccepted = true
        console.log(`✓ [IndexNow] ${endpoint} -> HTTP ${result.status}: ${urls.length} URLs queued.`)
      } else {
        console.warn(`⚠️ [IndexNow] ${endpoint} -> HTTP ${result.status}: ${result.body}`)
      }
    } catch (err) {
      console.error(`❌ [IndexNow] Network Error (${endpoint}):`, err.message)
      results.push({ endpoint, ok: false, error: err.message })
    }
  }

  return { ok: anyAccepted, count: urls.length, results }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  submitIndexNow().catch(err => {
    console.error('[IndexNow] Fatal:', err.message)
    process.exit(1)
  })
}
