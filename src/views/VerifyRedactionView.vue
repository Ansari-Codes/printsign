<template>
  <div class="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans select-none">
    <!-- Website Navigation -->
    <SiteNavbar />

    <main class="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full select-text">
      <!-- Tool Hero Header -->
      <header class="text-center max-w-3xl mx-auto mb-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-4">
          <ShieldCheck class="w-3.5 h-3.5" />
          <span>ZERO-NETWORK IN-MEMORY INSPECTION • F12 VERIFIABLE</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
          Client-Side PDF Sanitization &amp; Redaction Verifier
        </h1>
        <p class="text-sm sm:text-base text-slate-400 leading-relaxed">
          Check if a redacted PDF still contains selectable text under boxes or hidden XMP metadata. 100% local browser inspection—no file upload.
        </p>
      </header>

      <!-- Dropzone Area (Shown when no report is active) -->
      <div
        v-if="!report && !isAuditing"
        class="mb-12 max-w-3xl mx-auto"
      >
        <div
          class="border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 cursor-pointer relative group"
          :class="[
            isDragging
              ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
              : 'border-slate-700/80 hover:border-cyan-500/50 bg-slate-900/40 hover:bg-slate-900/70'
          ]"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          @click="triggerFileInput"
        >
          <input
            ref="fileInputRef"
            type="file"
            accept="application/pdf"
            class="hidden"
            @change="handleFileInput"
          />

          <div class="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 mx-auto mb-5 group-hover:scale-105 transition-transform shadow-inner">
            <UploadCloud class="w-8 h-8" />
          </div>

          <h3 class="text-lg sm:text-xl font-bold text-white mb-2">
            Drop your redacted PDF here to audit
          </h3>
          <p class="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
            Drag and drop or click to browse. The PDF is analyzed directly in your browser's RAM memory using Web Workers.
          </p>

          <div class="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              class="px-5 py-2.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-md shadow-cyan-500/20 transition active:scale-98"
            >
              Select PDF File
            </button>
            <button
              type="button"
              class="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white font-medium rounded-xl text-xs transition"
              @click.stop="loadSyntheticTestDoc"
            >
              Test with Sample Document
            </button>
          </div>

          <!-- Zero-telemetry badge -->
          <div class="mt-6 pt-6 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Zero server uploads • Fully air-gapped compatible • Open F12 to inspect 0 network calls</span>
          </div>
        </div>

        <div v-if="errorMessage" class="mt-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle class="w-4 h-4 shrink-0" />
          <span>{{ errorMessage }}</span>
        </div>
      </div>

      <!-- Auditing Progress State -->
      <div
        v-if="isAuditing"
        class="mb-12 max-w-xl mx-auto p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 text-center"
      >
        <div class="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-4 animate-spin">
          <RefreshCw class="w-6 h-6" />
        </div>
        <h3 class="text-base font-bold text-white mb-2">
          Auditing PDF In Local Memory...
        </h3>
        <p class="text-xs text-slate-400 leading-relaxed">
          Extracting /Info dictionary keys, scanning raw XMP XML packets, and inspecting vector text content streams across all pages.
        </p>
      </div>

      <!-- Audit Report Card Section -->
      <div v-if="report && !isAuditing" class="mb-16 space-y-8">
        <!-- Top Status Bar Card -->
        <div
          class="rounded-3xl p-6 sm:p-8 border backdrop-blur-md shadow-xl transition-all"
          :class="[
            report.overallStatus === 'PASSED'
              ? 'bg-emerald-950/20 border-emerald-500/30'
              : 'bg-rose-950/20 border-rose-500/30'
          ]"
        >
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
            <div>
              <div class="flex items-center gap-2.5 mb-2">
                <span
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                  :class="[
                    report.overallStatus === 'PASSED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  ]"
                >
                  <component
                    :is="report.overallStatus === 'PASSED' ? ShieldCheck : ShieldAlert"
                    class="w-3.5 h-3.5"
                  />
                  <span>{{ report.statusBadge }}</span>
                </span>
                <span class="text-xs text-slate-400">{{ report.fileName }} ({{ formatBytes(report.fileSizeBytes) }})</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-bold text-white mb-1">
                {{ report.summaryHeadline }}
              </h2>
              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                {{ report.summaryDescription }}
              </p>
            </div>

            <!-- Action Button to re-audit -->
            <button
              type="button"
              class="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold transition"
              @click="resetAudit"
            >
              <RefreshCw class="w-3.5 h-3.5" />
              <span>Audit Another PDF</span>
            </button>
          </div>

          <!-- Quick Metrics Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span class="text-[11px] font-medium text-slate-400 block mb-1">Total Pages</span>
              <span class="text-2xl font-extrabold text-white">{{ report.totalPageCount }}</span>
            </div>
            <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span class="text-[11px] font-medium text-slate-400 block mb-1">Pure Raster Pages</span>
              <span
                class="text-2xl font-extrabold"
                :class="report.pureRasterPageCount === report.totalPageCount ? 'text-emerald-400' : 'text-amber-400'"
              >
                {{ report.pureRasterPageCount }} / {{ report.totalPageCount }}
              </span>
            </div>
            <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span class="text-[11px] font-medium text-slate-400 block mb-1">Selectable Text Items</span>
              <span
                class="text-2xl font-extrabold"
                :class="report.totalSelectableTextItems === 0 ? 'text-emerald-400' : 'text-rose-400'"
              >
                {{ report.totalSelectableTextItems }}
              </span>
            </div>
            <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span class="text-[11px] font-medium text-slate-400 block mb-1">Exposed Metadata Keys</span>
              <span
                class="text-2xl font-extrabold"
                :class="report.metadata.populatedCount === 0 ? 'text-emerald-400' : 'text-amber-400'"
              >
                {{ report.metadata.populatedCount }}
              </span>
            </div>
          </div>
        </div>

        <!-- Conversion CTAs (Direct Remediation Actions) -->
        <div v-if="report.recommendations.length > 0" class="space-y-4">
          <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle class="w-4 h-4 text-amber-400" />
            <span>Recommended Remediation Actions</span>
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="(rec, rIdx) in report.recommendations"
              :key="rIdx"
              class="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between gap-4 shadow-sm"
            >
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                    :class="[
                      rec.type === 'redact'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    ]"
                  >
                    {{ rec.type === 'redact' ? 'Critical Redaction Vulnerability' : 'Metadata Privacy Leak' }}
                  </span>
                </div>
                <h4 class="text-base font-bold text-white mb-1.5">
                  {{ rec.title }}
                </h4>
                <p class="text-xs text-slate-400 leading-relaxed">
                  {{ rec.description }}
                </p>
              </div>

              <router-link
                :to="rec.ctaRoute"
                class="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition active:scale-98"
              >
                <span>{{ rec.ctaText }}</span>
                <ArrowRight class="w-4 h-4" />
              </router-link>
            </div>
          </div>
        </div>

        <!-- Audit Tabs: Metadata vs Page-by-Page Breakdown -->
        <div class="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-8">
          <div class="flex items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="px-4 py-2 rounded-xl text-xs font-bold transition"
                :class="activeTab === 'metadata' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'"
                @click="activeTab = 'metadata'"
              >
                Info Dictionary &amp; XMP Streams ({{ report.metadata.populatedCount }})
              </button>
              <button
                type="button"
                class="px-4 py-2 rounded-xl text-xs font-bold transition"
                :class="activeTab === 'pages' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'"
                @click="activeTab = 'pages'"
              >
                Page-by-Page Text Layers ({{ report.totalPageCount }})
              </button>
            </div>

            <span class="hidden sm:inline-block text-[11px] text-slate-400">
              Audited in local RAM
            </span>
          </div>

          <!-- Tab 1: Metadata Audit Table -->
          <div v-if="activeTab === 'metadata'" class="space-y-6">
            <!-- XMP Stream Notice -->
            <div
              class="p-4 rounded-2xl border flex items-start gap-3"
              :class="[
                report.metadata.hasXmpStream
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
              ]"
            >
              <component
                :is="report.metadata.hasXmpStream ? AlertTriangle : CheckCircle2"
                class="w-5 h-5 shrink-0 mt-0.5"
              />
              <div class="flex-1 text-xs">
                <strong class="font-bold block mb-0.5">
                  {{ report.metadata.hasXmpStream ? 'Raw XMP XML Metadata Stream Detected' : 'No Raw XMP XML Stream Detected' }}
                </strong>
                <p class="leading-relaxed opacity-90">
                  {{
                    report.metadata.hasXmpStream
                      ? `Found ${report.metadata.xmpSizeBytes} bytes of embedded XMP XML data in the document catalog. XMP streams frequently contain Photoshop histories, camera EXIF, and corporate usernames.`
                      : 'The document catalog contains no unscrubbed XMP XML metadata streams.'
                  }}
                </p>
                <div v-if="report.metadata.hasXmpStream && report.metadata.rawXmpSnippet" class="mt-3">
                  <button
                    type="button"
                    class="text-[11px] underline hover:text-white"
                    @click="showRawXmp = !showRawXmp"
                  >
                    {{ showRawXmp ? 'Hide Raw XMP Stream Snippet' : 'View Raw XMP Stream Snippet' }}
                  </button>
                  <pre
                    v-if="showRawXmp"
                    class="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-300 overflow-x-auto font-mono max-h-48"
                  >{{ report.metadata.rawXmpSnippet }}</pre>
                </div>
              </div>
            </div>

            <!-- Standard Info Dictionary Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-slate-800 text-slate-400 font-semibold">
                    <th class="py-3 px-4">Info Key</th>
                    <th class="py-3 px-4">Detected Value</th>
                    <th class="py-3 px-4">Status</th>
                    <th class="py-3 px-4">Forensic Risk Explanation</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                  <tr
                    v-for="item in report.metadata.infoItems"
                    :key="item.key"
                    class="hover:bg-slate-800/30 transition"
                  >
                    <td class="py-3 px-4 font-mono font-semibold text-white whitespace-nowrap">
                      {{ item.key }}
                      <span class="block text-[10px] font-sans text-slate-400 font-normal">{{ item.label }}</span>
                    </td>
                    <td class="py-3 px-4 max-w-xs break-words">
                      <span v-if="item.value" class="text-slate-200 font-medium">{{ item.value }}</span>
                      <span v-else class="text-slate-500 italic">None (Scrubbed)</span>
                    </td>
                    <td class="py-3 px-4 whitespace-nowrap">
                      <span
                        class="px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1"
                        :class="[
                          item.riskLevel === 'danger'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : item.riskLevel === 'warning'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        ]"
                      >
                        <span class="w-1.5 h-1.5 rounded-full" :class="item.riskLevel === 'clean' ? 'bg-emerald-400' : 'bg-rose-400'"></span>
                        <span>{{ item.isPopulated ? 'Exposed' : 'Clean' }}</span>
                      </span>
                    </td>
                    <td class="py-3 px-4 text-slate-400 text-[11px] leading-relaxed">
                      {{ item.explanation }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Tab 2: Page-by-Page Text Layers Breakdown -->
          <div v-if="activeTab === 'pages'" class="space-y-4">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-slate-800 text-slate-400 font-semibold">
                    <th class="py-3 px-4">Page</th>
                    <th class="py-3 px-4">Vector Text Layer</th>
                    <th class="py-3 px-4">Selectable Items</th>
                    <th class="py-3 px-4">Annotations &amp; Form Fields</th>
                    <th class="py-3 px-4">Raster Status</th>
                    <th class="py-3 px-4">Sample Extracted Text</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                  <tr
                    v-for="page in report.pages"
                    :key="page.pageNumber"
                    class="hover:bg-slate-800/30 transition"
                  >
                    <td class="py-3 px-4 font-bold text-white">
                      Page {{ page.pageNumber }}
                    </td>
                    <td class="py-3 px-4 whitespace-nowrap">
                      <span
                        class="px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1"
                        :class="page.hasSelectableText ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'"
                      >
                        {{ page.hasSelectableText ? 'Active Text Present' : 'Zero Text (Safe)' }}
                      </span>
                    </td>
                    <td class="py-3 px-4 font-mono">
                      {{ page.selectableTextCount }} glyphs
                    </td>
                    <td class="py-3 px-4 text-slate-400">
                      {{ page.annotationCount }} annotations ({{ page.widgetCount }} widgets)
                    </td>
                    <td class="py-3 px-4 whitespace-nowrap">
                      <span
                        class="px-2 py-0.5 rounded text-[10px] font-semibold"
                        :class="page.isPureRaster ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'"
                      >
                        {{ page.isPureRaster ? 'Pure Flattened Raster' : 'Layered Vector Streams' }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-slate-400 font-mono text-[11px] max-w-xs truncate">
                      {{ page.sampleText || '— (No selectable text)' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Below-The-Fold Crawlable Semantic SEO Content Section -->
      <SeoContentSection route-path="/verify-redaction" />
    </main>

    <!-- Website Footer -->
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import {
  ShieldCheck,
  ShieldAlert,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight
} from 'lucide-vue-next'
import SiteNavbar from '../components/website/SiteNavbar.vue'
import SiteFooter from '../components/website/SiteFooter.vue'
import SeoContentSection from '../components/website/SeoContentSection.vue'
import { auditPdfBuffer, type PdfAuditReport } from '../services/pdfVerifier'
import { useRouteSeo } from '../config/seoMetadata'

// Initialize SEO metadata & JSON-LD
useRouteSeo('/verify-redaction')

const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isAuditing = ref(false)
const errorMessage = ref<string | null>(null)
const report = ref<PdfAuditReport | null>(null)
const activeTab = ref<'metadata' | 'pages'>('metadata')
const showRawXmp = ref(false)

function triggerFileInput() {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  if (!event.dataTransfer || !event.dataTransfer.files || event.dataTransfer.files.length === 0) return
  const file = event.dataTransfer.files[0]
  processFile(file)
}

function handleFileInput(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  const file = target.files[0]
  processFile(file)
  target.value = ''
}

async function processFile(file: File) {
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    errorMessage.value = 'Please select a valid PDF document.'
    return
  }

  errorMessage.value = null
  isAuditing.value = true

  try {
    const arrayBuffer = await file.arrayBuffer()
    const auditResult = await auditPdfBuffer(arrayBuffer, file.name)
    report.value = auditResult
  } catch (err: any) {
    console.error('Audit failed:', err)
    errorMessage.value = `Failed to audit document: ${err?.message || 'Unknown error'}`
  } finally {
    isAuditing.value = false
  }
}

async function loadSyntheticTestDoc() {
  isAuditing.value = true
  errorMessage.value = null

  try {
    // Generate a quick synthetic PDF with deliberate metadata and selectable text to showcase audit findings
    const doc = await PDFDocument.create()
    const font = await doc.embedFont(StandardFonts.Helvetica)
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)

    doc.setTitle('Legal Discovery Exhibit A — Redacted')
    doc.setAuthor('John Doe (Paralegal)')
    doc.setCreator('Microsoft Word 365')
    doc.setProducer('Adobe Acrobat Pro (Unregistered)')
    doc.setCreationDate(new Date('2026-05-14T10:00:00Z'))

    const page1 = doc.addPage([600, 400])
    page1.drawText('CONFIDENTIAL LITIGATION SUMMARY', { x: 50, y: 350, size: 14, font: fontBold, color: rgb(0, 0, 0) })
    page1.drawText('Opposing party account number: 9876-5432-1098-7654', { x: 50, y: 300, size: 11, font, color: rgb(0.2, 0.2, 0.2) })
    
    // Draw a cosmetic black box OVER the text (simulating flawed redaction)
    page1.drawRectangle({
      x: 45,
      y: 295,
      width: 400,
      height: 20,
      color: rgb(0, 0, 0)
    })

    const page2 = doc.addPage([600, 400])
    page2.drawText('Second page containing settlement amounts: $1,250,000.00 USD.', { x: 50, y: 320, size: 11, font, color: rgb(0.2, 0.2, 0.2) })

    const sampleBytes = await doc.save()
    const auditResult = await auditPdfBuffer(sampleBytes, 'synthetic-court-redaction-sample.pdf')
    report.value = auditResult
  } catch (err: any) {
    errorMessage.value = `Could not generate sample: ${err?.message || 'Unknown error'}`
  } finally {
    isAuditing.value = false
  }
}

function resetAudit() {
  report.value = null
  errorMessage.value = null
  showRawXmp.value = false
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
</script>
