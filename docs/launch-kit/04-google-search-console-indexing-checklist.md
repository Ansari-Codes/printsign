# Google Search Console (GSC) Priority Indexing Checklist

This checklist contains all **43 production routes** generated for **PrintSign.org** (`https://printsign.org`), grouped into prioritization tiers for immediate URL Inspection and submission in Google Search Console and Bing Webmaster Tools.

---

## 🚀 Pre-Submission Verification

1. **Sitemap URL:** `https://printsign.org/sitemap.xml`
   - Test sitemap in GSC under **Sitemaps** > **Add a new sitemap** (`sitemap.xml`).
   - Expected status: `Success` (43 discovered URLs).
2. **Robots.txt URL:** `https://printsign.org/robots.txt`
   - Verify `Sitemap: https://printsign.org/sitemap.xml` directive is active.
   - Verify `Allow: /` and no `Disallow` rules block search crawlers.

---

## 🏆 Tier 1: Core Tools & Interactive Verifiers (Priority 1.0 – Daily/Weekly)
*Submit these first via **URL Inspection > Request Indexing** to capture immediate transactional search queries for offline/local PDF editing.*

| Priority | URL | Intent / Target Keyword |
|---|---|---|
| **P0** | `https://printsign.org/` | Zero-Server Client-Side PDF Redaction & Editor |
| **P0** | `https://printsign.org/verify-redaction` | Client-Side PDF Redaction & Metadata Verifier |
| **P0** | `https://printsign.org/f12-network-audit` | 10-Second F12 Zero-Network Audit & Benchmark |
| **P1** | `https://printsign.org/redact-pdf` | Permanent Pixel Rasterization PDF Redactor |
| **P1** | `https://printsign.org/scrub-pdf-metadata` | Client-Side PDF Metadata & XMP Stream Cleaner |
| **P1** | `https://printsign.org/compress-pdf` | In-Memory PDF Compressor (Flate/Deflate Stream Optimizer) |
| **P1** | `https://printsign.org/flatten-rasterize-pdf` | 300 DPI Canvas Rasterizer & AcroForm Flattener |
| **P1** | `https://printsign.org/merge-pdf` | Private Local PDF Merger (Zero Upload) |
| **P1** | `https://printsign.org/split-pdf` | In-Browser PDF Splitter & Page Range Extractor |
| **P1** | `https://printsign.org/reorder-rotate-pdf` | Client-Side PDF Page Reorder & Rotation Utility |
| **P1** | `https://printsign.org/editor` | Full Offline Local PDF Editor Workspace |

---

## 🛡️ Tier 2: Compliance, Trust & Competitor Alternatives (Priority 0.9)
*Submit to capture compliance officers, legal tech evaluators, and privacy-conscious switchers searching for alternatives.*

| Priority | URL | Focus / Target Audience |
|---|---|---|
| **P1** | `https://printsign.org/ilovepdf-smallpdf-offline-alternative` | ILovePDF & Smallpdf Offline Alternatives |
| **P1** | `https://printsign.org/hipaa-compliant-pdf-redaction` | HIPAA & ePHI Local PDF Redaction Compliance |
| **P1** | `https://printsign.org/nist-800-88-pdf-sanitization` | NIST SP 800-88 R1 PDF Media Sanitization |
| **P2** | `https://printsign.org/security-architecture` | Zero-Knowledge Web Worker Security Whitepaper |
| **P2** | `https://printsign.org/features` | Complete Technical Feature Matrix |
| **P2** | `https://printsign.org/blog` | Engineering & Technical Publication Hub |
| **P2** | `https://printsign.org/guides` | Technical Walkthroughs & User Guides |
| **P2** | `https://printsign.org/faq` | Frequently Asked Security & Technical Questions |
| **P2** | `https://printsign.org/general-editor` | Quick Standalone Document Editor |

---

## 📚 Tier 3: Engineering Deep-Dives & Technical Blog Posts (Priority 0.8)
*Submit to capture long-tail technical queries from developers, forensic analysts, security auditors, and legal teams.*

