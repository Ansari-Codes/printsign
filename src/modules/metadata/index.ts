import { PDFDocument, PDFName, PDFRef, PDFStream } from 'pdf-lib'

export interface DocumentMetadata {
  title: string
  author: string
  subject: string
  keywords: string[]
  creator: string
  producer: string
  creationDate: Date | null
  modificationDate: Date | null
  xmpXml: string | null
}

export interface DocumentStats {
  pageCount: number
  pdfVersion: string
  isEncrypted: boolean
  pageSizes: Array<{ width: number; height: number; pageNumber: number }>
}

/**
 * Reads standard Info dictionary and XMP metadata from a PDFDocument.
 */
export function readMetadata(doc: PDFDocument): DocumentMetadata {
  let title = doc.getTitle() || ''
  let author = doc.getAuthor() || ''
  let subject = doc.getSubject() || ''
  let keywords = doc.getKeywords() ? doc.getKeywords()!.split(';').map(k => k.trim()).filter(Boolean) : []
  let creator = doc.getCreator() || ''
  let producer = doc.getProducer() || ''
  let creationDate = doc.getCreationDate() || null
  let modificationDate = doc.getModificationDate() || null

  let xmpXml: string | null = null
  try {
    const catalog = doc.catalog
    const metadataRef = catalog.get(PDFName.of('Metadata'))
    if (metadataRef && metadataRef instanceof PDFRef) {
      const metadataStream = doc.context.lookup(metadataRef)
      if (metadataStream instanceof PDFStream) {
        const bytes = metadataStream.getContents()
        xmpXml = new TextDecoder('utf-8').decode(bytes)
      }
    }
  } catch {
    // Non-fatal XMP lookup issue
  }

  return {
    title,
    author,
    subject,
    keywords,
    creator,
    producer,
    creationDate,
    modificationDate,
    xmpXml
  }
}

/**
 * Applies edited metadata to the PDFDocument.
 */
export function writeMetadata(doc: PDFDocument, metadata: DocumentMetadata): void {
  doc.setTitle(metadata.title)
  doc.setAuthor(metadata.author)
  doc.setSubject(metadata.subject)
  doc.setKeywords(metadata.keywords)
  doc.setCreator(metadata.creator)
  doc.setProducer(metadata.producer)

  if (metadata.creationDate) {
    doc.setCreationDate(metadata.creationDate)
  }
  if (metadata.modificationDate) {
    doc.setModificationDate(metadata.modificationDate)
  }

  if (metadata.xmpXml !== null && metadata.xmpXml !== undefined) {
    try {
      const catalog = doc.catalog
      
      const stream = doc.context.stream(metadata.xmpXml, {
        Type: PDFName.of('Metadata'),
        Subtype: PDFName.of('XML')
      })
      const newRef = doc.context.register(stream)
      catalog.set(PDFName.of('Metadata'), newRef)
    } catch {
      // Non-fatal XMP write issue
    }
  }
}

/**
 * Scrubs all metadata (Info dictionary, dates, creator, and XMP XML packet).
 */
export function scrubMetadata(doc: PDFDocument): void {
  doc.setTitle('')
  doc.setAuthor('')
  doc.setSubject('')
  doc.setKeywords([])
  doc.setCreator('')
  doc.setProducer('')

  // Remove XMP metadata stream from catalog
  try {
    const catalog = doc.catalog
    catalog.delete(PDFName.of('Metadata'))
  } catch {
    // Non-fatal
  }

  // Remove Info dictionary from trailer
  try {
    const trailer = doc.context.trailerInfo
    if ('Info' in trailer) {
      delete (trailer as any).Info
    }
  } catch {
    // Non-fatal
  }
}
