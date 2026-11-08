import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const blogsPath = path.resolve(__dirname, '../src/data/blogs.ts')

const toolMappings = {
  'how-to-permanently-redact-pdf-court-compliant': {
    primaryTool: {
      name: 'Permanent PDF Redactor',
      route: '/redact-pdf',
      description: 'Burn sensitive text and images into irreversible 300 DPI pixels in browser RAM.',
      ctaText: 'Open 300 DPI Redactor →'
    },
    secondaryTool: {
      name: 'Redaction & Metadata Verifier',
      route: '/verify-redaction',
      description: 'Audit redacted documents to verify no underlying vector text or XMP metadata persists.',
      ctaText: 'Verify Redactions Free →'
    },
    links: [
      {
        target: 'Navigate to <a href="/editor" class="text-cyan-400 font-semibold underline">printsign.org/editor</a>',
        replacement: 'Launch the <a href="/redact-pdf" class="text-cyan-400 font-semibold underline">Permanent PDF Redactor</a> or audit with the <a href="/verify-redaction" class="text-cyan-400 font-semibold underline">PDF Redaction &amp; Metadata Verifier</a>'
      }
    ]
  },
  'printsign-vs-smallpdf-ilovepdf-cloud-security': {
    primaryTool: {
      name: 'Private Offline Alternative',
      route: '/ilovepdf-smallpdf-offline-alternative',
      description: 'The zero-upload WebAssembly alternative to cloud PDF editors like Smallpdf and iLovePDF.',
      ctaText: 'Compare Offline Architecture →'
    },
    secondaryTool: {
      name: 'Client-Side Verifier',
      route: '/verify-redaction',
      description: 'Verify zero-network execution and audit document sanitization in browser RAM.',
      ctaText: 'Run In-Memory Audit →'
    },
    links: [
      {
        target: 'Launch <a href="/editor" class="text-cyan-400 font-semibold underline">PrintSign PDF Editor</a> today.',
        replacement: 'Explore our dedicated <a href="/ilovepdf-smallpdf-offline-alternative" class="text-cyan-400 font-semibold underline">offline alternative to Smallpdf and iLovePDF</a> or start with the <a href="/redact-pdf" class="text-cyan-400 font-semibold underline">Permanent PDF Redactor</a>.'
      }
    ]
  },
  'merge-pdf-files-without-uploading-private': {
    primaryTool: {
      name: 'Local PDF Merger',
      route: '/merge-pdf',
      description: 'Combine multiple PDF files in browser memory with zero file size limits or cloud uploads.',
      ctaText: 'Merge PDFs Offline →'
    },
    secondaryTool: {
      name: 'PDF Page Splitter',
      route: '/split-pdf',
      description: 'Extract custom page ranges and split merged documents locally.',
      ctaText: 'Split PDF Pages →'
    },
    links: [
      {
        target: '<a href="/editor" class="text-cyan-400 font-semibold underline">PrintSign PDF Editor</a>',
        replacement: '<a href="/merge-pdf" class="text-cyan-400 font-semibold underline">Merge PDF Locally</a> and extract ranges with the <a href="/split-pdf" class="text-cyan-400 font-semibold underline">PDF Page Splitter</a>'
      }
    ]
  },
  'split-pdf-extract-pages-offline': {
    primaryTool: {
      name: 'PDF Range Splitter',
      route: '/split-pdf',
      description: 'Extract single pages or custom ranges with instant local Web Worker processing.',
      ctaText: 'Split PDF Offline →'
    },
    secondaryTool: {
      name: 'Page Reorder & Rotate',
      route: '/reorder-rotate-pdf',
      description: 'Reorganize, rotate upside-down pages, or delete unnecessary sheets locally.',
      ctaText: 'Organize PDF Pages →'
    },
    links: [
      {
        target: '<a href="/editor" class="text-cyan-400 font-semibold underline">PrintSign PDF Editor</a>',
        replacement: '<a href="/split-pdf" class="text-cyan-400 font-semibold underline">Split PDF Pages Offline</a> and organize pages using the <a href="/reorder-rotate-pdf" class="text-cyan-400 font-semibold underline">Page Reorder &amp; Rotate tool</a>'
      }
    ]
  },
  'hidden-pdf-metadata-scrub-xmp-streams': {
    primaryTool: {
      name: 'Metadata & XMP Scrubber',
      route: '/scrub-pdf-metadata',
      description: 'Purge author names, software identifiers, creation dates, and XMP XML streams.',
      ctaText: 'Scrub PDF Metadata →'
    },
    secondaryTool: {
      name: 'Metadata Verifier',
      route: '/verify-redaction',
      description: 'Inspect /Info dictionary keys and raw XMP packets to verify complete sanitization.',
      ctaText: 'Audit Metadata Streams →'
    },
    links: [
      {
        target: '<a href="/editor" class="text-cyan-400 font-semibold underline">PrintSign PDF Editor</a>',
        replacement: '<a href="/scrub-pdf-metadata" class="text-cyan-400 font-semibold underline">Scrub PDF Metadata &amp; XMP Streams</a> and audit residual tags with the <a href="/verify-redaction" class="text-cyan-400 font-semibold underline">PDF Redaction &amp; Metadata Verifier</a>'
      }
    ]
  },
  'why-black-boxes-fail-pdf-redaction-disasters': {
    primaryTool: {
      name: 'Redaction Vulnerability Auditor',
      route: '/verify-redaction',
      description: 'Detect selectable text streams hidden beneath cosmetic black vector shapes.',
      ctaText: 'Audit Redaction Leaks →'
    },
    secondaryTool: {
      name: 'Permanent 300 DPI Redactor',
      route: '/redact-pdf',
      description: 'Burn black boxes directly into raster pixels to permanently destroy character glyphs.',
      ctaText: 'Burn Redactions at 300 DPI →'
    },
    links: [
      {
        target: '<a href="/editor" class="text-cyan-400 font-semibold underline">PrintSign PDF Editor</a>',
        replacement: '<a href="/verify-redaction" class="text-cyan-400 font-semibold underline">audit redacted documents with the PDF Verifier</a> and execute true destruction with the <a href="/redact-pdf" class="text-cyan-400 font-semibold underline">Permanent 300 DPI Redactor</a>'
      }
    ]
  },
  'hipaa-compliant-pdf-editor-medical-records': {
    primaryTool: {
      name: 'HIPAA PDF Redaction Suite',
      route: '/hipaa-compliant-pdf-redaction',
      description: 'Redact patient PHI 100% inside your browser RAM without requiring a cloud BAA.',
      ctaText: 'Launch HIPAA Redactor →'
    },
    secondaryTool: {
      name: 'PHI Sanitization Verifier',
      route: '/verify-redaction',
      description: 'Verify medical charts and diagnostic records contain zero extractable text under boxes.',
      ctaText: 'Verify PHI Sanitization →'
    },
    links: [
      {
        target: '<a href="/editor" class="text-cyan-400 font-semibold underline">PrintSign PDF Editor</a>',
        replacement: '<a href="/hipaa-compliant-pdf-redaction" class="text-cyan-400 font-semibold underline">HIPAA-Compliant PDF Redactor</a> or audit charts using the <a href="/verify-redaction" class="text-cyan-400 font-semibold underline">Client-Side PDF Verifier</a>'
      }
    ]
  },
  'best-free-adobe-acrobat-alternatives-2026': {
    primaryTool: {
      name: 'Acrobat Alternative Suite',
      route: '/ilovepdf-smallpdf-offline-alternative',
      description: 'Free, zero-subscription client-side PDF editor and redaction suite without cloud fees.',
      ctaText: 'Explore Private Alternative →'
    },
    secondaryTool: {
      name: 'Permanent PDF Redactor',
      route: '/redact-pdf',
      description: 'Court-grade 300 DPI redaction without an expensive Adobe Acrobat Pro subscription.',
      ctaText: 'Redact Documents Free →'
    },
    links: [
      {
        target: '<a href="/editor" class="text-cyan-400 font-semibold underline">PrintSign PDF Editor</a>',
        replacement: '<a href="/ilovepdf-smallpdf-offline-alternative" class="text-cyan-400 font-semibold underline">private Adobe Acrobat alternative</a> with the <a href="/redact-pdf" class="text-cyan-400 font-semibold underline">Permanent 300 DPI Redaction Tool</a>'
      }
    ]
  },
  'high-dpi-pdf-rasterization-guide-300-600-dpi': {
    primaryTool: {
      name: 'High-DPI PDF Rasterizer',
      route: '/flatten-rasterize-pdf',
      description: 'Flatten complex vector pages and annotations into 300 or 600 DPI courtroom bitmaps.',
      ctaText: 'Rasterize PDF Locally →'
    },
    secondaryTool: {
      name: 'Permanent PDF Redactor',
      route: '/redact-pdf',
      description: 'Permanently burn redaction blocks into flattened 300 DPI raster pixels.',
      ctaText: 'Open 300 DPI Redactor →'
    },
    links: [
      {
        target: '<a href="/editor" class="text-cyan-400 font-semibold underline">PrintSign PDF Editor</a>',
        replacement: '<a href="/flatten-rasterize-pdf" class="text-cyan-400 font-semibold underline">High-DPI PDF Rasterizer</a> and the <a href="/redact-pdf" class="text-cyan-400 font-semibold underline">Permanent 300 DPI Redactor</a>'
      }
    ]
  },
  'offline-pwa-pdf-editor-how-it-works': {
    primaryTool: {
      name: 'Zero-Network Verifier',
      route: '/verify-redaction',
      description: 'Test air-gapped local browser memory execution with zero outbound network calls.',
      ctaText: 'Test In-Memory Verifier →'
    },
    secondaryTool: {
      name: 'Offline PDF Redactor',
      route: '/redact-pdf',
      description: 'Perform permanent court-grade redaction with Wi-Fi completely turned off.',
      ctaText: 'Redact While Offline →'
    },
    links: [
      {
        target: '<a href="/editor" class="text-cyan-400 font-semibold underline">PrintSign PDF Editor</a>',
        replacement: '<a href="/verify-redaction" class="text-cyan-400 font-semibold underline">Zero-Network PDF Verifier</a> and redact offline with the <a href="/redact-pdf" class="text-cyan-400 font-semibold underline">Permanent Redactor</a>'
      }
    ]
  },
  'gdpr-article-32-pdf-data-protection': {
    primaryTool: {
      name: 'NIST & GDPR Sanitizer',
      route: '/nist-800-88-pdf-sanitization',
      description: 'Sanitize document structures and purge unreferenced indirect objects for GDPR compliance.',
      ctaText: 'Meet Sanitization Standards →'
    },
    secondaryTool: {
      name: 'Metadata & XMP Scrubber',
      route: '/scrub-pdf-metadata',
      description: 'Strip personal data, author names, and client software telemetry from PDF files.',
      ctaText: 'Scrub Personal Identifiers →'
    },
    links: [
      {
        target: '<a href="/editor" class="text-cyan-400 font-semibold underline">PrintSign PDF Editor</a>',
        replacement: '<a href="/nist-800-88-pdf-sanitization" class="text-cyan-400 font-semibold underline">NIST SP 800-88 PDF Sanitization</a> and the <a href="/scrub-pdf-metadata" class="text-cyan-400 font-semibold underline">Metadata &amp; XMP Scrubber</a>'
      }
    ]
  },
  'how-to-rotate-reorder-delete-pdf-pages': {
    primaryTool: {
      name: 'Reorder & Rotate PDF',
      route: '/reorder-rotate-pdf',
      description: 'Organize pages, fix upside-down scans, and delete unnecessary sheets locally.',
      ctaText: 'Reorder & Rotate Pages →'
    },
    secondaryTool: {
      name: 'Split PDF Pages',
      route: '/split-pdf',
      description: 'Extract specific page ranges into new standalone documents.',
      ctaText: 'Split Custom Ranges →'
    },
    links: [
      {
        target: '<a href="/editor" class="text-cyan-400 font-semibold underline">PrintSign PDF Editor</a>',
        replacement: '<a href="/reorder-rotate-pdf" class="text-cyan-400 font-semibold underline">Reorder &amp; Rotate PDF Pages</a> or extract custom ranges with <a href="/split-pdf" class="text-cyan-400 font-semibold underline">Split PDF</a>'
      }
    ]
  },
  'flatten-pdf-form-fields-signatures-security': {
    primaryTool: {
      name: 'PDF Form & Signature Flattener',
      route: '/flatten-rasterize-pdf',
      description: 'Lock interactive AcroForms, signatures, and annotations into immutable pixels.',
      ctaText: 'Flatten Form Fields →'
    },
    secondaryTool: {
      name: 'Interactive Layer Verifier',
      route: '/verify-redaction',
      description: 'Verify form fields and interactive annotations are completely neutralized.',
      ctaText: 'Audit Flattened PDF →'
    },
    links: [
      {
        target: '<a href="/editor" class="text-cyan-400 font-semibold underline">PrintSign PDF Editor</a>',
        replacement: '<a href="/flatten-rasterize-pdf" class="text-cyan-400 font-semibold underline">Flatten PDF Forms &amp; Signatures</a> and verify interactive layers with the <a href="/verify-redaction" class="text-cyan-400 font-semibold underline">PDF Verifier</a>'
      }
    ]
  },
  'legal-discovery-ediscovery-pdf-sanitization': {
    primaryTool: {
      name: 'NIST SP 800-88 Legal Sanitizer',
      route: '/nist-800-88-pdf-sanitization',
      description: 'FRCP Rule 26 & 37 compliant sanitization and orphan object garbage collection.',
      ctaText: 'Sanitize Legal Filings →'
    },
    secondaryTool: {
      name: 'Permanent PDF Redactor',
      route: '/redact-pdf',
      description: 'Irrevocably remove privileged attorney work-product at 300 DPI.',
      ctaText: 'Redact Privileged Text →'
    },
    links: [
      {
        target: '<a href="/editor" class="text-cyan-400 font-semibold underline">PrintSign PDF Editor</a>',
        replacement: '<a href="/nist-800-88-pdf-sanitization" class="text-cyan-400 font-semibold underline">NIST SP 800-88 Legal Sanitization Suite</a> and the <a href="/redact-pdf" class="text-cyan-400 font-semibold underline">Permanent 300 DPI Redactor</a>'
      }
    ]
  },
  'financial-document-redaction-tax-banking-privacy': {
    primaryTool: {
      name: 'Financial Document Redactor',
      route: '/redact-pdf',
      description: 'Permanently black out SSNs, bank accounts, and W-2 data with true pixel burn-in.',
      ctaText: 'Redact Financial Records →'
    },
    secondaryTool: {
      name: 'Financial Redaction Verifier',
      route: '/verify-redaction',
      description: 'Verify sensitive banking numbers are not selectable in the exported PDF.',
      ctaText: 'Verify Financial Redaction →'
    },
    links: [
      {
        target: '<a href="/editor" class="text-cyan-400 font-semibold underline">PrintSign PDF Editor</a>',
        replacement: '<a href="/redact-pdf" class="text-cyan-400 font-semibold underline">Redact Financial Documents Permanently</a> and audit tax forms with the <a href="/verify-redaction" class="text-cyan-400 font-semibold underline">PDF Redaction Verifier</a>'
      }
    ]
  },
  'zero-trust-architecture-browser-webassembly': {
    primaryTool: {
      name: 'Zero-Trust PDF Auditor',
      route: '/verify-redaction',
      description: 'Verify 0 network requests and audit client-side document memory state.',
      ctaText: 'Audit In-Memory Security →'
    },
    secondaryTool: {
      name: 'Private Offline Alternative',
      route: '/ilovepdf-smallpdf-offline-alternative',
      description: 'Learn how client-side WebAssembly obsoletes data-harvesting cloud converters.',
      ctaText: 'View Architecture Details →'
    },
    links: [
      {
        target: '<a href="/editor" class="text-cyan-400 font-semibold underline">PrintSign PDF Editor</a>',
        replacement: '<a href="/verify-redaction" class="text-cyan-400 font-semibold underline">Client-Side PDF Verifier</a> or read our <a href="/ilovepdf-smallpdf-offline-alternative" class="text-cyan-400 font-semibold underline">offline alternative comparison</a>'
      }
    ]
  },
  'compress-pdf-file-size-without-losing-quality': {
    primaryTool: {
      name: 'Lossless PDF Compressor',
      route: '/compress-pdf',
      description: 'Recompress Deflate streams and purge redundant fonts without cloud uploads.',
      ctaText: 'Compress PDF Offline →'
    },
    secondaryTool: {
      name: 'High-DPI PDF Rasterizer',
      route: '/flatten-rasterize-pdf',
      description: 'Optimize bloated vector files into high-density 150/300 DPI raster pages.',
      ctaText: 'Flatten & Optimize Pages →'
    },
    links: [
      {
        target: '<a href="/editor" class="text-cyan-400 font-semibold underline">PrintSign PDF Editor</a>',
        replacement: '<a href="/compress-pdf" class="text-cyan-400 font-semibold underline">Lossless PDF Compressor</a> or rasterize bloated pages with the <a href="/flatten-rasterize-pdf" class="text-cyan-400 font-semibold underline">High-DPI Rasterizer</a>'
      }
    ]
  },
  'remove-passwords-decrypt-pdf-client-side': {
    primaryTool: {
      name: 'Metadata & Permission Sanitizer',
      route: '/scrub-pdf-metadata',
      description: 'Purge document restrictions and tracking metadata locally in browser RAM.',
      ctaText: 'Scrub Document Metadata →'
    },
    secondaryTool: {
      name: 'Security & Redaction Verifier',
      route: '/verify-redaction',
      description: 'Audit decrypted document layers before public or client release.',
      ctaText: 'Verify Security Layers →'
    },
    links: [
      {
        target: '<a href="/editor" class="text-cyan-400 font-semibold underline">PrintSign PDF Editor</a>',
        replacement: '<a href="/scrub-pdf-metadata" class="text-cyan-400 font-semibold underline">Scrub Document Metadata</a> and test with the <a href="/verify-redaction" class="text-cyan-400 font-semibold underline">PDF Redaction &amp; Security Verifier</a>'
      }
    ]
  }
}

