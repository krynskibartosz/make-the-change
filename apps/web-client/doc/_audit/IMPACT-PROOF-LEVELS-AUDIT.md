# Audit P0-6 - Niveaux de preuve d'impact

Date : 2026-05-07

Portee : audit documentaire et produit limite a `apps/web-client`. Aucun code applicatif, mock, Supabase, Stripe, route, composant, action ou type n'est modifie par ce document.

Statuts utilises : `[PREUVE_SIMPLE]`, `[PREUVE_PEDAGOGIQUE]`, `[ESTIMATION]`, `[PREUVE_OPERATIONNELLE]`, `[PREUVE_MESUREE]`, `[PROMESSE_TROP_FORTE]`, `[METRIQUE_RISQUEE]`, `[RSE_SENSIBLE]`, `[RISQUE]`, `[CIBLE_VALIDEE]`, `[A_PLANIFIER]`, `[A_VERIFIER_CODE]`

## 1. Resume

`[CIBLE_VALIDEE]` Make the Change doit rendre l'impact visible sans promettre plus que ce qui est prouve.

`[CIBLE_VALIDEE]` Doctrine de preuve V1 : afficher des preuves simples, des explications pedagogiques et des estimations prudentes.

`[A_VERIFIER]` Les formules exactes de calcul d'impact (abeilles, coraux, CO2, surfaces) doivent etre documentees et rattachees a des hypotheses ou des sources.

`[RISQUE]` Les claims CO2 sont sensibles et ne doivent pas etre affiches sans methode robuste, perimetre, source et limites.

`[A_PLANIFIER]` Les metriques RSE exigent un niveau de preuve superieur : perimetre, periode, methode, source, limites, niveau de confiance et responsabilites.

`[CIBLE_VALIDEE]` Les claims terrain comme "coraux restaures", "abeilles protegees", "especes sauvees" ne sont autorises que si le niveau de preuve correspondant existe.

`[CIBLE_VALIDEE]` Un solde, des `points`, des Credits Impact ou des Graines ne doivent jamais etre convertis directement en preuve d'impact.

`[CIBLE_VALIDEE]` L'impact doit etre rattache a au moins un des elements suivants :

- un projet ;
- une action reelle ;
- un montant ;
- un partenaire ;
- une hypothese documentee ;
- une preuve terrain.

`[RISQUE]` Les formulations actuelles melangent parfois estimation, preuve, gamification et promesse forte.

## 2. Tableau d'audit

