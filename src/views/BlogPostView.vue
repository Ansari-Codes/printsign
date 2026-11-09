<template>
  <div class="min-h-screen bg-[#070b14] text-slate-100 flex flex-col relative">
    <!-- Reading Progress Bar -->
    <div class="fixed top-0 left-0 right-0 h-1 bg-transparent z-50 pointer-events-none">
      <div
        class="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-[width] duration-150 ease-out"
        :style="{ width: `${readingProgress}%` }"
      ></div>
    </div>

    <!-- Navbar -->
    <SiteNavbar />

    <!-- Main Article Container -->
    <main v-if="post" class="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
      <!-- Breadcrumb Navigation -->
      <nav class="flex items-center gap-2 text-xs text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <router-link to="/" class="hover:text-cyan-400 transition flex items-center gap-1">
          <Home class="w-3.5 h-3.5" />
          <span>Home</span>
        </router-link>
        <ChevronRight class="w-3 h-3 text-slate-600" />
        <router-link to="/blog" class="hover:text-cyan-400 transition">
          <span>Blog & Knowledge Base</span>
        </router-link>
        <ChevronRight class="w-3 h-3 text-slate-600" />
        <span class="text-cyan-400/90 font-medium">{{ post.category }}</span>
        <ChevronRight class="w-3 h-3 text-slate-600" />
        <span class="text-slate-300 truncate max-w-xs sm:max-w-md">{{ post.title }}</span>
      </nav>

      <!-- Article Header -->
      <header class="mb-10 max-w-4xl">
        <div class="flex flex-wrap items-center gap-3 mb-4">
          <span class="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/25 text-cyan-400">
            {{ post.category }}
          </span>
          <span class="text-xs text-slate-400 flex items-center gap-1.5">
            <Clock class="w-3.5 h-3.5" />
            {{ post.readTime }}
          </span>
          <span class="text-xs text-slate-400 flex items-center gap-1.5">
            <Calendar class="w-3.5 h-3.5" />
            {{ post.date }}
          </span>
        </div>

        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-6">
          {{ post.title }}
        </h1>

        <!-- Author Byline & Privacy Guarantee -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-slate-800/80 bg-slate-900/40 px-4 sm:px-6 rounded-2xl">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-cyan-500/20">
              <ShieldCheck class="w-5 h-5" />
            </div>
            <div>
              <div class="text-xs font-bold text-white">{{ post.author }}</div>
              <div class="text-[11px] text-slate-400">Zero-Cloud PDF Architecture & Cryptographic Forensics</div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="copyShareUrl"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition cursor-pointer"
            >
              <Share2 class="w-3.5 h-3.5" />
              <span>{{ copied ? 'Link Copied!' : 'Share Guide' }}</span>
            </button>
            <router-link
              to="/editor"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-md shadow-cyan-500/20"
            >
              <FileEdit class="w-3.5 h-3.5" />
              <span>Launch Editor</span>
            </router-link>
          </div>
        </div>

        <!-- Article Hero Visual Banner -->
        <div class="mt-8 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 group">
          <img
            :src="post.image || `/images/blogs/${post.slug}.png`"
            :alt="post.title"
            class="w-full aspect-[21/9] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            loading="eager"
            onerror="this.style.display='none'"
          />
        </div>
      </header>


      <!-- Content Grid: TOC Sidebar + Article Body -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <!-- Main Article Column (Spans 8 cols on lg) -->
        <article class="lg:col-span-8">
          <!-- Article Excerpt Highlight Box -->
          <div class="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/30 to-blue-950/20 border-l-4 border-cyan-400 border-y border-r border-slate-800 mb-8">
            <h3 class="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">Executive Summary</h3>
            <p class="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
              {{ post.excerpt }}
            </p>
          </div>

          <!-- Rich Article Prose (1,000+ words) -->
          <div
            class="article-content prose prose-invert prose-cyan max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-white prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300 prose-code:text-cyan-300 prose-code:bg-slate-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-xs prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 prose-strong:text-white"
            v-html="processedContent"
          ></div>

          <!-- Comparison Table (if post has comparison) -->
          <div v-if="post.hasComparison" class="my-12">
            <h2 class="text-2xl font-black text-white tracking-tight mb-4">
              PrintSign vs. Leading Competitors: Comprehensive Benchmark
            </h2>
            <ToolComparisonTable />
          </div>

          <!-- FAQ Accordion Section -->
          <section v-if="post.faq && post.faq.length > 0" class="my-12 pt-8 border-t border-slate-800">
            <div class="flex items-center gap-2 mb-6">
              <HelpCircle class="w-5 h-5 text-cyan-400" />
              <h2 class="text-2xl font-black text-white tracking-tight">
                Frequently Asked Questions (FAQ)
              </h2>
            </div>

            <div class="space-y-4">
              <div
                v-for="(item, idx) in post.faq"
                :key="idx"
                class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden"
              >
                <button
                  @click="toggleFaq(idx)"
                  class="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-slate-900/90 transition cursor-pointer"
                >
                  <span class="text-sm sm:text-base font-bold text-white leading-snug">
                    {{ item.q }}
                  </span>
                  <ChevronDown
                    :class="[
                      'w-4 h-4 text-cyan-400 shrink-0 transition-transform duration-200',
                      openFaqs.includes(idx) ? 'rotate-180' : ''
                    ]"
                  />
                </button>
                <div v-if="openFaqs.includes(idx)" class="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                  <p>{{ item.a }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- High-Conversion Dedicated Tool Callout Card -->
          <div
            v-if="post.primaryTool"
            class="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-indigo-950/40 border border-cyan-500/30 shadow-xl"
          >
            <div class="flex items-center gap-2 mb-3">
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck class="w-3.5 h-3.5" />
                <span>100% In-Memory Browser Tool</span>
              </span>
              <span class="text-[11px] text-slate-400 font-medium">Zero Cloud Uploads • F12 Verifiable</span>
            </div>

            <h3 class="text-xl sm:text-2xl font-black text-white mb-2">
              Try the Local {{ post.primaryTool.name }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mb-6">
              {{ post.primaryTool.description }} Execute client-side in your browser's RAM memory without transmitting files or logging metadata.
            </p>

            <div class="flex flex-wrap items-center gap-3">
              <router-link
                :to="post.primaryTool.route"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition active:scale-98"
              >
                <span>{{ post.primaryTool.ctaText }}</span>
                <ArrowRight class="w-4 h-4" />
              </router-link>

              <router-link
                to="/verify-redaction"
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-cyan-500/40 font-semibold text-xs transition"
              >
                <span>Verify Existing PDF Redactions →</span>
              </router-link>
            </div>
          </div>

          <!-- Keywords Tags -->
          <div class="my-8 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-2">
            <span class="text-xs text-slate-400 flex items-center gap-1 mr-2">
              <Tag class="w-3.5 h-3.5" />
              Topics:
            </span>
            <span
              v-for="kw in post.keywords"
              :key="kw"
              class="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900 border border-slate-800 text-slate-300"
            >
              {{ kw }}
            </span>
          </div>

        </article>

        <!-- Sidebar (Spans 4 cols on lg) -->
        <aside class="lg:col-span-4 space-y-8">
          <!-- Sticky Table of Contents Card -->
          <div class="sticky top-20 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xs">
            <h4 class="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2 mb-4">
              <List class="w-4 h-4" />
              <span>Table of Contents</span>
            </h4>
            <nav v-if="tableOfContents.length > 0" class="space-y-1.5 text-xs max-h-[60vh] overflow-y-auto pr-2">
              <a
                v-for="heading in tableOfContents"
                :key="heading.id"
                :href="`#${heading.id}`"
                @click.prevent="scrollToHeading(heading.id)"
                :class="[
                  'block py-1 transition-colors hover:text-cyan-400 truncate',
                  heading.level === 3 ? 'pl-4 text-slate-400 text-[11px]' : 'text-slate-300 font-medium'
                ]"
              >
                {{ heading.text }}
              </a>
            </nav>
            <div v-else class="text-xs text-slate-500">
              Navigate sections below.
            </div>

            <!-- In-Card Contextual Tool CTA -->
            <div class="mt-6 pt-5 border-t border-slate-800 text-center">
              <h5 class="text-xs font-bold text-white mb-1.5">
                {{ post.primaryTool ? post.primaryTool.name : 'Process PDFs 100% Offline' }}
              </h5>
              <p class="text-[11px] text-slate-400 mb-4 leading-normal">
                {{ post.primaryTool ? post.primaryTool.description : 'Never upload confidential files to public servers. Use PrintSign client-side.' }}
              </p>
              <router-link
                :to="post.primaryTool ? post.primaryTool.route : '/editor'"
                class="block w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition active:scale-98"
              >
                {{ post.primaryTool ? post.primaryTool.ctaText : 'Launch Free Editor' }}
              </router-link>
              <router-link
                to="/verify-redaction"
                class="mt-2.5 block text-[11px] text-cyan-400 hover:underline"
              >
                Audit Redactions with Verifier →
              </router-link>
            </div>
          </div>
        </aside>
      </div>

      <!-- Related Articles Section -->
      <section v-if="relatedPosts.length > 0" class="mt-20 pt-12 border-t border-slate-800">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-xl sm:text-2xl font-black text-white tracking-tight">
              Related Document Engineering Guides
            </h3>
            <p class="text-xs sm:text-sm text-slate-400 mt-1">
              Deepen your understanding of client-side PDF forensics and compliance.
            </p>
          </div>
          <router-link
            to="/blog"
            class="text-xs font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 transition"
          >
            <span>View All Guides</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="rel in relatedPosts"
            :key="rel.id"
            class="rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-cyan-500/40 transition flex flex-col justify-between group shadow-lg overflow-hidden"
          >
            <!-- Related Post Thumbnail -->
            <router-link :to="`/blog/${rel.slug}`" class="block relative aspect-[16/9] w-full overflow-hidden bg-slate-950 border-b border-slate-800/80">
              <img
                :src="rel.thumbnail || rel.image || `/images/blogs/${rel.slug}.png`"
                :alt="rel.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onerror="this.style.display='none'"
              />
            </router-link>

            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between gap-2 mb-2">
                  <span class="text-[10px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                    {{ rel.category }}
                  </span>
                  <span class="text-[10px] text-slate-400">{{ rel.readTime }}</span>
                </div>
                <router-link :to="`/blog/${rel.slug}`">
                  <h4 class="text-sm font-bold text-white group-hover:text-cyan-400 transition leading-snug mb-2">
                    {{ rel.title }}
                  </h4>
                </router-link>
                <p class="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {{ rel.excerpt }}
                </p>
              </div>
              <router-link
                :to="`/blog/${rel.slug}`"
                class="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 pt-3 border-t border-slate-800/80 transition"
              >
                <span>Read Guide</span>
                <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </router-link>
            </div>
          </div>
        </div>
      </section>

    </main>

    <!-- Post Not Found Fallback -->
    <main v-else class="flex-1 py-20 px-4 max-w-xl mx-auto text-center flex flex-col items-center justify-center">
      <FileQuestion class="w-16 h-16 text-slate-500 mb-4" />
      <h1 class="text-2xl font-bold text-white mb-2">Article Not Found</h1>
      <p class="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
        The requested document engineering guide could not be located. It may have moved or been updated.
      </p>
      <router-link
        to="/blog"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-cyan-500/20"
      >
        <BookOpen class="w-4 h-4" />
        <span>Return to Blog Directory</span>
      </router-link>
    </main>

    <!-- Footer -->
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import SiteNavbar from '../components/website/SiteNavbar.vue'
import SiteFooter from '../components/website/SiteFooter.vue'
import ToolComparisonTable from '../components/website/ToolComparisonTable.vue'
import { getBlogPostBySlug, getRelatedPosts, type BlogPost } from '../data/blogs'
import {
  Home,
  ChevronRight,
  Clock,
  Calendar,
  ShieldCheck,
  Share2,
  FileEdit,
  HelpCircle,
  ChevronDown,
  Tag,
  List,
  ArrowRight,
  FileQuestion,
  BookOpen
} from 'lucide-vue-next'

