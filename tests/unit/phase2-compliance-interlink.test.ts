import { describe, it, expect } from 'vitest'
import { blogs } from '../../src/data/blogs'
import { seoMetadata } from '../../src/config/seoMetadata.js'
import { toolSeoContent } from '../../src/config/seoContent'

describe('Phase 2: Compliance, Comparison & Blog Interlinking Suite', () => {
  it('verifies all 18 blog posts have valid primary and secondary dedicated tool mappings', () => {
    expect(blogs.length).toBe(18)

    const validRoutes = [
      '/redact-pdf',
      '/scrub-pdf-metadata',
      '/compress-pdf',
      '/flatten-rasterize-pdf',
      '/split-pdf',
      '/merge-pdf',
      '/reorder-rotate-pdf',
      '/verify-redaction',
      '/ilovepdf-smallpdf-offline-alternative',
      '/hipaa-compliant-pdf-redaction',
      '/nist-800-88-pdf-sanitization'
    ]

    blogs.forEach((post) => {
      expect(post.primaryTool, `Blog ${post.slug} missing primaryTool`).toBeDefined()
      expect(post.secondaryTool, `Blog ${post.slug} missing secondaryTool`).toBeDefined()

      expect(validRoutes).toContain(post.primaryTool!.route)
      expect(validRoutes).toContain(post.secondaryTool!.route)
      expect(post.primaryTool!.name.length).toBeGreaterThan(0)
      expect(post.primaryTool!.description.length).toBeGreaterThan(0)
      expect(post.primaryTool!.ctaText.length).toBeGreaterThan(0)
    })
  })

  it('validates SEO metadata and schema for all 3 high-intent compliance routes', () => {
    const complianceRoutes = [
      '/ilovepdf-smallpdf-offline-alternative',
      '/hipaa-compliant-pdf-redaction',
      '/nist-800-88-pdf-sanitization'
    ]

    complianceRoutes.forEach((route) => {
      const seo = seoMetadata[route]
      expect(seo, `Route ${route} missing in seoMetadata`).toBeDefined()
      expect(seo.title.length).toBeGreaterThan(20)
      expect(seo.description.length).toBeGreaterThan(50)
      expect(seo.h1.length).toBeGreaterThan(10)
      expect(seo.schema).toBeDefined()
      expect(seo.schema['@type']).toBe('WebApplication')
      expect(seo.featureList?.length).toBeGreaterThanOrEqual(3)
    })

    expect(seoMetadata['/ilovepdf-smallpdf-offline-alternative'].title).toContain('iLovePDF & Smallpdf')
    expect(seoMetadata['/hipaa-compliant-pdf-redaction'].title).toContain('HIPAA-Compliant')
    expect(seoMetadata['/nist-800-88-pdf-sanitization'].title).toContain('NIST SP 800-88')
  })

  it('verifies rich crawlable SEO content for all 3 compliance routes exceeds 450 words each', () => {
    const complianceRoutes = [
      '/ilovepdf-smallpdf-offline-alternative',
      '/hipaa-compliant-pdf-redaction',
      '/nist-800-88-pdf-sanitization'
    ]

    complianceRoutes.forEach((route) => {
      const content = toolSeoContent[route]
      expect(content, `Content missing for ${route}`).toBeDefined()
      expect(content.heading.length).toBeGreaterThan(0)
      expect(content.highlights.length).toBeGreaterThanOrEqual(3)
      expect(content.sections.length).toBeGreaterThanOrEqual(3)
      expect(content.faq?.length).toBeGreaterThanOrEqual(3)

      let totalWords = 0
      totalWords += content.heading.split(/\s+/).length
      totalWords += content.subheading.split(/\s+/).length
      content.highlights.forEach(h => {
        totalWords += h.title.split(/\s+/).length + h.desc.split(/\s+/).length
      })
      content.sections.forEach(sec => {
        totalWords += sec.title.split(/\s+/).length
        sec.paragraphs.forEach(p => {
          totalWords += p.split(/\s+/).length
        })
        sec.bullets?.forEach(b => {
          totalWords += b.split(/\s+/).length
        })
      })
      content.faq?.forEach(f => {
        totalWords += f.q.split(/\s+/).length + f.a.split(/\s+/).length
      })

      expect(totalWords, `Route ${route} word count (${totalWords}) should be >= 450`).toBeGreaterThanOrEqual(450)
    })
  })
})
