<template>
  <section id="privacy" class="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-12 border-b border-slate-800 pb-8">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-4">
        <span>LEGAL & COMPLIANCE DISCLOSURE</span>
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
        Privacy Policy & Data Protection Statement
      </h1>
      <p class="text-xs text-slate-400 font-mono">
        Last Updated: October 2026 • Effective Immediately Across All Versions
      </p>
    </div>

    <!-- Privacy Content Body -->
    <div class="space-y-8 text-slate-300 text-sm leading-relaxed">
      <!-- Section 1 -->
      <div class="space-y-3">
        <h2 class="text-xl font-bold text-white tracking-tight">1. Core Architecture: Zero Data Collection Principle</h2>
        <p>
          PrintSign (<span class="text-cyan-400 font-semibold">printsign.org</span>) is designed and engineered from the ground up on the principle of <strong class="text-white">Zero Server Data Processing</strong>.
        </p>
        <p>
          Unlike traditional software-as-a-service (SaaS) and online PDF conversion tools, <strong class="text-white">your files, documents, text, images, annotations, redactions, and metadata NEVER leave your computer or browser</strong>. All parsing, rendering, rasterizing, page reorganization, metadata scrubbing, and export happen 100% locally on your device using client-side Web Workers, Mozilla PDF.js, and PDF-Lib.
        </p>
        <p>
          We do not operate backend servers that accept, process, store, or log user document data.
        </p>
      </div>

      <!-- Section 2 -->
      <div class="space-y-3">
        <h2 class="text-xl font-bold text-white tracking-tight">2. Local Browser Storage & IndexedDB</h2>
        <p>
          To enhance user experience and provide crash recovery, PrintSign utilizes your browser's local sandbox storage mechanisms:
        </p>
        <ul class="list-disc list-inside space-y-1.5 text-slate-400 ml-2">
          <li><strong class="text-slate-200">IndexedDB:</strong> Storing temporary working drafts locally on your device so that refreshing or accidentally closing your browser does not cause data loss.</li>
          <li><strong class="text-slate-200">LocalStorage:</strong> Storing basic user interface preferences (such as preferred zoom level and view mode).</li>
        </ul>
        <p>
          This data remains solely inside your browser sandbox. It is never transmitted to us or any third party. You can clear this data at any time through the in-app "Dismiss and Clear Drafts" button or via your browser's "Clear Site Data" settings.
        </p>
      </div>

      <!-- Section 3 -->
      <div class="space-y-3">
        <h2 class="text-xl font-bold text-white tracking-tight">3. Service Worker & Offline Capability (PWA)</h2>
        <p>
          PrintSign registers a Service Worker via the Progressive Web App (PWA) specification. This Service Worker caches the application's static HTML, JavaScript bundles, WebAssembly runtimes, style sheets, and standard font metric files (CMAPs) locally on your device.
        </p>
        <p>
          This enables the application to function entirely offline without an active internet connection. The Service Worker does not track, intercept, or log document contents.
        </p>
      </div>

      <!-- Section 4 -->
      <div class="space-y-3">
        <h2 class="text-xl font-bold text-white tracking-tight">4. Third-Party Advertising & Cookie Disclosures (Google AdSense)</h2>
        <p>
          To keep this application 100% free for public use, we may display advertising served by Google AdSense and third-party advertising partners on website landing and educational pages.
        </p>
        <p>
          Please note the following disclosures required by Google AdSense policies and privacy regulations:
        </p>
        <ul class="list-disc list-inside space-y-2 text-slate-400 ml-2">
          <li>
            <strong class="text-slate-200">Third-Party Vendors:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.
          </li>
          <li>
            <strong class="text-slate-200">Advertising Cookies:</strong> Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet.
          </li>
          <li>
            <strong class="text-slate-200">Document Isolation:</strong> Advertising scripts have zero access to your PDF documents or client-side workspace memory. Documents are processed in isolated Web Workers and memory-scoped object stores that third-party scripts cannot access or inspect.
          </li>
          <li>
            <strong class="text-slate-200">Opting Out:</strong> Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" class="text-cyan-400 underline">Google Ads Settings</a> or through the <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" class="text-cyan-400 underline">Digital Advertising Alliance's WebChoices tool</a>.
          </li>
        </ul>
      </div>

      <!-- Section 5 -->
      <div class="space-y-3">
        <h2 class="text-xl font-bold text-white tracking-tight">5. Regulatory Compliance (GDPR, CCPA & HIPAA)</h2>
        <p>
          Because PrintSign never receives, transmits, or hosts your documents on external servers:
        </p>
        <ul class="list-disc list-inside space-y-1.5 text-slate-400 ml-2">
          <li><strong class="text-slate-200">GDPR (General Data Protection Regulation):</strong> We act neither as a Data Controller nor a Data Processor for documents edited in your browser. No cross-border data transfers occur.</li>
          <li><strong class="text-slate-200">HIPAA (Health Insurance Portability and Accountability Act):</strong> Because Protected Health Information (PHI) never touches our infrastructure, covered entities can safely use the tool without requiring a Business Associate Agreement (BAA).</li>
          <li><strong class="text-slate-200">CCPA / CPRA (California Consumer Privacy Act):</strong> We do not sell or share personal information extracted from your documents.</li>
        </ul>
      </div>

      <!-- Section 6 -->
      <div class="space-y-3">
        <h2 class="text-xl font-bold text-white tracking-tight">6. Policy Updates & Contact Information</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
        </p>
        <p>
          If you have questions about our zero-server privacy architecture or data protection practices, please open an issue on our GitHub repository or contact the project maintainers.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Stateless legal disclosure component
</script>
