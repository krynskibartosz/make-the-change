import { expect, test } from 'playwright/test'

const runProjectCardE2E = process.env.RUN_PROJECT_CARD_E2E === '1'
const adminEmail = process.env.E2E_ADMIN_EMAIL
const adminPassword = process.env.E2E_ADMIN_PASSWORD

test.describe('Admin project card smoke', () => {
  test.skip(!runProjectCardE2E, 'Set RUN_PROJECT_CARD_E2E=1 to run browser smoke tests')

  test('keeps action clicks inside the card and navigates on card click', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/en/admin/projects')

    const isOnLoginPage = await page
      .getByRole('heading', { name: /Accès Administrateur|Admin Access/i })
      .isVisible()
      .catch(() => false)

    if (isOnLoginPage) {
      test.skip(
        !adminEmail || !adminPassword,
        'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to run admin smoke tests.',
      )

      await page.getByRole('textbox').first().fill(adminEmail!)
      await page.getByRole('textbox').nth(1).fill(adminPassword!)
      await page.getByRole('button', { name: /Se connecter|Sign in|Login/i }).click()
    }

    await expect(page).toHaveURL(/\/admin\/projects$/)

    const firstProjectCard = page
      .locator('[role="button"]')
      .filter({ has: page.locator('a[href*="/admin/projects/"]') })
      .first()

    await expect(firstProjectCard).toBeVisible()

    const featureButton = firstProjectCard.getByRole('button', { name: /Feature|Unfeature/i }).first()
    await expect(featureButton).toBeVisible()

    const projectsPageUrl = page.url()
    await featureButton.click()
    await expect(page).toHaveURL(projectsPageUrl)

    await firstProjectCard.click({ position: { x: 120, y: 120 } })
    await expect(page).toHaveURL(/\/en\/admin\/projects\/[^/]+$/)
  })
})
