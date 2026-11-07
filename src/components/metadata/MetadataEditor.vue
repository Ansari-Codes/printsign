<template>
  <div class="w-96 bg-slate-950 border-l border-slate-800 flex flex-col shrink-0 select-none text-slate-300">
    <!-- Header -->
    <div class="p-4 border-b border-slate-800 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="p-1.5 bg-sky-500/10 border border-sky-500/30 text-sky-400 rounded-lg">
          <Tag class="w-4 h-4" />
        </div>
        <div>
          <h2 class="text-sm font-bold text-white">Metadata & XMP Editor</h2>
          <span class="text-[10px] text-slate-400">Document Properties & Inspection</span>
        </div>
      </div>

      <button
        @click="handleScrub"
        class="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 rounded text-[11px] font-medium transition flex items-center gap-1"
        title="Scrub all metadata, author, and XMP info"
      >
        <Sparkles class="w-3 h-3" />
        <span>Scrub All</span>
      </button>
    </div>

    <!-- Scrollable Form -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
      <!-- Document Properties Stats -->
      <div class="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1.5">
        <div class="flex justify-between">
          <span class="text-slate-400">Total Pages:</span>
          <span class="font-mono text-white">{{ pdfStore.activeDocument?.pageCount || 0 }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">PDF Format:</span>
          <span class="font-mono text-white">v{{ pdfStore.activeDocument?.pdfVersion || '1.7' }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">File Size:</span>
          <span class="font-mono text-white">{{ formatFileSize(pdfStore.activeDocument?.bytes.length || 0) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">Encrypted:</span>
          <span class="font-mono" :class="pdfStore.activeDocument?.isEncrypted ? 'text-amber-400' : 'text-slate-300'">
            {{ pdfStore.activeDocument?.isEncrypted ? 'Yes (Decrypted in Memory)' : 'No' }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">Digital Signatures:</span>
          <span class="font-mono" :class="pdfStore.hasSignatures ? 'text-amber-400' : 'text-slate-300'">
            {{ pdfStore.hasSignatures ? 'Detected (Will be dropped on edit)' : 'None' }}
          </span>
        </div>
      </div>

      <!-- Info Dictionary Fields -->
      <div class="space-y-3">
        <div>
          <label class="block text-slate-400 mb-1">Title</label>
          <input
            v-model="form.title"
            type="text"
            class="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white focus:outline-hidden focus:border-sky-500"
          />
        </div>

        <div>
          <label class="block text-slate-400 mb-1">Author</label>
          <input
            v-model="form.author"
            type="text"
            class="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white focus:outline-hidden focus:border-sky-500"
          />
        </div>

        <div>
          <label class="block text-slate-400 mb-1">Subject</label>
          <input
            v-model="form.subject"
            type="text"
            class="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white focus:outline-hidden focus:border-sky-500"
          />
        </div>

        <div>
          <label class="block text-slate-400 mb-1">Keywords (semicolon separated)</label>
          <input
            v-model="keywordsString"
            type="text"
            placeholder="confidential; legal; report"
            class="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white focus:outline-hidden focus:border-sky-500"
          />
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-slate-400 mb-1">Creator</label>
            <input
              v-model="form.creator"
              type="text"
              class="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white focus:outline-hidden focus:border-sky-500"
            />
          </div>
          <div>
            <label class="block text-slate-400 mb-1">Producer</label>
            <input
              v-model="form.producer"
              type="text"
              class="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white focus:outline-hidden focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      <!-- XMP Packet XML Editor -->
      <div class="space-y-1.5 pt-2 border-t border-slate-800">
        <div class="flex items-center justify-between">
          <label class="block text-slate-400 font-semibold">Raw XMP Metadata (XML)</label>
          <span class="text-[10px] text-slate-500">{{ form.xmpXml ? 'Present' : 'Not Present' }}</span>
        </div>
        <textarea
          v-model="form.xmpXml"
          rows="5"
          placeholder="No raw XMP packet in document."
          class="w-full bg-slate-900 border border-slate-800 rounded p-2 text-[10px] font-mono text-slate-300 focus:outline-hidden focus:border-sky-500"
        ></textarea>
      </div>
    </div>

    <!-- Save Metadata Button -->
    <div class="p-4 border-t border-slate-800 bg-slate-950">
      <button
        @click="handleSave"
        class="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl transition text-xs shadow-lg"
      >
        Save Metadata Changes
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Tag, Sparkles } from 'lucide-vue-next'
import { usePdfStore } from '../../stores/pdfStore'
import { readMetadata, writeMetadata, scrubMetadata, type DocumentMetadata } from '../../modules/metadata'
import { formatFileSize } from '../../modules/exporter'

const pdfStore = usePdfStore()

const form = ref<DocumentMetadata>({
  title: '',
  author: '',
  subject: '',
  keywords: [],
  creator: '',
  producer: '',
  creationDate: null,
  modificationDate: null,
  xmpXml: null
})

const keywordsString = ref('')

function loadCurrentMetadata() {
  if (pdfStore.activePdfDoc) {
    const meta = readMetadata(pdfStore.activePdfDoc)
    form.value = meta
    keywordsString.value = meta.keywords.join('; ')
  }
}

onMounted(() => {
  loadCurrentMetadata()
})

watch(() => pdfStore.activeDocument?.bytes, () => {
  loadCurrentMetadata()
})

async function handleSave() {
  if (!pdfStore.activePdfDoc) return

  pdfStore.recordHistorySnapshot('Edit Metadata')
  form.value.keywords = keywordsString.value.split(';').map(k => k.trim()).filter(Boolean)
  form.value.modificationDate = new Date()

  writeMetadata(pdfStore.activePdfDoc, form.value)
  const savedBytes = await pdfStore.activePdfDoc.save()
  await pdfStore.updateActiveDocumentBytes(savedBytes, true)
}

async function handleScrub() {
  if (!pdfStore.activePdfDoc) return

  pdfStore.recordHistorySnapshot('Scrub All Metadata')
  scrubMetadata(pdfStore.activePdfDoc)

  form.value = {
    title: '',
    author: '',
    subject: '',
    keywords: [],
    creator: '',
    producer: '',
    creationDate: null,
    modificationDate: null,
    xmpXml: null
  }
  keywordsString.value = ''

  const savedBytes = await pdfStore.activePdfDoc.save()
  await pdfStore.updateActiveDocumentBytes(savedBytes, true)
}
</script>
