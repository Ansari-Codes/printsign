import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RedactionBox, RedactionResult } from '../modules/redactor'
import { applyRedactions } from '../modules/redactor'
import type { TextMatchItem } from '../modules/redactor/search'
import { searchPdfText } from '../modules/redactor/search'
import type { VerificationReport } from '../modules/verification/canary'
import type { GCStats } from '../modules/redactor/gc'
import { usePdfStore } from './pdfStore'

export const useRedactionStore = defineStore('redaction', () => {
  const pdfStore = usePdfStore()

  // State isolated per document ID
  const boxesByDoc = ref<Record<string, RedactionBox[]>>({})
  const activePreset = ref<'solid' | 'redacted_text'>('solid')
  const scrubMetadataDefault = ref<boolean>(true)
  const redactionDpi = ref<number>(200)

  // Search state
  const searchQuery = ref<string>('')
  const searchResults = ref<TextMatchItem[]>([])
  const selectedMatchIds = ref<Set<string>>(new Set())
  const isSearching = ref<boolean>(false)

  // Execution state
  const isApplying = ref<boolean>(false)
  const progressStatus = ref<string>('')
  const progressCurrent = ref<number>(0)
  const progressTotal = ref<number>(0)
  const lastVerificationReport = ref<VerificationReport | null>(null)
  const lastGcStats = ref<GCStats | null>(null)
  const showVerificationModal = ref<boolean>(false)

  // Active document's boxes
  const boxes = computed<RedactionBox[]>(() => {
    const docId = pdfStore.activeDocumentId
    if (!docId) return []
    if (!boxesByDoc.value[docId]) {
      boxesByDoc.value[docId] = []
    }
    return boxesByDoc.value[docId]
  })

  const totalBoxesCount = computed(() => boxes.value.length)

  const boxesByPage = computed(() => {
    const map = new Map<number, RedactionBox[]>()
    for (const b of boxes.value) {
      if (!map.has(b.pageIndex)) map.set(b.pageIndex, [])
      map.get(b.pageIndex)!.push(b)
    }
    return map
  })

  function getActiveDocBoxesList(): RedactionBox[] {
    const docId = pdfStore.activeDocumentId
    if (!docId) return []
    if (!boxesByDoc.value[docId]) {
      boxesByDoc.value[docId] = []
    }
    return boxesByDoc.value[docId]
  }

  function addBox(box: RedactionBox) {
    const list = getActiveDocBoxesList()
    list.push(box)
  }

  function removeBox(id: string) {
    const list = getActiveDocBoxesList()
    const idx = list.findIndex(b => b.id === id)
    if (idx !== -1) {
      list.splice(idx, 1)
    }
  }

  function clearBoxes() {
    const docId = pdfStore.activeDocumentId
    if (docId) {
      boxesByDoc.value[docId] = []
    }
  }

  function clearPageBoxes(pageIndex: number) {
    const docId = pdfStore.activeDocumentId
    if (docId && boxesByDoc.value[docId]) {
      boxesByDoc.value[docId] = boxesByDoc.value[docId].filter(b => b.pageIndex !== pageIndex)
    }
  }

  function clearSearch() {
    searchQuery.value = ''
    searchResults.value = []
    selectedMatchIds.value.clear()
  }

  async function executeSearch(query: string, pdfBytes: Uint8Array) {
    searchQuery.value = query
    if (!query.trim()) {
      searchResults.value = []
      selectedMatchIds.value.clear()
      return
    }

    isSearching.value = true
    try {
      const results = await searchPdfText(pdfBytes, query)
      searchResults.value = results
      selectedMatchIds.value = new Set(results.map(r => r.id))
    } finally {
      isSearching.value = false
    }
  }

  function toggleMatchSelection(matchId: string) {
    if (selectedMatchIds.value.has(matchId)) {
      selectedMatchIds.value.delete(matchId)
    } else {
      selectedMatchIds.value.add(matchId)
    }
  }

  function selectAllMatches() {
    selectedMatchIds.value = new Set(searchResults.value.map(r => r.id))
  }

  function deselectAllMatches() {
    selectedMatchIds.value.clear()
  }

  function applySelectedMatchesAsBoxes() {
    const currentBoxes = getActiveDocBoxesList()

    for (const match of searchResults.value) {
      if (selectedMatchIds.value.has(match.id)) {
        // Prevent duplicate boxes at exact same coords
        const exists = currentBoxes.some(
          b => b.pageIndex === match.pageIndex &&
               Math.abs(b.x - match.x) < 2 &&
               Math.abs(b.y - match.y) < 2
        )

        if (!exists) {
          currentBoxes.push({
            id: `box_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            pageIndex: match.pageIndex,
            x: match.x,
            y: match.y,
            width: match.width,
            height: match.height,
            preset: activePreset.value,
            textMatch: match.text
          })
        }
      }
    }
  }

  async function applyAllRedactions(): Promise<RedactionResult | null> {
    if (!pdfStore.activeDocument || boxes.value.length === 0) return null

    isApplying.value = true
    progressStatus.value = 'Preparing redaction pipeline...'

    try {
      pdfStore.recordHistorySnapshot(`Apply ${boxes.value.length} Redactions`)

      const result = await applyRedactions(
        pdfStore.activeDocument.bytes,
        boxes.value,
        {
          dpi: redactionDpi.value,
          scrubMetadata: scrubMetadataDefault.value,
          onProgress: (step, curr, tot) => {
            progressStatus.value = step
            progressCurrent.value = curr
            progressTotal.value = tot
          }
        }
      )

      lastVerificationReport.value = result.verificationReport
      lastGcStats.value = result.gcStats
      showVerificationModal.value = true

      // Update active document with redacted bytes
      await pdfStore.updateActiveDocumentBytes(result.outputBytes, true)

      // Clear redaction boxes since they have been burned into the document
      clearBoxes()
      clearSearch()

      return result
    } finally {
      isApplying.value = false
      progressStatus.value = ''
    }
  }

  return {
    boxes,
    boxesByDoc,
    activePreset,
    scrubMetadataDefault,
    redactionDpi,
    searchQuery,
    searchResults,
    selectedMatchIds,
    isSearching,
    isApplying,
    progressStatus,
    progressCurrent,
    progressTotal,
    lastVerificationReport,
    lastGcStats,
    showVerificationModal,
    totalBoxesCount,
    boxesByPage,

    addBox,
    removeBox,
    clearBoxes,
    clearPageBoxes,
    clearSearch,
    executeSearch,
    toggleMatchSelection,
    selectAllMatches,
    deselectAllMatches,
    applySelectedMatchesAsBoxes,
    applyAllRedactions
  }
})
