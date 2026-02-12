import { expect, test } from 'playwright/test'

const runBaseUiWebClientE2E = process.env.RUN_BASE_UI_WEB_CLIENT_E2E === '1'
const userEmail = process.env.E2E_USER_EMAIL
const userPassword = process.env.E2E_USER_PASSWORD

async function ensureAppearanceSession(page: import('playwright/test').Page) {
  await page.goto('http://127.0.0.1:3001/en/dashboard/settings/appearance')

  if (!page.url().includes('/login')) {
    return
  }

  test.skip(
    !userEmail || !userPassword,
    'Set E2E_USER_EMAIL and E2E_USER_PASSWORD to run appearance settings smoke tests.',
  )

  await page.getByLabel(/email/i).fill(userEmail!)
  await page.getByLabel(/password/i).fill(userPassword!)
  await page.getByRole('button', { name: /login|sign in|connexion|se connecter/i }).click()
  await expect(page).toHaveURL(/\/en\/dashboard\/settings\/appearance/)
}

test.describe('Base UI theme dialog and toggle group smoke', () => {
  test.skip(!runBaseUiWebClientE2E, 'Set RUN_BASE_UI_WEB_CLIENT_E2E=1 to run Base UI browser smoke tests')

  test('changes theme category with ToggleGroup and opens delete dialog when available', async ({ page }) => {
    await ensureAppearanceSession(page)

    const natureToggle = page.getByRole('button', { name: /^Nature$/ }).first()
    await expect(natureToggle).toBeVisible()

    await natureToggle.click()
    await expect(natureToggle).toHaveAttribute('aria-pressed', 'true')

    const deleteThemeButtons = page.locator('button:has(svg.lucide-trash2)')
    const hasDeleteButton = (await deleteThemeButtons.count()) > 0

    test.skip(!hasDeleteButton, 'Theme delete dialog requires at least one custom theme.')

    await deleteThemeButtons.first().click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    await page.getByRole('button', { name: /annuler|cancel/i }).click()
    await expect(dialog).not.toBeVisible()
  })
})
