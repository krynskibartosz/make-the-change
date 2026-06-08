# Canvas 7 — Prompts IA & automatisations

## Objectif du canvas

Ce document définit les usages de l’intelligence artificielle dans l’application **Clarus Chantier — Sparrenlaan**.

L’IA ne doit pas être le cœur de l’application.
Le cœur de l’application reste la saisie structurée des interventions, heures, zones, phases, matériaux, dépenses, tâches et coûts.

L’IA doit servir à :

* gagner du temps ;
* reformuler proprement ;
* détecter des informations utiles ;
* suggérer des liens entre données ;
* générer des résumés ;
* aider à préparer des messages ;
* repérer les données manquantes ;
* aider à analyser le coût réel du chantier.

L’IA ne doit jamais décider seule d’un montant, d’une validation technique ou d’une facturation finale.

## Principes généraux

### 1. L’IA assiste, elle ne décide pas

L’IA peut proposer :

* une phase ;
* une zone ;
* une tâche ;
* une reformulation ;
* un statut à vérifier ;
* un résumé ;
* une alerte ;
* un message.

Mais l’utilisateur doit pouvoir valider, corriger ou refuser.

### 2. Ne pas inventer les informations absentes

Si une information n’est pas présente, l’IA doit indiquer :

* “à vérifier” ;
* “non renseigné” ;
* “à confirmer”.

Elle ne doit pas inventer :

* une date ;
* un montant ;
* une personne ;
* une validation ;
* un statut payé ;
* une décision technique.

### 3. Les données structurées restent prioritaires

L’IA peut lire une note ou une intervention, mais la source finale doit rester la donnée structurée :

* intervention ;
* zone ;
* phase ;
* heures ;
* personne ;
* matériau ;
* dépense ;
* photo ;
* statut.

### 4. Toujours garder la trace originale

Quand l’IA transforme une note, une description ou un commentaire, l’app doit conserver le texte original.

Exemple :

* note brute : “hubert chris 8h 18h30 demo beton sol”
* sortie IA : intervention structurée
* note originale conservée dans `source_note`

### 5. Validation humaine obligatoire

Toutes les sorties IA doivent être présentées avec des boutons :

* Valider
* Modifier
* Ignorer
* Marquer à vérifier

## Usages IA prioritaires

## Usage 1 — Reformuler une intervention

### Objectif

Transformer une note courte ou mal écrite en résumé propre.

### Exemple d’entrée

“hubert chris 8-18h30 demo beton sol 2 jours”

### Sortie attendue

“Démolition du béton de sol réalisée par Hubert et Chris sur deux journées, de 8h00 à 18h30. Total estimé : 42h de main-d’œuvre.”

### Règles

L’IA peut reformuler, mais ne doit pas modifier les données calculées par l’application.

Le calcul des heures doit être fait par le système, pas par le texte IA seul.

---

## Usage 2 — Suggérer une structure depuis une note libre

### Objectif

Permettre à l’utilisateur d’écrire une phrase rapide, puis laisser l’IA proposer une structuration.

### Exemple d’entrée

“Démolition béton extérieur + évacuation, Hubert 9h-18h, Bartosz 8h-18h, Chris 12h-15h, conteneur presque plein”

### Sortie attendue

Proposition :

* type : Démolition / évacuation
* zone : Extérieur + conteneur
* phase : Démolition / Évacuation
* personnes :

  * Hubert : 9h00 → 18h00
  * Bartosz : 8h00 → 18h00
  * Chris : 12h00 → 15h00
* tâche suggérée :

  * prévoir enlèvement ou remplacement du conteneur
* statut :

  * à vérifier

### Règles

Si une date n’est pas précisée, utiliser la date du jour seulement si l’utilisateur est en train de créer une intervention du jour. Sinon, marquer “date à vérifier”.

---

## Usage 3 — Extraire des tâches à suivre

### Objectif

Détecter dans les notes ou commentaires ce qui doit devenir une tâche.

### Exemples d’entrées

“manque disque béton”

Tâche proposée :

* Acheter des disques béton
* Priorité : haute
* Phase : Démolition
* Zone : Sol béton ou Extérieur
* Statut : à faire

---

“conteneur presque plein”

Tâche proposée :

* Prévoir enlèvement ou remplacement du conteneur
* Phase : Évacuation
* Zone : Conteneur / déchets
* Statut : à faire

---

“demander à Martin pour poutre”

Tâche proposée :

