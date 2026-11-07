<template>
  <section class="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
    <!-- Background Ambient Glow -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-indigo-500/10 blur-3xl pointer-events-none rounded-full"></div>

    <!-- Security & Compliance Badges -->
    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-lg shadow-black/40 text-xs font-medium text-slate-300 mb-8 backdrop-blur-md">
      <span class="flex h-2 w-2 relative">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
      </span>
      <span class="text-slate-300">Zero Cloud Uploads</span>
      <span class="text-slate-600">•</span>
      <span class="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-semibold">100% In-Browser Sandbox</span>
      <span class="text-slate-600">•</span>
      <span class="text-slate-400">Offline PWA</span>
    </div>

    <!-- Main Headline -->
    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-4xl leading-[1.15] mb-6">
      Edit, Split & <span class="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">Permanently Redact</span> PDFs. Never Leaves Your Device.
    </h1>

    <!-- Subtitle -->
    <p class="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mb-10">
      Stop uploading sensitive contracts, bank statements, and tax documents to third-party cloud converters. PrintSign runs 100% client-side with Mozilla PDF.js, PDF-Lib, and Web Workers.
    </p>

    <!-- Interactive Hero PDF Dropzone -->
    <div
      class="w-full max-w-2xl bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-[#0b101d]/95 border-2 border-dashed border-slate-700 hover:border-cyan-500/60 transition-all duration-300 rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center shadow-2xl relative group backdrop-blur-xl"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="{ 'border-cyan-400 bg-cyan-950/20 shadow-cyan-500/10': isDragging }"
    >
      <!-- Top Neon Accent line -->
      <div class="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>

      <!-- Icon with glow -->
      <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/15 via-blue-500/15 to-indigo-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/10 mb-4 group-hover:scale-105 transition-transform duration-300">
        <FileUp class="w-8 h-8" />
      </div>

      <h2 class="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
        Drop your PDF document here
      </h2>
      <p class="text-sm text-slate-400 mb-6 max-w-md leading-relaxed">
        Drag and drop your file or browse from local storage. Instant client-side parsing without network latency.
      </p>

      <!-- Action Buttons Row -->
      <div class="flex flex-wrap items-center justify-center gap-3 w-full">
        <label class="cursor-pointer px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-semibold rounded-2xl transition-all shadow-xl shadow-cyan-500/25 active:scale-98 text-sm flex items-center gap-2.5">
          <FolderOpen class="w-4 h-4" />
          <span>Select PDF File</span>
          <input
            type="file"
            accept="application/pdf"
            multiple
            class="hidden"
            @change="handleFileInput"
          />
        </label>

        <button
          @click="loadSampleDocument"
          class="px-5 py-3 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 hover:text-white font-medium rounded-2xl transition text-sm flex items-center gap-2 shadow-sm"
          title="Load synthetic sample PDF to test redacting and editing right away"
        >
          <Sparkles class="w-4 h-4 text-cyan-400" />
          <span>Try Demo PDF</span>
        </button>
      </div>

      <!-- File specs note -->
      <div class="mt-6 flex items-center gap-4 text-xs text-slate-500">
        <span class="flex items-center gap-1">
          <Lock class="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted PDFs Supported</span>
        </span>
        <span>•</span>
        <span>Multi-Page & Range Split</span>
        <span>•</span>
        <span>Zero File Size Limits</span>
      </div>

      <!-- Autosave recovery banner if available in IndexedDB -->
      <div
        v-if="showRestorePrompt && savedDrafts.length > 0"
        class="mt-6 w-full p-4 bg-slate-950/90 border border-amber-500/30 rounded-2xl text-left shadow-lg"
      >
        <div class="flex items-center justify-between text-xs text-amber-300 font-semibold mb-1">
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            Recoverable Local Drafts Detected
          </span>
          <button @click="dismissAndClearDrafts" class="text-slate-400 hover:text-white transition">
            Dismiss
          </button>
        </div>
        <p class="text-xs text-slate-400 mb-3">
          Found {{ savedDrafts.length }} session draft(s) stored in your local browser IndexedDB.
        </p>
        <button
          @click="restoreAllDrafts"
          class="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
        >
          Restore Drafts to Editor
        </button>
      </div>
    </div>

    <!-- Trust / Feature Indicators Row -->
    <div class="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl text-left">
      <div class="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xs flex items-start gap-3">
        <div class="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <ShieldAlert class="w-5 h-5" />
        </div>
        <div>
          <h2 class="text-xs font-bold text-white tracking-tight">True Redaction</h2>
          <p class="text-[11px] text-slate-400 leading-normal">Orphan GC purges vector streams & canary bytes.</p>
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xs flex items-start gap-3">
        <div class="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Cpu class="w-5 h-5" />
        </div>
        <div>
          <h2 class="text-xs font-bold text-white tracking-tight">Zero Network</h2>
          <p class="text-[11px] text-slate-400 leading-normal">Audited: No HTTP calls, CDNs, or exfiltration.</p>
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xs flex items-start gap-3">
        <div class="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Layers class="w-5 h-5" />
        </div>
        <div>
          <h2 class="text-xs font-bold text-white tracking-tight">Full Page Ops</h2>
          <p class="text-[11px] text-slate-400 leading-normal">Reorder, delete, rotate, split, merge, crop.</p>
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xs flex items-start gap-3">
        <div class="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <HardDrive class="w-5 h-5" />
        </div>
        <div>
          <h2 class="text-xs font-bold text-white tracking-tight">Offline PWA</h2>
          <p class="text-[11px] text-slate-400 leading-normal">Precached assets work completely without WiFi.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  FileUp,
  FolderOpen,
  Sparkles,
  Lock,
  ShieldAlert,
  Cpu,
  Layers,
  HardDrive
} from 'lucide-vue-next'
import { usePdfStore } from '../../stores/pdfStore'
import { useAutosave } from '../../composables/useAutosave'
import { createSyntheticFixturePdf } from '../../../tests/fixtures/create-synthetic-pdf'

const emit = defineEmits<{
  (e: 'file-loaded'): void
}>()

const pdfStore = usePdfStore()
const {
  savedDrafts,
  showRestorePrompt,
  restoreAllDrafts,
  dismissAndClearDrafts
} = useAutosave()
const isDragging = ref(false)

async function handleFileInput(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  for (let i = 0; i < target.files.length; i++) {
    await pdfStore.loadDocument(target.files[i])
  }
  emit('file-loaded')
  target.value = ''
}

async function handleDrop(event: DragEvent) {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (!files || files.length === 0) return
  for (let i = 0; i < files.length; i++) {
    if (files[i].type === 'application/pdf' || files[i].name.toLowerCase().endsWith('.pdf')) {
      await pdfStore.loadDocument(files[i])
    }
  }
  emit('file-loaded')
}

async function loadSampleDocument() {
  const bytes = await createSyntheticFixturePdf()
  const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })
  const file = new File([blob], 'Confidential_Sample_Contract.pdf', { type: 'application/pdf' })
  await pdfStore.loadDocument(file)
  emit('file-loaded')
}
</script>
