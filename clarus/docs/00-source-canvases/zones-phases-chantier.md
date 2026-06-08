# Canvas 5 — Zones & phases du chantier Sparrenlaan

## Objectif du canvas

Ce document définit les zones et les phases du chantier **Sparrenlaan** à utiliser dans l’application.

L’objectif est de permettre à chaque intervention, heure, photo, dépense, matériau, tâche ou décision d’être correctement liée à une zone et à une phase.

Ce canvas sert de base pour :

* l’écran “Ajouter intervention” ;
* l’écran “Étapes” ;
* l’écran “Plans / zones” ;
* les filtres de coûts ;
* le suivi des matériaux ;
* le suivi des suppléments ;
* les exports futurs.

## Principe général

L’application ne doit pas reproduire les plans techniques dans toute leur complexité.

Elle doit créer une version mobile, simple et exploitable du chantier.

Il faut donc distinguer deux niveaux :

1. **Zones simples**

   * compréhensibles par Hubert, Chris, Grégory et les personnes sur chantier ;
   * utilisées dans la saisie rapide.

2. **Zones techniques**

   * liées aux plans ;
   * utiles pour la structure, les validations, les photos preuves et les décisions ;
   * utilisées seulement quand nécessaire.

## Chantier concerné

**Nom :** Sparrenlaan
**Adresse :** Sparrenlaan n°35, 3090 Overijse
**Nature :** transformation d’une maison unifamiliale
**Plans visibles :**

* Haut rez-de-chaussée ;
* Haut sous-sol ;
* coupes structurelles ;
* zones terrasse et toiture verte ;
* éléments structurels HEA, IPE, UPN, cornières et plats soudés.

## Zones principales V1

Ces zones doivent être visibles directement dans l’app.

Elles servent à classer rapidement les interventions.

---

## Zone 1 — Maison existante

### Description

Zone générale de la maison déjà existante.

Elle sert à classer les interventions qui concernent l’intérieur existant, les protections, les accès, les démontages ou les travaux non directement liés à l’extension.

### Exemples d’interventions liées

* protection des sols ;
* démontage de meubles ;
* protection des accès ;
* nettoyage intérieur ;
* passage matériel ;
* photos avant/après ;
* petites démolitions intérieures.

### Phases fréquentes

* Préparation ;
* Protection ;
* Démolition ;
* Finitions.

---

## Zone 2 — Garage

### Description

Zone liée au garage et à la semelle béton mentionnée dans les notes récupérées.

### Exemple déjà connu

“Démolition garage semelle béton 5,5 x 0,50”

### Interventions possibles

* démolition garage ;
* démolition semelle béton ;
* évacuation gravats ;
* photos avant/après ;
* supplément à facturer ;
* contrôle de dimensions ;
* nettoyage.

### Phases fréquentes

* Démolition ;
* Évacuation ;
* Administratif / facturation.

---

## Zone 3 — Sol béton / dalle

### Description

Zone liée aux travaux de démolition du béton de sol ou de dalle.

### Exemple déjà connu

“Démolition béton de sol 2 jours x 2 hommes”

### Interventions possibles

* démolition béton de sol ;
* utilisation marteau-piqueur ou disqueuse ;
* évacuation béton ;
* conteneur gravats ;
* photos avant / pendant / après ;
* supplément ;
* heures importantes à suivre.

### Phases fréquentes

* Démolition ;
* Évacuation ;
* Contrôle / validations.

---

## Zone 4 — Extérieur

### Description

Zone extérieure du chantier, liée aux démolitions extérieures, accès, évacuations, terre, pierres, béton et préparation du prolongement.

### Exemple déjà connu

“Démolition béton extérieur + évacuation”

### Interventions possibles

* démolition béton extérieur ;
* évacuation gravats ;
* évacuation terre / pierres ;
* usage de machines ;
* accès chantier ;
* stockage temporaire ;
* préparation terrain ;
* photos de preuve ;
* conteneur.

### Phases fréquentes

* Préparation ;
* Démolition ;
* Évacuation ;
* Extension / construction.

---

## Zone 5 — Extension arrière

### Description

Zone centrale du projet de transformation / prolongement.

Elle correspond à la partie où la maison est transformée ou prolongée.

