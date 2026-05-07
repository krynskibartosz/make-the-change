# Changelog de refonte documentaire

Date : 2026-05-07

Portee : `apps/web-client/doc` uniquement.

## Version initiale de refonte

### Ajoute

- Creation d'une nouvelle structure documentaire a cote des anciens fichiers.
- Creation des rapports d'audit dans `_audit`.
- Creation d'un index `README.md` pour humains et IA.
- Separation des sujets : contexte, produit, code actuel, decisions, questions, business, go-to-market, impact, design, gamification, BioDex, technique/data, lexique.
- Ajout d'une convention de statuts sans accents : `[ACTUEL_CODE]`, `[CIBLE_VALIDEE]`, `[HYPOTHESE]`, `[A_TESTER]`, `[A_DECIDER]`, `[A_VERIFIER_CODE]`, `[DEPRECIE]`, `[RISQUE]`.

### Non modifie

- Aucun fichier applicatif React, TypeScript, Supabase, Stripe, mocks ou routes n'a ete modifie.
- Le dossier racine `docs/` n'a pas ete modifie.
- Les anciens fichiers `01-...` a `10-...` dans `apps/web-client/doc` sont laisses en place.
- Aucun ancien document n'a ete supprime.
- Aucun ancien document n'a ete archive.

### Ecarts explicitement integres

- `investment` reste present dans le code.
- `points` reste present comme vocabulaire technique.
- `Artisans Locaux` reste present dans des mocks et flows.
- Academy est documentee differemment selon les sources ; le code actuel est priorise.
- BioDex contient une exception prototype de deblocage.
- Don et soutien producteur ne sont pas encore parfaitement separes dans les modeles.
- Stripe/paiement est partiel.
- Supabase est partiel et cohabite avec les mocks.
- De nombreux textes restent hardcodes ; i18n partiel.

### Decisions de refonte

- `[CIBLE_VALIDEE]` La nouvelle documentation devient le point d'entree recommande.
- `[CIBLE_VALIDEE]` Les anciens documents restent consultables comme sources historiques.
- `[CIBLE_VALIDEE]` Les fichiers sont nommes sans accents pour limiter les problemes Git, Windows et liens Markdown.
- `[CIBLE_VALIDEE]` Aucune hypothese n'est transformee en decision.

### A faire apres validation utilisateur

- Reprendre chaque question P0 une par une avec le porteur du projet.
- Mettre a jour les fichiers de reference selon les reponses.
- Eventuellement archiver les anciens fichiers dans une etape separee, uniquement apres accord explicite.
- Plus tard, aligner le code sur le vocabulaire cible si une decision produit le demande.
