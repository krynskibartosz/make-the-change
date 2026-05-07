# Documentation active - `_current/`

Ce dossier contient la **documentation active** de `apps/web-client`.

C'est la source de vérité prioritaire pour comprendre le produit, le code, les décisions et les règles en vigueur.

---

## Fichiers de référence

| Fichier | Rôle | Priorité |
|---------|------|----------|
| `00-CONTEXTE-COMMUN.md` | Vision courte, principes, vocabulaire commun | Lecture initiale |
| `01-PRODUIT-ET-EXPERIENCE.md` | Expérience utilisateur, navigation et modules produit | Comprendre le produit |
| `02-ETAT-ACTUEL-CODE.md` | État réel du code, sans projection | Comprendre le code |
| `03-DECISIONS-VALIDEES.md` | **Décisions validées uniquement** | Décisions officielles |
| `04-QUESTIONS-OUVERTES.md` | Questions à trancher, avec priorité | Suivi des arbitrages |
| `05-BUSINESS-MODEL.md` | Business model, revenus, limites et hypothèses | Business |
| `06-GO-TO-MARKET-VALIDATION.md` | Tests marché, validation, apprentissages attendus | Go-to-market |
| `07-IMPACT-ET-CREDIBILITE.md` | Preuves d'impact, prudence, validation scientifique | Impact |
| `08-DESIGN-UX-UI.md` | Principes design, UX, UI, accessibilité | Design |
| `09-GAMIFICATION-ECONOMIE.md` | Graines, Crédits Impact, rewards, challenges | Gamification |
| `10-BIODEX-BIODIVERSITE.md` | BioDex, espèces, déblocage, biodiversité | BioDex |
| `11-TECHNIQUE-DATA.md` | Stack, data, API, Supabase, Stripe, i18n | Technique |
| `99-GLOSSAIRE-LEXIQUE.md` | Termes recommandés, legacy, interdits ou sensibles | Wording |

---

## Ordre de lecture recommandé

### Pour comprendre les décisions officielles

1. **`03-DECISIONS-VALIDEES.md`** — Décisions produit/technique assumées
2. **`04-QUESTIONS-OUVERTES.md`** — Sujets encore à trancher
3. **`99-GLOSSAIRE-LEXIQUE.md`** — Vocabulaire officiel et interdit

### Pour comprendre le produit

1. `00-CONTEXTE-COMMUN.md`
2. `01-PRODUIT-ET-EXPERIENCE.md`
3. `09-GAMIFICATION-ECONOMIE.md`
4. `10-BIODEX-BIODIVERSITE.md`
5. `99-GLOSSAIRE-LEXIQUE.md`

### Pour comprendre le code actuel

1. `02-ETAT-ACTUEL-CODE.md`
2. `11-TECHNIQUE-DATA.md`
3. `../_audit/CODE-VS-DOC.md` — Écarts entre code et documentation

---

## En cas de contradiction

**Remonter au README racine** : `../README.md`

La hiérarchie de résolution :

1. Ce fichier (`_current/README.md`) pour la structure
2. `03-DECISIONS-VALIDEES.md` pour les décisions validées
3. `../README.md` pour les statuts et règles globales
4. `../_audit/[sujet]-AUDIT.md` pour le contexte détaillé d'une décision

---

## Liens utiles

- [README racine](../README.md)
- [Audits](../_audit/)
- [Documentation historique](../_legacy/) (référence uniquement)

---

**Statut** : `[ACTUEL]` Documentation active et maintenue.
