import fs from 'node:fs'
import path from 'node:path'

const distDir = path.resolve(process.cwd(), 'dist')

const filesToCheck = [
  'f12-network-audit/index.html',
  'for-lawyers/index.html',
  'for-healthcare/index.html',
  'for-journalists/index.html',
  'contact-us/index.html',
  'blog/compress-pdf-file-size-without-losing-quality/index.html'
]

console.log('\n--- Strict Static HTML Verification ---')

const titles = new Set()
const canonicals = new Set()

for (const relPath of filesToCheck) {
  const fullPath = path.resolve(distDir, relPath)
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Verification failed: ${relPath} does not exist in dist!`)
    process.exit(1)
  }

  const html = fs.readFileSync(fullPath, 'utf8')

  // 1. Assert zero occurrences of ADVERTISEMENT or AdSense
  const adMatches = html.match(/ADVERTISEMENT|AdSense/i)
  if (adMatches) {
    console.error(`❌ Verification failed: Found prohibited term "${adMatches[0]}" in ${relPath}`)
    process.exit(1)
  }

  // 2. Assert unique title
  const titleMatch = html.match(/<title>(.*?)<\/title>/i)
  if (!titleMatch || !titleMatch[1].trim()) {
    console.error(`❌ Verification failed: Missing <title> tag in ${relPath}`)
    process.exit(1)
  }
  const title = titleMatch[1].trim()
  if (titles.has(title)) {
    console.error(`❌ Verification failed: Duplicate <title> "${title}" in ${relPath}`)
    process.exit(1)
  }
  titles.add(title)

  // 3. Assert unique canonical
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']\s*\/?>/i)
  if (!canonicalMatch || !canonicalMatch[1].trim()) {
    console.error(`❌ Verification failed: Missing canonical tag in ${relPath}`)
    process.exit(1)
  }
  const canonical = canonicalMatch[1].trim()
  if (canonicals.has(canonical)) {
    console.error(`❌ Verification failed: Duplicate canonical "${canonical}" in ${relPath}`)
    process.exit(1)
  }
  canonicals.add(canonical)

  console.log(`✓ ${relPath} passed: Title="${title}", Canonical="${canonical}", AdSense/ADVERTISEMENT=0`)
}

console.log('✓ All verified static HTML files passed strict privacy and SEO checks!\n')
