import type { Project, Client } from '@/lib/domain'

export const DUPONT_CLIENT_ID = 'client-dupont'
export const MARTIN_CLIENT_ID = 'client-martin'

export const mockClient: Client = {
  id: DUPONT_CLIENT_ID,
  projectId: 'null', // Client exists independently, but baseEntitySchema requires projectId. Wait, clientSchema extends baseEntitySchema!
  name: 'Jean Dupont',
  email: 'jean.dupont@example.com',
  phone: '+32 470 12 34 56',
  company: 'Particulier',
}

export const SPARRENLAAN_PROJECT_ID = 'project-sparrenlaan'

export const mockProject: Project = {
  id: SPARRENLAAN_PROJECT_ID,
  clientId: DUPONT_CLIENT_ID,
  name: 'Villa Sparrenlaan',
  address: 'Sparrenlaan 35, 3090 Overijse',
  description: 'Transformation mock-first de la maison unifamiliale Sparrenlaan.',
  status: 'active',
}

export const APPARTEMENT_LYON_PROJECT_ID = 'project-lyon'

export const mockProject2: Project = {
  id: APPARTEMENT_LYON_PROJECT_ID,
  clientId: MARTIN_CLIENT_ID,
  name: 'Appartement Lyon',
  address: '12 rue de la République, 69002 Lyon',
  description: 'Rénovation complète appartement haussmannien.',
  status: 'active',
}

export const mockProjects: Project[] = [mockProject, mockProject2]
