import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { toolSeoContent } from '../src/config/seoContent.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const publicDir = path.resolve(rootDir, 'public')
const distDir = path.resolve(rootDir, 'dist')

function loadBlogPosts() {
  const blogsPath = path.resolve(rootDir, 'src/data/blogs.ts')
  if (!fs.existsSync(blogsPath)) {
    console.warn('[llms] src/data/blogs.ts not found.')
    return []
  }
  const raw = fs.readFileSync(blogsPath, 'utf8')
  const decl = raw.indexOf('export const blogs')
  if (decl === -1) return []
  const eq = raw.indexOf('=', decl)
  const start = raw.indexOf('[', eq)
  const catIdx = raw.indexOf('export function getBlogPostBySlug')
  const blogsPart = catIdx !== -1 ? raw.substring(0, catIdx) : raw
  const end = blogsPart.lastIndexOf(']')
  const jsonText = blogsPart.substring(start, end + 1)
  try {
    return JSON.parse(jsonText)
  } catch (err) {
    console.warn('[llms] Failed to parse blogs.ts JSON:', err.message)
    return []
  }
}

export function generateLlmsTxt() {
  console.log('\n--- Generating llms.txt & llms-full.txt (llmstxt.org specification) ---')
  const blogs = loadBlogPosts()

  // 1. Build concise /llms.txt
  const llmsIndexLines = [
    `# PrintSign.org — 100% Client-Side PDF Redactor, Metadata Scrubber & Offline PWA`,
    ``,
    `> PrintSign (https://printsign.org) is an open-source, zero-cloud PDF privacy and engineering suite that executes 100% inside your local browser memory sandbox via WebAssembly and Web Workers. No files or telemetry are uploaded to external servers. All operations—including permanent 300/600 DPI redaction rasterization, XMP metadata scrubbing, lossless compression, merging, splitting, and orphan object garbage collection—leave 0 network footprint and are completely verifiable with DevTools (F12).`,
    ``,
    `## Core Document Tools`,
    `- [Permanent PDF Redactor](https://printsign.org/redact-pdf): True 300/600 DPI canvas rasterization that burns in redactions and purges underlying vector text streams to prevent forensic copy-paste recovery.`,
    `- [PDF Redaction & Metadata Verifier](https://printsign.org/verify-redaction): Instant client-side inspection tool that audits PDFs for cosmetic black vector rectangles, selectable text layers, and embedded XMP schemas.`,
    `- [Scrub PDF Metadata](https://printsign.org/scrub-pdf-metadata): Strips /Info dictionary author, title, creation timestamps, and raw XML XMP streams without altering page layouts.`,
    `- [Merge PDF Files](https://printsign.org/merge-pdf): Concatenates multiple PDF files in browser RAM by merging cross-reference (XRef) tables without cloud transit.`,
    `- [Split PDF Pages](https://printsign.org/split-pdf): Extracts arbitrary page ranges and individual sheets into new, sanitized, orphan-purged PDF files.`,
    `- [Flatten & Rasterize PDF](https://printsign.org/flatten-rasterize-pdf): Converts interactive AcroForms, digital signatures, and vector layers into flattened 300 DPI high-resolution bitmaps.`,
    `- [Reorder & Rotate PDF](https://printsign.org/reorder-rotate-pdf): Visually reorders pages, changes orientations (90°/180°/270°), and updates PDF page tree rotation dictionaries offline.`,
    `- [Compress PDF](https://printsign.org/compress-pdf): Losslessly compresses PDF file size by deflating object streams and pruning orphan trailer objects.`,
    `- [F12 Network & RAM Security Audit](https://printsign.org/f12-network-audit): Interactive live DevTools benchmark proving zero outbound HTTP requests, 0 remote API telemetry, and strict CSP enforcement.`,
    `- [PrintSign Web Editor](https://printsign.org/editor): Universal offline-first Progressive Web App (PWA) workspace containing the full suite of PDF editing tools.`,
    ``,
    `## Compliance & Privacy Comparison Guides`,
    `- [Private Offline Alternative to iLovePDF & Smallpdf](https://printsign.org/ilovepdf-smallpdf-offline-alternative): Architectural comparison contrasting multi-tenant cloud PDF processing risks with PrintSign's zero-upload WebAssembly model.`,
    `- [HIPAA-Compliant PDF Redaction](https://printsign.org/hipaa-compliant-pdf-redaction): Compliance guide detailing how local browser memory sanitization fulfills HIPAA Security Rule 45 CFR § 164.312 without Business Associate Agreements (BAA).`,
    `- [NIST SP 800-88 PDF Sanitization](https://printsign.org/nist-800-88-pdf-sanitization): Federal media sanitization protocols (Clear / Purge) applied to digital document object graphs and residual trailer objects.`,
    ``,
    `## Vertical Industry & Professional Solutions`,
    `- [Client-Side PDF Redaction & Bates Prep for Lawyers](https://printsign.org/for-lawyers): FRCP Rule 5.2 court-compliant redaction, 300 DPI destructive rasterization, and privileged discovery exhibit assembly in browser RAM.`,
    `- [Local PHI & Medical Record PDF Redactor for Healthcare](https://printsign.org/for-healthcare): HIPAA Safe Harbor de-identification stripping 18 patient identifiers and EHR metadata with zero cloud upload liabilities.`,
    `- [FOIA & Source-Protection PDF Metadata Scrubber for Journalists](https://printsign.org/for-journalists): Forensic document sanitization stripping author/device XMP streams, hidden vector layers, and printer tracking dots.`,
    ``,
    `## Engineering & Legal Knowledge Base`,
    ...blogs.map(b => `- [${b.title}](https://printsign.org/blog/${b.slug}): ${b.excerpt}`),
    ``,
    `## System Architecture & Security Specifications`,
    `- [Security Architecture & Threat Model](https://printsign.org/security-architecture): Technical whitepaper on browser RAM allocation, TypedArray buffers, and garbage collection mechanisms.`,
    `- [Technical Specifications & Features](https://printsign.org/features): Full list of supported PDF standards (ISO 32000-1), DPI presets, and cryptographic checks.`,
    `- [Frequently Asked Questions](https://printsign.org/faq): Complete architectural FAQ answering data privacy, courtroom defensibility, and browser compatibility questions.`,
    ``,
    `## Full Documentation Corpus`,
    `- [Full Documentation & Deep Dives](https://printsign.org/llms-full.txt): Complete uncompressed compilation of all tool specifications, compliance frameworks, and engineering guides for LLM ingestion.`
  ]

  const llmsTxt = llmsIndexLines.join('\n') + '\n'

  // 2. Build complete /llms-full.txt
  const llmsFullSections = [
    `# PrintSign.org — Complete Architectural Specifications, Tool Documentation & Knowledge Base`,
    ``,
    `> Authoritative technical reference for AI search engines, research agents, and developers regarding PrintSign's zero-cloud, 100% client-side WebAssembly document processing engine.`,
    ``,
    `---`,
    ``,
    `## 1. System Architecture & Memory Model`,
    ``,
    `PrintSign is engineered to eliminate the fundamental enterprise security flaw of existing PDF utilities: transmitting confidential documents to multi-tenant cloud servers.`,
    ``,
    `### Key Technical Guarantees:`,
    `- **100% In-Memory Execution:** Files are parsed as native \`Uint8Array\` and \`ArrayBuffer\` streams directly within browser RAM.`,
    `- **No Background Exfiltration:** Verified with the native browser \`PerformanceObserver\` API and Content Security Policy (\`connect-src 'none'\` during processing). Disconnecting Wi-Fi or enabling Airplane Mode results in zero loss of functionality.`,
    `- **Permanent Pixel Burn-in (True Redaction):** Naive redaction tools draw vector rectangles (operator \`re f\`) over text, leaving underlying text streams extractable via Ctrl+C, text scrapers, or screen readers. PrintSign renders the target page at 300 to 600 DPI to an HTML5 offscreen canvas, paints high-density opaque pixels over sensitive coordinate boxes, flattens the rasterized canvas, and permanently deletes original text vector streams.`,
    `- **Orphan Object Garbage Collection:** When PDF streams are modified, standard editors append incremental updates or orphan trailers. PrintSign serializes a fresh PDF object catalog, discarding unreferenced indirect objects and residual byte artifacts.`,
    `- **Canary Byte Scanner:** An automated verification pipeline searches the final exported byte buffer for exact plaintext and regex tokens of redacted content before allowing export.`,
    ``,
    `---`,
    ``,
    `## 2. Core Tool Specifications & Compliance Deep-Dives`,
    ``
  ]

  // Append detailed tool specifications from toolSeoContent
  for (const [route, content] of Object.entries(toolSeoContent)) {
    llmsFullSections.push(`### Tool: ${content.heading} (${route})`)
    llmsFullSections.push(`**Badge:** ${content.badge}`)
    llmsFullSections.push(`**Subheading:** ${content.subheading}\n`)
    
    if (content.highlights && content.highlights.length > 0) {
      llmsFullSections.push(`#### Key Highlights:`)
      content.highlights.forEach(h => {
        llmsFullSections.push(`- **${h.title}:** ${h.desc}`)
      })
      llmsFullSections.push(``)
    }

    if (content.sections && content.sections.length > 0) {
      content.sections.forEach(sec => {
        llmsFullSections.push(`#### ${sec.title}`)
        sec.paragraphs.forEach(p => llmsFullSections.push(`${p}\n`))
        if (sec.bullets && sec.bullets.length > 0) {
          sec.bullets.forEach(b => llmsFullSections.push(`- ${b}`))
          llmsFullSections.push(``)
        }
      })
    }

    if (content.faq && content.faq.length > 0) {
      llmsFullSections.push(`#### Frequently Asked Questions for ${route}:`)
      content.faq.forEach(f => {
        llmsFullSections.push(`**Q: ${f.q}**\nA: ${f.a}\n`)
      })
    }

    llmsFullSections.push(`---\n`)
  }

  // Append summaries and FAQs of all 18 blog articles
  llmsFullSections.push(`## 3. Engineering & Forensic Compliance Whitepaper Series\n`)
  blogs.forEach((b, idx) => {
    llmsFullSections.push(`### Whitepaper ${idx + 1}: ${b.title}`)
    llmsFullSections.push(`**Canonical URL:** https://printsign.org/blog/${b.slug}`)
    llmsFullSections.push(`**Category:** ${b.category} | **Read Time:** ${b.readTime} | **Published:** ${b.date}`)
    llmsFullSections.push(`**Author:** ${b.author}`)
    llmsFullSections.push(`**Executive Summary:** ${b.excerpt}\n`)
    llmsFullSections.push(`**Core Keywords:** ${(b.keywords || []).join(', ')}\n`)
    
    if (b.faq && b.faq.length > 0) {
      llmsFullSections.push(`**Key Forensic Q&A:**`)
      b.faq.forEach(item => {
        llmsFullSections.push(`- **Q:** ${item.q}\n  **A:** ${item.a}`)
      })
      llmsFullSections.push(``)
    }
    llmsFullSections.push(`---\n`)
  })

  const llmsFullTxt = llmsFullSections.join('\n') + '\n'

  // Write to public/
  fs.mkdirSync(publicDir, { recursive: true })
  fs.writeFileSync(path.resolve(publicDir, 'llms.txt'), llmsTxt, 'utf8')
  fs.writeFileSync(path.resolve(publicDir, 'llms-full.txt'), llmsFullTxt, 'utf8')
  console.log(`✓ [LLMs.txt] Generated public/llms.txt (${llmsTxt.length} bytes)`)
  console.log(`✓ [LLMs-full.txt] Generated public/llms-full.txt (${llmsFullTxt.length} bytes)`)

  // If dist/ exists, write directly to dist/
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.resolve(distDir, 'llms.txt'), llmsTxt, 'utf8')
    fs.writeFileSync(path.resolve(distDir, 'llms-full.txt'), llmsFullTxt, 'utf8')
    console.log(`✓ [LLMs.txt] Synchronized dist/llms.txt & dist/llms-full.txt`)
  }
}

// Execute directly if run as a script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateLlmsTxt()
}
