# Proposition de structure documentaire

Date : 2026-05-07

Portee : `apps/web-client/doc`.

## Objectif

Créer une documentation plus durable, lisible par des humains non techniques et exploitable par des IA, sans supprimer les anciens documents. La nouvelle structure separe : contexte, produit, code actuel, decisions, questions, business, validation, impact, design, gamification, BioDex, technique et lexique.

## Principes

- `[ACTUEL_CODE]` Le code actuel est documente sans etre idealise.
- `[CIBLE_VALIDEE]` Une cible n'est presentee comme validee que si elle est explicitement assumee.
- `[HYPOTHESE]` Les idees utiles mais non tranchees restent marquees comme hypotheses.
- `[A_TESTER]` Les sujets business, UX ou go-to-market a valider par terrain sont separes.
- `[A_DECIDER]` Les arbitrages necessaires sont centralises.
- `[RISQUE]` Les risques produit, business, impact, technique ou legal sont explicites.

## Structure cible

| Fichier | Role | Audience principale | Sources |
|---|---|---|---|
| `README.md` | Index IA/humain et regles de navigation | Tous | Tous les documents |
| `00-CONTEXTE-COMMUN.md` | Vision courte, vocabulaire, principes non negociables | Tous | Vision, decisions, audit |
| `01-PRODUIT-ET-EXPERIENCE.md` | Experience utilisateur cible et actuelle | Produit, design, dev, IA | Produit, UX, code routes |
| `02-ETAT-ACTUEL-CODE.md` | Etat reel du code sans projection | Dev, IA, produit | Audit code |
| `03-DECISIONS-VALIDEES.md` | Decisions assumees uniquement | Fondateurs, produit, IA | Roadmap, audit |
| `04-QUESTIONS-OUVERTES.md` | Questions a traiter et priorisation | Fondateurs, produit | Tous |
| `05-BUSINESS-MODEL.md` | Modele economique, ce qui est valide ou non | Business, produit | Business/RSE |
| `06-GO-TO-MARKET-VALIDATION.md` | Hypotheses de marche, tests et apprentissages | Business, growth | Business, produit |
| `07-IMPACT-ET-CREDIBILITE.md` | Preuves, prudence, validation, risques greenwashing | Impact, produit, contenu | BioDex, business, contenu |
| `08-DESIGN-UX-UI.md` | Principes UX/UI et experience visuelle | Design, dev | Design actuel |
| `09-GAMIFICATION-ECONOMIE.md` | Graines, Credits Impact, rewards, challenges | Produit, dev, IA | Gamification, code |
| `10-BIODEX-BIODIVERSITE.md` | BioDex, especes, deblocage, scientificite | Produit, impact, contenu | BioDex, code species |
| `11-TECHNIQUE-DATA.md` | Stack, donnees, APIs, Supabase, Stripe, i18n | Dev, IA | Technique, audit code |
| `99-GLOSSAIRE-LEXIQUE.md` | Lexique recommande, deprecie, interdit | Tous | Contenu, code, audit |
| `_audit/AUDIT-DOCUMENTATION-ACTUELLE.md` | Audit de l'ancienne documentation | Produit, IA | Ancienne doc |
| `_audit/CODE-VS-DOC.md` | Ecarts code/documentation | Produit, dev, IA | Code et doc |
| `_audit/PROPOSITION-STRUCTURE-DOC.md` | Justification de structure | Produit, IA | Audit |
| `_audit/CHANGELOG-REFACTO-DOC.md` | Journal de refonte | Tous | Changements doc |

## Pourquoi ne pas archiver maintenant

`[CIBLE_VALIDEE]` Aucun ancien document n'est supprime ni archive dans cette premiere passe. Les anciens fichiers restent en place pour conserver toute information historique, meme si la nouvelle structure devient le point d'entree recommande.

## Ordre de lecture recommande

### Pour un nouveau contributeur non technique

1. `README.md`
2. `00-CONTEXTE-COMMUN.md`
3. `01-PRODUIT-ET-EXPERIENCE.md`
4. `99-GLOSSAIRE-LEXIQUE.md`
5. `04-QUESTIONS-OUVERTES.md`

### Pour une IA qui doit modifier la doc

1. `README.md`
2. `02-ETAT-ACTUEL-CODE.md`
3. `_audit/CODE-VS-DOC.md`
4. Le fichier thematique concerne
5. `04-QUESTIONS-OUVERTES.md`

### Pour une IA qui doit modifier le code plus tard

1. `README.md`
2. `02-ETAT-ACTUEL-CODE.md`
3. `11-TECHNIQUE-DATA.md`
4. `_audit/CODE-VS-DOC.md`
5. Le fichier produit concerne

## Regle de maintenance

Quand le code evolue, mettre a jour en priorite :

1. `02-ETAT-ACTUEL-CODE.md`
2. `11-TECHNIQUE-DATA.md`
3. Le fichier produit ou metier impacte
4. `04-QUESTIONS-OUVERTES.md` si une question est resolue
5. `_audit/CHANGELOG-REFACTO-DOC.md` si la modification documentaire est significative