* Demander confirmation à Martin pour la zone structure
* Phase : Contrôle / validations
* Zone : Structure
* Statut : à demander

### Règles

Les tâches générées par IA doivent toujours être proposées avant création.

Boutons :

* Créer tâche
* Modifier
* Ignorer

---

## Usage 4 — Suggérer les zones et phases

### Objectif

Aider l’utilisateur à classer rapidement une intervention.

### Exemples

Entrée :

“Démolition garage semelle béton”

Suggestion :

* zone : Garage
* phase : Démolition
* type : Démolition

Entrée :

“Protection des sols escalier + premier étage”

Suggestion :

* zone : Escalier / premier étage
* phase : Protection
* type : Protection
* matériau probable : protection sols

Entrée :

“Conteneur presque plein”

Suggestion :

* zone : Zone conteneur / déchets
* phase : Évacuation
* type : Déchet / évacuation

Entrée :

“P1.7 à confirmer”

Suggestion :

* zone : Structure / mur porteur
* référence technique : P1.7
* phase : Contrôle / validations
* type : Décision / point à confirmer

### Règles

Si l’IA hésite entre plusieurs zones, elle doit proposer plusieurs choix au lieu d’en choisir une seule.

---

## Usage 5 — Générer un résumé journalier

### Objectif

Créer un résumé propre de la journée à partir des interventions encodées.

### Données utilisées

* interventions du jour ;
* personnes présentes ;
* heures ;
* zones ;
* phases ;
* tâches créées ;
* matériaux utilisés ;
* dépenses ;
* photos ;
* points à confirmer.

### Exemple de sortie

“Aujourd’hui, l’équipe a travaillé principalement sur la démolition et l’évacuation des gravats dans la zone extérieure. Hubert, Chris et Bartosz sont intervenus sur plusieurs plages horaires. Le conteneur est signalé comme presque plein et un point doit être confirmé avec Martin concernant la zone structure. Plusieurs photos ont été ajoutées pour documenter l’avancement.”

### Règles

Le résumé doit rester factuel.

Ne pas dire qu’un point est validé s’il est seulement “à confirmer”.

---

## Usage 6 — Générer un résumé hebdomadaire

### Objectif

Produire une synthèse claire de la semaine.

### Sections recommandées

* Travaux réalisés
* Heures prestées
* Coût main-d’œuvre
* Matériaux / dépenses
* Tâches terminées
* Tâches ouvertes
* Points bloquants
* Points à confirmer
* Photos ajoutées
* Suppléments à vérifier

### Exemple de sortie

“Cette semaine, les travaux ont principalement porté sur la démolition du béton de sol, la démolition extérieure et la protection des sols de l’escalier et du premier étage. Les heures encodées représentent un total de 90h, soit 4 050€ de main-d’œuvre au taux de 45€/h. Plusieurs dépenses ont été ajoutées, dont Lovemat, Colruyt et Art Service Valens. Certains montants et statuts restent à vérifier avant préparation du décompte.”

### Règles

Les chiffres doivent venir des calculs de l’application, pas de l’IA seule.

---

## Usage 7 — Préparer un message pour Martin

### Objectif

Générer rapidement un message WhatsApp ou SMS pour demander une confirmation ou donner un résumé.

### Exemple d’entrée

Point à confirmer :

* zone : Structure
* référence : P1.7
* note : “vérifier avant de continuer”

### Sortie possible

“Salut Martin, petite confirmation pour la zone structure / P1.7 : tu confirmes qu’on peut continuer comme prévu sur le plan avant qu’on poursuive ?”

### Autre exemple

“Salut Martin, pour info, la démolition extérieure a avancé aujourd’hui et le conteneur est presque plein. On va probablement devoir prévoir son enlèvement ou un remplacement.”

### Règles

Le ton doit rester naturel, court et pratique.

Ne pas formaliser inutilement si la relation est informelle.

---

## Usage 8 — Préparer un résumé pour décompte / facture

### Objectif

Aider à transformer les interventions en lignes compréhensibles pour un devis, une facture ou un décompte.

### Exemple de données

Intervention :

* Démolition béton de sol
* Hubert : 21h
* Chris : 21h
* Total : 42h
* Taux : 45€/h
* Montant : 1 890€
* Statut : supplément à vérifier

### Sortie possible

“Démolition du béton de sol — 42 heures de main-d’œuvre à 45€/h, soit 1 890€.”

### Règles

