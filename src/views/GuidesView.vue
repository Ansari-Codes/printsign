<template>
  <div class="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
    <!-- Navbar -->
    <SiteNavbar />

    <main class="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <!-- Dedicated Guides Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
          <span>KNOWLEDGE BASE & GUIDES</span>
        </div>
        <h1 class="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          PDF Security, Forensics & Redaction Guides
        </h1>
        <p class="text-base sm:text-lg text-slate-400 leading-relaxed">
          In-depth whitepapers and compliance tutorials covering PDF vector stream mechanics, metadata extraction, and court redaction mandates.
        </p>
      </div>


      <!-- Blog Section Component -->
      <BlogSection @navigate="handleNavigate" />

    </main>

    <!-- Footer -->
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import SiteNavbar from '../components/website/SiteNavbar.vue'
import SiteFooter from '../components/website/SiteFooter.vue'
import BlogSection from '../components/website/BlogSection.vue'

const router = useRouter()

function handleNavigate(view: string) {
  if (view === 'editor') {
    router.push('/editor')
  }
}
</script>
