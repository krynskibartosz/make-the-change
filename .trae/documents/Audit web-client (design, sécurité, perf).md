# Rapport d’audit — `apps/web-client`

## Périmètre & méthode
- Périmètre strict : dossier `apps/web-client` (Next.js App Router, i18n, Supabase, Stripe, Tailwind v4, Playwright).
- Critères : conformité aux règles de design dans `.trae/rules/design.md` (direction esthétique forte, typo distinctive, palette intentionnelle, motion orchestrée, composition spatiale, détails/texture, éviter les patterns génériques).
- Vérifs complémentaires demandées : structure, revue composants/modules, qualité code, sécurité, performance/scalabilité, standards.

## Vue d’ensemble (stack & architecture)
- Framework : Next.js App Router (segment obligatoire `[locale]`) : [layout.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/app/%5Blocale%5D/layout.tsx#L1-L101).
- i18n : `next-intl` + middleware : [next.config.js](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/next.config.js#L1-L36), [middleware.ts](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/middleware.ts#L1-L49).
- UI : Tailwind v4 + UI partagée `@make-the-change/core/ui` : [globals.css](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/app/globals.css#L1-L5), [tailwind.config.js](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/tailwind.config.js#L1-L17).
- Données : Supabase (SSR + client) : `src/lib/supabase/*`.
- Paiements : Stripe (PaymentIntent + webhook + Elements) : [create-intent](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/app/api/payments/create-intent/route.ts#L1-L91), [webhook](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/app/api/webhooks/stripe/route.ts#L1-L89), [InvestClient](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/features/investment/invest-client.tsx#L1-L398).
- Qualité : TS strict, lint Biome, e2e Playwright : [package.json](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/package.json#L1-L57), [tsconfig.json](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/tsconfig.json#L1-L32), [playwright.config.ts](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/playwright.config.ts#L1-L85).

## Examen structurel (modules) — responsabilités & constats
### `src/app/[locale]` (routing, layouts, pages)
- **Layout racine** : assemble ThemeProvider + NextIntl + Cart providers + Header/Footer/BottomNav + cart overlays : [layout.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/app/%5Blocale%5D/layout.tsx#L67-L97).
  - Point fort : cohésion « shell » et intégration i18n/Cart homogène.
  - Point faible (perf/UX) : le layout SSR interroge Supabase pour l’utilisateur + profile avatar à chaque requête (risque coût/latence) : [layout.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/app/%5Blocale%5D/layout.tsx#L50-L66).
- **Pages catalogue produits** : mélange de fetch Supabase SSR et appel à une API interne via `fetch(baseUrl)`.
  - Bug critique prod : `baseUrl` dérive de `NEXT_PUBLIC_SUPABASE_URL` → en production, appel probable vers Supabase et non vers le site Next (erreur fonctionnelle) : [products/page.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/app/%5Blocale%5D/products/page.tsx#L25-L31).
  - Problème de cache : `fetch()` sans stratégie explicite (`no-store`/`revalidate`) alors que la page dépend d’état et d’un endpoint : même fichier.
- **Auth (server actions)** : login/register/forgot-password côté serveur.
  - Bon : mitigation open-redirect via validation `returnTo` : [actions.ts](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/app/%5Blocale%5D/(auth)/actions.ts#L34-L40).
  - Problème fonctionnel/sécurité UX : `forgotPassword` redirige vers `/reset-password` mais aucune page correspondante n’existe dans `src/app` (flow incomplet) : [actions.ts](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/app/%5Blocale%5D/(auth)/actions.ts#L89-L110) + recherche `reset-password`.

### `src/app/api` (routes backend)
- **`GET /api/products`** : filtre + limite via Zod.
  - Risque sécurité P0 : renvoie `details: error` au client en 500 (exposition d’info interne) : [route.ts](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/app/api/products/route.ts#L44-L47).
  - Problème d’architecture : utilise `createClient()` navigateur dans un handler serveur (confusion SSR vs client) : [route.ts](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/app/api/products/route.ts#L1-L23).
- **`POST /api/payments/create-intent`** : auth Supabase requise + création Customer/Intent.
  - Bon : user-id imposé côté serveur dans metadata : [create-intent](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/app/api/payments/create-intent/route.ts#L71-L81).
  - Risque P1 : `amount` est fourni par le client ; idéalement le serveur doit recalculer à partir d’une intention/commande persistant(e) (source de vérité).
- **Webhook Stripe** : signature vérifiée, RPC transactionnel côté DB.
  - Bon : `constructEvent` + retry 500 en cas d’échec DB : [webhook](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/app/api/webhooks/stripe/route.ts#L24-L83).
  - P1 : logs verbeux (`console.log`) + pas de rate-limit applicatif visible.

### `src/components` (UI transversale)
- **`components/layout/Header` et `Footer`** (clients) : masquage via `usePathname()`.
  - Non conformité design/perf : logique de routing dans composants clients, hydration inutile + risque de clignotement (SSR rend puis client retourne `null`) : [header.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/components/layout/header.tsx#L141-L165), [footer.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/components/layout/footer.tsx#L12-L20).
  - Recommandation : utiliser des route groups/layouts dédiés au lieu de masquer au runtime.
- **Composants UI** : `PageHero`, `SectionContainer`, `CategoryCard`, `StatsSection` (majoritairement client) ; `PageHero` respecte `motion-safe:` (bon exemple) : [page-hero.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/components/ui/page-hero.tsx#L48-L55).

### `src/features` (domain features)
- **Commerce / cart** : stockage local + normalisation Zod.
  - Bon : schéma Zod + clamp quantité + fail-safe storage : [cart-store.ts](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/features/commerce/cart/cart-store.ts#L1-L105).
  - P1 perf : cart overlay monté globalement dans layout (peut être conditionné/chargé à la demande si besoin).
- **Commerce / checkout** : action serveur calcule prix/stock côté DB.
  - Bon : totals recalculés côté serveur, pas depuis le client : [place-points-order.action.ts](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/features/commerce/checkout/place-points-order.action.ts#L57-L116).
  - Risque P0 scalabilité/intégrité : pas de transaction atomique (création order, items, mise à jour points séparées) + pas de décrément de stock (oversell possible) : [place-points-order.action.ts](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/features/commerce/checkout/place-points-order.action.ts#L117-L181).
- **Investment** : orchestration 3 étapes + Stripe Elements.
  - P2 design : `appearance: { theme: 'stripe' }` donne un rendu “Stripe default” et casse la direction esthétique ; préférer un thème custom aligné aux tokens.

### `src/lib`, `src/i18n`, `src/hooks`
- i18n middleware + routing OK ; matcher limité (à vérifier pour assets / API).
- `lib/supabase/admin.ts` : fallback silencieux sur ANON si service role manquant → comportement “admin” dégradé : (référence citée par l’agent) [admin.ts](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/lib/supabase/admin.ts).
- Hooks : présents (`use-toast`, `use-form-with-toast`) mais pas d’audit détaillé complet dans cet extrait (à compléter lors de la phase de corrections, avec scan systématique et check d’usage).

### `e2e/` (Playwright)
- Couverture e2e structurée (auth, commerce, investment, seed). Bon socle qualité : [playwright.config.ts](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/playwright.config.ts#L56-L85).
- Manque probable : tests unitaires (non présents dans scripts).

## Conformité aux règles de design (design.md) — écarts & non-conformités
### Direction esthétique & différenciation (écart majeur)
- L’UI repose fortement sur des patterns “Tailwind + UI kit” et un marketing gradient/blurs relativement standard ; on ne voit pas de direction typographique/signature forte.
- Aucun chargement de font pairing distinctif (`next/font`) n’est présent ; `body` utilise `font-sans` (donc rendu très proche “system/Inter-like” selon l’OS) : [layout.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/app/%5Blocale%5D/layout.tsx#L68-L70).

### Typographie (non conforme à la règle « éviter l’esthétique générique »)
- Absence de choix typographique explicitement assumé côté `web-client` (pas de display font, pas de “body font” dédiée).
- Recommandation : définir 2 fonts (display + body) + échelle typographique, et appliquer via variables/tokens.

### Couleurs & thème (plutôt conforme)
- Palette via `@make-the-change/core` semble cohérente (orientation nature/olive/amber), pas de cliché “purple gradient”.
- Risque : dérives locales (ex. `text-emerald-600` hardcodé) au lieu de tokens sémantiques : [invest-client.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/features/investment/invest-client.tsx#L268-L270).

### Motion (partiellement conforme)
- Conformité positive : usage `motion-safe:` dans `PageHero`.
- Non conformité : animations `animate-pulse` non conditionnées au reduced motion sur certaines pages (auth/dashboard) (constat de l’agent).

### Composition spatiale & détails (mitigé)
- Plusieurs sections utilisent blur/gradients/overlays ; mais peu d’éléments “signature” (textures, grilles éditoriales, asymétries, micro-interactions orchestrées) au-delà des effets standards.

## Sécurité — vulnérabilités & risques
### P0 (à corriger immédiatement)
- Exposition d’erreur interne dans `GET /api/products` (`details: error`) : [route.ts](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/app/api/products/route.ts#L44-L47).
- Intégrité points/stock non atomique + absence de décrément stock dans `placePointsOrderAction` (risque de double dépense / oversell) : [place-points-order.action.ts](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/features/commerce/checkout/place-points-order.action.ts#L117-L181).

### P1 (important)
- `createAdminClient` fallback sur ANON key (comportement admin silencieusement dégradé) : [admin.ts](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/lib/supabase/admin.ts).
- `POST /api/payments/create-intent` accepte `amount` client (doit être justifié par un objet serveur) : [create-intent](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/app/api/payments/create-intent/route.ts#L6-L17).
- Password reset flow incomplet (pas de page /reset-password) : [actions.ts](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/app/%5Blocale%5D/(auth)/actions.ts#L101-L109).

### Contrôles négatifs (bons signaux)
- Aucun `dangerouslySetInnerHTML`, aucun `eval/new Function` détecté dans `src/`.

## Performance & scalabilité
### P0/P1
- Hydratation globale trop large : Header/Footer/MobileBottomNav sont clients et montés dans le layout pour toutes les pages, puis masqués conditionnellement au runtime → coût inutile + risque de layout shift : [layout.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/app/%5Blocale%5D/layout.tsx#L79-L93), [header.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/components/layout/header.tsx#L156-L165), [footer.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/components/layout/footer.tsx#L12-L20).
- `products/page.tsx` : `fetch` non robuste + base URL incorrect (prod) + sérialisation JSON forcée (symptôme d’un problème de boundary) : [products/page.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/app/%5Blocale%5D/products/page.tsx#L25-L60).

### P2
- Multiplication des composants `use client` (46 fichiers) : acceptable mais à surveiller ; opportunités de rendre certains composants server-first.

## Conformité standards de code
- Positif : TS strict, validation Zod dans endpoints/actions, structure modulaire claire.
- À améliorer : cohérence SSR/client Supabase, stratégie de fetch/cache Next, centralisation du “site URL”, réduction de logique de routing dans composants UI.

## Recommandations prioritaires (résumé)
### P0 — Stop-the-line
- Corriger `products/page.tsx` (base URL) et rendre l’appel API interne robuste (ou supprimer l’API interne et requêter Supabase server-side).
- Retirer `details: error` des réponses API publiques (`/api/products`).
- Rendre `placePointsOrderAction` atomique (RPC DB) + décrément stock + anti double-dépense.

### P1 — Qualité, sécurité, UX
- Re-architecturer les layouts : route groups `(marketing)/(checkout)/(dashboard)/(auth)` pour éliminer le masquage `usePathname`.
- Ajouter une vraie direction typographique (display + body) et appliquer globalement.
- Normaliser les couleurs hardcodées vers tokens sémantiques.
- Harmoniser la motion (`motion-safe:` + `prefers-reduced-motion`) sur toutes les animations.

### P2 — Design “signature” (aligné design.md)
- Choisir une direction esthétique explicite (éditoriale/luxe/brutaliste/organique…) et la décliner : textures légères (grain), grille asymétrique, moments d’animation orchestrés (stagger au load), détails de bordures/ombres cohérents.

---

# Plan d’action proposé (implémentation)

## 1) Correctifs P0 (fonctionnels & sécurité)
- Réparer la récupération produits : remplacer `baseUrl` par un util `getSiteUrl()` basé sur headers/env (Next) ou utiliser `fetch('/api/products')` côté server avec `headers()`.
- Rendre `/api/products` server-correct : utiliser `createClient` serveur, supprimer `details` dans les erreurs publiques, ajouter des codes d’erreur stables.
- Introduire une RPC Supabase pour checkout points : transaction (insert order+items, update wallet, decrement stock) avec contraintes d’idempotence.

## 2) Refactor layout/perf
- Créer des route groups dédiés pour séparer “marketing shell” et surfaces app.
- Déplacer Header/Footer hors layout global quand non nécessaires ; réduire hydratation.

## 3) Conformité design.md (typo, motion, différenciation)
- Mettre en place un pairing typographique non-générique via `next/font` (display + body) + variables CSS.
- Auditer et remplacer couleurs hardcodées par tokens sémantiques.
- Ajouter `motion-safe:` et alternative reduced-motion sur toutes les animations existantes.

## 4) Hardening & observabilité
- Standardiser la gestion d’erreurs API (pas de leaks, logs structurés côté serveur).
- Ajouter garde-fous env : échec explicite si variables critiques absentes (admin/stripe).
- Ajouter rate limiting minimal sur routes sensibles (webhooks/create-intent) si possible au niveau app ou infra.

## 5) Qualité (tests)
- Étendre Playwright sur les flux corrigés (produits + checkout points) et ajouter quelques tests unitaires ciblés (cart-store, util URL, validation).

---

Si vous validez ce plan, je passe en exécution et je fournis : patchs de code, tests/validation, et une check-list de conformité design.md après refonte.