<template>
  <footer class="bg-slate-900 border-t border-slate-800 px-4 py-1.5 flex items-center justify-between text-xs text-slate-400 select-none">
    <!-- Left: Page status & doc info -->
    <div class="flex items-center gap-3">
      <span v-if="pdfStore.activeDocument">
        Page <strong class="text-white">{{ pdfStore.currentPageIndex + 1 }}</strong> of <strong class="text-white">{{ pdfStore.activeDocument.pageCount }}</strong>
      </span>

      <span v-if="pdfStore.activeDocument" class="text-slate-600">|</span>

      <span v-if="pdfStore.activeDocument">
        Size: <span class="text-slate-300 font-mono">{{ formatFileSize(pdfStore.activeDocument.bytes.length) }}</span>
      </span>

      <span v-if="pdfStore.activeDocument?.pdfVersion" class="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
        PDF {{ pdfStore.activeDocument.pdfVersion }}
      </span>

      <!-- Digital Signature Warning Badge -->
      <span
        v-if="pdfStore.hasSignatures"
        class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px]"
        title="This PDF has digital signatures. Editing will invalidate the signature."
      >
        <AlertTriangle class="w-3.5 h-3.5" />
        Signed Document
      </span>
    </div>

    <!-- Center: View Mode (Continuous vs Single) -->
    <div v-if="pdfStore.activeDocument" class="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800">
      <button
        @click="pdfStore.viewMode = 'continuous'"
        :class="[
          'px-2 py-0.5 rounded text-[11px] font-medium transition',
          pdfStore.viewMode === 'continuous' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
        ]"
      >
        Continuous
      </button>
      <button
        @click="pdfStore.viewMode = 'single'"
        :class="[
          'px-2 py-0.5 rounded text-[11px] font-medium transition',
          pdfStore.viewMode === 'single' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
        ]"
      >
        Single Page
      </button>
    </div>

    <!-- Right: Zoom Controls -->
    <div v-if="pdfStore.activeDocument" class="flex items-center gap-2">
      <button
        @click="setFitMode('fit-width')"
        :class="[
          'px-2 py-0.5 rounded text-[11px] font-medium transition',
          pdfStore.fitMode === 'fit-width' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
        ]"
        title="Fit Page Width"
      >
        Fit Width
      </button>

      <button
        @click="setFitMode('fit-page')"
        :class="[
          'px-2 py-0.5 rounded text-[11px] font-medium transition',
          pdfStore.fitMode === 'fit-page' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
        ]"
        title="Fit Full Page"
      >
        Fit Page
      </button>

      <div class="h-4 w-px bg-slate-800 mx-1"></div>

      <button
        @click="zoomOut"
        class="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
        title="Zoom Out (Ctrl+-)"
      >
        <Minus class="w-3.5 h-3.5" />
      </button>

      <span class="w-12 text-center font-mono text-slate-200 text-xs">
        {{ Math.round(pdfStore.zoom * 100) }}%
      </span>

      <button
        @click="zoomIn"
        class="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
        title="Zoom In (Ctrl+=)"
      >
        <Plus class="w-3.5 h-3.5" />
      </button>

      <button
        @click="resetZoom"
        class="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition ml-1"
        title="Reset Zoom to 100% (Ctrl+0)"
      >
        <RotateCcw class="w-3.5 h-3.5" />
      </button>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { AlertTriangle, Minus, Plus, RotateCcw } from 'lucide-vue-next'
import { usePdfStore, type FitMode } from '../../stores/pdfStore'
import { formatFileSize } from '../../modules/exporter'

const pdfStore = usePdfStore()

function zoomIn() {
  pdfStore.fitMode = 'custom'
  pdfStore.zoom = Math.min(3.0, Number((pdfStore.zoom + 0.15).toFixed(2)))
}

function zoomOut() {
  pdfStore.fitMode = 'custom'
  pdfStore.zoom = Math.max(0.3, Number((pdfStore.zoom - 0.15).toFixed(2)))
}

function resetZoom() {
  pdfStore.fitMode = 'custom'
  pdfStore.zoom = 1.0
}

function setFitMode(mode: FitMode) {
  pdfStore.fitMode = mode
}
</script>
