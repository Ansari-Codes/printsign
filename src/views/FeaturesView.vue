<template>
  <div class="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
    <!-- Navbar -->
    <SiteNavbar />

    <main class="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <!-- Dedicated Features Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-4">
          <span>COMPREHENSIVE SPECIFICATION</span>
        </div>
        <h1 class="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Client-Side PDF Features & Capabilities
        </h1>
        <p class="text-base sm:text-lg text-slate-400 leading-relaxed">
          Explore all the modules powered by Mozilla PDF.js, PDF-Lib, and dedicated Web Workers running securely inside your browser sandbox.
        </p>
      </div>

      <!-- AdSense Unit (Top) -->
      <AdSenseSlot
        slot-name="Features Top Leaderboard"
        format="horizontal"
        description="Google AdSense high-visibility responsive display unit."
      />

      <!-- Features Grid Component -->
      <FeaturesSection
        @navigate="handleNavigate"
        @open-redact-guide="router.push('/guides')"
        @open-metadata-guide="router.push('/guides')"
      />

      <!-- Architecture Comparison Section -->
      <div class="mt-16 border-t border-slate-800/80 pt-16">
        <ArchitectureSection />
      </div>

      <!-- Quick Launch Bar -->
      <div class="mt-16 p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-indigo-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 class="text-xl font-bold text-white mb-1">Ready to test these features?</h2>
          <p class="text-xs text-slate-400">Launch the 100% client-side editor with zero registration.</p>
        </div>
        <router-link
          to="/editor"
          class="px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-cyan-500/20 transition active:scale-98 whitespace-nowrap"
        >
          Open PDF Editor
        </router-link>
      </div>

      <!-- AdSense Unit (Bottom) -->
      <AdSenseSlot
        slot-name="Features Bottom Unit"
        format="horizontal"
        description="Google AdSense compliant responsive footer banner."
      />
    </main>

    <!-- Footer -->
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import SiteNavbar from '../components/website/SiteNavbar.vue'
import SiteFooter from '../components/website/SiteFooter.vue'
import FeaturesSection from '../components/website/FeaturesSection.vue'
import ArchitectureSection from '../components/website/ArchitectureSection.vue'
import AdSenseSlot from '../components/website/AdSenseSlot.vue'

const router = useRouter()

function handleNavigate(view: string) {
  if (view === 'editor') {
    router.push('/editor')
  } else if (view === 'architecture') {
    document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>