| Element | Fichier | Formulation actuelle | Categorie | Risque | Recommandation |
|---|---|---|---|---|---|
| Conversion Credits Impact / points -> abeilles | `src/app/[locale]/@modal/(.)products/balance/balance-modal-content.tsx` | `calculateBeeEquivalence(points)` puis `Équivaut à ~X abeilles sauvées` | `[METRIQUE_RISQUEE]` + `[PROMESSE_TROP_FORTE]` | Tres eleve | Ne jamais convertir un solde ou Credit Impact en preuve d'impact. Remplacer plus tard par impact rattache a projet/action/methode. |
| Profil mock - abeilles sauvees | `src/lib/mock/mock-viewer.ts`, `profile/[id]/mock-public-profile.tsx` | `beesSaved`, `ABEILLES SAUVÉES` | `[PROMESSE_TROP_FORTE]` | Eleve | Preferer `abeilles soutenues` ou `impact estime lie aux projets soutenus`, avec methode. |
| Profil mock - miel genere | `src/lib/mock/mock-viewer.ts`, `profile/[id]/mock-public-profile.tsx`, `guest-profile.tsx` | `honeyGeneratedKg`, `MIEL GÉNÉRÉ` | `[METRIQUE_RISQUEE]` | Eleve | Ne pas attribuer une production mesuree sans source producteur. Formuler comme estimation ou supprimer. |
| Profil mock - CO2 capture | `src/lib/mock/mock-viewer.ts`, `profile/[id]/mock-public-profile.tsx`, `guest-profile.tsx` | `co2CapturedKg`, `CO2 CAPTURÉ` | `[METRIQUE_RISQUEE]` + `[RSE_SENSIBLE]` | Tres eleve | Ne pas afficher CO2 sans methode robuste, source et niveau de preuve. |
| Onboarding social proof | `step-0-hook.tsx`, `onboarding-flow.tsx` | `290k+ Abeilles Protégées` | `[PROMESSE_TROP_FORTE]` | Eleve | Preferer `abeilles soutenues estimees` ou retirer le chiffre avant methode. |
| Factions - pollinisateurs | `src/lib/mock/mock-factions.ts` | `1.2M abeilles protégées` | `[PROMESSE_TROP_FORTE]` + `[ESTIMATION]` possible | Eleve | Ajouter prudence : estimation collective ou ordre de grandeur, jamais preuve individuelle. |
| Factions - forets | `src/lib/mock/mock-factions.ts` | `5 400 arbres plantés` | `[PREUVE_OPERATIONNELLE]` possible / `[PROMESSE_TROP_FORTE]` sans source | Moyen-eleve | Possible seulement si action terrain documentee ; sinon `arbres soutenus` ou `objectif de plantation`. |
| Factions - oceans | `src/lib/mock/mock-factions.ts` | `80 km² de récifs protégés` | `[RSE_SENSIBLE]` + `[PROMESSE_TROP_FORTE]` | Tres eleve | Ne pas utiliser sans source, perimetre, methode et responsabilite. |
| Carte projets - abeilles soutenues | `project-map-data.ts` | `funding * BEES_PER_EUR`, `abeilles soutenues` | `[ESTIMATION]` | Moyen | Formulation plus prudente que `sauvees`; doit afficher methode/hypothese si chiffre public. |
| Carte projets - coraux plantes | `project-map-data.ts` | `funding / CORAL_PRICE_EUR`, `coraux plantés` | `[ESTIMATION]` / `[PREUVE_OPERATIONNELLE]` selon statut | Eleve | En collecte, preferer `coraux finançables/soutenus`; `plantés` seulement apres action terrain confirmee. |
| Carte projets - oliviers soutenus | `project-map-data.ts` | `oliviers soutenus` | `[ESTIMATION]` | Moyen | Acceptable si rattache a projet et methode ; ne pas dire proteges sans preuve. |
| Options don corail - certificat/photo/localisation | `mock-projects.ts` | `certificate`, `photo`, `location`, `updates` | `[PREUVE_OPERATIONNELLE]` possible | Moyen | Peut devenir preuve operationnelle si photo/localisation associees a une action terrain verifiee. |
| Options don corail - unitsRestored | `mock-projects.ts` | `unitsRestored`, `corail`, `areaRestored`, `survivalRate: 60-85%` | `[ESTIMATION]` + `[PREUVE_OPERATIONNELLE]` possible | Eleve | Distinguer coraux prevus, plantes, suivis et survivants ; documenter methode. |
| Description projet corail | `mock-projects.ts` | `restaure`, `régénérant 0,02 m²`, `impact environnemental majeur` | `[PROMESSE_TROP_FORTE]` + `[ESTIMATION]` | Eleve | Temperer : `vise a restaurer`, `estime`, `selon hypothese partenaire`. |
| Timeline reçu soutien | `transaction-receipt.tsx` | `Fonds transférés`, `Construction des ruches`, `Première récolte` | `[PREUVE_SIMPLE]` + `[PREUVE_OPERATIONNELLE]` future | Moyen | OK si chaque etape a statut/source ; ne pas presenter comme preuve finale sans suivi. |
| Reçu soutien - abeilles | `transaction-receipt.tsx` | `Votre soutien de 390€ est associé à environ 15 000 abeilles sauvages` | `[ESTIMATION]` | Moyen-eleve | Bonne presence de `environ`, mais doit expliciter hypothese/methode/projet. |
| Bouton reçu fiscal | `transaction-receipt.tsx` | `Télécharger le reçu fiscal (PDF)` | `[PREUVE_SIMPLE]` + risque legal | Moyen | Ne pas promettre reçu fiscal si structure non eligible ; preferer `reçu de contribution` tant que statut legal non valide. |
| BioDex especes protegees | `project-species-section.tsx`, `product-linked-species-section.tsx` | `Espèces Protégées` | `[PROMESSE_TROP_FORTE]` | Eleve | Preferer `Espèces liées au projet` sauf preuve de protection directe. |
| BioDex unlock | `projects-client.tsx`, `profile`, docs | `BioDex : X à débloquer`, `Espèce liée` | `[PREUVE_PEDAGOGIQUE]` | Faible-moyen | OK si presente comme lien pedagogique/collection, pas comme preuve de sauvetage. |
| Feed collectif BioDex | `impact-tab-client.tsx` | `A débloqué le Lynx Boréal`, `A découvert...` | `[PREUVE_PEDAGOGIQUE]` | Faible | OK si deblocage = trace narrative, pas restauration reelle. |
| Academy/lab claims verifies | `(lab)/_lib/mock-academy.ts` | `verificationStatus: verified`, `12 ha restaurés`, `~480 t CO₂/an` | `[PREUVE_MESUREE]` possible + `[RSE_SENSIBLE]` | Tres eleve | Ne pas utiliser hors lab sans source, methode, auditeur et statut clair. |
| Documentation RSE | `doc/07-IMPACT-ET-CREDIBILITE.md`, `05-BUSINESS-MODEL.md` | reporting RSE, preuves, greenwashing | `[RSE_SENSIBLE]` | Tres eleve | RSE exige niveau de preuve superieur, disclaimers, sources et responsabilites. |
| Formulation `impact concret et visible` | `mock-viewer.ts`, docs | `impact concret et visible` | `[PREUVE_PEDAGOGIQUE]` | Moyen | Acceptable comme positionnement si pas lie a un chiffre non prouve. |
| `impactDelta` | `mock-member-data.ts` | impact agrégé depuis transactions | `[METRIQUE_RISQUEE]` | Eleve | Ne pas utiliser comme preuve ; c'est une donnée mock/prototype. |
| Product `impactPercentage` | `mock-projects.ts`, produits | pourcentage d'impact produit | `[METRIQUE_RISQUEE]` | Eleve | Ne pas afficher comme preuve sans methode ; attention achat produit != impact principal. |

