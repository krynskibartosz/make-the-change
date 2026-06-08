# Recherche web - decisions avant developpement Clarus

## Role du document

Ce document synthetise une recherche web sur les meilleures pratiques pertinentes pour Clarus.

Objectif : prendre les decisions manquantes avant de lancer le developpement, avec des sources fiables plutot qu'au feeling.

Sources principales consultees :

- W3C - WCAG 2.2 : https://www.w3.org/TR/WCAG22/
- Apple Human Interface Guidelines - Dark Mode : https://developer.apple.com/design/human-interface-guidelines/dark-mode
- Material Design - Dark theme : https://design.google/library/material-design-dark-theme
- Android Accessibility - Touch target size : https://support.google.com/accessibility/android/answer/7101858
- Apple Human Interface Guidelines - Buttons : https://developer.apple.com/design/human-interface-guidelines/buttons
- web.dev - Form best practices : https://web.dev/articles/sign-in-form-best-practices
- Microsoft Edge - PWA best practices : https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps/how-to/best-practices
- Microsoft Dynamics 365 Field Service - offline mode : https://www.microsoft.com/en-us/dynamics-365/blog/administrator/2023/11/08/best-practices-for-offline-mode-in-the-field-service-mobile-app-part-2/
- ScienceDirect - Implementation of Mobile Devices on Jobsites in the Construction Industry : https://www.sciencedirect.com/science/article/pii/S1877705815032014
- Nielsen Norman Group - Images on Mobile : https://www.nngroup.com/videos/mobile-images/
- CNIL - Recommendation on mobile applications : https://www.cnil.fr/sites/cnil/files/2025-05/recommendation-mobiles-app.pdf
- European Commission - European Accessibility Act 2025 : https://digital-strategy.ec.europa.eu/en/news/eu-becomes-more-accessible-all

## Decisions recommandees

### 1. Theme : dark-first, light-ready

Decision :

```txt
Commencer par un dark theme visible en V0.
Preparer le light theme dans les tokens des le debut.
Ne pas coder de couleurs hardcodees dans les composants metier.
```

Pourquoi :

- Apple indique que les utilisateurs peuvent choisir Dark Mode comme style par defaut et attendent que les apps respectent cette preference.
- Material explique que les dark themes modernes travaillent le contraste, la saturation et les gris profonds, pas seulement un fond noir.
- Pour une demo mobile Clarus, le dark theme donne une impression plus proche de `web-client` et met bien en valeur les photos chantier.
- Pour un vrai usage chantier, le light theme deviendra utile en plein jour. Il faut donc le preparer sans l'exposer tout de suite.

Consequence technique :

- creer des tokens `background`, `surface`, `surfaceElevated`, `foreground`, `mutedForeground`, `border`, `primary`, `warning`, `success`, `danger`, `toCheck`, etc. ;
- les composants doivent consommer des tokens semantiques ;
- pas de `bg-[#0B0F15]` disperse partout.

### 2. Accessibilite : viser WCAG 2.2 AA, avec cibles tactiles plus grandes que le minimum web

Decision :

```txt
Objectif minimum : WCAG 2.2 AA.
Pour mobile chantier : viser 44-48 px minimum pour toute action.
Pour actions principales : 52-56 px.
```

Pourquoi :

- WCAG 2.2 est recommande par le W3C pour maximiser l'applicabilite future et ajoute notamment des criteres utiles aux utilisateurs mobiles.
- Android/Material recommande des zones tactiles d'au moins 48dp, separees par environ 8dp.
- Apple recommande une zone d'activation d'au moins 44x44 pt pour les boutons.
- Sur chantier, les utilisateurs peuvent etre presses, fatigues, avec gants fins, poussiere, soleil ou ecran sale. Le minimum WCAG web ne suffit pas comme experience terrain.

Regle Clarus :

- icone visible possible en 20-24 px ;
- zone cliquable reelle minimum 48 px ;
- boutons primaires du flow intervention : 56 px ;
- ne jamais empiler deux petites actions critiques sans espacement.

### 3. Formulaires : labels visibles, champs courts, validation progressive

Decision :

