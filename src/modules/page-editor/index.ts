import { PDFDocument, degrees } from 'pdf-lib'

export interface PageCropBox {
  x: number
  y: number
  width: number
  height: number
}

export interface SplitRange {
  start: number // 1-based inclusive
  end: number   // 1-based inclusive
  name?: string
}

/**
 * Rotates a specific page by angle delta (e.g., +90, -90, 180 degrees).
 */
export function rotatePage(doc: PDFDocument, pageIndex: number, deltaDegrees: number): void {
  const page = doc.getPage(pageIndex)
  const currentRotation = page.getRotation().angle
  const newRotation = (currentRotation + deltaDegrees + 360) % 360
  page.setRotation(degrees(newRotation))
}

/**
 * Deletes pages by indices (in descending order to avoid index shifts).
 */
export function deletePages(doc: PDFDocument, pageIndices: number[]): void {
  const sortedDesc = [...pageIndices].sort((a, b) => b - a)
  for (const idx of sortedDesc) {
    if (idx >= 0 && idx < doc.getPageCount()) {
      doc.removePage(idx)
    }
  }
}

/**
 * Reorders a page from fromIndex to toIndex.
 */
export function reorderPage(doc: PDFDocument, fromIndex: number, toIndex: number): void {
  const pageCount = doc.getPageCount()
  if (fromIndex === toIndex || fromIndex < 0 || fromIndex >= pageCount || toIndex < 0 || toIndex >= pageCount) {
    return
  }

  const page = doc.getPage(fromIndex)
  doc.removePage(fromIndex)
  doc.insertPage(toIndex, page)
}

/**
 * Inserts a blank page at the given index.
 * Defaults to standard US Letter or dimensions of adjacent page.
 */
export function insertBlankPage(
  doc: PDFDocument,
  atIndex: number,
  width?: number,
  height?: number
): void {
  let w = width || 612
  let h = height || 792

  if (!width && !height && doc.getPageCount() > 0) {
    const refPage = doc.getPage(Math.min(atIndex, doc.getPageCount() - 1))
    w = refPage.getWidth()
    h = refPage.getHeight()
  }

  const targetIndex = Math.max(0, Math.min(atIndex, doc.getPageCount()))
  doc.insertPage(targetIndex, [w, h])
}

/**
 * Duplicates a page at pageIndex and inserts it right after.
 */
export async function duplicatePage(doc: PDFDocument, pageIndex: number): Promise<void> {
  const [copiedPage] = await doc.copyPages(doc, [pageIndex])
  doc.insertPage(pageIndex + 1, copiedPage)
}

/**
 * Extracts a subset of pages into a fresh PDF document.
 */
export async function extractPages(doc: PDFDocument, pageIndices: number[]): Promise<Uint8Array> {
  const newDoc = await PDFDocument.create()
  const copiedPages = await newDoc.copyPages(doc, pageIndices)
  for (const page of copiedPages) {
    newDoc.addPage(page)
  }
  return await newDoc.save()
}

/**
 * Merges additional PDF files into the active PDF document.
 */
export async function mergePdfDocuments(targetDoc: PDFDocument, sourceBytesList: Uint8Array[]): Promise<void> {
  for (const sourceBytes of sourceBytesList) {
    const loadedSource = await PDFDocument.load(sourceBytes, { ignoreEncryption: true })
    const copiedPages = await targetDoc.copyPages(loadedSource, loadedSource.getPageIndices())
    for (const page of copiedPages) {
      targetDoc.addPage(page)
    }
  }
}

/**
 * Splits a PDF document by specified page ranges into separate files.
 */
export async function splitPdfByRanges(
  doc: PDFDocument,
  ranges: SplitRange[],
  baseName: string = 'document'
): Promise<Array<{ name: string; bytes: Uint8Array }>> {
  const results: Array<{ name: string; bytes: Uint8Array }> = []

  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i]
    const splitDoc = await PDFDocument.create()
    const indices: number[] = []

    for (let p = range.start; p <= range.end; p++) {
      const idx = p - 1
      if (idx >= 0 && idx < doc.getPageCount()) {
        indices.push(idx)
      }
    }

    if (indices.length > 0) {
      const pages = await splitDoc.copyPages(doc, indices)
      for (const page of pages) {
        splitDoc.addPage(page)
      }
      const bytes = await splitDoc.save()
      const fileName = range.name || `${baseName}_part_${i + 1}_p${range.start}-p${range.end}.pdf`
      results.push({ name: fileName, bytes })
    }
  }

  return results
}

/**
 * Sets visual crop box on a page.
 */
export function cropPage(doc: PDFDocument, pageIndex: number, cropBox: PageCropBox): void {
  const page = doc.getPage(pageIndex)
  page.setCropBox(cropBox.x, cropBox.y, cropBox.width, cropBox.height)
}
