# Audit complet `web-client` + `database_full.ts`

Date: 28 février 2026  
Périmètre: `apps/web-client`, `temp/database_full.ts`, `packages/core/src/shared/db/database.generated.ts`, `packages/core/src/shared/db/schema.ts`

## Résumé exécutif

`web-client` couvre déjà une large surface produit et contient des briques crédibles pour `community`, `projects`, `products`, `dashboard`, `gamification` et `BioDex`. La base est utile, mais l’application reste structurellement incomplète sur les parcours cœur métier et incohérente sur plusieurs contrats de données.

Les écarts les plus importants sont les suivants:

1. **Autorisation insuffisante sur le CMS embarqué dans `web-client`**: les routes `admin/cms` sont présentes dans l’app client, non protégées par le `proxy`, et les mutations CMS ne vérifient qu’une session authentifiée, pas un rôle admin.
2. **Parcours cœur produit incomplets**: la page `/checkout` est explicitement en mode placeholder, et la page dédiée `/projects/[slug]/invest` utilise un `InvestClient` factice alors qu’un vrai flux Stripe existe ailleurs mais n’est pas branché.
3. **Dérive forte de la sémantique produit**: `impact score`, `points balance`, `leaderboard`, `challenges` et `BioDex` ne reposent pas sur une définition unique entre UI, vues publiques et schéma DB.
4. **Drift app ↔ DB ↔ schéma code**: le module social actif dans `web-client` dépasse le périmètre de `schema.ts`, `temp/database_full.ts` retarde sur certains objets sociaux, et un objet réellement utilisé (`social.post_shares`) n’existe dans aucun des types DB inspectés.
5. **Dépendance implicite à RLS sur plusieurs écrans sensibles**: plusieurs lectures de données utilisateur reposent sur RLS sans filtre explicite côté code, ce qui rend l’intention moins lisible et augmente le risque en cas de régression de policy.

En synthèse:

- **La zone la plus avancée** est `community`.
- **La zone la plus fragile métier** est `investment + checkout + leaderboard`.
- **Le plus gros risque immédiat** est `CMS/authorization`.
- **Le plus gros frein d’évolution** est `drift du contrat de données`.

## Méthode

Analyse réalisée à partir de:

- l’inventaire complet des routes `page.tsx`, `layout.tsx`, `route.ts`
- la lecture ciblée des pages d’entrée par domaine
- la lecture des `lib/*` métiers (`social`, `gamification`, `investment`, `supabase`)
- la lecture des handlers API et Server Actions
- la comparaison de `temp/database_full.ts` avec `database.generated.ts` et `schema.ts`
- des scans textuels et des validations de build

Commandes de validation exécutées:

- `pnpm --filter @make-the-change/web-client type-check`
- `pnpm --filter @make-the-change/web-client build`
- scans `rg` pour `TODO|FIXME|HACK`, `placeholder|hardcoded|fake|mock`, `return null`, `createClient`, `auth.getUser`, `revalidatePath`

## Inventaire rapide de `web-client`

### Comptage

- Pages `page.tsx`: **85**
- Route handlers `route.ts`: **12**
- Layouts `layout.tsx`: **11**
- Fichiers déclarant `use client`: **116**
- Fichiers de Server Actions détectés: **14**
- Occurrences `createClient()`: **115**
- Occurrences `auth.getUser()`: **69**
- Occurrences `revalidatePath()`: **63**
- Occurrences `return null`: **175**
- Occurrences `placeholder|mock|hardcoded|fake`: **87**

### Répartition par domaine

| Domaine | Volume | Observation |
|---|---:|---|
| `marketing` | 24 pages | Très large, inclut contenu public mais aussi zones labo / guidelines |
| `community` | 13 pages | Domaine le plus développé fonctionnellement |
| `dashboard` | 11 pages | Large couverture, cohérence métier moyenne |
| `commerce` | 5 pages | Catalogue correct, checkout incomplet |
| `projects-investment` | 3 pages | Listing/détail corrects, investissement dédié non branché |
| `profile` | 3 pages | Présence publique utile, alias incomplet |
| `auth` | 3 pages | Parcours de base présents |
| `challenges` | 2 pages | Hub DB-backed, détail statique |
| `biodex` | 2 pages | Encyclopédie publique, collection utilisateur absente |
| `leaderboard` | 1 page | Très partiel par rapport au modèle produit |
| `embed` | 1 page | Cas d’usage ciblé |
| `admin-in-web-client` | 7 pages | Présence structurellement problématique dans une app client |

## État global par domaine produit

