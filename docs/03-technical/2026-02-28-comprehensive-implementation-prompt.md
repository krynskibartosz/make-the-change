# 🚀 PROMPT COMPLET - IMPLEMENTATION DONNÉES COHÉRENTES

---

## 🎯 **MISSION PRINCIPALE**

Tu es un **expert en architecture de données et développement full-stack** spécialisé dans les écosystèmes web complexes. Ta mission est d'implémenter une **cohérence relationnelle parfaite** entre toutes les pages de l'application Make The Change, en suivant la spécification "Données Affichées Cohérentes".

---

## 📋 **CONTEXTE DU PROJET**

Make The Change est une plateforme web qui connecte :
- **Projets de reforestation** et **investissement citoyen**
- **Produits durables** de producteurs locaux
- **BioDex** (Pokédex de la biodiversité)
- **Communauté** sociale avec posts, guildes, hashtags
- **Profils utilisateurs** avec scores d'impact
- **Leaderboard** de classement par impact

Le problème actuel : **manque de liens visibles** entre les mêmes entités selon les pages, créant une expérience fragmentée.

---

## 🏗️ **SPÉCIFICATION À IMPLÉMENTER**

Tu dois implémenter les 5 objets de contexte transverse :

### **1. ProjectContext**
```typescript
interface ProjectContext {
  // Identité ✅ (déjà existant)
  id, name, slug, description, status, type
  
  // Porteur ✅ (partiellement existant)
  producer: { id, name, avatar, location, verified, totalProjects, successRate }
  
  // Impact & Écosystème ✅ (partiellement existant)
  ecosystem: { id, name, biome, area, coordinates }
  
  // ❌ MANQUE - Espèces (CRITIQUE)
  primarySpecies: { id, name, scientificName, icon, rarity, status }
  secondarySpecies: Array<{ id, name, icon, role }>
  
  // ❌ MANQUE - Challenges Liés (CRITIQUE)
  challenges: Array<{ id, name, type, difficulty, progress, userParticipation }>
  
  // ❌ MANQUE - Produits du Producteur (CRITIQUE)
  producerProducts: Array<{ id, name, price, category, impactPercentage }>
  
  // ❌ MANQUE - Impact Concret (CRITIQUE)
  expectedImpact: { co2Absorbed, biodiversityGain, jobsCreated, timeline }
  
  // ❌ MANQUE - Communauté (MOYEN)
  community: { posts, activeMembers, guilds, hashtags }
  
  // ❌ MANQUE - Actions Utilisateur (CRITIQUE)
  userActions: { isBacked, backedAmount, isFollowing, completedChallenges }
  
  // ❌ MANQUE - Prochaines Actions (CRITIQUE)
  nextActions: Array<{ type, title, description, cta, priority }>
}
```

### **2. ProductContext**
```typescript
interface ProductContext {
  // Identité ✅ (déjà existant)
  id, name, slug, description, category, tags
  
  // Producteur ✅ (déjà existant)
  producer: { id, name, avatar, location, verified, story }
  
  // ❌ MANQUE - Projets Soutenus (CRITIQUE)
  supportedProjects: Array<{ id, name, impactPercentage, ecosystem, status }>
  
  // ❌ MANQUE - Espèces Liées (CRITIQUE)
  linkedSpecies: Array<{ id, name, icon, relationship, impact }>
  
  // ❌ MANQUE - Impact Détaillé (CRITIQUE)
  impact: {
    environmental: { co2Footprint, waterUsage, biodiversityImpact, recyclability }
    social: { localJobs, fairTrade, communitySupport }
    economic: { localRevenue, profitSharing, pricePremium }
  }
  
  // ❌ MANQUE - Compatibilité BioDex (CRITIQUE)
  biodexCompatibility: { speciesUnlocked, challengesEnabled, badgeEarned }
  
  // ❌ MANQUE - Actions Utilisateur (MOYEN)
  userActions: { isPurchased, purchaseDate, isWishlisted, isReviewed }
  
  // ❌ MANQUE - Raison d'Impact (CRITIQUE)
  impactStory: { problem, solution, results, verification }
}
```

### **3. SpeciesContext**
```typescript
interface SpeciesContext {
  // Identité ✅ (déjà existant)
  id, name, scientificName, description, category
  
  // Taxonomie ✅ (partiellement existant)
  taxonomy: { kingdom, phylum, class, order, family, genus, species }
  
  // Conservation ✅ (déjà existant)
  conservation: { status, trend, population, threats, protections }
  
  // ❌ MANQUE - Projets Associés (CRITIQUE)
  associatedProjects: Array<{ id, name, type, role, impact, userParticipation }>
  
  // ❌ MANQUE - Producteurs Associés (CRITIQUE)
  associatedProducers: Array<{ id, name, location, relationship, projects }>
  
  // ❌ MANQUE - Challenges Associés (CRITIQUE)
  associatedChallenges: Array<{ id, name, type, difficulty, rewards, userProgress }>
  
  // ❌ MANQUE - Statut Utilisateur (CRITIQUE)
  userStatus: { isUnlocked, unlockedDate, unlockSource, progressionLevel }
  
  // ❌ MANQUE - Source de Déblocage (CRITIQUE)
  unlockSource: { type, sourceId, sourceName, date, requirements }
  
  // ❌ MANQUE - Actions Utilisateur (MOYEN)
  userActions: { canObserve, canReport, canContribute, nextObservation }
}
```

### **4. UserImpactContext**
```typescript
interface UserImpactContext {
  // Identité ✅ (déjà existant)
  userId, userName, avatar, joinDate, level
  
  // Score Global ✅ (déjà existant)
  globalScore: { total, rank, percentile, change }
  
  // ❌ MANQUE - Décomposition Impact (CRITIQUE)
  impactBreakdown: {
    projects: { score, projectsSupported, totalFunded, topProjects }
    community: { score, postsCreated, postsEngaged, guildsJoined }
    biodex: { score, speciesUnlocked, totalSpecies, observationsCount }
    products: { score, productsPurchased, sustainableChoices }
  }
  
  // ❌ MANQUE - Espèces Débloquées (CRITIQUE)
  unlockedSpecies: Array<{ id, name, icon, rarity, unlockedDate, unlockSource }>
  
  // ✅ Projets Soutenus (déjà existant, partiel)
  supportedProjects: Array<{ id, name, amount, status, impact, rewards }>
  
  // ❌ MANQUE - Challenges Complétés (CRITIQUE)
  completedChallenges: Array<{ id, name, type, difficulty, completionDate, rewards }>
  
  // ❌ MANQUE - Impact Tangible (CRITIQUE)
  tangibleImpact: { co2Absorbed, treesPlanted, speciesProtected, jobsCreated }
  
  // ❌ MANQUE - Prochaines Actions (CRITIQUE)
  nextActions: Array<{ type, title, description, cta, impact, priority }>
}
```

### **5. PostContext**
```typescript
interface PostContext {
  // Identité ✅ (déjà existant)
  id, content, type, visibility, createdAt, author
  
  // ❌ MANQUE - Badge Source (CRITIQUE)
  sourceBadge: { type, id, name, icon, color, link }
  
  // ❌ MANQUE - Entité Liée (CRITIQUE)
  linkedEntity: { type, id, name, description, image, link }
  
  // Engagement ✅ (déjà existant)
  engagement: { likes, comments, shares, bookmarks, views }
  
  // ❌ MANQUE - Contexte Additionnel (CRITIQUE)
  context: {
    projectUpdate?: { projectId, projectName, updateType, impact }
    speciesDiscovery?: { speciesId, speciesName, location, verified }
    challengeCompletion?: { challengeId, challengeName, difficulty, rewards }
    productReview?: { productId, productName, rating, impactFocus }
  }
  
  // ❌ MANQUE - Actions Disponibles (MOYEN)
  availableActions: Array<{ type, title, description, cta, enabled }>
  
  // ❌ MANQUE - Lien vers Entité (CRITIQUE)
  entityLink: { text, url, type }
}
```

---

## 🎯 **PLAN D'ACTION DÉTAILLÉ**

### **PHASE 1: ANALYSE COMPLÈTE (Jour 1)**

#### **1.1 Audit des Pages Existantes**
Pour chaque page clé, analyse :
- **Project** `/projects/[slug]` → `project-details.tsx` + `project-detail-data.ts`
- **Product** `/products/[id]` → `product-details.tsx` + `product-detail-data.ts`
- **BioDex** `/biodex` → `biodex-client.tsx`
- **Community** `/community` → `page.tsx` + composants Feed
- **Profile** `/profile/[id]` → `page.tsx`
- **Leaderboard** `/leaderboard` → à vérifier

