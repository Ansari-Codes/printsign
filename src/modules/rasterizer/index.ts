import * as pdfjsLib from 'pdfjs-dist'
import { PDFDocument } from 'pdf-lib'
import { zipSync } from 'fflate'

export type ImageFormat = 'png' | 'jpeg' | 'webp'

export interface RasterizeOptions {
  dpi: number // 72, 150, 300, 600
  format: ImageFormat
  quality?: number // 0.1 - 1.0 (for jpeg and webp)
  pageIndices?: number[] // 0-based
  onProgress?: (current: number, total: number) => void
}

export interface RasterizedImage {
  pageIndex: number
  pageNumber: number
  dataUrl: string
  blob: Blob
  bytes: Uint8Array
  fileName: string
  width: number
  height: number
}

/**
 * Calculates pixel dimensions for a page at a given DPI.
 */
export function calculateDpiDimensions(
  pageWidthPt: number,
  pageHeightPt: number,
  dpi: number
): { width: number; height: number; scale: number } {
  const scale = dpi / 72
  return {
    width: Math.round(pageWidthPt * scale),
    height: Math.round(pageHeightPt * scale),
    scale
  }
}

/**
 * Rasterizes pages of a PDF to high-quality images.
 */
export async function rasterizePdfPages(
  pdfBytes: Uint8Array,
  options: RasterizeOptions,
  baseFileName: string = 'document'
): Promise<RasterizedImage[]> {
  const loadingTask = pdfjsLib.getDocument({
    data: pdfBytes.slice(),
    cMapUrl: './cmaps/',
    cMapPacked: true,
    standardFontDataUrl: './standard_fonts/'
  })
  const pdfProxy = await loadingTask.promise
  const totalDocPages = pdfProxy.numPages

  const targetIndices = options.pageIndices && options.pageIndices.length > 0
    ? options.pageIndices
    : Array.from({ length: totalDocPages }, (_, i) => i)

  const mimeType = options.format === 'png'
    ? 'image/png'
    : options.format === 'webp'
      ? 'image/webp'
      : 'image/jpeg'

  const ext = options.format === 'jpeg' ? 'jpg' : options.format
  const quality = options.quality ?? 0.92
  const results: RasterizedImage[] = []

  for (let i = 0; i < targetIndices.length; i++) {
    const pageIndex = targetIndices[i]
    if (pageIndex < 0 || pageIndex >= totalDocPages) continue

    const pageNum = pageIndex + 1
    const page = await pdfProxy.getPage(pageNum)
    const baseViewport = page.getViewport({ scale: 1.0 })

    const { width, height, scale } = calculateDpiDimensions(baseViewport.width, baseViewport.height, options.dpi)
    const viewport = page.getViewport({ scale })

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not get canvas context')

    // Clean background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    await page.render({
      canvasContext: ctx,
      viewport
    }).promise

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => {
        if (b) resolve(b)
        else reject(new Error('Canvas toBlob failed'))
      }, mimeType, quality)
    })

    const arrayBuffer = await blob.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)
    const dataUrl = canvas.toDataURL(mimeType, quality)
    const fileName = `${baseFileName}_page_${pageNum}.${ext}`

    results.push({
      pageIndex,
      pageNumber: pageNum,
      dataUrl,
      blob,
      bytes,
      fileName,
      width,
      height
    })

    if (options.onProgress) {
      options.onProgress(i + 1, targetIndices.length)
    }
  }

  return results
}

/**
 * Packages an array of rasterized images into a client-side ZIP file.
 */
export function createZipFromImages(images: RasterizedImage[]): Uint8Array {
  const files: Record<string, Uint8Array> = {}
  for (const img of images) {
    files[img.fileName] = img.bytes
  }
  return zipSync(files)
}

/**
 * Flattens an entire PDF into an image-only PDF (all vectors/selectable text removed).
 */
export async function flattenPdfToImageOnly(
  pdfBytes: Uint8Array,
  dpi: number = 200,
  onProgress?: (current: number, total: number) => void
): Promise<Uint8Array> {
  const images = await rasterizePdfPages(
    pdfBytes,
    {
      dpi,
      format: 'jpeg',
      quality: 0.92,
      onProgress
    }
  )

  const newDoc = await PDFDocument.create()

  for (const img of images) {
    const embeddedImage = await newDoc.embedJpg(img.bytes)
    // Page dimensions in PDF points (72 DPI)
    const ptWidth = (img.width / dpi) * 72
    const ptHeight = (img.height / dpi) * 72

    const page = newDoc.addPage([ptWidth, ptHeight])
    page.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: ptWidth,
      height: ptHeight
    })
  }

  return await newDoc.save()
}
