# Web-Client - Analyse Approfondie & Opportunites de Developpement

Contexte:
- Scope: `apps/web-client` uniquement.
- Stack: Next.js 16 (App Router) + Tailwind v4 + Base UI (via `@make-the-change/core/ui`) + next-intl + Supabase.
- Objectif produit: experience premium "app-like" mobile-first (dashboard + public) + e-commerce (points) + investissement (impact) + gamification/leaderboard.

Ce document liste:
- Ce qui existe deja.
- Les incoherences / dettes techniques.
- Tout ce qui peut etre developpe dans `web-client` (features + UX + infra).
- Une proposition de roadmap pragmatique.

---

## 1) Inventaire (Etat Actuel)

### Pages (routes) presentes
- Public:
  - `/[locale]` (Home)
  - `/[locale]/projects` + `/[locale]/projects/[slug]`
  - `/[locale]/products` + `/[locale]/products/[slug]`
  - `/[locale]/leaderboard`
  - `/[locale]/about`
  - `/[locale]/how-it-works`
  - `/[locale]/profile/[id]` (profil public)
- Auth:
  - `/[locale]/login`, `/[locale]/register`, `/[locale]/forgot-password`
- Dashboard:
  - `/[locale]/dashboard`
  - `/[locale]/dashboard/profile`
  - `/[locale]/dashboard/investments`
  - `/[locale]/dashboard/orders`
  - `/[locale]/dashboard/points`

### Navigation / Layout
- Bottom navigation mobile (public).
- Dashboard avec top bar mobile + sidebar (overlay mobile + sticky desktop).
- Mega menu desktop (Projects/Products) avec cartes images.
- Footer present sur desktop public seulement (et masque sur dashboard/auth/leaderboard).

### Gamification (etat)
- Calcul "Impact score" (points + projets + investissement) + niveaux + badges (milestones).
- Leaderboard UI mobile-first (podium + liste) base sur donnees simulees.
- Profil public base sur mock + fallback DB.

### Data access (etat)
- Incoherent:
  - Plusieurs pages utilisent Drizzle via `@make-the-change/core/db` (donc `DATABASE_URL`).
  - D'autres pages utilisent Supabase (`createClient`) et des vues `public_*`.
- Le README web-client annonce "pas de DB direct" + RLS via Supabase uniquement, mais ce n'est plus vrai.

### Schema disponible (packages/core)
Tables/objets utiles deja definis:
- Projets: `projects`, `projectUpdates`, `investments`, `species`, `producers`
- Commerce: `products`, `categories`, `orders`, `orderItems`, `subscriptions`
- Identite: `profiles`, `public_profiles`, `countries`, `userRoles`
- Contenu: `blogPosts`, `blogAuthors`, `mediaAssets`, `translationBatches`

---

## 2) Principales Dettes / Incoherences a Corriger (avant d'ajouter trop de features)

### 2.1 Data layer (P0)
Probleme:
- `apps/web-client/.env.example` ne declare pas `DATABASE_URL`, mais le code l'utilise (Drizzle).
- Le modele securite "RLS only" devient flou (risque de fuite de donnees et de config casse en prod).

Recommandation:
- Choisir 1 strategie et s'y tenir dans web-client:
  - Option A (recommandee): Supabase server client + RLS + vues `public_*` pour le public.
  - Option B: Drizzle DB direct (mais alors web-client devient un "server app" type admin, a verrouiller).

Plan d'alignement (Option A):
- Creer un dossier `apps/web-client/src/lib/data/`:
  - `public.ts` (lecture via `public_products`, `public_projects`, etc.)
  - `dashboard.ts` (lectures user-scoped via RLS)
  - `leaderboard.ts` (vue/materialized view si besoin)
- Remplacer progressivement les appels `@make-the-change/core/db` par Supabase.
- Retirer `drizzle-orm` du web-client si plus necessaire.

### 2.2 Middleware (session refresh + i18n)
Fichier: `apps/web-client/src/middleware.ts`
Risque:
- La logique "refresh session" construit une `response` mais retourne `intlMiddleware(request)` (perte potentielle des cookies refresh).
- Typage `any[]` sur cookies.
- Warning Next 16: convention middleware depreciee (passage vers "proxy").

Recommandation:
- Refactor: composer la reponse Supabase + next-intl correctement (retourner la reponse modifiee).
- Typage strict `SetAllCookies` (pas `any[]`).
- Migrer vers le mecanisme recommande par Next 16 (proxy) quand possible.

### 2.3 Build offline / fonts
Probleme:
- `next/font/google` telecharge Inter en build; en environnement sans reseau, `pnpm build` echoue.

Recommandation:
- Basculer sur `next/font/local` avec une font self-hosted (assets) ou system font stack.

### 2.4 Route architecture (eviter les hacks de rendu conditionnel)
Etat:
- Footer est client-side (usePathname) pour cacher selon route.

