<template>
  <header class="bg-[#0b101d] border-b border-slate-800/80 select-none backdrop-blur-md relative z-30">
    <!-- Top Bar -->
    <div class="px-4 py-2.5 flex items-center justify-between gap-4">
      <!-- Brand & File Operations -->
      <div class="flex items-center gap-3">
        <div
          class="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition"
          @click="$emit('open-website')"
          title="Return to website & knowledge base"
        >
          <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-cyan-500/25">
            <ShieldCheck class="w-5 h-5" />
          </div>
          <div>
            <span class="text-sm font-bold text-white tracking-tight leading-none block">PrintSign</span>
            <span class="text-[10px] font-semibold bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent tracking-wide">
              100% Client-Side
            </span>
          </div>
        </div>

        <div class="h-5 w-px bg-slate-800 mx-1"></div>

        <!-- Open File Button -->
        <label class="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-medium rounded-xl border border-slate-700/80 hover:border-cyan-500/40 transition shadow-xs">
          <FolderOpen class="w-4 h-4 text-cyan-400" />
          <span>Open PDF</span>
          <input
            type="file"
            accept="application/pdf"
            multiple
            class="hidden"
            @change="handleFileInput"
          />
        </label>

        <!-- Merge File Button -->
        <button
          v-if="pdfStore.activeDocument"
          @click="$emit('open-merge')"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-medium rounded-xl border border-slate-700/80 hover:border-indigo-500/40 transition shadow-xs"
          title="Merge other PDFs into current document"
        >
          <PlusCircle class="w-4 h-4 text-indigo-400" />
          <span>Merge</span>
        </button>

        <!-- Split File Button -->
        <button
          v-if="pdfStore.activeDocument"
          @click="$emit('open-split')"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-medium rounded-xl border border-slate-700/80 hover:border-purple-500/40 transition shadow-xs"
          title="Split document by page ranges"
        >
          <Split class="w-4 h-4 text-purple-400" />
          <span>Split</span>
        </button>
      </div>

      <!-- Workspace Mode Switcher -->
      <nav v-if="pdfStore.activeDocument" class="flex items-center bg-slate-950/80 p-1 rounded-2xl border border-slate-800/80 shadow-inner">
        <button
          @click="pdfStore.activeWorkspaceTab = 'view'"
          :class="[
            'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all',
            pdfStore.activeWorkspaceTab === 'view'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-400 hover:text-slate-200'
          ]"
        >
          <FileText class="w-3.5 h-3.5" />
          <span>Pages & View</span>
        </button>

        <button
          @click="pdfStore.activeWorkspaceTab = 'redact'"
          :class="[
            'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all',
            pdfStore.activeWorkspaceTab === 'redact'
              ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-500/25'
              : 'text-slate-400 hover:text-slate-200'
          ]"
        >
          <Eraser class="w-3.5 h-3.5" />
          <span>Redaction</span>
          <span v-if="redactionStore.totalBoxesCount > 0" class="px-1.5 py-0.2 rounded-full bg-white text-[10px] text-rose-600 font-bold shadow-xs">
            {{ redactionStore.totalBoxesCount }}
          </span>
        </button>

        <button
          @click="pdfStore.activeWorkspaceTab = 'edit'"
          :class="[
            'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all',
            pdfStore.activeWorkspaceTab === 'edit'
              ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-md shadow-cyan-500/25'
              : 'text-slate-400 hover:text-slate-200'
          ]"
        >
          <Type class="w-3.5 h-3.5" />
          <span>Edit Content</span>
          <span v-if="contentStore.totalPendingCount > 0" class="px-1.5 py-0.2 rounded-full bg-white text-[10px] text-cyan-700 font-bold shadow-xs">
            {{ contentStore.totalPendingCount }}
          </span>
        </button>

        <button
          @click="pdfStore.activeWorkspaceTab = 'metadata'"
          :class="[
            'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all',
            pdfStore.activeWorkspaceTab === 'metadata'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/25'
              : 'text-slate-400 hover:text-slate-200'
          ]"
        >
          <Tag class="w-3.5 h-3.5" />
          <span>Metadata</span>
        </button>

        <button
          @click="pdfStore.activeWorkspaceTab = 'rasterize'"
          :class="[
            'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all',
            pdfStore.activeWorkspaceTab === 'rasterize'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/25'
              : 'text-slate-400 hover:text-slate-200'
          ]"
        >
          <Image class="w-3.5 h-3.5" />
          <span>Rasterize</span>
        </button>
      </nav>

      <!-- History & Export Actions -->
      <div class="flex items-center gap-2">
        <!-- Undo / Redo -->
        <div v-if="pdfStore.activeDocument" class="flex items-center bg-slate-900 rounded-xl p-0.5 border border-slate-800">
          <button
            @click="pdfStore.handleUndo"
            :disabled="!historyStore.canUndo"
            class="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 rounded-lg hover:bg-slate-800 transition"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 class="w-4 h-4" />
          </button>
          <button
            @click="pdfStore.handleRedo"
            :disabled="!historyStore.canRedo"
            class="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 rounded-lg hover:bg-slate-800 transition"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 class="w-4 h-4" />
          </button>
        </div>

        <!-- Return to Website Button -->
        <button
          @click="$emit('open-website')"
          class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium rounded-xl border border-slate-700/80 transition"
          title="Return to website homepage & knowledge base"
        >
          <Globe class="w-3.5 h-3.5 text-cyan-400" />
          <span>Site & Guides</span>
        </button>

        <!-- GitHub Repository Button -->
        <a
          href="https://github.com/Ansari-Codes/printsign"
          target="_blank"
          rel="noopener noreferrer"
          class="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium rounded-xl border border-slate-700/80 hover:border-slate-600 transition"
          title="View source on GitHub"
          aria-label="GitHub Repository"
        >
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          <span>GitHub</span>
        </a>

        <!-- Export Button -->
        <button
          v-if="pdfStore.activeDocument"
          @click="$emit('open-export')"
          class="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-500/20 active:scale-98 transition-all"
        >
          <Download class="w-4 h-4" />
          <span>Save / Export</span>
        </button>
      </div>
    </div>

    <!-- Document Tabs Bar (Isolated per file) -->
    <div v-if="pdfStore.documents.length > 0" class="flex items-center gap-1.5 px-4 border-t border-slate-800/80 overflow-x-auto py-1.5 bg-[#080d18]">
      <div
        v-for="doc in pdfStore.documents"
        :key="doc.id"
        @click="pdfStore.switchTab(doc.id)"
        :class="[
          'group flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition border max-w-xs relative overflow-hidden',
          doc.id === pdfStore.activeDocumentId
            ? 'bg-slate-850 text-white border-slate-700 shadow-md shadow-black/40 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-cyan-400 after:via-blue-500 after:to-indigo-500'
            : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border-transparent hover:border-slate-800/80'
        ]"
      >
        <span v-if="doc.isDirty" class="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/80 shrink-0" title="Unsaved changes"></span>
        <span class="truncate">{{ doc.name }}</span>
        <span class="text-[10px] text-slate-500 shrink-0 font-mono">({{ doc.pageCount }}p)</span>
        <button
          @click.stop="pdfStore.closeTab(doc.id)"
          class="p-0.5 text-slate-500 hover:text-rose-400 rounded transition opacity-60 group-hover:opacity-100"
          title="Close tab"
        >
          <X class="w-3 h-3" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import {
  ShieldCheck,
  FolderOpen,
  PlusCircle,
  Split,
  FileText,
  Eraser,
  Tag,
  Image,
  Undo2,
  Redo2,
  Download,
  X,
  Globe,
  Type
} from 'lucide-vue-next'
import { usePdfStore } from '../../stores/pdfStore'
import { useRedactionStore } from '../../stores/redactionStore'
import { useHistoryStore } from '../../stores/historyStore'
import { useContentEditorStore } from '../../stores/contentEditorStore'

defineEmits<{
  (e: 'open-export'): void
  (e: 'open-merge'): void
  (e: 'open-split'): void
  (e: 'open-website'): void
}>()

const pdfStore = usePdfStore()
const redactionStore = useRedactionStore()
const historyStore = useHistoryStore()
const contentStore = useContentEditorStore()

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
