# Canvas 6 — Backlog évolutif

## Objectif du canvas

Ce document organise les fonctionnalités de l’application **Clarus Chantier — Sparrenlaan** par étapes de développement.

L’objectif est d’éviter de vouloir tout construire dès le début, tout en gardant une vision claire de l’évolution possible de l’app.

Le backlog est organisé en versions :

* V0 — Prototype rapide
* V1 — Version terrain utilisable
* V1.5 — Améliorations pratiques
* V2 — Analyse, exports et suivi avancé
* V3 — Intelligence, optimisation et généralisation
* Plus tard — Potentiel multi-chantiers / SaaS

## Principe général

L’application doit commencer très simple, mais être structurée correctement dès le départ.

Le but n’est pas d’ajouter beaucoup de fonctionnalités au début.

Le but est de créer une base solide où chaque donnée est correctement liée :

* intervention ;
* zone ;
* phase ;
* personne ;
* heures ;
* matériaux ;
* dépenses ;
* photos ;
* tâches ;
* coûts ;
* statut.

## Critère de priorité

Une fonctionnalité est prioritaire si elle répond à au moins une de ces questions :

1. Est-ce que ça remplace une note manuelle actuelle ?
2. Est-ce que ça évite une erreur de calcul ?
3. Est-ce que ça permet de retrouver une information importante ?
4. Est-ce que ça aide à préparer un décompte, devis ou facture ?
5. Est-ce que ça aide à comprendre le coût réel du chantier ?
6. Est-ce que ça simplifie la vie de Hubert, Chris ou Grégory sur le terrain ?

Si la réponse est non, la fonctionnalité peut attendre.

---

# V0 — Prototype rapide

## Objectif

Tester rapidement si l’app peut remplacer leur prise de notes actuelle.

Cette version peut être simple, pas parfaite visuellement, mais elle doit permettre d’encoder des interventions et de calculer les heures.

## Fonctionnalités V0

### 1. Chantier unique préconfiguré

L’app s’ouvre directement sur :

**Sparrenlaan**

Il n’y a pas de création de chantier dans l’interface.

### 2. Personnes préconfigurées

Personnes disponibles :

* Hubert ;
* Chris ;
* Bartosz ;
* Grégory ;
* Autre.

Chaque personne peut avoir un taux horaire par défaut.

Taux par défaut :

* 45€/h.

### 3. Ajouter intervention simple

L’utilisateur peut encoder :

* titre ;
* type ;
* zone ;
* phase ;
* date ;
* personnes ;
* horaires ;
* nombre de jours ;
* taux horaire ;
* statut ;
* supplément oui / non / à vérifier.

### 4. Calcul automatique des heures

L’app calcule :

* durée par personne ;
* total intervention ;
* total main-d’œuvre ;
* montant par personne ;
* montant total.

### 5. Liste des interventions

Afficher toutes les interventions encodées.

Chaque intervention affiche :

* titre ;
* zone ;
* phase ;
* personnes ;
* heures ;
* montant ;
* statut.

### 6. Vue heures

Afficher :

* total par personne ;
* total général ;
* montant total main-d’œuvre.

### 7. Vue coûts simple

Afficher :

* total main-d’œuvre ;
* total à vérifier ;
* total supplément ;
* total payé / non payé si disponible.

## Exemples de données test V0

### Intervention 1

Démolition garage semelle béton
Zone : Garage
Phase : Démolition
Hubert : 9h30 → 14h30
Total : 5h
Montant : 225€
Statut : encore à payer

### Intervention 2

Démolition béton de sol
Zone : Sol béton
Phase : Démolition
Hubert + Chris
8h00 → 18h30
2 jours
Total : 42h
Montant : 1 890€
Statut : encore à payer

### Intervention 3

Protection des sols escalier + premier étage
Zone : Escalier / premier étage
Phase : Protection
Hubert : 12h00 → 16h30
Bartosz : 12h00 → 15h00
Total : 7h30
Montant : 337,50€
Statut : à vérifier