const route = useRoute()
const copied = ref(false)
const openFaqs = ref<number[]>([0]) // First FAQ open by default
const readingProgress = ref(0)

function handleScroll() {
  if (typeof window === 'undefined') return
  const scrollTotal = document.documentElement.scrollHeight - window.innerHeight
  if (scrollTotal <= 0) {
    readingProgress.value = 0
  } else {
    readingProgress.value = Math.min(100, Math.max(0, (window.scrollY / scrollTotal) * 100))
  }
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const tableOfContents = ref<TocItem[]>([])

const post = computed<BlogPost | undefined>(() => {
  const slug = route.params.slug as string
  return getBlogPostBySlug(slug)
})

const relatedPosts = computed<BlogPost[]>(() => {
  if (!post.value) return []
  return getRelatedPosts(post.value.slug, 3)
})

// Process content to inject slug IDs into h2 and h3 headers for TOC jump links & render KaTeX math
const processedContent = computed(() => {
  if (!post.value) return ''
  let html = post.value.content
  const toc: TocItem[] = []

  // Replace <h2> and <h3> with IDs
  html = html.replace(/<(h[23])>(.*?)<\/\1>/gi, (_match, tag, text) => {
    // Strip any inner HTML
    const cleanText = text.replace(/<[^>]+>/g, '')
    const id = cleanText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    toc.push({
      id,
      text: cleanText,
      level: tag.toLowerCase() === 'h2' ? 2 : 3
    })
    return `<${tag} id="${id}">${text}</${tag}>`
  })

  // Render KaTeX for <div class="math-formula">...</div>
  html = html.replace(/<div class="math-formula">([\s\S]*?)<\/div>/gi, (_match, formula) => {
    try {
      const cleanFormula = formula
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim()
      const rendered = katex.renderToString(cleanFormula, {
        displayMode: true,
        throwOnError: false
      })
      return `<div class="math-formula katex-rendered">${rendered}</div>`
    } catch {
      return _match
    }
  })

  // Render KaTeX for block $$...$$
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, (_match, formula) => {
    try {
      const cleanFormula = formula
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim()
      const rendered = katex.renderToString(cleanFormula, {
        displayMode: true,
        throwOnError: false
      })
      return `<div class="math-block"><div class="math-formula katex-rendered">${rendered}</div></div>`
    } catch {
      return _match
    }
  })

  // Render KaTeX for inline \(...\)
  html = html.replace(/\\\(([\s\S]*?)\\\)/g, (_match, formula) => {
    try {
      const cleanFormula = formula
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim()
      return katex.renderToString(cleanFormula, {
        displayMode: false,
        throwOnError: false
      })
    } catch {
      return _match
    }
  })

  tableOfContents.value = toc
  return html
})

