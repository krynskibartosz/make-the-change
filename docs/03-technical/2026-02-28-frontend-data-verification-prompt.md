# 🎯 PROMPT COMPLET - VÉRIFICATION & AMÉLIORATION FRONTEND DONNÉES COHÉRENTES

---

## 🎯 **MISSION PRINCIPALE**

Tu es un **expert frontend React/Next.js spécialisé en optimisation de données et expérience utilisateur**. Ta mission est d'analyser toutes les pages frontend de l'application Make The Change pour vérifier l'utilisation des nouvelles données contextuelles et d'implémenter les améliorations nécessaires pour atteindre une **cohérence parfaite** entre les entités.

---

## 📋 **CONTEXTE DU PROJET**

L'infrastructure backend est maintenant prête avec :
- **Tables de relations** créées (projets-espèces, produits-projets, etc.)
- **Vues SQL optimisées** pour chaque contexte (ProjectContext, ProductContext, SpeciesContext, PostContext)
- **Données de test** insérées et validées
- **API endpoints** disponibles via les vues

**Ton rôle** : Vérifier que chaque page frontend utilise correctement ces données et implémenter les composants manquants pour une expérience utilisateur riche et cohérente.

---

## 🏗️ **STRUCTURE DES DONNÉES DISPONIBLES**

### **🔗 Vues SQL Disponibles**
```sql
-- Contexte Projet complet
investment.v_project_context
-- Contient: espèces, challenges, produits du producteur, impact métriques

-- Contexte Produit complet  
commerce.v_product_context
-- Contient: projets soutenus, espèces liées, impact détaillé

-- Contexte Espèce complet
investment.v_species_context  
-- Contient: projets associés, producteurs, challenges, statut utilisateur

-- Contexte Post complet
social.v_post_context
-- Contient: badge source, entité liée, engagement, état utilisateur
```

### **📊 Structure des Données par Contexte**

#### **ProjectContext**
```typescript
{
  id, name_default, slug, description_default, status, type
  producer_name, producer_website, producer_city, producer_country
  species: [{ id, name, scientificName, icon, rarity, status, role }]
  challenges: [{ id, name, type, difficulty, userParticipation, rewards }]
  producer_products: [{ id, name, price, category, impactPercentage }]
  expected_impact: { co2Absorbed, biodiversityGain, jobsCreated, timeline }
  // ... autres champs existants
}
```

#### **ProductContext**
```typescript
{
  id, name_default, slug, description_default, price_points, category
  producer_name, producer_description, producer_website
  supported_projects: [{ id, name, impactPercentage, ecosystem, status }]
  linked_species: [{ id, name, icon, relationship, impact }]
  impact: {
    environmental: { co2Footprint, waterUsage, biodiversityImpact, recyclability }
    social: { localJobs, fairTrade, communitySupport }
    economic: { localRevenue, profitSharing, pricePremium }
  }
  // ... autres champs existants
}
```

#### **SpeciesContext**
```typescript
{
  id, name_default, scientific_name, description_default, conservation_status
  associated_projects: [{ id, name, type, role, impact, userParticipation }]
  associated_producers: [{ id, name, location, relationship, projectsCount }]
  associated_challenges: [{ id, name, type, difficulty, rewards, userProgress }]
  user_status: { isUnlocked, unlockedDate, unlockSource, progressionLevel }
  // ... autres champs existants
}
```

#### **PostContext**
```typescript
{
  id, content, type, visibility, created_at
  author_name, author_avatar
  source_badge: { type, id, name, icon, color, link }
  linked_entity: { type, id, name, description, image, link }
  engagement: { likes, comments, shares, bookmarks, views }
  user_state: { hasLiked, hasBookmarked, hasShared, canComment, canEdit }
  // ... autres champs existants
}
```

---

## 🔍 **PLAN D'ANALYSE DÉTAILLÉ**

### **PHASE 1: AUDIT COMPLET DES PAGES (Jour 1)**