### Interventions possibles

* préparation extension ;
* terrassement ;
* fondations ;
* structure ;
* maçonnerie ;
* dalle ;
* étanchéité ;
* toiture ;
* photos d’avancement ;
* validations avec Martin / architecte / ingénieur.

### Phases fréquentes

* Préparation ;
* Contrôle / validations ;
* Structure ;
* Extension / construction ;
* Finitions.

---

## Zone 6 — Sous-sol

### Description

Zone liée au plan “Haut sous-sol”.

Le plan montre plusieurs éléments à confirmer, notamment des semelles, dalles, fondations et liaisons.

### Éléments visibles sur plan

* semelle existante ;
* dalle existante ;
* liaisons aux fondations existantes ;
* ancrage chimique des armatures ;
* certains éléments indiqués “à confirmer”.

### Interventions possibles

* contrôle de niveau ;
* vérification semelles ;
* démolition / préparation ;
* liaison fondations ;
* ancrage ;
* préparation structure ;
* photos de preuve ;
* points à confirmer.

### Phases fréquentes

* Contrôle / validations ;
* Structure ;
* Extension / construction.

---

## Zone 7 — Structure / mur porteur

### Description

Zone sensible liée aux éléments porteurs, poutres, cornières, plats soudés, liaisons et coupes techniques.

C’est une zone à traiter séparément parce qu’elle implique potentiellement des validations techniques.

### Interventions possibles

* vérification plan / réalité ;
* ouverture ou préparation mur porteur ;
* pose ou préparation de poutre ;
* liaison entre éléments ;
* resserrage au mortier ;
* photos preuve avant fermeture ;
* validation avec Martin ;
* validation architecte / ingénieur ;
* points à confirmer.

### Phases fréquentes

* Contrôle / validations ;
* Structure ;
* Administratif / facturation.

### Règle spécifique

Toute intervention liée à cette zone devrait proposer automatiquement :

* ajout de photo preuve ;
* point de validation ;
* statut “à confirmer” ou “à vérifier” ;
* possibilité de lier une référence technique.

---

## Zone 8 — Escalier / premier étage

### Description

Zone liée aux protections et interventions dans les circulations verticales et le premier étage.

### Exemple déjà connu

“Protection des sols escalier + premier étage”

### Interventions possibles

* protection des sols ;
* protection escalier ;
* démontage ;
* nettoyage ;
* circulation des matériaux ;
* photos avant/après ;
* dépenses liées aux protections.

### Phases fréquentes

* Préparation ;
* Protection ;
* Finitions.

---

## Zone 9 — Terrasse

### Description

Zone visible dans le plan avec une surcharge spécifique.

Sur le plan, la terrasse semble indiquée en zone A, en orange.

### Interventions possibles

* préparation terrasse ;
* contrôle surcharge ;
* structure ;
* étanchéité ;
* support ;
* finitions ;
* photos ;
* validations.

### Phases fréquentes

* Contrôle / validations ;
* Structure ;
* Extension / construction ;
* Finitions.

### Attention

Les informations techniques de surcharge ne doivent pas être interprétées par l’application comme une validation. Elles servent uniquement à classer et suivre les interventions.

---

## Zone 10 — Toiture verte

### Description

Zone visible sur le plan avec une surcharge spécifique.

Sur le plan, la toiture verte semble indiquée en zone B, en vert.

### Interventions possibles

* préparation toiture verte ;
* contrôle support ;
* étanchéité ;
* drainage ;
* matériaux spécifiques ;
* photos ;
* validation technique ;
* suivi des charges.

### Phases fréquentes

* Contrôle / validations ;
* Structure ;
* Extension / construction ;
* Finitions.

### Attention

Toute décision technique sur cette zone doit rester validée par les personnes compétentes : Martin, architecte, ingénieur ou bureau d’étude.

---

## Zone 11 — Zone conteneur / déchets

### Description

Zone dédiée à l’évacuation et au suivi des déchets.

Cette zone est très importante parce que le chantier implique de la démolition, du béton, de la terre, des pierres, des gravats et potentiellement plusieurs conteneurs.

### Interventions possibles

