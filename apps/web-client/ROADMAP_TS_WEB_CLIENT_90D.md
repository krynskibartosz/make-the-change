# Roadmap TypeScript/React 90 jours — web-client

## 1) Contexte et décisions verrouillées

### Résumé
Créer un plan exécutable détaillé qui transforme l’analyse des 30 articles Total TypeScript en backlog actionnable pour `web-client`, avec exécution sur 90 jours.

### Décisions verrouillées
1. Format: roadmap exécutable détaillée.
2. Emplacement: fichier dédié `ROADMAP_TS_WEB_CLIENT_90D.md`.
3. Première vague (J1-J14): `Type safety strict` en priorité.
4. Scope: `apps/web-client` + corrections minimales bloquantes hors scope (`packages/core` si nécessaire).

### Changements importants (API/interfaces/types publics)
1. Aucun changement runtime métier intentionnel.
2. Changements principalement type-level:
- activation progressive de `noUncheckedIndexedAccess` (après correction complète),
- introduction ciblée de patterns `satisfies`, `ComponentProps*`, `Extract`/`Exclude`/`NoInfer`,
- renforcement du workflow types Supabase (check de dérive).
3. Changements cross-package autorisés uniquement si bloquants pour `web-client` (ex: `../../packages/core/src/shared/utils/color.ts`).

## 2) Baseline technique actuelle

Constats mesurés (source repo actuelle):

1. `React.FC` / `FC<...>`: `0`
2. `as unknown as`: `0`
3. `ComponentProps*`: `0`
4. `satisfies`: `5`
5. `dangerouslySetInnerHTML`: `2`
- `src/app/[locale]/(marketing)/products/[id]/product-details.tsx`
- `src/app/[locale]/(marketing)/projects/[slug]/project-details.tsx`
6. `noUncheckedIndexedAccess` (simulation): `31` erreurs
- `src/app/[locale]/(marketing-no-footer)/cart/_features/cart-provider.tsx` (9)
- `src/app/[locale]/admin/cms/_features/components/page-editor.tsx` (4)
- `src/app/[locale]/cart/page.tsx` (3)
- `src/app/[locale]/(marketing-no-footer)/cart/_features/cart-sheet.tsx` (3)
- `../../packages/core/src/shared/utils/color.ts` (3)
- `src/app/[locale]/(marketing)/(home)/_features/diversity-fact-loader.tsx` (2)
- `src/app/[locale]/(dashboard)/dashboard/settings/appearance/_features/theme/actions.ts` (2)
- `src/app/[locale]/(dashboard)/_features/dashboard-welcome.tsx` (2)
- `src/components/profile/profile-header.tsx` (1)
- `src/app/[locale]/(marketing)/products/_features/product-card.tsx` (1)
- `src/app/[locale]/(dashboard)/dashboard/profile/actions.ts` (1)

### Baseline pilote `exactOptionalPropertyTypes` (marketing, local-only)
1. Infra pilote ajoutée:
- `tsconfig.exact-optional.pilot.base.json`
- `tsconfig.exact-optional.pilot.marketing.json`
- scripts `type-check:exact-optional:pilot:marketing` et `type-check:exact-optional:pilot`
2. Résultat actuel:
- `pnpm --filter @make-the-change/web-client type-check:exact-optional:pilot:marketing` = vert.
- `pnpm --filter @make-the-change/web-client type-check` = vert.
- `pnpm --filter @make-the-change/web-client lint` = vert.
- `pnpm --filter @make-the-change/web-client exec tsc --noEmit --noUncheckedIndexedAccess` = vert.

## 3) Objectifs 30/60/90 jours

### Objectif 30 jours
1. Résorber les erreurs `noUncheckedIndexedAccess` prioritaires.
2. Préparer l’activation de `noUncheckedIndexedAccess` sans régression type/lint.
3. Démarrer l’adoption `ComponentProps*` et `satisfies` sur composants/fichiers cibles.

### Objectif 60 jours
1. Supprimer `dangerouslySetInnerHTML` restant pour JSON-LD.
2. Mettre en place la gouvernance CI des métriques TS.
3. Stabiliser le workflow Supabase type drift (`db:types:check`).

### Objectif 90 jours
1. Conventions outillées et appliquées sur les zones critiques.
2. KPIs stables sur au moins 2 itérations.
3. Roadmap marquée "adoptée" avec playbook de maintenance.

## 4) Lots d’exécution (ordre strict)

### Lot 0 (J1-J2) — Instrumentation et baseline immuable
1. Ajouter dans la roadmap les commandes de baseline:
- `pnpm --filter @make-the-change/web-client type-check`
- `pnpm --filter @make-the-change/web-client lint`
- `pnpm --filter @make-the-change/web-client exec tsc --noEmit --noUncheckedIndexedAccess`
- `rg` metrics (`ComponentProps*`, `satisfies`, `dangerouslySetInnerHTML`)
2. Définir seuils cibles à 90 jours.
3. Aucun changement runtime.

