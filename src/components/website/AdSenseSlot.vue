<template>
  <aside
    class="my-8 mx-auto w-full max-w-5xl px-4 flex flex-col items-center justify-center select-none"
    aria-label="Advertisement Container"
  >
    <div class="w-full text-center mb-1">
      <span class="text-[10px] tracking-widest uppercase font-semibold text-slate-300">
        ADVERTISEMENT
      </span>
    </div>

    <!-- Ad Unit Wrapper -->
    <div
      :class="[
        'w-full rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 backdrop-blur-md flex flex-col items-center justify-center p-4 relative overflow-hidden transition-all',
        formatClasses
      ]"
    >
      <!-- Subtle Neon Edge Accent -->
      <div class="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>

      <!-- Live AdSense ins tag placeholder (ready for publisher client & slot ID) -->
      <!-- In production, when adsbygoogle script is loaded, this tag hydrates automatically -->
      <ins
        class="adsbygoogle block w-full text-center"
        :style="{ display: 'block', minHeight: minHeightPx + 'px' }"
        :data-ad-client="adClient || 'ca-pub-XXXXXXXXXXXXXXXX'"
        :data-ad-slot="adSlot || '0000000000'"
        :data-ad-format="format || 'auto'"
        data-full-width-responsive="true"
      >
        <!-- Fallback / Preview UI when publisher script is offline or in client-side sandbox -->
        <div class="w-full h-full min-h-[90px] flex flex-col items-center justify-center py-4 text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-400 text-xs font-medium mb-1.5">
            <span class="w-2 h-2 rounded-full bg-cyan-400/80 animate-pulse"></span>
            <span>AdSense Responsive Placement</span>
            <span class="text-slate-400">•</span>
            <span class="text-[11px] text-cyan-300 font-mono">{{ slotName || 'Leaderboard / Banner' }}</span>
          </div>
          <p class="text-xs text-slate-300 max-w-md">
            {{ description || 'Reserved high-visibility Google AdSense unit. Verified 100% non-intrusive, privacy-respecting, and fully responsive across devices.' }}
          </p>
        </div>
      </ins>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    slotName?: string
    adClient?: string
    adSlot?: string
    format?: 'auto' | 'horizontal' | 'rectangle' | 'vertical'
    minHeight?: number
    description?: string
  }>(),
  {
    slotName: 'Display Unit',
    adClient: '',
    adSlot: '',
    format: 'auto',
    minHeight: 100,
    description: ''
  }
)

const minHeightPx = computed(() => props.minHeight)

const formatClasses = computed(() => {
  switch (props.format) {
    case 'horizontal':
      return 'min-h-[100px] max-w-4xl'
    case 'rectangle':
      return 'min-h-[250px] max-w-md'
    case 'vertical':
      return 'min-h-[400px] max-w-xs'
    default:
      return 'min-h-[110px]'
  }
})
</script>
