# Demo Script: PrintSign PDF Editor

This demo script provides step-by-step instructions to showcase the core capabilities of the 100% Client-Side PDF Editor.

---

## Preparation
1. Run `npm run dev` and navigate to `http://localhost:5173`.
2. Notice the persistent green badge at top: **"100% Client-Side — Your documents never leave this device"**.
3. Click **"Security & Architecture"** on the banner to view the privacy explanation modal detailing local memory execution, no telemetry, and offline PWA caching.

---

## Step 1: Document Loading & Virtualized View
1. Drag and drop any PDF file (or synthetic test fixture) onto the viewport, or click **"Choose PDF File"**.
2. Notice the document immediately renders without any network traffic.
3. Switch between **"Continuous"** and **"Single Page"** view modes on the status bar.
4. Test zoom: click **"Fit Width"**, **"Fit Page"**, or use the `+` / `-` buttons.
5. In the thumbnail sidebar, drag a page thumbnail to reorder pages. Notice the page index numbers update seamlessly.

---

## Step 2: Page Manipulations & Undo/Redo
1. Select a page in the sidebar and press `R` or click the rotate button. The page rotates 90° clockwise.
2. Click **"Blank Page"** in the sidebar to insert a new blank page.
3. Click the **Duplicate** button to clone a page.
4. Press `Ctrl + Z` (or the top Undo button) twice. Notice how each structural change cleanly reverts in real time!
5. Press `Ctrl + Shift + Z` (or Redo) to restore the change.

---

## Step 3: Search & True Redaction Workspace
1. Click **"Redaction"** in the top navigation bar.
2. In the Redaction workspace on the right, type a sensitive term into **"Search & Batch Redact"** (e.g., a name, account number, or test secret `CANARY_SECRET_ALPHA_987654`) and press Enter.
3. The app finds all occurrences and calculates bounding boxes across pages.
4. Click **"Add as Redactions"**.
5. Alternatively, click and drag directly on the canvas to draw a custom redaction box over any text.
6. Toggle between **"Solid Black Box"** and **"REDACTED" Text** overlay styles.
7. Click **"Apply Redactions"** and confirm in the safety modal.
8. Watch the pipeline execute:
   - High-DPI canvas render
   - Pixel buffer burn-in
   - Page replacement in `pdf-lib`
   - Orphan indirect object garbage collection
   - Automated verification check
9. The **Verification Modal** pops up with:
   - **Text Extraction: 100% Clean (0 Matches)**
   - **Raw Binary Byte Scan: 100% Clean (0 Bytes Found)**
   - **Orphan Object GC: Objects Purged Count**

---

## Step 4: Metadata Editing & Scrubbing
1. Click **"Metadata"** in the top navigation bar.
2. Inspect the PDF properties, format version, and existing Info dictionary fields (Title, Author, Subject, Keywords).
3. Click **"Scrub All"** to immediately erase all identifying metadata, author stamps, creation dates, and XMP packets.
4. Click **"Save Metadata Changes"**.

---

## Step 5: Rasterization & Flattened Export
1. Click **"Rasterize"** in the top navigation bar.
2. Change DPI to 300; notice the live canvas dimension preview recalculates in real-time.
3. Click **"Export Images (.ZIP)"** to generate and download client-side compressed page images.
4. Click **"Flatten to Image-Only PDF"** to produce a secure, vector-free PDF.

---

## Step 6: Split & Merge
1. Click **"Split"** in the header. Enter a range (e.g. `1-1, 2-2`) and download the generated parts as a client-side ZIP.
2. Click **"Merge"** to append another local PDF file.

---

## Step 7: Offline PWA Verification
1. Disconnect your Wi-Fi or set browser to Offline in DevTools (`Network` -> `Offline`).
2. Reload the page at `http://localhost:5173`.
3. The app loads instantly and works 100% offline!