Critère de sortie:
- Baseline chiffrée documentée + reproductible.

### Lot 1 (J3-J14) — Type safety strict (priorité absolue)
1. Corriger 31 erreurs `noUncheckedIndexedAccess` dans les fichiers listés ci-dessus.
2. Corriger d’abord `cart-provider` puis `cart-sheet` puis `cart/page.tsx`.
3. Corriger `page-editor` CMS et `profile-header`.
4. Appliquer fix minimal bloquant sur `../../packages/core/src/shared/utils/color.ts`.
5. Une fois erreurs à zéro, activer `noUncheckedIndexedAccess: true` dans `apps/web-client/tsconfig.json`.

Critère de sortie:
- `pnpm --filter @make-the-change/web-client exec tsc --noEmit --noUncheckedIndexedAccess` = 0 erreur.
- Puis `pnpm --filter @make-the-change/web-client type-check` + `lint` restent verts.

### Lot 2 (J15-J30) — Patterns TS/React à forte applicabilité
1. Introduire `ComponentProps*` sur wrappers/composants cibles:
- `src/components/ui/page-hero.tsx`
- `src/components/ui/section-container.tsx`
- `src/app/[locale]/(marketing)/_features/marketing-cta-band.tsx`
- `src/app/[locale]/(dashboard)/dashboard-sidebar.tsx`
- `src/components/layout/header.tsx`
2. Généraliser `satisfies` sur objets de config/maps statiques:
- nav config header/dashboard
- maps de statut (`dashboard-welcome`, `save-status-indicator`)
- configs home/marketing.
3. Introduire usages légitimes de `Extract`/`Exclude`/`NoInfer`:
- prioritairement dans `query-state`/status unions et helpers de résolution de valeur par défaut.
- pas d’usage “cosmétique”: chaque introduction doit supprimer un cast, un branch ambigu, ou une duplication de type.

Critère de sortie:
- `ComponentProps*` >= 10 usages utiles.
- `satisfies` >= 15 usages.
- au moins 1 cas réel utile pour chacun: `Extract`, `Exclude`, `NoInfer`.
- `type-check` + `lint` verts.

### Lot 3 (J31-J45) — Sécurité/SEO type-safe
1. Supprimer les 2 `dangerouslySetInnerHTML` restants:
- `src/app/[locale]/(marketing)/products/[id]/product-details.tsx`
- `src/app/[locale]/(marketing)/projects/[slug]/project-details.tsx`
2. Remplacer par `<script type="application/ld+json">{JSON.stringify(...)}</script>` avec payload validé.
3. Garder le rendu SEO identique.

Critère de sortie:
- `rg "dangerouslySetInnerHTML" src` = 0.
- Aucune régression visuelle sur pages produit/projet.

### Lot 4 (J46-J60) — Robustesse Supabase types (scope minimal bloquant)
1. Rendre opérationnel `db:types:generate` / `db:types:check` avec `SUPABASE_PROJECT_ID`.
2. Ajouter une étape CI “type drift” (échec si dérive `database.generated.ts`).
3. Limiter les changements `packages/core` aux corrections indispensables pour `web-client`.

Critère de sortie:
- Check de dérive actif en CI.
- Plus de blocage “types DB vs schéma réel” pour web-client.

### Lot 5 (J61-J75) — Conventions outillées
1. Étendre `TYPESCRIPT_REACT_CONVENTIONS.md` avec exemples “avant/après” du repo réel.
2. Ajouter un script métriques (ex: `pnpm ts:metrics`) documenté.
3. Ajouter une check CI simple sur métriques critiques:
- `React.FC` = 0
- `as unknown as` = 0
- `dangerouslySetInnerHTML` = 0

Critère de sortie:
- Conventions et métriques exécutables local/CI.

### Lot 6 (J76-J90) — Consolidation et passage en run mode
1. Stabiliser les KPIs sur 2 itérations sans régression.
2. Finaliser une section “playbook de refactor TS” dans le fichier roadmap.
3. Préparer backlog de maintenance trimestrielle.

Critère de sortie:
- Toutes gates vertes 2 semaines consécutives.
- Roadmap marquée “adoptée”.

## 5) Garde-fous CI, scripts et gouvernance

### Gates obligatoires
1. `pnpm --filter @make-the-change/web-client type-check`
2. `pnpm --filter @make-the-change/web-client lint`
3. `pnpm --filter @make-the-change/web-client exec tsc --noEmit --noUncheckedIndexedAccess`

### Métriques automatiques
1. compte `ComponentProps*`
2. compte `satisfies`
3. compte `dangerouslySetInnerHTML`
4. compte `as unknown as`

### Gate Supabase
1. `pnpm --filter @make-the-change/core db:types:check`

### Politique de gouvernance
1. Les métriques critiques doivent être visibles dans CI (log explicite + seuils).
2. Tout contournement temporaire doit être documenté avec date de retrait cible.
3. Les changements cross-package doivent rester minimaux et justifiés par blocage `web-client`.

## 6) KPIs de suivi hebdomadaire

