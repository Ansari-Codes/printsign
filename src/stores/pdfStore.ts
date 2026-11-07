import { defineStore } from 'pinia'
import { ref, shallowRef, markRaw, computed } from 'vue'
import { PDFDocument } from 'pdf-lib'
import type * as pdfjsLib from 'pdfjs-dist'
import { loadPdfDocument, type PasswordPromptCallback } from '../modules/pdf-loader'
import * as PageEditor from '../modules/page-editor'
import { useHistoryStore } from './historyStore'
import { saveDocumentDraft, deleteDocumentDraft } from '../modules/storage/indexeddb'

export interface DocumentTab {
  id: string
  name: string
  bytes: Uint8Array
  pageCount: number
  isEncrypted: boolean
  hasSignatures: boolean
  isDirty: boolean
  pdfVersion: string
}

export type WorkspaceTab = 'view' | 'redact' | 'edit' | 'metadata' | 'rasterize'
export type ViewMode = 'continuous' | 'single'
export type FitMode = 'custom' | 'fit-width' | 'fit-page'

export const usePdfStore = defineStore('pdf', () => {
  const historyStore = useHistoryStore()

  // State
  const documents = ref<DocumentTab[]>([])
  const activeDocumentId = ref<string | null>(null)
  const documentVersion = ref<number>(1) // reactive bump on any document state mutation

  const activePdfDoc = shallowRef<PDFDocument | null>(null)
  const activePdfProxy = shallowRef<pdfjsLib.PDFDocumentProxy | null>(null)
  const pageDimensions = ref<Array<{ width: number; height: number; rotate: number }>>([])

  const currentPageIndex = ref<number>(0)
  const selectedPageIndices = ref<Set<number>>(new Set())

  const zoom = ref<number>(1.0)
  const fitMode = ref<FitMode>('custom')
  const viewMode = ref<ViewMode>('continuous')
  const sidebarOpen = ref<boolean>(true)
  const activeWorkspaceTab = ref<WorkspaceTab>('view')

  const isLoading = ref<boolean>(false)
  const loadingStatus = ref<string>('')
  const signatureWarningDismissed = ref<boolean>(false)

  // Computed
  const activeDocument = computed(() => {
    return documents.value.find(doc => doc.id === activeDocumentId.value) || null
  })

  const hasSignatures = computed(() => {
    return activeDocument.value?.hasSignatures ?? false
  })

  const isDirty = computed(() => {
    return activeDocument.value?.isDirty ?? false
  })

  // Global password prompt handler
  const passwordPromptHandler = ref<PasswordPromptCallback | null>(null)
  function setPasswordPromptHandler(handler: PasswordPromptCallback) {
    passwordPromptHandler.value = handler
  }

  // Synchronize pdfjs-dist proxy and dimensions from current bytes
  async function syncPdfProxy(bytes: Uint8Array) {
    const oldProxy = activePdfProxy.value

    const loadResult = await loadPdfDocument(bytes)
    activePdfProxy.value = markRaw(loadResult.pdfProxy)
    pageDimensions.value = loadResult.pageDimensions

    if (oldProxy && oldProxy !== loadResult.pdfProxy) {
      try {
        oldProxy.destroy()
      } catch {
        // ignore
      }
    }

    if (activeDocument.value) {
      activeDocument.value.pageCount = loadResult.pageCount
      activeDocument.value.hasSignatures = loadResult.hasSignatures
      activeDocument.value.pdfVersion = loadResult.pdfVersion
    }
  }

  // Record undo/redo history before applying changes
  function recordHistorySnapshot(description: string) {
    if (activeDocument.value) {
      historyStore.pushState(activeDocument.value.id, description, activeDocument.value.bytes)
    }
  }

  // Load a brand new PDF file into the editor tabs
  async function loadDocument(
    file: File,
    onPasswordPrompt?: PasswordPromptCallback
  ): Promise<string> {
    const buffer = await file.arrayBuffer()
    return openPdf(file.name, new Uint8Array(buffer), onPasswordPrompt)
  }

  // Load a brand new PDF file into the editor tabs
  async function openPdf(
    name: string,
    bytes: Uint8Array,
    onPasswordPrompt?: PasswordPromptCallback
  ): Promise<string> {
    isLoading.value = true
    loadingStatus.value = `Loading ${name}...`

    try {
      const docId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`

      const prompt = onPasswordPrompt || passwordPromptHandler.value || undefined
      const loadResult = await loadPdfDocument(bytes, prompt)
      const pdfLibDoc = await PDFDocument.load(bytes.slice(), { ignoreEncryption: true })

      const newTab: DocumentTab = {
        id: docId,
        name,
        bytes: bytes.slice(),
        pageCount: loadResult.pageCount,
        isEncrypted: loadResult.isEncrypted,
        hasSignatures: loadResult.hasSignatures,
        isDirty: false,
        pdfVersion: loadResult.pdfVersion
      }

      documents.value.push(newTab)
      activeDocumentId.value = docId
      historyStore.setActiveDocId(docId)

      activePdfDoc.value = markRaw(pdfLibDoc)
      activePdfProxy.value = markRaw(loadResult.pdfProxy)
      pageDimensions.value = loadResult.pageDimensions
      currentPageIndex.value = 0
      selectedPageIndices.value = new Set([0])
      documentVersion.value++

      // Autosave draft to IndexedDB
      await saveDocumentDraft({
        id: docId,
        name,
        bytes: bytes.slice(),
        size: bytes.length,
        pageCount: loadResult.pageCount,
        lastModified: Date.now(),
        isDirty: false
      })

      return docId
    } finally {
      isLoading.value = false
      loadingStatus.value = ''
    }
  }

  // Switch active document tab
  async function switchTab(id: string) {
    if (activeDocumentId.value === id) return
    const target = documents.value.find(d => d.id === id)
    if (!target) return

    isLoading.value = true
    try {
      activeDocumentId.value = id
      historyStore.setActiveDocId(id)

      const pdfLibDoc = await PDFDocument.load(target.bytes.slice(), { ignoreEncryption: true })
      activePdfDoc.value = markRaw(pdfLibDoc)
      await syncPdfProxy(target.bytes)
      currentPageIndex.value = 0
      selectedPageIndices.value = new Set([0])
      documentVersion.value++
    } finally {
      isLoading.value = false
    }
  }

  // Close tab
  async function closeTab(id: string) {
    const idx = documents.value.findIndex(d => d.id === id)
    if (idx === -1) return

    await deleteDocumentDraft(id)
    historyStore.clearHistory(id)
    documents.value.splice(idx, 1)

    if (activeDocumentId.value === id) {
      if (documents.value.length > 0) {
        const nextDoc = documents.value[Math.max(0, idx - 1)]
        await switchTab(nextDoc.id)
      } else {
        activeDocumentId.value = null
        activePdfDoc.value = null
        activePdfProxy.value = null
        pageDimensions.value = []
        documentVersion.value++
      }
    }
  }

  // Reload state from new byte array (e.g. after redaction or undo/redo)
  async function updateActiveDocumentBytes(newBytes: Uint8Array, markDirty: boolean = true) {
    if (!activeDocument.value) return

    activeDocument.value.bytes = newBytes.slice()
    activeDocument.value.isDirty = markDirty

    const pdfLibDoc = await PDFDocument.load(newBytes.slice(), { ignoreEncryption: true })
    activePdfDoc.value = markRaw(pdfLibDoc)

    await syncPdfProxy(newBytes)
    documentVersion.value++

    // Autosave draft
    await saveDocumentDraft({
      id: activeDocument.value.id,
      name: activeDocument.value.name,
      bytes: newBytes.slice(),
      size: newBytes.length,
      pageCount: activeDocument.value.pageCount,
      lastModified: Date.now(),
      isDirty: markDirty
    })
  }

  // Undo / Redo
  async function handleUndo() {
    if (!activeDocument.value || !historyStore.canUndo) return
    const prevBytes = historyStore.undo(activeDocument.value.id, activeDocument.value.bytes)
    if (prevBytes) {
      await updateActiveDocumentBytes(prevBytes, true)
    }
  }

  async function handleRedo() {
    if (!activeDocument.value || !historyStore.canRedo) return
    const nextBytes = historyStore.redo(activeDocument.value.id, activeDocument.value.bytes)
    if (nextBytes) {
      await updateActiveDocumentBytes(nextBytes, true)
    }
  }

  // Page Operations
  async function rotatePages(indices: number[], deltaDegrees: number) {
    if (!activePdfDoc.value || !activeDocument.value) return
    recordHistorySnapshot(`Rotate page(s) by ${deltaDegrees}°`)

    for (const idx of indices) {
      PageEditor.rotatePage(activePdfDoc.value, idx, deltaDegrees)
    }

    const savedBytes = await activePdfDoc.value.save()
    await updateActiveDocumentBytes(savedBytes, true)
  }

  async function deletePages(indices: number[]) {
    if (!activePdfDoc.value || !activeDocument.value) return
    if (indices.length >= activePdfDoc.value.getPageCount()) {
      throw new Error('Cannot delete all pages in document')
    }

    recordHistorySnapshot(`Delete ${indices.length} page(s)`)
    PageEditor.deletePages(activePdfDoc.value, indices)

    const savedBytes = await activePdfDoc.value.save()
    await updateActiveDocumentBytes(savedBytes, true)
    selectedPageIndices.value = new Set([Math.min(currentPageIndex.value, activePdfDoc.value.getPageCount() - 1)])
  }

  async function reorderPage(fromIndex: number, toIndex: number) {
    if (!activePdfDoc.value || !activeDocument.value) return
    if (fromIndex === toIndex) return

    recordHistorySnapshot(`Reorder page ${fromIndex + 1} to ${toIndex + 1}`)
    PageEditor.reorderPage(activePdfDoc.value, fromIndex, toIndex)

    const savedBytes = await activePdfDoc.value.save()
    await updateActiveDocumentBytes(savedBytes, true)
    selectedPageIndices.value = new Set([toIndex])
  }

  async function duplicatePage(pageIndex: number) {
    if (!activePdfDoc.value || !activeDocument.value) return

    recordHistorySnapshot(`Duplicate page ${pageIndex + 1}`)
    await PageEditor.duplicatePage(activePdfDoc.value, pageIndex)

    const savedBytes = await activePdfDoc.value.save()
    await updateActiveDocumentBytes(savedBytes, true)
    selectedPageIndices.value = new Set([pageIndex + 1])
  }

  async function insertBlankPage(atIndex: number) {
    if (!activePdfDoc.value || !activeDocument.value) return

    recordHistorySnapshot(`Insert blank page at ${atIndex + 1}`)
    PageEditor.insertBlankPage(activePdfDoc.value, atIndex)

    const savedBytes = await activePdfDoc.value.save()
    await updateActiveDocumentBytes(savedBytes, true)
    selectedPageIndices.value = new Set([atIndex])
  }

  async function cropPage(pageIndex: number, cropBox: PageEditor.PageCropBox) {
    if (!activePdfDoc.value || !activeDocument.value) return

    recordHistorySnapshot(`Crop page ${pageIndex + 1}`)
    PageEditor.cropPage(activePdfDoc.value, pageIndex, cropBox)

    const savedBytes = await activePdfDoc.value.save()
    await updateActiveDocumentBytes(savedBytes, true)
  }

  async function mergeFiles(sourceFiles: Array<{ name: string; bytes: Uint8Array }>) {
    if (!activePdfDoc.value || !activeDocument.value) return

    recordHistorySnapshot(`Merge ${sourceFiles.length} file(s)`)
    await PageEditor.mergePdfDocuments(
      activePdfDoc.value,
      sourceFiles.map(f => f.bytes)
    )

    const savedBytes = await activePdfDoc.value.save()
    await updateActiveDocumentBytes(savedBytes, true)
  }

  return {
    documents,
    activeDocumentId,
    activeDocument,
    activePdfDoc,
    activePdfProxy,
    pageDimensions,
    currentPageIndex,
    selectedPageIndices,
    documentVersion,
    zoom,
    fitMode,
    viewMode,
    sidebarOpen,
    activeWorkspaceTab,
    isLoading,
    loadingStatus,
    hasSignatures,
    isDirty,
    signatureWarningDismissed,

    openPdf,
    loadDocument,
    setPasswordPromptHandler,
    switchTab,
    closeTab,
    updateActiveDocumentBytes,
    syncPdfProxy,
    recordHistorySnapshot,
    handleUndo,
    handleRedo,
    rotatePages,
    deletePages,
    reorderPage,
    duplicatePage,
    insertBlankPage,
    cropPage,
    mergeFiles
  }
})
