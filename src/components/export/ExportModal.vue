<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
    <div class="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 text-slate-200 shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div class="flex items-center gap-2 text-white font-semibold">
          <Download class="w-5 h-5 text-emerald-400" />
          <span>Save & Export Document</span>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-white">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Warnings Notice -->
      <div v-if="pdfStore.hasSignatures" class="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-xs flex items-start gap-2">
        <AlertTriangle class="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <strong>Digital Signature Invalidation Warning:</strong> This PDF contains a digital signature. Any edits (or re-saving) will invalidate cryptographic signatures.
        </div>
      </div>

      <!-- Mode Selector -->
      <div class="space-y-3 mb-5 text-xs">
        <label class="block text-slate-400 font-medium">Export Mode</label>

        <div
          @click="mode = 'standard'"
          :class="[
            'p-3 rounded-xl border cursor-pointer transition',
            mode === 'standard'
              ? 'bg-emerald-500/10 border-emerald-500'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
          ]"
        >
          <div class="flex items-center justify-between font-semibold text-white mb-1">
            <span class="flex items-center gap-2">
              <FileCheck class="w-4 h-4 text-emerald-400" />
              Standard PDF Export
            </span>
            <span class="text-[11px] text-emerald-400 font-mono">Recommended</span>
          </div>
          <p class="text-slate-400 text-[11px]">
            Preserves searchable text, vector graphics, and standard page layout. Any pages you redacted remain securely rasterized and purged.
          </p>
        </div>

        <div
          @click="mode = 'flattened'"
          :class="[
            'p-3 rounded-xl border cursor-pointer transition',
            mode === 'flattened'
              ? 'bg-emerald-500/10 border-emerald-500'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
          ]"
        >
          <div class="flex items-center justify-between font-semibold text-white mb-1">
            <span class="flex items-center gap-2">
              <Layers class="w-4 h-4 text-amber-400" />
              Flattened to Image-Only PDF
            </span>
            <span class="text-[11px] text-amber-400 font-mono">Maximum Security</span>
          </div>
          <p class="text-slate-400 text-[11px]">
            Converts <em>all</em> pages into high-resolution images. Completely strips all selectable text, forms, scripts, attachments, and vector layers across the whole file.
          </p>
        </div>

        <!-- Flatten DPI option if selected -->
        <div v-if="mode === 'flattened'" class="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
          <div class="flex items-center justify-between text-[11px]">
            <span class="text-slate-400">Flatten Resolution:</span>
            <span class="font-mono text-emerald-400">{{ flattenDpi }} DPI</span>
          </div>
          <input
            v-model.number="flattenDpi"
            type="range"
            min="150"
            max="300"
            step="25"
            class="w-full accent-emerald-500"
          />
        </div>
      </div>

      <!-- File details -->
      <div class="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs flex items-center justify-between mb-5">
        <span class="text-slate-400">Current in-memory size:</span>
        <span class="font-mono text-white">{{ formatFileSize(pdfStore.activeDocument?.bytes.length || 0) }}</span>
      </div>

      <!-- Progress status if exporting -->
      <div v-if="isExporting" class="mb-4 text-center text-xs font-mono text-emerald-400 animate-pulse">
        {{ progressText }}
      </div>

      <div class="flex justify-end gap-2">
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium"
        >
          Cancel
        </button>
        <button
          @click="executeExport"
          :disabled="isExporting"
          class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded text-xs font-semibold shadow-md flex items-center gap-1.5"
        >
          <Download class="w-4 h-4" />
          <span>{{ isExporting ? 'Exporting...' : 'Download PDF' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Download, X, AlertTriangle, FileCheck, Layers } from 'lucide-vue-next'
import { usePdfStore } from '../../stores/pdfStore'
import { preparePdfExport, triggerFileDownload, formatFileSize, type ExportMode } from '../../modules/exporter'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const pdfStore = usePdfStore()

const mode = ref<ExportMode>('standard')
const flattenDpi = ref<number>(200)
const isExporting = ref(false)
const progressText = ref('')

async function executeExport() {
  if (!pdfStore.activePdfDoc || !pdfStore.activeDocument) return

  isExporting.value = true
  progressText.value = 'Preparing export buffer...'

  try {
    const exportedBytes = await preparePdfExport(
      pdfStore.activePdfDoc,
      {
        mode: mode.value,
        flattenDpi: flattenDpi.value
      },
      (curr, tot) => {
        progressText.value = `Processing page ${curr} of ${tot}...`
      }
    )

    const baseName = pdfStore.activeDocument.name.replace(/\.pdf$/i, '')
    const fileName = mode.value === 'flattened'
      ? `${baseName}_flattened.pdf`
      : `${baseName}_edited.pdf`

    triggerFileDownload(exportedBytes, fileName, 'application/pdf')
    emit('close')
  } finally {
    isExporting.value = false
    progressText.value = ''
  }
}
</script>
