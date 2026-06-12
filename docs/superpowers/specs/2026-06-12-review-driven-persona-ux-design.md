# Clarus Review-Driven Persona UX Design

## Objectif

Transformer les quatre reviews UX fournies en améliorations visibles du prototype mobile existant, sans reconstruire l'application et sans ajouter de backend.

## Principe Produit

- Hubert capture et consulte ses propres envois.
- Christophe capture aussi, puis vérifie, corrige, classe et organise.
- Martin pilote les projets, les risques, la relation client et les montants à préparer.
- Jean Dupont consulte une version validée du chantier et donne un avis éclairé.

Le sélecteur de rôle reste visible dans le prototype. Les actions simulées doivent produire un retour visuel explicite et ne jamais prétendre déclencher une opération réelle.

## Socle Commun

- Navigation adaptée à chaque rôle.
- Safe areas iPhone appliquées aux pages, barres fixes, modales et CTA.
- Microphone autorisé par la `Permissions-Policy`.
- Libellés entièrement en français.
- Statuts de tâche communs : `À trier`, `À faire`, `En cours`, `Bloquant`, `Terminé`.
- Les boutons actifs ont toujours un effet visible.
- Les données restent mockées et locales.

## Hubert

Navigation : `Accueil`, `Envoyés`, `Menu`.

L'accueil conserve la dictée et les quatre actions rapides. Il affiche les états `Prêt à dicter`, `Enregistrement`, `Analyse`, `Prêt à envoyer`, `Envoyé` et `Erreur`. Le bloc de planning avancé est remplacé par des consignes du jour.

`Envoyés` devient une liste personnelle sans filtres, coûts, phases ou personnes. Les statuts visibles sont `Envoyé`, `En attente`, `Validé` et `À corriger`.

Le menu montre uniquement le contexte du chantier, les accès personnels et l'aide, en plus du sélecteur de rôle de démonstration.

## Christophe

Navigation : `Chantier`, `À vérifier`, `Menu`.

`À vérifier` commence par une liste compacte et ouvre le détail de l'extraction. Les actions principales sont `Valider`, `Corriger` et `Organiser`. Les éléments sont hiérarchisés par blocage ou besoin de validation.

Le planning mobile utilise une synthèse verticale par phase et une vue segmentée des tâches. Le Gantt reste accessible comme démonstration secondaire. `Inbox` devient `À trier`.

Les zones affichent un statut textuel. Le menu privilégie supervision, chantier et ressources; matériaux et inventaire sont fusionnés en `Matériaux & stock`.

## Martin

Navigation : `Projets`, `Pilotage`, `Menu`.

`Projets` reste l'écran central. Les cartes affichent avancement, montant à préparer, blocages et actions explicites vers chantier, client et facturation.

`Pilotage` ajoute `À traiter maintenant` avant les indicateurs financiers. La fiche chantier remplace son grand visuel décoratif par des KPI. Le profil client ajoute dernier contact, prochaine action et décision attendue.

## Client Final

Navigation : `Suivi`, `À valider`, `Photos`, `Plus`.

L'identité affichée est Jean Dupont. Le CTA principal reste visible au-dessus de la navigation et de Safari.

L'acceptation d'une option ouvre une confirmation détaillant choix technique, délai estimé et coût estimé. La confirmation est explicitement simulée. Les photos visibles sont contextualisées et ne montrent aucun placeholder anglais.

## Critères De Démonstration

1. Chaque rôle peut être sélectionné depuis le menu et conserve sa navigation correcte après rechargement.
2. Hubert peut simuler une note vocale, voir le résumé et obtenir un état envoyé.
3. Christophe peut valider ou corriger un élément et voir la liste évoluer.
4. Martin comprend en moins de dix secondes ce qui demande son attention.
5. Jean comprend la demande P1.7 et passe par une confirmation avant l'état accepté.
6. Aucun CTA principal n'est masqué aux largeurs 375, 393 et 430 px.
7. TypeScript et le build Next.js passent; aucun nouveau diagnostic Biome n'est introduit.

