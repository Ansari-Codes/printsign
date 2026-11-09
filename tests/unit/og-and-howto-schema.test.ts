import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { seoMetadata } from '../../src/config/seoMetadata.js'

describe('OpenGraph Banners and Structured Data Schemas', () => {
  const rootDir = path.resolve(__dirname, '../..')
  const ogDir = path.resolve(rootDir, 'public/images/og')

  const expectedOgRoutes = [
    { route: '/', filename: 'home.png' },
    { route: '/redact-pdf', filename: 'redact-pdf.png' },
    { route: '/verify-redaction', filename: 'verify-redaction.png' },
    { route: '/scrub-pdf-metadata', filename: 'scrub-pdf-metadata.png' },
    { route: '/merge-pdf', filename: 'merge-pdf.png' },
    { route: '/split-pdf', filename: 'split-pdf.png' },
    { route: '/flatten-rasterize-pdf', filename: 'flatten-rasterize-pdf.png' },
    { route: '/reorder-rotate-pdf', filename: 'reorder-rotate-pdf.png' },
    { route: '/compress-pdf', filename: 'compress-pdf.png' },
    { route: '/f12-network-audit', filename: 'f12-network-audit.png' },
    { route: '/ilovepdf-smallpdf-offline-alternative', filename: 'ilovepdf-smallpdf-offline-alternative.png' },
    { route: '/hipaa-compliant-pdf-redaction', filename: 'hipaa-compliant-pdf-redaction.png' },
    { route: '/nist-800-88-pdf-sanitization', filename: 'nist-800-88-pdf-sanitization.png' }
  ]

  it('contains all 13 high-contrast 1200x630 OpenGraph PNG banners in public/images/og/', () => {
    expect(fs.existsSync(ogDir)).toBe(true)
    for (const item of expectedOgRoutes) {
      const filePath = path.join(ogDir, item.filename)
      expect(fs.existsSync(filePath), `Missing OG image: ${item.filename}`).toBe(true)
      const stat = fs.statSync(filePath)
      expect(stat.size).toBeGreaterThan(1000) // Ensure not an empty file
    }
  })

  it('assigns ogImage and ogImageAlt to all 13 core tool and compliance routes in seoMetadata', () => {
    for (const item of expectedOgRoutes) {
      const meta = seoMetadata[item.route]
      expect(meta, `Missing route ${item.route} in seoMetadata`).toBeDefined()
      expect(meta.ogImage, `Missing ogImage on ${item.route}`).toBe(`https://printsign.org/images/og/${item.filename}`)
      expect(meta.ogImageAlt, `Missing ogImageAlt on ${item.route}`).toBeDefined()
    }
  })

  const transactionalTools = [
    '/redact-pdf',
    '/verify-redaction',
    '/scrub-pdf-metadata',
    '/merge-pdf',
    '/split-pdf',
    '/flatten-rasterize-pdf',
    '/reorder-rotate-pdf',
    '/compress-pdf'
  ]

  it('injects Schema.org HowTo structured data with HowToStep on all transactional tool routes', () => {
    for (const route of transactionalTools) {
      const meta = seoMetadata[route]
      expect(meta.schema).toBeDefined()
      const graph = (meta.schema as any)['@graph'] as any[]
      expect(Array.isArray(graph), `Expected @graph array on ${route}`).toBe(true)

      const howTo = graph.find(node => node['@type'] === 'HowTo')
      expect(howTo, `Missing HowTo schema on ${route}`).toBeDefined()
      expect(howTo.totalTime).toBe('PT1M')
      expect(Array.isArray(howTo.tool)).toBe(true)
      expect(Array.isArray(howTo.step)).toBe(true)
      expect(howTo.step.length).toBeGreaterThanOrEqual(3)

      for (const step of howTo.step) {
        expect(step['@type']).toBe('HowToStep')
        expect(step.name).toBeTruthy()
        expect(step.text).toBeTruthy()
      }
    }
  })

  const sourceCodeRoutes = ['/', '/f12-network-audit', '/security-architecture']

  it('injects Schema.org SoftwareSourceCode structured data on code/audit/security routes', () => {
    for (const route of sourceCodeRoutes) {
      const meta = seoMetadata[route]
      expect(meta.schema).toBeDefined()
      const graph = (meta.schema as any)['@graph'] as any[]
      expect(Array.isArray(graph), `Expected @graph array on ${route}`).toBe(true)

      const codeNode = graph.find(node => node['@type'] === 'SoftwareSourceCode')
      expect(codeNode, `Missing SoftwareSourceCode node on ${route}`).toBeDefined()
      expect(codeNode.codeRepository).toBe('https://github.com/Ansari-Codes/printsign')
      expect(codeNode.license).toBe('https://opensource.org/licenses/MIT')
      expect(codeNode.programmingLanguage).toContain('WebAssembly')
    }
  })

  it('validates ToolTrustBar component exists for visual breadcrumb and trust signaling', () => {
    const trustBarPath = path.resolve(rootDir, 'src/components/common/ToolTrustBar.vue')
    expect(fs.existsSync(trustBarPath)).toBe(true)
    const content = fs.readFileSync(trustBarPath, 'utf8')
    expect(content).toContain('WebAssembly RAM')
    expect(content).toContain('/f12-network-audit')
  })
})