**Pour chaque page, documente :**
- ✅ Données déjà présentes (types, composants, API)
- ❌ Données manquantes par rapport à la spécification
- 🔧 Modifications nécessaires (types, composants, API)
- 📊 Score de complétude (0-100%)

#### **1.2 Audit de la Base de Données**
Analyse les tables existantes :
- ✅ Tables déjà existantes avec leurs colonnes
- ❌ Tables manquantes à créer
- 🔸 Relations manquantes entre tables
- 📈 Index nécessaires pour la performance

#### **1.3 Audit des APIs et Services**
Vérifie :
- ✅ Endpoints déjà existants
- ❌ Endpoints manquants à créer
- 🔧 Modifications nécessaires sur les endpoints existants
- 📊 Performance et cache nécessaires

---

### **PHASE 2: INFRASTRUCTURE BASE (Jours 2-3)**

#### **2.1 Création des Tables Manquantes**
```sql
-- Relations Projets-Espèces
CREATE TABLE IF NOT EXISTS project_species (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  species_id UUID NOT NULL REFERENCES species(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('primary', 'secondary', 'indicator', 'keystone')),
  impact_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, species_id, role)
);

-- Relations Projets-Challenges
CREATE TABLE IF NOT EXISTS project_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  difficulty VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  user_participation BOOLEAN DEFAULT FALSE,
  progression_required INTEGER DEFAULT 0,
  rewards JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, challenge_id)
);

-- Métriques d'Impact Projets
CREATE TABLE IF NOT EXISTS project_impact_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  co2_absorbed_kg DECIMAL(12,2),
  biodiversity_gain_points INTEGER,
  jobs_created INTEGER,
  timeline_months INTEGER,
  verification_status VARCHAR(20) DEFAULT 'pending',
  verification_documents JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id)
);

-- Produits - Projets Soutenus
CREATE TABLE IF NOT EXISTS product_supported_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  impact_percentage DECIMAL(5,2) NOT NULL CHECK (impact_percentage >= 0 AND impact_percentage <= 100),
  support_type VARCHAR(20) DEFAULT 'financial',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, project_id)
);

-- Produits - Espèces Liées
CREATE TABLE IF NOT EXISTS product_linked_species (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  species_id UUID NOT NULL REFERENCES species(id) ON DELETE CASCADE,
  relationship VARCHAR(20) NOT NULL CHECK (relationship IN ('direct', 'indirect', 'habitat', 'conservation')),
  impact_type VARCHAR(20) NOT NULL CHECK (impact_type IN ('positive', 'neutral', 'restorative')),
  impact_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, species_id)
);

-- Métriques d'Impact Produits
CREATE TABLE IF NOT EXISTS product_impact_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  co2_footprint_kg DECIMAL(10,2),
  water_usage_liters DECIMAL(10,2),
  biodiversity_impact_score INTEGER CHECK (biodiversity_impact_score >= -10 AND biodiversity_impact_score <= 10),
  recyclability_percentage INTEGER CHECK (recyclability_percentage >= 0 AND recyclability_percentage <= 100),
  local_jobs_created INTEGER,
  local_revenue_eur DECIMAL(12,2),
  profit_sharing_percentage DECIMAL(5,2),
  fair_trade_certified BOOLEAN DEFAULT FALSE,
  community_support_score INTEGER CHECK (community_support_score >= 0 AND community_support_score <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id)
);

-- Espèces - Projets Associés
CREATE TABLE IF NOT EXISTS species_associated_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species_id UUID NOT NULL REFERENCES species(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('primary', 'secondary', 'indicator', 'keystone')),
  impact_type VARCHAR(20) NOT NULL CHECK (impact_type IN ('habitat', 'population', 'research', 'education')),
  impact_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(species_id, project_id)
);

-- Espèces - Producteurs Associés
CREATE TABLE IF NOT EXISTS species_associated_producers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species_id UUID NOT NULL REFERENCES species(id) ON DELETE CASCADE,
  producer_id UUID NOT NULL REFERENCES producers(id) ON DELETE CASCADE,
  relationship VARCHAR(30) NOT NULL CHECK (relationship IN ('habitat_owner', 'conservationist', 'researcher', 'farmer', 'guardian')),
  projects_count INTEGER DEFAULT 0,
  relationship_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(species_id, producer_id)
);

-- Espèces - Challenges Associés
CREATE TABLE IF NOT EXISTS species_associated_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species_id UUID NOT NULL REFERENCES species(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  difficulty VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  rewards JSONB DEFAULT '[]',
  prerequisites JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(species_id, challenge_id)
);

-- Progression Utilisateur - Espèces
CREATE TABLE IF NOT EXISTS user_species_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  species_id UUID NOT NULL REFERENCES species(id) ON DELETE CASCADE,
  is_unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMPTZ,
  unlock_source VARCHAR(50) NOT NULL CHECK (unlock_source IN ('project_completion', 'challenge_success', 'observation_count', 'education_module', 'purchase', 'discovery')),
  unlock_source_id UUID,
  progression_level INTEGER DEFAULT 0 CHECK (progression_level >= 0 AND progression_level <= 100),
  observations_count INTEGER DEFAULT 0,
  contributions_count INTEGER DEFAULT 0,
  last_observation_at TIMESTAMPTZ,
  badges_earned JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, species_id)
);

-- Posts - Entités Source
ALTER TABLE social.posts ADD COLUMN IF NOT EXISTS source_entity_type VARCHAR(20);
ALTER TABLE social.posts ADD COLUMN IF NOT EXISTS source_entity_id UUID;
ALTER TABLE social.posts ADD COLUMN IF NOT EXISTS source_entity_metadata JSONB DEFAULT '{}';

-- Index de performance
CREATE INDEX IF NOT EXISTS idx_project_species_project_id ON project_species(project_id);
CREATE INDEX IF NOT EXISTS idx_project_species_species_id ON project_species(species_id);
CREATE INDEX IF NOT EXISTS idx_product_supported_projects_product_id ON product_supported_projects(product_id);
CREATE INDEX IF NOT EXISTS idx_product_supported_projects_project_id ON product_supported_projects(project_id);
CREATE INDEX IF NOT EXISTS idx_species_associated_projects_species_id ON species_associated_projects(species_id);
CREATE INDEX IF NOT EXISTS idx_user_species_progress_user_id ON user_species_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_species_progress_species_id ON user_species_progress(species_id);
CREATE INDEX IF NOT EXISTS idx_posts_source_entity ON social.posts(source_entity_type, source_entity_id);
```