## Ce qui n’est pas dans V0

* photos ;
* matériaux ;
* dépenses ;
* plans ;
* IA ;
* export PDF ;
* création de chantier ;
* authentification complexe ;
* facturation.

## Critère de réussite V0

L’app est utile si elle permet d’encoder une intervention plus vite que dans Notes et de calculer automatiquement les heures et montants.

---

# V1 — Version terrain utilisable

## Objectif

Créer une version réellement utilisable sur le chantier, capable de suivre les interventions, les heures, les tâches, les matériaux, les dépenses, les photos et les coûts.

## Fonctionnalités V1

### 1. Accueil chantier

Afficher :

* chantier Sparrenlaan ;
* bouton Ajouter intervention ;
* total heures ;
* total main-d’œuvre ;
* tâches ouvertes ;
* matériaux à acheter ;
* coûts à vérifier ;
* derniers ajouts.

### 2. Ajouter intervention complet

Champs :

* type ;
* titre ;
* zone ;
* phase ;
* personnes ;
* horaires ;
* nombre de jours ;
* pause ;
* taux ;
* description ;
* statut ;
* supplément ;
* à facturer ;
* payé ;
* photos optionnelles ;
* matériaux optionnels ;
* tâche optionnelle ;
* dépense optionnelle.

### 3. Zones et phases

Pouvoir classer chaque intervention par :

Zones :

* Garage ;
* Sol béton ;
* Extérieur ;
* Extension arrière ;
* Structure ;
* Sous-sol ;
* Escalier / premier étage ;
* Terrasse ;
* Toiture verte ;
* Conteneur / déchets ;
* Stockage matériaux ;
* Maison existante ;
* À définir.

Phases :

* Préparation ;
* Protection ;
* Démolition ;
* Évacuation ;
* Contrôle / validations ;
* Structure ;
* Extension / construction ;
* Finitions ;
* Administratif / facturation.

### 4. Tâches

Créer et suivre des tâches.

Statuts :

* à faire ;
* en cours ;
* bloqué ;
* terminé ;
* à vérifier.

Champs :

* titre ;
* phase ;
* zone ;
* responsable ;
* priorité ;
* intervention liée ;
* date prévue ;
* note.

### 5. Matériaux

Gérer les matériaux selon les statuts :

* à acheter ;
* acheté ;
* sur chantier ;
* utilisé ;
* à vérifier.

Champs :

* nom ;
* quantité ;
* unité ;
* fournisseur ;
* coût ;
* zone ;
* intervention liée ;
* statut.

### 6. Dépenses

Encoder les dépenses / factures / marchandises.

Champs :

* fournisseur ;
* description ;
* montant ;
* date ;
* statut ;
* intervention liée ;
* matériau lié ;
* à refacturer ;
* photo ticket optionnelle.

Statuts :

* à payer ;
* payé ;
* à refacturer ;
* refacturé ;
* à vérifier.

### 7. Photos

Ajouter une photo liée à :

* intervention ;
* zone ;
* phase ;
* type.

Types :

* avant ;
* pendant ;
* après ;
* preuve ;
* problème ;
* matériau ;
* déchet ;
* plan ;
* ticket / facture.

### 8. Coûts

Synthèse des coûts :

* main-d’œuvre ;
* matériaux ;
* dépenses ;
* suppléments ;
* à payer ;
* à facturer ;
* à vérifier.

Filtres :

* par phase ;
* par zone ;
* par personne ;
* par statut ;
* par supplément.

### 9. Données à vérifier

Afficher une section :

**À vérifier**

Exemples :

* intervention sans date ;
* dépense sans montant ;
* matériau sans coût ;
* photo sans zone ;
* supplément sans statut ;
* heure sans zone ;
* point à confirmer non traité.

## Ce qui n’est pas encore obligatoire en V1

