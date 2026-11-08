import { describe, it, expect } from 'vitest'
import { seoMetadata } from '../../src/config/seoMetadata.js'
import { toolSeoContent } from '../../src/config/seoContent.js'
import fs from 'node:fs'
import path from 'node:path'

describe('Phase 3: F12 Network Audit & Zero-Cloud Verification', () => {
  const route = '/f12-network-audit'

  it('registers /f12-network-audit in seoMetadata with correct titles and tags', () => {
    const meta = seoMetadata[route]
    expect(meta).toBeDefined()
    expect(meta.title).toBe('F12 Zero-Network Audit & Client-Side PDF Benchmark | PrintSign')
    expect(meta.description).toContain('Verify PrintSign\'s zero-cloud PDF architecture')
    expect(meta.h1).toBe('10-Second Reproducible Zero-Network & RAM Security Audit')
    expect(meta.toolMode).toBe('audit')
    expect(meta.schema.url).toBe('https://printsign.org/f12-network-audit')
  })

  it('provides > 450 words of crawlable semantic SEO content for /f12-network-audit', () => {
    const content = toolSeoContent[route]
    expect(content).toBeDefined()
    expect(content.highlights.length).toBeGreaterThanOrEqual(3)
    expect(content.sections.length).toBeGreaterThanOrEqual(3)

    let totalWords = 0
    content.highlights.forEach(h => {
      totalWords += h.title.split(/\s+/).filter(Boolean).length
      totalWords += h.desc.split(/\s+/).filter(Boolean).length
    })

    content.sections.forEach(s => {
      totalWords += s.title.split(/\s+/).filter(Boolean).length
      s.paragraphs.forEach(p => {
        totalWords += p.split(/\s+/).filter(Boolean).length
      })
    })

    // Phase 3 requirement: At least 450 words of rich semantic content
    expect(totalWords).toBeGreaterThan(450)
  })

  it('includes /f12-network-audit in the generated sitemap script and output', () => {
    const sitemapScriptPath = path.resolve(process.cwd(), 'scripts/generate-sitemap.mjs')
    const scriptContent = fs.readFileSync(sitemapScriptPath, 'utf8')
    expect(scriptContent).toContain('https://printsign.org/f12-network-audit')
  })

  it('contains launch kit documents with complete templates', () => {
    const launchKitDir = path.resolve(process.cwd(), 'docs/launch-kit')
    const files = fs.readdirSync(launchKitDir)
    expect(files).toContain('01-awesome-privacy-pr.md')
    expect(files).toContain('02-hacker-news-show-hn.md')
    expect(files).toContain('03-reddit-privacy-selfhosted-legaltech.md')
    expect(files).toContain('04-google-search-console-indexing-checklist.md')

    const awesomePrivacy = fs.readFileSync(path.join(launchKitDir, '01-awesome-privacy-pr.md'), 'utf8')
    expect(awesomePrivacy).toContain('https://printsign.org')
    expect(awesomePrivacy).toContain('Lissy93/awesome-privacy')

    const gscChecklist = fs.readFileSync(path.join(launchKitDir, '04-google-search-console-indexing-checklist.md'), 'utf8')
    expect(gscChecklist).toContain('https://printsign.org/f12-network-audit')
    expect(gscChecklist).toContain('https://printsign.org/verify-redaction')
  })
})
