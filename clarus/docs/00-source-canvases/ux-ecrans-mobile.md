# Canvas 4 — UX / écrans mobile

## Objectif du canvas

Ce document définit l’expérience utilisateur mobile de l’application **Clarus Chantier — Sparrenlaan**.

L’objectif est de créer une app simple, rapide et utilisable sur chantier, même par des personnes qui ne veulent pas passer du temps à encoder des données.

L’app doit permettre de saisir une information plus vite que dans Notes, tout en reliant correctement les données : intervention, zone, phase, heures, coûts, matériaux, photos, tâches et statuts.

## Principe UX principal

L’utilisateur ne doit pas avoir l’impression de remplir une base de données.

Il doit avoir l’impression de répondre à quelques questions simples :

1. Qu’est-ce qui a été fait ?
2. Où ?
3. Par qui ?
4. Quand ?
5. Est-ce que ça coûte quelque chose ?
6. Est-ce qu’il faut suivre quelque chose ?

## Règles générales d’interface

### 1. Mobile-first

L’app est pensée principalement pour smartphone.

Les écrans doivent être simples, lisibles et utilisables rapidement sur chantier.

### 2. Gros boutons

Les actions principales doivent être visibles sous forme de gros boutons.

Exemples :

* Ajouter intervention
* Ajouter dépense
* Ajouter matériau
* Ajouter photo
* Ajouter tâche
* Voir coûts

### 3. Moins de saisie texte possible

L’utilisateur ne doit pas réécrire à chaque fois :

* Hubert ;
* Chris ;
* Bartosz ;
* 8h00 → 18h30 ;
* 45€/h ;
* démolition ;
* Sparrenlaan.

Ces éléments doivent être proposés automatiquement.

### 4. Préremplissage intelligent

L’app doit proposer des valeurs par défaut :

* chantier : Sparrenlaan ;
* taux horaire : 45€/h ;
* date : aujourd’hui ;
* statut : à vérifier ;
* personnes favorites : Hubert, Chris, Bartosz, Grégory ;
* horaires fréquents ;
* zones fréquentes ;
* phases selon le type d’intervention.

### 5. Accepter le flou

Sur chantier, toutes les informations ne sont pas toujours disponibles.

L’app doit donc permettre d’enregistrer une intervention même si certains éléments sont incertains.

Statuts utiles :

* à vérifier ;
* à compléter ;
* à classer ;
* à confirmer ;
* à facturer ;
* payé.

### 6. Toujours relier les données

Même si l’utilisateur saisit peu d’informations, l’app doit essayer de lier l’élément à :

* une zone ;
* une phase ;
* une intervention ;
* une date ;
* un statut.

## Navigation principale

La navigation mobile peut être organisée en 5 onglets principaux.

### Onglet 1 — Aujourd’hui

Écran d’accueil opérationnel.

Objectif : encoder rapidement ce qui se passe aujourd’hui.

Contenu :

* nom du chantier ;
* date du jour ;
* bouton principal : Ajouter intervention ;
* personnes déjà encodées aujourd’hui ;
* interventions du jour ;
* tâches urgentes ;
* matériaux à acheter ;
* points à confirmer ;
* alertes de données manquantes.

Actions rapides :

* Ajouter intervention ;
* Ajouter photo ;
* Ajouter dépense ;
* Ajouter tâche ;
* Ajouter matériau à acheter.

### Onglet 2 — Étapes

Objectif : suivre le chantier phase par phase.

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

Chaque phase affiche :

* tâches à faire ;
* tâches en cours ;
* tâches bloquées ;
* tâches terminées ;
* interventions liées ;
* coût estimé / réel si disponible ;
* photos liées ;
* matériaux liés.

### Onglet 3 — Coûts

Objectif : comprendre le coût réel du chantier.

Sections :

* main-d’œuvre ;
* matériaux ;
* dépenses ;
* suppléments ;
* à facturer ;
* encore à payer ;
* à vérifier.

Filtres :

* par phase ;
* par zone ;
* par personne ;
* par type ;
* par statut.

### Onglet 4 — Matériaux

Objectif : suivre ce qu’il faut acheter, ce qui est acheté, ce qui est sur chantier et ce qui est utilisé.

Statuts :