* ajout gravats ;
* ajout béton ;
* ajout terre ;
* conteneur presque plein ;
* conteneur remplacé ;
* conteneur enlevé ;
* nouveau conteneur arrivé ;
* photo conteneur ;
* frais d’évacuation ;
* supplément éventuel.

### Phases fréquentes

* Démolition ;
* Évacuation ;
* Administratif / facturation.

### Types de déchets

* béton ;
* gravats ;
* terre ;
* pierre ;
* bois ;
* métal ;
* déchets mixtes ;
* autre.

---

## Zone 12 — Stockage matériaux

### Description

Zone où les matériaux sont déposés ou disponibles sur chantier.

Elle permet de suivre ce qui est physiquement présent sur place.

### Interventions possibles

* matériau livré ;
* matériau stocké ;
* matériau utilisé ;
* matériau manquant ;
* photo livraison ;
* contrôle quantité ;
* rangement ;
* perte ou casse.

### Phases fréquentes

* Préparation ;
* Structure ;
* Extension / construction ;
* Finitions.

## Zones techniques optionnelles

Ces zones ou références ne doivent pas forcément être affichées dans la saisie rapide par défaut.

Elles doivent être disponibles en option avancée, surtout pour la structure, les photos de preuve et les points à confirmer.

---

## P1.7 — 2x IPE360

### Description

Élément structurel visible sur les plans et coupes.

Mentions visibles :

* 2x IPE360 ;
* plats inférieurs soudés ;
* filière 7/15 boulonnée selon certaines indications ;
* liaison avec P1.6 dans la coupe BB.

### Liens possibles

* zone parent : Structure / mur porteur ;
* coupes : AA et BB ;
* phase : Structure ;
* interventions : préparation, pose, validation, photos preuve.

### À utiliser pour

* photos techniques ;
* points à confirmer ;
* suivi de pose ;
* contrôle avant fermeture ;
* liaison avec notes structurelles.

---

## P1.8 — UPN350

### Description

Élément structurel visible sur le plan et la coupe CC.

Mentions visibles :

* UPN350 ;
* cornière 100x100/10 ;
* filière 7/15 boulonnée selon indications ;
* plat soudé e=10mm visible sur la coupe.

### Liens possibles

* zone parent : Structure / mur porteur ;
* coupe : CC ;
* phase : Structure.

### À utiliser pour

* suivi intervention structure ;
* photo preuve ;
* validation ;
* note technique ;
* décision à confirmer.

---

## P1.5 — HEA140

### Description

Élément structurel visible sur le plan et sur la coupe AA.

### Liens possibles

* zone parent : Structure / mur porteur ;
* phase : Structure ;
* coupe : AA.

### À utiliser pour

* suivi des interventions structure ;
* photo preuve ;
* validation technique.

---

## P1.6 — L180x180/13mm

### Description

Élément technique visible dans les coupes, notamment en relation avec P1.7.

### Liens possibles

* zone parent : Structure / mur porteur ;
* coupe : BB ;
* phase : Structure.

---

## P1.13 — HEA140

### Description

Élément visible sur le plan du haut rez-de-chaussée.

### Liens possibles

* zone parent : Structure ;
* phase : Structure.

---

## P1.15 — HEA140

### Description

Élément visible sur le plan du haut rez-de-chaussée.

### Liens possibles

* zone parent : Structure ;
* phase : Structure.

---

## C0.1 — 80x80 e=5mm

### Description

Élément technique visible sur le plan.

### Liens possibles

* zone parent : Structure ;
* phase : Structure.

---

## C0.3 — Ø100/5mm

### Description

Élément technique visible sur le plan.

### Liens possibles

* zone parent : Structure ;
* phase : Structure.

---

## Coupes AA, BB, CC

### Description

Références de coupe visibles sur les plans.

Elles ne sont pas des zones de travail physiques, mais des références techniques.

### Usage dans l’application

Les coupes peuvent être utilisées comme tags ou références liées à :

* photos de plan ;
* interventions structurelles ;
* validations ;
* décisions ;
* points à confirmer.

## Phases du chantier

Les phases permettent de structurer l’avancement global.

Chaque intervention doit idéalement être liée à une phase.

---

## Phase 1 — Préparation

### Objectif

Préparer le chantier avant les travaux importants.

