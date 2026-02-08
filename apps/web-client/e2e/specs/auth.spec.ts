import { expect, test } from '@playwright/test'
import { requireEnv } from '../fixtures/env'
import { defaultLocale, withLocale } from '../fixtures/paths'
import { LoginPage } from '../pages/LoginPage'

test.describe('auth flow', () => {
  test('login redirects to dashboard', async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()

    const email = requireEnv('E2E_USER_EMAIL')
    const password = requireEnv('E2E_USER_PASSWORD')

    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login(email, password)

    await expect(page).toHaveURL(new RegExp(`/${defaultLocale}/dashboard`))
    await expect(page.getByRole('heading', { name: /bienvenue|welcome/i })).toBeVisible()
    await expect(page.getByText(/impact score/i)).toBeVisible()

    await context.close()
  })

  test('authenticated session can access dashboard', async ({ page }) => {
    await page.goto(withLocale('/dashboard'))
    await expect(page.getByRole('heading', { name: /bienvenue|welcome/i })).toBeVisible()
  })
})
