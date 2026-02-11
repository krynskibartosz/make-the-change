# Méthodologie de Conception : Capitalisation sur l'Existant vers la Version Finale

Ce document définit la méthodologie standardisée pour concevoir la version finale de la plateforme **Make the Change** en s'appuyant rigoureusement sur les actifs existants (`web-v3`, `_old-products`, etc.). L'objectif est d'accélérer le développement tout en élevant la qualité par l'apprentissage des itérations précédentes.

---

## 1. Stratégie d'Identification : Le "Quand"

Il ne faut pas analyser l'ancien code en permanence, mais à des moments stratégiques précis pour maximiser le ROI de l'analyse.

### Moments Clés & Déclencheurs

| Phase de Projet | Déclencheur (Trigger) | Objectif de l'Analyse | Type d'Analyse |
| :--- | :--- | :--- | :--- |
| **1. Conception (Specs)** | Définition d'une nouvelle fonctionnalité métier (ex: "Gestion des Commandes"). | Identifier les règles métier complexes et les cas limites déjà résolus. | **Fonctionnelle** : Comment ça marchait ? Qu'est-ce qui manquait ? |
| **2. Architecture Technique** | Choix d'une librairie ou d'un pattern (ex: "Gestion des formulaires"). | Évaluer la dette technique des anciennes approches vs les standards actuels. | **Structurelle** : Pourquoi ce choix a été fait ? A-t-il tenu la charge ? |
| **3. Blocage Technique** | "Comment implémenter X avec la contrainte Y ?" | Vérifier si une solution de contournement (workaround) existe déjà. | **Chirurgicale** : Recherche de snippets ou de hacks spécifiques. |
| **4. UX/UI Design** | Création de maquettes ou composants UI. | Récupérer des patterns d'interaction éprouvés (ex: Optimistic UI). | **Visuelle/UX** : Comportement utilisateur, feedbacks. |

**Règle d'Or** : Si une fonctionnalité a nécessité plus de 3 jours de dev dans le passé, **l'analyse est obligatoire** avant de recoder.

---

## 2. Processus de Sélection : Le "Quoi"

Tous les anciens projets ne se valent pas. Une sélection rigoureuse est nécessaire.

### Critères de Sélection (Score de 1 à 5)

1.  **Similarité Fonctionnelle** : Le module répond-il au même besoin métier ?
2.  **Proximité Technologique** : La stack est-elle compatible (React/Next.js vs autre) ?
3.  **Qualité du Code Perçue** : Présence de typage fort, architecture claire, documentation.
4.  **Feedback Utilisateur** : Cette feature était-elle appréciée ou source de bugs ?

### Matrice de Décision (Exemple Projet Actuel)

| Source | Modules Candidats | Score Pertinence | Action |
| :--- | :--- | :--- | :--- |
| **`web-v3`** | Architecture globale, UI Components, Hooks | **5/5 (Référence)** | **À migrer/adapter** en priorité. |
| **`_old-products`** | Logique métier Produits, Traductions, Auto-save | **4/5 (Métier)** | **Extraire la logique**, réécrire la vue. |
| **`web-client` (v1)** | Auth flows, Pages publiques | **3/5 (Public)** | Analyser pour le SEO et le parcours client. |
| **`apps/web-client`** | Flows publics, e-commerce, parcours client | **3/5 (Contexte)** | Vérifier la compatibilité des contrats d'interface. |

---

## 3. Méthodologie d'Analyse Structurée : Le "Comment"

Une fois la source identifiée, suivre ce processus en 3 étapes :

### Étape A : L'Archéologie (Compréhension)
1.  **Exécuter** (si possible) le code pour voir le comportement dynamique.
2.  **Tracer** les données : Suivre le flux de données de la DB à l'UI.
3.  **Lister** les dépendances externes (libs) pour éviter de réimporter des libs obsolètes.

### Étape B : L'Extraction (Isolation)
Identifier les "Pépites" vs "Dette".
*   *Pépite* : Un hook custom générique (ex: `useTranslatableField`), une fonction utilitaire complexe (calcul de prix).
*   *Dette* : Composants de classe, `any` types, styles inline, dépendances dépréciées.

