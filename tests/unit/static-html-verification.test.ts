import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('Strict Static HTML & Privacy Cleanliness Verification', () => {
  const distDir = path.resolve(process.cwd(), 'dist')
  const rootIndexHtml = path.resolve(process.cwd(), 'index.html')
  const prohibitedTrackers = /googletagmanager|google-analytics|gtag\(|adsbygoogle|preconnect.*(?:googletagmanager|google-analytics|doubleclick)/i

  it('ensures zero occurrences of ADVERTISEMENT or AdSense in src components and views', () => {
    function walk(dir: string): string[] {
      let results: string[] = []
      const list = fs.readdirSync(dir)
      list.forEach(file => {
        const full = path.join(dir, file)
        const stat = fs.statSync(full)
        if (stat && stat.isDirectory()) {
          results = results.concat(walk(full))
        } else if (/\.(vue|ts|js)$/.test(file)) {
          results.push(full)
        }
      })
      return results
    }

    const srcFiles = walk(path.resolve(process.cwd(), 'src'))
    const violatingFiles: string[] = []

    srcFiles.forEach(f => {
      const content = fs.readFileSync(f, 'utf8')
      if (/advertisement|adsense/i.test(content)) {
        violatingFiles.push(path.relative(process.cwd(), f))
      }
    })

    expect(violatingFiles).toEqual([])
  })

  it('ensures zero third-party tracking scripts, preconnects, or telemetry in root index.html', () => {
    expect(fs.existsSync(rootIndexHtml)).toBe(true)
    const content = fs.readFileSync(rootIndexHtml, 'utf8')
    expect(content).not.toMatch(prohibitedTrackers)
  })

  it('ensures zero legacy printsign.org/editor links in blog tutorials', () => {
    const blogsPath = path.resolve(process.cwd(), 'src/data/blogs.ts')
    const blogsContent = fs.readFileSync(blogsPath, 'utf8')
    const matches = blogsContent.match(/printsign\.org\/editor/g) || []
    expect(matches.length).toBe(0)
  })

  it('asserts dist/ HTML files contain zero ADVERTISEMENT/AdSense/trackers and have unique titles & canonicals', () => {
    const targetFiles = [
      'f12-network-audit/index.html',
      'for-lawyers/index.html',
      'for-healthcare/index.html',
      'for-journalists/index.html',
      'contact-us/index.html',
      'blog/compress-pdf-file-size-without-losing-quality/index.html',
      'blog/how-to-permanently-redact-pdf-court-compliant/index.html'
    ]

    const titles = new Set<string>()
    const canonicals = new Set<string>()

    for (const relPath of targetFiles) {
      const fullPath = path.resolve(distDir, relPath)
      expect(fs.existsSync(fullPath)).toBe(true)

      const html = fs.readFileSync(fullPath, 'utf8')

      // Assert zero occurrences of ADVERTISEMENT or AdSense
      expect(html).not.toMatch(/ADVERTISEMENT|AdSense/i)

      // Assert zero tracking scripts or preconnects
      expect(html).not.toMatch(prohibitedTrackers)

      // Assert unique title
      const titleMatch = html.match(/<title>(.*?)<\/title>/i)
      expect(titleMatch).toBeTruthy()
      const title = titleMatch![1].trim()
      expect(title.length).toBeGreaterThan(5)
      expect(titles.has(title)).toBe(false)
      titles.add(title)

      // Assert unique canonical
      const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']\s*\/?>/i)
      expect(canonicalMatch).toBeTruthy()
      const canonical = canonicalMatch![1].trim()
      expect(canonical.startsWith('https://printsign.org/')).toBe(true)
      expect(canonicals.has(canonical)).toBe(false)
      canonicals.add(canonical)

      // Assert valid H1
      const h1Match = html.match(/<h1>(.*?)<\/h1>/i)
      expect(h1Match).toBeTruthy()
      expect(h1Match![1].trim().length).toBeGreaterThan(0)
    }
  })

  it('asserts math blog pre-renders KaTeX DOM and MathML correctly', () => {
    const mathBlogPath = path.resolve(distDir, 'blog/how-to-permanently-redact-pdf-court-compliant/index.html')
    if (fs.existsSync(mathBlogPath)) {
      const html = fs.readFileSync(mathBlogPath, 'utf8')
      expect(html).toContain('katex-rendered')
      expect(html).toContain('class="katex"')
      expect(html).toContain('<math xmlns="http://www.w3.org/1998/Math/MathML"')
    }
  })
})
