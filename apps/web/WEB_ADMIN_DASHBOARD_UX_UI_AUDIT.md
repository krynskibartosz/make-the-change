# Audit UX/UI — Dashboard Admin (apps/web)

## 0) Contexte, scope, méthode
- **Scope** : `apps/web` — routes admin dashboard et composants associés.
- **Cible** : l’expérience “opérateur/admin” (rapidité, contrôle, confiance, zéro surprise).
- **Référentiels** :
  - Lois UX & ergonomie : [Base de Connaissance : Lois UX & Ergonomie.md](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/Base%20de%20Connaissance%20:%20Lois%20UX%20%26%20Ergonomie.md)
  - Couleur : [Base de Connaissance  Théorie & Sémantique Couleur.md](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/Base%20de%20Connaissance%20%20Th%C3%A9orie%20%26%20S%C3%A9mantique%20Couleur.md)
  - Neuro‑persuasion : [Base de Connaissance : Neuro-Persuasion.md](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/Base%20de%20Connaissance%20:%20Neuro-Persuasion.md)
- **Capitalisation** (éviter redondances) :
  - [WEB_CLIENT_UX_UI_AUDIT.md](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/WEB_CLIENT_UX_UI_AUDIT.md)
  - [WEB_CLIENT_UX_UI_ACTION_PLAN.md](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/WEB_CLIENT_UX_UI_ACTION_PLAN.md)
  - [WEB_CLIENT_ANALYSE_OPPORTUNITES.md](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/WEB_CLIENT_ANALYSE_OPPORTUNITES.md)

Méthode d’audit (systématique, traçable) :
- **Architecture de l’info** (Jakob, Hick, Miller, Gestalt) : structure, hiérarchie, chunking, navigation.
- **Interaction** (Fitts, Doherty) : accès aux actions, feedback, friction sur filtres/recherche.
- **Couleurs** (60‑30‑10, contraste, température, dissonance) : lisibilité, accent CTA, cohérence tokens.
- **Persuasion & confiance** (Old Brain, Processing Fluency, Engagement) : ici adapté à un admin (confiance, “je contrôle”, clarté).
- **Accessibilité** : focus visible, clavier, ARIA, contrastes.

## 1) Matrice des principes (extraits opérationnels)

### Lois UX (Jon Yablonski)
- **[UX:Jakob]** Modèles mentaux familiers ; innovation seulement si gain net.
- **[UX:Fitts]** CTA critiques gros, proches, accessibles (mobile zone du pouce + min 44px).
- **[UX:Hick]** Réduire le nombre de choix visibles ; révéler progressivement.
- **[UX:Miller]** Chunking : sections courtes, regroupement logique (≈7±2 éléments).
- **[UX:Doherty]** Feedback immédiat (<400ms) ; sinon skeleton/indicateur clair.
- **[UX:Esthétique‑Usabilité]** Cohérence visuelle = confiance + tolérance aux erreurs.
- **[UX:Gestalt‑Proximité]** Spacing = structure mentale (titres collés à leur contenu).
- **[UX:Gestalt‑Région Commune]** Conteneurs/cadres = segmentation (cards, sections).

### Couleur (Adams + MATE ART)
- **[Color:60‑30‑10]** Dominante neutre / secondaire marque / accent CTA (unique par écran si possible).
- **[Color:Valeur‑Contraste]** Luminosité > teinte pour la lisibilité (WCAG).
- **[Color:Température]** Chaud “avance”, froid “recule” ; CTA doit ressortir (chaud ou fort contraste).
- **[Color:Sémantique]** Bleu=confiance, rouge=danger/urgence, vert=permission/nature, noir=luxe.
- **[Color:Dissonance]** Éviter superposition de couleurs saturées complémentaires ou de valeur équivalente (scintillement).

