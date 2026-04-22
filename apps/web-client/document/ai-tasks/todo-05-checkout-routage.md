# Mission IA : Routage Post-Paiement & Réassurance

## Contexte et Objectif
Le tunnel "Donateur" (Checkout sur la page d'un projet) est critique. L'objectif est de s'assurer que l'utilisateur est bien réassuré pendant l'achat, et correctement redirigé après la modale de succès, avec une stratégie "Passwordless" (Magic Link).

## Tâches à accomplir (Checklist)
- [ ] **UX Modale de Succès (Magic Link) :**
  - Après paiement réussi, sur l'écran "Ne perdez pas votre récompense". L'UI ne doit demander qu'un Email (et non un mot de passe).
  - Le bouton doit dire "Créer mon compte en 1 clic" (ou "Envoyer le lien magique").
  - Gérer l'état de validation : au clic, afficher un message "Vérifiez votre boîte mail ! Un lien vous y attend."
- [ ] **Logique de Routage de la Croix (X) :** Si l'utilisateur ferme la modale de succès *sans* créer de compte, la modale doit se fermer et le laisser sur la page du Projet qu'il soutenait (idéalement avec la jauge rafraîchie). NE PAS le rediriger ailleurs.
- [ ] **Atterrissage Magic Link (BioDex) :** Configurer la route de callback du Magic Link post-paiement pour que l'utilisateur atterrisse sur la page "BioDex" (Inventaire d'espèces) plutôt que sur un dashboard générique. Une modale de rattrapage devra s'y ouvrir pour lui demander de "Choisir sa faction" (Micro-onboarding).

## Fichiers probables à modifier
- Dossier de paiement (Checkout) : `c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\apps\web-client\src\app\[locale]\(marketing-no-footer)\checkout\`
- La modale de succès sera probablement dans `_features` ou `components` à l'intérieur du dossier checkout.
- Gestionnaire de callback Auth (si applicable) : chercher dans `c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\apps\web-client\src\lib\auth\` ou le dossier `api/auth`.

## Règles de comportement
1. **ATTENTION :** C'est une tâche touchant au routage et à l'authentification. Modifie le code avec grande précaution et vérifie que tu ne casses pas les autres flux d'inscription existants.
2. N'hésite pas à "Mocker" la fonction Magic Link si l'API backend n'est pas encore prête, mais prépare l'UI et la logique d'état local.
