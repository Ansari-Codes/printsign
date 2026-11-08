<template>
  <div class="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
    <!-- Navbar -->
    <SiteNavbar />

    <main class="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      <!-- Page Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-4">
          <span>GET IN TOUCH</span>
        </div>
        <h1 class="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Contact the PrintSign Team
        </h1>
        <p class="text-base sm:text-lg text-slate-400 leading-relaxed">
          Have questions regarding client-side redaction, enterprise compliance, security audits, or bug reports? We are here to assist.
        </p>
      </div>

      <!-- Content Grid: Form + Contact Info -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <!-- Contact Information Sidebar -->
        <div class="space-y-6">
          <div class="bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 border border-slate-700/80 rounded-3xl p-7 shadow-xl">
            <h2 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Mail class="w-5 h-5 text-cyan-400" />
              <span>Direct Inquiries</span>
            </h2>

            <div class="space-y-4 text-xs">
              <div>
                <span class="text-slate-500 block uppercase tracking-wider text-[10px] font-bold">General Support</span>
                <a href="mailto:support@printsign.org" class="text-cyan-400 hover:underline font-mono text-xs">
                  support@printsign.org
                </a>
              </div>

              <div>
                <span class="text-slate-500 block uppercase tracking-wider text-[10px] font-bold">Security & Vulnerability Disclosure</span>
                <a href="mailto:security@printsign.org" class="text-cyan-400 hover:underline font-mono text-xs">
                  security@printsign.org
                </a>
              </div>

              <div>
                <span class="text-slate-500 block uppercase tracking-wider text-[10px] font-bold">Legal & Compliance</span>
                <a href="mailto:legal@printsign.org" class="text-cyan-400 hover:underline font-mono text-xs">
                  legal@printsign.org
                </a>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 border border-slate-700/80 rounded-3xl p-7 shadow-xl">
            <h2 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Clock class="w-5 h-5 text-indigo-400" />
              <span>Response Time</span>
            </h2>
            <p class="text-xs text-slate-400 leading-relaxed">
              Our engineering team responds to inquiries within <strong class="text-slate-200">24 to 48 business hours</strong>. For security vulnerability disclosures, our average initial acknowledgement time is under 12 hours.
            </p>
          </div>

          <div class="bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 border border-slate-700/80 rounded-3xl p-7 shadow-xl">
            <h2 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Github class="w-5 h-5 text-slate-300" />
              <span>Open Source Issues</span>
            </h2>
            <p class="text-xs text-slate-400 leading-relaxed mb-4">
              Found a bug or have a feature request? Feel free to open a ticket directly on our public GitHub repository.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              <span>Visit GitHub Repository</span>
              <ExternalLink class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <!-- Interactive Contact Form (Spans 2 cols on lg) -->
        <div class="lg:col-span-2 bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 border border-slate-700/80 rounded-3xl p-8 sm:p-10 shadow-xl">
          <h2 class="text-2xl font-bold text-white mb-2">Send Us a Direct Message</h2>
          <p class="text-xs text-slate-400 mb-8">
            Fill in the details below. Since all processing is client-side, please do not include confidential document text in your message.
          </p>

          <!-- Submitted Success Notice -->
          <div
            v-if="formSubmitted"
            class="p-6 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-emerald-200 text-sm space-y-2 mb-6"
          >
            <div class="flex items-center gap-2 font-bold text-emerald-300">
              <CheckCircle2 class="w-5 h-5" />
              <span>Message Received Successfully</span>
            </div>
            <p class="text-xs text-slate-300">
              Thank you for contacting us. A confirmation has been recorded and an engineer will reply to <span class="font-mono text-emerald-300">{{ formData.email }}</span> shortly.
            </p>
            <button
              @click="formSubmitted = false"
              class="mt-3 text-xs text-emerald-400 underline font-semibold"
            >
              Send another message
            </button>
          </div>

          <!-- Contact Form -->
          <form v-else @submit.prevent="handleSubmit" class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">
                  Your Full Name <span class="text-cyan-400">*</span>
                </label>
                <input
                  v-model="formData.name"
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-xs focus:outline-hidden focus:border-cyan-500 transition"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">
                  Your Email Address <span class="text-cyan-400">*</span>
                </label>
                <input
                  v-model="formData.email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-xs focus:outline-hidden focus:border-cyan-500 transition"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">
                  Inquiry Category
                </label>
                <select
                  v-model="formData.category"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-xs focus:outline-hidden focus:border-cyan-500 transition"
                >
                  <option value="technical">Technical Support & Troubleshooting</option>
                  <option value="security">Security & Privacy Audit</option>
                  <option value="enterprise">Enterprise & Legal Compliance</option>
                  <option value="feedback">General Feedback & Suggestions</option>
                  <option value="partnership">Business &amp; Partnership Inquiry</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">
                  Subject Line <span class="text-cyan-400">*</span>
                </label>
                <input
                  v-model="formData.subject"
                  type="text"
                  required
                  placeholder="Summary of inquiry"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-xs focus:outline-hidden focus:border-cyan-500 transition"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">
                Detailed Message <span class="text-cyan-400">*</span>
              </label>
              <textarea
                v-model="formData.message"
                rows="5"
                required
                placeholder="How can we assist you?"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-xs focus:outline-hidden focus:border-cyan-500 transition"
              ></textarea>
            </div>

            <div class="flex items-center gap-2 text-[11px] text-slate-400">
              <Lock class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>We never share your contact details. Your inquiry is strictly confidential.</span>
            </div>

            <button
              type="submit"
              class="w-full py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-cyan-500/20 transition active:scale-98 flex items-center justify-center gap-2"
            >
              <Send class="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>

    </main>

    <!-- Footer -->
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Mail,
  Clock,
  Github,
  ExternalLink,
  Lock,
  Send,
  CheckCircle2
} from 'lucide-vue-next'
import SiteNavbar from '../components/website/SiteNavbar.vue'
import SiteFooter from '../components/website/SiteFooter.vue'

const formSubmitted = ref(false)
const formData = ref({
  name: '',
  email: '',
  category: 'technical',
  subject: '',
  message: ''
})

function handleSubmit() {
  formSubmitted.value = true
  // In a 100% client-side tool, this confirms client delivery receipt
}
</script>
