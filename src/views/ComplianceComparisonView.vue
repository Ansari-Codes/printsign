<template>
  <div class="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans select-none">
    <!-- Website Navigation -->
    <SiteNavbar />

    <main class="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full select-text">
      <!-- Hero Header Section -->
      <header class="text-center max-w-4xl mx-auto mb-14">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold mb-4">
          <ShieldCheck class="w-3.5 h-3.5" />
          <span>{{ heroData.badge }}</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-5">
          {{ heroData.h1 }}
        </h1>
        <p class="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mx-auto">
          {{ heroData.description }}
        </p>

        <!-- Trust Badges Row -->
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Zero Network Uploads</span>
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs">
            <Cpu class="w-3.5 h-3.5 text-cyan-400" />
            <span>Client-Side WebAssembly</span>
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs">
            <Lock class="w-3.5 h-3.5 text-indigo-400" />
            <span>Air-Gap &amp; Offline Ready</span>
          </span>
        </div>
      </header>

      <!-- Direct Tool Launch Action Cards -->
      <section class="mb-16">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 rounded-3xl bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 border border-slate-800 hover:border-cyan-500/40 transition shadow-xl flex flex-col justify-between group">
            <div>
              <div class="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheck class="w-5 h-5" />
              </div>
              <h3 class="text-base font-bold text-white mb-2">Permanent 300 DPI Redactor</h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                Permanently burn black boxes into irreversible pixels. Vector text layers and OCR data are completely erased from RAM.
              </p>
            </div>
            <router-link
              to="/redact-pdf"
              class="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition active:scale-98"
            >
              <span>Launch Redactor</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
          </div>

          <div class="p-6 rounded-3xl bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 border border-slate-800 hover:border-cyan-500/40 transition shadow-xl flex flex-col justify-between group">
            <div>
              <div class="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <FileText class="w-5 h-5" />
              </div>
              <h3 class="text-base font-bold text-white mb-2">Metadata &amp; XMP Scrubber</h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                Purge author identities, software signatures, creation timestamps, and raw XML packets from the PDF catalog.
              </p>
            </div>
            <router-link
              to="/scrub-pdf-metadata"
              class="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition active:scale-98"
            >
              <span>Scrub Metadata</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
          </div>

          <div class="p-6 rounded-3xl bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 border border-cyan-500/30 hover:border-cyan-400 transition shadow-xl flex flex-col justify-between group">
            <div>
              <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <CheckCircle2 class="w-5 h-5" />
              </div>
              <h3 class="text-base font-bold text-white mb-2">Redaction &amp; Metadata Verifier</h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                Audit documents locally for hidden text layers beneath black boxes or lingering XMP streams before release.
              </p>
            </div>
            <router-link
              to="/verify-redaction"
              class="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition active:scale-98"
            >
              <span>Audit Document Free</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
          </div>
        </div>
      </section>

      <!-- Architecture Comparison Matrix Section -->
      <section class="mb-16">
        <header class="text-center max-w-3xl mx-auto mb-8">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Architectural &amp; Compliance Benchmark
          </h2>
          <p class="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Side-by-side comparison between multi-tenant cloud PDF converters and PrintSign's 100% in-browser WebAssembly engine.
          </p>
        </header>

        <div class="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/40 shadow-2xl">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-slate-800 bg-slate-900/80 text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                <th class="py-4 px-6 w-1/4">Evaluation Criteria</th>
                <th class="py-4 px-6 w-3/8 text-rose-300 bg-rose-950/20">
                  Cloud PDF Converters (Smallpdf / iLovePDF)
                </th>
                <th class="py-4 px-6 w-3/8 text-cyan-300 bg-cyan-950/20">
                  PrintSign (In-Memory WebAssembly)
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr class="hover:bg-slate-800/30 transition">
                <td class="py-4 px-6 font-semibold text-white">Network Exfiltration</td>
                <td class="py-4 px-6 text-slate-400">
                  <span class="text-rose-400 font-semibold block mb-1">High Risk:</span>
                  Entire PDF binary is uploaded to multi-tenant servers (AWS/GCP/Hetzner).
                </td>
                <td class="py-4 px-6 text-slate-300">
                  <span class="text-emerald-400 font-semibold block mb-1">Zero Risk:</span>
                  0 bytes uploaded. PDF is parsed strictly within workstation RAM via Typed Arrays.
                </td>
              </tr>

              <tr class="hover:bg-slate-800/30 transition">
                <td class="py-4 px-6 font-semibold text-white">Server Storage Window</td>
                <td class="py-4 px-6 text-slate-400">
                  <span class="text-rose-400 font-semibold block mb-1">60–120 Minutes on Disk:</span>
                  Files reside on cloud virtual machines, subject to crash dumps and backups.
                </td>
                <td class="py-4 px-6 text-slate-300">
                  <span class="text-emerald-400 font-semibold block mb-1">Zero Retention:</span>
                  Never written to any server disk. Memory is instantly freed when tab is closed.
                </td>
              </tr>

              <tr class="hover:bg-slate-800/30 transition">
                <td class="py-4 px-6 font-semibold text-white">Redaction Integrity</td>
                <td class="py-4 px-6 text-slate-400">
                  <span class="text-amber-400 font-semibold block mb-1">Cosmetic Overlays:</span>
                  Frequently places black vector shapes on top. Underlying text can still be copied (Ctrl+A).
                </td>
                <td class="py-4 px-6 text-slate-300">
                  <span class="text-emerald-400 font-semibold block mb-1">Permanent 300 DPI Burn:</span>
                  Irreversibly flattens redactions into pixels, destroying underlying font glyphs.
                </td>
              </tr>

              <tr class="hover:bg-slate-800/30 transition">
                <td class="py-4 px-6 font-semibold text-white">Regulatory BAA (HIPAA)</td>
                <td class="py-4 px-6 text-slate-400">
                  <span class="text-rose-400 font-semibold block mb-1">Mandatory BAA Required:</span>
                  Uploading PHI without an executed Business Associate Agreement violates federal law.
                </td>
                <td class="py-4 px-6 text-slate-300">
                  <span class="text-emerald-400 font-semibold block mb-1">Exempt from BAA:</span>
                  No third party touches or receives data. Complies inherently with § 164.312.
                </td>
              </tr>

              <tr class="hover:bg-slate-800/30 transition">
                <td class="py-4 px-6 font-semibold text-white">Air-Gap &amp; Offline Mode</td>
                <td class="py-4 px-6 text-slate-400">
                  <span class="text-rose-400 font-semibold block mb-1">Inoperable Offline:</span>
                  Completely non-functional without an active, uninterrupted internet connection.
                </td>
                <td class="py-4 px-6 text-slate-300">
                  <span class="text-emerald-400 font-semibold block mb-1">100% Offline PWA:</span>
                  Cached locally by Service Worker. Works with Wi-Fi disabled or on air-gapped laptops.
                </td>
              </tr>

              <tr class="hover:bg-slate-800/30 transition">
                <td class="py-4 px-6 font-semibold text-white">Cost &amp; Daily Limits</td>
                <td class="py-4 px-6 text-slate-400">
                  <span class="text-amber-400 font-semibold block mb-1">Paywalled Caps:</span>
                  Restricts free users to 2–3 daily tasks to force $80–$120/year subscriptions.
                </td>
                <td class="py-4 px-6 text-slate-300">
                  <span class="text-emerald-400 font-semibold block mb-1">100% Free Forever:</span>
                  No daily limits, no task caps, no file size ceilings, and zero subscriptions.
                </td>
              </tr>

              <tr class="hover:bg-slate-800/30 transition">
                <td class="py-4 px-6 font-semibold text-white">Subpoena &amp; CLOUD Act Risk</td>
                <td class="py-4 px-6 text-slate-400">
                  <span class="text-rose-400 font-semibold block mb-1">Vulnerable to Subpoena:</span>
                  Cloud providers can be compelled under US CLOUD Act to surrender uploaded data.
                </td>
                <td class="py-4 px-6 text-slate-300">
                  <span class="text-emerald-400 font-semibold block mb-1">Immune:</span>
                  PrintSign holds zero user files, zero database records, and zero telemetry.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Below-The-Fold Crawlable Semantic SEO Content Section -->
      <SeoContentSection :route-path="currentRoutePath" />
    </main>

    <!-- Website Footer -->
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  ShieldCheck,
  Cpu,
  Lock,
  ArrowRight,
  FileText,
  CheckCircle2
} from 'lucide-vue-next'
import SiteNavbar from '../components/website/SiteNavbar.vue'
import SiteFooter from '../components/website/SiteFooter.vue'
import SeoContentSection from '../components/website/SeoContentSection.vue'
import { useRouteSeo } from '../config/seoMetadata'

