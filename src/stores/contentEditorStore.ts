import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usePdfStore } from './pdfStore'
import { applyAnnotationsToPdf } from '../modules/content-editor'
import type {
  TextAnnotation,
  ImageAnnotation,
  DrawingAnnotation,
  StampAnnotation,
  FontFamily
} from '../modules/content-editor/types'

export type ContentTool = 'select' | 'text' | 'image' | 'draw' | 'stamp'

export const useContentEditorStore = defineStore('contentEditor', () => {
  const pdfStore = usePdfStore()

  // Tool selection & styling
  const activeTool = ref<ContentTool>('text')
  const activeFont = ref<FontFamily>('Helvetica')
  const activeFontSize = ref<number>(16)
  const activeTextColor = ref<string>('#0f172a')
  const activeDrawColor = ref<string>('#2563eb')
  const activeDrawThickness = ref<number>(3)
  const activeImageOpacity = ref<number>(1.0)
  const activeStamp = ref<string>('APPROVED')

  // Selected item on canvas
  const selectedItemId = ref<string | null>(null)
  const selectedItemType = ref<'text' | 'image' | 'drawing' | 'stamp' | null>(null)

  // Document isolated storage
  const textsByDoc = ref<Record<string, TextAnnotation[]>>({})
  const imagesByDoc = ref<Record<string, ImageAnnotation[]>>({})
  const drawingsByDoc = ref<Record<string, DrawingAnnotation[]>>({})
  const stampsByDoc = ref<Record<string, StampAnnotation[]>>({})

  // Active document items
  const activeTexts = computed<TextAnnotation[]>(() => {
    const id = pdfStore.activeDocumentId
    return id ? (textsByDoc.value[id] || []) : []
  })

  const activeImages = computed<ImageAnnotation[]>(() => {
    const id = pdfStore.activeDocumentId
    return id ? (imagesByDoc.value[id] || []) : []
  })

  const activeDrawings = computed<DrawingAnnotation[]>(() => {
    const id = pdfStore.activeDocumentId
    return id ? (drawingsByDoc.value[id] || []) : []
  })

  const activeStamps = computed<StampAnnotation[]>(() => {
    const id = pdfStore.activeDocumentId
    return id ? (stampsByDoc.value[id] || []) : []
  })

  const selectedItem = computed(() => {
    if (!selectedItemId.value || !selectedItemType.value) return null
    if (selectedItemType.value === 'text') {
      return activeTexts.value.find(t => t.id === selectedItemId.value) || null
    }
    if (selectedItemType.value === 'image') {
      return activeImages.value.find(img => img.id === selectedItemId.value) || null
    }
    if (selectedItemType.value === 'stamp') {
      return activeStamps.value.find(s => s.id === selectedItemId.value) || null
    }
    return null
  })

  const totalPendingCount = computed(() => {
    return activeTexts.value.length + activeImages.value.length + activeDrawings.value.length + activeStamps.value.length
  })

  function getDocId(): string | null {
    return pdfStore.activeDocumentId
  }

  // --- Selection Management ---
  function selectItem(id: string, type: 'text' | 'image' | 'drawing' | 'stamp') {
    selectedItemId.value = id
    selectedItemType.value = type

    // Sync active controls to selected item
    if (type === 'text') {
      const textItem = activeTexts.value.find(t => t.id === id)
      if (textItem) {
        activeFont.value = textItem.fontFamily
        activeFontSize.value = textItem.fontSize
        activeTextColor.value = textItem.color
      }
    } else if (type === 'image') {
      const imgItem = activeImages.value.find(img => img.id === id)
      if (imgItem) {
        activeImageOpacity.value = imgItem.opacity
      }
    } else if (type === 'stamp') {
      const stampItem = activeStamps.value.find(s => s.id === id)
      if (stampItem) {
        activeStamp.value = stampItem.label
      }
    }
  }

  function deselectItem() {
    selectedItemId.value = null
    selectedItemType.value = null
  }

  function updateSelectedItem(updates: Record<string, any>) {
    if (!selectedItemId.value || !selectedItemType.value) return
    if (selectedItemType.value === 'text') {
      updateText(selectedItemId.value, updates)
    } else if (selectedItemType.value === 'image') {
      updateImage(selectedItemId.value, updates)
    } else if (selectedItemType.value === 'stamp') {
      updateStamp(selectedItemId.value, updates)
    }
  }

  function deleteSelectedItem() {
    if (!selectedItemId.value || !selectedItemType.value) return
    if (selectedItemType.value === 'text') {
      deleteText(selectedItemId.value)
    } else if (selectedItemType.value === 'image') {
      deleteImage(selectedItemId.value)
    } else if (selectedItemType.value === 'stamp') {
      deleteStamp(selectedItemId.value)
    }
  }

  function duplicateSelectedItem(): string | null {
    if (!selectedItem.value || !selectedItemType.value) return null
    const item = selectedItem.value

    if (selectedItemType.value === 'text') {
      const t = item as TextAnnotation
      return addText(t.pageIndex, t.x + 20, t.y + 20, t.text, t.width, t.height)
    } else if (selectedItemType.value === 'image') {
      const img = item as ImageAnnotation
      const newId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
      const docId = getDocId()
      if (!docId) return null
      const copy: ImageAnnotation = {
        ...img,
        id: newId,
        x: img.x + 20,
        y: img.y + 20
      }
      imagesByDoc.value[docId].push(copy)
      selectItem(newId, 'image')
      return newId
    } else if (selectedItemType.value === 'stamp') {
      const s = item as StampAnnotation
      return addStamp(s.pageIndex, s.label, s.x + 20, s.y + 20, s.color, s.width, s.height)
    }
    return null
  }

  function nudgeSelectedItem(deltaX: number, deltaY: number) {
    if (!selectedItem.value) return
    const item = selectedItem.value
    updateSelectedItem({
      x: Math.max(0, Math.round(item.x + deltaX)),
      y: Math.max(0, Math.round(item.y + deltaY))
    })
  }

  // --- Text Operations ---
  function addText(
    pageIndex: number,
    x: number,
    y: number,
    initialText: string = 'Click to edit text',
    width?: number,
    height?: number
  ): string {
    const id = `text_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    const docId = getDocId()
    if (!docId) return id

    if (!textsByDoc.value[docId]) {
      textsByDoc.value[docId] = []
    }

    const initialWidth = width || Math.max(160, Math.round(initialText.length * 9))
    const initialHeight = height || Math.max(36, Math.round(activeFontSize.value * 1.5))

    const newItem: TextAnnotation = {
      id,
      pageIndex,
      text: initialText,
      x: Math.round(x),
      y: Math.round(y),
      width: initialWidth,
      height: initialHeight,
      fontSize: activeFontSize.value,
      fontFamily: activeFont.value,
      color: activeTextColor.value
    }

    textsByDoc.value[docId].push(newItem)
    selectItem(id, 'text')
    return id
  }

  function updateText(id: string, updates: Partial<TextAnnotation>) {
    const docId = getDocId()
    if (!docId || !textsByDoc.value[docId]) return
    const idx = textsByDoc.value[docId].findIndex(t => t.id === id)
    if (idx !== -1) {
      textsByDoc.value[docId][idx] = { ...textsByDoc.value[docId][idx], ...updates }
    }
  }

  function deleteText(id: string) {
    const docId = getDocId()
    if (!docId || !textsByDoc.value[docId]) return
    textsByDoc.value[docId] = textsByDoc.value[docId].filter(t => t.id !== id)
    if (selectedItemId.value === id) {
      deselectItem()
    }
  }

  // --- Image Operations ---
  async function addImageFromFile(
    pageIndex: number,
    file: File,
    x: number = 50,
    y: number = 50,
    isSignature: boolean = false
  ): Promise<string> {
    const id = `img_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    const docId = getDocId()
    if (!docId) return id

    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png')

    // Read natural dimensions
    const previewUrl = URL.createObjectURL(file)
    const imgEl = new window.Image()
    imgEl.src = previewUrl
    await new Promise((res) => {
      imgEl.onload = res
      imgEl.onerror = res
    })

    const naturalWidth = imgEl.naturalWidth || 200
    const naturalHeight = imgEl.naturalHeight || 200
    const aspectRatio = naturalWidth / Math.max(1, naturalHeight)

    // Scale to reasonable default point size (max 220px width)
    const scale = Math.min(220 / naturalWidth, 220 / naturalHeight, 1.0)
    const width = Math.round(naturalWidth * scale)
    const height = Math.round(naturalHeight * scale)

    if (!imagesByDoc.value[docId]) {
      imagesByDoc.value[docId] = []
    }

    const newItem: ImageAnnotation = {
      id,
      pageIndex,
      imageBytes: bytes,
      format: isPng ? 'png' : 'jpeg',
      x: Math.round(x),
      y: Math.round(y),
      width,
      height,
      opacity: activeImageOpacity.value,
      aspectRatio,
      previewUrl,
      isSignature
    }

    imagesByDoc.value[docId].push(newItem)
    selectItem(id, 'image')
    return id
  }

  function updateImage(id: string, updates: Partial<ImageAnnotation>) {
    const docId = getDocId()
    if (!docId || !imagesByDoc.value[docId]) return
    const idx = imagesByDoc.value[docId].findIndex(img => img.id === id)
    if (idx !== -1) {
      imagesByDoc.value[docId][idx] = { ...imagesByDoc.value[docId][idx], ...updates }
    }
  }

  function deleteImage(id: string) {
    const docId = getDocId()
    if (!docId || !imagesByDoc.value[docId]) return
    imagesByDoc.value[docId] = imagesByDoc.value[docId].filter(img => img.id !== id)
    if (selectedItemId.value === id) {
      deselectItem()
    }
  }

  // --- Drawing / Signature Operations ---
  function addDrawing(pageIndex: number, points: Array<{ x: number; y: number }>): string {
    const id = `draw_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    const docId = getDocId()
    if (!docId || points.length < 2) return id

    if (!drawingsByDoc.value[docId]) {
      drawingsByDoc.value[docId] = []
    }

    const newItem: DrawingAnnotation = {
      id,
      pageIndex,
      points,
      color: activeDrawColor.value,
      thickness: activeDrawThickness.value,
      opacity: 1.0
    }

    drawingsByDoc.value[docId].push(newItem)
    return id
  }

  function deleteDrawing(id: string) {
    const docId = getDocId()
    if (!docId || !drawingsByDoc.value[docId]) return
    drawingsByDoc.value[docId] = drawingsByDoc.value[docId].filter(d => d.id !== id)
  }

  // --- Stamp Operations ---
  function addStamp(
    pageIndex: number,
    label: string,
    x: number = 50,
    y: number = 50,
    color: string = '#10b981',
    width: number = 140,
    height: number = 38
  ): string {
    const id = `stamp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    const docId = getDocId()
    if (!docId) return id

    if (!stampsByDoc.value[docId]) {
      stampsByDoc.value[docId] = []
    }

    const newItem: StampAnnotation = {
      id,
      pageIndex,
      label,
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(width),
      height: Math.round(height),
      color
    }

    stampsByDoc.value[docId].push(newItem)
    selectItem(id, 'stamp')
    return id
  }

  function updateStamp(id: string, updates: Partial<StampAnnotation>) {
    const docId = getDocId()
    if (!docId || !stampsByDoc.value[docId]) return
    const idx = stampsByDoc.value[docId].findIndex(s => s.id === id)
    if (idx !== -1) {
      stampsByDoc.value[docId][idx] = { ...stampsByDoc.value[docId][idx], ...updates }
    }
  }

  function deleteStamp(id: string) {
    const docId = getDocId()
    if (!docId || !stampsByDoc.value[docId]) return
    stampsByDoc.value[docId] = stampsByDoc.value[docId].filter(s => s.id !== id)
    if (selectedItemId.value === id) {
      deselectItem()
    }
  }

  // --- Clear & Reset ---
  function clearAllPending() {
    const docId = getDocId()
    if (!docId) return
    textsByDoc.value[docId] = []
    imagesByDoc.value[docId] = []
    drawingsByDoc.value[docId] = []
    stampsByDoc.value[docId] = []
    deselectItem()
  }

  // --- Apply All Pending Annotations to Real PDF ---
  const isApplying = ref(false)

  async function applyAllPendingAnnotations(): Promise<boolean> {
    const activeDoc = pdfStore.activeDocument
    if (!activeDoc || totalPendingCount.value === 0) return false

    isApplying.value = true
    try {
      pdfStore.recordHistorySnapshot('Apply Text, Image & Stamp Annotations')

      const newBytes = await applyAnnotationsToPdf(activeDoc.bytes, {
        texts: activeTexts.value,
        images: activeImages.value,
        drawings: activeDrawings.value,
        stamps: activeStamps.value
      })

      await pdfStore.updateActiveDocumentBytes(newBytes)
      clearAllPending()
      activeTool.value = 'select'
      return true
    } finally {
      isApplying.value = false
    }
  }

  return {
    activeTool,
    activeFont,
    activeFontSize,
    activeTextColor,
    activeDrawColor,
    activeDrawThickness,
    activeImageOpacity,
    activeStamp,
    selectedItemId,
    selectedItemType,
    selectedItem,

    textsByDoc,
    imagesByDoc,
    drawingsByDoc,
    stampsByDoc,

    activeTexts,
    activeImages,
    activeDrawings,
    activeStamps,
    totalPendingCount,
    isApplying,

    selectItem,
    deselectItem,
    updateSelectedItem,
    deleteSelectedItem,
    duplicateSelectedItem,
    nudgeSelectedItem,

    addText,
    updateText,
    deleteText,
    addImageFromFile,
    updateImage,
    deleteImage,
    addDrawing,
    deleteDrawing,
    addStamp,
    updateStamp,
    deleteStamp,
    clearAllPending,
    applyAllPendingAnnotations
  }
})
