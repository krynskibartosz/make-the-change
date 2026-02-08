'use client'

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  SimpleSelect,
} from '@make-the-change/core/ui'
import { Grape, Leaf, MapPin, Plus, TreePine } from 'lucide-react'
import dynamic from 'next/dynamic'
import { type FC, useState } from 'react'
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header'
import {
  type ViewMode,
  ViewToggle,
} from '@/app/[locale]/admin/(dashboard)/components/ui/view-toggle'
import { LocalizedLink as Link } from '@/components/localized-link'
import type { Project } from '@/lib/types/project'

const MapContainer = dynamic(() => import('@/components/ui/map-container'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      <div className="text-center">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Chargement de la carte...</p>
      </div>
    </div>
  ),
})

type ProjectLocation = {
  id: string
  name: string
  type: 'beehive' | 'olive_tree' | 'vineyard'
  coordinates: [number, number]
  fundingProgress: number
  targetBudget: number
  currentFunding: number
  impactMetrics: {
    local_jobs_created?: number
    co2_offset_kg_per_year?: number
    educational_visits?: number
    biodiversity_score?: number
  }
  country: string
  city: string
  description: string
}

const projectTypeConfig = {
  beehive: {
    icon: Leaf,
    color: 'bg-warning text-warning-foreground',
    label: 'Ruche',
    description: 'Protection des abeilles',
  },
  olive_tree: {
    icon: TreePine,
    color: 'bg-success text-success-foreground',
    label: 'Olivier',
    description: 'Agriculture durable',
  },
  vineyard: {
    icon: Grape,
    color: 'bg-primary text-primary-foreground',
    label: 'Vigne',
    description: 'Viticulture responsable',
  },
}

type ProjectsMapClientProps = {
  initialProjects: Project[]
}