### Tâches possibles

* prise de photos avant travaux ;
* installation des accès ;
* protection des zones sensibles ;
* organisation du stockage ;
* installation zone déchets ;
* vérification des plans disponibles ;
* repérage des zones ;
* identification des points à confirmer.

### Zones fréquentes

* Maison existante ;
* Escalier / premier étage ;
* Stockage matériaux ;
* Zone conteneur ;
* Extérieur.

---

## Phase 2 — Protection

### Objectif

Protéger les zones existantes pour éviter les dégâts pendant le chantier.

### Tâches possibles

* protection sols ;
* protection escalier ;
* protection premier étage ;
* protection portes / murs ;
* protection circulation ;
* démontage temporaire d’éléments sensibles.

### Exemple déjà connu

“Protection des sols escalier + premier étage”

### Zones fréquentes

* Maison existante ;
* Escalier / premier étage ;
* Stockage matériaux.

### Matériaux possibles

* protection sols ;
* bâches ;
* adhésifs ;
* panneaux ;
* cartons ;
* visserie ;
* consommables.

---

## Phase 3 — Démolition

### Objectif

Supprimer les éléments existants nécessaires à la transformation.

### Tâches possibles

* démolition garage ;
* démolition semelle béton ;
* démolition béton de sol ;
* démolition béton extérieur ;
* démontage meuble sur mesure ;
* ouverture / préparation ;
* tri déchets ;
* photos avant / après.

### Exemples déjà connus

* démolition garage semelle béton 5,5 x 0,50 ;
* démolition béton de sol ;
* démolition béton extérieur ;
* démontage meuble sur mesure chambre 1er étage.

### Zones fréquentes

* Garage ;
* Sol béton ;
* Extérieur ;
* Maison existante ;
* Structure ;
* Escalier / premier étage.

### Matériel possible

* marteau-piqueur ;
* disqueuse ;
* disques béton ;
* brouette ;
* mini-pelle ;
* outils manuels ;
* sacs gravats ;
* conteneur.

---

## Phase 4 — Évacuation

### Objectif

Évacuer les déchets issus de la démolition ou de la préparation.

### Tâches possibles

* évacuation gravats ;
* évacuation béton ;
* évacuation terre ;
* évacuation pierres ;
* remplissage conteneur ;
* demande enlèvement conteneur ;
* réception nouveau conteneur ;
* photo conteneur.

### Zones fréquentes

* Extérieur ;
* Zone conteneur / déchets ;
* Garage ;
* Sol béton.

### Types de déchets

* béton ;
* gravats ;
* terre ;
* pierres ;
* bois ;
* métal ;
* déchets mixtes.

---

## Phase 5 — Contrôle / validations

### Objectif

Vérifier les éléments importants avant de poursuivre, surtout pour les points structurels et les éléments à confirmer sur plan.

### Tâches possibles

* vérifier cotes sur place ;
* comparer plan et réalité ;
* demander confirmation à Martin ;
* demander confirmation architecte ;
* demander confirmation ingénieur ;
* prendre photo preuve ;
* enregistrer décision orale ou écrite ;
* noter les différences entre plan et terrain.

### Zones fréquentes

* Structure / mur porteur ;
* Sous-sol ;
* Extension arrière ;
* Terrasse ;
* Toiture verte.

### Statuts utiles

* à demander ;
* en attente ;
* confirmé oralement ;
* confirmé par écrit ;
* refusé ;
* à vérifier.

---

## Phase 6 — Structure

### Objectif

Suivre les travaux liés aux éléments porteurs et structurels.

### Tâches possibles

* préparation support ;
* pose ou préparation HEA ;
* pose ou préparation IPE ;
* pose ou préparation UPN ;
* cornières ;
* plats soudés ;
* resserrage au mortier ;
* liaisons ;
* photos avant fermeture ;
* validation technique.

### Zones fréquentes

* Structure / mur porteur ;
* Extension arrière ;
* Sous-sol ;
* Terrasse ;
* Toiture verte.

### Références techniques possibles

* P1.7 ;
* P1.8 ;
* P1.5 ;
* P1.6 ;
* P1.13 ;
* P1.15 ;
* C0.1 ;
* C0.3 ;
* Coupe AA ;
* Coupe BB ;
* Coupe CC.

