# Hacker News "Show HN" Launch Asset

**URL Submission:** `https://news.ycombinator.com/submit`  
**Title:** `Show HN: PrintSign – 100% Client-Side 300 DPI PDF Redactor & Sanitizer (Zero Upload)`  
**URL:** `https://printsign.org`

---

## Technical First Comment (Post immediately after submitting)

```markdown
Hi HN! We built PrintSign (https://printsign.org), a free and open-source, 100% client-side PDF editor and permanent redaction engine running entirely in browser RAM.

### Why We Built It: The "Cosmetic Black Box" Disaster
Every year, high-profile legal filings (such as the Manafort filing and recent government disclosures) leak sensitive information because someone drew a black rectangle over confidential text in Acrobat or Preview and assumed it was redacted.

In the PDF ISO 32000 spec, drawing a rectangle merely appends a vector drawing path (`re` / `f`) to the page stream. The underlying character glyph indices, font coordinates, and search matrices remain completely intact. Anyone can press `Ctrl + A`, copy-paste the text, or extract it via `pdftotext`. Furthermore, even if text streams are modified, deleted objects often persist as unreferenced "orphans" in incremental file revision trailers.

Meanwhile, online PDF converters (iLovePDF, Smallpdf) solve this by asking users to upload confidential court files, medical charts, and tax returns to multi-tenant cloud servers. For healthcare providers (HIPAA), attorneys (FRCP Rule 5.2), and journalists (FOIA), uploading privileged documents to third-party cloud infrastructure is unacceptable.

### How PrintSign Works Under the Hood
1. **Zero-Network Architecture:** There are no backend processing servers, no remote workers, and no databases. All PDF parsing, canvas rendering, and binary rebuilding happen on the user's CPU using Mozilla PDF.js (v5 WASM worker) and `pdf-lib`.
2. **True 300 DPI Pixel Burn-In:** When you redact a page, PrintSign renders the target page to an offscreen high-DPI HTML5 canvas, burns the redaction geometry permanently into the image pixels, and embeds the page back as a clean, flat bitmap XObject. The original vector content stream is permanently erased.
3. **Trailer-Root Orphan Garbage Collection:** When pages or objects are replaced, our engine traverses the document object graph starting from the Trailer root, identifies all unreferenced indirect objects (such as orphaned font descriptors and content streams), and strips them from the cross-reference (XRef) table during export.
4. **Volatile RAM Sandboxing:** The document buffer is stored in a typed `Uint8Array` in volatile RAM. It is never cached to local disk or sent to cookies. Closing the browser tab triggers the browser's generational garbage collector, leaving zero digital forensic footprint.
5. **Air-Gap PWA:** Built as an offline-first PWA with Workbox. Once loaded, you can unplug your Ethernet cable or turn off Wi-Fi and redact/split/merge documents in perpetuity.

### Tools for Skeptical Developers
We know privacy claims on the web are cheap, so we built two dedicated verification tools:
- **Live F12 Network Audit & Benchmark:** https://printsign.org/f12-network-audit
  Uses the native `PerformanceObserver` API to track all network requests in real time. You can click "Run Live In-Memory Benchmark" to synthesize and audit a 3-page document in RAM and verify that `fetch`/`xhr` calls remain strictly 0.
- **Client-Side Redaction & Metadata Verifier:** https://printsign.org/verify-redaction
  Drop any redacted PDF into browser RAM to inspect whether cosmetic black boxes left underlying text selectable, and inspect hidden `/Info` keys and raw XMP XML metadata packets.

GitHub repo: https://github.com/Ansari-Codes/printsign (MIT License)

We’d love feedback on our memory cleanup pipeline and how your workflows handle redaction defensibility!
```
