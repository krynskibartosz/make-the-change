# Documentation Make the Change - web-client

Cette documentation concerne uniquement `apps/web-client`.

Elle est concue pour etre utile a la fois aux humains et aux IA qui travaillent sur le produit, le design, le business, l'impact ou la technique.

## Structure du dossier

```txt
apps/web-client/doc/
  README.md                    <- Ce fichier
  _current/                    <- Documentation active (00-11, 99)
  _audit/                      <- Audits et analyses P0
  _legacy/                     <- Anciens fichiers historiques (01-10 anciens)
```

## Regle importante

`[ACTUEL_CODE]` Le code actuel prime pour decrire ce qui existe vraiment.

`[CIBLE_VALIDEE]` Une cible n'est validee que si elle est explicitement marquee comme telle.

`[HYPOTHESE]`, `[A_TESTER]`, `[A_DECIDER]` ou `[A_VERIFIER_CODE]` ne doivent jamais etre presentes comme des decisions.

La documentation dans `_current/` est la reference active. Les anciens fichiers dans `_legacy/` sont conserves comme sources historiques utiles mais ne sont plus prioritaires. En cas de contradiction, lire d'abord ce `README.md`, puis `_current/03-DECISIONS-VALIDEES.md`, puis le fichier specialise recent.

## Statuts utilises

| Statut | Signification |
|---|---|
| `[ACTUEL_CODE]` | Observe dans le code actuel. |
| `[CIBLE_VALIDEE]` | Decision produit/technique assumee. |
| `[HYPOTHESE]` | Idee plausible mais non tranchee. |
| `[A_TESTER]` | Sujet a valider par test, terrain ou donnees. |
| `[A_DECIDER]` | Arbitrage a prendre. |
| `[A_VERIFIER_CODE]` | Point observe partiellement ou a confirmer dans le code. |
| `[DEPRECIE]` | Ancien vocabulaire, ancienne logique ou element a eviter. |
| `[RISQUE]` | Risque produit, business, technique, legal, UX ou impact. |
| `[LEGACY]` | Heritage historique utile mais non cible. |
| `[A_NE_PAS_TOUCHER]` | Element a conserver tel quel pour l'instant. |
| `[SOURCE_PROTOTYPE]` | Source utile pour prototyper, tester et comprendre les besoins, sans etre une source finale. |
| `[AUDITE]` | Sujet analyse dans un audit dedie. |
| `[VALIDEE]` | Decision ou doctrine validee dans un audit ou fichier de reference. |
| `[HYPOTHESE_FORTE]` | Hypothese structurante, plausible, mais encore a tester ou confirmer. |
| `[A_PLANIFIER]` | Decision ou migration a preparer avant execution. |
| `[PLUS_TARD]` | Sujet volontairement reporte. |
| `[PROTOTYPE]` | Element prototype, non cible finale par defaut. |
| `[SIMULE]` | Element simule, non reel ou non branche completement. |
| `[REEL]` | Element reellement branche ou execute dans le code actuel. |
| `[PARTIEL]` | Element implemente partiellement. |
| `[HYBRIDE]` | Etat mixte : certaines parties reelles, d'autres prototype, legacy ou incompletes. |
| `[LEGACY_FACTION]` | Ancienne faction conservee pour compatibilite. |
| `[INTERDIT]` | Regle explicitement exclue de la cible. |
| `[A_MIGRER_PLUS_TARD]` | Migration future a ne pas faire brutalement. |

## Fichiers de reference actifs (_current/)

| Fichier | Role |
|---|---|
| `_current/00-CONTEXTE-COMMUN.md` | Vision courte, principes, vocabulaire commun. |
| `_current/01-PRODUIT-ET-EXPERIENCE.md` | Experience utilisateur, navigation et modules produit. |
| `_current/02-ETAT-ACTUEL-CODE.md` | Etat reel du code, sans projection. |
| `_current/03-DECISIONS-VALIDEES.md` | Decisions validees uniquement. |
| `_current/04-QUESTIONS-OUVERTES.md` | Questions a trancher, avec priorite. |
| `_current/05-BUSINESS-MODEL.md` | Business model, revenus, limites et hypotheses. |
| `_current/06-GO-TO-MARKET-VALIDATION.md` | Tests marche, validation, apprentissages attendus. |
| `_current/07-IMPACT-ET-CREDIBILITE.md` | Preuves d'impact, prudence, validation scientifique. |
| `_current/08-DESIGN-UX-UI.md` | Principes design, UX, UI, accessibilite. |
| `_current/09-GAMIFICATION-ECONOMIE.md` | Graines, Credits Impact, rewards, challenges. |
| `_current/10-BIODEX-BIODIVERSITE.md` | BioDex, especes, deblocage, biodiversite. |
| `_current/11-TECHNIQUE-DATA.md` | Stack, data, API, Supabase, Stripe, i18n. |
| `_current/99-GLOSSAIRE-LEXIQUE.md` | Termes recommandes, legacy, interdits ou sensibles. |

## Rapports d'audit

