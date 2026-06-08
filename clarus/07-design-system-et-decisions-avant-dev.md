# Design system Clarus et decisions avant developpement

## Role du document

Ce document liste les decisions qui manquent avant de lancer le developpement de Clarus.

Il complete les documents precedents avec une reflexion sur :

- theme dark/light ;
- design system ;
- navigation ;
- scope V0 ;
- donnees mockees ;
- composants a preparer ;
- risques a eviter.

## Avis sur dark theme puis light theme

Commencer par un dark theme est une bonne idee pour le prototype Clarus, a condition de ne pas le coder comme un theme unique.

Pourquoi commencer en dark :

- `web-client` a deja une direction dark mobile mature ;
- le rendu est plus premium et plus proche de l'application existante ;
- les modals, sheets, bottom nav et cards fonctionnent bien en dark ;
- une demo mobile dark donne vite une impression d'app finie ;
- les photos chantier ressortent bien sur fond sombre.

Mais il y a un point important : une app de chantier sera souvent utilisee en plein jour, sur telephone, parfois dehors. Un theme light sera probablement meilleur pour l'usage terrain reel.

Decision recommandee :

```txt
V0: dark theme uniquement dans l'UI visible
Code: tokens deja compatibles light/dark
V1 ou V1.5: ajout du light theme
```

Le dark theme doit donc etre le premier rendu, mais pas la seule architecture.

## Principe de theme

Ne pas utiliser directement des couleurs partout dans les composants.

Utiliser des tokens semantiques :

```txt
background
foreground
surface
surfaceElevated
border
muted
mutedForeground
primary
primaryForeground
danger
warning
success
info
toCheck
blocked
paid
billable
```

Les composants doivent parler en roles, pas en couleurs.

Exemple :

```txt
Badge status="to_check"
Button variant="primary"
Card tone="elevated"
```

Pas :

```txt
className="bg-lime-400 text-black"
```

## Direction visuelle recommandee

Clarus peut reprendre l'esprit de `web-client`, mais avec une intention plus chantier :

- sombre ;
- dense mais lisible ;
- peu decoratif ;
- gros boutons ;
- cards compactes ;
- statuts tres visibles ;
- photos et preuves bien mises en avant ;
- typographie forte pour les titres importants ;
- chiffres en `tabular-nums` pour heures et montants ;
- accents plus sobres que Make the Change.

## Palette dark proposee

Palette de depart :

```txt
background:        #080B0F
surface:           #11161D
surfaceElevated:   #171D26
border:            rgba(255,255,255,0.08)
foreground:        #F4F7FA
mutedForeground:   rgba(244,247,250,0.58)
primary:           #B6F255
primaryForeground: #10140B
```

Statuts :

```txt
toCheck:  #FBBF24  jaune/orange
success:  #22C55E  vert
danger:   #EF4444  rouge
blocked:  #F97316  orange fort
info:     #38BDF8  bleu
paid:     #34D399  vert doux
billable: #A3E635  lime
```

Avis :

- garder le lime de `web-client` comme accent possible ;
- ajouter orange/jaune pour `a verifier`, tres important dans Clarus ;
- eviter une interface uniquement lime/noir ;
- reserver le rouge aux actions destructives ou blocages forts.

## Future palette light

Le light theme ne doit pas etre pense apres coup.

Palette future possible :

```txt
background:        #F6F7F4
surface:           #FFFFFF
surfaceElevated:   #F0F3EE
border:            rgba(15,23,42,0.10)
foreground:        #111827
mutedForeground:   #64748B
primary:           #3F6212
primaryForeground: #FFFFFF
```

Le light theme devra garder les memes noms de tokens.

## Inspirations web-client utiles

Reference visuelle deja observee :

- accueil mobile dark ;
- fond noir profond ;
- cards grandes avec image ;
- bottom nav fixe ;
- accent lime ;
- typographie forte ;
- surfaces tres discretes ;
- contraste secondaire parfois faible.

Pour Clarus, reprendre :

- profondeur sombre ;
- bottom nav lisible ;
- header compact ;
- CTA clair ;
- cards avec bordures faibles ;
- grands visuels pour photos chantier.

Pour Clarus, corriger :

- augmenter le contraste des textes secondaires ;
- reduire les effets premium inutiles ;
- privilegier l'ergonomie terrain ;
- rendre les statuts plus explicites ;
- eviter les cards trop grandes quand on liste beaucoup d'interventions.

## Navigation a valider

Recommandation :

```txt
Aujourd'hui | Journal | Chantier | Couts
```

`Ajouter intervention` doit rester une action globale, pas une tab.

Raison :

- une tab sert a consulter ;
- ajouter est une action transversale ;
- l'action doit etre accessible depuis partout ;
- cela evite une navigation a 5 tabs trop chargee.