## 3. Doctrine cible proposee

### 3.1 Ce que l'app peut afficher en V1

`[CIBLE_VALIDEE]` En V1, l'app peut afficher des preuves simples :

- montant donne ou soutenu ;
- date ;
- projet ;
- partenaire ;
- type d'action : don pur, soutien producteur, achat produit ;
- statut du paiement ;
- statut de suivi simple : en attente, transfere, en cours, documente ;
- lien pedagogique entre projet et espece ;
- trace d'engagement utilisateur.

### 3.2 Ce que l'app peut afficher uniquement comme estimation

`[CIBLE_VALIDEE]` Les elements suivants doivent etre presentes comme estimations ou ordres de grandeur :

- abeilles soutenues ;
- fleurs potentiellement visitees ;
- coraux prevus/soutenus ;
- surface restauree attendue ;
- CO2 estime ;
- kg de miel potentiel ;
- biodiversite associee ;
- impact collectif consolide.

Formulations obligatoires : `estime`, `environ`, `ordre de grandeur`, `selon les informations disponibles`, `selon l'hypothese documentee`, `associe a`.

### 3.3 Ce que l'app ne doit pas afficher sans preuve robuste

`[CIBLE_VALIDEE]` Ne pas afficher sans preuve robuste :

- impact valide ;
- impact verifie ;
- abeilles sauvees ;
- especes sauvees ;
- CO2 compense ;
- resultat garanti ;
- restauration accomplie ;
- protection certaine ;
- audit externe ;
- certification ;
- rapport RSE exploitable.

### 3.4 Mots autorises

- `soutenu` ;
- `associe a` ;
- `contribue a` ;
- `estime` ;
- `environ` ;
- `ordre de grandeur` ;
- `projet lie a` ;
- `impact attendu` ;
- `suivi en cours` ;
- `preuve simple` ;
- `explication pedagogique`.

### 3.5 Mots interdits ou a verifier avant usage public

- `sauve` / `sauvee` / `sauvees` ;
- `protege` / `protegee` / `protegees` si pas de preuve ;
- `restaure` / `restauree` / `restaures` si action non documentee ;
- `compense` ;
- `garanti` ;
- `certifie` ;
- `verifie` ;
- `impact valide` ;
- `CO2 capture` sans methode ;
- `recu fiscal` sans validation juridique.

