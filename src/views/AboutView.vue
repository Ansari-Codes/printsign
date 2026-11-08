<template>
  <div class="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
    <!-- Navbar -->
    <SiteNavbar />

    <main class="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <!-- Page Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-4">
          <span>ABOUT PRIVACY PDF</span>
        </div>
        <h1 class="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Pioneering Zero-Trust In-Browser Computing
        </h1>
        <p class="text-base sm:text-lg text-slate-400 leading-relaxed">
          We believe confidential documents should never leave the user's device. Our mission is to replace data-harvesting cloud utilities with uncompromising client-side software.
        </p>
      </div>


      <!-- Mission Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div class="bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 border border-slate-700/80 rounded-3xl p-8 shadow-xl">
          <div class="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-6">
            <ShieldCheck class="w-6 h-6" />
          </div>
          <h2 class="text-xl font-bold text-white mb-3">Our Core Philosophy</h2>
          <p class="text-sm text-slate-300 leading-relaxed mb-4">
            For decades, manipulating PDF files on the web required uploading sensitive files to remote servers. These cloud converters store documents on multi-tenant file systems, expose users to server breaches, and retain confidential information long after the user leaves the tab.
          </p>
          <p class="text-sm text-slate-300 leading-relaxed">
            PrintSign was engineered to prove that modern WebAssembly, Web Workers, and typed binary APIs eliminate the need for server-side PDF processing entirely.
          </p>
        </div>

        <div class="bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 border border-slate-700/80 rounded-3xl p-8 shadow-xl">
          <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-6">
            <Cpu class="w-6 h-6" />
          </div>
          <h2 class="text-xl font-bold text-white mb-3">100% Client-Side Architecture</h2>
          <p class="text-sm text-slate-300 leading-relaxed mb-4">
            Every feature in PrintSign runs inside your device's browser memory sandbox:
          </p>
          <ul class="space-y-2 text-xs text-slate-400">
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span><strong>Mozilla PDF.js v4:</strong> Local rendering via bundled Web Workers.</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span><strong>PDF-Lib:</strong> Page restructuring, metadata editing, and binary serialization.</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span><strong>IndexedDB:</strong> Encrypted local draft autosaving with zero cloud transmission.</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span><strong>Indirect Object GC:</strong> True permanent redaction that purges orphan data.</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Core Values -->
      <div class="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 mb-16">
        <h2 class="text-2xl font-bold text-white mb-8 text-center">Our Non-Negotiable Commitments</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div class="space-y-3">
            <div class="text-cyan-400 font-bold text-lg flex items-center gap-2">
              <EyeOff class="w-5 h-5" />
              <span>Zero Surveillance</span>
            </div>
            <p class="text-xs text-slate-400 leading-relaxed">
              We do not track user behavior, log document file names, record keystrokes, or exfiltrate analytics. Our test suites fail automatically if any unexpected outbound network call is detected.
            </p>
          </div>

          <div class="space-y-3">
            <div class="text-blue-400 font-bold text-lg flex items-center gap-2">
              <Lock class="w-5 h-5" />
              <span>Zero Server Footprint</span>
            </div>
            <p class="text-xs text-slate-400 leading-relaxed">
              We run zero backend servers for document processing. We have no access to your files, meaning we cannot be subpoenaed or forced to disclose documents we do not possess.
            </p>
          </div>

          <div class="space-y-3">
            <div class="text-indigo-400 font-bold text-lg flex items-center gap-2">
              <HeartHandshake class="w-5 h-5" />
              <span>100% Free Forever</span>
            </div>
            <p class="text-xs text-slate-400 leading-relaxed">
              Privacy should not be a paid luxury. PrintSign is accessible to everyone—students, legal counsel, journalists, human rights workers, and individuals worldwide.
            </p>
          </div>
        </div>
      </div>

      <!-- Who We Serve -->
      <div class="space-y-6 mb-16">
        <h2 class="text-2xl font-bold text-white text-center">Who Relies on PrintSign?</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <Scale class="w-6 h-6 text-cyan-400 mb-3" />
            <h3 class="text-sm font-bold text-white mb-1">Legal Professionals</h3>
            <p class="text-xs text-slate-400">Strict adherence to attorney-client privilege, work-product doctrine, and court redaction orders.</p>
          </div>

          <div class="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <Stethoscope class="w-6 h-6 text-emerald-400 mb-3" />
            <h3 class="text-sm font-bold text-white mb-1">Healthcare Providers</h3>
            <p class="text-xs text-slate-400">HIPAA compliant handling of patient health records (PHI) without requiring third-party BAAs.</p>
          </div>

          <div class="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <Newspaper class="w-6 h-6 text-indigo-400 mb-3" />
            <h3 class="text-sm font-bold text-white mb-1">Investigative Journalists</h3>
            <p class="text-xs text-slate-400">Protecting confidential whistleblowers and stripping identifying XMP metadata from leaks.</p>
          </div>

          <div class="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <Users class="w-6 h-6 text-purple-400 mb-3" />
            <h3 class="text-sm font-bold text-white mb-1">Everyday Citizens</h3>
            <p class="text-xs text-slate-400">Safely redacting Social Security Numbers, tax IDs, and bank details before emailing forms.</p>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="text-center p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-indigo-950/40 border border-cyan-500/30">
        <h2 class="text-xl font-bold text-white mb-2">Ready to edit your documents securely?</h2>
        <p class="text-xs text-slate-400 mb-6">No account required, no software installation, no credit card.</p>
        <router-link
          to="/editor"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-2xl text-sm shadow-xl shadow-cyan-500/20 transition active:scale-98"
        >
          <span>Launch PrintSign PDF Editor</span>
          <ArrowRight class="w-4 h-4" />
        </router-link>
      </div>
    </main>

    <!-- Footer -->
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import {
  ShieldCheck,
  Cpu,
  EyeOff,
  Lock,
  HeartHandshake,
  Scale,
  Stethoscope,
  Newspaper,
  Users,
  ArrowRight
} from 'lucide-vue-next'
import SiteNavbar from '../components/website/SiteNavbar.vue'
import SiteFooter from '../components/website/SiteFooter.vue'
</script>