| Fichier | Role |
|---|---|
| `_audit/AUDIT-DOCUMENTATION-ACTUELLE.md` | Audit des anciens documents. |
| `_audit/CODE-VS-DOC.md` | Ecarts entre code et documentation. |
| `_audit/PROPOSITION-STRUCTURE-DOC.md` | Justification de la nouvelle structure. |
| `_audit/CHANGELOG-REFACTO-DOC.md` | Journal des changements documentaires. |
| `_audit/MIGRATION-INVESTMENT-TO-PRODUCER-SUPPORT.md` | P0-2 - Migration progressive de `investment` vers `producer_support`. |
| `_audit/POINTS-TO-CREDITS-IMPACT-AUDIT.md` | P0-3 - Migration de `points` vers les familles correctes, dont Credits Impact. |
| `_audit/IMPACT-PROOF-LEVELS-AUDIT.md` | P0-6 - Niveaux de preuve et prudence impact. |
| `_audit/BIOSPECIES-UNLOCK-RULES-AUDIT.md` | P0-4 - Regles de deblocage BioDex. |
| `_audit/ACADEMY-ROLE-AUDIT.md` | P0-5 - Role de l'Academy. |
| `_audit/ACADEMY-MISSIONS-CHALLENGES-AVENTURE-DISTINCTION.md` | P0-5b - Distinction Academy, Missions, Challenges et Aventure. |
| `_audit/BUSINESS-INITIAL-PROMISE-AUDIT.md` | P0-7 - Promesse business initiale. |
| `_audit/ARTISANS-LOCAUX-STATUS-AUDIT.md` | P0-8 - Statut de `Artisans Locaux`. |
| `_audit/STRIPE-STATUS-AUDIT.md` | P0-9 - Statut Stripe reel, simule, hybride et legacy. |
| `_audit/DATA-SOURCE-TRUTH-AUDIT.md` | P0-10 - Source de verite data : mocks vs Supabase legacy vs future DB V2. |

## Anciens fichiers conserves (_legacy/)

Les anciens fichiers `_legacy/01-VISION.md` a `_legacy/10-DECISIONS-ROADMAP-GEMS.md` sont conserves comme sources historiques utiles.

| Fichier | Role historique |
|---|---|
| `_legacy/01-VISION.md` | Vision produit initiale. |
| `_legacy/02-PRODUIT.md` | Definition produit legacy. |
| `_legacy/03-TECHNIQUE.md` | Stack technique legacy. |
| `_legacy/04-BUSINESS-RSE-MODELE.md` | Business et RSE legacy. |
| `_legacy/05-DESIGN-UX-UI.md` | Design legacy. |
| `_legacy/06-GAMIFICATION-ECONOMIE.md` | Gamification legacy. |
| `_legacy/07-BIODIVERSITE-BIODEX.md` | BioDex legacy. |
| `_legacy/08-CONTENU-TON-I18N.md` | Contenu et i18n legacy. |
| `_legacy/09-DONNEES-MOCK-API-SUPABASE.md` | Data legacy. |
| `_legacy/10-DECISIONS-ROADMAP-GEMS.md` | Decisions et roadmap legacy. |

Ils ne sont pas supprimes mais ne sont plus prioritaires. La structure `_current/` est le point d'entree recommande.

En cas de contradiction entre ancien et nouveau document, privilegier :

1. `README.md` ;
2. `_current/03-DECISIONS-VALIDEES.md` ;
3. le fichier specialise recent (`_current/05`, `_current/07`, `_current/09`, `_current/10`, `_current/11`, `_current/99`, ou audit P0 concerne).

## Ordre de lecture recommande

### Pour comprendre le produit

1. `_current/00-CONTEXTE-COMMUN.md`
2. `_current/01-PRODUIT-ET-EXPERIENCE.md`
3. `_current/09-GAMIFICATION-ECONOMIE.md`
4. `_current/10-BIODEX-BIODIVERSITE.md`
5. `_current/99-GLOSSAIRE-LEXIQUE.md`

### Pour comprendre le code actuel

1. `_current/02-ETAT-ACTUEL-CODE.md`
2. `_current/11-TECHNIQUE-DATA.md`
3. `_audit/CODE-VS-DOC.md`

### Pour prendre des decisions

1. `_current/03-DECISIONS-VALIDEES.md`
2. `_current/04-QUESTIONS-OUVERTES.md`
3. `_current/05-BUSINESS-MODEL.md`
4. `_current/06-GO-TO-MARKET-VALIDATION.md`
5. `_current/07-IMPACT-ET-CREDIBILITE.md`

## Regle pour les IA

Avant de proposer ou modifier quelque chose :

1. Verifier si le sujet est `[ACTUEL_CODE]`, `[CIBLE_VALIDEE]`, `[HYPOTHESE]`, `[A_TESTER]` ou `[A_DECIDER]`.
2. Ne pas transformer une hypothese en fonctionnalite.
3. Ne pas utiliser les mots deprecies dans les textes utilisateur, sauf si le code les impose encore.
4. Si le code contredit la doc, le signaler dans `_audit/CODE-VS-DOC.md` ou dans le fichier thematique.
5. Ne pas toucher au code applicatif lors d'une tache documentaire, sauf demande explicite.
6. Ne pas traiter Supabase comme la source cible du produit sans decision explicite.
7. Considerer Supabase actuel comme `[ACTUEL_CODE]` + `[LEGACY]` + `[A_NE_PAS_TOUCHER]`.
8. Considerer les mocks du web-client comme `[ACTUEL_CODE]` + `[SOURCE_PROTOTYPE]` pour stabiliser les flows avant de concevoir une base V2.
