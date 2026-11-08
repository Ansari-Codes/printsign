# Awesome-Privacy Pull Request & Directory Listings

This document contains ready-to-copy entries and PR templates for open-source privacy directories and software catalogs.

---

## 1. Lissy93/awesome-privacy PR Submission

**Target Repository:** [https://github.com/Lissy93/awesome-privacy](https://github.com/Lissy93/awesome-privacy)  
**Target Section:** `Document Editing & Conversion` / `Productivity & Office`

### A. YAML Entry for `awesome-privacy.yml`

```yaml
- name: PrintSign
  description: 100% client-side PDF editor, permanent 300 DPI redactor, and metadata scrubber running entirely in browser RAM with zero network uploads.
  url: https://printsign.org
  github: https://github.com/Ansari-Codes/printsign
  icon: https://printsign.org/pwa-192x192.svg
  security:
    open_source: true
    zero_telemetry: true
    client_side_only: true
    no_registration: true
    offline_pwa: true
  features:
    - Permanent 300 DPI canvas rasterization (prevents black-box copy-paste bypass)
    - Metadata & XMP stream scrubber (/Author, /Producer, timestamps)
    - In-browser PDF merge, split, rotation, and reordering
    - Offline air-gap ready via Workbox Service Worker
    - Zero server-side components (verifiable via F12 Network tab)
```

### B. Pull Request Description (Copy & Paste into GitHub PR)

```markdown
### Summary of Changes
Adds **PrintSign** to the Document Editing & Privacy Tools section.

### Project Description
PrintSign (https://printsign.org) is an open-source, 100% client-side PDF manipulation and sanitization engine engineered specifically to solve the data exfiltration hazards of cloud PDF converters and the cosmetic black-box redaction failure mode in Adobe Acrobat/Preview.

### Privacy & Security Verification
- **Zero Cloud Architecture:** Every operation (redacting, splitting, merging, rasterizing, and metadata stripping) is performed locally in client memory using Web Workers, Mozilla PDF.js, and `pdf-lib`.
- **Zero Telemetry:** No Google Analytics, no error reporting beacons, and zero third-party scripts.
- **Reproducible F12 Audit:** Independent auditors can verify that 0 network packets are sent by opening DevTools (`F12`), filtering by `Fetch/XHR`, or using our live telemetry tool at https://printsign.org/f12-network-audit.
- **Offline Air-Gap Ready:** Full Progressive Web App (PWA) precached by Workbox; works indefinitely with Wi-Fi disconnected.
- **Source Code:** https://github.com/Ansari-Codes/printsign (MIT License)

### Checklist
- [x] The tool is actively maintained and free of commercial paywalls.
- [x] The tool is open source under an OSI-approved license (MIT).
- [x] Zero user tracking or data collection.
```

---

## 2. Pluja/awesome-privacy Markdown Entry

**Target Repository:** [https://github.com/pluja/awesome-privacy](https://github.com/pluja/awesome-privacy)

```markdown
| Software | Description | License | Source Code |
| :--- | :--- | :--- | :--- |
| **[PrintSign](https://printsign.org)** | 100% client-side PDF editor & permanent redactor. Operates entirely in browser RAM with zero server uploads, zero telemetry, and full offline PWA support. | MIT | [GitHub](https://github.com/Ansari-Codes/printsign) |
```

---

## 3. AlternativeTo (AlternativeTo.net) Listing Submission

**Tool Name:** PrintSign  
**Website:** `https://printsign.org`  
**License:** Free & Open Source (MIT)  
**Platforms:** Web, Chrome, Firefox, Safari, Edge, Linux, Windows, macOS, Android, iOS (Progressive Web App)

### Short Description (Max 150 chars):
> 100% private, client-side PDF editor and permanent redactor. Zero file uploads, zero telemetry, and full offline air-gap support.

### Long Description:
> PrintSign is an open-source, zero-backend document productivity and sanitization tool that runs entirely in your browser. Unlike traditional cloud converters (like Smallpdf or iLovePDF) that upload your confidential documents to multi-tenant remote servers, PrintSign processes every document locally in volatile RAM using WebAssembly and Web Workers.
>
> **Core Capabilities:**
> - **Permanent 300 DPI Redaction:** Unlike standard PDF viewers that draw cosmetic black vector rectangles over text (leaving underlying words selectable and copyable), PrintSign burns redactions into high-resolution bitmap pixels and unlinks vector text streams.
> - **Trailer-Root Orphan Garbage Collector:** Purges unreferenced streams and deleted objects from the PDF catalog graph.
> - **Metadata & XMP Scrubber:** Strips author names, creation software, editing timestamps, and XML catalog packets in one click.
> - **In-Browser Merge & Split:** Concatenate multi-gigabyte PDFs or extract page ranges locally at native disk I/O speeds.
> - **100% Offline PWA:** Disconnect your Wi-Fi or unplug your Ethernet cable — PrintSign operates autonomously with zero network access.
> - **Live Zero-Network Verification:** Press F12 to inspect network traffic and verify 0 outbound requests.

### Tags to Apply on AlternativeTo:
`pdf-editor`, `pdf-redaction`, `privacy`, `open-source`, `offline-first`, `pwa`, `document-sanitization`, `metadata-cleaner`, `hipaa-compliant`, `foia`

### Alternatives to Map:
- Alternative to **Adobe Acrobat**
- Alternative to **Smallpdf**
- Alternative to **iLovePDF**
- Alternative to **PDF24 Creator**
- Alternative to **Sejda PDF**
