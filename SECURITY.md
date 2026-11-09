# Security Policy & Architecture Guide

PrintSign (`https://printsign.org`) is an open-source, offline-first, client-side PDF privacy workspace engineered on the principle of **Zero Server Execution**. All parsing, rendering, redaction, metadata scrubbing, splitting, and merging occur strictly within your browser's local sandbox memory via WebAssembly and Web Workers.

---

## Supported Versions

We provide continuous security updates and patches for the current production release. Because PrintSign operates as a client-side Progressive Web App (PWA), security patches take effect immediately upon browser cache revalidation.

| Version | Supported | Release Channel | Notes |
| :--- | :---: | :--- | :--- |
| **Latest (main branch)** | :white_check_mark: | `https://printsign.org` | Actively maintained, zero-cloud runtime |
| **< 1.0.0 (Legacy commits)** | :x: | Archived | Please update to the latest production build |

---

## Reporting a Vulnerability

We treat all security vulnerability reports with the utmost priority and adhere strictly to coordinated vulnerability disclosure best practices.

### How to Report
If you discover a security vulnerability, architectural flaw, or potential information leakage in PrintSign:

1. **GitHub Security Advisory (Recommended):** Submit a private vulnerability disclosure directly through GitHub at [Security Advisories](https://github.com/Ansari-Codes/printsign/security/advisories/new).
2. **Direct Maintainer Contact:** Alternatively, reach out directly via email to **`security@printsign.org`** or contact the lead maintainer [Muhammad Abubakar Siddique Ansari (@Ansari-Codes)](https://github.com/Ansari-Codes).
3. **What to Include in Your Report:**
   - A detailed description of the vulnerability (e.g., memory leak, CSP violation, parser denial-of-service, or metadata sanitization gap).
   - Step-by-step reproduction instructions or a minimal reproducible PDF file.
   - Your assessment of the impact, affected browsers, and suggested mitigation if known.

### Response Timelines & SLA
- **Initial Acknowledgment:** Within **24–48 hours** of submission.
- **Triage & Validation:** Within **3 business days**.
- **Patch & Public Release:** Security advisories and patches are deployed promptly to `main` and published to `https://printsign.org`.
- **Public Disclosure:** Coordinated with the reporter after the fix has been verified and deployed.

---

## Client-Side WebAssembly & Web Worker Sandbox Architecture

PrintSign's threat model eliminates the primary attack vector of traditional PDF editors: **remote server ingestion**. 

```
                                [ Workstation Browser Sandbox ]
                                
[ Local File System ]  ──(FileReader)──>  [ Volatile RAM (Uint8Array) ]
                                                   │
                                                   ▼
                                         [ Web Worker Context ]
                                                   │
                        ┌──────────────────────────┴──────────────────────────┐
                        ▼                                                     ▼
           [ Mozilla PDF.js Engine ]                               [ PDF-Lib Manipulator ]
          • AST Parser & CMAP tables                              • Trailer / Catalog Graph
          • 300 DPI Offscreen Canvas                              • Indirect Object Orphan GC
          • Destructive Pixel Burn-In                             • Stream Deflate / Compression
                        │                                                     │
                        └──────────────────────────┬──────────────────────────┘
                                                   ▼
                                     [ Local Browser Download ]
                                    (0 Network Sockets Dispatched)
```

### 1. Volatile Memory Sandboxing
- **RAM-Only Lifecycle:** Documents read into PrintSign exist exclusively in transient JavaScript typed array buffers (`Uint8Array` / `ArrayBuffer`).
- **Zero Disk Spooling:** The application never writes unencrypted document content to disk, temporary OS scratch space (`/tmp`), or server caches.
- **Generational Garbage Collection:** When a document is closed or the browser tab is refreshed, references to the buffers are cleared and the JavaScript engine's generational garbage collector immediately reclaims the memory.

### 2. Multi-Threaded Worker Isolation
- Heavy computational tasks—including 300 DPI rasterization, text layer extraction, and cross-reference (XRef) table concatenation—execute within dedicated HTML5 Web Workers (`src/workers/`).
- Worker threads operate in an isolated scope with no access to the window DOM, isolating raw document binaries from browser extension interference.

### 3. True Pixel Rasterization vs. Cosmetic Overlays
- **The Vulnerability in Traditional Tools:** Many PDF utilities merely draw black visual rectangle annotations (`/Square` objects or vector path strokes `re f`) over text. The underlying font glyphs, character codes (`Tj`/`TJ`), and search indices remain completely intact, allowing anyone to copy the text (`Ctrl+A` $\rightarrow$ `Ctrl+C`) or extract it with command-line tools.
- **PrintSign's Defensible Approach:** 
  1. The page is rendered to an offscreen canvas at **300 DPI** using Mozilla PDF.js.
  2. Redaction bounding coordinates are destructively overwritten with opaque pixels directly in the canvas pixel buffer.
  3. The rendered raster buffer replaces the original vector content stream completely.
  4. The original `/Contents` streams and unreferenced indirect objects are purged using our **Indirect Object Orphan Garbage Collector**.

### 4. Deep Metadata & XMP Stream Sanitization
- Traditional PDF metadata is split between the trailer `/Info` dictionary and the catalog `/Metadata` Extensible Metadata Platform (XMP) XML packet.
- PrintSign inspects both structures, stripping author identities, computer hostnames, local file paths, editing software versions, and modification timestamps.

---

## 10-Second Independent Verification Protocol (F12 Audit)

Security auditors, compliance officers, and skeptical developers can independently verify our zero-network promise in 10 seconds:

1. Open `https://printsign.org` in Google Chrome, Mozilla Firefox, Microsoft Edge, or Apple Safari.
2. Press **F12** (or right-click $\rightarrow$ **Inspect**) to open Developer Tools.
3. Switch to the **Network** tab and activate the **Fetch/XHR** filter.
4. Drag and drop any sensitive PDF document into the editor. Perform full 300 DPI redaction, metadata scrubbing, or merging, and export the file.
5. **Observation:** The Fetch/XHR log remains **100% empty (0 requests dispatched)**.
6. Alternatively, visit our interactive telemetry audit tool at [`https://printsign.org/f12-network-audit`](https://printsign.org/f12-network-audit) which logs real-time `PerformanceObserver` network entries and runs live in-memory benchmarks.

---

## Content Security Policy (CSP) Level 3

PrintSign enforces a strict Content Security Policy designed to mathematically prevent unauthorized data exfiltration:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self' data:; object-src 'none'; frame-ancestors 'none';
```

- `connect-src 'self'`: Disallows outbound `fetch`, `XMLHttpRequest`, or `WebSocket` connections to external third-party domains.
- `object-src 'none'`: Prevents unsafe Flash, Java, or legacy PDF plugin execution.
- `frame-ancestors 'none'`: Protects users against clickjacking attacks.

---

## Responsible Disclosure & Bug Bounty

PrintSign is a community-driven, privacy-first open-source initiative. While we do not operate a funded commercial bug bounty program, we proudly credit and publicly acknowledge all researchers who responsibly report verified security findings in our repository release notes and contributors list.
