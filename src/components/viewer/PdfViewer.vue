<template>
  <main
    ref="viewerContainerRef"
    class="flex-1 bg-[#090d16] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.08),rgba(255,255,255,0))] overflow-auto relative p-6 flex flex-col items-center justify-start select-none"
  >
    <!-- Empty state when no PDF is loaded -->
    <div
      v-if="!pdfStore.activeDocument"
      class="w-full flex flex-col items-center justify-start my-auto py-8"
    >
      <div
        class="max-w-lg w-full p-10 border border-slate-700/60 rounded-3xl flex flex-col items-center text-center bg-slate-900/70 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        @dragover.prevent
        @drop.prevent="handleFileDrop"
      >
        <!-- Subtle top neon gradient accent -->
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500"></div>

        <div class="w-18 h-18 rounded-2xl bg-gradient-to-tr from-cyan-500/15 via-blue-500/15 to-indigo-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10 mb-5">
          <FileUp class="w-9 h-9" />
        </div>

        <h1 class="text-2xl font-bold text-white tracking-tight mb-2">
          {{ props.toolHeading || 'Drop your PDF here' }}
        </h1>
        <p class="text-sm text-slate-400 mb-8 max-w-sm leading-relaxed">
          {{ props.toolDescription || 'Ultra-fast client-side parsing, editing, and military-grade redaction. Your files never leave your device.' }}
        </p>

        <label class="cursor-pointer px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-semibold rounded-2xl transition-all shadow-xl shadow-cyan-500/25 active:scale-98 text-sm flex items-center gap-2.5">
          <FolderOpen class="w-4 h-4" />
          <span>Select PDF Document</span>
          <input
            type="file"
            accept="application/pdf"
            class="hidden"
            @change="handleFileInput"
          />
        </label>

        <!-- Autosave Restore Banner if drafts exist -->
        <div v-if="showRestorePrompt && savedDrafts.length > 0" class="mt-8 w-full p-4 bg-slate-950/80 border border-amber-500/30 rounded-2xl text-left shadow-lg">
          <div class="flex items-center justify-between text-xs text-amber-300 font-semibold mb-1">
            <span class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              Recoverable Local Drafts Found
            </span>
            <button @click="dismissAndClearDrafts" class="text-slate-400 hover:text-white transition">Dismiss</button>
          </div>
          <p class="text-xs text-slate-400 mb-3">
            Restore {{ savedDrafts.length }} document(s) from your local browser IndexedDB?
          </p>
          <button
            @click="restoreAllDrafts"
            class="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
          >
            Restore Drafts
          </button>
        </div>
      </div>

      <!-- Below-The-Fold Crawlable Semantic SEO Content Section -->
      <SeoContentSection />
    </div>

    <!-- Active Document Pages Viewer -->
    <div
      v-else
      class="w-full flex flex-col items-center justify-center"
    >
      <!-- Continuous Scroll Mode -->
      <template v-if="pdfStore.viewMode === 'continuous'">
        <PageCanvas
          v-for="(_, index) in pdfStore.pageDimensions"
          :key="`page_${pdfStore.activeDocumentId}_${index}_v${pdfStore.documentVersion}_${effectiveScale}`"
          :page-index="index"
          :scale="effectiveScale"
        />
      </template>

      <!-- Single Page Mode -->
      <template v-else>
        <div class="flex flex-col items-center">
          <PageCanvas
            :key="`single_${pdfStore.activeDocumentId}_${pdfStore.currentPageIndex}_v${pdfStore.documentVersion}_${effectiveScale}`"
            :page-index="pdfStore.currentPageIndex"
            :scale="effectiveScale"
          />

          <!-- Single Page Navigation Toolbar -->
          <div class="fixed bottom-12 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-4 py-1.5 rounded-full flex items-center gap-3 shadow-2xl shadow-black/80 z-20 text-xs text-slate-300">
            <button
              @click="prevPage"
              :disabled="pdfStore.currentPageIndex <= 0"
              class="p-1 hover:text-white disabled:opacity-30 rounded-full hover:bg-slate-800 transition"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>
            <span class="font-mono text-slate-200">
              Page {{ pdfStore.currentPageIndex + 1 }} of {{ pdfStore.pageDimensions.length }}
            </span>
            <button
              @click="nextPage"
              :disabled="pdfStore.currentPageIndex >= pdfStore.pageDimensions.length - 1"
              class="p-1 hover:text-white disabled:opacity-30 rounded-full hover:bg-slate-800 transition"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </template>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { FileUp, FolderOpen, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { usePdfStore } from '../../stores/pdfStore'
import { useAutosave } from '../../composables/useAutosave'
import PageCanvas from './PageCanvas.vue'
import SeoContentSection from '../website/SeoContentSection.vue'

const props = defineProps<{
  toolHeading?: string
  toolDescription?: string
}>()

const pdfStore = usePdfStore()
const {
  savedDrafts,
  showRestorePrompt,
  restoreAllDrafts,
  dismissAndClearDrafts
} = useAutosave()
const viewerContainerRef = ref<HTMLDivElement | null>(null)
const containerWidth = ref<number>(800)
const containerHeight = ref<number>(800)

let resizeObserver: ResizeObserver | null = null

function updateDimensions() {
  if (viewerContainerRef.value) {
    containerWidth.value = viewerContainerRef.value.clientWidth
    containerHeight.value = viewerContainerRef.value.clientHeight
  }
}

onMounted(() => {
  updateDimensions()
  if (viewerContainerRef.value) {
    resizeObserver = new ResizeObserver(() => updateDimensions())
    resizeObserver.observe(viewerContainerRef.value)
  }
})

onUnmounted(() => {
  if (resizeObserver && viewerContainerRef.value) {
    resizeObserver.unobserve(viewerContainerRef.value)
    resizeObserver.disconnect()
  }
})

// Compute scale taking into account Fit Width and Fit Page
const effectiveScale = computed(() => {
  const activeDim = pdfStore.pageDimensions[pdfStore.currentPageIndex] || { width: 612, height: 792 }
  const paddingX = 64
  const paddingY = 64

  if (pdfStore.fitMode === 'fit-width') {
    const availableW = Math.max(200, containerWidth.value - paddingX)
    return Number((availableW / activeDim.width).toFixed(3))
  }

  if (pdfStore.fitMode === 'fit-page') {
    const availableW = Math.max(200, containerWidth.value - paddingX)
    const availableH = Math.max(200, containerHeight.value - paddingY)
    const scaleW = availableW / activeDim.width
    const scaleH = availableH / activeDim.height
    return Number(Math.min(scaleW, scaleH).toFixed(3))
  }

  return pdfStore.zoom
})

function prevPage() {
  if (pdfStore.currentPageIndex > 0) {
    pdfStore.currentPageIndex--
  }
}

function nextPage() {
  if (pdfStore.currentPageIndex < pdfStore.pageDimensions.length - 1) {
    pdfStore.currentPageIndex++
  }
}

async function handleFileDrop(e: DragEvent) {
  const files = e.dataTransfer?.files
  if (!files || files.length === 0) return
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const buffer = await file.arrayBuffer()
      await pdfStore.openPdf(file.name, new Uint8Array(buffer))
    }
  }
}

async function handleFileInput(e: Event) {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  for (let i = 0; i < target.files.length; i++) {
    const file = target.files[i]
    const buffer = await file.arrayBuffer()
    await pdfStore.openPdf(file.name, new Uint8Array(buffer))
  }
  target.value = ''
}
</script>