## Ecrans a prevoir avant dev

### V0 stricte

Ecrans visibles :

- Aujourd'hui ;
- Journal ;
- Chantier ;
- Couts ;
- Ajouter intervention ;
- Detail intervention.

### V0 avec modules prepares

Dans le modele et les mocks, prevoir :

- taches ;
- materiaux ;
- depenses ;
- photos.

Dans l'UI V0, les afficher legerement :

- `A verifier` sur Aujourd'hui ;
- petites sections dans Detail intervention ;
- pas encore des modules complets.

Decision recommandee :

```txt
Prevoir depenses/materiaux/taches/photos dans la data.
Ne pas leur donner une tab dediee en V0.
Les exposer comme blocs lies a une intervention ou une zone.
```

## Composants a definir avant dev

Avant de coder les ecrans, definir ces composants :

### Shells

- `ClarusTabScreen`
- `ClarusScreen`
- `ClarusBottomNav`
- `ClarusBottomActionBar`
- `ClarusFullScreenSlideModal`
- `ClarusMobileSheet`

### Primitives

- `Button`
- `IconButton`
- `Badge`
- `Card`
- `Input`
- `Textarea`
- `Select`
- `SegmentedControl`
- `NumberStepper`
- `Toast`
- `Dialog`

### Metier

- `InterventionCard`
- `TodaySummaryCard`
- `CostSummaryCard`
- `VerificationAlert`
- `ZoneCard`
- `PhaseProgressCard`
- `PersonChip`
- `StatusBadge`
- `WorkEntrySummary`

### Flow ajouter intervention

- `AddInterventionFlow`
- `StepIndicator`
- `QuickChoiceGrid`
- `PersonPicker`
- `ZonePicker`
- `TimePresetPicker`
- `FinancialStatusPicker`
- `InterventionReview`

## Donnees mockees a preparer

Avant dev, il faut une petite base de demo.

Minimum :

- 1 chantier ;
- 5 personnes ;
- 9 phases ;
- 12 zones simples ;
- 5 zones techniques ;
- 10 a 15 interventions ;
- 20 a 30 work entries ;
- 5 taches ;
- 5 materiaux ;
- 3 depenses ;
- 6 photos placeholder.

Les mocks doivent contenir :

- cas complet ;
- cas incomplet ;
- cas supplement ;
- cas paye ;
- cas a verifier ;
- cas structure sensible ;
- cas materiau a acheter ;
- cas depense sans montant ;
- cas conteneur presque plein.

## Questions restantes importantes

### Question 1 - Intensite du dark theme

Options :

1. Dark tres proche de `web-client`, premium et profond.
2. Dark chantier plus lisible, plus contraste, moins decoratif.
3. Dark hybride : structure web-client, lisibilite chantier.

Recommandation :

```txt
Option 3 - dark hybride.
```

### Question 2 - Niveau de V0

Options :

1. V0 stricte : interventions + heures + couts.
2. V0 preparee : interventions + heures + couts, avec blocs legers taches/materiaux/depenses/photos.
3. V1 trop tot : tous les modules complets.

Recommandation :

```txt
Option 2 - V0 preparee.
```

### Question 3 - Source visuelle web-client

Options :

1. Capturer 4 a 6 ecrans web-client et en faire une page de reference.
2. Utiliser seulement l'analyse code/composants.
3. Faire des mockups Clarus directement.

Recommandation :

```txt
Option 1 maintenant, option 3 plus tard.
```

## Risques si on developpe trop vite

- coder un dark theme non transformable en light ;
- avoir trop de tabs ;
- faire un flow ajouter intervention trop long ;
- mettre materiaux/depenses/photos comme modules complets trop tot ;
- copier des composants MTC trop specifiques ;
- ne pas avoir de donnees mockees assez realistes ;
- confondre prototype UX et architecture finale.

## Checklist avant lancement dev

Avant de scaffold Clarus :

- valider dark-first + tokens light-ready ;
- choisir palette Clarus V0 ;
- valider 4 tabs ;
- valider action globale Ajouter ;
- valider V0 preparee ;
- creer mocks realistes ;
- definir composants shell ;
- definir composants metier minimum ;
- choisir si les screenshots web-client deviennent une reference doc ;
- ecrire une spec V0 decision-complete.

## Decision recommandee finale

Commencer par un **dark theme Clarus inspire de web-client**, mais plus lisible et plus terrain.

Preparer le light theme dans les tokens des le premier commit UI, sans l'exposer tout de suite.

Faire une V0 preparee :

- interventions ;
- heures ;
- couts ;
- taches/materiaux/depenses/photos dans la data ;
- blocs legers dans l'UI ;
- pas de modules complets dedies avant validation.

