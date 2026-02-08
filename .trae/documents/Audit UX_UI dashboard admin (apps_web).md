## Objectif & livrable
- Produire un **rapport unique** (Markdown) appliquant les 3 bases de connaissance (Lois UX, Couleur, Neuro‑Persuasion) au **dashboard admin** de [apps/web](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/), en tenant compte des analyses déjà faites côté [apps/web-client](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/).
- Créer un fichier : `apps/web/WEB_ADMIN_DASHBOARD_UX_UI_AUDIT.md` (emplacement proposé pour rester proche du scope).

## Principes théoriques extraits (référentiel)
### Lois UX & ergonomie (Jon Yablonski)
- **Loi de Jakob** : respecter les modèles mentaux connus → éviter les patterns “surprenants” sans gain clair. Critère : navigation et conventions familières.
- **Loi de Fitts** : atteindre une cible dépend distance + taille → CTA/boutons importants gros, accessibles, en “zone de confort” (mobile). Critère : taille, placement, accessibilité du CTA.
- **Loi de Hick** : plus de choix = décision plus lente → réduire options visibles, progressive disclosure. Critère : menus/filtres pas surchargés.
- **Loi de Miller (chunking)** : mémoire de travail limitée (~7±2) → regrouper, séparer en blocs. Critère : densité info, sections digestes.
- **Seuil de Doherty (<400ms)** : feedback immédiat ou skeleton/animation. Critère : aucun clic “silencieux”, états de chargement cohérents.
- **Effet esthétique‑usabilité** : cohérence visuelle = perception de meilleure utilisabilité. Critère : design homogène, pas de styles concurrents.
- **Gestalt – Proximité** : items proches = groupe. Critère : titres collés à leur contenu, spacing maîtrisé.
- **Gestalt – Région commune** : conteneurs/cadres renforcent le groupement. Critère : cartes/sections pour segmenter.

### Théorie & sémantique couleur (Adams + MATE ART)
- **Règle 60‑30‑10** : dominante neutre / secondaire marque / accent CTA unique. Critère : pas de compétition d’accents.
- **Valeur & contraste** : la luminosité prime sur la teinte → lisibilité (WCAG). Critère : contraste texte/fond.
- **Température** : chaudes avancent / froides reculent → CTA “chauds” ou très contrastés. Critère : CTA ressort sans ambiguïté.
- **Sémantique** : bleu=confiance, rouge=urgence/danger, vert=nature/permission, noir=luxe. Critère : cohérence marque/message.
- **Vibrance / dissonance** : éviter 2 couleurs saturées complémentaires / valeur égale superposées (scintillement). Critère : combos texte/fond stables.

### Neuro‑persuasion (Weinschenk + Cialdini)
- **Cerveau ancien (Système 1)** : décide vite via émotion/sécurité → visuels clairs, bénéfice immédiat.
- **Validation sociale** : preuve proche du point de friction.
- **Rareté/urgence** : seulement si authentique.
- **Réciprocité** : donner de la valeur avant de demander.
- **Engagement & cohérence** : micro‑actions → engagement plus fort.
- **Confiance – fluidité cognitive** : lisibilité, langage simple, conventions UI = “sûr/vrai”.
- **Self‑persona** : renforcer l’identité (“vous”, mirroring). Dans un admin : renforcer l’identité “opérateur compétent” (clarté, contrôle, absence de surprise).

## Analyse du dashboard admin (apps/web) selon ces principes
### 1) Architecture de l’information & navigation
**Constats**
- Le shell dashboard est robuste et structuré (sidebar + mobile header + mobile sidebar) : [layout.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/layout.tsx).
- Le menu est globalement simple (Dashboard + 1 section “management”), mais l’UI du menu est **très “ornementale”** (gradients, pulsations, blur) : [admin-sidebar.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/layout/admin-sidebar.tsx).

**Friction / risques (trace théorique)**
- **Jakob + esthétique‑usabilité** : coexistence de **deux systèmes de layout** (`components/layout/*` vs `components/admin-layout/*`) → incohérences de header/spacing/composants (ex: Users/Orders vs Products). Sources : [admin-page-header.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/layout/admin-page-header.tsx) vs [components/admin-layout/header.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/admin-layout/header.tsx).
- **Hick** : le menu mobile utilise un accordéon + nombreuses animations; sur un admin, la vitesse d’accès et la prévisibilité priment.

