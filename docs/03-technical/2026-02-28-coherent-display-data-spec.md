# Spécification: Données Affichées Cohérentes
## Modèle Relationnel Transverse pour l'Écosystème Make The Change

---

## 🎯 **Objectif**

Assurer que chaque entité apparaît avec le même contexte métier sur toutes les pages, créant une cohérence relationnelle complète.

---

## 🏗️ **Modèle de Contexte Transverse**

### 1. **ProjectContext** - Contexte Projet
```typescript
interface ProjectContext {
  // Identité
  id: string
  name: string
  slug: string
  description: string
  status: 'planning' | 'funding' | 'active' | 'completed' | 'paused'
  
  // Porteur
  producer: {
    id: string
    name: string
    avatar: string
    location: string
    verified: boolean
    totalProjects: number
    successRate: number
  }
  
  // Impact & Écosystème
  ecosystem: {
    id: string
    name: string
    biome: string
    area: number
    coordinates: { lat: number; lng: number }
  }
  
  // Espèces (relation principale)
  primarySpecies: {
    id: string
    name: string
    scientificName: string
    icon: string
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
    status: 'stable' | 'threatened' | 'endangered'
  }
  secondarySpecies: Array<{
    id: string
    name: string
    icon: string
    role: 'pollinator' | 'indicator' | 'keystone'
  }>
  
  // Financement & Progression
  funding: {
    target: number
    current: number
    currency: string
    backers: number
    deadline: string
    rewards: Array<{
      level: string
      amount: number
      description: string
      items: string[]
    }>
  }
  
  // Challenges Liés
  challenges: Array<{
    id: string
    name: string
    type: 'conservation' | 'restoration' | 'education'
    difficulty: 'easy' | 'medium' | 'hard'
    progress: number
    userParticipation: boolean
  }>
  
  // Produits du Producteur
  producerProducts: Array<{
    id: string
    name: string
    price: number
    category: string
    impactPercentage: number
  }>
  
  // Communauté
  community: {
    posts: number
    activeMembers: number
    guilds: string[]
    hashtags: string[]
  }
  
  // Actions Utilisateur
  userActions: {
    isBacked: boolean
    backedAmount: number
    isFollowing: boolean
    completedChallenges: string[]
    unlockedSpecies: string[]
  }
  
  // Impact Concret
  expectedImpact: {
    co2Absorbed: number
    biodiversityGain: number
    jobsCreated: number
    timeline: string
  }
  
  // Prochaines Actions
  nextActions: Array<{
    type: 'fund' | 'join' | 'share' | 'challenge' | 'product'
    title: string
    description: string
    cta: string
    priority: 'high' | 'medium' | 'low'
  }>
}
```

### 2. **ProductContext** - Contexte Produit
```typescript
interface ProductContext {
  // Identité
  id: string
  name: string
  slug: string
  description: string
  category: string
  tags: string[]
  
  // Producteur
  producer: {
    id: string
    name: string
    avatar: string
    location: string
    verified: boolean
    story: string
  }
  
  // Projets Soutenus
  supportedProjects: Array<{
    id: string
    name: string
    impactPercentage: number
    ecosystem: string
    status: string
  }>
  
  // Espèces Liées
  linkedSpecies: Array<{
    id: string
    name: string
    icon: string
    relationship: 'direct' | 'indirect' | 'habitat'
    impact: 'positive' | 'neutral' | 'restorative'
  }>
  
  // Impact & Durabilité
  impact: {
    environmental: {
      co2Footprint: number
      waterUsage: number
      biodiversityImpact: 'positive' | 'neutral' | 'negative'
      recyclability: number
    }
    social: {
      localJobs: number
      fairTrade: boolean
      communitySupport: boolean
    }
    economic: {
      localRevenue: number
      profitSharing: number
      pricePremium: number
    }
  }
  
  // Compatibilité BioDex
  biodexCompatibility: {
    speciesUnlocked: string[]
    challengesEnabled: string[]
    badgeEarned: string
    progressionBonus: number
  }
  
  // Disponibilité & Prix
  availability: {
    inStock: boolean
    stock: number
    price: number
    currency: string
    shipping: {
      available: boolean
      cost: number
      regions: string[]
    }
  }
  
  // Communauté
  community: {
    reviews: number
    averageRating: number
    testimonials: Array<{
      userId: string
      userName: string
      rating: number
      comment: string
      date: string
    }>
    posts: number
  }
  
  // Actions Utilisateur
  userActions: {
    isPurchased: boolean
    purchaseDate: string
    isWishlisted: boolean
    isReviewed: boolean
    speciesUnlocked: string[]
  }
  
  // Raison d'Impact
  impactStory: {
    problem: string
    solution: string
    results: string[]
    verification: string
  }
  
  // Prochaines Actions
  nextActions: Array<{
    type: 'buy' | 'review' | 'share' | 'producer' | 'project'
    title: string
    description: string
    cta: string
  }>
}
```