### Neuro‑persuasion (Weinschenk + Cialdini)
- **[Neuro:Old Brain]** Décision rapide via sécurité/bénéfice immédiat ; éviter le “roman”.
- **[Neuro:Processing Fluency]** Lisible + standard = perçu comme vrai/sûr.
- **[Neuro:Engagement]** Micro‑actions → engagement ; cohérence d’état (sauvegarde, progression).
- **[Neuro:Self‑persona]** L’UI doit renforcer “je suis compétent et en contrôle” (zéro surprise, feedback clair).
- **[Neuro:Social Proof / Scarcity / Reciprocity]** Plutôt business/public ; peu pertinent en admin (sauf “preuves” système : logs, last sync, etc.).

## 2) Cartographie du dashboard admin (apps/web)
Shell dashboard :
- Layout global : [layout.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/layout.tsx#L17-L46)
- Sidebar (desktop + mobile) : [admin-sidebar.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/layout/admin-sidebar.tsx)
- Mobile header : [admin-mobile-header.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/layout/admin-mobile-header.tsx#L10-L36)
- Décor de fond : [admin-background-decoration.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/layout/admin-background-decoration.tsx#L5-L16)

Pages représentatives :
- Dashboard : [dashboard-client.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/dashboard/dashboard-client.tsx#L43-L113)
- Users (liste) : [users-client.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/users/users-client.tsx)
- Orders (liste) : [orders-client.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/orders/orders-client.tsx)
- Products (liste, pattern différent) : [products-client.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/products/products-client.tsx)
- Product edit (détail) : [product-edit-client.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/products/%5Bid%5D/product-edit-client.tsx)
- Detail header/actions : [admin-detail-header.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/layout/admin-detail-header.tsx)

Styles / tokens :
- Entrées CSS : [globals.css](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/globals.css#L1-L4)
- Tokens : [design-tokens.css](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/theme/design-tokens.css)

## 3) Vue d’ensemble — problèmes majeurs (priorisés)

### P0 — Fort impact, faible à moyen effort
1) **Incohérences UI dues à 2 systèmes de layout** (risque Jakob + esthétique‑usabilité)
   - Symptomatique : Users/Orders utilisent `components/layout/*` alors que Products et Product edit utilisent `components/admin-layout/*`.
   - Impact : baisse de fluence cognitive + surprises visuelles (nav, spacing, inputs).
   - Trace : [UX:Jakob], [UX:Esthétique‑Usabilité], [Neuro:Processing Fluency].

2) **Recherche/filtres : debounce erroné + convention `all` incohérente**
   - Sur Users/Orders, le `setTimeout` n’est pas réellement nettoyé (fuite de timers, latence imprévisible).
   - `all` est parfois envoyé comme valeur de filtre au lieu de “suppression du param”.
   - Trace : [UX:Doherty], [UX:Hick], [Neuro:Processing Fluency].

3) **Couleurs hardcodées hors tokens sur certains composants clés**
   - Exemple : search header admin‑layout (`focus:ring-blue-500`, `border-gray-300`) : [header.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/admin-layout/header.tsx#L29-L50).
   - Exemple : statut autosave en bleu/rouge/jaune + emojis : [admin-detail-header.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/layout/admin-detail-header.tsx#L157-L206).
   - Trace : [UX:Esthétique‑Usabilité], [Color:60‑30‑10], [Color:Valeur‑Contraste].

### P1 — Impact élevé, effort moyen
4) **Dashboard “vitrine” plutôt que “task-first”**
   - Les KPI sont visuels mais semblent statiques/demo (valeurs fixes). Les “actions rapides” sont présentes, mais pas priorisées par urgence/flux de travail.
   - Trace : [UX:Fitts], [UX:Hick], [Neuro:Self‑persona], [Neuro:Engagement].

5) **Ornementation forte (blur/gradients/pulses) sur un outil métier**
   - Peut réduire la lisibilité, la vitesse de scan, et la stabilité visuelle.
   - Trace : [Neuro:Processing Fluency], [UX:Esthétique‑Usabilité] (attention : l’esthétique aide, mais l’excès nuit à l’efficacité).

### P2 — Qualité \u0026 standardisation
6) **Accessibilité : audit focus/contrastes et uniformisation composants**
   - Focus ring et états varient selon composants (core UI vs “raw”).
   - Breadcrumbs en `<a href>` non localisé (risque d’incohérence i18n et navigation moins contrôlée).
   - Trace : [Color:Valeur‑Contraste], [Neuro:Processing Fluency], [UX:Jakob].

## 4) Analyse détaillée par composant

### 4.1 Shell global (layout, scroll, fond)
Fichiers :
- [layout.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/layout.tsx#L17-L46)
- [admin-background-decoration.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/layout/admin-background-decoration.tsx#L5-L16)

Constats :
- Shell structuré : sidebar + main + mobile header + overlay mobile sidebar.
- Fond : grille + blobs animés (très faible opacité) ; esthétique premium.

Risques / friction :
- [Neuro:Processing Fluency] : la grille + pulses peuvent fatiguer (surtout sur longues sessions) et donner une “instabilité” perceptive.
- [Color:60‑30‑10] : 3 teintes d’accent (primary + accent + emerald) même faibles → risque d’accents concurrents si d’autres éléments UI sont déjà accentués.

Recommandations :
- Prévoir un mode “travail” (ornements réduits) ou baisser encore l’intensité/animations.
- Clarifier la règle d’accent : **1 accent dominant** par zone d’action.

### 4.2 Navigation : Sidebar desktop + mobile
Fichiers :
- [admin-sidebar.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/layout/admin-sidebar.tsx)
- [admin-mobile-header.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/layout/admin-mobile-header.tsx#L10-L36)

Constats :
- Desktop : navigation claire, peu d’items (bon pour Hick).
- Mobile : overlay + focus trap + Escape + scroll lock (très bon socle a11y).

Friction :
- [UX:Hick] : accordéon + animations nombreuses : surcharge inutile si l’architecture reste simple.
- [UX:Jakob] : deux représentations (section “Management” accordéon vs liens directs) peuvent introduire des variations d’usage (desktop vs mobile).

Recommandations :
- Sur mobile : si la navigation ne dépasse pas ~7 liens, envisager une liste simple “flat” (sans accordéon).
- Vérifier la cohérence : même ordre, mêmes libellés, mêmes icônes.

### 4.3 Dashboard (page d’accueil)
Fichier :
- [dashboard-client.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/dashboard/dashboard-client.tsx#L43-L113)

Constats :
- 4 KPI cards + 4 actions rapides.
- Style “glass-card” + gradients sur chiffres.

Friction :
- [UX:Miller] : 4 KPI + 4 actions, c’est acceptable, mais le contenu étant “statique”, la valeur opérationnelle est faible (risque de “bruit” informationnel).
- [UX:Fitts] : pas de “1 action dominante” ; 4 actions se valent (décision plus lente).
- [Neuro:Self‑persona] : un admin attend des “tâches” et des “alertes actionnables”, pas seulement des métriques.

Recommandations (redesign “task-first”) :
- Above-the-fold : 2–3 cartes “à traiter maintenant” (ex: commandes en attente, produits out-of-stock, tickets/partenaires à valider).
- En dessous : KPI secondaires (tendance, comparaisons), mais visuellement moins dominants.
- 1 CTA principal par section (ex: “Traiter les commandes”).

### 4.4 Listes (Users, Orders) : filtres, recherche, pagination
Fichiers :
- Users : [users-client.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/users/users-client.tsx#L40-L207)
- Orders : [orders-client.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/orders/orders-client.tsx#L69-L226)
- Header/list container : [admin-page-header.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/layout/admin-page-header.tsx#L11-L27), [admin-page-container.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/layout/admin-page-container.tsx#L9-L12)

Constats :
- Pattern “header (filtres) → DataList → pagination” cohérent.
- États vides + reset filtres (bon).

Friction :
- [UX:Doherty] : debounce erroné sur `Input` (`setTimeout` sans cleanup effectif) → mises à jour multiples.
- [UX:Hick] : `SimpleSelect` propose “Tous/all” mais la valeur est envoyée telle quelle (ex: `status=all`) au lieu de supprimer le filtre (ambigu).
- [Neuro:Processing Fluency] : comportement inconsistent entre pages (Products gère `all` correctement, Users/Orders non).

Recommandations :
- Standardiser :
  - `all` ⇒ supprimer le param (approche Products).
  - Debounce centralisé (même délai, même UX, support “Enter”).
- Limiter la densité de contrôles visibles sur mobile et déplacer le secondaire en bottom sheet (pattern déjà validé côté web-client).

### 4.5 Products (liste) : bon pattern mobile, mais divergence UI
Fichier :
- [products-client.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/products/products-client.tsx#L95-L424)

Constats :
- Mobile : search + bouton filtres + bouton CTA pleine largeur (très bon Fitts).
- Desktop : filtres visibles + clear filters ; bottom sheet en complément.

Friction :
- [UX:Jakob] : la page Products adopte un autre “layout kit” (`AdminPageLayout` + `components/admin-layout/*`) que Users/Orders.
- [Color:Valeur‑Contraste] : composant search du header admin‑layout utilise des couleurs fixées (bleu/gris) : [header.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/admin-layout/header.tsx#L29-L50).

Recommandations :
- Conserver le pattern de filtrage (excellent), mais aligner sa mise en forme et ses primitives sur le standard global dashboard.

### 4.6 Product edit (détail) : chunking excellent, mais charge cognitive sur listes
Fichiers :
- [product-edit-client.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/products/%5Bid%5D/product-edit-client.tsx#L335-L933)
- [admin-detail-header.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/layout/admin-detail-header.tsx)

Constats :
- Sections et groupes (DetailView) = très bon [UX:Miller] + [UX:Gestalt‑Région Commune].
- Autosave + indicateur d’état : bon [UX:Doherty] si maîtrisé.

Friction :
- [UX:Hick/Miller] : énormes listes de suggestions hardcodées (tags, catégories, allergènes, certifications) ; l’utilisateur doit scanner trop.
- [Neuro:Processing Fluency] : répétition de toasts de succès potentiels (si autosave fréquent) → bruit.
- [UX:Jakob] : actions “Annuler/Supprimer” en `<button>` custom sans primitive standard ; styles focus/hovers à vérifier.

Recommandations :
- Suggestions : passer à une stratégie “typeahead” (server) ou au moins limiter à une shortlist + recherche.
- Autosave : préférer un statut discret et stable (badge “Sauvegardé” / “Modifié”) + toast uniquement sur erreur.
- Standardiser les boutons sur primitives core UI.

## 5) Comparatif apps/web vs apps/web-client (standardisation)

Convergences utiles (à réutiliser) :
- **Bottom sheet pour filtres** (réduction Hick/Miller) : déjà appliqué dans Products admin, et recommandé web-client : [WEB_CLIENT_UX_UI_ACTION_PLAN.md](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/WEB_CLIENT_UX_UI_ACTION_PLAN.md#L51-L64).
- **Chunking par sections** (Miller + région commune) : `DetailView.Section` similaire à l’approche “cards/accordéons” recommandée web-client pour réduire densité.

Divergences à corriger (opportunités) :
- **Deux langages UI** dans `apps/web` (layout kit double) vs `web-client` qui vise une architecture plus unifiée par route groups/layouts.
- **Hardcoding couleurs** (bleu/gris) qui s’écarte des tokens/theme (risque de dérive cross‑apps).

Standardisations proposées (cross‑apps) :
- Unifier conventions : filtres URL (`all` ⇒ param supprimé), debounce, empty states, feedback (toasts vs indicateurs).
- Unifier primitives : inputs/boutons/links via `@make-the-change/core/ui`.
- Définir un contrat “surfaces” : max 2 styles par écran (cf web-client : Effet esthétique‑usabilité).

## 6) Backlog priorisé (impact/effort) — recommandations actionnables

| Priorité | Reco | Impact | Effort | Sources | Zone / fichiers |
|---|---:|---:|---:|---|---|
| P0 | Standardiser debounce recherche (hook partagé) | H | M | [UX:Doherty], [Neuro:Fluency] | Users/Orders/others |
| P0 | Uniformiser filtres URL (`all` ⇒ remove param) | H | S | [UX:Jakob], [UX:Hick] | Users/Orders vs Products |
| P0 | Remplacer couleurs hardcodées par tokens | M/H | M | [Color:60‑30‑10], [Color:Contraste] | admin-layout header, save status |
| P1 | Unifier le système de layout (1 kit) | H | M/H | [UX:Esthétique‑Usabilité], [UX:Jakob] | `components/layout` vs `components/admin-layout` |
| P1 | Redesign dashboard “task-first” (1 CTA dominant) | H | M | [UX:Fitts], [UX:Hick], [Neuro:Self‑persona] | dashboard-client |
| P1 | Réduire l’ornementation (mode “travail”) | M | M | [Neuro:Fluency] | shell, sidebar |
| P2 | Audit accessibilité complet (focus/contraste/clavier) | H | M | [Color:Contraste], [UX:Jakob] | global admin |
| P2 | Instrumenter métriques UX admin | M | M | [UX:Doherty], [Neuro:Engagement] | analytics/events |

## 7) Propositions de redesign (patterns)

### Pattern A — Dashboard “Task-first”
Objectif : réduire le temps de décision (Hick) et rendre la prochaine action évidente (Fitts).
- Bloc 1 (above-the-fold) : 2–3 cartes “À traiter” (ex: “Commandes en attente”, “Ruptures stock”, “Partenaires à valider”) avec **1 CTA dominant**.
- Bloc 2 : KPI secondaires (tendances) moins accentués (60‑30‑10).
- Bloc 3 : liens rapides secondaires (outline/ghost).

### Pattern B — Header de liste unifié
Objectif : cohérence Jakob + fluence cognitive.
- Ligne 1 : Search + CTA principal + ViewToggle.
- Ligne 2 (optionnelle desktop) : 1–2 filtres principaux + “Plus de filtres” (bottom sheet).
- Convention : `all` supprime le filtre ; “Reset” toujours visible si filtre actif.

### Pattern C — Autosave “silencieux mais clair”
Objectif : feedback Doherty sans bruit.
- Indicateur discret persistent (Saved/Modified/Saving/Error) + toast uniquement sur erreur.
- Couleurs via tokens (contraste vérifié).

## 8) Métriques de succès (validation)
Quantitatif :
- **Time-to-task** : temps pour atteindre “Traiter commandes” depuis arrivée dashboard.
- **Filter efficiency** : % sessions où search/filtres sont utilisés, et temps moyen pour obtenir un résultat.
- **Error rate** : taux d’échecs sur sauvegarde/édition ; nombre de retries.
- **Scroll depth (admin)** : proportion d’actions accessibles sans scroll sur pages critiques (Fitts).
- **Perf perçue** : temps avant premier feedback après action (Doherty).

Qualitatif (tests internes) :
- **Fluence** : “Je comprends où cliquer” (1–5).
- **Confiance** : “Je suis sûr que c’est sauvegardé” (1–5).
- **Fatigue visuelle** : “L’interface me fatigue” (1–5) (ornementation).

## 9) Plan d’implémentation phasé (jalons mesurables)

### Phase P0 (1–3 jours)
- Debounce unifié + convention `all` sur toutes listes.
- Remplacement des couleurs hardcodées les plus visibles par tokens.
- Autosave : limiter les toasts au strict nécessaire (erreurs).
**Jalons** : 0 “clic silencieux” sur actions clés ; filtres cohérents sur 3 pages (Users/Orders/Products).

### Phase P1 (3–7 jours)
- Décision “1 kit de layout” et migration progressive (page par page).
- Redesign dashboard en mode task-first + 1 CTA dominant.
**Jalons** : cohérence visuelle perçue (checklist) ; time-to-task réduit (baseline vs après).

### Phase P2 (1–2 semaines)
- Audit accessibilité complet + corrections (focus, contraste, navigation clavier).
- Simplification des ornements visuels (mode travail) + instrumentation métriques.
**Jalons** : checklist a11y admin validée ; rapport métriques (avant/après).