| Domaine | État | Lecture |
|---|---|---|
| Auth | Partiellement sain | Flux standards présents, quelques risques côté admin fallback |
| Marketing | Large mais hétérogène | Bon niveau de contenu, mais arborescence mélangée |
| Projects | Correct en lecture | Les vues publiques existent et s’appuient sur `public_projects` |
| Investment | Incomplet | Deux implémentations concurrentes, page dédiée non branchée |
| Products | Correct en lecture | Catalogue/listing sérieux |
| Cart | Correct côté UI locale | Bon état de panier, peu de backend métier visible |
| Checkout | Incomplet | Page explicitement indisponible, succès plus avancé que le flow source |
| Dashboard | Mixte | Riche mais hétérogène sur les métriques et la provenance des données |
| Community | Avancé | Domaine le plus cohérent, malgré drift DB/types |
| Challenges | Incohérent | Hub dynamique, détail statique |
| BioDex | Incomplet | Encyclopédie publique sans collection personnelle réelle |
| Leaderboard | Incomplet | Vue publique minimale, score non stabilisé |
| Profile | Mixte | Bonne base publique, alias username cassé |
| API routes | Mixte | Certaines routes propres, d’autres incohérentes côté client/serveur |
| CMS dans web-client | Risqué | Présence et protection non alignées avec le niveau attendu |

## Matrice de findings priorisés

| ID | Priorité | Catégorie | État | Sujet |
|---|---|---|---|---|
| WC-001 | P0 | sécurité | confirmé | CMS admin accessible sans autorisation forte |
| WC-002 | P0 | i18n | confirmé | `terms` cassé par mismatch entre view-model et messages |
| WC-003 | P1 | produit / frontend | confirmé | Flow investissement dédié branché sur un faux client |
| WC-004 | P1 | produit / UX/UI | confirmé | `/checkout` est un placeholder alors que le parcours commerce existe partiellement |
| WC-005 | P1 | produit / data contract | confirmé | `impact score`, `points` et `leaderboard` ont plusieurs définitions concurrentes |
| WC-006 | P1 | schema drift | confirmé | Drift entre `web-client`, `database_full.ts`, `database.generated.ts` et `schema.ts` |
| WC-007 | P1 | sécurité / backend | à valider en runtime / RLS | Lectures sensibles sans filtre explicite utilisateur |
| WC-008 | P1 | produit | confirmé | `Challenges` et `BioDex` ne matérialisent pas le modèle produit visé |
| WC-009 | P1 | frontend / navigation | confirmé | `/u/[username]` redirige vers un identifiant non canonique |
| WC-010 | P1 | backend | confirmé | `api/projects` utilise le client navigateur dans un handler serveur |
| WC-011 | P2 | architecture produit | confirmé | `web-client` mélange app client, CMS, lab marketing et UI playground |
| WC-012 | P2 | UX/UI / dette | confirmé | Empreinte élevée de `placeholder`, `hardcoded` et `return null` |
| WC-013 | P2 | performance / architecture | confirmé | Shell public dépendant du header CMS + session utilisateur |
| WC-014 | P2 | data contract | confirmé | `points_balance` lu de façons contradictoires selon les pages |

## Audit détaillé par domaine

## Auth

### Ce qui est sain

- Les écrans `login`, `register`, `forgot-password` existent.
- Les Server Actions d’auth sont centralisées dans `apps/web-client/src/app/[locale]/(auth)/actions.ts`.
- Les layouts `dashboard` utilisent un garde applicatif et redirigent vers `/login`.

### Points de faiblesse

- `createAdminClient()` tolère un fallback vers `NEXT_PUBLIC_SUPABASE_ANON_KEY` si `SUPABASE_SERVICE_ROLE_KEY` manque, via `apps/web-client/src/lib/supabase/admin.ts`.
- Le `proxy` ne protège pas les zones `admin`, il se contente de gérer locale + refresh de session via `apps/web-client/src/proxy.ts`.

### Lecture

Le socle auth est fonctionnel, mais la frontière entre “utilisateur connecté” et “utilisateur autorisé” n’est pas correctement formalisée.

## Marketing

### Ce qui est sain

- La home s’appuie sur des sections dédiées et un view-model structuré.
- `projects`, `products`, `producers`, `blog`, `faq`, `about` existent côté public.
- Le header tire son menu depuis le CMS, ce qui donne une vraie capacité d’édition.

### Points de faiblesse

- Le domaine marketing inclut aussi `brand-guidelines`, `hero-lab/*`, `ui-lab`, ce qui dilue le périmètre de l’application publique.
- Le header public dépend d’un service CMS admin (`apps/web-client/src/lib/get-header-data.ts` -> `apps/web-client/src/app/[locale]/admin/cms/_features/cms.service.ts`).
- La home utilise encore des images placeholder/fallback en dur.

### Lecture

La surface marketing est vaste mais mélange produit public, zone d’expérimentation et outils internes. C’est acceptable en phase de construction, mais pas comme frontière applicative stable.

## Projects / Investment

### Ce qui est sain

