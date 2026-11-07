import { describe, it, expect } from 'vitest'
import { PDFDocument, rgb } from 'pdf-lib'
import {
  createSyntheticFixturePdf,
  CANARY_SECRET_A,
  CANARY_SECRET_B
} from '../fixtures/create-synthetic-pdf'
import {
  scanRawBytesForString,
  extractAllText,
  verifyRedactionAbsence
} from '../../src/modules/verification/canary'
import { purgeOrphanIndirectObjects } from '../../src/modules/redactor/gc'

describe('Redaction Canary Verification Suite (Tests 3a, 3b, 3c)', () => {
  it('Baseline check: Canary secret is present in raw bytes and extracted text before redaction', async () => {
    const rawPdf = await createSyntheticFixturePdf()

    // Canary A must be present in raw bytes
    const foundInBytes = scanRawBytesForString(rawPdf, CANARY_SECRET_A)
    expect(foundInBytes).toBe(true)

    // Canary A must be present in extracted text
    const extracted = await extractAllText(rawPdf)
    const textJoined = extracted.join(' ')
    expect(textJoined).toContain(CANARY_SECRET_A)
  })

  it('Test 3c [Negative Control]: Drawing a black box without GC/page replacement leaves canary in raw bytes', async () => {
    const rawPdf = await createSyntheticFixturePdf()
    const doc = await PDFDocument.load(rawPdf)

    // "Fake Redaction": Draw a black rectangle over the text
    const page1 = doc.getPage(0)
    page1.drawRectangle({
      x: 40,
      y: 270,
      width: 400,
      height: 30,
      color: rgb(0, 0, 0)
    })

    const exportedBytes = await doc.save()

    // The black box obscures visuals, but CANARY_SECRET_A is STILL in the content stream!
    const byteScanFound = scanRawBytesForString(exportedBytes, CANARY_SECRET_A)
    expect(byteScanFound).toBe(true)

    // The text is also still extractable by pdf.js text layer!
    const extracted = await extractAllText(exportedBytes)
    expect(extracted.join(' ')).toContain(CANARY_SECRET_A)

    // This proves the verification test suite successfully detects fake redaction
  })

  it('Test 3a & 3b: True rasterize/replace + Orphan GC purges canary from BOTH extracted text and raw bytes', async () => {
    const rawPdf = await createSyntheticFixturePdf()
    const doc = await PDFDocument.load(rawPdf)

    // 1. Emulate page replacement: Replace Page 1 with a clean raster image or blank replacement page
    // (representing rasterized burn-in page)
    const newPage = doc.insertPage(0, [600, 400])
    newPage.drawRectangle({
      x: 0,
      y: 0,
      width: 600,
      height: 400,
      color: rgb(1, 1, 1) // white background
    })
    newPage.drawRectangle({
      x: 50,
      y: 280,
      width: 300,
      height: 25,
      color: rgb(0, 0, 0) // burned black redaction box
    })

    // 2. Remove original Page 1 (now index 1)
    doc.removePage(1)

    // 3. Correctness requirement: Purge orphan indirect objects (unreferenced content streams)
    const gcStats = purgeOrphanIndirectObjects(doc)
    expect(gcStats.purgedObjectCount).toBeGreaterThan(0)

    // 4. Save clean PDF
    const cleanBytes = await doc.save()

    // Test 3a: Assert CANARY_SECRET_A is NOT extractable via pdfjs-dist
    const extractedPages = await extractAllText(cleanBytes)
    const allText = extractedPages.join(' ')
    expect(allText).not.toContain(CANARY_SECRET_A)

    // Test 3b: Assert CANARY_SECRET_A does NOT appear in raw byte sequence
    const foundInRawBytes = scanRawBytesForString(cleanBytes, CANARY_SECRET_A)
    expect(foundInRawBytes).toBe(false)

    // Comprehensive audit report
    const report = await verifyRedactionAbsence(cleanBytes, [CANARY_SECRET_A])
    expect(report.passed).toBe(true)
    expect(report.textExtractionClean).toBe(true)
    expect(report.rawByteScanClean).toBe(true)
  })
})