export const ProjectsMapClient: FC<ProjectsMapClientProps> = ({ initialProjects }) => {
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedProject, setSelectedProject] = useState<ProjectLocation | null>(null)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<ViewMode>('grid')

  const parsePostGISPoint = (locationString: string): [number, number] | null => {
    if (!locationString) return null

    try {
      if (locationString.startsWith('0101000020')) {
        return null
      }

      return null
    } catch (error) {
      console.warn('Erreur parsing coordonnées PostGIS:', error)
      return null
    }
  }

  const cityCoordinates: Record<string, [number, number]> = {
    Antananarivo: [-18.8792, 47.5079],
    Toliara: [-23.35, 43.6667],
    Antsiranana: [-12.2667, 49.2833],
    Mahajanga: [-15.7167, 46.3167],
    Fianarantsoa: [-21.4333, 47.0833],

    'Esch-sur-Alzette': [49.4958, 5.9806],
    'Luxembourg City': [49.6117, 6.1319],
    Differdange: [49.5244, 5.8914],
    Dudelange: [49.4806, 6.0878],

    Gand: [51.0543, 3.7174],
    Bruxelles: [50.8503, 4.3517],
    Anvers: [51.2194, 4.4025],
    Liège: [50.6292, 5.5797],
    Bruges: [51.2093, 3.2247],

    Paris: [48.8566, 2.3522],
    Lyon: [45.764, 4.8357],
    Marseille: [43.2965, 5.3698],
    Toulouse: [43.6047, 1.4442],
    Nice: [43.7102, 7.262],
  }

  const defaultCoordinates: Record<string, [number, number]> = {
    Madagascar: [-18.8792, 47.5079],
    Luxembourg: [49.6117, 6.1319],
    Belgique: [50.4477, 3.8198],
    France: [46.6034, 1.8883],
  }

  const getProjectCoordinates = (project: Project): [number, number] => {
    const postgisCoords = parsePostGISPoint(project.location as string)
    if (postgisCoords) return postgisCoords

    const cityCoords = project.address.city ? cityCoordinates[project.address.city] : undefined
    if (cityCoords) return cityCoords

    return (defaultCoordinates[project.address.country as keyof typeof defaultCoordinates] ??
      defaultCoordinates['France']) as [number, number]
  }

  const projectLocations: ProjectLocation[] = initialProjects.map((project) => ({
    id: String(project.id ?? ''),
    name: project.name || '',
    type: (project.type as ProjectLocation['type']) ?? 'beehive',
    coordinates: getProjectCoordinates(project),
    fundingProgress: Number(project.funding_progress ?? 0),
    targetBudget: Number(project.target_budget ?? 0),
    currentFunding: Number(project.current_funding ?? 0),
    impactMetrics: (project.impact_metrics as ProjectLocation['impactMetrics']) || {},
    country: project.address.country || 'Non spécifié',
    city: project.address.city || 'Non spécifié',
    description: project.description || (project.long_description_default as string) || '',
  }))

  const filteredProjects = projectLocations.filter((project) => {
    const matchesType = selectedType === 'all' || project.type === selectedType
    const matchesSearch = search === '' || project.name.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })
  const getProjectIcon = (type: string) => {
    const config = projectTypeConfig[type as keyof typeof projectTypeConfig]
    return config?.icon || MapPin
  }

  const getProjectColor = (type: string) => {
    const config = projectTypeConfig[type as keyof typeof projectTypeConfig]
    return config?.color || 'bg-muted'
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader>
        <Input
          className="max-w-xs"
          placeholder="Rechercher un projet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <SimpleSelect
          value={selectedType}
          options={[
            { value: 'all', label: 'Tous les types' },
            { value: 'beehive', label: 'Ruches' },
            { value: 'olive_tree', label: 'Oliviers' },
            { value: 'vineyard', label: 'Vignes' },
          ]}
          onValueChange={setSelectedType}
        />
        {initialProjects.length === 0 && (
          <span aria-live="polite" className="text-xs text-muted-foreground">
            Aucun projet
          </span>
        )}

        <Link href="/admin/projects/new">
          <Button className="flex items-center gap-2" size="sm">
            <Plus className="h-4 w-4" />
            Nouveau projet
          </Button>
        </Link>
        <ViewToggle availableViews={['map']} value={view} onChange={setView} />
      </AdminPageHeader>
      {}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Localisation des Projets
          </CardTitle>
          <CardDescription>
            Cliquez sur les marqueurs pour voir les détails de chaque projet
          </CardDescription>
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mt-3">
            <p className="text-sm text-foreground">
              <strong>ℹ️ Note:</strong> Les coordonnées affichées sont approximatives basées sur les
              villes. Pour des coordonnées GPS précises, une intégration avec une bibliothèque
              PostGIS serait nécessaire.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {initialProjects.length === 0 ? (
            <div className="w-full h-[600px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Chargement de la carte...</p>
              </div>
            </div>
          ) : (
            <MapContainer
              projects={filteredProjects}
              selectedProject={selectedProject}
              selectedType={selectedType}
              onProjectSelect={setSelectedProject}
            />
          )}
        </CardContent>
      </Card>

      {}
      {selectedProject && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${getProjectColor(selectedProject.type)}`}>
                  {(() => {
                    const Icon = getProjectIcon(selectedProject.type)
                    return <Icon className="h-5 w-5 text-white" />
                  })()}
                </div>
                <div>
                  <CardTitle className="text-xl">{selectedProject.name}</CardTitle>
                  <CardDescription>
                    {selectedProject.city}, {selectedProject.country}
                  </CardDescription>
                </div>
              </div>
              <Badge color="blue">
                {projectTypeConfig[selectedProject.type as keyof typeof projectTypeConfig]?.label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Financement</p>
                <p className="text-2xl font-bold">{selectedProject.fundingProgress}%</p>
                <p className="text-sm text-muted-foreground">
                  {selectedProject.currentFunding}€ / {selectedProject.targetBudget}€
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">CO2 Compensé</p>
                <p className="text-2xl font-bold">
                  {selectedProject.impactMetrics.co2_offset_kg_per_year || 0}kg/an
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emplois Créés</p>
                <p className="text-2xl font-bold">
                  {selectedProject.impactMetrics.local_jobs_created || 0}
                </p>
              </div>
            </div>

            {selectedProject.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                <p className="text-sm">{selectedProject.description}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Link href={`/admin/projects/${selectedProject.id}`}>
                <Button size="sm" variant="outline">
                  Voir le projet
                </Button>
              </Link>
              <Button size="sm" variant="outline">
                Modifier
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </AdminPageContainer>
  )
}
