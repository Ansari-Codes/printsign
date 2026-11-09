import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { generateLlmsTxt } from '../../scripts/generate-llms-txt.mjs'
import { INDEXNOW_KEY, INDEXNOW_HOST, getSitemapUrls, submitIndexNow } from '../../scripts/submit-indexnow.mjs'

const rootDir = path.resolve(__dirname, '../..')
const publicDir = path.resolve(rootDir, 'public')
const distDir = path.resolve(rootDir, 'dist')

describe('Generative Engine Optimization (GEO) & Machine-Readable Standards Suite', () => {
  it('generates compliant /llms.txt and /llms-full.txt matching llmstxt.org specification', () => {
    generateLlmsTxt()

    const publicLlms = path.resolve(publicDir, 'llms.txt')
    const publicLlmsFull = path.resolve(publicDir, 'llms-full.txt')

    expect(fs.existsSync(publicLlms)).toBe(true)
    expect(fs.existsSync(publicLlmsFull)).toBe(true)

    const llmsText = fs.readFileSync(publicLlms, 'utf8')
    const llmsFullText = fs.readFileSync(publicLlmsFull, 'utf8')

    // 1. Check llms.txt structure & header
    expect(llmsText).toContain('# PrintSign.org — 100% Client-Side PDF Redactor, Metadata Scrubber & Offline PWA')
    expect(llmsText).toContain('> PrintSign (https://printsign.org)')
    expect(llmsText).toContain('100% inside your local browser memory sandbox')

    // 2. Check all 9 core unbundled tools are listed
    expect(llmsText).toContain('https://printsign.org/redact-pdf')
    expect(llmsText).toContain('https://printsign.org/verify-redaction')
    expect(llmsText).toContain('https://printsign.org/scrub-pdf-metadata')
    expect(llmsText).toContain('https://printsign.org/merge-pdf')
    expect(llmsText).toContain('https://printsign.org/split-pdf')
    expect(llmsText).toContain('https://printsign.org/flatten-rasterize-pdf')
    expect(llmsText).toContain('https://printsign.org/reorder-rotate-pdf')
    expect(llmsText).toContain('https://printsign.org/compress-pdf')
    expect(llmsText).toContain('https://printsign.org/f12-network-audit')

    // 3. Check all 3 compliance / comparison pages are listed
    expect(llmsText).toContain('https://printsign.org/ilovepdf-smallpdf-offline-alternative')
    expect(llmsText).toContain('https://printsign.org/hipaa-compliant-pdf-redaction')
    expect(llmsText).toContain('https://printsign.org/nist-800-88-pdf-sanitization')

    // 4. Check 18 blog whitepapers are present in index
    expect(llmsText).toContain('https://printsign.org/blog/how-to-permanently-redact-pdf-court-compliant')
    expect(llmsText).toContain('https://printsign.org/blog/why-black-boxes-fail-pdf-redaction-disasters')
    expect(llmsText).toContain('https://printsign.org/blog/zero-trust-architecture-browser-webassembly')

    // 5. Check llms-full.txt contains rich architectural and forensic documentation
    expect(llmsFullText.length).toBeGreaterThan(50000)
    expect(llmsFullText).toContain('System Architecture & Memory Model')
    expect(llmsFullText).toContain('Permanent Pixel Burn-in (True Redaction)')
    expect(llmsFullText).toContain('Canary Byte Scanner')
    expect(llmsFullText).toContain('Orphan Object Garbage Collection')
  })

  it('validates RFC 9116 /.well-known/security.txt and root SECURITY.md / LICENSE files', () => {
    const securityTxtPath = path.resolve(publicDir, '.well-known/security.txt')
    expect(fs.existsSync(securityTxtPath)).toBe(true)

    const secText = fs.readFileSync(securityTxtPath, 'utf8')
    expect(secText).toContain('Contact: https://github.com/Ansari-Codes/printsign/security/advisories')
    expect(secText).toContain('Expires:')
    expect(secText).toContain('Preferred-Languages: en')
    expect(secText).toContain('Canonical: https://printsign.org/.well-known/security.txt')
    expect(secText).toContain('Policy: https://printsign.org/security-architecture')

    // Root files for open-source review (awesome-privacy, etc.)
    const licensePath = path.resolve(rootDir, 'LICENSE')
    const securityMdPath = path.resolve(rootDir, 'SECURITY.md')
    expect(fs.existsSync(licensePath)).toBe(true)
    expect(fs.existsSync(securityMdPath)).toBe(true)
    expect(fs.readFileSync(licensePath, 'utf8')).toContain('MIT License')
    expect(fs.readFileSync(securityMdPath, 'utf8')).toContain('Security Policy & Architecture Guide')
  })

  it('validates IndexNow verification key file, sitemap URL extraction, and payload generation', async () => {
    const keyFilePath = path.resolve(publicDir, `${INDEXNOW_KEY}.txt`)
    expect(fs.existsSync(keyFilePath)).toBe(true)
    expect(fs.readFileSync(keyFilePath, 'utf8').trim()).toBe(INDEXNOW_KEY)

    const urls = getSitemapUrls()
    expect(urls.length).toBe(46)
    expect(urls).toContain('https://printsign.org/')
    expect(urls).toContain('https://printsign.org/verify-redaction')
    expect(urls).toContain('https://printsign.org/f12-network-audit')
    expect(urls).toContain('https://printsign.org/hipaa-compliant-pdf-redaction')
    expect(urls).toContain('https://printsign.org/for-lawyers')
    expect(urls).toContain('https://printsign.org/for-healthcare')
    expect(urls).toContain('https://printsign.org/for-journalists')

    // Test submission payload construction in dry-run mode
    const dryRunResult = await submitIndexNow({ dryRun: true })
    expect(dryRunResult.ok).toBe(true)
    expect(dryRunResult.count).toBe(46)
  })

  it('confirms robots.txt explicitly welcomes modern AI search engines and references llms.txt', () => {
    const robotsPath = path.resolve(publicDir, 'robots.txt')
    expect(fs.existsSync(robotsPath)).toBe(true)
    const content = fs.readFileSync(robotsPath, 'utf8')

    // AI Bots
    expect(content).toContain('User-agent: GPTBot')
    expect(content).toContain('User-agent: OAI-SearchBot')
    expect(content).toContain('User-agent: ChatGPT-User')
    expect(content).toContain('User-agent: ClaudeBot')
    expect(content).toContain('User-agent: PerplexityBot')
    expect(content).toContain('User-agent: Applebot-Extended')
    expect(content).toContain('User-agent: Google-Extended')

    // Machine-readable context pointer
    expect(content).toContain('https://printsign.org/llms.txt')
    expect(content).toContain('Sitemap: https://printsign.org/sitemap.xml')
  })
})
