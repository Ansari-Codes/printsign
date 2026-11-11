<template>
  <div class="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans select-none">
    <!-- Website Navigation -->
    <SiteNavbar />

    <main class="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full select-text">
      <!-- Breadcrumbs & Trust Bar -->
      <ToolTrustBar />

      <!-- Hero Header -->
      <header class="text-center max-w-4xl mx-auto mb-14">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold mb-4">
          <MapIcon class="w-3.5 h-3.5" />
          <span>COMPLETE 54-PAGE SITE ARCHITECTURE &amp; TOOL DIRECTORY</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-5">
          Complete Site Directory &amp; Offline PDF Tool Index
        </h1>
        <p class="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mx-auto">
          Browse every client-side WebAssembly PDF utility, cryptographic verification hub, regulatory compliance benchmark, industry workflow guide, and engineering deep dive on PrintSign.org. Every tool executes 100% locally in browser RAM with zero server uploads.
        </p>

        <!-- Quick Jump Pills -->
        <div class="mt-8 flex flex-wrap items-center justify-center gap-2.5 text-xs font-semibold">
          <a href="#pdf-tools" class="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 transition">
            PDF Tools ({{ toolRoutes.length }})
          </a>
          <a href="#compliance-hubs" class="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-emerald-300 transition">
            Compliance &amp; Audit ({{ complianceRoutes.length }})
          </a>
          <a href="#industry-solutions" class="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-indigo-300 transition">
            Industry Hubs ({{ industryRoutes.length }})
          </a>
          <a href="#core-pages" class="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-300 transition">
            Core &amp; Legal ({{ coreRoutes.length }})
          </a>
          <a href="#engineering-blogs" class="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-amber-300 transition">
            Engineering Blogs ({{ blogs.length }})
          </a>
        </div>
      </header>

      <!-- 1. All Client-Side PDF Tools -->
      <section id="pdf-tools" class="mb-14">
        <div class="flex items-center justify-between gap-4 mb-6 pb-3 border-b border-slate-800">
          <div>
            <h2 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <Wrench class="w-5 h-5 text-cyan-400" />
              <span>1. All 100% Client-Side PDF Tools ({{ toolRoutes.length }})</span>
            </h2>
            <p class="text-xs text-slate-400 mt-1">Local WebAssembly utilities running purely in browser memory with zero network transfer.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <router-link
            v-for="item in toolRoutes"
            :key="item.path"
            :to="item.path"
            class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-900 transition flex flex-col justify-between group"
          >
            <div>
              <div class="flex items-center justify-between gap-2 mb-1.5">
                <h3 class="text-sm font-bold text-white group-hover:text-cyan-400 transition">{{ item.title }}</h3>
                <span class="text-[10px] font-mono text-cyan-400/80">{{ item.path }}</span>
              </div>
              <p class="text-xs text-slate-400 leading-relaxed">{{ item.desc }}</p>
            </div>
            <div class="mt-3 text-[11px] font-semibold text-cyan-400 flex items-center gap-1">
              <span>Open Tool</span>
              <ArrowRight class="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </router-link>
        </div>
      </section>

      <!-- 2. Compliance & Security Benchmarks -->
      <section id="compliance-hubs" class="mb-14">
        <div class="flex items-center justify-between gap-4 mb-6 pb-3 border-b border-slate-800">
          <div>
            <h2 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <ShieldCheck class="w-5 h-5 text-emerald-400" />
              <span>2. Compliance Benchmarks &amp; Cryptographic Audit Hubs ({{ complianceRoutes.length }})</span>
            </h2>
            <p class="text-xs text-slate-400 mt-1">Independent verification tools and regulatory sanitization architectures.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <router-link
            v-for="item in complianceRoutes"
            :key="item.path"
            :to="item.path"
            class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-900 transition flex flex-col justify-between group"
          >
            <div>
              <div class="flex items-center justify-between gap-2 mb-1.5">
                <h3 class="text-sm font-bold text-white group-hover:text-emerald-400 transition">{{ item.title }}</h3>
                <span class="text-[10px] font-mono text-emerald-400/80">{{ item.path }}</span>
              </div>
              <p class="text-xs text-slate-400 leading-relaxed">{{ item.desc }}</p>
            </div>
            <div class="mt-3 text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <span>Inspect Benchmark</span>
              <ArrowRight class="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </router-link>
        </div>
      </section>

      <!-- 3. Tailored Industry Role Hubs -->
      <section id="industry-solutions" class="mb-14">
        <div class="flex items-center justify-between gap-4 mb-6 pb-3 border-b border-slate-800">
          <div>
            <h2 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <Briefcase class="w-5 h-5 text-indigo-400" />
              <span>3. Tailored Industry Role Hubs ({{ industryRoutes.length }})</span>
            </h2>
            <p class="text-xs text-slate-400 mt-1">Role-specific redaction workflows built for regulated legal, healthcare, investigative, and financial teams.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <router-link
            v-for="item in industryRoutes"
            :key="item.path"
            :to="item.path"
            class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-900 transition flex flex-col justify-between group"
          >
            <div>
              <div class="flex items-center justify-between gap-2 mb-1.5">
                <h3 class="text-sm font-bold text-white group-hover:text-indigo-400 transition">{{ item.title }}</h3>
                <span class="text-[10px] font-mono text-indigo-400/80">{{ item.path }}</span>
              </div>
              <p class="text-xs text-slate-400 leading-relaxed">{{ item.desc }}</p>
            </div>
            <div class="mt-3 text-[11px] font-semibold text-indigo-400 flex items-center gap-1">
              <span>Explore Role Workflow</span>
              <ArrowRight class="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </router-link>
        </div>
      </section>

      <!-- 4. Core Pages, Documentation & Legal -->
      <section id="core-pages" class="mb-14">
        <div class="flex items-center justify-between gap-4 mb-6 pb-3 border-b border-slate-800">
          <div>
            <h2 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <FileText class="w-5 h-5 text-slate-300" />
              <span>4. Core Pages, Documentation &amp; Legal ({{ coreRoutes.length }})</span>
            </h2>
            <p class="text-xs text-slate-400 mt-1">Platform overview, security documentation, FAQs, guides, and privacy policies.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <router-link
            v-for="item in coreRoutes"
            :key="item.path"
            :to="item.path"
            class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-600 hover:bg-slate-900 transition flex flex-col justify-between group"
          >
            <div>
              <div class="flex items-center justify-between gap-2 mb-1.5">
                <h3 class="text-sm font-bold text-white group-hover:text-cyan-300 transition">{{ item.title }}</h3>
                <span class="text-[10px] font-mono text-slate-400">{{ item.path }}</span>
              </div>
              <p class="text-xs text-slate-400 leading-relaxed">{{ item.desc }}</p>
            </div>
          </router-link>
        </div>
      </section>

      <!-- 5. Engineering & Compliance Blog Guides -->
      <section id="engineering-blogs" class="mb-14">
        <div class="flex items-center justify-between gap-4 mb-6 pb-3 border-b border-slate-800">
          <div>
            <h2 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <BookOpen class="w-5 h-5 text-amber-400" />
              <span>5. Engineering &amp; Compliance Knowledge Base ({{ blogs.length }})</span>
            </h2>
            <p class="text-xs text-slate-400 mt-1">Technical guides covering WebAssembly PDF parsing, DPI rasterization, redaction forensics, and regulatory frameworks.</p>
          </div>
          <router-link to="/blog" class="text-xs font-bold text-amber-400 hover:text-amber-300 shrink-0">
            Browse Blog Index →
          </router-link>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <router-link
            v-for="post in blogs"
            :key="post.id"
            :to="`/blog/${post.slug}`"
            class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900 transition flex flex-col justify-between group"
          >
            <div>
              <div class="flex items-center justify-between gap-2 mb-1.5">
                <span class="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {{ post.category }}
                </span>
                <span class="text-[10px] text-slate-500">{{ post.readTime }}</span>
              </div>
              <h3 class="text-sm font-bold text-white group-hover:text-amber-300 transition leading-snug mb-1.5">
                {{ post.title }}
              </h3>
              <p class="text-xs text-slate-400 leading-relaxed line-clamp-2">{{ post.excerpt }}</p>
            </div>
          </router-link>
        </div>
      </section>

      <!-- Deep Technical Overview (SEO Content Section) -->
      <SeoContentSection routePath="/sitemap" />
    </main>

    <!-- Website Footer -->
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { useRouteSeo } from '../config/seoMetadata'
import { blogs } from '../data/blogs'
import SiteNavbar from '../components/website/SiteNavbar.vue'
import SiteFooter from '../components/website/SiteFooter.vue'
import ToolTrustBar from '../components/common/ToolTrustBar.vue'
import SeoContentSection from '../components/website/SeoContentSection.vue'
import {
  Map as MapIcon,
  Wrench,
  ShieldCheck,
  Briefcase,
  FileText,
  BookOpen,
  ArrowRight
} from 'lucide-vue-next'

