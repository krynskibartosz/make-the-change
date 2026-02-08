# Audit UI — partage web ↔ web-client (composant par composant)

_Date de génération: 2026-02-05_

## Périmètre
- `packages/core/src/shared/ui`
- `apps/web/src`
- `apps/web-client/src`

_Note:_ ce scan inclut aussi les fichiers de routes Next (`page.tsx`, `layout.tsx`, `loading.tsx`, etc.).

## Comptage
- **core-ui**: 29 fichiers
- **web**: 47 fichiers
- **web-admin**: 139 fichiers
- **web-client**: 93 fichiers

## Observations rapides (high-signal)
- **Core UI Next-couplé**: 2 composants (`next/*`).
  - `packages/core/src/shared/ui/data-card.tsx`
  - `packages/core/src/shared/ui/pagination.tsx`
- **Core UI RHF-couplé**: 6 composants (bindings `react-hook-form`).
  - `packages/core/src/shared/ui/forms/form-checkbox.tsx`
  - `packages/core/src/shared/ui/forms/form-field.tsx`
  - `packages/core/src/shared/ui/forms/form-input.tsx`
  - `packages/core/src/shared/ui/forms/form-select.tsx`
  - `packages/core/src/shared/ui/forms/form-submit-button.tsx`
  - `packages/core/src/shared/ui/forms/form-textarea.tsx`
- **Doublons internes dans core UI**: 6 fichiers (probable héritage / migration incomplète).
  - `packages/core/src/shared/ui/badge.tsx`
  - `packages/core/src/shared/ui/button.tsx`
  - `packages/core/src/shared/ui/checkbox.tsx`
  - `packages/core/src/shared/ui/dialog.tsx`
  - `packages/core/src/shared/ui/input.tsx`
  - `packages/core/src/shared/ui/select.tsx`

## Priorités (pragmatique, sans casser l’existant)
### Quick wins (low-risk)
- Supprimer le code mort: `apps/web/src/app/[locale]/admin/(dashboard)/components/theme/theme-provider.tsx` (non utilisé; `apps/web/src/app/providers.tsx` utilise déjà `next-themes`).
- Remplacer le doublon `SimpleSelect` admin: `apps/web/src/app/[locale]/admin/(dashboard)/components/ui/select.tsx` → utiliser `SimpleSelect` depuis `@make-the-change/core/ui`.
- Mettre sous contrôle les doublons core UI (`packages/core/src/shared/ui/{badge,button,checkbox,dialog,input,select}.tsx`) une fois les imports “deep” vérifiés (grep avant suppression).

### Mutualisation probable (medium)
- Unifier “bottom sheet / drawer”: `apps/web-client/src/components/ui/bottom-sheet.tsx` et `apps/web/src/app/[locale]/admin/(dashboard)/components/ui/drawer.tsx` → extraire un composant `BottomSheet` dans `packages/core/src/shared/ui` (basé sur `Dialog` core), puis adapter les deux apps.

### Refactors structurants (higher)
- Découpler `packages/core/src/shared/ui/data-card.tsx` et `packages/core/src/shared/ui/pagination.tsx` de `next/*`:
  - option A: split en `core` (headless) + wrappers Next dans les apps,
  - option B: créer un sous-module “adapter” (ex: `core/ui/next`) et garder `core/ui` pur.
- Remplacer `apps/web/src/app/[locale]/admin/(dashboard)/components/ui/admin-list-item.tsx` par `DataListItem` core une fois celui-ci rendu Next-agnostic (ou au minimum sans `useRouter()`).

## Doublons cross-zone (même nom de fichier, hors pages/layout/loading/...)
- `projects-client` (3 fichiers; zones: web, web-admin, web-client)
  - `apps/web-client/src/app/[locale]/projects/projects-client.tsx`
  - `apps/web/src/app/[locale]/admin/(dashboard)/projects/projects-client.tsx`
  - `apps/web/src/app/[locale]/partner/(dashboard)/projects/projects-client.tsx`
- `select` (3 fichiers; zones: core-ui, web-admin)
  - `apps/web/src/app/[locale]/admin/(dashboard)/components/ui/select.tsx`
  - `packages/core/src/shared/ui/base/select.tsx`
  - `packages/core/src/shared/ui/select.tsx`