### 3. **SpeciesContext** - Contexte Espèce
```typescript
interface SpeciesContext {
  // Identité
  id: string
  name: string
  scientificName: string
  commonNames: string[]
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
  
  // Habitat & Distribution
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
  
  // Projets Associés
  associatedProjects: Array<{
    id: string
    name: string
    type: 'conservation' | 'restoration' | 'research' | 'education'
    role: 'primary' | 'secondary' | 'indicator'
    impact: 'habitat' | 'population' | 'research' | 'education'
    status: string
    userParticipation: boolean
  }>
  
  // Producteurs Associés
  associatedProducers: Array<{
    id: string
    name: string
    location: string
    relationship: 'habitat_owner' | 'conservationist' | 'researcher'
    projects: string[]
  }>
  
  // Challenges Associés
  associatedChallenges: Array<{
    id: string
    name: string
    type: 'observation' | 'conservation' | 'education' | 'research'
    difficulty: string
    rewards: string[]
    userProgress: {
      completed: boolean
      progress: number
      nextAction: string
    }
  }>
  
  // Statut Utilisateur
  userStatus: {
    isUnlocked: boolean
    unlockedDate: string
    unlockSource: 'project' | 'challenge' | 'observation' | 'education'
    progressionLevel: number
    observations: number
    contributions: number
    badges: string[]
  }
  
  // Source de Déblocage
  unlockSource: {
    type: 'project_completion' | 'challenge_success' | 'observation_count' | 'education_module'
    sourceId: string
    sourceName: string
    date: string
    requirements: string[]
  }
  
  // Médias & Ressources
  media: {
    images: string[]
    videos: string[]
    sounds: string[]
    documents: string[]
  }
  
  // Actions Utilisateur
  userActions: {
    canObserve: boolean
    canReport: boolean
    canContribute: boolean
    nextObservation: string
    contributionCount: number
  }
  
  // Prochaines Actions
  nextActions: Array<{
    type: 'observe' | 'report' | 'project' | 'challenge' | 'learn'
    title: string
    description: string
    cta: string
    priority: string
  }>
}
```

### 4. **UserImpactContext** - Contexte Impact Utilisateur
```typescript
interface UserImpactContext {
  // Identité
  userId: string
  userName: string
  avatar: string
  joinDate: string
  level: number
  
  // Score Global
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
  
  // Décomposition Impact
  impactBreakdown: {
    // Impact Projet
    projects: {
      score: number
      projectsSupported: number
      totalFunded: number
      projectsCompleted: number
      topProjects: Array<{
        id: string
        name: string
        contribution: number
        impact: string
      }>
    }
    
    // Impact Communauté
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
    
    // Impact BioDex
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
    
    // Impact Produit
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
  
  // Espèces Débloquées
  unlockedSpecies: Array<{
    id: string
    name: string
    icon: string
    rarity: string
    unlockedDate: string
    unlockSource: string
    observations: number
    contributions: number
  }>
  
  // Projets Soutenus
  supportedProjects: Array<{
    id: string
    name: string
    amount: number
    date: string
    status: string
    impact: string
    rewards: string[]
  }>
  
  // Challenges Complétés
  completedChallenges: Array<{
    id: string
    name: string
    type: string
    difficulty: string
    completionDate: string
    rewards: string[]
    impact: string
  }>
  
  // Badges & Réalisations
  badges: Array<{
    id: string
    name: string
    description: string
    icon: string
    earnedDate: string
    rarity: string
    category: string
  }>
  
  // Progression Mensuelle
  monthlyProgress: Array<{
    month: string
    impactScore: number
    projectsSupported: number
    speciesUnlocked: number
    challengesCompleted: number
    communityPosts: number
  }>
  
  // Impact Concret
  tangibleImpact: {
    co2Absorbed: number
    treesPlanted: number
    speciesProtected: number
    habitatsRestored: number
    localJobsSupported: number
    educationHours: number
  }
  
  // Prochaines Actions
  nextActions: Array<{
    type: 'project' | 'species' | 'challenge' | 'community' | 'product'
    title: string
    description: string
    cta: string
    impact: number
    priority: string
  }>
}
```

