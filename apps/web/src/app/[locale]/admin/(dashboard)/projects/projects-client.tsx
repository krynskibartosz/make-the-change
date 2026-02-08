'use client'

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataList,
  Input,
  ListContainer,
  SimpleSelect,
} from '@make-the-change/core/ui'
import { DataCard } from '@make-the-change/core/ui/next'
import { useMutation } from '@tanstack/react-query'
import { Box, MapPin, Package, Plus, Star, Target, User } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { type FC, useCallback, useMemo, useState, useTransition } from 'react'
import { useDebouncedCallback } from '@/app/[locale]/admin/(dashboard)/components/hooks/use-debounced-callback'
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header'
import { AdminPagination } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-pagination'
import { ProjectListItem } from '@/app/[locale]/admin/(dashboard)/components/projects/project-list-item'
import {
  type ViewMode,
  ViewToggle,
} from '@/app/[locale]/admin/(dashboard)/components/ui/view-toggle'
import { buildUpdatedSearchParams } from '@/app/[locale]/admin/(dashboard)/components/utils/search-params'
import { cn } from '@make-the-change/core/shared/utils'
import { LocalizedLink as Link } from '@/components/localized-link'
import { useToast } from '@/hooks/use-toast'
import { usePathname, useRouter } from '@/i18n/navigation'
import type { Project } from '@/lib/types/project'
import { PAGE_SIZE } from './constants'

const MapContainer = dynamic(() => import('@/components/ui/map-container'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-muted/30 animate-pulse rounded-lg flex items-center justify-center">
      <div className="text-center">
        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Chargement de la carte...</p>
      </div>
    </div>
  ),
})

type ProjectsClientProps = {
  initialData: {
    items: Project[]
    total: number
  }
}

