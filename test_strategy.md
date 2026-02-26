# Stratégie de Test

## 1. Niveaux de Test

### 1.1 Tests Unitaires (Vitest)
- **Cible :** Fonctions utilitaires, Hooks complexes, Server Actions isolées.
- **Exemple :** Tester que `formatCurrency` gère bien les centimes, tester que le validateur Zod rejette un commentaire vide.

### 1.2 Tests d'Intégration (Composants)
- **Cible :** Composants UI (`CommentSection`, `LikeButton`).
- **Outil :** React Testing Library.
- **Scénario :** Vérifier que cliquer sur "Like" change l'état visuel du bouton immédiatement (Optimistic UI) et appelle la fonction mockée.

### 1.3 Tests End-to-End (Playwright)
- **Cible :** Flux critiques Utilisateur & Producteur.
- **Scénarios Prioritaires :**
    1.  **Flux Producteur :** Login Producteur -> Accès Studio -> Upload Photo -> Publication -> Vérification présence dans la liste.
    2.  **Flux Social :** Login User -> Accès Projet -> Voir Update -> Poster Commentaire -> Vérifier apparition commentaire.

## 2. CI/CD Integration
- Les tests unitaires et le linting (`biome check`) doivent passer avant tout merge sur `main`.
- Les tests E2E doivent tourner en nightly ou avant une release majeure.