* à acheter ;
* acheté ;
* sur chantier ;
* utilisé ;
* à vérifier.

Actions rapides :

* Ajouter besoin ;
* Ajouter achat ;
* Marquer comme sur chantier ;
* Marquer comme utilisé ;
* Lier à une intervention ;
* Lier à une dépense.

### Onglet 5 — Photos / Plans

Objectif : garder une trace visuelle utile.

Sections :

* photos du jour ;
* photos par zone ;
* photos par intervention ;
* photos avant / pendant / après ;
* tickets / factures ;
* plans du chantier ;
* zones du plan.

Types de photos :

* avant ;
* pendant ;
* après ;
* preuve ;
* problème ;
* matériau ;
* déchet ;
* plan ;
* facture / ticket.

## Écran d’accueil : Aujourd’hui

### Objectif

L’écran d’accueil doit permettre de comprendre rapidement l’état du jour et d’ajouter une information en quelques secondes.

### Structure recommandée

Titre :

**Sparrenlaan**

Sous-titre :

**Aujourd’hui — [date]**

Carte principale :

**Ajouter une intervention**

Boutons rapides :

* Travail réalisé
* Heures
* Dépense
* Matériau
* Photo
* Tâche
* Point à confirmer

Résumé du jour :

* interventions encodées aujourd’hui ;
* personnes présentes ;
* total heures du jour ;
* coûts du jour ;
* photos ajoutées ;
* tâches créées.

Alertes :

* heures sans zone ;
* dépense sans montant ;
* intervention à vérifier ;
* supplément non marqué payé/facturé ;
* matériau demandé mais pas acheté ;
* point à confirmer avec Martin.

## Écran central : Ajouter intervention

### Objectif

Cet écran est le cœur de l’app.

Il doit permettre d’encoder une intervention plus vite qu’une note manuelle.

### Étape 1 — Quoi ?

Question affichée :

**Qu’est-ce qui a été fait ?**

Boutons rapides :

* Démolition
* Évacuation
* Protection
* Démontage
* Structure
* Préparation
* Nettoyage
* Mesures / plans
* Achat
* Matériau utilisé
* Point à confirmer
* Autre

Champ optionnel :

**Titre ou précision**

Exemples :

* Démolition béton de sol
* Démolition garage semelle béton
* Protection sols escalier + premier étage
* Démontage meuble chambre
* Démolition béton extérieur + évacuation

### Étape 2 — Où ?

Question affichée :

**Dans quelle zone ?**

Boutons zones simples :

* Garage
* Sol béton
* Extérieur
* Extension arrière
* Structure
* Sous-sol
* Escalier / premier étage
* Terrasse
* Toiture verte
* Conteneur / déchets
* Stockage matériaux
* Maison existante
* À définir

Option avancée :

**Ajouter une référence technique**

Exemples :

* P1.7 — 2x IPE360
* P1.8 — UPN350
* P1.5 — HEA140
* Coupe AA
* Coupe BB
* Coupe CC

### Étape 3 — Qui ?

Question affichée :

**Qui est concerné ?**

Boutons personnes :

* Hubert
* Chris
* Bartosz
* Grégory
* Autre

Fonction importante :

**Appliquer les mêmes horaires à toutes les personnes sélectionnées**

### Étape 4 — Quand ?

Question affichée :

**Quels horaires ?**

Valeurs rapides :

* 8h00 → 16h30
* 8h00 → 18h00
* 8h00 → 18h30
* 9h00 → 18h00
* 9h30 → 14h30
* 12h00 → 16h30
* Autre

Champs :

* date ;
* heure début ;
* heure fin ;
* pause ;
* nombre de jours ;
* taux horaire.

Valeurs par défaut :

* date : aujourd’hui ;
* pause : 0 minute ou à définir ;
* taux horaire : 45€/h ;
* nombre de jours : 1.

Option :

**Horaires différents par personne**

Exemple :

* Hubert : 9h00 → 18h00
* Bartosz : 8h00 → 18h00
* Chris : 12h00 → 15h00

### Étape 5 — Détails

Question affichée :

**Quel détail ajouter ?**

Champ court :

* note libre ;
* commentaire ;
* précision ;
* matériel utilisé ;
* problème rencontré.

