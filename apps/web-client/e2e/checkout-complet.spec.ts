// spec: specs/checkout-complet.md
// seed: seed.spec.ts

import { expect, test } from '@playwright/test'

test.describe('Checkout complet', () => {
  test('Checkout complet', async ({ page }) => {
    // 1. Assumptions / État initial : Variables d'environnement définies et site reachable
    const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3001'
    const userEmail = process.env.E2E_USER_EMAIL ?? 'final-client@test.be'
    const userPassword = process.env.E2E_USER_PASSWORD ?? 'TestPassword123!'

    await page.goto(baseUrl)

    // 2. Si possible: vérifier que l'utilisateur est déjà connecté (storageState), sinon effectuer le login via UI
    // Comment: utilisation de getByRole() en priorité
    const dashboardHeading = page.getByRole('heading', { name: /tableau de bord|dashboard/i })
    if (!(await dashboardHeading.isVisible().catch(() => false))) {
      // 2.1 Ouvrir la page de login
      // Cliquer sur le lien/btn 'Se connecter' si présent
      await page
        .getByRole('link', { name: /se connecter|connexion/i })
        .first()
        .click()
        .catch(() => {})

      // 2.2 Remplir email
      await page.getByRole('textbox', { name: /email/i }).fill(userEmail)

      // 2.3 Remplir mot de passe
      await page.getByRole('textbox', { name: /mot de passe|password/i }).fill(userPassword)

      // 2.4 Cliquer sur 'Se connecter' et attendre redirection vers dashboard
      await page.getByRole('button', { name: /se connecter|connexion/i }).click()
      await expect(dashboardHeading).toBeVisible({ timeout: 10_000 })
    }

    // 3. Depuis le dashboard/page d'accueil: identifier et ouvrir un produit de test
    // Chercher un lien vers le produit (priorité getByRole)
    const productLink = page.getByRole('link', { name: /voir|détails|produit/i }).first()
    await expect(productLink).toBeVisible({ timeout: 10_000 })
    await productLink.click()

    // 4. Vérifier la ProductPage et le bouton 'Ajouter au panier'
    const productTitle = page.getByRole('heading', { level: 1 }).first()
    await expect(productTitle).toBeVisible({ timeout: 10_000 })
    const addToCartBtn = page.getByRole('button', { name: /ajouter au panier/i })
    await expect(addToCartBtn).toBeVisible({ timeout: 5_000 })

    // 5. Ajouter au panier et vérifier le compteur / contenu du panier
    await addToCartBtn.click()
    const cartCount = page.getByTestId ? page.getByTestId('cart-count') : page.getByRole('status')
    await expect(cartCount).toBeVisible({ timeout: 5_000 })

    // 6. Passer à la caisse
    const checkoutBtn = page.getByRole('button', { name: /passer à la caisse|checkout/i })
    await expect(checkoutBtn).toBeVisible({ timeout: 5_000 })
    await checkoutBtn.click()

    // 7. Vérifier la CheckoutPage et remplir le formulaire d'adresse
    const checkoutHeading = page.getByRole('heading', { name: /checkout|paiement|caisse/i })
    await expect(checkoutHeading).toBeVisible({ timeout: 10_000 })

    // Remplir l'adresse
    await page.getByRole('textbox', { name: /nom/i }).fill('Test')
    await page.getByRole('textbox', { name: /prénom|prenom/i }).fill('Client')
    await page.getByRole('textbox', { name: /adresse/i }).fill('Rue de Test 10')
    await page.getByRole('textbox', { name: /code postal|cp|postal/i }).fill('1000')
    await page.getByRole('textbox', { name: /ville/i }).fill('Bruxelles')
    // Pays peut être un combobox
    const country = page.getByRole('combobox', { name: /pays|country/i }).first()
    if (await country.isVisible().catch(() => false)) {
      await country.selectOption({ label: 'Belgique' }).catch(() => {})
    }

    // 8. Vérifier que le bouton de paiement est actif
    const payBtn = page.getByRole('button', { name: /payer|confirmer|paiement/i }).first()
    await expect(payBtn).toBeVisible({ timeout: 5_000 })

    // 9. Scénario d'erreur de paiement: tester d'abord une carte en échec
    // Utiliser frameLocator pour Stripe
    const stripeFrame = page.frameLocator(
      'iframe[src*="stripe"], iframe[title*="Stripe"], iframe[name*="__privateStripe"]',
    )
    // Remplir la carte fail
    await stripeFrame
      .locator('input[name="cardnumber"]')
      .fill('4000000000009995')
      .catch(() => {})
    await stripeFrame
      .locator('input[name="exp-date"]')
      .fill('12/34')
      .catch(() => {})
    await stripeFrame
      .locator('input[name="cvc"]')
      .fill('123')
      .catch(() => {})
    // Soumettre et vérifier qu'une alerte est affichée
    await payBtn.click()
    const paymentAlert = page.getByRole('alert')
    await expect(paymentAlert).toBeVisible({ timeout: 10_000 })

    // 10. Refaire le paiement en mode succès
    // Remplir la carte de succès
    await stripeFrame
      .locator('input[name="cardnumber"]')
      .fill('4242424242424242')
      .catch(() => {})
    await stripeFrame
      .locator('input[name="exp-date"]')
      .fill('12/34')
      .catch(() => {})
    await stripeFrame
      .locator('input[name="cvc"]')
      .fill('123')
      .catch(() => {})
    await payBtn.click()

    // 11. Vérifier la page de confirmation et le numéro de commande
    const confirmationHeading = page.getByRole('heading', { name: /commande confirmée|merci/i })
    await expect(confirmationHeading).toBeVisible({ timeout: 15_000 })
    const orderNumber = page.getByText(/commande n°|#\d+/i).first()
    await expect(orderNumber).toBeVisible({ timeout: 10_000 })

    // 12. Retour au dashboard et vérification de l'historique des commandes
    await page
      .getByRole('link', { name: /retour au tableau de bord|continuer|dashboard/i })
      .first()
      .click()
      .catch(() => {})
    await expect(dashboardHeading).toBeVisible({ timeout: 10_000 })
    const orderNumberText = ((await orderNumber.textContent()) ?? '').trim()
    const ordersListItem = page.getByText(orderNumberText || /commande/i)
    await expect(ordersListItem).toBeVisible({ timeout: 10_000 })

    // Notes: si certains sélecteurs ne sont pas disponibles, privilégier les sélecteurs accessibles (`getByRole`, `getByLabelText`)
  })
})
