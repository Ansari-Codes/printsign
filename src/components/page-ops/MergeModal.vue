<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
    <div class="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 text-slate-200 shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div class="flex items-center gap-2 text-white font-semibold">
          <PlusCircle class="w-5 h-5 text-sky-400" />
          <span>Merge PDFs into Active Document</span>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-white">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="space-y-3 text-xs mb-4">
        <label class="cursor-pointer block p-4 border-2 border-dashed border-slate-700 hover:border-sky-500 rounded-xl text-center bg-slate-950/60 transition">
          <FolderPlus class="w-6 h-6 text-sky-400 mx-auto mb-1.5" />
          <span class="text-white font-medium block">Select PDF files to append</span>
          <span class="text-[11px] text-slate-500">Hold Ctrl/Cmd to select multiple files</span>
          <input
            type="file"
            accept="application/pdf"
            multiple
            class="hidden"
            @change="handleSelectFiles"
          />
        </label>

        <!-- Staged files list -->
        <div v-if="stagedFiles.length > 0" class="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          <div
            v-for="(f, i) in stagedFiles"
            :key="i"
            class="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 text-[11px]"
          >
            <div class="flex items-center gap-2 truncate">
              <span class="font-mono text-slate-500">#{{ i + 1 }}</span>
              <span class="truncate text-slate-200">{{ f.name }}</span>
            </div>
            <button
              @click="removeFile(i)"
              class="text-slate-500 hover:text-rose-400 p-0.5"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
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
          @click="executeMerge"
          :disabled="stagedFiles.length === 0 || isMerging"
          class="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white rounded text-xs font-medium shadow-md"
        >
          {{ isMerging ? 'Merging...' : `Append ${stagedFiles.length} File(s)` }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PlusCircle, FolderPlus, Trash2, X } from 'lucide-vue-next'
import { usePdfStore } from '../../stores/pdfStore'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const pdfStore = usePdfStore()

const stagedFiles = ref<Array<{ name: string; bytes: Uint8Array }>>([])
const isMerging = ref(false)

async function handleSelectFiles(e: Event) {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  for (let i = 0; i < target.files.length; i++) {
    const file = target.files[i]
    const buffer = await file.arrayBuffer()
    stagedFiles.value.push({
      name: file.name,
      bytes: new Uint8Array(buffer)
    })
  }

  target.value = ''
}

function removeFile(index: number) {
  stagedFiles.value.splice(index, 1)
}

async function executeMerge() {
  if (stagedFiles.value.length === 0) return

  isMerging.value = true
  try {
    await pdfStore.mergeFiles(stagedFiles.value)
    stagedFiles.value = []
    emit('close')
  } finally {
    isMerging.value = false
  }
}
</script>
