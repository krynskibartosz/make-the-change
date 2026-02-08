# Audit Architecture Theming & Design Tokens (2026)

**Date**: 2026-02-06  
**Scope**: `packages/core` (UI/tokens), `apps/web` (admin/partner), `apps/web-client` (client)  
**Règles de référence**: [design.md](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/.trae/rules/design.md), [theme-factory.md](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/.trae/rules/theme-factory.md)

## 0) Résumé exécutif

Le monorepo possède déjà une **architecture theming centralisée** et relativement saine: un socle tokens CSS dans `@make-the-change/core/css`, surcouches par produit via `@make-the-change/core/css/themes/*`, et un toggle light/dark via `next-themes` côté apps.

Les écarts majeurs viennent de:

- **Drift tokens CSS vs tokens TS** (mêmes concepts, valeurs différentes, risques d’incohérence)
- **Hardcoded styles** (couleurs non-sémantiques, pixels fixes, grilles/offsets, palette hex “métier”) qui fragilisent le support multi-thème
- **Typographie** non alignée aux règles “frontend-design” (Inter explicite dans `apps/web`, non standardisée dans `apps/web-client`)
- **Séparation “client vs admin”** incomplète: `themes/client.css` est vide, et `themes/admin.css` contient des décisions de layout (offset sidebar) difficilement scalables

## 1) Cartographie “source de vérité”

### 1.1 Tokens CSS (réellement utilisés par Tailwind)

- Socle (variables CSS + dark mode + ombres + densité + transitions + utilitaires):  
  [globals.css](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/packages/core/src/shared/ui/globals.css)
- Surcouche admin (densité + helpers layout + composants utilitaires):  
  [admin.css](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/packages/core/src/shared/ui/themes/admin.css)
- Surcouche client (actuellement neutre):  
  [client.css](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/packages/core/src/shared/ui/themes/client.css)

### 1.2 Tailwind “shared config” (mapping tokens → classes)

- Config partagée (colors `hsl(var(--token))` + **palette hex custom**):  
  [tailwind.config.ts](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/packages/core/tailwind.config.ts)
- Les apps consomment la config partagée sans extension significative:  
  [web tailwind.config.js](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/tailwind.config.js),  
  [web-client tailwind.config.js](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/tailwind.config.js)

### 1.3 “Sélection du thème” par app (build-time)

Chaque app importe:

- le socle `@make-the-change/core/css`
- puis une surcouche `themes/*`

Admin: [apps/web globals.css](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/globals.css)  
Client: [apps/web-client globals.css](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/app/globals.css)

### 1.4 Light/Dark runtime via next-themes

