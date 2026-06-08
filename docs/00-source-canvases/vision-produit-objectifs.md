# Canvas 1 — Vision produit & objectifs

## Nom temporaire

**Sparrenlaan Chantier**
ou
**Clarus Chantier — Sparrenlaan**

## Contexte

L’application est conçue pour suivre un chantier précis : la transformation d’une maison unifamiliale située Sparrenlaan n°35 à Overijse.

Le chantier est actuellement suivi de manière manuelle, principalement via des notes écrites dans une application Notes, des échanges oraux, des photos prises sur téléphone et des calculs réalisés après coup pour les heures, les marchandises, les suppléments et les montants à payer ou à facturer.

L’objectif n’est pas encore de créer une application générique de gestion de chantier, mais de construire un outil spécifique, simple et utile pour ce chantier précis.

## Problème principal

Les informations du chantier existent, mais elles sont dispersées, peu structurées et difficiles à exploiter ensuite.

Exemples de problèmes :

* les heures sont notées manuellement ;
* les calculs sont faits à la main ;
* les dates ne sont pas toujours présentes ;
* les postes de travail ne sont pas toujours liés à une zone ou une phase ;
* les matériaux et dépenses sont notés séparément ;
* les suppléments ne sont pas toujours clairement suivis ;
* les photos ne sont pas toujours liées à une tâche ou une zone ;
* il est difficile de savoir ce qui a été payé, facturé ou reste à vérifier ;
* il est difficile de comprendre le coût réel du chantier.

## Objectif principal

Créer une application mobile simple qui permet d’encoder rapidement ce qui se passe sur le chantier, tout en structurant correctement les données pour pouvoir les exploiter ensuite.

L’application doit permettre de répondre à ces questions :

* Qu’est-ce qui a été fait ?
* Où cela a-t-il été fait ?
* Par qui ?
* Combien d’heures ont été prestées ?
* Quel est le coût de la main-d’œuvre ?
* Quels matériaux ont été achetés ?
* Quels matériaux ont été utilisés ?
* Qu’est-ce qui reste à faire ?
* Quels suppléments sont à facturer ?
* Qu’est-ce qui est encore à payer ?
* Quelles photos prouvent le travail réalisé ?
* Quels points doivent être validés avec Martin, l’architecte ou l’ingénieur ?
* Combien coûte réellement le chantier ?

## Public cible V1

L’application est pensée pour un usage interne sur ce chantier.

Utilisateurs principaux :

* Hubert ;
* Christophe ;
* Grégory ;
* éventuellement Bartosz ou une autre personne présente sur chantier.

Ces utilisateurs ne doivent pas avoir l’impression d’utiliser un logiciel administratif complexe. L’application doit être pensée comme un outil de terrain.

## Principe clé

L’application ne doit pas gérer des chantiers.

Elle doit comprendre ce chantier.

Pour la V1, il n’y a donc pas de création de chantier, pas de gestion multi-client, pas de multi-société visible.

L’utilisateur ouvre l’application et arrive directement sur le chantier Sparrenlaan.

## Promesse produit

En quelques secondes, l’utilisateur peut encoder une intervention de chantier, et l’application relie automatiquement cette intervention aux bonnes données : zone, phase, personnes, heures, coût, matériaux, photos, tâches et statut financier.

## Vision à court terme

Remplacer les notes manuelles par une interface rapide et structurée.

## Vision à moyen terme

Obtenir une vision claire du chantier :

* avancement ;
* heures ;
* coûts ;
* matériaux ;
* suppléments ;
* tâches restantes ;
* données utiles pour devis, facture ou décompte.

## Vision à long terme

Si l’outil est réellement utile sur ce chantier, il pourra évoluer vers une application plus générique pour d’autres chantiers Clarus, voire une solution plus large pour petites entreprises du bâtiment.

Mais cette ambition ne doit pas compliquer la V1.

## Ce que l’application doit être

* simple ;
* mobile-first ;
* rapide à utiliser ;
* pensée chantier ;
* centrée sur les interventions ;
* capable de relier les données ;
* évolutive ;
* utile même avec peu d’informations ;
* capable d’accepter le flou du terrain.

## Ce que l’application ne doit pas être en V1

* un ERP complet ;
* un logiciel comptable ;
* un logiciel de facturation officiel ;
* une app SaaS multi-entreprises ;
* un outil lourd à paramétrer ;
* une app qui demande trop de champs ;
* une copie numérique compliquée d’un carnet papier.

## Principe de réussite

L’application sera réussie si Hubert, Christophe ou Grégory peuvent encoder une intervention plus vite que dans Notes, tout en générant des données plus propres et exploitables.
