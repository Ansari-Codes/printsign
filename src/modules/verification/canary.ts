import * as pdfjsLib from 'pdfjs-dist'

export interface RedactionFinding {
  term: string
  foundInText: boolean
  foundInRawBytes: boolean
}

export interface VerificationReport {
  passed: boolean
  textExtractionClean: boolean
  rawByteScanClean: boolean
  findings: RedactionFinding[]
  checkedTermsCount: number
  timestamp: number
}

/**
 * Searches raw bytes (Uint8Array) for a literal byte sequence (ASCII / UTF-8).
 * Returns true if the string is present in raw bytes.
 */
export function scanRawBytesForString(pdfBytes: Uint8Array, searchString: string): boolean {
  if (!searchString || searchString.length === 0) return false

  const encoder = new TextEncoder()
  const needle = encoder.encode(searchString)
  const needleLen = needle.length
  const haystackLen = pdfBytes.length

  if (haystackLen < needleLen) return false

  // Boyer-Moore-Horspool or simple sliding byte search
  for (let i = 0; i <= haystackLen - needleLen; i++) {
    let match = true
    for (let j = 0; j < needleLen; j++) {
      if (pdfBytes[i + j] !== needle[j]) {
        match = false
        break
      }
    }
    if (match) {
      return true
    }
  }

  // Also check simple space-escaped or hex representations if relevant
  // e.g. /T(Canary) or (C\141nary) - for our canary test, checking literal UTF-8/ASCII bytes
  return false
}

/**
 * Extracts all text from a PDF buffer using pdfjs-dist.
 */
export async function extractAllText(pdfBytes: Uint8Array): Promise<string[]> {
  const loadingTask = pdfjsLib.getDocument({
    data: pdfBytes.slice(),
    cMapUrl: './cmaps/',
    cMapPacked: true,
    standardFontDataUrl: './standard_fonts/'
  })

  const pdf = await loadingTask.promise
  const pageTexts: string[] = []

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()
    const pageString = textContent.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .join(' ')
    pageTexts.push(pageString)
  }

  return pageTexts
}

/**
 * Runs a comprehensive verification check on an exported PDF:
 * 1. Text extraction check via pdfjs-dist
 * 2. Raw byte scan check
 */
export async function verifyRedactionAbsence(
  pdfBytes: Uint8Array,
  redactedStrings: string[]
): Promise<VerificationReport> {
  const cleanTerms = Array.from(new Set(redactedStrings.map(s => s.trim()))).filter(s => s.length > 0)
  
  if (cleanTerms.length === 0) {
    return {
      passed: true,
      textExtractionClean: true,
      rawByteScanClean: true,
      findings: [],
      checkedTermsCount: 0,
      timestamp: Date.now()
    }
  }

  // 1. Text extraction
  const allPageTexts = await extractAllText(pdfBytes)
  const fullExtractedText = allPageTexts.join(' ').toLowerCase()

  // 2. Perform findings audit
  const findings: RedactionFinding[] = []
  let allTextClean = true
  let allBytesClean = true

  for (const term of cleanTerms) {
    const foundInText = fullExtractedText.includes(term.toLowerCase())
    const foundInRawBytes = scanRawBytesForString(pdfBytes, term)

    if (foundInText) allTextClean = false
    if (foundInRawBytes) allBytesClean = false

    findings.push({
      term,
      foundInText,
      foundInRawBytes
    })
  }

  const passed = allTextClean && allBytesClean

  return {
    passed,
    textExtractionClean: allTextClean,
    rawByteScanClean: allBytesClean,
    findings,
    checkedTermsCount: cleanTerms.length,
    timestamp: Date.now()
  }
}