---

## Phase 7 — Extension / construction

### Objectif

Suivre la construction ou transformation de la partie extension.

### Tâches possibles

* fondations ;
* semelles ;
* dalle ;
* maçonnerie ;
* blocs ;
* béton ;
* toiture ;
* terrasse ;
* toiture verte ;
* étanchéité ;
* raccords à l’existant.

### Zones fréquentes

* Extension arrière ;
* Sous-sol ;
* Extérieur ;
* Terrasse ;
* Toiture verte ;
* Structure.

---

## Phase 8 — Finitions

### Objectif

Suivre les travaux de fermeture, nettoyage, remise en état et finitions.

### Tâches possibles

* nettoyage ;
* retrait protections ;
* réparation petites zones ;
* finitions intérieures ;
* photos finales ;
* contrôle qualité ;
* rangement chantier ;
* évacuation finale.

### Zones fréquentes

* Maison existante ;
* Extension arrière ;
* Escalier / premier étage ;
* Extérieur.

---

## Phase 9 — Administratif / facturation

### Objectif

Regrouper ce qui sert au décompte, à la facturation, aux suppléments et au suivi financier.

### Tâches possibles

* vérifier heures ;
* vérifier suppléments ;
* lier dépenses aux postes ;
* ajouter factures fournisseurs ;
* marquer payé / à payer ;
* préparer décompte ;
* préparer facture ;
* exporter PDF / CSV ;
* corriger données incomplètes.

### Zones fréquentes

* Toutes zones.

### Statuts importants

* à vérifier ;
* à facturer ;
* facturé ;
* payé ;
* à payer ;
* à refacturer.

## Règles de liaison zone / phase

Chaque intervention doit idéalement avoir :

* une zone simple ;
* une phase ;
* un type ;
* un statut.

Exemple :

**Démolition béton de sol**

* Zone : Sol béton ;
* Phase : Démolition ;
* Type : Démolition ;
* Statut : à vérifier ;
* Supplément : oui ou à vérifier.

Exemple :

**Protection sols escalier + premier étage**

* Zone : Escalier / premier étage ;
* Phase : Protection ;
* Type : Protection ;
* Matériau lié : protection sols ;
* Fournisseur possible : Lovemat.

Exemple :

**Conteneur presque plein**

* Zone : Zone conteneur / déchets ;
* Phase : Évacuation ;
* Type : Déchet / évacuation ;
* Statut : à suivre ;
* Tâche créée : prévoir enlèvement ou remplacement.

Exemple :

**Demander confirmation à Martin pour P1.7**

* Zone : Structure / mur porteur ;
* Zone technique : P1.7 ;
* Phase : Contrôle / validations ;
* Type : Décision ;
* Statut : à demander.

## Utilisation dans l’écran “Ajouter intervention”

L’écran “Ajouter intervention” doit proposer les zones et phases dans un ordre simple.

### Ordre recommandé pour les zones

1. Garage
2. Sol béton
3. Extérieur
4. Extension arrière
5. Structure
6. Sous-sol
7. Escalier / premier étage
8. Terrasse
9. Toiture verte
10. Conteneur / déchets
11. Stockage matériaux
12. Maison existante
13. À définir

### Ordre recommandé pour les phases

1. Préparation
2. Protection
3. Démolition
4. Évacuation
5. Contrôle / validations
6. Structure
7. Extension / construction
8. Finitions
9. Administratif / facturation

## Suggestions automatiques

L’application peut suggérer automatiquement une phase selon le type et la zone.

### Exemples

Si type = Démolition et zone = Garage
→ phase suggérée : Démolition

Si type = Démolition et zone = Sol béton
→ phase suggérée : Démolition

Si type = Déchets et zone = Conteneur
→ phase suggérée : Évacuation

Si type = Protection et zone = Escalier / premier étage
→ phase suggérée : Protection

Si type = Point à confirmer et zone = Structure
→ phase suggérée : Contrôle / validations

Si type = Travail structure et zone = P1.7
→ phase suggérée : Structure

Si type = Achat et matériau = Protection sols
→ phase suggérée : Protection

