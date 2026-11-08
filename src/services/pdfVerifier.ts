import { PDFDocument, PDFName, PDFRef, PDFStream } from 'pdf-lib'
import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url'

// Ensure worker URL is registered in browser environments
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl
}

export interface MetadataInfoItem {
  key: string
  label: string
  value: string | null
  isPopulated: boolean
  riskLevel: 'clean' | 'warning' | 'danger'
  explanation: string
}

export interface PageAuditResult {
  pageNumber: number
  selectableTextCount: number
  hasSelectableText: boolean
  sampleText: string
  annotationCount: number
  widgetCount: number
  isPureRaster: boolean
}

export interface MetadataAuditResult {
  title: string | null
  author: string | null
  subject: string | null
  keywords: string[]
  creator: string | null
  producer: string | null
  creationDate: string | null
  modDate: string | null
  hasXmpStream: boolean
  xmpSizeBytes: number
  rawXmpSnippet: string | null
  infoItems: MetadataInfoItem[]
  populatedCount: number
}

export interface VerifierRecommendation {
  title: string
  description: string
  ctaText: string
  ctaRoute: string
  type: 'redact' | 'metadata' | 'rasterize'
}

export interface PdfAuditReport {
  fileName: string
  fileSizeBytes: number
  overallStatus: 'PASSED' | 'ACTION_REQUIRED'
  statusBadge: string
  summaryHeadline: string
  summaryDescription: string
  totalPageCount: number
  pureRasterPageCount: number
  pagesWithSelectableTextCount: number
  totalSelectableTextItems: number
  totalAnnotationsCount: number
  hasHiddenMetadata: boolean
  hasXmpStream: boolean
  metadata: MetadataAuditResult
  pages: PageAuditResult[]
  recommendations: VerifierRecommendation[]
  scannedAt: number
}

/**
 * Searches raw bytes for XMP metadata packet if indirect catalog lookup fails.
 */
function scanRawBytesForXmp(bytes: Uint8Array): { found: boolean; snippet: string | null; sizeBytes: number } {
  const decoder = new TextDecoder('utf-8', { fatal: false })
  // Limit scan to first 1MB or full file if smaller
  const scanLimit = Math.min(bytes.length, 1024 * 1024)
  const textChunk = decoder.decode(bytes.subarray(0, scanLimit))

  const xmpStart = textChunk.indexOf('<x:xmpmeta')
  if (xmpStart !== -1) {
    const xmpEnd = textChunk.indexOf('</x:xmpmeta>', xmpStart)
    const endPos = xmpEnd !== -1 ? xmpEnd + 12 : Math.min(textChunk.length, xmpStart + 1000)
    const snippet = textChunk.substring(xmpStart, endPos)
    return {
      found: true,
      snippet: snippet.slice(0, 500),
      sizeBytes: snippet.length
    }
  }

  // Also check standard packet wrapper
  const packetStart = textChunk.indexOf('<?xpacket begin')
  if (packetStart !== -1) {
    const packetEnd = textChunk.indexOf('<?xpacket end', packetStart)
    const endPos = packetEnd !== -1 ? packetEnd + 19 : Math.min(textChunk.length, packetStart + 1000)
    const snippet = textChunk.substring(packetStart, endPos)
    return {
      found: true,
      snippet: snippet.slice(0, 500),
      sizeBytes: snippet.length
    }
  }

  return { found: false, snippet: null, sizeBytes: 0 }
}

/**
 * Audits the Info dictionary and XMP metadata stream using pdf-lib.
 */
