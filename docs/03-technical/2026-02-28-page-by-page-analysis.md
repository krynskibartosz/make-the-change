# Analyse Page par Page - État Actuel vs Spécification Cohérente

---

## 🎯 **Objectif**

Analyser chaque page clé pour identifier les données manquantes par rapport à la spécification "Données Affichées Cohérentes".

---

## 📊 **Synthèse des Résultats**

| Page | Score Cohérence | Données Manquantes | Priorité |
|------|----------------|-------------------|----------|
| **Project** | 30% | Espèces, Challenges, Produits, Impact | 🔴 **Haute** |
| **Product** | 40% | Projets soutenus, Espèces, Impact détaillé | 🔴 **Haute** |
| **BioDex** | 25% | Projets associés, Progression utilisateur | 🟡 **Moyenne** |
| **Community** | 20% | Badge source, Entité liée | 🟡 **Moyenne** |
| **Profile** | 35% | Décomposition score, Espèces, Challenges | 🟡 **Moyenne** |
| **Leaderboard** | 10% | Score expliqué, Pourquoi du rang | 🔴 **Haute** |

---

## 🔍 **Analyse Détaillée par Page**

### **1. Page Project (/projects/[slug])**

#### **✅ Données Présentes**
- **Identité**: `id`, `slug`, `name`, `description`, `status`, `type`
- **Producteur**: `producer.id`, `producer.name`, `producer.images`, `producer.contact_website`
- **Financement**: `current_funding`, `target_budget`, progression
- **Écosystème**: `ecosystem_id`, `properties` (parcelles)
- **Médias**: `hero_image_url`, `images[]`

#### **❌ Données Manquantes Critiques**
- **Espèces**: Aucune information sur les espèces (principale/secondaires)
- **Challenges**: Pas de challenges liés au projet
- **Produits**: Pas de produits du producteur associés
- **Impact concret**: Pas de métriques d'impact (CO2, biodiversité, emplois)
- **Communauté**: Pas de stats posts, membres actifs, guildes
- **Actions utilisateur**: Pas d'état de participation utilisateur
- **Prochaines actions**: Pas de CTAs contextuels

#### **📋 Type Actuel vs Spécification**
```typescript
// Actuel (PublicProject)
type PublicProject = {
  id: string
  slug: string
  name_default: string
  description_default: string
  producer: ProjectProducer | null
  current_funding: number | null
  target_budget: number | null
  // ... basique
}

// Spécification (ProjectContext)
type ProjectContext = {
  // Identité ✅
  id: string
  name: string
  // Porteur ✅ (partiel)
  producer: { id, name, avatar, location, verified, totalProjects, successRate }
  // Espèces ❌ (manquant)
  primarySpecies: { id, name, scientificName, icon, rarity, status }
  secondarySpecies: Array<{ id, name, icon, role }>
  // Challenges ❌ (manquant)
  challenges: Array<{ id, name, type, difficulty, progress, userParticipation }>
  // Produits ❌ (manquant)
  producerProducts: Array<{ id, name, price, category, impactPercentage }>
  // Impact ❌ (manquant)
  expectedImpact: { co2Absorbed, biodiversityGain, jobsCreated, timeline }
  // Actions utilisateur ❌ (manquant)
  userActions: { isBacked, backedAmount, isFollowing, completedChallenges }
  // Prochaines actions ❌ (manquant)
  nextActions: Array<{ type, title, description, cta, priority }>
}
```

---

### **2. Page Product (/products/[id])**

#### **✅ Données Présentes**
- **Identité**: `id`, `name`, `slug`, `description`, `category`, `tags`
- **Producteur**: `producer.id`, `producer.name`, `producer.description`, `producer.location`
- **Prix**: `price_points`, `price_eur_equivalent`, `stock_quantity`
- **Médias**: `image_url`, `images[]`, `certifications`
- **Fulfillment**: `fulfillment_method`

#### **❌ Données Manquantes Critiques**
- **Projets soutenus**: Aucun lien vers les projets financés par ce produit
- **Espèces liées**: Pas d'information sur les espèces impactées
- **Impact détaillé**: Pas de métriques environnementales/sociales/économiques
- **Compatibilité BioDex**: Pas de lien avec le système de déblocage d'espèces
- **Communauté**: Pas de reviews, testimonials, posts
- **Actions utilisateur**: Pas d'état d'achat, wishlist, review
- **Raison d'impact**: Pas d'histoire sur l'impact du produit