- Le listing projets s’appuie sur `public_projects` via `apps/web-client/src/app/[locale]/(marketing)/projects/_features/get-projects.ts`.
- Le détail projet repose sur `getPublicProjectBySlug()` et expose bien `producer`, `funding`, `descriptions`.
- Il existe un flux d’investissement Stripe crédible dans `apps/web-client/src/app/[locale]/(marketing)/projects/_features/invest-client.tsx` + `create-investment.action.ts`.

### Points de faiblesse

- La page dédiée `/projects/[slug]/invest` utilise **un autre** composant: `apps/web-client/src/app/[locale]/projects/[slug]/invest/invest-client.tsx`.
- Ce composant ne déclenche **aucune** action métier réelle:
  - pas de `createInvestmentAction`
  - pas de Stripe
  - pas d’écriture DB
  - simple `setTimeout(1500)` puis redirection vers `/dashboard/investments`
- Le vrai `InvestClient` Stripe présent dans le dossier marketing n’est pas branché dans le route tree.

### Lecture

Le domaine contient deux implémentations concurrentes:

- une version réelle mais non utilisée,
- une version visible mais factice.

Pour un parcours cœur produit, c’est une incohérence majeure.

## Products / Cart / Checkout

### Ce qui est sain

- Le catalogue produits s’appuie sur `public_products`, `categories`, `producers`.
- Le panier client est riche et assez avancé côté UX.
- La page de succès de checkout lit `orders` + `order_items` et produit une UX aboutie.

### Points de faiblesse

- La page `/checkout` importe `apps/web-client/src/app/[locale]/(marketing-no-footer)/checkout/_features/checkout-client.tsx`.
- Ce composant affiche explicitement:
  - “Checkout Temporarily Unavailable”
  - le solde et l’adresse seulement
  - aucun paiement ni validation réelle
- Le parcours est donc asymétrique:
  - `cart` existe,
  - `checkout success` existe,
  - mais `checkout` est suspendu.

### Lecture

Le domaine commerce est “lisible” côté catalogue mais non terminé côté conversion. Le produit laisse entrevoir un flow final qui n’est pas réellement disponible.

## Dashboard

### Ce qui est sain

- Bonne densité fonctionnelle: overview, investments, orders, points, profile, settings, subscription.
- Usage de `quest.actions.ts` et `inventory.actions.ts` pour enrichir la couche gamification.

### Points de faiblesse

- Plusieurs pages reposent sur RLS sans filtre explicite `user_id`, par exemple:
  - `apps/web-client/src/app/[locale]/(dashboard)/dashboard/orders/page.tsx`
  - `apps/web-client/src/app/[locale]/(dashboard)/dashboard/orders/[id]/page.tsx`
  - `apps/web-client/src/app/[locale]/(dashboard)/dashboard/messages/page.tsx`
  - `apps/web-client/src/app/[locale]/checkout/success/page.tsx`
- `messages/page.tsx` ne filtre pas explicitement `sender_user_id = user.id`.
- `points/page.tsx` lit `profiles.metadata.points_balance`, alors que d’autres vues lisent `profiles.points_balance` ou `public_user_rankings.points_balance`.
- `dashboard/page.tsx` calcule un `impactScore` local avec `calculateImpactScore()`, alors que d’autres zones utilisent d’autres définitions.

### Lecture

Le dashboard est riche, mais il agrège des concepts encore non stabilisés: solde points, score d’impact, progression, badges, quests.

## Community

### Ce qui est sain

- `community` est la zone la plus aboutie du repo:
  - feed
  - likes
  - bookmarks
  - hashtags
  - guilds
  - reels
  - post details / share
- `feed.reads.ts` et `feed.actions.ts` contiennent une vraie logique métier: réactions, commentaires, hashtags, médias, guildes, cache tags, partages.

### Points de faiblesse

- Le domaine social dépasse les schémas applicatifs actifs:
  - `schema.ts` ne modélise pas le module social réellement utilisé
  - `database.generated.ts` est plus riche que `schema.ts`
  - `temp/database_full.ts` retarde encore sur certains objets sociaux
- `feed.actions.ts` écrit dans `social.post_shares`, objet absent de `temp/database_full.ts` **et** de `database.generated.ts`.
- Le bucket `community-media` utilisé par les reels n’est pas un problème en soi, mais il confirme que la lecture “tous les `.from()` sont des tables” serait fausse et qu’il faut bien séparer storage et DB dans l’architecture.

### Lecture

La communauté est avancée côté produit, mais c’est aussi la zone où la dette de contrat de données est la plus visible.

## Challenges

### Ce qui est sain

- Le hub `/challenges` lit `gamification.challenges` et `gamification.user_challenges`.
- La page expose bien progression, récompense et CTA.

### Points de faiblesse