#### **1.1 Pages à Analyser**
```
📁 /apps/web-client/src/app/[locale]/
├── (marketing)/
│   ├── projects/[slug]/page.tsx + project-details.tsx
│   ├── products/[id]/page.tsx + product-details.tsx  
│   └── biodex/page.tsx + biodex-client.tsx
├── (community)/
│   ├── community/page.tsx
│   └── community/posts/[id]/page.tsx
├── profile/[id]/page.tsx
└── dashboard/leaderboard/page.tsx (si existe)
```

#### **1.2 Grille d'Analyse par Page**

Pour chaque page, vérifie :

**✅ Données Actuellement Utilisées**
- Quelles données sont déjà chargées ?
- Quels composants affichent quelles informations ?
- Quels appels API sont faits ?

**❌ Données Manquantes Critiques**
- Quelles nouvelles données contextuelles devraient être affichées ?
- Quels composants manquent pour les nouvelles fonctionnalités ?
- Quels liens entre entités sont absents ?

**🔧 Modifications Nécessaires**
- Quels types TypeScript doivent être mis à jour ?
- Quels services d'API doivent être modifiés ?
- Quels composants doivent être créés/modifiés ?

**📊 Score de Complétude (0-100%)**
- Basé sur la spécification vs l'implémentation actuelle

---

### **PHASE 2: VÉRIFICATION DES SERVICES D'API (Jour 2)**

#### **2.1 Services à Vérifier**
```
📁 /apps/web-client/src/lib/
├── api/
│   ├── project.service.ts
│   ├── product.service.ts
│   ├── species.service.ts
│   └── social.service.ts
└── social/feed.reads.ts
```

#### **2.2 Points de Vérification**
- **Types de retour** : Les services retournent-ils les nouveaux contextes ?
- **Appels aux vues** : Les services utilisent-ils les nouvelles vues SQL ?
- **Mapping des données** : Les données sont-elles correctement mappées ?
- **Gestion d'erreurs** : Les erreurs sont-elles bien gérées ?
- **Performance** : Les appels sont-ils optimisés (cache, pagination) ?

---

### **PHASE 3: ANALYSE DES COMPOSANTS (Jour 3)**

#### **3.1 Composants à Analyser**
```
📁 /apps/web-client/src/components/
├── project/
├── product/
├── species/
├── social/
├── profile/
└── ui/
```

#### **3.2 Vérifications par Composant**
- **Props reçues** : Les composants reçoivent-ils les bonnes données ?
- **Affichage des données** : Toutes les données pertinentes sont-elles affichées ?
- **Navigation** : Les liens entre entités sont-ils présents ?
- **Actions utilisateur** : Les CTAs sont-ils contextuels ?
- **Accessibilité** : L'accessibilité est-elle maintenue ?

---

## 🚀 **PLAN D'IMPLÉMENTATION**

### **PHASE 4: TYPESCRIPT & INTERFACES (Jour 4)**

#### **4.1 Créer les Types Manquants**
```typescript
// /types/project-context.ts
export interface ProjectContext {
  // Tous les champs de la vue v_project_context
  id: string
  name_default: string
  slug: string
  description_default: string
  status: string
  type: string
  producer_name: string
  producer_website: string | null
  producer_city: string | null
  producer_country: string | null
  species: ProjectSpecies[] | null
  challenges: ProjectChallenge[] | null
  producer_products: ProducerProduct[] | null
  expected_impact: ProjectImpact | null
  // ... autres champs
}

export interface ProjectSpecies {
  id: string
  name: string
  scientificName: string
  icon: string | null
  rarity: number
  status: string
  role: string
}

export interface ProjectChallenge {
  id: string
  name: string
  type: string
  difficulty: string
  userParticipation: boolean
  rewards: any[]
}

export interface ProducerProduct {
  id: string
  name: string
  price: number
  category: string
  impactPercentage: number
}

export interface ProjectImpact {
  co2Absorbed: number | null
  biodiversityGain: number | null
  jobsCreated: number | null
  timeline: number | null
}

// Types similaires pour ProductContext, SpeciesContext, PostContext
```

