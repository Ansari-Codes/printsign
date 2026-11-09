import { chromium } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const outputDir = path.resolve(process.cwd(), 'public/images/og')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const distOutputDir = path.resolve(process.cwd(), 'dist/images/og')

export const ogRoutesData = [
  {
    fileName: 'home.png',
    route: '/',
    category: '100% CLIENT-SIDE PDF WORKSPACE',
    title: 'Zero-Cloud PDF Editor & Redactor',
    subtitle: 'Private, Offline-First Document Engineering in Browser RAM Sandbox',
    icon: '🛡️',
    tag: 'LOCAL WEBASSEMBLY'
  },
  {
    fileName: 'redact-pdf.png',
    route: '/redact-pdf',
    category: 'COURT-COMPLIANT SANITIZATION',
    title: 'Permanent PDF Redaction Suite',
    subtitle: 'True 300/600 DPI Pixel Burn-in • Vector Layer & Orphan GC Purge',
    icon: '⬛',
    tag: 'FRCP RULE 5.2'
  },
  {
    fileName: 'verify-redaction.png',
    route: '/verify-redaction',
    category: 'FORENSIC AUDIT LEAD MAGNET',
    title: 'PDF Redaction & Metadata Verifier',
    subtitle: 'Audit Selectable Text Layers, Optical Black Boxes & Hidden XMP',
    icon: '🔍',
    tag: 'PRE-FILING AUDIT'
  },
  {
    fileName: 'scrub-pdf-metadata.png',
    route: '/scrub-pdf-metadata',
    category: 'PRIVACY & IDENTITY PROTECTION',
    title: 'Deep PDF Metadata Scrubber',
    subtitle: 'Purge /Info Dictionaries, Author Telemetry & XML XMP Stream Data',
    icon: '🧼',
    tag: 'ZERO TRACE'
  },
  {
    fileName: 'merge-pdf.png',
    route: '/merge-pdf',
    category: 'IN-BROWSER CONCATENATION',
    title: 'Private PDF Merger',
    subtitle: 'Merge Multiple Documents Client-Side with Preserved Outlines & Fonts',
    icon: '📑',
    tag: 'ZERO UPLOADS'
  },
  {
    fileName: 'split-pdf.png',
    route: '/split-pdf',
    category: 'PAGE RANGE EXTRACTION',
    title: 'Surgical PDF Splitter',
    subtitle: 'Extract Page Ranges & Single Sheets with Orphan-Purged Catalogs',
    icon: '✂️',
    tag: 'LOCAL SLICING'
  },
  {
    fileName: 'flatten-rasterize-pdf.png',
    route: '/flatten-rasterize-pdf',
    category: 'DOCUMENT DEFENSIBILITY',
    title: '300/600 DPI Rasterizer & Flattener',
    subtitle: 'Flatten Interactive AcroForms, Signatures & Vector Graphic Streams',
    icon: '🖨️',
    tag: '300 DPI STANDARD'
  },
  {
    fileName: 'reorder-rotate-pdf.png',
    route: '/reorder-rotate-pdf',
    category: 'ORIENTATION & PAGE TREE OPS',
    title: 'Reorder & Rotate PDF Pages',
    subtitle: 'Fast Client-Side Page Grid, 90°/180° Rotation & Page Deletion',
    icon: '🔄',
    tag: 'PAGE TREE REINDEX'
  },
  {
    fileName: 'compress-pdf.png',
    route: '/compress-pdf',
    category: 'LOSSLESS STREAM OPTIMIZATION',
    title: 'Lossless PDF Compressor',
    subtitle: 'FlateDecode Compression & Orphan Trailer Purge Without Quality Loss',
    icon: '🗜️',
    tag: 'LOCAL DEFLATE'
  },
  {
    fileName: 'f12-network-audit.png',
    route: '/f12-network-audit',
    category: 'DEVELOPER BENCHMARK & AUDIT',
    title: '10-Second F12 Zero-Network Audit',
    subtitle: 'Live PerformanceObserver Telemetry Proving 0 Outbound API Calls',
    icon: '⚡',
    tag: 'CSP VERIFIED'
  },
  {
    fileName: 'ilovepdf-smallpdf-offline-alternative.png',
    route: '/ilovepdf-smallpdf-offline-alternative',
    category: 'ENTERPRISE PRIVACY BENCHMARK',
    title: 'Private iLovePDF & Smallpdf Alternative',
    subtitle: 'Zero Cloud Subpoena Risk • 100% In-Browser WebAssembly Sandbox',
    icon: '🛡️',
    tag: 'NO SERVER LOGS'
  },
  {
    fileName: 'hipaa-compliant-pdf-redaction.png',
    route: '/hipaa-compliant-pdf-redaction',
    category: 'HEALTHCARE PRIVACY BENCHMARK',
    title: 'HIPAA-Compliant PDF Redaction',
    subtitle: 'Sanitize 18 PHI Identifiers in RAM Without Business Associate Agreements',
    icon: '🏥',
    tag: '45 CFR § 164.312'
  },
  {
    fileName: 'nist-800-88-pdf-sanitization.png',
    route: '/nist-800-88-pdf-sanitization',
    category: 'FEDERAL SANITIZATION STANDARD',
    title: 'NIST SP 800-88 PDF Sanitization',
    subtitle: 'Defensible Clear & Purge Protocols for Digital PDF Object Graphs',
    icon: '🏛️',
    tag: 'NIST SP 800-88 R1'
  }
]

