# Make the Change - Decisions, Roadmap et Usage Par Les Gems

> Document de gouvernance pour la base de connaissance Gemini.
> Perimetre: `apps/web-client/doc`.

---

## 1. Role Du Document

Ce fichier evite que les Gems se contredisent.

Il centralise:

- les decisions validees;
- les hypotheses fortes;
- les questions ouvertes;
- l'ordre de priorite;
- les Gems recommandes;
- la maniere d'utiliser les 10 documents.

Il ne remplace pas les instructions propres a chaque Gem. Les sections "a faire / a ne pas faire" detaillees restent dans la configuration des Gems.

## 2. Les 10 Documents

| Fichier                           | Role                                  |
| --------------------------------- | ------------------------------------- |
| `01-VISION.md`                    | nord commun, promesse, principes      |
| `02-PRODUIT.md`                   | features, navigation, cible produit   |
| `03-TECHNIQUE.md`                 | architecture actuelle `web-client`    |
| `04-BUSINESS-RSE-MODELE.md`       | revenus, RSE, abonnement, marketplace |
| `05-DESIGN-UX-UI.md`              | direction design et UX                |
| `06-GAMIFICATION-ECONOMIE.md`     | Graines, Points, Academy, BioDex      |
| `07-BIODIVERSITE-BIODEX.md`       | especes, science, lore, BioDex        |
| `08-CONTENU-TON-I18N.md`          | copy, lexique, ton, langues           |
| `09-DONNEES-MOCK-API-SUPABASE.md` | donnees actuelles et contrats         |
| `10-DECISIONS-ROADMAP-GEMS.md`    | gouvernance et evolution              |

## 3. Statuts

- **Actuel**: present dans le code.
- **Cible validee**: decision confirmee.
- **Hypothese forte**: recommandation actuelle.
- **A decider**: sujet ouvert.
- **Futur**: piste pertinente mais non prioritaire.

## 4. Decisions Validees

### Vision Produit

- Priorite cible: soutenir/donner > comprendre/decouvrir > progresser > recompenses.
- Le produit est encore en construction; les docs doivent accepter l'incertitude.
- Les anciennes docs hors `apps/web-client/doc` ne sont pas source de verite.

### Navigation

- Le premier onglet cible est `Aventure`.
- `Aventure` devient le hub quotidien.
- Il remplace progressivement le concept trop etroit de `Defis`.

### Academy

- L'Academy est une brique produit importante.
- Elle ne doit pas etre obligatoire pour soutenir, donner ou acheter.
- Academy de base gratuite recommandee.

### Economie

- Conserver deux monnaies: Graines et Points d'Impact.
- Don pur -> Graines uniquement.
- Soutien producteur -> Points d'Impact principalement.
- Bonus Graines possible pour soutien producteur, mais modere.
- Pas d'achat direct de Graines dans la cible actuelle.

### BioDex

- Public + collection personnelle.
- Espece debloquee uniquement si projet explicitement lie.
- Graines utilisables pour enrichir la fiche ou progression.
- Images IA possibles si validees humainement.

### Business

- Marketplace partenaire selectionnee.
- Produits achetables en Points d'Impact et en euros.
- Priorite UX aux Points d'Impact.
- Abonnement unique `Ambassadeur`.
- Abonnement = budget de soutien + avantages.
- Pas de Points d'Impact mensuels gratuits.

### RSE

- RSE = pilier cible.
- Offres: financement projets, abonnement employes, sponsoring discret, rapports d'impact.
- Meme app coeur B2C/salaries, avec couche entreprise legere.

### Design

- Direction: impact premium sobre + gamification chaleureuse.
- Mascottes presentes transversalement, mais calibre selon contexte.
- Structure commune pour toutes les factions, accents visuels differents.

## 5. Hypotheses Fortes

- `Aventure` doit etre la premiere page apres ouverture/connexion.
- Le hub Aventure doit inclure Academy, mission/action, projet, BioDex, collectif et recompense discrete.
- L'abonnement Ambassadeur doit etre vendu d'abord comme soutien mensuel biodiversite.
- Les contenus premium doivent enrichir l'experience sans bloquer l'apprentissage de base.
- La RSE peut devenir le principal moteur economique si elle est bien prouvee.
- L'evolution visuelle IA des especes est forte mais plutot V2.