function toggleFaq(idx: number) {
  if (openFaqs.value.includes(idx)) {
    openFaqs.value = openFaqs.value.filter((i) => i !== idx)
  } else {
    openFaqs.value.push(idx)
  }
}

function scrollToHeading(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

function copyShareUrl() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

// Inject JSON-LD Schema
function updateSeoAndSchema(currentPost: BlogPost) {
  document.title = `${currentPost.metaTitle} | PrintSign`

  // Update Meta Description
  let metaDesc = document.querySelector('meta[name="description"]')
  if (!metaDesc) {
    metaDesc = document.createElement('meta')
    metaDesc.setAttribute('name', 'description')
    document.head.appendChild(metaDesc)
  }
  metaDesc.setAttribute('content', currentPost.metaDescription)

  // Inject / Update JSON-LD Script
  const existingScript = document.getElementById('blog-post-schema')
  if (existingScript) {
    existingScript.remove()
  }

  const faqEntities = currentPost.faq.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a
    }
  }))

  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `https://printsign.org/blog/${currentPost.slug}#article`,
        headline: currentPost.title,
        description: currentPost.metaDescription,
        keywords: currentPost.keywords.join(', '),
        datePublished: '2026-10-27T00:00:00+00:00',
        dateModified: '2026-10-27T00:00:00+00:00',
        author: {
          '@type': 'Organization',
          name: currentPost.author,
          url: 'https://printsign.org'
        },
        publisher: {
          '@type': 'Organization',
          name: 'PrintSign PDF Editor',
          url: 'https://printsign.org',
          logo: {
            '@type': 'ImageObject',
            url: 'https://printsign.org/favicon.svg'
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://printsign.org/blog/${currentPost.slug}`
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://printsign.org/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://printsign.org/blog'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: currentPost.title,
            item: `https://printsign.org/blog/${currentPost.slug}`
          }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqEntities
      }
    ]
  }

  const script = document.createElement('script')
  script.id = 'blog-post-schema'
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(schemaData)
  document.head.appendChild(script)
}

