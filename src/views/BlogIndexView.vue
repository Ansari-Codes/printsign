<template>
  <div class="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
    <!-- Navbar -->
    <SiteNavbar />

    <main class="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <!-- Hero Section -->
      <header class="text-center max-w-3xl mx-auto mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold mb-4">
          <BookOpen class="w-3.5 h-3.5" />
          <span>PRINTSIGN ENGINEERING & COMPLIANCE BLOG</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          PDF Security, Legal Compliance & Zero-Cloud Privacy
        </h1>
        <p class="text-sm sm:text-base text-slate-400 leading-relaxed">
          Authoritative technical guides, courtroom redaction protocols, HIPAA/GDPR compliance frameworks, and deep dives into in-browser WebAssembly document engineering.
        </p>

        <!-- Search Bar -->
        <div class="mt-8 max-w-xl mx-auto relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search class="w-4 h-4" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search 18+ guides by keyword, court rules, HIPAA, DPI..."
            class="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition shadow-inner"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Category Pills -->
        <div class="flex flex-wrap items-center justify-center gap-2 mt-6">
          <button
            v-for="cat in blogCategories"
            :key="cat"
            @click="selectedCategory = cat"
            :class="[
              'px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer',
              selectedCategory === cat
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            ]"
          >
            {{ cat }}
          </button>
        </div>
      </header>


      <!-- Featured Article (Shown when no search/filter active) -->
      <div v-if="featuredPost && !searchQuery && selectedCategory === 'All'" class="mb-14">
        <div class="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-[#0b1329] to-slate-900 p-6 sm:p-8 lg:p-10 shadow-2xl">
          <div class="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div class="lg:col-span-7">
              <div class="flex items-center gap-2 mb-3">
                <span class="px-2.5 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs font-bold uppercase tracking-wide">
                  FEATURED EDITORIAL
                </span>
                <span class="text-xs text-slate-400 flex items-center gap-1">
                  <Clock class="w-3.5 h-3.5" />
                  {{ featuredPost.readTime }}
                </span>
              </div>
              <router-link :to="`/blog/${featuredPost.slug}`">
                <h2 class="text-2xl sm:text-3xl font-extrabold text-white hover:text-cyan-400 transition tracking-tight mb-3">
                  {{ featuredPost.title }}
                </h2>
              </router-link>
              <p class="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
                {{ featuredPost.excerpt }}
              </p>
              <div class="flex flex-wrap items-center gap-4">
                <router-link
                  :to="`/blog/${featuredPost.slug}`"
                  class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition active:scale-98"
                >
                  <span>Read Full 1,500+ Word Guide</span>
                  <ArrowRight class="w-4 h-4" />
                </router-link>
                <div class="text-xs text-slate-400">
                  <span>By {{ featuredPost.author }}</span> &bull; <span>{{ featuredPost.date }}</span>
                </div>
              </div>
            </div>
            <div class="lg:col-span-5">
              <router-link :to="`/blog/${featuredPost.slug}`" class="block rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group">
                <img
                  :src="featuredPost.image || `/images/blogs/${featuredPost.slug}.png`"
                  :alt="featuredPost.title"
                  class="w-full aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                  onerror="this.style.display='none'"
                />
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Articles Grid -->
      <section class="mb-16">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {{ selectedCategory === 'All' ? 'All Document Engineering Articles' : `${selectedCategory} Articles` }}
            </h2>
            <p class="text-xs sm:text-sm text-slate-400 mt-1">
              Showing {{ filteredPosts.length }} comprehensive guides (1,000+ words each)
            </p>
          </div>
        </div>

        <div v-if="filteredPosts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <article
            v-for="post in filteredPosts"
            :key="post.id"
            class="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-cyan-500/40 transition duration-200 overflow-hidden group shadow-lg"
          >
            <!-- Card Thumbnail Banner -->
            <router-link :to="`/blog/${post.slug}`" class="block relative aspect-[16/9] w-full overflow-hidden bg-slate-950 border-b border-slate-800/80">
              <img
                :src="post.thumbnail || post.image || `/images/blogs/${post.slug}.png`"
                :alt="post.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onerror="this.style.display='none'"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
            </router-link>

            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <!-- Card Header Badges -->
                <div class="flex items-center justify-between gap-2 mb-3">
                  <span class="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {{ post.category }}
                  </span>
                  <span class="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock class="w-3 h-3" />
                    {{ post.readTime }}
                  </span>
                </div>

                <!-- Title Link -->
                <router-link :to="`/blog/${post.slug}`" class="block group-hover:text-cyan-400 transition">
                  <h3 class="text-base sm:text-lg font-bold text-white tracking-tight leading-snug mb-3">
                    {{ post.title }}
                  </h3>
                </router-link>

                <!-- Excerpt -->
                <p class="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {{ post.excerpt }}
                </p>
              </div>

              <!-- Card Footer -->
              <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between mt-auto">
                <span class="text-[11px] text-slate-500">
                  {{ post.date }}
                </span>
                <router-link
                  :to="`/blog/${post.slug}`"
                  class="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
                >
                  <span>Read Article</span>
                  <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </router-link>
              </div>
            </div>
          </article>
        </div>

        <!-- Zero Results State -->
        <div v-else class="text-center py-16 px-4 bg-slate-900/30 rounded-2xl border border-slate-800">
          <FileQuestion class="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 class="text-lg font-bold text-white mb-1">No articles found</h3>
          <p class="text-xs text-slate-400 mb-4">
            No guides match your search query "{{ searchQuery }}". Try searching for "redact", "merge", "hipaa", or "dpi".
          </p>
          <button
            @click="searchQuery = ''; selectedCategory = 'All'"
            class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Clear Filters
          </button>
        </div>
      </section>

      <!-- Comparison Matrix Showcase -->
      <section class="my-16">
        <ToolComparisonTable />
      </section>


      <!-- Quick Action CTA -->
      <section class="mt-16 text-center py-12 px-6 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-slate-950/60 border border-cyan-500/20">
        <div class="max-w-2xl mx-auto">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Ready to Edit, Redact, and Merge PDFs Privately?
          </h2>
          <p class="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
            Experience 100% client-side document processing in your browser. No registration, no server uploads, no data retention, and no subscription fees.
          </p>
          <router-link
            to="/editor"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 transition active:scale-98"
          >
            <span>Launch Free PDF Editor</span>
            <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SiteNavbar from '../components/website/SiteNavbar.vue'