const raw = fs.readFileSync(blogsPath, 'utf8')
const decl = raw.indexOf('export const blogs')
const eq = raw.indexOf('=', decl)
const start = raw.indexOf('[', eq)
const catIdx = raw.indexOf('export function getBlogPostBySlug')
const blogsPart = catIdx !== -1 ? raw.substring(0, catIdx) : raw
const end = blogsPart.lastIndexOf(']')
const jsonText = blogsPart.substring(start, end + 1)

let blogList = JSON.parse(jsonText)
console.log(`Loaded ${blogList.length} blogs.`)

for (const blog of blogList) {
  const map = toolMappings[blog.slug]
  if (map) {
    blog.primaryTool = map.primaryTool
    blog.secondaryTool = map.secondaryTool

    // Replace links in content
    if (map.links) {
      for (const lk of map.links) {
        if (blog.content.includes(lk.target)) {
          blog.content = blog.content.replace(lk.target, lk.replacement)
        }
      }
    }
  }
}

const updatedJsonText = JSON.stringify(blogList, null, 2)

const newTypeScriptContent = `// PrintSign Professional Knowledge Base & Blog Data
// 100% Client-Side In-Browser PDF Engineering & Compliance Articles
// Generated automatically with 1,000+ words per article

export interface BlogFAQ {
  q: string;
  a: string;
}

export interface BlogToolLink {
  name: string;
  route: string;
  description: string;
  ctaText: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  excerpt: string;
  keywords: string[];
  hasComparison: boolean;
  faq: BlogFAQ[];
  content: string;
  primaryTool?: BlogToolLink;
  secondaryTool?: BlogToolLink;
}

export const blogs: BlogPost[] = ${updatedJsonText};

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogs.find((b) => b.slug === slug);
}

export function getRelatedPosts(currentSlug: string, count: number = 3): BlogPost[] {
  const current = getBlogPostBySlug(currentSlug);
  if (!current) return blogs.slice(0, count);
  return blogs
    .filter((b) => b.slug !== currentSlug)
    .sort((a) => (a.category === current.category ? -1 : 1))
    .slice(0, count);
}

export const blogCategories = [
  "All",
  "Legal & Compliance",
  "Security & Forensics",
  "Tutorials & How-To",
  "Comparisons & Reviews",
  "Privacy & Architecture"
];
`

fs.writeFileSync(blogsPath, newTypeScriptContent, 'utf8')
console.log('Successfully updated src/data/blogs.ts with tool mappings and exact-match keyword links!')