#### **📋 Type Actuel vs Spécification**
```typescript
// Actuel (ProductWithRelations)
type ProductWithRelations = {
  id: string
  name_default: string
  description_default: string
  producer: ProductProducer | null
  category: ProductCategory | null
  price_points: number | null
  stock_quantity: number | null
  // ... basique
}

// Spécification (ProductContext)
type ProductContext = {
  // Identité ✅
  id: string
  name: string
  // Producteur ✅ (partiel)
  producer: { id, name, avatar, location, verified, story }
  // Projets soutenus ❌ (manquant)
  supportedProjects: Array<{ id, name, impactPercentage, ecosystem, status }>
  // Espèces liées ❌ (manquant)
  linkedSpecies: Array<{ id, name, icon, relationship, impact }>
  // Impact ❌ (manquant)
  impact: {
    environmental: { co2Footprint, waterUsage, biodiversityImpact, recyclability }
    social: { localJobs, fairTrade, communitySupport }
    economic: { localRevenue, profitSharing, pricePremium }
  }
  // Compatibilité BioDex ❌ (manquant)
  biodexCompatibility: { speciesUnlocked, challengesEnabled, badgeEarned }
  // Actions utilisateur ❌ (manquant)
  userActions: { isPurchased, isWishlisted, isReviewed, speciesUnlocked }
  // Raison d'impact ❌ (manquant)
  impactStory: { problem, solution, results, verification }
}
```

---

### **3. Page BioDex (/biodex)**

#### **✅ Données Présentes**
- **Identité espèce**: `id`, `name`, `scientific_name`, `description`
- **Taxonomie**: `family` (via `content_levels.family`)
- **Conservation**: `conservation_status`
- **Filtres**: Recherche par nom, description, famille, statut
- **Pagination**: Grid responsive avec filtres

#### **❌ Données Manquantes Critiques**
- **Projets associés**: Aucun lien vers les projets liés à l'espèce
- **Producteurs associés**: Pas d'information sur les producteurs impliqués
- **Challenges associés**: Pas de challenges liés à l'espèce
- **Statut utilisateur**: Pas d'information sur les espèces débloquées par l'utilisateur
- **Source de déblocage**: Pas de traçabilité de comment l'espèce a été débloquée
- **Progression**: Pas de niveau, observations, contributions
- **Actions utilisateur**: Pas de CTAs pour observer, reporter, contribuer
- **Médias**: Pas d'images, vidéos, sons, documents

#### **📋 Type Actuel vs Spécification**
```typescript
// Actuel (Species)
type Species = {
  id: string
  name_default: string
  scientific_name: string
  description_default: string
  conservation_status: string
  content_levels: { family: string }
  // ... basique
}

// Spécification (SpeciesContext)
type SpeciesContext = {
  // Identité ✅
  id: string
  name: string
  scientificName: string
  // Taxonomie ✅ (partiel)
  taxonomy: { kingdom, phylum, class, order, family, genus, species }
  // Conservation ✅
  conservation: { status, trend, population, threats, protections }
  // Projets associés ❌ (manquant)
  associatedProjects: Array<{ id, name, type, role, impact, userParticipation }>
  // Producteurs associés ❌ (manquant)
  associatedProducers: Array<{ id, name, location, relationship, projects }>
  // Challenges associés ❌ (manquant)
  associatedChallenges: Array<{ id, name, type, difficulty, rewards, userProgress }>
  // Statut utilisateur ❌ (manquant)
  userStatus: { isUnlocked, unlockedDate, unlockSource, progressionLevel }
  // Source de déblocage ❌ (manquant)
  unlockSource: { type, sourceId, sourceName, date, requirements }
  // Actions utilisateur ❌ (manquant)
  userActions: { canObserve, canReport, canContribute, nextObservation }
}
```

---

### **4. Page Community (/community)**

#### **✅ Données Présentes**
- **Feed**: Posts avec pagination, filtres (sort, scope, contributors)
- **Contrôles**: Recherche par hashtag, filtres de contribution
- **Navigation**: Liens vers likes, bookmarks
- **User state**: Information sur si l'utilisateur est connecté