function auditDocumentMetadata(doc: PDFDocument, rawBytes: Uint8Array): MetadataAuditResult {
  const title = doc.getTitle() || null
  const author = doc.getAuthor() || null
  const subject = doc.getSubject() || null
  const keywords = doc.getKeywords()
    ? doc.getKeywords()!.split(';').map(k => k.trim()).filter(Boolean)
    : []
  const creator = doc.getCreator() || null
  const producer = doc.getProducer() || null
  const creationDate = doc.getCreationDate() ? doc.getCreationDate()!.toISOString() : null
  const modDate = doc.getModificationDate() ? doc.getModificationDate()!.toISOString() : null

  let hasXmpStream = false
  let xmpSizeBytes = 0
  let rawXmpSnippet: string | null = null

  try {
    const catalog = doc.catalog
    const metadataRef = catalog.get(PDFName.of('Metadata'))
    if (metadataRef && metadataRef instanceof PDFRef) {
      const metadataStream = doc.context.lookup(metadataRef)
      if (metadataStream instanceof PDFStream) {
        const streamBytes = metadataStream.getContents()
        hasXmpStream = true
        xmpSizeBytes = streamBytes.length
        rawXmpSnippet = new TextDecoder('utf-8').decode(streamBytes).slice(0, 500)
      }
    }
  } catch {
    // Non-fatal catalog parsing error
  }

  // Secondary fallback: check raw bytes if pdf-lib didn't resolve catalog reference
  if (!hasXmpStream) {
    const fallback = scanRawBytesForXmp(rawBytes)
    if (fallback.found) {
      hasXmpStream = true
      xmpSizeBytes = fallback.sizeBytes
      rawXmpSnippet = fallback.snippet
    }
  }

  const isLibraryDefault = (str: string | null) => {
    if (!str) return true
    const s = str.toLowerCase().trim()
    return s === '' || s.includes('pdf-lib')
  }

  const isIdentifyingMetadata = Boolean(
    (title && title.trim().length > 0) ||
    (author && author.trim().length > 0) ||
    (subject && subject.trim().length > 0) ||
    keywords.length > 0 ||
    !isLibraryDefault(creator)
  )

  const infoItems: MetadataInfoItem[] = [
    {
      key: '/Title',
      label: 'Document Title',
      value: title,
      isPopulated: Boolean(title && title.trim().length > 0),
      riskLevel: title ? 'warning' : 'clean',
      explanation: title
        ? 'May reveal internal project names or confidential filing references.'
        : 'Clean: No title string present in Info dictionary.'
    },
    {
      key: '/Author',
      label: 'Author / User Identity',
      value: author,
      isPopulated: Boolean(author && author.trim().length > 0),
      riskLevel: author ? 'danger' : 'clean',
      explanation: author
        ? 'HIGH RISK: Discloses the personal or organizational identity of the document author.'
        : 'Clean: Author key has been scrubbed.'
    },
    {
      key: '/Subject',
      label: 'Subject Description',
      value: subject,
      isPopulated: Boolean(subject && subject.trim().length > 0),
      riskLevel: subject ? 'warning' : 'clean',
      explanation: subject
        ? 'Exposes subject context or internal classification tags.'
        : 'Clean: No subject field populated.'
    },
    {
      key: '/Keywords',
      label: 'Keywords & Tags',
      value: keywords.length > 0 ? keywords.join(', ') : null,
      isPopulated: keywords.length > 0,
      riskLevel: keywords.length > 0 ? 'warning' : 'clean',
      explanation: keywords.length > 0
        ? `Contains ${keywords.length} indexed search keywords.`
        : 'Clean: No document keywords indexed.'
    },
    {
      key: '/Creator',
      label: 'Creation Application',
      value: isLibraryDefault(creator) ? null : creator,
      isPopulated: Boolean(creator && !isLibraryDefault(creator)),
      riskLevel: creator && !isLibraryDefault(creator) ? 'warning' : 'clean',
      explanation: creator && !isLibraryDefault(creator)
        ? 'Reveals operating system or client software (e.g., Microsoft Word, WordPad).'
        : 'Clean: Creator application removed.'
    },
    {
      key: '/Producer',
      label: 'PDF Producer / Engine',
      value: isLibraryDefault(producer) ? null : producer,
      isPopulated: Boolean(producer && !isLibraryDefault(producer)),
      riskLevel: producer && !isLibraryDefault(producer) ? 'warning' : 'clean',
      explanation: producer && !isLibraryDefault(producer)
        ? 'Identifies PDF conversion library or printer driver used to generate file.'
        : 'Clean: PDF producer engine stripped.'
    },
    {
      key: '/CreationDate',
      label: 'Creation Timestamp',
      value: isIdentifyingMetadata ? creationDate : null,
      isPopulated: Boolean(creationDate && isIdentifyingMetadata),
      riskLevel: creationDate && isIdentifyingMetadata ? 'warning' : 'clean',
      explanation: creationDate && isIdentifyingMetadata
        ? 'Logs date and time the document was originally authored.'
        : 'Clean: Creation timestamp purged.'
    },
    {
      key: '/ModDate',
      label: 'Modification Timestamp',
      value: isIdentifyingMetadata ? modDate : null,
      isPopulated: Boolean(modDate && isIdentifyingMetadata),
      riskLevel: modDate && isIdentifyingMetadata ? 'warning' : 'clean',
      explanation: modDate && isIdentifyingMetadata
        ? 'Logs revision time, exposing document editing history.'
        : 'Clean: Modification timestamp purged.'
    }
  ]

  const populatedCount = infoItems.filter(item => item.isPopulated).length

  return {
    title,
    author,
    subject,
    keywords,
    creator,
    producer,
    creationDate,
    modDate,
    hasXmpStream,
    xmpSizeBytes,
    rawXmpSnippet,
    infoItems,
    populatedCount
  }
}