- Le détail `/challenges/[slug]` est entièrement hardcodé dans `apps/web-client/src/app/[locale]/challenges/[slug]/page.tsx`.
- Slugs supportés en dur:
  - `streak-7`
  - `invest-2-projets`
  - `top-100`
- Progression affichée en dur: `0%`

### Lecture

Le domaine envoie une promesse de système dynamique, mais la page détail revient à un prototype statique. Cela casse la continuité du produit.

## BioDex

### Ce qui est sain

- Le hub `/biodex` lit `investment.species`.
- Le détail espèce lit `species` + projets associés.
- `content_levels` est bien utilisé pour exposer des niveaux de contenu.

### Points de faiblesse

- Le produit DB contient `investment.user_unlocked_species`, mais `web-client` ne l’exploite pas.
- `BiodexClient` ne gère:
  - ni espèce débloquée,
  - ni niveau utilisateur,
  - ni XP,
  - ni progression de collection.
- La page détail espèce montre les “Niveaux de Connaissance” sans état de verrouillage/déverrouillage par utilisateur.

### Lecture

Le BioDex actuel est surtout une encyclopédie publique. La couche “collection personnelle” existe dans la DB, pas dans le produit.

## Leaderboard

### Ce qui est sain

- Le classement s’appuie sur `public_user_rankings`, ce qui est la bonne direction.

### Points de faiblesse

- `apps/web-client/src/app/[locale]/leaderboard/_features/leaderboard-data.ts` lit uniquement:
  - `id`
  - `rank`
  - `display_name`
  - `points_balance`
  - `avatar_url`
- Le classement affiché est donc **effectivement un classement de points**, pas un vrai leaderboard d’impact.
- La vue `public_user_rankings` expose pourtant:
  - `impact_score`
  - `biodiversity_impact`
  - `projects_count`
  - `total_invested_eur`

### Lecture

Le frontend sous-exploite la vue publique disponible et n’incarne pas encore le modèle produit discuté autour d’`Impact`, `Community` et `BioDex`.

## Profile

### Ce qui est sain

- `profile/[id]` s’appuie sur `public_user_profiles`.
- La page croise profil public, investissements récents et posts.

### Points de faiblesse

- La page profile assigne:
  - `impactScore = profile.biodiversity_impact || 0`
- Le commentaire dit pourtant “same as database view”, alors que la vue expose aussi `impact_score`.
- `/u/[username]` redirige vers `/profile/${username}` via `apps/web-client/src/app/[locale]/u/[username]/page.tsx`.
- Or `profile/[id]` interroge `public_user_profiles` par `id`, pas par username.

### Lecture

Le profil public existe, mais la canonicalisation d’URL et la sémantique de score ne sont pas stabilisées.

## API routes / Server Actions

### Ce qui est sain

- Les routes paiement valident l’entrée avec Zod.
- Le webhook Stripe vérifie la signature.
- Les actions `social`, `quests`, `inventory`, `profile`, `settings` existent réellement.

### Points de faiblesse

- `apps/web-client/src/app/api/projects/route.ts` importe `@/lib/supabase/client`, donc le client navigateur, dans un route handler serveur.
- Les actions CMS (`updateMenu`, `updatePageContent`) ne font qu’un contrôle `user` connecté, pas de contrôle de rôle.
- Plusieurs actions ou routes reposent sur conventions implicites:
  - revalidation large,
  - dépendance à RLS,
  - absence de centralisation du contrôle d’accès.

## Audit DB et cohérence du contrat de données

## 1. Présent en DB mais absent ou peu exploité dans le frontend

### `investment.user_unlocked_species`

- Présent dans `temp/database_full.ts`
- Présent dans `packages/core/src/shared/db/database.generated.ts`
- Absent du produit visible `BioDex`

Impact:

- la mécanique “collection personnelle” est déjà dans la DB mais pas dans `web-client`.

### `commerce.points_ledger`

- Présent dans `schema.ts`, `database.generated.ts`, `temp/database_full.ts`
- Non utilisé pour construire l’historique de points dans `apps/web-client/src/app/[locale]/(dashboard)/dashboard/points/page.tsx`

Impact:

- le frontend dérive l’historique à partir de `orders`, pas depuis un ledger canonique.

### `commerce.stripe_events`

- Présent et alimenté côté webhook/RPC
- Non surfacé dans aucun écran admin/client de `web-client`

Impact:

- perte d’observabilité produit.

### `public_user_rankings`

- Vue riche côté DB
- Sous-exploitée dans le leaderboard UI

Impact:

- classement incomplet par rapport aux données disponibles.

## 2. Utilisé par le frontend mais contrat DB ambigu ou divergent

### `social.post_shares`

- Utilisé dans `apps/web-client/src/lib/social/feed.actions.ts`
- Absent de `temp/database_full.ts`
- Absent de `packages/core/src/shared/db/database.generated.ts`

