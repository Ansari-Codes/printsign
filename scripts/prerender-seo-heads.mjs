import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { seoMetadata } from '../src/config/seoMetadata.js'
import { toolSeoContent } from '../src/config/seoContent.js'
import { generateSitemap } from './generate-sitemap.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const distDir = path.resolve(rootDir, 'dist')
const distIndexHtml = path.resolve(distDir, 'index.html')

function escapeAttr(str) {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function loadBlogPosts() {
  const blogsPath = path.resolve(rootDir, 'src/data/blogs.ts')
  if (!fs.existsSync(blogsPath)) {
    console.warn('[prerender] src/data/blogs.ts not found.')
    return []
  }
  const raw = fs.readFileSync(blogsPath, 'utf8')
  const decl = raw.indexOf('export const blogs')
  if (decl === -1) return []
  const eq = raw.indexOf('=', decl)
  const start = raw.indexOf('[', eq)
  const catIdx = raw.indexOf('export function getBlogPostBySlug')
  const blogsPart = catIdx !== -1 ? raw.substring(0, catIdx) : raw
  const end = blogsPart.lastIndexOf(']')
  const jsonText = blogsPart.substring(start, end + 1)
  try {
    return JSON.parse(jsonText)
  } catch (err) {
    console.warn('[prerender] Failed to parse blogs.ts JSON:', err.message)
    return []
  }
}

function generateSemanticBody(routePath, seo) {
  const content = toolSeoContent[routePath]

  if (!content) {
    // For non-tool routes (homepage, blog, etc.), render clean semantic header & description
    return `<div id="app">
    <header class="sr-only">
      <h1>${escapeAttr(seo.h1 || seo.title)}</h1>
      <p>${escapeAttr(seo.description)}</p>
    </header>
  </div>`
  }

  const highlightsHtml = content.highlights
    .map(
      h => `        <div class="highlight-card">
          <h3>${escapeAttr(h.title)}</h3>
          <p>${escapeAttr(h.desc)}</p>
        </div>`
    )
    .join('\n')

  const sectionsHtml = content.sections
    .map(sec => {
      const pTags = sec.paragraphs.map(p => `        <p>${escapeAttr(p)}</p>`).join('\n')
      const bTags =
        sec.bullets && sec.bullets.length > 0
          ? `        <ul>\n${sec.bullets.map(b => `          <li><strong>${escapeAttr(b.split(':')[0] || b)}:</strong> ${escapeAttr(b.split(':').slice(1).join(':') || '')}</li>`).join('\n')}\n        </ul>`
          : ''
      return `      <article>
        <h3>${escapeAttr(sec.title)}</h3>
${pTags}
${bTags}
      </article>`
    })
    .join('\n\n')

  const faqHtml =
    content.faq && content.faq.length > 0
      ? `      <section class="faq-section">
        <h3>Frequently Asked Questions</h3>
${content.faq
  .map(
    f => `        <div class="faq-item">
          <h4>${escapeAttr(f.q)}</h4>
          <p>${escapeAttr(f.a)}</p>
        </div>`
  )
  .join('\n')}
      </section>`
      : ''

  return `<div id="app">
    <header>
      <h1>${escapeAttr(seo.h1 || seo.title)}</h1>
      <p class="tool-lead">${escapeAttr(seo.description)}</p>
    </header>
    <main>
      <section class="seo-content" aria-label="Technical Specifications & Document Security Information">
        <div class="badge">${escapeAttr(content.badge)}</div>
        <h2>${escapeAttr(content.heading)}</h2>
        <p class="subheading">${escapeAttr(content.subheading)}</p>
        <div class="highlights-grid">
${highlightsHtml}
        </div>
        <div class="long-form-sections">
${sectionsHtml}
        </div>
${faqHtml}
      </section>
    </main>
  </div>`
}

function prerenderRoute(template, routePath, seo) {
  const canonicalUrl = `https://printsign.org${routePath === '/' ? '/' : routePath}`
  let html = template

  // Replace <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttr(seo.title)}</title>`)

  // Replace <meta name="title" ...>
  html = html.replace(
    /<meta\s+name=["']title["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="title" content="${escapeAttr(seo.title)}" />`
  )

  // Replace <meta name="description" ...>
  html = html.replace(
    /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="description" content="${escapeAttr(seo.description)}" />`
  )

  // Replace <link rel="canonical" ...>
  html = html.replace(
    /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i,
    `<link rel="canonical" href="${canonicalUrl}" />`
  )

  // Replace OpenGraph
  html = html.replace(
    /<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:title" content="${escapeAttr(seo.title)}" />`
  )
  html = html.replace(
    /<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:description" content="${escapeAttr(seo.description)}" />`
  )
  html = html.replace(
    /<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:url" content="${canonicalUrl}" />`
  )
  html = html.replace(
    /<meta\s+property=["']og:type["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:type" content="${seo.ogType || 'website'}" />`
  )

  // Replace Twitter
  html = html.replace(
    /<meta\s+property=["']twitter:title["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="twitter:title" content="${escapeAttr(seo.title)}" />`
  )
  html = html.replace(
    /<meta\s+property=["']twitter:description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="twitter:description" content="${escapeAttr(seo.description)}" />`
  )

  // Replace JSON-LD schema
  if (seo.schema) {
    const jsonLdString = JSON.stringify(seo.schema, null, 2)
    const scriptReplacement = `<script type="application/ld+json">\n${jsonLdString}\n    </script>`
    if (/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i.test(html)) {
      html = html.replace(
        /<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i,
        scriptReplacement
      )
    } else {
      html = html.replace('</head>', `    ${scriptReplacement}\n  </head>`)
    }
  }

  // Inject crawlable semantic body into <div id="app"></div>
  const semanticBody = generateSemanticBody(routePath, seo)
  html = html.replace(/<div id=["']app["']>[\s\S]*?<\/div>/i, semanticBody)

  return html
}

async function main() {
  console.log('\n--- PrintSign SEO Pre-rendering & SSG Engine ---')
  if (!fs.existsSync(distIndexHtml)) {
    console.error(`[prerender] Error: Compiled template not found at ${distIndexHtml}. Run vite build first!`)
    process.exit(1)
  }

  const baseTemplate = fs.readFileSync(distIndexHtml, 'utf8')
  const blogs = loadBlogPosts()
  console.log(`[prerender] Loaded ${Object.keys(seoMetadata).length} static routes and ${blogs.length} blog posts.`)

  const allRoutes = new Map()

  // 1. Static routes
  for (const [routePath, seo] of Object.entries(seoMetadata)) {
    allRoutes.set(routePath, seo)
  }

  // 2. Dynamic blog routes
  for (const blog of blogs) {
    const blogPath = `/blog/${blog.slug}`
    const blogTitle = `${blog.metaTitle.slice(0, 48)} | PrintSign`
    const blogDescription = blog.metaDescription.slice(0, 155)

    const faqEntities = (blog.faq || []).map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          '@id': `https://printsign.org${blogPath}#article`,
          headline: blog.title,
          description: blogDescription,
          keywords: (blog.keywords || []).join(', '),
          datePublished: '2026-10-27T00:00:00+00:00',
          dateModified: '2026-10-27T00:00:00+00:00',
          author: {
            '@type': 'Organization',
            name: blog.author || 'PrintSign Security Team',
            url: 'https://printsign.org'
          },
          publisher: {
            '@type': 'Organization',
            name: 'PrintSign PDF Editor',
            url: 'https://printsign.org'
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://printsign.org${blogPath}`
          }
        },
        ...(faqEntities.length > 0
          ? [
              {
                '@type': 'FAQPage',
                mainEntity: faqEntities
              }
            ]
          : [])
      ]
    }

    allRoutes.set(blogPath, {
      title: blogTitle,
      description: blogDescription,
      h1: blog.title,
      ogType: 'article',
      schema
    })
  }

  let count = 0

  for (const [routePath, seo] of allRoutes.entries()) {
    const renderedHtml = prerenderRoute(baseTemplate, routePath, seo)

    if (routePath === '/') {
      fs.writeFileSync(distIndexHtml, renderedHtml, 'utf8')
      count++
      console.log(`✓ [200 OK] / -> dist/index.html (${seo.title})`)
    } else {
      const cleanPath = routePath.replace(/^\//, '')
      const targetFolder = path.resolve(distDir, cleanPath)
      fs.mkdirSync(targetFolder, { recursive: true })
      const targetFile = path.resolve(targetFolder, 'index.html')
      fs.writeFileSync(targetFile, renderedHtml, 'utf8')
      count++
      console.log(`✓ [200 OK] ${routePath} -> dist/${cleanPath}/index.html (${seo.title})`)
    }
  }

  // Create dist/404.html for GitHub Pages fallback
  const fallback404Path = path.resolve(distDir, '404.html')
  fs.writeFileSync(fallback404Path, baseTemplate, 'utf8')
  console.log(`✓ [SPA 404] Generated dist/404.html for GitHub Pages router fallback.`)

  // Create dist/.nojekyll for GitHub Pages
  const nojekyllPath = path.resolve(distDir, '.nojekyll')
  fs.writeFileSync(nojekyllPath, '', 'utf8')
  console.log(`✓ [NoJekyll] Generated dist/.nojekyll`)

  // Create dist/CNAME for GitHub Pages custom domain (only when deploying to apex/custom domain)
  const rawBase = (process.env.BASE_URL || process.env.VITE_BASE_URL || '/').trim()
  const isApex = rawBase === '/' || rawBase === ''
  const cnamePath = path.resolve(distDir, 'CNAME')

  if (isApex) {
    fs.writeFileSync(cnamePath, 'printsign.org\n', 'utf8')
    console.log(`✓ [CNAME] Generated dist/CNAME for printsign.org`)
  } else {
    if (fs.existsSync(cnamePath)) {
      fs.unlinkSync(cnamePath)
      console.log(`✓ [CNAME] Removed dist/CNAME for subpath deployment (${rawBase})`)
    }
  }

  // Dynamic Sitemap & Robots.txt generation
  console.log('\n--- Generating Dynamic Sitemap & Robots.txt ---')
  generateSitemap()

  console.log(`\n[prerender] Success! Total ${count} dedicated HTML files pre-rendered with semantic SEO heads and crawlable content.\n`)
}

main().catch(err => {
  console.error('[prerender] Fatal error:', err)
  process.exit(1)
})
