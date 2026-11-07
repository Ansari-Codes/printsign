<template>
  <div class="bg-[#080c16] border-b border-slate-800/80 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
    <div class="flex items-center gap-2.5">
      <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 text-cyan-300 font-medium border border-cyan-500/25 shadow-xs shadow-cyan-500/10">
        <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/80 animate-pulse"></span>
        100% Client-Side Privacy
      </span>
      <span class="text-slate-300">Your documents never leave this device. Zero servers, zero telemetry, zero exfiltration.</span>
    </div>

    <div class="flex items-center gap-4">
      <button
        @click="$emit('open-privacy')"
        class="text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-2 transition"
      >
        Architecture & Security Audit
      </button>

      <span v-if="isOffline" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400">
        <WifiOff class="w-3.5 h-3.5" />
        Offline Mode Active
      </span>
      <span v-else class="inline-flex items-center gap-1 text-slate-500">
        <Wifi class="w-3.5 h-3.5 text-cyan-400/80" />
        Offline-Ready PWA
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Wifi, WifiOff } from 'lucide-vue-next'

defineEmits<{
  (e: 'open-privacy'): void
}>()

const isOffline = ref(!navigator.onLine)

function handleOnline() {
  isOffline.value = false
}

function handleOffline() {
  isOffline.value = true
}

onMounted(() => {
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})
</script>
