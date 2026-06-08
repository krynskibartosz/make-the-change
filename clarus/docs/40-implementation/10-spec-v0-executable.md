# Spec V0 executable Clarus

## Role

Ce document est la source de verite executable pour lancer le developpement V0.

Les documents precedents restent utiles pour comprendre le contexte, mais les agents doivent suivre ce fichier quand une decision semble differente.

## Objectif V0

Construire une application mobile-first mock-first pour le chantier Sparrenlaan.

La V0 doit permettre de montrer une experience credible ou un utilisateur peut :

- voir le resume du jour ;
- ajouter une intervention rapidement ;
- consulter le journal des interventions ;
- comprendre le chantier par zones/phases/personnes ;
- consulter les couts principaux ;
- ouvrir le detail d'une intervention.

## Decisions non negociables V0

```txt
App: standalone
Data source: mock uniquement
Chantier visible: Sparrenlaan uniquement
Langue: FR uniquement
Theme visible: dark
Theme code: light-ready via tokens
Tabs: Aujourd'hui | Journal | Chantier | Couts
Action globale: + Ajouter intervention
Primary color: lime #B6F255
Supabase: non
Auth: non
Offline complet: non
Multi-chantier visible: non
```

## Structure cible

```txt
clarus-app/
  src/
    app/
      (tabs)/
        layout.tsx
        aujourd-hui/page.tsx
        journal/page.tsx
        chantier/page.tsx
        couts/page.tsx
        _components/
          bottom-nav.tsx
          tab-screen.tsx
      (screens)/
        interventions/[id]/page.tsx
        _components/
          screen.tsx
      @modal/
        default.tsx
        [...catchAll]/page.tsx
        _components/
          full-screen-slide-modal.tsx
          intercepted-route-dialog.tsx
        (.)interventions/new/page.tsx
        (.)interventions/[id]/edit/page.tsx
      layout.tsx
      page.tsx
    components/
      ui/
    features/
      costs/
      dashboard/
      interventions/
      project/
      settings/
    lib/
      calculations/
      formatters/
      mock/
      repositories/
      schemas/
      utils/
```

## Ecrans V0

### 1. Aujourd'hui

Role :

- hub operationnel ;
- resume du jour ;
- derniere activite ;
- alertes `a verifier` ;
- CTA `+ Ajouter intervention`.

Contenu minimum :

- nom chantier `Sparrenlaan` ;
- date du jour ;
- cartes metriques : interventions, heures, montant estime, a verifier ;
- liste courte des dernieres interventions ;
- section `A verifier`.

### 2. Journal

Role :

- liste chronologique des interventions ;
- retrouver ce qui a ete encode ;
- ouvrir detail intervention.

Contenu minimum :

- filtres rapides : `Tout`, `Aujourd'hui`, `A verifier`, `Supplement` ;
- `InterventionCard` ;
- badges zone, phase, statut ;
- resume heures/montant par intervention.

### 3. Chantier

Role :

- vue structuree du chantier ;
- zones, phases, personnes ;
- blocs legers taches/materiaux/photos.

Contenu minimum :

- cartes zones principales ;
- cartes phases ;
- resume personnes ;
- section `A verifier` liee au chantier.

### 4. Couts

Role :

- comprendre les couts principaux ;
- comparer par personne, zone et phase.

Contenu minimum :

- total heures ;
- total main d'oeuvre ;
- total a verifier ;
- total supplement ;
- repartition par personne ;
- repartition par zone ;
- repartition par phase.

### 5. Ajouter intervention

Role :

- encoder une intervention simple en moins de 30 secondes.

Ouverture :

- action globale ;
- route modale plein ecran ;
- pas une tab.

Etapes :

```txt
Quoi -> Ou -> Qui -> Quand -> Statut -> Resume
```

Regles :

- date par defaut : aujourd'hui ;
- taux par defaut : 45 EUR/h ;
- champs texte libres optionnels ;
- si une info manque, sauvegarder en `to_check` ;
- ne pas bloquer la sauvegarde sauf absence de type/titre impossible.

### 6. Detail intervention

Role :

- comprendre une intervention ;
- verifier heures/couts ;
- voir les elements lies.

Sections :

```txt
Apercu | Heures | Couts | Photos
```

V0 peut afficher taches, materiaux, depenses et photos comme blocs legers, sans modules complets.

## Design system V0

### Theme

