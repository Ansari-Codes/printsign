import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('Strict Static HTML & Privacy Cleanliness Verification', () => {
  const distDir = path.resolve(process.cwd(), 'dist')
  const rootIndexHtml = path.resolve(process.cwd(), 'index.html')
  const prohibitedTrackers = /googletagmanager|google-analytics|gtag\(|adsbygoogle|preconnect.*(?:googletagmanager|google-analytics|doubleclick)/i

  it('ensures zero occurrences of ADVERTISEMENT or AdSense in src components and views', () => {
    function walk(dir: string): string[] {
      let results: string[] = []
      const list = fs.readdirSync(dir)
      list.forEach(file => {
        const full = path.join(dir, file)
        const stat = fs.statSync(full)
        if (stat && stat.isDirectory()) {
          results = results.concat(walk(full))
        } else if (/\.(vue|ts|js)$/.test(file)) {
          results.push(full)
        }
      })
      return results
    }

    const srcFiles = walk(path.resolve(process.cwd(), 'src'))
    const violatingFiles: string[] = []

    srcFiles.forEach(f => {
      const content = fs.readFileSync(f, 'utf8')
      if (/advertisement|adsense/i.test(content)) {
        violatingFiles.push(path.relative(process.cwd(), f))
      }
    })

    expect(violatingFiles).toEqual([])
  })

  it('ensures zero third-party tracking scripts, preconnects, or telemetry in root index.html', () => {
    expect(fs.existsSync(rootIndexHtml)).toBe(true)
    const content = fs.readFileSync(rootIndexHtml, 'utf8')
    expect(content).not.toMatch(prohibitedTrackers)
  })

  it('ensures zero legacy printsign.org/editor links in blog tutorials', () => {
    const blogsPath = path.resolve(process.cwd(), 'src/data/blogs.ts')
    const blogsContent = fs.readFileSync(blogsPath, 'utf8')
    const matches = blogsContent.match(/printsign\.org\/editor/g) || []
    expect(matches.length).toBe(0)
  })

  it('asserts dist/ HTML files contain zero ADVERTISEMENT/AdSense/trackers and have unique titles & canonicals', () => {
    const targetFiles = [
      'f12-network-audit/index.html',
      'for-lawyers/index.html',
      'for-healthcare/index.html',
      'for-journalists/index.html',
      'contact-us/index.html',
      'blog/compress-pdf-file-size-without-losing-quality/index.html',
      'blog/how-to-permanently-redact-pdf-court-compliant/index.html'
    ]

    const titles = new Set<string>()
    const canonicals = new Set<string>()

    for (const relPath of targetFiles) {
      const fullPath = path.resolve(distDir, relPath)
      expect(fs.existsSync(fullPath)).toBe(true)

      const html = fs.readFileSync(fullPath, 'utf8')

      // Assert zero occurrences of ADVERTISEMENT or AdSense
      expect(html).not.toMatch(/ADVERTISEMENT|AdSense/i)

      // Assert zero tracking scripts or preconnects
      expect(html).not.toMatch(prohibitedTrackers)

      // Assert unique title
      const titleMatch = html.match(/<title>(.*?)<\/title>/i)
      expect(titleMatch).toBeTruthy()
      const title = titleMatch![1].trim()
      expect(title.length).toBeGreaterThan(5)
      expect(titles.has(title)).toBe(false)
      titles.add(title)

      // Assert unique canonical
      const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']\s*\/?>/i)
      expect(canonicalMatch).toBeTruthy()
      const canonical = canonicalMatch![1].trim()
      expect(canonical.startsWith('https://printsign.org/')).toBe(true)
      expect(canonicals.has(canonical)).toBe(false)
      canonicals.add(canonical)

      // Assert valid H1
      const h1Match = html.match(/<h1>(.*?)<\/h1>/i)
      expect(h1Match).toBeTruthy()
      expect(h1Match![1].trim().length).toBeGreaterThan(0)
    }
  })

  it('asserts math blog pre-renders KaTeX DOM and MathML correctly', () => {
    const mathBlogPath = path.resolve(distDir, 'blog/how-to-permanently-redact-pdf-court-compliant/index.html')
    if (fs.existsSync(mathBlogPath)) {
      const html = fs.readFileSync(mathBlogPath, 'utf8')
      expect(html).toContain('katex-rendered')
      expect(html).toContain('class="katex"')
      expect(html).toContain('<math xmlns="http://www.w3.org/1998/Math/MathML"')
    }
  })

  it('validates GSC top-impression blog titles, descriptions, headings, and tool CTAs in blogs.ts and seoMetadata.js', () => {
    const blogsRaw = fs.readFileSync(path.resolve(process.cwd(), 'src/data/blogs.ts'), 'utf8')
    const seoRaw = fs.readFileSync(path.resolve(process.cwd(), 'src/config/seoMetadata.js'), 'utf8')

    // 1. Compress PDF
    expect(seoRaw).toContain('Lossless PDF Compression (No Quality Loss, Preserves Signatures & SDK Guide) | PrintSign')
    expect(blogsRaw).toContain('Lossless PDF Compression vs. Downsampling: Preserving Digital Signatures &amp; SDK/WebAssembly Workflows')
    expect(blogsRaw).toContain('Launch Free Lossless PDF Compressor — No Upload Required →')

    // 2. High-DPI PDF Rasterization
    expect(seoRaw).toContain('150 vs 300 vs 600 DPI PDF Rasterization: Complete Comparison & Calculator (2026)')
    expect(blogsRaw).toContain('600 DPI (Print &amp; Press)')
    expect(blogsRaw).toContain('/flatten-rasterize-pdf')

    // 3. Adobe Acrobat Alternatives
    expect(seoRaw).toContain('7 Best Free Adobe Acrobat Alternatives in 2026 (No Watermarks, No Cloud Upload)')
    expect(blogsRaw).toContain("Free PDF Combiner &amp; Editor Tools That Don't Add Watermarks")
    expect(blogsRaw).toContain('/merge-pdf')
    expect(blogsRaw).toContain('/ilovepdf-smallpdf-offline-alternative')

    // 4. Financial Document Redaction
    expect(seoRaw).toContain('How to Redact Bank Statements & Tax Returns Safely (Free, No Upload — 2026)')
    expect(blogsRaw).toContain('/redact-pdf')
    expect(blogsRaw).toContain('/verify-redaction')

    // 5. GDPR Article 32
    expect(seoRaw).toContain('GDPR Article 32 (Security of Processing Text): PDF & Document Compliance Guide (2026)')
    expect(blogsRaw).toContain('GDPR Article 32 Official Text:')

    // 6. Why Black Boxes Fail
    expect(seoRaw).toContain('Why a Black Redacted Box Fails in PDFs (Client-Side vs. Server-Side PDF Redaction)')
    expect(blogsRaw).toContain('Client-Side vs. Server-Side PDF Redaction: Why Redaction Boxes Leak Data')
    expect(blogsRaw).toContain('Test Your PDF for Hidden Text Under Black Boxes →')

    // 7. Page-1 CTR Upgrades
    expect(seoRaw).toContain('eDiscovery PDF Sanitization & Metadata Removal Checklist (Free Local Tool — 2026)')
    expect(seoRaw).toContain('HIPAA-Compliant PDF Redaction & Medical Record Editor (Free, Zero Cloud Upload)')
    expect(seoRaw).toContain('iLovePDF & Smallpdf Offline Alternative: Zero-Upload PDF Security Comparison (2026)')
  })

  it('validates homepage / JSON-LD @graph includes WebSite and Organization schemas for brand query ranking', () => {
    const seoRaw = fs.readFileSync(path.resolve(process.cwd(), 'src/config/seoMetadata.js'), 'utf8')
    expect(seoRaw).toContain("'@type': 'WebSite'")
    expect(seoRaw).toContain("alternateName: ['PrintSign.org', 'PrintSign PDF']")
    expect(seoRaw).toContain("'@type': 'Organization'")
    expect(seoRaw).toContain("logo: 'https://printsign.org/favicon.svg'")
    expect(seoRaw).toContain("sameAs: ['https://github.com/Ansari-Codes/printsign']")
  })

  it('verifies dist/sitemap.xml lists >=54 W3C ISO 8601 URLs and every route has a rich >450-word pre-rendered dist HTML with matching canonical', () => {
    const sitemapPath = path.resolve(distDir, 'sitemap.xml')
    expect(fs.existsSync(sitemapPath)).toBe(true)
    const sitemapXml = fs.readFileSync(sitemapPath, 'utf8')

    const locs = [...sitemapXml.matchAll(/<loc>(https:\/\/printsign\.org[^<]*)<\/loc>/g)].map(m => m[1])
    expect(locs.length).toBeGreaterThanOrEqual(54)

    // Verify W3C ISO 8601 lastmod format across all entries
    const lastmods = [...sitemapXml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(m => m[1])
    expect(lastmods.length).toBe(locs.length)
    for (const lm of lastmods) {
      expect(lm).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+00:00$/)
    }

    for (const url of locs) {
      const routePath = url.replace('https://printsign.org', '') || '/'
      const relHtmlPath = routePath === '/' ? 'index.html' : `${routePath.replace(/^\//, '')}/index.html`
      const fullHtmlPath = path.resolve(distDir, relHtmlPath)
      expect(fs.existsSync(fullHtmlPath), `Missing pre-rendered HTML for ${url}`).toBe(true)

      const html = fs.readFileSync(fullHtmlPath, 'utf8')
      expect(html).not.toMatch(prohibitedTrackers)
      expect(html).not.toMatch(/ADVERTISEMENT|AdSense/i)

      const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']\s*\/?>/i)
      expect(canonicalMatch).toBeTruthy()
      expect(canonicalMatch![1]).toBe(url)

      const appStart = html.indexOf('<div id="app">')
      const appEnd = html.indexOf('<script', appStart)
      expect(appStart).toBeGreaterThan(-1)
      const bodySlice = appEnd > -1 ? html.slice(appStart, appEnd) : html.slice(appStart)
      const strippedText = bodySlice
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
      const wordCount = strippedText.split(/\s+/).filter(Boolean).length
      expect(wordCount, `${relHtmlPath} semantic word count (${wordCount}) must exceed 450`).toBeGreaterThan(450)
    }
  })
})
