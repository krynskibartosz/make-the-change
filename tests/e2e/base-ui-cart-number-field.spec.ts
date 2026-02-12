import { expect, test } from 'playwright/test'

const runBaseUiWebClientE2E = process.env.RUN_BASE_UI_WEB_CLIENT_E2E === '1'

test.describe('Base UI cart number field smoke', () => {
  test.skip(!runBaseUiWebClientE2E, 'Set RUN_BASE_UI_WEB_CLIENT_E2E=1 to run Base UI browser smoke tests')

  test('increments cart quantity with NumberField controls when cart has items', async ({ page }) => {
    await page.goto('http://127.0.0.1:3001/en/cart')

    const emptyStateVisible = await page
      .getByRole('link', { name: /products|produits|catalog/i })
      .first()
      .isVisible()
      .catch(() => false)

    test.skip(emptyStateVisible, 'Cart quantity stepper needs at least one cart line item.')

    const increaseButton = page.getByLabel(/augmenter la quantité|increase quantity/i).first()
    await expect(increaseButton).toBeVisible()

    const stepperContainer = increaseButton.locator(
      'xpath=ancestor::div[contains(@class,"inline-flex h-11")][1]',
    )
    const quantityInput = stepperContainer.locator('input').first()

    const previousValue = await quantityInput.inputValue()
    await increaseButton.click()

    await expect
      .poll(async () => quantityInput.inputValue())
      .not.toBe(previousValue)
  })
})
