# Audit code vs documentation

Date : 2026-05-07

Portee : comparaison initiale entre la documentation `apps/web-client/doc` et le code de `apps/web-client`.

## Resume executif

La documentation decrit correctement l'intention globale du produit, mais le code reste dans un etat prototype hybride : mock-first, Supabase partiel, Stripe partiel, i18n partiel, et vocabulaire technique legacy encore present. La refonte documentaire doit donc distinguer strictement la realite code de la cible produit.

## Navigation et routes

| Sujet | Documentation (avant R8) | Code actuel observe | Statut |
|---|---|---|---|
| Tab 1 | Aventure `/adventure` | Accueil `/adventure` — label UI "Accueil" dans `mobile-bottom-nav.tsx` | `[ACTUEL_CODE]` |
| Tab 2 | Projets `/projects` | Projets `/projects` | `[ACTUEL_CODE]` |
| Tab 3 | Collectif `/impact` | **Apprendre `/learn`** — dossier `(tabs)/learn/`. La route `/impact` n'existe plus. | `[ACTUEL_CODE]` — ancienne doc obsolete |
| Tab 4 | Avantages `/products` | **Avantages `/advantages`** — dossier `(tabs)/advantages/`. La route `/products` n'existe plus sous (tabs). | `[ACTUEL_CODE]` — ancienne doc obsolete |
| Tab 5 | Profil `/profile` | Profil `/profile` | `[ACTUEL_CODE]` |
| Challenges | Routes secondaires liees a Aventure | `/challenges`, `/challenges/eco-fact`, `/challenges/daily-harvest` | `[ACTUEL_CODE]` |
| Academy | Decrite comme experience d'apprentissage, parfois associee au lab | Presente surtout dans `(screens)/academy`, avec labs `kinnu` et `kinnu-v2` ailleurs | `[ACTUEL_CODE]` + `[A_VERIFIER_CODE]` |
| BioDex | Profil/BioDex, collection d'especes | `/profile/biodex`, `/profile/biodex/[id]` | `[ACTUEL_CODE]` |

`[LEGACY]` Le changement de navigation (Collectif→Apprendre, /impact→/learn, /products→/advantages) s'est produit apres R8 (2026-05-08) et n'etait pas couvert par les phases R1-R8. Voir section R9 dans CHANGELOG-REFACTO-DOC.md.

## Donnees et sources

| Sujet | Code observe | Implication documentaire |
|---|---|---|
| Mock-first | `NEXT_PUBLIC_MTC_DATA_SOURCE`, defaut `mock` | `[ACTUEL_CODE]` Le prototype fonctionne d'abord par mocks. |
| Supabase | Clients `supabase/*`, services projets/produits/species | `[ACTUEL_CODE]` Integration partielle, pas source unique generalisee. |
| Projets | `getProjects` fusionne mocks + Supabase hors mock mode | `[RISQUE]` Etat hybride a documenter clairement. |
| Produits | `getProducts` peut fusionner mocks et `public_products` | `[RISQUE]` Catalogue pas encore modele final. |
| BioDex | `v_species_context` ou mocks selon mode | `[ACTUEL_CODE]` BioDex partiellement pret a une source Supabase. |

## Paiement, don et soutien

| Sujet | Code observe | Ecart |
|---|---|---|
| Don | Route `/projects/[slug]/donate` pour types `reef`/`coral` | `[ACTUEL_CODE]` Flow separe mais paiement final a verifier. |
| Soutien producteur | Route `/projects/[slug]/invest` pour `beehive`, `olive_tree`, `vineyard` | `[ACTUEL_CODE]` Le vocabulaire code reste `invest/investment`. |
| Stripe | API `payments/create-intent`, webhook Stripe, Elements UI | `[ACTUEL_CODE]` Integration presente mais partielle. |
| Metadata Stripe | `order_type` accepte `investment`, `product_purchase`, `subscription` | `[RISQUE]` Pas de `donation` dans l'API generique observee. |
| Simulation UI | Certains flows passent en succes via temporisation client | `[A_VERIFIER_CODE]` A clarifier avant documentation publique. |

## Vocabulaire legacy

