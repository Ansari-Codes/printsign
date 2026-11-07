<template>
  <div class="w-full my-8 overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 shadow-2xl">
    <!-- Table Header Summary Banner -->
    <div class="p-6 sm:p-8 border-b border-slate-800 bg-slate-950/60">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold mb-2">
            <span>2026 ARCHITECTURE & PRIVACY BENCHMARK</span>
          </div>
          <h3 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            PrintSign vs. Leading PDF Editors & Cloud Converters
          </h3>
          <p class="text-sm text-slate-400 mt-1">
            See how PrintSign's 100% client-side privacy model compares to legacy desktop suites and commercial cloud converters.
          </p>
        </div>
        <router-link
          to="/editor"
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition whitespace-nowrap self-start md:self-auto"
        >
          <span>Launch PrintSign Free</span>
          <ArrowRight class="w-4 h-4" />
        </router-link>
      </div>
    </div>

    <!-- Responsive Scroll Container -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse text-xs sm:text-sm">
        <thead>
          <tr class="border-b border-slate-800 bg-slate-900/80 text-slate-300">
            <th class="py-4 px-4 sm:px-6 font-semibold w-1/4">Feature / Metric</th>
            <th class="py-4 px-4 sm:px-6 font-extrabold text-cyan-400 bg-cyan-500/5 border-x border-cyan-500/20">
              <div class="flex items-center gap-1.5">
                <ShieldCheck class="w-4 h-4 text-cyan-400" />
                <span>PrintSign PDF</span>
              </div>
              <span class="block text-[10px] text-cyan-300/80 font-normal">100% Client-Side</span>
            </th>
            <th class="py-4 px-4 sm:px-6 font-semibold text-slate-300">
              Adobe Acrobat Pro
              <span class="block text-[10px] text-slate-400 font-normal">Desktop / Cloud Hybrid</span>
            </th>
            <th class="py-4 px-4 sm:px-6 font-semibold text-slate-300">
              Smallpdf / iLovePDF
              <span class="block text-[10px] text-slate-400 font-normal">Cloud Converters</span>
            </th>
            <th class="py-4 px-4 sm:px-6 font-semibold text-slate-300">
              Sejda PDF
              <span class="block text-[10px] text-slate-400 font-normal">Web SaaS</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/80 text-slate-300">
          <!-- Row 1: File Processing Location -->
          <tr class="hover:bg-slate-800/30 transition">
            <td class="py-4 px-4 sm:px-6 font-medium text-white">
              Processing Architecture
              <span class="block text-[11px] text-slate-400 font-normal">Where document parsing executes</span>
            </td>
            <td class="py-4 px-4 sm:px-6 bg-cyan-500/5 border-x border-cyan-500/20 font-bold text-emerald-400">
              <div class="flex items-center gap-1.5">
                <CheckCircle2 class="w-4 h-4 shrink-0 text-emerald-400" />
                <span>100% Local In-Browser (WebAssembly)</span>
              </div>
            </td>
            <td class="py-4 px-4 sm:px-6 text-slate-300">
              Local Desktop App (syncs to Adobe Cloud)
            </td>
            <td class="py-4 px-4 sm:px-6 text-rose-300">
              <div class="flex items-center gap-1.5">
                <XCircle class="w-4 h-4 shrink-0 text-rose-400" />
                <span>Remote Multi-Tenant Cloud Servers</span>
              </div>
            </td>
            <td class="py-4 px-4 sm:px-6 text-rose-300">
              <div class="flex items-center gap-1.5">
                <XCircle class="w-4 h-4 shrink-0 text-rose-400" />
                <span>Remote Cloud Servers (2hr retention)</span>
              </div>
            </td>
          </tr>

          <!-- Row 2: Server Uploads & Data Leak Risk -->
          <tr class="hover:bg-slate-800/30 transition">
            <td class="py-4 px-4 sm:px-6 font-medium text-white">
              Server Uploads & Telemetry
              <span class="block text-[11px] text-slate-400 font-normal">Network packets transmitted</span>
            </td>
            <td class="py-4 px-4 sm:px-6 bg-cyan-500/5 border-x border-cyan-500/20 font-bold text-emerald-400">
              <div class="flex items-center gap-1.5">
                <CheckCircle2 class="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Zero Bytes (No Servers Exist)</span>
              </div>
            </td>
            <td class="py-4 px-4 sm:px-6 text-amber-300">
              Telemetry & Document Cloud Sync Active
            </td>
            <td class="py-4 px-4 sm:px-6 text-rose-300">
              Full Document Uploaded via HTTPS
            </td>
            <td class="py-4 px-4 sm:px-6 text-rose-300">
              Full Document Uploaded via HTTPS
            </td>
          </tr>

          <!-- Row 3: Redaction Integrity -->
          <tr class="hover:bg-slate-800/30 transition">
            <td class="py-4 px-4 sm:px-6 font-medium text-white">
              Permanent Redaction Method
              <span class="block text-[11px] text-slate-400 font-normal">NIST SP 800-88 compliance</span>
            </td>
            <td class="py-4 px-4 sm:px-6 bg-cyan-500/5 border-x border-cyan-500/20 font-bold text-emerald-400">
              <div class="flex items-center gap-1.5">
                <CheckCircle2 class="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Pixel Burn-in + Object Tree GC</span>
              </div>
            </td>
            <td class="py-4 px-4 sm:px-6 text-emerald-400">
              True Sanitization (Pro plan only)
            </td>
            <td class="py-4 px-4 sm:px-6 text-rose-300">
              <div class="flex items-center gap-1.5">
                <AlertTriangle class="w-4 h-4 shrink-0 text-amber-400" />
                <span>Often Superficial Shape Overlay</span>
              </div>
            </td>
            <td class="py-4 px-4 sm:px-6 text-amber-300">
              Black Overlay (Extractable in text tools)
            </td>
          </tr>

          <!-- Row 4: Offline PWA Support -->
          <tr class="hover:bg-slate-800/30 transition">
            <td class="py-4 px-4 sm:px-6 font-medium text-white">
              Offline Usage (PWA)
              <span class="block text-[11px] text-slate-400 font-normal">Works on airplanes or no WiFi</span>
            </td>
            <td class="py-4 px-4 sm:px-6 bg-cyan-500/5 border-x border-cyan-500/20 font-bold text-emerald-400">
              <div class="flex items-center gap-1.5">
                <CheckCircle2 class="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Yes — 100% Offline PWA</span>
              </div>
            </td>
            <td class="py-4 px-4 sm:px-6 text-slate-300">
              Requires 2GB+ Heavy Desktop App
            </td>
            <td class="py-4 px-4 sm:px-6 text-rose-300">
              <div class="flex items-center gap-1.5">
                <XCircle class="w-4 h-4 shrink-0 text-rose-400" />
                <span>No (Fails Without Internet)</span>
              </div>
            </td>
            <td class="py-4 px-4 sm:px-6 text-rose-300">
              <div class="flex items-center gap-1.5">
                <XCircle class="w-4 h-4 shrink-0 text-rose-400" />
                <span>No (Cloud dependent)</span>
              </div>
            </td>
          </tr>

          <!-- Row 5: Metadata & XMP Scrubbing -->
          <tr class="hover:bg-slate-800/30 transition">
            <td class="py-4 px-4 sm:px-6 font-medium text-white">
              Metadata & XMP Scrubber
              <span class="block text-[11px] text-slate-400 font-normal">Purges GPS, Author, Edit History</span>
            </td>
            <td class="py-4 px-4 sm:px-6 bg-cyan-500/5 border-x border-cyan-500/20 font-bold text-emerald-400">
              <div class="flex items-center gap-1.5">
                <CheckCircle2 class="w-4 h-4 shrink-0 text-emerald-400" />
                <span>One-Click Full XML Purge</span>
              </div>
            </td>
            <td class="py-4 px-4 sm:px-6 text-slate-300">
              Available in "Examine Document" menu
            </td>
            <td class="py-4 px-4 sm:px-6 text-rose-300">
              Limited / Retained
            </td>
            <td class="py-4 px-4 sm:px-6 text-rose-300">
              Limited / Retained
            </td>
          </tr>

          <!-- Row 6: DPI Customization -->
          <tr class="hover:bg-slate-800/30 transition">
            <td class="py-4 px-4 sm:px-6 font-medium text-white">
              Rendering Resolution
              <span class="block text-[11px] text-slate-400 font-normal">Output quality control</span>
            </td>
            <td class="py-4 px-4 sm:px-6 bg-cyan-500/5 border-x border-cyan-500/20 font-bold text-emerald-400">
              <div class="flex items-center gap-1.5">
                <CheckCircle2 class="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Custom 72 to 600 DPI</span>
              </div>
            </td>
            <td class="py-4 px-4 sm:px-6 text-slate-300">
              Preset export profiles
            </td>
            <td class="py-4 px-4 sm:px-6 text-amber-300">
              Fixed low/medium compression
            </td>
            <td class="py-4 px-4 sm:px-6 text-amber-300">
              Fixed compression
            </td>
          </tr>

          <!-- Row 7: Pricing & Restrictions -->
          <tr class="hover:bg-slate-800/30 transition">
            <td class="py-4 px-4 sm:px-6 font-medium text-white">
              Pricing & Limitations
              <span class="block text-[11px] text-slate-400 font-normal">Daily limits, subscriptions</span>
            </td>
            <td class="py-4 px-4 sm:px-6 bg-cyan-500/5 border-x border-cyan-500/20 font-bold text-emerald-400">
              <div class="flex items-center gap-1.5">
                <CheckCircle2 class="w-4 h-4 shrink-0 text-emerald-400" />
                <span>100% Free Forever (No Limits)</span>
              </div>
            </td>
            <td class="py-4 px-4 sm:px-6 text-rose-300">
              $239.88 / year per user
            </td>
            <td class="py-4 px-4 sm:px-6 text-rose-300">
              $84 - $108/yr (Free: max 2 tasks/day)
            </td>
            <td class="py-4 px-4 sm:px-6 text-rose-300">
              $60/yr (Free: max 3 tasks/hour, 50MB)
            </td>
          </tr>

          <!-- Row 8: Account & Sign-Up -->
          <tr class="hover:bg-slate-800/30 transition">
            <td class="py-4 px-4 sm:px-6 font-medium text-white">
              Account Registration
              <span class="block text-[11px] text-slate-400 font-normal">Email harvesting & tracking</span>
            </td>
            <td class="py-4 px-4 sm:px-6 bg-cyan-500/5 border-x border-cyan-500/20 font-bold text-emerald-400">
              <div class="flex items-center gap-1.5">
                <CheckCircle2 class="w-4 h-4 shrink-0 text-emerald-400" />
                <span>No Sign-Up, No Account, No Cookies</span>
              </div>
            </td>
            <td class="py-4 px-4 sm:px-6 text-rose-300">
              Mandatory Adobe ID & Billing Profile
            </td>
            <td class="py-4 px-4 sm:px-6 text-amber-300">
              Required for batch or daily unlocks
            </td>
            <td class="py-4 px-4 sm:px-6 text-amber-300">
              Required for unlimited usage
            </td>
          </tr>

          <!-- Row 9: Regulatory Compliance -->
          <tr class="hover:bg-slate-800/30 transition">
            <td class="py-4 px-4 sm:px-6 font-medium text-white">
              Compliance Readiness
              <span class="block text-[11px] text-slate-400 font-normal">HIPAA, GDPR, Legal Privilege</span>
            </td>
            <td class="py-4 px-4 sm:px-6 bg-cyan-500/5 border-x border-cyan-500/20 font-bold text-emerald-400">
              <div class="flex items-center gap-1.5">
                <CheckCircle2 class="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Instant Compliance (0 Data Exfiltration)</span>
              </div>
            </td>
            <td class="py-4 px-4 sm:px-6 text-emerald-400">
              Compliant (Enterprise Agreement)
            </td>
            <td class="py-4 px-4 sm:px-6 text-rose-300">
              Requires third-party BAA / DPA audits
            </td>
            <td class="py-4 px-4 sm:px-6 text-rose-300">
              Requires third-party DPA review
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Table Footer Note -->
    <div class="p-4 sm:p-5 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-3">
      <span>
        * Data verified against published specifications, terms of service, and browser network inspect traces as of October 2026.
      </span>
      <span class="text-cyan-400 font-semibold">
        PrintSign: Zero Telemetry Guarantee
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, ArrowRight } from 'lucide-vue-next'
</script>
