import { expect, test } from 'playwright/test'

const runProductCardE2E = process.env.RUN_PRODUCT_CARD_E2E === '1'
const adminEmail = process.env.E2E_ADMIN_EMAIL
const adminPassword = process.env.E2E_ADMIN_PASSWORD

test.describe('Admin product card smoke', () => {
  test.skip(!runProductCardE2E, 'Set RUN_PRODUCT_CARD_E2E=1 to run browser smoke tests')

  test('keeps action clicks inside the card and navigates on card click', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/en/admin/products')

    const isOnLoginPage = await page
      .getByRole('heading', { name: /Accès Administrateur|Admin Access/i })
      .isVisible()
      .catch(() => false)

    if (isOnLoginPage) {
      test.skip(
        !adminEmail || !adminPassword,
        'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to run admin smoke tests.',
      )

      await page.getByRole('textbox').first().fill(adminEmail!)
      await page.getByRole('textbox').nth(1).fill(adminPassword!)
      await page.getByRole('button', { name: /Se connecter|Sign in|Login/i }).click()
    }

    await expect(page).toHaveURL(/\/admin\/products$/)

    const increaseStockButton = page.getByLabel(/Increase stock|Augmenter le stock/i).first()
    await expect(increaseStockButton).toBeVisible()

    const productsPageUrl = page.url()
    await increaseStockButton.click()
    await expect(page).toHaveURL(productsPageUrl)

    const firstProductCard = increaseStockButton.locator('xpath=ancestor::*[@role="button"][1]')
    await firstProductCard.click({ position: { x: 120, y: 120 } })

    await expect(page).toHaveURL(/\/en\/admin\/products\/[^/]+$/)
  })
})