Impact:

- drift confirmé entre code social et types DB actifs.

### `points_balance`

Lu depuis trois endroits différents:

- `profiles.points_balance`
- `profiles.metadata.points_balance`
- `public_user_rankings.points_balance`

Impact:

- pas de source de vérité unique visible.

### `impact score`

Trois définitions concurrentes détectées:

- calcul local `calculateImpactScore(points, projects, invested)` dans `apps/web-client/src/lib/gamification.ts`
- `biodiversity_impact` dans `profile/[id]`
- `points_balance` comme valeur de classement dans `leaderboard`

Impact:

- le produit n’a pas de score public unique réellement implémenté.

## 3. Présent dans le schéma core, mais pas ou mal représenté dans `temp/database_full.ts`

Diff mécanique confirmé:

- `social.bookmarks`
- `social.hashtags`
- `social.post_hashtags`
- `social.post_media`
- `social.post_share_events`
- vues:
  - `social.hashtag_stats`
  - `social.user_bookmarked_posts`
  - `social.user_liked_posts`

Conclusion:

- `temp/database_full.ts` n’est pas totalement à jour par rapport aux types actifs sur le module social.

## 4. Présent dans `database.generated.ts` / DB, absent du schéma applicatif `schema.ts`

Le `schema.ts` actif modélise `commerce`, `investment`, `content`, `gamification`, `identity`, plus quelques tables `public`, mais **pas le module social réellement utilisé**:

- pas de `posts`
- pas de `reactions`
- pas de `comments`
- pas de `bookmarks`
- pas de `hashtags`
- pas de `post_media`
- pas de `post_share_events`

Impact:

- la réalité runtime de `web-client` dépasse le schéma de référence censé piloter migrations et cohérence applicative.

## Top incohérences structurelles

1. **`web-client` contient un CMS quasi-admin sans autorisation admin claire**
2. **Le flow investissement visible n’est pas le flow investissement réel**
3. **Le checkout est volontairement indisponible alors que le reste du domaine commerce est exposé**
4. **Le score produit n’a pas de définition unique entre dashboard, profile, leaderboard et DB**
5. **Le module social runtime n’est pas aligné avec `schema.ts`, et partiellement pas avec `database_full.ts`**

## Détail des findings

### WC-001 — CMS admin accessible sans autorisation forte

- **Priorité**: P0
- **Catégorie**: sécurité
- **État**: confirmé
- **Impact**: édition potentielle de contenu par des utilisateurs simplement authentifiés
- **Preuves**:
  - `apps/web-client/src/app/[locale]/admin/cms/page.tsx`
  - `apps/web-client/src/app/[locale]/admin/cms/blog/page.tsx`
  - `apps/web-client/src/app/[locale]/admin/cms/_features/actions/cms-actions.ts`
  - `apps/web-client/src/proxy.ts`
- **Problème**:
  - les routes `admin/cms` sont présentes dans `web-client`
  - le `proxy` ne protège pas `/admin`
  - les mutations CMS vérifient seulement `if (!user) throw`, sans contrôle de rôle
- **Conséquence**: tout utilisateur connecté peut potentiellement modifier menus/pages si la policy DB le permet
- **Recommandation**:
  - sortir ce CMS de `web-client` ou le placer derrière une vraie garde `admin`
  - ajouter un contrôle de rôle explicite côté action serveur
  - interdire l’accès UI dès le routing
- **Dépendances / ordre**: immédiat

### WC-002 — `terms` est cassé par mismatch i18n

- **Priorité**: P0
- **Catégorie**: i18n
- **État**: confirmé
- **Impact**: erreurs build et page légale non fiable
- **Preuves**:
  - `apps/web-client/src/app/[locale]/(marketing)/terms/page.tsx`
  - `apps/web-client/src/app/[locale]/(marketing)/terms/_features/terms.view-model.ts`
  - `packages/core/locales/fr.json`
  - `packages/core/locales/en.json`
  - `packages/core/locales/nl.json`
- **Problème**:
  - le code attend `title`, `description`, `sections.*.content`
  - les messages définissent `hero.title_line1`, `hero.title_highlight`, `hero.description`, `sections.*.body`
- **Conséquence**: build signale des messages manquants dans les trois langues
- **Recommandation**:
  - soit aligner `terms.view-model.ts` sur la structure réelle des messages
  - soit refondre les messages pour suivre le contrat attendu
- **Dépendances / ordre**: immédiat

### WC-003 — Flow investissement visible non branché