#### **❌ Données Manquantes Critiques**
- **Badge source**: Aucun badge indiquant l'entité métier source (Projet, Espèce, Challenge, Producteur, Guilde)
- **Entité liée**: Pas de lien vers l'entité métier associée au post
- **Contexte additionnel**: Pas de contexte spécifique selon le type de post
- **Actions disponibles**: Pas d'actions contextuelles basées sur l'entité
- **Lien vers entité**: Pas de lien direct vers l'entité source

#### **📋 Type Actuel vs Spécification**
```typescript
// Actuel (Feed générique)
type FeedPost = {
  id: string
  content: string
  author: { id, name, avatar }
  engagement: { likes, comments, shares }
  // ... basique
}

// Spécification (PostContext)
type PostContext = {
  // Identité ✅
  id: string
  content: string
  type: 'user_post' | 'project_update' | 'species_discovery' | 'challenge_completion'
  // Badge source ❌ (manquant)
  sourceBadge: { type, id, name, icon, color, link }
  // Entité liée ❌ (manquant)
  linkedEntity: { type, id, name, description, image, link }
  // Contexte additionnel ❌ (manquant)
  context: {
    projectUpdate?: { projectId, projectName, updateType, impact }
    speciesDiscovery?: { speciesId, speciesName, location, verified }
    challengeCompletion?: { challengeId, challengeName, difficulty, rewards }
    productReview?: { productId, productName, rating, impactFocus }
  }
  // Actions disponibles ❌ (manquant)
  availableActions: Array<{ type, title, description, cta, enabled }>
  // Lien vers entité ❌ (manquant)
  entityLink: { text, url, type }
}
```

---

### **5. Page Profile (/profile/[id])**

#### **✅ Données Présentes**
- **Identité**: `display_name`, `avatar_url`, `cover_url`, `level`
- **Score**: `impact_score`, `points_balance`, progression
- **Investissements**: Projets soutenus avec montants et dates
- **Badges**: Badges de base (projet, investisseur, top)
- **Activité**: Feed social de l'utilisateur
- **Informations**: Ville, pays, date d'inscription

#### **❌ Données Manquantes Critiques**
- **Décomposition score**: Pas de breakdown Impact/Communauté/BioDex
- **Espèces débloquées**: Aucune information sur les espèces du BioDex
- **Challenges complétés**: Pas de liste des challenges terminés
- **Impact tangible**: Pas de métriques concrètes (CO2, arbres, espèces protégées)
- **Progression mensuelle**: Pas d'historique de progression
- **Actions utilisateur**: Pas de prochaines actions personnalisées

#### **📋 Type Actuel vs Spécification**
```typescript
// Actuel (Profile basique)
type ProfileData = {
  display_name: string
  impact_score: number
  points_balance: number
  projects_count: number
  total_invested_eur: number
  investments: Array<{ project, amount, date }>
  // ... basique
}

// Spécification (UserImpactContext)
type UserImpactContext = {
  // Identité ✅
  userId: string
  userName: string
  // Score global ✅
  globalScore: { total, rank, percentile, change }
  // Décomposition Impact ❌ (manquant)
  impactBreakdown: {
    projects: { score, projectsSupported, totalFunded, topProjects }
    community: { score, postsCreated, postsEngaged, guildsJoined }
    biodex: { score, speciesUnlocked, totalSpecies, observationsCount }
    products: { score, productsPurchased, sustainableChoices }
  }
  // Espèces débloquées ❌ (manquant)
  unlockedSpecies: Array<{ id, name, icon, rarity, unlockedDate, unlockSource }>
  // Projets soutenus ✅ (partiel)
  supportedProjects: Array<{ id, name, amount, status, impact, rewards }>
  // Challenges complétés ❌ (manquant)
  completedChallenges: Array<{ id, name, type, difficulty, completionDate, rewards }>
  // Impact tangible ❌ (manquant)
  tangibleImpact: { co2Absorbed, treesPlanted, speciesProtected, jobsCreated }
  // Prochaines actions ❌ (manquant)
  nextActions: Array<{ type, title, description, cta, impact, priority }>
}
```

---

### **6. Page Leaderboard (/leaderboard)**

#### **✅ Données Présentes**
- *Non implémenté ou non trouvé dans l'analyse*

#### **❌ Données Manquantes Critiques**
- **Score expliqué**: Aucune décomposition du score
- **Pourquoi du rang**: Pas d'explication des critères de classement
- **Catégories**: Pas de classement par type d'impact
- **Progression**: Pas d'historique ou tendance
- **Contexte**: Pas de lien vers les réalisations spécifiques

