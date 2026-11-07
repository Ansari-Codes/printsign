<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
    <div class="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 text-slate-200 shadow-2xl">
      <div class="flex items-start gap-3 mb-4">
        <div :class="['p-2 rounded-lg border', isDestructive ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400']">
          <AlertTriangle class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
          <p class="text-sm text-slate-400 mt-1">{{ message }}</p>
        </div>
      </div>

      <div v-if="details" class="mb-4 p-3 bg-slate-800/60 border border-slate-700/60 rounded-lg text-xs text-slate-300 font-mono">
        {{ details }}
      </div>

      <div class="flex items-center justify-end gap-3 mt-6">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition text-sm"
        >
          {{ cancelText || 'Cancel' }}
        </button>
        <button
          @click="$emit('confirm')"
          :class="[
            'px-4 py-2 font-medium rounded-lg transition text-sm shadow-md',
            isDestructive
              ? 'bg-rose-600 hover:bg-rose-500 text-white'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          ]"
        >
          {{ confirmText || 'Confirm' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
  title: string
  message: string
  details?: string
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
}>()

defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>
