<template>
  <div class="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
    <!-- Navbar -->
    <SiteNavbar />

    <main class="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <!-- Page Header -->
      <div class="mb-12 border-b border-slate-800 pb-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-4">
          <span>COOKIE TRANSPARENCY & CONSENT</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Cookie Policy & GDPR Advertising Notice
        </h1>
        <p class="text-xs text-slate-400 font-mono">
          Last Updated: October 2026 • Compliant with GDPR, ePrivacy Directive & Google AdSense Publisher Requirements
        </p>
      </div>

      <!-- Content Body -->
      <div class="space-y-8 text-slate-300 text-sm leading-relaxed">
        <div class="space-y-3">
          <h2 class="text-xl font-bold text-white tracking-tight">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files placed on your computer or mobile device when you browse websites. They are widely used to facilitate site functionality, record preferences, and provide analytical or advertising services to site operators.
          </p>
        </div>

        <div class="space-y-3">
          <h2 class="text-xl font-bold text-white tracking-tight">2. How PrintSign Uses Cookies & Local Storage</h2>
          <p>
            PrintSign distinguishes strictly between <strong class="text-white">Document Processing</strong> and <strong class="text-white">Website Presentation</strong>:
          </p>
          <ul class="list-disc list-inside space-y-2 text-slate-400 ml-2">
            <li>
              <strong class="text-slate-200">Zero Document Cookies:</strong> When you edit, split, rotate, or redact PDF documents, no cookies are ever created or transmitted with your document data. All state is maintained in volatile client RAM and your local browser IndexedDB sandbox.
            </li>
            <li>
              <strong class="text-slate-200">Local Storage (Preferences):</strong> We use browser localStorage solely to remember interface preferences (e.g. view mode, zoom level). This data remains on your device and is never shared.
            </li>
          </ul>
        </div>

        <div class="space-y-3">
          <h2 class="text-xl font-bold text-white tracking-tight">3. Third-Party Advertising Cookies (Google AdSense)</h2>
          <p>
            To fund the maintenance, development, and hosting of our free web tools, we partner with Google AdSense and third-party advertising networks.
          </p>
          <p>
            Google AdSense may set third-party cookies on your device (such as <code class="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded-md font-mono text-xs">__gads</code>, <code class="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded-md font-mono text-xs">__gpi</code>, or <code class="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded-md font-mono text-xs">IDE</code>) for purposes including:
          </p>
          <ul class="list-disc list-inside space-y-2 text-slate-400 ml-2">
            <li>Serving relevant, interest-based advertisements based on prior visits to this and other websites.</li>
            <li>Frequency capping to prevent the same advertisement from appearing repeatedly to the same visitor.</li>
            <li>Fraud detection and click verification to protect advertisers from automated bots.</li>
            <li>Measuring ad performance and audience reporting.</li>
          </ul>
          <div class="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200">
            <strong>Important Privacy Boundary:</strong> Google AdSense cookies and scripts are strictly isolated by browser security policies and have <strong class="text-white">zero access to your PDF files, documents, text, or redaction coordinates</strong>.
          </div>
        </div>

        <div class="space-y-3">
          <h2 class="text-xl font-bold text-white tracking-tight">4. Managing Your Cookie Choices & Opt-Out Links</h2>
          <p>
            You have full control over cookie settings and can manage or opt out of advertising cookies through the following verified tools:
          </p>
          <ul class="list-disc list-inside space-y-2 text-slate-400 ml-2">
            <li>
              <strong class="text-slate-200">Google Ads Settings:</strong> Opt out of personalized Google advertising at <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" class="text-cyan-400 underline">adssettings.google.com</a>.
            </li>
            <li>
              <strong class="text-slate-200">Digital Advertising Alliance (DAA):</strong> Opt out across participating networks via the <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" class="text-cyan-400 underline">WebChoices tool</a>.
            </li>
            <li>
              <strong class="text-slate-200">European Interactive Digital Advertising Alliance (EDAA):</strong> European visitors can manage preferences at <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" class="text-cyan-400 underline">youronlinechoices.eu</a>.
            </li>
            <li>
              <strong class="text-slate-200">Browser Settings:</strong> You can configure Chrome, Firefox, Safari, or Edge to reject all third-party cookies or alert you when a cookie is placed.
            </li>
          </ul>
        </div>

        <div class="space-y-3">
          <h2 class="text-xl font-bold text-white tracking-tight">5. Contact Information</h2>
          <p>
            If you have questions regarding our Cookie Policy or advertising disclosures, please email <a href="mailto:privacy@printsign.org" class="text-cyan-400 underline font-mono">privacy@printsign.org</a> or visit our <router-link to="/contact-us" class="text-cyan-400 underline">Contact Us</router-link> page.
          </p>
        </div>
      </div>

      <!-- AdSense Unit (Bottom) -->
      <AdSenseSlot
        slot-name="Cookie Policy Bottom Placement"
        format="horizontal"
        description="Google AdSense compliant responsive footer unit."
      />
    </main>

    <!-- Footer -->
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import SiteNavbar from '../components/website/SiteNavbar.vue'
import SiteFooter from '../components/website/SiteFooter.vue'
import AdSenseSlot from '../components/website/AdSenseSlot.vue'
</script>