**Recommandations actionnables**
- Standardiser le dashboard admin sur **un seul kit de layout** (idéalement celui basé sur `@make-the-change/core/ui` + tokens), et déprécier l’autre.
- Simplifier le menu mobile : réduire les effets “premium” si cela nuit à la lecture/scan.

### 2) Hiérarchie visuelle & chunking
**Constats**
- Les pages “listes” (Users/Orders) suivent un pattern : Header (filtres) → grille/liste → pagination : [users-client.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/users/users-client.tsx), [orders-client.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/orders/orders-client.tsx).
- Les pages “détail” sont bien chunkées via `DetailView.Section` (Miller + région commune) : [product-edit-client.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/products/%5Bid%5D/product-edit-client.tsx).

**Friction / risques (trace théorique)**
- **Fitts** : `AdminPageContent` pousse le contenu avec `pt-40/pt-52` : [content.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/admin-layout/content.tsx). Risque : information “au‑dessus de la ligne de flottaison” moins dense/utile, actions principales plus loin.
- **Miller/Hick** : sur l’édition produit, de très longues listes de suggestions hardcodées (catégories/tags/allergènes/certifications) augmentent la charge cognitive et la friction (scan difficile).

**Recommandations actionnables**
- Réduire les paddings top “massifs” et privilégier un header réellement sticky (avec hauteur maîtrisée).
- Passer les suggestions à des datasets réels / autocomplétion server, ou à minima limiter l’affichage (top N + recherche).

### 3) Choix chromatiques & cohérence (60‑30‑10 / contraste / température)
**Constats**
- Le shell utilise `bg-background`, `primary`, `accent` et des overlays très faibles → plutôt safe (dominante neutre + accents discrets) : [layout.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/layout.tsx), [admin-background-decoration.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/layout/admin-background-decoration.tsx).

**Friction / risques (trace théorique)**
- **Esthétique‑usabilité + Jakob** : certains composants utilisent des couleurs “fixes” (bleu/rouge/jaune en classes Tailwind direct, gris) au lieu des tokens/theme.
  - Exemple: champ search du header admin‑layout (`focus:ring-blue-500`, `border-gray-300`) : [components/admin-layout/header.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/admin-layout/header.tsx).
  - Exemple: save status (blue/red/yellow backgrounds + emojis) : [admin-detail-header.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/layout/admin-detail-header.tsx).
- **Valeur/contraste** : les badges/couleurs de statut doivent être vérifiés (contraste texte/fond, dark mode).

**Recommandations actionnables**
- Remplacer les couleurs fixes par **tokens** (`primary/accent/muted/destructive/success/warning/info`) pour cohérence + accessibilité.
- Définir une règle “1 accent interactif par zone” (60‑30‑10) : ex. sur dashboard, éviter 3–4 gradients concurrents dans un même viewport.

### 4) Patterns d’interaction (filtres, recherche, états, feedback)
**Constats**
- Bonne direction sur Products : filtres desktop visibles + bottom sheet mobile (réduction Hick/Miller) : [products-client.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/products/products-client.tsx) + [filter-modal.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/admin-layout/filter-modal.tsx).
- Feedback : toasts global + loaders + empty states.

**Friction / risques (trace théorique)**
- **Doherty + Hick** : “debounce” de recherche incorrect sur Users/Orders (setTimeout sans cleanup effectif) → triggers multiples, latence variable, inconfort. Fichiers : [users-client.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/users/users-client.tsx), [orders-client.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/orders/orders-client.tsx).
- **Jakob/Hick** : valeur `'all'` envoyée dans l’URL pour certains selects (Users/Orders) au lieu de “retirer le filtre” → ambiguïté côté serveur et incompréhension possible.
- **Doherty** : sur product edit, toasts “succès” à chaque autosave peuvent devenir du bruit (cognitive load).

**Recommandations actionnables**
- Standardiser un hook de “debounced query param update” partagé pour toutes les pages listes.
- Uniformiser la convention : `all` => suppression du param (comme c’est fait sur Products).
- Clarifier feedback autosave : privilégier un indicateur discret persistent (status) plutôt qu’un toast répétitif.

### 5) Accessibilité (a11y)
**Constats**
- Mobile sidebar : focus trap + Escape + scroll lock (bon socle) : [admin-sidebar.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/layout/admin-sidebar.tsx).