#### **2.2 Vues SQL Optimisées**
```sql
-- Vue ProjectContext complète
CREATE OR REPLACE VIEW v_project_context AS
SELECT 
  p.*,
  -- Producteur enrichi
  pr.id as producer_id,
  pr.name_default as producer_name,
  pr.contact_website as producer_website,
  pr.total_projects_count,
  pr.success_rate,
  -- Espèces
  (SELECT json_agg(
    json_build_object(
      'id', s.id,
      'name', s.name_default,
      'scientificName', s.scientific_name,
      'icon', s.icon_url,
      'rarity', s.rarity_level,
      'status', s.conservation_status,
      'role', ps.role
    )
  ) FROM project_species ps 
  JOIN species s ON s.id = ps.species_id 
  WHERE ps.project_id = p.id) as species,
  -- Challenges
  (SELECT json_agg(
    json_build_object(
      'id', c.id,
      'name', c.name_default,
      'type', c.type,
      'difficulty', pch.difficulty,
      'userParticipation', pch.user_participation,
      'rewards', pch.rewards
    )
  ) FROM project_challenges pch 
  JOIN challenges c ON c.id = pch.challenge_id 
  WHERE pch.project_id = p.id) as challenges,
  -- Produits du producteur
  (SELECT json_agg(
    json_build_object(
      'id', prod.id,
      'name', prod.name_default,
      'price', prod.price_points,
      'category', cat.name_default,
      'impactPercentage', psp.impact_percentage
    )
  ) FROM product_supported_projects psp 
  JOIN products prod ON prod.id = psp.product_id 
  LEFT JOIN categories cat ON cat.id = prod.category_id 
  WHERE psp.project_id = p.id) as producer_products,
  -- Impact
  (SELECT json_build_object(
    'co2Absorbed', co2_absorbed_kg,
    'biodiversityGain', biodiversity_gain_points,
    'jobsCreated', jobs_created,
    'timeline', timeline_months
  ) FROM project_impact_metrics pim WHERE pim.project_id = p.id) as expected_impact
FROM projects p
LEFT JOIN producers pr ON pr.id = p.producer_id;

-- Vue ProductContext complète
CREATE OR REPLACE VIEW v_product_context AS
SELECT 
  prod.*,
  -- Producteur enrichi
  pr.name_default as producer_name,
  pr.description_default as producer_description,
  pr.contact_website as producer_website,
  pr.location_city,
  pr.location_country,
  -- Projets soutenus
  (SELECT json_agg(
    json_build_object(
      'id', proj.id,
      'name', proj.name_default,
      'impactPercentage', psp.impact_percentage,
      'ecosystem', e.name_default,
      'status', proj.status
    )
  ) FROM product_supported_projects psp 
  JOIN projects proj ON proj.id = psp.project_id 
  LEFT JOIN ecosystems e ON e.id = proj.ecosystem_id 
  WHERE psp.product_id = prod.id) as supported_projects,
  -- Espèces liées
  (SELECT json_agg(
    json_build_object(
      'id', s.id,
      'name', s.name_default,
      'icon', s.icon_url,
      'relationship', pls.relationship,
      'impact', pls.impact_type
    )
  ) FROM product_linked_species pls 
  JOIN species s ON s.id = pls.species_id 
  WHERE pls.product_id = prod.id) as linked_species,
  -- Impact
  (SELECT json_build_object(
    'environmental', json_build_object(
      'co2Footprint', co2_footprint_kg,
      'waterUsage', water_usage_liters,
      'biodiversityImpact', biodiversity_impact_score,
      'recyclability', recyclability_percentage
    ),
    'social', json_build_object(
      'localJobs', local_jobs_created,
      'fairTrade', fair_trade_certified,
      'communitySupport', community_support_score
    ),
    'economic', json_build_object(
      'localRevenue', local_revenue_eur,
      'profitSharing', profit_sharing_percentage,
      'pricePremium', price_eur_equivalent
    )
  ) FROM product_impact_metrics pim WHERE pim.product_id = prod.id) as impact
FROM products prod
LEFT JOIN producers pr ON pr.id = prod.producer_id;

-- Vue SpeciesContext complète
CREATE OR REPLACE VIEW v_species_context AS
SELECT 
  s.*,
  -- Projets associés
  (SELECT json_agg(
    json_build_object(
      'id', p.id,
      'name', p.name_default,
      'type', p.type,
      'role', sap.role,
      'impact', sap.impact_type,
      'userParticipation', EXISTS(
        SELECT 1 FROM investments i 
        WHERE i.project_id = p.id AND i.user_id = auth.uid()
      )
    )
  ) FROM species_associated_projects sap 
  JOIN projects p ON p.id = sap.project_id 
  WHERE sap.species_id = s.id) as associated_projects,
  -- Producteurs associés
  (SELECT json_agg(
    json_build_object(
      'id', pr.id,
      'name', pr.name_default,
      'location', pr.location_city,
      'relationship', sap.relationship,
      'projectsCount', sap.projects_count
    )
  ) FROM species_associated_producers sap 
  JOIN producers pr ON pr.id = sap.producer_id 
  WHERE sap.species_id = s.id) as associated_producers,
  -- Challenges associés
  (SELECT json_agg(
    json_build_object(
      'id', c.id,
      'name', c.name_default,
      'type', c.type,
      'difficulty', sac.difficulty,
      'rewards', sac.rewards,
      'userProgress', json_build_object(
        'completed', EXISTS(
          SELECT 1 FROM user_challenge_progress ucp 
          WHERE ucp.challenge_id = c.id AND ucp.user_id = auth.uid() AND ucp.completed = TRUE
        ),
        'progress', COALESCE(
          (SELECT progression FROM user_challenge_progress ucp 
           WHERE ucp.challenge_id = c.id AND ucp.user_id = auth.uid()), 0
        ),
        'nextAction', 'Continue'
      )
    )
  ) FROM species_associated_challenges sac 
  JOIN challenges c ON c.id = sac.challenge_id 
  WHERE sac.species_id = s.id) as associated_challenges,
  -- Statut utilisateur
  (SELECT json_build_object(
    'isUnlocked', usp.is_unlocked,
    'unlockedDate', usp.unlocked_at,
    'unlockSource', usp.unlock_source,
    'progressionLevel', usp.progression_level,
    'observations', usp.observations_count,
    'contributions', usp.contributions_count
  ) FROM user_species_progress usp 
  WHERE usp.species_id = s.id AND usp.user_id = auth.uid()) as user_status
FROM species s;

-- Vue UserImpactContext complète
CREATE OR REPLACE VIEW v_user_impact_context AS
SELECT 
  u.id as user_id,
  u.raw_user_meta_data->>'display_name' as user_name,
  u.created_at as join_date,
  -- Score global
  COALESCE(up.impact_score, 0) as total_score,
  -- Décomposition impact
  (SELECT json_build_object(
    'projects', json_build_object(
      'score', COALESCE(SUM(i.amount_points), 0),
      'projectsSupported', COUNT(DISTINCT i.project_id),
      'totalFunded', COALESCE(SUM(i.amount_eur_equivalent), 0),
      'topProjects', (
        SELECT json_agg(json_build_object(
          'id', p.id,
          'name', p.name_default,
          'contribution', i.amount_points,
          'impact', 'Conservation'
        )) FROM investments i2 
        JOIN projects p ON p.id = i2.project_id 
        WHERE i2.user_id = u.id 
        ORDER BY i2.amount_points DESC 
        LIMIT 5
      )
    ),
    'community', json_build_object(
      'score', COALESCE(
        (SELECT COUNT(*) FROM social.posts p WHERE p.author_id = u.id) * 10 +
        (SELECT COUNT(*) FROM social.comments c WHERE c.author_id = u.id) * 5, 0
      ),
      'postsCreated', COALESCE((SELECT COUNT(*) FROM social.posts p WHERE p.author_id = u.id), 0),
      'postsEngaged', COALESCE((SELECT COUNT(*) FROM social.reactions r WHERE r.user_id = u.id), 0),
      'guildsJoined', COALESCE((SELECT COUNT(*) FROM social.guild_members gm WHERE gm.user_id = u.id), 0)
    ),
    'biodex', json_build_object(
      'score', COALESCE(usp.total_progression, 0),
      'speciesUnlocked', COALESCE(usp.unlocked_count, 0),
      'totalSpecies', (SELECT COUNT(*) FROM species),
      'observationsCount', COALESCE(usp.total_observations, 0),
      'challengesCompleted', COALESCE(ucp.completed_count, 0)
    ),
    'products', json_build_object(
      'score', COALESCE(op.total_spent_points, 0),
      'productsPurchased', COALESCE(op.purchased_count, 0),
      'sustainableChoices', COALESCE(op.sustainable_count, 0)
    )
  )) as impact_breakdown,
  -- Espèces débloquées
  (SELECT json_agg(
    json_build_object(
      'id', s.id,
      'name', s.name_default,
      'icon', s.icon_url,
      'rarity', s.rarity_level,
      'unlockedDate', usp.unlocked_at,
      'unlockSource', usp.unlock_source
    )
  ) FROM user_species_progress usp 
  JOIN species s ON s.id = usp.species_id 
  WHERE usp.user_id = u.id AND usp.is_unlocked = TRUE) as unlocked_species,
  -- Projets soutenus
  (SELECT json_agg(
    json_build_object(
      'id', p.id,
      'name', p.name_default,
      'amount', i.amount_points,
      'date', i.created_at,
      'status', p.status,
      'impact', 'Investment',
      'rewards', json_build_array('Points', 'Impact')
    )
  ) FROM investments i 
  JOIN projects p ON p.id = i.project_id 
  WHERE i.user_id = u.id 
  ORDER BY i.created_at DESC 
  LIMIT 10) as supported_projects,
  -- Challenges complétés
  (SELECT json_agg(
    json_build_object(
      'id', c.id,
      'name', c.name_default,
      'type', c.type,
      'difficulty', ucp.difficulty,
      'completionDate', ucp.completed_at,
      'rewards', ucp.rewards_earned,
      'impact', 'Challenge completed'
    )
  ) FROM user_challenge_progress ucp 
  JOIN challenges c ON c.id = ucp.challenge_id 
  WHERE ucp.user_id = u.id AND ucp.completed = TRUE) as completed_challenges,
  -- Impact tangible
  (SELECT json_build_object(
    'co2Absorbed', COALESCE(SUM(pim.co2_absorbed_kg), 0),
    'treesPlanted', COALESCE(SUM(pim.biodiversity_gain_points / 10), 0),
    'speciesProtected', COALESCE((SELECT COUNT(*) FROM user_species_progress WHERE user_id = u.id AND is_unlocked = TRUE), 0),
    'jobsCreated', COALESCE(SUM(pim.jobs_created), 0)
  ) FROM investments i 
  JOIN projects p ON p.id = i.project_id 
  LEFT JOIN project_impact_metrics pim ON pim.project_id = p.id 
  WHERE i.user_id = u.id) as tangible_impact
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
LEFT JOIN (
  SELECT 
    user_id,
    SUM(progression_level) as total_progression,
    COUNT(*) FILTER (WHERE is_unlocked = TRUE) as unlocked_count,
    SUM(observations_count) as total_observations
  FROM user_species_progress 
  GROUP BY user_id
) usp ON usp.user_id = u.id
LEFT JOIN (
  SELECT 
    user_id,
    COUNT(*) FILTER (WHERE completed = TRUE) as completed_count
  FROM user_challenge_progress 
  GROUP BY user_id
) ucp ON ucp.user_id = u.id
LEFT JOIN (
  SELECT 
    user_id,
    SUM(amount_points) as total_spent_points,
    COUNT(*) as purchased_count,
    COUNT(*) FILTER (WHERE category_id IN (SELECT id FROM categories WHERE name_default ILIKE '%sustainable%')) as sustainable_count
  FROM orders 
  GROUP BY user_id
) op ON op.user_id = u.id;

-- Vue PostContext complète
CREATE OR REPLACE VIEW v_post_context AS
SELECT 
  p.*,
  a.raw_user_meta_data->>'display_name' as author_name,
  a.raw_user_meta_data->>'avatar_url' as author_avatar,
  -- Badge source
  CASE 
    WHEN p.source_entity_type = 'project' THEN json_build_object(
      'type', 'project',
      'id', p.source_entity_id,
      'name', (SELECT name_default FROM projects WHERE id = p.source_entity_id),
      'icon', '🌱',
      'color', 'green',
      'link', '/projects/' || (SELECT slug FROM projects WHERE id = p.source_entity_id)
    )
    WHEN p.source_entity_type = 'species' THEN json_build_object(
      'type', 'species',
      'id', p.source_entity_id,
      'name', (SELECT name_default FROM species WHERE id = p.source_entity_id),
      'icon', '🦋',
      'color', 'blue',
      'link', '/biodex'
    )
    WHEN p.source_entity_type = 'challenge' THEN json_build_object(
      'type', 'challenge',
      'id', p.source_entity_id,
      'name', (SELECT name_default FROM challenges WHERE id = p.source_entity_id),
      'icon', '🏆',
      'color', 'yellow',
      'link', '/challenges'
    )
    WHEN p.source_entity_type = 'producer' THEN json_build_object(
      'type', 'producer',
      'id', p.source_entity_id,
      'name', (SELECT name_default FROM producers WHERE id = p.source_entity_id),
      'icon', '👨‍🌾',
      'color', 'orange',
      'link', '/producers/' || (SELECT slug FROM producers WHERE id = p.source_entity_id)
    )
    ELSE NULL
  END as source_badge,
  -- Entité liée
  CASE 
    WHEN p.source_entity_type = 'project' THEN json_build_object(
      'type', 'project',
      'id', p.source_entity_id,
      'name', (SELECT name_default FROM projects WHERE id = p.source_entity_id),
      'description', (SELECT description_default FROM projects WHERE id = p.source_entity_id),
      'image', (SELECT hero_image_url FROM projects WHERE id = p.source_entity_id),
      'link', '/projects/' || (SELECT slug FROM projects WHERE id = p.source_entity_id)
    )
    WHEN p.source_entity_type = 'species' THEN json_build_object(
      'type', 'species',
      'id', p.source_entity_id,
      'name', (SELECT name_default FROM species WHERE id = p.source_entity_id),
      'description', (SELECT description_default FROM species WHERE id = p.source_entity_id),
      'image', (SELECT icon_url FROM species WHERE id = p.source_entity_id),
      'link', '/biodex'
    )
    ELSE NULL
  END as linked_entity,
  -- Engagement
  (SELECT json_build_object(
    'likes', (SELECT COUNT(*) FROM social.reactions r WHERE r.post_id = p.id AND r.type = 'like'),
    'comments', (SELECT COUNT(*) FROM social.comments c WHERE c.post_id = p.id),
    'shares', (SELECT COUNT(*) FROM social.post_shares ps WHERE ps.post_id = p.id),
    'bookmarks', (SELECT COUNT(*) FROM social.bookmarks b WHERE b.post_id = p.id),
    'views', COALESCE(p.view_count, 0)
  )) as engagement,
  -- État utilisateur
  (SELECT json_build_object(
    'hasLiked', EXISTS(SELECT 1 FROM social.reactions r WHERE r.post_id = p.id AND r.user_id = auth.uid() AND r.type = 'like'),
    'hasBookmarked', EXISTS(SELECT 1 FROM social.bookmarks b WHERE b.post_id = p.id AND b.user_id = auth.uid()),
    'hasShared', EXISTS(SELECT 1 FROM social.post_shares ps WHERE ps.post_id = p.id AND ps.user_id = auth.uid()),
    'canComment', p.visibility = 'public',
    'canEdit', p.author_id = auth.uid()
  )) as user_state
FROM social.posts p
JOIN auth.users a ON a.id = p.author_id;
```

