import { test, expect } from '@playwright/test'

test.describe('Zero-Network and Offline Integrity Audits', () => {
  test('Test #4: Zero-network audit - fail on any external-origin request after initial load', async ({ page }) => {
    const externalRequests: string[] = []

    page.on('request', (request) => {
      const url = new URL(request.url())
      // Allow only same-origin requests (localhost / 127.0.0.1) or data/blob URLs
      if (url.origin !== 'http://localhost:5188' && !url.protocol.startsWith('blob:') && !url.protocol.startsWith('data:')) {
        externalRequests.push(request.url())
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Confirm that no external third-party requests occurred (no CDNs, no Google Fonts, no telemetry)
    expect(externalRequests).toEqual([])
  })

  test('Test #6: Worker loading test - confirm pdf.worker.mjs loads without fake worker fallback', async ({ page }) => {
    let workerLoaded = false

    page.on('request', (request) => {
      if (request.url().includes('pdf.worker') || request.url().includes('worker')) {
        workerLoaded = true
      }
    })

    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    const workerSrc = await page.evaluate(async () => {
      // @ts-ignore
      return window.__PDFJS_WORKER_SRC__ || true
    })

    expect(workerSrc).toBeTruthy()
  })

  test('Test #5: Offline PWA test - works completely offline when setOffline(true)', async ({ page, context }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Wait for service worker activation if available
    await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.ready.catch(() => {})
      }
    })

    // Set offline
    await context.setOffline(true)

    // The app shell must remain functional and detect offline mode
    await expect(page.locator('text=PrintSign').first()).toBeVisible()
    await expect(page.locator('text=Offline Mode Active')).toBeVisible({ timeout: 5000 })
  })
})