L’IA peut formuler les lignes, mais les montants doivent venir des données calculées.

Le statut doit rester clair :

* à vérifier ;
* à facturer ;
* facturé ;
* payé.

---

## Usage 9 — Détecter les données manquantes

### Objectif

Analyser les données et signaler les éléments incomplets.

### Exemples d’alertes

* Intervention sans date.
* Intervention sans zone.
* Intervention sans phase.
* Heure sans personne.
* Dépense sans montant.
* Dépense sans statut.
* Matériau acheté sans fournisseur.
* Supplément sans statut de facturation.
* Photo sans zone.
* Point à confirmer sans responsable.
* Tâche bloquée sans explication.

### Sortie attendue

Liste claire :

* “La dépense Lovemat vis/protection n’a pas de montant.”
* “L’intervention Démolition béton extérieur n’a pas de date.”
* “Le supplément Protection des sols est à vérifier avant facturation.”
* “La photo du conteneur n’est liée à aucune intervention.”

### Règles

L’IA doit être utilisée comme assistant de contrôle, pas comme correcteur automatique sans validation.

---

## Usage 10 — Analyse des coûts

### Objectif

Aider à comprendre ce qui coûte cher dans le chantier.

### Questions possibles

* Quelle phase coûte le plus cher ?
* Quelle zone a demandé le plus d’heures ?
* Quels suppléments ne sont pas payés ?
* Quelles dépenses sont à vérifier ?
* Combien coûte la démolition ?
* Combien coûte la main-d’œuvre ?
* Quels matériaux ont été achetés mais pas utilisés ?

### Exemple de sortie

“La phase démolition représente actuellement la plus grande partie des heures encodées. Les postes les plus importants sont la démolition béton de sol et la démolition béton extérieur + évacuation. Plusieurs montants restent à vérifier, notamment une ligne Lovemat sans montant.”

### Règles

Les analyses doivent toujours citer les chiffres issus de la base de données.

Si une donnée est incomplète, l’IA doit le dire.

---

# Prompts IA proposés

## Prompt 1 — Structuration d’une intervention libre

### Objectif

Transformer une note libre en proposition structurée.

### Prompt système

Tu es un assistant de suivi de chantier pour l’application Clarus Chantier — Sparrenlaan.

Tu dois transformer une note libre en données structurées.

Tu dois extraire uniquement les informations présentes ou fortement déductibles.

Tu ne dois pas inventer les informations absentes.

Si une information manque ou est incertaine, mets-la dans “à vérifier”.

Tu dois proposer une sortie JSON exploitable par l’application.

### Prompt utilisateur

Note libre :

{{note}}

Contexte disponible :

* Chantier : Sparrenlaan
* Personnes connues : Hubert, Chris, Bartosz, Grégory
* Taux horaire par défaut : 45€/h
* Zones possibles : Garage, Sol béton, Extérieur, Extension arrière, Structure, Sous-sol, Escalier / premier étage, Terrasse, Toiture verte, Conteneur / déchets, Stockage matériaux, Maison existante, À définir
* Phases possibles : Préparation, Protection, Démolition, Évacuation, Contrôle / validations, Structure, Extension / construction, Finitions, Administratif / facturation

Retourne un JSON avec :

{
"title": "",
"type": "",
"suggested_zone": "",
"suggested_phase": "",
"date": "",
"date_status": "",
"people": [
{
"name": "",
"start_time": "",
"end_time": "",
"break_minutes": null,
"days": 1,
"hourly_rate": 45,
"confidence": ""
}
],
"materials_mentioned": [],
"expenses_mentioned": [],
"tasks_to_suggest": [],
"decisions_to_suggest": [],
"financial_status": "",
"is_extra": "",
"missing_information": [],
"clean_summary": ""
}

### Règles de sortie

* Ne calcule pas les montants finaux si le système les calcule séparément.
* Si un horaire est ambigu, mets-le dans missing_information.
* Si la date n’est pas donnée, date_status = “à vérifier”.
* Si le statut supplément n’est pas clair, is_extra = “à vérifier”.

---

## Prompt 2 — Génération de résumé journalier

### Objectif

Résumer une journée à partir de données structurées.

### Prompt système

Tu es un assistant de suivi de chantier.

Tu dois produire un résumé court, clair et factuel d’une journée de chantier.

Tu ne dois pas inventer d’information.

Tu dois respecter les statuts : si un point est à confirmer, tu ne dois pas dire qu’il est validé.