---

### **PHASE 3: TYPESCRIPT & INTERFACES (Jour 4)**

#### **3.1 Créer les Types Complets**
```typescript
// /types/project-context.ts
export interface ProjectContext {
  id: string
  slug: string
  name: string
  description: string
  status: 'planning' | 'funding' | 'active' | 'completed' | 'paused'
  type: string
  
  // Porteur enrichi
  producer: {
    id: string
    name: string
    avatar: string | null
    location: string
    verified: boolean
    totalProjects: number
    successRate: number
  }
  
  // Écosystème
  ecosystem: {
    id: string
    name: string
    biome: string
    area: number
    coordinates: { lat: number; lng: number }
  }
  
  // Espèces
  species: Array<{
    id: string
    name: string
    scientificName: string
    icon: string | null
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
    status: 'stable' | 'threatened' | 'endangered'
    role: 'primary' | 'secondary' | 'indicator' | 'keystone'
  }>
  
  // Challenges
  challenges: Array<{
    id: string
    name: string
    type: 'conservation' | 'restoration' | 'education'
    difficulty: 'easy' | 'medium' | 'hard'
    userParticipation: boolean
    rewards: any[]
  }>
  
  // Produits du producteur
  producerProducts: Array<{
    id: string
    name: string
    price: number
    category: string
    impactPercentage: number
  }>
  
  // Impact concret
  expectedImpact: {
    co2Absorbed: number | null
    biodiversityGain: number | null
    jobsCreated: number | null
    timeline: number | null
  }
  
  // Communauté
  community: {
    posts: number
    activeMembers: number
    guilds: string[]
    hashtags: string[]
  }
  
  // Actions utilisateur
  userActions: {
    isBacked: boolean
    backedAmount: number
    isFollowing: boolean
    completedChallenges: string[]
    unlockedSpecies: string[]
  }
  
  // Prochaines actions
  nextActions: Array<{
    type: 'fund' | 'join' | 'share' | 'challenge' | 'product'
    title: string
    description: string
    cta: string
    priority: 'high' | 'medium' | 'low'
  }>
}

// /types/product-context.ts
export interface ProductContext {
  id: string
  slug: string
  name: string
  description: string
  category: string
  tags: string[]
  
  // Producteur enrichi
  producer: {
    id: string
    name: string
    avatar: string | null
    location: string
    verified: boolean
    story: string
  }
  
  // Projets soutenus
  supportedProjects: Array<{
    id: string
    name: string
    impactPercentage: number
    ecosystem: string
    status: string
  }>
  
  // Espèces liées
  linkedSpecies: Array<{
    id: string
    name: string
    icon: string | null
    relationship: 'direct' | 'indirect' | 'habitat'
    impact: 'positive' | 'neutral' | 'restorative'
  }>
  
  // Impact détaillé
  impact: {
    environmental: {
      co2Footprint: number | null
      waterUsage: number | null
      biodiversityImpact: number | null
      recyclability: number | null
    }
    social: {
      localJobs: number | null
      fairTrade: boolean
      communitySupport: number | null
    }
    economic: {
      localRevenue: number | null
      profitSharing: number | null
      pricePremium: number | null
    }
  }
  
  // Compatibilité BioDex
  biodexCompatibility: {
    speciesUnlocked: string[]
    challengesEnabled: string[]
    badgeEarned: string
    progressionBonus: number
  }
  
  // Actions utilisateur
  userActions: {
    isPurchased: boolean
    purchaseDate: string | null
    isWishlisted: boolean
    isReviewed: boolean
    speciesUnlocked: string[]
  }
  
  // Raison d'impact
  impactStory: {
    problem: string
    solution: string
    results: string[]
    verification: string
  }
  
  // Prochaines actions
  nextActions: Array<{
    type: 'buy' | 'review' | 'share' | 'producer' | 'project'
    title: string
    description: string
    cta: string
  }>
}

// /types/species-context.ts
export interface SpeciesContext {
  id: string
  name: string
  scientificName: string
  description: string
  category: 'flora' | 'fauna' | 'fungi' | 'microorganism'
  
  // Taxonomie
  taxonomy: {
    kingdom: string
    phylum: string
    class: string
    order: string
    family: string
    genus: string
    species: string
  }
  
  // Conservation
  conservation: {
    status: 'LC' | 'NT' | 'VU' | 'EN' | 'CR' | 'EW' | 'EX'
    trend: 'increasing' | 'stable' | 'decreasing'
    population: number
    threats: string[]
    protections: string[]
  }
  
  // Habitat
  habitat: {
    biomes: string[]
    ecosystems: Array<{
      id: string
      name: string
      area: number
      quality: 'excellent' | 'good' | 'fair' | 'poor'
    }>
    distribution: {
      native: string[]
      introduced: string[]
      coordinates: { lat: number; lng: number }[]
    }
  }
  
  // Projets associés
  associatedProjects: Array<{
    id: string
    name: string
    type: 'conservation' | 'restoration' | 'research' | 'education'
    role: 'primary' | 'secondary' | 'indicator'
    impact: 'habitat' | 'population' | 'research' | 'education'
    userParticipation: boolean
  }>
  
  // Producteurs associés
  associatedProducers: Array<{
    id: string
    name: string
    location: string
    relationship: 'habitat_owner' | 'conservationist' | 'researcher'
    projectsCount: number
  }>
  
  // Challenges associés
  associatedChallenges: Array<{
    id: string
    name: string
    type: 'observation' | 'conservation' | 'education' | 'research'
    difficulty: string
    rewards: any[]
    userProgress: {
      completed: boolean
      progress: number
      nextAction: string
    }
  }>
  
  // Statut utilisateur
  userStatus: {
    isUnlocked: boolean
    unlockedDate: string | null
    unlockSource: 'project_completion' | 'challenge_success' | 'observation_count' | 'education_module'
    progressionLevel: number
    observations: number
    contributions: number
  }
  
  // Médias
  media: {
    images: string[]
    videos: string[]
    sounds: string[]
    documents: string[]
  }
  
  // Actions utilisateur
  userActions: {
    canObserve: boolean
    canReport: boolean
    canContribute: boolean
    nextObservation: string
  }
  
  // Prochaines actions
  nextActions: Array<{
    type: 'observe' | 'report' | 'project' | 'challenge' | 'learn'
    title: string
    description: string
    cta: string
    priority: string
  }>
}

// /types/user-impact-context.ts
export interface UserImpactContext {
  userId: string
  userName: string
  avatar: string | null
  joinDate: string
  level: number
  
  // Score global
  globalScore: {
    total: number
    rank: number
    percentile: number
    change: {
      daily: number
      weekly: number
      monthly: number
    }
  }
  
  // Décomposition impact
  impactBreakdown: {
    projects: {
      score: number
      projectsSupported: number
      totalFunded: number
      topProjects: Array<{
        id: string
        name: string
        contribution: number
        impact: string
      }>
    }
    community: {
      score: number
      postsCreated: number
      postsEngaged: number
      guildsJoined: number
      mentorshipHours: number
      topContributions: Array<{
        type: 'post' | 'comment' | 'mentorship'
        title: string
        engagement: number
        impact: string
      }>
    }
    biodex: {
      score: number
      speciesUnlocked: number
      totalSpecies: number
      observationsCount: number
      challengesCompleted: number
      rareSpeciesUnlocked: string[]
      topDiscoveries: Array<{
        speciesId: string
        speciesName: string
        date: string
        rarity: string
        impact: string
      }>
    }
    products: {
      score: number
      productsPurchased: number
      sustainableChoices: number
      localProducerSupport: number
      impactPurchases: Array<{
        productId: string
        productName: string
        impact: number
        date: string
      }>
    }
  }
  
  // Espèces débloquées
  unlockedSpecies: Array<{
    id: string
    name: string
    icon: string | null
    rarity: string
    unlockedDate: string
    unlockSource: string
    observations: number
    contributions: number
  }>
  
  // Projets soutenus
  supportedProjects: Array<{
    id: string
    name: string
    amount: number
    date: string
    status: string
    impact: string
    rewards: string[]
  }>
  
  // Challenges complétés
  completedChallenges: Array<{
    id: string
    name: string
    type: string
    difficulty: string
    completionDate: string
    rewards: string[]
    impact: string
  }>
  
  // Badges
  badges: Array<{
    id: string
    name: string
    description: string
    icon: string
    earnedDate: string
    rarity: string
    category: string
  }>
  
  // Impact tangible
  tangibleImpact: {
    co2Absorbed: number
    treesPlanted: number
    speciesProtected: number
    habitatsRestored: number
    localJobsSupported: number
    educationHours: number
  }
  
  // Prochaines actions
  nextActions: Array<{
    type: 'project' | 'species' | 'challenge' | 'community' | 'product'
    title: string
    description: string
    cta: string
    impact: number
    priority: string
  }>
}

// /types/post-context.ts
export interface PostContext {
  id: string
  content: string
  type: 'user_post' | 'project_update' | 'species_discovery' | 'challenge_completion' | 'product_review'
  visibility: 'public' | 'guild_only' | 'private'
  createdAt: string
  updatedAt: string
  
  // Auteur
  author: {
    id: string
    name: string
    avatar: string | null
    role: string
    verified: boolean
    level: number
  }
  
  // Badge source
  sourceBadge: {
    type: 'project' | 'species' | 'challenge' | 'producer' | 'guild'
    id: string
    name: string
    icon: string
    color: string
    link: string
  }
  
  // Entité liée
  linkedEntity: {
    type: 'project' | 'species' | 'challenge' | 'product' | 'producer'
    id: string
    name: string
    description: string
    image: string | null
    link: string
  }
  
  // Médias
  media: Array<{
    id: string
    url: string
    type: 'image' | 'video' | 'document'
    mimeType: string
    caption: string
  }>
  
  // Engagement
  engagement: {
    likes: number
    comments: number
    shares: number
    bookmarks: number
    views: number
  }
  
  // État utilisateur
  userState: {
    hasLiked: boolean
    hasBookmarked: boolean
    hasShared: boolean
    canComment: boolean
    canEdit: boolean
  }
  
  // Hashtags & guildes
  tags: {
    hashtags: string[]
    guilds: string[]
    mentions: string[]
  }
  
  // Contexte additionnel
  context: {
    projectUpdate?: {
      projectId: string
      projectName: string
      updateType: 'milestone' | 'progress' | 'announcement' | 'request'
      impact: string
    }
    speciesDiscovery?: {
      speciesId: string
      speciesName: string
      location: string
      observationType: string
      verified: boolean
    }
    challengeCompletion?: {
      challengeId: string
      challengeName: string
      difficulty: string
      rewards: string[]
      timeSpent: number
    }
    productReview?: {
      productId: string
      productName: string
      rating: number
      purchaseVerified: boolean
      impactFocus: string[]
    }
  }
  
  // Actions disponibles
  availableActions: Array<{
    type: 'like' | 'comment' | 'share' | 'bookmark' | 'follow' | 'join'
    title: string
    description: string
    cta: string
    enabled: boolean
  }>
  
  // Lien vers entité
  entityLink: {
    text: string
    url: string
    type: string
  }
}
```

