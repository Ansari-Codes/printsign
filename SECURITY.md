# Security Architecture & Redaction Verification Model

This document specifies the threat model, privacy guarantees, redaction verification methodology, and residual risks for the **100% Client-Side PrintSign PDF Editor**.

---

## 1. Core Security & Privacy Philosophy

1. **Zero Exfiltration:** The application contains **zero server components, zero serverless functions, and zero runtime network dependencies**.
2. **Local Memory Isolation:** Files remain exclusively within browser RAM and private local storage (`IndexedDB`).
3. **No Third-Party Telemetry:** No analytics scripts, remote fonts, error loggers, or CDN script tags are bundled or invoked.
4. **Deterministic Client-Side Cryptographic/Sanitization Guarantees:** Verification is performed locally before and after any state transformation.

---

## 2. The Critical Distinction: True Redaction vs. "Fake Redaction"

### What Many PDF Tools Do Wrong (Fake Redaction)
In typical naive implementations or basic annotation viewers, "redaction" merely draws a black rectangle (`re` operator with `f` fill) over a visual area of the page.
- **The Vulnerability:** The underlying content stream still contains the character codes, font encodings, and layout coordinates (`Tj` or `TJ` operators).
- **The Risk:** Anyone opening the PDF can:
  1. Highlight and copy the text hidden beneath the black rectangle.
  2. Search for the text using standard PDF search tools.
  3. Extract the text using command-line utilities like `pdftotext`.
  4. Inspect the raw bytes in a hex editor and read the literal confidential strings.

### Our V1 Implementation: Rasterize-Burn-and-Rebuild + Orphan Object GC
To guarantee complete and irreversible removal of confidential information:

1. **High-DPI Rendering:** Mozilla's `pdfjs-dist` renders the target page to an offscreen pixel canvas at 200 DPI (scaling coordinates with mobile safeguards).
2. **Burn-In:** Solid black rectangles or specified redaction overlays are drawn directly into the raw pixel buffer (`CanvasRenderingContext2D`).
3. **Re-Encoding & Page Insertion:** The canvas is encoded as an image (JPEG) and embedded via `pdf-lib` as a fresh page with matching dimensions.
4. **Original Page Unlinking:** The original page dictionary is severed from the PDF `/Pages` tree `/Kids` array.
5. **Stream Annihilation:** The original page dictionary's `/Contents` stream, resource references, and annotation widgets are detached.
6. **Orphan Indirect Object Garbage Collection (GC):**
   - The GC traverses the indirect object graph starting from the Trailer and Catalog roots (`trailerInfo.Root`, `trailerInfo.Info`, `catalog`).
   - All reachable indirect objects are marked.
   - Any indirect object **not** reachable (including the old unreferenced content stream holding the confidential text) is purged from `doc.context`.
   - When the PDF is saved, unreferenced objects are omitted from the binary.

---

## 3. Mandatory Automated Verification Pipeline

Every redaction execution triggers an automated two-stage audit:

### Test 3a: Extraction Absence (PDF.js Text Layer)
The output PDF bytes are re-parsed by `pdfjs-dist`. All text across all pages is extracted and evaluated. The test asserts that redacted strings are **100% absent** from the document's text stream.

### Test 3b: Raw Binary Byte Scan
The exported `Uint8Array` binary is scanned byte-by-byte using sliding window pattern matching for literal ASCII, UTF-8, and decompressed stream byte sequences of the redacted terms. The test asserts that no literal byte representation exists in the file.

### Test 3c: Negative Control Test
The test suite includes a strict negative control:
- A synthetic PDF is created with a canary token.
- A "fake redaction" (drawing a black box only, with no page replacement and no GC) is applied.
- The test asserts that the canary **is still byte-present** in the output, proving that the verification harness reliably detects redaction failures.

---

## 4. Digital Signatures & Encryption Model

- **Digital Signatures:** Any structural edit to a PDF (rotating, inserting pages, or redacting) breaks cryptographic signature digests. The application detects signature widgets (`/FT /Sig`) upon loading and alerts the user immediately.
- **Password-Protected PDFs:** Encrypted PDFs are detected upon loading. The user is prompted for the password, which is passed in memory to `pdfjsLib.getDocument`. The password is never saved or transmitted.
- **Export Encryption Scope:** To avoid false senses of security, output password encryption is omitted from V1 because third-party JS encryption shims often fail on compressed object streams or modern AES-256 standards.

---

## 5. Residual Risks & Best Practices

| Residual Risk | Description | Recommended User Action |
| :--- | :--- | :--- |
| **OCR Recovery** | If a redaction box only covers part of a word or character, OCR could guess the missing letters. | Ensure redaction boxes provide at least 2-4 points of margin padding beyond text glyphs. |
| **Page Rasterization Trade-off** | Redacted pages become high-fidelity image pages; text on those pages is no longer selectable. | Keep original copies if selectable text on non-sensitive parts of the same page is required, or use the Metadata scrubber for document-wide property sanitization. |
| **Browser Extensions** | Malicious third-party browser extensions could inspect DOM or canvas memory. | For ultra-sensitive legal/government documents, open the application in a clean browser profile or incognito window with extensions disabled. |
