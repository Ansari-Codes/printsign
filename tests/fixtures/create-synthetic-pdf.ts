import { PDFDocument, rgb, StandardFonts, PDFName } from 'pdf-lib'

export const CANARY_SECRET_A = 'CANARY_SECRET_ALPHA_987654'
export const CANARY_SECRET_B = 'CANARY_SECRET_BRAVO_123456'

/**
 * Creates a synthetic multi-page PDF containing known canary secrets for testing.
 * The canary strings are explicitly added via uncompressed content streams so they
 * appear verbatim in raw binary byte scans, fulfilling Tests 3a, 3b, 3c.
 */
export async function createSyntheticFixturePdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)

  // Page 1: Standard text + Canary A
  const page1 = doc.addPage([600, 400])
  page1.drawText('CONFIDENTIAL AUDIT REPORT - SYNTHETIC TEST FIXTURE', {
    x: 50,
    y: 350,
    size: 14,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1)
  })

  page1.drawText('This document contains synthetic test data for redaction verification.', {
    x: 50,
    y: 320,
    size: 10,
    font,
    color: rgb(0.2, 0.2, 0.2)
  })

  page1.drawText('Public summary section: The audit was completed according to specifications.', {
    x: 50,
    y: 240,
    size: 10,
    font,
    color: rgb(0.2, 0.2, 0.2)
  })

  // Append uncompressed content stream with literal CANARY_SECRET_A
  const streamA = doc.context.stream(
    `BT /${fontBold.name} 12 Tf 50 280 Td (Secret Identifier: ${CANARY_SECRET_A}) Tj ET`
  )
  const refA = doc.context.register(streamA)
  const p1Contents = page1.node.get(PDFName.of('Contents'))
  const p1Array = doc.context.obj(Array.isArray(p1Contents) ? [...p1Contents, refA] : [p1Contents, refA])
  page1.node.set(PDFName.of('Contents'), p1Array)

  // Page 2: Canary B + Secondary data
  const page2 = doc.addPage([600, 400])
  page2.drawText('APPENDIX SECTION - SYNTHETIC RECORD', {
    x: 50,
    y: 350,
    size: 14,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1)
  })

  // Append uncompressed content stream with literal CANARY_SECRET_B
  const streamB = doc.context.stream(
    `BT /${font.name} 12 Tf 50 300 Td (Restricted Appendix Token: ${CANARY_SECRET_B}) Tj ET`
  )
  const refB = doc.context.register(streamB)
  const p2Contents = page2.node.get(PDFName.of('Contents'))
  const p2Array = doc.context.obj(Array.isArray(p2Contents) ? [...p2Contents, refB] : [p2Contents, refB])
  page2.node.set(PDFName.of('Contents'), p2Array)

  // Set standard metadata
  doc.setTitle('Synthetic Confidential Test Document')
  doc.setAuthor('Test Suite Generator')
  doc.setSubject('Canary Redaction Integrity Test')
  doc.setKeywords(['synthetic', 'fixture', 'canary'])
  doc.setCreator('PrintSign Test Harness')

  return await doc.save()
}