#### **3.2 Fonctions de Mapping**
```typescript
// /lib/mappers/project-mapper.ts
import { ProjectContext } from '@/types/project-context'
import { asString, asNumber, isRecord } from '@/lib/type-guards'

export function mapProjectContext(data: unknown): ProjectContext | null {
  if (!isRecord(data)) return null
  
  const id = asString(data.id)
  const slug = asString(data.slug)
  const name = asString(data.name_default)
  
  if (!id || !slug || !name) return null
  
  return {
    id,
    slug,
    name,
    description: asString(data.description_default) || '',
    status: asString(data.status) as any,
    type: asString(data.type) || '',
    
    producer: mapProducer(data.producer),
    ecosystem: mapEcosystem(data.ecosystem),
    species: mapSpeciesArray(data.species),
    challenges: mapChallengesArray(data.challenges),
    producerProducts: mapProducerProductsArray(data.producer_products),
    expectedImpact: mapExpectedImpact(data.expected_impact),
    community: mapCommunity(data.community),
    userActions: mapUserActions(data.user_actions),
    nextActions: mapNextActionsArray(data.next_actions),
  }
}

function mapProducer(data: unknown): ProjectContext['producer'] {
  if (!isRecord(data)) {
    return {
      id: '',
      name: 'Make the Change',
      avatar: null,
      location: '',
      verified: false,
      totalProjects: 0,
      successRate: 0,
    }
  }
  
  return {
    id: asString(data.id) || '',
    name: asString(data.name_default) || 'Make the Change',
    avatar: asString(data.avatar_url) || null,
    location: `${asString(data.location_city) || ''}, ${asString(data.location_country_code) || ''}`,
    verified: asBoolean(data.verified) || false,
    totalProjects: asNumber(data.total_projects_count) || 0,
    successRate: asNumber(data.success_rate) || 0,
  }
}

// ... autres fonctions de mapping similaires
```