Exemples :

* Conteneur presque plein.
* À confirmer avec Martin.
* Manque disques béton.
* Protection sol posée à l’étage.
* Démolition terminée.

### Étape 6 — Liens utiles

L’utilisateur peut ajouter directement :

* photo ;
* matériau utilisé ;
* matériau à acheter ;
* dépense ;
* tâche à suivre ;
* point à confirmer ;
* statut supplément.

### Étape 7 — Statut financier

Question affichée :

**C’est à facturer ou à suivre ?**

Choix rapides :

* inclus chantier ;
* supplément ;
* à vérifier ;
* à facturer ;
* facturé ;
* payé ;
* non concerné.

Par défaut :

* à vérifier.

### Étape 8 — Résumé avant validation

Avant de valider, l’app affiche un résumé automatique.

Exemple :

**Démolition béton de sol**

* Zone : Sol béton
* Phase : Démolition
* Hubert : 21h — 945€
* Chris : 21h — 945€
* Total : 42h — 1 890€
* Statut : supplément à vérifier

Boutons :

* Corriger
* Valider
* Valider + ajouter photo
* Valider + ajouter dépense

## Exemple de flow rapide

### Cas : démolition béton de sol 2 jours x 2 hommes

L’utilisateur clique sur :

**Ajouter intervention**

Puis :

* Type : Démolition
* Zone : Sol béton
* Personnes : Hubert + Chris
* Horaire : 8h00 → 18h30
* Nombre de jours : 2
* Taux : 45€/h
* Statut : supplément à vérifier

Résultat :

* Hubert : 21h
* Chris : 21h
* Total : 42h
* Montant : 1 890€

L’utilisateur valide.

L’intervention alimente automatiquement :

* Heures ;
* Coûts ;
* Phase démolition ;
* Zone sol béton ;
* Suppléments ;
* Futur export.

## Écran : Ajouter dépense

### Objectif

Encoder rapidement une facture, un ticket ou une marchandise.

### Champs

* fournisseur ;
* montant ;
* description ;
* date ;
* statut ;
* lié à une intervention ;
* lié à un matériau ;
* photo ticket/facture ;
* à refacturer : oui / non / à vérifier.

### Fournisseurs rapides

* Lovemat
* Colruyt
* Art Service Valens
* Autre

### Statuts

* à payer ;
* payé ;
* à refacturer ;
* refacturé ;
* à vérifier.

### Exemple

Fournisseur : Lovemat
Description : protection sols
Montant : 46,45€
Lié à : Protection sols escalier + premier étage
Statut : à vérifier

## Écran : Ajouter matériau

### Objectif

Suivre les besoins et les mouvements de matériaux sans créer un stock compliqué.

### Choix initial

**Que veux-tu faire ?**

* Ajouter un matériau à acheter
* Marquer un matériau comme acheté
* Marquer un matériau comme sur chantier
* Marquer un matériau comme utilisé

### Champs

* matériau ;
* quantité ;
* unité ;
* statut ;
* fournisseur ;
* coût ;
* zone ;
* intervention liée ;
* note.

### Statuts

* à acheter ;
* acheté ;
* sur chantier ;
* utilisé ;
* à vérifier.

### Exemple

Matériau : disques béton
Quantité : 5
Statut : à acheter
Zone : Démolition / sol béton
Priorité : urgent

## Écran : Ajouter tâche

### Objectif

Créer une tâche claire à suivre.

### Champs

* titre ;
* phase ;
* zone ;
* responsable ;
* statut ;
* priorité ;
* date prévue ;
* intervention liée ;
* note.

### Statuts

* à faire ;
* en cours ;
* bloqué ;
* terminé ;
* à vérifier.

### Exemples

* Demander confirmation à Martin pour la zone structure.
* Prévoir enlèvement du conteneur.
* Acheter disques béton.
* Prendre photos avant fermeture.
* Vérifier cote sur plan.

## Écran : Ajouter photo

### Objectif

Classer les photos directement au bon endroit.

### Champs

* photo ;
* zone ;
* intervention liée ;
* type ;
* commentaire ;
* date.

### Types

* avant ;
* pendant ;
* après ;
* preuve ;
* problème ;
* matériau ;
* déchet ;
* plan ;
* ticket / facture.

