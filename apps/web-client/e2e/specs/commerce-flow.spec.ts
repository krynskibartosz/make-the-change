import { expect, test } from '@playwright/test'
import { requireEnv } from '../fixtures/env'
import { withLocale } from '../fixtures/paths'
import { ensureUserHasPoints, fetchSeedProduct } from '../fixtures/supabase'
import { defaultAddress } from '../fixtures/test-data'
import { CheckoutPage } from '../pages/CheckoutPage'

test.describe('commerce flow', () => {
  test('shop to checkout success', async ({ page }) => {
    const email = requireEnv('E2E_USER_EMAIL')
    const ensureResult = await ensureUserHasPoints(email, 2000)

    if (!ensureResult.ok) {
      if (ensureResult.reason.includes('SUPABASE_SERVICE_ROLE_KEY')) {
        console.warn('[e2e] Skipping points top-up (service role key missing).')
      } else {
        throw new Error(`Cannot ensure points balance: ${ensureResult.reason}`)
      }
    }

    const product = await fetchSeedProduct()

    if (!product?.slug) {
      throw new Error('No product available for commerce flow')
    }

    await page.goto(withLocale(`/products/${product.slug}`))
    await page
      .getByRole('button', { name: /ajouter au panier/i })
      .first()
      .click()

    const checkout = new CheckoutPage(page)
    await checkout.gotoCart()
    await expect(page.getByRole('heading', { name: /panier/i })).toBeVisible()

    await checkout.startCheckoutFromCart()
    await checkout.continueFromSummary()
    await checkout.fillShippingAddress(defaultAddress)
    await checkout.continueFromAddress()

    await Promise.all([page.waitForURL(/checkout\/success/), checkout.confirmOrder()])

    await expect(page.getByText(/commande confirm[ée]e/i)).toBeVisible()
  })
})
