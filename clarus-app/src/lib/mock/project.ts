import type { Project } from '@/lib/domain'

export const SPARRENLAAN_PROJECT_ID = 'project-sparrenlaan'

export const mockProject: Project = {
  id: SPARRENLAAN_PROJECT_ID,
  name: 'Sparrenlaan',
  address: 'Sparrenlaan 35, 3090 Overijse',
  description: 'Transformation mock-first de la maison unifamiliale Sparrenlaan.',
  status: 'active',
}