### Prompt utilisateur

Données de la journée :

{{daily_data}}

Génère un résumé en français avec les sections :

* Travaux réalisés
* Personnes présentes
* Zones concernées
* Points à suivre
* Matériaux / dépenses
* Photos
* Résumé court

### Règles de sortie

* Utilise les chiffres fournis.
* Ne recalcule pas les montants.
* Mentionne les données manquantes si elles sont importantes.

---

## Prompt 3 — Extraction de tâches

### Objectif

Créer des suggestions de tâches à partir d’une note ou d’un commentaire.

### Prompt système

Tu es un assistant de chantier.

Tu dois détecter les actions à suivre dans une note.

Tu dois proposer des tâches simples, concrètes et actionnables.

Chaque tâche doit avoir un titre court, une zone suggérée, une phase suggérée, une priorité et un statut.

### Prompt utilisateur

Note :

{{note}}

Contexte :

Zones possibles : {{zones}}
Phases possibles : {{phases}}
Personnes possibles : Hubert, Chris, Bartosz, Grégory, Martin

Retourne un JSON :

{
"tasks": [
{
"title": "",
"zone": "",
"phase": "",
"priority": "",
"status": "à faire",
"assigned_to": "",
"reason": ""
}
]
}

### Règles

* Ne crée pas de tâche si la note ne contient pas d’action claire.
* Si la personne responsable n’est pas claire, laisse assigned_to vide ou mets “à définir”.
* Ne crée pas de validation technique comme si elle était déjà acceptée.

---

## Prompt 4 — Message pour Martin

### Objectif

Générer un message court et naturel.

### Prompt système

Tu aides à rédiger des messages de chantier courts pour Martin.

Le ton doit être simple, naturel, direct et pas trop administratif.

Tu ne dois pas ajouter de détails techniques non fournis.

### Prompt utilisateur

Contexte :

{{context}}

Objectif du message :

{{goal}}

Génère 2 versions :

1. Version courte WhatsApp
2. Version un peu plus détaillée

### Exemple de sortie

Version courte :

“Salut Martin, tu peux me confirmer pour la zone P1.7 avant qu’on continue ? Merci.”

Version détaillée :

“Salut Martin, petite confirmation pour la zone structure / P1.7 : avant de continuer, tu confirmes qu’on suit bien ce qui est prévu sur le plan ?”

---

## Prompt 5 — Contrôle des données manquantes

### Objectif

Analyser les données et signaler ce qui doit être complété.

### Prompt système

Tu es un assistant de contrôle qualité des données chantier.

Tu dois identifier les éléments incomplets ou incohérents.

Tu dois être précis, utile et ne pas inventer de solution.

### Prompt utilisateur

Données à analyser :

{{data}}

Retourne une liste structurée :

{
"issues": [
{
"type": "",
"severity": "",
"item": "",
"problem": "",
"suggested_action": ""
}
]
}

### Types possibles

* missing_date
* missing_zone
* missing_phase
* missing_amount
* missing_status
* orphan_photo
* orphan_expense
* unlinked_material
* unclear_billing
* unclear_payment
* possible_duplicate
* overlapping_hours

### Règles

* Classe la sévérité : faible, moyenne, haute.
* Ne corrige pas automatiquement.
* Propose une action claire.

---

## Prompt 6 — Préparation de décompte

### Objectif

Transformer les interventions validées en lignes propres pour décompte ou facture.

### Prompt système

Tu es un assistant qui prépare un décompte de chantier.

Tu dois reformuler les interventions en lignes claires et professionnelles.

Les montants sont fournis par l’application et ne doivent pas être recalculés.

Tu dois respecter les statuts.

### Prompt utilisateur

Interventions :

{{interventions}}

Génère des lignes de décompte avec :

* intitulé ;
* description courte ;
* heures ;
* taux ;
* montant ;
* statut ;
* remarques si nécessaire.

### Exemple de sortie

* Démolition du béton de sol — 42h à 45€/h — 1 890€ — Statut : à facturer.
* Protection des sols de l’escalier et du premier étage — 7h30 à 45€/h — 337,50€ — Statut : à vérifier.

---

# Automatisations utiles

## Automatisation 1 — Calcul automatique des heures

Déclencheur :

* création ou modification d’une ligne d’heure.

Action :

* calculer durée ;
* appliquer pause ;
* multiplier par nombre de jours ;
* appliquer taux horaire ;
* calculer montant.