import SiteFooter from '../components/website/SiteFooter.vue'
import ToolComparisonTable from '../components/website/ToolComparisonTable.vue'
import { blogs, blogCategories, type BlogPost } from '../data/blogs'
import {
  BookOpen,
  Search,
  X,
  Clock,
  ArrowRight,
  FileQuestion
} from 'lucide-vue-next'

const searchQuery = ref('')
const selectedCategory = ref('All')

const featuredPost = computed<BlogPost | undefined>(() => {
  return blogs.find((b) => b.slug === 'how-to-permanently-redact-pdf-court-compliant') || blogs[0]
})

const filteredPosts = computed<BlogPost[]>(() => {
  return blogs.filter((post) => {
    const matchesCategory =
      selectedCategory.value === 'All' || post.category === selectedCategory.value

    if (!matchesCategory) return false

    if (!searchQuery.value.trim()) return true

    const query = searchQuery.value.toLowerCase().trim()
    const inTitle = post.title.toLowerCase().includes(query)
    const inExcerpt = post.excerpt.toLowerCase().includes(query)
    const inKeywords = post.keywords.some((k) => k.toLowerCase().includes(query))
    const inCategory = post.category.toLowerCase().includes(query)

    return inTitle || inExcerpt || inKeywords || inCategory
  })
})

onMounted(() => {
  document.title = 'PrintSign Blog: PDF Security, Court Redaction & Client-Side Privacy'
  const metaDesc = document.querySelector('meta[name="description"]')
  if (metaDesc) {
    metaDesc.setAttribute(
      'content',
      'Read 18+ comprehensive guides on permanent PDF redaction, court compliance, HIPAA patient privacy, zero-trust WASM, and free Adobe Acrobat alternatives.'
    )
  }
})
</script>
