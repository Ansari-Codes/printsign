import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const publicDir = path.resolve(rootDir, 'public')
const distDir = path.resolve(rootDir, 'dist')

function loadBlogPosts() {
  const blogsPath = path.resolve(rootDir, 'src/data/blogs.ts')
  if (!fs.existsSync(blogsPath)) {
    console.warn('[sitemap] src/data/blogs.ts not found.')
    return []
  }
  const raw = fs.readFileSync(blogsPath, 'utf8')
  const decl = raw.indexOf('export const blogs')
  if (decl === -1) return []
  const eq = raw.indexOf('=', decl)
  const start = raw.indexOf('[', eq)
  const catIdx = raw.indexOf('export function getBlogPostBySlug')
  const blogsPart = catIdx !== -1 ? raw.substring(0, catIdx) : raw
  const end = blogsPart.lastIndexOf(']')
  const jsonText = blogsPart.substring(start, end + 1)
  try {
    return JSON.parse(jsonText)
  } catch (err) {
    console.warn('[sitemap] Failed to parse blogs.ts JSON:', err.message)
    return []
  }
}

export function generateSitemap() {
  const nowIso = new Date().toISOString().replace(/\.\d{3}Z$/, '+00:00')

  // Defined static routes with changefreq & priority (36 static + 18 blogs = 54 URLs)
  const staticRoutes = [
    { loc: 'https://printsign.org/', changefreq: 'daily', priority: '1.0' },
    // Core Unbundled Tool Routes
    { loc: 'https://printsign.org/verify-redaction', changefreq: 'weekly', priority: '1.0' },
    { loc: 'https://printsign.org/f12-network-audit', changefreq: 'weekly', priority: '0.9' },
    { loc: 'https://printsign.org/redact-pdf', changefreq: 'weekly', priority: '1.0' },
    { loc: 'https://printsign.org/scrub-pdf-metadata', changefreq: 'weekly', priority: '1.0' },
    { loc: 'https://printsign.org/merge-pdf', changefreq: 'weekly', priority: '1.0' },
    { loc: 'https://printsign.org/split-pdf', changefreq: 'weekly', priority: '1.0' },
    { loc: 'https://printsign.org/flatten-rasterize-pdf', changefreq: 'weekly', priority: '1.0' },
    { loc: 'https://printsign.org/reorder-rotate-pdf', changefreq: 'weekly', priority: '1.0' },
    { loc: 'https://printsign.org/compress-pdf', changefreq: 'weekly', priority: '1.0' },
    { loc: 'https://printsign.org/sign-pdf', changefreq: 'weekly', priority: '1.0' },
    { loc: 'https://printsign.org/unlock-decrypt-pdf', changefreq: 'weekly', priority: '0.9' },
    { loc: 'https://printsign.org/watermark-pdf', changefreq: 'weekly', priority: '0.9' },
    { loc: 'https://printsign.org/extract-pdf-pages', changefreq: 'weekly', priority: '0.9' },
    { loc: 'https://printsign.org/editor', changefreq: 'weekly', priority: '0.9' },
    { loc: 'https://printsign.org/general-editor', changefreq: 'weekly', priority: '0.8' },
    // High-Intent Compliance & Comparison Routes
    { loc: 'https://printsign.org/ilovepdf-smallpdf-offline-alternative', changefreq: 'weekly', priority: '0.9' },
    { loc: 'https://printsign.org/hipaa-compliant-pdf-redaction', changefreq: 'weekly', priority: '0.9' },
    { loc: 'https://printsign.org/nist-800-88-pdf-sanitization', changefreq: 'weekly', priority: '0.9' },
    { loc: 'https://printsign.org/gdpr-article-32-pdf-compliance', changefreq: 'weekly', priority: '0.9' },
    { loc: 'https://printsign.org/foia-document-redaction-tool', changefreq: 'weekly', priority: '0.9' },
    // Vertical Industry Hub Routes
    { loc: 'https://printsign.org/for-lawyers', changefreq: 'weekly', priority: '0.9' },
    { loc: 'https://printsign.org/for-healthcare', changefreq: 'weekly', priority: '0.9' },
    { loc: 'https://printsign.org/for-journalists', changefreq: 'weekly', priority: '0.9' },
    { loc: 'https://printsign.org/for-finance-accounting', changefreq: 'weekly', priority: '0.9' },
    // Knowledge Base, FAQ, Features, Security
    { loc: 'https://printsign.org/guides', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://printsign.org/faq', changefreq: 'monthly', priority: '0.8' },
    { loc: 'https://printsign.org/features', changefreq: 'monthly', priority: '0.8' },
    { loc: 'https://printsign.org/security-architecture', changefreq: 'monthly', priority: '0.8' },
    { loc: 'https://printsign.org/sitemap', changefreq: 'weekly', priority: '0.8' },
    // Blog Hub
    { loc: 'https://printsign.org/blog', changefreq: 'weekly', priority: '0.9' },
    // Company & Legal
    { loc: 'https://printsign.org/about-us', changefreq: 'monthly', priority: '0.7' },
    { loc: 'https://printsign.org/contact-us', changefreq: 'monthly', priority: '0.7' },
    { loc: 'https://printsign.org/privacy-policy', changefreq: 'monthly', priority: '0.5' },
    { loc: 'https://printsign.org/terms-of-service', changefreq: 'monthly', priority: '0.5' },
    { loc: 'https://printsign.org/cookie-policy', changefreq: 'monthly', priority: '0.5' }
  ]

  function formatIsoDate(d) {
    if (!d) return nowIso
    const parsed = new Date(d)
    if (!isNaN(parsed.getTime())) {
      return `${parsed.toISOString().split('T')[0]}T00:00:00+00:00`
    }
    return nowIso
  }

  const blogs = loadBlogPosts()
  const blogRoutes = blogs.map(b => ({
    loc: `https://printsign.org/blog/${b.slug}`,
    changefreq: 'weekly',
    priority: '0.8',
    lastmod: formatIsoDate(b.date)
  }))

  const allUrls = [...staticRoutes, ...blogRoutes]

  const xmlEntries = allUrls
    .map(
      item => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${item.lastmod || nowIso}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
    )
    .join('\n')

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>
`

  // 1. Write to public/sitemap.xml
  fs.mkdirSync(publicDir, { recursive: true })
  fs.writeFileSync(path.resolve(publicDir, 'sitemap.xml'), sitemapXml, 'utf8')
  console.log(`✓ [Sitemap] Generated public/sitemap.xml (${allUrls.length} routes)`)

  // 2. If dist exists, write to dist/sitemap.xml
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.resolve(distDir, 'sitemap.xml'), sitemapXml, 'utf8')
    console.log(`✓ [Sitemap] Synchronized dist/sitemap.xml`)
  }

  // 3. Ensure robots.txt in public and dist
  const robotsTxt = `# PrintSign - 100% Client-Side In-Browser PDF Editor & Redactor
# https://printsign.org
# Generative Engine Optimization (GEO) & Machine-Readable Context:
# LLM Context Index: https://printsign.org/llms.txt
# Full Documentation Corpus: https://printsign.org/llms-full.txt

User-agent: *
Allow: /

# Primary Search Engine Crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: YandexBot
Allow: /

User-agent: Applebot
Allow: /

# Generative AI & Answer Engine Crawlers
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://printsign.org/sitemap.xml
`
  fs.writeFileSync(path.resolve(publicDir, 'robots.txt'), robotsTxt, 'utf8')
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.resolve(distDir, 'robots.txt'), robotsTxt, 'utf8')
  }
  console.log(`✓ [Robots.txt] Verified public/robots.txt and dist/robots.txt referencing sitemap.xml`)
}

// Execute directly if run as a script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateSitemap()
}
