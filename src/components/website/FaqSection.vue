<template>
  <section id="faq" class="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="text-center max-w-3xl mx-auto mb-16">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-4">
        <span>FREQUENTLY ASKED QUESTIONS</span>
      </div>
      <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
        Everything You Need to Know About PrintSign
      </h2>
      <p class="text-base text-slate-400 leading-relaxed">
        Common questions about privacy, architecture, redaction mechanics, and technical compatibility.
      </p>
    </div>

    <!-- Accordion List -->
    <div class="space-y-4">
      <div
        v-for="(item, index) in faqs"
        :key="index"
        class="bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 border border-slate-700/80 rounded-2xl overflow-hidden transition-all shadow-md"
      >
        <button
          @click="toggleFaq(index)"
          class="w-full py-5 px-6 text-left flex items-center justify-between gap-4 font-bold text-white hover:text-cyan-300 transition-colors select-none text-base sm:text-lg"
          :aria-expanded="openIndex === index"
        >
          <span>{{ item.question }}</span>
          <ChevronDown
            :class="[
              'w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0',
              openIndex === index ? 'rotate-180 text-cyan-400' : ''
            ]"
          />
        </button>

        <div
          v-show="openIndex === index"
          class="px-6 pb-6 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4"
        >
          <p>{{ item.answer }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const openIndex = ref<number | null>(0)

function toggleFaq(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}

const faqs = [
  {
    question: 'Are my PDF files or edited pages ever uploaded to any server?',
    answer: 'No, absolutely never. PrintSign operates 100% client-side inside your browser sandbox. When you select or drag a PDF into the app, it is parsed directly from your computer storage into browser RAM using Web Workers and typed Uint8Array buffers. There are zero backend servers, zero database connections, and zero tracking analytics.'
  },
  {
    question: 'How can I independently verify that zero data is sent across the network?',
    answer: 'You can verify our privacy promise yourself using standard browser developer tools: Press F12 (or right-click and choose "Inspect"), switch to the "Network" tab, check "All", and edit/redact/export any document. You will see zero outbound HTTP/HTTPS requests to any third-party or backend API.'
  },
  {
    question: 'Why is drawing a black box in Acrobat or Preview not true redaction?',
    answer: 'In PDF specifications, drawing a black rectangle merely places a vector drawing operator on top of the text. The underlying characters and word coordinates remain completely intact in the content stream. Anyone can select the text, copy-paste it, or run simple text-extraction utilities to read the secret data. PrintSign permanently burns the black boxes into image pixels and purges the vector streams.'
  },
  {
    question: 'What is "orphan indirect object garbage collection" and why is it necessary?',
    answer: 'In PDF binary structures, objects (such as page descriptions, images, or metadata packets) can become detached from the page tree when deleted or replaced, but still remain embedded as "orphans" in the file binary. Anyone inspecting the raw file with a hex editor or string search can read orphan data. Our engine walks the document graph from the Trailer root, identifies unreferenced objects, and purges them completely during export.'
  },
  {
    question: 'Does PrintSign work without an internet connection or on air-gapped computers?',
    answer: 'Yes. PrintSign is an offline-first Progressive Web App (PWA). Once loaded in your browser, all JavaScript bundles, WebAssembly runtimes, Web Workers, fonts, and font metric tables (CMAPs) are cached locally by a Service Worker. You can disconnect your Wi-Fi, run it on an isolated air-gapped laptop, and perform all operations offline.'
  },
  {
    question: 'Can PrintSign open password-protected encrypted PDFs?',
    answer: 'Yes. When an encrypted PDF is opened, the application prompts you for the document password locally. Mozilla PDF.js decrypts the document in memory without transmitting your password or file anywhere.'
  },
  {
    question: 'How does autosave and local session recovery work?',
    answer: 'Your active work (PDF binary data and pending redaction boxes) is continuously preserved in your browser\'s local IndexedDB storage. If your browser accidentally crashes, reloads, or closes, you will see a "Recover Local Drafts" prompt on next visit to resume your work instantly.'
  },
  {
    question: 'Is PrintSign free, and can it be used for commercial or enterprise work?',
    answer: 'PrintSign is completely free to use with no document size quotas, no page limits, and no watermarks. It is designed to meet strict enterprise compliance guidelines including GDPR Article 28, HIPAA, FERPA, and legal work-product standards.'
  }
]
</script>
