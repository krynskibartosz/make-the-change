import { expect, test } from 'playwright/test'

const runBaseUiWebClientE2E = process.env.RUN_BASE_UI_WEB_CLIENT_E2E === '1'
const userEmail = process.env.E2E_USER_EMAIL
const userPassword = process.env.E2E_USER_PASSWORD

async function ensureDashboardSession(page: import('playwright/test').Page) {
  await page.goto('http://127.0.0.1:3001/en/dashboard/settings')

  if (!page.url().includes('/login')) {
    return
  }

  test.skip(
    !userEmail || !userPassword,
    'Set E2E_USER_EMAIL and E2E_USER_PASSWORD to run dashboard settings smoke tests.',
  )

  await page.getByLabel(/email/i).fill(userEmail!)
  await page.getByLabel(/password/i).fill(userPassword!)
  await page.getByRole('button', { name: /login|sign in|connexion|se connecter/i }).click()
  await expect(page).toHaveURL(/\/en\/dashboard\/settings/)
}

test.describe('Base UI settings forms smoke', () => {
  test.skip(!runBaseUiWebClientE2E, 'Set RUN_BASE_UI_WEB_CLIENT_E2E=1 to run Base UI browser smoke tests')

  test('renders Form/Field/Fieldset and checkbox group in dashboard settings', async ({ page }) => {
    await ensureDashboardSession(page)

    await expect(page.locator('form')).toBeVisible()
    await expect(page.locator('legend')).toHaveCount(2)

    await page.goto('http://127.0.0.1:3001/en/dashboard/settings/notifications')
    await expect(page.locator('form')).toBeVisible()

    const emailChannelCheckbox = page.locator('#notify_email')
    await expect(emailChannelCheckbox).toBeVisible()

    const pushChannelCheckbox = page.locator('#notify_push')
    await expect(pushChannelCheckbox).toBeVisible()

    await pushChannelCheckbox.click()

    const submitButton = page.getByRole('button', { name: /save|enregistrer/i }).last()
    await submitButton.click()
  })
})