* export PDF complet ;
* IA avancée ;
* OCR ;
* plan cliquable ;
* facturation officielle ;
* multi-chantiers ;
* compte client ;
* planning Gantt.

## Critère de réussite V1

L’app est utilisée comme carnet de chantier principal pour Sparrenlaan et permet de retrouver clairement :

* ce qui a été fait ;
* par qui ;
* où ;
* combien d’heures ;
* quels coûts ;
* quels matériaux ;
* quels suppléments ;
* quelles tâches restent ouvertes.

---

# V1.5 — Améliorations pratiques

## Objectif

Améliorer le confort d’utilisation et commencer à automatiser certaines tâches répétitives.

## Fonctionnalités V1.5

### 1. Exports simples

Exporter :

* résumé des heures ;
* résumé des interventions ;
* résumé des dépenses ;
* résumé des suppléments ;
* résumé par phase ;
* résumé par zone.

Formats :

* PDF ;
* CSV ;
* Excel si nécessaire.

### 2. Rapport hebdomadaire

Générer un résumé de la semaine :

* interventions réalisées ;
* heures par personne ;
* coût main-d’œuvre ;
* matériaux achetés ;
* dépenses ;
* tâches terminées ;
* tâches ouvertes ;
* points à confirmer ;
* photos ajoutées.

### 3. Plan mobile simplifié

Créer une vue visuelle simple du chantier avec zones cliquables :

* Maison existante ;
* Extension arrière ;
* Garage ;
* Sol béton ;
* Extérieur ;
* Sous-sol ;
* Structure ;
* Terrasse ;
* Toiture verte ;
* Escalier / étage ;
* Conteneur ;
* Stockage matériaux.

Chaque zone affiche :

* interventions ;
* tâches ;
* photos ;
* coûts ;
* matériaux ;
* points à confirmer.

### 4. Suggestions automatiques

Si l’utilisateur choisit certains types, l’app propose des liens.

Exemples :

Démolition + Sol béton
→ suggérer phase Démolition, matériaux disques béton, conteneur, photos avant/après.

Protection + Escalier
→ suggérer phase Protection, matériau protection sols, fournisseur Lovemat.

Structure
→ suggérer point à confirmer, photo preuve, référence technique.

### 5. Templates d’intervention

Créer des modèles rapides :

* Démolition béton de sol ;
* Démolition garage ;
* Évacuation gravats ;
* Protection sols ;
* Démontage meuble ;
* Achat matériel ;
* Conteneur presque plein.

### 6. Messages rapides

Générer ou préparer des messages simples :

* message pour Martin ;
* message interne ;
* rappel à vérifier ;
* résumé de point bloquant.

Exemple :

“Salut Martin, petite confirmation : pour la zone structure / P1.7, tu confirmes qu’on peut continuer comme vu sur place ?”

### 7. Amélioration photos

* ajout multiple ;
* classement rapide ;
* galerie par zone ;
* galerie par phase ;
* photos avant / après.

## Critère de réussite V1.5

L’app commence à faire gagner du temps, pas seulement à structurer les données.

---

# V2 — Analyse, exports et suivi avancé

## Objectif

Transformer l’app en véritable outil de suivi du coût réel du chantier.

## Fonctionnalités V2

### 1. Prévu vs réel

Comparer :

* heures prévues vs heures réelles ;
* matériaux prévus vs matériaux réels ;
* coûts prévus vs coûts réels ;
* suppléments prévus vs imprévus.

### 2. Analyse par phase

Afficher les coûts par phase :

* préparation ;
* protection ;
* démolition ;
* évacuation ;
* structure ;
* extension ;
* finitions ;
* administratif.

### 3. Analyse par zone

Afficher les coûts par zone :

* garage ;
* sol béton ;
* extérieur ;
* extension ;
* structure ;
* sous-sol ;
* terrasse ;
* toiture verte.

### 4. Gestion avancée des suppléments

Pour chaque supplément :

