import { test, expect } from '@playwright/test'
import { createSyntheticFixturePdf, CANARY_SECRET_A } from '../fixtures/create-synthetic-pdf'
import * as fs from 'node:fs'
import { fileURLToPath } from 'node:url'

test.describe('E2E Redaction & Page Workflow', () => {
  const fixturePath = fileURLToPath(new URL('../fixtures/temp-synthetic.pdf', import.meta.url))

  test.beforeAll(async () => {
    const bytes = await createSyntheticFixturePdf()
    fs.writeFileSync(fixturePath, Buffer.from(bytes))
  })

  test.afterAll(() => {
    if (fs.existsSync(fixturePath)) {
      fs.unlinkSync(fixturePath)
    }
  })

  test('Test #2 & #3: Load -> Search-and-Redact Canary -> Save -> Verify absence', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    // Upload synthetic PDF fixture via file input
    const fileInput = page.locator('input[type="file"]').first()
    await fileInput.setInputFiles(fixturePath)

    // Wait for document to load and show Pages & View
    await expect(page.locator('text=Pages & View')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Thumbnails (2)')).toBeVisible()

    // Switch to Redaction workspace
    await page.click('text=Redaction')
    await expect(page.locator('text=Redaction Workspace')).toBeVisible()

    // Search for canary string
    const searchInput = page.locator('input[placeholder="Search text to redact..."]')
    await searchInput.fill(CANARY_SECRET_A)
    await page.keyboard.press('Enter')

    // Expect search matches
    await expect(page.locator('text=Found 1 match(es)')).toBeVisible({ timeout: 5000 })

    // Add as redactions
    await page.click('text=Add 1 as Redactions')
    await expect(page.locator('text=Pending Boxes (1)')).toBeVisible()

    // Apply redactions
    await page.click('text=Apply 1 Redactions')
    await expect(page.locator('text=Apply Permanent Redactions?')).toBeVisible()

    // Confirm Apply & Purge
    await page.click('text=Apply & Purge')

    // Verification report modal should appear with "Redaction Verification Passed"
    await expect(page.locator('text=Redaction Verification Passed')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('text=100% Clean (0 Matches)')).toBeVisible()
    await expect(page.locator('text=100% Clean (0 Bytes Found)')).toBeVisible()
  })
})
