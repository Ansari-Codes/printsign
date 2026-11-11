import { computed, isRef } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'

export const faqs = [
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

export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
}

export function buildBreadcrumbSchema(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}

export function buildHowToSchema(name, description, url, steps) {
  return {
    '@type': 'HowTo',
    name,
    description,
    totalTime: 'PT1M',
    tool: [
      {
        '@type': 'HowToTool',
        name: 'Web Browser with WebAssembly (Chrome, Firefox, Safari, Edge)'
      }
    ],
    step: steps.map((s, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: s.name,
      text: s.text,
      url: `${url}#step-${idx + 1}`
    }))
  }
}

export function buildSoftwareSourceCodeSchema() {
  return {
    '@type': 'SoftwareSourceCode',
    name: 'PrintSign Client-Side PDF Engine',
    codeRepository: 'https://github.com/Ansari-Codes/printsign',
    programmingLanguage: ['TypeScript', 'Vue 3', 'WebAssembly', 'JavaScript'],
    runtimePlatform: 'Browser Sandbox (WebAssembly & HTML5 Canvas)',
    license: 'https://opensource.org/licenses/MIT',
    author: {
      '@type': 'Organization',
      name: 'PrintSign Open Source Community',
      url: 'https://printsign.org'
    }
  }
}

export function buildWebApplicationSchema(name, description, url, featureList) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    url,
    description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any (Browser-Based WebAssembly)',
    browserRequirements: 'Requires JavaScript. Works 100% offline via Service Worker.',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD'
    },
    featureList: featureList || [
      '100% Client-Side Processing',
      'Zero Cloud Uploads',
      'Offline PWA Support'
    ]
  }
}

export function buildCompositeSchema({ webApp, howTo, breadcrumbs, sourceCode, extraNodes = [] }) {
  const base = webApp || {}
  const graph = [
    webApp,
    howTo,
    breadcrumbs,
    sourceCode,
    ...extraNodes
  ].filter(Boolean)

  return {
    ...base,
    '@graph': graph
  }
}

