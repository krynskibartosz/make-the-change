# Canvas 2 — Cahier des charges V1

## Nom du projet

**Clarus Chantier — Sparrenlaan**

## Objectif de la V1

Créer une première version utilisable sur le chantier Sparrenlaan pour suivre les interventions, les heures, les matériaux, les dépenses, les tâches, les photos, les suppléments et les coûts.

La V1 doit rester simple et centrée sur l’usage terrain.

## Règle principale

Il n’y a qu’un seul chantier dans l’interface : **Sparrenlaan**.

L’utilisateur ne doit pas créer de chantier.
L’application s’ouvre directement sur le chantier actuel.

## Écrans principaux V1

### 1. Accueil chantier

L’écran d’accueil affiche un résumé rapide du chantier.

Éléments visibles :

* nom du chantier ;
* bouton principal : Ajouter une intervention ;
* tâches ouvertes ;
* matériaux à acheter ;
* total heures ;
* total main-d’œuvre ;
* total dépenses / marchandises ;
* total à vérifier ;
* total encore à payer ;
* derniers ajouts ;
* points à demander ou confirmer.

Actions rapides :

* Ajouter intervention ;
* Ajouter dépense ;
* Ajouter matériau ;
* Ajouter tâche ;
* Ajouter photo ;
* Voir coûts ;
* Voir étapes.

---

### 2. Ajouter intervention

C’est l’écran central de l’application.

Une intervention représente quelque chose qui s’est passé ou doit se passer sur le chantier.

Types d’intervention possibles :

* travail réalisé ;
* heures ;
* démolition ;
* évacuation ;
* protection ;
* démontage ;
* structure ;
* préparation ;
* achat ;
* dépense ;
* matériau utilisé ;
* tâche à faire ;
* point à confirmer ;
* supplément ;
* photo.

Champs principaux :

* titre ;
* type ;
* phase ;
* zone ;
* date ;
* personnes concernées ;
* horaires ;
* nombre de jours ;
* pause ;
* taux horaire ;
* description courte ;
* statut ;
* supplément : oui / non / à vérifier ;
* à facturer : oui / non / à vérifier ;
* payé : oui / non / à vérifier.

Champs liés optionnels :

* photo ;
* matériau ;
* dépense ;
* tâche ;
* point à demander à Martin ;
* commentaire libre.

L’écran doit permettre une saisie rapide avec des boutons.

Exemples de boutons rapides :

Personnes :

* Hubert ;
* Chris ;
* Bartosz ;
* Grégory ;
* Autre.

Horaires fréquents :

* 8h00 → 16h30 ;
* 8h00 → 18h00 ;
* 8h00 → 18h30 ;
* 9h00 → 18h00 ;
* 9h30 → 14h30 ;
* autre.

Types fréquents :

* Démolition ;
* Évacuation ;
* Protection ;
* Démontage ;
* Structure ;
* Matériaux ;
* Dépense ;
* À faire.

Zones fréquentes :

* Garage ;
* Sol béton ;
* Extérieur ;
* Extension arrière ;
* Structure ;
* Sous-sol ;
* Escalier / premier étage ;
* Terrasse ;
* Toiture verte ;
* Conteneur ;
* Stockage matériaux.

---

### 3. Étapes

L’écran Étapes permet de suivre l’avancement global.

Phases proposées :

1. Préparation
2. Protection
3. Démolition
4. Évacuation
5. Contrôle / validations
6. Structure
7. Extension / construction
8. Finitions
9. Administratif / facturation

Chaque phase contient des tâches.

Chaque tâche peut être :

* à faire ;
* en cours ;
* bloquée ;
* terminée ;
* à vérifier.

Une tâche peut être liée à :

* une zone ;
* une intervention ;
* une personne ;
* une photo ;
* une dépense ;
* un matériau ;
* un point de validation.

---

### 4. Heures

L’écran Heures affiche les prestations.

Vues nécessaires :

* par personne ;
* par intervention ;
* par zone ;
* par phase ;
* par période ;
* par statut financier.

Calculs automatiques :

* durée par ligne ;
* total par personne ;
* total par intervention ;
* total par phase ;
* total chantier ;
* montant au taux horaire.

Taux par défaut :

* 45€/h, modifiable.

---

### 5. Matériaux

Le module Matériaux ne doit pas être un stock complexe.

Il est organisé en statuts simples :

* à acheter ;
* acheté ;
* sur chantier ;
* utilisé ;
* à vérifier.

Chaque matériau peut contenir :

* nom ;
* catégorie ;
* quantité ;
* unité ;
* fournisseur ;
* coût estimé ;
* coût réel ;
* statut ;
* zone ;
* intervention liée ;
* dépense liée ;
* photo éventuelle.

Exemples de matériaux :

* protection sol ;
* vis ;
* disques béton ;
* ciment ;
* bois de coffrage ;
* mortier ;
* béton ;
* acier ;
* cornière ;
* plat soudé ;
* sacs gravats ;
* gants ;
* consommables.

---

### 6. Dépenses

L’écran Dépenses permet d’encoder les marchandises et factures.

Champs :

* fournisseur ;
* description ;
* montant ;
* date ;
* statut : à payer / payé / à refacturer / refacturé / à vérifier ;
* lié à une intervention ;
* lié à un matériau ;
* photo du ticket ou de la facture ;
* commentaire.

Exemples :

* Lovemat — protection sols — 46,45€ ;
* Art Service Valens — marchandise — 37,90€ ;
* Colruyt — boissons — 127,85€.

---

### 7. Coûts

L’écran Coûts affiche une synthèse financière.

Sections :

* main-d’œuvre ;
* matériaux ;
* dépenses ;
* suppléments ;
* à payer ;
* à facturer ;
* payé ;
* à vérifier.

Filtres :

* par phase ;
* par zone ;
* par personne ;
* par intervention ;
* par statut.

Objectif :

Permettre de préparer plus facilement les devis, factures, décomptes et calculs internes.

---

### 8. Photos / Plans

L’écran Photos / Plans permet de garder une trace visuelle.

Photos :

* par date ;
* par zone ;
* par intervention ;
* par type.

Types de photos :

* avant ;
* pendant ;
* après ;
* problème ;
* preuve ;
* matériau ;
* déchet ;
* plan ;
* ticket / facture.

Plans :

* haut rez-de-chaussée ;
* haut sous-sol ;
* coupes ;
* plan simplifié mobile plus tard.

---

## Fonctionnalités à ne pas faire en V1

* création de plusieurs chantiers dans l’interface ;
* gestion client complète ;
* facturation officielle ;
* TVA ;
* signature ;
* paiement ;
* planning Gantt ;
* multi-société ;
* rôles complexes ;
* portail client ;
* automatisations avancées ;
* OCR obligatoire ;
* analyse IA avancée.

## Fonctionnalités possibles en V1.5 ou V2

* export PDF ;
* export CSV / Excel ;
* résumé hebdomadaire ;
* génération de message pour Martin ;
* plan mobile cliquable ;
* alertes sur données manquantes ;
* comparaison prévu / réel ;
* analyse des suppléments ;
* OCR ticket / facture ;
* dashboard rentabilité.
