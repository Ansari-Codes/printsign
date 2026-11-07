import { test, expect } from '@playwright/test'
import { createSyntheticFixturePdf } from '../fixtures/create-synthetic-pdf'
import * as fs from 'node:fs'
import { fileURLToPath } from 'node:url'

test.describe('E2E Content Editor & Interactive Manipulation Suite', () => {
  const fixturePath = fileURLToPath(new URL('../fixtures/temp-content-test.pdf', import.meta.url))

  test.beforeAll(async () => {
    const bytes = await createSyntheticFixturePdf()
    fs.writeFileSync(fixturePath, Buffer.from(bytes))
  })

  test.afterAll(() => {
    if (fs.existsSync(fixturePath)) {
      fs.unlinkSync(fixturePath)
    }
  })

  test('creates, configures, manipulates and embeds text and stamps on PDF', async ({ page }) => {
    await page.goto('/editor')
    await page.waitForLoadState('domcontentloaded')

    // 1. Upload synthetic PDF fixture
    const fileInput = page.locator('input[type="file"]').first()
    await fileInput.setInputFiles(fixturePath)

    // 2. Ensure workspace is loaded
    await expect(page.locator('text=Pages & View')).toBeVisible({ timeout: 10000 })

    // 3. Switch to Content Editor workspace tab
    await page.click('button:has-text("Edit Content")')
    await expect(page.locator('text=Text to Insert')).toBeVisible({ timeout: 5000 })

    // 4. Insert text on current page
    await page.click('button:has-text("Place Text on Current Page")')

    // 5. Assert text element appears on page
    const textareas = page.locator('textarea')
    await expect(textareas.first()).toBeVisible()

    // 6. Switch to Stamps tab and add an APPROVED stamp
    await page.click('button:has-text("Stamps")')
    await page.click('button:has-text("APPROVED")')

    // Assert stamp element appears
    await expect(page.locator('text=APPROVED').first()).toBeVisible()

    // Assert pending items badge in header / sidebar updates
    await expect(page.locator('text=2 Pending')).toBeVisible()

    // 7. Save & Embed into PDF
    const embedButton = page.locator('button:has-text("Save & Embed into PDF")')
    await expect(embedButton).toBeEnabled()
    await embedButton.click()

    // Verify embedding completes and pending count returns to 0 (badge hides, embed button disables)
    await expect(page.locator('text=2 Pending')).toBeHidden({ timeout: 10000 })
    await expect(embedButton).toBeDisabled()
  })
})