Recommandation:
- Passer a une architecture par route-groups avec layouts dedies:
  - `(public)` layout: header/footer/bottom-nav
  - `(auth)` layout: auth shell
  - `(dashboard)` layout: dashboard shell (pas header/footer public)
- Objectif: moins d'hydration inutile + moins de conditions runtime.

---

## 3) Ce Qui Peut Etre Developpe (Backlog "Idees -> Features")

### 3.1 Public / Marketing (conversion + SEO)
Opportunites:
- Pages manquantes (liens deja dans le footer):
  - `/faq`, `/contact`, `/privacy`, `/terms`
- SEO:
  - `sitemap.xml`, `robots.txt`, `opengraph-image` (OG), `twitter` cards
  - Schema.org (Organization, Product, BreadcrumbList, FAQPage)
  - `not-found.tsx` et `error.tsx` pour UX + SEO
- Contenu:
  - Blog (tables `blogPosts`, `blogAuthors`)
  - Pages "Partners/Producers" (liste des `producers` en public)
  - "Impact stories" (case studies) + pages thematiques
- i18n:
  - coverage des traductions sur toutes les pages et textes hardcodes
  - formatage par locale (dates, currency, pluriels)

UX mobile-first:
- Garder hero court (0-1 phrase max sur mobile).
- Preuve sociale "credible" (compteurs reels) proche des CTA.

### 3.2 Projects (discovery -> detail -> conversion)
Listing `/projects`:
- Filtres evolues (bottom sheet):
  - status, type (beehive/olive_tree/vineyard), location, impact metrics
  - tri (nouveau, populaire, financement restant, impact score)
- Map view:
  - Vue carte (Leaflet deja dans deps) + switch "Liste / Carte"
- Pagination / infinite scroll:
  - `Pagination` / `ListContainer` ou infinite scroll via cursor
- Etats de chargement:
  - skeleton / empty states plus precis

Detail `/projects/[slug]`:
- Hero image + gallery (`gallery_image_urls`) + overlay contraste standard.
- "Project updates" timeline (`projectUpdates`) avec medias (`mediaAssets`).
- Bloc "Impact metrics" plus riche, mais compact (cards).
- CTA principal: "Investir / Souscrire" (1 seul CTA) + sticky mobile.
- Partage:
  - share sheet (Web Share API), copy link, OG image.
- Preuve sociale:
  - nb d'investisseurs, nb updates, progression, (uniquement si vrai).

Conversion (Investissement):
- Wizard mobile:
  - choisir montant -> recap -> confirmation -> paiement -> success screen
- Regles points / bonus:
  - utiliser `packages/core/src/entities/investment/points-calculator.ts`
- Receipt/certificat:
  - generation d'un certificat (PDF plus tard) + sauvegarde dans `mediaAssets`

### 3.3 Products (catalog -> detail -> panier -> commande)
Listing `/products`:
- Tri + filtres:
  - categories, tags, stock, certifications, allergenes, methodes (ship/pickup)
- Cart/wishlist:
  - Mini panier (badge count) dans bottom nav ou top bar dashboard
  - Wishlist (favoris)

Detail `/products/[slug]`:
- Images produits:
  - utiliser `metadata.images` / `metadata.image_url` si present, sinon placeholder
  - gallery + zoom
- Variants:
  - taille, packs, couleurs si `variants` existe
- Checkout:
  - Flow "cart -> shipping -> recap -> paiement points"
  - Creation `orders` + `orderItems`
- Order tracking:
  - `tracking_number`, `carrier`, timeline status

Producers:
- Page producteur (public):
  - produits associes + story + certifications + localisation

### 3.4 Auth / Onboarding
Onboarding "app-like":
- Register wizard deja present -> ajout "completion" apres signup:
  - choisir avatar/cover (profil visuel)
  - choisir preferences (themes projets, categories produits)
  - choisir notif (email/push)
- Email verification:
  - ecran "verifiez votre email"
- Passwordless / magic link (optionnel).

### 3.5 Dashboard (retention + clarity)
Objectif:
- "Quick glance" + actions primaires dans la zone pouce (thumb zone).
- Chunking (Miller) + 1 action dominante par ecran.

Opportunites par page:
- `/dashboard`:
  - "Focus card" (1 KPI principal) + 2-3 mini KPIs
  - Section "Prochaine action" (1 CTA)
  - Activity timeline: clic -> detail (projet/commande)
- `/dashboard/profile`:
  - Privacy controls (profil public ON/OFF)
  - Statut KYC (`kyc_status`) + progression
  - Settings de notif / langue / timezone (schema: `language_code`, `timezone`)
- `/dashboard/investments`:
  - portefeuille: total, actifs, completes, rendement (si dispo)
  - timeline / documents / updates suivies
