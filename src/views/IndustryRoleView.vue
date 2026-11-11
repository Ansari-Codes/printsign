<template>
  <div class="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans select-none">
    <!-- Website Navigation -->
    <SiteNavbar />

    <main class="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full select-text">
      <!-- Breadcrumbs & Trust Bar -->
      <ToolTrustBar />

      <!-- Hero Header Section -->
      <header class="text-center max-w-4xl mx-auto mb-14">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold mb-4">
          <component :is="roleData.icon" class="w-3.5 h-3.5" />
          <span>{{ roleData.badge }}</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-5">
          {{ roleData.h1 }}
        </h1>
        <p class="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mx-auto">
          {{ roleData.description }}
        </p>

        <!-- Trust Badges Row -->
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>100% In-Memory RAM Execution</span>
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs">
            <Cpu class="w-3.5 h-3.5 text-cyan-400" />
            <span>Zero Outbound Network Packets</span>
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs">
            <Lock class="w-3.5 h-3.5 text-indigo-400" />
            <span>Air-Gap &amp; Offline PWA Ready</span>
          </span>
        </div>
      </header>

      <!-- Industry Threat Breakdown Section -->
      <section class="mb-16">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-2">
            <AlertTriangle class="w-3.5 h-3.5" />
            <span>Critical Industry Vulnerabilities</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {{ roleData.threatSectionTitle }}
          </h2>
          <p class="text-xs sm:text-sm text-slate-400 mt-2">
            {{ roleData.threatSectionSubtitle }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="(threat, idx) in roleData.threats"
            :key="idx"
            class="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 hover:border-rose-500/30 transition shadow-xl flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-2xl">{{ threat.emoji }}</span>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 font-semibold uppercase">
                  {{ threat.tag }}
                </span>
              </div>
              <h3 class="text-base font-bold text-white mb-2 leading-snug">
                {{ threat.title }}
              </h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                {{ threat.desc }}
              </p>
            </div>
            <div class="pt-3 border-t border-slate-800/80 text-[11px] font-medium text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 class="w-3.5 h-3.5 shrink-0" />
              <span>{{ threat.defense }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Tailored 3-Step Workflow Linking to Tools -->
      <section class="mb-16">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold mb-2">
            <FileCheck class="w-3.5 h-3.5" />
            <span>Zero-Trust Workflow</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
            The 3-Step Local Sanitization Pipeline
          </h2>
          <p class="text-xs sm:text-sm text-slate-400 mt-2">
            Execute all operations client-side in volatile memory without uploading a single byte to cloud servers.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Step 1: Redactor -->
          <div class="p-6 rounded-3xl bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 border border-slate-800 hover:border-cyan-500/40 transition shadow-xl flex flex-col justify-between group">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Flame class="w-5 h-5" />
                </div>
                <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-bold">Step 1</span>
              </div>
              <h3 class="text-base font-bold text-white mb-2">Permanent 300 DPI Redactor</h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                {{ roleData.step1Desc }}
              </p>
            </div>
            <router-link
              to="/redact-pdf"
              class="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition active:scale-98"
            >
              <span>Launch 300 DPI Redactor</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
          </div>

          <!-- Step 2: Metadata Scrubber -->
          <div class="p-6 rounded-3xl bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 border border-slate-800 hover:border-indigo-500/40 transition shadow-xl flex flex-col justify-between group">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <EyeOff class="w-5 h-5" />
                </div>
                <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-bold">Step 2</span>
              </div>
              <h3 class="text-base font-bold text-white mb-2">Metadata &amp; XMP Scrubber</h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                {{ roleData.step2Desc }}
              </p>
            </div>
            <router-link
              to="/scrub-pdf-metadata"
              class="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition active:scale-98"
            >
              <span>Scrub Document Metadata</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
          </div>

          <!-- Step 3: Verifier -->
          <div class="p-6 rounded-3xl bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 border border-cyan-500/30 hover:border-cyan-400 transition shadow-xl flex flex-col justify-between group">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileSearch class="w-5 h-5" />
                </div>
                <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold">Step 3</span>
              </div>
              <h3 class="text-base font-bold text-white mb-2">Redaction &amp; Hash Verifier</h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                {{ roleData.step3Desc }}
              </p>
            </div>
            <router-link
              to="/verify-redaction"
              class="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition active:scale-98"
            >
              <span>Audit &amp; Get Certificate</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
          </div>
        </div>
      </section>

      <!-- High-Conversion In-Memory Callout Banner -->
      <section class="mb-16 p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-indigo-950/40 border border-cyan-500/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold mb-2">
            <Lock class="w-3.5 h-3.5" />
            <span>Air-Gapped Workstation Security</span>
          </span>
          <h3 class="text-xl sm:text-2xl font-black text-white mb-2">
            Need to process sensitive documents in an air-gapped facility?
          </h3>
          <p class="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            PrintSign operates as an offline Progressive Web App (PWA). You can disconnect physical Ethernet cables, turn off Wi-Fi, and sanitize files with zero network connection.
          </p>
        </div>
        <div class="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <router-link
            to="/f12-network-audit"
            class="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-2"
          >
            <span>F12 Network Audit</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </router-link>
          <router-link
            to="/redact-pdf"
            class="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition"
          >
            <span>Launch Redactor</span>
          </router-link>
        </div>
      </section>

      <!-- Defense Matrix Table -->
      <section class="mb-16">
        <h2 class="text-2xl font-black text-white tracking-tight mb-4 text-center sm:text-left">
          {{ roleData.matrixTitle }}
        </h2>
        <div class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
          <table class="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr class="border-b border-slate-800 bg-slate-950/80 text-slate-300">
                <th class="py-4 px-6 font-bold">Security Dimension</th>
                <th class="py-4 px-6 font-bold text-rose-400">Cloud PDF Tools (Smallpdf/iLovePDF)</th>
                <th class="py-4 px-6 font-bold text-amber-300">Standard Desktop (Adobe Acrobat)</th>
                <th class="py-4 px-6 font-bold text-emerald-400">PrintSign Local RAM Engine</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/80">
              <tr>
                <td class="py-4 px-6 font-semibold text-white">Network Exfiltration</td>
                <td class="py-4 px-6 text-slate-400">
                  <span class="text-rose-400 font-semibold block mb-0.5">High Exposure:</span>
                  Files uploaded to remote multi-tenant servers.
                </td>
                <td class="py-4 px-6 text-slate-400">
                  <span class="text-amber-300 font-semibold block mb-0.5">Telemetry Overhead:</span>
                  Cloud syncing, account auth &amp; usage metrics.
                </td>
                <td class="py-4 px-6 text-slate-300">
                  <span class="text-emerald-400 font-semibold block mb-0.5">Strictly Zero:</span>
                  0 outbound HTTP packets (verifiable via F12).
                </td>
              </tr>
              <tr>
                <td class="py-4 px-6 font-semibold text-white">Redaction Mechanism</td>
                <td class="py-4 px-6 text-slate-400">
                  <span class="text-rose-400 font-semibold block mb-0.5">Black Box Overlays:</span>
                  Frequently leaves character streams extractable.
                </td>
                <td class="py-4 px-6 text-slate-400">
                  <span class="text-amber-300 font-semibold block mb-0.5">User Error Prone:</span>
                  Must navigate multi-step sanitization menus.
                </td>
                <td class="py-4 px-6 text-slate-300">
                  <span class="text-emerald-400 font-semibold block mb-0.5">True 300 DPI Raster:</span>
                  Characters flattened into unrecoverable pixels.
                </td>
              </tr>
              <tr>
                <td class="py-4 px-6 font-semibold text-white">Third-Party Subpoena Liability</td>
                <td class="py-4 px-6 text-slate-400">
                  <span class="text-rose-400 font-semibold block mb-0.5">Subpoena Target:</span>
                  Cloud providers can be compelled under US CLOUD Act.
                </td>
                <td class="py-4 px-6 text-slate-400">
                  <span class="text-amber-300 font-semibold block mb-0.5">Cloud Sync Risk:</span>
                  Document Cloud backups may hold copies.
                </td>
                <td class="py-4 px-6 text-slate-300">
                  <span class="text-emerald-400 font-semibold block mb-0.5">Completely Immune:</span>
                  PrintSign holds zero user files and zero database.
                </td>
              </tr>
              <tr>
                <td class="py-4 px-6 font-semibold text-white">Cryptographic Audit Certificate</td>
                <td class="py-4 px-6 text-slate-400">
                  <span class="text-rose-400 font-semibold block mb-0.5">None:</span>
                  No cryptographic verification of sanitization.
                </td>
                <td class="py-4 px-6 text-slate-400">
                  <span class="text-amber-300 font-semibold block mb-0.5">Complex:</span>
                  Requires specialized forensic plug-ins.
                </td>
                <td class="py-4 px-6 text-slate-300">
                  <span class="text-emerald-400 font-semibold block mb-0.5">One-Click PDF Export:</span>
                  SHA-256 digest + NIST SP 800-88 report.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Below-The-Fold Crawlable Semantic SEO Content Section (500+ words) -->
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
  Cpu,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Scale,
  HeartPulse,
  Newspaper,
  Landmark,
  FileCheck,
  Flame,
  EyeOff,
  FileSearch
} from 'lucide-vue-next'
import SiteNavbar from '../components/website/SiteNavbar.vue'
import SiteFooter from '../components/website/SiteFooter.vue'
import SeoContentSection from '../components/website/SeoContentSection.vue'
import ToolTrustBar from '../components/common/ToolTrustBar.vue'
import { useRouteSeo } from '../config/seoMetadata'

const route = useRoute()

const currentRoutePath = computed(() => {
  const p = route?.path || '/for-lawyers'
  return p.endsWith('/') && p.length > 1 ? p.slice(0, -1) : p
})

// Initialize Unhead SEO head tags
useRouteSeo(currentRoutePath)

const roleData = computed(() => {
  const p = currentRoutePath.value

  if (p === '/for-healthcare') {
    return {
      icon: HeartPulse,
      badge: 'HIPAA SECURITY RULE § 164.312 & PHI SAFE HARBOR COMPLIANT',
      h1: 'Zero-Upload Medical Record PDF Redaction & Metadata Scrubbing for Healthcare',
      description: 'Sanitize patient medical records, insurance claims, and EHR exports locally in browser memory. Zero cloud uploads, no Business Associate Agreement (BAA) required, and full HIPAA Safe Harbor alignment.',
      threatSectionTitle: 'The 3 Critical Liabilities Threatening Healthcare Teams',
      threatSectionSubtitle: 'Protecting patient privacy requires technical certainty rather than multi-tenant cloud promises.',
      threats: [
        {
          emoji: '⚠️',
          tag: '45 CFR § 164.312',
          title: 'Cloud BAA Violations & Civil Penalties',
          desc: 'Uploading PHI to cloud converters without an executed Business Associate Agreement constitutes an immediate HIPAA violation subject to severe OCR fines.',
          defense: '100% In-memory execution eliminates cloud transmission completely.'
        },
        {
          emoji: '📋',
          tag: '18 PHI IDENTIFIERS',
          title: 'Unflattened Text in Diagnostic Scans',
          desc: 'Standard PDF black box annotations leave patient names, MRNs, and lab numbers extractable in the underlying vector text layer.',
          defense: 'Destructive 300 DPI rasterization burns redactions into pixels.'
        },
        {
          emoji: '🏥',
          tag: 'EHR METADATA LEAKS',
          title: 'Embedded Hospital & Doctor Telemetry',
          desc: 'Epic and Cerner exports contain hidden XML schemas revealing hospital IP addresses, internal routing codes, and physician usernames.',
          defense: 'Full /Info and XMP metadata scrubbing neutralizes all hidden packets.'
        }
      ],
      step1Desc: 'Draw redaction boxes over patient names, MRNs, and diagnostic disclosures to burn them into unrecoverable 300 DPI bitmap pixels.',
      step2Desc: 'Eradicate hospital workstation usernames, local EHR server paths, and embedded XMP schemas from the PDF catalog.',
      step3Desc: 'Inspect the sanitized patient record for selectable glyphs and download an official SHA-256 PDF Sanitization Certificate for compliance archives.',
      matrixTitle: 'Healthcare Compliance & PHI Protection Matrix'
    }
  }

  if (p === '/for-journalists') {
    return {
      icon: Newspaper,
      badge: 'INVESTIGATIVE SOURCE PROTECTION & FOIA SANITIZATION',
      h1: 'Forensic PDF Metadata Sanitization & Source Protection for Investigative Journalists',
      description: 'Protect confidential sources by stripping hidden XMP streams, printer/author metadata, and underlying vector text locally in an air-gapped browser tab.',
      threatSectionTitle: 'The 3 Critical Forensic Threats Facing Whistleblowers & Sources',
      threatSectionSubtitle: 'Document forensic telemetry can identify confidential sources even when visible text is hidden.',
      threats: [
        {
          emoji: '🟡',
          tag: 'MIC TRACKING DOTS',
          title: 'Microscopic Printer Tracking Beacons',
          desc: 'Color laser printers embed invisible yellow Machine Identification Codes (MIC) that reveal printer serial numbers, timestamps, and physical locations.',
          defense: '300 DPI rasterization and canvas flattening disrupts tracking dots.'
        },
        {
          emoji: '🔍',
          tag: 'FOIA REDACTION TRAPS',
          title: 'Flawed Government Optical Redactions',
          desc: 'Agencies routinely release FOIA PDFs where black boxes merely overlay text without deleting underlying ASCII/Unicode character strings.',
          defense: 'Permanent vector purging permanently wipes underlying text layers.'
        },
        {
          emoji: '👤',
          tag: 'XMP & AUTHOR TAGS',
          title: 'Device & Workstation Telemetry',
          desc: 'Leaked PDFs embed author usernames, Active Directory domain names, internal file share paths, and editing timestamps in XMP packets.',
          defense: 'Deep catalog scrubbing purges all uncompressed XMP XML packets.'
        }
      ],
      step1Desc: 'Redact government FOIA files to destroy underlying vector text layers that could compromise sensitive undercover sources.',
      step2Desc: 'Strip operating system usernames, printer metadata, and XMP schemas to shield whistleblower workstation identities.',
      step3Desc: 'Audit the sanitized document in memory to verify 0 selectable text persists and calculate the SHA-256 cryptographic digest before publishing.',
      matrixTitle: 'Source Protection & Investigative OpSec Matrix'
    }
  }

  if (p === '/for-finance-accounting') {
    return {
      icon: Landmark,
      badge: 'GLBA SAFEGUARDS RULE • PCI-DSS • SOC 2 & IRS 1040 PRIVACY',
      h1: 'Local Bank Statement, Tax & Financial PDF Redactor for CPAs',
      description: 'Redact TINs, SSNs, routing numbers, client ledger balances, and M&A term sheets 100% in browser RAM. Zero cloud uploads protect fiduciary confidentiality under GLBA Safeguards and IRS Publication 4557.',
      threatSectionTitle: 'The 3 Critical Leaks Threatening Financial & CPA Firms',
      threatSectionSubtitle: 'Uploading client tax returns or unflattened bank statements creates severe GLBA and SEC audit exposure.',
      threats: [
        {
          emoji: '🏦',
          tag: 'GLBA & IRS PUB 4557',
          title: 'Cloud Tax Portal & Converter Exposures',
          desc: 'Uploading 1040 tax transcripts, W-2s, or audited P&L statements to free online PDF editors transmits taxpayer PII across multi-tenant third-party servers.',
          defense: '100% In-memory execution: Client tax files never leave the CPA workstation.'
        },
        {
          emoji: '💳',
          tag: 'ACCOUNT & ROUTING LEAKS',
          title: 'Selectable Account Numbers Under Black Boxes',
          desc: 'Cosmetic black rectangles placed over bank routing numbers or card PANs remain searchable in PDF text streams for borrowers and opposing parties.',
          defense: '300 DPI pixel burn-in permanently destroys selectable numeric glyphs.'
        },
        {
          emoji: '📊',
          tag: 'XMP & EXCEL ORIGINS',
          title: 'Hidden M&A Deal & Author Telemetry',
          desc: 'Financial PDFs exported from Excel or Bloomberg often embed analyst usernames, firm workstation hostnames, and draft revision dates inside XMP XML.',
          defense: 'Deep catalog scrubbing wipes /Info dictionaries and hidden XMP streams.'
        }
      ],
      step1Desc: 'Redact TIN/EINs, SSNs, IBANs, and proprietary valuation multiples from bank statements and schedules using 300 DPI destructive pixel burn-in.',
      step2Desc: 'Strip embedded CPA firm usernames, PDF producer software signatures, and internal file paths from the document catalog.',
      step3Desc: 'Verify 0 selectable underlying digits survive redaction and generate an offline SHA-256 Sanitization Certificate for your audit workpapers.',
      matrixTitle: 'Financial Confidentiality & Audit Readiness Matrix'
    }
  }

  // Default: /for-lawyers
  return {
    icon: Scale,
    badge: 'FRCP RULE 5.2 & ABA MODEL RULE 1.6 DEFENSIBLE',
    h1: 'Court-Compliant Local PDF Redaction & Discovery Sanitization for Legal Teams',
    description: 'Redact court filings, discovery exhibits, and privileged legal PDFs 100% in browser RAM. Prevent failed black-box redactions with 300 DPI pixel destruction.',
    threatSectionTitle: 'The 3 Critical Liabilities Threatening Legal Teams',
    threatSectionSubtitle: 'Cosmetic redaction and cloud conversion introduce catastrophic evidentiary and ethical sanctions.',
    threats: [
      {
        emoji: '⚖️',
        tag: 'FRCP RULE 5.2',
        title: 'Optical Black Box Courtroom Disasters',
        desc: 'Cosmetic black rectangles merely overlay text. Opposing counsel or reporters press Ctrl+A to reveal confidential settlements and sealed indictments.',
        defense: 'Destructive 300 DPI pixel burn-in physically destroys characters.'
      },
      {
        emoji: '📁',
        tag: 'ABA RULE 1.6(c)',
        title: 'Cloud Third-Party Subpoena Liability',
        desc: 'Uploading discovery exhibits to cloud converters exposes privileged work product to foreign CLOUD Act subpoenas and multi-tenant breaches.',
        defense: '100% In-memory execution: Zero files ever transit external servers.'
      },
      {
        emoji: '🕵️',
        tag: 'ORPHAN OBJECTS',
        title: 'Residual Metadata in Increment Trailers',
        desc: 'Standard PDF edits leave historical revisions and author names in unreferenced cross-reference streams accessible to digital forensics.',
        defense: 'Indirect object garbage collection cleans orphan streams from catalog root.'
      }
    ],
    step1Desc: 'Draw redaction boxes over Social Security numbers, financial accounts, minor names, and trade secrets to burn them into 300 DPI pixels.',
    step2Desc: 'Purge law firm workstation telemetry, author names, and embedded XMP schemas from the PDF catalog.',
    step3Desc: 'Verify zero selectable vector text remains and download an official cryptographic SHA-256 Sanitization Certificate for your case file.',
    matrixTitle: 'Legal Defensibility & E-Discovery Sanitization Matrix'
  }
})
</script>
