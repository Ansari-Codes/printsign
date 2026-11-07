import { PDFDocument, StandardFonts, rgb, type PDFFont } from 'pdf-lib'
import type { DocumentAnnotations, FontFamily } from './types'

/**
 * Converts a hex color string (e.g. "#ff0000" or "#f00") to 0..1 RGB components
 */
export function hexToRgbComponents(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace('#', '')
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('')
  }
  const num = parseInt(cleanHex, 16)
  if (isNaN(num)) {
    return { r: 0, g: 0, b: 0 }
  }
  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255
  }
}

/**
 * Applies text, images, drawings, and stamps onto the target PDF pages
 * producing a new valid, standard-compliant PDF binary.
 */
export async function applyAnnotationsToPdf(
  pdfBytes: Uint8Array,
  annotations: DocumentAnnotations
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes.slice(), { ignoreEncryption: true })

  // Cache embedded standard fonts on demand
  const fontCache: Partial<Record<FontFamily, PDFFont>> = {}
  async function getFont(name: FontFamily): Promise<PDFFont> {
    if (fontCache[name]) return fontCache[name]!
    let standardName: StandardFonts
    switch (name) {
      case 'Helvetica-Bold':
        standardName = StandardFonts.HelveticaBold
        break
      case 'Times-Roman':
        standardName = StandardFonts.TimesRoman
        break
      case 'Courier':
        standardName = StandardFonts.Courier
        break
      case 'Helvetica':
      default:
        standardName = StandardFonts.Helvetica
        break
    }
    const font = await doc.embedFont(standardName)
    fontCache[name] = font
    return font
  }

  const pages = doc.getPages()
  const totalPages = pages.length

  // 1. Apply Text Annotations (with multi-line support)
  for (const textItem of annotations.texts) {
    if (textItem.pageIndex < 0 || textItem.pageIndex >= totalPages) continue
    const page = pages[textItem.pageIndex]
    const { height } = page.getSize()

    const font = await getFont(textItem.fontFamily)
    const { r, g, b } = hexToRgbComponents(textItem.color)

    // PDF coordinate system origin is bottom-left
    const pdfX = Math.max(0, textItem.x)
    const pdfY = height - textItem.y - textItem.fontSize

    const lines = textItem.text.split('\n')
    const lineHeight = textItem.fontSize * 1.25

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lineY = pdfY - (i * lineHeight)
      page.drawText(line, {
        x: pdfX,
        y: lineY,
        size: textItem.fontSize,
        font,
        color: rgb(r, g, b)
      })
    }
  }

  // 2. Apply Image Annotations (with configured position, dimensions, opacity)
  for (const imgItem of annotations.images) {
    if (imgItem.pageIndex < 0 || imgItem.pageIndex >= totalPages) continue
    const page = pages[imgItem.pageIndex]
    const { height } = page.getSize()

    try {
      const embeddedImg = imgItem.format === 'png'
        ? await doc.embedPng(imgItem.imageBytes)
        : await doc.embedJpg(imgItem.imageBytes)

      const pdfX = Math.max(0, imgItem.x)
      const pdfY = height - imgItem.y - imgItem.height

      page.drawImage(embeddedImg, {
        x: pdfX,
        y: pdfY,
        width: imgItem.width,
        height: imgItem.height,
        opacity: Math.max(0.01, Math.min(1.0, imgItem.opacity))
      })
    } catch {
      // Non-fatal image embed fallback
    }
  }

  // 3. Apply Drawings / Freehand Signatures
  for (const drawing of annotations.drawings) {
    if (drawing.pageIndex < 0 || drawing.pageIndex >= totalPages) continue
    if (drawing.points.length < 2) continue

    const page = pages[drawing.pageIndex]
    const { height } = page.getSize()
    const { r, g, b } = hexToRgbComponents(drawing.color)

    for (let i = 0; i < drawing.points.length - 1; i++) {
      const p1 = drawing.points[i]
      const p2 = drawing.points[i + 1]

      page.drawLine({
        start: { x: p1.x, y: height - p1.y },
        end: { x: p2.x, y: height - p2.y },
        thickness: drawing.thickness,
        color: rgb(r, g, b),
        opacity: drawing.opacity
      })
    }
  }

  // 4. Apply Configurable Stamp Annotations
  for (const stamp of annotations.stamps) {
    if (stamp.pageIndex < 0 || stamp.pageIndex >= totalPages) continue
    const page = pages[stamp.pageIndex]
    const { height } = page.getSize()

    const fontBold = await getFont('Helvetica-Bold')
    const { r, g, b } = hexToRgbComponents(stamp.color)

    const boxWidth = stamp.width || 140
    const boxHeight = stamp.height || 36
    const pdfX = Math.max(0, stamp.x)
    const pdfY = height - stamp.y - boxHeight

    // Background fill with low opacity
    page.drawRectangle({
      x: pdfX,
      y: pdfY,
      width: boxWidth,
      height: boxHeight,
      borderColor: rgb(r, g, b),
      borderWidth: Math.max(1, Math.round(boxHeight * 0.05)),
      color: rgb(r, g, b),
      opacity: 0.12
    })

    // Centered label text scaled proportionally to stamp height
    const targetFontSize = Math.max(9, Math.min(28, Math.round(boxHeight * 0.42)))
    const textWidth = fontBold.widthOfTextAtSize(stamp.label, targetFontSize)
    const textX = pdfX + Math.max(2, (boxWidth - textWidth) / 2)
    const textY = pdfY + Math.max(2, (boxHeight - targetFontSize) / 2)

    page.drawText(stamp.label, {
      x: textX,
      y: textY,
      size: targetFontSize,
      font: fontBold,
      color: rgb(r, g, b)
    })
  }

  return doc.save()
}