---

## 🚀 **Plan d'Action Prioritaire**

### **Phase 1: Foundation (Haute Priorité)**

#### **1. Améliorer Page Project**
```sql
-- Ajouter les tables manquantes
CREATE TABLE project_species (
  project_id UUID REFERENCES projects(id),
  species_id UUID REFERENCES species(id),
  role VARCHAR(20) CHECK (role IN ('primary', 'secondary', 'indicator')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE project_challenges (
  project_id UUID REFERENCES projects(id),
  challenge_id UUID REFERENCES challenges(id),
  difficulty VARCHAR(10),
  user_participation BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE project_impact_metrics (
  project_id UUID REFERENCES projects(id),
  co2_absorbed DECIMAL(10,2),
  biodiversity_gain INTEGER,
  jobs_created INTEGER,
  timeline_months INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **2. Améliorer Page Product**
```sql
-- Ajouter les relations manquantes
CREATE TABLE product_supported_projects (
  product_id UUID REFERENCES products(id),
  project_id UUID REFERENCES projects(id),
  impact_percentage DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product_linked_species (
  product_id UUID REFERENCES products(id),
  species_id UUID REFERENCES species(id),
  relationship VARCHAR(20),
  impact_type VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product_impact_metrics (
  product_id UUID REFERENCES products(id),
  co2_footprint DECIMAL(10,2),
  water_usage DECIMAL(10,2),
  biodiversity_impact VARCHAR(20),
  recyclability INTEGER,
  local_jobs INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **3. Améliorer Page BioDex**
```sql
-- Ajouter les relations manquantes
CREATE TABLE species_associated_projects (
  species_id UUID REFERENCES species(id),
  project_id UUID REFERENCES projects(id),
  role VARCHAR(20),
  impact VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE species_user_progress (
  user_id UUID REFERENCES auth.users(id),
  species_id UUID REFERENCES species(id),
  is_unlocked BOOLEAN DEFAULT FALSE,
  unlocked_date TIMESTAMPTZ,
  unlock_source VARCHAR(50),
  observations_count INTEGER DEFAULT 0,
  contributions_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Phase 2: Implementation (Moyenne Priorité)**

#### **4. Améliorer Page Community**
- Ajouter `source_entity_id` et `source_entity_type` aux posts
- Créer les vues pour les badges source
- Implémenter les liens vers les entités

#### **5. Améliorer Page Profile**
- Créer les fonctions de décomposition de score
- Ajouter les tables de progression utilisateur
- Implémenter les métriques d'impact tangible

#### **6. Implémenter Page Leaderboard**
- Créer la vue des scores décomposés
- Implémenter les classements par catégorie
- Ajouter les tendances et progression

### **Phase 3: Integration (Basse Priorité)**

#### **7. Navigation Transverse**
- Implémenter les liens entre entités
- Créer les composants de contexte partagés
- Ajouter les actions contextuelles unifiées

#### **8. Actions Utilisateur**
- Centraliser l'état utilisateur
- Implémenter les prochaines actions intelligentes
- Ajouter le suivi d'impact en temps réel

---

## 📈 **Métriques de Succès**

### **Court Terme (1-2 mois)**
- **Project**: 60% des champs de ProjectContext implémentés
- **Product**: 70% des champs de ProductContext implémentés
- **BioDex**: 50% des champs de SpeciesContext implémentés

### **Moyen Terme (3-6 mois)**
- **Community**: 80% des champs de PostContext implémentés
- **Profile**: 70% des champs de UserImpactContext implémentés
- **Leaderboard**: 60% de fonctionnalité implémentée

### **Long Terme (6+ mois)**
- **Cohérence 100%**: Toutes les entités liées visibles
- **Navigation transverse**: Liens entre toutes les pages
- **Impact tracking**: Métriques en temps réel

---

## 🎯 **Conclusion**

L'analyse révèle un **décalage significatif** entre l'état actuel et la spécification cohérente. Les pages les plus critiques (Project, Product, Leaderboard) nécessitent une attention immédiate, tandis que les pages communautaires peuvent être améliorées progressivement.

**Recommandation**: Commencer par la Phase 1 (Foundation) pour établir les relations de base, puis implémenter progressivement les fonctionnalités avancées de contexte utilisateur et de navigation transverse.
