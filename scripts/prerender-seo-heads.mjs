import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import katex from 'katex'
import { seoMetadata, faqs } from '../src/config/seoMetadata.js'
import { toolSeoContent } from '../src/config/seoContent.js'
import { generateSitemap } from './generate-sitemap.mjs'
import { generateLlmsTxt } from './generate-llms-txt.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const distDir = path.resolve(rootDir, 'dist')
const distIndexHtml = path.resolve(distDir, 'index.html')

function escapeAttr(str) {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function loadBlogPosts() {
  const blogsPath = path.resolve(rootDir, 'src/data/blogs.ts')
  if (!fs.existsSync(blogsPath)) {
    console.warn('[prerender] src/data/blogs.ts not found.')
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
    console.warn('[prerender] Failed to parse blogs.ts JSON:', err.message)
    return []
  }
}

function renderLatex(formula, displayMode = true) {
  try {
    let clean = formula
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim()
    // Normalize any consecutive backslashes before a LaTeX command/macro/symbol to exactly ONE backslash
    // e.g. \\frac -> \frac, \\left -> \left, \\right -> \right, \\text -> \text, \\times -> \times
    clean = clean.replace(/\\+([a-zA-Z{}$%&_#])/g, '\\$1')
    return katex.renderToString(clean, {
      displayMode,
      throwOnError: false
    })
  } catch {
    return formula
  }
}

const SHARED_TOOL_NAV_HTML = `
    <nav aria-label="Primary PrintSign Tools & Directory">
      <ul>
        <li><a href="/redact-pdf">Redact PDF (300 DPI Pixel Burn)</a></li>
        <li><a href="/verify-redaction">PDF Redaction &amp; Metadata Verifier</a></li>
        <li><a href="/scrub-pdf-metadata">Scrub PDF Metadata &amp; XMP Streams</a></li>
        <li><a href="/sign-pdf">Sign PDF Offline in Browser RAM</a></li>
        <li><a href="/unlock-decrypt-pdf">Remove PDF Password &amp; Decrypt Locally</a></li>
        <li><a href="/watermark-pdf">Add Confidential &amp; Bates Watermarks</a></li>
        <li><a href="/extract-pdf-pages">Extract Specific PDF Pages Locally</a></li>
        <li><a href="/merge-pdf">Merge Multiple PDFs Offline</a></li>
        <li><a href="/split-pdf">Split PDF by Page Ranges</a></li>
        <li><a href="/flatten-rasterize-pdf">Flatten &amp; Rasterize PDF Layers</a></li>
        <li><a href="/reorder-rotate-pdf">Reorder &amp; Rotate PDF Pages</a></li>
        <li><a href="/compress-pdf">Lossless Local PDF Compressor</a></li>
        <li><a href="/for-lawyers">For Lawyers (FRCP 5.2)</a></li>
        <li><a href="/for-healthcare">For Healthcare (HIPAA)</a></li>
        <li><a href="/for-journalists">For Journalists (FOIA &amp; Source Defense)</a></li>
        <li><a href="/for-finance-accounting">For Finance, Tax &amp; CPA Firms</a></li>
        <li><a href="/gdpr-article-32-pdf-compliance">GDPR Article 32 PDF Compliance</a></li>
        <li><a href="/foia-document-redaction-tool">FOIA Public Records Redaction Tool</a></li>
        <li><a href="/sitemap">Complete 54-Page HTML Directory</a></li>
      </ul>
    </nav>`

const SHARED_ZERO_CLOUD_GUARANTEE_HTML = `
      <section class="security-guarantee" aria-label="Zero-Cloud Execution & Directory">
        <h3>PrintSign Client-Side Privacy Architecture &amp; Full Tool Directory</h3>
        <p>Every PDF utility on PrintSign.org processes sensitive agreements, medical records, court filings, FOIA releases, and financial statements purely inside local browser RAM with zero server uploads, zero external tracking beacons, and full offline Progressive Web App (PWA) caching. Verify network isolation anytime via our F12 Network Audit protocol or generate local SHA-256 Sanitization Audit Certificates after export.</p>
        ${SHARED_TOOL_NAV_HTML}
      </section>`

function buildNonToolSemanticBody(routePath, seo, blogs = []) {
  const toolNavHtml = SHARED_TOOL_NAV_HTML

  const coreArchitectureSection = `
    <article>
      <h2>Zero-Cloud Client-Side WebAssembly Document Architecture</h2>
      <p>PrintSign.org executes every PDF inspection, redaction, metadata scrubbing, digital signing, decryption, page splitting, merging, and compression workload purely inside local browser RAM via WebAssembly, PDF.js, pdf-lib, and fflate. Unlike server-dependent PDF converters, PrintSign operates without backend upload pipelines, multi-tenant cloud storage buckets, proxy log retention, or automated model-training ingestion.</p>
      <p>Under modern data governance frameworks including HIPAA Security Rule 45 CFR § 164.312, EU GDPR Article 32, Federal Rule of Civil Procedure 5.2, IRS Publication 4557, and NIST SP 800-88 Rev. 1, transmitting unredacted exhibits, patient charts, or taxpayer filings to unvetted SaaS vendors creates preventable third-party breach liability. By keeping every ArrayBuffer strictly within isolated browser worker threads, organizations verify complete network silence through F12 Developer Tools or offline air-gapped Progressive Web App mode.</p>
    </article>
    <article>
      <h2>True 300 DPI Destructive Redaction vs. Superficial Black Boxes</h2>
      <p>Conventional document editors often draw black vector rectangles atop text coordinates while leaving original ASCII and Unicode glyph matrices, hidden OCR layers, incremental revision trailers, and XMP creator fields completely recoverable. PrintSign destroys redacted regions deterministically by rendering targeted pages onto isolated offscreen canvases at 300 to 600 DPI, burning opaque redaction pixels permanently into flattened bitmap surfaces, removing original character operators, purging Info and XMP metadata dictionaries, and computing verifiable SHA-256 cryptographic audit digests locally via the Web Crypto API.</p>
      <p>Once redacted and sanitized, every document undergoes strict catalog reconstruction and orphan object garbage collection through pdf-lib, pruning deleted indirect references and historical cross-reference streams before saving to local disk. Organizations can drop any redacted export directly into our local PDF Redaction Verifier to scan for residual text extraction strings, audit XMP XML trees, and issue a tamper-evident SHA-256 Sanitization Audit Certificate completely offline without third-party SaaS fees, account logins, upload caps, or telemetry tracking.</p>
    </article>`

  let routeSpecificSection = ''

  if (routePath === '/faq') {
    const faqItemsHtml = (faqs || [])
      .map(
        f => `      <div class="faq-item">
        <h3>${escapeAttr(f.question)}</h3>
        <p>${escapeAttr(f.answer)}</p>
      </div>`
      )
      .join('\n')
    routeSpecificSection = `
    <section>
      <h2>Frequently Asked Questions on Client-Side PDF Security &amp; Redaction</h2>
      ${faqItemsHtml}
    </section>`
  } else if (routePath === '/blog') {
    const blogLinksHtml = (blogs || [])
      .map(
        b => `      <article>
        <h3><a href="/blog/${escapeAttr(b.slug)}">${escapeAttr(b.title)}</a></h3>
        <p><strong>${escapeAttr(b.category)}</strong> (${escapeAttr(b.readTime)}) — ${escapeAttr(b.excerpt)}</p>
      </article>`
      )
      .join('\n')
    routeSpecificSection = `
    <section>
      <h2>All Technical Engineering &amp; Regulatory Compliance Articles</h2>
      ${blogLinksHtml}
    </section>`
  } else if (routePath === '/guides') {
    routeSpecificSection = `
    <section>
      <h2>Step-by-Step Operational Playbooks for Sensitive Documents</h2>
      <article>
        <h3>1. Permanent Legal &amp; Court-Compliant PDF Redaction (FRCP Rule 5.2)</h3>
        <p>Load discovery exhibits locally in browser RAM, draw opaque black masks over Social Security digits, minor names, financial account numbers, and sealed settlement clauses, apply 300 DPI destructive rasterization, and inspect the resulting export inside the PrintSign Redaction Verifier before e-filing on CM/ECF.</p>
      </article>
      <article>
        <h3>2. HIPAA Safe Harbor Clinical Record De-Identification</h3>
        <p>Remove all 18 HIPAA Safe Harbor identifiers—including patient names, dates narrower than year, Medical Record Numbers, health plan beneficiary numbers, and workstation XMP metadata—purely inside workstation memory with zero Business Associate Agreement exposure.</p>
      </article>
      <article>
        <h3>3. Forensic Metadata Scrubbing &amp; FOIA Public Release Auditing</h3>
        <p>Prior to distributing government FOIA responses, whistleblower sources, or corporate contracts, run the local Metadata Scrubber to clear Info trailer tags, workstation usernames, Active Directory paths, printer telemetry, and residual incremental streams, then issue a local SHA-256 Sanitization Certificate.</p>
      </article>
      <article>
        <h3>4. F12 Network Silence Verification &amp; Air-Gapped PWA Deployment</h3>
        <p>Open browser Developer Tools (F12 Network Monitor), enable Preserve Log, or toggle Offline Mode after installing PrintSign as a cached Progressive Web App to verify empirically that zero document bytes leave your local RAM during multi-page redaction or PDF merging.</p>
      </article>
    </section>`
  } else if (routePath === '/features' || routePath === '/security-architecture') {
    routeSpecificSection = `
    <section>
      <h2>Technical Security Controls &amp; Client-Side Sanitization Pipeline</h2>
      <ul>
        <li><strong>Memory Isolation Architecture:</strong> Binary PDF inputs are loaded cleanly as native Uint8Array buffers inside client JavaScript and Web Worker scopes without external storage calls or remote API serialization.</li>
        <li><strong>Deterministic Pixel Rasterization Engine:</strong> Redact and Flatten modes convert vector glyph instructions, overlay annotations, and interactive AcroForms into dense 300/600 DPI canvas bitmaps so hidden text cannot survive beneath masks.</li>
        <li><strong>Catalog &amp; Trailer Garbage Collection:</strong> Rebuilds the PDF structural cross-reference table from sanitized page roots via pdf-lib while clearing unreferenced orphan streams and historical edit trailers.</li>
        <li><strong>Web Crypto SHA-256 Audit Verification:</strong> Computes local cryptographic digests via crypto.subtle.digest without transmitting fingerprints or file headers to external servers.</li>
        <li><strong>Strict Zero-Tracker Content Integrity:</strong> Ships with zero third-party advertising networks, zero ad-tech scripts, zero behavioral analytics cookies, and zero external third-party tracking preconnects.</li>
      </ul>
    </section>`
  } else if (routePath === '/privacy-policy' || routePath === '/cookie-policy' || routePath === '/terms-of-service') {
    routeSpecificSection = `
    <section>
      <h2>Zero-Data-Collection Governance &amp; Local Browser Storage Policy</h2>
      <article>
        <h3>Zero Document Transmission &amp; Server Non-Retention</h3>
        <p>PrintSign.org does not operate cloud ingestion endpoints, file conversion clusters, or user document databases. Files opened inside PrintSign remain exclusively in transient volatile browser memory on your computer and are purged automatically when you close the browser tab.</p>
      </article>
      <article>
        <h3>Local Offline PWA Cache &amp; Functional Storage Only</h3>
        <p>PrintSign deploys strictly functional Service Worker asset caching and optional local IndexedDB state recovery solely so users can execute edits reliably offline without re-downloading static JavaScript bundles. PrintSign places zero advertising cookies, zero cross-site identifiers, and zero behavioral fingerprinting pixels.</p>
      </article>
      <article>
        <h3>Open-Source Transparency Under MIT License</h3>
        <p>The PrintSign client application architecture is published openly under the permissive MIT License, empowering enterprise infosec teams, journalists, attorneys, and medical compliance officers to inspect static bundles, test CSP compliance, and verify air-gap behavior independently.</p>
      </article>
    </section>`
  } else if (routePath === '/about-us' || routePath === '/contact-us') {
    routeSpecificSection = `
    <section>
      <h2>PrintSign Engineering Mission &amp; Security Disclosure Governance</h2>
      <article>
        <h3>Built to End Cloud PDF Privacy Compromises</h3>
        <p>Most mainstream online PDF utilities subsidize free utilities by forcing server uploads, throttling multi-page merges behind paywalls, or embedding heavy programmatic ad-tech trackers alongside legal and medical user files. PrintSign demonstrates that modern WebAssembly and HTML5 Canvas engines deliver instant desktop-grade performance locally on everyday laptops without remote upload infrastructure.</p>
      </article>
      <article>
        <h3>Coordinated Security Disclosures &amp; Engineering Contact</h3>
        <p>Security researchers, enterprise compliance directors, and open-source contributors can review RFC 9116 vulnerability disclosure policies at /.well-known/security.txt, inspect live repository commits on GitHub, verify our F12 Network Audit protocol, or submit bug reports and compliance documentation questions directly through our official contact channels.</p>
      </article>
    </section>`
  } else {
    // Homepage '/' and '/general-editor'
    routeSpecificSection = `
    <section>
      <h2>Complete Offline PDF Toolkit for Legal, Medical, Government &amp; Finance Workflows</h2>
      <article>
        <h3>All-in-One In-Browser Document Sanitization &amp; Manipulation</h3>
        <p>From drawing permanent 300 DPI redactions over Social Security numbers to removing XMP author streams, signing legal MSAs offline, unlocking authorized encrypted bank statements, applying tamper-resistant Bates watermarks, extracting individual binder pages, merging discovery exhibits, and compressing large reports losslessly—PrintSign unifies 13 specialized client-side tools inside one responsive dark-mode workspace.</p>
      </article>
      <article>
        <h3>Verifiable Compliance Without Software Licenses or Cloud Risk</h3>
        <p>Whether you prepare federal court filings under FRCP Rule 5.2, protect patient records under HIPAA Safe Harbor, fulfill EU GDPR Article 32 pseudonymization audits, safeguard taxpayer returns under IRS Publication 4557, or audit municipal FOIA disclosures, every step runs audibly silent on your own CPU and RAM.</p>
      </article>
    </section>`
  }

  return `<div id="app">
    <header>
      <h1>${escapeAttr(seo.h1 || seo.title)}</h1>
      <p class="tool-lead">${escapeAttr(seo.description)}</p>
    </header>
    <main>
      ${routeSpecificSection}
      ${coreArchitectureSection}
      <section>
        <h2>Direct Links to All PrintSign Tools, Compliance Hubs &amp; Site Directory</h2>
        ${toolNavHtml}
      </section>
    </main>
  </div>`
}

function generateSemanticBody(routePath, seo, blogs = []) {
  if (seo.blogContent) {
    let articleHtml = seo.blogContent
    // Render KaTeX for <div class="math-formula">...</div>
    articleHtml = articleHtml.replace(/<div class="math-formula">([\s\S]*?)<\/div>/gi, (_match, formula) => {
      const rendered = renderLatex(formula, true)
      return `<div class="math-formula katex-rendered">${rendered}</div>`
    })

    // Render KaTeX for block $$...$$
    articleHtml = articleHtml.replace(/\$\$([\s\S]*?)\$\$/g, (_match, formula) => {
      const rendered = renderLatex(formula, true)
      return `<div class="math-block"><div class="math-formula katex-rendered">${rendered}</div></div>`
    })

    // Render KaTeX for inline \(...\)
    articleHtml = articleHtml.replace(/\\\(([\s\S]*?)\\\)/g, (_match, formula) => {
      return renderLatex(formula, false)
    })

    return `<div id="app">
    <header>
      <h1>${escapeAttr(seo.h1 || seo.title)}</h1>
      <p class="tool-lead">${escapeAttr(seo.description)}</p>
    </header>
    <main>
      <article class="article-content">
        ${articleHtml}
      </article>
    </main>
  </div>`
  }

  const content = toolSeoContent[routePath]

  if (!content) {
    return buildNonToolSemanticBody(routePath, seo, blogs)
  }

  const highlightsHtml = content.highlights
    .map(
      h => `        <div class="highlight-card">
          <h3>${escapeAttr(h.title)}</h3>
          <p>${escapeAttr(h.desc)}</p>
        </div>`
    )
    .join('\n')

  const sectionsHtml = content.sections
    .map(sec => {
      const pTags = sec.paragraphs.map(p => `        <p>${escapeAttr(p)}</p>`).join('\n')
      const bTags =
        sec.bullets && sec.bullets.length > 0
          ? `        <ul>\n${sec.bullets.map(b => `          <li><strong>${escapeAttr(b.split(':')[0] || b)}:</strong> ${escapeAttr(b.split(':').slice(1).join(':') || '')}</li>`).join('\n')}\n        </ul>`
          : ''
      return `      <article>
        <h3>${escapeAttr(sec.title)}</h3>
${pTags}
${bTags}
      </article>`
    })
    .join('\n\n')

  const faqHtml =
    content.faq && content.faq.length > 0
      ? `      <section class="faq-section">
        <h3>Frequently Asked Questions</h3>
${content.faq
  .map(
    f => `        <div class="faq-item">
          <h4>${escapeAttr(f.q)}</h4>
          <p>${escapeAttr(f.a)}</p>
        </div>`
  )
  .join('\n')}
      </section>`
      : ''

  return `<div id="app">
    <header>
      <h1>${escapeAttr(seo.h1 || seo.title)}</h1>
      <p class="tool-lead">${escapeAttr(seo.description)}</p>
    </header>
    <main>
      <section class="seo-content" aria-label="Technical Specifications & Document Security Information">
        <div class="badge">${escapeAttr(content.badge)}</div>
        <h2>${escapeAttr(content.heading)}</h2>
        <p class="subheading">${escapeAttr(content.subheading)}</p>
        <div class="highlights-grid">
${highlightsHtml}
        </div>
        <div class="long-form-sections">
${sectionsHtml}
        </div>
${faqHtml}
      </section>
${SHARED_ZERO_CLOUD_GUARANTEE_HTML}
    </main>
  </div>`
}

function prerenderRoute(template, routePath, seo, blogs = []) {
  const canonicalUrl = `https://printsign.org${routePath === '/' ? '/' : routePath}`
  let html = template

  // Replace <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttr(seo.title)}</title>`)

  // Replace <meta name="title" ...>
  html = html.replace(
    /<meta\s+name=["']title["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="title" content="${escapeAttr(seo.title)}" />`
  )

  // Replace <meta name="description" ...>
  html = html.replace(
    /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="description" content="${escapeAttr(seo.description)}" />`
  )

  // Replace <link rel="canonical" ...>
  html = html.replace(
    /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i,
    `<link rel="canonical" href="${canonicalUrl}" />`
  )

  // Replace OpenGraph
  html = html.replace(
    /<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:title" content="${escapeAttr(seo.title)}" />`
  )
  html = html.replace(
    /<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:description" content="${escapeAttr(seo.description)}" />`
  )
  html = html.replace(
    /<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:url" content="${canonicalUrl}" />`
  )
  html = html.replace(
    /<meta\s+property=["']og:type["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:type" content="${seo.ogType || 'website'}" />`
  )

  const ogImg = seo.ogImage || (routePath.startsWith('/blog/') ? `https://printsign.org/images/blogs/${routePath.replace('/blog/', '')}.png` : 'https://printsign.org/images/og/home.png')
  const ogAlt = seo.ogImageAlt || seo.title

  html = html.replace(
    /<meta\s+property=["']og:image["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:image" content="${ogImg}" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta property="og:image:type" content="image/png" />\n    <meta property="og:image:alt" content="${escapeAttr(ogAlt)}" />`
  )

  // Replace Twitter
  html = html.replace(
    /<meta\s+property=["']twitter:title["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="twitter:title" content="${escapeAttr(seo.title)}" />`
  )
  html = html.replace(
    /<meta\s+property=["']twitter:description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="twitter:description" content="${escapeAttr(seo.description)}" />`
  )
  html = html.replace(
    /<meta\s+property=["']twitter:image["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="twitter:image" content="${ogImg}" />\n    <meta property="twitter:image:alt" content="${escapeAttr(ogAlt)}" />`
  )

  // Replace JSON-LD schema
  if (seo.schema) {
    const jsonLdString = JSON.stringify(seo.schema, null, 2)
    const scriptReplacement = `<script type="application/ld+json">\n${jsonLdString}\n    </script>`
    if (/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i.test(html)) {
      html = html.replace(
        /<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i,
        scriptReplacement
      )
    } else {
      html = html.replace('</head>', `    ${scriptReplacement}\n  </head>`)
    }
  }

  // Inject crawlable semantic body into <div id="app"></div>
  const semanticBody = generateSemanticBody(routePath, seo, blogs)
  html = html.replace(/<div id=["']app["']>[\s\S]*?<\/div>/i, semanticBody)

  return html
}

async function main() {
  console.log('\n--- PrintSign SEO Pre-rendering & SSG Engine ---')
  if (!fs.existsSync(distIndexHtml)) {
    console.error(`[prerender] Error: Compiled template not found at ${distIndexHtml}. Run vite build first!`)
    process.exit(1)
  }

  const baseTemplate = fs.readFileSync(distIndexHtml, 'utf8')
  const blogs = loadBlogPosts()
  console.log(`[prerender] Loaded ${Object.keys(seoMetadata).length} static routes and ${blogs.length} blog posts.`)

  const allRoutes = new Map()

  // 1. Static routes
  for (const [routePath, seo] of Object.entries(seoMetadata)) {
    allRoutes.set(routePath, seo)
  }

  // 2. Dynamic blog routes
  for (const blog of blogs) {
    const blogPath = `/blog/${blog.slug}`
    const existingSeo = seoMetadata[blogPath]
    const blogTitle = existingSeo?.title || `${blog.metaTitle.slice(0, 48)} | PrintSign`
    const blogDescription = existingSeo?.description || blog.metaDescription.slice(0, 155)

    const faqEntities = (blog.faq || []).map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          '@id': `https://printsign.org${blogPath}#article`,
          headline: blog.title,
          description: blogDescription,
          keywords: (blog.keywords || []).join(', '),
          datePublished: '2026-10-27T00:00:00+00:00',
          dateModified: '2026-10-27T00:00:00+00:00',
          author: {
            '@type': 'Organization',
            name: blog.author || 'PrintSign Security Team',
            url: 'https://printsign.org'
          },
          publisher: {
            '@type': 'Organization',
            name: 'PrintSign PDF Editor',
            url: 'https://printsign.org'
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://printsign.org${blogPath}`
          }
        },
        ...(faqEntities.length > 0
          ? [
              {
                '@type': 'FAQPage',
                mainEntity: faqEntities
              }
            ]
          : [])
      ]
    }

    allRoutes.set(blogPath, {
      title: blogTitle,
      description: blogDescription,
      h1: blog.title,
      ogType: 'article',
      ogImage: existingSeo?.ogImage,
      ogImageAlt: existingSeo?.ogImageAlt,
      blogContent: blog.content,
      schema
    })
  }

  let count = 0

  for (const [routePath, seo] of allRoutes.entries()) {
    const renderedHtml = prerenderRoute(baseTemplate, routePath, seo, blogs)

    if (routePath === '/') {
      fs.writeFileSync(distIndexHtml, renderedHtml, 'utf8')
      count++
      console.log(`✓ [200 OK] / -> dist/index.html (${seo.title})`)
    } else {
      const cleanPath = routePath.replace(/^\//, '')
      const targetFolder = path.resolve(distDir, cleanPath)
      fs.mkdirSync(targetFolder, { recursive: true })
      const targetFile = path.resolve(targetFolder, 'index.html')
      fs.writeFileSync(targetFile, renderedHtml, 'utf8')
      count++
      console.log(`✓ [200 OK] ${routePath} -> dist/${cleanPath}/index.html (${seo.title})`)
    }
  }

  // Create dist/404.html for GitHub Pages fallback
  const fallback404Path = path.resolve(distDir, '404.html')
  fs.writeFileSync(fallback404Path, baseTemplate, 'utf8')
  console.log(`✓ [SPA 404] Generated dist/404.html for GitHub Pages router fallback.`)

  // Create dist/.nojekyll for GitHub Pages
  const nojekyllPath = path.resolve(distDir, '.nojekyll')
  fs.writeFileSync(nojekyllPath, '', 'utf8')
  console.log(`✓ [NoJekyll] Generated dist/.nojekyll`)

  // Create dist/CNAME for GitHub Pages custom domain (only when deploying to apex/custom domain)
  const rawBase = (process.env.BASE_URL || process.env.VITE_BASE_URL || '/').trim()
  const isApex = rawBase === '/' || rawBase === ''
  const customDomain = process.env.CUSTOM_DOMAIN || (isApex ? 'printsign.org' : '')
  const cnamePath = path.resolve(distDir, 'CNAME')

  if (customDomain) {
    fs.writeFileSync(cnamePath, `${customDomain}\n`, 'utf8')
    console.log(`✓ [CNAME] Generated dist/CNAME for ${customDomain}`)
  } else {
    if (fs.existsSync(cnamePath)) {
      fs.unlinkSync(cnamePath)
      console.log(`✓ [CNAME] Removed dist/CNAME for subpath deployment (${rawBase})`)
    }
  }

  // Copy OpenGraph route banner images to dist
  const publicOgDir = path.resolve(rootDir, 'public', 'images', 'og')
  const distOgDir = path.resolve(distDir, 'images', 'og')
  if (fs.existsSync(publicOgDir)) {
    fs.mkdirSync(distOgDir, { recursive: true })
    const ogFiles = fs.readdirSync(publicOgDir)
    for (const file of ogFiles) {
      fs.copyFileSync(path.join(publicOgDir, file), path.join(distOgDir, file))
    }
    console.log(`✓ [OG Images] Copied ${ogFiles.length} 1200x630 banners to dist/images/og/`)
  }

  // Dynamic Sitemap & Robots.txt generation
  console.log('\n--- Generating Dynamic Sitemap & Robots.txt ---')
  generateSitemap()

  // Generate llms.txt & llms-full.txt for Generative Engine Optimization (GEO)
  generateLlmsTxt()

  console.log(`\n[prerender] Success! Total ${count} dedicated HTML files pre-rendered with semantic SEO heads and crawlable content.\n`)
}

main().catch(err => {
  console.error('[prerender] Fatal error:', err)
  process.exit(1)
})
