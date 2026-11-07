<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
    <div class="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 text-slate-200 shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div class="flex items-center gap-2 text-white font-semibold">
          <Crop class="w-5 h-5 text-emerald-400" />
          <span>Crop Page {{ targetPageIndex + 1 }}</span>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-white">
          <X class="w-5 h-5" />
        </button>
      </div>

      <p class="text-xs text-slate-400 mb-4">
        Specify margin insets or crop dimensions in PDF points (72 pt = 1 inch).
      </p>

      <div class="grid grid-cols-2 gap-3 text-xs mb-4">
        <div>
          <label class="block text-slate-400 mb-1">Left Inset (X)</label>
          <input
            v-model.number="cropBox.x"
            type="number"
            min="0"
            class="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white"
          />
        </div>
        <div>
          <label class="block text-slate-400 mb-1">Bottom Inset (Y)</label>
          <input
            v-model.number="cropBox.y"
            type="number"
            min="0"
            class="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white"
          />
        </div>
        <div>
          <label class="block text-slate-400 mb-1">Crop Width</label>
          <input
            v-model.number="cropBox.width"
            type="number"
            min="10"
            class="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white"
          />
        </div>
        <div>
          <label class="block text-slate-400 mb-1">Crop Height</label>
          <input
            v-model.number="cropBox.height"
            type="number"
            min="10"
            class="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white"
          />
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
          @click="applyCrop"
          class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium shadow-md"
        >
          Apply Crop
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Crop, X } from 'lucide-vue-next'
import { usePdfStore } from '../../stores/pdfStore'

const props = defineProps<{
  isOpen: boolean
  targetPageIndex: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const pdfStore = usePdfStore()

const cropBox = ref({
  x: 0,
  y: 0,
  width: 612,
  height: 792
})

watch(() => props.targetPageIndex, (idx) => {
  const dim = pdfStore.pageDimensions[idx] || { width: 612, height: 792 }
  cropBox.value = {
    x: 18,
    y: 18,
    width: Math.round(dim.width - 36),
    height: Math.round(dim.height - 36)
  }
}, { immediate: true })

async function applyCrop() {
  await pdfStore.cropPage(props.targetPageIndex, cropBox.value)
  emit('close')
}
</script>
