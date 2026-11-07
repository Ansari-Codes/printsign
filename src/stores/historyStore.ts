import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface HistoryItem {
  id: string
  description: string
  timestamp: number
  bytes: Uint8Array
}

interface DocHistory {
  undoStack: HistoryItem[]
  redoStack: HistoryItem[]
}

export const useHistoryStore = defineStore('history', () => {
  const historyByDoc = ref<Record<string, DocHistory>>({})
  const activeDocId = ref<string>('')
  const maxStackSize = 25

  function getDocHistory(docId: string): DocHistory {
    if (!historyByDoc.value[docId]) {
      historyByDoc.value[docId] = {
        undoStack: [],
        redoStack: []
      }
    }
    return historyByDoc.value[docId]
  }

  function setActiveDocId(id: string) {
    activeDocId.value = id
  }

  const canUndo = computed(() => {
    if (!activeDocId.value) return false
    return (historyByDoc.value[activeDocId.value]?.undoStack.length || 0) > 0
  })

  const canRedo = computed(() => {
    if (!activeDocId.value) return false
    return (historyByDoc.value[activeDocId.value]?.redoStack.length || 0) > 0
  })

  function pushState(docId: string, description: string, bytes: Uint8Array) {
    const hist = getDocHistory(docId)
    hist.redoStack = [] // Clear redo on new action
    hist.undoStack.push({
      id: Math.random().toString(36).substring(2, 9),
      description,
      timestamp: Date.now(),
      bytes: bytes.slice() // Clone byte array
    })

    if (hist.undoStack.length > maxStackSize) {
      hist.undoStack.shift()
    }
  }

  function undo(docId: string, currentBytes: Uint8Array): Uint8Array | null {
    const hist = getDocHistory(docId)
    if (hist.undoStack.length === 0) return null

    const previousState = hist.undoStack.pop()!
    hist.redoStack.push({
      id: Math.random().toString(36).substring(2, 9),
      description: previousState.description,
      timestamp: Date.now(),
      bytes: currentBytes.slice()
    })

    return previousState.bytes
  }

  function redo(docId: string, currentBytes: Uint8Array): Uint8Array | null {
    const hist = getDocHistory(docId)
    if (hist.redoStack.length === 0) return null

    const nextState = hist.redoStack.pop()!
    hist.undoStack.push({
      id: Math.random().toString(36).substring(2, 9),
      description: nextState.description,
      timestamp: Date.now(),
      bytes: currentBytes.slice()
    })

    return nextState.bytes
  }

  function clearHistory(docId?: string) {
    if (docId) {
      if (historyByDoc.value[docId]) {
        delete historyByDoc.value[docId]
      }
    } else if (activeDocId.value) {
      delete historyByDoc.value[activeDocId.value]
    }
  }

  return {
    historyByDoc,
    activeDocId,
    canUndo,
    canRedo,
    setActiveDocId,
    pushState,
    undo,
    redo,
    clearHistory
  }
})