Responsable :

* système, pas IA.

## Automatisation 2 — Suggestion phase / zone

Déclencheur :

* sélection d’un type ou saisie d’un titre.

Action :

* proposer une phase ;
* proposer une zone ;
* proposer des matériaux fréquents.

Responsable :

* règles simples + IA si nécessaire.

## Automatisation 3 — Création de tâche depuis intervention

Déclencheur :

* l’utilisateur ajoute un détail contenant “manque”, “à demander”, “à confirmer”, “conteneur plein”, “à acheter”.

Action :

* proposer une tâche.

Responsable :

* IA, avec validation utilisateur.

## Automatisation 4 — Alertes données incomplètes

Déclencheur :

* enregistrement d’une intervention.

Action :

* vérifier champs manquants ;
* créer alerte “à vérifier”.

Responsable :

* système + IA pour formulation.

## Automatisation 5 — Mise à jour des coûts

Déclencheur :

* ajout d’heure, dépense, matériau ou supplément.

Action :

* recalculer totaux ;
* mettre à jour vues Coûts ;
* mettre à jour phase et zone liées.

Responsable :

* système.

## Automatisation 6 — Lien photo automatique

Déclencheur :

* ajout photo après une intervention.

Action :

* proposer de lier la photo à la dernière intervention ;
* reprendre zone et phase de l’intervention.

Responsable :

* système.

## Automatisation 7 — Statut “à vérifier” par défaut

Déclencheur :

* information financière incomplète.

Action :

* marquer comme “à vérifier”.

Exemples :

* supplément sans confirmation ;
* dépense sans statut ;
* matériau sans coût ;
* intervention sans date.

Responsable :

* système.

## Automatisation 8 — Résumé hebdomadaire

Déclencheur :

* fin de semaine ou bouton manuel.

Action :

* générer résumé de la semaine ;
* afficher chiffres clés ;
* lister éléments à vérifier.

Responsable :

* système pour chiffres ;
* IA pour texte.

---

# Garde-fous IA

## 1. Pas de validation technique automatique

L’IA ne doit jamais dire :

* “c’est validé structurellement” ;
* “la poutre est correcte” ;
* “la charge est acceptable” ;
* “vous pouvez continuer”.

Elle peut seulement dire :

* “à confirmer avec Martin” ;
* “à valider avec l’architecte” ;
* “à vérifier avec l’ingénieur” ;
* “point sensible”.

## 2. Pas de facture finale automatique

L’IA peut préparer des lignes, mais pas envoyer ou valider une facture.

## 3. Pas de montant inventé

L’IA ne doit pas inventer :

* taux horaire ;
* quantité ;
* prix ;
* durée ;
* TVA ;
* total.

Elle peut utiliser les données fournies.

## 4. Pas de statut payé inventé

Si un statut de paiement n’est pas clair, il reste :

* à vérifier.

## 5. Toujours permettre la correction

Chaque sortie IA doit être modifiable.

---

# Données nécessaires pour de bons résultats IA

Pour que l’IA soit utile, l’app doit lui fournir un contexte propre :

* personnes connues ;
* zones disponibles ;
* phases disponibles ;
* matériaux fréquents ;
* taux horaire par défaut ;
* statuts possibles ;
* interventions déjà existantes ;
* chantier fixe ;
* références techniques connues.

Sans ce contexte, l’IA risque de faire des suggestions trop générales.

---

# Priorités IA

## Priorité 1

* reformulation simple ;
* extraction de tâches ;
* suggestion zone / phase ;
* résumé journalier ;
* alertes données manquantes.

## Priorité 2

* résumé hebdomadaire ;
* messages Martin ;
* préparation décompte ;
* suggestions matériaux.

## Priorité 3

* OCR tickets ;
* analyse de coûts ;
* détection incohérences ;
* assistant conversationnel.

## Priorité plus tard

* estimation de chantier ;
* comparaison avec anciens chantiers ;
* optimisation des devis ;
* généralisation multi-chantiers.

---

# Critère de réussite

L’IA est réussie si elle fait gagner du temps sans rendre l’app floue.

Elle doit aider à :

* mieux noter ;
* mieux classer ;
* mieux résumer ;
* mieux repérer les oublis ;
* mieux préparer les documents.

Elle échoue si elle :

* invente des informations ;
* complique l’usage ;
* donne de fausses validations ;
* remplace les calculs système ;
* rend les statuts ambigus.
