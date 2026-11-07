import { PDFDocument } from 'pdf-lib'
import * as pdfjsLib from 'pdfjs-dist'
import { purgeOrphanIndirectObjects, type GCStats } from './gc'
import { scrubMetadata } from '../metadata'
import { verifyRedactionAbsence, type VerificationReport } from '../verification/canary'

export interface RedactionBox {
  id: string
  pageIndex: number // 0-based
  x: number         // PDF points (from bottom-left)
  y: number         // PDF points (from bottom-left)
  width: number     // PDF points
  height: number    // PDF points
  preset: 'solid' | 'redacted_text'
  textMatch?: string
}

export interface RedactionOptions {
  dpi?: number
  quality?: number
  scrubMetadata?: boolean
  onProgress?: (step: string, current: number, total: number) => void
}

export interface RedactionResult {
  outputBytes: Uint8Array
  verificationReport: VerificationReport
  gcStats: GCStats
}

/**
 * Executes the V1 client-side redaction pipeline:
 * 1. High-DPI canvas render via pdfjs-dist
 * 2. Burn solid black / REDACTED text into pixel buffer
 * 3. Encode image & embed as replacement page in pdf-lib
 * 4. Remove original page
 * 5. Run orphan indirect object garbage collection
 * 6. Verify absence via pdf.js text extraction + raw byte scan
 */
export async function applyRedactions(
  pdfBytes: Uint8Array,
  boxes: RedactionBox[],
  options: RedactionOptions = {}
): Promise<RedactionResult> {
  const targetDpi = options.dpi || 200
  const quality = options.quality || 0.92
  const shouldScrub = options.scrubMetadata !== false

  // Load PDF for structural manipulation
  const pdfDoc = await PDFDocument.load(pdfBytes.slice())

  // Load PDF via pdfjs-dist for rendering
  const loadingTask = pdfjsLib.getDocument({
    data: pdfBytes.slice(),
    cMapUrl: './cmaps/',
    cMapPacked: true,
    standardFontDataUrl: './standard_fonts/'
  })
  const pdfProxy = await loadingTask.promise

  // Group boxes by pageIndex
  const boxesByPage = new Map<number, RedactionBox[]>()
  for (const box of boxes) {
    if (!boxesByPage.has(box.pageIndex)) {
      boxesByPage.set(box.pageIndex, [])
    }
    boxesByPage.get(box.pageIndex)!.push(box)
  }

  const affectedPages = Array.from(boxesByPage.keys()).sort((a, b) => a - b)
  const totalPages = affectedPages.length

  // All unique text strings targeted for redaction (for canary verification)
  const targetedStrings: string[] = []
  for (const box of boxes) {
    if (box.textMatch) {
      targetedStrings.push(box.textMatch)
    }
  }

  // Process each affected page
  for (let i = 0; i < totalPages; i++) {
    const pageIndex = affectedPages[i]
    const pageBoxes = boxesByPage.get(pageIndex) || []
    
    if (options.onProgress) {
      options.onProgress(`Rasterizing & burning page ${pageIndex + 1}`, i + 1, totalPages)
    }

    const pdfJsPage = await pdfProxy.getPage(pageIndex + 1)
    const originalViewport = pdfJsPage.getViewport({ scale: 1.0 })
    const pageWidth = originalViewport.width
    const pageHeight = originalViewport.height

    // Calculate scale for target DPI with max dimension safeguard (5000px max)
    let scale = targetDpi / 72
    const maxDimension = Math.max(pageWidth * scale, pageHeight * scale)
    if (maxDimension > 5000) {
      scale = 5000 / Math.max(pageWidth, pageHeight)
    }

    const renderViewport = pdfJsPage.getViewport({ scale })

    // Create offscreen rendering canvas
    const canvas = document.createElement('canvas')
    canvas.width = Math.floor(renderViewport.width)
    canvas.height = Math.floor(renderViewport.height)
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Failed to acquire 2D canvas context for redaction')
    }

    // Fill clean white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Render original page contents to canvas
    await pdfJsPage.render({
      canvasContext: ctx,
      viewport: renderViewport
    }).promise

    // Burn redaction boxes into pixel buffer using 1.0x viewport coordinates scaled to render canvas
    for (const box of pageBoxes) {
      const vx = box.x * scale
      const vy = box.y * scale
      const vWidth = box.width * scale
      const vHeight = box.height * scale

      // Draw solid black rectangle
      ctx.fillStyle = '#000000'
      ctx.fillRect(vx, vy, vWidth, vHeight)

      // Overlay "REDACTED" label if requested
      if (box.preset === 'redacted_text') {
        ctx.save()
        ctx.fillStyle = '#ffffff'
        const fontSize = Math.max(9, Math.min(vHeight * 0.55, vWidth / 7))
        ctx.font = `bold ${fontSize}px sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('REDACTED', vx + vWidth / 2, vy + vHeight / 2)
        ctx.restore()
      }
    }

    // Encode canvas to JPEG image bytes
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', quality)
    })

    if (!blob) {
      throw new Error('Failed to encode rasterized redacted page to JPEG')
    }

    const imageArrayBuffer = await blob.arrayBuffer()
    const imageBytes = new Uint8Array(imageArrayBuffer)

    // Embed JPEG into pdf-lib document
    const embeddedImage = await pdfDoc.embedJpg(imageBytes)

    // Insert replacement page right before original page
    const replacementPage = pdfDoc.insertPage(pageIndex, [pageWidth, pageHeight])
    replacementPage.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight
    })

    // Remove original page (now shifted to pageIndex + 1)
    pdfDoc.removePage(pageIndex + 1)
  }

  // Metadata scrub if enabled
  if (shouldScrub) {
    scrubMetadata(pdfDoc)
  }

  // Garbage collect all orphan indirect objects (including old page contents and unreferenced fonts)
  if (options.onProgress) {
    options.onProgress('Purging unreferenced streams & orphan indirect objects', totalPages, totalPages)
  }

  const gcStats = purgeOrphanIndirectObjects(pdfDoc, (curr, tot) => {
    if (options.onProgress) {
      options.onProgress('Purging orphan objects', curr, tot)
    }
  })

  // Save clean PDF
  const outputBytes = await pdfDoc.save()

  // Run automated verification against target strings
  if (options.onProgress) {
    options.onProgress('Verifying redaction absence across text & raw byte streams', totalPages, totalPages)
  }

  const verificationReport = await verifyRedactionAbsence(outputBytes, targetedStrings)

  return {
    outputBytes,
    verificationReport,
    gcStats
  }
}
