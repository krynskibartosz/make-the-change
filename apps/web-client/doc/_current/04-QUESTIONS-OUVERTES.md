# 04 - Questions ouvertes

## Role de ce document

Ce document sert de tableau de suivi des arbitrages. Les decisions detaillees restent dans `03-DECISIONS-VALIDEES.md` et les justifications restent dans `_audit/`.

## P0 traitees

| ID | Sujet | Statut | Decision courte | Audit lie | Restes a decider |
|---|---|---|---|---|---|
| P0-1 | Separation don / soutien producteur / achat | `[CIBLE_VALIDEE]` | Don pur, soutien producteur et achat produit sont separes. | `03-DECISIONS-VALIDEES.md` | Details fins de conversion, remboursement, expiration et comptabilite des Credits Impact. |
| P0-2 | Migration `investment` vers `producer_support` | `[AUDITE] [A_PLANIFIER]` | `investment` reste legacy ; `producer_support` est la cible metier. | `_audit/MIGRATION-INVESTMENT-TO-PRODUCER-SUPPORT.md` | Timing, phases techniques, compatibilite anciennes donnees et routes. |
| P0-3 | Nom technique cible des Credits Impact | `[CIBLE_VALIDEE]` | UI : Credits Impact ; DB/API future : `impact_credits` ; TypeScript futur : `impactCredits` ; `points` reste alias legacy temporaire. | `_audit/POINTS-TO-CREDITS-IMPACT-AUDIT.md` | Classer chaque occurrence de `points` selon sa famille reelle avant migration. |
| P0-4 | Deblocage BioDex | `[AUDITE]` | Deblocage par don pur ou soutien producteur explicitement lie a une espece ; achat produit, quiz seul, mission sans impact et prototype en production sont exclus. | `_audit/BIOSPECIES-UNLOCK-RULES-AUDIT.md` | Granularite projet-espece, cas multi-especes, retrocompatibilite prototype ; cout 500 Graines = `[ACTUEL_CODE] [A_TESTER]`. |
| P0-5 | Role exact de l'Academy | `[AUDITE]` | Academy apprend et comprend, peut donner des Graines, ne bloque pas l'action et ne debloque pas seule le BioDex. | `_audit/ACADEMY-ROLE-AUDIT.md` | Visibilite exacte dans Aventure, recommandations, vies, montants de Graines, contenus premium, sort des labs. |
| P0-5b | Academy / Missions / Challenges / Aventure | `[AUDITE]` | Aventure orchestre ; Academy apprend ; Missions guident ; Challenges structurent ; Projets portent l'impact reel. | `_audit/ACADEMY-MISSIONS-CHALLENGES-AVENTURE-DISTINCTION.md` | Termes UI exacts, formats des missions, hebdomadaire vs quotidien, confusion code mission/challenge. |
| P0-6 | Niveau de preuve d'impact | `[CIBLE_VALIDEE] [A_PLANIFIER]` | V1 affiche preuves simples, pedagogie et estimations prudentes ; pas de preuve mesuree ou claim RSE sans methode robuste. | `_audit/IMPACT-PROOF-LEVELS-AUDIT.md` | Systeme technique de niveaux de preuve par claim, projet et metrique. |
| P0-7 | Promesse business initiale | `[VALIDEE]` | Soutenir des projets biodiversite concrets, comprendre son geste et progresser dans une aventure vivante. | `_audit/BUSINESS-INITIAL-PROMISE-AUDIT.md` | Tester conversion don/soutien, comprehension, retention, boutique secondaire et besoin RSE. |
| P0-8 | Statut de `Artisans Locaux` | `[AUDITE] [CIBLE_VALIDEE]` | `Artisans Locaux` est une faction legacy depreciee ; seules factions cibles : Vie Sauvage, Terres & Forets, Gardiens des mers. | `_audit/ARTISANS-LOCAUX-STATUS-AUDIT.md` | Faction par defaut apres migration ; strategie pour utilisateurs ou mocks encore en `Artisans Locaux`. |
| P0-9 | Statut Stripe | `[AUDITE]` | Cible : flows economiques separes ; recu de paiement/contribution, pas recu fiscal ; paiement confirme ne veut pas dire impact mesure. | `_audit/STRIPE-STATUS-AUDIT.md` | `[ACTUEL_CODE]` donation/invest creent des PaymentIntent reels ; `[ACTUEL_CODE] [SIMULE] [RISQUE]` produit est simule ; migration metadata, remboursements, harmonisation `create-intent`. |
| P0-10 | Source de verite data a court terme | `[AUDITE] [CIBLE_VALIDEE]` | Mocks = source prototype ; Supabase = legacy a ne pas toucher ; DB V2 = plus tard apres stabilisation. | `_audit/DATA-SOURCE-TRUTH-AUDIT.md` | Stabilisation des 5 mocks critiques ; strategie doublons mock/Supabase. |

## P0 a traiter

| ID | Sujet | Priorite | Pourquoi c'est important | Statut |
|---|---|---|---|---|
| P0-10a | Quand figer la structure des mocks ? | Haute | Timing de stabilisation des mocks structurants avant migration V2. | `[A_DECIDER]` |
| P0-10b | Comment gerer les doublons mock/Supabase ? | Haute | Certains slugs existent dans les deux sources, risque de donnees dupliquees. | `[A_DECIDER]` |
| P0-10c | Les routes API doivent-elles aussi etre hybrides ? | Moyenne | Actuellement les routes API ignorent `isMockDataSource`. | `[A_DECIDER]` |
| P0-11 | Strategie future DB V2 | Haute apres P0-10a | Definir comment passer des flows valides et mocks stabilises vers une base propre sans casser l'admin legacy. | `[A_DECIDER] [PLUS_TARD]` |

## P1 / P2 plus tard

| ID | Sujet | Domaine | Statut |
|---|---|---|---|
| P1-1 | Onboarding le plus efficace : faction, projet, BioDex ou Academy | Produit / acquisition | `[A_TESTER]` |
| P1-2 | Comprehension Graines vs Credits Impact | UX / gamification | `[A_TESTER]` |
| P1-3 | Boutique produits, avantages ou les deux | Business / UX | `[A_DECIDER] [A_TESTER]` |
| P1-4 | Role final de la tab Collectif | Produit / impact | `[A_DECIDER]` |
| P1-5 | Role des mascottes | Produit / design | `[A_DECIDER]` |
| P1-6 | Role exact de l'abonnement Ambassadeur | Business | `[A_DECIDER] [A_TESTER]` |
| P2-1 | Niveau de personnalisation par faction | Produit / gamification | `[A_DECIDER]` |
| P2-2 | Rythme de contenu Academy | Pedagogie / retention | `[A_DECIDER]` |
| P2-3 | Reporting RSE vendable et prudent | Business / impact | `[A_TESTER]` |
| P2-4 | Frequence saine de retour utilisateur | UX / retention | `[A_TESTER]` |
