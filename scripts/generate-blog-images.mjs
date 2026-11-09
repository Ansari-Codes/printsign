import { chromium } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const outputDir = path.resolve(process.cwd(), 'public/images/blogs')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const blogData = [
  {
    slug: 'how-to-permanently-redact-pdf-court-compliant',
    category: 'LEGAL & COURT COMPLIANCE',
    title: 'Court-Compliant PDF Redaction',
    subtitle: 'Permanent 300 DPI Pixel Burn vs. Cosmetic Black Boxes',
    icon: '⚖️',
    tag: 'FRCP RULE 5.2'
  },
  {
    slug: 'printsign-vs-smallpdf-ilovepdf-cloud-security',
    category: 'CLOUD SECURITY COMPARISON',
    title: 'Client-Side vs. Cloud PDF Converters',
    subtitle: 'Why Remote Server Uploads Expose Corporate Data to Subpoenas',
    icon: '🛡️',
    tag: 'ZERO EXFILTRATION'
  },
  {
    slug: 'merge-pdf-files-without-uploading-private',
    category: 'TUTORIALS & ARCHITECTURE',
    title: 'Private In-Browser PDF Merging',
    subtitle: 'XRef Table Dynamic Renumbering & AST Object Concatenation',
    icon: '📑',
    tag: 'ZERO UPLOAD'
  },
  {
    slug: 'split-pdf-extract-pages-offline',
    category: 'DOCUMENT MANIPULATION',
    title: 'Offline PDF Page Extraction & Splitting',
    subtitle: 'Surgical Page Range Slicing with Preserved Font Dictionaries',
    icon: '✂️',
    tag: 'LOCAL RAM'
  },
  {
    slug: 'hidden-pdf-metadata-scrub-xmp-streams',
    category: 'SECURITY & FORENSICS',
    title: 'Deep Metadata & XMP Stream Scrubbing',
    subtitle: 'Eliminating Author IDs, Machine Hostnames & GPS Coordinates',
    icon: '🔍',
    tag: 'XMP SANITIZATION'
  },
  {
    slug: 'why-black-boxes-fail-pdf-redaction-disasters',
    category: 'FORENSIC FAILURE MODES',
    title: 'Why Black Box PDF Redaction Fails',
    subtitle: 'Forensic Analysis of Vector Layer Extraction & Court Leaks',
    icon: '⚠️',
    tag: 'VECTOR EXCISE'
  },
  {
    slug: 'hipaa-compliant-pdf-editor-medical-records',
    category: 'HEALTHCARE COMPLIANCE',
    title: 'HIPAA & ePHI PDF Sanitization',
    subtitle: 'De-Identifying 18 HIPAA Identifiers with 100% Client-Side Privacy',
    icon: '🏥',
    tag: '45 CFR § 164.514'
  },
  {
    slug: 'best-free-adobe-acrobat-alternatives-2026',
    category: 'SOFTWARE REVIEWS',
    title: 'Top Free Adobe Acrobat Alternatives (2026)',
    subtitle: 'Private, Local WebAssembly Tools vs. Paid Cloud Bloatware',
    icon: '⭐',
    tag: 'OPEN SOURCE'
  },
  {
    slug: 'high-dpi-pdf-rasterization-guide-300-600-dpi',
    category: 'GRAPHICS & RENDERING',
    title: 'High-DPI PDF Rasterization Guide',
    subtitle: '72 vs. 150 vs. 300 vs. 600 DPI: Evidentiary Clarity & File Size',
    icon: '🎯',
    tag: '300 DPI STANDARD'
  },
  {
    slug: 'offline-pwa-pdf-editor-how-it-works',
    category: 'WEB PLATFORM ENGINEERING',
    title: 'How Offline PWA PDF Processing Works',
    subtitle: 'Service Workers, CacheStorage, and Air-Gapped Web Execution',
    icon: '⚡',
    tag: 'PWA AIR-GAP'
  },
  {
    slug: 'gdpr-article-32-pdf-data-protection',
    category: 'EUROPEAN PRIVACY LAW',
    title: 'GDPR Article 32 & PDF Data Protection',
    subtitle: 'Technical & Organizational Measures for Sensitive Documents',
    icon: '🇪🇺',
    tag: 'GDPR ARTICLE 32'
  },
  {
    slug: 'how-to-rotate-reorder-delete-pdf-pages',
    category: 'TUTORIALS & WORKFLOW',
    title: 'Rotate, Reorder & Organize PDF Pages',
    subtitle: 'Client-Side Affine Matrix Transforms & Page Tree Restructuring',
    icon: '🔄',
    tag: 'PAGE TREE AST'
  },
  {
    slug: 'flatten-pdf-form-fields-signatures-security',
    category: 'DOCUMENT DEFENSE',
    title: 'Flattening PDF Forms & Signatures',
    subtitle: 'Converting Interactive AcroForms into Immutable Pixels',
    icon: '🔒',
    tag: 'ACROFORM LOCK'
  },
  {
    slug: 'legal-discovery-ediscovery-pdf-sanitization',
    category: 'LITIGATION & E-DISCOVERY',
    title: 'Litigation & E-Discovery PDF Sanitization',
    subtitle: 'FRCP Rule 26/37 Compliance & Defensible Production Checklists',
    icon: '🏛️',
    tag: 'FRCP RULE 26'
  },
  {
    slug: 'financial-document-redaction-tax-banking-privacy',
    category: 'FINANCIAL DATA SECURITY',
    title: 'Redacting Financial & Tax Documents',
    subtitle: 'Protecting SSNs, Bank Routing & W-2s from Identity Theft',
    icon: '💳',
    tag: 'GLBA COMPLIANCE'
  },
  {
    slug: 'zero-trust-architecture-browser-webassembly',
    category: 'SYSTEMS ARCHITECTURE',
    title: 'Zero-Trust WebAssembly Document Engine',
    subtitle: 'Volatile RAM Sandboxing, Web Workers & Memory GC Lifecycle',
    icon: '🚀',
    tag: 'WASM SANDBOX'
  },
  {
    slug: 'compress-pdf-file-size-without-losing-quality',
    category: 'DATA COMPRESSION',
    title: 'Lossless PDF Compression Algorithms',
    subtitle: 'Deflate Stream Optimization, Font Deduplication & FlateDecode',
    icon: '📦',
    tag: 'FLATEDECODE'
  },
  {
    slug: 'remove-passwords-decrypt-pdf-client-side',
    category: 'CRYPTOGRAPHY & SECURITY',
    title: 'Client-Side PDF Decryption & Permission Reset',
    subtitle: 'AES-256 Key Derivation in Browser RAM with Zero Password Leakage',
    icon: '🔑',
    tag: 'AES-256 KEYGEN'
  }
]

