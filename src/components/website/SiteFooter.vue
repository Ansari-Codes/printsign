<template>
  <footer class="bg-[#050810] border-t border-slate-800/80 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-slate-400 select-none">
    <div class="max-w-7xl mx-auto">
      <!-- Main Columns Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 mb-12">
        <!-- Brand Description (Spans 2 cols on lg) -->
        <div class="lg:col-span-2 space-y-4">
          <router-link to="/" class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-cyan-500/20">
              <ShieldCheck class="w-5 h-5" />
            </div>
            <span class="text-lg font-bold text-white tracking-tight">PrintSign</span>
            <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              Client-Side
            </span>
          </router-link>

          <p class="text-xs text-slate-400 leading-relaxed max-w-sm">
            The private, zero-telemetry alternative to commercial cloud PDF editors. All parsing, rendering, redaction, and sanitization execute strictly inside your local browser memory sandbox.
          </p>

          <div class="flex items-center gap-2 pt-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Zero Network Exfiltration
            </span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-medium">
              Offline-First PWA
            </span>
          </div>
        </div>

        <!-- Col 1: Editor Tools -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold text-white uppercase tracking-wider">Document Tools</h4>
          <ul class="space-y-2 text-xs">
            <li>
              <router-link to="/redact-pdf" class="hover:text-cyan-400 transition">
                Permanent Redaction
              </router-link>
            </li>
            <li>
              <router-link to="/reorder-rotate-pdf" class="hover:text-cyan-400 transition">
                Page Reorder & Rotate
              </router-link>
            </li>
            <li>
              <router-link to="/split-pdf" class="hover:text-cyan-400 transition">
                Split PDF by Ranges
              </router-link>
            </li>
            <li>
              <router-link to="/merge-pdf" class="hover:text-cyan-400 transition">
                Merge Multiple PDFs
              </router-link>
            </li>
            <li>
              <router-link to="/scrub-pdf-metadata" class="hover:text-cyan-400 transition">
                Metadata & XMP Scrubber
              </router-link>
            </li>
            <li>
              <router-link to="/flatten-rasterize-pdf" class="hover:text-cyan-400 transition">
                High-DPI Rasterizer
              </router-link>
            </li>
            <li>
              <router-link to="/compress-pdf" class="hover:text-cyan-400 transition">
                Lossless PDF Compressor
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Col 2: Knowledge Base -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold text-white uppercase tracking-wider">Knowledge Base</h4>
          <ul class="space-y-2 text-xs">
            <li>
              <router-link to="/blog" class="text-cyan-400 font-semibold hover:text-cyan-300 transition">
                All Engineering Blogs (18)
              </router-link>
            </li>
            <li>
              <router-link to="/guides" class="hover:text-cyan-400 transition">
                Why Black Boxes Fail
              </router-link>
            </li>
            <li>
              <router-link to="/guides" class="hover:text-cyan-400 transition">
                In-Browser Web Workers
              </router-link>
            </li>
            <li>
              <router-link to="/guides" class="hover:text-cyan-400 transition">
                Sanitizing XMP Streams
              </router-link>
            </li>
            <li>
              <router-link to="/guides" class="hover:text-cyan-400 transition">
                NIST SP 800-88 Standards
              </router-link>
            </li>
            <li>
              <router-link to="/faq" class="hover:text-cyan-400 transition">
                Frequently Asked Questions
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Col 3: Governance & Legal -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold text-white uppercase tracking-wider">Company & Legal</h4>
          <ul class="space-y-2 text-xs">
            <li>
              <router-link to="/about-us" class="hover:text-cyan-400 transition">
                About Us & Mission
              </router-link>
            </li>
            <li>
              <router-link to="/contact-us" class="hover:text-cyan-400 transition">
                Contact & Support
              </router-link>
            </li>
            <li>
              <router-link to="/privacy-policy" class="hover:text-cyan-400 transition">
                Privacy Policy
              </router-link>
            </li>
            <li>
              <router-link to="/terms-of-service" class="hover:text-cyan-400 transition">
                Terms of Service
              </router-link>
            </li>
            <li>
              <router-link to="/cookie-policy" class="hover:text-cyan-400 transition">
                Cookie Policy & Consent
              </router-link>
            </li>
            <li>
              <router-link to="/features" class="hover:text-cyan-400 transition">
                Security Architecture
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          <span>© {{ currentYear }} PrintSign. 100% Client-side document utilities. No tracking, zero servers.</span>
        </div>

        <div class="flex items-center gap-6">
          <router-link to="/privacy-policy" class="hover:text-slate-300 transition">
            Privacy
          </router-link>
          <span>•</span>
          <router-link to="/terms-of-service" class="hover:text-slate-300 transition">
            Terms
          </router-link>
          <span>•</span>
          <router-link to="/cookie-policy" class="hover:text-slate-300 transition">
            Cookies
          </router-link>
          <span>•</span>
          <router-link to="/contact-us" class="hover:text-slate-300 transition">
            Contact
          </router-link>
          <span>•</span>
          <a
            href="https://github.com/Ansari-Codes/printsign"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-slate-300 transition"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ShieldCheck } from 'lucide-vue-next'

const currentYear = computed(() => new Date().getFullYear())
</script>
