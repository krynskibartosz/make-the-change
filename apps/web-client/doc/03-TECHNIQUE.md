# Make the Change — Référence Technique

> **Audience :** Développeur, IA reprenant le projet.
> Ce document décrit l'architecture réelle du code, les choix techniques et la feuille de route infrastructure.

---

## 1. Monorepo — Vue d'ensemble

Le projet est un **monorepo Turborepo** (pnpm workspaces).

```
repo-propre5/
├── apps/
│   ├── web-client/    ← App client finale (FOCUS ACTUEL)
│   └── web/           ← Back-office admin (MIS EN PAUSE)
├── packages/
│   └── core/          ← Design system & types partagés
└── turbo.json
```

### État actuel
- **`apps/web-client`** : prototype en développement actif, 100% données mock.
- **`apps/web`** : développé en premier, mis en pause. A sa propre DB plus complète mais basée sur une vision antérieure du produit. **Ne pas s'y référer comme source de vérité produit.**
- **`packages/core`** : design system (composants UI, thèmes, types i18n) utilisé par `web-client`.

### Architecture monorepo cible (future)
Quand `web-client` sera validé et branché à une DB :
- **`apps/web`** (back-office) : ORM [Drizzle](https://orm.drizzle.team/) + PostgreSQL.
- **`apps/web-client`** (client) : Supabase JS direct (pas d'ORM).
- **DB partagée** : une seule instance PostgreSQL (Supabase), accessible par les deux apps via des schémas séparés.
- **`packages/core`** : types DB partagés entre les deux apps.

---

## 2. Stack Technique — `apps/web-client`

| Couche | Technologie | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.1.0 |
| Langage | TypeScript | 5.9 |
| Styling | Tailwind CSS | v4 |
| Bundler | Turbopack | intégré Next.js |
| Auth / BDD | Supabase SSR | `@supabase/ssr` ^0.6 |
| Paiement | Stripe | `stripe` ^20, `@stripe/react-stripe-js` ^5 |
| i18n | next-intl | v4 |
| Formulaires | react-hook-form + Zod | ^7 / ^3 |
| Animations | Framer Motion | ^12 |
| Animations avancées | GSAP | ^3 |
| Smooth scroll | Lenis | ^1 |
| Rich-text | TipTap | ^2 |
| Composants headless | Base UI (`@base-ui/react`) | ^1.1 |
| Icônes | lucide-react | ^0.542 |
| DnD | @dnd-kit | ^6 / ^10 |
| Toast | Sonner | ^2 |
| React | React | ^19 |

### Démarrage local
```bash
pnpm dev   # Next.js sur port 3001 avec Turbopack
```

---

## 3. Source de Données : Mode Mock vs Supabase

Toute la logique de données est abstraite derrière une variable d'environnement.

```env
# .env.local
NEXT_PUBLIC_MTC_DATA_SOURCE=mock     # défaut — données fictives (développement)
NEXT_PUBLIC_MTC_DATA_SOURCE=supabase # données réelles (production)
```

```ts
// src/lib/mock/data-source.ts
export const isMockDataSource = APP_DATA_SOURCE === 'mock'
```

**Toutes les pages et layouts vérifient `isMockDataSource`** pour basculer entre :
- `src/lib/mock/mock-*.ts` — 23 fichiers de données fictives (academy, biodex, profils, challenges, factions, sessions, quests, inventaire…)
- `src/lib/supabase/server.ts` — client Supabase SSR pour les vraies requêtes

> ⚠️ Actuellement l'app tourne **100% en mode mock**. Le branchement Supabase est partiel (certaines pages ont les deux chemins codés mais le mock est la voie principale).

---

## 4. Architecture des Routes (`src/app/[locale]/`)

### Principes
- Toutes les routes sont préfixées par `[locale]` (FR/NL/EN via next-intl).
- Les **Route Groups** `(nom)` regroupent les pages par layout sans affecter l'URL.

### Les 5 onglets mobiles (source de vérité navigation)

| Onglet | Route visible | Destination réelle | Layout |
|---|---|---|---|
| Défis | `/defis` | `/aventure?tab=defis` | `(adventure)` |
| Projets | `/projets` | `/projects` | `(marketing)` |
| Collectif | `/collectif` | `/collectif` | `(adventure)` |
| Récompense | `/marche` | `/products` | `(marketing)` |
| Profil | `/dashboard/profile` | — | `(dashboard)` |

> `/defis`, `/projets`, `/marche` sont de simples pages de redirection alias.

### Route Groups et leurs layouts

| Groupe | URL typiques | Layout |
|---|---|---|
| `(marketing)` | `/`, `/projects`, `/products`, `/pricing` | Header + Footer + CartDock |
| `(marketing-no-footer)` | `/cart`, `/checkout` | Header uniquement |
| `(adventure)` | `/collectif`, `/aventure` | MobileBottomNav uniquement |
| `(dashboard)` | `/dashboard/profile`, `/dashboard/settings` | Sidebar (desktop) + MobileBottomNav |
| `(focus)` | `/blog`, `/faq`, `/contact`, `/about` | Layout minimal |
| `(auth)` | `/login`, `/register`, `/forgot-password` | Page centrée |

### Routes hors groupes (accessibles directement)

| Route | Statut | Notes |
|---|---|---|
| `/academy` | 🔬 Lab | Non public. Client-only (`'use client'`). |
| `/academy/[chapter]/[unit]` | 🔬 Lab | Moteur d'exercices. |
| `/academy/out-of-lives` | 🔬 Lab | Page "vies épuisées". |
| `/academy/training` | 🔬 Lab | Mini-quiz pour regagner 1 vie. |
| `/onboarding` | ✅ V1 | Tunnel 7 étapes. À améliorer. |
| `/admin/cms` | 🛠 Interne | CMS éditeur de pages. |
| `/kinnu-v2` | 🔬 Lab | Interface hexagonale Academy. |
| `/ecosysteme` | 🔬 Lab | Carte de l'écosystème. |

### Routes à supprimer (hors scope produit)

| Route | Raison |
|---|---|
| `/dashboard` (page principale) | Résidu desktop, remplacé par Profil mobile |
| `/dashboard/messages` | Messagerie producteurs, non mobile |
| `/leaderboard` | Abandonné |
| `/community/guilds` | Système de tribus abandonné |
| `/community/reels` | Jamais pensé mobile |
| `/community/posts/new` | Posts gérés par l'équipe uniquement |

---

## 5. Supabase — Schémas DB Actuels (Prototype)

> Ces schémas sont **partiellement implémentés** et coexistent avec le mode mock. Ils seront redessinés from scratch une fois le prototype `web-client` validé.

### Schéma `public`
| Table | Description |
|---|---|
| `profiles` | Profil utilisateur : `first_name`, `last_name`, `points_balance`, `user_level`, `kyc_status`, `avatar_url`, `faction` |
| `public_user_rankings` | Vue publique : `impact_score` par utilisateur |
| `public_producers` | Producteurs partenaires |

### Schéma `gamification`
| Table | Description |
|---|---|
| `user_challenges` | Défis complétés par utilisateur (`claimed_at`) |
| `challenges` | Définition des défis (`title`, `reward_badge`) |
| `user_inventory` | Inventaire items de l'utilisateur (`item_id`, `quantity`, `acquired_at`) |
| `items` | Catalogue des items (`slug`, `name_i18n`, `type`, `rarity`, `image_url`) |
| `quests` | Quêtes actives (`status`, `reward_graines`, `reward_items`) |
| `user_quests` | Progression utilisateur sur les quêtes (`progress`, `status`, `claimed_at`) |
| `xp_ledger` | Journal des gains XP/Graines (`amount`, `source_type`, `source_id`) |

### Schéma `investment`
| Table | Description |
|---|---|
| `investments` | Contributions financières (`amount_eur_equivalent`, `user_id`, `project_id`) |
| `projects` | Projets de conservation (`name_default`) |

### Schéma `identity`
| Table | Description |
|---|---|
| `user_consents` | Consentements RGPD enregistrés à l'inscription (`consent_type`, `consent_version`, `ip`, `user_agent`) |

---

## 6. DB Future — Ce que le Prototype Révèle

La DB future devra couvrir (au minimum) ces entités métier identifiées depuis `web-client` :

```
User
  - id, email, first_name, last_name
  - faction ('Vie Sauvage' | 'Terres & Forêts' | 'Gardiens des mers')
  - graines_balance (Int)
  - points_impact_balance (Int)
  - level ('explorateur' | 'protecteur' | 'ambassadeur')
  - avatar_url, streak_days

Project
  - id, slug, name, description, location
  - type ('don' | 'soutien')         ← distinction clé
  - goal_amount, current_amount
  - partner_id (→ Producer)
  - species_ids[] (→ Species)        ← espèces débloquées lors du soutien

Producer
  - id, slug, name, description
  - products[] (→ Product)

Product
  - id, slug, name, price_eur
  - points_impact_cost (nullable)    ← coût en Points d'Impact
  - producer_id (→ Producer)

Species (BioDex)
  - id, slug, name
  - rarity ('common' | 'rare' | 'epic' | 'legendary')
  - image_url, description, origin

UserSpecies
  - user_id, species_id
  - unlocked_at
  - level (Int, V2)

Investment (Soutien producteur)
  - id, user_id, project_id
  - amount_eur, points_impact_awarded
  - created_at

Donation (Don pur)
  - id, user_id, project_id
  - amount_eur, graines_awarded
  - created_at

Challenge
  - id, type, title, description
  - reward_graines

UserChallenge
  - user_id, challenge_id
  - completed_at, claimed_at

Quest
  - id, title, description, status
  - reward_graines, reward_items[]

UserQuest
  - user_id, quest_id
  - progress (0-100), status, claimed_at

Consent (RGPD)
  - user_id, consent_type, consent_version
  - granted, ip, user_agent, created_at
```

---

## 7. Sécurité & SEO

### Headers HTTP (configurés globalement dans `next.config.js`)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Schema.org JSON-LD
Injecté dans les layouts : `WebSite` + `Organization` + `SearchAction`.

### RGPD
Consentements (terms + privacy) enregistrés en DB à chaque inscription dans `identity.user_consents`.

---

## 8. Dettes Techniques Connues

| Priorité | Dette |
|---|---|
| 🔴 | `ignoreBuildErrors: true` dans `next.config.js` — les erreurs TypeScript passent en production |
| 🔴 | Bug faction : `actions.ts` utilise `'Artisans Locaux'` mais devrait être `'Gardiens des mers'` |
| 🟠 | `academy/page.tsx` (~975 lignes) entièrement `'use client'` — pas de Server Components |
| 🟠 | 31 erreurs `noUncheckedIndexedAccess` à corriger (cart, CMS, profile) |
| 🟠 | 2 `dangerouslySetInnerHTML` restants dans les pages produit/projet (JSON-LD) |
| 🟡 | `mock-academy.ts` (59 Ko) et `mock-biodex.ts` (51 Ko) trop volumineux |
| 🟡 | Fichiers `nextjsllms.txt` (3.4 Mo) non ignorés dans le repo |

### Roadmap TypeScript 90 jours
Un plan de correction de la type safety est documenté dans `ROADMAP_TS_WEB_CLIENT_90D.md`.

---

## 9. Configuration Environnement

```env
# Requis pour le mode Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Requis pour Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Source de données (mock par défaut)
NEXT_PUBLIC_MTC_DATA_SOURCE=mock

# URL publique de l'app
NEXT_PUBLIC_SITE_URL=https://make-the-change-web-client.vercel.app
```

Voir `.env.example` pour la liste complète.

---

## 10. Locales supportées

Fichier de référence : `packages/core/src/i18n/`
- `fr` — Français (locale par défaut)
- `nl` — Néerlandais
- `en` — Anglais