**Friction / risques (trace théorique)**
- **Valeur/contraste** : vérifier toutes les variantes (badge, états, boutons) sur dark mode.
- **Jakob/Processing Fluency** : composants hors design system (inputs/boutons custom) → focus styles hétérogènes.
- Breadcrumbs utilisent `<a href>` non localisé et sans composant lien standard (risque de navigation full reload et incohérence i18n) : [admin-detail-header.tsx](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web/src/app/%5Blocale%5D/admin/(dashboard)/components/layout/admin-detail-header.tsx).

**Recommandations actionnables**
- Auditer focus visible / keyboard nav sur toutes les pages clés (Dashboard, Lists, Edit).
- Remplacer les liens/boutons “raw” par les primitives core UI quand possible.

### 6) Performance cognitive & “persuasion” (adaptée admin)
**Constats**
- L’admin cherche surtout : **confiance, contrôle, vitesse** (self‑persona “je gère”).

**Friction / risques (trace théorique)**
- **Processing fluency** : trop d’ornements (blur/gradients/pulses) peut “charger” visuellement un outil métier.
- **Engagement & cohérence** : manque de micro‑progression orientée “tâches” (ex: “3 produits en rupture”, “2 commandes à traiter”).

**Recommandations actionnables**
- Transformer le dashboard en “task board” : 2–3 cartes d’actions prioritaires (Fitts + Hick) + indicateurs fiables.
- Introduire des micro‑copies orientées action et sécurité (“Dernière synchro”, “Sauvegarde OK”) pour renforcer la confiance.

## Capitalisation web-client (éviter redondances)
- Les principes déjà actés côté web-client (double navigation mobile, filtres en bottom sheet, CTA unique, surfaces max 2 styles, contraste sur visuels, feedback immédiat) sont documentés dans :
  - [WEB_CLIENT_UX_UI_AUDIT.md](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/WEB_CLIENT_UX_UI_AUDIT.md)
  - [WEB_CLIENT_UX_UI_ACTION_PLAN.md](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/WEB_CLIENT_UX_UI_ACTION_PLAN.md)
  - [WEB_CLIENT_ANALYSE_OPPORTUNITES.md](file:///Users/bartoszkrynski/Downloads/Development/make-the-change/apps/web-client/WEB_CLIENT_ANALYSE_OPPORTUNITES.md)
- Convergence déjà visible dans admin : bottom sheet filters (Products), usage de `DetailView.Section` (chunking), focus trap sur mobile sidebar.
- Divergence principale : présence de composants “legacy” avec styles hardcodés (bleu/gray) et double système de layout.

## Structure du fichier Markdown à générer
Le fichier `apps/web/WEB_ADMIN_DASHBOARD_UX_UI_AUDIT.md` contiendra :
- Vue d’ensemble : problèmes majeurs + risques (UX, cohérence, accessibilité, perf cognitive).
- Tableau “constat → principe → recommandation → effort/impact → fichiers concernés”.
- Analyse par composants (shell, sidebar, mobile header/sidebar, dashboard page, listes, filtres, détails/édition, toasts).
- Propositions de redesign (wireframe textuel) orientées : 1 CTA dominant / progressive disclosure / 60‑30‑10.
- Métriques de succès : temps pour atteindre une action clé, taux d’usage filtres, erreurs, temps de complétion d’une tâche admin.
- Plan d’implémentation phasé (P0/P1/P2) + jalons mesurables.

## Phasage recommandé (impact/effort)
- **P0 (rapide, fort impact)** : standardiser filtres/recherche (debounce + `all`), corriger incohérences de tokens couleurs sur composants critiques, réduire bruit feedback autosave.
- **P1 (cohérence design)** : unifier le système de layout (déprécier `admin-layout` ou `components/layout`), harmoniser inputs/boutons, revoir hiérarchie du dashboard (task-first).
- **P2 (qualité & confiance)** : audit accessibilité complet (clavier/contraste), simplification des ornements visuels, instrumentation des métriques UX admin.

## Après validation
- Générer le fichier Markdown final dans `apps/web/WEB_ADMIN_DASHBOARD_UX_UI_AUDIT.md` avec toutes les sections ci-dessus, et des références explicites aux sources théoriques + liens vers les fichiers concernés.