---

### **PHASE 4: API ENDPOINTS (Jours 5-6)**

#### **4.1 Créer les Services d'API**
```typescript
// /lib/api/project-context.service.ts
import { createClient } from '@/lib/supabase/server'
import { mapProjectContext } from '@/lib/mappers/project-mapper'
import type { ProjectContext } from '@/types/project-context'

export async function getProjectContext(slug: string): Promise<ProjectContext | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('v_project_context')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) {
    console.error('Error fetching project context:', error)
    return null
  }
  
  return mapProjectContext(data)
}

export async function getProjectContextById(id: string): Promise<ProjectContext | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('v_project_context')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching project context by ID:', error)
    return null
  }
  
  return mapProjectContext(data)
}

export async function getRelatedProjects(projectId: string): Promise<ProjectContext[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('v_project_context')
    .select('*')
    .neq('id', projectId)
    .limit(6)
  
  if (error) {
    console.error('Error fetching related projects:', error)
    return []
  }
  
  return (data || [])
    .map(mapProjectContext)
    .filter((p): p is ProjectContext => p !== null)
}

// /lib/api/product-context.service.ts
export async function getProductContext(id: string): Promise<ProductContext | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('v_product_context')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching product context:', error)
    return null
  }
  
  return mapProductContext(data)
}

// /lib/api/species-context.service.ts
export async function getSpeciesContext(id: string): Promise<SpeciesContext | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('v_species_context')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching species context:', error)
    return null
  }
  
  return mapSpeciesContext(data)
}

export async function getSpeciesContextList(filters?: {
  category?: string
  status?: string
  biome?: string
}): Promise<SpeciesContext[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('v_species_context')
    .select('*')
  
  if (filters?.category) {
    query = query.eq('category', filters.category)
  }
  
  if (filters?.status) {
    query = query.eq('conservation_status', filters.status)
  }
  
  const { data, error } = await query.limit(50)
  
  if (error) {
    console.error('Error fetching species contexts:', error)
    return []
  }
  
  return (data || [])
    .map(mapSpeciesContext)
    .filter((s): s is SpeciesContext => s !== null)
}

// /lib/api/user-impact-context.service.ts
export async function getUserImpactContext(userId: string): Promise<UserImpactContext | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('v_user_impact_context')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching user impact context:', error)
    return null
  }
  
  return mapUserImpactContext(data)
}

// /lib/api/post-context.service.ts
export async function getPostContext(id: string): Promise<PostContext | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('v_post_context')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching post context:', error)
    return null
  }
  
  return mapPostContext(data)
}

export async function getPostContextList(filters?: {
  sourceType?: string
  sourceId?: string
  authorId?: string
  limit?: number
}): Promise<PostContext[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('v_post_context')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (filters?.sourceType) {
    query = query.eq('source_entity_type', filters.sourceType)
  }
  
  if (filters?.sourceId) {
    query = query.eq('source_entity_id', filters.sourceId)
  }
  
  if (filters?.authorId) {
    query = query.eq('author_id', filters.authorId)
  }
  
  if (filters?.limit) {
    query = query.limit(filters.limit)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching post contexts:', error)
    return []
  }
  
  return (data || [])
    .map(mapPostContext)
    .filter((p): p is PostContext => p !== null)
}
```

---

### **PHASE 5: MISE À JOUR DES PAGES (Jours 7-10)**

#### **5.1 Page Project Améliorée**
```typescript
// /app/[locale]/(marketing)/projects/[slug]/page.tsx
import { getProjectContext, getRelatedProjects } from '@/lib/api/project-context.service'
import { ProjectDetailEnhanced } from './components/project-detail-enhanced'

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProjectContext(params.slug)
  const relatedProjects = await getRelatedProjects(project?.id || '')
  
  if (!project) {
    notFound()
  }
  
  return (
    <>
      <ProjectDetailEnhanced project={project} />
      {relatedProjects.length > 0 && (
        <RelatedProjectsSection projects={relatedProjects} />
      )}
    </>
  )
}

// /app/[locale]/(marketing)/projects/[slug]/components/project-detail-enhanced.tsx
import type { ProjectContext } from '@/types/project-context'

interface ProjectDetailEnhancedProps {
  project: ProjectContext
}

export function ProjectDetailEnhanced({ project }: ProjectDetailEnhancedProps) {
  return (
    <div className="space-y-8">
      {/* Hero Section avec espèces */}
      <ProjectHero project={project} />
      
      {/* Main Content avec contexte riche */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ProjectDescription project={project} />
          
          {/* NOUVEAU: Section Espèces */}
          {project.species.length > 0 && (
            <ProjectSpeciesSection species={project.species} />
          )}
          
          {/* NOUVEAU: Section Challenges */}
          {project.challenges.length > 0 && (
            <ProjectChallengesSection challenges={project.challenges} />
          )}
          
          {/* NOUVEAU: Section Produits */}
          {project.producerProducts.length > 0 && (
            <ProjectProductsSection products={project.producerProducts} />
          )}
          
          {/* NOUVEAU: Section Impact */}
          <ProjectImpactSection impact={project.expectedImpact} />
        </div>
        
        <div className="space-y-6">
          <ProjectSidebar project={project} />
          
          {/* NOUVEAU: Section Actions Utilisateur */}
          <ProjectUserActions actions={project.userActions} />
          
          {/* NOUVEAU: Section Prochaines Actions */}
          <ProjectNextActions actions={project.nextActions} />
        </div>
      </div>
    </div>
  )
}

// Composants enrichis
function ProjectSpeciesSection({ species }: { species: ProjectContext['species'] }) {
  return (
    <Section>
      <h2 className="text-2xl font-bold mb-4">Espèces Protégées</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {species.map((sp) => (
          <SpeciesCard key={sp.id} species={sp} />
        ))}
      </div>
    </Section>
  )
}

function ProjectChallengesSection({ challenges }: { challenges: ProjectContext['challenges'] }) {
  return (
    <Section>
      <h2 className="text-2xl font-bold mb-4">Challenges Disponibles</h2>
      <div className="space-y-4">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </Section>
  )
}

function ProjectImpactSection({ impact }: { impact: ProjectContext['expectedImpact'] }) {
  return (
    <Section>
      <h2 className="text-2xl font-bold mb-4">Impact Attendu</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ImpactMetric
          label="CO2 Absorbé"
          value={impact.co2Absorbed ? `${impact.co2Absorbed} kg` : 'N/A'}
          icon="🌍"
        />
        <ImpactMetric
          label="Biodiversité"
          value={impact.biodiversityGain ? `${impact.biodiversityGain} points` : 'N/A'}
          icon="🦋"
        />
        <ImpactMetric
          label="Emplois Créés"
          value={impact.jobsCreated ? `${impact.jobsCreated}` : 'N/A'}
          icon="👥"
        />
        <ImpactMetric
          label="Timeline"
          value={impact.timeline ? `${impact.timeline} mois` : 'N/A'}
          icon="📅"
        />
      </div>
    </Section>
  )
}
```

