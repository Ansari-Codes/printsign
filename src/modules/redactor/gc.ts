import {
  PDFDocument,
  PDFRef,
  PDFDict,
  PDFArray,
  PDFStream,
  PDFObject
} from 'pdf-lib'

export interface GCStats {
  initialObjectCount: number
  reachableObjectCount: number
  purgedObjectCount: number
}

/**
 * Traverses the PDF object graph starting from Trailer and Catalog roots,
 * identifies all unreachable indirect objects, and deletes them from the context.
 */
export function purgeOrphanIndirectObjects(
  doc: PDFDocument,
  onProgress?: (current: number, total: number) => void
): GCStats {
  const context = doc.context
  const allIndirectEntries = context.enumerateIndirectObjects()
  const initialObjectCount = allIndirectEntries.length

  const reachableRefs = new Set<string>()

  // Helper to get string key for a PDFRef (e.g., "12R_0")
  function refKey(ref: PDFRef): string {
    return `${ref.objectNumber}R_${ref.generationNumber}`
  }

  // Traversal queue / stack
  const toVisit: PDFObject[] = []

  // 1. Enqueue Catalog (Root)
  if (doc.catalog) {
    toVisit.push(doc.catalog)
  }

  // 2. Enqueue Trailer entries
  const trailer = context.trailerInfo
  if (trailer) {
    if (trailer.Root) toVisit.push(trailer.Root)
    if (trailer.Info) toVisit.push(trailer.Info)
  }

  // Mark and traverse
  while (toVisit.length > 0) {
    const obj = toVisit.pop()!

    if (obj instanceof PDFRef) {
      const key = refKey(obj)
      if (!reachableRefs.has(key)) {
        reachableRefs.add(key)
        const target = context.lookup(obj)
        if (target) {
          toVisit.push(target)
        }
      }
    } else if (obj instanceof PDFDict) {
      const entries = obj.entries()
      for (const [_, val] of entries) {
        if (val) toVisit.push(val)
      }
    } else if (obj instanceof PDFStream) {
      const entries = obj.dict.entries()
      for (const [_, val] of entries) {
        if (val) toVisit.push(val)
      }
    } else if (obj instanceof PDFArray) {
      const items = obj.asArray()
      for (const item of items) {
        if (item) toVisit.push(item)
      }
    }
  }

  // 3. Purge unreachable objects
  let purgedCount = 0
  const total = allIndirectEntries.length

  for (let i = 0; i < total; i++) {
    const [ref] = allIndirectEntries[i]
    const key = refKey(ref)

    if (!reachableRefs.has(key)) {
      context.delete(ref)
      purgedCount++
    }

    if (onProgress && (i % 50 === 0 || i === total - 1)) {
      onProgress(i + 1, total)
    }
  }

  return {
    initialObjectCount,
    reachableObjectCount: reachableRefs.size,
    purgedObjectCount: purgedCount
  }
}