async function generateAllImages() {
  console.log(`Starting generation of ${blogData.length} blog PNG banner images...`)
  const browser = await chromium.launch()

  for (let i = 0; i < blogData.length; i++) {
    const item = blogData[i]
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px;
    height: 630px;
    background: #060a14;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }
  .bg-grid {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(to right, rgba(14, 165, 233, 0.04) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(14, 165, 233, 0.04) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .glow-cyan {
    position: absolute;
    top: -100px;
    right: -100px;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, transparent 70%);
  }
  .glow-indigo {
    position: absolute;
    bottom: -120px;
    left: -100px;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
  }
  .card {
    position: relative;
    z-index: 10;
    width: 1120px;
    height: 550px;
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(8, 12, 22, 0.95) 100%);
    border: 1px solid rgba(56, 189, 248, 0.25);
    border-radius: 28px;
    padding: 56px 64px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.85);
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(6, 182, 212, 0.12);
    border: 1px solid rgba(6, 182, 212, 0.35);
    color: #22d3ee;
    padding: 6px 14px;
    border-radius: 9999px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .tag {
    display: inline-flex;
    align-items: center;
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid rgba(71, 85, 105, 0.6);
    color: #cbd5e1;
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    font-family: monospace;
    letter-spacing: 0.05em;
  }
  .middle {
    margin: auto 0;
  }
  .icon-banner {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
  }
  .icon-box {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%);
    border: 1px solid rgba(56, 189, 248, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
  }
  .title {
    font-size: 44px;
    font-weight: 900;
    line-height: 1.15;
    color: #ffffff;
    letter-spacing: -0.02em;
    max-width: 980px;
    margin-bottom: 14px;
  }
  .subtitle {
    font-size: 20px;
    font-weight: 400;
    color: #94a3b8;
    line-height: 1.4;
    max-width: 900px;
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 24px;
    border-top: 1px solid rgba(51, 65, 85, 0.6);
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .brand-logo {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, #06b6d4, #3b82f6);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 18px;
    color: #ffffff;
  }
  .brand-name {
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.01em;
    color: #ffffff;
  }
  .brand-tagline {
    font-size: 12px;
    color: #64748b;
    margin-left: 6px;
  }
  .security-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #34d399;
    font-size: 13px;
    font-weight: 600;
  }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #34d399;
    box-shadow: 0 0 10px #34d399;
  }
</style>
</head>
<body>
  <div class="bg-grid"></div>
  <div class="glow-cyan"></div>
  <div class="glow-indigo"></div>

  <div class="card">
    <div class="header">
      <div class="badge">${item.category}</div>
      <div class="tag">${item.tag}</div>
    </div>

    <div class="middle">
      <div class="icon-banner">
        <div class="icon-box">${item.icon}</div>
      </div>
      <h1 class="title">${item.title}</h1>
      <p class="subtitle">${item.subtitle}</p>
    </div>

    <div class="footer">
      <div class="brand">
        <div class="brand-logo">🛡️</div>
        <span class="brand-name">PrintSign</span>
        <span class="brand-tagline">• 100% Client-Side PDF Engineering</span>
      </div>
      <div class="security-pill">
        <span class="dot"></span>
        <span>Zero Network Exfiltration • Local RAM</span>
      </div>
    </div>
  </div>
</body>
</html>`

    await page.setContent(html, { waitUntil: 'load' })
    const targetFile = path.resolve(outputDir, `${item.slug}.png`)
    await page.screenshot({ path: targetFile, omitBackground: false })
    await page.close()
    console.log(`✓ [${i + 1}/${blogData.length}] Generated ${item.slug}.png`)
  }

  await browser.close()
  console.log(`\n🎉 All ${blogData.length} blog PNG banner images generated in public/images/blogs/!\n`)
}

generateAllImages().catch(err => {
  console.error('Image generation error:', err)
  process.exit(1)
})
