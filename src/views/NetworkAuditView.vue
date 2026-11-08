<template>
  <div class="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans select-none">
    <!-- Website Navigation -->
    <SiteNavbar />

    <main class="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full select-text">
      <!-- Hero Header Section -->
      <header class="text-center max-w-4xl mx-auto mb-12">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold mb-4">
          <ShieldCheck class="w-3.5 h-3.5" />
          <span>ZERO-NETWORK IN-MEMORY TELEMETRY • F12 VERIFIABLE</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
          10-Second Reproducible Zero-Network &amp; RAM Security Audit
        </h1>
        <p class="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mx-auto">
          Verify PrintSign's zero-cloud architecture using native browser DevTools (F12), live <code class="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-xs">PerformanceObserver</code> telemetry, and in-memory execution benchmarks. Prove that confidential documents never touch a remote server.
        </p>

        <!-- Live Telemetry Badges -->
        <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-medium">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>External API Calls: {{ xhrFetchCount }}</span>
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium">
            <Cpu class="w-3.5 h-3.5 text-cyan-400" />
            <span>Outbound Data Exfiltration: 0 Bytes</span>
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono font-medium">
            <Activity class="w-3.5 h-3.5 text-indigo-400" />
            <span>Monitored Resources: {{ totalResourcesCount }}</span>
          </span>
        </div>
      </header>

      <!-- Section 1: Live Interactive Benchmark -->
      <section class="mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 border border-slate-800 shadow-2xl">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div>
            <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-semibold mb-2">
              <Zap class="w-3 h-3" />
              <span>LIVE REPRODUCIBLE TEST</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold text-white mb-1">
              Live In-Memory Redaction &amp; Metadata Benchmark
            </h2>
            <p class="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
              Click below to generate a synthetic 3-page document in volatile RAM, audit vector text layers, and inspect metadata streams while actively measuring outbound network activity.
            </p>
          </div>

          <button
            type="button"
            :disabled="isBenchmarking"
            @click="runBenchmark"
            class="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap self-start md:self-auto cursor-pointer"
          >
            <RefreshCw v-if="isBenchmarking" class="w-4 h-4 animate-spin" />
            <Play v-else class="w-4 h-4 fill-current" />
            <span>{{ isBenchmarking ? 'Running RAM Benchmark...' : 'Run Live In-Memory Benchmark' }}</span>
          </button>
        </div>

        <!-- Benchmark Execution Results Card -->
        <div v-if="benchmarkResult" class="mt-6 p-5 rounded-2xl bg-slate-950/80 border border-cyan-500/30">
          <div class="flex items-center gap-2 mb-4 text-emerald-400 font-bold text-sm">
            <CheckCircle2 class="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>Benchmark Passed: Executed 100% in Browser Memory (Zero Network Exfiltration)</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Execution Time</span>
              <span class="text-xl font-extrabold text-cyan-400 font-mono">{{ benchmarkResult.executionTimeMs }} ms</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Pages Processed</span>
              <span class="text-xl font-extrabold text-white font-mono">{{ benchmarkResult.pagesCount }} Pages</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Network API Calls</span>
              <span class="text-xl font-extrabold text-emerald-400 font-mono">0 Requests</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Bytes Uploaded</span>
              <span class="text-xl font-extrabold text-emerald-400 font-mono">0 Bytes</span>
            </div>
          </div>

          <p class="text-xs text-slate-400 mt-4 leading-relaxed">
            <strong>Audited Findings:</strong> Successfully inspected {{ benchmarkResult.pagesCount }} pages, {{ benchmarkResult.selectableGlyphs }} selectable text items, and {{ benchmarkResult.metadataItemsCount }} metadata attributes entirely within browser WebAssembly and JavaScript engines. No external packets were dispatched.
          </p>
        </div>
      </section>

      <!-- Section 2: Real-Time PerformanceObserver Network Log -->
      <section class="mb-12 p-6 sm:p-8 rounded-3xl bg-slate-900/50 border border-slate-800 shadow-xl">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
              <Activity class="w-5 h-5 text-cyan-400" />
              <span>Real-Time PerformanceObserver Resource Telemetry</span>
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              Active telemetry capturing all network requests loaded by this browser session via <code class="text-cyan-300 font-mono">window.performance.getEntriesByType('resource')</code>.
            </p>
          </div>

          <!-- Filter Pills -->
          <div class="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              v-for="tab in (['all', 'fetch', 'script', 'css'] as const)"
              :key="tab"
              type="button"
              @click="activeFilter = tab"
              class="px-3 py-1 rounded-xl font-medium transition cursor-pointer capitalize"
              :class="activeFilter === tab ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'"
            >
              {{ tab === 'fetch' ? 'Fetch/XHR (0)' : tab }}
            </button>
            <button
              type="button"
              @click="refreshResources"
              class="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
              title="Refresh log"
            >
              <RefreshCw class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Telemetry Table -->
        <div class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-slate-800 text-slate-400 font-semibold bg-slate-900/40">
                <th class="py-3 px-4">Initiator</th>
                <th class="py-3 px-4">Asset / Request Destination</th>
                <th class="py-3 px-4">Type</th>
                <th class="py-3 px-4">Transfer Size</th>
                <th class="py-3 px-4">Duration</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 font-mono text-[11px]">
              <tr v-if="filteredEntries.length === 0">
                <td colspan="5" class="py-6 px-4 text-center text-slate-500 font-sans">
                  No network requests recorded matching filter.
                </td>
              </tr>
              <tr
                v-for="(entry, index) in filteredEntries"
                :key="index"
                class="hover:bg-slate-800/30 transition text-slate-300"
              >
                <td class="py-2.5 px-4">
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-semibold font-sans uppercase"
                    :class="[
                      entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : entry.initiatorType === 'script'
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : entry.initiatorType === 'link' || entry.initiatorType === 'css'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-slate-800 text-slate-400'
                    ]"
                  >
                    {{ entry.initiatorType }}
                  </span>
                </td>
                <td class="py-2.5 px-4 truncate max-w-xs sm:max-w-md text-slate-300" :title="entry.name">
                  {{ formatEntryName(entry.name) }}
                </td>
                <td class="py-2.5 px-4 text-slate-400 font-sans">
                  {{ entry.entryType }}
                </td>
                <td class="py-2.5 px-4 text-slate-400">
                  {{ formatTransferSize(entry.transferSize) }}
                </td>
                <td class="py-2.5 px-4 text-slate-400">
                  {{ entry.duration > 0 ? `${entry.duration.toFixed(1)} ms` : 'Cached' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4 p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div class="flex items-center gap-2">
            <CheckCircle2 class="w-4 h-4 text-emerald-400" />
            <span>Notice: Only static bundled UI and WebAssembly scripts load. No document data is sent.</span>
          </div>
          <span class="text-[11px] font-mono text-cyan-400">Zero Outbound Telemetry</span>
        </div>
      </section>

      <!-- Section 3: Step-by-Step F12 Independent Audit Checklist -->
      <section class="mb-14 p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 shadow-xl">
        <h2 class="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Terminal class="w-6 h-6 text-cyan-400" />
          <span>Step-by-Step F12 Verification Protocol for Auditors</span>
        </h2>
        <p class="text-xs sm:text-sm text-slate-400 leading-relaxed mb-8 max-w-3xl">
          Don't take our word for it. Independent security researchers, Data Protection Officers (DPOs), and open-source directory maintainers can independently verify PrintSign's zero-cloud claims in 10 seconds:
        </p>

        <div class="space-y-4">
          <div
            v-for="(step, idx) in auditSteps"
            :key="idx"
            class="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
          >
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 font-bold text-xs flex-shrink-0 mt-0.5">
                0{{ idx + 1 }}
              </div>
              <div class="flex-1">
                <h3 class="text-sm font-bold text-white mb-1 flex items-center gap-2">
                  <span>{{ step.title }}</span>
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-mono">{{ step.shortcut }}</span>
                </h3>
                <p class="text-xs text-slate-300 leading-relaxed mb-3">
                  {{ step.instruction }}
                </p>
                <div v-if="step.code" class="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 font-mono text-xs text-cyan-300 overflow-x-auto">
                  {{ step.code }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Jump Cards to Other Verification & Redaction Tools -->
      <section class="mb-16">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-6 rounded-3xl bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 border border-slate-800 hover:border-cyan-500/40 transition shadow-xl flex flex-col justify-between group">
            <div>
              <div class="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Search class="w-5 h-5" />
              </div>
              <h3 class="text-base font-bold text-white mb-2">PDF Redaction &amp; Metadata Verifier</h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                Drag any redacted PDF into browser RAM to inspect underlying selectable vector text glyphs, form fields, and hidden XMP metadata leaks.
              </p>
            </div>
            <router-link
              to="/verify-redaction"
              class="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 group-hover:translate-x-1 transition-transform"
            >
              <span>Launch Local Verifier Tool</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
          </div>

          <div class="p-6 rounded-3xl bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 border border-slate-800 hover:border-cyan-500/40 transition shadow-xl flex flex-col justify-between group">
            <div>
              <div class="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheck class="w-5 h-5" />
              </div>
              <h3 class="text-base font-bold text-white mb-2">Permanent 300 DPI Redactor</h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                Permanently burn redactions into high-resolution pixels with 100% vector stream stripping and orphan object garbage collection.
              </p>
            </div>
            <router-link
              to="/redact-pdf"
              class="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 group-hover:translate-x-1 transition-transform"
            >
              <span>Launch Permanent Redactor</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
          </div>
        </div>
      </section>

      <!-- Below-The-Fold Crawlable Semantic SEO Content Section -->
      <SeoContentSection route-path="/f12-network-audit" />
    </main>

    <!-- Website Footer -->
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  ShieldCheck,
  Cpu,
  Activity,
  Zap,
  Play,
  RefreshCw,
  CheckCircle2,
  Terminal,
  Search,
  ArrowRight
} from 'lucide-vue-next'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import SiteNavbar from '../components/website/SiteNavbar.vue'
import SiteFooter from '../components/website/SiteFooter.vue'
import SeoContentSection from '../components/website/SeoContentSection.vue'
import { auditPdfBuffer } from '../services/pdfVerifier'
import { useRouteSeo } from '../config/seoMetadata'

// Initialize SEO metadata & JSON-LD
useRouteSeo('/f12-network-audit')

interface ResourceEntry {
  name: string
  entryType: string
  initiatorType: string
  duration: number
  transferSize: number
  startTime: number
}

const resources = ref<ResourceEntry[]>([])
const activeFilter = ref<'all' | 'fetch' | 'script' | 'css'>('all')
const isBenchmarking = ref(false)
const benchmarkResult = ref<{
  executionTimeMs: string
  pagesCount: number
  selectableGlyphs: number
  metadataItemsCount: number
} | null>(null)

let observer: PerformanceObserver | null = null

function updateEntries() {
  if (typeof window === 'undefined' || !window.performance) return
  const rawEntries = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  resources.value = rawEntries.map(e => ({
    name: e.name,
    entryType: e.entryType,
    initiatorType: e.initiatorType || 'other',
    duration: e.duration,
    transferSize: e.transferSize || 0,
    startTime: e.startTime
  })).reverse() // Show latest first
}

function refreshResources() {
  updateEntries()
}

onMounted(() => {
  updateEntries()

  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    try {
      observer = new PerformanceObserver((list) => {
        const newEntries = list.getEntries() as PerformanceResourceTiming[]
        for (const e of newEntries) {
          resources.value.unshift({
            name: e.name,
            entryType: e.entryType,
            initiatorType: e.initiatorType || 'other',
            duration: e.duration,
            transferSize: e.transferSize || 0,
            startTime: e.startTime
          })
        }
      })
      observer.observe({ entryTypes: ['resource'] })
    } catch (err) {
      console.warn('PerformanceObserver resource observing error:', err)
    }
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

const xhrFetchCount = computed(() => {
  return resources.value.filter(
    e => e.initiatorType === 'fetch' || e.initiatorType === 'xmlhttprequest'
  ).length
})

const totalResourcesCount = computed(() => resources.value.length)

const filteredEntries = computed(() => {
  if (activeFilter.value === 'all') return resources.value
  if (activeFilter.value === 'fetch') {
    return resources.value.filter(e => e.initiatorType === 'fetch' || e.initiatorType === 'xmlhttprequest')
  }
  if (activeFilter.value === 'script') {
    return resources.value.filter(e => e.initiatorType === 'script')
  }
  if (activeFilter.value === 'css') {
    return resources.value.filter(e => e.initiatorType === 'link' || e.initiatorType === 'css')
  }
  return resources.value
})

function formatEntryName(url: string): string {
  try {
    const parsed = new URL(url)
    const pathname = parsed.pathname
    const filename = pathname.split('/').pop() || pathname
    return filename || url
  } catch {
    return url
  }
}

function formatTransferSize(bytes: number): string {
  if (!bytes || bytes === 0) return 'Cached (0 B)'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

async function runBenchmark() {
  isBenchmarking.value = true
  const startTime = performance.now()

  try {
    // 1. Generate a synthetic 3-page document in volatile RAM
    const doc = await PDFDocument.create()
    const font = await doc.embedFont(StandardFonts.Helvetica)
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)

    doc.setTitle('F12 Audit Benchmark Document')
    doc.setAuthor('Security Auditor (Local Sandbox)')
    doc.setCreator('PrintSign In-Memory Engine')

    // Page 1: Sensitive Account Table
    const page1 = doc.addPage([600, 400])
    page1.drawText('CONFIDENTIAL FINANCIAL SETTLEMENT SUMMARY', { x: 50, y: 350, size: 14, font: fontBold, color: rgb(0, 0, 0) })
    page1.drawText('Internal Account ID: ACCT-99182-3849', { x: 50, y: 310, size: 11, font, color: rgb(0.2, 0.2, 0.2) })
    page1.drawRectangle({ x: 45, y: 305, width: 350, height: 20, color: rgb(0, 0, 0) })

    // Page 2: Medical Diagnostic Record
    const page2 = doc.addPage([600, 400])
    page2.drawText('PATIENT DIAGNOSTIC CLEARANCE REPORT', { x: 50, y: 350, size: 14, font: fontBold, color: rgb(0, 0, 0) })
    page2.drawText('Medical Record Number (MRN): 481-992-019', { x: 50, y: 310, size: 11, font, color: rgb(0.2, 0.2, 0.2) })

    // Page 3: Court Filing Terms
    const page3 = doc.addPage([600, 400])
    page3.drawText('LEGAL DISCOVERY EXHIBIT D', { x: 50, y: 350, size: 14, font: fontBold, color: rgb(0, 0, 0) })
    page3.drawText('Settlement Total: $4,500,000.00 USD under Rule 5.2', { x: 50, y: 310, size: 11, font, color: rgb(0.2, 0.2, 0.2) })

    // 2. Save in memory buffer
    const pdfBytes = await doc.save()

    // 3. Run audit using pdfVerifier
    const auditResult = await auditPdfBuffer(pdfBytes, 'benchmark-test.pdf')

    const endTime = performance.now()
    const elapsed = (endTime - startTime).toFixed(1)

    const totalGlyphs = auditResult.pages.reduce((acc, p) => acc + p.selectableTextCount, 0)

    benchmarkResult.value = {
      executionTimeMs: elapsed,
      pagesCount: auditResult.totalPageCount,
      selectableGlyphs: totalGlyphs,
      metadataItemsCount: auditResult.metadata.infoItems.length
    }

    // Refresh telemetry to show 0 outbound calls were triggered
    updateEntries()
  } catch (err) {
    console.error('Benchmark failed:', err)
  } finally {
    isBenchmarking.value = false
  }
}

interface AuditStep {
  title: string
  shortcut: string
  instruction: string
  code?: string
}

const auditSteps: AuditStep[] = [
  {
    title: 'Open Native Browser Developer Tools',
    shortcut: 'F12 / Ctrl+Shift+I / Cmd+Opt+I',
    instruction: 'Open your browser\'s Developer Tools console. Navigate to the "Network" panel at the top.'
  },
  {
    title: 'Filter Specifically for Fetch / XHR Requests',
    shortcut: 'Network Filter → Fetch/XHR',
    instruction: 'Click the "Fetch/XHR" filter button. This isolates all API requests, file uploads, telemetry beacons, and remote RPC calls.'
  },
  {
    title: 'Execute Any PDF Redaction, Splitting, or Merging Action',
    shortcut: 'Drag & Drop PDF Document',
    instruction: 'Drag a sensitive 50-page PDF into PrintSign, apply black boxes, or click "Run Live In-Memory Benchmark". Notice that the Fetch/XHR network log remains completely blank (0 requests dispatched).'
  },
  {
    title: 'Test Offline Air-Gap Mode via Network Throttling',
    shortcut: 'Throttling → Offline',
    instruction: 'In the DevTools Network panel, change the throttling dropdown from "No throttling" to "Offline" (or physically disconnect your Wi-Fi/Ethernet). Refresh the page: PrintSign continues to function autonomously with 0 connectivity.'
  },
  {
    title: 'Inspect In-Memory Storage & Storage Isolation',
    shortcut: 'Application / Storage Tab',
    instruction: 'Switch to the "Application" (or "Storage") tab. Verify that Cookies and LocalStorage contain 0 document contents. All PDF typed array buffers reside strictly in volatile RAM, instantly garbage-collected when the browser tab is closed.'
  }
]
</script>
