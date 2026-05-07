# Audits et analyses - `_audit/`

Ce dossier contient les **audits et analyses détaillées** (P0 et autres).

Il sert à comprendre :
- Pourquoi une décision a été prise
- Quel était l'état du code au moment de l'audit
- Quels écarts existent entre code et documentation

---

## ⚠️ Important

**La source synthétique active reste `../_current/`**

Les audits sont des documents d'investigation et de justification, pas des documents de référence directe pour le développement quotidien.

---

## Classement des audits

### Audits initiaux / structure

| Fichier | Rôle |
|---------|------|
| `AUDIT-DOCUMENTATION-ACTUELLE.md` | Audit des anciens documents historiques |
| `PROPOSITION-STRUCTURE-DOC.md` | Justification de la nouvelle structure doc |
| `CHANGELOG-REFACTO-DOC.md` | Journal des changements documentaires |
| `CODE-VS-DOC.md` | Écarts entre code et documentation |

### Audits P0 (décisions produit)

| Fichier | Rôle | Statut |
|---------|------|--------|
| `MIGRATION-INVESTMENT-TO-PRODUCER-SUPPORT.md` | P0-2 — Migration `investment` vers `producer_support` | `[AUDITE]` |
| `POINTS-TO-CREDITS-IMPACT-AUDIT.md` | P0-3 — Migration `points` vers Crédits Impact | `[AUDITE] [CIBLE_VALIDEE]` |
| `BIOSPECIES-UNLOCK-RULES-AUDIT.md` | P0-4 — Règles de déblocage BioDex | `[AUDITE]` |
| `ACADEMY-ROLE-AUDIT.md` | P0-5 — Rôle de l'Academy | `[AUDITE]` |
| `ACADEMY-MISSIONS-CHALLENGES-AVENTURE-DISTINCTION.md` | P0-5b — Distinction Academy/Missions/Challenges/Aventure | `[AUDITE]` |
| `IMPACT-PROOF-LEVELS-AUDIT.md` | P0-6 — Niveaux de preuve et prudence impact | `[AUDITE] [CIBLE_VALIDEE]` |
| `BUSINESS-INITIAL-PROMISE-AUDIT.md` | P0-7 — Promesse business initiale | `[AUDITE] [VALIDEE]` |
| `ARTISANS-LOCAUX-STATUS-AUDIT.md` | P0-8 — Statut de `Artisans Locaux` | `[AUDITE] [CIBLE_VALIDEE]` |
| `STRIPE-STATUS-AUDIT.md` | P0-9 — Statut Stripe réel, simulé, hybride et legacy | `[AUDITE]` |
| `DATA-SOURCE-TRUTH-AUDIT.md` | P0-10 — Source de vérité data : mocks vs Supabase vs DB V2 | `[AUDITE] [CIBLE_VALIDEE]` |

### Audits de migration / vocabulaire

| Fichier | Rôle |
|---------|------|
| `MIGRATION-INVESTMENT-TO-PRODUCER-SUPPORT.md` | Migration progressive de `investment` vers `producer_support` |
| `POINTS-TO-CREDITS-IMPACT-AUDIT.md` | Classification et migration des `points` |

---

## Comment utiliser les audits

1. **Pour comprendre une décision** : lire l'audit P0 correspondant, puis `../_current/03-DECISIONS-VALIDEES.md` pour la synthèse
2. **Pour vérifier un écart code/doc** : consulter `CODE-VS-DOC.md`
3. **Pour suivre l'historique** : lire `CHANGELOG-REFACTO-DOC.md`

---

## Liens utiles

- [Documentation active](../_current/)
- [Décisions validées](../_current/03-DECISIONS-VALIDEES.md)
- [README racine](../README.md)

---

**Statut** : `[AUDITE]` Documents d'analyse et de justification.
