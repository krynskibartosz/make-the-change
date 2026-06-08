# Canvas 3 — Modèle de données & relations

## Principe général

La valeur de l’application vient de la qualité des liens entre les données.

L’objectif n’est pas seulement d’enregistrer des notes, mais de créer des données exploitables.

Chaque information doit pouvoir être reliée à :

* une intervention ;
* une zone ;
* une phase ;
* une date ;
* un coût potentiel ;
* un statut.

## Objet central : l’intervention

L’objet principal de l’application est l’intervention.

Une intervention représente quelque chose qui s’est passé ou doit se passer sur le chantier.

Exemples :

* démolition garage semelle béton ;
* démolition béton de sol ;
* démolition béton extérieur + évacuation ;
* protection des sols escalier + premier étage ;
* achat Lovemat protection sols ;
* point à confirmer avec Martin ;
* photo avant démolition ;
* matériau à acheter ;
* conteneur presque plein.

## Schéma mental

CHANTIER UNIQUE
→ PHASES
→ ZONES
→ INTERVENTIONS
→ HEURES / MATÉRIAUX / DÉPENSES / PHOTOS / TÂCHES / DÉCISIONS

## Table : project

Même si l’interface ne montre qu’un seul chantier, la base peut garder une table chantier.

Champs :

* id
* name
* address
* description
* start_date
* status
* notes

Valeur V1 :

* Sparrenlaan
* Sparrenlaan n°35, 3090 Overijse
* Transformation d’une maison unifamiliale

## Table : phases

Champs :

* id
* name
* order
* description

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

## Table : zones

Champs :

* id
* name
* type
* description
* parent_zone_id
* technical_code
* plan_reference

Zones simples :

* Maison existante
* Garage
* Sol béton
* Extérieur
* Extension arrière
* Sous-sol
* Structure
* Escalier / premier étage
* Terrasse
* Toiture verte
* Zone conteneur / déchets
* Stockage matériaux

Zones techniques optionnelles :

* P1.7 — 2x IPE360
* P1.8 — UPN350
* P1.5 — HEA140
* P1.6 — L180x180/13mm
* P1.13 — HEA140
* P1.15 — HEA140
* C0.1 — 80x80 e=5mm
* C0.3 — Ø100/5mm
* Coupe AA
* Coupe BB
* Coupe CC

## Table : people

Champs :

* id
* name
* role
* default_hourly_rate
* active

Personnes V1 :

* Hubert
* Chris
* Bartosz
* Grégory
* Autre

## Table centrale : interventions

Champs :

* id
* project_id
* title
* description
* type
* date
* phase_id
* zone_id
* status
* is_extra
* billing_status
* payment_status
* created_by
* source_note
* created_at
* updated_at

Types possibles :

* work
* demolition
* evacuation
* protection
* dismantling
* structure
* preparation
* material_need
* material_use
* expense
* task
* decision
* photo
* extra
* other

Statuts généraux :

* draft
* to_check
* in_progress
* done
* blocked
* cancelled

Statuts de facturation :

* not_billable
* to_check
* to_invoice
* invoiced
* paid

Statuts de paiement :

* not_applicable
* to_pay
* paid
* partially_paid
* to_check

## Table : work_entries

Pour les heures.

Champs :

* id
* intervention_id
* person_id
* date
* start_time
* end_time
* break_minutes
* duration_minutes
* hourly_rate
* amount
* notes

Règle :

Le montant est calculé automatiquement :

duration_minutes / 60 × hourly_rate

## Table : tasks

Pour les choses à faire.

Champs :

* id
* project_id
* intervention_id
* phase_id
* zone_id
* title
* description
* status
* priority
* assigned_to
* due_date
* created_at

Statuts :

* to_do
* in_progress
* blocked
* done
* to_check

Priorités :

* low
* normal
* high
* urgent

## Table : materials

Catalogue simple de matériaux.

Champs :

* id
* name
* category
* default_unit
* notes

Exemples :

* Protection sols
* Disques béton
* Ciment
* Bois coffrage
* Visserie
* Mortier
* Béton
* Acier
* Cornière
* Plat soudé
* Sacs gravats
* Gants

## Table : material_movements

Pour suivre les besoins, achats, stock chantier et utilisations.

Champs :

* id
* material_id
* intervention_id
* zone_id
* phase_id
* type
* quantity
* unit
* estimated_cost
* real_cost
* supplier
* status
* notes
* created_at

Types :

* needed
* purchased
* on_site
* used
* returned
* wasted

Statuts :

* to_buy
* bought
* on_site
* used
* missing
* to_check

## Table : expenses

Pour les factures, tickets et achats.

Champs :

* id
* project_id
* intervention_id
* material_movement_id
* supplier
* description
* amount
* date
* status
* is_rebillable
* receipt_photo_id
* notes

Statuts :

* to_pay
* paid
* to_rebill
* rebilled
* to_check

## Table : photos

Champs :

* id
* project_id
* intervention_id
* zone_id
* phase_id
* type
* url
* comment
* taken_at
* uploaded_by

Types :

* before
* during
* after
* problem
* proof
* material
* waste
* plan
* receipt
* other

## Table : decisions

Pour les validations et points à demander.

Champs :

* id
* project_id
* intervention_id
* zone_id
* title
* description
* requested_to
* validated_by
* status
* decision_date
* proof_photo_id
* notes

Statuts :

* to_ask
* waiting
* confirmed_oral
* confirmed_written
* refused
* cancelled
* to_check

## Table : cost_items

Optionnelle, pour consolider les coûts.

Champs :

* id
* project_id
* intervention_id
* type
* title
* amount
* status
* notes

Types :

* labor
* material
* expense
* extra
* waste
* machine
* other

## Règles de liaison

Chaque intervention doit avoir au minimum :

* un titre ;
* un type ;
* une date ;
* une phase ;
* une zone ;
* un statut.

Chaque heure doit être liée à :

* une intervention ;
* une personne ;
* une date.

Chaque dépense doit être liée idéalement à :

* une intervention ;
* un matériau ou une zone ;
* un statut financier.

Chaque photo doit être liée idéalement à :

* une intervention ;
* une zone ;
* un type.

Chaque matériau utilisé doit être lié idéalement à :

* une intervention ;
* une zone ;
* une phase.

## Données orphelines à éviter

À éviter :

* photo sans zone ;
* dépense sans statut ;
* heure sans intervention ;
* matériau sans état ;
* tâche sans phase ;
* supplément sans statut financier ;
* décision sans responsable.

## Statut “à vérifier”

Pour ne pas bloquer la saisie terrain, l’application doit accepter les informations incomplètes.

Quand une donnée manque, elle peut être enregistrée avec le statut :

* à vérifier ;
* à classer ;
* à compléter.

L’accueil peut ensuite afficher les éléments incomplets.
