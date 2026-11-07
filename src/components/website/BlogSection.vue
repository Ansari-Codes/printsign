<template>
  <section id="guides" class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <!-- Section Header -->
    <div class="text-center max-w-3xl mx-auto mb-16">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
        <span>SECURITY & LEGAL KNOWLEDGE BASE</span>
      </div>
      <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
        Deep Dives: PDF Forensics, Security & Redaction Standards
      </h2>
      <p class="text-base text-slate-400 leading-relaxed">
        Authoritative guides written for compliance officers, legal counsel, and engineers to eliminate document data leaks.
      </p>
    </div>

    <!-- Articles Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <article
        v-for="article in articles"
        :key="article.id"
        class="bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 border border-slate-700/80 rounded-3xl p-8 flex flex-col justify-between hover:border-cyan-500/50 transition-all duration-300 shadow-xl group cursor-pointer"
        @click="openArticle(article)"
      >
        <div>
          <!-- Tags & Read Time -->
          <div class="flex items-center justify-between text-xs mb-4">
            <span class="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 font-semibold">
              {{ article.category }}
            </span>
            <span class="text-slate-400 font-medium flex items-center gap-1">
              <Clock class="w-3.5 h-3.5" />
              {{ article.readTime }}
            </span>
          </div>

          <h3 class="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-3 leading-snug">
            {{ article.title }}
          </h3>

          <p class="text-sm text-slate-300 leading-relaxed mb-6">
            {{ article.excerpt }}
          </p>
        </div>

        <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <span class="text-xs text-slate-400 font-mono">{{ article.date }}</span>
          <span class="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
            <span>Read Complete Guide</span>
            <ArrowRight class="w-4 h-4" />
          </span>
        </div>
      </article>
    </div>

    <!-- Active Article Full-Screen Modal Reader -->
    <div
      v-if="activeArticle"
      class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      @click.self="activeArticle = null"
    >
      <div class="bg-[#0b101d] border border-slate-700/80 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
        <!-- Reader Header -->
        <div class="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 sticky top-0 z-10 backdrop-blur-md">
          <div class="flex items-center gap-3">
            <span class="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
              {{ activeArticle.category }}
            </span>
            <span class="text-xs text-slate-400">{{ activeArticle.readTime }} • Published {{ activeArticle.date }}</span>
          </div>
          <button
            @click="activeArticle = null"
            class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close article"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Reader Content Body -->
        <div class="p-6 sm:p-10 overflow-y-auto space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {{ activeArticle.title }}
          </h2>

          <div class="prose prose-invert max-w-none space-y-5" v-html="activeArticle.content"></div>
        </div>

        <!-- Reader Footer -->
        <div class="p-4 sm:p-6 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-4">
          <span class="text-xs text-slate-400">
            PrintSign Engineering Whitepaper Series • Published for Free Public Knowledge
          </span>
          <div class="flex items-center gap-3">
            <button
              @click="activeArticle = null; $emit('navigate', 'editor')"
              class="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Test in PrintSign PDF Editor
            </button>
            <button
              @click="activeArticle = null"
              class="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl hover:text-white transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Clock, ArrowRight, X } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'navigate', view: string): void
}>()

interface Article {
  id: string
  title: string
  category: string
  readTime: string
  date: string
  excerpt: string
  content: string
}

const activeArticle = ref<Article | null>(null)

function openArticle(article: Article) {
  activeArticle.value = article
}

