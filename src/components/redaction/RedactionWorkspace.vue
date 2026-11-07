<template>
  <div class="w-84 bg-[#0a0f1c] border-l border-slate-800/80 flex flex-col shrink-0 select-none text-slate-300">
    <!-- Header -->
    <div class="p-4 border-b border-slate-800/80 flex items-center justify-between bg-[#090d18]">
      <div class="flex items-center gap-2.5">
        <div class="p-2 bg-gradient-to-tr from-rose-500/20 via-pink-500/20 to-red-500/20 border border-rose-500/40 text-rose-400 rounded-xl shadow-sm shadow-rose-500/20">
          <Eraser class="w-4 h-4" />
        </div>
        <div>
          <h2 class="text-sm font-bold text-white tracking-tight">Redaction Workspace</h2>
          <span class="text-[10px] font-medium bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
            Pixel Burn & Object GC Purge
          </span>
        </div>
      </div>
    </div>

    <!-- Scrollable Controls -->
    <div class="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
      <!-- Instruction Card -->
      <div class="p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-2xl text-slate-300 leading-relaxed space-y-1 shadow-inner">
        <p class="font-semibold text-white flex items-center gap-1.5 text-xs">
          <Crosshair class="w-3.5 h-3.5 text-rose-400" />
          Click & Drag on Page to Draw
        </p>
        <p class="text-[11px] text-slate-400">
          Boxes snap onto exact page coordinates. Or use <strong>Search & Redact</strong> below to batch-select keyword occurrences.
        </p>
      </div>

      <!-- Redaction Box Presets -->
      <div>
        <label class="block text-xs font-semibold text-white mb-2">Overlay Style</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            @click="redactionStore.activePreset = 'solid'"
            :class="[
              'p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-17',
              redactionStore.activePreset === 'solid'
                ? 'bg-rose-500/15 border-rose-500 text-white shadow-md shadow-rose-500/15 ring-1 ring-rose-500/60'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            ]"
          >
            <div class="w-full h-3 bg-black rounded-xs mb-1 border border-slate-700"></div>
            <span class="text-[11px] font-semibold">Solid Black</span>
          </button>

          <button
            @click="redactionStore.activePreset = 'redacted_text'"
            :class="[
              'p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-17',
              redactionStore.activePreset === 'redacted_text'
                ? 'bg-rose-500/15 border-rose-500 text-white shadow-md shadow-rose-500/15 ring-1 ring-rose-500/60'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            ]"
          >
            <div class="w-full h-3 bg-black text-[7px] text-rose-300 font-bold flex items-center justify-center rounded-xs mb-1 border border-rose-900">
              REDACTED
            </div>
            <span class="text-[11px] font-semibold">"REDACTED" Text</span>
          </button>
        </div>
      </div>

      <!-- Search & Redact Section -->
      <div class="space-y-2 pt-2 border-t border-slate-800/80">
        <label class="block text-xs font-semibold text-white">Search & Batch Redact</label>
        <div class="flex gap-1.5">
          <input
            v-model="searchInput"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Search text to redact..."
            class="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-rose-400 focus:ring-1 focus:ring-rose-400/40 transition shadow-inner"
          />
          <button
            @click="handleSearch"
            :disabled="redactionStore.isSearching || !searchInput.trim()"
            class="px-3.5 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-medium rounded-xl disabled:opacity-30 transition shadow-md shadow-rose-500/20"
          >
            <Search class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Search Results List -->
        <div v-if="redactionStore.searchResults.length > 0" class="mt-2.5 p-3 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2.5 shadow-lg">
          <div class="flex items-center justify-between text-[11px]">
            <span class="font-medium text-slate-200">
              Found <strong class="text-rose-400">{{ redactionStore.searchResults.length }}</strong> match(es)
            </span>
            <div class="flex gap-2 text-xs">
              <button @click="redactionStore.selectAllMatches" class="text-rose-400 hover:underline font-medium">All</button>
              <button @click="redactionStore.deselectAllMatches" class="text-slate-400 hover:underline">None</button>
            </div>
          </div>

          <div class="max-h-36 overflow-y-auto space-y-1 pr-1">
            <label
              v-for="match in redactionStore.searchResults"
              :key="match.id"
              class="flex items-center gap-2 p-1.5 rounded-lg bg-slate-950/70 hover:bg-slate-950 text-[11px] cursor-pointer border border-transparent hover:border-slate-800"
            >
              <input
                type="checkbox"
                :checked="redactionStore.selectedMatchIds.has(match.id)"
                @change="redactionStore.toggleMatchSelection(match.id)"
                class="rounded border-slate-700 text-rose-500 focus:ring-rose-500 bg-slate-900"
              />
              <span class="text-slate-400 font-mono text-[10px]">P.{{ match.pageIndex + 1 }}</span>
              <span class="font-mono text-white truncate max-w-[150px]">"{{ match.text }}"</span>
            </label>
          </div>

          <button
            @click="redactionStore.applySelectedMatchesAsBoxes"
            :disabled="redactionStore.selectedMatchIds.size === 0"
            class="w-full py-2 bg-gradient-to-r from-rose-500/20 via-pink-500/20 to-rose-500/20 hover:from-rose-500/30 hover:to-pink-500/30 border border-rose-500/40 text-rose-200 rounded-xl font-semibold text-xs transition disabled:opacity-40 shadow-xs"
          >
            Add {{ redactionStore.selectedMatchIds.size }} as Redactions
          </button>
        </div>
      </div>

      <!-- Pending Redactions Queue -->
      <div class="pt-2 border-t border-slate-800/80">
        <div class="flex items-center justify-between mb-2">
          <span class="font-semibold text-white">Pending Boxes ({{ redactionStore.totalBoxesCount }})</span>
          <button
            v-if="redactionStore.totalBoxesCount > 0"
            @click="redactionStore.clearBoxes"
            class="text-[11px] text-rose-400 hover:underline font-medium"
          >
            Clear All
          </button>
        </div>

        <div v-if="redactionStore.totalBoxesCount === 0" class="text-center py-4 text-slate-500 text-[11px]">
          No redaction boxes placed on this file.
        </div>

        <div v-else class="max-h-40 overflow-y-auto space-y-1.5 pr-1">
          <div
            v-for="box in redactionStore.boxes"
            :key="box.id"
            class="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px]"
          >
            <div class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/80"></span>
              <span class="font-mono text-slate-300 font-medium">P.{{ box.pageIndex + 1 }}</span>
              <span v-if="box.textMatch" class="text-slate-400 truncate max-w-[110px]">"{{ box.textMatch }}"</span>
              <span v-else class="text-slate-500 font-mono">[{{ box.width }}×{{ box.height }}]</span>
            </div>
            <button
              @click="redactionStore.removeBox(box.id)"
              class="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Pipeline Execution Settings -->
      <div class="pt-2 border-t border-slate-800/80 space-y-3">
        <label class="flex items-start gap-2.5 cursor-pointer">
          <input
            v-model="redactionStore.scrubMetadataDefault"
            type="checkbox"
            class="mt-0.5 rounded border-slate-700 text-rose-500 bg-slate-900"
          />
          <span class="text-[11px] text-slate-300">
            <strong>Auto-scrub Document Metadata</strong> (clears Title, Author, Dates, and XMP packets)
          </span>
        </label>

        <div>
          <div class="flex items-center justify-between text-[11px] mb-1">
            <span class="text-slate-400">Raster Burn Resolution:</span>
            <span class="font-mono text-cyan-400 font-bold">{{ redactionStore.redactionDpi }} DPI</span>
          </div>
          <input
            v-model.number="redactionStore.redactionDpi"
            type="range"
            min="150"
            max="300"
            step="25"
            class="w-full accent-cyan-500"
          />
        </div>
      </div>
    </div>

    <!-- Apply Redactions Bottom Action -->
    <div class="p-4 border-t border-slate-800/80 bg-[#090d18]">
      <button
        @click="showConfirm = true"
        :disabled="redactionStore.totalBoxesCount === 0 || redactionStore.isApplying"
        class="w-full py-3 bg-gradient-to-r from-rose-500 via-pink-600 to-red-600 hover:from-rose-400 hover:via-pink-500 hover:to-red-500 disabled:opacity-40 text-white font-semibold rounded-2xl transition-all text-xs shadow-xl shadow-rose-500/25 active:scale-98 flex items-center justify-center gap-2"
      >
        <Eraser class="w-4 h-4" />
        <span>{{ redactionStore.isApplying ? redactionStore.progressStatus : `Apply ${redactionStore.totalBoxesCount} Redactions & Purge` }}</span>
      </button>
    </div>

    <!-- Confirmation Dialog -->
    <ConfirmModal
      :is-open="showConfirm"
      title="Apply Permanent Redactions?"
      message="This action permanently burns black redaction boxes into page pixel buffers and runs orphan object garbage collection. The underlying text on affected pages will be completely unrecoverable."
      details="Affected pages will be converted to high-fidelity images. Unaffected pages will keep standard text and vectors."
      confirm-text="Apply & Purge"
      :is-destructive="true"
      @confirm="executeApply"
      @cancel="showConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Eraser, Crosshair, Search, Trash2 } from 'lucide-vue-next'
import { usePdfStore } from '../../stores/pdfStore'
import { useRedactionStore } from '../../stores/redactionStore'
import ConfirmModal from '../common/ConfirmModal.vue'

const pdfStore = usePdfStore()
const redactionStore = useRedactionStore()

const searchInput = ref('')
const showConfirm = ref(false)

async function handleSearch() {
  if (!pdfStore.activeDocument || !searchInput.value.trim()) return
  await redactionStore.executeSearch(searchInput.value, pdfStore.activeDocument.bytes)
}

async function executeApply() {
  showConfirm.value = false
  await redactionStore.applyAllRedactions()
}
</script>
