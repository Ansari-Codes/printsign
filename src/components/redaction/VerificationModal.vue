<template>
  <div v-if="isOpen && report" class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
    <div class="bg-slate-900 border border-slate-700 rounded-xl max-w-xl w-full p-6 text-slate-200 shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div class="flex items-center gap-3">
          <div :class="['p-2 rounded-lg border', report.passed ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400']">
            <CheckCircle2 v-if="report.passed" class="w-6 h-6" />
            <AlertOctagon v-else class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-white">
              {{ report.passed ? 'Redaction Verification Passed' : 'Redaction Leak Detected' }}
            </h3>
            <p class="text-xs text-slate-400">
              Audit executed across PDF text streams and raw byte sequences.
            </p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Verification Metrics -->
      <div class="grid grid-cols-2 gap-3 mb-4 text-xs">
        <div class="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span class="text-slate-400 block mb-1">PDF.js Text Extraction:</span>
          <span :class="['font-semibold text-sm flex items-center gap-1.5', report.textExtractionClean ? 'text-emerald-400' : 'text-rose-400']">
            <span class="w-2 h-2 rounded-full" :class="report.textExtractionClean ? 'bg-emerald-400' : 'bg-rose-400'"></span>
            {{ report.textExtractionClean ? '100% Clean (0 Matches)' : 'Failed (Residual Text)' }}
          </span>
        </div>

        <div class="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span class="text-slate-400 block mb-1">Raw Binary Byte Scan:</span>
          <span :class="['font-semibold text-sm flex items-center gap-1.5', report.rawByteScanClean ? 'text-emerald-400' : 'text-rose-400']">
            <span class="w-2 h-2 rounded-full" :class="report.rawByteScanClean ? 'bg-emerald-400' : 'bg-rose-400'"></span>
            {{ report.rawByteScanClean ? '100% Clean (0 Bytes Found)' : 'Failed (Byte Sequence Found)' }}
          </span>
        </div>
      </div>

      <!-- Orphan GC Report -->
      <div v-if="gcStats" class="p-3 bg-slate-800/40 border border-slate-700/60 rounded-lg text-xs mb-4 text-slate-300">
        <div class="font-semibold text-white mb-1 flex items-center justify-between">
          <span>Orphan Object Garbage Collector:</span>
          <span class="text-emerald-400 font-mono">{{ gcStats.purgedObjectCount }} Objects Purged</span>
        </div>
        <p class="text-slate-400 text-[11px]">
          All unreferenced streams, old page dictionaries, and font streams have been severed and purged from the document object graph.
        </p>
      </div>

      <!-- Audited Findings Table -->
      <div v-if="report.findings.length > 0" class="mb-4">
        <h4 class="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Audited Search Terms</h4>
        <div class="max-h-36 overflow-y-auto space-y-1.5 border border-slate-800 rounded-lg p-2 bg-slate-950 text-xs">
          <div
            v-for="item in report.findings"
            :key="item.term"
            class="flex items-center justify-between py-1 px-2 rounded bg-slate-900 border border-slate-800"
          >
            <span class="font-mono text-slate-200 truncate max-w-[200px]">"{{ item.term }}"</span>
            <div class="flex items-center gap-3 text-[11px]">
              <span :class="item.foundInText ? 'text-rose-400' : 'text-emerald-400'">
                Text: {{ item.foundInText ? 'FOUND' : 'Purged' }}
              </span>
              <span :class="item.foundInRawBytes ? 'text-rose-400' : 'text-emerald-400'">
                Bytes: {{ item.foundInRawBytes ? 'FOUND' : 'Purged' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end pt-2">
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition text-xs shadow-md"
        >
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle2, AlertOctagon, X } from 'lucide-vue-next'
import type { VerificationReport } from '../../modules/verification/canary'
import type { GCStats } from '../../modules/redactor/gc'

defineProps<{
  isOpen: boolean
  report: VerificationReport | null
  gcStats: GCStats | null
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>
