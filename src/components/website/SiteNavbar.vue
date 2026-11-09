<template>
  <header class="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80 select-none">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
      <!-- Brand Logo -->
      <router-link
        to="/"
        class="flex items-center gap-2.5 sm:gap-3 group focus:outline-hidden shrink-0"
      >
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-cyan-500/25 group-hover:scale-105 transition-transform">
          <ShieldCheck class="w-5 h-5" />
        </div>
        <div class="flex flex-col text-left">
          <div class="flex items-center gap-1.5">
            <span class="text-base font-extrabold text-white tracking-tight leading-none">PrintSign</span>
            <span class="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              Client-Side
            </span>
          </div>
          <span class="hidden sm:block text-[11px] text-slate-400 font-medium leading-tight mt-0.5">Zero-Cloud PDF Suite</span>
        </div>
      </router-link>

      <!-- Desktop Navigation Links (Clean & Uncluttered) -->
      <nav class="hidden xl:flex items-center gap-1 bg-slate-900/60 p-1 rounded-2xl border border-slate-800/60 text-xs font-semibold">
        <router-link
          to="/"
          class="px-3 py-1.5 rounded-xl transition text-slate-400 hover:text-white"
          active-class="bg-slate-800 !text-white shadow-xs"
        >
          Overview
        </router-link>

        <!-- Tools Dropdown Menu -->
        <div class="relative" @mouseenter="isToolsOpen = true" @mouseleave="isToolsOpen = false">
          <button
            type="button"
            class="px-3 py-1.5 rounded-xl transition text-slate-400 hover:text-white flex items-center gap-1 focus:outline-hidden"
            :class="{ 'bg-slate-800 !text-white': isToolsOpen || isToolRouteActive }"
          >
            <span>Tools</span>
            <ChevronDown class="w-3.5 h-3.5 transition-transform" :class="{ 'rotate-180': isToolsOpen }" />
          </button>

          <!-- Dropdown Popover -->
          <div
            v-if="isToolsOpen"
            class="absolute top-full left-0 mt-1.5 w-80 p-2.5 rounded-2xl bg-[#090e1a] border border-slate-700/80 shadow-2xl shadow-black/80 grid grid-cols-2 gap-1.5 z-50 text-left"
          >
            <router-link
              to="/redact-pdf"
              @click="isToolsOpen = false"
              class="p-2 rounded-xl hover:bg-slate-800/70 transition flex flex-col gap-0.5 text-slate-200 hover:text-white"
            >
              <span class="font-bold text-xs flex items-center gap-1.5 text-cyan-300">
                <Eraser class="w-3.5 h-3.5 text-cyan-400" />
                <span>Redact PDF</span>
              </span>
              <span class="text-[10px] text-slate-400">300 DPI pixel burn-in</span>
            </router-link>

            <router-link
              to="/verify-redaction"
              @click="isToolsOpen = false"
              class="p-2 rounded-xl hover:bg-slate-800/70 transition flex flex-col gap-0.5 text-slate-200 hover:text-white"
            >
              <span class="font-bold text-xs flex items-center gap-1.5 text-emerald-300">
                <ShieldCheck class="w-3.5 h-3.5 text-emerald-400" />
                <span>Verifier</span>
              </span>
              <span class="text-[10px] text-slate-400">Pre-filing audit</span>
            </router-link>

            <router-link
              to="/scrub-pdf-metadata"
              @click="isToolsOpen = false"
              class="p-2 rounded-xl hover:bg-slate-800/70 transition flex flex-col gap-0.5 text-slate-200 hover:text-white"
            >
              <span class="font-bold text-xs flex items-center gap-1.5 text-cyan-300">
                <FileText class="w-3.5 h-3.5 text-cyan-400" />
                <span>Scrub Metadata</span>
              </span>
              <span class="text-[10px] text-slate-400">XMP &amp; Info stripper</span>
            </router-link>

            <router-link
              to="/merge-pdf"
              @click="isToolsOpen = false"
              class="p-2 rounded-xl hover:bg-slate-800/70 transition flex flex-col gap-0.5 text-slate-200 hover:text-white"
            >
              <span class="font-bold text-xs flex items-center gap-1.5 text-cyan-300">
                <Layers class="w-3.5 h-3.5 text-cyan-400" />
                <span>Merge PDFs</span>
              </span>
              <span class="text-[10px] text-slate-400">Zero-upload join</span>
            </router-link>

            <router-link
              to="/split-pdf"
              @click="isToolsOpen = false"
              class="p-2 rounded-xl hover:bg-slate-800/70 transition flex flex-col gap-0.5 text-slate-200 hover:text-white"
            >
              <span class="font-bold text-xs flex items-center gap-1.5 text-cyan-300">
                <Scissors class="w-3.5 h-3.5 text-cyan-400" />
                <span>Split PDF</span>
              </span>
              <span class="text-[10px] text-slate-400">Extract page ranges</span>
            </router-link>

            <router-link
              to="/flatten-rasterize-pdf"
              @click="isToolsOpen = false"
              class="p-2 rounded-xl hover:bg-slate-800/70 transition flex flex-col gap-0.5 text-slate-200 hover:text-white"
            >
              <span class="font-bold text-xs flex items-center gap-1.5 text-cyan-300">
                <Sparkles class="w-3.5 h-3.5 text-cyan-400" />
                <span>Flatten &amp; Raster</span>
              </span>
              <span class="text-[10px] text-slate-400">Lock annotations</span>
            </router-link>

            <router-link
              to="/reorder-rotate-pdf"
              @click="isToolsOpen = false"
              class="p-2 rounded-xl hover:bg-slate-800/70 transition flex flex-col gap-0.5 text-slate-200 hover:text-white"
            >
              <span class="font-bold text-xs flex items-center gap-1.5 text-cyan-300">
                <RotateCcw class="w-3.5 h-3.5 text-cyan-400" />
                <span>Rotate &amp; Organize</span>
              </span>
              <span class="text-[10px] text-slate-400">Page tree sorting</span>
            </router-link>

            <router-link
              to="/compress-pdf"
              @click="isToolsOpen = false"
              class="p-2 rounded-xl hover:bg-slate-800/70 transition flex flex-col gap-0.5 text-slate-200 hover:text-white"
            >
              <span class="font-bold text-xs flex items-center gap-1.5 text-cyan-300">
                <Sliders class="w-3.5 h-3.5 text-cyan-400" />
                <span>Compress PDF</span>
              </span>
              <span class="text-[10px] text-slate-400">Lossless Deflate</span>
            </router-link>
          </div>
        </div>

        <router-link
          to="/verify-redaction"
          class="px-3 py-1.5 rounded-xl transition text-slate-400 hover:text-white flex items-center gap-1.5"
          active-class="bg-slate-800 !text-white shadow-xs"
        >
          <span>Verifier</span>
          <span class="px-1 py-0.2 rounded text-[9px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">Audit</span>
        </router-link>

        <router-link
          to="/f12-network-audit"
          class="px-3 py-1.5 rounded-xl transition text-slate-400 hover:text-white"
          active-class="bg-slate-800 !text-white shadow-xs"
        >
          F12 Audit
        </router-link>

        <router-link
          to="/guides"
          class="px-3 py-1.5 rounded-xl transition text-slate-400 hover:text-white"
          active-class="bg-slate-800 !text-white shadow-xs"
        >
          Guides
        </router-link>

        <router-link
          to="/blog"
          class="px-3 py-1.5 rounded-xl transition text-slate-400 hover:text-white"
          active-class="bg-slate-800 !text-white shadow-xs"
        >
          Blog
        </router-link>

        <router-link
          to="/faq"
          class="px-3 py-1.5 rounded-xl transition text-slate-400 hover:text-white"
          active-class="bg-slate-800 !text-white shadow-xs"
        >
          FAQ
        </router-link>
      </nav>

      <!-- Right Action Items -->
      <div class="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <!-- Sleek Air-Gap Network Status Pill -->
        <div class="relative">
          <button
            type="button"
            @click="showNetworkTooltip = !showNetworkTooltip"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer select-none"
            :class="[
              isOffline
                ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/10 animate-pulse'
                : 'bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:text-white hover:border-cyan-500/40'
            ]"
            :title="isOffline ? 'Air-Gap Mode Active: No network connection' : 'Local RAM Mode: Disconnect Wi-Fi to test offline'"
            aria-label="Network Air-Gap Status"
          >
            <span v-if="!isOffline" class="flex h-2 w-2 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <ShieldCheck v-else class="w-3.5 h-3.5 text-emerald-400" />
            <span class="text-[11px] font-medium hidden sm:inline">
              {{ isOffline ? 'Air-Gap Active' : 'Offline Ready' }}
            </span>
          </button>

          <!-- Interactive Tooltip Popover -->
          <div
            v-if="showNetworkTooltip"
            class="absolute top-full mt-2 right-0 w-72 p-3.5 rounded-2xl bg-[#090e1a] border border-cyan-500/40 shadow-2xl z-50 text-left text-xs text-slate-300"
          >
            <div class="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-800">
              <div class="flex items-center gap-1.5 font-bold text-white">
                <ShieldCheck class="w-4 h-4 text-cyan-400" />
                <span>{{ isOffline ? 'Air-Gap Offline Active' : 'Zero-Network Architecture' }}</span>
              </div>
              <button
                type="button"
                @click.stop="showNetworkTooltip = false"
                class="text-slate-400 hover:text-white text-xs px-1"
              >✕</button>
            </div>
            <p class="leading-relaxed text-[11px] text-slate-300 mb-2.5">
              PrintSign executes 100% in browser RAM. Disconnect your Wi-Fi or press <strong>F12 → Network</strong> to verify zero remote API calls.
            </p>
            <div class="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-cyan-400 font-mono">
              Status: {{ isOffline ? 'OFFLINE (Air-Gapped Sandbox)' : 'ONLINE (PWA Pre-cached)' }}
            </div>
          </div>
        </div>

        <!-- GitHub Repository Button -->
        <a
          href="https://github.com/Ansari-Codes/printsign"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-slate-800 hover:border-slate-700 transition"
          title="Open-source repository on GitHub"
          aria-label="GitHub Repository"
        >
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          <span class="hidden md:inline">GitHub</span>
        </a>

        <!-- Open File Input Button -->
        <label class="cursor-pointer inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-semibold rounded-xl border border-slate-700 hover:border-cyan-500/40 transition">
          <FolderOpen class="w-3.5 h-3.5 text-cyan-400" />
          <span class="hidden xs:inline sm:inline">Open PDF</span>
          <input
            type="file"
            accept="application/pdf"
            multiple
            class="hidden"
            @change="handleFileInput"
          />
        </label>

        <!-- Toggle to Editor Button -->
        <router-link
          v-if="pdfStore.activeDocument"
          to="/editor"
          class="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-500/20 transition active:scale-98"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
          <span>Editor</span>
        </router-link>
        <router-link
          v-else
          to="/editor"
          class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-500/20 transition active:scale-98"
        >
          <LayoutDashboard class="w-3.5 h-3.5" />
          <span>Launch Editor</span>
        </router-link>

        <!-- Mobile Menu Toggle Button -->
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="xl:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition focus:outline-hidden"
          aria-label="Toggle Navigation Menu"
        >
          <Menu v-if="!isMobileMenuOpen" class="w-5 h-5" />
          <X v-else class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Drawer (Uncluttered, Grouped & Modern) -->
    <div
      v-if="isMobileMenuOpen"
      class="xl:hidden bg-[#070b14]/98 border-b border-slate-800 px-4 py-5 space-y-5 select-none max-h-[85vh] overflow-y-auto"
    >
      <!-- Quick Action Buttons -->
      <div class="grid grid-cols-2 gap-2 pb-2">
        <label class="cursor-pointer py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-center text-xs font-bold text-white flex items-center justify-center gap-2 transition">
          <FolderOpen class="w-4 h-4 text-cyan-400" />
          <span>Open PDF</span>
          <input
            type="file"
            accept="application/pdf"
            multiple
            class="hidden"
            @change="handleFileInput"
          />
        </label>

        <router-link
          to="/editor"
          @click="isMobileMenuOpen = false"
          class="py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-center text-xs font-bold text-white flex items-center justify-center gap-2 shadow-md transition"
        >
          <LayoutDashboard class="w-4 h-4" />
          <span>Launch Editor</span>
        </router-link>
      </div>

      <!-- Core Client-Side Tools Group -->
      <div class="space-y-2">
        <div class="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-1">
          Client-Side PDF Tools
        </div>
        <div class="grid grid-cols-2 gap-1.5">
          <router-link
            to="/redact-pdf"
            @click="isMobileMenuOpen = false"
            class="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs font-semibold text-slate-200 hover:text-white hover:border-cyan-500/30 transition flex items-center gap-2"
          >
            <Eraser class="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Redact PDF</span>
          </router-link>

          <router-link
            to="/verify-redaction"
            @click="isMobileMenuOpen = false"
            class="p-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/25 text-xs font-semibold text-emerald-300 hover:text-white transition flex items-center gap-2"
          >
            <ShieldCheck class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Audit Verifier</span>
          </router-link>

          <router-link
            to="/scrub-pdf-metadata"
            @click="isMobileMenuOpen = false"
            class="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs font-semibold text-slate-200 hover:text-white hover:border-cyan-500/30 transition flex items-center gap-2"
          >
            <FileText class="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Metadata Scrub</span>
          </router-link>

          <router-link
            to="/merge-pdf"
            @click="isMobileMenuOpen = false"
            class="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs font-semibold text-slate-200 hover:text-white hover:border-cyan-500/30 transition flex items-center gap-2"
          >
            <Layers class="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Merge PDFs</span>
          </router-link>

          <router-link
            to="/split-pdf"
            @click="isMobileMenuOpen = false"
            class="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs font-semibold text-slate-200 hover:text-white hover:border-cyan-500/30 transition flex items-center gap-2"
          >
            <Scissors class="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Split PDF</span>
          </router-link>

          <router-link
            to="/f12-network-audit"
            @click="isMobileMenuOpen = false"
            class="p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs font-semibold text-cyan-300 hover:text-white transition flex items-center gap-2"
          >
            <Activity class="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>F12 Audit</span>
          </router-link>
        </div>
      </div>

      <!-- Navigation & Resources Group -->
      <div class="space-y-1 pt-1">
        <div class="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-1 mb-1.5">
          Resources &amp; Trust
        </div>
        <div class="grid grid-cols-2 gap-1 text-xs font-medium text-slate-300">
          <router-link
            to="/"
            @click="isMobileMenuOpen = false"
            class="px-2.5 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
          >
            Overview
          </router-link>
          <router-link
            to="/features"
            @click="isMobileMenuOpen = false"
            class="px-2.5 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
          >
            Features
          </router-link>
          <router-link
            to="/guides"
            @click="isMobileMenuOpen = false"
            class="px-2.5 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
          >
            Knowledge Base
          </router-link>
          <router-link
            to="/blog"
            @click="isMobileMenuOpen = false"
            class="px-2.5 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
          >
            Engineering Blog
          </router-link>
          <router-link
            to="/faq"
            @click="isMobileMenuOpen = false"
            class="px-2.5 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
          >
            FAQ
          </router-link>
          <router-link
            to="/about-us"
            @click="isMobileMenuOpen = false"
            class="px-2.5 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
          >
            About Us
          </router-link>
          <router-link
            to="/contact-us"
            @click="isMobileMenuOpen = false"
            class="px-2.5 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
          >
            Contact
          </router-link>
          <router-link
            to="/privacy-policy"
            @click="isMobileMenuOpen = false"
            class="px-2.5 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
          >
            Privacy Policy
          </router-link>
        </div>
      </div>

      <!-- Air-Gap Status Footer Banner in Drawer -->
      <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span v-if="isOffline" class="text-emerald-300 font-semibold flex items-center gap-1.5">
          <ShieldCheck class="w-4 h-4 text-emerald-400" />
          <span>Air-Gap Active (0 Net)</span>
        </span>
        <span v-else class="text-slate-300 font-medium flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Offline Ready (Pre-cached)</span>
        </span>

        <a
          href="https://github.com/Ansari-Codes/printsign"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
        >
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          <span>GitHub</span>
        </a>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ShieldCheck,
  FolderOpen,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  Eraser,
  FileText,
  Layers,
  Scissors,
  Sparkles,
  RotateCcw,
  Sliders,
  Activity
} from 'lucide-vue-next'
import { usePdfStore } from '../../stores/pdfStore'

const emit = defineEmits<{
  (e: 'file-loaded'): void
}>()

const router = useRouter()
const route = useRoute()
const pdfStore = usePdfStore()

const isMobileMenuOpen = ref(false)
const isToolsOpen = ref(false)
const isOffline = ref(!navigator.onLine)
const showNetworkTooltip = ref(false)

const toolRoutes = [
  '/redact-pdf',
  '/verify-redaction',
  '/scrub-pdf-metadata',
  '/merge-pdf',
  '/split-pdf',
  '/flatten-rasterize-pdf',
  '/reorder-rotate-pdf',
  '/compress-pdf'
]

const isToolRouteActive = computed(() => {
  return toolRoutes.includes(route.path)
})

function handleOnline() {
  isOffline.value = false
}

function handleOffline() {
  isOffline.value = true
}

async function handleFileInput(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  for (let i = 0; i < target.files.length; i++) {
    await pdfStore.loadDocument(target.files[i])
  }
  emit('file-loaded')
  router.push('/editor')
  target.value = ''
  isMobileMenuOpen.value = false
}

onMounted(() => {
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})
</script>
