<template>
  <div class="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
    <!-- Navbar -->
    <SiteNavbar @file-loaded="onFileLoaded" />

    <main class="flex-1">
      <!-- Hero Section with Dropzone -->
      <HeroSection @file-loaded="onFileLoaded" />


      <!-- Features Showcase -->
      <FeaturesSection
        @navigate="handleFeaturesNavigate"
        @open-redact-guide="router.push('/guides')"
        @open-metadata-guide="router.push('/guides')"
      />

      <!-- Architecture Comparison -->
      <ArchitectureSection />


      <!-- SEO Knowledge Base & Guides -->
      <BlogSection @navigate="handleFeaturesNavigate" />

      <!-- Frequently Asked Questions -->
      <FaqSection />

      <!-- Tailored Industry Solutions -->
      <section class="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold mb-2">
            <span>Enterprise &amp; Professional Solutions</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Tailored for Regulated Industries
          </h2>
          <p class="text-xs sm:text-sm text-slate-400 mt-2">
            Client-side browser memory sandboxing meets the strict compliance demands of legal counsel, healthcare providers, and investigative newsrooms.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Legal -->
          <router-link
            to="/for-lawyers"
            class="p-6 rounded-3xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition shadow-xl group flex flex-col justify-between"
          >
            <div>
              <div class="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Scale class="w-5 h-5" />
              </div>
              <div class="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider mb-1">
                Legal &amp; E-Discovery
              </div>
              <h3 class="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition">
                For Lawyers &amp; Legal Teams
              </h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                FRCP Rule 5.2 court-compliant redaction, 300 DPI destructive pixel flattening, and zero third-party CLOUD Act subpoena liability.
              </p>
            </div>
            <div class="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>Explore Legal Solutions</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </div>
          </router-link>

          <!-- Healthcare -->
          <router-link
            to="/for-healthcare"
            class="p-6 rounded-3xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition shadow-xl group flex flex-col justify-between"
          >
            <div>
              <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <HeartPulse class="w-5 h-5" />
              </div>
              <div class="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider mb-1">
                Healthcare &amp; PHI
              </div>
              <h3 class="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition">
                For Healthcare &amp; Medical
              </h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                De-identify 18 HIPAA Safe Harbor identifiers in patient charts and EHR exports locally in browser memory without cloud BAAs.
              </p>
            </div>
            <div class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Explore Healthcare Solutions</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </div>
          </router-link>

          <!-- Journalists -->
          <router-link
            to="/for-journalists"
            class="p-6 rounded-3xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition shadow-xl group flex flex-col justify-between"
          >
            <div>
              <div class="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Newspaper class="w-5 h-5" />
              </div>
              <div class="text-[10px] font-mono uppercase text-indigo-400 font-bold tracking-wider mb-1">
                FOIA &amp; Source Defense
              </div>
              <h3 class="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition">
                For Investigative Journalists
              </h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                Eradicate printer tracking yellow dots, XMP device metadata, and flawed government FOIA vector layers in an air-gapped tab.
              </p>
            </div>
            <div class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span>Explore Source Defense</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </div>
          </router-link>
        </div>
      </section>

      <section class="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <h2 class="text-sm font-extrabold text-white uppercase tracking-wider">
            All Client-Side PDF Tools &amp; Compliance Hubs
          </h2>
          <router-link to="/sitemap" class="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition">
            View Complete 54-Page Directory →
          </router-link>
        </div>

        <div class="space-y-6">
          <!-- PDF Tools Matrix -->
          <div>
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Zero-Upload Document Utilities</p>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-center text-xs">
              <router-link to="/redact-pdf" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-200 hover:text-cyan-400 transition font-semibold">Redact PDF (300 DPI)</router-link>
              <router-link to="/verify-redaction" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-emerald-500/30 rounded-xl text-emerald-300 hover:text-emerald-200 transition font-semibold">Redaction Verifier</router-link>
              <router-link to="/scrub-pdf-metadata" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-200 hover:text-cyan-400 transition font-semibold">Scrub Metadata</router-link>
              <router-link to="/sign-pdf" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-200 hover:text-cyan-400 transition font-semibold">Sign PDF Offline</router-link>
              <router-link to="/unlock-decrypt-pdf" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-200 hover:text-cyan-400 transition font-semibold">Unlock / Decrypt PDF</router-link>
              <router-link to="/watermark-pdf" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-200 hover:text-cyan-400 transition font-semibold">Watermark &amp; Bates</router-link>
              <router-link to="/extract-pdf-pages" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-200 hover:text-cyan-400 transition font-semibold">Extract PDF Pages</router-link>
              <router-link to="/merge-pdf" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-200 hover:text-cyan-400 transition font-semibold">Merge PDFs</router-link>
              <router-link to="/split-pdf" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-200 hover:text-cyan-400 transition font-semibold">Split PDF Ranges</router-link>
              <router-link to="/flatten-rasterize-pdf" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-200 hover:text-cyan-400 transition font-semibold">Flatten &amp; Rasterize</router-link>
              <router-link to="/reorder-rotate-pdf" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-200 hover:text-cyan-400 transition font-semibold">Reorder &amp; Rotate</router-link>
              <router-link to="/compress-pdf" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-200 hover:text-cyan-400 transition font-semibold">Lossless Compressor</router-link>
              <router-link to="/editor" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-200 hover:text-cyan-400 transition font-semibold">Full Web Editor</router-link>
              <router-link to="/general-editor" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-200 hover:text-cyan-400 transition font-semibold">General PDF Editor</router-link>
              <router-link to="/sitemap" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-cyan-500/30 rounded-xl text-cyan-300 hover:text-cyan-200 transition font-semibold">Full Site Index (54)</router-link>
            </div>
          </div>

          <!-- Industry & Compliance Matrix -->
          <div>
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Regulatory Compliance &amp; Industry Hubs</p>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-center text-xs">
              <router-link to="/for-lawyers" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 hover:text-cyan-400 transition">⚖️ For Lawyers</router-link>
              <router-link to="/for-healthcare" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 hover:text-cyan-400 transition">🩺 For Healthcare</router-link>
              <router-link to="/for-journalists" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 hover:text-cyan-400 transition">📰 For Journalists</router-link>
              <router-link to="/for-finance-accounting" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 hover:text-cyan-400 transition">🏦 For Finance &amp; CPAs</router-link>
              <router-link to="/hipaa-compliant-pdf-redaction" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 hover:text-cyan-400 transition">HIPAA Redaction</router-link>
              <router-link to="/nist-800-88-pdf-sanitization" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 hover:text-cyan-400 transition">NIST SP 800-88</router-link>
              <router-link to="/gdpr-article-32-pdf-compliance" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 hover:text-cyan-400 transition">GDPR Article 32</router-link>
              <router-link to="/foia-document-redaction-tool" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 hover:text-cyan-400 transition">FOIA Redactor</router-link>
              <router-link to="/f12-network-audit" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 hover:text-cyan-400 transition">F12 Network Audit</router-link>
              <router-link to="/ilovepdf-smallpdf-offline-alternative" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 hover:text-cyan-400 transition">Cloud Alternative</router-link>
              <router-link to="/features" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 hover:text-cyan-400 transition">Features &amp; Specs</router-link>
              <router-link to="/about-us" class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 hover:text-cyan-400 transition">About &amp; Security</router-link>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Scale, HeartPulse, Newspaper, ArrowRight } from 'lucide-vue-next'
import SiteNavbar from '../components/website/SiteNavbar.vue'
import SiteFooter from '../components/website/SiteFooter.vue'
import HeroSection from '../components/website/HeroSection.vue'
import FeaturesSection from '../components/website/FeaturesSection.vue'
import ArchitectureSection from '../components/website/ArchitectureSection.vue'
import BlogSection from '../components/website/BlogSection.vue'
import FaqSection from '../components/website/FaqSection.vue'

const router = useRouter()

function onFileLoaded() {
  router.push('/editor')
}

function handleFeaturesNavigate(view: string) {
  if (view === 'editor') {
    router.push('/editor')
  } else if (view === 'architecture') {
    document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>
