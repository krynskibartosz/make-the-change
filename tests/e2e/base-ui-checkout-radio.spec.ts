import { expect, test } from 'playwright/test'

const runBaseUiWebClientE2E = process.env.RUN_BASE_UI_WEB_CLIENT_E2E === '1'

test.describe('Base UI checkout radio smoke', () => {
  test.skip(!runBaseUiWebClientE2E, 'Set RUN_BASE_UI_WEB_CLIENT_E2E=1 to run Base UI browser smoke tests')

  test('switches checkout payment radio group when cart and address are available', async ({ page }) => {
    await page.goto('http://127.0.0.1:3001/en/checkout')

    const emptyStateVisible = await page
      .getByRole('link', { name: /products|produits|catalog/i })
      .first()
      .isVisible()
      .catch(() => false)

    test.skip(emptyStateVisible, 'Checkout flow requires at least one item in cart.')

    await page.getByRole('button', { name: /continue|continuer/i }).first().click()

    await page.locator('input[name="firstName"]').fill('Base')
    await page.locator('input[name="lastName"]').fill('UI')
    await page.locator('input[name="street"]').fill('1 Integration Road')
    await page.locator('input[name="city"]').fill('Brussels')
    await page.locator('input[name="postalCode"]').fill('1000')
    await page.locator('input[name="country"]').fill('Belgium')

    await page.getByRole('button', { name: /continue|continuer/i }).first().click()

    const paymentRadios = page.getByRole('radio')
    await expect(paymentRadios).toHaveCount(2)

    const cardRadio = paymentRadios.nth(1)
    await cardRadio.click()
    await expect(cardRadio).toHaveAttribute('aria-checked', 'true')
  })
})
