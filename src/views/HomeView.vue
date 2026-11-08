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

      <section class="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-6">
          Explore Our Verified Dedicated Pages
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-center text-xs">
          <router-link
            to="/features"
            class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 hover:text-cyan-400 transition"
          >
            Features & Specs
          </router-link>
          <router-link
            to="/about-us"
            class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 hover:text-cyan-400 transition"
          >
            About Us & Mission
          </router-link>
          <router-link
            to="/contact-us"
            class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 hover:text-cyan-400 transition"
          >
            Contact Support
          </router-link>
          <router-link
            to="/privacy-policy"
            class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 hover:text-cyan-400 transition"
          >
            Privacy Policy
          </router-link>
          <router-link
            to="/terms-of-service"
            class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 hover:text-cyan-400 transition"
          >
            Terms of Service
          </router-link>
          <router-link
            to="/cookie-policy"
            class="p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 hover:text-cyan-400 transition"
          >
            Cookie Policy
          </router-link>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
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