- **Priorité**: P1
- **Catégorie**: produit / frontend
- **État**: confirmé
- **Impact**: parcours cœur produit trompeur
- **Preuves**:
  - `apps/web-client/src/app/[locale]/projects/[slug]/invest/page.tsx`
  - `apps/web-client/src/app/[locale]/projects/[slug]/invest/invest-client.tsx`
  - `apps/web-client/src/app/[locale]/(marketing)/projects/_features/invest-client.tsx`
  - `apps/web-client/src/app/[locale]/(marketing)/projects/_features/create-investment.action.ts`
- **Problème**:
  - la route visible utilise un composant factice
  - le composant réel Stripe existe mais n’est pas branché
- **Conséquence**: l’utilisateur pense investir alors qu’aucune transaction n’est initialisée
- **Recommandation**:
  - supprimer l’implémentation factice
  - brancher le vrai flux
  - unifier `InvestClient`
- **Dépendances / ordre**: très haute

### WC-004 — Checkout volontairement indisponible

- **Priorité**: P1
- **Catégorie**: produit / UX/UI
- **État**: confirmé
- **Impact**: conversion e-commerce impossible dans le parcours standard
- **Preuves**:
  - `apps/web-client/src/app/[locale]/checkout/page.tsx`
  - `apps/web-client/src/app/[locale]/(marketing-no-footer)/checkout/_features/checkout-client.tsx`
  - `apps/web-client/src/app/[locale]/checkout/success/page.tsx`
- **Problème**:
  - `checkout` est un placeholder
  - `checkout success` est pourtant déjà détaillé
- **Conséquence**: parcours incohérent et faux sentiment de complétude
- **Recommandation**:
  - masquer le parcours tant qu’il n’est pas branché
  - ou finaliser le flux avant exposition publique
- **Dépendances / ordre**: très haute

### WC-005 — Score, points et leaderboard ont des définitions concurrentes

- **Priorité**: P1
- **Catégorie**: produit / data contract
- **État**: confirmé
- **Impact**: incohérence produit visible, difficulté à expliquer la progression
- **Preuves**:
  - `apps/web-client/src/lib/gamification.ts`
  - `apps/web-client/src/app/[locale]/(dashboard)/dashboard/page.tsx`
  - `apps/web-client/src/app/[locale]/profile/[id]/page.tsx`
  - `apps/web-client/src/app/[locale]/leaderboard/_features/leaderboard-data.ts`
  - `packages/core/src/shared/db/database.generated.ts`
- **Problème**:
  - dashboard = calcul local
  - profile = `biodiversity_impact`
  - leaderboard = `points_balance`
  - DB = `impact_score` disponible mais peu utilisé
- **Conséquence**: un même utilisateur peut “avoir” plusieurs scores selon la page
- **Recommandation**:
  - fixer une source de vérité par score
  - séparer `Impact`, `Community`, `BioDex`, `Points`
  - adapter ensuite dashboard, profile et leaderboard
- **Dépendances / ordre**: très haute

### WC-006 — Drift confirmé entre code social et contrats DB

- **Priorité**: P1
- **Catégorie**: schema drift
- **État**: confirmé
- **Impact**: dette de type, migrations risquées, maintenance difficile
- **Preuves**:
  - `apps/web-client/src/lib/social/feed.actions.ts`
  - `apps/web-client/src/lib/social/feed.reads.ts`
  - `temp/database_full.ts`
  - `packages/core/src/shared/db/database.generated.ts`
  - `packages/core/src/shared/db/schema.ts`
- **Problème**:
  - `schema.ts` ne couvre pas le social actif
  - `database_full.ts` manque des objets sociaux présents dans `database.generated.ts`
  - `post_shares` est utilisé dans le code, absent des types DB inspectés
- **Conséquence**: risque d’erreurs silencieuses et de divergence durable entre runtime et schéma canonique
- **Recommandation**:
  - réaligner `schema.ts`
  - régénérer `database_full.ts`
  - supprimer ou formaliser `post_shares`
- **Dépendances / ordre**: très haute

### WC-007 — Dépendance implicite à RLS sur des lectures sensibles

- **Priorité**: P1
- **Catégorie**: sécurité / backend
- **État**: à valider en runtime / RLS
- **Impact**: risque de fuite de données si les policies dérivent
- **Preuves**:
  - `apps/web-client/src/app/[locale]/(dashboard)/dashboard/messages/page.tsx`
  - `apps/web-client/src/app/[locale]/(dashboard)/dashboard/orders/[id]/page.tsx`
  - `apps/web-client/src/app/[locale]/checkout/success/page.tsx`
- **Problème**:
  - la lecture se fait souvent par `id` ou sans `user_id` explicite
  - la sécurité repose sur RLS, mais l’intention n’est pas visible dans le code
- **Conséquence**: sécurité plus difficile à auditer et à maintenir
- **Recommandation**:
  - ajouter les filtres explicites quand ils sont sémantiquement attendus
  - documenter les queries qui dépendent volontairement de RLS
