export type FontFamily = 'Helvetica' | 'Helvetica-Bold' | 'Times-Roman' | 'Courier'

export interface TextAnnotation {
  id: string
  pageIndex: number
  text: string
  x: number // Unscaled 1.0x points from left
  y: number // Unscaled 1.0x points from top
  width: number // Bounding width in points
  height: number // Bounding height in points
  fontSize: number
  fontFamily: FontFamily
  color: string // Hex color string, e.g. '#000000'
  opacity?: number
  isBold?: boolean
}

export interface ImageAnnotation {
  id: string
  pageIndex: number
  imageBytes: Uint8Array
  format: 'png' | 'jpeg'
  x: number
  y: number
  width: number
  height: number
  opacity: number
  aspectRatio: number
  previewUrl: string
  isSignature?: boolean
}

export interface DrawingAnnotation {
  id: string
  pageIndex: number
  points: Array<{ x: number; y: number }>
  color: string
  thickness: number
  opacity: number
}

export interface StampAnnotation {
  id: string
  pageIndex: number
  label: string
  x: number
  y: number
  width: number
  height: number
  color: string // e.g. '#10b981' for APPROVED, '#ef4444' for CONFIDENTIAL
}

export interface DocumentAnnotations {
  texts: TextAnnotation[]
  images: ImageAnnotation[]
  drawings: DrawingAnnotation[]
  stamps: StampAnnotation[]
}
