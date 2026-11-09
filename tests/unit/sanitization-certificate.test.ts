import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import {
  auditPdfBuffer,
  computeSha256,
  generateSanitizationCertificatePdf,
  type PdfAuditReport
} from '../../src/services/pdfVerifier'

describe('Stage 8: SHA-256 PDF Sanitization Certificate & Backlink Badge Suite', () => {
  const rootDir = path.resolve(__dirname, '../..')
  const badgePath = path.resolve(rootDir, 'public/badges/verified-zero-cloud.svg')

  it('computes a deterministic 64-character hex SHA-256 hash across identical buffers', async () => {
    const sampleText = new TextEncoder().encode('PrintSign Zero-Cloud Client-Side Sanitization Test')
    const hash1 = await computeSha256(sampleText)
    const hash2 = await computeSha256(sampleText)

    expect(hash1).toBe(hash2)
    expect(hash1).toMatch(/^[a-f0-9]{64}$/)
  })

  it('runs auditPdfBuffer and populates sha256Digest on the audit report', async () => {
    // Generate a quick synthetic PDF
    const doc = await PDFDocument.create()
    const font = await doc.embedFont(StandardFonts.Helvetica)
    const page = doc.addPage([400, 300])
    page.drawText('Sanitization Certificate Audit Target', { x: 50, y: 200, font, size: 12 })
    const pdfBytes = await doc.save()

    const report = await auditPdfBuffer(pdfBytes, 'test-target.pdf')

    expect(report.sha256Digest).toBeDefined()
    expect(report.sha256Digest).toMatch(/^[a-f0-9]{64}$/)
    expect(report.fileName).toBe('test-target.pdf')
    expect(report.fileSizeBytes).toBe(pdfBytes.length)
  })

  it('generates a valid, single-page PDF sanitization certificate byte array starting with %PDF-', async () => {
    const mockReport: PdfAuditReport = {
      fileName: 'court-filing-exhibit-a.pdf',
      fileSizeBytes: 48291,
      sha256Digest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      overallStatus: 'PASSED',
      statusBadge: 'PASSED (Pure Raster & Clean Metadata)',
      summaryHeadline: 'Document is Forensically Sanitized & Redacted',
      summaryDescription: 'Zero selectable vector text items, zero cosmetic annotation overlays, and zero Info/XMP metadata streams were detected.',
      totalPageCount: 3,
      pureRasterPageCount: 3,
      pagesWithSelectableTextCount: 0,
      totalSelectableTextItems: 0,
      totalAnnotationsCount: 0,
      hasHiddenMetadata: false,
      hasXmpStream: false,
      metadata: {
        title: null,
        author: null,
        subject: null,
        keywords: [],
        creator: null,
        producer: null,
        creationDate: null,
        modDate: null,
        hasXmpStream: false,
        xmpSizeBytes: 0,
        rawXmpSnippet: null,
        infoItems: [],
        populatedCount: 0
      },
      pages: [
        {
          pageNumber: 1,
          selectableTextCount: 0,
          hasSelectableText: false,
          sampleText: '',
          annotationCount: 0,
          widgetCount: 0,
          isPureRaster: true
        }
      ],
      recommendations: [],
      scannedAt: Date.now()
    }

    const certBytes = await generateSanitizationCertificatePdf(mockReport)

    expect(certBytes).toBeInstanceOf(Uint8Array)
    expect(certBytes.length).toBeGreaterThan(500)

    // Verify PDF header %PDF-
    const header = new TextDecoder('utf-8').decode(certBytes.slice(0, 5))
    expect(header).toBe('%PDF-')

    // Inspect compiled document using PDFDocument.load
    const parsedCert = await PDFDocument.load(certBytes)
    expect(parsedCert.getPageCount()).toBe(1)
    expect(parsedCert.getTitle()).toContain('Sanitization Certificate')
  })

  it('verifies public/badges/verified-zero-cloud.svg exists, is valid SVG, and contains backlink target identifiers', () => {
    expect(fs.existsSync(badgePath)).toBe(true)
    const svgContent = fs.readFileSync(badgePath, 'utf8')

    expect(svgContent).toContain('<svg')
    expect(svgContent).toContain('</svg>')
    expect(svgContent).toContain('PRINTSIGN')
    expect(svgContent).toContain('ZERO-LEAK PDF')
    expect(svgContent).toContain('width="232"')
    expect(svgContent).toContain('height="32"')
  })
})
