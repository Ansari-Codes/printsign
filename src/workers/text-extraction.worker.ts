import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

self.onmessage = async (e: MessageEvent) => {
  const { type, pdfBytes, query } = e.data

  try {
    if (type === 'search') {
      const cleanQuery = (query || '').trim().toLowerCase()
      if (!cleanQuery) {
        self.postMessage({ type: 'success', results: [] })
        return
      }

      const loadingTask = pdfjsLib.getDocument({
        data: pdfBytes.slice(),
        cMapUrl: './cmaps/',
        cMapPacked: true,
        standardFontDataUrl: './standard_fonts/'
      })
      const pdf = await loadingTask.promise
      const results: any[] = []

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const pageIndex = pageNum - 1
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()

        for (const item of textContent.items) {
          if (!('str' in item)) continue
          const str = item.str
          const lowerStr = str.toLowerCase()

          let matchIndex = lowerStr.indexOf(cleanQuery)
          while (matchIndex !== -1) {
            const tx = item.transform[4]
            const ty = item.transform[5]
            const itemWidth = item.width
            const itemHeight = item.height || 12

            const charWidth = itemWidth / Math.max(str.length, 1)
            const subX = tx + matchIndex * charWidth
            const subWidth = cleanQuery.length * charWidth

            results.push({
              id: `match_${pageIndex}_${results.length}_${Math.random().toString(36).substring(2, 7)}`,
              pageIndex,
              text: str.substring(matchIndex, matchIndex + cleanQuery.length),
              x: Math.max(0, subX - 2),
              y: Math.max(0, ty - 2),
              width: subWidth + 4,
              height: itemHeight + 4
            })

            matchIndex = lowerStr.indexOf(cleanQuery, matchIndex + 1)
          }
        }
      }

      self.postMessage({ type: 'success', results })
    }
  } catch (err: any) {
    self.postMessage({ type: 'error', error: err?.message || String(err) })
  }
}
