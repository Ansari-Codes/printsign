<template>
  <aside
    v-if="pdfStore.sidebarOpen"
    class="w-64 bg-[#0a0f1c] border-r border-slate-800/80 flex flex-col shrink-0 select-none text-slate-300"
  >
    <!-- Sidebar Header & Batch Operations -->
    <div class="p-3 border-b border-slate-800/80 flex items-center justify-between gap-2 bg-[#090d18]">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-white">
        <LayoutGrid class="w-4 h-4 text-cyan-400" />
        <span>Thumbnails ({{ pdfStore.pageDimensions.length }})</span>
      </div>

      <div class="flex items-center gap-1">
        <!-- Rotate Selected -->
        <button
          @click="rotateSelected(90)"
          :disabled="pdfStore.selectedPageIndices.size === 0"
          class="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800 transition"
          title="Rotate Selected 90° Clockwise (R)"
        >
          <RotateCw class="w-3.5 h-3.5" />
        </button>

        <!-- Duplicate Selected -->
        <button
          @click="duplicateSelected"
          :disabled="pdfStore.selectedPageIndices.size !== 1"
          class="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800 transition"
          title="Duplicate Page"
        >
          <Copy class="w-3.5 h-3.5" />
        </button>

        <!-- Delete Selected -->
        <button
          @click="confirmDeleteSelected"
          :disabled="pdfStore.selectedPageIndices.size === 0 || pdfStore.pageDimensions.length <= 1"
          class="p-1.5 text-slate-400 hover:text-rose-400 disabled:opacity-30 rounded-lg hover:bg-slate-800 transition"
          title="Delete Selected Page(s)"
        >
          <Trash2 class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Quick Actions Toolbar -->
    <div class="px-3 py-2 bg-slate-900/40 border-b border-slate-800/80 flex items-center gap-2 text-xs">
      <button
        @click="insertBlankAtCurrent"
        class="flex-1 py-1.5 px-2 bg-slate-850 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl border border-slate-700/80 hover:border-cyan-500/40 transition flex items-center justify-center gap-1.5 shadow-xs"
      >
        <Plus class="w-3.5 h-3.5 text-cyan-400" />
        <span>Blank Page</span>
      </button>

      <button
        @click="extractSelected"
        :disabled="pdfStore.selectedPageIndices.size === 0"
        class="py-1.5 px-2 bg-slate-850 hover:bg-slate-800 text-slate-200 hover:text-white disabled:opacity-30 rounded-xl border border-slate-700/80 hover:border-indigo-500/40 transition flex items-center justify-center gap-1.5 shadow-xs"
        title="Extract selected pages to a new PDF"
      >
        <FileDown class="w-3.5 h-3.5 text-indigo-400" />
        <span>Extract</span>
      </button>
    </div>

    <!-- Thumbnail List with Drag-and-Drop Reordering & Lazy Rendering -->
    <div
      ref="scrollContainer"
      class="flex-1 overflow-y-auto p-3 space-y-3"
    >
      <div
        v-for="(dim, index) in pdfStore.pageDimensions"
        :key="`thumb_${pdfStore.activeDocumentId}_${index}_v${pdfStore.documentVersion}_${dim.rotate}`"
        :ref="el => registerThumbCard(el, index)"
        :draggable="true"
        @dragstart="handleDragStart(index, $event)"
        @dragover.prevent="handleDragOver(index)"
        @drop.prevent="handleDrop(index)"
        @dragenter.prevent
        @click="handlePageClick(index, $event)"
        :class="[
          'group relative p-2.5 rounded-xl border cursor-pointer transition-all duration-150 flex flex-col items-center',
          pdfStore.selectedPageIndices.has(index)
            ? 'bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-indigo-500/10 border-cyan-400/80 shadow-lg shadow-cyan-500/15 ring-2 ring-cyan-500/50'
            : dragOverIndex === index
              ? 'bg-slate-800/80 border-cyan-400 border-dashed'
              : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
        ]"
      >
        <!-- Page Number & Actions -->
        <div class="w-full flex items-center justify-between text-[11px] mb-2 text-slate-400 font-mono">
          <div class="flex items-center gap-1.5">
            <GripVertical class="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 cursor-grab" />
            <span class="font-semibold text-slate-300">#{{ index + 1 }}</span>
          </div>

          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
            <button
              @click.stop="rotatePage(index, 90)"
              class="p-1 hover:text-white rounded hover:bg-slate-800"
              title="Rotate 90° Clockwise"
            >
              <RotateCw class="w-3 h-3" />
            </button>
            <button
              @click.stop="$emit('open-crop', index)"
              class="p-1 hover:text-white rounded hover:bg-slate-800"
              title="Crop Page"
            >
              <Crop class="w-3 h-3" />
            </button>
          </div>
        </div>

        <!-- Thumbnail Canvas Preview (Lazy loaded when scrolled near) -->
        <div
          class="relative bg-white rounded-md shadow-md overflow-hidden flex items-center justify-center min-h-[140px] max-w-full"
          :style="{
            aspectRatio: `${dim.width} / ${dim.height}`
          }"
        >
          <canvas
            v-if="visibleThumbnails.has(index)"
            :ref="el => setCanvasRef(el, index)"
            class="w-full h-auto block"
          ></canvas>
          <div
            v-else
            class="w-full h-full flex flex-col items-center justify-center bg-slate-950/60 text-slate-500 font-mono text-[10px] gap-1"
          >
            <span>Page #{{ index + 1 }}</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, toRaw, watch, onMounted, onUnmounted, nextTick } from 'vue'