#### **5.2 Page Product Améliorée**
```typescript
// /app/[locale]/(marketing)/products/[id]/page.tsx
import { getProductContext } from '@/lib/api/product-context.service'
import { ProductDetailEnhanced } from './components/product-detail-enhanced'

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductContext(params.id)
  
  if (!product) {
    notFound()
  }
  
  return <ProductDetailEnhanced product={product} />
}

// /app/[locale]/(marketing)/products/[id]/components/product-detail-enhanced.tsx
import type { ProductContext } from '@/types/product-context'

export function ProductDetailEnhanced({ product }: { product: ProductContext }) {
  return (
    <div className="space-y-8">
      {/* Hero Section existant */}
      <ProductHero product={product} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ProductDescription product={product} />
          
          {/* NOUVEAU: Section Projets Soutenus */}
          {product.supportedProjects.length > 0 && (
            <ProductSupportedProjects projects={product.supportedProjects} />
          )}
          
          {/* NOUVEAU: Section Espèces Liées */}
          {product.linkedSpecies.length > 0 && (
            <ProductLinkedSpecies species={product.linkedSpecies} />
          )}
          
          {/* NOUVEAU: Section Impact Détaillé */}
          <ProductImpactSection impact={product.impact} />
          
          {/* NOUVEAU: Section Histoire d'Impact */}
          <ProductImpactStory story={product.impactStory} />
        </div>
        
        <div className="space-y-6">
          <ProductSidebar product={product} />
          
          {/* NOUVEAU: Section Compatibilité BioDex */}
          <ProductBioDexCompatibility compatibility={product.biodexCompatibility} />
          
          {/* NOUVEAU: Section Actions Utilisateur */}
          <ProductUserActions actions={product.userActions} />
        </div>
      </div>
    </div>
  )
}

function ProductImpactSection({ impact }: { impact: ProductContext['impact'] }) {
  return (
    <Section>
      <h2 className="text-2xl font-bold mb-4">Impact Environnemental et Social</h2>
      
      <div className="space-y-6">
        <ImpactCategory title="Environnemental" icon="🌍">
          <ImpactRow label="Empreinte CO2" value={impact.environmental.co2Footprint} unit="kg" />
          <ImpactRow label="Usage d'eau" value={impact.environmental.waterUsage} unit="L" />
          <ImpactRow label="Impact biodiversité" value={impact.environmental.biodiversityImpact} />
          <ImpactRow label="Recyclabilité" value={impact.environmental.recyclability} unit="%" />
        </ImpactCategory>
        
        <ImpactCategory title="Social" icon="👥">
          <ImpactRow label="Emplois locaux" value={impact.social.localJobs} />
          <ImpactRow label="Commerce équitable" value={impact.social.fairTrade ? 'Oui' : 'Non'} />
          <ImpactRow label="Soutien communautaire" value={impact.social.communitySupport} />
        </ImpactCategory>
        
        <ImpactCategory title="Économique" icon="💰">
          <ImpactRow label="Revenu local" value={impact.economic.localRevenue} unit="€" />
          <ImpactRow label="Partage des bénéfices" value={impact.economic.profitSharing} unit="%" />
          <ImpactRow label="Prime durabilité" value={impact.economic.pricePremium} unit="€" />
        </ImpactCategory>
      </div>
    </Section>
  )
}
```

#### **5.3 Page BioDex Améliorée**
```typescript
// /app/[locale]/(marketing)/biodex/page.tsx
import { getSpeciesContextList } from '@/lib/api/species-context.service'
import { BiodexEnhanced } from './components/biodex-enhanced'

export default async function BiodexPage({
  searchParams,
}: {
  searchParams?: { category?: string; status?: string; biome?: string }
}) {
  const species = await getSpeciesContextList(searchParams)
  
  return <BiodexEnhanced species={species} />
}

// /app/[locale]/(marketing)/biodex/components/biodex-enhanced.tsx
import type { SpeciesContext } from '@/types/species-context'

interface BiodexEnhancedProps {
  species: SpeciesContext[]
}

export function BiodexEnhanced({ species }: BiodexEnhancedProps) {
  return (
    <div className="space-y-8">
      <BiodexHero />
      
      {/* NOUVEAU: Filtres enrichis */}
      <BiodexFilters />
      
      {/* NOUVEAU: Statistiques utilisateur */}
      <UserBiodexStats />
      
      {/* Grid avec contexte riche */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {species.map((sp) => (
          <SpeciesCardEnhanced key={sp.id} species={sp} />
        ))}
      </div>
    </div>
  )
}

function SpeciesCardEnhanced({ species }: { species: SpeciesContext }) {
  return (
    <Card className="group relative overflow-hidden">
      <CardContent className="p-6">
        {/* En-tête avec statut utilisateur */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              {species.userStatus.isUnlocked ? '🦋' : '❓'}
            </div>
            <div>
              <h3 className="font-semibold">{species.name}</h3>
              <p className="text-sm text-muted-foreground">{species.scientificName}</p>
            </div>
          </div>
          
          {species.userStatus.isUnlocked && (
            <Badge variant="secondary">
              Niv. {species.userStatus.progressionLevel}
            </Badge>
          )}
        </div>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {species.description}
        </p>
        
        {/* Statut de conservation */}
        <div className="flex items-center gap-2 mb-4">
          <Badge 
            variant={getConservationStatusVariant(species.conservation.status)}
          >
            {species.conservation.status}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {species.conservation.trend}
          </span>
        </div>
        
        {/* NOUVEAU: Projets associés */}
        {species.associatedProjects.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold mb-2">Projets ({species.associatedProjects.length})</p>
            <div className="flex flex-wrap gap-1">
              {species.associatedProjects.slice(0, 3).map((project) => (
                <Badge key={project.id} variant="outline" className="text-xs">
                  {project.name}
                </Badge>
              ))}
              {species.associatedProjects.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{species.associatedProjects.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* NOUVEAU: Actions utilisateur */}
        <div className="flex gap-2">
          {species.userStatus.isUnlocked ? (
            <>
              <Button size="sm" variant="outline">
                Observer
              </Button>
              <Button size="sm">
                Contribuer
              </Button>
            </>
          ) : (
            <Button size="sm" disabled>
              🔒 Non débloqué
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

#### **5.4 Page Community Améliorée**
```typescript
// /app/[locale]/(community)/page.tsx
import { getPostContextList } from '@/lib/api/post-context.service'
import { CommunityEnhanced } from './components/community-enhanced'

export default async function CommunityPage({
  searchParams,
}: {
  searchParams?: { sourceType?: string; sourceId?: string }
}) {
  const posts = await getPostContextList(searchParams)
  
  return <CommunityEnhanced posts={posts} />
}

// /app/[locale]/(community)/components/community-enhanced.tsx
import type { PostContext } from '@/types/post-context'

