# Reddit Launch Posts & Community Write-ups

Tailored submissions formatted for specific subreddits and developer communities.

---

## 1. r/privacy

**Title:** `I built a 100% client-side PDF redactor & editor running entirely in browser RAM (No server, zero telemetry, air-gap ready)`  
**Flair:** `Tool / Resource` or `Open Source`

```markdown
Hey r/privacy,

Every week we see posts asking for safe alternatives to online PDF converters like Smallpdf, iLovePDF, or Adobe Acrobat. The problem with 99% of online tools is that they require you to upload your confidential files (medical records, tax returns, bank statements, legal contracts) to their remote servers. Even if they claim "files are deleted after 1 hour," your unencrypted document still traverses public routing, sits on remote disk mounts, and can be retained in crash logs or subpoenaed.

To solve this, I built **PrintSign** (https://printsign.org): a free, open-source PDF editor and permanent redactor that operates **100% inside your browser sandbox**.

### Key Privacy & Architecture Guarantees:
1. **Zero Server Uploads:** There is no backend server. Document parsing, canvas rendering, text scrubbing, and PDF reconstruction happen locally on your computer using Web Workers, Mozilla PDF.js, and `pdf-lib`.
2. **Permanent 300 DPI Redaction:** In Adobe Acrobat or Apple Preview, drawing a black box often just places a vector shape OVER the text, leaving the underlying words selectable and copy-pasteable. PrintSign burns redactions into physical 300 DPI image pixels and strips the underlying text stream completely.
3. **Trailer-Root Orphan Garbage Collection:** When pages or objects are modified, our engine traverses the document object tree and purges unreferenced indirect objects (preventing leaked data in file trailers).
4. **Metadata & XMP Scrubber:** Strips author names, creation software, editing timestamps, and XML catalog packets in one click.
5. **Air-Gap / Offline PWA:** Once loaded, you can disconnect your Wi-Fi or unplug your Ethernet cable and the entire app continues to work indefinitely via Service Worker caching.
6. **Zero Telemetry:** No Google Analytics, no tracking pixels, no error beacons.

### How to Verify It Yourself (In 10 Seconds):
Open https://printsign.org, press `F12`, switch to the **Network** tab, filter by `Fetch/XHR`, and edit or redact any document. You will see strictly **0 outbound network requests**.

We also built an interactive live telemetry audit page: https://printsign.org/f12-network-audit

Source code is under MIT license: https://github.com/Ansari-Codes/printsign

Feedback, security audits, and pull requests are very welcome!
```

---

## 2. r/selfhosted & r/webdev

**Title:** `PrintSign: An open-source, client-side PDF editor & redactor that needs 0 backend servers or Docker containers (WASM + Web Workers)`  
**Flair:** `Self-Hosted` / `Project Showcase`

```markdown
Hey everyone,

Most self-hosters running PDF tools end up deploying Stirling-PDF or LibreOffice instances in heavy Docker containers consuming 1-2 GB of server RAM just to split a PDF, rotate pages, or redact sensitive text.

I wanted to see if modern client-side WebAssembly, HTML5 Canvas, and Web Workers could handle full PDF editing and forensic redaction with **zero backend infrastructure**.

The result is **PrintSign** (https://printsign.org) — an offline-first Progressive Web App built with Vue 3, Vite, Mozilla PDF.js (v5 WASM worker), and `pdf-lib`.

### Technical Highlights:
- **No Backend Required:** You can host it on GitHub Pages, Cloudflare Pages, S3, or an Nginx static container using under 15 MB of static storage.
- **True Redaction Pipeline:**
  1. Renders target PDF pages at 300 DPI onto hardware-accelerated OffscreenCanvas.
  2. Burns user redaction rectangles directly into the raw pixel bitmap.
  3. Replaces target page objects in the PDF binary tree as pure image XObjects.
  4. Runs a custom Garbage Collector that walks the document graph from the Trailer root, identifying and deleting unreferenced indirect streams and orphan font matrices.
- **Volatile Memory Model:** Documents are loaded into typed `Uint8Array` buffers in client RAM. No temp files on disk, no IndexedDB document retention unless explicitly enabled by user auto-save drafts.
- **Pre-rendered Static Site Architecture:** All 43 tool and blog routes are statically pre-rendered at build time with comprehensive JSON-LD schemas and crawlable semantic bodies.
- **F12 Audit Telemetry:** We integrated native `PerformanceObserver` monitoring (https://printsign.org/f12-network-audit) that lets developers audit all network resources in real time.

Source code: https://github.com/Ansari-Codes/printsign (MIT)

Would love feedback from frontend and security engineers on our orphan GC implementation and canvas memory management!
```

---

## 3. r/legaltech & FOIA Researchers

**Title:** `How to stop court filing redaction failures: Free client-side 300 DPI PDF redactor and pre-filing verifier tool (FRCP Rule 5.2 compliant)`  
**Flair:** `Software` / `Practice Tips`

```markdown
Hi r/legaltech and FOIA practitioners,

High-profile court filings and government transparency releases continue to suffer from catastrophic redaction failures. In standard PDF software (Adobe Acrobat, Preview, or PDFpen), drawing a black rectangle over sensitive text frequently only creates an annotation layer. 

The underlying text glyphs remain completely intact in the document stream. Anyone who downloads the filing can press `Ctrl + A`, paste into Notepad, or run a basic text extractor to read confidential bank accounts, SSNs, or witness names.

To help legal teams, paralegals, and journalists prevent these leaks, we built **PrintSign** (https://printsign.org):

### 1. Permanent 300 DPI Redactor (`/redact-pdf`)
Instead of superficial overlay shapes, PrintSign renders the page into high-resolution 300 DPI bitmap pixels, physically replaces the text with black pixels, and deletes the underlying vector text stream completely. The output document is court-defensible and meets FRCP Rule 5.2, Federal Criminal Rule 49.1, and HIPAA Safe Harbor requirements.

### 2. PDF Redaction & Metadata Verifier Tool (`/verify-redaction`)
Before e-filing or releasing a document:
- Drag the redacted PDF into the verifier (https://printsign.org/verify-redaction).
- It audits every page for hidden selectable text layers and flags pages that still contain extractable glyphs.
- It also scans the `/Info` dictionary and raw XMP XML metadata packets for author names, computer usernames, and editing history.

### 3. Absolute Privilege & Zero-Upload Guarantee:
Unlike commercial web converters, PrintSign runs **100% locally in your computer's browser memory**. Not a single page or word is uploaded to any cloud server, preserving attorney-client privilege and work-product confidentiality.

Free to use, open source (MIT), with no page limits or subscriptions: https://printsign.org
```