const route = useRoute()

const currentRoutePath = computed(() => {
  const p = route?.path || '/ilovepdf-smallpdf-offline-alternative'
  return p.endsWith('/') && p.length > 1 ? p.slice(0, -1) : p
})

// Initialize Unhead SEO head tags
useRouteSeo(currentRoutePath)

const heroData = computed(() => {
  const p = currentRoutePath.value

  if (p === '/hipaa-compliant-pdf-redaction') {
    return {
      badge: 'HIPAA SECURITY RULE § 164.312 & PHI SAFE HARBOR COMPLIANT',
      h1: 'HIPAA-Compliant Client-Side PDF Redaction for Healthcare & Legal Teams',
      description: 'Redact patient names, Social Security numbers, MRNs, and diagnostic disclosures 100% inside your browser RAM. Zero server uploads, zero cloud data retention, and no Business Associate Agreement (BAA) required.'
    }
  }

  if (p === '/nist-800-88-pdf-sanitization') {
    return {
      badge: 'NIST SP 800-88 REV. 1 MEDIA SANITIZATION ALIGNED',
      h1: 'NIST SP 800-88 Aligned PDF Sanitization & Metadata Destruction',
      description: 'Execute true forensic data destruction on digital PDF documents: purge hidden XMP streams, scrub /Info trailer dictionaries, erase underlying vector glyph streams at 300 DPI, and garbage-collect unreferenced orphan objects.'
    }
  }

  // Default: /ilovepdf-smallpdf-offline-alternative
  return {
    badge: 'ZERO-CLOUD PRIVACY ARCHITECTURE BENCHMARK',
    h1: 'The 100% Client-Side, Zero-Upload Alternative to Cloud PDF Tools',
    description: 'Compare cloud PDF converters vs. PrintSign\'s 100% client-side WebAssembly architecture. Edit, merge, and permanently redact PDFs locally without uploading files or hitting paywalls.'
  }
})
</script>
