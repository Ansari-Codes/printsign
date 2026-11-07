import { PDFDocument } from 'pdf-lib'
import { flattenPdfToImageOnly } from '../rasterizer'

export type ExportMode = 'standard' | 'flattened'

export interface ExportOptions {
  mode: ExportMode
  flattenDpi?: number
  warnIfSignaturesPresent?: boolean
  hasSignatures?: boolean
}

/**
 * Triggers a browser file download from a Uint8Array buffer without any network call.
 */
export function triggerFileDownload(
  data: Uint8Array,
  filename: string,
  mimeType: string = 'application/pdf'
): void {
  const blob = new Blob([data as unknown as BlobPart], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * Formats byte size into human readable string (KB, MB, GB).
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/**
 * Prepares the exported PDF according to the chosen mode.
 */
export async function preparePdfExport(
  doc: PDFDocument,
  options: ExportOptions,
  onProgress?: (current: number, total: number) => void
): Promise<Uint8Array> {
  if (options.mode === 'flattened') {
    const rawBytes = await doc.save()
    return await flattenPdfToImageOnly(rawBytes, options.flattenDpi || 200, onProgress)
  }

  return await doc.save()
}
