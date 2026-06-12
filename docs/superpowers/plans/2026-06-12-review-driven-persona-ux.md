# Clarus Review-Driven Persona UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Appliquer au prototype Clarus les corrections UX des reviews Hubert, Christophe, Martin et client final, puis livrer une version mobile vérifiable sur Vercel.

**Architecture:** Les écrans existants sont conservés. Les changements sont découpés en un socle partagé et quatre lots de persona aux écritures disjointes; l'intégrateur possède la navigation, le menu et la configuration. Les interactions restent locales et simulées.

**Tech Stack:** Next.js App Router, React, TypeScript strict, Tailwind CSS, Vitest, Biome, Lucide.

---

### Task 1: Socle mobile et navigation

**Files:**
- Modify: `next.config.mjs`
- Modify: `src/app/(tabs)/_components/tabs.ts`
- Modify: `src/app/(tabs)/_components/bottom-nav.tsx`
- Modify: `src/app/(tabs)/_components/tabs.test.ts`
- Modify: `src/app/globals.css`

- [ ] Écrire les assertions de navigation par rôle et vérifier qu'elles échouent pour `Pilotage` et `Plus`.
- [ ] Extraire une fonction pure de sélection/label des onglets.
- [ ] Autoriser le microphone pour la même origine.
- [ ] Ajouter les utilitaires de safe area nécessaires aux CTA.
- [ ] Exécuter `pnpm exec vitest run src/app/\(tabs\)/_components/tabs.test.ts`.

### Task 2: Expérience Hubert

**Files:**
- Modify: `src/features/roles/components/worker-cockpit.tsx`
- Modify: `src/app/(tabs)/historique/historique-view.tsx`
- Modify: `src/app/(tabs)/historique/journal-client.tsx`

- [ ] Ajouter un test pur pour le regroupement des envois personnels et leurs statuts.
- [ ] Afficher tous les états vocaux et un succès d'envoi visible.
- [ ] Remplacer le planning global par les consignes du jour.
- [ ] Remplacer l'historique avancé d'Hubert par une liste personnelle simple.
- [ ] Vérifier les états idle, erreur et succès.

### Task 3: Supervision Christophe

**Files:**
- Modify: `src/app/(tabs)/a-verifier/page.tsx`
- Modify: `src/features/board/components/kanban-board.tsx`
- Modify: `src/features/board/components/task-status-sheet.tsx`
- Modify: `src/app/(screens)/roadmap-viewer/page.tsx`
- Modify: `src/app/(tabs)/chantier/chantier-dashboard-client.tsx`
- Modify: `src/app/(tabs)/chantier/_components/zone-row-card.tsx`

- [ ] Tester la grammaire des cinq statuts.
- [ ] Construire une liste compacte `À vérifier` avec détail dépliable.
- [ ] Ajouter les actions valider, corriger et organiser.
- [ ] Remplacer `Inbox` par `À trier`.
- [ ] Présenter planning et tâches verticalement sur mobile.
- [ ] Ajouter les statuts textuels des zones.

### Task 4: Pilotage Martin

**Files:**
- Modify: `src/app/(tabs)/dashboard/page.tsx`
- Modify: `src/features/projects/components/portfolio-board.tsx`
- Modify: `src/app/(screens)/projet-info/page.tsx`
- Modify: `src/app/(screens)/client/[id]/page.tsx`

- [ ] Ajouter `À traiter maintenant` au-dessus des KPI.
- [ ] Clarifier les filtres et actions des cartes projet.
- [ ] Remplacer le grand visuel de la fiche chantier par quatre KPI.
- [ ] Ajouter le suivi relationnel au profil client.
- [ ] Vérifier que les liens téléphone, email, chantier et facturation restent accessibles.

### Task 5: Confiance client

**Files:**
- Modify: `src/features/roles/components/client-portal.tsx`
- Modify: `src/app/(tabs)/validations/page.tsx`
- Modify: `src/app/(screens)/photos/page.tsx`

- [ ] Corriger l'identité en Jean Dupont.
- [ ] Ajouter les mentions d'estimation et de conséquence d'attente.
- [ ] Ajouter une confirmation simulée avant acceptation.
- [ ] Ajouter un retour après demande de précision.
- [ ] Filtrer et contextualiser les photos client sans placeholder anglais.

### Task 6: Menus par persona et intégration

**Files:**
- Modify: `src/app/(tabs)/menu/page.tsx`
- Modify: `src/app/(screens)/equipe/page.tsx`
- Modify: `src/lib/mock/interventions.ts`

- [ ] Conserver le sélecteur de rôle de démonstration.
- [ ] Afficher des groupes de menu propres à chaque persona.
- [ ] Fusionner les entrées matériaux pour Christophe.
- [ ] Corriger les rôles affichés dans l'équipe.
- [ ] Harmoniser les données mockées visibles dans les quatre modes.

### Task 7: Vérification et livraison

**Files:**
- Test: all changed files

- [ ] Exécuter `pnpm type-check`.
- [ ] Exécuter les tests ciblés puis comparer les échecs de la suite complète au baseline.
- [ ] Exécuter Biome sur les fichiers modifiés.
- [ ] Exécuter `pnpm build`.
- [ ] Vérifier les quatre rôles aux largeurs 375, 393 et 430 px dans le navigateur.
- [ ] Corriger les erreurs console, débordements et CTA masqués.
- [ ] Commit, push et déployer la branche validée sur Vercel.

