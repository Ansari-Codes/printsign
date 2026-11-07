import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import {
  rotatePage,
  deletePages,
  reorderPage,
  insertBlankPage,
  duplicatePage,
  extractPages,
  mergePdfDocuments,
  splitPdfByRanges,
  cropPage
} from '../../src/modules/page-editor'
import { createSyntheticFixturePdf } from '../fixtures/create-synthetic-pdf'

describe('Page Operations Module', () => {
  it('rotates a page in 90 degree increments', async () => {
    const rawPdf = await createSyntheticFixturePdf()
    const doc = await PDFDocument.load(rawPdf)

    expect(doc.getPage(0).getRotation().angle).toBe(0)
    rotatePage(doc, 0, 90)
    expect(doc.getPage(0).getRotation().angle).toBe(90)
    rotatePage(doc, 0, 90)
    expect(doc.getPage(0).getRotation().angle).toBe(180)
  })

  it('deletes specific pages correctly', async () => {
    const rawPdf = await createSyntheticFixturePdf()
    const doc = await PDFDocument.load(rawPdf)
    expect(doc.getPageCount()).toBe(2)

    deletePages(doc, [0])
    expect(doc.getPageCount()).toBe(1)
  })

  it('reorders pages', async () => {
    const rawPdf = await createSyntheticFixturePdf()
    const doc = await PDFDocument.load(rawPdf)

    // Tag pages with different dimensions
    doc.getPage(0).setSize(100, 100)
    doc.getPage(1).setSize(200, 200)

    reorderPage(doc, 0, 1)
    expect(doc.getPage(0).getWidth()).toBe(200)
    expect(doc.getPage(1).getWidth()).toBe(100)
  })

  it('inserts blank page and duplicates page', async () => {
    const rawPdf = await createSyntheticFixturePdf()
    const doc = await PDFDocument.load(rawPdf)

    insertBlankPage(doc, 1, 300, 400)
    expect(doc.getPageCount()).toBe(3)
    expect(doc.getPage(1).getWidth()).toBe(300)

    await duplicatePage(doc, 1)
    expect(doc.getPageCount()).toBe(4)
  })

  it('extracts pages into new standalone PDF', async () => {
    const rawPdf = await createSyntheticFixturePdf()
    const doc = await PDFDocument.load(rawPdf)

    const extractedBytes = await extractPages(doc, [0])
    const extractedDoc = await PDFDocument.load(extractedBytes)
    expect(extractedDoc.getPageCount()).toBe(1)
  })

  it('merges additional PDFs', async () => {
    const rawPdf1 = await createSyntheticFixturePdf()
    const rawPdf2 = await createSyntheticFixturePdf()

    const targetDoc = await PDFDocument.load(rawPdf1)
    expect(targetDoc.getPageCount()).toBe(2)

    await mergePdfDocuments(targetDoc, [rawPdf2])
    expect(targetDoc.getPageCount()).toBe(4)
  })

  it('splits document by page ranges', async () => {
    const rawPdf = await createSyntheticFixturePdf()
    const doc = await PDFDocument.load(rawPdf)

    const splitParts = await splitPdfByRanges(doc, [
      { start: 1, end: 1 },
      { start: 2, end: 2 }
    ])

    expect(splitParts.length).toBe(2)
    const part1Doc = await PDFDocument.load(splitParts[0].bytes)
    expect(part1Doc.getPageCount()).toBe(1)
  })

  it('applies crop box to page', async () => {
    const rawPdf = await createSyntheticFixturePdf()
    const doc = await PDFDocument.load(rawPdf)

    cropPage(doc, 0, { x: 10, y: 10, width: 200, height: 200 })
    const page = doc.getPage(0)
    expect(page.getCropBox().width).toBe(200)
  })
})
