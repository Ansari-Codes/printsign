import { test, expect } from '@playwright/test'

test.describe('AdSense Dedicated Pages & Routes Suite', () => {
  test('Route: /features loads dedicated specifications page', async ({ page }) => {
    await page.goto('/features')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('text=Client-Side PDF Features & Capabilities')).toBeVisible()
    await expect(page.locator('text=Permanent Byte-Level Redaction')).toBeVisible()
  })

  test('Route: /about-us loads dedicated mission page', async ({ page }) => {
    await page.goto('/about-us')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('text=Pioneering Zero-Trust In-Browser Computing')).toBeVisible()
    await expect(page.locator('text=Our Core Philosophy')).toBeVisible()
  })

  test('Route: /contact-us loads functional contact form and emails', async ({ page }) => {
    await page.goto('/contact-us')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('text=Contact the PrintSign Team')).toBeVisible()
    await expect(page.locator('text=support@printsign.org')).toBeVisible()
    await expect(page.locator('input[placeholder="name@example.com"]')).toBeVisible()
  })

  test('Route: /privacy-policy loads comprehensive AdSense & GDPR disclosures', async ({ page }) => {
    await page.goto('/privacy-policy')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('text=Privacy Policy & Data Protection Statement')).toBeVisible()
    await expect(page.locator('text=Third-Party Advertising & Cookie Disclosures (Google AdSense)')).toBeVisible()
  })

  test('Route: /terms-of-service loads full usage agreement', async ({ page }) => {
    await page.goto('/terms-of-service')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('text=Terms of Service & Usage Agreement')).toBeVisible()
    await expect(page.locator('text=User Responsibility & Verification')).toBeVisible()
  })

  test('Route: /cookie-policy loads EU / GDPR advertising cookie disclosures', async ({ page }) => {
    await page.goto('/cookie-policy')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('text=Cookie Policy & GDPR Advertising Notice')).toBeVisible()
    await expect(page.locator('text=Managing Your Cookie Choices & Opt-Out Links')).toBeVisible()
  })

  test('Route: /guides loads forensic knowledge base', async ({ page }) => {
    await page.goto('/guides')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('text=PDF Security, Forensics & Redaction Guides')).toBeVisible()
    await expect(page.locator('text=Why Black Boxes in PDFs Lead to Catastrophic Data Breaches')).toBeVisible()
  })

  test('Route: /faq loads interactive FAQ accordion', async ({ page }) => {
    await page.goto('/faq')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('text=Everything You Need to Know About PrintSign')).toBeVisible()
    await expect(page.locator('text=Are my PDF files or edited pages ever uploaded to any server?')).toBeVisible()
  })

  test('Route: /general-editor loads general purpose content editor', async ({ page }) => {
    await page.goto('/general-editor')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('text=Add Text, Insert Images, Signatures & Stamps')).toBeVisible()
    await expect(page.locator('text=True Vector Text')).toBeVisible()
  })

  test('Route: /editor loads full-screen PDF editor shell', async ({ page }) => {
    await page.goto('/editor')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('text=100% Client-Side Privacy')).toBeVisible()
    await expect(page.locator('text=Select PDF Document')).toBeVisible()
  })
})