### 5. **PostContext** - Contexte Post Communauté
```typescript
interface PostContext {
  // Identité
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
    avatar: string
    role: string
    verified: boolean
    level: number
  }
  
  // Badge Source (entité métier)
  sourceBadge: {
    type: 'project' | 'species' | 'challenge' | 'producer' | 'guild'
    id: string
    name: string
    icon: string
    color: string
    link: string
  }
  
  // Entité Liée
  linkedEntity: {
    type: 'project' | 'species' | 'challenge' | 'product' | 'producer'
    id: string
    name: string
    description: string
    image: string
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
  
  // État Utilisateur
  userState: {
    hasLiked: boolean
    hasBookmarked: boolean
    hasShared: boolean
    canComment: boolean
    canEdit: boolean
  }
  
  // Hashtags & Guildes
  tags: {
    hashtags: string[]
    guilds: string[]
    mentions: string[]
  }
  
  // Contexte Additionnel
  context: {
    // Si post de projet
    projectUpdate?: {
      projectId: string
      projectName: string
      updateType: 'milestone' | 'progress' | 'announcement' | 'request'
      impact: string
    }
    
    // Si découverte d'espèce
    speciesDiscovery?: {
      speciesId: string
      speciesName: string
      location: string
      observationType: string
      verified: boolean
    }
    
    // Si complétion de challenge
    challengeCompletion?: {
      challengeId: string
      challengeName: string
      difficulty: string
      rewards: string[]
      timeSpent: number
    }
    
    // Si review de produit
    productReview?: {
      productId: string
      productName: string
      rating: number
      purchaseVerified: boolean
      impactFocus: string[]
    }
  }
  
  // Actions Disponibles
  availableActions: Array<{
    type: 'like' | 'comment' | 'share' | 'bookmark' | 'follow' | 'join'
    title: string
    description: string
    cta: string
    enabled: boolean
  }>
  
  // Lien vers l'entité
  entityLink: {
    text: string
    url: string
    type: string
  }
}
```

---

## 📋 **Spécification par Page**

### **1. Page Project (/projects/[slug])**
```typescript
// Données requises: ProjectContext complet
interface ProjectPageData {
  project: ProjectContext
  relatedProjects: Array<{
    id: string
    name: string
    image: string
    relation: 'same_ecosystem' | 'same_species' | 'same_producer'
  }>
  timeline: Array<{
    date: string
    event: string
    type: 'milestone' | 'update' | 'funding'
  }>
  team: Array<{
    id: string
    name: string
    role: string
    avatar: string
  }>
}
```

### **2. Page Product (/products/[slug])**
```typescript
// Données requises: ProductContext complet
interface ProductPageData {
  product: ProductContext
  relatedProducts: Array<{
    id: string
    name: string
    image: string
    relation: 'same_producer' | 'same_project' | 'same_category'
  }>
  producerProfile: {
    id: string
    name: string
    story: string
    projects: string[]
    certifications: string[]
  }
  reviews: Array<{
    id: string
    user: string
    rating: number
    comment: string
    verified: boolean
    helpful: number
  }>
}
```

### **3. Page BioDex (/biodex)**
```typescript
// Données requises: SpeciesContext pour chaque espèce
interface BiodexPageData {
  userProgress: {
    totalUnlocked: number
    totalSpecies: number
    currentLevel: number
    nextLevelSpecies: number
  }
  species: SpeciesContext[]
  filters: {
    categories: string[]
    rarities: string[]
    statuses: string[]
    biomes: string[]
  }
  discoveries: Array<{
    speciesId: string
    date: string
    location: string
    type: string
  }>
}
```

### **4. Page Profil (/profile/[id])**
```typescript
// Données requises: UserImpactContext complet
interface ProfilePageData {
  user: UserImpactContext
  activity: Array<{
    date: string
    type: string
    description: string
    impact: number
    entity: string
  }>
  achievements: Array<{
    id: string
    name: string
    description: string
    date: string
    rarity: string
  }>
  connections: Array<{
    id: string
    name: string
    type: 'following' | 'follower' | 'collaborator'
  }>
}
```

### **5. Page Leaderboard (/leaderboard)**
```typescript
// Données requises: UserImpactContext pour chaque utilisateur
interface LeaderboardPageData {
  rankings: Array<{
    rank: number
    user: UserImpactContext
    change: number
    streak: number
  }>
  categories: Array<{
    name: string
    description: string
    topUsers: string[]
  }>
  timeframes: Array<{
    name: string
    active: boolean
    data: any[]
  }>
}
```

### **6. Page Communauté (/community)**
```typescript
// Données requises: PostContext pour chaque post
interface CommunityPageData {
  posts: PostContext[]
  filters: {
    types: string[]
    sources: string[]
    timeframes: string[]
  }
  trending: Array<{
    hashtag: string
    count: number
    growth: number
  }>
  guilds: Array<{
    id: string
    name: string
    members: number
    activity: number
  }>
}
```