- **Dépendances / ordre**: haute

### WC-008 — `Challenges` et `BioDex` ne concrétisent pas encore la vision produit

- **Priorité**: P1
- **Catégorie**: produit
- **État**: confirmé
- **Impact**: gamification non crédible de bout en bout
- **Preuves**:
  - `apps/web-client/src/app/[locale]/challenges/page.tsx`
  - `apps/web-client/src/app/[locale]/challenges/[slug]/page.tsx`
  - `apps/web-client/src/app/[locale]/(marketing)/biodex/page.tsx`
  - `apps/web-client/src/app/[locale]/(biodex-detail)/biodex/[id]/page.tsx`
  - `packages/core/src/shared/db/database.generated.ts`
- **Problème**:
  - challenges: hub dynamique, détail statique
  - BioDex: encyclopédie publique, pas de collection personnelle réelle
- **Conséquence**: la couche gamification paraît plus avancée en base qu’en UX
- **Recommandation**:
  - rendre le détail challenge DB-driven
  - brancher `user_unlocked_species`
  - afficher verrouillage/progression par utilisateur
- **Dépendances / ordre**: haute

### WC-009 — Alias `/u/[username]` cassé

- **Priorité**: P1
- **Catégorie**: frontend / navigation
- **État**: confirmé
- **Impact**: URL publique non canonique / potentiellement cassée
- **Preuves**:
  - `apps/web-client/src/app/[locale]/u/[username]/page.tsx`
  - `apps/web-client/src/app/[locale]/profile/[id]/page.tsx`
- **Problème**: redirection vers `/profile/${username}` alors que la page cible résout par `id`
- **Conséquence**: les profils par username ne fonctionnent pas correctement
- **Recommandation**:
  - résoudre username -> id avant redirection
  - ou créer une vraie page username-backed
- **Dépendances / ordre**: haute

### WC-010 — `api/projects` utilise un client navigateur côté serveur

- **Priorité**: P1
- **Catégorie**: backend
- **État**: confirmé
- **Impact**: incohérence d’exécution et maintenance fragile
- **Preuves**:
  - `apps/web-client/src/app/api/projects/route.ts`
  - `apps/web-client/src/lib/supabase/client.ts`
  - `apps/web-client/src/lib/supabase/server.ts`
- **Problème**: route handler server -> `createBrowserClient`
- **Conséquence**: frontière runtime moins fiable, pattern non homogène
- **Recommandation**: utiliser `@/lib/supabase/server`
- **Dépendances / ordre**: haute

### WC-011 — `web-client` mélange plusieurs périmètres applicatifs

- **Priorité**: P2
- **Catégorie**: architecture produit
- **État**: confirmé
- **Impact**: navigation et ownership moins lisibles
- **Preuves**:
  - `apps/web-client/src/app/[locale]/admin/**`
  - `apps/web-client/src/app/[locale]/(marketing)/hero-lab/**`
  - `apps/web-client/src/app/[locale]/(marketing)/brand-guidelines/**`
- **Problème**: application client publique, CMS, labo marketing et base UI playground cohabitent dans le même route tree
- **Conséquence**: dette de scope et confusion pour la maintenance
- **Recommandation**:
  - séparer `public`, `cms/admin`, `lab`
  - ou au minimum les marquer comme non indexés et hors navigation publique
- **Dépendances / ordre**: moyenne

### WC-012 — Empreinte élevée de placeholder et de rendu défensif

- **Priorité**: P2
- **Catégorie**: UX/UI / dette
- **État**: confirmé
- **Impact**: perception d’incomplétude, risques de chemin silencieux
- **Preuves**:
  - scan repo `placeholder|hardcoded|fake|mock`: 87
  - scan repo `return null`: 175
- **Problème**: beaucoup de branches “vides” ou provisoires
- **Conséquence**: UX inégale, bugs plus difficiles à repérer
- **Recommandation**:
  - remplacer les `return null` par des états vides explicités
  - retirer les prototypes visibles du route tree public
- **Dépendances / ordre**: moyenne

### WC-013 — Shell public couplé à la session et au CMS

- **Priorité**: P2
- **Catégorie**: performance / architecture
- **État**: confirmé
- **Impact**: cache et rendu public moins maîtrisés
- **Preuves**:
  - `apps/web-client/src/lib/get-header-data.ts`
  - `apps/web-client/src/components/layout/header.tsx`
  - `apps/web-client/src/app/[locale]/(marketing)/layout.tsx`
- **Problème**: le header combine données CMS et données utilisateur
- **Conséquence**: shell public moins facilement cacheable
- **Recommandation**:
  - isoler menu CMS public
  - lazy-load la personnalisation user
- **Dépendances / ordre**: moyenne

### WC-014 — `points_balance` n’a pas de source de vérité unique

