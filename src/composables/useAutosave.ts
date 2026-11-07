import { ref, onMounted } from 'vue'
import { listDocumentDrafts, deleteDocumentDraft, type StoredDocument } from '../modules/storage/indexeddb'
import { usePdfStore } from '../stores/pdfStore'

export function useAutosave() {
  const pdfStore = usePdfStore()
  const savedDrafts = ref<StoredDocument[]>([])
  const showRestorePrompt = ref<boolean>(false)

  async function checkDrafts() {
    try {
      const drafts = await listDocumentDrafts()
      if (drafts.length > 0 && pdfStore.documents.length === 0) {
        savedDrafts.value = drafts
        showRestorePrompt.value = true
      }
    } catch {
      // Ignore idb errors
    }
  }

  async function restoreDraft(draft: StoredDocument) {
    await pdfStore.openPdf(draft.name, draft.bytes)
    showRestorePrompt.value = false
  }

  async function restoreAllDrafts() {
    for (const draft of savedDrafts.value) {
      await pdfStore.openPdf(draft.name, draft.bytes)
    }
    showRestorePrompt.value = false
  }

  async function dismissAndClearDrafts() {
    for (const draft of savedDrafts.value) {
      await deleteDocumentDraft(draft.id)
    }
    savedDrafts.value = []
    showRestorePrompt.value = false
  }

  onMounted(() => {
    checkDrafts()
  })

  return {
    savedDrafts,
    showRestorePrompt,
    restoreDraft,
    restoreAllDrafts,
    dismissAndClearDrafts
  }
}