- Admin provider: [providers.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/providers.tsx#L31-L45)
- Client provider: [Locale layout](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/app/%5Blocale%5D/layout.tsx#L42-L61) + [theme-provider.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/components/theme-provider.tsx)

### 1.5 Tokens TS (second “source de vérité”)

- Tokens TS exportés: [tokens.ts](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/packages/core/src/shared/ui/tokens.ts)  
- Réexport: [ui/index.ts](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/packages/core/src/shared/ui/index.ts#L62-L65)

## 2) Audit systématique des design tokens

### 2.1 Structure: ce qui existe réellement

**Colors (OK)**  
Tokens sémantiques présents en CSS vars (`--primary`, `--accent`, `--muted`, `--success`, etc.) et exposés dans Tailwind (`bg-background`, `text-muted-foreground`, etc.).  
Référence: [globals.css](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/packages/core/src/shared/ui/globals.css#L32-L155), [tailwind.config.ts](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/packages/core/tailwind.config.ts#L6-L46)

**Spacing / Density (Partiel)**  
Des variables de densité existent (`--density-*`), mais la majorité du spacing reste dans les classes Tailwind “brutes” (`p-6`, `gap-4`, etc.).  
Référence: [globals.css](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/packages/core/src/shared/ui/globals.css#L98-L103), [admin.css](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/packages/core/src/shared/ui/themes/admin.css#L3-L12)

**Typography (Insuffisant)**  
Les tokens TS définissent `Inter`, mais côté CSS/Tailwind le système n’applique pas une paire “display/body” distincte, et `apps/web` charge explicitement Inter.  
Référence: [tokens.ts](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/packages/core/src/shared/ui/tokens.ts#L106-L122), [apps/web layout.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/layout.tsx#L1-L20)

**Elevation (OK/Partiel)**  
Des ombres sémantiques existent en CSS vars (`--shadow-*`), mais on observe des ombres “custom” en dur dans `admin.css`.  
Référence: [globals.css](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/packages/core/src/shared/ui/globals.css#L108-L112), [admin.css](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/packages/core/src/shared/ui/themes/admin.css#L60-L76)

**Motion (Drift)**  
Il existe des tokens CSS `--transition-*` mais les valeurs divergent de `tokens.ts`.  
Référence: [globals.css](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/packages/core/src/shared/ui/globals.css#L104-L106), [tokens.ts](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/packages/core/src/shared/ui/tokens.ts#L88-L94)

### 2.2 Duplications / incohérences / conflits

#### A) Double source de vérité (CSS vars vs tokens TS)

- CSS: `--transition-normal: 300ms`  
- TS: `transitions.normal: 200ms`

Impact: un composant “design-system” qui se base sur TS et un autre sur CSS n’aura pas la même cadence d’animation, et l’UI deviendra “incohérente” au fil du temps.

**Recommandation**  
Choisir une seule source:

- soit “CSS-first” (recommandé pour Tailwind): TS lit les valeurs depuis une `const` générée (build) ou reste “documentaire”
- soit “TS-first”: générer `globals.css` (ou au minimum les valeurs) à partir des tokens TS

#### B) Palette hex “métier” dans Tailwind

`olive/honey/earth/ocean` sont des couleurs hardcodées, non sémantiques.  
Référence: [tailwind.config.ts](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/packages/core/tailwind.config.ts#L47-L64)

Impact: limite la réutilisabilité “theme-factory” et rend le multi-thème fragile (les composants utilisent `bg-olive` au lieu de `bg-primary`).

**Recommandation**  
Déplacer ces couleurs en variables sémantiques, ou en tokens “brand-*” derrière des CSS vars.

#### C) Couleurs hardcodées dans les apps

Admin: le toggle de form utilise `text-indigo-600` / `focus:ring-indigo-500`.  
Référence: [form-toggle.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/form/form-toggle.tsx#L41-L66)

Client: page about utilise `bg-blue-500/10`, `text-emerald-500`, etc.  
Référence: [about/page.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/app/%5Blocale%5D/about/page.tsx#L47-L90)

Impact: incohérences cross-thèmes, difficulté à faire évoluer la palette.

**Recommandation (exemple)**  
Remplacer:

- `text-indigo-600` → `text-primary`
- `focus:ring-indigo-500` → `focus:ring-ring`
- `bg-blue-500/10` → `bg-info/10` (ou token chart/special-purpose) et `text-blue-500` → `text-info`

#### D) Décisions de layout dans les CSS de thème

`admin.css` encode la largeur sidebar en pixels (`left: 256px/288px/320px`).  
Référence: [admin.css](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/packages/core/src/shared/ui/themes/admin.css#L85-L103)

Impact: si la sidebar change, le thème change; ça mélange “layout” et “theme”. Ça complique aussi l’introduction d’un thème “partner” différent.

**Recommandation**  
Introduire `--admin-sidebar-width` (par breakpoint) défini par le layout, pas par le thème, puis consommer la var dans le CSS.

## 3) Séparation des préoccupations

### 3.1 Ce qui est bien séparé

- Le socle tokens (core) est réutilisé tel quel par les apps (bon design).
- Les surcouches “admin” et “client” existent à un endroit unique (core), importées par app (pas de duplication).
- `next-themes` est configuré de façon cohérente (storageKey unique), ce qui évite des expériences divergentes.

### 3.2 Ce qui reste à améliorer

**Client vs Admin**  
La différence “client” n’est pas matérialisée: `themes/client.css` est vide. Le système ne permet pas encore d’avoir une “signature” client forte sans modifier le socle.

**Partner vs Admin**  
Le “partner” semble hériter du monde admin dans `apps/web`. En pratique, un thème “partner” distinct devrait être un troisième override, pas une divergence dans les composants.

**Dépendances / circularité**  
Les apps consomment `@make-the-change/core/ui` et `@make-the-change/core/css`. Le core n’importe pas les apps: pas d’indice de dépendance circulaire au niveau module. Le risque réel est plutôt “architecture” (les apps codent des styles qui contournent les tokens).

## 4) Alignement aux règles (design.md + theme-factory.md)

### 4.1 Gaps vs `frontend-design`

- Typo: `apps/web` charge Inter explicitement, ce qui contredit la règle “avoid generic fonts like Inter”.  
  Référence: [layout.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/layout.tsx#L1-L20)
- La plupart des écrans restent sur des patterns “card + grid” classiques (OK pour production), mais la règle demande un **parti pris esthétique** plus fort (typo, palette d’accents, motion orchestrée).

### 4.2 Gaps vs `theme-factory`

Le socle CSS vars est compatible avec l’approche “thème via variables”, mais:

- la palette hex “olive/honey/…” et les couleurs hardcodées dans les apps limitent la re-thematisation
- il n’existe pas encore un mécanisme standard “apply theme preset” (Ocean Depths, etc.) dans le code (ex: fichiers `themes/*.md` → CSS vars)

### 4.3 Pertinence vs obsolescence

- `theme-factory.md` est pertinent (séparation rôles couleur + CSS vars), mais incomplet sans un pipeline de mapping (preset → variables).
- `design.md` est pertinent en tant que garde-fou créatif, mais nécessite une interprétation pragmatique: on peut viser “distinctive” sans casser l’ergonomie admin (densité, focus states).

## 5) Problèmes hiérarchisés (bloquants / majeurs / mineurs)

### Bloquants (pour multi-thème robuste)

1) **Double source tokens (CSS vs TS) avec valeurs divergentes**  
   - Impact: incohérences visuelles + dette systémique
2) **Hardcoded couleurs dans composants (admin/client)**  
   - Impact: impossibilité d’appliquer des thèmes “theme-factory” sans régression

### Majeurs

3) **Décisions de layout dans le thème (admin.css)**  
4) **Typographie non standardisée et contraire aux règles (Inter)**  
5) **Palette hex non-sémantique dans Tailwind shared config**

### Mineurs

6) **`themes/client.css` vide (pas de différenciation)**  
7) **Tokens spacing/typography pas vraiment “systématisés”**

## 6) Recommandations concrètes (avec exemples)

### 6.1 Unifier tokens (CSS-first ou TS-first)

Option A (CSS-first, simple):  
Garder `globals.css` source de vérité et transformer `tokens.ts` en “mapping documentaire” strictement aligné (ou le générer).

Option B (TS-first, robuste):  
Générer `globals.css` (au moins la section `:root`/`.dark`) depuis `tokens.ts`.

### 6.2 Remplacer hardcoded couleurs par tokens sémantiques

Exemples à traiter en priorité:

- Admin: [form-toggle.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/form/form-toggle.tsx#L41-L66)
- Admin: [toast.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/ui/toast.tsx#L82-L110)
- Client: [about/page.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/src/app/%5Blocale%5D/about/page.tsx#L47-L90)

### 6.3 Déplacer les variables de layout hors “theme”

Créer une convention:

- layout définit `--admin-sidebar-width` (par breakpoint)
- thème consomme la variable mais ne la décide pas

### 6.4 Typographie: paire “display/body” + fallbacks

Objectif: une signature typographique cohérente “client” et une version plus utilitaire “admin” si besoin, sans divergence de code.

## 7) Matrice de priorisation

| Problème | Gravité | Probabilité drift | Effort | Risque prod | Priorité |
|---|---:|---:|---:|---:|---:|
| Tokens CSS vs TS divergents | Élevée | Élevée | Moyen | Moyen | P0 |
| Hardcoded couleurs dans composants | Élevée | Élevée | Moyen | Faible | P0 |
| Layout codé dans theme admin | Moyenne | Moyenne | Moyen | Faible | P1 |
| Typo (Inter, pas de paire) | Moyenne | Moyenne | Moyen | Faible | P1 |
| Palette hex non-sémantique | Moyenne | Moyenne | Faible | Faible | P2 |

## 8) Roadmap (3 audits immédiats)

> Owners proposés: à ajuster selon l’équipe.

### Audit A — Unification Tokens (P0)

- Owner: Frontend Lead
- Deadline: **7 jours**
- Output: une source de vérité, suppression du drift, tests de non-régression visuelle sur 5 pages clés

### Audit B — Hardcoded purge (P0)

- Owner: Frontend Engineer + QA
- Deadline: **10 jours**
- Output: inventaire des occurrences + PRs ciblées (admin components d’abord), remplacement par tokens sémantiques

### Audit C — Typo & Theme differentiation (P1)

- Owner: Design/Brand + Frontend
- Deadline: **14 jours**
- Output: paire typographique + `themes/client.css` matérialisé (sans casser admin)

## 9) “Screenshots” (plan reproductible)

Je ne peux pas générer des captures automatiquement dans ce repo. Pour produire un audit avec screenshots:

1) Lancer `apps/web-client` et capturer:
   - `/fr` (home marketing)
   - `/fr/projects` + `/fr/projects/[slug]`
   - `/fr/leaderboard`
   - `/fr/(dashboard)/dashboard`
   - `/fr/(dashboard)/dashboard/orders`
2) Lancer `apps/web` et capturer:
   - `/fr/admin/dashboard`
   - `/fr/admin/orders`
   - `/fr/partner/messages`
3) Capturer chaque écran en **light** et **dark** (toggle), desktop + mobile (responsive mode).

## 10) Prompt “IA recherche” (best practices 2026)

Copier-coller ce prompt dans une IA de recherche:

---

Tu es un architecte design systems (2026). Analyse et propose une architecture tokens/theming robuste pour un monorepo multi-produit:

- Produits: (1) web client marketing + dashboard, (2) web admin/partner dashboard
- Tech: Next.js, Tailwind, CSS variables, next-themes (attribute=class), monorepo packages/core partage UI + CSS
- Objectifs: multi-thèmes (light/dark + skins par produit), zéro hardcoded color, scalabilité tokens (color/typography/spacing/elevation/motion), accessibilité (focus/contrast), migration progressive

Contraintes:
- Aujourd’hui, tokens existent en CSS vars (`globals.css`) et aussi en TS (`tokens.ts`) avec des valeurs divergentes.
- Un thème admin override existe (`themes/admin.css`) qui inclut aussi des décisions de layout (sidebar offsets).
- Le client a une surcouche vide (`themes/client.css`).

Je veux:
1) Patterns éprouvés (ex: “CSS-first tokens”, “TS-first + build generation”, “token pipelines”, “semantic tokens vs primitive tokens”) avec trade-offs.
2) Exemples réels de design systems multi-produit (client vs admin) qui ont réussi la séparation (noms des projets/approches, sans blabla marketing).
3) Recommandations concrètes pour:
   - réduire hardcoded styles (approche d’inventaire + refactor)
   - intégrer fonts (next/font) + typographic scale (fluid vs stepped)
   - structurer motion tokens (durations + easings)
   - éviter de mélanger layout decisions et theme overrides
4) Un plan de migration en 3 phases, avec risques et métriques de succès.

Format de sortie attendu:
- Schéma d’architecture (niveaux de tokens)
- Conventions de naming
- Exemples de code (CSS vars + Tailwind config + usage)
- Checklist d’audit (automatisable) + commandes/approche (sans dépendre d’outils payants)

---

