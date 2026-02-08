import { expect, test } from '@playwright/test'
import { fetchSeedProject } from '../fixtures/supabase'
import { ProjectPage } from '../pages/ProjectPage'

test.describe('investment flow', () => {
  test('invest in a project with stripe', async ({ page }) => {
    const project = await fetchSeedProject()

    if (!project?.slug) {
      throw new Error('No project available for investment flow')
    }

    const projectPage = new ProjectPage(page)
    await projectPage.gotoInvest(project.slug)
    await projectPage.selectAmount(60)
    await projectPage.continueToSummary()
    await projectPage.confirmSummary()
    await projectPage.continueToPayment()
    await projectPage.completeStripePayment()

    await page.waitForURL(/dashboard\/investments/)
    await expect(page.getByRole('heading', { name: /investissements/i })).toBeVisible()
  })
})