type ProjectLocation = {
  id: string
  name: string
  status?: 'draft' | 'active' | 'funded' | 'completed' | 'archived'
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

export const ProjectsClient: FC<ProjectsClientProps> = ({ initialData }) => {
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // State from URL
  const q = searchParams.get('q') || ''
  const status = searchParams.get('status') || undefined
  const type = searchParams.get('type') || undefined
  const page = Number(searchParams.get('page') || '1')

  const [view, setView] = useState<ViewMode>('grid')
  const [selectedProject, setSelectedProject] = useState<ProjectLocation | null>(null)

  // Local state for optimistic updates
  const [projectsState, setProjectsState] = useState<Project[]>(initialData.items)

  // Sync with prop updates
  useMemo(() => {
    setProjectsState(initialData.items)
  }, [initialData.items])

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

  const updateFilters = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      const params = buildUpdatedSearchParams(searchParams.toString(), updates)

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [searchParams, router, pathname],
  )

  const debouncedSearch = useDebouncedCallback((value: string) => {
    updateFilters({ q: value })
  }, 400)

  const projectLocations: ProjectLocation[] = projectsState.map((project) => ({
    id: String(project.id),
    name: project.name || '',
    status: (project.status ?? 'draft') as ProjectLocation['status'],
    type: (project.type ?? 'beehive') as ProjectLocation['type'],
    coordinates: getProjectCoordinates(project),
    fundingProgress: Number(project.funding_progress ?? 0),
    targetBudget: Number(project.target_budget ?? 0),
    currentFunding: Number(project.current_funding ?? 0),
    impactMetrics: (project.impact_metrics || {}) as ProjectLocation['impactMetrics'],
    country: project.address.country || 'Non spécifié',
    city: project.address.city || 'Non spécifié',
    description: project.description || (project.long_description_default as string) || '',
  }))

  const updateProject = useMutation({
    mutationFn: async (vars: { id: string; patch: Partial<Project> }) => {
      const res = await fetch(`/api/admin/projects/${vars.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vars.patch),
      })
      if (!res.ok) throw new Error('Update failed')
      return res.json()
    },
    onSuccess: (updated, vars) => {
      toast({ variant: 'success', title: 'Projet mis à jour' })
      setProjectsState((prev) =>
        prev.map((project) =>
          project.id === vars.id ? { ...project, ...vars.patch, ...(updated || {}) } : project,
        ),
      )
      router.refresh()
    },
    onError: () => toast({ variant: 'destructive', title: 'Mise à jour échouée' }),
  })

  return (
    <AdminPageContainer>
      <AdminPageHeader>
        <Input
          className="max-w-xs"
          aria-label="Rechercher des projets"
          placeholder="Rechercher un projet..."
          defaultValue={q}
          onChange={(e) => {
            debouncedSearch(e.target.value)
          }}
        />
        <SimpleSelect
          className="w-[150px]"
          placeholder="Statut"
          value={status ?? 'all'}
          options={[
            { value: 'all', label: 'Tous' },
            { value: 'draft', label: 'Brouillon' },
            { value: 'active', label: 'Actif' },
            { value: 'funded', label: 'Financé' },
            { value: 'completed', label: 'Terminé' },
            { value: 'archived', label: 'Archivé' },
          ]}
          onValueChange={(val) => updateFilters({ status: val })}
        />
        <SimpleSelect
          className="w-[150px]"
          placeholder="Type"
          value={type ?? 'all'}
          options={[
            { value: 'all', label: 'Tous' },
            { value: 'beehive', label: 'Ruche' },
            { value: 'olive_tree', label: 'Olivier' },
            { value: 'vineyard', label: 'Vigne' },
          ]}
          onValueChange={(val) => updateFilters({ type: val })}
        />
        {isPending && (
          <span aria-live="polite" className="text-xs text-muted-foreground animate-pulse">
            Chargement…
          </span>
        )}

        <Link href="/admin/projects/new">
          <Button className="flex items-center gap-2" size="sm">
            <Plus className="h-4 w-4" />
            Nouveau projet
          </Button>
        </Link>
        <ViewToggle availableViews={['grid', 'list', 'map']} value={view} onChange={setView} />
      </AdminPageHeader>
      {view === 'map' ? (
        <>
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
                  <span className="font-semibold">Note :</span> Les coordonnées affichées sont
                  approximatives basées sur les villes. Pour des coordonnées GPS précises, une
                  intégration avec une bibliothèque PostGIS serait nécessaire.
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <MapContainer
                projects={projectLocations}
                selectedProject={selectedProject}
                selectedType={type ?? 'all'}
                onProjectSelect={setSelectedProject}
              />
            </CardContent>
          </Card>
          {selectedProject && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-full",
                        selectedProject.type === 'beehive'
                          ? 'bg-warning text-warning-foreground'
                          : selectedProject.type === 'olive_tree'
                            ? 'bg-success text-success-foreground'
                            : 'bg-primary text-primary-foreground'
                      )}
                    >
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{selectedProject.name}</CardTitle>
                      <CardDescription>
                        {selectedProject.city}, {selectedProject.country}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={
                      ['active', 'funded', 'completed'].includes(selectedProject.status ?? '')
                        ? 'success'
                        : 'secondary'
                    }
                  >
                    {selectedProject.status}
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
                    <p className="text-sm font-medium text-muted-foreground">Type</p>
                    <p className="text-2xl font-bold">{selectedProject.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Statut</p>
                    <p className="text-2xl font-bold">{selectedProject.status}</p>
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
                      Voir le projet complet
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline">
                    Modifier
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : view === 'grid' ? (
        <DataList
          gridCols={3}
          isLoading={isPending}
          items={projectsState}
          getItemKey={(p) => p.id || ''}
          emptyState={{
            title: 'Aucun projet trouvé',
            description: 'Aucun résultat pour ces filtres.',
            action: (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  updateFilters({ q: undefined, status: undefined, type: undefined })
                }}
              >
                Réinitialiser les filtres
              </Button>
            ),
          }}
          renderItem={(p: Project) => (
            <DataCard href={`/admin/projects/${p.id}`}>
              <DataCard.Header>
                <DataCard.Title>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{p.name}</span>
                    <Badge
                      variant={
                        ['active', 'funded', 'completed'].includes(p.status ?? '')
                          ? 'success'
                          : 'secondary'
                      }
                    >
                      {p.status}
                    </Badge>
                    {p.featured && <Star className="w-4 h-4 text-warning" />}
                  </div>
                </DataCard.Title>
              </DataCard.Header>
              <DataCard.Content>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Target className="w-3.5 h-3.5" />
                  <span>{p.type}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Box className="w-3.5 h-3.5" />
                  <span>
                    {p.current_funding ?? 0} / {p.target_budget} €
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <User className="w-3.5 h-3.5" />
                  <span>{p.producer?.name_default || p.producer_id}</span>
                </div>
              </DataCard.Content>
              <DataCard.Footer>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault()
                      updateProject.mutate({ id: p.id!, patch: { featured: !p.featured } })
                    }}
                  >
                    {p.featured ? 'Unfeature' : 'Feature'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault()
                      updateProject.mutate({
                        id: p.id!,
                        patch: { status: p.status === 'archived' ? 'active' : 'archived' },
                      })
                    }}
                  >
                    {p.status === 'archived' ? 'Réactiver' : 'Archiver'}
                  </Button>
                </div>
                <span className="text-xs text-muted-foreground">
                  ID: {p.id!.substring(0, 8)}...
                </span>
              </DataCard.Footer>
            </DataCard>
          )}
          renderSkeleton={() => (
            <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm animate-pulse h-[180px]" />
          )}
        />
      ) : projectsState.length === 0 ? (
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Aucun projet trouvé</h3>
          <p className="text-muted-foreground mb-4">Aucun résultat pour ces filtres.</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              updateFilters({ q: undefined, status: undefined, type: undefined })
            }}
          >
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <ListContainer>
          {projectsState.map((project: Record<string, unknown>) => (
            <ProjectListItem
              key={project.id as string}
              project={project as never}
              actions={
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault()
                      updateProject.mutate({
                        id: project.id as string,
                        patch: { featured: !project.featured },
                      })
                    }}
                  >
                    {project.featured ? 'Unfeature' : 'Feature'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault()
                      updateProject.mutate({
                        id: project.id as string,
                        patch: {
                          status: project.status === 'archived' ? 'active' : 'archived',
                        },
                      })
                    }}
                  >
                    {project.status === 'archived' ? 'Réactiver' : 'Archiver'}
                  </Button>
                </div>
              }
            />
          ))}
        </ListContainer>
      )}

      <AdminPagination
        pagination={{
          currentPage: page,
          pageSize: PAGE_SIZE,
          totalItems: initialData.total,
          totalPages: Math.ceil(initialData.total / PAGE_SIZE),
        }}
      />
    </AdminPageContainer>
  )
}