```txt
background:        #080B0F
surface:           #11161D
surfaceElevated:   #171D26
foreground:        #F4F7FA
mutedForeground:   rgba(244,247,250,0.68)
border:            rgba(255,255,255,0.08)
primary:           #B6F255
primaryForeground: #10140B
warning/toCheck:   #FBBF24
success:           #22C55E
danger:            #EF4444
info:              #38BDF8
```

Regles :

- utiliser des tokens semantiques ;
- pas de couleurs hardcodees dans les composants metier ;
- `primary` sert aux CTA et actions principales ;
- les statuts utilisent couleur + label + icone si utile ;
- l'information ne doit jamais dependre uniquement de la couleur.

### Tailles

```txt
IconButton: 48x48 minimum
PrimaryButton: 56px high
SecondaryButton: 48px high
Choice/Chip: 44px high minimum
Bottom nav item: 64-72px high
Input: 48-52px high
Textarea: 96px min-height
```

## Types metier minimum

La V0 doit inclure :

- `Project`
- `Phase`
- `Zone`
- `Person`
- `Intervention`
- `WorkEntry`
- `Task`
- `Material`
- `MaterialMovement`
- `Expense`
- `Photo`

Les types doivent garder `projectId`, meme si le multi-chantier est invisible.

## Repositories minimum

```ts
type ClarusRepository = {
  getProject: () => Promise<Project>
  getPeople: () => Promise<Person[]>
  getPhases: () => Promise<Phase[]>
  getZones: () => Promise<Zone[]>
  getInterventions: () => Promise<Intervention[]>
  getInterventionById: (id: string) => Promise<Intervention | null>
  getWorkEntries: () => Promise<WorkEntry[]>
  getTodaySummary: (date: string) => Promise<TodaySummary>
  createInterventionDraft: (input: CreateInterventionDraftInput) => Promise<InterventionDraft>
}
```

V0 supporte uniquement `mock`, mais les composants ne doivent jamais importer les mocks directement.

## Calculs minimum

Fonctions pures attendues :

```ts
calculateWorkEntryDuration(input)
calculateWorkEntryAmount(input)
calculateInterventionTotals(input)
calculateTotalsByPerson(input)
calculateTotalsByZone(input)
calculateTotalsByPhase(input)
getInterventionVerificationStatus(input)
```

Cas obligatoires :

- 8h00 -> 18h30 ;
- pause definie ;
- multi-personnes ;
- multi-jours ;
- taux 45 EUR/h ;
- intervention incomplete marquee `to_check`.

## Mocks V0

Minimum :

```txt
1 projet Sparrenlaan
5 personnes
9 phases
12 zones simples
5 zones techniques
10 a 15 interventions
20 a 30 work entries
5 taches
5 materiaux
3 depenses
6 photos placeholder ou assets locaux
```

Les mocks doivent inclure :

- cas complet ;
- cas incomplet ;
- supplement ;
- paye ;
- a verifier ;
- materiau a acheter ;
- depense sans montant ;
- conteneur presque plein.

## Tests attendus

V0 doit avoir des tests Vitest pour :

- calculs heures ;
- calculs montants ;
- totaux par personne ;
- totaux par zone ;
- totaux par phase ;
- intervention incomplete ;
- mapping mocks vers `Aujourd'hui` ;
- mapping mocks vers `Couts`.

## Verification visuelle attendue

Avant de declarer la V0 terminee :

- ouvrir l'app sur mobile viewport ;
- verifier les 4 tabs ;
- verifier `Ajouter intervention` ;
- verifier detail intervention ;
- verifier absence de chevauchement texte/bouton ;
- verifier que le CTA sticky ne cache pas l'information critique ;
- prendre au moins 4 screenshots mobile.

## Non-objectifs V0

Ne pas construire :

- Supabase ;
- auth ;
- offline complet ;
- upload photo reel obligatoire ;
- OCR ;
- IA ;
- exports PDF ;
- paiement ;
- TVA ;
- multi-chantier visible ;
- module materiaux complet ;
- module photos complet ;
- module taches complet ;
- planning Gantt.

## Critere d'acceptation V0

La V0 est acceptable si :

- la demo est credible avec des donnees mockees ;
- l'utilisateur comprend quoi faire depuis `Aujourd'hui` ;
- une intervention simple semble encodable en moins de 30 secondes ;
- les couts/heures sont lisibles ;
- les donnees incompletes sont visibles ;
- l'UI est deja structuree pour remplacer les mocks plus tard.