| Slug / URL | Core Focus & Interlinks |
|---|---|
| `https://printsign.org/blog/client-side-pdf-redaction-security` | Forensic PDF redaction failure modes (`/redact-pdf`, `/verify-redaction`) |
| `https://printsign.org/blog/how-to-permanently-redact-pdf-free` | Step-by-step unrecoverable redaction (`/redact-pdf`) |
| `https://printsign.org/blog/remove-hidden-metadata-from-pdf` | Info dictionary & XMP scrubbing (`/scrub-pdf-metadata`) |
| `https://printsign.org/blog/why-blacking-out-text-in-pdf-fails` | Manafort/court filing black rectangle leaks (`/redact-pdf`, `/verify-redaction`) |
| `https://printsign.org/blog/compress-pdf-without-losing-quality` | Lossless Deflate/Flate optimization (`/compress-pdf`) |
| `https://printsign.org/blog/merge-pdf-files-privately-offline` | XRef table concatenation without network (`/merge-pdf`) |
| `https://printsign.org/blog/split-extract-pages-pdf-locally` | Boundary preservation and page extraction (`/split-pdf`) |
| `https://printsign.org/blog/flatten-pdf-forms-annotations-explained` | AcroForm widget rasterization (`/flatten-rasterize-pdf`) |
| `https://printsign.org/blog/rotate-reorder-pdf-pages-in-browser` | Matrix transformation & page tree reordering (`/reorder-rotate-pdf`) |
| `https://printsign.org/blog/is-smallpdf-ilovepdf-safe-privacy-risks` | Third-party cloud processing security risks (`/ilovepdf-smallpdf-offline-alternative`) |
| `https://printsign.org/blog/pdf-sanitization-legal-court-filings` | Federal court e-filing redaction compliance (`/redact-pdf`, `/verify-redaction`) |
| `https://printsign.org/blog/redacting-pii-phi-medical-records-hipaa` | HIPAA Privacy Rule 45 CFR § 164.514 (`/hipaa-compliant-pdf-redaction`) |
| `https://printsign.org/blog/how-pdf-redaction-works-under-the-hood` | PDF specification parsing and rasterization pipeline (`/redact-pdf`) |
| `https://printsign.org/blog/clean-pdf-for-foia-public-records-request` | FOIA statutory exemptions and sanitization (`/verify-redaction`, `/redact-pdf`) |
| `https://printsign.org/blog/rasterization-vs-vector-overlay-redaction` | Vector bounding boxes vs 300 DPI rasterization (`/flatten-rasterize-pdf`, `/verify-redaction`) |
| `https://printsign.org/blog/air-gapped-pdf-processing-secure-environments` | Defense, classified, and offline security protocols (`/f12-network-audit`) |
| `https://printsign.org/blog/pdf-metadata-forensics-what-files-reveal` | Metadata extraction forensics and inspection (`/scrub-pdf-metadata`, `/verify-redaction`) |
| `https://printsign.org/blog/browser-pdf-processing-performance-web-workers` | Multi-threaded client-side Web Workers & WASM (`/f12-network-audit`) |

---

## 🏛️ Tier 4: Company & Legal Foundation (Priority 0.5 – 0.7)
*Indexed for brand credibility, transparency, and search engine E-E-A-T.*

| URL | Category |
|---|---|
| `https://printsign.org/about-us` | Company & Mission Statement |
| `https://printsign.org/contact-us` | Direct Feedback & Responsible Disclosure |
| `https://printsign.org/privacy-policy` | Strict Zero-Data Collection Policy |
| `https://printsign.org/terms-of-service` | Client-Side License & Service Terms |
| `https://printsign.org/cookie-policy` | Zero-Tracking Cookie Declaration |

---

## 📈 Post-Indexing Tracking Protocol

1. **Daily URL Inspection Quota:** Submit 10–12 URLs per day in GSC until all 43 are in `URL is on Google` status.
2. **IndexNow API / Bing Webmaster Tools:** Batch submit all 43 URLs in one request using Bing Webmaster Tools API or Webmaster dashboard.
3. **Monitor Coverage:** Watch for 0 `404 Not Found`, 0 `Soft 404`, and 0 `Excluded by 'noindex' tag` in the GSC Page Indexing report.
