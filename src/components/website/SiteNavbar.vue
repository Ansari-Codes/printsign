<template>
  <header class="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80 select-none">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      <!-- Brand Logo -->
      <router-link
        to="/"
        class="flex items-center gap-3 group focus:outline-hidden"
      >
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-cyan-500/25 group-hover:scale-105 transition-transform">
          <ShieldCheck class="w-5 h-5" />
        </div>
        <div class="flex flex-col text-left">
          <div class="flex items-center gap-2">
            <span class="text-base font-extrabold text-white tracking-tight leading-none">PrintSign</span>
            <span class="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              Client-Side
            </span>
          </div>
          <span class="text-[11px] text-slate-300 font-medium">Zero-Cloud PDF Editor & Redactor</span>
        </div>
      </router-link>

      <!-- Desktop Navigation Links -->
      <nav class="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-2xl border border-slate-800/60 text-xs font-semibold">
        <router-link
          to="/"
          class="px-3 py-1.5 rounded-xl transition text-slate-400 hover:text-white"
          active-class="bg-slate-800 !text-white shadow-xs"
        >
          Overview
        </router-link>
        <router-link
          to="/features"
          class="px-3 py-1.5 rounded-xl transition text-slate-400 hover:text-white"
          active-class="bg-slate-800 !text-white shadow-xs"
        >
          Features
        </router-link>
        <router-link
          to="/guides"
          class="px-3 py-1.5 rounded-xl transition text-slate-400 hover:text-white"
          active-class="bg-slate-800 !text-white shadow-xs"
        >
          Knowledge Base
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
        <router-link
          to="/about-us"
          class="px-3 py-1.5 rounded-xl transition text-slate-400 hover:text-white"
          active-class="bg-slate-800 !text-white shadow-xs"
        >
          About Us
        </router-link>
        <router-link
          to="/contact-us"
          class="px-3 py-1.5 rounded-xl transition text-slate-400 hover:text-white"
          active-class="bg-slate-800 !text-white shadow-xs"
        >
          Contact
        </router-link>
        <router-link
          to="/privacy-policy"
          class="px-3 py-1.5 rounded-xl transition text-slate-400 hover:text-white"
          active-class="bg-slate-800 !text-white shadow-xs"
        >
          Privacy Policy
        </router-link>
      </nav>

      <!-- Right Action Items -->
      <div class="flex items-center gap-3">
        <!-- Live Air-Gap Network Status Pill with Interactive Tooltip -->
        <div class="relative group/network">
          <button
            type="button"
            @click="showNetworkTooltip = !showNetworkTooltip"
            class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer select-none"
            :class="[
              isOffline
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/10 animate-pulse'
                : 'bg-slate-900/80 border border-cyan-500/30 text-cyan-300 hover:border-cyan-400/50'
            ]"
            :title="isOffline ? 'Air-Gap Mode Active: No network connection' : 'Local RAM Mode: Disconnect Wi-Fi to test offline'"
            aria-label="Network Air-Gap Status"
          >
            <span v-if="!isOffline" class="flex h-2 w-2 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <ShieldCheck v-else class="w-3.5 h-3.5 text-emerald-400" />
            <span class="text-[11px]">
              {{ isOffline ? '🛡️ Air-Gap Active • 0 Network Connection' : '🟢 Local RAM Mode • Air-Gap Ready' }}
            </span>
          </button>

          <!-- Interactive Tooltip Popover (on click or hover) -->
          <div
            v-if="showNetworkTooltip"
            class="absolute top-full mt-2 right-0 w-72 p-3.5 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-2xl z-50 text-left text-xs text-slate-300"
          >
            <div class="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-800">
              <div class="flex items-center gap-1.5 font-bold text-white">
                <ShieldCheck class="w-4 h-4 text-cyan-400" />
                <span>{{ isOffline ? 'Air-Gap Offline Active' : 'Zero-Network Architecture' }}</span>
              </div>
              <button
                type="button"
                @click.stop="showNetworkTooltip = false"
                class="text-slate-400 hover:text-white text-xs"
              >✕</button>
            </div>
            <p class="leading-relaxed text-[11px] text-slate-300 mb-2">
              PrintSign executes 100% in browser RAM. Disconnect your Wi-Fi or press <strong>F12 → Network</strong> to verify zero data transmission.
            </p>
            <div class="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] text-cyan-400 font-mono">
              Status: {{ isOffline ? 'OFFLINE (Air-Gapped)' : 'ONLINE (PWA Pre-cached)' }}
            </div>
          </div>
        </div>

        <!-- GitHub Button -->
        <a
          href="https://github.com/Ansari-Codes/printsign"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-medium rounded-xl border border-slate-700 hover:border-slate-600 transition shadow-xs"
          title="View source on GitHub"
          aria-label="GitHub Repository"
        >
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          <span class="hidden sm:inline">GitHub</span>
        </a>

        <!-- Open File Input Button -->
        <label class="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-medium rounded-xl border border-slate-700 hover:border-cyan-500/40 transition shadow-xs">
          <FolderOpen class="w-3.5 h-3.5 text-cyan-400" />
          <span>Open PDF</span>
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
          class="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-500/20 transition active:scale-98"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
          <span>Return to Editor</span>
        </router-link>
        <router-link
          v-else
          to="/editor"
          class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-500/20 transition active:scale-98"
        >
          <LayoutDashboard class="w-3.5 h-3.5" />
          <span>Launch Editor</span>
        </router-link>

        <!-- Mobile Menu Toggle Button -->
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          aria-label="Toggle Navigation Menu"
        >
          <Menu v-if="!isMobileMenuOpen" class="w-5 h-5" />
          <X v-else class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Dropdown -->
    <div
      v-if="isMobileMenuOpen"
      class="lg:hidden bg-[#090e1a] border-b border-slate-800 px-4 py-4 space-y-2 select-none"
    >
      <router-link
        to="/"
        @click="isMobileMenuOpen = false"
        class="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
      >
        Overview
      </router-link>
      <router-link
        to="/features"
        @click="isMobileMenuOpen = false"
        class="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
      >
        Features & Specifications
      </router-link>
      <router-link
        to="/guides"
        @click="isMobileMenuOpen = false"
        class="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
      >
        Knowledge Base
      </router-link>
      <router-link
        to="/blog"
        @click="isMobileMenuOpen = false"
        class="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
      >
        Blog & Guides
      </router-link>
      <router-link
        to="/faq"
        @click="isMobileMenuOpen = false"
        class="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
      >
        Frequently Asked Questions
      </router-link>
      <router-link
        to="/about-us"
        @click="isMobileMenuOpen = false"
        class="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
      >
        About Us & Mission
      </router-link>
      <router-link
        to="/contact-us"
        @click="isMobileMenuOpen = false"
        class="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
      >
        Contact Support
      </router-link>
      <router-link
        to="/privacy-policy"
        @click="isMobileMenuOpen = false"
        class="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
      >
        Privacy Policy
      </router-link>
      <router-link
        to="/terms-of-service"
        @click="isMobileMenuOpen = false"
        class="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
      >
        Terms of Service
      </router-link>
      <router-link
        to="/cookie-policy"
        @click="isMobileMenuOpen = false"
        class="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
      >
        Cookie Policy
      </router-link>
      <a
        href="https://github.com/Ansari-Codes/printsign"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
      >
        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
        <span>GitHub Repository</span>
      </a>

      <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <span v-if="isOffline" class="text-xs text-emerald-300 font-semibold flex items-center gap-1">
          <ShieldCheck class="w-3.5 h-3.5 text-emerald-400" />
          <span>🛡️ Air-Gap Active (0 Net)</span>
        </span>
        <span v-else class="text-xs text-cyan-300 font-medium flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>🟢 Local RAM • Air-Gap Ready</span>
        </span>
        <router-link
          to="/editor"
          @click="isMobileMenuOpen = false"
          class="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md"
        >
          Open Editor
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ShieldCheck,
  FolderOpen,
  LayoutDashboard,
  Menu,
  X
} from 'lucide-vue-next'
import { usePdfStore } from '../../stores/pdfStore'

const emit = defineEmits<{
  (e: 'file-loaded'): void
}>()

const router = useRouter()
const pdfStore = usePdfStore()
const isMobileMenuOpen = ref(false)
const isOffline = ref(!navigator.onLine)
const showNetworkTooltip = ref(false)

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