useRouteSeo('/sitemap')

const toolRoutes = [
  { path: '/redact-pdf', title: 'Redact PDF (300 DPI Pixel Burn)', desc: 'Permanently destroy confidential text and burn redactions into 300 DPI raster images offline.' },
  { path: '/scrub-pdf-metadata', title: 'Scrub PDF Metadata', desc: 'Strip Info dictionaries, XMP XML streams, author tags, and internal file paths locally.' },
  { path: '/sign-pdf', title: 'Sign PDF Offline', desc: 'Draw, type, or upload handwritten signatures onto contracts purely inside browser RAM.' },
  { path: '/unlock-decrypt-pdf', title: 'Unlock & Decrypt PDF', desc: 'Remove PDF owner restrictions or unlock password-protected files offline without cloud uploads.' },
  { path: '/watermark-pdf', title: 'Watermark & Bates Stamp PDF', desc: 'Apply custom Confidential text stamps, Bates numbers, and diagonal security overlays locally.' },
  { path: '/extract-pdf-pages', title: 'Extract PDF Pages', desc: 'Pull individual pages or custom page ranges into clean standalone PDF documents in memory.' },
  { path: '/merge-pdf', title: 'Merge PDFs Locally', desc: 'Combine multiple multi-page PDF exhibits into one organized packet with zero upload limits.' },
  { path: '/split-pdf', title: 'Split PDF Pages', desc: 'Divide large PDF documents into separate page ranges or single-page archives offline.' },
  { path: '/flatten-rasterize-pdf', title: 'Flatten & Rasterize PDF', desc: 'Convert interactive annotations, forms, and layers into static immutable pixel PDFs.' },
  { path: '/reorder-rotate-pdf', title: 'Reorder & Rotate PDF', desc: 'Visually rearrange page order, fix scanned orientations, and delete unwanted pages offline.' },
  { path: '/compress-pdf', title: 'Compress PDF (Lossless / DPI)', desc: 'Shrink PDF file sizes using local WebAssembly object-stream and DPI downsampling pipelines.' },
  { path: '/editor', title: 'Full PDF Sanitization Workspace', desc: 'All-in-one browser RAM workspace combining editing, redaction, signing, and scrubbing.' },
  { path: '/general-editor', title: 'General Offline PDF Editor', desc: 'Full-featured free desktop-grade PDF editing suite inside an offline-capable PWA.' }
]

