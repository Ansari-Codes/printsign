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
        <!-- Offline Pill -->
        <div v-if="isOffline" class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <WifiOff class="w-3.5 h-3.5" />
          <span>Offline Mode Active</span>
        </div>
        <div v-else class="hidden xl:inline-flex items-center gap-1.5 text-xs text-slate-300">
          <Wifi class="w-3.5 h-3.5 text-emerald-400" />
          <span>PWA Precached</span>
        </div>

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

      <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <span v-if="isOffline" class="text-xs text-amber-400 flex items-center gap-1">
          <WifiOff class="w-3.5 h-3.5" />
          Offline Mode Active
        </span>
        <span v-else class="text-xs text-slate-400 flex items-center gap-1">
          <Wifi class="w-3.5 h-3.5 text-emerald-400" />
          PWA Offline Ready
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
  Wifi,
  WifiOff,
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