#### **4.2 Mettre à Jour les Types Existantants**
- Ajouter les nouveaux champs aux types existants
- Maintenir la rétrocompatibilité
- Ajouter la validation des données

---

### **PHASE 5: SERVICES D'API (Jour 5)**

#### **5.1 Mettre à Jour les Services Existant**
```typescript
// /lib/api/project.service.ts
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

// Fonction de mapping robuste
function mapProjectContext(data: unknown): ProjectContext | null {
  if (!isRecord(data)) return null
  
  const id = asString(data.id)
  const name = asString(data.name_default)
  
  if (!id || !name) return null
  
  return {
    id,
    name_default: name,
    slug: asString(data.slug) || '',
    description_default: asString(data.description_default) || '',
    status: asString(data.status) || '',
    type: asString(data.type) || '',
    producer_name: asString(data.producer_name) || '',
    producer_website: asString(data.producer_website),
    producer_city: asString(data.producer_city),
    producer_country: asString(data.producer_country),
    species: mapArray(data.species, mapProjectSpecies),
    challenges: mapArray(data.challenges, mapProjectChallenge),
    producer_products: mapArray(data.producer_products, mapProducerProduct),
    expected_impact: mapProjectImpact(data.expected_impact),
    // ... mapper tous les autres champs
  }
}
```

#### **5.2 Créer les Nouveaux Services**
```typescript
// /lib/api/species.service.ts
export async function getSpeciesContext(id: string): Promise<SpeciesContext | null>
export async function getSpeciesContextList(filters?: SpeciesFilters): Promise<SpeciesContext[]>

// /lib/api/post-context.service.ts  
export async function getPostContext(id: string): Promise<PostContext | null>
export async function getPostContextList(filters?: PostFilters): Promise<PostContext[]>
```

---

### **PHASE 6: COMPOSANTS ENRICHI (Jours 6-8)**

#### **6.1 Page Project - Composants à Créer**

**ProjectSpeciesSection.tsx**
```typescript
interface ProjectSpeciesSectionProps {
  species: ProjectSpecies[]
}

export function ProjectSpeciesSection({ species }: ProjectSpeciesSectionProps) {
  if (!species || species.length === 0) return null

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

function SpeciesCard({ species }: { species: ProjectSpecies }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          {species.icon ? <img src={species.icon} alt="" /> : '🦋'}
        </div>
        <div>
          <h3 className="font-semibold">{species.name}</h3>
          <p className="text-sm text-muted-foreground">{species.scientificName}</p>
        </div>
        <Badge variant="secondary">{species.role}</Badge>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Badge variant={getConservationStatusVariant(species.status)}>
          {species.status}
        </Badge>
        <span className="text-muted-foreground">Rareté: {species.rarity}</span>
      </div>
      <div className="mt-3">
        <Link href={`/biodex?species=${species.id}`}>
          <Button size="sm" variant="outline">
            Voir dans le BioDex →
          </Button>
        </Link>
      </div>
    </Card>
  )
}
```

**ProjectChallengesSection.tsx**
```typescript
interface ProjectChallengesSectionProps {
  challenges: ProjectChallenge[]
  userParticipation?: boolean
}

export function ProjectChallengesSection({ challenges, userParticipation }: ProjectChallengesSectionProps) {
  if (!challenges || challenges.length === 0) return null

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

function ChallengeCard({ challenge }: { challenge: ProjectChallenge }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{challenge.name}</h3>
        <Badge variant={getDifficultyVariant(challenge.difficulty)}>
          {challenge.difficulty}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{challenge.type}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {challenge.userParticipation && (
            <Badge variant="default">Participé</Badge>
          )}
          {challenge.rewards.length > 0 && (
            <span className="text-sm text-muted-foreground">
              🎁 {challenge.rewards.length} récompenses
            </span>
          )}
        </div>
        <Button size="sm">
          {challenge.userParticipation ? 'Voir progression' : 'Participer'}
        </Button>
      </div>
    </Card>
  )
}
```