### 3.6 Difference entre les niveaux de preuve

| Niveau | Definition | Exemple d'usage |
|---|---|---|
| `[PREUVE_SIMPLE]` | Trace factuelle de l'action utilisateur | montant, date, projet, partenaire, statut paiement |
| `[PREUVE_PEDAGOGIQUE]` | Explication de lien ou d'intention | pourquoi un rucher aide des pollinisateurs |
| `[ESTIMATION]` | Projection basee sur hypothese | environ X abeilles soutenues |
| `[PREUVE_OPERATIONNELLE]` | Action terrain documentee | photo terrain, localisation, partenaire, etape realisee |
| `[PREUVE_MESUREE]` | Mesure verifiee ou auditee | relevé, audit externe, rapport methode |

### 3.7 Regle RSE

`[CIBLE_VALIDEE]` Toute utilisation RSE exige un niveau de prudence superieur.

Pour un rapport RSE, il faut au minimum :

- perimetre ;
- periode ;
- projet ;
- partenaire ;
- methode ;
- source ;
- limites ;
- niveau de confiance ;
- responsabilite entre Make the Change, partenaire et client.

`[CIBLE_VALIDEE]` Sans methode robuste, l'app peut fournir un reporting narratif/pedagogique, pas un reporting d'impact mesure.

### 3.8 Regle ecrans de succes apres don ou soutien

`[CIBLE_VALIDEE]` Apres don ou soutien, afficher en priorite :

- action confirmee ;
- montant ;
- projet ;
- partenaire ;
- date ;
- statut du paiement ;
- prochaine etape ;
- explication pedagogique prudente.

`[CIBLE_VALIDEE]` Ne pas afficher un resultat terrain accompli si l'action vient seulement d'etre payee.

### 3.9 Regle BioDex

`[CIBLE_VALIDEE]` Une espece debloquee dans le BioDex est une trace pedagogique et narrative liee a un projet, pas une preuve que l'espece est sauvee.

`[CIBLE_VALIDEE]` Les metriques BioDex doivent distinguer :

- lien projet-espece ;
- statut de conservation ;
- vulgarisation scientifique ;
- trace utilisateur ;
- preuve terrain eventuelle.

### 3.10 Regle equivalences depuis points, Credits Impact ou Graines

`[CIBLE_VALIDEE]` Un solde, des `points`, des Credits Impact ou des Graines ne doivent jamais etre convertis directement en preuve d'impact.

`[DEPRECIE]` Les conversions du type `credits -> abeilles sauvees` ou `points -> CO2 capture` sont a eviter.

`[A_PLANIFIER]` Si une equivalence est utile pedagogiquement, elle doit etre rattachee a un projet, une action, une hypothese documentee et une source.

## 4. Recommandation de formulation

### A privilegier

- `Votre soutien est associe a environ X abeilles soutenues, selon l'hypothese du projet.`
- `Ce projet vise a restaurer des zones de recif corallien.`
- `Votre action contribue a soutenir un projet lie a cette espece.`
- `Impact estime selon les informations disponibles.`
- `Suivi terrain en attente de validation partenaire.`
- `Photo terrain disponible lorsque l'action est documentee.`
- `Recu de contribution.`

### A eviter

- `X abeilles sauvees.`
- `CO2 capture.`
- `Impact garanti.`
- `Impact verifie.`
- `X coraux restaures` si non documente.
- `Cette espece est protegee grace a toi.`
- `Recu fiscal` sans cadre legal valide.
- `Credits Impact convertis en impact.`

## 5. Decision P0-6 proposee

`[CIBLE_VALIDEE]` Doctrine recommandee : V1 doit afficher des preuves simples, des explications pedagogiques et des estimations prudentes, mais ne doit pas afficher de preuve mesuree, de promesse forte ou de claim RSE sans methode robuste.

`[CIBLE_VALIDEE]` Les metriques d'impact ne sont pas des monnaies.

`[CIBLE_VALIDEE]` Les Credits Impact et les Graines ne sont pas une preuve d'impact.

`[A_PLANIFIER]` Un futur systeme de preuves peut ajouter un champ de niveau de preuve par claim, par projet et par metrique.