## 6. Questions Ouvertes

### Produit

- Route finale de l'onglet Aventure: `/challenges`, `/adventure`, `/aventure` ou autre.
- Place exacte du leaderboard.
- Poids du Collectif dans la V1.

### Business

- Prix de l'abonnement Ambassadeur.
- Montant et repartition du budget de soutien mensuel.
- Taux de commission dons.
- Taux de commission/marge produits.
- Packaging RSE.

### Gamification

- Formule exacte des Graines.
- Cout des contenus BioDex.
- Role final des vies Academy.
- Formule du score d'impact.

### Biodiversite

- Niveau de preuve requis pour lier une espece a un projet.
- Nombre d'especes par projet.
- Politique visible sur les images IA.

### Technique

- Schema Supabase cible.
- Migration route `challenges` vers `Aventure`.
- Decoupage des gros fichiers mock.
- Integration Stripe finale.

## 7. Gems Recommandes

Priorite selon la prochaine phase: decisions produit et refactoring design.

### Expert Produit & Priorisation

Documents prioritaires:

- `01-VISION.md`
- `02-PRODUIT.md`
- `10-DECISIONS-ROADMAP-GEMS.md`

Role:

- clarifier le scope;
- arbitrer V1/cible/futur;
- eviter les contradictions.

### Expert Design UX/UI

Documents prioritaires:

- `05-DESIGN-UX-UI.md`
- `02-PRODUIT.md`
- `08-CONTENU-TON-I18N.md`

Role:

- designer le hub Aventure;
- ameliorer coherence visuelle;
- calibrer mascottes et sobriete.

### Expert Gamification

Documents prioritaires:

- `06-GAMIFICATION-ECONOMIE.md`
- `07-BIODIVERSITE-BIODEX.md`
- `04-BUSINESS-RSE-MODELE.md`

Role:

- structurer Graines, Points, Academy, BioDex;
- eviter le pay-to-win;
- relier progression et impact.

### Expert Tech Frontend

Documents prioritaires:

- `03-TECHNIQUE.md`
- `09-DONNEES-MOCK-API-SUPABASE.md`
- `05-DESIGN-UX-UI.md`

Role:

- refactoring `web-client`;
- architecture composants;
- garder mock et cible alignes.

### Expert Business / RSE

Documents prioritaires:

- `04-BUSINESS-RSE-MODELE.md`
- `01-VISION.md`
- `02-PRODUIT.md`

Role:

- offres B2C/B2B;
- abonnement;
- RSE;
- monetisation credible.

### Expert Biodiversite

Documents prioritaires:

- `07-BIODIVERSITE-BIODEX.md`
- `08-CONTENU-TON-I18N.md`
- `06-GAMIFICATION-ECONOMIE.md`

Role:

- qualite scientifique;
- vulgarisation;
- BioDex;
- separation faits/lore.

## 8. Ordre De Travail Recommande

1. Refondre le hub `Aventure`.
2. Clarifier les composants et donnees du hub.
3. Integrer Academy comme brique visible.
4. Clarifier la relation projet -> espece -> BioDex.
5. Renforcer design system local `web-client`.
6. Formaliser abonnement Ambassadeur.
7. Formaliser offre RSE.
8. Preparer migration Supabase cible.

## 9. Comment Mettre A Jour Ces Docs

Quand une decision change:

1. modifier le document specialise;
2. mettre a jour ce fichier;
3. verifier `01-VISION.md` si la promesse change;
4. verifier `02-PRODUIT.md` si l'experience change;
5. verifier `04`, `06` et `07` si l'economie, la gamification ou le BioDex sont touches.

## 10. Regle Finale

Quand un Gem hesite entre deux directions:

1. proteger la credibilite de l'impact;
2. garder l'argent transparent;
3. privilegier la comprehension utilisateur;
4. preserver la magie de l'aventure;
5. eviter les mecanismes qui donnent une recompense sans impact clair.