watch(
  () => post.value,
  (newPost) => {
    if (newPost) {
      updateSeoAndSchema(newPost)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (post.value) {
    updateSeoAndSchema(post.value)
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  const existingScript = document.getElementById('blog-post-schema')
  if (existingScript) {
    existingScript.remove()
  }
})
</script>

<style>
/* Rich styling for markdown/HTML elements rendered inside .article-content */
.article-content {
  overflow-wrap: break-word;
}

/* Responsive Table Styling */
.article-content .table-wrapper {
  width: 100%;
  overflow-x: auto;
  margin: 2rem 0;
  border-radius: 1rem;
  border: 1px solid rgba(51, 65, 85, 0.8);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
}

.article-content table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.875rem;
  line-height: 1.5;
  background-color: rgba(15, 23, 42, 0.7);
}

.article-content th {
  background: linear-gradient(to right, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95));
  color: #38bdf8;
  font-weight: 700;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid rgba(51, 65, 85, 0.8);
}

.article-content td {
  padding: 0.875rem 1rem;
  color: #cbd5e1;
  border-bottom: 1px solid rgba(30, 41, 59, 0.6);
}

.article-content tr:last-child td {
  border-bottom: none;
}

.article-content tr:hover td {
  background-color: rgba(30, 41, 59, 0.4);
}