### Étape C : La Transformation (Modernisation)
Ne jamais copier-coller aveuglément.
*   **Typer** : Convertir en TypeScript strict (Zod schemas).
*   **Standardiser** : Adapter aux conventions actuelles (ex: shadcn/ui, Tailwind).
*   **Optimiser** : Remplacer `useEffect` par Server Actions ou React Query si pertinent.

---

## 4. Templates de Documentation (Knowledge Capture)

Pour chaque analyse significative, créer une fiche rapide dans le dossier `/docs/analysis/`.

### Template : Fiche d'Analyse de Module

```markdown
# Analyse : [Nom du Module, ex: Système de Traduction]
**Source** : `apps/web/src/.../_old-products/...`
**Date** : YYYY-MM-DD

## 1. Ce que ça fait (Business)
- Permet de gérer les traductions FR/EN/NL par champ.
- Stockage JSONB en base.

## 2. Comment ça marche (Technique)
- Hook `useTranslation` qui switch la langue locale.
- Context React pour propager la langue sélectionnée.

## 3. Points Forts (À garder)
- L'UX du switch de langue sans rechargement.
- La structure de données JSONB (flexible).

## 4. Points Faibles (À jeter/refaire)
- Typage `any` sur les objets de traduction.
- Dépendance à une vieille lib de drapeaux.

## 5. Plan de Migration
1. Copier `TranslationContext`.
2. Remplacer les types par Zod Schema.
3. Intégrer les composants UI `@make-the-change/core/ui`.
```

---

## 5. Plan d'Intégration Progressive

Utiliser le **Strangler Fig Pattern** (Figuier Étrangleur) pour l'intégration.

### Phase 1 : Coexistence (Isolation)
Intégrer le code legacy dans un dossier isolé (ex: `_old-products`) ou sous un namespace spécifique. Le but est de le rendre accessible pour référence sans polluer le code propre.

### Phase 2 : L'Adaptateur (Bridge)
Créer des "Adapters" ou des "Wrappers" modernes qui utilisent la logique legacy mais exposent une API propre.
*Exemple* : Créer un `ProductDetailController` (moderne) qui utilise en interne des fonctions de calcul extraites de l'ancien projet.

### Phase 3 : Réécriture & Bascule
Une fois le composant moderne fonctionnel :
1.  Rediriger les routes vers le nouveau composant.
2.  Supprimer le code legacy mort.
3.  Valider via checklist de QA manuelle et revue métier.

---

## 6. Checklists & Métriques

### Checklist Opérationnelle "Avant Merge"
- [ ] Le code extrait respecte-t-il l'architecture "Controller/View" ?
- [ ] Les types `any` ont-ils été éliminés ?
- [ ] Les dépendances externes (npm) sont-elles à jour et nécessaires ?
- [ ] Les parcours critiques ont-ils été validés via QA manuelle ?
- [ ] La documentation (ou JSDoc) a-t-elle été mise à jour ?

### Métriques de Succès de la Démarche
1.  **Taux de Réutilisation** : % de code utilitaire provenant de v3 (Cible > 30%).
2.  **Vitesse de Dev** : Temps d'implémentation d'une feature vs estimation initiale (Cible : -20% grâce à la réutilisation).
3.  **Stabilité** : Nombre de bugs de régression sur les features migrées (Cible : 0 critique).

---

## 7. Exemple Concret : La Migration "Traduction & SEO"

**Contexte** : Besoin d'ajouter le SEO multilingue sur la V4.
1.  **Identification** : `_old-products` avait un système de traduction apprécié.
2.  **Analyse** : Le système utilisait un Context React et des champs contrôlés.
3.  **Extraction** : `TranslationProvider` et `useTranslatableField` ont été isolés.
4.  **Transformation** :
    - Ajout du typage strict `TranslationData`.
    - Intégration avec `react-hook-form` via `useWatch`.
    - Ajout de colonnes JSONB `seo_title_i18n` dans le schéma Drizzle.
5.  **Intégration** : Déploiement dans `ProductDetailsEditor` (moderne).
**Résultat** : Feature livrée en < 2h, stable et typée.
