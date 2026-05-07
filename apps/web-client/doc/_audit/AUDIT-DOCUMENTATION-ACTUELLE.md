# Audit de la documentation actuelle

Date : 2026-05-07

Portee : `apps/web-client/doc` uniquement.

Statuts utilises : `[ACTUEL_CODE]`, `[CIBLE_VALIDEE]`, `[HYPOTHESE]`, `[A_TESTER]`, `[A_DECIDER]`, `[A_VERIFIER_CODE]`, `[DEPRECIE]`, `[RISQUE]`.

## Synthese

La documentation actuelle est utile et riche, mais elle melange plusieurs natures d'information : vision cible, etat code, hypotheses business, dettes techniques, decisions validees et questions ouvertes. La refonte initiale cree une nouvelle structure a cote des anciens fichiers afin de separer ces usages sans supprimer d'information.

## Documents existants

| Fichier actuel | Role principal | Utilite | Problemes observes | Statut recommande |
|---|---|---:|---|---|
| `01-VISION.md` | Vision produit, positionnement, boucles coeur | Haute | Melange vision, cible, hypotheses, mascottes, economie | Garder comme source historique, synthetiser dans `00` et `01` |
| `02-PRODUIT.md` | Fonctionnalites et experience | Haute | Repetitions avec vision, gamification, BioDex et technique | Garder, reorganiser dans `01` |
| `03-TECHNIQUE.md` | Stack, routes, mocks, Supabase, Stripe | Haute | Etat code utile mais pas assez separe des cibles | Garder, synthetiser dans `02` et `11` |
| `04-BUSINESS-RSE-MODELE.md` | Business model B2C/B2B/RSE | Moyenne-haute | Trop d'hypotheses peuvent sembler validees | Garder, deplacer dans `05` et `06` |
| `05-DESIGN-UX-UI.md` | Principes design, navigation, UI | Haute | Quelques elements cibles non distingues de l'existant | Garder, synthetiser dans `08` |
| `06-GAMIFICATION-ECONOMIE.md` | Graines, Credits Impact, missions, rewards | Haute | Ambiguite avec `points` technique et legacy | Garder, synthetiser dans `09` |
| `07-BIODIVERSITE-BIODEX.md` | BioDex, biodiversite, IA images, risques | Haute | Deblocage prototype pas assez explicite | Garder, synthetiser dans `10` |
| `08-CONTENU-TON-I18N.md` | Ton, lexique, i18n, termes interdits | Haute | I18n code plus partiel que la doc cible | Garder, synthetiser dans `99` et `11` |
| `09-DONNEES-MOCK-API-SUPABASE.md` | Mocks, API, Supabase, Stripe | Haute | Recoupe `03-TECHNIQUE.md` | Garder, fusion logique dans `11` |
| `10-DECISIONS-ROADMAP-GEMS.md` | Decisions, questions, roadmap, usage IA | Haute | Questions et decisions trop groupees ensemble | Garder, separer dans `03` et `04` |

## Redondances principales

- **Produit / vision / gamification** : Aventure, BioDex, Academy et monnaies apparaissent dans plusieurs fichiers avec des formulations proches.
- **Technique / donnees** : mocks, Supabase, Stripe et routes sont decrits dans `03` et `09`.
- **Questions ouvertes** : dispersees dans presque tous les documents.
- **Lexique sensible** : termes interdits ou legacy cites dans contenu, gamification et roadmap.

## Contradictions ou zones floues

- `[ACTUEL_CODE]` La navigation mobile reelle contient cinq tabs : Aventure, Projets, Collectif, Avantages, Profil.
- `[ACTUEL_CODE]` Le code conserve des routes et types `invest`, `investment`, `points`, malgre une cible semantique orientee soutien et Credits Impact.
- `[ACTUEL_CODE]` Academy est principalement dans `(screens)/academy`, alors que certaines formulations documentaires la rapprochent encore de `(lab)`.
- `[ACTUEL_CODE]` BioDex a une exception prototype de deblocage automatique si aucune espece n'est debloquee.
- `[RISQUE]` Le business model peut etre lu comme valide alors que plusieurs hypotheses doivent rester a tester.
- `[RISQUE]` Les preuves d'impact et la validation scientifique sont des sujets de credibilite, pas seulement de contenu.

## Recommandation

Ne pas supprimer ni archiver les anciens documents pour l'instant. La nouvelle structure doit devenir la reference de travail, tandis que les anciens fichiers restent des sources historiques a consulter si une information manque.

## Regle de priorite documentaire

En cas de contradiction :

1. Le code actuel prime pour `[ACTUEL_CODE]`.
2. Les decisions explicitement validees priment pour `[CIBLE_VALIDEE]`.
3. Tout element non confirme doit rester `[HYPOTHESE]`, `[A_TESTER]`, `[A_DECIDER]` ou `[A_VERIFIER_CODE]`.
4. Les anciens fichiers ne doivent pas etre utilises pour transformer une hypothese en decision.