export async function generateAllOgImages() {
  console.log('\n--- Generating 1200x630 OpenGraph Preview Cards ---')
  const browser = await chromium.launch({ headless: true })

  for (let i = 0; i < ogRoutesData.length; i++) {
    const item = ogRoutesData[i]
    const page = await browser.newPage({
      viewport: { width: 1200, height: 630 },
      deviceScaleFactor: 2
    })

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px;
    height: 630px;
    background: #070b14;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
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
    background: radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, transparent 70%);
  }
  .glow-indigo {
    position: absolute;
    bottom: -120px;
    left: -100px;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, transparent 70%);
  }
  .card {
    position: relative;
    z-index: 10;
    width: 1120px;
    height: 550px;
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.90) 0%, rgba(8, 12, 22, 0.98) 100%);
    border: 1px solid rgba(56, 189, 248, 0.35);
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
    border: 1px solid rgba(6, 182, 212, 0.40);
    color: #22d3ee;
    padding: 8px 16px;
    border-radius: 9999px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .badge .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #06b6d4;
    box-shadow: 0 0 10px #06b6d4;
  }
  .tag {
    display: inline-flex;
    align-items: center;
    background: rgba(30, 41, 59, 0.85);
    border: 1px solid rgba(71, 85, 105, 0.6);
    color: #cbd5e1;
    padding: 8px 16px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.05em;
  }
  .content {
    display: flex;
    align-items: flex-start;
    gap: 32px;
  }
  .icon-box {
    width: 96px;
    height: 96px;
    border-radius: 24px;
    background: linear-gradient(135deg, rgba(6, 182, 212, 0.20) 0%, rgba(99, 102, 241, 0.20) 100%);
    border: 1px solid rgba(56, 189, 248, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    flex-shrink: 0;
    box-shadow: 0 12px 24px -6px rgba(6, 182, 212, 0.25);
  }
  .text-group {
    display: flex;
    flex-direction: column;
    gap: 14px;
    max-width: 880px;
  }
  .title {
    font-size: 44px;
    font-weight: 900;
    line-height: 1.15;
    letter-spacing: -0.02em;
    background: linear-gradient(to right, #ffffff, #e2e8f0, #bae6fd);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .subtitle {
    font-size: 20px;
    font-weight: 400;
    line-height: 1.45;
    color: #94a3b8;
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
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, #06b6d4, #4f46e5);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
  }
  .brand-name {
    font-size: 22px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.01em;
  }
  .brand-tagline {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
  }
  .security-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: rgba(16, 185, 129, 0.10);
    border: 1px solid rgba(16, 185, 129, 0.35);
    border-radius: 9999px;
    color: #34d399;
    font-size: 13px;
    font-weight: 600;
  }
  .security-pill .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 10px #10b981;
  }
</style>
</head>
<body>
  <div class="bg-grid"></div>
  <div class="glow-cyan"></div>
  <div class="glow-indigo"></div>

  <div class="card">
    <div class="header">
      <div class="badge">
        <span class="dot"></span>
        <span>${item.category}</span>
      </div>
      <div class="tag">${item.tag}</div>
    </div>

    <div class="content">
      <div class="icon-box">${item.icon}</div>
      <div class="text-group">
        <h1 class="title">${item.title}</h1>
        <p class="subtitle">${item.subtitle}</p>
      </div>
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
    const targetFile = path.resolve(outputDir, item.fileName)
    await page.screenshot({ path: targetFile, omitBackground: false })

    if (fs.existsSync(distOutputDir)) {
      const distTargetFile = path.resolve(distOutputDir, item.fileName)
      fs.copyFileSync(targetFile, distTargetFile)
    }

    await page.close()
    console.log(`✓ [${i + 1}/${ogRoutesData.length}] Generated public/images/og/${item.fileName}`)
  }

  await browser.close()
  console.log(`\n🎉 All ${ogRoutesData.length} tool & compliance OpenGraph 1200x630 cards generated in public/images/og/!\n`)
}

// Direct execution
if (process.argv[1] && process.argv[1].endsWith('generate-og-images.mjs')) {
  generateAllOgImages().catch(err => {
    console.error('OG image generation error:', err)
    process.exit(1)
  })
}
