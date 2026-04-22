# Mission IA : Optimisation UX du Module Marché (Boutique)

## Contexte et Objectif
Le tunnel de récompenses (Marché) fonctionne bien mais manque de fluidité sur deux états : le manque de points (solde insuffisant) et l'absence d'adresse de livraison.

## Tâches à accomplir (Checklist)
- [ ] **Gestion Dynamique du Solde (Écran Produit) :**
  - Sur la fiche d'un produit (récompense) valant X points (✨).
  - Si `Solde de l'utilisateur >= X` : Afficher le bouton principal vert "Échanger (X ✨)". Ajouter un texte/lien secondaire : "Ou acheter pour [Prix] €".
  - Si `Solde de l'utilisateur < X` : Le bouton principal devient "Acheter pour [Prix] €" (Vert). Ajouter un texte d'incitation gamifié : "Il vous manque Y ✨ pour l'obtenir gratuitement." (avec un lien vers les défis).
- [ ] **Fluidité de l'Adresse de Livraison :**
  - Si l'utilisateur tente d'échanger un produit mais n'a pas renseigné d'adresse physique.
  - Le CTA sticky en bas ne doit pas être "Disabled" (grisé et inactif). Il doit dire "Ajouter une adresse de livraison" et être actif.
  - Au clic, il doit ouvrir le formulaire/modale d'ajout d'adresse. Une fois l'adresse renseignée, le bouton redevient "Échanger".

## Fichiers probables à modifier
- Dossier lié à la boutique / cart : `c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\apps\web-client\src\app\[locale]\(marketing-no-footer)\cart\`
- Sous-dossier de features : `c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\apps\web-client\src\app\[locale]\(marketing-no-footer)\cart\_features\cart-sheet.tsx`
- Tu devras peut-être explorer `c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\apps\web-client\src\app\[locale]\(dashboard)\dashboard\orders\` pour des éléments liés au marché.

## Règles de comportement
1. Ne modifie pas la logique de paiement backend, concentre-toi sur l'UI/UX front-end et les appels de modales/composants existants.
2. Respecte le design system (couleurs, padding) déjà en place pour les boutons.
