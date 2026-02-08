import { expect, type Page } from '@playwright/test'
import { defaultLocale, withLocale } from '../fixtures/paths'

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto(withLocale('/login'))
  }

  async login(email: string, password: string) {
    await this.page.getByRole('textbox', { name: /email/i }).fill(email)
    await this.page.locator('input[type="password"]').fill(password)

    await Promise.all([
      this.page.waitForURL(new RegExp(`/${defaultLocale}/dashboard`)),
      this.page.getByRole('button', { name: /se connecter|login/i }).click(),
    ])

    await expect(this.page).toHaveURL(new RegExp(`/${defaultLocale}/dashboard`))
  }
}