**ProjectImpactSection.tsx**
```typescript
interface ProjectImpactSectionProps {
  impact: ProjectImpact | null
}

export function ProjectImpactSection({ impact }: ProjectImpactSectionProps) {
  if (!impact) return null

  return (
    <Section>
      <h2 className="text-2xl font-bold mb-4">Impact Attendu</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ImpactMetric
          label="CO2 Absorbé"
          value={impact.co2Absorbed ? `${impact.co2Absorbed} kg` : 'N/A'}
          icon="🌍"
          trend="positive"
        />
        <ImpactMetric
          label="Biodiversité"
          value={impact.biodiversityGain ? `${impact.biodiversityGain} points` : 'N/A'}
          icon="🦋"
          trend="positive"
        />
        <ImpactMetric
          label="Emplois Créés"
          value={impact.jobsCreated ? `${impact.jobsCreated}` : 'N/A'}
          icon="👥"
          trend="positive"
        />
        <ImpactMetric
          label="Timeline"
          value={impact.timeline ? `${impact.timeline} mois` : 'N/A'}
          icon="📅"
          trend="neutral"
        />
      </div>
    </Section>
  )
}

function ImpactMetric({ label, value, icon, trend }: {
  label: string
  value: string
  icon: string
  trend: 'positive' | 'neutral' | 'negative'
}) {
  return (
    <Card className="p-4 text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-semibold text-lg">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
      {trend !== 'neutral' && (
        <div className={`mt-2 text-xs ${
          trend === 'positive' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'positive' ? '↗️' : '↘️'}
        </div>
      )}
    </Card>
  )
}
```

#### **6.2 Page Product - Composants à Créer**

**ProductImpactSection.tsx**
```typescript
interface ProductImpactSectionProps {
  impact: ProductImpact | null
}

export function ProductImpactSection({ impact }: ProductImpactSectionProps) {
  if (!impact) return null

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

function ImpactCategory({ title, icon, children }: {
  title: string
  icon: string
  children: React.ReactNode
}) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h3>
      <div className="space-y-3">
        {children}
      </div>
    </Card>
  )
}

function ImpactRow({ label, value, unit }: {
  label: string
  value: number | string | null | undefined
  unit?: string
}) {
  if (value === null || value === undefined) {
    return (
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-muted-foreground">N/A</span>
      </div>
    )
  }

  const displayValue = typeof value === 'number' ? value.toLocaleString() : value
  const displayUnit = unit ? ` ${unit}` : ''

  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{displayValue}{displayUnit}</span>
    </div>
  )
}
```

**ProductSupportedProjectsSection.tsx**
```typescript
interface ProductSupportedProjectsSectionProps {
  projects: SupportedProject[]
}

export function ProductSupportedProjectsSection({ projects }: ProductSupportedProjectsSectionProps) {
  if (!projects || projects.length === 0) return null

  return (
    <Section>
      <h2 className="text-2xl font-bold mb-4">Projets Soutenus</h2>
      <div className="space-y-4">
        {projects.map((project) => (
          <SupportedProjectCard key={project.id} project={project} />
        ))}
      </div>
    </Section>
  )
}

function SupportedProjectCard({ project }: { project: SupportedProject }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{project.name}</h3>
        <Badge variant="secondary">{project.impactPercentage}%</Badge>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <span>{project.ecosystem || 'Écosystème non spécifié'}</span>
        <span>•</span>
        <Badge variant={getStatusVariant(project.status)}>
          {project.status}
        </Badge>
      </div>
      <Link href={`/projects/${project.id}`}>
        <Button size="sm" variant="outline">
          Voir le projet →
        </Button>
      </Link>
    </Card>
  )
}
```

#### **6.3 Page BioDex - Composants à Enrichir**

**SpeciesCardEnhanced.tsx**
```typescript
interface SpeciesCardEnhancedProps {
  species: SpeciesContext
  showUserStatus?: boolean
}

