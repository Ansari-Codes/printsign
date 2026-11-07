<template>
  <div class="w-80 bg-slate-950 border-l border-slate-800 flex flex-col shrink-0 select-none text-slate-300">
    <!-- Header -->
    <div class="p-4 border-b border-slate-800 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="p-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg">
          <Image class="w-4 h-4" />
        </div>
        <div>
          <h2 class="text-sm font-bold text-white">Rasterization & Flattening</h2>
          <span class="text-[10px] text-slate-400">Pure Image Export & Vector Removal</span>
        </div>
      </div>
    </div>

    <!-- Scrollable Controls -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
      <!-- DPI Selection & Live Pixel Preview -->
      <div>
        <label class="block text-xs font-semibold text-white mb-2">Resolution (DPI)</label>
        <div class="grid grid-cols-4 gap-1.5">
          <button
            v-for="dpiOpt in [72, 150, 300, 600]"
            :key="dpiOpt"
            @click="selectedDpi = dpiOpt"
            :class="[
              'py-1.5 rounded-lg border font-mono text-center transition',
              selectedDpi === dpiOpt
                ? 'bg-amber-500/10 border-amber-500 text-white font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            ]"
          >
            {{ dpiOpt }}
          </button>
        </div>

        <!-- Live Dimensions Preview Box -->
        <div class="mt-2.5 p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex items-center justify-between font-mono">
          <span class="text-slate-400 text-[11px]">Output Canvas:</span>
          <span class="text-emerald-400 font-bold text-xs">{{ previewWidth }} × {{ previewHeight }} px</span>
        </div>
      </div>

      <!-- Format Selection -->
      <div>
        <label class="block text-xs font-semibold text-white mb-2">Image Format</label>
        <div class="grid grid-cols-3 gap-1.5">
          <button
            v-for="fmt in (['png', 'jpeg', 'webp'] as ImageFormat[])"
            :key="fmt"
            @click="selectedFormat = fmt"
            :class="[
              'py-1.5 rounded-lg border font-mono uppercase text-center transition text-[11px]',
              selectedFormat === fmt
                ? 'bg-amber-500/10 border-amber-500 text-white font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            ]"
          >
            {{ fmt }}
          </button>
        </div>
      </div>

      <!-- Quality Slider (JPEG & WebP) -->
      <div v-if="selectedFormat !== 'png'">
        <div class="flex items-center justify-between mb-1">
          <span class="text-slate-400">Compression Quality:</span>
          <span class="font-mono text-white">{{ Math.round(quality * 100) }}%</span>
        </div>
        <input
          v-model.number="quality"
          type="range"
          min="0.4"
          max="1.0"
          step="0.05"
          class="w-full accent-amber-500"
        />
      </div>

      <!-- Page Scope Selection -->
      <div>
        <label class="block text-xs font-semibold text-white mb-2">Pages to Process</label>
        <div class="space-y-1.5">
          <label class="flex items-center gap-2 cursor-pointer p-2 rounded bg-slate-900 border border-slate-800">
            <input
              v-model="pageScope"
              type="radio"
              value="all"
              class="text-amber-500 focus:ring-amber-500 bg-slate-950"
            />
            <span>All Pages ({{ pdfStore.activeDocument?.pageCount || 0 }})</span>
          </label>

          <label class="flex items-center gap-2 cursor-pointer p-2 rounded bg-slate-900 border border-slate-800">
            <input
              v-model="pageScope"
              type="radio"
              value="selected"
              class="text-amber-500 focus:ring-amber-500 bg-slate-950"
            />
            <span>Selected Pages Only ({{ pdfStore.selectedPageIndices.size }})</span>
          </label>
        </div>
      </div>

      <!-- Progress status if working -->
      <div v-if="isProcessing" class="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-center font-mono text-[11px]">
        {{ progressMessage }}
      </div>
    </div>

    <!-- Actions -->
    <div class="p-4 border-t border-slate-800 bg-slate-950 space-y-2">
      <!-- Download Images as ZIP -->
      <button
        @click="handleExportImagesZip"
        :disabled="isProcessing"
        class="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-semibold rounded-xl transition text-xs shadow-lg flex items-center justify-center gap-2"
      >
        <Archive class="w-4 h-4" />
        <span>Export Images (.ZIP)</span>
      </button>

      <!-- Flatten to Image-Only PDF -->
      <button
        @click="handleFlattenPdf"
        :disabled="isProcessing"
        class="w-full py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-semibold rounded-xl border border-slate-700 transition text-xs flex items-center justify-center gap-2"
        title="Converts every page to a pure image page inside a new PDF"
      >
        <Layers class="w-4 h-4 text-emerald-400" />
        <span>Flatten to Image-Only PDF</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Image, Archive, Layers } from 'lucide-vue-next'
import { usePdfStore } from '../../stores/pdfStore'
import {
  type ImageFormat,
  calculateDpiDimensions,
  rasterizePdfPages,
  createZipFromImages,
  flattenPdfToImageOnly
} from '../../modules/rasterizer'
import { triggerFileDownload } from '../../modules/exporter'

const pdfStore = usePdfStore()

const selectedDpi = ref<number>(150)
const selectedFormat = ref<ImageFormat>('png')
const quality = ref<number>(0.9)
const pageScope = ref<'all' | 'selected'>('all')

const isProcessing = ref(false)
const progressMessage = ref('')

const activeDim = computed(() => {
  return pdfStore.pageDimensions[pdfStore.currentPageIndex] || { width: 612, height: 792 }
})

const previewWidth = computed(() => {
  return calculateDpiDimensions(activeDim.value.width, activeDim.value.height, selectedDpi.value).width
})

const previewHeight = computed(() => {
  return calculateDpiDimensions(activeDim.value.height, activeDim.value.height, selectedDpi.value).height
})

async function handleExportImagesZip() {
  if (!pdfStore.activeDocument) return

  isProcessing.value = true
  progressMessage.value = 'Rasterizing pages...'

  try {
    const indices = pageScope.value === 'selected'
      ? Array.from(pdfStore.selectedPageIndices).sort((a, b) => a - b)
      : undefined

    const images = await rasterizePdfPages(
      pdfStore.activeDocument.bytes,
      {
        dpi: selectedDpi.value,
        format: selectedFormat.value,
        quality: quality.value,
        pageIndices: indices,
        onProgress: (c, t) => {
          progressMessage.value = `Rasterizing page ${c} of ${t}...`
        }
      },
      pdfStore.activeDocument.name.replace(/\.pdf$/i, '')
    )

    progressMessage.value = 'Compressing into ZIP...'
    const zipBytes = createZipFromImages(images)
    triggerFileDownload(
      zipBytes,
      `${pdfStore.activeDocument.name.replace(/\.pdf$/i, '')}_rasterized_${selectedDpi.value}dpi.zip`,
      'application/zip'
    )
  } finally {
    isProcessing.value = false
    progressMessage.value = ''
  }
}

async function handleFlattenPdf() {
  if (!pdfStore.activeDocument) return

  isProcessing.value = true
  progressMessage.value = 'Flattening document to pure image pages...'

  try {
    const flattenedBytes = await flattenPdfToImageOnly(
      pdfStore.activeDocument.bytes,
      selectedDpi.value,
      (c, t) => {
        progressMessage.value = `Flattening page ${c} of ${t}...`
      }
    )

    triggerFileDownload(
      flattenedBytes,
      `${pdfStore.activeDocument.name.replace(/\.pdf$/i, '')}_flattened.pdf`
    )
  } finally {
    isProcessing.value = false
    progressMessage.value = ''
  }
}
</script>