const articles: Article[] = [
  {
    id: 'fake-redaction',
    title: 'The Perils of "Fake Redaction": Why Black Boxes in PDFs Lead to Catastrophic Data Breaches',
    category: 'Security & Forensics',
    readTime: '6 min read',
    date: 'Updated October 2026',
    excerpt: 'Drawing a black rectangle over sensitive text in standard software does not delete the characters. Anyone can copy-paste or search the underlying vectors. Here is the technical breakdown.',
    content: `
      <p>
        In 2019, lawyers representing a high-profile political consultant submitted a heavily "redacted" PDF to a federal court. Within thirty seconds of publication, journalists selected the blacked-out sections with their mouse, pressed <code>Ctrl+C</code>, pasted the contents into a plain text document, and read every single word of the confidential testimony.
      </p>

      <h3 class="text-xl font-bold text-white mt-6 mb-2">How Naive Redaction Works</h3>
      <p>
        The PDF specification (ISO 32000) stores content in modular structural layers. When text is placed on a page, it is written into a stream using text operators such as <code>BT</code> (Begin Text), <code>Tj</code> (Show Text), and <code>ET</code> (End Text). When you use an image editor or simple markup tool to draw a black rectangle over a word:
      </p>
      <ul class="list-disc list-inside space-y-2 text-slate-300 my-4">
        <li>The text operator and its literal characters remain inside the PDF stream.</li>
        <li>The software simply adds a drawing operator (<code>re f</code> or an annotation rectangle) at a higher z-index above the text.</li>
        <li>The text is completely invisible to human eyes on screen, but perfectly readable by search engines, copy-paste handlers, and screen readers.</li>
      </ul>

      <h3 class="text-xl font-bold text-white mt-6 mb-2">Why Orphan Objects Exacerbate the Leak</h3>
      <p>
        Even software that claims to "remove" text often leaves previous revisions or detached content streams intact as unreferenced indirect objects. In incremental updates, PDF files append changes to the end of the file rather than rewriting the binary. Forensic analysts can simply inspect the historical xref tables to resurrect the erased sections.
      </p>

      <h3 class="text-xl font-bold text-white mt-6 mb-2">The Mathematically Sound Solution</h3>
      <p>
        To guarantee true redaction, the entire affected page must undergo:
      </p>
      <ol class="list-decimal list-inside space-y-2 text-slate-300 my-4">
        <li><strong>High-DPI Rasterization:</strong> Converting the vector stream into raw pixel data at 300 DPI.</li>
        <li><strong>Pixel Burn-In:</strong> Overwriting the RGB pixel values within the redaction coordinates with pure 0x00 black.</li>
        <li><strong>Page Replacement:</strong> Dropping the original content stream and replacing the page with the burned image.</li>
        <li><strong>Indirect Object Garbage Collection:</strong> Traversing the document tree from the Catalog root and purging all detached orphan streams.</li>
      </ol>
      <p>
        PrintSign performs this entire sequence client-side within your browser Web Worker, verified by an automated canary byte scan.
      </p>
    `
  },
  {
    id: 'zero-trust-computing',
    title: 'Zero-Trust In-Browser Computing: How Modern WebAssembly and Canvas APIs Make Cloud Uploads Obsolete',
    category: 'Architecture & Privacy',
    readTime: '5 min read',
    date: 'Updated October 2026',
    excerpt: 'For two decades, PDF manipulation required heavy server-side engines like poppler or ghostscript. Today, Web Workers and client-side runtimes render cloud processing entirely obsolete.',
    content: `
      <p>
        Historically, organizations had no choice but to trust cloud conversion services when splitting, merging, or editing PDF files on the web. Behind the scenes, these websites received the file over HTTPS, saved it onto shared multi-tenant Linux servers, spawned subprocesses like ImageMagick or Ghostscript, and streamed back the result.
      </p>

      <h3 class="text-xl font-bold text-white mt-6 mb-2">The Hidden Threat Model of Cloud Converters</h3>
      <p>
        Every time a confidential file leaves an employee's machine:
      </p>
      <ul class="list-disc list-inside space-y-2 text-slate-300 my-4">
        <li><strong>Subpoena Risk:</strong> Cloud hosts can be subpoenaed without notifying the document owner.</li>
        <li><strong>Data Retention Violations:</strong> Temp directories and crash dumps often persist files indefinitely on S3 buckets.</li>
        <li><strong>Compliance Breaches:</strong> HIPAA, GDPR Article 28, and attorney-client work product doctrine forbid unvetted third-party data processing.</li>
      </ul>

      <h3 class="text-xl font-bold text-white mt-6 mb-2">The Client-Side Revolution</h3>
      <p>
        With Mozilla's <code>pdfjs-dist</code> running inside dedicated browser Web Workers and <code>pdf-lib</code> manipulating low-level PDF syntax directly in typed <code>Uint8Array</code> buffers, modern browsers possess the raw computing power to handle 500-page documents with zero server dependency.
      </p>
      <p>
        By eliminating the server entirely, the attack surface drops to zero. No data in transit, no data at rest on third-party hardware, and no vendor lock-in.
      </p>
    `
  },
  {
    id: 'metadata-sanitization',
    title: 'The Complete Guide to Sanitizing PDF Metadata and Hidden XMP XML Streams',
    category: 'Data Governance',
    readTime: '7 min read',
    date: 'Updated October 2026',
    excerpt: 'Did you know your PDFs leak your computer username, local file paths, software serial numbers, and printer IDs? Here is how to find and scrub hidden metadata.',
    content: `
      <p>
        Whenever Microsoft Word, Apple Pages, Google Docs, or Adobe Acrobat exports a document to PDF, it invisibly packages extensive forensic telemetry about the creator and the workstation.
      </p>

      <h3 class="text-xl font-bold text-white mt-6 mb-2">The Two Storage Locations for PDF Metadata</h3>
      <p>
        Most users are unaware that PDF documents maintain metadata in two completely separate formats:
      </p>
      <ol class="list-decimal list-inside space-y-2 text-slate-300 my-4">
        <li><strong>The Info Dictionary:</strong> A standard PDF dictionary located via the <code>/Info</code> entry in the trailer containing keys like <code>/Author</code>, <code>/Creator</code>, <code>/Producer</code>, <code>/CreationDate</code>, and <code>/ModDate</code>.</li>
        <li><strong>The XMP Metadata Stream:</strong> An embedded Extensible Metadata Platform XML packet containing Dublin Core schemas, Adobe Photoshop metadata, and digital camera EXIF histories.</li>
      </ol>

      <h3 class="text-xl font-bold text-white mt-6 mb-2">What Forensic Investigators Can Extract</h3>
      <p>
        An unscrubbed PDF often reveals:
      </p>
      <ul class="list-disc list-inside space-y-2 text-slate-300 my-4">
        <li>The author's full operating system username and network domain.</li>
        <li>The exact local file path (e.g., <code>C:\\Users\\JohnDoe\\Documents\\SecretMerger\\ProjectX.docx</code>).</li>
        <li>The exact make and model of the scanner or printer used.</li>
        <li>Revision timestamps down to the millisecond.</li>
      </ul>

      <h3 class="text-xl font-bold text-white mt-6 mb-2">How PrintSign Completely Cleans Metadata</h3>
      <p>
        PrintSign's Metadata Workspace provides a one-click <strong>"Scrub All Metadata"</strong> feature. It erases every key in the Document Information dictionary and purges the raw XMP XML stream from the document catalog, leaving a sanitized binary safe for public release.
      </p>
    `
  },
  {
    id: 'legal-standards',
    title: 'Vector vs. Raster Redaction: Legal and Compliance Standards (NIST SP 800-88 & FOIA Mandates)',
    category: 'Legal Standards',
    readTime: '6 min read',
    date: 'Updated October 2026',
    excerpt: 'Federal courts and Freedom of Information Act (FOIA) officers mandate rigorous technical standards for permanent redaction. Learn the legal distinctions.',
    content: `
      <p>
        In federal and state litigation, accidental disclosure of protected materials (PII, trade secrets, sealed grand jury testimony) can lead to severe court sanctions, waiver of privilege, and malpractice claims.
      </p>

      <h3 class="text-xl font-bold text-white mt-6 mb-2">NIST Special Publication 800-88 Guidelines</h3>
      <p>
        The National Institute of Standards and Technology (NIST) defines data sanitization levels: Clear, Purge, and Destroy. When applied to digital document redaction:
      </p>
      <ul class="list-disc list-inside space-y-2 text-slate-300 my-4">
        <li><strong>Non-Compliant:</strong> Layer masking, black highlights, annotation overlays, and text color matching (setting text color to black or white).</li>
        <li><strong>Compliant:</strong> Irreversible transformation where the underlying data points no longer exist in any digital representation within the file structure.</li>
      </ul>

      <h3 class="text-xl font-bold text-white mt-6 mb-2">Resolution Benchmarks: Why 300 DPI is the Standard</h3>
      <p>
        When rasterizing a redacted page, choosing the correct Dots Per Inch (DPI) is critical:
      </p>
      <ul class="list-disc list-inside space-y-2 text-slate-300 my-4">
        <li><strong>72 DPI:</strong> Suitable only for low-bandwidth screen drafts; fine print and small footnote numbers become blurry or unreadable.</li>
        <li><strong>150 DPI:</strong> Adequate for general office review and email attachments.</li>
        <li><strong>300 DPI:</strong> The universal legal standard for e-discovery, court filings, and official document archives. Preserves sharp typography while guaranteeing complete obliteration of redaction zones.</li>
        <li><strong>600 DPI:</strong> High-precision archival standard for engineering schematics and medical imaging.</li>
      </ul>
      <p>
        PrintSign gives you full control over DPI settings while verifying that every redacted token is permanently purged from the binary.
      </p>
    `
  }
]
</script>