- **Priorité**: P2
- **Catégorie**: data contract
- **État**: confirmé
- **Impact**: wallet et score divergents
- **Preuves**:
  - `apps/web-client/src/app/[locale]/(dashboard)/dashboard/page.tsx`
  - `apps/web-client/src/app/[locale]/(dashboard)/dashboard/points/page.tsx`
  - `apps/web-client/src/app/[locale]/leaderboard/_features/leaderboard-data.ts`
- **Problème**:
  - dashboard lit `profiles.points_balance`
  - points lit `profiles.metadata.points_balance`
  - leaderboard lit `public_user_rankings.points_balance`
- **Conséquence**: valeurs potentiellement divergentes selon la page
- **Recommandation**:
  - choisir un seul champ canonique
  - migrer les lectures et écritures vers ce champ
- **Dépendances / ordre**: moyenne

## Quick wins (≤ 7 jours)

1. Protéger ou retirer `admin/cms` de `web-client`
2. Corriger immédiatement `terms.view-model.ts` ou les locales `terms`
3. Remplacer `api/projects` par le client serveur
4. Brancher la route `/projects/[slug]/invest` sur le vrai `InvestClient`
5. Corriger `/u/[username]`
6. Documenter les queries volontairement dépendantes de RLS
7. Décider une source de vérité unique pour `points_balance`

## Backlog structurant (≤ 30 jours)

1. Unifier la définition de `Impact Score`, `Points`, `Leaderboard`
2. Aligner `schema.ts` avec le module social réellement utilisé
3. Régénérer / fiabiliser `temp/database_full.ts`
4. Finaliser le checkout réel ou masquer le flow
5. Rendre `Challenges` et `BioDex` DB-driven de bout en bout
6. Sortir CMS/lab/playground du périmètre runtime public

## Phase 2 / product hardening (> 30 jours)

1. Leaderboard multi-score (`Impact`, `Community`, `BioDex`)
2. BioDex personnel branché sur `user_unlocked_species`
3. Historique points basé sur `points_ledger`
4. Observabilité produit sur paiements, investissements, quêtes et erreurs CMS
5. Politique formelle de “source de vérité” pour:
   - score
   - wallet points
   - profil public
   - métriques de classement

## Conclusion

`web-client` est riche, mais pas encore cohérent comme produit unifié. Les briques sont là, la vision est perceptible, mais les parcours cœur métier sont encore concurrencés par des placeholders, des duplications d’implémentation et un contrat de données instable.

L’ordre de correction recommandé est clair:

1. **sécurité / autorisation CMS**
2. **parcours cœur métier réels (`invest`, `checkout`)**
3. **stabilisation des métriques produit (`score`, `points`, `leaderboard`)**
4. **alignement DB/types/schéma, surtout sur `social`**
5. **mise en cohérence de la gamification (`Challenges`, `BioDex`)**

Tant que ces cinq points ne sont pas stabilisés, l’application restera convaincante en démonstration, mais fragile en exploitation et difficile à faire évoluer proprement.

## Annexes

### Commandes utilisées

- `find apps/web-client/src/app -type f \\( -name 'page.tsx' -o -name 'layout.tsx' -o -name 'route.ts' -o -name 'loading.tsx' -o -name 'error.tsx' -o -name 'not-found.tsx' \\) | sort`
- `pnpm --filter @make-the-change/web-client type-check`
- `pnpm --filter @make-the-change/web-client build`
- `rg -n "TODO|FIXME|HACK" apps/web-client/src temp/database_full.ts`
- `rg -n "placeholder|mock|hardcoded|fake|stub|not implemented" apps/web-client/src temp/database_full.ts`
- `rg -n "return null" apps/web-client/src`
- `rg -n "createClient\\(" apps/web-client/src`
- `rg -n "auth\\.getUser\\(" apps/web-client/src`
- `rg -n "revalidatePath\\(" apps/web-client/src`

### Métriques de scan

- `TODO/FIXME/HACK`: 1
- `placeholder/mock/hardcoded/fake`: 87
- `return null`: 175
- `createClient()`: 115
- `auth.getUser()`: 69
- `revalidatePath()`: 63

### Diff mécanique confirmé `temp/database_full.ts` vs `database.generated.ts`

Objets présents dans `database.generated.ts` mais absents de `temp/database_full.ts`:

- `social.bookmarks`
- `social.hashtags`
- `social.post_hashtags`
- `social.post_media`
- `social.post_share_events`
- `social.hashtag_stats`
- `social.user_bookmarked_posts`
- `social.user_liked_posts`

### Usages `.from()` sans correspondance DB connue dans les types inspectés

- `post_shares` → `apps/web-client/src/lib/social/feed.actions.ts`

Note:

- `community-media` détecté dans les scans correspond à un bucket storage, pas à une table DB.