export const seoMetadata = {
  '/': {
    title: 'PrintSign: 100% Client-Side PDF Editor & Redactor',
    description: 'Edit, split, merge, and permanently redact PDFs locally in your browser. Zero cloud uploads, 100% private, and full offline PWA support.',
    h1: 'Zero-Cloud PDF Editor & Permanent Redaction Suite',
    toolMode: null,
    ogType: 'website',
    ogImage: 'https://printsign.org/images/og/home.png',
    ogImageAlt: 'PrintSign: 100% Client-Side PDF Editor & Redactor',
    featureList: [
      '100% Client-Side PDF Redaction',
      'Offline PDF Splitting & Merging',
      'Local Browser Storage & IndexedDB Recovery',
      'Zero Server Uploads & Zero Telemetry'
    ],
    schema: buildCompositeSchema({
      webApp: buildWebApplicationSchema(
        'PrintSign PDF Editor & Redactor',
        'Edit, split, merge, and permanently redact PDFs locally in your browser. Zero cloud uploads, 100% private, and full offline PWA support.',
        'https://printsign.org/',
        [
          'Permanent Byte-Level Redaction',
          'In-Browser PDF Merge & Split',
          'Metadata & XMP Packet Scrubber',
          'High-DPI Rasterizer',
          'Offline PWA Support'
        ]
      ),
      sourceCode: buildSoftwareSourceCodeSchema(),
      extraNodes: [
        {
          '@type': 'WebSite',
          '@id': 'https://printsign.org/#website',
          name: 'PrintSign',
          alternateName: ['PrintSign.org', 'PrintSign PDF'],
          url: 'https://printsign.org/'
        },
        {
          '@type': 'Organization',
          '@id': 'https://printsign.org/#organization',
          name: 'PrintSign',
          url: 'https://printsign.org/',
          logo: 'https://printsign.org/favicon.svg',
          sameAs: ['https://github.com/Ansari-Codes/printsign']
        }
      ]
    })
  },
  '/verify-redaction': {
    title: 'PDF Redaction & Metadata Verifier — Local Inspection Tool',
    description: 'Check if a redacted PDF still contains selectable text under boxes or hidden XMP metadata. 100% local browser inspection—no file upload.',
    h1: 'Client-Side PDF Sanitization & Redaction Verifier',
    toolMode: 'verifier',
    ogType: 'website',
    ogImage: 'https://printsign.org/images/og/verify-redaction.png',
    ogImageAlt: 'PDF Redaction & Metadata Verifier — Local Inspection Tool',
    featureList: [
      'Local PDF Redaction Verification',
      'Selectable Text Layer Detection',
      'XMP Metadata Stream Inspector',
      'Info Dictionary Audit',
      'Pure Raster Verification',
      'Zero Cloud Upload'
    ],
    schema: buildCompositeSchema({
      webApp: buildWebApplicationSchema(
        'PDF Redaction & Metadata Verifier',
        'Check if a redacted PDF still contains selectable text under boxes or hidden XMP metadata. 100% local browser inspection—no file upload.',
        'https://printsign.org/verify-redaction',
        [
          'Local PDF Redaction Verification',
          'Selectable Text Layer Detection',
          'XMP Metadata Stream Inspector'
        ]
      ),
      howTo: buildHowToSchema(
        'How to Verify PDF Redaction & Metadata Integrity',
        'Verify that a redacted PDF contains zero underlying text, hidden vector layers, or leaked metadata using client-side tools.',
        'https://printsign.org/verify-redaction',
        [
          { name: 'Load Redacted PDF', text: 'Select or drag your redacted PDF file into the local verifier in your browser.' },
          { name: 'Execute Multi-Layer Forensics', text: 'Run the client-side canary scanner to inspect text layers, XMP streams, and dictionary objects.' },
          { name: 'Review Cryptographic Audit', text: 'Confirm zero OCR canary matches, zero selectable text, and download your verification report.' }
        ]
      ),
      breadcrumbs: buildBreadcrumbSchema([
        { name: 'Home', url: 'https://printsign.org/' },
        { name: 'Document Tools', url: 'https://printsign.org/#tools' },
        { name: 'Redaction Verifier', url: 'https://printsign.org/verify-redaction' }
      ])
    })
  },
  '/f12-network-audit': {
    title: 'F12 Zero-Network Audit & Client-Side PDF Benchmark | PrintSign',
    description: "Verify PrintSign's zero-cloud PDF architecture in 10 seconds using browser DevTools (F12), PerformanceObserver telemetry, and live RAM inspection.",
    h1: '10-Second Reproducible Zero-Network & RAM Security Audit',
    toolMode: 'audit',
    ogType: 'website',
    ogImage: 'https://printsign.org/images/og/f12-network-audit.png',
    ogImageAlt: 'F12 Zero-Network Audit & Client-Side PDF Benchmark',
    featureList: [
      'Live PerformanceObserver Network Monitor',
      'One-Click In-Memory Redaction Benchmark',
      'Step-by-Step F12 Independent Verification Protocol',
      'Zero Remote API Calls (Fetch/XHR = 0)',
      'Volatile RAM Sandboxing & Auto-GC',
      'Content Security Policy (CSP) Level 3 Defensibility'
    ],
    schema: buildCompositeSchema({
      webApp: buildWebApplicationSchema(
        'F12 Zero-Network Audit & Benchmark',
        "Verify PrintSign's zero-cloud PDF architecture in 10 seconds using browser DevTools (F12), PerformanceObserver telemetry, and live RAM inspection.",
        'https://printsign.org/f12-network-audit',
        [
          'PerformanceObserver Resource Telemetry',
          'In-Memory PDF Execution Benchmark',
          'Zero-Network Exfiltration Verification'
        ]
      ),
      sourceCode: buildSoftwareSourceCodeSchema(),
      breadcrumbs: buildBreadcrumbSchema([
        { name: 'Home', url: 'https://printsign.org/' },
        { name: 'Security & Compliance', url: 'https://printsign.org/security-architecture' },
        { name: 'F12 Network Audit', url: 'https://printsign.org/f12-network-audit' }
      ])
    })
  },
  '/ilovepdf-smallpdf-offline-alternative': {
    title: 'Private Offline Alternative to iLovePDF & Smallpdf (No Upload)',
    description: 'Compare cloud PDF editors vs. PrintSign\'s 100% client-side WebAssembly architecture. Edit, merge, and redact PDFs locally without uploading files.',
    h1: 'The 100% Client-Side, Zero-Upload Alternative to Cloud PDF Tools',
    toolMode: 'comparison',
    ogType: 'website',
    ogImage: 'https://printsign.org/images/og/ilovepdf-smallpdf-offline-alternative.png',
    ogImageAlt: 'Private Offline Alternative to iLovePDF & Smallpdf',
    featureList: [
      '100% Client-Side WebAssembly Processing',
      'Zero Cloud File Retention',
      'Unlimited Free PDF Tasks (No Paywalls)',
      'Permanent 300 DPI Redaction',
      'Offline Air-Gap Operation'
    ],
    schema: buildCompositeSchema({
      webApp: buildWebApplicationSchema(
        'PrintSign Private Cloud PDF Alternative',
        'Compare cloud PDF editors vs. PrintSign\'s 100% client-side WebAssembly architecture. Edit, merge, and redact PDFs locally without uploading files.',
        'https://printsign.org/ilovepdf-smallpdf-offline-alternative',
        [
          'Zero-Upload PDF Manipulation',
          'Client-Side WebAssembly Sandbox',
          'Permanent 300 DPI Redaction',
          'No Task Caps or Paywalls'
        ]
      ),
      breadcrumbs: buildBreadcrumbSchema([
        { name: 'Home', url: 'https://printsign.org/' },
        { name: 'Comparisons', url: 'https://printsign.org/features' },
        { name: 'Offline Alternative', url: 'https://printsign.org/ilovepdf-smallpdf-offline-alternative' }
      ])
    })
  },
  '/hipaa-compliant-pdf-redaction': {
    title: 'HIPAA-Compliant Local PDF Redaction & Sanitization | PrintSign',
    description: 'Redact patient PHI and medical records 100% inside your browser RAM. Zero cloud uploads, no BAA required, and permanent 300 DPI pixel destruction.',
    h1: 'HIPAA-Compliant Client-Side PDF Redaction for Healthcare & Legal Teams',
    toolMode: 'compliance',
    ogType: 'website',
    ogImage: 'https://printsign.org/images/og/hipaa-compliant-pdf-redaction.png',
    ogImageAlt: 'HIPAA-Compliant Local PDF Redaction & Sanitization',
    featureList: [
      'HIPAA Security Rule § 164.312 Compliant',
      'Exempt from Third-Party Cloud BAA',
      'Permanent 300 DPI PHI Pixel Destruction',
      'Patient Identifier & Diagnostic Sanitization',
      'Zero Telemetry or Cloud Logging'
    ],
    schema: buildCompositeSchema({
      webApp: buildWebApplicationSchema(
        'PrintSign HIPAA PDF Redactor',
        'Redact patient PHI and medical records 100% inside your browser RAM. Zero cloud uploads, no BAA required, and permanent 300 DPI pixel destruction.',
        'https://printsign.org/hipaa-compliant-pdf-redaction',
        [
          'HIPAA § 164.312 Safe Harbor Redaction',
          'No Cloud BAA Obligation',
          'Permanent Pixel Burn-in at 300 DPI',
          'In-Memory PHI Sanitization'
        ]
      ),
      breadcrumbs: buildBreadcrumbSchema([
        { name: 'Home', url: 'https://printsign.org/' },
        { name: 'Compliance', url: 'https://printsign.org/security-architecture' },
        { name: 'HIPAA Redaction', url: 'https://printsign.org/hipaa-compliant-pdf-redaction' }
      ])
    })
  },
  '/nist-800-88-pdf-sanitization': {
    title: 'NIST SP 800-88 PDF Sanitization & Metadata Scrubbing | PrintSign',
    description: 'Meet NIST SP 800-88 media sanitization standards for PDF documents. Purge hidden XMP streams, Info dictionaries, and underlying vector text locally.',
    h1: 'NIST SP 800-88 Aligned PDF Sanitization & Metadata Destruction',
    toolMode: 'compliance',
    ogType: 'website',
    ogImage: 'https://printsign.org/images/og/nist-800-88-pdf-sanitization.png',
    ogImageAlt: 'NIST SP 800-88 PDF Sanitization & Metadata Scrubbing',
    featureList: [
      'NIST SP 800-88 Rev. 1 Logical Sanitization Aligned',
      'Orphan Indirect Object Garbage Collection',
      'Trailer /Info Dictionary & XMP Stream Purging',
      'Cross-Reference Table Reconstruction',
      'Cryptographic Canary Verification Scans'
    ],
    schema: buildCompositeSchema({
      webApp: buildWebApplicationSchema(
        'PrintSign NIST SP 800-88 PDF Sanitizer',
        'Meet NIST SP 800-88 media sanitization standards for PDF documents. Purge hidden XMP streams, Info dictionaries, and underlying vector text locally.',
        'https://printsign.org/nist-800-88-pdf-sanitization',
        [
          'NIST SP 800-88 Rev. 1 Media Clearing',
          'Orphan Indirect Object Purging',
          'Trailer Info & XMP Eradication',
          'In-Memory Verification Audits'
        ]
      ),
      breadcrumbs: buildBreadcrumbSchema([
        { name: 'Home', url: 'https://printsign.org/' },
        { name: 'Compliance', url: 'https://printsign.org/security-architecture' },
        { name: 'NIST SP 800-88 Sanitization', url: 'https://printsign.org/nist-800-88-pdf-sanitization' }
      ])
    })
  },
  '/gdpr-article-32-pdf-compliance': {
    title: 'GDPR Article 32 PDF Sanitization & Document Security Compliance (2026)',
    description: 'Eliminate third-party cross-border transfer risk under EU GDPR Article 32 & Schrems II. Redact personal data and strip XMP metadata 100% locally in browser RAM.',
    h1: 'GDPR Article 32 PDF Sanitization & Security of Processing Compliance',
    toolMode: 'compliance',
    ogType: 'website',
    ogImage: 'https://printsign.org/images/og/gdpr-article-32-pdf-compliance.png',
    ogImageAlt: 'GDPR Article 32 PDF Sanitization & Document Security Compliance',
    featureList: [
      'GDPR Article 32 Security of Processing Aligned',
      'Privacy by Design (GDPR Article 25) Client-Side Execution',
      'Zero Cross-Border Server Data Transfers',
      '300 DPI DSAR & PII Destruction',
      'XMP & Author Metadata Scrubbing'
    ],
    schema: buildCompositeSchema({
      webApp: buildWebApplicationSchema(
        'PrintSign GDPR Article 32 PDF Sanitizer',
        'Eliminate third-party cross-border transfer risk under EU GDPR Article 32 & Schrems II by redacting personal data locally in browser RAM.',
        'https://printsign.org/gdpr-article-32-pdf-compliance',
        [
          'Zero Cloud Subprocessor Transfers',
          'Permanent 300 DPI PII Redaction',
          'XMP & Author Metadata Stripping',
          'Offline DSAR Sanitization'
        ]
      ),
      breadcrumbs: buildBreadcrumbSchema([
        { name: 'Home', url: 'https://printsign.org/' },
        { name: 'Compliance', url: 'https://printsign.org/security-architecture' },
        { name: 'GDPR Article 32 Compliance', url: 'https://printsign.org/gdpr-article-32-pdf-compliance' }
      ])
    })
  },
  '/foia-document-redaction-tool': {
    title: 'FOIA & Public Records PDF Redaction Tool (Zero-Upload Sanitization)',
    description: 'Prevent FOIA black-box leaks in government, municipal, and police record disclosures. Destroy underlying vector text streams at 300 DPI and verify zero text survives offline.',
    h1: 'FOIA & Public Records PDF Redaction Tool — Zero-Upload Sanitization',
    toolMode: 'compliance',
    ogType: 'website',
    ogImage: 'https://printsign.org/images/og/foia-document-redaction-tool.png',
    ogImageAlt: 'FOIA & Public Records PDF Redaction Tool',
    featureList: [
      'FOIA Exemption (b)(4), (b)(6) & (b)(7) Safe Redaction',
      'Underlying Unicode/ASCII Layer Destruction',
      '300 DPI Optical & Vector Burn-In',
      'Workstation & Agency Metadata Scrubbing',
      'Pre-Release Redaction Verifier Audit'
    ],
    schema: buildCompositeSchema({
      webApp: buildWebApplicationSchema(
        'PrintSign FOIA Public Records PDF Redactor',
        'Prevent FOIA black-box leaks in public record releases by permanently destroying underlying vector text layers in local browser memory.',
        'https://printsign.org/foia-document-redaction-tool',
        [
          'Permanent Vector Text Destruction',
          'Government Agency Metadata Scrubbing',
          '300 DPI Rasterization',
          'Cryptographic Verifier Audit'
        ]
      ),
      breadcrumbs: buildBreadcrumbSchema([
        { name: 'Home', url: 'https://printsign.org/' },
        { name: 'Compliance', url: 'https://printsign.org/security-architecture' },
        { name: 'FOIA Redaction Tool', url: 'https://printsign.org/foia-document-redaction-tool' }
      ])
    })
  },
  '/for-finance-accounting': {
    title: 'Local Bank Statement, Tax & Financial PDF Redactor for CPAs | PrintSign',
    description: 'Redact bank routing numbers, TINs, W-2s, and M&A schedules 100% in browser RAM. Safeguard client PII under GLBA Safeguards Rule & IRS Pub 4557 with zero cloud uploads.',
    h1: 'Local Bank Statement, Tax & Financial PDF Redactor for CPAs',
    toolMode: 'role',
    ogType: 'website',
    ogImage: 'https://printsign.org/images/og/for-finance-accounting.png',
    ogImageAlt: 'Local Bank Statement, Tax & Financial PDF Redactor for CPAs',
    featureList: [
      'GLBA Safeguards & IRS Pub 4557 Zero-Upload Execution',
      'SSN, EIN & Account Number 300 DPI Destruction',
      'XMP & Excel Analyst Metadata Scrubbing',
      'SHA-256 Audit Certificate Export',
      'Offline Air-Gap PWA Ready'
    ],
    schema: buildCompositeSchema({
      webApp: buildWebApplicationSchema(
        'PrintSign CPA & Financial PDF Redactor',
        'Redact bank statements, tax transcripts, and M&A disclosures locally in browser RAM with zero third-party uploads.',
        'https://printsign.org/for-finance-accounting',
        [
          'Zero-Cloud Bank Statement Redaction',
          'GLBA & IRS 4557 Safe Processing',
          'XMP & Author Tag Removal',
          'SHA-256 Workpaper Certificates'
        ]
      ),
      breadcrumbs: buildBreadcrumbSchema([
        { name: 'Home', url: 'https://printsign.org/' },
        { name: 'Industry Solutions', url: 'https://printsign.org/features' },
        { name: 'For Finance & Accounting', url: 'https://printsign.org/for-finance-accounting' }
      ])
    })
  },
  '/for-lawyers': {
    title: 'Client-Side PDF Redaction & Bates Prep for Lawyers (FRCP 5.2)',
    description: 'Redact court filings, discovery exhibits, and privileged legal PDFs 100% in browser RAM. Prevent failed black-box redactions with 300 DPI pixel destruction.',
    h1: 'Court-Compliant Local PDF Redaction & Discovery Sanitization for Legal Teams',
    toolMode: 'role',
    ogType: 'website',
    ogImage: 'https://printsign.org/images/og/for-lawyers.png',
    ogImageAlt: 'Client-Side PDF Redaction & Bates Prep for Lawyers',
    featureList: [
      'FRCP Rule 5.2 Mandatory Redaction Compliance',
      'Permanent 300 DPI Pixel Destruction & Orphan GC',
      'Zero Cloud Subpoena or US CLOUD Act Liability',
      'ABA Model Rule 1.6 Confidentiality Defensibility',
      'Bates Numbering Preparation & Page Reordering',
      'Air-Gapped In-Memory Redaction Verifier'
    ],
    schema: buildCompositeSchema({
      webApp: buildWebApplicationSchema(
        'PrintSign for Lawyers & Legal Teams',
        'Redact court filings, discovery exhibits, and privileged legal PDFs 100% in browser RAM. Prevent failed black-box redactions with 300 DPI pixel destruction.',
        'https://printsign.org/for-lawyers',
        [
          'FRCP Rule 5.2 Court Redaction',
          'ABA Model Rule 1.6 Privilege Protection',
          'Permanent 300 DPI Pixel Burn',
          'In-Memory Bates Preparation'
        ]
      ),
      sourceCode: buildSoftwareSourceCodeSchema(),
      breadcrumbs: buildBreadcrumbSchema([
        { name: 'Home', url: 'https://printsign.org/' },
        { name: 'Industry Solutions', url: 'https://printsign.org/#solutions' },
        { name: 'For Lawyers', url: 'https://printsign.org/for-lawyers' }
      ])
    })
  },
  '/for-healthcare': {
    title: 'Local PHI & Medical Record PDF Redactor for Healthcare | PrintSign',
    description: 'Sanitize patient medical records, insurance claims, and EHR exports locally in browser memory. Zero cloud uploads and full HIPAA Safe Harbor alignment.',
    h1: 'Zero-Upload Medical Record PDF Redaction & Metadata Scrubbing for Healthcare',
    toolMode: 'role',
    ogType: 'website',
    ogImage: 'https://printsign.org/images/og/for-healthcare.png',
    ogImageAlt: 'Local PHI & Medical Record PDF Redactor for Healthcare',
    featureList: [
      'HIPAA Safe Harbor 18 De-Identification Rules',
      'Zero Cloud Storage & No BAA Mandate Required',
      'EHR & Diagnostic Scan Metadata Scrubbing',
      'NIST SP 800-88 Aligned Digital Media Purging',
      'Volatile RAM Execution with Instant Tab GC',
      'Downloadable SHA-256 Sanitization Certificate'
    ],
    schema: buildCompositeSchema({
      webApp: buildWebApplicationSchema(
        'PrintSign for Healthcare & Medical Teams',
        'Sanitize patient medical records, insurance claims, and EHR exports locally in browser memory. Zero cloud uploads and full HIPAA Safe Harbor alignment.',
        'https://printsign.org/for-healthcare',
        [
          'HIPAA Safe Harbor PHI De-Identification',
          'Zero Cloud Transit (No BAA Needed)',
          'EHR & Lab Report Metadata Stripping',
          'SHA-256 Audit Certification'
        ]
      ),
      sourceCode: buildSoftwareSourceCodeSchema(),
      breadcrumbs: buildBreadcrumbSchema([
        { name: 'Home', url: 'https://printsign.org/' },
        { name: 'Industry Solutions', url: 'https://printsign.org/#solutions' },
        { name: 'For Healthcare', url: 'https://printsign.org/for-healthcare' }
      ])
    })
  },
  '/for-journalists': {
    title: 'FOIA & Source-Protection PDF Metadata Scrubber for Journalists',
    description: 'Protect confidential sources by stripping hidden XMP streams, printer/author metadata, and underlying vector text locally in an air-gapped browser tab.',
    h1: 'Forensic PDF Metadata Sanitization & Source Protection for Investigative Journalists',
    toolMode: 'role',
    ogType: 'website',
    ogImage: 'https://printsign.org/images/og/for-journalists.png',
    ogImageAlt: 'FOIA & Source-Protection PDF Metadata Scrubber for Journalists',
    featureList: [
      'Deep FOIA Vector Layer Text Destruction',
      'XMP & EXIF Device Metadata Eradication',
      'Printer Tracking Dot Countermeasures (Rasterization)',
      'Confidential Whistleblower Source Defense',
      'Offline Air-Gap Resilience (No WiFi Required)',
      'Forensic Pre-Publication Hex & Text Audit'
    ],
    schema: buildCompositeSchema({
      webApp: buildWebApplicationSchema(
        'PrintSign for Journalists & Newsrooms',
        'Protect confidential sources by stripping hidden XMP streams, printer/author metadata, and underlying vector text locally in an air-gapped browser tab.',
        'https://printsign.org/for-journalists',
        [
          'Forensic Source Protection & XMP Scrubbing',
          'FOIA Optical Redaction Neutralization',
          'Air-Gapped Offline Operation',
          'Pre-Publication Canary Hex Audit'
        ]
      ),
      sourceCode: buildSoftwareSourceCodeSchema(),
      breadcrumbs: buildBreadcrumbSchema([
        { name: 'Home', url: 'https://printsign.org/' },
        { name: 'Industry Solutions', url: 'https://printsign.org/#solutions' },
        { name: 'For Journalists', url: 'https://printsign.org/for-journalists' }
      ])
    })
  },
  '/redact-pdf': {
    title: 'Redact PDF Online — Permanent 300 DPI Redaction',
    description: 'Permanently redact sensitive text and images from PDFs locally in your browser. Burns 300 DPI pixels with zero server uploads.',
    h1: 'Permanent Client-Side PDF Redactor',
    toolMode: 'redact',
    ogType: 'website',
    ogImage: 'https://printsign.org/images/og/redact-pdf.png',
    ogImageAlt: 'Redact PDF Online — Permanent 300 DPI Redaction',
    featureList: [
      'Permanent 300 DPI Redaction',
      'Underlying Text Layer Stripping',
      'Orphan Object Garbage Collection',
      'Client-Side In-Memory Execution',
      'Zero Server Uploads'
    ],
    schema: buildCompositeSchema({
      webApp: buildWebApplicationSchema(
        'PrintSign Client-Side PDF Redactor',
        'Permanently redact sensitive text and images from PDFs locally in your browser. Burns 300 DPI pixels with zero server uploads.',
        'https://printsign.org/redact-pdf',
        [
          'Permanent 300 DPI Redaction',
          'Underlying Text Layer Stripping',
          'Orphan Object Garbage Collection',
          'Canary Verification Audit'
        ]
      ),
      howTo: buildHowToSchema(
        'How to Permanently Redact a PDF Online Without Server Uploads',
        'Step-by-step instructions to permanently burn redaction boxes into 300 DPI pixels in browser memory.',
        'https://printsign.org/redact-pdf',
        [
          { name: 'Open Document in Browser RAM', text: 'Select or drag your PDF document into the client-side editor. No files are uploaded to any server.' },
          { name: 'Mark Sensitive Information', text: 'Draw redaction boxes over confidential text, account numbers, or personal identifying information.' },
          { name: 'Burn Pixels at 300 DPI', text: 'Click Apply Redactions to rasterize pages and purge underlying text layers in a Web Worker.' },
          { name: 'Export Court-Compliant PDF', text: 'Save your sanitized PDF directly to your device with orphan object garbage collection applied.' }
        ]
      ),
      breadcrumbs: buildBreadcrumbSchema([
        { name: 'Home', url: 'https://printsign.org/' },
        { name: 'Document Tools', url: 'https://printsign.org/#tools' },
        { name: 'Redact PDF', url: 'https://printsign.org/redact-pdf' }
      ])
    })
  },
  '/scrub-pdf-metadata': {
    title: 'Scrub PDF Metadata & Sanitize XMP Streams Offline',
    description: 'Remove author, creation dates, and hidden XMP metadata from PDFs directly in your browser. 100% private client-side sanitizer.',
    h1: 'Local PDF Metadata & XMP Sanitizer',
    toolMode: 'metadata',
    ogType: 'website',
    ogImage: 'https://printsign.org/images/og/scrub-pdf-metadata.png',
    ogImageAlt: 'Scrub PDF Metadata & Sanitize XMP Streams Offline',
    featureList: [
      'Metadata Sanitization',
      'XMP XML Stream Removal',
      'Author, Creator & Producer Stripping',
      'Creation & Modification Timestamp Removal',
      'Client-Side Offline Processing'
    ],
    schema: buildCompositeSchema({
      webApp: buildWebApplicationSchema(
        'PrintSign PDF Metadata & XMP Scrubber',
        'Remove author, creation dates, and hidden XMP metadata from PDFs directly in your browser. 100% private client-side sanitizer.',
        'https://printsign.org/scrub-pdf-metadata',
        [
          'Remove PDF Document Info Dictionary',
          'Sanitize XMP XML Streams',
          'Strip GPS & Device Identifiers',
          'Purge Creation & Modification Dates'
        ]
      ),
      howTo: buildHowToSchema(
        'How to Scrub Metadata & XMP Streams from a PDF',
        'Strip author names, creation timestamps, and hidden metadata from PDF files client-side.',
        'https://printsign.org/scrub-pdf-metadata',
        [
          { name: 'Select PDF Document', text: 'Open your PDF document locally in browser memory.' },
          { name: 'Inspect Metadata Streams', text: 'Review existing author, producer, title, and XMP metadata packets.' },
          { name: 'Purge Metadata & Rebuild Trailer', text: 'Click Scrub Metadata to delete the Info dictionary and strip XMP streams.' },
          { name: 'Save Anonymized PDF', text: 'Export the sanitized PDF file without leaving metadata residue.' }
        ]
      ),
      breadcrumbs: buildBreadcrumbSchema([
        { name: 'Home', url: 'https://printsign.org/' },
        { name: 'Document Tools', url: 'https://printsign.org/#tools' },
        { name: 'Metadata Scrubber', url: 'https://printsign.org/scrub-pdf-metadata' }
      ])
    })
  },
  '/split-pdf': {
    title: 'Split PDF Pages Locally — Extract PDF Ranges Free',
    description: 'Extract pages or split large PDFs into custom ranges offline. Fast Web Worker processing in browser memory with no file uploads.',
    h1: 'Split & Extract PDF Pages Locally',
    toolMode: 'split',
    ogType: 'website',
    ogImage: 'https://printsign.org/images/og/split-pdf.png',
    ogImageAlt: 'Split PDF Pages Locally — Extract PDF Ranges Free',
    featureList: [
      'Custom Page Range Extraction',
      'Dedicated WebWorker Processing',
      'Fast Local Extraction',
      'Zero Server Uploads',
      'Offline Operation'
    ],
    schema: buildCompositeSchema({
      webApp: buildWebApplicationSchema(
        'PrintSign PDF Page Splitter & Extractor',
        'Extract pages or split large PDFs into custom ranges offline. Fast Web Worker processing in browser memory with no file uploads.',
        'https://printsign.org/split-pdf',
        [
          'Custom Page Range Splitting',
          'Extract Selected Pages to New PDF',
          'In-Browser Memory Processing',
          'Zero File Size Limits'
        ]
      ),
      howTo: buildHowToSchema(
        'How to Split PDF Pages Locally in Your Browser',
        'Extract custom page ranges or split PDF documents into separate files offline without uploading.',
        'https://printsign.org/split-pdf',
        [
          { name: 'Upload PDF to Local Sandbox', text: 'Open your multi-page PDF document in the client-side splitter.' },
          { name: 'Select Split Ranges', text: 'Enter specific page numbers or select pages visually from the thumbnail grid.' },
          { name: 'Extract Selected Pages', text: 'Process the extraction in a local Web Worker without cloud data transmission.' },
          { name: 'Download Split PDFs', text: 'Save your extracted PDF document immediately to local storage.' }
        ]
      ),
      breadcrumbs: buildBreadcrumbSchema([
        { name: 'Home', url: 'https://printsign.org/' },
        { name: 'Document Tools', url: 'https://printsign.org/#tools' },
        { name: 'Split PDF', url: 'https://printsign.org/split-pdf' }
      ])
    })
  },
  '/merge-pdf': {
    title: 'Merge PDF Files Locally in Browser — No Uploads',
    description: 'Combine multiple PDF files into one in your browser memory. Fast WebAssembly processing, zero file size limits, and 100% private.',
    h1: 'Combine & Merge PDFs 100% in Browser Memory',
    toolMode: 'merge',
    ogType: 'website',
    ogImage: 'https://printsign.org/images/og/merge-pdf.png',
    ogImageAlt: 'Merge PDF Files Locally in Browser — No Uploads',
    featureList: [
      'Combine Multiple PDF Files',
      'In-Browser Memory Processing',
      'WebAssembly PDF Engine',
      'No Cloud Uploads',
      'Zero File Size Limits'
    ],
    schema: buildCompositeSchema({
      webApp: buildWebApplicationSchema(
        'PrintSign PDF Combiner & Merger',
        'Combine multiple PDF files into one in your browser memory. Fast WebAssembly processing, zero file size limits, and 100% private.',
        'https://printsign.org/merge-pdf',
        [
          'Merge Unlimited PDF Documents',
          'Multi-Tab Document Isolation',
          'Lossless Page Vector Preservation',
          'Client-Side RAM Execution'
        ]
      ),
      howTo: buildHowToSchema(
        'How to Merge Multiple PDF Files Locally',
        'Combine multiple PDF documents into a single organized file in browser memory with zero uploads.',
        'https://printsign.org/merge-pdf',
        [
          { name: 'Add PDF Files', text: 'Drag and drop two or more PDF files into the local merger sandbox.' },
          { name: 'Arrange Page Order', text: 'Drag document cards to organize the exact sequence of merged pages.' },
          { name: 'Merge via WebAssembly', text: 'Combine document trees and cross-reference streams in local browser RAM.' },
          { name: 'Download Merged Document', text: 'Export your combined PDF instantly with zero file size limits.' }
        ]
      ),
      breadcrumbs: buildBreadcrumbSchema([
        { name: 'Home', url: 'https://printsign.org/' },
        { name: 'Document Tools', url: 'https://printsign.org/#tools' },
        { name: 'Merge PDF', url: 'https://printsign.org/merge-pdf' }
      ])
    })
  },
  '/flatten-rasterize-pdf': {
    title: 'Flatten & Rasterize PDF to 300 DPI Locally',
    description: 'Convert PDF vector layers, form fields, and annotations into flat 300 DPI images locally. Prevent layer recovery and leakages.',
    h1: 'High-DPI Client-Side PDF Rasterizer',
    toolMode: 'rasterize',
    ogType: 'website',
    ogImage: 'https://printsign.org/images/og/flatten-rasterize-pdf.png',
    ogImageAlt: 'Flatten & Rasterize PDF to 300 DPI Locally',
    featureList: [
      'High-DPI 300 DPI Rasterization',
      'Vector Layer & Font Flattening',
      'AcroForm Field Burning',
      'Eliminate Hidden Layer Leakage',
      'Local Processing'
    ],
    schema: buildCompositeSchema({
      webApp: buildWebApplicationSchema(
        'PrintSign High-DPI PDF Rasterizer & Layer Flattener',
        'Convert PDF vector layers, form fields, and annotations into flat 300 DPI images locally. Prevent layer recovery and leakages.',
        'https://printsign.org/flatten-rasterize-pdf',
        [
          '300 to 600 DPI High-Resolution Output',
          'AcroForm Interactive Field Burning',
          'Vector Coordinate Stripping',
          'Clean Bitmap Page Recompilation'
        ]
      ),
      howTo: buildHowToSchema(
        'How to Flatten and Rasterize PDF Layers',
        'Burn interactive forms, vector text, and annotations into flat 300 DPI bitmap images locally.',
        'https://printsign.org/flatten-rasterize-pdf',
        [
          { name: 'Open PDF with Layers or Forms', text: 'Load your PDF containing annotations, signatures, or AcroForm fields.' },
          { name: 'Select Target Resolution', text: 'Choose 300 DPI for high-clarity court and print readiness.' },
          { name: 'Render and Flatten Canvas', text: 'Execute irreversible bitmap rasterization in a background worker.' },
          { name: 'Export Flattened PDF', text: 'Download a clean, single-layer document devoid of hidden vectors.' }
        ]
      ),
      breadcrumbs: buildBreadcrumbSchema([
        { name: 'Home', url: 'https://printsign.org/' },
        { name: 'Document Tools', url: 'https://printsign.org/#tools' },
        { name: 'Flatten PDF', url: 'https://printsign.org/flatten-rasterize-pdf' }
      ])
    })
  },
  '/reorder-rotate-pdf': {
    title: 'Reorder & Rotate PDF Pages Locally in Browser',
    description: 'Rearrange, rotate, crop, or delete PDF pages offline. Drag and drop organization in browser memory without cloud file uploads.',
    h1: 'Reorder, Rotate & Organize PDF Pages Locally',
    toolMode: 'organize',
    ogType: 'website',
    ogImage: 'https://printsign.org/images/og/reorder-rotate-pdf.png',
    ogImageAlt: 'Reorder & Rotate PDF Pages Locally in Browser',
    featureList: [
      'Drag-and-Drop Page Reordering',
      '90-Degree Page Rotation',
      'Single & Bulk Page Deletion',
      'Interactive Visual Thumbnails',
      'Client-Side Memory Sandbox'
    ],
    schema: buildCompositeSchema({
      webApp: buildWebApplicationSchema(
        'PrintSign PDF Page Organizer & Rotator',
        'Rearrange, rotate, crop, or delete PDF pages offline. Drag and drop organization in browser memory without cloud file uploads.',
        'https://printsign.org/reorder-rotate-pdf',
        [
          'Drag-and-Drop Page Reordering',
          '90-Degree Clockwise & Counter-Clockwise Rotation',
          'Custom Page Cropping',
          'Single & Bulk Page Deletion'
        ]
      ),
      howTo: buildHowToSchema(
        'How to Reorder and Rotate PDF Pages Offline',
        'Rotate upside-down pages, reorder sequence, and delete unnecessary pages 100% in browser memory.',
        'https://printsign.org/reorder-rotate-pdf',
        [
          { name: 'Load PDF into Visual Grid', text: 'Open your document to view interactive thumbnails of every page.' },
          { name: 'Rotate or Reorder Pages', text: 'Rotate selected pages by 90 degrees or drag thumbnails to change page sequence.' },
          { name: 'Delete Extraneous Pages', text: 'Click the trash icon on any unwanted pages to remove them from the tree.' },
          { name: 'Export Organized PDF', text: 'Save your reorganized document immediately with rebuilt cross-reference tables.' }
        ]
      ),
      breadcrumbs: buildBreadcrumbSchema([
        { name: 'Home', url: 'https://printsign.org/' },
        { name: 'Document Tools', url: 'https://printsign.org/#tools' },
        { name: 'Organize PDF', url: 'https://printsign.org/reorder-rotate-pdf' }
      ])
    })
  },
  '/compress-pdf': {
    title: 'Compress PDF Locally — Lossless PDF Optimizer',
    description: 'Shrink PDF file size locally using lossless Flate compression and orphan object purging. Fast offline document optimization.',
    h1: 'Lossless Local PDF Compressor',
    toolMode: 'compress',
    ogType: 'website',
    ogImage: 'https://printsign.org/images/og/compress-pdf.png',
    ogImageAlt: 'Compress PDF Locally — Lossless PDF Optimizer',
    featureList: [
      'Lossless Flate Compression',
      'Unused Object & Cross-Reference Table Purging',
      'Vector Stream Optimization',
      'Text Clarity Preservation',
      '100% In-Browser Execution'
    ],
    schema: buildCompositeSchema({
      webApp: buildWebApplicationSchema(
        'PrintSign Lossless Local PDF Compressor',
        'Shrink PDF file size locally using lossless Flate compression and orphan object purging. Fast offline document optimization.',
        'https://printsign.org/compress-pdf',
        [
          'FlateDecode Stream Compression',
          'Orphan Object Purging',
          'Cross-Reference Table Compaction',
          'Zero Text Blurring'
        ]
      ),
      howTo: buildHowToSchema(
        'How to Compress PDF Files Without Quality Loss',
        'Optimize PDF streams and purge orphan objects client-side to reduce file size without uploading.',
        'https://printsign.org/compress-pdf',
        [
          { name: 'Open Large PDF Document', text: 'Drag your PDF into the local compressor interface.' },
          { name: 'Select Compression Level', text: 'Choose balanced stream compression or maximum image downsampling.' },
          { name: 'Optimize Stream Objects', text: 'Purge orphan indirect objects and compact the cross-reference table.' },
          { name: 'Save Reduced PDF', text: 'Download your optimized PDF file with smaller byte size and intact text.' }
        ]
      ),
      breadcrumbs: buildBreadcrumbSchema([
        { name: 'Home', url: 'https://printsign.org/' },
        { name: 'Document Tools', url: 'https://printsign.org/#tools' },
        { name: 'Compress PDF', url: 'https://printsign.org/compress-pdf' }
      ])
    })
  },
  '/sign-pdf': {
    title: 'Sign PDF Offline in Browser RAM (Zero Cloud Upload) | PrintSign',
    description: 'Sign legal contracts, NDAs, and tax forms 100% locally in browser memory. Draw or place crisp vector signatures onto PDFs with zero server uploads or tracking.',
    h1: 'Sign PDF Offline Purely in Browser RAM',
    toolMode: 'sign',
    ogType: 'website',
    ogImage: 'https://printsign.org/images/og/sign-pdf.png',
    ogImageAlt: 'Sign PDF Offline in Browser RAM — Zero Cloud Upload',
    featureList: [
      '100% Client-Side PDF Signing',
      'Crisp Vector & Handwritten Signature Placement',
      'Multi-Page Initials & Date Stamps',
      'Zero Document Account Required',
      'Full Offline PWA Capability'
    ],
    schema: buildCompositeSchema({
      webApp: buildWebApplicationSchema(
        'PrintSign Offline PDF Signer',
        'Sign legal contracts, NDAs, and tax forms locally in browser RAM without uploading sensitive agreements to cloud servers.',
        'https://printsign.org/sign-pdf',
        [
          'Draw & Place Signatures Locally',
          'Zero Cloud Upload Contracts',
          'Flatten Signatures Permanently',
          'Offline PWA Ready'
        ]
      ),
      howTo: buildHowToSchema(
        'How to Sign a PDF Offline Without Cloud Uploads',
        'Apply handwritten or typed electronic signatures to PDF contracts purely in browser memory.',
        'https://printsign.org/sign-pdf',
        [
          { name: 'Open Contract in Browser RAM', text: 'Load your PDF agreement directly into local memory.' },
          { name: 'Create or Draw Signature', text: 'Use mouse, touch, or stylus inside the Edit tab to draw your signature or initials.' },
          { name: 'Position & Scale Signature', text: 'Drag the signature block precisely onto the execution line and add signing dates.' },
          { name: 'Export Signed PDF Locally', text: 'Save the finalized contract directly to disk with optional raster flattening.' }
        ]
      ),
      breadcrumbs: buildBreadcrumbSchema([
        { name: 'Home', url: 'https://printsign.org/' },
        { name: 'Document Tools', url: 'https://printsign.org/#tools' },
        { name: 'Sign PDF', url: 'https://printsign.org/sign-pdf' }
      ])
    })
  },
  '/unlock-decrypt-pdf': {
    title: 'Remove PDF Password & Decrypt PDF Client-Side (No Upload) | PrintSign',
    description: 'Decrypt password-protected PDFs you authorize locally in browser RAM. Remove PDF owner permission locks (printing/copying restrictions) safely with zero cloud transfer.',
    h1: 'Remove PDF Password Restrictions & Decrypt Locally',
    toolMode: 'decrypt',
    ogType: 'website',
    ogImage: 'https://printsign.org/images/og/unlock-decrypt-pdf.png',
    ogImageAlt: 'Remove PDF Password & Decrypt PDF Client-Side',
    featureList: [
      'Client-Side PDF Decryption in Browser RAM',
      'Authorized Owner Restriction Removal',
      'Zero Password Transmission Over Network',
      'Re-Export Clean Unencrypted PDF Catalog',
      'Safe Offline Operation'
    ],
    schema: buildCompositeSchema({
      webApp: buildWebApplicationSchema(
        'PrintSign Client-Side PDF Unlocker',
        'Unlock authorized password-protected PDFs and strip restrictive print/copy owner flags purely inside local browser memory.',
        'https://printsign.org/unlock-decrypt-pdf',
        [
          'Local In-Memory Decryption',
          'Zero Password Server Exposure',
          'Strip Print & Copy Restrictions',
          'Clean Catalog Reassembly'
        ]
      ),
      howTo: buildHowToSchema(
        'How to Unlock & Decrypt a PDF Offline Safely',
        'Open an encrypted or restricted PDF locally in RAM and export a clean unlocked copy without sending passwords to remote servers.',
        'https://printsign.org/unlock-decrypt-pdf',
        [
          { name: 'Load Encrypted PDF Locally', text: 'Open the password-protected PDF inside the offline PrintSign workspace.' },
          { name: 'Enter Authorized Passphrase', text: 'Supply the user password locally inside your browser; keys never leave RAM.' },
          { name: 'Clear Restriction Dictionaries', text: 'Rebuild the PDF catalog without owner permission locks or encryption trailers.' },
          { name: 'Download Unlocked PDF', text: 'Save the decrypted PDF file for unrestricted printing and archiving.' }
        ]
      ),
      breadcrumbs: buildBreadcrumbSchema([
        { name: 'Home', url: 'https://printsign.org/' },
        { name: 'Document Tools', url: 'https://printsign.org/#tools' },
        { name: 'Unlock PDF', url: 'https://printsign.org/unlock-decrypt-pdf' }
      ])
    })
  },
  '/watermark-pdf': {
    title: 'Add Confidential & Bates Watermarks to PDF Offline | PrintSign',
    description: 'Stamp CONFIDENTIAL, DRAFT, DO NOT DISTRIBUTE, or Bates numbering overlays onto PDF pages offline in browser RAM without uploading proprietary documents.',
    h1: 'Add Confidential & Bates Watermarks to PDF Offline',
    toolMode: 'watermark',
    ogType: 'website',
    ogImage: 'https://printsign.org/images/og/watermark-pdf.png',
    ogImageAlt: 'Add Confidential & Bates Watermarks to PDF Offline',
    featureList: [
      'Custom Confidential & Draft Stamps',
      'Configurable Opacity, Rotation & Placement',
      'Optional Raster Flattening to Prevent Removal',
      'Bates & Legal Exhibit Labeling Support',
      'Zero Cloud Upload Execution'
    ],
    schema: buildCompositeSchema({
      webApp: buildWebApplicationSchema(
        'PrintSign Offline PDF Watermark & Bates Tool',
        'Stamp permanent Confidential watermarks, exhibition labels, and burned-in security overlays onto PDFs inside browser RAM.',
        'https://printsign.org/watermark-pdf',
        [
          'Custom Diagonal & Header Watermarks',
          'Immutable Raster Burn-In Option',
          'Legal Exhibit & Draft Labeling',
          'Zero Server Uploads'
        ]
      ),
      howTo: buildHowToSchema(
        'How to Watermark a PDF Permanently Offline',
        'Apply confidential stamps and optionally flatten them into 300 DPI page pixels so recipients cannot delete overlays.',
        'https://printsign.org/watermark-pdf',
        [
          { name: 'Open Proprietary Document', text: 'Load your confidential report, pitch deck, or court exhibit locally.' },
          { name: 'Place Watermark or Bates Label', text: 'Insert custom text overlays, recipient identifiers, or confidentiality notices.' },
          { name: 'Flatten to Prevent Tampering', text: 'Rasterize stamped pages at 300 DPI so standard PDF editors cannot select or remove marks.' },
          { name: 'Save Watermarked PDF', text: 'Export the stamped document straight from browser memory to your device.' }
        ]
      ),
      breadcrumbs: buildBreadcrumbSchema([
        { name: 'Home', url: 'https://printsign.org/' },
        { name: 'Document Tools', url: 'https://printsign.org/#tools' },
        { name: 'Watermark PDF', url: 'https://printsign.org/watermark-pdf' }
      ])
    })
  },
  '/extract-pdf-pages': {
    title: 'Extract Pages from PDF Locally Without Uploading | PrintSign',
    description: 'Extract single pages or custom page ranges (e.g., 1, 3-7) from confidential PDFs locally in browser RAM. Zero file size caps and zero third-party uploads.',
    h1: 'Extract Pages from PDF Purely in Browser RAM',
    toolMode: 'extract',
    ogType: 'website',
    ogImage: 'https://printsign.org/images/og/extract-pdf-pages.png',
    ogImageAlt: 'Extract Pages from PDF Locally Without Uploading',
    featureList: [
      'Custom Page Range Extraction',
      'Lossless Vector Font & Form Preservation',
      'Automatic Unreferenced Object Pruning',
      'Zero File Size Upload Limits',
      '100% Client-Side RAM Processing'
    ],
    schema: buildCompositeSchema({
      webApp: buildWebApplicationSchema(
        'PrintSign Local PDF Page Extractor',
        'Pull specific pages or page intervals out of large confidential PDF packets locally with lossless vector preservation.',
        'https://printsign.org/extract-pdf-pages',
        [
          'Selective Page Interval Extraction',
          'Orphan Resource Pruning',
          'Zero Upload Latency',
          'Works Offline as PWA'
        ]
      ),
      howTo: buildHowToSchema(
        'How to Extract Specific Pages from a PDF Without Uploading',
        'Isolate exact page ranges locally in browser RAM while discarding unreferenced document pages and bloat.',
        'https://printsign.org/extract-pdf-pages',
        [
          { name: 'Load Source PDF Locally', text: 'Select your multi-page contract, medical record, or exhibit bundle in memory.' },
          { name: 'Specify Target Page Ranges', text: 'Choose individual pages or exact numeric ranges inside the Split/Extract tool.' },
          { name: 'Copy Clean Page Tree Locally', text: 'PrintSign clones only referenced fonts and resources via pdf-lib without remote servers.' },
          { name: 'Download Extracted PDF', text: 'Save the isolated page subset directly to your workstation.' }
        ]
      ),
      breadcrumbs: buildBreadcrumbSchema([
        { name: 'Home', url: 'https://printsign.org/' },
        { name: 'Document Tools', url: 'https://printsign.org/#tools' },
        { name: 'Extract PDF Pages', url: 'https://printsign.org/extract-pdf-pages' }
      ])
    })
  },
  '/editor': {
    title: 'PrintSign Web Editor — Client-Side PDF Tools',
    description: 'All-in-one local PDF editor: redact, split, merge, rotate, rasterize, and sanitize documents privately in your browser.',
    h1: 'Client-Side PDF Editor & Redaction Suite',
    toolMode: null,
    ogType: 'website',
    featureList: [
      'Complete PDF Editing Suite',
      'Zero-Cloud Processing',
      'Permanent Redaction',
      'Metadata Sanitization',
      'High-DPI Rasterizer'
    ],
    schema: buildWebApplicationSchema(
      'PrintSign Universal Web Editor',
      'All-in-one local PDF editor: redact, split, merge, rotate, rasterize, and sanitize documents privately in your browser.',
      'https://printsign.org/editor',
      [
        'Full PDF Workspace',
        'Interactive Redaction',
        'Page Reordering & Merging',
        'Metadata Sanitization'
      ]
    )
  },
  '/faq': {
    title: 'Frequently Asked Questions — PrintSign PDF Editor',
    description: 'Answers to common questions about client-side PDF redaction, offline PWA capabilities, orphan object GC, and zero-server privacy.',
    h1: 'Frequently Asked Questions',
    toolMode: null,
    ogType: 'website',
    featureList: [
      'Security FAQ',
      'Client-Side Architecture FAQ',
      'Compliance Guidance',
      'Offline Usage Support'
    ],
    schema: faqJsonLd
  },
  '/guides': {
    title: 'PDF Security & Redaction Guides | PrintSign',
    description: 'Technical guides on PDF vector redaction, NIST SP 800-88 compliance, XMP stream sanitization, and browser-based forensics.',
    h1: 'PDF Security, Forensics & Redaction Guides',
    toolMode: null,
    ogType: 'website',
    featureList: [
      'PDF Security Whitepapers',
      'Court Redaction Standards',
      'NIST SP 800-88 Compliance Guides',
      'Vector Stream Forensics'
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'PDF Security & Redaction Guides',
      url: 'https://printsign.org/guides',
      description: 'Technical guides on PDF vector redaction, NIST SP 800-88 compliance, XMP stream sanitization, and browser-based forensics.'
    }
  },
  '/blog': {
    title: 'PrintSign Blog — PDF Engineering & Security',
    description: 'Deep dives into client-side WebAssembly, PDF syntax specifications, font subsetting, and document security engineering.',
    h1: 'Engineering Blog & Security Analysis',
    toolMode: null,
    ogType: 'website',
    featureList: [
      'Engineering Articles',
      'WebAssembly Tutorials',
      'PDF Specification Deep-Dives',
      'Privacy Architecture'
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'PrintSign Engineering Blog',
      url: 'https://printsign.org/blog',
      description: 'Deep dives into client-side WebAssembly, PDF syntax specifications, font subsetting, and document security engineering.'
    }
  },
  '/blog/compress-pdf-file-size-without-losing-quality': {
    title: 'Lossless PDF Compression (No Quality Loss, Preserves Signatures & SDK Guide) | PrintSign',
    description: 'Compress PDF file size without losing quality locally in browser RAM. Compare lossless Flate/object-stream compression, preserve digital signatures, or use our free zero-upload tool.',
    h1: 'How to Compress PDF Files Without Blurring Text: The Science of Lossless Document Optimization',
    toolMode: 'compress',
    ogType: 'article',
    ogImage: 'https://printsign.org/images/blogs/compress-pdf-file-size-without-losing-quality.png',
    ogImageAlt: 'Lossless PDF Compression Guide — Preserves Digital Signatures & Zero Upload',
    featureList: [
      'Lossless FlateDecode Compression',
      'Digital Signature ByteRange Preservation',
      'Client-Side WebAssembly vs Server SDKs'
    ]
  },
  '/blog/high-dpi-pdf-rasterization-guide-300-600-dpi': {
    title: '150 vs 300 vs 600 DPI PDF Rasterization: Complete Comparison & Calculator (2026)',
    description: 'Compare 72, 150, 300, and 600 DPI PDF rasterization quality, pixel dimensions, and RAM formulas. Flatten PDFs to 300 DPI locally in your browser with zero uploads.',
    h1: 'PDF DPI Explained: Choosing Between 72, 150, 300, and 600 DPI for Print & Legal',
    toolMode: 'flatten',
    ogType: 'article',
    ogImage: 'https://printsign.org/images/blogs/high-dpi-pdf-rasterization-guide-300-600-dpi.png',
    ogImageAlt: '150 vs 300 vs 600 DPI PDF Rasterization Comparison & Calculator',
    featureList: [
      '72 vs 150 vs 300 vs 600 DPI Comparison',
      'Canvas RAM & Pixel Calculator',
      'CM/ECF 300 DPI Court Standard'
    ]
  },
  '/blog/best-free-adobe-acrobat-alternatives-2026': {
    title: '7 Best Free Adobe Acrobat Alternatives in 2026 (No Watermarks, No Cloud Upload)',
    description: 'Looking for a free Adobe Acrobat replacement in 2026? Compare the best no-watermark PDF editors, combiners, and offline client-side redaction tools.',
    h1: 'Best Free Adobe Acrobat Pro Alternatives in 2026: An Exhaustive Privacy & Feature Benchmark',
    toolMode: null,
    ogType: 'article',
    ogImage: 'https://printsign.org/images/blogs/best-free-adobe-acrobat-alternatives-2026.png',
    ogImageAlt: '7 Best Free Adobe Acrobat Alternatives in 2026 — No Watermarks',
    featureList: [
      'Zero Watermark PDF Combiner',
      'Offline Adobe Acrobat Replacement',
      'Client-Side Redaction & Editing'
    ]
  },
  '/blog/financial-document-redaction-tax-banking-privacy': {
    title: 'How to Redact Bank Statements & Tax Returns Safely (Free, No Upload — 2026)',
    description: 'Never upload bank statements or tax returns to cloud PDF editors. Redact SSNs, account numbers, and financial PDFs 100% offline in browser RAM for free.',
    h1: 'Financial Document Redaction: Securing Tax Returns, Bank Statements & W-2s Against Identity Theft',
    toolMode: 'redact',
    ogType: 'article',
    ogImage: 'https://printsign.org/images/blogs/financial-document-redaction-tax-banking-privacy.png',
    ogImageAlt: 'How to Redact Bank Statements & Tax Returns Safely Offline',
    featureList: [
      'SSN & Routing Number Pixel Burn-In',
      'Offline Bank Statement Redaction',
      'GLBA & IRS Pub 4557 Privacy Alignment'
    ]
  },
  '/blog/gdpr-article-32-pdf-data-protection': {
    title: 'GDPR Article 32 (Security of Processing Text): PDF & Document Compliance Guide (2026)',
    description: 'Read the official GDPR Article 32 Security of Processing text and learn how client-side PDF redaction, metadata scrubbing, and print security prevent data breaches.',
    h1: 'GDPR Article 32 & Document Privacy: Mitigating Enterprise PDF Security Vulnerabilities',
    toolMode: 'redact',
    ogType: 'article',
    ogImage: 'https://printsign.org/images/blogs/gdpr-article-32-pdf-data-protection.png',
    ogImageAlt: 'GDPR Article 32 Security of Processing PDF & Print Security Guide',
    featureList: [
      'GDPR Article 32(1)(a)-(d) Compliance Mapping',
      'Client-Side PDF Redaction & Metadata Scrubbing',
      'Zero-Processor Browser Execution'
    ]
  },
  '/blog/why-black-boxes-fail-pdf-redaction-disasters': {
    title: 'Why a Black Redacted Box Fails in PDFs (Client-Side vs. Server-Side PDF Redaction)',
    description: 'Drawing a black redaction box over PDF text leaves hidden data selectable. Learn why black boxes fail, server-side vs client-side PDF redaction, and how to test your PDF.',
    h1: 'Why Black Rectangle Redactions Fail: Forensic Analysis of Famous PDF Data Leaks',
    toolMode: 'verifier',
    ogType: 'article',
    ogImage: 'https://printsign.org/images/blogs/why-black-boxes-fail-pdf-redaction-disasters.png',
    ogImageAlt: 'Why a Black Redacted Box Fails in PDFs — Forensic Redaction Guide',
    featureList: [
      'Selectable Text Layer Detection',
      'Client-Side vs Server-Side Redaction Architecture',
      'Permanent 300 DPI Pixel Burn-In'
    ]
  },
  '/blog/legal-discovery-ediscovery-pdf-sanitization': {
    title: 'eDiscovery PDF Sanitization & Metadata Removal Checklist (Free Local Tool — 2026)',
    description: 'Sanitize eDiscovery productions locally in browser RAM without cloud uploads. Scrub XMP metadata, purge orphan objects, and comply with FRCP Rule 26 and Rule 37 for free.',
    h1: 'E-Discovery PDF Sanitization: FRCP Rule 26 & 37 Compliance for Litigation Document Production',
    toolMode: 'scrub',
    ogType: 'article',
    ogImage: 'https://printsign.org/images/blogs/legal-discovery-ediscovery-pdf-sanitization.png',
    ogImageAlt: 'eDiscovery PDF Sanitization & Metadata Removal Checklist',
    featureList: [
      'FRCP Rule 26 & 37 Document Sanitization',
      'XMP Metadata & Orphan Object Removal',
      'Zero-Upload Attorney Confidentiality'
    ]
  },
  '/blog/hipaa-compliant-pdf-editor-medical-records': {
    title: 'HIPAA-Compliant PDF Redaction & Medical Record Editor (Free, Zero Cloud Upload)',
    description: 'Redact patient records and Protected Health Information (PHI) 100% locally in browser RAM. Zero cloud uploads, Safe Harbor alignment, and permanent 300 DPI pixel burn-in.',
    h1: 'HIPAA-Friendly PDF Editing: Safely Redacting and Merging Patient Records',
    toolMode: 'redact',
    ogType: 'article',
    ogImage: 'https://printsign.org/images/blogs/hipaa-compliant-pdf-editor-medical-records.png',
    ogImageAlt: 'HIPAA-Compliant PDF Redaction & Medical Record Editor',
    featureList: [
      '18 HIPAA Safe Harbor Identifiers Redaction',
      'Zero BAA Required Browser Processing',
      'Patient Record Merging & Sanitization'
    ]
  },
  '/blog/printsign-vs-smallpdf-ilovepdf-cloud-security': {
    title: 'iLovePDF & Smallpdf Offline Alternative: Zero-Upload PDF Security Comparison (2026)',
    description: 'Compare PrintSign vs iLovePDF & Smallpdf in 2026. Keep contracts and sensitive PDFs 100% in browser RAM with F12-verifiable zero cloud uploads and no daily limits.',
    h1: 'PrintSign vs Smallpdf & iLovePDF: Why Cloud PDF Editors Risk Your Confidential Data',
    toolMode: null,
    ogType: 'article',
    ogImage: 'https://printsign.org/images/blogs/printsign-vs-smallpdf-ilovepdf-cloud-security.png',
    ogImageAlt: 'iLovePDF & Smallpdf Offline Alternative Security Comparison 2026',
    featureList: [
      'F12 Network Tab Zero-Upload Verification',
      'No File Size Caps or Daily Throttling',
      'Client-Side WebAssembly Execution'
    ]
  },
  '/contact-us': {
    title: 'Contact Support & Privacy Team | PrintSign',
    description: 'Get in touch with the PrintSign engineering team for enterprise compliance questions, feature requests, and bug reports.',
    h1: 'Contact & Support',
    toolMode: null,
    ogType: 'website',
    featureList: [
      'Direct Engineering Support',
      'Security Inquiries',
      'Feature Feedback',
      'Enterprise Privacy Audits'
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact PrintSign Support',
      url: 'https://printsign.org/contact-us',
      description: 'Get in touch with the PrintSign engineering team for enterprise compliance questions, feature requests, and bug reports.'
    }
  },
  '/about-us': {
    title: 'About PrintSign — Zero-Cloud Document Privacy',
    description: 'Discover our mission to replace untrusted cloud PDF converters with fast, 100% private, client-side browser document tools.',
    h1: 'About PrintSign & Our Privacy Mission',
    toolMode: null,
    ogType: 'website',
    featureList: [
      'Zero-Cloud Mission',
      'Open-Source Philosophy',
      'Client-Side Sandbox Architecture'
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About PrintSign',
      url: 'https://printsign.org/about-us',
      description: 'Discover our mission to replace untrusted cloud PDF converters with fast, 100% private, client-side browser document tools.'
    }
  },
  '/features': {
    title: 'PrintSign Features — Specifications & Security',
    description: 'Explore PrintSign features: byte-level redaction, 300 DPI rasterization, orphan object GC, metadata purging, and offline PWA.',
    h1: 'PrintSign Features & Security Architecture',
    toolMode: null,
    ogType: 'website',
    featureList: [
      'Technical Specifications',
      '300 DPI Rasterization',
      'Orphan Object Garbage Collection',
      'Offline PWA Support'
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'PrintSign Features & Security Specifications',
      url: 'https://printsign.org/features',
      description: 'Explore PrintSign features: byte-level redaction, 300 DPI rasterization, orphan object GC, metadata purging, and offline PWA.'
    }
  },
  '/security-architecture': {
    title: 'PDF Security Architecture & Threat Model',
    description: 'In-depth technical breakdown of PrintSign zero-server architecture, Web Worker isolation, memory sandboxing, and canary checks.',
    h1: 'Security Architecture & Threat Model',
    toolMode: null,
    ogType: 'website',
    featureList: [
      'Threat Model & Guarantees',
      'WebAssembly Sandbox',
      'Canary Secret Verification',
      'Memory Wiping Protocols'
    ],
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          name: 'PrintSign Security Architecture & Threat Model',
          url: 'https://printsign.org/security-architecture',
          description: 'In-depth technical breakdown of PrintSign zero-server architecture, Web Worker isolation, memory sandboxing, and canary checks.'
        },
        buildSoftwareSourceCodeSchema(),
        buildBreadcrumbSchema([
          { name: 'Home', url: 'https://printsign.org/' },
          { name: 'Security & Compliance', url: 'https://printsign.org/security-architecture' }
        ])
      ]
    }
  },
  '/privacy-policy': {
    title: 'Privacy Policy — Zero Server Upload Guarantee',
    description: 'Read PrintSign\'s privacy policy. All document processing occurs strictly within your local browser memory sandbox. Zero telemetry.',
    h1: 'Privacy Policy',
    toolMode: null,
    ogType: 'website',
    featureList: [
      'Zero Data Collection',
      'No Telemetry',
      'Strict Client-Side Sandbox Guarantee'
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'PrintSign Privacy Policy',
      url: 'https://printsign.org/privacy-policy',
      description: 'Read PrintSign\'s privacy policy. All document processing occurs strictly within your local browser memory sandbox. Zero telemetry.'
    }
  },
  '/terms-of-service': {
    title: 'Terms of Service | PrintSign Client-Side Tools',
    description: 'Terms of service and permissible use guidelines for the PrintSign client-side PDF editing and redaction web platform.',
    h1: 'Terms of Service',
    toolMode: null,
    ogType: 'website',
    featureList: [
      'Terms of Service',
      'Permissible Usage',
      'Local Software License'
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'PrintSign Terms of Service',
      url: 'https://printsign.org/terms-of-service',
      description: 'Terms of service and permissible use guidelines for the PrintSign client-side PDF editing and redaction web platform.'
    }
  },
  '/cookie-policy': {
    title: 'Cookie Policy & Local Storage | PrintSign',
    description: 'PrintSign uses zero tracking cookies. Learn how IndexedDB is used strictly for offline document recovery and draft autosave.',
    h1: 'Cookie Policy',
    toolMode: null,
    ogType: 'website',
    featureList: [
      'Cookie Policy',
      'Zero Tracking Cookies',
      'IndexedDB Draft Recovery Details'
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'PrintSign Cookie Policy',
      url: 'https://printsign.org/cookie-policy',
      description: 'PrintSign uses zero tracking cookies. Learn how IndexedDB is used strictly for offline document recovery and draft autosave.'
    }
  },
  '/general-editor': {
    title: 'Universal Document & PDF Editor Online',
    description: 'Versatile client-side editor for viewing and managing PDF files locally without third-party cloud uploads.',
    h1: 'Universal Document & PDF Editor',
    toolMode: null,
    ogType: 'website',
    featureList: [
      'Client-Side Document Editing',
      'Zero Server Uploads',
      'Browser Memory Protection'
    ],
    schema: buildWebApplicationSchema(
      'PrintSign Universal Document & PDF Editor',
      'Versatile client-side editor for viewing and managing PDF files locally without third-party cloud uploads.',
      'https://printsign.org/general-editor',
      ['PDF Viewing', 'Annotation', 'Client-Side Rendering']
    )
  },
  '/sitemap': {
    title: 'Complete Site Directory & Offline PDF Tool Index | PrintSign.org',
    description: 'Browse all 54 pre-rendered client-side PDF tools, compliance hubs, industry role pages, cryptographic verifiers, and engineering guides on PrintSign.org.',
    h1: 'Complete Site Directory & Offline PDF Tool Index',
    toolMode: null,
    ogType: 'website',
    ogImage: 'https://printsign.org/images/og/sitemap.png',
    ogImageAlt: 'Complete Site Directory & Offline PDF Tool Index | PrintSign.org',
    featureList: [
      'All 13 Client-Side PDF Utilities',
      'Compliance Benchmarks (HIPAA, GDPR, NIST, FOIA)',
      'Industry Role Hubs (Legal, Healthcare, Journalism, Finance)',
      '18 Technical Engineering Articles'
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Complete Site Directory & Offline PDF Tool Index | PrintSign.org',
      url: 'https://printsign.org/sitemap',
      description: 'Complete categorized directory of all client-side PDF utilities, compliance benchmarks, industry role workflows, and engineering guides on PrintSign.org.'
    }
  }
}

