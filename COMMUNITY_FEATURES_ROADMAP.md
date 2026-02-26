# Roadmap Fonctionnalités Communautaires & Engagement

Ce document détaille une stratégie produit pour transformer **Make the Change** d'une plateforme d'investissement individuelle en une **communauté vibrante et engagée**.

L'objectif est de créer des boucles de rétention (retention loops) basées sur la preuve sociale, la gamification collaborative et la transparence radicale.

---

## 🏗 Phase 1 : Fondations "Sociales" (Quick Wins)
*Objectif : Rendre visible l'activité existante pour créer un sentiment de vie sur la plateforme.*

### 1.1. Le "Project Feed" Interactif
Actuellement, `investment.project_updates` permet aux producteurs de poster des nouvelles. Il faut le transformer en réseau social vertical.
- **Amélioration DB :** Créer un schéma `social` pour gérer les interactions.
    - Table `social.comments` (liée à `project_updates`).
    - Table `social.reactions` (Like, Love, Seed, Water - des réactions thématiques).
- **Frontend :**
    - Ajouter une section "Commentaires" sous chaque mise à jour de projet.
    - Permettre aux investisseurs de poser des questions directement sur une update ("Q&A Contextuel").

### 1.2. Profils Publics "Impact Identity"
Transformer le profil privé en une page publique partageable (comme LinkedIn/Strava pour l'écologie).
- **Fonctionnalités :**
    - **Showcase :** Afficher la "Forêt Virtuelle" (tous les projets soutenus).
    - **Badges & Trophées :** Afficher les accomplissements du module `gamification` (ex: "Early Adopter", "Protecteur des Abeilles").
    - **Impact Resume :** Un résumé généré automatiquement : "J'ai compensé 4T de CO2 et soutenu 3 agriculteurs cette année."
- **Viralité :** Bouton "Partager mon Impact" générant une image OpenGraph dynamique pour les réseaux sociaux.

### 1.3. Certificats de Propriété 2.0
S'inspirer de Tree-Nation mais aller plus loin avec la technologie Blockchain (optionnel) ou simplement des URLs uniques sécurisées.
- **Design :** Un certificat PDF/Web ultra-esthétique pour *chaque* investissement.
- **Data :** Inclure les coordonnées GPS précises, la date de plantation, et l'espèce.
- **Gifting :** Flux "Offrir cet arbre" qui transfère le certificat (et l'entrée dans le Biodex) à un ami par email.

---

## 🚀 Phase 2 : Engagement Communautaire (Growth)
*Objectif : Connecter les utilisateurs entre eux, pas seulement aux projets.*

### 2.1. Guildes & Équipes (Team Plant)
Permettre aux utilisateurs de se regrouper pour atteindre des objectifs communs.
- **Cas d'usage :** Entreprises (RSE), Écoles, Familles, ou groupes d'amis.
- **Mécanique :**
    - Créer une "Guilde" (Table `identity.guilds`).
    - Leaderboard inter-guildes ("Quelle entreprise a planté le plus ce mois-ci ?").
    - "Boss Raids" écologiques : "Il manque 5000€ pour financer ce verger avant dimanche. La Guilde qui contribue le plus gagne un badge unique."

### 2.2. Le "Global Feed" (Mur de l'Impact)
Un fil d'actualité personnalisé sur le Dashboard utilisateur (`/dashboard`).
- **Contenu agrégé :**
    - Updates des projets suivis.
    - Activité des amis ("Alice vient d'investir dans le projet Cacao").
    - Nouveaux badges débloqués par la communauté.
    - "Daily Eco-Tip" (Contenu éducatif court).

### 2.3. Parrainage Gamifié ("Seed Spreading")
Au lieu d'un simple lien de parrainage, donner des "Graines Virtuelles" aux utilisateurs actifs.
- **Mécanique :**
    - "Tu as gagné 3 graines de Chêne. Offre-les à 3 amis pour qu'ils plantent leur premier arbre gratuitement."
    - Cela réduit le CAC (Coût d'Acquisition Client) en utilisant le budget marketing pour financer ces "arbres gratuits".

---

## 🔭 Phase 3 : Immersion & Gouvernance (Moonshots)
*Objectif : Impliquer les utilisateurs dans la vie réelle des projets.*

### 3.1. Live "Vis ma vie de Producteur"
Intégration vidéo/streaming.
- **Concept :** Une fois par mois, un producteur fait un live depuis son champ.
- **Interaction :** Les investisseurs peuvent poser des questions en direct.
- **Tech :** Utilisation de Mux ou Cloudflare Stream pour le delivery vidéo.

### 3.2. Gouvernance Participative (DAO Lite)
Donner un pouvoir de décision aux "Gros Investisseurs" ou aux membres très actifs.
- **Vote :** "Quel devrait être le prochain projet financé ? (A) Ruches en Bretagne ou (B) Mangrove au Sénégal ?"
- **Sondages Producteurs :** "Pour la prochaine récolte, préférez-vous recevoir le miel en pot de 250g ou 500g ?"

### 3.3. Marketplace Secondaire (Re-sell / Trade)
Si les investissements sont tokenisés (ou simplement gérés en base), permettre l'échange.
- **Concept :** "Je déménage et je ne veux plus recevoir mes paniers de légumes, je revends ma part de production à un autre membre de la communauté."
- **Impact :** Liquidité pour l'investisseur, continuité pour le producteur.

---

## 🛠 Architecture Technique Recommandée

### Schema Updates (Supabase)

```sql
-- Schema SOCIAL pour les interactions
CREATE SCHEMA social;

CREATE TABLE social.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES public.profiles(id),
  project_id UUID REFERENCES investment.projects(id), -- Optionnel
  content TEXT NOT NULL,
  media_urls TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE social.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES social.posts(id), -- Ou project_updates
  user_id UUID REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE social.reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type TEXT NOT NULL, -- 'post', 'update', 'comment'
  target_id UUID NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  reaction_type TEXT NOT NULL, -- 'like', 'love', 'seed', 'water'
  UNIQUE(target_type, target_id, user_id)
);

CREATE TABLE identity.guilds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  owner_id UUID REFERENCES public.profiles(id),
  is_private BOOLEAN DEFAULT false
);

CREATE TABLE identity.guild_members (
  guild_id UUID REFERENCES identity.guilds(id),
  user_id UUID REFERENCES public.profiles(id),
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (guild_id, user_id)
);
```

### Stack Frontend
- **Feed :** Utiliser `@tanstack/react-query` avec "Infinite Scroll" pour charger le flux d'actualité de manière performante.
- **Temps Réel :** Utiliser **Supabase Realtime** pour afficher les notifications et les nouveaux commentaires sans recharger la page.
- **Rich Text :** Étendre l'éditeur **Tiptap** existant pour permettre aux utilisateurs de mentionner (@user) ou de lier des projets (#project) dans leurs commentaires.