```txt
Le flow Ajouter intervention doit etre un wizard rapide avec labels visibles.
Ne pas utiliser les placeholders comme labels.
Un champ texte libre doit rester optionnel.
```

Pourquoi :

- web.dev recommande les elements HTML semantiques `form`, `input`, `label`, `button`.
- Les labels doivent rester visibles ; les placeholders disparaissent et peuvent faire perdre le contexte.
- Les labels au-dessus des champs fonctionnent mieux sur mobile et gardent une mise en page stable.

Application Clarus :

- les choix rapides sont preferables aux champs texte ;
- `Quoi ?`, `Ou ?`, `Qui ?`, `Quand ?`, `Statut`, `Resume` ;
- les donnees manquantes passent en `a verifier` ;
- ne pas bloquer la sauvegarde sauf absence de titre/type vraiment impossible.

### 4. Images et photos : uniquement informatives

Decision :

```txt
Les photos chantier sont utiles.
Les images decoratives ne doivent pas alourdir les ecrans V0.
```

Pourquoi :

- NN/g recommande de ne pas utiliser d'images decoratives sur mobile, car elles allongent les pages et ralentissent l'experience.
- Dans Clarus, une photo est une preuve ou un contexte, pas une decoration.

Application Clarus :

- photos dans les fiches intervention, zone, phase ;
- image hero uniquement si elle aide a comprendre le chantier ;
- thumbnails compressees ;
- full-size plus tard, pas obligatoire en V0.

### 5. Offline : ne pas le construire en V0, mais concevoir pour ne pas le bloquer

Decision :

```txt
V0 : pas d'offline complet.
Architecture : preparer repository + future file d'attente locale.
V1/V2 : offline partiel pour consultation et saisie.
```

Pourquoi :

- Microsoft PWA recommande de pouvoir demarrer l'app, afficher du contenu utile et gerer gracieusement l'absence de reseau.
- Les apps terrain/offline demandent une configuration et une selection de donnees prudentes.
- Les fichiers lourds et images doivent etre limites ou traites specialement en offline.

Application Clarus :

- V0 mock-first ;
- plus tard : cache app shell, IndexedDB pour brouillons, sync queue ;
- ne pas synchroniser automatiquement toutes les photos en pleine resolution ;
- prevoir `syncStatus` dans le modele plus tard, mais ne pas l'exposer en V0.

### 6. Donnees chantier : la structure vaut plus que le nombre de modules

Decision :

```txt
V0 preparee : interventions + heures + couts visibles.
Taches, materiaux, depenses, photos existent dans les mocks et details, mais pas comme modules complets.
```

Pourquoi :

- Les etudes sur les mobiles sur chantier soulignent l'importance d'avoir l'information disponible rapidement pour mieux communiquer et prendre des decisions.
- Clarus doit remplacer Notes, pas devenir un ERP.
- La valeur vient des liens : intervention -> zone -> phase -> personne -> heures -> couts -> preuves.

Application Clarus :

- pas de tab dediee `Materiaux` en V0 ;
- pas de tab dediee `Photos` en V0 ;
- afficher ces blocs dans `Detail intervention` et `Chantier` ;
- transformer en modules complets seulement apres usage terrain.

### 7. Confidentialite et photos : minimisation des donnees

Decision :

```txt
Collecter le minimum utile.
Ne pas activer GPS, OCR, IA photo ou partage externe en V0.
```

Pourquoi :

- La CNIL rappelle les principes de minimisation et de securite pour les apps mobiles.
- Les photos de chantier peuvent contenir personnes, adresse, interieur prive, plans et documents sensibles.
- Si Clarus reste local/personnel, le risque est limite ; si l'app stocke sur serveur ou partage, le cadre GDPR devient plus important.

Application Clarus :

- V0 : photos placeholder ou locales si prototype ;
- pas de geolocalisation automatique ;
- pas de reconnaissance automatique ;
- pas d'envoi externe sans action explicite ;
- plus tard : politique de retention et droits d'acces.

### 8. Europe/accessibilite : penser long terme meme si V0 interne

Decision :

```txt
Meme pour un outil interne, concevoir comme si l'app devait devenir accessible.
```

Pourquoi :

