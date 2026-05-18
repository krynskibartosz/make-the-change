# Learning Experience v1

## Décision produit

`Apprendre` est le hub éducatif principal. Il ne remplace pas l’Academy : il organise les contextes d’apprentissage autour de quatre modes complémentaires.

- Continuer : reprendre un cours ou un parcours.
- Parcours guidés : suivre une progression quand le sujet a un ordre logique.
- Atlas libre : explorer les domaines du vivant sans chemin imposé.
- Toile vivante : comprendre les relations entre espèces, habitats, menaces et projets.

L’Academy reste l’expérience immersive guidée. Elle garde sa progression séquentielle, ses vies, sa série et les Graines. Les cours ouverts librement depuis `Apprendre` utilisent le même moteur d’exercices, mais écrivent dans une progression séparée et ne donnent pas de Graines.

## Routes

- `/learn`
- `/learn/atlas`
- `/learn/parcours`
- `/learn/parcours/[pathId]`
- `/learn/courses`
- `/learn/courses/[courseId]`
- `/academy/[chapter]/[unit]?mode=course&courseId=...&returnTo=...`
- `/ecosysteme/[id]?node=...`

## Règle centrale

Un cours n’est pas rangé à un seul endroit. Il peut apparaître dans un domaine Atlas, un parcours, une fiche projet, une fiche BioDex et un nœud de Toile vivante. La source de vérité est le registre `apps/web-client/src/lib/learning/catalog.ts`.
