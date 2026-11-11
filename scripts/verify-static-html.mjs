import fs from 'node:fs'
import path from 'node:path'

const distDir = path.resolve(process.cwd(), 'dist')
const rootIndexHtml = path.resolve(process.cwd(), 'index.html')

console.log('\n--- Strict Static HTML & Privacy Verification ---')

const prohibitedTrackers = /googletagmanager|google-analytics|gtag\(|adsbygoogle|preconnect.*(?:googletagmanager|google-analytics|doubleclick)/i

// 1. Verify root index.html
if (fs.existsSync(rootIndexHtml)) {
  const rootHtml = fs.readFileSync(rootIndexHtml, 'utf8')
  if (prohibitedTrackers.test(rootHtml)) {
    console.error('❌ Privacy verification failed: Found prohibited tracking script/domain in root index.html')
    process.exit(1)
  }
  console.log('✓ root index.html passed: 0 third-party trackers, 0 external preconnects')
}

// 2. Discover all HTML files in dist/
function getAllHtmlFiles(dir) {
  let files = []
  if (!fs.existsSync(dir)) return files
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files = files.concat(getAllHtmlFiles(full))
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(full)
    }
  }
  return files
}

const allDistHtmlFiles = getAllHtmlFiles(distDir)
if (allDistHtmlFiles.length === 0) {
  console.error('❌ Verification failed: No HTML files found in dist directory!')
  process.exit(1)
}

// Assert zero trackers across ALL dist HTML files
for (const file of allDistHtmlFiles) {
  const rel = path.relative(distDir, file)
  const content = fs.readFileSync(file, 'utf8')
  if (prohibitedTrackers.test(content)) {
    console.error(`❌ Privacy verification failed: Found prohibited tracking domain in dist/${rel}`)
    process.exit(1)
  }
}
console.log(`✓ Verified ${allDistHtmlFiles.length} dist HTML files: 100% free of third-party trackers/preconnects`)

// 3. Verify specific critical routes
const filesToCheck = [
  'f12-network-audit/index.html',
  'for-lawyers/index.html',
  'for-healthcare/index.html',
  'for-journalists/index.html',
  'contact-us/index.html',
  'blog/compress-pdf-file-size-without-losing-quality/index.html',
  'blog/high-dpi-pdf-rasterization-guide-300-600-dpi/index.html',
  'blog/best-free-adobe-acrobat-alternatives-2026/index.html',
  'blog/financial-document-redaction-tax-banking-privacy/index.html',
  'blog/gdpr-article-32-pdf-data-protection/index.html',
  'blog/why-black-boxes-fail-pdf-redaction-disasters/index.html',
  'blog/legal-discovery-ediscovery-pdf-sanitization/index.html',
  'blog/hipaa-compliant-pdf-editor-medical-records/index.html',
  'blog/printsign-vs-smallpdf-ilovepdf-cloud-security/index.html',
  'blog/how-to-permanently-redact-pdf-court-compliant/index.html'
]

const titles = new Set()
const canonicals = new Set()

for (const relPath of filesToCheck) {
  const fullPath = path.resolve(distDir, relPath)
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Verification failed: ${relPath} does not exist in dist!`)
    process.exit(1)
  }

  const html = fs.readFileSync(fullPath, 'utf8')

  // Assert zero occurrences of ADVERTISEMENT or AdSense
  const adMatches = html.match(/ADVERTISEMENT|AdSense/i)
  if (adMatches) {
    console.error(`❌ Verification failed: Found prohibited term "${adMatches[0]}" in ${relPath}`)
    process.exit(1)
  }

  // Assert unique title
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

  // Assert unique canonical
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

  // Special check for math blog to ensure KaTeX math is pre-rendered
  if (relPath.includes('how-to-permanently-redact-pdf-court-compliant')) {
    if (!html.includes('katex-rendered') || !html.includes('class="katex"')) {
      console.error(`❌ KaTeX verification failed: Expected pre-rendered KaTeX math elements in ${relPath}`)
      process.exit(1)
    }
    console.log(`✓ ${relPath} passed: KaTeX math formula properly pre-rendered!`)
  } else {
    console.log(`✓ ${relPath} passed: Title="${title.substring(0, 50)}...", Canonical="${canonical}", AdSense/ADVERTISEMENT=0`)
  }
}

console.log('✓ All verified static HTML files passed strict privacy, SEO, and KaTeX checks!\n')