| Terme | Presence code | Statut |
|---|---|---|
| `investment` | Routes, actions, metadata, types, mocks | `[ACTUEL_CODE]` + `[DEPRECIE]` — migration vers `producer_support` reservee P2. |
| `points` | Supabase V0 uniquement (`points_balance`, `amount_points`, `price_points`) — retire des mocks TypeScript en R8 (2026-05-08) | `[PARTIELLEMENT_FERME_R8]` — `impactCreditsBalance` dans les mocks TypeScript, `points` reste dans Supabase `[A_NE_PAS_TOUCHER]`. |
| `Artisans Locaux` | Supabase V0 uniquement — retire du TypeScript en R7 (2026-05-08) | `[FERME_R7]` — purge complete des mocks, types, session, onboarding, impact TypeScript. Reste uniquement dans Supabase V0 `[A_NE_PAS_TOUCHER]`. |
| `financement` | Utilise pour progression projets | `[A_DECIDER]` acceptable si pas promesse financiere ambiguë. |

## BioDex

- `[ACTUEL_CODE]` Le BioDex lit des especes depuis mocks ou `v_species_context`.
- `[ACTUEL_CODE]` `ensurePrototypeUnlockedSpecies` debloque une espece prototype si aucune espece n'est debloquee.
- `[RISQUE]` Cette exception peut contredire la cible : deblocage lie a une action, un projet ou un apprentissage.
- `[A_DECIDER]` Il faut definir les sources officielles de deblocage : don, soutien producteur, Academy, challenges, evenement manuel.

## Academy

- `[ACTUEL_CODE]` Academy existe comme route immersive dans `(screens)/academy`.
- `[ACTUEL_CODE]` Des labs lies a l'apprentissage existent aussi dans `(lab)/kinnu` et `(lab)/kinnu-v2`.
- `[RISQUE]` La documentation ne doit pas laisser croire que les labs sont l'Academy finale.
- `[A_DECIDER]` Il faut choisir si Kinnu reste une reference interne, une inspiration ou un module produit.

## i18n et contenu

- `[ACTUEL_CODE]` `next-intl` est configure.
- `[ACTUEL_CODE]` Les routes sont locale-aware via `[locale]`.
- `[ACTUEL_CODE]` Beaucoup de textes UI restent hardcodes dans les composants.
- `[A_VERIFIER_CODE]` Aucun dossier `messages` ou fichiers de traduction JSON n'a ete identifie dans `apps/web-client` pendant cette passe.
- `[RISQUE]` La documentation doit parler d'i18n partiel, pas d'i18n complet.

## Top 10 ecarts prioritaires

1. `[ACTUEL_CODE]` `investment` reste structurant dans le code alors que la cible produit parle de soutien producteur. — `[OUVERT]` P2
2. `[ACTUEL_CODE]` `points` reste present dans `mock-member-data.ts` : types (`MockPointsTransactionRecord`), champs (`total_points`, `unit_price_points`, `amount_points`, `returns_received_points`), fonctions (`getMockPointsTransactions`). `[PARTIELLEMENT_TRAITE_R8]` — R8 a renomme `Profile.points` → `impactCreditsBalance` uniquement. Le reste est en attente de migration progressive. Reste aussi dans Supabase V0 `[A_NE_PAS_TOUCHER]`.
3. ~~`[ACTUEL_CODE]` `Artisans Locaux` reste present alors qu'il est considere legacy/deprecie.~~ `[FERME_R7]` (2026-05-08) — purge complete du TypeScript (types, mocks, session, onboarding, impact).
4. `[ACTUEL_CODE]` Academy est en `(screens)/academy`, pas seulement en lab. — `[OUVERT]`
5. `[ACTUEL_CODE]` BioDex a une exception prototype de deblocage automatique. — `[OUVERT]` P2
6. `[ACTUEL_CODE]` Don et soutien producteur sont separes en routes, mais pas encore parfaitement separes en modele paiement. — `[OUVERT]`
7. `[ACTUEL_CODE]` Stripe est present mais pas a documenter comme finalise. — `[OUVERT]`
8. `[ACTUEL_CODE]` Supabase est partiel et cohabite avec les mocks. — `[OUVERT]`
9. `[ACTUEL_CODE]` L'i18n est technique mais les contenus restent largement hardcodes. — `[OUVERT]`
10. `[RISQUE]` Les preuves d'impact et business/RSE peuvent etre lues comme plus validees qu'elles ne le sont. — `[PARTIELLEMENT_TRAITE]` wording UI adouci en passe finale (2026-05-08).

## Regle pour la nouvelle documentation

Chaque affirmation doit indiquer sa nature : code actuel, cible validee, hypothese, test a mener, decision a prendre, verification code, deprecie ou risque.