- `/dashboard/orders`:
  - details commande + tracking + support
- `/dashboard/points`:
  - breakdown: earned/spent + "ways to earn" (sans trop de texte)
  - regles de points (compactes, visuelles)

Settings manquants:
- `/dashboard/settings`:
  - theme, langue, notif, privacy, securite

Subscription:
- `/dashboard/subscription`:
  - plan actuel, points mensuels, upgrade/downgrade, facturation

### 3.6 Leaderboard + Communautaire (gamification 2026)
Leaderboard:
- Donner une source de verite:
  - vue SQL/materialized view: impact_score + rank (global, weekly, seasonal)
- Filtres:
  - Global / Pays / Ville / Team (si modelise)
  - Semaine / Mois / Saison (time windows)
- "Your rank" stick en haut + "delta rank" (trend).
- CTA: "Voir mon profil public" + "Partager".

Profil public:
- Construire autour de 3 sections:
  - Impact (KPI cards)
  - Achievements (badges)
  - Activite (projets soutenus / contributions)
- Follow/friends (optionnel):
  - suivre un utilisateur, feed social (plus tard)

Challenges / missions:
- Daily/weekly challenges (streak, objectifs)
- Milestones credibles (1er projet, 10 projets, top 10, etc.)
- "Season" mechanic: reset leaderboard + badges saisonniers

### 3.7 Support / Trust / Legal (essentiel prod)
- Support:
  - contact form + FAQ + support inbox (tickets)
- Legal:
  - privacy/terms/cookies
- Trust:
  - transparence sur calcul points/impact (visuel, pas roman)
  - securite compte (sessions, devices, 2FA optionnel)

---

## 4) Opportunites Tech (qualite, perf, DX)

### 4.1 Performance
- Convertir les `<img>` critiques en `next/image` (si pertinent) pour optimisation.
- Prefetch intelligent (Next Link) + preloads.
- Streaming/Suspense + skeletons sur listes lourdes.
- Reduction des client components via layouts route-group.

### 4.2 Accessibilite
- Mega menu: navigation clavier (fleches, focus trap, aria-controls) et close behavior.
- Bottom sheet: focus management + escape + scroll lock (Base UI deja bon).
- Contraste: overlay standard sur visuels (P1).

### 4.3 Qualite / Tests
- Tests unitaires:
  - `gamification.ts` (impact score, thresholds)
  - points calculator (core)
- E2E (Playwright):
  - login/register
  - navigation mobile bottom nav
  - leaderboard -> profil public
  - products -> detail -> (future) checkout

### 4.4 Observabilite
- Error reporting (Sentry ou equivalent).
- Logs cote server (rate limited).
- Web vitals tracking.

### 4.5 Securite
- RLS: valider que toutes les tables exposees ont des policies correctes.
- Eviter PII dans public views: ne jamais exposer email/phone.
- Upload images:
  - validations (type/size), storage buckets, antivirus optionnel

### 4.6 Hygiene deps / bundle
Deps presentes mais non utilisees (a confirmer):
- `@tanstack/react-query`
- `framer-motion`
- `leaflet` / `react-leaflet`
- `@hookform/resolvers`
Options:
- Les retirer pour reduire bundle.
- Ou les exploiter via features (map view, animations, caching).

---

## 5) Roadmap Proposee (Pragmatique)

### P0 (stabilite + securite + coherence)
- Unifier la data layer (Supabase RLS recommended) et supprimer `DATABASE_URL` dependency.
- Corriger middleware (session refresh + i18n) + migration proxy si necessaire.
- Ajouter routes manquantes: `faq/contact/privacy/terms` (meme minimal).
- Ajouter `not-found.tsx` + `error.tsx`.
- Self-host font (build stable).

### P1 (core loops: investir + acheter + profil)
- Projects:
  - detail complet (images + updates) + vrai flow d'investissement.
- Products:
  - images + variantes + mini panier -> checkout -> orders.
- Dashboard:
  - settings + subscription management (si actif).

### P2 (retention: gamification + social proof)
- Leaderboard dynamique (vue rank + trends).
- Profil public enrichi (achievements + activite).
- Challenges/missions (streaks).

### P3 (growth)
- Referral program.
- Blog / SEO content engine.
- Partner pages + stories.

---

## 6) Suggestions de Structuration du Code (web-client)

Proposition:
- `src/lib/data/*` (fetchers supabase typed)
- `src/features/*` (domain-driven: leaderboard, profile, commerce, investment)
- `src/components/ui/*` (composition wrappers: SurfaceCard/GlassCard, BottomSheet, etc.)
- `src/app/[locale]/(public|auth|dashboard)/*` (layouts route groups)

Objectif:
- Minimiser la duplication UI.
- Maximiser la reutilisation de `@make-the-change/core/ui`.
- Garder des pages "thin": page -> fetch -> compose components.

