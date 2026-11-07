<template>
  <div class="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
    <!-- Navbar -->
    <SiteNavbar />

    <main class="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      <!-- FAQ Component -->
      <FaqSection />

      <!-- AdSense Unit (Bottom) -->
      <AdSenseSlot
        slot-name="FAQ Bottom Placement"
        format="horizontal"
        description="Google AdSense compliant responsive footer unit."
      />
    </main>

    <!-- Footer -->
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import SiteNavbar from '../components/website/SiteNavbar.vue'
import SiteFooter from '../components/website/SiteFooter.vue'
import FaqSection from '../components/website/FaqSection.vue'
import AdSenseSlot from '../components/website/AdSenseSlot.vue'
</script>