import {
  LayoutGrid,
  RotateCw,
  Copy,
  Trash2,
  Plus,
  FileDown,
  GripVertical,
  Crop
} from 'lucide-vue-next'
import { usePdfStore } from '../../stores/pdfStore'
import { extractPages } from '../../modules/page-editor'
import { triggerFileDownload } from '../../modules/exporter'

const emit = defineEmits<{
  (e: 'open-crop', pageIndex: number): void
  (e: 'confirm-delete', indices: number[]): void
}>()

const pdfStore = usePdfStore()
const canvasRefs = new Map<number, HTMLCanvasElement>()
const visibleThumbnails = ref<Set<number>>(new Set())
const dragOverIndex = ref<number | null>(null)
let draggedIndex: number | null = null
let thumbObserver: IntersectionObserver | null = null

function registerThumbCard(el: any, index: number) {
  if (el && thumbObserver) {
    (el as HTMLElement).dataset.thumbIndex = String(index)
    thumbObserver.observe(el as HTMLElement)
  }
}

function setCanvasRef(el: any, index: number) {
  if (el) {
    canvasRefs.set(index, el as HTMLCanvasElement)
    renderThumbnail(index, el as HTMLCanvasElement)
  }
}

async function renderThumbnail(pageIndex: number, canvas: HTMLCanvasElement) {
  const proxy = toRaw(pdfStore.activePdfProxy)
  if (!proxy) return
  if (pageIndex >= pdfStore.pageDimensions.length) return

  try {
    const page = await proxy.getPage(pageIndex + 1)
    const baseViewport = page.getViewport({ scale: 1.0 })
    
    // Scale for ~160px width thumbnail
    const thumbScale = 160 / Math.max(baseViewport.width, baseViewport.height)
    const viewport = page.getViewport({ scale: thumbScale })

    canvas.width = Math.floor(viewport.width)
    canvas.height = Math.floor(viewport.height)

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    await page.render({
      canvasContext: ctx,
      viewport
    }).promise
  } catch {
    // Ignore cancelled render
  }
}

function handlePageClick(index: number, e: MouseEvent) {
  pdfStore.currentPageIndex = index

  if (e.ctrlKey || e.metaKey) {
    if (pdfStore.selectedPageIndices.has(index)) {
      pdfStore.selectedPageIndices.delete(index)
    } else {
      pdfStore.selectedPageIndices.add(index)
    }
  } else if (e.shiftKey && pdfStore.selectedPageIndices.size > 0) {
    const lastSelected = Array.from(pdfStore.selectedPageIndices).pop() || 0
    const start = Math.min(lastSelected, index)
    const end = Math.max(lastSelected, index)
    for (let i = start; i <= end; i++) {
      pdfStore.selectedPageIndices.add(i)
    }
  } else {
    pdfStore.selectedPageIndices.clear()
    pdfStore.selectedPageIndices.add(index)
  }
}

// Drag & Drop
function handleDragStart(index: number, e: DragEvent) {
  draggedIndex = index
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }
}

function handleDragOver(index: number) {
  dragOverIndex.value = index
}

async function handleDrop(targetIndex: number) {
  if (draggedIndex === null || draggedIndex === targetIndex) {
    dragOverIndex.value = null
    draggedIndex = null
    return
  }

  const from = draggedIndex
  const to = targetIndex
  dragOverIndex.value = null
  draggedIndex = null

  await pdfStore.reorderPage(from, to)
}

function rotatePage(index: number, delta: number) {
  pdfStore.rotatePages([index], delta)
}

function rotateSelected(delta: number) {
  pdfStore.rotatePages(Array.from(pdfStore.selectedPageIndices), delta)
}

function duplicateSelected() {
  const [index] = Array.from(pdfStore.selectedPageIndices)
  if (index !== undefined) {
    pdfStore.duplicatePage(index)
  }
}

function insertBlankAtCurrent() {
  const at = pdfStore.currentPageIndex + 1
  pdfStore.insertBlankPage(at)
}

function confirmDeleteSelected() {
  emit('confirm-delete', Array.from(pdfStore.selectedPageIndices))
}

async function extractSelected() {
  if (!pdfStore.activePdfDoc || pdfStore.selectedPageIndices.size === 0) return
  const indices = Array.from(pdfStore.selectedPageIndices).sort((a, b) => a - b)
  const bytes = await extractPages(pdfStore.activePdfDoc, indices)
  triggerFileDownload(bytes, `extracted_pages_${indices.map(i => i + 1).join('-')}.pdf`)
}

onMounted(() => {
  thumbObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const idx = parseInt((entry.target as HTMLElement).dataset.thumbIndex || '-1', 10)
      if (idx >= 0 && entry.isIntersecting) {
        visibleThumbnails.value.add(idx)
        nextTick(() => {
          const canvas = canvasRefs.get(idx)
          if (canvas) renderThumbnail(idx, canvas)
        })
      }
    })
  }, { rootMargin: '300px 0px 300px 0px' })
})

onUnmounted(() => {
  if (thumbObserver) {
    thumbObserver.disconnect()
    thumbObserver = null
  }
})

// Re-render thumbnails when document updates or version increments
watch(() => [pdfStore.pageDimensions, pdfStore.documentVersion, pdfStore.activeDocumentId], async () => {
  await nextTick()
  visibleThumbnails.value.forEach(idx => {
    const canvas = canvasRefs.get(idx)
    if (canvas) renderThumbnail(idx, canvas)
  })
}, { deep: true })
</script>
