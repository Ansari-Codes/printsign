<template>
  <section id="features" class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <!-- Section Header -->
    <div class="text-center max-w-3xl mx-auto mb-16">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-4">
        <span>ENGINEERING EXCELLENCE</span>
      </div>
      <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
        Everything You Need to Edit, Sanitize & Redact PDFs
      </h2>
      <p class="text-base text-slate-400 leading-relaxed">
        Engineered specifically for legal teams, healthcare professionals, journalists, and privacy-conscious organizations requiring strict data confidentiality.
      </p>
    </div>

    <!-- Features Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      <!-- Feature 1: True Redaction -->
      <div class="bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 border border-slate-700/80 rounded-3xl p-7 flex flex-col justify-between hover:border-cyan-500/50 transition-all duration-300 group shadow-xl">
        <div>
          <div class="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Eraser class="w-6 h-6" />
          </div>
          <span class="text-xs font-bold uppercase tracking-wider text-rose-400">Security Guarantee</span>
          <h3 class="text-xl font-bold text-white mt-1 mb-3">Permanent Byte-Level Redaction</h3>
          <p class="text-sm text-slate-300 leading-relaxed mb-4">
            Drawing black rectangles in Acrobat leaves underlying text searchable in the content stream. Our engine rasterizes pages at 300 DPI, burns in black pixels, embeds a clean image, and runs an indirect object Garbage Collector to purge unreferenced data.
          </p>
          <ul class="space-y-2 text-xs text-slate-400 mb-6">
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verified against raw byte-sequence canary scans</span>
            </li>
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Search-and-redact batch automation</span>
            </li>
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant post-redaction verification audit modal</span>
            </li>
          </ul>
        </div>
        <button
          @click="$emit('open-redact-guide')"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition"
        >
          <span>Why visual masking fails</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Feature 2: Page Geometry & Organization -->
      <div class="bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 border border-slate-700/80 rounded-3xl p-7 flex flex-col justify-between hover:border-blue-500/50 transition-all duration-300 group shadow-xl">
        <div>
          <div class="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Layers class="w-6 h-6" />
          </div>
          <span class="text-xs font-bold uppercase tracking-wider text-blue-400">Complete Flexibility</span>
          <h3 class="text-xl font-bold text-white mt-1 mb-3">Page Operations & Reorganization</h3>
          <p class="text-sm text-slate-300 leading-relaxed mb-4">
            Full structural control over your documents without needing Adobe Acrobat Pro subscriptions. Drag thumbnails to reorder, rotate pages clockwise, delete unwanted pages, insert blank sheets, or duplicate.
          </p>
          <ul class="space-y-2 text-xs text-slate-400 mb-6">
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Interactive visual crop box editor per page</span>
            </li>
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Multi-page range extraction (e.g., 1-3, 5, 8-10)</span>
            </li>
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Split by ranges into client-side ZIP archive</span>
            </li>
          </ul>
        </div>
        <button
          @click="$emit('navigate', 'editor')"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
        >
          <span>Try page tools in editor</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Feature 3: Metadata & XMP Scrubbing -->
      <div class="bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 border border-slate-700/80 rounded-3xl p-7 flex flex-col justify-between hover:border-cyan-500/50 transition-all duration-300 group shadow-xl">
        <div>
          <div class="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <FileSpreadsheet class="w-6 h-6" />
          </div>
          <span class="text-xs font-bold uppercase tracking-wider text-cyan-400">Anti-Forensics</span>
          <h3 class="text-xl font-bold text-white mt-1 mb-3">Metadata & XMP Packet Scrubber</h3>
          <p class="text-sm text-slate-300 leading-relaxed mb-4">
            PDFs secretly store author names, company names, original file paths, printer identifiers, software serials, and timestamps in both the Document Info Dictionary and raw XML XMP packets.
          </p>
          <ul class="space-y-2 text-xs text-slate-400 mb-6">
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>One-click "Scrub All Metadata" sanitization</span>
            </li>
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Live editor for Title, Author, Subject & Keywords</span>
            </li>
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Raw XMP XML stream viewer and editor</span>
            </li>
          </ul>
        </div>
        <button
          @click="$emit('open-metadata-guide')"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
        >
          <span>Read metadata risk guide</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Feature 4: High-DPI Rasterizer -->
      <div class="bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 border border-slate-700/80 rounded-3xl p-7 flex flex-col justify-between hover:border-indigo-500/50 transition-all duration-300 group shadow-xl">
        <div>
          <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Image class="w-6 h-6" />
          </div>
          <span class="text-xs font-bold uppercase tracking-wider text-indigo-400">High Resolution</span>
          <h3 class="text-xl font-bold text-white mt-1 mb-3">72–600 DPI Rasterizer & Flattening</h3>
          <p class="text-sm text-slate-300 leading-relaxed mb-4">
            Render crisp images from any PDF page for print, archival, or web publishing. Flatten entire documents into image-only PDFs that strip selectable text, forms, scripts, and embedded links.
          </p>
          <ul class="space-y-2 text-xs text-slate-400 mb-6">
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>PNG, JPEG (custom quality), and WebP formats</span>
            </li>
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Live DPI-to-pixel dimensions calculator</span>
            </li>
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Download individual images or all pages in a client-side ZIP</span>
            </li>
          </ul>
        </div>
        <button
          @click="$emit('navigate', 'editor')"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
        >
          <span>Launch rasterizer</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Feature 5: Multi-File Merging & Isolated Tabs -->
      <div class="bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 border border-slate-700/80 rounded-3xl p-7 flex flex-col justify-between hover:border-purple-500/50 transition-all duration-300 group shadow-xl">
        <div>
          <div class="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <CopyCheck class="w-6 h-6" />
          </div>
          <span class="text-xs font-bold uppercase tracking-wider text-purple-400">Multi-Tasking</span>
          <h3 class="text-xl font-bold text-white mt-1 mb-3">Multi-Tab Isolation & Merging</h3>
          <p class="text-sm text-slate-300 leading-relaxed mb-4">
            Open multiple PDF files in parallel tabs. Unlike other tools that cross-contaminate state, each document maintains its own isolated Undo/Redo stack, redaction stage, and rendering cache.
          </p>
          <ul class="space-y-2 text-xs text-slate-400 mb-6">
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Combine and merge multiple local PDFs seamlessly</span>
            </li>
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Per-document history isolating Ctrl+Z rollbacks</span>
            </li>
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Auto-save session state locally in IndexedDB</span>
            </li>
          </ul>
        </div>
        <button
          @click="$emit('navigate', 'editor')"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition"
        >
          <span>Open multiple files</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Feature 6: Zero-Telemetry Offline PWA -->
      <div class="bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 border border-slate-700/80 rounded-3xl p-7 flex flex-col justify-between hover:border-emerald-500/50 transition-all duration-300 group shadow-xl">
        <div>
          <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <ShieldCheck class="w-6 h-6" />
          </div>
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Offline Independence</span>
          <h3 class="text-xl font-bold text-white mt-1 mb-3">Zero Telemetry & Full PWA Support</h3>
          <p class="text-sm text-slate-300 leading-relaxed mb-4">
            Zero third-party analytics, zero cookies, zero font CDNs, zero tracking pixels. Built as an offline-first Progressive Web App: all Web Workers, WebAssembly modules, fonts, and assets are locally cached.
          </p>
          <ul class="space-y-2 text-xs text-slate-400 mb-6">
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Works on air-gapped computers without internet</span>
            </li>
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Installable on Windows, macOS, Linux, Android, iOS</span>
            </li>
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Strict Content Security Policy & Zero-Exfiltration</span>
            </li>
          </ul>
        </div>
        <button
          @click="$emit('navigate', 'architecture')"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
        >
          <span>Inspect architecture</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  Eraser,
  Layers,
  FileSpreadsheet,
  Image,
  CopyCheck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-vue-next'

defineEmits<{
  (e: 'navigate', view: string): void
  (e: 'open-redact-guide'): void
  (e: 'open-metadata-guide'): void
}>()
</script>
