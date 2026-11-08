<template>
  <section
    v-if="content"
    class="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 text-left border-t border-slate-800/80 mt-12 select-text"
    aria-label="Technical Specifications & Document Security Information"
  >
    <!-- Section Header & Badge -->
    <header class="mb-8 text-center sm:text-left">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
        <ShieldCheck class="w-3.5 h-3.5" />
        <span>{{ content.badge }}</span>
      </div>
      <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">
        {{ content.heading }}
      </h2>
      <p class="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
        {{ content.subheading }}
      </p>
    </header>

    <!-- Key Technical Highlights Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      <div
        v-for="(item, idx) in content.highlights"
        :key="idx"
        class="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-slate-700 transition shadow-sm"
      >
        <div class="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 mb-3">
          <CheckCircle2 class="w-4 h-4" />
        </div>
        <h3 class="text-sm font-bold text-white mb-1.5">
          {{ item.title }}
        </h3>
        <p class="text-xs text-slate-400 leading-relaxed">
          {{ item.desc }}
        </p>
      </div>
    </div>

    <!-- Long-Form Semantic Content Sections -->
    <div class="space-y-8 text-slate-300 text-sm leading-relaxed">
      <article
        v-for="(sec, sIdx) in content.sections"
        :key="sIdx"
        class="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 sm:p-8"
      >
        <h3 class="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span class="w-1.5 h-5 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600"></span>
          <span>{{ sec.title }}</span>
        </h3>

        <div class="space-y-4">
          <p
            v-for="(para, pIdx) in sec.paragraphs"
            :key="pIdx"
            class="text-slate-300 leading-relaxed"
          >
            {{ para }}
          </p>
        </div>

        <!-- Optional Bullet Points -->
        <ul
          v-if="sec.bullets && sec.bullets.length > 0"
          class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 border-t border-slate-800/60"
        >
          <li
            v-for="(bullet, bIdx) in sec.bullets"
            :key="bIdx"
            class="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/40"
          >
            <Check class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{{ bullet }}</span>
          </li>
        </ul>
      </article>
    </div>

    <!-- Technical FAQ Section if available -->
    <div
      v-if="content.faq && content.faq.length > 0"
      class="mt-10 pt-8 border-t border-slate-800/80"
    >
      <h3 class="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2">
        <HelpCircle class="w-5 h-5 text-cyan-400" />
        <span>Technical Frequently Asked Questions</span>
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="(faq, fIdx) in content.faq"
          :key="fIdx"
          class="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-left"
        >
          <h4 class="text-sm font-semibold text-white mb-2">
            {{ faq.q }}
          </h4>
          <p class="text-xs text-slate-400 leading-relaxed">
            {{ faq.a }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ShieldCheck, CheckCircle2, Check, HelpCircle } from 'lucide-vue-next'
import { toolSeoContent, type ToolSeoContent } from '../../config/seoContent'

const props = defineProps<{
  routePath?: string
}>()

const route = useRoute()

const currentPath = computed(() => {
  if (props.routePath) return props.routePath
  const p = route?.path || '/editor'
  return p.endsWith('/') && p.length > 1 ? p.slice(0, -1) : p
})

const content = computed<ToolSeoContent | null>(() => {
  return toolSeoContent[currentPath.value] || toolSeoContent['/editor'] || null
})
</script>
