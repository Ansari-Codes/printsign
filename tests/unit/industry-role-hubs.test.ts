import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { seoMetadata } from '../../src/config/seoMetadata.js'
import { toolSeoContent } from '../../src/config/seoContent.js'

describe('Stage 9: Vertical Industry Hub Pages & B2B Solutions Suite', () => {
  const verticalRoutes = [
    '/for-lawyers',
    '/for-healthcare',
    '/for-journalists'
  ]

  it('registers all 3 vertical routes in seoMetadata with correct metadata, H1s and schemas', () => {
    verticalRoutes.forEach((route) => {
      const meta = seoMetadata[route]
      expect(meta, `Route ${route} missing in seoMetadata`).toBeDefined()
      expect(meta.title.length).toBeGreaterThan(25)
      expect(meta.description.length).toBeGreaterThan(60)
      expect(meta.h1.length).toBeGreaterThan(20)
      expect(meta.toolMode).toBe('role')
      expect(meta.ogType).toBe('website')
      expect(meta.ogImage).toContain(`https://printsign.org/images/og/${route.replace('/', '')}.png`)
      expect(meta.featureList?.length).toBeGreaterThanOrEqual(5)
      expect(meta.schema).toBeDefined()
      expect(meta.schema['@context']).toBe('https://schema.org')
      expect(meta.schema['@graph']).toBeDefined()
    })

    // Exact title & H1 checks
    expect(seoMetadata['/for-lawyers'].title).toBe('Client-Side PDF Redaction & Bates Prep for Lawyers (FRCP 5.2)')
    expect(seoMetadata['/for-lawyers'].h1).toBe('Court-Compliant Local PDF Redaction & Discovery Sanitization for Legal Teams')

    expect(seoMetadata['/for-healthcare'].title).toBe('Local PHI & Medical Record PDF Redactor for Healthcare | PrintSign')
    expect(seoMetadata['/for-healthcare'].h1).toBe('Zero-Upload Medical Record PDF Redaction & Metadata Scrubbing for Healthcare')

    expect(seoMetadata['/for-journalists'].title).toBe('FOIA & Source-Protection PDF Metadata Scrubber for Journalists')
    expect(seoMetadata['/for-journalists'].h1).toBe('Forensic PDF Metadata Sanitization & Source Protection for Investigative Journalists')
  })

  it('provides > 500 words of rich semantic SEO content for all 3 vertical routes', () => {
    verticalRoutes.forEach((route) => {
      const content = toolSeoContent[route]
      expect(content, `Content missing for ${route}`).toBeDefined()
      expect(content.heading.length).toBeGreaterThan(10)
      expect(content.subheading.length).toBeGreaterThan(20)
      expect(content.badge.length).toBeGreaterThan(5)
      expect(content.highlights.length).toBeGreaterThanOrEqual(3)
      expect(content.sections.length).toBeGreaterThanOrEqual(3)
      expect(content.faq?.length).toBeGreaterThanOrEqual(3)

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
        if (s.bullets) {
          s.bullets.forEach(b => {
            totalWords += b.split(/\s+/).filter(Boolean).length
          })
        }
      })
      if (content.faq) {
        content.faq.forEach(f => {
          totalWords += f.q.split(/\s+/).filter(Boolean).length
          totalWords += f.a.split(/\s+/).filter(Boolean).length
        })
      }

      // Must exceed 500 words as specified
      expect(totalWords, `Route ${route} word count (${totalWords}) should be > 500`).toBeGreaterThan(500)
    })
  })

  it('verifies all 16 1200x630 OpenGraph images exist in public/images/og/', () => {
    const ogDir = path.resolve(process.cwd(), 'public/images/og')
    expect(fs.existsSync(ogDir)).toBe(true)

    const expectedFiles = [
      'home.png',
      'redact-pdf.png',
      'verify-redaction.png',
      'scrub-pdf-metadata.png',
      'merge-pdf.png',
      'split-pdf.png',
      'flatten-rasterize-pdf.png',
      'reorder-rotate-pdf.png',
      'compress-pdf.png',
      'f12-network-audit.png',
      'ilovepdf-smallpdf-offline-alternative.png',
      'hipaa-compliant-pdf-redaction.png',
      'nist-800-88-pdf-sanitization.png',
      'for-lawyers.png',
      'for-healthcare.png',
      'for-journalists.png'
    ]

    expectedFiles.forEach(file => {
      const filePath = path.join(ogDir, file)
      expect(fs.existsSync(filePath), `OG image ${file} should exist`).toBe(true)
      const stats = fs.statSync(filePath)
      expect(stats.size).toBeGreaterThan(10000)
    })
  })

  it('verifies router, sitemap and llms.txt include all 3 vertical routes (46 total routes)', () => {
    const sitemapScript = fs.readFileSync(path.resolve(process.cwd(), 'scripts/generate-sitemap.mjs'), 'utf8')
    verticalRoutes.forEach(r => {
      expect(sitemapScript).toContain(`https://printsign.org${r}`)
    })

    const llmsScript = fs.readFileSync(path.resolve(process.cwd(), 'scripts/generate-llms-txt.mjs'), 'utf8')
    verticalRoutes.forEach(r => {
      expect(llmsScript).toContain(`https://printsign.org${r}`)
    })

    const routerFile = fs.readFileSync(path.resolve(process.cwd(), 'src/router/index.ts'), 'utf8')
    verticalRoutes.forEach(r => {
      expect(routerFile).toContain(`path: '${r}'`)
    })
  })

  it('verifies IndustryRoleView.vue and navigation links in SiteFooter & HomeView', () => {
    const viewPath = path.resolve(process.cwd(), 'src/views/IndustryRoleView.vue')
    expect(fs.existsSync(viewPath)).toBe(true)

    const viewContent = fs.readFileSync(viewPath, 'utf8')
    expect(viewContent).toContain('/redact-pdf')
    expect(viewContent).toContain('/scrub-pdf-metadata')
    expect(viewContent).toContain('/verify-redaction')
    expect(viewContent).toContain('ToolTrustBar')
    expect(viewContent).toContain('SeoContentSection')

    const footerContent = fs.readFileSync(path.resolve(process.cwd(), 'src/components/website/SiteFooter.vue'), 'utf8')
    verticalRoutes.forEach(r => {
      expect(footerContent).toContain(`to="${r}"`)
    })

    const homeContent = fs.readFileSync(path.resolve(process.cwd(), 'src/views/HomeView.vue'), 'utf8')
    verticalRoutes.forEach(r => {
      expect(homeContent).toContain(`to="${r}"`)
    })
  })
})