const complianceRoutes = [
  { path: '/verify-redaction', title: 'PDF Redaction Verifier & SHA-256 Audit', desc: 'Inspect sanitized PDFs for leaked text beneath black boxes and generate SHA-256 certificates.' },
  { path: '/f12-network-audit', title: 'F12 Zero-Upload Network Audit', desc: 'Step-by-step protocol and test instructions to verify zero outbound HTTP requests via DevTools.' },
  { path: '/hipaa-compliant-pdf-redaction', title: 'HIPAA Safe Harbor PDF Redaction', desc: 'Remove all 18 HIPAA PHI identifiers locally without requiring a third-party BAA.' },
  { path: '/nist-800-88-pdf-sanitization', title: 'NIST SP 800-88 PDF Sanitization', desc: 'Align document purge workflows with federal cryptographic sanitization and verification standards.' },
  { path: '/gdpr-article-32-pdf-compliance', title: 'GDPR Article 32 Document Security', desc: 'Satisfy EU GDPR privacy-by-design and security-of-processing obligations using zero-cloud tools.' },
  { path: '/foia-document-redaction-tool', title: 'FOIA & Public Records Redactor', desc: 'Prevent government and municipal FOIA redaction leaks caused by unflattened overlay boxes.' },
  { path: '/ilovepdf-smallpdf-offline-alternative', title: 'iLovePDF & Smallpdf Offline Alternative', desc: 'Architectural comparison showing why local WebAssembly outperforms server-side PDF converters.' }
]

