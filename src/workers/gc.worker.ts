import { PDFDocument } from 'pdf-lib'
import { purgeOrphanIndirectObjects } from '../modules/redactor/gc'

self.onmessage = async (e: MessageEvent) => {
  const { type, pdfBytes } = e.data

  try {
    if (type === 'purge_orphans') {
      const doc = await PDFDocument.load(pdfBytes)

      const gcStats = purgeOrphanIndirectObjects(doc, (current, total) => {
        self.postMessage({
          type: 'progress',
          current,
          total
        })
      })

      const cleanedBytes = await doc.save()

      ;(self as any).postMessage({
        type: 'complete',
        pdfBytes: cleanedBytes,
        gcStats
      }, [cleanedBytes.buffer])
    }
  } catch (err: any) {
    self.postMessage({
      type: 'error',
      error: err?.message || String(err)
    })
  }
}
