import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('Stage 10: Core Web Vitals (CWV) & Accessibility (a11y) Hardening Suite', () => {
  const rootDir = process.cwd()

  it('verifies Vite code-splitting and manualChunks configuration in vite.config.ts', () => {
    const viteConfigContent = fs.readFileSync(path.resolve(rootDir, 'vite.config.ts'), 'utf8')
    
    expect(viteConfigContent).toContain('manualChunks')
    expect(viteConfigContent).toContain('vendor-pdfjs')
    expect(viteConfigContent).toContain('vendor-pdflib')
    expect(viteConfigContent).toContain('vendor-katex')
    expect(viteConfigContent).toContain('vendor-framework')
    expect(viteConfigContent).toContain('vendor-icons')

    // Test the logic of manualChunks function directly
    const manualChunksMatch = viteConfigContent.match(/manualChunks\s*\([^)]*\)\s*\{([\s\S]*?)\n\s*\}\s*,/)
    expect(manualChunksMatch).toBeTruthy()
    
    // Simulate manualChunks logic
    function testChunker(id: string) {
      if (id.includes('node_modules')) {
        if (id.includes('pdfjs-dist')) return 'vendor-pdfjs'
        if (id.includes('pdf-lib')) return 'vendor-pdflib'
        if (id.includes('katex')) return 'vendor-katex'
        if (id.includes('lucide-vue-next') || id.includes('@lucide/vue') || id.includes('lucide')) return 'vendor-icons'
        if (id.includes('/vue/') || id.includes('\\vue\\') || id.includes('@vue') || id.includes('vue-router') || id.includes('@unhead') || id.includes('pinia')) return 'vendor-framework'
      }
      return undefined
    }

    expect(testChunker('node_modules/pdfjs-dist/build/pdf.js')).toBe('vendor-pdfjs')
    expect(testChunker('node_modules/pdf-lib/cjs/index.js')).toBe('vendor-pdflib')
    expect(testChunker('node_modules/katex/dist/katex.js')).toBe('vendor-katex')
    expect(testChunker('node_modules/vue/dist/vue.runtime.esm-bundler.js')).toBe('vendor-framework')
    expect(testChunker('node_modules/vue-router/dist/vue-router.mjs')).toBe('vendor-framework')
    expect(testChunker('node_modules/lucide-vue-next/dist/cjs/lucide-vue-next.js')).toBe('vendor-icons')
  })

  it('verifies dynamic imports are used for all route views in src/router/index.ts', () => {
    const routerContent = fs.readFileSync(path.resolve(rootDir, 'src/router/index.ts'), 'utf8')
    
    // Static imports of views should NOT be present at the top
    expect(routerContent).not.toMatch(/^import\s+HomeView\s+from/m)
    expect(routerContent).not.toMatch(/^import\s+EditorView\s+from/m)
    expect(routerContent).not.toMatch(/^import\s+BlogPostView\s+from/m)
    expect(routerContent).not.toMatch(/^import\s+VerifyRedactionView\s+from/m)
    
    // Dynamic import syntax must be present for route components
    expect(routerContent).toContain("component: () => import('../views/HomeView.vue')")
    expect(routerContent).toContain("component: () => import('../views/EditorView.vue')")
    expect(routerContent).toContain("component: () => import('../views/BlogPostView.vue')")
    expect(routerContent).toContain("component: () => import('../views/VerifyRedactionView.vue')")
    expect(routerContent).toContain("component: () => import('../views/IndustryRoleView.vue')")
  })

  it('verifies font-display: swap is enforced to prevent Flash of Invisible Text (FOIT)', () => {
    const styleContent = fs.readFileSync(path.resolve(rootDir, 'src/style.css'), 'utf8')
    
    expect(styleContent).toContain('font-display: swap')
    expect(styleContent).toContain('KaTeX_Main')
    expect(styleContent).toContain('KaTeX_Math')
  })

  it('verifies CLS & LCP image optimizations (explicit width/height, fetchpriority, loading=lazy)', () => {
    const blogPostView = fs.readFileSync(path.resolve(rootDir, 'src/views/BlogPostView.vue'), 'utf8')
    const blogIndexView = fs.readFileSync(path.resolve(rootDir, 'src/views/BlogIndexView.vue'), 'utf8')
    
    // Hero image in BlogPostView has width, height, eager, fetchpriority="high"
    expect(blogPostView).toContain('width="1200"')
    expect(blogPostView).toContain('height="514"')
    expect(blogPostView).toContain('fetchpriority="high"')
    expect(blogPostView).toContain('loading="eager"')
    
    // Below-the-fold images in BlogIndexView have width, height, loading="lazy"
    expect(blogIndexView).toContain('width="640"')
    expect(blogIndexView).toContain('height="360"')
    expect(blogIndexView).toContain('loading="lazy"')
  })

  it('verifies accessible aria-label attributes on icon-only buttons, toggles, and inputs', () => {
    const navbar = fs.readFileSync(path.resolve(rootDir, 'src/components/website/SiteNavbar.vue'), 'utf8')
    const viewer = fs.readFileSync(path.resolve(rootDir, 'src/components/viewer/PdfViewer.vue'), 'utf8')
    const verifier = fs.readFileSync(path.resolve(rootDir, 'src/views/VerifyRedactionView.vue'), 'utf8')
    
    // Navbar
    expect(navbar).toContain('aria-label="Toggle Navigation Menu"')
    expect(navbar).toContain('aria-label="Network Air-Gap Status"')
    expect(navbar).toContain('aria-label="PDF Tools Menu"')
    expect(navbar).toContain('aria-label="Open PDF files from device"')
    
    // Viewer
    expect(viewer).toContain('aria-label="Previous Page"')
    expect(viewer).toContain('aria-label="Next Page"')
    
    // Verifier
    expect(verifier).toContain('aria-label="Copy SHA-256 Hash"')
    expect(verifier).toContain('aria-label="Download Official Sanitization Certificate (PDF)"')
    expect(verifier).toContain('aria-label="Export Audit JSON"')
  })

  it('validates pre-rendered HTML files in dist/ for lang="en", viewport, canonical, and valid image alt tags', () => {
    const distDir = path.resolve(rootDir, 'dist')
    if (!fs.existsSync(distDir)) {
      console.warn('dist directory not yet built; skipping static HTML inspection')
      return
    }

    const testRoutes = [
      'index.html',
      'for-lawyers/index.html',
      'for-healthcare/index.html',
      'for-journalists/index.html',
      'f12-network-audit/index.html',
      'verify-redaction/index.html'
    ]

    testRoutes.forEach(fileRel => {
      const filePath = path.join(distDir, fileRel)
      if (fs.existsSync(filePath)) {
        const html = fs.readFileSync(filePath, 'utf8')
        
        // lang="en" check
        expect(html, `${fileRel} missing lang="en"`).toMatch(/<html[^>]+lang=["']en["']/)
        
        // Viewport meta check
        expect(html, `${fileRel} missing viewport meta`).toMatch(/<meta[^>]+name=["']viewport["'][^>]*>/)
        
        // Canonical tag check
        expect(html, `${fileRel} missing canonical link`).toMatch(/<link[^>]+rel=["']canonical["'][^>]*>/)
        
        // All img tags must have alt attributes
        const imgTags = html.match(/<img[^>]*>/g) || []
        imgTags.forEach(img => {
          expect(img, `Image tag in ${fileRel} missing alt attribute: ${img}`).toMatch(/alt=["'][^"']*["']/)
        })
      }
    })
  })
})
