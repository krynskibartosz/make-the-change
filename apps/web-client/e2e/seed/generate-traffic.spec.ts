import { expect, test } from '@playwright/test'
import { requireEnv } from '../fixtures/env'
import { withLocale } from '../fixtures/paths'
import {
  ensureUserHasPoints,
  fetchSeedProducer,
  fetchSeedProduct,
  fetchSeedProject,
} from '../fixtures/supabase'
import { defaultAddress, makeSeedMessage, makeSeedSubject } from '../fixtures/test-data'
import { CheckoutPage } from '../pages/CheckoutPage'
import { ProjectPage } from '../pages/ProjectPage'

test.describe.configure({ mode: 'serial' })

test.describe('synthetic seeding', () => {
  test.beforeAll(async () => {
    requireEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
    requireEnv('STRIPE_SECRET_KEY')
    const email = requireEnv('E2E_USER_EMAIL')
    const result = await ensureUserHasPoints(email, 2000)

    if (!result.ok) {
      throw new Error(`[seed] Unable to top up points: ${result.reason}`)
    }

    if (result.updated) {
      console.info(`[seed] Points balance updated to ${result.points}`)
    }
  })

  test('seed commerce, investment, and messages', async ({ page }) => {
    const product = await fetchSeedProduct()
    const project = await fetchSeedProject()
    const producer = await fetchSeedProducer()

    if (!product?.slug) {
      throw new Error('No product available for seeding')
    }

    if (!project?.slug) {
      throw new Error('No project available for seeding')
    }

    if (!producer?.slug) {
      throw new Error('No producer available for seeding')
    }

    // --- Commerce flow ---
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

    // --- Investment flow ---
    const projectPage = new ProjectPage(page)
    await projectPage.gotoInvest(project.slug)
    await projectPage.selectAmount(60)
    await projectPage.continueToSummary()
    await projectPage.confirmSummary()
    await projectPage.continueToPayment()
    await projectPage.completeStripePayment()

    await page.waitForURL(/dashboard\/investments/)

    // --- Producer message ---
    await page.goto(withLocale(`/producers/${producer.slug}/contact`))

    page.once('dialog', async (dialog) => {
      await dialog.accept()
    })

    await page.getByLabel(/sujet/i).fill(makeSeedSubject())
    await page.getByLabel(/message/i).fill(makeSeedMessage())
    await page.getByRole('button', { name: /envoyer le message/i }).click()

    await page.waitForURL(/dashboard\/messages/)
    await expect(page.getByRole('heading', { name: /messages envoy[ée]s/i })).toBeVisible()
  })
})
