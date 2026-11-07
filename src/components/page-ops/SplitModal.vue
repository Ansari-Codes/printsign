<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
    <div class="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 text-slate-200 shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div class="flex items-center gap-2 text-white font-semibold">
          <Split class="w-5 h-5 text-purple-400" />
          <span>Split Document by Ranges</span>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-white">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="space-y-3 text-xs mb-4">
        <p class="text-slate-400">
          Specify page ranges separated by commas. For example: <code class="text-emerald-400">1-2, 3-5, 6-{{ totalPages }}</code>
        </p>

        <div>
          <label class="block text-slate-300 font-medium mb-1">Page Ranges</label>
          <input
            v-model="rangeInput"
            type="text"
            placeholder="1-2, 3-5"
            class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono text-sm focus:outline-hidden focus:border-purple-500"
          />
        </div>

        <div v-if="parsedRanges.length > 0" class="p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-slate-300 space-y-1">
          <div class="text-purple-400 font-semibold mb-1">Will generate {{ parsedRanges.length }} PDF file(s):</div>
          <div v-for="(r, i) in parsedRanges" :key="i" class="text-slate-400">
            Part {{ i + 1 }}: Pages {{ r.start }} to {{ r.end }} ({{ r.end - r.start + 1 }} pages)
          </div>
        </div>

        <div v-if="parseError" class="p-2 bg-rose-500/10 border border-rose-500/30 rounded text-rose-400 text-xs">
          {{ parseError }}
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium"
        >
          Cancel
        </button>
        <button
          @click="executeSplit"
          :disabled="parsedRanges.length === 0 || !!parseError || isSplitting"
          class="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded text-xs font-medium shadow-md flex items-center gap-1.5"
        >
          <Archive class="w-3.5 h-3.5" />
          <span>{{ isSplitting ? 'Splitting...' : 'Download as ZIP' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Split, X, Archive } from 'lucide-vue-next'
import { usePdfStore } from '../../stores/pdfStore'
import { splitPdfByRanges, type SplitRange } from '../../modules/page-editor'
import { triggerFileDownload } from '../../modules/exporter'
import { zipSync } from 'fflate'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const pdfStore = usePdfStore()
const rangeInput = ref('1-1')
const isSplitting = ref(false)

const totalPages = computed(() => pdfStore.activeDocument?.pageCount || 1)

const parsedRanges = computed<SplitRange[]>(() => {
  const input = rangeInput.value.trim()
  if (!input) return []

  const parts = input.split(',').map(p => p.trim()).filter(Boolean)
  const ranges: SplitRange[] = []

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map(s => s.trim())
      const start = parseInt(startStr, 10)
      const end = parseInt(endStr, 10)
      if (!isNaN(start) && !isNaN(end) && start >= 1 && end >= start && start <= totalPages.value) {
        ranges.push({ start, end: Math.min(end, totalPages.value) })
      }
    } else {
      const page = parseInt(part, 10)
      if (!isNaN(page) && page >= 1 && page <= totalPages.value) {
        ranges.push({ start: page, end: page })
      }
    }
  }

  return ranges
})

const parseError = computed(() => {
  if (!rangeInput.value.trim()) return 'Please enter page ranges'
  if (parsedRanges.value.length === 0) return 'Invalid range format. Use e.g. 1-2, 3-5'
  return ''
})

async function executeSplit() {
  if (!pdfStore.activePdfDoc || parsedRanges.value.length === 0) return

  isSplitting.value = true
  try {
    const baseName = (pdfStore.activeDocument?.name || 'document').replace(/\.pdf$/i, '')
    const splitResults = await splitPdfByRanges(pdfStore.activePdfDoc, parsedRanges.value, baseName)

    const zipFiles: Record<string, Uint8Array> = {}
    for (const res of splitResults) {
      zipFiles[res.name] = res.bytes
    }

    const zipBuffer = zipSync(zipFiles)
    triggerFileDownload(zipBuffer, `${baseName}_split.zip`, 'application/zip')
    emit('close')
  } finally {
    isSplitting.value = false
  }
}
</script>