/* Callout Containers */
.article-content .callout {
  margin: 1.75rem 0;
  padding: 1.25rem 1.5rem;
  border-radius: 1rem;
  border-left-width: 4px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(51, 65, 85, 0.8);
  border-left-width: 4px;
}

.article-content .callout-info {
  border-left-color: #38bdf8;
  background: linear-gradient(to right, rgba(14, 116, 144, 0.15), rgba(15, 23, 42, 0.6));
}

.article-content .callout-warning {
  border-left-color: #f59e0b;
  background: linear-gradient(to right, rgba(180, 83, 9, 0.15), rgba(15, 23, 42, 0.6));
}

.article-content .callout-law {
  border-left-color: #818cf8;
  background: linear-gradient(to right, rgba(67, 56, 202, 0.15), rgba(15, 23, 42, 0.6));
}

.article-content .callout-title {
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 0.025em;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.article-content .callout-info .callout-title {
  color: #38bdf8;
}

.article-content .callout-warning .callout-title {
  color: #fbbf24;
}

.article-content .callout-law .callout-title {
  color: #a5b4fc;
}

/* Math / Formula Block Styling */
.article-content .math-block {
  margin: 2rem 0;
  padding: 1.5rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(8, 12, 22, 0.98));
  border: 1px solid rgba(56, 189, 248, 0.35);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  text-align: center;
}

.article-content .math-formula {
  font-size: 1.25rem;
  letter-spacing: 0.02em;
  padding: 0.5rem 0;
  overflow-x: auto;
}

.article-content .katex {
  color: #38bdf8;
  font-size: 1.15em;
  line-height: 1.2;
  text-rendering: auto;
}

.article-content .katex-display {
  margin: 0.25rem 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.5rem 0;
}

.article-content .math-caption {
  margin-top: 0.75rem;
  font-size: 0.75rem;
  color: #94a3b8;
  font-style: italic;
  letter-spacing: 0.025em;
}

/* Architecture / Mermaid Diagram Box */
.article-content .mermaid-diagram {
  margin: 2rem 0;
  padding: 1.5rem;
  border-radius: 1rem;
  background: #030712;
  border: 1px solid rgba(99, 102, 241, 0.3);
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.6);
  position: relative;
  overflow: hidden;
}

.article-content .diagram-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.075em;
  color: #818cf8;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.article-content .mermaid-diagram pre {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: #a5f3fc;
  overflow-x: auto;
}
</style>