Si type = Dépense
→ phase suggérée : Administratif / facturation, avec possibilité de lier à une autre phase.

## Données à vérifier dans l’app

Certaines zones ou interventions doivent déclencher une vigilance particulière.

### Structure / mur porteur

À vérifier :

* validation Martin ;
* validation ingénieur si nécessaire ;
* photos preuve ;
* plan / coupe lié ;
* statut clair avant poursuite.

### Sous-sol

À vérifier :

* éléments “à confirmer” visibles sur plan ;
* niveaux ;
* semelles ;
* liaisons ;
* photos avant intervention.

### Terrasse / toiture verte

À vérifier :

* surcharge ;
* support ;
* étanchéité ;
* validation technique ;
* matériaux spécifiques.

### Suppléments

À vérifier :

* est-ce inclus ou hors devis ?
* qui valide ?
* qui paie ?
* montant calculé ;
* heures liées ;
* matériaux liés ;
* photos justificatives.

## Vue “Plans / zones” dans l’application

### V1

Afficher une liste de zones.

Chaque zone ouvre une fiche.

### Fiche zone

Chaque fiche zone affiche :

* description ;
* phase(s) concernée(s) ;
* interventions liées ;
* tâches ouvertes ;
* photos ;
* heures ;
* coûts ;
* matériaux ;
* points à confirmer ;
* suppléments.

### Exemple fiche zone : Sol béton

* Phase principale : Démolition
* Interventions : démolition béton de sol
* Heures : 42h
* Main-d’œuvre : 1 890€
* Photos : avant / pendant / après
* Déchets liés : béton / gravats
* Statut : supplément à vérifier

### Exemple fiche zone : Structure

* Phase principale : Contrôle / Structure
* Références : P1.7, P1.8, P1.5, P1.6, coupes AA/BB/CC
* Points à confirmer : liste
* Photos preuves : liste
* Décisions : liste
* Statut : sensible / à vérifier

## Vue plan simplifié mobile

La V1.5 pourra afficher un plan simplifié, pas un plan technique complet.

### Zones cliquables possibles

* Maison existante
* Extension arrière
* Garage
* Sol béton
* Extérieur
* Sous-sol
* Structure
* Terrasse
* Toiture verte
* Escalier / étage
* Conteneur
* Stockage matériaux

### Objectif

Permettre à l’utilisateur de cliquer sur une zone et de voir :

* ce qui a été fait ;
* ce qu’il reste à faire ;
* combien ça coûte ;
* quelles photos sont liées ;
* quels matériaux sont liés ;
* quels points sont à confirmer.

## Règles pratiques pour le développement

### Règle 1

Les zones simples doivent être utilisées partout dans l’interface.

### Règle 2

Les zones techniques ne doivent apparaître que dans un mode avancé ou comme référence optionnelle.

### Règle 3

Une intervention peut avoir une zone principale et plusieurs tags techniques.

Exemple :

* Zone principale : Structure ;
* Tags techniques : P1.7, Coupe AA.

### Règle 4

Une dépense peut être liée à une intervention, même si elle concerne indirectement une zone.

Exemple :

* Lovemat protection sols ;
* intervention liée : Protection sols escalier + premier étage ;
* zone : Escalier / premier étage ;
* phase : Protection.

### Règle 5

Une photo doit toujours proposer une zone par défaut.

Si une intervention vient d’être créée, la photo doit proposer de se lier automatiquement à cette intervention.

### Règle 6

Une tâche créée depuis une intervention doit hériter de sa zone et de sa phase.

Exemple :

Intervention : Démolition béton extérieur
Tâche créée : prévoir enlèvement conteneur
Zone héritée : Extérieur ou Zone conteneur
Phase héritée : Évacuation

## Critère de réussite

Le système de zones et phases est réussi si l’application permet de répondre facilement à ces questions :

* Qu’est-ce qui a été fait dans cette zone ?
* Combien cette zone a coûté ?
* Quelles photos prouvent le travail ?
* Quels matériaux ont été utilisés ?
* Quels suppléments sont liés à cette zone ?
* Quelles tâches restent ouvertes ?
* Quels points sont à confirmer ?
* Quelle phase du chantier prend le plus de temps ?
* Quelle phase coûte le plus cher ?
