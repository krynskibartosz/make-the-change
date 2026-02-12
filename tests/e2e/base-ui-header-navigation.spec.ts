import { expect, test } from 'playwright/test'

const runBaseUiWebClientE2E = process.env.RUN_BASE_UI_WEB_CLIENT_E2E === '1'

test.describe('Base UI header navigation smoke', () => {
  test.skip(!runBaseUiWebClientE2E, 'Set RUN_BASE_UI_WEB_CLIENT_E2E=1 to run Base UI browser smoke tests')

  test('navigates to products and exposes navigation menu aria state', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 })
    await page.goto('http://127.0.0.1:3001/en')

    const discoverTrigger = page.getByRole('button', { name: /discover|découvrir/i }).first()
    await expect(discoverTrigger).toBeVisible()

    await discoverTrigger.focus()
    await page.keyboard.press('Enter')
    await expect(discoverTrigger).toHaveAttribute('aria-expanded', 'true')

    const productsLink = page.locator('header nav a[href$="/products"]').first()
    await expect(productsLink).toBeVisible()
    await productsLink.click()

    await expect(page).toHaveURL(/\/en\/products$/)
  })
})
