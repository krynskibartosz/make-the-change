# Plan de test — Checkout complet

## Application Overview

Plan de test E2E 'Checkout complet' pour l'app web-client (locale fr). Couvre : authentification via storage state, navigation produit, ajout au panier, checkout (adresse + paiement Stripe test), confirmation et retour dashboard. Inclut sélecteurs recommandés (priorité getByRole()), données de test, cas d'erreur et critères de succès/échec.

## Test Scenarios

### 1. Checkout complet

**Seed:** `seed.spec.ts`

#### 1.1. Authentification via storage state

**File:** `specs/checkout-complet.md`

**Steps:**
  1. Assumptions / État initial : Variables d'environnement définies (PLAYWRIGHT_BASE_URL=http://localhost:3001, E2E_USER_EMAIL, E2E_USER_PASSWORD, E2E_LOCALE=fr). Supabase contient au moins un produit et un projet. Browser context vierge.
    - expect: Le site http://localhost:3001 répond et affiche la page d'accueil
    - expect: Les fixtures 'env.ts' et 'supabase.ts' sont disponibles pour le test
  2. Si possible, charger le storageState pré-généré (auth via fixtures/seed). Sinon : Naviguer vers la page de login et effectuer le login manuel via `LoginPage`.
    - expect: Utiliser `page.getByRole('textbox', { name: /email/i })` pour saisir l'email (E2E_USER_EMAIL)
    - expect: Utiliser `page.getByRole('textbox', { name: /mot de passe|password/i })` pour saisir le mot de passe (E2E_USER_PASSWORD)
    - expect: Cliquer `page.getByRole('button', { name: /se connecter|connexion/i })`
    - expect: L'utilisateur est redirigé vers le dashboard (`getByRole('heading', { name: /tableau de bord|dashboard/i })` visible)
    - expect: Le storage state contient les tokens / session nécessaires
  3. Scénario d'erreur : tenter un login avec identifiants invalides
    - expect: Un message d'erreur accessible est affiché (`getByRole('alert')` avec texte contenant 'identifiants' ou 'err')
    - expect: Aucune redirection vers le dashboard
  4. Critères de succès / échec
    - expect: Succès : l'utilisateur est connecté et peut naviguer; storageState réutilisable pour tests suivants
    - expect: Échec : le login échoue ou le storageState n'est pas persistant => échouer le test d'auth et s'arrêter

#### 1.2. Navigation produit & ajout au panier

**File:** `specs/checkout-complet.md`

**Steps:**
  1. Depuis le dashboard ou la page d'accueil, chercher/identifier un produit de test (utiliser `public_products` seed).
    - expect: Le produit apparaît dans la liste (`getByRole('link', { name: /nom du produit|voir produit/i })` ou `getByRole('article')` contenant le nom)
    - expect: Le prix est visible (`getByRole('text', { name: /€|euros/i })` ou `getByText` alternatif)
  2. Cliquer sur le lien vers la page produit (`getByRole('link', { name: /voir|détails/i })`), vérifier le chargement de `ProductPage`.
    - expect: Titre du produit visible (`getByRole('heading', { level: 1 })` ou `getByRole('heading', { name: /Nom du produit/i })`)
    - expect: Bouton `Ajouter au panier` accessible via `getByRole('button', { name: /ajouter au panier/i })`
  3. Cliquer `Ajouter au panier` et vérifier le contenu du panier.
    - expect: Le compteur du panier s'incrémente (`getByRole('status')` ou `getByTestId('cart-count')`)
    - expect: Le panier contient le produit avec le bon prix et quantité
  4. Scénario d'erreur : produit en rupture de stock
    - expect: Un message d'erreur 'Rupture de stock' est affiché et le produit ne peut pas être ajouté
    - expect: Le bouton `Ajouter au panier` est désactivé ou affiche une erreur accessible
  5. Critères de succès / échec
    - expect: Succès : produit ajouté, data du panier persistée dans l'UI et local storage si applicable
    - expect: Échec : bouton non fonctionnel ou incohérence prix/quantité => signaler et échouer

#### 1.3. Checkout complet (adresse + paiement Stripe test)

**File:** `specs/checkout-complet.md`

**Steps:**
  1. Depuis le panier, cliquer `Passer à la caisse` (`getByRole('button', { name: /passer à la caisse|checkout/i })`).
    - expect: La `CheckoutPage` est chargée (titre/heading approprié visible)
    - expect: Les éléments de formulaire d'adresse sont présents (Nom, Prénom, Adresse, Code postal, Ville, Pays) avec `getByRole('textbox')` et `getByRole('combobox')`
  2. Remplir le formulaire d'adresse avec données de test : Nom 'Test', Prénom 'Client', Adresse 'Rue de Test 10', CP '1000', Ville 'Bruxelles', Pays 'Belgique'.
    - expect: Les champs sont remplis et validés (contrôles d'erreur en place)
    - expect: Le bouton `Paiement` / `Payer` devient actif
  3. Remplir le paiement Stripe en mode test : détecter l'iframe Stripe et utiliser `frameLocator` pour remplir la carte de test `4242 4242 4242 4242`, MM/AA `12/34`, CVC `123`. Utiliser `getByRole('button', { name: /payer|confirmer/i })` pour soumettre.
    - expect: La soumission déclenche la demande de paiement vers Stripe (vérifier 200 OK réseau si possible)
    - expect: La page de confirmation s'affiche avec un message de succès et un numéro de commande (`getByRole('heading', { name: /commande confirmée|merci/i })`)
  4. Scénarios d'erreur paiement : utiliser la carte 4000 0000 0000 9995 (échec) pour vérifier le message d'erreur de paiement.
    - expect: Un message d'erreur de paiement est visible (`getByRole('alert')`), la commande n'est pas créée
    - expect: Les options pour réessayer ou changer de méthode de paiement sont proposées
  5. Critères de succès / échec
    - expect: Succès : commande créée, confirmation affichée et email de confirmation (si applicable) déclenché
    - expect: Échec : échec de paiement non géré ou absence totale de feedback => échouer le test et logguer la trace

#### 1.4. Confirmation & retour Dashboard

**File:** `specs/checkout-complet.md`

**Steps:**
  1. Depuis la page de confirmation, cliquer `Retour au tableau de bord` ou `Continuer`, vérifier la navigation.
    - expect: L'utilisateur est redirigé vers le dashboard
    - expect: La commande récente apparaît dans l'historique des commandes (`getByRole('list')` / `getByText` avec le numéro de commande)
  2. Critères de succès / échec
    - expect: Succès : navigation correcte et visibilité de la commande
    - expect: Échec : retour impossible ou commande non visible => échouer et capturer logs

#### 1.5. Tests complémentaires & régressions

**File:** `specs/checkout-complet.md`

**Steps:**
  1. Cas additionnels : test de locale FR (libellés en français), test de timeouts réseau, test de reconnexion après session expirée.
    - expect: Libellés en français 'Payer', 'Panier', 'Commande confirmée' sont visibles
    - expect: Les timeouts affichent des messages clairs et l'utilisateur peut réessayer
    - expect: Après expiration de session, l'utilisateur est redirigé vers login et peut se reconnecter
  2. Observations et recommandations de sélection : Prioriser `getByRole()` > `getByLabelText()` > `data-testid` si nécessaire. Utiliser `frameLocator` pour Stripe, et `waitForResponse()` pour vérifier les appels sensibles (paiement, création commande).
    - expect: Les sélecteurs sont robustes et accessibles
    - expect: Les tests incluent des attentes explicites et des timeouts raisonnables