export function CommunityEnhanced({ posts }: { posts: PostContext[] }) {
  return (
    <div className="space-y-6">
      {/* Header avec filtres par entité */}
      <CommunityHeader />
      
      {/* Feed avec contexte riche */}
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCardEnhanced key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

function PostCardEnhanced({ post }: { post: PostContext }) {
  return (
    <Card className="group">
      <CardContent className="p-6">
        {/* NOUVEAU: Badge source */}
        {post.sourceBadge && (
          <div className="mb-4">
            <Link href={post.sourceBadge.link}>
              <Badge 
                className="cursor-pointer hover:opacity-80"
                style={{ 
                  backgroundColor: getSourceBadgeColor(post.sourceBadge.type),
                  color: 'white'
                }}
              >
                <span className="mr-1">{post.sourceBadge.icon}</span>
                {post.sourceBadge.name}
              </Badge>
            </Link>
          </div>
        )}
        
        {/* En-tête avec auteur */}
        <div className="flex items-start gap-3 mb-4">
          <Avatar src={post.author.avatar} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{post.author.name}</span>
              <Badge variant="outline" className="text-xs">
                Niv. {post.author.level}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
        
        {/* Contenu */}
        <p className="mb-4">{post.content}</p>
        
        {/* NOUVEAU: Entité liée */}
        {post.linkedEntity && (
          <div className="mb-4 p-3 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              {post.linkedEntity.image && (
                <img 
                  src={post.linkedEntity.image} 
                  alt={post.linkedEntity.name}
                  className="w-12 h-12 rounded object-cover"
                />
              )}
              <div className="flex-1">
                <p className="font-semibold text-sm">{post.linkedEntity.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {post.linkedEntity.description}
                </p>
                <Link 
                  href={post.linkedEntity.link}
                  className="text-xs text-primary hover:underline"
                >
                  Voir →
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {/* Engagement */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>❤️ {post.engagement.likes}</span>
          <span>💬 {post.engagement.comments}</span>
          <span>🔄 {post.engagement.shares}</span>
          <span>🔖 {post.engagement.bookmarks}</span>
        </div>
        
        {/* Actions utilisateur */}
        <div className="flex gap-2 mt-4">
          <Button 
            size="sm" 
            variant={post.userState.hasLiked ? "default" : "outline"}
          >
            {post.userState.hasLiked ? '❤️ Liké' : '🤍 Like'}
          </Button>
          <Button size="sm" variant="outline">
            💬 Commenter
          </Button>
          <Button size="sm" variant="outline">
            🔖 Partager
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

#### **5.5 Page Profile Améliorée**
```typescript
// /app/[locale]/profile/[id]/page.tsx
import { getUserImpactContext } from '@/lib/api/user-impact-context.service'
import { ProfileEnhanced } from './components/profile-enhanced'

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const userContext = await getUserImpactContext(params.id)
  
  if (!userContext) {
    notFound()
  }
  
  return <ProfileEnhanced userContext={userContext} />
}

// /app/[locale]/profile/[id]/components/profile-enhanced.tsx
import type { UserImpactContext } from '@/types/user-impact-context'

export function ProfileEnhanced({ userContext }: { userContext: UserImpactContext }) {
  return (
    <div className="space-y-8">
      <ProfileHeader user={userContext} />
      
      <Tabs defaultValue="impact" className="w-full">
        <TabsList>
          <TabsTrigger value="impact">Impact</TabsTrigger>
          <TabsTrigger value="projects">Projets</TabsTrigger>
          <TabsTrigger value="biodex">BioDex</TabsTrigger>
          <TabsTrigger value="community">Communauté</TabsTrigger>
        </TabsList>
        
        <TabsContent value="impact">
          <ImpactBreakdown breakdown={userContext.impactBreakdown} />
        </TabsContent>
        
        <TabsContent value="projects">
          <SupportedProjects projects={userContext.supportedProjects} />
        </TabsContent>
        
        <TabsContent value="biodex">
          <UnlockedSpecies species={userContext.unlockedSpecies} />
        </TabsContent>
        
        <TabsContent value="community">
          <CommunityActivity user={userContext} />
        </TabsContent>
      </Tabs>
      
      {/* NOUVEAU: Prochaines actions */}
      <NextActions actions={userContext.nextActions} />
    </div>
  )
}

function ImpactBreakdown({ breakdown }: { breakdown: UserImpactContext['impactBreakdown'] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <ImpactCard
        title="Projets"
        score={breakdown.projects.score}
        details={breakdown.projects}
        icon="🌱"
        color="green"
      />
      <ImpactCard
        title="Communauté"
        score={breakdown.community.score}
        details={breakdown.community}
        icon="👥"
        color="blue"
      />
      <ImpactCard
        title="BioDex"
        score={breakdown.biodex.score}
        details={breakdown.biodex}
        icon="🦋"
        color="purple"
      />
      <ImpactCard
        title="Produits"
        score={breakdown.products.score}
        details={breakdown.products}
        icon="🛍️"
        color="orange"
      />
    </div>
  )
}

function UnlockedSpecies({ species }: { species: UserImpactContext['unlockedSpecies'] }) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Espèces Débloquées ({species.length})</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {species.map((sp) => (
          <SpeciesMiniCard key={sp.id} species={sp} />
        ))}
      </div>
    </div>
  )
}
```

---

### **PHASE 6: TESTS & VALIDATION (Jour 11)**

#### **6.1 Tests d'Intégration**
```typescript
// /tests/integration/project-context.test.ts
import { describe, it, expect } from 'vitest'
import { getProjectContext } from '@/lib/api/project-context.service'

describe('ProjectContext Integration', () => {
  it('should return complete project context', async () => {
    const project = await getProjectContext('test-project-slug')
    
    expect(project).not.toBeNull()
    expect(project?.species).toBeDefined()
    expect(project?.challenges).toBeDefined()
    expect(project?.producerProducts).toBeDefined()
    expect(project?.expectedImpact).toBeDefined()
  })
  
  it('should include user actions', async () => {
    const project = await getProjectContext('test-project-slug')
    
    expect(project?.userActions).toEqual({
      isBacked: expect.any(Boolean),
      backedAmount: expect.any(Number),
      isFollowing: expect.any(Boolean),
      completedChallenges: expect.any(Array),
      unlockedSpecies: expect.any(Array)
    })
  })
})

// /tests/integration/product-context.test.ts
describe('ProductContext Integration', () => {
  it('should return complete product context', async () => {
    const product = await getProductContext('test-product-id')
    
    expect(product).not.toBeNull()
    expect(product?.supportedProjects).toBeDefined()
    expect(product?.linkedSpecies).toBeDefined()
    expect(product?.impact).toBeDefined()
  })
  
  it('should include detailed impact metrics', async () => {
    const product = await getProductContext('test-product-id')
    
    expect(product?.impact).toEqual({
      environmental: expect.objectContaining({
        co2Footprint: expect.any(Number),
        waterUsage: expect.any(Number),
        biodiversityImpact: expect.any(Number),
        recyclability: expect.any(Number)
      }),
      social: expect.objectContaining({
        localJobs: expect.any(Number),
        fairTrade: expect.any(Boolean),
        communitySupport: expect.any(Number)
      }),
      economic: expect.objectContaining({
        localRevenue: expect.any(Number),
        profitSharing: expect.any(Number),
        pricePremium: expect.any(Number)
      })
    })
  })
})
```

#### **6.2 Tests de Performance**
```typescript
// /tests/performance/api-performance.test.ts
import { describe, it, expect } from 'vitest'
import { getProjectContext, getProductContext } from '@/lib/api'

describe('API Performance', () => {
  it('should load project context under 500ms', async () => {
    const start = Date.now()
    await getProjectContext('test-project-slug')
    const duration = Date.now() - start
    
    expect(duration).toBeLessThan(500)
  })
  
  it('should load product context under 300ms', async () => {
    const start = Date.now()
    await getProductContext('test-product-id')
    const duration = Date.now() - start
    
    expect(duration).toBeLessThan(300)
  })
})
```

---

### **PHASE 7: DÉPLOYMENT & MONITORING (Jour 12)**

#### **7.1 Monitoring des Performances**
```sql
-- Créer des vues de monitoring
CREATE VIEW v_api_performance_stats AS
SELECT 
  'project_context' as endpoint,
  AVG(EXTRACT(EPOCH FROM (completion_time - start_time)) * 1000) as avg_response_time_ms,
  COUNT(*) as total_requests,
  COUNT(*) FILTER (WHERE status_code = 200) as success_rate
FROM api_logs 
WHERE endpoint LIKE '%project_context%'
  AND created_at >= NOW() - INTERVAL '1 hour'
GROUP BY endpoint;

-- Index pour les performances
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_project_context_performance 
ON v_project_context (slug, id, status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_context_performance 
ON v_product_context (id, producer_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_species_context_performance 
ON v_species_context (category, conservation_status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_impact_context_performance 
ON v_user_impact_context (user_id, total_score);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_post_context_performance 
ON v_post_context (created_at, source_entity_type, source_entity_id);
```

#### **7.2 Cache Configuration**
```typescript
// /lib/cache/cache-config.ts
import { Cache } from '@/lib/cache'

export const projectContextCache = new Cache({
  ttl: 300, // 5 minutes
  maxSize: 100,
  key: (slug: string) => `project-context:${slug}`
})

export const productContextCache = new Cache({
  ttl: 600, // 10 minutes
  maxSize: 200,
  key: (id: string) => `product-context:${id}`
})

export const speciesContextCache = new Cache({
  ttl: 900, // 15 minutes
  maxSize: 500,
  key: (id: string) => `species-context:${id}`
})

export const userImpactContextCache = new Cache({
  ttl: 180, // 3 minutes
  maxSize: 1000,
  key: (userId: string) => `user-impact-context:${userId}`
})
```

---

## 🎯 **LIVRABLES FINAUX**

### **📊 Métriques de Succès**
- **100%** des pages implémentent les contextes complets
- **<500ms** temps de réponse pour tous les contextes
- **95%** de couverture de code pour les nouveaux types
- **0** régression sur les fonctionnalités existantes

### **🔍 Validation Finale**
1. **Navigation transverse**: Chaque entité a des liens vers ses entités liées
2. **Contexte utilisateur**: L'état utilisateur est cohérent sur toutes les pages
3. **Impact visible**: Chaque action montre son impact concret et traçable
4. **Actions contextuelles**: Les prochaines actions sont pertinentes et personnalisées

### **📋 Documentation**
- **Types TypeScript** complets avec JSDoc
- **API endpoints** documentés avec OpenAPI
- **Base de données** schéma et vues documentées
- **Guide d'implémentation** pour les développeurs

---

## 🚀 **INSTRUCTIONS D'EXÉCUTION**

1. **Commencer par l'analyse complète** (Jour 1)
2. **Implémenter l'infrastructure base** (Jours 2-3)
3. **Créer les types et mappers** (Jour 4)
4. **Développer les APIs** (Jours 5-6)
5. **Mettre à jour les pages** (Jours 7-10)
6. **Tester et valider** (Jour 11)
7. **Déployer et monitorer** (Jour 12)

**IMPORTANT**: Ne passe pas à la phase suivante sans validation complète de la phase précédente. Chaque phase doit être 100% fonctionnelle avant de continuer.

---

## 🎯 **RÉSULTAT ATTENDU**

À la fin de ce processus, l'application Make The Change aura :

✅ **Cohérence 100%** entre toutes les pages  
✅ **Navigation transverse** fluide entre entités  
✅ **Contexte utilisateur** riche et personnalisé  
✅ **Impact visible** et traçable  
✅ **Performance** optimisée (<500ms)  
✅ **Code maintenable** et documenté  

**L'utilisateur pourra naviguer de manière intuitive entre projets, produits, espèces et communautés, avec un contexte riche et des actions pertinentes à chaque étape !** 🌟
