import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

// Dynamic base URL resolution (supports custom domains e.g. '/' or subpaths e.g. '/printsign/')
const rawBase = (process.env.BASE_URL || process.env.VITE_BASE_URL || '/').trim()
const base = rawBase === '/' || rawBase === '' ? '/' : `/${rawBase.replace(/^\/+|\/+$/g, '')}/`

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      base,
      scope: base,
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'PrintSign PDF Editor',
        short_name: 'PDFEditor',
        description: '100% Client-Side, Private, Offline PDF Editor & Redaction Tool',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,wasm,ttf,woff2,png,svg,ico,bcmap,dat}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  worker: {
    format: 'es'
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('pdfjs-dist')) {
              return 'vendor-pdfjs'
            }
            if (id.includes('pdf-lib')) {
              return 'vendor-pdflib'
            }
            if (id.includes('katex')) {
              return 'vendor-katex'
            }
            if (id.includes('lucide-vue-next') || id.includes('@lucide/vue') || id.includes('lucide')) {
              return 'vendor-icons'
            }
            if (
              id.includes('/vue/') ||
              id.includes('\\vue\\') ||
              id.includes('@vue') ||
              id.includes('vue-router') ||
              id.includes('@unhead') ||
              id.includes('pinia')
            ) {
              return 'vendor-framework'
            }
          }
        }
      }
    }
  },
  // SSG (Static Site Generation) Options for unbundled crawlable tool routes
  // @ts-ignore
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    includedRoutes() {
      return [
        '/',
        '/verify-redaction',
        '/f12-network-audit',
        '/for-lawyers',
        '/for-healthcare',
        '/for-journalists',
        '/ilovepdf-smallpdf-offline-alternative',
        '/hipaa-compliant-pdf-redaction',
        '/nist-800-88-pdf-sanitization',
        '/redact-pdf',
        '/scrub-pdf-metadata',
        '/merge-pdf',
        '/split-pdf',
        '/flatten-rasterize-pdf',
        '/reorder-rotate-pdf',
        '/compress-pdf',
        '/sign-pdf',
        '/unlock-decrypt-pdf',
        '/watermark-pdf',
        '/extract-pdf-pages',
        '/gdpr-article-32-pdf-compliance',
        '/foia-document-redaction-tool',
        '/for-finance-accounting',
        '/sitemap',
        '/editor',
        '/faq',
        '/blog',
        '/guides',
        '/features',
        '/about-us',
        '/contact-us',
        '/security-architecture',
        '/privacy-policy',
        '/terms-of-service',
        '/cookie-policy',
        '/general-editor'
      ]
    }
  },
  // @ts-ignore
  test: {
    include: ['tests/unit/**/*.{test,spec}.ts']
  }
})
