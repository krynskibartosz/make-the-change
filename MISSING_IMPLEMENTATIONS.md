# 🎯 Audit des Implémentations Manquantes

Suite à l'analyse croisée entre le **codebase local** et la base de données distante **Supabase** (`ebmjxinsyyjwshnynwwu`), voici le diagnostic. 

**Excellente nouvelle :** La base de données Supabase est **déjà à jour** ! Toutes les nouvelles tables (`ecosystems`, `properties`, `quests`, `items`, `user_inventory`, `social.posts`, etc.) y sont présentes.

Cependant, il y a un décalage majeur avec le code : l'infrastructure de données existe, mais **les composants d'interface, la logique métier (API) et les panneaux d'administration sont presque totalement manquants.**

Voici ce qu'il reste à implémenter pour rendre ces modifications fonctionnelles :

### 1. ⚔️ Système de Quêtes et Inventaire (Gamification)
Bien que le Dashboard affiche une barre d'XP, le joueur n'a actuellement aucun moyen de consulter ses quêtes ou son inventaire :
- **Manquant (Backend)** : Routes API/Server Actions pour réclamer une récompense de quête (`claimQuestReward`), utiliser un objet (`useItem`), ou lister l'inventaire.
- **Manquant (UI Utilisateur)** : 
  - Une page ou un drawer `User Inventory` montrant la collection d'objets (`items`).
  - Une interface `Quests Log` listant les quêtes actives (`quests`) et la progression de l'utilisateur (`user_quests`).
- **Manquant (Admin)** : Interface pour créer de nouveaux `items` et définir les `quests`.

### 2. 🌍 Écosystèmes et Propriétés (Investment/Core)
La couche de base de données relie désormais les projets (`projects`) à des écosystèmes et des propriétés physiques (parcelles), mais l'application n'exploite pas encore ces liens :
- **Manquant (Backend)** : Aucun service Drizzle n'a été créé pour récupérer un écosystème avec ses projets associés, ou pour lister les propriétés.
- **Manquant (UI Utilisateur)** :
  - Page `/ecosystems` ou intégration visuelle de l'écosystème sur la page d'un projet.
  - Page détaillée affichant une propriété spécifique (`properties`) et son gestionnaire.
- **Manquant (Admin)** : Panneau d'administration dans `apps/web` (CMS interne) pour gérer les `ecosystems` et les `properties`.

### 3. 💬 Fil d'Actualité Social (Social.Posts & Comments)
L'UI du Feed a commencé à être intégrée (`feed.tsx`, `post-card.tsx`), mais la logique est incomplète :
- **Manquant (Backend)** : 
  - La fonction `toggleSuperLike` dans `feed.actions.ts` contient un `// TODO:` car elle ne vérifie pas encore si l'utilisateur possède l'inventaire requis (une "graine") avant de donner un super-like.
  - Il manque l'action principale pour **créer** un nouveau post côté utilisateur (`createPost`).
- **Manquant (UI Utilisateur)** : Le formulaire de création de post en haut du fil d'actualité n'est pas branché à une action serveur pour insérer un vrai `post` dans la DB.
- **Manquant (Images)** : Téléchargement et attachement d'images aux posts (`image_urls`).

### 4. 🗃️ Nouvelles traductions et Champs Générés
Les tables comme `species` et `ecosystems` utilisent des champs générés (ex: `name_default`). Il faut s'assurer que :
- **Manquant (Backend)** : Le typage Drizzle (`schema.ts`) marque correctement ces champs (`generatedAlwaysAs`), mais les requêtes frontend de recherche ne tirent pas systématiquement avantage des `search_vector` ou des champs par défaut mis en place.

---

### 💡 Prochaines Étapes Suggérées

Quelle partie souhaite-tu que l'on commence à implémenter et câbler complètement ?
1. **L'inventaire et les Quêtes** (Faire un composant visuel d'inventaire sur le dashboard).
2. **Le Fil d'actualité** (Permettre de poster, commenter, et gérer les likes avec coût d'inventaire).
3. **Les Écosystèmes** (Créer l'interface pour lier les projets à leurs écosystèmes physiquements).