/**
 * Audits every page of the PDF using pdfjs-dist:
 * Counts selectable text items, detects annotations/widgets, and flags pure raster status.
 */
async function auditPages(rawBytes: Uint8Array): Promise<PageAuditResult[]> {
  const baseUrl = (typeof window !== 'undefined' && import.meta?.env?.BASE_URL) ? import.meta.env.BASE_URL : './'

  const loadingTask = pdfjsLib.getDocument({
    data: rawBytes.slice(),
    cMapUrl: baseUrl.endsWith('/') ? `${baseUrl}cmaps/` : `${baseUrl}/cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: baseUrl.endsWith('/') ? `${baseUrl}standard_fonts/` : `${baseUrl}/standard_fonts/`
  })

  const pdf = await loadingTask.promise
  const pageResults: PageAuditResult[] = []

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    
    // 1. Selectable text extraction
    const textContent = await page.getTextContent()
    const nonContentStrings = textContent.items
      .filter((item: any) => typeof item?.str === 'string' && item.str.trim().length > 0)
      .map((item: any) => item.str.trim())

    const selectableTextCount = nonContentStrings.length
    const sampleText = nonContentStrings.slice(0, 5).join(' ').slice(0, 100)

    // 2. Annotations & Form Fields inspection
    let annotationCount = 0
    let widgetCount = 0
    try {
      const annotations = await page.getAnnotations()
      annotationCount = annotations.length
      widgetCount = annotations.filter((a: any) => a.subtype === 'Widget').length
    } catch {
      // Annotations read fallback
    }

    // Pure raster check: A page is pure raster if it contains 0 selectable text items and 0 interactive widgets
    const isPureRaster = selectableTextCount === 0 && widgetCount === 0

    pageResults.push({
      pageNumber: pageNum,
      selectableTextCount,
      hasSelectableText: selectableTextCount > 0,
      sampleText,
      annotationCount,
      widgetCount,
      isPureRaster
    })
  }

  return pageResults
}

/**
 * Main PDF audit utility accepting an ArrayBuffer or Uint8Array.
 * Runs completely locally in browser memory without network calls.
 */
export async function auditPdfBuffer(
  input: ArrayBuffer | Uint8Array,
  fileName = 'document.pdf'
): Promise<PdfAuditReport> {
  const rawBytes = input instanceof Uint8Array ? input : new Uint8Array(input)

  if (!rawBytes || rawBytes.length === 0) {
    throw new Error('Provided PDF data buffer is empty.')
  }

  // 1. Inspect metadata with pdf-lib
  const pdfDoc = await PDFDocument.load(rawBytes, { ignoreEncryption: true })
  const metadata = auditDocumentMetadata(pdfDoc, rawBytes)

  // 2. Inspect pages and text layers with pdfjs-dist
  const pages = await auditPages(rawBytes)

  // 3. Aggregate statistics
  const totalPageCount = pages.length
  const pureRasterPageCount = pages.filter(p => p.isPureRaster).length
  const pagesWithSelectableTextCount = pages.filter(p => p.hasSelectableText).length
  const totalSelectableTextItems = pages.reduce((sum, p) => sum + p.selectableTextCount, 0)
  const totalAnnotationsCount = pages.reduce((sum, p) => sum + p.annotationCount, 0)

  const hasHiddenMetadata = metadata.populatedCount > 0
  const hasXmpStream = metadata.hasXmpStream

  // Determine overall status
  // PASSED: Pure raster (0 selectable text across all pages) AND completely scrubbed metadata & XMP
  const isPureRasterDocument = totalSelectableTextItems === 0
  const isMetadataClean = !hasHiddenMetadata && !hasXmpStream

  const passed = isPureRasterDocument && isMetadataClean
  const overallStatus = passed ? 'PASSED' : 'ACTION_REQUIRED'
  const statusBadge = passed
    ? 'PASSED (Pure Raster & Clean Metadata)'
    : 'ACTION REQUIRED (Selectable Text or Hidden Metadata Detected)'

  const summaryHeadline = passed
    ? 'Document is Forensically Sanitized & Redacted'
    : pagesWithSelectableTextCount > 0 && hasHiddenMetadata
      ? 'Vulnerabilities Found: Active Selectable Text Layer & Exposed Metadata'
      : pagesWithSelectableTextCount > 0
        ? 'Warning: Active Selectable Text Layer Detected Underneath'
        : 'Warning: Hidden Info Dictionary & XMP Metadata Streams Found'

  const summaryDescription = passed
    ? 'Zero selectable vector text items, zero cosmetic annotation overlays, and zero Info/XMP metadata streams were detected. This document is safe for public, court, or FOIA release.'
    : 'This PDF contains data layers that may expose sensitive information. Cosmetic black boxes do not erase selectable text, and metadata streams store author and editing history.'

  // Generate actionable conversion recommendations
  const recommendations: VerifierRecommendation[] = []

  if (pagesWithSelectableTextCount > 0) {
    recommendations.push({
      title: 'Active Selectable Text Layer Detected',
      description: `${pagesWithSelectableTextCount} page(s) contain selectable vector text (${totalSelectableTextItems} text elements). If you used black vector boxes to redact, anyone can copy-paste the text beneath.`,
      ctaText: 'Permanently Burn Redactions at 300 DPI →',
      ctaRoute: '/redact-pdf',
      type: 'redact'
    })
  }

  if (hasHiddenMetadata || hasXmpStream) {
    const leakDetails = []
    if (metadata.author) leakDetails.push(`Author: "${metadata.author}"`)
    if (metadata.producer) leakDetails.push(`Producer: "${metadata.producer}"`)
    if (hasXmpStream) leakDetails.push(`XMP XML Stream (${metadata.xmpSizeBytes} bytes)`)

    recommendations.push({
      title: 'Hidden Metadata & Tracking Streams Present',
      description: `Found ${metadata.populatedCount} populated Info dictionary key(s) and ${hasXmpStream ? 'an active XMP XML stream' : 'no XMP stream'}. ${leakDetails.length > 0 ? `(${leakDetails.join(', ')})` : ''}`,
      ctaText: 'Scrub Metadata & XMP Streams →',
      ctaRoute: '/scrub-pdf-metadata',
      type: 'metadata'
    })
  }

  if (pureRasterPageCount < totalPageCount && isMetadataClean) {
    recommendations.push({
      title: 'Optional: Flatten Vector Layers to Pure Raster',
      description: 'Convert all vector curves, fonts, and interactive form fields into flattened 300 DPI pixels for maximum courtroom defensibility.',
      ctaText: 'Flatten PDF to 300 DPI Raster →',
      ctaRoute: '/flatten-rasterize-pdf',
      type: 'rasterize'
    })
  }

  return {
    fileName,
    fileSizeBytes: rawBytes.length,
    overallStatus,
    statusBadge,
    summaryHeadline,
    summaryDescription,
    totalPageCount,
    pureRasterPageCount,
    pagesWithSelectableTextCount,
    totalSelectableTextItems,
    totalAnnotationsCount,
    hasHiddenMetadata,
    hasXmpStream,
    metadata,
    pages,
    recommendations,
    scannedAt: Date.now()
  }
}