export function SpeciesCardEnhanced({ species, showUserStatus = true }: SpeciesCardEnhancedProps) {
  return (
    <Card className="group relative overflow-hidden">
      <CardContent className="p-6">
        {/* En-tête avec statut utilisateur */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              {species.image_url ? (
                <img src={species.image_url} alt="" className="h-8 w-8 rounded-full object-cover" />
              ) : (
                '🦋'
              )}
            </div>
            <div>
              <h3 className="font-semibold">{species.name_default}</h3>
              <p className="text-sm text-muted-foreground">{species.scientific_name}</p>
            </div>
          </div>
          
          {showUserStatus && species.user_status?.isUnlocked && (
            <Badge variant="secondary">
              Niv. {species.user_status.progressionLevel}
            </Badge>
          )}
        </div>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {species.description_default}
        </p>
        
        {/* Statut de conservation */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={getConservationStatusVariant(species.conservation_status)}>
            {species.conservation_status}
          </Badge>
        </div>
        
        {/* Projets associés */}
        {species.associated_projects && species.associated_projects.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold mb-2">Projets ({species.associated_projects.length})</p>
            <div className="flex flex-wrap gap-1">
              {species.associated_projects.slice(0, 3).map((project) => (
                <Badge key={project.id} variant="outline" className="text-xs">
                  {project.name}
                </Badge>
              ))}
              {species.associated_projects.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{species.associated_projects.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* Actions utilisateur */}
        <div className="flex gap-2">
          {showUserStatus && species.user_status?.isUnlocked ? (
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

#### **6.4 Page Community - Composants à Enrichir**

**PostCardEnhanced.tsx**
```typescript
interface PostCardEnhancedProps {
  post: PostContext
}

export function PostCardEnhanced({ post }: PostCardEnhancedProps) {
  return (
    <Card className="group">
      <CardContent className="p-6">
        {/* Badge source */}
        {post.source_badge && (
          <div className="mb-4">
            <Link href={post.source_badge.link}>
              <Badge 
                className="cursor-pointer hover:opacity-80"
                style={{ 
                  backgroundColor: getSourceBadgeColor(post.source_badge.type),
                  color: 'white'
                }}
              >
                <span className="mr-1">{post.source_badge.icon}</span>
                {post.source_badge.name}
              </Badge>
            </Link>
          </div>
        )}
        
        {/* En-tête avec auteur */}
        <div className="flex items-start gap-3 mb-4">
          <Avatar src={post.author_avatar} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{post.author_name}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDate(post.created_at)}
            </p>
          </div>
        </div>
        
        {/* Contenu */}
        <p className="mb-4">{post.content}</p>
        
        {/* Entité liée */}
        {post.linked_entity && (
          <div className="mb-4 p-3 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              {post.linked_entity.image && (
                <img 
                  src={post.linked_entity.image} 
                  alt={post.linked_entity.name}
                  className="w-12 h-12 rounded object-cover"
                />
              )}
              <div className="flex-1">
                <p className="font-semibold text-sm">{post.linked_entity.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {post.linked_entity.description}
                </p>
                <Link 
                  href={post.linked_entity.link}
                  className="text-xs text-primary hover:underline"
                >
                  Voir →
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {/* Engagement */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span>❤️ {post.engagement.likes}</span>
          <span>💬 {post.engagement.comments}</span>
          <span>🔄 {post.engagement.shares}</span>
          <span>🔖 {post.engagement.bookmarks}</span>
        </div>
        
        {/* Actions utilisateur */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={post.user_state.hasLiked ? "default" : "outline"}
          >
            {post.user_state.hasLiked ? '❤️ Liké' : '🤍 Like'}
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

function getSourceBadgeColor(type: string): string {
  const colors = {
    project: '#22c55e',
    species: '#3b82f6', 
    challenge: '#eab308',
    producer: '#f97316'
  }
  return colors[type as keyof typeof colors] || '#6b7280'
}
```

---

### **PHASE 7: INTÉGRATION DES PAGES (Jours 9-10)**

#### **7.1 Mettre à Jour Page Project**
```typescript
// /app/[locale]/(marketing)/projects/[slug]/page.tsx
import { getProjectContext } from '@/lib/api/project-context.service'
import { ProjectDetailEnhanced } from './components/project-detail-enhanced'

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProjectContext(params.slug)
  
  if (!project) {
    notFound()
  }
  
  return <ProjectDetailEnhanced project={project} />
}

// /app/[locale]/(marketing)/projects/[slug]/components/project-detail-enhanced.tsx
import type { ProjectContext } from '@/types/project-context'

export function ProjectDetailEnhanced({ project }: { project: ProjectContext }) {
  return (
    <div className="space-y-8">
      <ProjectHero project={project} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ProjectDescription project={project} />
          
          {/* NOUVEAUX: Sections enrichies */}
          {project.species && project.species.length > 0 && (
            <ProjectSpeciesSection species={project.species} />
          )}
          
          {project.challenges && project.challenges.length > 0 && (
            <ProjectChallengesSection challenges={project.challenges} />
          )}
          
          {project.producer_products && project.producer_products.length > 0 && (
            <ProjectProducerProductsSection products={project.producer_products} />
          )}
          
          {project.expected_impact && (
            <ProjectImpactSection impact={project.expected_impact} />
          )}
        </div>
        
        <div className="space-y-6">
          <ProjectSidebar project={project} />
          <ProjectUserActions project={project} />
          <ProjectNextActions project={project} />
        </div>
      </div>
    </div>
  )
}
```

#### **7.2 Mettre à Jour Page Product**
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
      <ProductHero product={product} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ProductDescription product={product} />
          
          {/* NOUVEAUX: Sections enrichies */}
          {product.supported_projects && product.supported_projects.length > 0 && (
            <ProductSupportedProjectsSection projects={product.supported_projects} />
          )}
          
          {product.linked_species && product.linked_species.length > 0 && (
            <ProductLinkedSpeciesSection species={product.linked_species} />
          )}
          
          {product.impact && (
            <ProductImpactSection impact={product.impact} />
          )}
          
          <ProductImpactStory story={product.impact_story} />
        </div>
        
        <div className="space-y-6">
          <ProductSidebar product={product} />
          <ProductBioDexCompatibility compatibility={product.biodex_compatibility} />
          <ProductUserActions actions={product.user_actions} />
        </div>
      </div>
    </div>
  )
}
```

#### **7.3 Mettre à Jour Page BioDex**
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

export function BiodexEnhanced({ species }: { species: SpeciesContext[] }) {
  return (
    <div className="space-y-8">
      <BiodexHero />
      <BiodexFilters />
      <UserBiodexStats />
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {species.map((sp) => (
          <SpeciesCardEnhanced key={sp.id} species={sp} />
        ))}
      </div>
    </div>
  )
}
```

#### **7.4 Mettre à Jour Page Community**
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
      <CommunityHeader />
      
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCardEnhanced key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
```

---

### **PHASE 8: NAVIGATION TRANSVERSE (Jour 11)**

#### **8.1 Créer les Composants de Navigation**
```typescript
// /components/navigation/entity-breadcrumbs.tsx
interface EntityBreadcrumbsProps {
  type: 'project' | 'product' | 'species' | 'producer'
  entity: {
    id: string
    name: string
    slug?: string
  }
  relatedEntities?: Array<{
    type: string
    name: string
    link: string
  }>
}

export function EntityBreadcrumbs({ type, entity, relatedEntities }: EntityBreadcrumbsProps) {
  const breadcrumbs = [
    { label: 'Accueil', href: '/' },
    { label: getTypeLabel(type), href: getTypeLink(type) },
    { label: entity.name, href: getEntityLink(type, entity) }
  ]

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && <span>/</span>}
          <Link href={crumb.href} className="hover:text-foreground">
            {crumb.label}
          </Link>
        </div>
      ))}
      
      {relatedEntities && relatedEntities.length > 0 && (
        <div className="flex items-center space-x-2 ml-auto">
          <span className="text-xs">Lié à:</span>
          {relatedEntities.map((related, index) => (
            <Link key={index} href={related.link} className="text-xs text-primary hover:underline">
              {related.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
```

#### **8.2 Créer les Composants de Liens Rapides**
```typescript
// /components/navigation/quick-links.tsx
interface QuickLinksProps {
  entityType: string
  entityId: string
  links: Array<{
    type: string
    title: string
    description: string
    href: string
    icon: string
  }>
}

export function QuickLinks({ entityType, entityId, links }: QuickLinksProps) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3">Explorer</h3>
      <div className="space-y-2">
        {links.map((link) => (
          <Link key={link.type} href={link.href}>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                {link.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{link.title}</p>
                <p className="text-xs text-muted-foreground">{link.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </div>
    </Card>
  )
}
```

---

### **PHASE 9: TESTS & VALIDATION (Jour 12)**

#### **9.1 Tests d'Intégration**
```typescript
// /tests/integration/project-context.test.ts
import { describe, it, expect } from 'vitest'
import { getProjectContext } from '@/lib/api/project-context.service'

describe('ProjectContext Frontend Integration', () => {
  it('should return complete project context with all relations', async () => {
    const project = await getProjectContext('oliviers-provence-2024')
    
    expect(project).not.toBeNull()
    expect(project?.species).toBeDefined()
    expect(project?.challenges).toBeDefined()
    expect(project?.producer_products).toBeDefined()
    expect(project?.expected_impact).toBeDefined()
  })
  
  it('should include navigation links between entities', async () => {
    const project = await getProjectContext('oliviers-provence-2024')
    
    expect(project?.species?.[0]).toHaveProperty('id')
    expect(project?.producer_products?.[0]).toHaveProperty('id')
    // Vérifier que les liens peuvent être générés
  })
})
```

#### **9.2 Tests de Composants**
```typescript
// /tests/components/project-species-section.test.tsx
import { render, screen } from '@testing-library/react'
import { ProjectSpeciesSection } from '@/components/project/project-species-section'

describe('ProjectSpeciesSection', () => {
  it('should display species cards with correct information', () => {
    const mockSpecies = [
      {
        id: '1',
        name: 'Lavande vraie',
        scientificName: 'Lavandula angustifolia',
        icon: null,
        rarity: 0,
        status: 'stable',
        role: 'primary'
      }
    ]
    
    render(<ProjectSpeciesSection species={mockSpecies} />)
    
    expect(screen.getByText('Lavande vraie')).toBeInTheDocument()
    expect(screen.getByText('Lavandula angustifolia')).toBeInTheDocument()
    expect(screen.getByText('primary')).toBeInTheDocument()
  })
  
  it('should render navigation links to BioDex', () => {
    const mockSpecies = [
      {
        id: '1',
        name: 'Lavande vraie',
        scientificName: 'Lavandula angustifolia',
        icon: null,
        rarity: 0,
        status: 'stable',
        role: 'primary'
      }
    ]
    
    render(<ProjectSpeciesSection species={mockSpecies} />)
    
    const link = screen.getByRole('link', { name: /Voir dans le BioDex/ })
    expect(link).toHaveAttribute('href', '/biodex?species=1')
  })
})
```

#### **9.3 Tests E2E**
```typescript
// /tests/e2e/project-page-navigation.spec.ts
import { test, expect } from '@playwright/test'

test('should navigate between related entities', async ({ page }) => {
  await page.goto('/projects/oliviers-provence-2024')
  
  // Vérifier la présence des espèces
  await expect(page.getByText('Espèces Protégées')).toBeVisible()
  await expect(page.getByText('Lavande vraie')).toBeVisible()
  
  // Cliquer sur le lien vers le BioDex
  await page.getByRole('link', { name: /Voir dans le BioDex/ }).click()
  
  // Vérifier la navigation vers le BioDex
  await expect(page).toHaveURL(/\/biodex/)
  await expect(page.getByText('Lavande vraie')).toBeVisible()
})
```

---

## 🎯 **LIVRABLES FINAUX**

### **📊 Pages Complètement Améliorées**
- **Project** : 100% des données contextuelles affichées avec navigation
- **Product** : Impact détaillé, projets soutenus, espèces liées
- **BioDex** : Projets associés, statut utilisateur, progression
- **Community** : Badges source, entités liées, navigation contextuelle
- **Profile** : Décomposition d'impact, espèces débloquées, challenges

### **🔗 Navigation Transverse**
- **Breadcrumbs** contextuels sur chaque page
- **Liens rapides** entre entités liées
- **Navigation fluide** entre projets, produits, espèces
- **Retours** intelligents vers les pages sources

### **🎨 Composants Réutilisables**
- **Cards** enrichies pour chaque type d'entité
- **Sections** thématiques (impact, espèces, challenges)
- **Métriques** visuelles avec tendances
- **Badges** contextuels avec navigation

### **📱 UX Optimisée**
- **Actions contextuelles** basées sur l'état utilisateur
- **Progression visible** dans le BioDex
- **Impact tangible** mis en avant
- **CTAs intelligents** et personnalisés

---

## ✅ **CRITÈRES DE VALIDATION**

### **🔍 Validation Fonctionnelle**
- [ ] Chaque page affiche 100% des données contextuelles
- [ ] Tous les liens entre entités fonctionnent
- [ ] La navigation est cohérente et intuitive
- [ ] Les actions utilisateur sont contextuelles

### **🎨 Validation UX/UI**
- [ ] L'impact est visible et compréhensible
- [ ] La progression utilisateur est claire
- [ ] Les badges et métadonnées sont informatifs
- [ ] L'accessibilité est maintenue

### **⚡ Validation Performance**
- [ ] Les temps de chargement sont < 2s
- [ ] Le cache est bien utilisé
- [ ] Les requêtes sont optimisées
- [ ] Le SEO est maintenu

### **🧪 Validation Technique**
- [ ] Les types TypeScript sont corrects
- [ ] Les tests passent à 100%
- [ ] La gestion d'erreurs est robuste
- [ ] Le code est maintenable

---

## 🚀 **INSTRUCTIONS D'EXÉCUTION**

1. **Commencer par l'audit complet** des pages existantes
2. **Créer les types** pour les nouveaux contextes
3. **Mettre à jour les services** API avec les nouvelles vues
4. **Implémenter les composants** enrichis progressivement
5. **Intégrer les pages** une par une avec validation
6. **Ajouter la navigation** transverse
7. **Tester et valider** tous les parcours utilisateur

**IMPORTANT** : Valider chaque étape avant de passer à la suivante. Chaque composant doit être testé individuellement avant l'intégration.

---

## 🎯 **RÉSULTAT ATTENDU**

À la fin de ce processus, l'application Make The Change aura :

✅ **Cohérence 100%** entre toutes les pages  
✅ **Navigation transverse** fluide et intuitive  
✅ **Impact visible** et traçable à chaque étape  
✅ **Contexte utilisateur** riche et personnalisé  
✅ **Performance** optimisée avec cache intelligent  
✅ **Code maintenable** et bien testé  

**L'utilisateur pourra naviguer naturellement entre projets, produits, espèces et communauté, avec un contexte riche et des actions pertinentes à chaque étape !** 🌟✨
