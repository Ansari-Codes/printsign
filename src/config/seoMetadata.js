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

export const seoMetadata = {
  '/': {
    title: 'PrintSign: 100% Client-Side PDF Editor & Redactor',
    description: 'Edit, split, merge, and permanently redact PDFs locally in your browser. Zero cloud uploads, 100% private, and full offline PWA support.',
    h1: 'Zero-Cloud PDF Editor & Permanent Redaction Suite',
    toolMode: null,
    ogType: 'website',
    featureList: [
      '100% Client-Side PDF Redaction',
      'Offline PDF Splitting & Merging',
      'Local Browser Storage & IndexedDB Recovery',
      'Zero Server Uploads & Zero Telemetry'
    ],
    schema: buildWebApplicationSchema(
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
    )
  },
  '/verify-redaction': {
    title: 'PDF Redaction & Metadata Verifier — Local Inspection Tool',
    description: 'Check if a redacted PDF still contains selectable text under boxes or hidden XMP metadata. 100% local browser inspection—no file upload.',
    h1: 'Client-Side PDF Sanitization & Redaction Verifier',
    toolMode: 'verifier',
    ogType: 'website',
    featureList: [
      'Local PDF Redaction Verification',
      'Selectable Text Layer Detection',
      'XMP Metadata Stream Inspector',
      'Info Dictionary Audit',
      'Pure Raster Verification',
      'Zero Cloud Upload'
    ],
    schema: buildWebApplicationSchema(
      'PDF Redaction & Metadata Verifier',
      'Check if a redacted PDF still contains selectable text under boxes or hidden XMP metadata. 100% local browser inspection—no file upload.',
      'https://printsign.org/verify-redaction',
      [
        'Local PDF Redaction Verification',
        'Selectable Text Layer Detection',
        'XMP Metadata Stream Inspector'
      ]
    )
  },
  '/ilovepdf-smallpdf-offline-alternative': {
    title: 'Private Offline Alternative to iLovePDF & Smallpdf (No Upload)',
    description: 'Compare cloud PDF editors vs. PrintSign\'s 100% client-side WebAssembly architecture. Edit, merge, and redact PDFs locally without uploading files.',
    h1: 'The 100% Client-Side, Zero-Upload Alternative to Cloud PDF Tools',
    toolMode: 'comparison',
    ogType: 'website',
    featureList: [
      '100% Client-Side WebAssembly Processing',
      'Zero Cloud File Retention',
      'Unlimited Free PDF Tasks (No Paywalls)',
      'Permanent 300 DPI Redaction',
      'Offline Air-Gap Operation'
    ],
    schema: buildWebApplicationSchema(
      'PrintSign Private Cloud PDF Alternative',
      'Compare cloud PDF editors vs. PrintSign\'s 100% client-side WebAssembly architecture. Edit, merge, and redact PDFs locally without uploading files.',
      'https://printsign.org/ilovepdf-smallpdf-offline-alternative',
      [
        'Zero-Upload PDF Manipulation',
        'Client-Side WebAssembly Sandbox',
        'Permanent 300 DPI Redaction',
        'No Task Caps or Paywalls'
      ]
    )
  },
  '/hipaa-compliant-pdf-redaction': {
    title: 'HIPAA-Compliant Local PDF Redaction & Sanitization | PrintSign',
    description: 'Redact patient PHI and medical records 100% inside your browser RAM. Zero cloud uploads, no BAA required, and permanent 300 DPI pixel destruction.',
    h1: 'HIPAA-Compliant Client-Side PDF Redaction for Healthcare & Legal Teams',
    toolMode: 'compliance',
    ogType: 'website',
    featureList: [
      'HIPAA Security Rule § 164.312 Compliant',
      'Exempt from Third-Party Cloud BAA',
      'Permanent 300 DPI PHI Pixel Destruction',
      'Patient Identifier & Diagnostic Sanitization',
      'Zero Telemetry or Cloud Logging'
    ],
    schema: buildWebApplicationSchema(
      'PrintSign HIPAA PDF Redactor',
      'Redact patient PHI and medical records 100% inside your browser RAM. Zero cloud uploads, no BAA required, and permanent 300 DPI pixel destruction.',
      'https://printsign.org/hipaa-compliant-pdf-redaction',
      [
        'HIPAA § 164.312 Safe Harbor Redaction',
        'No Cloud BAA Obligation',
        'Permanent Pixel Burn-in at 300 DPI',
        'In-Memory PHI Sanitization'
      ]
    )
  },
  '/nist-800-88-pdf-sanitization': {
    title: 'NIST SP 800-88 PDF Sanitization & Metadata Scrubbing | PrintSign',
    description: 'Meet NIST SP 800-88 media sanitization standards for PDF documents. Purge hidden XMP streams, Info dictionaries, and underlying vector text locally.',
    h1: 'NIST SP 800-88 Aligned PDF Sanitization & Metadata Destruction',
    toolMode: 'compliance',
    ogType: 'website',
    featureList: [
      'NIST SP 800-88 Rev. 1 Logical Sanitization Aligned',
      'Orphan Indirect Object Garbage Collection',
      'Trailer /Info Dictionary & XMP Stream Purging',
      'Cross-Reference Table Reconstruction',
      'Cryptographic Canary Verification Scans'
    ],
    schema: buildWebApplicationSchema(
      'PrintSign NIST SP 800-88 PDF Sanitizer',
      'Meet NIST SP 800-88 media sanitization standards for PDF documents. Purge hidden XMP streams, Info dictionaries, and underlying vector text locally.',
      'https://printsign.org/nist-800-88-pdf-sanitization',
      [
        'NIST SP 800-88 Rev. 1 Media Clearing',
        'Orphan Indirect Object Purging',
        'Trailer Info & XMP Eradication',
        'In-Memory Verification Audits'
      ]
    )
  },
  '/redact-pdf': {
    title: 'Redact PDF Online — Permanent 300 DPI Redaction',
    description: 'Permanently redact sensitive text and images from PDFs locally in your browser. Burns 300 DPI pixels with zero server uploads.',
    h1: 'Permanent Client-Side PDF Redactor',
    toolMode: 'redact',
    ogType: 'website',
    featureList: [
      'Permanent 300 DPI Redaction',
      'Underlying Text Layer Stripping',
      'Orphan Object Garbage Collection',
      'Client-Side In-Memory Execution',
      'Zero Server Uploads'
    ],
    schema: buildWebApplicationSchema(
      'PrintSign Client-Side PDF Redactor',
      'Permanently redact sensitive text and images from PDFs locally in your browser. Burns 300 DPI pixels with zero server uploads.',
      'https://printsign.org/redact-pdf',
      [
        'Permanent 300 DPI Redaction',
        'Underlying Text Layer Stripping',
        'Orphan Object Garbage Collection',
        'Canary Verification Audit'
      ]
    )
  },
  '/scrub-pdf-metadata': {
    title: 'Scrub PDF Metadata & Sanitize XMP Streams Offline',
    description: 'Remove author, creation dates, and hidden XMP metadata from PDFs directly in your browser. 100% private client-side sanitizer.',
    h1: 'Local PDF Metadata & XMP Sanitizer',
    toolMode: 'metadata',
    ogType: 'website',
    featureList: [
      'Metadata Sanitization',
      'XMP XML Stream Removal',
      'Author, Creator & Producer Stripping',
      'Creation & Modification Timestamp Removal',
      'Client-Side Offline Processing'
    ],
    schema: buildWebApplicationSchema(
      'PrintSign PDF Metadata & XMP Scrubber',
      'Remove author, creation dates, and hidden XMP metadata from PDFs directly in your browser. 100% private client-side sanitizer.',
      'https://printsign.org/scrub-pdf-metadata',
      [
        'Remove PDF Document Info Dictionary',
        'Sanitize XMP XML Streams',
        'Strip GPS & Device Identifiers',
        'Purge Creation & Modification Dates'
      ]
    )
  },
  '/split-pdf': {
    title: 'Split PDF Pages Locally — Extract PDF Ranges Free',
    description: 'Extract pages or split large PDFs into custom ranges offline. Fast Web Worker processing in browser memory with no file uploads.',
    h1: 'Split & Extract PDF Pages Locally',
    toolMode: 'split',
    ogType: 'website',
    featureList: [
      'Custom Page Range Extraction',
      'Dedicated WebWorker Processing',
      'Fast Local Extraction',
      'Zero Server Uploads',
      'Offline Operation'
    ],
    schema: buildWebApplicationSchema(
      'PrintSign PDF Page Splitter & Extractor',
      'Extract pages or split large PDFs into custom ranges offline. Fast Web Worker processing in browser memory with no file uploads.',
      'https://printsign.org/split-pdf',
      [
        'Custom Page Range Splitting',
        'Extract Selected Pages to New PDF',
        'In-Browser Memory Processing',
        'Zero File Size Limits'
      ]
    )
  },
  '/merge-pdf': {
    title: 'Merge PDF Files Locally in Browser — No Uploads',
    description: 'Combine multiple PDF files into one in your browser memory. Fast WebAssembly processing, zero file size limits, and 100% private.',
    h1: 'Combine & Merge PDFs 100% in Browser Memory',
    toolMode: 'merge',
    ogType: 'website',
    featureList: [
      'Combine Multiple PDF Files',
      'In-Browser Memory Processing',
      'WebAssembly PDF Engine',
      'No Cloud Uploads',
      'Zero File Size Limits'
    ],
    schema: buildWebApplicationSchema(
      'PrintSign PDF Combiner & Merger',
      'Combine multiple PDF files into one in your browser memory. Fast WebAssembly processing, zero file size limits, and 100% private.',
      'https://printsign.org/merge-pdf',
      [
        'Merge Unlimited PDF Documents',
        'Multi-Tab Document Isolation',
        'Lossless Page Vector Preservation',
        'Client-Side RAM Execution'
      ]
    )
  },
  '/flatten-rasterize-pdf': {
    title: 'Flatten & Rasterize PDF to 300 DPI Locally',
    description: 'Convert PDF vector layers, form fields, and annotations into flat 300 DPI images locally. Prevent layer recovery and leakages.',
    h1: 'High-DPI Client-Side PDF Rasterizer',
    toolMode: 'rasterize',
    ogType: 'website',
    featureList: [
      'High-DPI 300 DPI Rasterization',
      'Vector Layer & Font Flattening',
      'AcroForm Field Burning',
      'Eliminate Hidden Layer Leakage',
      'Local Processing'
    ],
    schema: buildWebApplicationSchema(
      'PrintSign High-DPI PDF Rasterizer & Layer Flattener',
      'Convert PDF vector layers, form fields, and annotations into flat 300 DPI images locally. Prevent layer recovery and leakages.',
      'https://printsign.org/flatten-rasterize-pdf',
      [
        '300 to 600 DPI High-Resolution Output',
        'AcroForm Interactive Field Burning',
        'Vector Coordinate Stripping',
        'Clean Bitmap Page Recompilation'
      ]
    )
  },
  '/reorder-rotate-pdf': {
    title: 'Reorder & Rotate PDF Pages Locally in Browser',
    description: 'Rearrange, rotate, crop, or delete PDF pages offline. Drag and drop organization in browser memory without cloud file uploads.',
    h1: 'Reorder, Rotate & Organize PDF Pages Locally',
    toolMode: 'organize',
    ogType: 'website',
    featureList: [
      'Drag-and-Drop Page Reordering',
      '90-Degree Page Rotation',
      'Single & Bulk Page Deletion',
      'Interactive Visual Thumbnails',
      'Client-Side Memory Sandbox'
    ],
    schema: buildWebApplicationSchema(
      'PrintSign PDF Page Organizer & Rotator',
      'Rearrange, rotate, crop, or delete PDF pages offline. Drag and drop organization in browser memory without cloud file uploads.',
      'https://printsign.org/reorder-rotate-pdf',
      [
        'Drag-and-Drop Page Reordering',
        '90-Degree Clockwise & Counter-Clockwise Rotation',
        'Custom Page Cropping',
        'Single & Bulk Page Deletion'
      ]
    )
  },
  '/compress-pdf': {
    title: 'Compress PDF Locally — Lossless PDF Optimizer',
    description: 'Shrink PDF file size locally using lossless Flate compression and orphan object purging. Fast offline document optimization.',
    h1: 'Lossless Local PDF Compressor',
    toolMode: 'compress',
    ogType: 'website',
    featureList: [
      'Lossless Flate Compression',
      'Unused Object & Cross-Reference Table Purging',
      'Vector Stream Optimization',
      'Text Clarity Preservation',
      '100% In-Browser Execution'
    ],
    schema: buildWebApplicationSchema(
      'PrintSign Lossless Local PDF Compressor',
      'Shrink PDF file size locally using lossless Flate compression and orphan object purging. Fast offline document optimization.',
      'https://printsign.org/compress-pdf',
      [
        'FlateDecode Stream Compression',
        'Orphan Object Purging',
        'Cross-Reference Table Compaction',
        'Zero Text Blurring'
      ]
    )
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
      '@type': 'WebPage',
      name: 'PrintSign Security Architecture & Threat Model',
      url: 'https://printsign.org/security-architecture',
      description: 'In-depth technical breakdown of PrintSign zero-server architecture, Web Worker isolation, memory sandboxing, and canary checks.'
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

    return {
      title: data.title,
      meta: [
        { name: 'description', content: data.description },
        { property: 'og:title', content: data.title },
        { property: 'og:description', content: data.description },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:type', content: data.ogType || 'website' },
        { property: 'og:image', content: 'https://printsign.org/pwa-512x512.svg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: data.title },
        { name: 'twitter:description', content: data.description },
        { name: 'twitter:image', content: 'https://printsign.org/pwa-512x512.svg' }
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
