import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url'

// Set worker source locally from bundled Vite asset
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

export interface DocumentLoadResult {
  pdfProxy: pdfjsLib.PDFDocumentProxy
  isEncrypted: boolean
  hasSignatures: boolean
  pageCount: number
  pdfVersion: string
  pageDimensions: Array<{ width: number; height: number; rotate: number }>
}

export type PasswordPromptCallback = (reason: 'need_password' | 'incorrect_password') => Promise<string | null>

/**
 * Loads a PDF via pdfjs-dist with local worker, cmaps, and password prompt handling.
 */
export async function loadPdfDocument(
  data: Uint8Array,
  onPasswordNeeded?: PasswordPromptCallback
): Promise<DocumentLoadResult> {
  let isEncrypted = false

  const baseUrl = (typeof window !== 'undefined' && import.meta?.env?.BASE_URL) ? import.meta.env.BASE_URL : './'

  const loadingTask = pdfjsLib.getDocument({
    data: data.slice(),
    cMapUrl: baseUrl.endsWith('/') ? `${baseUrl}cmaps/` : `${baseUrl}/cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: baseUrl.endsWith('/') ? `${baseUrl}standard_fonts/` : `${baseUrl}/standard_fonts/`
  })

  // Handle password-protected PDFs
  loadingTask.onPassword = (updatePassword: (pw: string) => void, reason: number) => {
    isEncrypted = true
    const reasonStr = reason === 1 ? 'need_password' : 'incorrect_password'
    if (onPasswordNeeded) {
      onPasswordNeeded(reasonStr).then((pw) => {
        if (pw !== null && pw !== undefined) {
          updatePassword(pw)
        } else {
          // User cancelled
          loadingTask.destroy()
        }
      }).catch(() => {
        loadingTask.destroy()
      })
    } else {
      loadingTask.destroy()
    }
  }

  const pdfProxy = await loadingTask.promise
  const pageCount = pdfProxy.numPages

  // Gather page dimensions and rotation
  const pageDimensions: Array<{ width: number; height: number; rotate: number }> = []
  for (let i = 1; i <= pageCount; i++) {
    const page = await pdfProxy.getPage(i)
    const viewport = page.getViewport({ scale: 1.0 })
    pageDimensions.push({
      width: viewport.width,
      height: viewport.height,
      rotate: page.rotate
    })
  }

  // Detect digital signatures
  let hasSignatures = false
  try {
    // Check annotations across pages for signature fields
    for (let i = 1; i <= Math.min(pageCount, 10); i++) {
      const page = await pdfProxy.getPage(i)
      const annotations = await page.getAnnotations()
      if (annotations.some((ann: any) => ann.subtype === 'Widget' && ann.fieldType === 'Sig')) {
        hasSignatures = true
        break
      }
    }
  } catch {
    // Non-fatal signature check error
  }

  // Detect PDF version
  let pdfVersion = '1.7'
  try {
    const metadata = (await pdfProxy.getMetadata()) as any
    if (metadata?.info?.PDFFormatVersion) {
      pdfVersion = String(metadata.info.PDFFormatVersion)
    }
  } catch {
    // Default fallback
  }

  return {
    pdfProxy,
    isEncrypted,
    hasSignatures,
    pageCount,
    pdfVersion,
    pageDimensions
  }
}
