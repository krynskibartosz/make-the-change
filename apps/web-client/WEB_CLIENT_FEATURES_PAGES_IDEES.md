# Web-Client - Features / Pages / Idees (Backlog)

Scope: `apps/web-client` uniquement.
Objectif: experience premium "app-like" mobile-first (investir + e-commerce + gamification).

Ce document liste uniquement des fonctionnalites, pages et idees produit (pas de tech debt / infra).

---

## 1) Pages Public (Acquisition + Conversion)

Routes:
- `/[locale]` (Accueil)
- `/[locale]/about`
- `/[locale]/how-it-works`
- `/[locale]/leaderboard`
- `/[locale]/profile/[id]` (profil public)
- A ajouter: `/[locale]/faq`, `/[locale]/contact`, `/[locale]/privacy`, `/[locale]/terms`
- A ajouter: `/[locale]/blog`, `/[locale]/blog/[slug]`, `/[locale]/blog/category/[slug]`, `/[locale]/blog/tag/[slug]`

Idees / features:
- Accueil: sections visuelles (projets en avant, categories produits, top impact makers, logos partenaires, testimonials).
- Accueil: search globale (projets + produits + profils).
- About: format "story" (timeline, chiffres clefs, valeurs) avec visuels.
- How-it-works: parcours en 3-5 etapes (cards, anims), avec CTA unique.
- Footer: liens "trust" (transparence points/impact, securite, legal).
- Blog: contenu SEO (impact stories, guides, producteurs, coulisses projets).

---

## 2) Discovery - Projets (Investir)

Routes:
- `/[locale]/projects` (listing)
- `/[locale]/projects/[slug]` (detail)

Listing:
- Filtres (mobile bottom-sheet): thematique, status, localisation, impact, budget restant.
- Tri: nouveau, populaire, financement restant, impact score.
- Vue "Liste / Carte" (map) + geoloc optionnelle.
- Pagination ou infinite scroll.
- UI cards: image forte, 1-2 KPIs max, tag "nouveau" / "presque finance".

Detail:
- Gallery images + video (si dispo), hero compact mobile.
- Bloc "Impact" en cards (2-4 chiffres lisibles) + micro copy.
- Timeline "Updates" du projet (photos, milestones).
- Preuve sociale credibles: nb investisseurs, progression, dernier update.
- CTA sticky mobile: "Investir" (1 action primaire).
- Partage: Web Share API + copy link.
- Section "Projets similaires" (bento grid).

Conversion investir:
- Wizard mobile: montant -> recap -> paiement/confirmation -> success.
- Ecran success: badge/points gagnes + share + "Suivre les updates".

---

## 3) Discovery - Produits (E-commerce)

Routes:
- `/[locale]/products` (catalog)
- `/[locale]/products/[slug]` (detail)
- A ajouter: `/[locale]/categories/[slug]` (landing categorie)

Catalog:
- Categories + tags (chips) + filtres bottom-sheet.
- Tri: popularite, prix, nouveaute, stock.
- Cards: image produit, price/points, tag (bio/local), rating (si futur).
- Search avec autosuggest (produits + categories).

Detail produit:
- Gallery + zoom + images placeholders (Unsplash/Picsum) si besoin.
- Variants (taille/pack) si present.
- Infos cles en 1 ecran: prix/points, stock, livraison/retrait, labels.
- Cross-sell: "Achetes ensemble" / "Produits similaires".

---

## 4) Panier + Checkout (E-commerce Loop)

Routes (a ajouter):
- `/[locale]/cart`
- `/[locale]/checkout` (wizard)
- `/[locale]/checkout/success`

Cart:
- Mini-cart accessible (badge count) + page panier.
- Edit quantite, remove, save for later (wishlist).
- Reco "complete your impact" (1-2 suggestions max).

Checkout:
- Wizard mobile: livraison -> adresse -> paiement -> recap.
- Paiement points (et/ou mixte si futur).
- Etat de progression visible (stepper).
- Trust: recap simple, frais clairs, delai.

Post-checkout:
- Confirmation: resume + tracking + "Continue shopping".
- Email recu + facture (PDF plus tard).

---

## 5) Auth + Onboarding (App-Like)

Routes:
- `/[locale]/login`
- `/[locale]/register`
- `/[locale]/forgot-password`
- A ajouter: `/[locale]/verify-email`, `/[locale]/onboarding`

Idees:
- Onboarding wizard apres signup:
- Etape 1: avatar + cover (profil visuel).
- Etape 2: preferences (thematiques projets, categories produits).
- Etape 3: activer profil public (opt-in) + privacy.
- Etape 4: choix notif (email/push) + locale.

---

## 6) Dashboard (Retention + Clarte)

Routes existantes:
- `/[locale]/dashboard` (home)
- `/[locale]/dashboard/profile`
- `/[locale]/dashboard/investments`
- `/[locale]/dashboard/orders`
- `/[locale]/dashboard/points`

Routes a ajouter:
- `/[locale]/dashboard/settings`
- `/[locale]/dashboard/subscription`
- `/[locale]/dashboard/notifications`

Dashboard home:
- "Quick glance": 1 KPI majeur + 2-3 mini KPIs.
- "Next best action": 1 CTA (investir / completer profil / utiliser points).
- Activity timeline cliquable (projet/commande).

Profile (dashboard):
- Upload avatar/cover + background themes.
- Toggle profil public ON/OFF + champs visibles.
- Niveau, badges, impact score, progression (compact).
- Settings: langue/timezone, securite, preferences.

Investments:
- Portefeuille: total investi, projets actifs, rendement/impact (si dispo).
- Liste projets soutenus (avec images) + acces aux updates.
- Alerts: updates recentes, projets proches de completion.

Orders:
- Liste commandes + status + tracking.
- Details commande: items, adresse, facture, support.

Points:
- Solde + historique (earned/spent).
- "Ways to earn" (cards, pas de roman).
- Redemption: suggestions produits ou boosts.

---

## 7) Leaderboard + Gamification (2026)

Routes:
- `/[locale]/leaderboard`
- `/[locale]/profile/[id]` (profil public cliquable depuis leaderboard)
- A ajouter: `/[locale]/challenges`, `/[locale]/challenges/[slug]`

Core:
- KPI gamification:
- Impact Score = poids combine (points + projets + investissement).
- Progression niveau: seuils fixes.
- Badges: milestones (1er projet, 10 projets, top 10, etc.).

Leaderboard:
- Vues: Global / Semaine / Mois / Saison.
- Filtres: pays/ville (si donnees), amis (si futur).
- Podium top 3 + liste complete.
- "Your rank" + trend (up/down) + CTA vers profil public.
- Chaque user cliquable -> profil public.

Profil public:
- Hero compact (avatar/cover) + chips: niveau, badges.
- Sections: Impact (KPI), Achievements (badges), Activite (projets/achats).
- CTA: suivre (optionnel futur), partager, comparer.

Challenges / Missions:
- Daily/weekly streaks, objectifs, seasons.
- Rewards: points, badges saisonniers, rang.

---

## 8) Support / Trust / Legal

Routes (a ajouter):
- `/[locale]/support`
- `/[locale]/support/tickets`
- `/[locale]/faq`, `/[locale]/contact`, `/[locale]/privacy`, `/[locale]/terms`

Idees:
- FAQ: accordions, recherche FAQ.
- Contact: form + categories (commande, projet, compte).
- Support tickets: statut, reponses, pieces jointes (plus tard).
- Transparence: page "Comment on calcule l'impact / points" (visuelle).

