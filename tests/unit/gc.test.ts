import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { purgeOrphanIndirectObjects } from '../../src/modules/redactor/gc'
import { createSyntheticFixturePdf } from '../fixtures/create-synthetic-pdf'

describe('Orphan Indirect Object Garbage Collector', () => {
  it('identifies unreferenced pages and purges indirect objects from doc.context', async () => {
    const rawPdf = await createSyntheticFixturePdf()
    const doc = await PDFDocument.load(rawPdf)

    const initialEntries = doc.context.enumerateIndirectObjects()
    const initialCount = initialEntries.length

    // Insert a new blank page and remove an existing page
    doc.insertPage(0, [500, 500])
    doc.removePage(1)

    // Run GC
    const stats = purgeOrphanIndirectObjects(doc)

    expect(stats.purgedObjectCount).toBeGreaterThan(0)
    expect(stats.reachableObjectCount).toBeLessThan(initialCount + 5)

    // Ensure the saved document is valid and loads cleanly
    const saved = await doc.save()
    const reloaded = await PDFDocument.load(saved)
    expect(reloaded.getPageCount()).toBe(2)
  })

  it('reports progress callback during traversal', async () => {
    const rawPdf = await createSyntheticFixturePdf()
    const doc = await PDFDocument.load(rawPdf)

    let progressCalls = 0
    purgeOrphanIndirectObjects(doc, (current, total) => {
      progressCalls++
      expect(current).toBeLessThanOrEqual(total)
    })

    expect(progressCalls).toBeGreaterThan(0)
  })
})
