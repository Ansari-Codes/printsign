import { describe, it, expect } from 'vitest'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { auditPdfBuffer } from '../../src/services/pdfVerifier'
import { seoMetadata } from '../../src/config/seoMetadata.js'
import { toolSeoContent } from '../../src/config/seoContent'

describe('PDF Redaction & Metadata Verifier Suite', () => {
  it('detects cosmetic redaction, selectable text layer, and populated metadata', async () => {
    const doc = await PDFDocument.create()
    const font = await doc.embedFont(StandardFonts.Helvetica)
    
    // Set metadata
    doc.setTitle('Classified Operation Memo')
    doc.setAuthor('Agent 007')
    doc.setProducer('Adobe PDF Engine')
    doc.setCreationDate(new Date('2026-01-01T00:00:00Z'))

    // Add page with selectable text + fake black box
    const page = doc.addPage([500, 300])
    page.drawText('Target coordinates: 37.7749 N, 122.4194 W', {
      x: 50,
      y: 200,
      size: 12,
      font,
      color: rgb(0, 0, 0)
    })

    // Cosmetic black box placed over text
    page.drawRectangle({
      x: 45,
      y: 195,
      width: 350,
      height: 25,
      color: rgb(0, 0, 0)
    })

    const pdfBytes = await doc.save()

    const report = await auditPdfBuffer(pdfBytes, 'test-leaking.pdf')

    expect(report.overallStatus).toBe('ACTION_REQUIRED')
    expect(report.totalPageCount).toBe(1)
    expect(report.pagesWithSelectableTextCount).toBe(1)
    expect(report.totalSelectableTextItems).toBeGreaterThan(0)
    expect(report.hasHiddenMetadata).toBe(true)
    expect(report.metadata.author).toBe('Agent 007')
    expect(report.metadata.title).toBe('Classified Operation Memo')
    expect(report.recommendations.length).toBeGreaterThan(0)

    // Check that recommendations contain CTAs to /redact-pdf and /scrub-pdf-metadata
    const routes = report.recommendations.map(r => r.ctaRoute)
    expect(routes).toContain('/redact-pdf')
    expect(routes).toContain('/scrub-pdf-metadata')
  })

  it('verifies a clean pure-raster document with scrubbed metadata passes audit', async () => {
    const doc = await PDFDocument.create()
    // Blank page with no text and no metadata
    doc.addPage([400, 400])

    // Ensure title/author are empty
    doc.setTitle('')
    doc.setAuthor('')

    const pdfBytes = await doc.save()

    const report = await auditPdfBuffer(pdfBytes, 'clean-sanitized.pdf')

    expect(report.overallStatus).toBe('PASSED')
    expect(report.statusBadge).toContain('PASSED')
    expect(report.totalSelectableTextItems).toBe(0)
    expect(report.pureRasterPageCount).toBe(1)
    expect(report.hasHiddenMetadata).toBe(false)
  })

  it('validates /verify-redaction SEO metadata and JSON-LD schema', () => {
    const verifierSeo = seoMetadata['/verify-redaction']
    expect(verifierSeo).toBeDefined()
    expect(verifierSeo.title).toBe('PDF Redaction & Metadata Verifier — Local Inspection Tool')
    expect(verifierSeo.description).toContain('100% local browser inspection')
    expect(verifierSeo.schema).toBeDefined()
    expect(verifierSeo.schema['@type']).toBe('WebApplication')
    expect(verifierSeo.schema.featureList).toContain('Local PDF Redaction Verification')
    expect(verifierSeo.schema.featureList).toContain('Selectable Text Layer Detection')
    expect(verifierSeo.schema.featureList).toContain('XMP Metadata Stream Inspector')
  })

  it('verifies /verify-redaction below-the-fold SEO content exceeds 400 words', () => {
    const content = toolSeoContent['/verify-redaction']
    expect(content).toBeDefined()
    expect(content.heading).toContain('PDF Redaction & Metadata Audit')
    expect(content.highlights.length).toBeGreaterThanOrEqual(3)
    expect(content.sections.length).toBeGreaterThanOrEqual(3)
    expect(content.faq?.length).toBeGreaterThanOrEqual(2)

    // Calculate word count
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

    expect(totalWords).toBeGreaterThanOrEqual(400)
  })
})