export function getRouteSeo(routePath) {
  const normalized = (routePath || '/').split('?')[0].split('#')[0]
  if (seoMetadata[normalized]) {
    return seoMetadata[normalized]
  }

  const withoutTrailing = normalized.endsWith('/') && normalized.length > 1
    ? normalized.slice(0, -1)
    : normalized
  if (seoMetadata[withoutTrailing]) {
    return seoMetadata[withoutTrailing]
  }

  // Handle dynamic blog routes /blog/:slug
  if (normalized.startsWith('/blog/')) {
    const slug = normalized.replace('/blog/', '').replace(/-/g, ' ')
    const capitalizedSlug = slug.charAt(0).toUpperCase() + slug.slice(1)
    const title = `${capitalizedSlug.slice(0, 48)} | PrintSign`
    const description = `Read our technical guide on ${slug} and private client-side PDF document manipulation.`
    return {
      title,
      description,
      h1: capitalizedSlug,
      toolMode: null,
      ogType: 'article',
      featureList: [
        'Engineering Guide',
        'PDF Architecture',
        'Client-Side Security'
      ],
      schema: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: capitalizedSlug,
        description,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://printsign.org${withoutTrailing}`
        }
      }
    }
  }

  return seoMetadata['/']
}

export function useRouteSeo(routePath) {
  let route = null
  try {
    route = useRoute()
  } catch {
    // Outside router scope
  }

  const currentPath = computed(() => {
    if (typeof routePath === 'function') {
      return routePath()
    }
    if (isRef(routePath)) {
      return routePath.value
    }
    if (typeof routePath === 'string' && routePath.length > 0) {
      return routePath
    }
    return route ? route.path : '/'
  })

  const seoData = computed(() => {
    return getRouteSeo(currentPath.value)
  })

  useHead(() => {
    const data = seoData.value
    const path = currentPath.value.startsWith('/') ? currentPath.value : `/${currentPath.value}`
    const canonicalUrl = `https://printsign.org${path === '/' ? '/' : path}`
    const ogImg = data.ogImage || (path.startsWith('/blog/') ? `https://printsign.org/images/blogs/${path.replace('/blog/', '')}.png` : 'https://printsign.org/images/og/home.png')
    const ogAlt = data.ogImageAlt || data.title

    return {
      title: data.title,
      meta: [
        { name: 'description', content: data.description },
        { property: 'og:title', content: data.title },
        { property: 'og:description', content: data.description },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:type', content: data.ogType || 'website' },
        { property: 'og:image', content: ogImg },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: ogAlt },
        { property: 'og:image:type', content: 'image/png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: data.title },
        { name: 'twitter:description', content: data.description },
        { name: 'twitter:image', content: ogImg },
        { name: 'twitter:image:alt', content: ogAlt }
      ],
      link: [
        { rel: 'canonical', href: canonicalUrl }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(data.schema || {})
        }
      ]
    }
  })

  return { seoData, currentPath }
}