- `dashboard-client` (2 fichiers; zones: web, web-admin)
  - `apps/web/src/app/[locale]/admin/(dashboard)/dashboard/dashboard-client.tsx`
  - `apps/web/src/app/[locale]/partner/(dashboard)/dashboard/dashboard-client.tsx`
- `footer` (2 fichiers; zones: web-admin, web-client)
  - `apps/web-client/src/components/layout/footer.tsx`
  - `apps/web/src/app/[locale]/admin/(dashboard)/components/admin-layout/footer.tsx`
- `header` (2 fichiers; zones: web-admin, web-client)
  - `apps/web-client/src/components/layout/header.tsx`
  - `apps/web/src/app/[locale]/admin/(dashboard)/components/admin-layout/header.tsx`
- `localized-link` (2 fichiers; zones: web, web-client)
  - `apps/web-client/src/components/ui/localized-link.tsx`
  - `apps/web/src/components/localized-link.tsx`
- `orders-client` (2 fichiers; zones: web, web-admin)
  - `apps/web/src/app/[locale]/admin/(dashboard)/orders/orders-client.tsx`
  - `apps/web/src/app/[locale]/partner/(dashboard)/orders/orders-client.tsx`
- `products-client` (2 fichiers; zones: web-admin, web-client)
  - `apps/web-client/src/app/[locale]/products/products-client.tsx`
  - `apps/web/src/app/[locale]/admin/(dashboard)/products/products-client.tsx`
- `profile-form` (2 fichiers; zones: web, web-client)
  - `apps/web-client/src/app/[locale]/(dashboard)/dashboard/profile/profile-form.tsx`
  - `apps/web/src/app/[locale]/partner/(dashboard)/profile/profile-form.tsx`
- `sidebar` (2 fichiers; zones: web, web-admin)
  - `apps/web/src/app/[locale]/admin/(dashboard)/sidebar.tsx`
  - `apps/web/src/app/[locale]/partner/(dashboard)/sidebar.tsx`
- `theme-provider` (2 fichiers; zones: web-admin, web-client)
  - `apps/web-client/src/components/theme-provider.tsx`
  - `apps/web/src/app/[locale]/admin/(dashboard)/components/theme/theme-provider.tsx`
- `theme-toggle` (2 fichiers; zones: web-admin, web-client)
  - `apps/web-client/src/components/layout/theme-toggle.tsx`
  - `apps/web/src/app/[locale]/admin/(dashboard)/components/theme/theme-toggle.tsx`

