import { expect, type Page } from '@playwright/test'
import { withLocale } from '../fixtures/paths'
import { fillStripeCard } from '../fixtures/stripe'

export class ProjectPage {
  constructor(private readonly page: Page) {}

  async gotoInvest(slug: string) {
    await this.page.goto(withLocale(`/projects/${slug}/invest`))
    await expect(this.page.getByRole('button', { name: /continuer/i })).toBeVisible()
  }

  async selectAmount(amount: number) {
    const amountInput = this.page.getByLabel(/montant personnalis[ée]|custom amount/i)
    await amountInput.fill(amount.toString())
  }

  async continueToSummary() {
    await this.page.getByRole('button', { name: /^continuer$/i }).click()
    await expect(this.page.getByRole('heading', { name: /r[ée]capitulatif/i })).toBeVisible()
  }

  async confirmSummary() {
    await this.page.getByRole('button', { name: /confirmer/i }).click()
    await expect(this.page.getByRole('heading', { name: /paiement s[ée]curis[ée]/i })).toBeVisible()
  }

  async continueToPayment() {
    await this.page.getByRole('button', { name: /continuer vers le paiement/i }).click()
    await expect(this.page.getByRole('button', { name: /^payer$/i })).toBeVisible()
  }

  async completeStripePayment() {
    await fillStripeCard(this.page)
    await this.page.getByRole('button', { name: /^payer$/i }).click()
  }
}
