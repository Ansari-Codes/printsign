<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
    <div class="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 text-slate-200 shadow-2xl overflow-y-auto max-h-[90vh]">
      <div class="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
            <ShieldCheck class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-white">100% Client-Side Privacy Guarantee</h2>
            <p class="text-xs text-slate-400">Zero backend. Zero telemetry. Zero network calls.</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          aria-label="Close"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="space-y-4 text-sm leading-relaxed text-slate-300">
        <section class="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
          <h3 class="font-medium text-emerald-400 mb-1 flex items-center gap-2">
            <Lock class="w-4 h-4" />
            Your Files Never Leave Your Device
          </h3>
          <p>
            Unlike conventional online PDF tools that upload your sensitive contracts, tax records, or medical files to remote cloud servers, this application executes <strong>100% in your local browser sandbox</strong>.
          </p>
        </section>

        <section class="space-y-2">
          <h3 class="font-medium text-white flex items-center gap-2">
            <Cpu class="w-4 h-4" />
            How It Works Architecturally
          </h3>
          <ul class="list-disc list-inside space-y-1 text-slate-400 pl-1">
            <li><strong>Rendering:</strong> Mozilla's PDF.js runs locally inside a dedicated Web Worker.</li>
            <li><strong>Editing & Export:</strong> Structural PDF modifications and image embedding are handled by <code>pdf-lib</code> in browser memory.</li>
            <li><strong>Storage & Autosave:</strong> Session state and drafts are stored strictly inside your browser's private <code>IndexedDB</code>.</li>
            <li><strong>Offline Service Worker:</strong> All assets, scripts, fonts, and workers are cached locally by a Workbox Service Worker. The application functions completely offline after the initial visit.</li>
          </ul>
        </section>

        <section class="space-y-2">
          <h3 class="font-medium text-white flex items-center gap-2">
            <FileWarning class="w-4 h-4" />
            True Redaction vs. "Fake Redaction"
          </h3>
          <p>
            Drawing a black rectangle in standard PDF software does <em>not</em> delete text; the underlying text characters remain fully searchable and extractable.
          </p>
          <p>
            Our redaction engine executes a <strong>Rasterize-Burn-and-Rebuild</strong> pipeline combined with an <strong>Orphan Indirect Object Garbage Collector</strong>. The affected page is permanently converted to pure pixels with burned-in black boxes, and the old content stream containing the sensitive text is unlinked and deleted from the PDF binary.
          </p>
        </section>

        <section class="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-amber-300 text-xs">
          <strong>Digital Signatures Notice:</strong> Modifying, rotating, or redacting any signed PDF necessarily invalidates existing cryptographic signatures. Always retain original copies of signed legal documents.
        </section>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition text-sm shadow-md"
        >
          Understood & Confirmed
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShieldCheck, X, Lock, Cpu, FileWarning } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>