* description ;
* justification ;
* heures ;
* matériaux ;
* dépenses ;
* photos ;
* statut validation ;
* statut facturation ;
* statut paiement ;
* export possible.

### 5. Préparation devis / facture

L’app ne doit pas forcément facturer officiellement, mais peut préparer :

* lignes de prestation ;
* heures ;
* marchandises ;
* suppléments ;
* montants ;
* justificatifs.

Export :

* PDF ;
* Excel ;
* copier-coller structuré pour facture/devis.

### 6. Dashboard coût réel

Afficher :

* total main-d’œuvre ;
* total matériaux ;
* total dépenses ;
* total suppléments ;
* total payé ;
* total à payer ;
* total à facturer ;
* total à vérifier ;
* marge ou rentabilité si données disponibles.

### 7. Alertes financières

Exemples :

* supplément sans statut ;
* dépense non liée ;
* tâche terminée sans photo ;
* matériau acheté mais non utilisé ;
* intervention coûteuse ;
* dépassement d’heures sur une phase.

### 8. Historique complet

Pouvoir consulter tout l’historique par :

* date ;
* personne ;
* zone ;
* phase ;
* statut ;
* type.

## Critère de réussite V2

L’app permet de comprendre précisément le coût réel du chantier et de préparer facilement les documents administratifs ou financiers.

---

# V3 — Intelligence, optimisation et automatisation

## Objectif

Ajouter de l’intelligence pour aider à analyser, résumer et optimiser le chantier.

## Fonctionnalités V3

### 1. Assistant IA chantier

L’utilisateur peut demander :

* Résume la semaine.
* Quels suppléments ne sont pas encore payés ?
* Qu’est-ce qui coûte le plus cher ?
* Quelles tâches sont bloquées ?
* Quelles dépenses ne sont pas liées ?
* Quelles photos manquent ?
* Qu’est-ce qu’il faut demander à Martin ?

### 2. Extraction depuis texte libre

Même si la V1 privilégie la saisie rapide, l’app peut accepter une note brute et l’analyser.

Exemple :

“Hubert Chris 8-18h30 démolition béton sol 2 jours”

L’app propose :

* personnes ;
* horaires ;
* tâche ;
* zone ;
* phase ;
* coût.

### 3. OCR tickets / factures

Photo d’un ticket ou d’une facture.

L’app extrait :

* fournisseur ;
* date ;
* montant ;
* TVA si nécessaire ;
* description ;
* catégorie ;
* statut.

### 4. Détection de données incohérentes

Exemples :

* Hubert a deux interventions qui se chevauchent ;
* intervention sans coût alors qu’elle devrait être facturable ;
* matériau acheté mais jamais utilisé ;
* supplément marqué payé mais pas facturé ;
* dépense marquée à refacturer mais non liée à un supplément.

### 5. Résumés automatiques

Générer :

* rapport du jour ;
* rapport semaine ;
* rapport par phase ;
* rapport par zone ;
* résumé pour Martin ;
* résumé interne Clarus ;
* résumé financier.

### 6. Optimisation future

L’app peut apprendre des anciens chantiers pour aider à :

* estimer le temps d’une tâche similaire ;
* mieux prévoir les matériaux ;
* repérer les postes coûteux ;
* améliorer les devis futurs.

## Critère de réussite V3

L’app ne se contente plus d’enregistrer les données. Elle aide à comprendre, décider et optimiser.

---

# Plus tard — Multi-chantiers / Clarus / SaaS

## Objectif

Si l’app est réellement utile sur Sparrenlaan, elle peut devenir un outil réutilisable.

## Évolution possible

### 1. Multi-chantiers Clarus

Ajouter la possibilité de gérer plusieurs chantiers internes.

Fonctionnalités :

* création chantier ;
* liste de chantiers ;
* clients ;
* intervenants ;
* modèles de phases ;
* modèles de zones ;
* historique par chantier.

### 2. Multi-utilisateurs

Rôles possibles :

