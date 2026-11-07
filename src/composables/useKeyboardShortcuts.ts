import { onMounted, onUnmounted } from 'vue'
import { usePdfStore } from '../stores/pdfStore'

export function useKeyboardShortcuts(onSaveRequest?: () => void) {
  const pdfStore = usePdfStore()

  function handleKeyDown(e: KeyboardEvent) {
    // Ignore if focus is in an input or textarea
    const activeEl = document.activeElement
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || (activeEl as HTMLElement).isContentEditable)) {
      return
    }

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    const modifier = isMac ? e.metaKey : e.ctrlKey

    // Undo / Redo
    if (modifier && e.key.toLowerCase() === 'z') {
      e.preventDefault()
      if (e.shiftKey) {
        pdfStore.handleRedo()
      } else {
        pdfStore.handleUndo()
      }
      return
    }

    if (modifier && e.key.toLowerCase() === 'y') {
      e.preventDefault()
      pdfStore.handleRedo()
      return
    }

    // Save
    if (modifier && e.key.toLowerCase() === 's') {
      e.preventDefault()
      if (onSaveRequest) {
        onSaveRequest()
      }
      return
    }

    // Zoom shortcuts
    if (modifier && (e.key === '=' || e.key === '+')) {
      e.preventDefault()
      pdfStore.zoom = Math.min(3.0, pdfStore.zoom + 0.15)
      pdfStore.fitMode = 'custom'
      return
    }

    if (modifier && e.key === '-') {
      e.preventDefault()
      pdfStore.zoom = Math.max(0.3, pdfStore.zoom - 0.15)
      pdfStore.fitMode = 'custom'
      return
    }

    if (modifier && e.key === '0') {
      e.preventDefault()
      pdfStore.zoom = 1.0
      pdfStore.fitMode = 'custom'
      return
    }

    // Page rotation: R
    if (e.key.toLowerCase() === 'r' && !modifier) {
      if (pdfStore.selectedPageIndices.size > 0) {
        e.preventDefault()
        const delta = e.shiftKey ? -90 : 90
        pdfStore.rotatePages(Array.from(pdfStore.selectedPageIndices), delta)
      }
      return
    }

    // Delete page: Delete / Backspace
    if ((e.key === 'Delete' || e.key === 'Backspace') && !modifier) {
      if (pdfStore.selectedPageIndices.size > 0 && pdfStore.activeDocument && pdfStore.activeDocument.pageCount > 1) {
        e.preventDefault()
        pdfStore.deletePages(Array.from(pdfStore.selectedPageIndices))
      }
      return
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
}
