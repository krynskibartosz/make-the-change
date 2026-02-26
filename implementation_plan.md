# Plan d'Implémentation Parallèle (Option 4a + 4b)

Ce plan vise à développer simultanément les fonctionnalités sociales pour les utilisateurs (B2C - Communauté & Gamification) et l'outil de publication pour les producteurs (B2B/Partenaire).

---

## 🗓 Phase 1 : Fondations & Base de Données (Semaine 1)
*Objectif : Préparer le terrain pour les deux fronts.*

### Tâche 1.1 : Migration DB "Social & Guildes"
- [ ] Créer le fichier de migration SQL complet.
- [ ] Tables Social : `social.posts`, `social.comments`, `social.reactions`.
- [ ] Tables Guildes : `identity.guilds`, `identity.guild_members`.
- [ ] Tables Gamification : `gamification.xp_ledger` (log des points).
- [ ] Configurer les politiques RLS pour sécuriser les interactions.

### Tâche 1.2 : Types TypeScript Partagés
- [ ] Mettre à jour `@make-the-change/core` avec les nouveaux types.
- [ ] Créer les types utilitaires (`GuildWithMembers`, `FeedItem`).

---

## 🗓 Phase 2 : Développement Parallèle (Semaine 2-3)

### Front A : L'Expérience Communautaire (Web-Client)
*Responsable : Équipe Frontend A (Gamification & Social)*

#### 2.A.1 Le "Global Feed"
- [ ] Créer `apps/web-client/src/components/social/feed.tsx`.
- [ ] Implémenter l'agrégation des sources (Updates Producteurs + Activité Utilisateurs).
- [ ] Ajouter les interactions (Like/Comment) connectées à la DB.

#### 2.A.2 Profil Public & Guildes
- [ ] Créer la page dynamique `/u/[username]`.
- [ ] Développer le module de création de Guilde.
- [ ] Intégrer le "Leaderboard de Guilde" dans la page `/leaderboard`.

### Front B : L'Outil Producteur (Web / Studio)
*Responsable : Équipe Frontend B (Contenu)*

#### 2.B.1 Route "Studio"
- [ ] Créer une nouvelle route simplifiée dans `apps/web` : `/partner/studio`.
- [ ] Désactiver le layout admin complexe pour cette route (Layout mobile-first dédié).

#### 2.B.2 Formulaire de Publication ("Quick Post")
- [ ] Créer le composant d'upload photo optimisé mobile.
- [ ] Créer le formulaire simplifié (Texte + Type d'update).
- [ ] Câbler l'action qui écrit dans `investment.project_updates` (qui nourrira le Feed de l'équipe A).

---

## 🗓 Phase 3 : Intégration & Gamification (Semaine 4)
*Objectif : Lier les deux mondes par le jeu.*

### Tâche 3.1 : Boucle de Feedback
- [ ] Quand un utilisateur "Like" une update (Front A), notifier le producteur sur son Studio (Front B).
- [ ] Quand un producteur poste (Front B), envoyer une notif aux membres de la Guilde qui soutient le projet (Front A).

### Tâche 3.2 : Moteur de Récompenses
- [ ] Implémenter les triggers DB pour attribuer l'XP automatiquement (ex: `ON INSERT social.comments -> ADD XP`).
- [ ] Créer les animations de "Level Up" sur le frontend utilisateur.

---

## 🗓 Phase 4 : Déploiement & Test
- [ ] Tests E2E Croisés : Un producteur poste -> Une Guilde voit l'update -> Les membres gagnent de l'XP en réagissant.
- [ ] Déploiement en Production.