## Liste détaillée
| Composant | Zone | Recommandation | Flags |
|---|---|---|---|
| `apps/web-client/src/app/[locale]/(auth)/forgot-password/page.tsx` | web-client | KEEP(web-client) | i18n(next-intl) |
| `apps/web-client/src/app/[locale]/(auth)/layout.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/app/[locale]/(auth)/login/page.tsx` | web-client | KEEP(web-client) | next, i18n(next-intl) |
| `apps/web-client/src/app/[locale]/(auth)/register/page.tsx` | web-client | KEEP(web-client) | i18n(next-intl) |
| `apps/web-client/src/app/[locale]/(dashboard)/dashboard-sidebar.tsx` | web-client | KEEP(web-client) | i18n(next-intl) |
| `apps/web-client/src/app/[locale]/(dashboard)/dashboard/investments/page.tsx` | web-client | KEEP(web-client) | i18n(next-intl), supabase |
| `apps/web-client/src/app/[locale]/(dashboard)/dashboard/loading.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/app/[locale]/(dashboard)/dashboard/messages/page.tsx` | web-client | KEEP(web-client) | next, supabase |
| `apps/web-client/src/app/[locale]/(dashboard)/dashboard/notifications/notifications-client.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/app/[locale]/(dashboard)/dashboard/notifications/page.tsx` | web-client | KEEP(web-client) | supabase |
| `apps/web-client/src/app/[locale]/(dashboard)/dashboard/orders/[id]/page.tsx` | web-client | KEEP(web-client) | next, i18n(next-intl), supabase |
| `apps/web-client/src/app/[locale]/(dashboard)/dashboard/orders/page.tsx` | web-client | KEEP(web-client) | i18n(next-intl), supabase |
| `apps/web-client/src/app/[locale]/(dashboard)/dashboard/page.tsx` | web-client | KEEP(web-client) | i18n(next-intl), supabase |
| `apps/web-client/src/app/[locale]/(dashboard)/dashboard/points/page.tsx` | web-client | KEEP(web-client) | i18n(next-intl), supabase |
| `apps/web-client/src/app/[locale]/(dashboard)/dashboard/profile/page.tsx` | web-client | KEEP(web-client) | supabase |
| `apps/web-client/src/app/[locale]/(dashboard)/dashboard/profile/profile-form.tsx` | web-client | KEEP(web-client) | i18n(next-intl) |
| `apps/web-client/src/app/[locale]/(dashboard)/dashboard/profile/profile-media-form.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/app/[locale]/(dashboard)/dashboard/settings/page.tsx` | web-client | KEEP(web-client) | supabase |
| `apps/web-client/src/app/[locale]/(dashboard)/dashboard/settings/settings-client.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/app/[locale]/(dashboard)/dashboard/subscription/page.tsx` | web-client | KEEP(web-client) | supabase |
| `apps/web-client/src/app/[locale]/(dashboard)/layout.tsx` | web-client | KEEP(web-client) | i18n(next-intl), supabase |
| `apps/web-client/src/app/[locale]/about/page.tsx` | web-client | KEEP(web-client) | i18n(next-intl) |
| `apps/web-client/src/app/[locale]/blog/[slug]/loading.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/app/[locale]/blog/[slug]/page.tsx` | web-client | KEEP(web-client) | next |
| `apps/web-client/src/app/[locale]/blog/category/[slug]/page.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/app/[locale]/blog/loading.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/app/[locale]/blog/page.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/app/[locale]/blog/tag/[tag]/page.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/app/[locale]/cart/page.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/app/[locale]/challenges/[slug]/page.tsx` | web-client | KEEP(web-client) | next |
| `apps/web-client/src/app/[locale]/challenges/page.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/app/[locale]/checkout/page.tsx` | web-client | KEEP(web-client) | i18n(next-intl), supabase |
| `apps/web-client/src/app/[locale]/checkout/success/page.tsx` | web-client | KEEP(web-client) | next, i18n(next-intl), supabase |
| `apps/web-client/src/app/[locale]/contact/page.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/app/[locale]/error.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/app/[locale]/faq/page.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/app/[locale]/how-it-works/page.tsx` | web-client | KEEP(web-client) | i18n(next-intl) |
| `apps/web-client/src/app/[locale]/layout.tsx` | web-client | KEEP(web-client) | next, i18n(next-intl), supabase |
| `apps/web-client/src/app/[locale]/leaderboard/loading.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/app/[locale]/leaderboard/page.tsx` | web-client | KEEP(web-client) | supabase |
| `apps/web-client/src/app/[locale]/loading.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/app/[locale]/not-found.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/app/[locale]/page.tsx` | web-client | KEEP(web-client) | i18n(next-intl), supabase |
| `apps/web-client/src/app/[locale]/privacy/page.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/app/[locale]/producers/[id]/contact/contact-form.tsx` | web-client | KEEP(web-client) | next, supabase |
| `apps/web-client/src/app/[locale]/producers/[id]/contact/page.tsx` | web-client | KEEP(web-client) | next, supabase |
| `apps/web-client/src/app/[locale]/products/[slug]/loading.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/app/[locale]/products/[slug]/page.tsx` | web-client | KEEP(web-client) | next, supabase |
| `apps/web-client/src/app/[locale]/products/[slug]/product-detail-client.tsx` | web-client | KEEP(web-client) | i18n(next-intl) |
| `apps/web-client/src/app/[locale]/products/loading.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/app/[locale]/products/page.tsx` | web-client | KEEP(web-client) | i18n(next-intl), supabase |
| `apps/web-client/src/app/[locale]/products/products-client.tsx` | web-client | KEEP(web-client) | i18n(next-intl) |
| `apps/web-client/src/app/[locale]/profile/[id]/page.tsx` | web-client | KEEP(web-client) | next, supabase |
| `apps/web-client/src/app/[locale]/projects/[slug]/invest/page.tsx` | web-client | KEEP(web-client) | next, i18n(next-intl), supabase |
| `apps/web-client/src/app/[locale]/projects/[slug]/loading.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/app/[locale]/projects/[slug]/page.tsx` | web-client | KEEP(web-client) | next, supabase |
| `apps/web-client/src/app/[locale]/projects/[slug]/project-client.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/app/[locale]/projects/loading.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/app/[locale]/projects/page.tsx` | web-client | KEEP(web-client) | i18n(next-intl), supabase |
| `apps/web-client/src/app/[locale]/projects/projects-client.tsx` | web-client | KEEP(web-client) | i18n(next-intl) |
| `apps/web-client/src/app/[locale]/terms/page.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/components/dashboard/activity-timeline.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/components/dashboard/dashboard-welcome.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/components/dashboard/stat-card.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/components/layout/dashboard-mobile-header.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/components/layout/dashboard-page-layout.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/components/layout/dashboard-sidebar-context.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/components/layout/footer.tsx` | web-client | KEEP(web-client) | i18n(next-intl) |
| `apps/web-client/src/components/layout/header.tsx` | web-client | KEEP(web-client) | i18n(next-intl) |
| `apps/web-client/src/components/layout/main-content.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/components/layout/mega-menu.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/components/layout/mobile-bottom-nav.tsx` | web-client | KEEP(web-client) | i18n(next-intl) |
| `apps/web-client/src/components/layout/theme-toggle.tsx` | web-client | KEEP(web-client) | themes(next-themes) |
| `apps/web-client/src/components/profile/profile-header.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/components/theme-provider.tsx` | web-client | KEEP(web-client) | themes(next-themes) |
| `apps/web-client/src/components/ui/bottom-sheet.tsx` | web-client | CANDIDATE(move to core as BottomSheet) |  |
| `apps/web-client/src/components/ui/category-card.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/components/ui/localized-link.tsx` | web-client | KEEP(web-client) ⚠️i18n-coupled |  |
| `apps/web-client/src/components/ui/page-hero.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/components/ui/section-container.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/components/ui/stats-section.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/features/commerce/cart/cart-button.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/features/commerce/cart/cart-dock.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/features/commerce/cart/cart-line-item.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/features/commerce/cart/cart-provider.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/features/commerce/cart/cart-sheet.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/features/commerce/cart/cart-snackbar.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/features/commerce/cart/cart-ui-provider.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/features/commerce/cart/quantity-stepper.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/features/commerce/cart/quick-add-button.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/features/commerce/checkout/checkout-client.tsx` | web-client | KEEP(web-client) | forms(RHF), forms(resolvers), zod |
| `apps/web-client/src/features/investment/invest-client.tsx` | web-client | KEEP(web-client) |  |
| `apps/web-client/src/features/leaderboard/leaderboard-view.tsx` | web-client | KEEP(web-client) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/admin-layout/admin-page-layout.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/admin-layout/content.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/admin-layout/filter-modal.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/admin-layout/footer.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/admin-layout/generic-filters.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/admin-layout/header.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/form/form-autocomplete.tsx` | web-admin | KEEP(web/admin) | forms(RHF) |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/form/form-date-field.tsx` | web-admin | KEEP(web/admin) | forms(RHF) |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/form/form-images-uploader.tsx` | web-admin | KEEP(web/admin) | forms(RHF) |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/form/form-number-field.tsx` | web-admin | KEEP(web/admin) | forms(RHF) |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/form/form-toggle.tsx` | web-admin | KEEP(web/admin) | forms(RHF) |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/layout/admin-background-decoration.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/layout/admin-detail-header.tsx` | web-admin | KEEP(web/admin) | next |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/layout/admin-detail-layout.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/layout/admin-footer.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/layout/admin-header.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/layout/admin-mobile-header.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/layout/admin-page-container.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/layout/admin-page-header.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/layout/admin-pagination.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/layout/admin-sidebar-context.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/layout/admin-sidebar.tsx` | web-admin | KEEP(web/admin) | i18n(next-intl), supabase, motion(framer) |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/layout/mobile-context.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/layout/mobile-header.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/layout/mobile-sidebar.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/orders/order-list-item.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/partners/partner-list-item.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/projects/project-list-header.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/projects/project-list-item.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/projects/project-list-metadata.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/subscriptions/subscription-list-header.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/subscriptions/subscription-list-item.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/subscriptions/subscription-list-metadata.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/theme/compact-theme-toggle.tsx` | web-admin | KEEP(web/admin) | base-ui, themes(next-themes) |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/theme/theme-provider.tsx` | web-admin | DELETE(unused) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/theme/theme-toggle.tsx` | web-admin | KEEP(web/admin) | base-ui, themes(next-themes) |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/ui/admin-list-item.tsx` | web-admin | CANDIDATE(replace with core DataListItem after Next-decouple) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/ui/chart.tsx` | web-admin | KEEP(web/admin) | nivo |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/ui/chevron-icon.tsx` | web-admin | CANDIDATE(extract to core or inline in DataListItem) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/ui/drawer.tsx` | web-admin | CANDIDATE(extract to core as BottomSheet/Drawer) | base-ui |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/ui/select.tsx` | web-admin | REPLACE(with core SimpleSelect) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/ui/single-autocomplete.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/ui/submit-button.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/ui/tags-autocomplete.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/ui/toast.tsx` | web-admin | KEEP(web/admin) | base-ui |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/ui/toaster.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/ui/view-toggle.tsx` | web-admin | KEEP(web/admin) | i18n(next-intl) |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/users/user-list-header.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/users/user-list-item.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/components/users/user-list-metadata.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/dashboard/dashboard-client.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/dashboard/page.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/error.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/layout.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/loading.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/orders/[id]/components/order-breadcrumbs.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/orders/[id]/components/order-compact-header.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/orders/[id]/components/order-detail-controller.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/orders/[id]/components/order-detail-layout.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/orders/[id]/components/order-details-editor.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/orders/[id]/not-found.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/orders/[id]/order-edit-client.tsx` | web-admin | KEEP(web/admin) | tanstack |
| `apps/web/src/app/[locale]/admin/(dashboard)/orders/[id]/page.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/orders/loading.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/orders/orders-client.tsx` | web-admin | KEEP(web/admin) | next |
| `apps/web/src/app/[locale]/admin/(dashboard)/orders/page.tsx` | web-admin | KEEP(web/admin) | next, i18n(next-intl) |
| `apps/web/src/app/[locale]/admin/(dashboard)/partners/[id]/components/partner-breadcrumbs.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/partners/[id]/components/partner-compact-header.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/partners/[id]/components/partner-detail-controller.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/partners/[id]/components/partner-detail-layout.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/partners/[id]/components/partner-details-editor.tsx` | web-admin | KEEP(web/admin) | forms(RHF) |
| `apps/web/src/app/[locale]/admin/(dashboard)/partners/[id]/page.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/partners/[id]/partner-edit-client.tsx` | web-admin | KEEP(web/admin) | tanstack |
| `apps/web/src/app/[locale]/admin/(dashboard)/partners/loading.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/partners/new/page.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/partners/new/partners-new-client.tsx` | web-admin | KEEP(web/admin) | forms(RHF), tanstack |
| `apps/web/src/app/[locale]/admin/(dashboard)/partners/page.tsx` | web-admin | KEEP(web/admin) | next, i18n(next-intl) |
| `apps/web/src/app/[locale]/admin/(dashboard)/partners/partners-client.tsx` | web-admin | KEEP(web/admin) | next |
| `apps/web/src/app/[locale]/admin/(dashboard)/products/[id]/components/product-breadcrumbs.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/products/[id]/components/product-compact-header.tsx` | web-admin | KEEP(web/admin) | next, i18n(next-intl) |
| `apps/web/src/app/[locale]/admin/(dashboard)/products/[id]/components/product-detail-controller.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/products/[id]/components/product-detail-layout.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/products/[id]/components/product-details-editor.tsx` | web-admin | KEEP(web/admin) | i18n(next-intl) |
| `apps/web/src/app/[locale]/admin/(dashboard)/products/[id]/components/save-status-indicator.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/products/[id]/components/simple-form-components.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/products/[id]/page.tsx` | web-admin | KEEP(web/admin) | next, i18n(next-intl) |
| `apps/web/src/app/[locale]/admin/(dashboard)/products/[id]/product-edit-client.tsx` | web-admin | KEEP(web/admin) | i18n(next-intl), forms(RHF), tanstack, forms(resolvers) |
| `apps/web/src/app/[locale]/admin/(dashboard)/products/components/product-card-skeleton.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/products/components/product-filter-modal.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/products/components/product.tsx` | web-admin | KEEP(web/admin) | i18n(next-intl) |
| `apps/web/src/app/[locale]/admin/(dashboard)/products/loading.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/products/new/page.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/products/new/products-new-client.tsx` | web-admin | KEEP(web/admin) | forms(RHF), forms(resolvers) |
| `apps/web/src/app/[locale]/admin/(dashboard)/products/page.tsx` | web-admin | KEEP(web/admin) | next, i18n(next-intl) |
| `apps/web/src/app/[locale]/admin/(dashboard)/products/products-client.tsx` | web-admin | KEEP(web/admin) | next, i18n(next-intl) |
| `apps/web/src/app/[locale]/admin/(dashboard)/projects/[id]/components/project-breadcrumbs.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/projects/[id]/components/project-compact-header.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/projects/[id]/components/project-detail-controller.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/projects/[id]/components/project-detail-layout.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/projects/[id]/components/project-details-editor.tsx` | web-admin | KEEP(web/admin) | forms(RHF) |
| `apps/web/src/app/[locale]/admin/(dashboard)/projects/[id]/page.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/projects/[id]/project-edit-client.tsx` | web-admin | KEEP(web/admin) | tanstack |
| `apps/web/src/app/[locale]/admin/(dashboard)/projects/loading.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/projects/map/page.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/projects/map/projects-map-client.tsx` | web-admin | KEEP(web/admin) | next |
| `apps/web/src/app/[locale]/admin/(dashboard)/projects/new/page.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/projects/new/projects-new-client.tsx` | web-admin | KEEP(web/admin) | forms(RHF), tanstack, forms(resolvers) |
| `apps/web/src/app/[locale]/admin/(dashboard)/projects/page.tsx` | web-admin | KEEP(web/admin) | next, i18n(next-intl) |
| `apps/web/src/app/[locale]/admin/(dashboard)/projects/projects-client.tsx` | web-admin | KEEP(web/admin) | next, tanstack |
| `apps/web/src/app/[locale]/admin/(dashboard)/sidebar.tsx` | web-admin | KEEP(web/admin) | motion(framer) |
| `apps/web/src/app/[locale]/admin/(dashboard)/subscriptions/[id]/components/subscription-breadcrumbs.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/subscriptions/[id]/components/subscription-compact-header.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/subscriptions/[id]/components/subscription-detail-controller.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/subscriptions/[id]/components/subscription-detail-layout.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/subscriptions/[id]/components/subscription-details-editor.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/subscriptions/[id]/page.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/subscriptions/[id]/subscription-edit-client.tsx` | web-admin | KEEP(web/admin) | tanstack |
| `apps/web/src/app/[locale]/admin/(dashboard)/subscriptions/components/subscription-status-badge.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/subscriptions/loading.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/subscriptions/new/page.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/subscriptions/new/subscriptions-new-client.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/subscriptions/page.tsx` | web-admin | KEEP(web/admin) | next, i18n(next-intl) |
| `apps/web/src/app/[locale]/admin/(dashboard)/subscriptions/subscriptions-client.tsx` | web-admin | KEEP(web/admin) | next, tanstack |
| `apps/web/src/app/[locale]/admin/(dashboard)/users/[id]/components/user-breadcrumbs.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/users/[id]/components/user-compact-header.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/users/[id]/components/user-detail-controller.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/users/[id]/components/user-detail-layout.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/users/[id]/components/user-details-editor.tsx` | web-admin | KEEP(web/admin) | forms(RHF) |
| `apps/web/src/app/[locale]/admin/(dashboard)/users/[id]/page.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/users/[id]/user-edit-client.tsx` | web-admin | KEEP(web/admin) | tanstack |
| `apps/web/src/app/[locale]/admin/(dashboard)/users/loading.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/users/new/page.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(dashboard)/users/new/users-new-client.tsx` | web-admin | KEEP(web/admin) | forms(RHF) |
| `apps/web/src/app/[locale]/admin/(dashboard)/users/page.tsx` | web-admin | KEEP(web/admin) | next, i18n(next-intl) |
| `apps/web/src/app/[locale]/admin/(dashboard)/users/users-client.tsx` | web-admin | KEEP(web/admin) | next |
| `apps/web/src/app/[locale]/admin/(public)/login/components/form-error.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(public)/login/components/sign-in-form.tsx` | web-admin | KEEP(web/admin) | next |
| `apps/web/src/app/[locale]/admin/(public)/login/components/sign-in-section.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/admin/(public)/login/page.tsx` | web-admin | KEEP(web/admin) |  |
| `apps/web/src/app/[locale]/layout.tsx` | web | KEEP(web) | next, i18n(next-intl) |
| `apps/web/src/app/[locale]/page.tsx` | web | KEEP(web) |  |
| `apps/web/src/app/[locale]/partner/(dashboard)/components/partner-mobile-header.tsx` | web | KEEP(web) |  |
| `apps/web/src/app/[locale]/partner/(dashboard)/dashboard/dashboard-client.tsx` | web | KEEP(web) |  |
| `apps/web/src/app/[locale]/partner/(dashboard)/dashboard/page.tsx` | web | KEEP(web) |  |
| `apps/web/src/app/[locale]/partner/(dashboard)/error.tsx` | web | KEEP(web) |  |
| `apps/web/src/app/[locale]/partner/(dashboard)/layout.tsx` | web | KEEP(web) |  |
| `apps/web/src/app/[locale]/partner/(dashboard)/loading.tsx` | web | KEEP(web) |  |
| `apps/web/src/app/[locale]/partner/(dashboard)/orders/orders-client.tsx` | web | KEEP(web) |  |
| `apps/web/src/app/[locale]/partner/(dashboard)/orders/page.tsx` | web | KEEP(web) | next, i18n(next-intl) |
| `apps/web/src/app/[locale]/partner/(dashboard)/products/loading.tsx` | web | KEEP(web) |  |
| `apps/web/src/app/[locale]/partner/(dashboard)/products/page.tsx` | web | KEEP(web) | next, i18n(next-intl) |
| `apps/web/src/app/[locale]/partner/(dashboard)/products/partner-products-client.tsx` | web | KEEP(web) | next |
| `apps/web/src/app/[locale]/partner/(dashboard)/profile/page.tsx` | web | KEEP(web) | next, i18n(next-intl) |
| `apps/web/src/app/[locale]/partner/(dashboard)/profile/profile-form.tsx` | web | KEEP(web) | i18n(next-intl) |
| `apps/web/src/app/[locale]/partner/(dashboard)/projects/page.tsx` | web | KEEP(web) | next, i18n(next-intl) |
| `apps/web/src/app/[locale]/partner/(dashboard)/projects/projects-client.tsx` | web | KEEP(web) |  |
| `apps/web/src/app/[locale]/partner/(dashboard)/sidebar.tsx` | web | KEEP(web) | motion(framer) |
| `apps/web/src/app/[locale]/partner/layout.tsx` | web | KEEP(web) |  |
| `apps/web/src/app/[locale]/partner/messages/page.tsx` | web | KEEP(web) | next, supabase |
| `apps/web/src/app/layout.tsx` | web | KEEP(web) | next |
| `apps/web/src/app/page.tsx` | web | KEEP(web) | next |
| `apps/web/src/app/providers.tsx` | web | KEEP(web) | next, tanstack, themes(next-themes) |
| `apps/web/src/components/home/featured-projects-section.tsx` | web | KEEP(web) | motion(framer) |
| `apps/web/src/components/home/hero-section.tsx` | web | KEEP(web) | motion(framer) |
| `apps/web/src/components/home/impact-metrics-section.tsx` | web | KEEP(web) | motion(framer) |
| `apps/web/src/components/home/kpi-metrics-section.tsx` | web | KEEP(web) | motion(framer) |
| `apps/web/src/components/images/image-gallery/image-gallery-modal.tsx` | web | KEEP(web) | next |
| `apps/web/src/components/images/image-manager/image-manager.tsx` | web | KEEP(web) | next |
| `apps/web/src/components/images/image-masonry/image-masonry.tsx` | web | KEEP(web) | next, dnd-kit |
| `apps/web/src/components/images/image-masonry/mobile-reorder-mode.tsx` | web | KEEP(web) | next |
| `apps/web/src/components/images/image-uploader/adapters/image-uploader-field.tsx` | web | KEEP(web) |  |
| `apps/web/src/components/images/image-uploader/components/image-action-buttons.tsx` | web | KEEP(web) |  |
| `apps/web/src/components/images/image-uploader/components/image-display.tsx` | web | KEEP(web) | next |
| `apps/web/src/components/images/image-uploader/components/image-input.tsx` | web | KEEP(web) |  |
| `apps/web/src/components/images/image-uploader/components/image-upload-area.tsx` | web | KEEP(web) |  |
| `apps/web/src/components/images/image-uploader/components/image-uploader.tsx` | web | KEEP(web) |  |
| `apps/web/src/components/images/image-uploader/components/multi-image-uploader.tsx` | web | KEEP(web) | next |
| `apps/web/src/components/images/image-uploader/components/round-action-button.tsx` | web | KEEP(web) |  |
| `apps/web/src/components/images/product-image/product-image.tsx` | web | KEEP(web) | next |
| `apps/web/src/components/language-switcher.tsx` | web | KEEP(web) | i18n(next-intl) |
| `apps/web/src/components/locale-switcher.tsx` | web | KEEP(web) | next |
| `apps/web/src/components/localized-link.tsx` | web | KEEP(web) ⚠️i18n-coupled | next |
| `apps/web/src/components/ui/date-picker.tsx` | web | CANDIDATE(move to core if reused) | motion(framer) |
| `apps/web/src/components/ui/image-upload.tsx` | web | KEEP(web) |  |
| `apps/web/src/components/ui/map-container.tsx` | web | KEEP(web) |  |
| `apps/web/src/components/ui/optimized-image-masonry.tsx` | web | KEEP(web) | next, dnd-kit |
| `packages/core/src/shared/ui/badge.tsx` | core-ui | CLEANUP(duplicate of base/*?) |  |
| `packages/core/src/shared/ui/base/badge.tsx` | core-ui | KEEP(core/base) |  |
| `packages/core/src/shared/ui/base/button.tsx` | core-ui | KEEP(core/base) | base-ui |
| `packages/core/src/shared/ui/base/checkbox.tsx` | core-ui | KEEP(core/base) | base-ui |
| `packages/core/src/shared/ui/base/dialog.tsx` | core-ui | KEEP(core/base) | base-ui |
| `packages/core/src/shared/ui/base/input.tsx` | core-ui | KEEP(core/base) |  |
| `packages/core/src/shared/ui/base/select.tsx` | core-ui | KEEP(core/base) | base-ui |
| `packages/core/src/shared/ui/base/textarea.tsx` | core-ui | KEEP(core/base) |  |
| `packages/core/src/shared/ui/button.tsx` | core-ui | CLEANUP(duplicate of base/*?) | base-ui |
| `packages/core/src/shared/ui/card.tsx` | core-ui | KEEP(core/composite) |  |
| `packages/core/src/shared/ui/checkbox.tsx` | core-ui | CLEANUP(duplicate of base/*?) | base-ui |
| `packages/core/src/shared/ui/data-card.tsx` | core-ui | REFACTOR(core but Next-coupled) | next |
| `packages/core/src/shared/ui/data-list.tsx` | core-ui | KEEP(core/composite) |  |
| `packages/core/src/shared/ui/detail-view.tsx` | core-ui | KEEP(core/composite) |  |
| `packages/core/src/shared/ui/dialog.tsx` | core-ui | CLEANUP(duplicate of base/*?) | base-ui |
| `packages/core/src/shared/ui/empty-state.tsx` | core-ui | KEEP(core/composite) |  |
| `packages/core/src/shared/ui/forms/field-shell.tsx` | core-ui | KEEP(core) ✅ (but move out of /forms if you decouple form libs) |  |
| `packages/core/src/shared/ui/forms/form-checkbox.tsx` | core-ui | KEEP(core/forms) ⚠️RHF-coupled | forms(RHF) |
| `packages/core/src/shared/ui/forms/form-field.tsx` | core-ui | KEEP(core/forms) ⚠️RHF-coupled | forms(RHF) |
| `packages/core/src/shared/ui/forms/form-input.tsx` | core-ui | KEEP(core/forms) ⚠️RHF-coupled | forms(RHF) |
| `packages/core/src/shared/ui/forms/form-select.tsx` | core-ui | KEEP(core/forms) ⚠️RHF-coupled | forms(RHF) |
| `packages/core/src/shared/ui/forms/form-submit-button.tsx` | core-ui | KEEP(core/forms) ⚠️RHF-coupled | forms(RHF) |
| `packages/core/src/shared/ui/forms/form-textarea.tsx` | core-ui | KEEP(core/forms) ⚠️RHF-coupled | forms(RHF) |
| `packages/core/src/shared/ui/input.tsx` | core-ui | CLEANUP(duplicate of base/*?) |  |
| `packages/core/src/shared/ui/list-container.tsx` | core-ui | KEEP(core/composite) |  |
| `packages/core/src/shared/ui/pagination.tsx` | core-ui | REFACTOR(core but Next-coupled) | next |
| `packages/core/src/shared/ui/progress.tsx` | core-ui | KEEP(core/composite) |  |
| `packages/core/src/shared/ui/select.tsx` | core-ui | CLEANUP(duplicate of base/*?) | base-ui |
| `packages/core/src/shared/ui/skeleton.tsx` | core-ui | KEEP(core/composite) |  |