KPIs cibles (à suivre tels quels):
1. `React.FC`: rester à `0`.
2. `as unknown as`: rester à `0`.
3. `dangerouslySetInnerHTML`: `2 -> 0`.
4. `ComponentProps*`: `0 -> 10+`.
5. `satisfies`: `5 -> 15+`.
6. `noUncheckedIndexedAccess` errors: `31 -> 0` puis flag activé.

Cadence de suivi:
1. Snapshot métriques chaque semaine.
2. Validation type-check/lint à chaque merge.
3. Revue bimensuelle de tendance KPI (régression/tendance stable/progression).

## 7) Risques et plans de mitigation

1. Risque: bruit de corrections lors de l’activation `noUncheckedIndexedAccess`.
- Mitigation: lot séquencé par hotspots + ordre imposé (cart, CMS, profile).

2. Risque: dérive entre schéma Supabase réel et types versionnés.
- Mitigation: gate CI `db:types:check` + process de régénération tracé.

3. Risque: adoption superficielle des nouveaux patterns (`satisfies`, utilitaires TS).
- Mitigation: critères de sortie mesurables (seuils + cas “utiles” prouvés).

4. Risque: effets de bord SEO lors de remplacement JSON-LD.
- Mitigation: smoke tests ciblés pages projet/produit + vérification visuelle et source.

5. Risque: scope creep cross-package.
- Mitigation: règle stricte “minimal bloquant uniquement” + traçabilité dans changelog de lot.

## 8) Definition of Done globale

1. Toutes commandes gates vertes:
- `type-check`
- `lint`
- `strict-indexed` (avec `noUncheckedIndexedAccess` activé)
- `db:types:check`

2. KPIs cibles atteints.
3. Aucune régression UI/SEO critique sur routes smoke.
4. Conventions et scripts outillés documentés.
5. Deux itérations successives sans régression KPI ni rollback qualité.

## Annexes (mapping articles -> actions)

### A. Mapping prioritaire des articles à la roadmap
1. Articles #14, #16, #24, #26, #28, #29 -> Lots 1-3 (impact direct élevé).
2. Articles #1, #4, #10, #19, #30 -> Lots 2 et 5 (conventions + généricité pragmatique).
3. Articles #2, #13, #22, #23 -> veille contrôlée / adoption conditionnelle (pas de big-bang).
4. Articles #7, #17, #27 -> introduction ciblée de `NoInfer`/`Extract`/`Exclude` (Lot 2).

### B. Tests et scénarios à inclure
1. Scénarios statiques:
- compile + lint + strict-indexed (3 commandes).
2. Smoke routes:
- `/[locale]`
- `/[locale]/products/[id]`
- `/[locale]/projects/[slug]`
- `/[locale]/cart`
- `/[locale]/dashboard`
3. Scénarios métier critiques:
- ajout/modif panier (provider/sheet/page cart),
- rendu JSON-LD produit/projet,
- settings thème dashboard.

Critère d’acceptation global:
- toutes commandes vertes,
- aucune régression UI/SEO critique sur routes smoke.

### C. Hypothèses et defaults explicites
1. Langue du fichier: français technique.
2. Pas de changement runtime métier volontaire.
3. Scope principal: `apps/web-client`.
4. Scope externe autorisé: uniquement blocages minimaux (`packages/core`).
5. Priorité de travail: strict type safety d’abord, patterns ensuite, puis SEO/Supabase gouvernance.
6. Politique de refactor: incrémentale, mesurée par KPI, sans big-bang.

### D. Playbook de refactor TS (run mode)
1. Toujours commencer par une baseline locale:
- `pnpm --filter @make-the-change/web-client type-check`
- `pnpm --filter @make-the-change/web-client lint`
- `pnpm --filter @make-the-change/web-client exec tsc --noEmit --noUncheckedIndexedAccess`
- `pnpm --filter @make-the-change/web-client ts:metrics`
2. Corriger d’abord les erreurs de sûreté type (`TS*`) avant le style/format.
3. Après chaque lot:
- relancer les 3 gates statiques,
- puis relancer `ts:metrics:check`.
4. Éviter les régressions:
- ne pas introduire `React.FC`, `as unknown as`, `dangerouslySetInnerHTML`,
- préférer `satisfies`/`ComponentProps*`/types utilitaires uniquement sur cas justifiés.
5. Pour toute dépendance au schéma Supabase:
- vérifier `pnpm --filter @make-the-change/core db:types:check` (si secrets disponibles),
- régénérer en cas de dérive confirmée.

### E. Backlog maintenance trimestrielle
1. Passe KPI mensuelle:
- comparaison tendances `ComponentProps*`, `satisfies`, utilitaires TS.
2. Passe “strictness”:
- vérifier qu’aucune règle TS stricte n’a été contournée.
3. Passe sécurité front:
- vérifier les scripts JSON-LD et l’absence de réintroduction `dangerouslySetInnerHTML`.
4. Passe Supabase:
- valider le drift check CI et la cohérence des types DB versionnés.
