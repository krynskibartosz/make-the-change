import { expect, type Page } from '@playwright/test'
import { withLocale } from '../fixtures/paths'
import type { ShippingAddress } from '../fixtures/test-data'

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async gotoCart() {
    await this.page.goto(withLocale('/cart'))
  }

  async startCheckoutFromCart() {
    await this.page.getByRole('button', { name: /passer commande/i }).click()
    await expect(this.page.getByRole('heading', { name: /commande/i })).toBeVisible()
  }

  async continueFromSummary() {
    await this.page
      .getByRole('button', { name: /^continuer$/i })
      .first()
      .click()
    await expect(this.page.getByRole('heading', { name: /adresse de livraison/i })).toBeVisible()
  }

  async fillShippingAddress(address: ShippingAddress) {
    await this.page.getByLabel(/pr[ée]nom|first name/i).fill(address.firstName)
    await this.page.getByLabel(/nom|last name/i).fill(address.lastName)
    await this.page.getByLabel(/adresse|street/i).fill(address.street)
    await this.page.getByLabel(/ville|city/i).fill(address.city)
    await this.page.getByLabel(/code postal|postal/i).fill(address.postalCode)
    await this.page.getByLabel(/pays|country/i).fill(address.country)
  }

  async continueFromAddress() {
    await this.page.getByRole('button', { name: /^continuer$/i }).click()
    await expect(this.page.getByRole('heading', { name: /confirmation/i })).toBeVisible()
  }

  async confirmOrder() {
    await this.page.getByRole('button', { name: /confirmer/i }).click()
  }
}