* admin ;
* responsable chantier ;
* ouvrier ;
* comptable ;
* lecteur.

### 3. Modèles de chantier

Créer des templates :

* extension maison ;
* démolition ;
* rénovation intérieure ;
* toiture ;
* terrasse ;
* structure ;
* finition.

### 4. Généralisation SaaS

Transformer l’app en service utilisable par d’autres petites entreprises du bâtiment.

Fonctionnalités nécessaires :

* multi-entreprises ;
* abonnements ;
* gestion utilisateurs ;
* sécurité avancée ;
* sauvegardes ;
* facturation ;
* support ;
* onboarding.

## Attention

Cette étape ne doit pas influencer négativement la V1.

La V1 doit rester focalisée sur Sparrenlaan.

---

# Priorités globales

## Must-have

* chantier unique ;
* ajouter intervention ;
* personnes ;
* horaires ;
* calcul heures ;
* calcul montants ;
* zones ;
* phases ;
* statuts ;
* coûts simples ;
* tâches ;
* matériaux ;
* dépenses.

## Should-have

* photos liées ;
* exports simples ;
* données à vérifier ;
* résumé hebdomadaire ;
* templates d’intervention ;
* matériaux par statut.

## Could-have

* plan mobile simplifié ;
* messages Martin ;
* suggestions automatiques ;
* OCR ;
* assistant IA ;
* analyse prévu vs réel.

## Won’t-have pour le moment

* SaaS ;
* multi-chantiers visible ;
* facturation officielle ;
* paiement ;
* portail client ;
* Gantt complet ;
* ERP ;
* comptabilité TVA complète.

---

# Ordre recommandé de développement

## Étape 1

Créer la structure de base :

* project unique ;
* people ;
* phases ;
* zones ;
* interventions ;
* work_entries.

## Étape 2

Créer l’écran Ajouter intervention.

## Étape 3

Créer les calculs d’heures et de coûts.

## Étape 4

Créer les vues :

* interventions ;
* heures ;
* coûts.

## Étape 5

Ajouter :

* tâches ;
* matériaux ;
* dépenses.

## Étape 6

Ajouter :

* photos ;
* données à vérifier ;
* statuts plus fins.

## Étape 7

Ajouter :

* exports ;
* plan mobile ;
* suggestions ;
* IA.

---

# Risques à surveiller

## Risque 1 — Interface trop lourde

Si l’app demande trop de champs, elle ne sera pas utilisée.

Solution :

* boutons rapides ;
* champs préremplis ;
* statut “à vérifier” ;
* saisie en plusieurs étapes simples.

## Risque 2 — Données mal liées

Si les données ne sont pas liées, l’app perd sa valeur.

Solution :

* intervention comme noyau ;
* zone et phase obligatoires ou suggérées ;
* alertes données incomplètes.

## Risque 3 — Trop de fonctionnalités trop tôt

Si on ajoute tout dès le début, le projet devient trop lourd.

Solution :

* V0 très simple ;
* V1 terrain ;
* V2 analyse ;
* V3 intelligence.

## Risque 4 — L’utilisateur retourne dans Notes

Si l’app n’est pas plus rapide que Notes, elle échoue.

Solution :

* écran Ajouter intervention ultra rapide ;
* personnes favorites ;
* horaires fréquents ;
* calcul automatique ;
* templates.

## Risque 5 — Confusion entre suivi interne et facturation officielle

L’app peut aider à préparer les données, mais elle ne doit pas devenir une facturation officielle trop tôt.

Solution :

* statuts à vérifier ;
* export préparatoire ;
* validation humaine ;
* pas de facture officielle en V1.

---

# Critère final de réussite

L’app est réussie si elle devient le réflexe naturel sur le chantier :

* on ouvre l’app ;
* on ajoute une intervention ;
* les heures sont calculées ;
* les coûts sont mis à jour ;
* les matériaux et tâches sont suivis ;
* les données restent propres ;
* le décompte final devient beaucoup plus simple.