- L'European Accessibility Act est entre en application le 28 juin 2025 dans l'UE pour des produits/services couverts.
- Clarus n'est pas forcement concerne en V0 interne, mais si le produit devient SaaS ou service numerique, l'accessibilite devient strategique.

Application Clarus :

- contrastes testables ;
- focus visible ;
- boutons avec noms accessibles ;
- pas d'information seulement par couleur ;
- labels textuels ;
- preference reduced motion respectee.

## Spec design system a figer avant developpement

### Tokens obligatoires

```txt
--background
--foreground
--surface
--surface-elevated
--surface-muted
--border
--muted
--muted-foreground
--primary
--primary-foreground
--warning
--warning-foreground
--success
--success-foreground
--danger
--danger-foreground
--info
--info-foreground
--to-check
--blocked
--paid
--billable
```

### Tailles minimales

```txt
IconButton: 48x48
PrimaryButton: 56 high
SecondaryButton: 48 high
Chip/Choice: 44 high minimum
Bottom nav item: 64-72 high
Input: 48-52 high
Textarea: min 96 high
```

### Typographie

```txt
Screen title: 28-32
Section title: 18-22
Body: 15-16
Secondary: 13-14
Tiny metadata: 11-12, jamais pour info critique
Numbers: tabular-nums
```

### Statuts metier

```txt
to_check: jaune/orange
done/paid: vert
blocked: orange fort
danger/delete: rouge
billable/to_invoice: lime ou vert clair
draft: gris
```

Regle :

- chaque statut a couleur + texte + icone ou label ;
- ne jamais utiliser seulement la couleur.

## Decisions de navigation

Navigation recommandee :

```txt
Aujourd'hui | Journal | Chantier | Couts
```

Action globale :

```txt
+ Ajouter intervention
```

Pourquoi ne pas faire une tab `Ajouter` :

- une tab est un espace de consultation ;
- ajouter est une action transversale ;
- le bouton doit etre visible depuis tous les contextes ;
- cela garde la navigation plus calme.

## Decisions V0

V0 doit inclure :

- shell mobile ;
- dark theme ;
- tokens light-ready ;
- mocks realistes ;
- repository mock-first ;
- calculs heures/couts ;
- Aujourd'hui ;
- Journal ;
- Chantier ;
- Couts ;
- Ajouter intervention ;
- Detail intervention.

V0 doit seulement prevoir :

- depenses ;
- materiaux ;
- taches ;
- photos.

Ces elements existent dans les donnees et dans les details, mais pas encore comme modules complets.

## Questions maintenant considerees comme resolues

### Dark ou light ?

Decision : dark-first, light-ready.

### Combien de tabs ?

Decision : 4 tabs principales.

### Ajouter intervention en tab ?

Decision : non, action globale.

### Depenses/materiaux/photos/taches en V0 ?

Decision : oui dans le modele et les mocks, leger dans l'UI, pas en modules complets.

### Offline ?

Decision : non en V0, mais ne pas bloquer l'architecture future.

### Accessibilite ?

Decision : WCAG 2.2 AA comme reference, avec cibles tactiles terrain plus grandes.

## Questions encore ouvertes

Ces questions restent a trancher avant la spec V0 finale :

1. Nom visible exact : `Clarus`, `Clarus Chantier`, `Sparrenlaan`, ou `Clarus Sparrenlaan`.
2. Accent couleur final : lime web-client, vert chantier, jaune chantier, ou duo vert/jaune.
3. Niveau de realisme photo dans les mocks : placeholders, vraies photos chantier, ou melange.
4. Presence d'un mode "demo" distinct du futur mode data.
5. Emplacement futur des assets plans/photos : repo, Supabase Storage, ou stockage local d'abord.
6. Priorite apres V0 : photos, depenses, exports ou Supabase.

## Recommandation finale

Le meilleur chemin est :

```txt
1. Finaliser le design system dark-first.
2. Ecrire les mocks Sparrenlaan realistes.
3. Ecrire une spec V0 decision-complete.
4. Scaffold Next standalone.
5. Implementer les shells + primitives.
6. Implementer repository mock-first + calculs testes.
7. Implementer les 4 tabs + ajouter intervention.
```

Cette sequence garde Clarus pragmatique, robuste et capable de devenir un vrai produit plus tard.

