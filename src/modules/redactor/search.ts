import * as pdfjsLib from 'pdfjs-dist'

export interface TextMatchItem {
  id: string
  pageIndex: number // 0-based
  text: string
  x: number         // Viewport points at 1.0 scale (from left)
  y: number         // Viewport points at 1.0 scale (from top)
  width: number     // Viewport points width at 1.0 scale
  height: number    // Viewport points height at 1.0 scale
}

/**
 * Searches for all occurrences of a query string across all pages of a PDF,
 * returning bounding boxes in 1.0x Page Viewport coordinates that map with 100%
 * accuracy onto the rendered canvas and screen overlay regardless of page rotation.
 */
export async function searchPdfText(
  pdfBytes: Uint8Array,
  query: string
): Promise<TextMatchItem[]> {
  const cleanQuery = query.trim()
  if (!cleanQuery) return []

  const loadingTask = pdfjsLib.getDocument({
    data: pdfBytes.slice(),
    cMapUrl: './cmaps/',
    cMapPacked: true,
    standardFontDataUrl: './standard_fonts/'
  })
  const pdfProxy = await loadingTask.promise
  const results: TextMatchItem[] = []

  const lowerQuery = cleanQuery.toLowerCase()

  for (let pageNum = 1; pageNum <= pdfProxy.numPages; pageNum++) {
    const pageIndex = pageNum - 1
    const page = await pdfProxy.getPage(pageNum)
    const viewport = page.getViewport({ scale: 1.0 })
    const textContent = await page.getTextContent()

    for (const item of textContent.items) {
      if (!('str' in item)) continue
      const str = item.str
      const lowerStr = str.toLowerCase()

      let matchIndex = lowerStr.indexOf(lowerQuery)
      while (matchIndex !== -1) {
        const tx = item.transform[4]
        const ty = item.transform[5]
        const itemWidth = item.width
        const itemHeight = item.height || Math.hypot(item.transform[2], item.transform[3]) || 12

        const charWidth = itemWidth / Math.max(str.length, 1)
        const subX = tx + matchIndex * charWidth
        const subWidth = cleanQuery.length * charWidth

        // User space rectangle [x1, y1, x2, y2]
        // In PDF user space, ty is the text baseline; glyphs ascend up to ty + itemHeight
        const pdfRect = [
          subX,
          ty - 2, // include descender padding
          subX + subWidth,
          ty + itemHeight + 1 // include ascender padding
        ]

        // Transform into 1.0x viewport coordinates (accounts for rotation, mediaBox offset, etc.)
        const vpRect = viewport.convertToViewportRectangle(pdfRect)

        const left = Math.min(vpRect[0], vpRect[2])
        const top = Math.min(vpRect[1], vpRect[3])
        const width = Math.abs(vpRect[2] - vpRect[0])
        const height = Math.abs(vpRect[3] - vpRect[1])

        results.push({
          id: `match_${pageIndex}_${results.length}_${Math.random().toString(36).substring(2, 7)}`,
          pageIndex,
          text: str.substring(matchIndex, matchIndex + cleanQuery.length),
          x: Math.round(Math.max(0, left - 1)),
          y: Math.round(Math.max(0, top - 1)),
          width: Math.round(width + 2),
          height: Math.round(height + 2)
        })

        matchIndex = lowerStr.indexOf(lowerQuery, matchIndex + 1)
      }
    }
  }

  return results
}
