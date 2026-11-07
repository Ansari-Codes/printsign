<template>
  <section id="architecture" class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="text-center max-w-3xl mx-auto mb-16">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
        <span>SECURITY & COMPLIANCE ARCHITECTURE</span>
      </div>
      <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
        Zero Cloud. Zero Risk. Zero Subpoena Surface.
      </h2>
      <p class="text-base text-slate-400 leading-relaxed">
        Why legal firms, defense contractors, and healthcare organizations can no longer afford to use conventional cloud-hosted PDF utilities.
      </p>
    </div>

    <!-- Comparative Table -->
    <div class="w-full bg-slate-900/80 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl mb-16 backdrop-blur-md">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="border-b border-slate-800 bg-slate-950/60">
              <th class="py-5 px-6 font-bold text-slate-300 w-1/3">Security Vector</th>
              <th class="py-5 px-6 font-bold text-rose-400 w-1/3 bg-rose-950/10">Traditional Cloud PDF Tools</th>
              <th class="py-5 px-6 font-bold text-cyan-400 w-1/3 bg-cyan-950/15">PrintSign (This Application)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/80 text-xs sm:text-sm">
            <tr>
              <td class="py-4 px-6 font-semibold text-white">Network Transit</td>
              <td class="py-4 px-6 text-slate-400 bg-rose-950/5">
                <span class="text-rose-400 font-semibold block mb-1">Uploaded over Public Internet</span>
                Entire PDF binary stream is transmitted to remote AWS/GCP server instances.
              </td>
              <td class="py-4 px-6 text-slate-300 bg-cyan-950/10">
                <span class="text-cyan-400 font-semibold block mb-1">Zero Bytes Transmitted</span>
                Directly parsed from disk into browser ArrayBuffer memory. 0 HTTP requests.
              </td>
            </tr>

            <tr>
              <td class="py-4 px-6 font-semibold text-white">Server-Side Data Retention</td>
              <td class="py-4 px-6 text-slate-400 bg-rose-950/5">
                <span class="text-rose-400 font-semibold block mb-1">Temp Disks & S3 Buckets</span>
                Saved to cloud object storage. Vulnerable to server misconfigurations and insider threat.
              </td>
              <td class="py-4 px-6 text-slate-300 bg-cyan-950/10">
                <span class="text-cyan-400 font-semibold block mb-1">100% Volatile Client RAM</span>
                No database, no server logs, no telemetry. State exists only while tab is open.
              </td>
            </tr>

            <tr>
              <td class="py-4 px-6 font-semibold text-white">Redaction Method</td>
              <td class="py-4 px-6 text-slate-400 bg-rose-950/5">
                <span class="text-rose-400 font-semibold block mb-1">Visual Black Rectangles</span>
                Covers text with an SVG or path shape. Vector text stream remains 100% extractable.
              </td>
              <td class="py-4 px-6 text-slate-300 bg-cyan-950/10">
                <span class="text-cyan-400 font-semibold block mb-1">Pixel Burn-In + Orphan GC</span>
                Page is rendered to 300 DPI pixels, burned, replaced, and unreferenced objects pruned.
              </td>
            </tr>

            <tr>
              <td class="py-4 px-6 font-semibold text-white">Third-Party Legal Jurisdiction</td>
              <td class="py-4 px-6 text-slate-400 bg-rose-950/5">
                <span class="text-rose-400 font-semibold block mb-1">Subject to Foreign Subpoenas</span>
                Third-party hosting providers can be compelled by court order to disclose stored files.
              </td>
              <td class="py-4 px-6 text-slate-300 bg-cyan-950/10">
                <span class="text-cyan-400 font-semibold block mb-1">Zero Third-Party Knowledge</span>
                No vendor has access. Compliant with HIPAA, GDPR, attorney-client privilege, and NDA.
              </td>
            </tr>

            <tr>
              <td class="py-4 px-6 font-semibold text-white">Offline & Air-Gap Capability</td>
              <td class="py-4 px-6 text-slate-400 bg-rose-950/5">
                <span class="text-rose-400 font-semibold block mb-1">Completely Broken Offline</span>
                Requires constant high-speed connection; non-functional in secure classified vaults.
              </td>
              <td class="py-4 px-6 text-slate-300 bg-cyan-950/10">
                <span class="text-cyan-400 font-semibold block mb-1">100% Offline PWA Ready</span>
                Precached Service Worker allows full editing and redaction without internet connection.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Technical Pipeline Explainer -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div class="space-y-6">
        <h3 class="text-2xl font-bold text-white tracking-tight">
          How Our Indirect Object Garbage Collector Purges Sensitive Data
        </h3>
        <p class="text-sm text-slate-300 leading-relaxed">
          In the PDF specification (ISO 32000-1), a document is a graph of indirect objects (dictionaries, streams, arrays) referenced by numeric IDs (e.g., <code class="text-cyan-300 bg-slate-800 px-1.5 py-0.5 rounded-md font-mono text-xs">4 0 R</code>).
        </p>
        <p class="text-sm text-slate-300 leading-relaxed">
          When naive software deletes a page or replaces text, it often leaves the original content stream as an unreferenced <strong class="text-white">orphan object</strong> in the binary. Anyone opening the file in a hex editor or running <code class="text-cyan-300 bg-slate-800 px-1.5 py-0.5 rounded-md font-mono text-xs">strings document.pdf</code> can recover the confidential data.
        </p>
        <div class="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 space-y-2">
          <div class="font-bold flex items-center gap-1.5 text-cyan-300">
            <CheckCircle2 class="w-4 h-4 text-cyan-400" />
            <span>Automated 5-Stage Redaction & Purge Pipeline:</span>
          </div>
          <ol class="list-decimal list-inside space-y-1.5 text-slate-300 ml-1">
            <li><strong class="text-white">Coordinate Mapping:</strong> 1.0x viewport space ensures sub-pixel overlay accuracy.</li>
            <li><strong class="text-white">300 DPI Canvas Burn-In:</strong> Redaction boxes are baked directly into image pixels.</li>
            <li><strong class="text-white">Page Replacement:</strong> Vector page stream replaced with a pure raster image.</li>
            <li><strong class="text-white">Graph-Walking GC:</strong> Traverses Trailer & Catalog roots, pruning disconnected indirect objects.</li>
            <li><strong class="text-white">Byte-Sequence Audit:</strong> Inspects final output binary to verify canary removal.</li>
          </ol>
        </div>
      </div>

      <!-- Live Self-Audit Guide Card -->
      <div class="bg-gradient-to-tr from-slate-900 via-[#0d1424] to-slate-900 border border-slate-700/80 rounded-3xl p-7 shadow-2xl relative">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-bold text-cyan-400 uppercase tracking-wider">Independent Verification</span>
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            Zero-Trust Ready
          </span>
        </div>
        <h4 class="text-lg font-bold text-white mb-2">Audit Our Zero-Network Promise in 10 Seconds</h4>
        <p class="text-xs text-slate-400 leading-relaxed mb-4">
          Don't take our word for it. Every modern browser includes developer auditing tools that prove zero bytes leave your computer.
        </p>

        <div class="space-y-3 font-mono text-xs">
          <div class="p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-slate-300">
            <span class="text-cyan-400 font-bold">Step 1:</span> Press <kbd class="px-1.5 py-0.5 bg-slate-800 rounded-md border border-slate-700 text-white">F12</kbd> or right-click & select <span class="text-white">"Inspect"</span>.
          </div>
          <div class="p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-slate-300">
            <span class="text-cyan-400 font-bold">Step 2:</span> Click the <span class="text-white">"Network"</span> tab and check <span class="text-white">"All"</span>.
          </div>
          <div class="p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-slate-300">
            <span class="text-cyan-400 font-bold">Step 3:</span> Drag a confidential PDF, redact pages, split, and export.
          </div>
          <div class="p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-emerald-400">
            <span class="text-emerald-300 font-bold">Result:</span> <span class="text-white">0 external HTTP/HTTPS requests recorded.</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CheckCircle2 } from 'lucide-vue-next'
</script>