### Règle UX

Après avoir pris une photo, l’app doit proposer :

* lier à l’intervention du jour ;
* choisir une zone ;
* choisir un type ;
* ajouter commentaire optionnel.

## Écran : Étapes

### Objectif

Donner une vision structurée du chantier.

### Affichage recommandé

Liste de phases avec barre de progression simple.

Exemple :

**Démolition**

* 4 tâches terminées
* 1 tâche en cours
* 1 tâche bloquée
* 76h encodées
* 3 420€ de main-d’œuvre
* 18 photos

En cliquant sur une phase :

* tâches ;
* interventions ;
* coûts ;
* matériaux ;
* photos ;
* points à confirmer.

## Écran : Coûts

### Objectif

Comprendre le coût réel du chantier.

### Cartes principales

* Total main-d’œuvre
* Total matériaux
* Total dépenses
* Total suppléments
* Total à payer
* Total à facturer
* Total à vérifier

### Filtres

* phase ;
* zone ;
* personne ;
* statut ;
* période ;
* supplément oui/non.

### Vues utiles

* coût par phase ;
* coût par zone ;
* coût par personne ;
* coût par intervention ;
* coût des matériaux ;
* coûts à vérifier.

## Écran : Plans / zones

### Objectif

Utiliser les plans comme support de classement, pas comme outil technique complexe.

### V1

Liste de zones cliquables :

* Garage
* Sol béton
* Extérieur
* Extension arrière
* Structure
* Sous-sol
* Escalier / premier étage
* Terrasse
* Toiture verte
* Conteneur / déchets
* Stockage matériaux
* Maison existante

Chaque zone affiche :

* interventions ;
* tâches ;
* photos ;
* heures ;
* coûts ;
* matériaux ;
* points à confirmer.

### V1.5

Plan simplifié mobile avec zones cliquables.

## Comportement intelligent souhaité

### Suggestions automatiques

Si l’utilisateur choisit :

**Démolition + Sol béton**

L’app suggère :

* phase : Démolition ;
* matériaux possibles : disques béton, sacs gravats, conteneur ;
* photos utiles : avant / après ;
* statut financier : à vérifier ;
* type de coût : main-d’œuvre.

Si l’utilisateur choisit :

**Protection + Escalier / premier étage**

L’app suggère :

* phase : Protection ;
* matériau possible : protection sols ;
* fournisseur possible : Lovemat ;
* statut : à vérifier.

Si l’utilisateur choisit :

**Structure**

L’app suggère :

* point de validation ;
* photo preuve ;
* zone technique ;
* statut : à confirmer ;
* personne à contacter : Martin.

## Gestion des données incomplètes

L’app doit accepter une intervention incomplète, mais elle doit la signaler ensuite.

### Exemples d’alertes

* Intervention sans zone.
* Heure sans personne.
* Dépense sans montant.
* Photo sans type.
* Matériau acheté sans coût.
* Supplément sans statut.
* Point à confirmer sans responsable.
* Intervention sans phase.

Ces alertes apparaissent sur l’accueil dans une section :

**À vérifier**

## Ton général de l’app

L’app doit utiliser un langage simple.

À éviter :

* “Créer un enregistrement”
* “Associer une entité”
* “Paramétrage avancé”
* “Ressource”
* “Objet métier”

À préférer :

* “Ajouter intervention”
* “Où ?”
* “Qui ?”
* “Quand ?”
* “À facturer ?”
* “Ajouter photo”
* “À vérifier”
* “Encore à payer”
* “Matériel à acheter”

## Priorité UX absolue

L’écran **Ajouter intervention** doit être le plus fluide possible.

C’est l’écran qui décidera si l’app est utilisée ou abandonnée.

Il doit permettre en moins de 30 secondes de créer une intervention simple avec :

* type ;
* zone ;
* personnes ;
* horaires ;
* statut ;
* résumé calculé.

## Critère de réussite

L’app réussit si Hubert, Chris ou Grégory peuvent encoder une intervention plus vite que dans Notes, tout en créant des données exploitables pour :

* les heures ;
* les coûts ;
* les matériaux ;
* les suppléments ;
* les photos ;
* les tâches ;
* le futur décompte ou facture.
