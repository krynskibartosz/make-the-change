# Mission IA : Refonte UX du Module Défis

## Contexte et Objectif
Le module de Défis/Quêtes nécessite un ajustement pour le "Gradual Engagement". Un utilisateur non connecté doit pouvoir lire le contenu des défis (Mode Spectateur) mais doit s'inscrire pour récolter. De plus, le flux de validation doit obliger l'utilisateur à scroller.

## Tâches à accomplir (Checklist)
- [ ] **Mode Spectateur (Header) :** Si l'utilisateur n'est pas connecté ou n'a pas de faction, masquer la mascotte, le nom de la faction ("Quête de l'Essaim") et les jauges de progression personnelles en haut de l'écran principal des défis. Remplacer par un titre générique ("Les Défis du Vivant").
- [ ] **Accès Libre (Gradual Engagement) :** S'assurer qu'un clic sur une carte de défi ouvre bien la page de détail pour TOUS les utilisateurs (connectés ou non). Ne pas bloquer l'accès au contenu éducatif.
- [ ] **Refonte du flux de validation :** Sur la page de détail d'un défi :
  - Supprimer le bouton "sticky" flottant (ex: "C'est noté !") qui permet de valider sans lire.
  - Placer le bouton de validation ("Terminer et récolter 50 🌱") physiquement tout en bas de l'article, *sous* la carte d'incitation à l'achat ("Voir le produit associé").
  - Si l'utilisateur n'est pas connecté, ce bouton final doit dire "Créer un compte pour récolter" et déclencher le tunnel d'inscription (ex: redirection vers onboarding).
- [ ] **Interaction UI (Hold to Harvest) :** Améliorer le composant tactile "Maintiens pour récolter". Ce ne doit pas être une simple ligne grise, mais un véritable bouton (large cible tactile) qui se remplit visuellement de gauche à droite sur une durée de 1.5 seconde lorsqu'on le maintient enfoncé.

## Fichiers probables à modifier
- Dossier principal des défis (Aventure) : `c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\apps\web-client\src\app\[locale]\(adventure)\community\_features\`
- Page des défis potentielle : `c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\apps\web-client\src\app\[locale]\(adventure)\community\_features\adventure-challenges.tsx`
- Composant bouton "Hold to harvest" : à rechercher/créer dans `c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\apps\web-client\src\components\ui\` ou lié aux défis.

## Règles de comportement
1. Assure-toi de bien gérer les états de session (authentifié / non-authentifié) pour le rendu conditionnel.
2. Crée des composants réutilisables si nécessaire pour le bouton "Hold to Harvest".
