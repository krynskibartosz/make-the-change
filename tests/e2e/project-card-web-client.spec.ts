import { expect, test } from 'playwright/test'

const runProjectCardE2E = process.env.RUN_PROJECT_CARD_E2E === '1'

test.describe('Web-client project card smoke', () => {
  test.skip(!runProjectCardE2E, 'Set RUN_PROJECT_CARD_E2E=1 to run browser smoke tests')

  test('catalog cards render progress and navigate on card click', async ({ page }) => {
    await page.goto('http://127.0.0.1:3001/en/projects')
    await expect(page.getByPlaceholder(/Search.*project/i)).toBeVisible()

    const firstCatalogCard = page
      .locator('[role="button"]')
      .filter({ has: page.locator('a[href*="/projects/"]') })
      .first()

    await expect(firstCatalogCard).toBeVisible()
    await expect(firstCatalogCard).toContainText('%')

    await firstCatalogCard.click({ position: { x: 90, y: 220 } })
    await expect(page).toHaveURL(/\/projects\/.+/)
  })

  test('home featured card renders status and navigates to project detail', async ({ page }) => {
    await page.goto('http://127.0.0.1:3001/en')

    const firstHomeCard = page
      .locator('[role="button"]')
      .filter({ has: page.locator('a[href*="/projects/"]') })
      .first()

    await expect(firstHomeCard).toBeVisible()
    await expect(firstHomeCard).toContainText(/funded|active/i)

    await firstHomeCard.click({ position: { x: 90, y: 220 } })
    await expect(page).toHaveURL(/\/projects\/.+/)
  })
})
