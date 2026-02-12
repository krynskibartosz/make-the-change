import { expect, test } from 'playwright/test'

const runProductCardE2E = process.env.RUN_PRODUCT_CARD_E2E === '1'

test.describe('Web-client product card smoke', () => {
  test.skip(!runProductCardE2E, 'Set RUN_PRODUCT_CARD_E2E=1 to run browser smoke tests')

  test('catalog cards render pricing and navigate on card click', async ({ page }) => {
    await page.goto('http://127.0.0.1:3001/en/products')
    await expect(page.getByRole('textbox', { name: /Search products/i })).toBeVisible()

    const firstCatalogCard = page
      .locator('[role="button"]')
      .filter({ has: page.locator('a[href*="/products/"]') })
      .first()

    await expect(firstCatalogCard).toBeVisible()
    await expect(firstCatalogCard).toContainText(/points/i)

    await firstCatalogCard.click({ position: { x: 80, y: 220 } })
    await expect(page).toHaveURL(/\/products\/.+/)
  })

  test('home card wishlist action does not navigate and card click does', async ({ page }) => {
    await page.goto('http://127.0.0.1:3001/en')

    const wishlistButton = page.getByLabel(/Add to wishlist|Ajouter aux favoris/i).first()
    await expect(wishlistButton).toBeVisible()

    const homeUrl = page.url()
    await wishlistButton.click()
    await expect(page).toHaveURL(homeUrl)

    const firstHomeCard = wishlistButton.locator('xpath=ancestor::*[@role="button"][1]')
    await firstHomeCard.click({ position: { x: 60, y: 220 } })
    await expect(page).toHaveURL(/\/products\/.+/)
  })
})