### **7. Page Challenges (/challenges)**
```typescript
// Données requises: Contexte challenge lié aux entités
interface ChallengesPageData {
  challenges: Array<{
    id: string
    name: string
    description: string
    type: string
    difficulty: string
    linkedEntity: {
      type: 'project' | 'species' | 'producer'
      id: string
      name: string
      image: string
    }
    rewards: string[]
    userProgress: {
      completed: boolean
      progress: number
      nextAction: string
    }
    participants: number
    deadline: string
  }>
  userStats: {
    completed: number
    inProgress: number
    available: number
    totalImpact: number
  }
}
```

---

## 🔗 **Règles de Cohérence**

### **1. Navigation Transverse**
- Chaque entité doit avoir des liens visibles vers les entités liées
- Les badges doivent toujours pointer vers l'entité source
- Les compteurs doivent être cohérents entre les pages

### **2. Contexte Utilisateur**
- L'état utilisateur (likes, bookmarks, participation) doit être identique sur toutes les pages
- Les actions disponibles doivent dépendre du contexte mais être cohérentes
- La progression doit être reflétée en temps réel

### **3. Impact Visible**
- Chaque action doit montrer son impact concret
- Les scores doivent être expliqués et décomposés
- Les résultats doivent être traçables jusqu'à l'action initiale

### **4. Prochaines Actions**
- Chaque page doit suggérer les prochaines actions logiques
- Les actions doivent être priorisées par impact
- Les CTAs doivent être contextuels et personnalisés

---

## 🎯 **Questions-Réponses par Page**

### **Project**
1. **Qu'est-ce que c'est?** → ProjectContext.identité + ProjectContext.description
2. **Qui le porte?** → ProjectContext.producer + ProjectContext.ecosystem
3. **Quel impact réel?** → ProjectContext.expectedImpact + ProjectContext.tangibleImpact
4. **Qu'est-ce que je peux faire?** → ProjectContext.nextActions

### **Product**
1. **Qu'est-ce que c'est?** → ProductContext.identité + ProductContext.description
2. **Qui le porte?** → ProductContext.producer + ProductContext.supportedProjects
3. **Quel impact réel?** → ProductContext.impact + ProductContext.impactStory
4. **Qu'est-ce que je peux faire?** → ProductContext.nextActions

### **Species**
1. **Qu'est-ce que c'est?** → SpeciesContext.identité + SpeciesContext.description
2. **Qui le porte?** → SpeciesContext.associatedProjects + SpeciesContext.associatedProducers
3. **Quel impact réel?** → SpeciesContext.conservation + SpeciesContext.userStatus
4. **Qu'est-ce que je peux faire?** → SpeciesContext.nextActions

### **User Profile**
1. **Qu'est-ce que c'est?** → UserImpactContext.identité + UserImpactContext.level
2. **Qui le porte?** → UserImpactContext.impactBreakdown
3. **Quel impact réel?** → UserImpactContext.tangibleImpact + UserImpactContext.unlockedSpecies
4. **Qu'est-ce que je peux faire?** → UserImpactContext.nextActions

### **Community Post**
1. **Qu'est-ce que c'est?** → PostContext.identité + PostContext.content
2. **Qui le porte?** → PostContext.author + PostContext.sourceBadge
3. **Quel impact réel?** → PostContext.engagement + PostContext.linkedEntity
4. **Qu'est-ce que je peux faire?** → PostContext.availableActions

---

## 🚀 **Implémentation Prioritaire**

### **Phase 1: Foundation**
1. Créer les interfaces TypeScript pour tous les contextes
2. Implémenter les fonctions de récupération de données
3. Mettre en place le cache et la synchronisation

### **Phase 2: Core Pages**
1. Page Project avec ProjectContext complet
2. Page BioDex avec SpeciesContext
3. Page Profil avec UserImpactContext

### **Phase 3: Extended Pages**
1. Page Product avec ProductContext
2. Page Communauté avec PostContext
3. Page Leaderboard avec scores expliqués

### **Phase 4: Integration**
1. Navigation transverse entre entités
2. Actions contextuelles unifiées
3. Impact tracking en temps réel

---

## 📊 **Métriques de Succès**

### **Cohérence**
- 100% des entités ont des liens vers leurs entités liées
- 0% d'incohérence de données entre pages
- 100% des scores sont expliqués et décomposés

### **Engagement**
- Augmentation des clics sur les liens transverses
- Temps passé par page avec contexte complet
- Taux de conversion des prochaines actions

### **Impact**
- Visibilité accrue de l'impact concret
- Meilleure compréhension de l'écosystème
- Plus grande participation aux projets

---

Cette spécification assure une cohérence parfaite des données affichées tout en offrant un contexte riche et des actions pertinentes pour chaque entité de l'écosystème Make The Change.