const industryRoutes = [
  { path: '/for-lawyers', title: 'For Lawyers & Legal Discovery Teams', desc: 'FRCP Rule 5.2 and ABA Model Rule 1.6 defensible eDiscovery redaction and Bates preparation.' },
  { path: '/for-healthcare', title: 'For Healthcare & Medical Teams', desc: 'Client-side PHI redaction and clinical record de-identification with zero BAA risk.' },
  { path: '/for-journalists', title: 'For Journalists & Whistleblowers', desc: 'Air-gapped document scrubbing for FOIA disclosures, printer tracking dot defense, and XMP removal.' },
  { path: '/for-finance-accounting', title: 'For Finance, Tax & CPA Teams', desc: 'Local bank statement, W-2, 1099, and M&A due diligence sanitization with zero cloud storage.' }
]

const coreRoutes = [
  { path: '/', title: 'PrintSign.org Homepage', desc: 'Zero-cloud client-side PDF redactor, metadata scrubber, and offline PWA overview.' },
  { path: '/features', title: 'Zero-Cloud Security Architecture & Features', desc: 'Technical breakdown of PrintSign memory execution, Web Crypto hashing, and offline PWA support.' },
  { path: '/security-architecture', title: 'Client-Side Security Architecture', desc: 'Detailed engineering specification of PrintSign offline isolation and rasterization pipelines.' },
  { path: '/guides', title: 'Step-by-Step User Guides', desc: 'Practical walkthroughs for legal redaction, medical PHI de-identification, and metadata erasure.' },
  { path: '/faq', title: 'Frequently Asked Questions', desc: 'Technical answers on browser memory limits, redaction permanence, and open verification.' },
  { path: '/blog', title: 'Engineering & Compliance Blog', desc: 'Curated library of 18 technical guides on PDF internals, DPI math, and privacy regulations.' },
  { path: '/about-us', title: 'About PrintSign.org', desc: 'Mission, open-architecture transparency, and commitment to zero-tracking document privacy.' },
  { path: '/contact-us', title: 'Contact & Security Disclosures', desc: 'Reach the engineering team for vulnerability reports, compliance questions, or support.' },
  { path: '/privacy-policy', title: 'Zero-Collection Privacy Policy', desc: 'Transparent statement confirming zero document collection, zero telemetry, and zero ad networks.' },
  { path: '/terms-of-service', title: 'Terms of Service', desc: 'Usage terms for the free client-side PrintSign web application and offline PWA.' },
  { path: '/cookie-policy', title: 'Cookie & Local Storage Policy', desc: 'Explanation of strictly functional offline PWA caching without tracking cookies.' },
  { path: '/sitemap', title: 'HTML Site Directory (/sitemap)', desc: 'Complete human- and crawler-accessible index of all 54 pre-rendered PrintSign pages.' }
]
</script>
