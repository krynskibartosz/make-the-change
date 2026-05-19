import { z } from 'zod'

export const learningDomainIdSchema = z.enum([
  'alphabet-du-vivant',
  'milieux-habitats',
  'relations-du-vivant',
  'menaces',
  'solutions',
  'lire-impact',
])

export const learningLevelSchema = z.enum(['base', 'intermediaire', 'avance'])

export const learningEntrySchema = z.object({
  kind: z.enum(['academy_unit', 'project_experience', 'living_web']),
  href: z.string().min(1),
})

export const learningAccessPolicySchema = z.enum([
  'available',
  'recommended_after',
  'support_unlock_enrichment',
])

export const learningCourseSchema = z.object({
  id: z.string().min(1),
  sourceId: z.string().min(1).optional(),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  domain: learningDomainIdSchema,
  theme: z.string().min(1),
  subject: z.string().min(1),
  conceptIds: z.array(z.string().min(1)),
  level: learningLevelSchema,
  durationMinutes: z.number().int().positive(),
  tags: z.array(z.string().min(1)),
  entry: learningEntrySchema,
  relatedProjectSlugs: z.array(z.string().min(1)).default([]),
  relatedSpeciesIds: z.array(z.string().min(1)).default([]),
  relatedEcosystemIds: z.array(z.string().min(1)).default([]),
  relatedNodeIds: z.array(z.string().min(1)).default([]),
  recommendedAfterCourseIds: z.array(z.string().min(1)).default([]),
  accessPolicy: learningAccessPolicySchema,
  lessonIds: z.array(z.string().min(1)).default([]),
})

export const learningPathSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  description: z.string().min(1),
  courseIds: z.array(z.string().min(1)).min(1),
  domainIds: z.array(learningDomainIdSchema).min(1),
  level: learningLevelSchema,
  durationMinutes: z.number().int().positive(),
  primaryHref: z.string().min(1),
  isAcademyPrimary: z.boolean().default(false),
})

export const atlasDomainSchema = z.object({
  id: learningDomainIdSchema,
  title: z.string().min(1),
  subtitle: z.string().min(1),
  description: z.string().min(1),
  iconKey: z.string().min(1),
  accentClass: z.string().min(1),
  order: z.number().int().positive(),
})

export const learningProgressSchema = z.object({
  viewerId: z.string().min(1),
  completedCourseIds: z.array(z.string().min(1)),
  completedLessonIdsByCourse: z.record(z.string(), z.array(z.string().min(1))),
  lastCourseId: z.string().min(1).nullable(),
  updatedAt: z.string().min(1),
})

export type LearningDomainId = z.infer<typeof learningDomainIdSchema>
export type LearningLevel = z.infer<typeof learningLevelSchema>
export type LearningEntry = z.infer<typeof learningEntrySchema>
export type LearningAccessPolicy = z.infer<typeof learningAccessPolicySchema>
export type LearningCourse = z.infer<typeof learningCourseSchema>
export type LearningPath = z.infer<typeof learningPathSchema>
export type AtlasDomain = z.infer<typeof atlasDomainSchema>
export type LearningProgress = z.infer<typeof learningProgressSchema>

export type AtlasThemeGroup = {
  theme: string
  courses: LearningCourse[]
}

export type AtlasDomainWithCourses = AtlasDomain & {
  courseCount: number
  themeGroups: AtlasThemeGroup[]
}

export type AtlasIslandNodeKind = 'chapter' | 'course' | 'toile'

export type AtlasIslandNode = {
  id: string
  kind: AtlasIslandNodeKind
  title: string
  subtitle: string
  href: string
  x: number
  y: number
  size: 'large' | 'medium' | 'small'
  courseIds: string[]
}

export type AtlasIslandVisual = {
  shortTitle: string
  iconKey: string
  color: string
  glow: string
  labelColor: string
  x: number
  y: number
  size: number
  terrain: 'forest' | 'water' | 'network' | 'threat' | 'solution' | 'proof'
}

export type AtlasIslandView = {
  domain: AtlasDomainWithCourses
  visual: AtlasIslandVisual
  nodes: AtlasIslandNode[]
  featuredPathId: string | null
}

export type AtlasDomainMapNodeKind = 'chapter' | 'course' | 'micro_course' | 'living_web'
export type AtlasDomainMapNodeImportance = 'primary' | 'secondary' | 'micro' | 'special'
export type AtlasDomainMapNodeStatus = 'available' | 'recommended' | 'completed'
export type AtlasDomainMapEdgeKind = 'recommended_path' | 'related_link'

export type AtlasDomainMapNode = {
  id: string
  kind: AtlasDomainMapNodeKind
  title: string
  shortLabel: string
  subtitle: string
  href: string
  courseIds: string[]
  x: number
  y: number
  importance: AtlasDomainMapNodeImportance
  status: AtlasDomainMapNodeStatus
}

export type AtlasDomainMapEdge = {
  id: string
  fromNodeId: string
  toNodeId: string
  kind: AtlasDomainMapEdgeKind
}

export type AtlasDomainMapView = {
  domain: AtlasDomainWithCourses
  visual: AtlasIslandVisual
  nodes: AtlasDomainMapNode[]
  edges: AtlasDomainMapEdge[]
  featuredPathId: string | null
}

export type HexCell = {
  q: number
  r: number
}

export type AtlasCameraConfig = {
  x: number
  y: number
  scale: number
}

export type AtlasSubdomainConfig = {
  id: string
  label: string
  x: number
  y: number
  color: string
  cells: HexCell[]
}

export type AtlasTerritoryConfig = {
  domain: AtlasDomainWithCourses
  label: string
  color: string
  darkColor: string
  textColor: string
  x: number
  y: number
  cells: HexCell[]
  textureCells: HexCell[]
  camera: AtlasCameraConfig
  subdomains: AtlasSubdomainConfig[]
}

export type AtlasKinnuMapView = {
  worldCamera: AtlasCameraConfig
  territories: AtlasTerritoryConfig[]
}

export type LearningHomeProjectGroup = {
  projectSlug: string
  courses: LearningCourse[]
}

export type LearningHomeModel = {
  continueCourse: LearningCourse | null
  today: LearningCourse[]
  projectGroups: LearningHomeProjectGroup[]
  atlasDomains: AtlasDomainWithCourses[]
  livingWebCourses: LearningCourse[]
  biodexCourses: LearningCourse[]
  allCourses: LearningCourse[]
}
