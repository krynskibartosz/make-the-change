# 📊 Analyse des Modifications Non Pushées

Voici une analyse détaillée et structurée de toutes les modifications locales actuelles (avant le prochain `git push`), classées par grands thèmes architecturaux et fonctionnels.

## 1. 🏗️ Base de données & Données de base (`packages/core`)
Le schéma de base de données Drizzle a été considérablement enrichi pour supporter de nouvelles fonctionnalités centrées autour de la **gamification**, de **l'exploration (quêtes/items)** et des **écosystèmes/propriétés** :
- **Nouvelles tables ajoutées** : `ecosystems`, `properties`, `quests`, `user_quests`, `items`, et `user_inventory`.
- **Évolution de la table `species`** : Ajout de métadonnées scientifiques et de gamification comme `bioscore`, `characteristics`, et le support de plusieurs habitats en tableau (`habitat: text().array()`).
- **Évolution des `projects`** : Les projets sont désormais interconnectés avec les `ecosystems`, les `species` (en tant que clé étrangère), les propriétés/parcelles (`properties`) et les quêtes (`quests`).
- **Améliorations des modèles de traduction** : Dans plusieurs tables (`producers`, `categories`, `products`, `species`, `ecosystems`), les champs locaux (ex: `name_default`, `description_default`) utilisent désormais `generatedAlwaysAs('')` au lieu d'une configuration par défaut simple, marquant une volonté d'optimiser l'ORM et la base de données.

## 2. 🌍 Web Client - Dimension Sociale & Profils Publics
L'application franchit une étape vers la création d'une communauté :
- **Profils Publics** : Création d'une nouvelle arborescence de routes sous `src/app/[locale]/u/` permettant d'exposer les profils (ex: `/u/[username]` et `/u/me`).
- **En-tête de profil (`profile-header.tsx`)** : Ajout d'un bouton UI "Voir mon profil public" pointant vers la nouvelle vue publique.
- **Fil d'actualité (Feed)** : Integration d'un composant de fil d'actualités (`<Feed />`) sur la page d'accueil du Dashboard. Le système s'appuie sur une nouvelle logique côté serveur (`src/lib/social/feed.actions.ts`) et de nouveaux composants React (`feed-client.tsx`, `post-card.tsx`).

## 3. 🎮 Web Client - Dashboard & Expérience Utilisateur
La gamification personnelle monte d'un cran sur le panneau de l'utilisateur :
- **Système de Niveau et d'XP amélioré** : Le composant `DashboardWelcome` affiche désormais une barre de progression d'XP de l'utilisateur (`Progress xpProgress`).
- **Nouveaux Niveaux Thématiques** : Définition de nouveaux grades liés à l'environnement pour les joueurs : `graine`, `germe`, `pousse`, `arbre`, `foret`, chacun avec son propre code d'affichage et ses couleurs d'aura.

## 4. 🧪 Web Client - Hero Lab (`farmminerals`)
Le laboratoire de test (Hero Lab) s'enrichit d'une expérience interactive :
- **Clone de Farm Minerals** : Ajout d'une nouvelle page (`/hero-lab/farmminerals`) simulant le site originel avec des animations de scroll pointues.
- **Ajout de librairies d'animation lourdes** : Le `package.json` importe dorénavant `gsap`, `lenis` (pour le smooth scrolling), `lottie-web`, `split-type` et `@splidejs/splide`.
- **Mise à jour des copies (`hero-lab-copy.ts`)** : Le nouveau projet du lab est traduit et listé dans les menus en EN, FR et NL.

## 5. 🛠️ Application Web Principale (`apps/web`) et Outillage
De nouveaux workflows d'import de données sont en cours d'ingénierie :
- **Scripts de Migration** : Apparition du script `scripts/import-greg-data.ts` et du dossier `greg-excell/` à la racine pour la migration de données spécifiques.
- **Dépendances de Parsing** : Ajout de `csv-parse` et `postgres` nativement dans le projet `apps/web` en vue d'opérations d'ingénierie des données.
- De nouvelles routes "studio partenaires" (`src/app/[locale]/partner/studio/`) sont à l'étude.

## 6. 📝 Documentation & Stratégie (Racine du projet)
L'état de la planification a fait l'objet d'un gros travail, visible par de multiples nouveaux fichiers Markdown à la racine :
- **Documents Roadmap & Stratégie** : `ANALYSIS_TREE_NATION.md`, `COMMUNITY_FEATURES_ROADMAP.md`, `PROJECT_EVOLUTION_PLAN.md`, `project_analysis.md`.
- **Documents d'Ingénierie & Specs** : `community_gamification_specs.md`, `technical_specifications.md`, `tool_specifications.md`, `implementation_plan.md`, `test_strategy.md`, `deployment_guide.md`, `maintenance_manual.md`.

---
**En résumé :** 
Le projet s'enrichit massivement sur trois axes qui ne sont pas encore partagés : 
1. Une base de données et une interface prêtes pour de la **ludification (XP, quêtes, objets)**.
2. Une brique logicielle autour des **interactions sociales et profils publics** (Fil d'actualité).
3. Du **travail R&D en frontend** via le Hero Lab avec un clone très poussé de Farm Minerals nécessitant des librairies d'animations dédiées.
