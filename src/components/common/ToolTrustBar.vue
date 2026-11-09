<template>
  <nav
    aria-label="Breadcrumb and Architecture Verification"
    class="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-slate-800/80 text-xs"
  >
    <!-- Visual Breadcrumbs -->
    <ol class="flex items-center gap-1.5 text-slate-400 overflow-x-auto whitespace-nowrap">
      <li>
        <router-link to="/" class="hover:text-cyan-400 transition flex items-center gap-1">
          <Home class="w-3.5 h-3.5" />
          <span>Home</span>
        </router-link>
      </li>
      <li class="flex items-center text-slate-600">
        <ChevronRight class="w-3.5 h-3.5" />
      </li>
      <li>
        <router-link
          :to="categoryRoute"
          class="hover:text-cyan-400 transition"
        >
          {{ categoryName }}
        </router-link>
      </li>
      <li class="flex items-center text-slate-600">
        <ChevronRight class="w-3.5 h-3.5" />
      </li>
      <li class="font-semibold text-cyan-400 truncate max-w-[200px] sm:max-w-none" aria-current="page">
        {{ currentToolName }}
      </li>
    </ol>

    <!-- Technical Trust Bar Pill -->
    <router-link
      to="/f12-network-audit"
      class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 hover:bg-slate-850 border border-emerald-500/30 hover:border-emerald-500/60 text-slate-300 hover:text-white transition group shadow-sm select-none shrink-0"
      title="Click to view live 0-network telemetry benchmark"
    >
      <span class="relative flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span class="text-[11px] font-mono">
        <span class="text-slate-400 hidden xs:inline sm:inline">Engine: </span><span class="text-emerald-400 font-semibold">WebAssembly RAM</span>
        <span class="text-slate-600 mx-1.5">•</span>
        <span class="text-slate-400">Net: </span><span class="text-emerald-400 font-semibold">0</span>
        <span class="text-slate-600 mx-1.5">•</span>
        <span class="text-cyan-400 group-hover:underline">Verify F12 →</span>
      </span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Home, ChevronRight } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    toolName?: string
    category?: string
    categoryLink?: string
  }>(),
  {
    toolName: '',
    category: '',
    categoryLink: ''
  }
)

const route = useRoute()

const routeNameMap: Record<string, { name: string; category: string; link: string }> = {
  '/redact-pdf': { name: 'Permanent Redactor', category: 'Document Tools', link: '/editor' },
  '/verify-redaction': { name: 'Redaction Verifier', category: 'Document Tools', link: '/editor' },
  '/scrub-pdf-metadata': { name: 'Metadata Scrubber', category: 'Document Tools', link: '/editor' },
  '/merge-pdf': { name: 'Merge PDF', category: 'Document Tools', link: '/editor' },
  '/split-pdf': { name: 'Split PDF', category: 'Document Tools', link: '/editor' },
  '/flatten-rasterize-pdf': { name: 'Rasterizer & Flattener', category: 'Document Tools', link: '/editor' },
  '/reorder-rotate-pdf': { name: 'Reorder & Rotate', category: 'Document Tools', link: '/editor' },
  '/compress-pdf': { name: 'Compress PDF', category: 'Document Tools', link: '/editor' },
  '/f12-network-audit': { name: 'F12 Network Audit', category: 'Security & Audit', link: '/security-architecture' },
  '/for-lawyers': { name: 'PDF Tools for Lawyers', category: 'Industry Solutions', link: '/for-lawyers' },
  '/for-healthcare': { name: 'PDF Tools for Healthcare', category: 'Industry Solutions', link: '/for-healthcare' },
  '/for-journalists': { name: 'PDF Tools for Journalists', category: 'Industry Solutions', link: '/for-journalists' },
  '/ilovepdf-smallpdf-offline-alternative': { name: 'Cloud vs Offline Comparison', category: 'Compliance', link: '/ilovepdf-smallpdf-offline-alternative' },
  '/hipaa-compliant-pdf-redaction': { name: 'HIPAA Redaction', category: 'Compliance', link: '/hipaa-compliant-pdf-redaction' },
  '/nist-800-88-pdf-sanitization': { name: 'NIST SP 800-88 Sanitization', category: 'Compliance', link: '/nist-800-88-pdf-sanitization' },
  '/editor': { name: 'PDF Editor', category: 'Document Tools', link: '/editor' }
}

const currentConfig = computed(() => {
  const path = route.path.replace(/\/$/, '') || '/'
  return routeNameMap[path] || { name: 'PDF Tool', category: 'Document Tools', link: '/editor' }
})

const currentToolName = computed(() => props.toolName || currentConfig.value.name)
const categoryName = computed(() => props.category || currentConfig.value.category)
const categoryRoute = computed(() => props.categoryLink || currentConfig.value.link)
</script>
