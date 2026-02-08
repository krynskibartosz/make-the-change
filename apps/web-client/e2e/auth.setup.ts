import { test } from '@playwright/test'
import { requireEnv } from './fixtures/env'
import { authStoragePath } from './fixtures/paths'
import { LoginPage } from './pages/LoginPage'

test('authenticate user', async ({ page }) => {
  const email = requireEnv('E2E_USER_EMAIL')
  const password = requireEnv('E2E_USER_PASSWORD')

  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.login(email, password)

  await page.context().storageState({ path: authStoragePath })
})
