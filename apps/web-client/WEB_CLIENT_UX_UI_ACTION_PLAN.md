# Plan D’Actions Priorise (Pragmatique) - Web-Client

Ce plan transforme l’audit `apps/web-client/WEB_CLIENT_UX_UI_AUDIT.md` en backlog actionnable.

## Decision (Est-ce qu’on l’applique ?)
**Oui, mais partiellement.**

On applique maintenant:
- Ce qui reduit la friction (Jakob, Hick, Miller, Fitts) et augmente la conversion sans “fake” (preuve sociale credible, CTA plus clairs, feedback rapide).

On ne fait pas (pour l’instant):
- **Rareté / urgence** si on n’a pas de donnees reelles (ne pas simuler).
- Refonte complete de palette si le theme global (packages) n’est pas pret (on prefere des ajustements localises et une harmonisation de surfaces).

## Criteres de priorisation
- **Impact business**: augmente la conversion / retention.
- **Reduction de charge cognitive**: moins de choix visibles, plus de chunking.
- **Effort**: change local dans web-client vs changement cross-packages.

Notation:
- Impact: H/M/L
- Effort: H/M/L

## Etat actuel (deja fait)
- Bottom nav mobile + footer masque sur mobile.
- Hero descriptions reduites sur mobile (via `hideDescriptionOnMobile`).
- Carrousels horizontaux sur mobile (Home, About, How it works, etc.).
- Leaderboard mobile-first (podium compact, “Votre rang”, liste dense, trends).
- Register en wizard (3 etapes).
- CTA sticky mobile sur product detail.

## Backlog priorise

### P0 (a faire en premier) - 1 a 3 jours

1. **Supprimer la double navigation sur mobile (Header vs BottomNav)**
- Probleme: doublon de patterns -> hesitation / friction.
- Theorie: Loi de Jakob (modele mental), Loi de Hick (choix).
- Actions:
- Rendre le header mobile “top bar” minimal (logo + 1 action contextuelle max).
- Supprimer le hamburger menu de navigation (ou le limiter a “More” seulement) quand BottomNav est present.
- S’assurer qu’il n’existe pas deux headers sur Dashboard (global header + `DashboardMobileHeader`).
- Fichiers candidats:
- `apps/web-client/src/app/[locale]/layout.tsx`
- `apps/web-client/src/components/layout/header.tsx`
- `apps/web-client/src/app/[locale]/(dashboard)/layout.tsx`
- Critere d’acceptation:
- Mobile: un seul pattern de navigation principal visible.
- Dashboard mobile: une seule top bar.

2. **Filtrage mobile: conserver 1-2 filtres visibles, le reste en Bottom Sheet**
- Probleme: chips + tabs + search = surcharge.
- Theorie: Hick + Miller.
- Actions:
- Products: garder “Recherche” + “Categorie” (chip) + bottom sheet pour le reste.
- Projects: garder “Status” (segmented) + “Recherche” + bottom sheet.
- Fichiers candidats:
- `apps/web-client/src/app/[locale]/products/products-client.tsx`
- `apps/web-client/src/app/[locale]/projects/projects-client.tsx`
- Nouveau composant:
- `apps/web-client/src/components/ui/bottom-sheet.tsx` (ou base-ui sheet si dispo)
- Critere d’acceptation:
- Mobile: max 2 lignes de controles au-dessus des resultats.

3. **Preuve sociale proche des CTA (sans inventer)**
- Probleme: peu de validation sociale au point de friction.
- Theorie: Validation Sociale (Cialdini).
- Actions:
- Home hero: afficher un compteur credible (ex: projets actifs, investisseurs inscrits) si data dispo.
- Projects listing / detail: afficher “X soutiens” ou “X investissements” uniquement si mesurable.
- Product detail: afficher “X echanges” uniquement si mesurable.
- Critere d’acceptation:
- Les preuves sociales sont placees a moins d’un ecran du CTA.
- Les valeurs sont reelles ou clairement neutres (ex: “+10k” seulement si vrai).

4. **CTA principal: rendre l’accent incontestable (60-30-10)**
- Probleme: CTA parfois trop proche du fond.
- Theorie: Temperature + 60-30-10 + Fitts.
- Actions:
- Definir un style “Primary CTA” constant (meme rayon, meme hauteur, meme contraste).
- Limiter a un seul accent d’action par ecran (les secondaires en outline/ghost).
- Critere d’acceptation:
- Sur chaque ecran, 1 CTA domine clairement.

### P1 (ensuite) - 3 a 7 jours

5. **Dashboard: chunking + reduction above-the-fold**
- Probleme: trop d’infos visibles -> fatigue.
- Theorie: Miller + Region Commune.
- Actions:
- Garder 2-3 cartes top (Impact score, Projets, Points).
- Regrouper le reste en sections “accordeon” (Activite, Progression niveau, Objectif).
- Critere d’acceptation:
- Mobile: action principale visible sans scroller.

6. **Harmonisation des surfaces (2 styles max)**
- Probleme: mix glass/flat/gradient -> incoherence.
- Theorie: Effet Esthetique-Usabilite.
- Actions:
- Creer 2 wrappers: `SurfaceCard` (standard) et `GlassCard` (premium).
- Appliquer aux pages clés (Home/Listing/Detail/Dashboard).
- Critere d’acceptation:
- Un ecran n’utilise pas plus de 2 styles de surfaces.

7. **Contraste texte sur visuels**
- Probleme: risque de faible lisibilite sur images.
- Theorie: Valeur & Contraste.
- Actions:
- Standardiser un overlay (intensite fixe) pour toutes les images hero.
- Critere d’acceptation:
- Texte lisible sur toutes les images (noir/blanc net).

8. **Feedback immediat (Doherty)**
- Probleme: certaines actions manquent de feedback.
- Theorie: Seuil de Doherty.
- Actions:
- Skeleton sur sections qui chargent.
- Toast/confirmation courte pour actions (upload, submit).
- Critere d’acceptation:
- Aucun clic “silencieux” sur action primaire.

### P2 (later) - 1 a 3 semaines

9. **Refactor layouts par route-groups (proprement “app-like”)**
- Objectif: separer marketing/auth/dashboard pour supprimer hacks conditionnels.
- Theorie: Jakob (patterns clairs) + Hick.
- Actions:
- Creer un layout “public” avec header/footer.
- Laisser dashboard/auth avec leur top bar propre.
- Critere d’acceptation:
- Pas de header/footer global sur auth/dashboard.

10. **Persuasion “Cerveau Ancien” sur les pages d’action**
- Objectif: benefice immediat + emotion.
- Theorie: Cerveau Ancien + Fluidite cognitive.
- Actions:
- Ajouter micro-blocs visuels (impact direct, mini “avant/apres”, visages) dans les heros des pages Projets/Produit.
- Critere d’acceptation:
- 1 element visuel “emotion/benefice” visible avant le CTA.

## KPI de validation (pragmatique)
- Reduction du temps pour atteindre un CTA (scroll/clics).
- CTR sur CTA “Investir” / “Explorer” / “Echanger”.
- Taux de completion Register (wizard).
- Usage filtres (ouverture bottom sheet vs abandon).

