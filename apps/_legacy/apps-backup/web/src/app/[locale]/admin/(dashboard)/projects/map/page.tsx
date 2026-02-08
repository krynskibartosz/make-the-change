'use client';

import {
  MapPin,
  Leaf,
  TreePine,
  Grape,
  Plus,
  CheckCircle,
  Sparkles,
  Building2,
  Globe,
  ArrowUpDown,
  Target,
  Circle,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState, useMemo, useCallback, useDeferredValue } from 'react';
import { type FC } from 'react';

import { Badge } from '@/app/[locale]/admin/(dashboard)/components/badge';
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container';
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/app/[locale]/admin/(dashboard)/components/ui/card';
import {
  ViewToggle,
  type ViewMode,
} from '@/app/[locale]/admin/(dashboard)/components/ui/view-toggle';
import { Button } from '@/components/ui/button';
import type { LegendFilterType } from '@/components/ui/map-filter-panel';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { trpc } from '@/lib/trpc';

const MapContainer = dynamic(() => import('@/components/ui/map-container'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[600px] w-full animate-pulse items-center justify-center rounded-lg bg-gray-100">
      <div className="text-center">
        <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <p className="text-gray-500">Chargement de la carte...</p>
      </div>
    </div>
  ),
});

type ProjectLocation = {
  id: string;
  name: string;
  type: 'beehive' | 'olive_tree' | 'vineyard';
  coordinates: [number, number];
  fundingProgress: number;
  targetBudget: number;
  currentFunding: number;
  impactMetrics: {
    local_jobs_created?: number;
    co2_offset_kg_per_year?: number;
    educational_visits?: number;
    biodiversity_score?: number;
  };
  country: string;
  city: string;
  description: string;
  partnerName?: string;
};

type ProjectTypeKey = 'beehive' | 'olive_tree' | 'vineyard';

const projectTypeConfig: Record<
  ProjectTypeKey,
  {
    icon: typeof Leaf;
    color: string;
    label: string;
    description: string;
  }
> = {
  beehive: {
    icon: Leaf,
    color: 'bg-yellow-500',
    label: 'Ruche',
    description: 'Protection des abeilles',
  },
  olive_tree: {
    icon: TreePine,
    color: 'bg-green-600',
    label: 'Olivier',
    description: 'Agriculture durable',
  },
  vineyard: {
    icon: Grape,
    color: 'bg-purple-600',
    label: 'Vigne',
    description: 'Viticulture responsable',
  },
};

const ProjectsMapPage: FC = () => {
  const [selectedType, setSelectedType] = useState<LegendFilterType>('all');
  const [selectedProject, setSelectedProject] =
    useState<ProjectLocation | null>(null);
  const [search, setSearch] = useState('');
  const [selectedImpactTypes, setSelectedImpactTypes] = useState<string[]>([]);
  const [activeOnly, setActiveOnly] = useState(false);
  const [view, setView] = useState<ViewMode>('map');

  const { data: projectsData, isPending: isPendingProjects } = trpc.admin.projects.list.useQuery({
    limit: 50,
  });

  const parsePostGISPoint = (
    locationString: string
  ): [number, number] | null => {
    if (!locationString) return null;

    try {
      if (locationString.startsWith('0101000020')) {
        return null;
      }

      return null;
    } catch (error) {
      console.warn('Erreur parsing coordonnées PostGIS:', error);
      return null;
    }
  };

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
  };

  const defaultCoordinates: Record<string, [number, number]> = {
    Madagascar: [-18.8792, 47.5079],
    Luxembourg: [49.6117, 6.1319],
    Belgique: [50.4477, 3.8198],
    France: [46.6034, 1.8883],
  };

  const getProjectCoordinates = (project: any): [number, number] => {
    const postgisCoords = parsePostGISPoint(project.location);
    if (postgisCoords) return postgisCoords;

    const cityCoords = cityCoordinates[project.address?.city];
    if (cityCoords) return cityCoords;

    return (
      defaultCoordinates[project.address?.country] ||
      defaultCoordinates['France']
    );
  };

  const projectLocations: ProjectLocation[] = useMemo(
    () =>
      projectsData?.items?.map(project => {
        const rawType = (project.type || 'beehive') as string;
        const allowedTypes: ProjectTypeKey[] = ['beehive', 'olive_tree', 'vineyard'];
        const projectType: ProjectTypeKey = allowedTypes.includes(
          rawType as ProjectTypeKey
        )
          ? (rawType as ProjectTypeKey)
          : 'beehive';

        return {
          id: project.id,
          name: project.name || 'Projet sans nom',
          type: projectType,
          coordinates: getProjectCoordinates(project),
          fundingProgress: project.funding_progress || 0,
          targetBudget: project.target_budget || 0,
          currentFunding: project.total_invested || 0,
          impactMetrics: project.impact_metrics || {},
          country: project.address?.country || 'Non spécifié',
          city: project.address?.city || 'Non spécifié',
          description: project.description || project.long_description || '',
          partnerName:
            project.partner?.name ||
            (project as { partner_name?: string })?.partner_name ||
            'Partenaire non renseigné',
        };
      }) || [],
    [projectsData?.items]
  );

  const debouncedSearch = useDebouncedValue(search, 220);

  const filteredProjects = useMemo(() => {
    return projectLocations.filter(project => {
      const matchesType =
        selectedType === 'all' || project.type === selectedType;
      const matchesSearch =
        debouncedSearch.trim().length === 0 ||
        project.name.toLowerCase().includes(debouncedSearch.toLowerCase());

      return matchesType && matchesSearch;
    });
  }, [projectLocations, selectedType, debouncedSearch]);
  const deferredFilteredProjects = useDeferredValue(filteredProjects);

  const mapLegendCounts = useMemo(
    () => ({
      beehive: projectLocations.filter(project => project.type === 'beehive')
        .length,
      olive_tree: projectLocations.filter(
        project => project.type === 'olive_tree'
      ).length,
      vineyard: projectLocations.filter(project => project.type === 'vineyard')
        .length,
    }),
    [projectLocations]
  );

  const filterCount = useMemo(() => {
    let count = 0;
    if (search.trim()) count += 1;
    if (selectedType !== 'all') count += 1;
    return count;
  }, [search, selectedType]);

  const legendActiveType: LegendFilterType = selectedType;

  const handleLegendSelect = useCallback(
    (type: LegendFilterType) => {
      setSelectedType(prev =>
        type === 'all' ? 'all' : prev === type ? 'all' : type
      );
    },
    []
  );

  const handleImpactTypeRemove = useCallback((impactType: string) => {
    setSelectedImpactTypes(prev =>
      prev.filter(existingType => existingType !== impactType)
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearch('');
    setSelectedType('all');
    setSelectedImpactTypes([]);
    setActiveOnly(false);
  }, []);

  const typeSelectOptions = useMemo(
    () => [
      {
        value: 'all',
        title: 'Tous les types',
        subtitle: 'Afficher tous les projets',
        icon: <Circle className="h-4 w-4 text-slate-400" />,
      },
      {
        value: 'beehive',
        title: projectTypeConfig.beehive.label,
        subtitle: projectTypeConfig.beehive.description,
        icon: <Leaf className="h-4 w-4 text-amber-500" />,
      },
      {
        value: 'olive_tree',
        title: projectTypeConfig.olive_tree.label,
        subtitle: projectTypeConfig.olive_tree.description,
        icon: <TreePine className="h-4 w-4 text-emerald-500" />,
      },
      {
        value: 'vineyard',
        title: projectTypeConfig.vineyard.label,
        subtitle: projectTypeConfig.vineyard.description,
        icon: <Grape className="h-4 w-4 text-violet-500" />,
      },
    ],
    []
  );

  const hasActiveFilters = filterCount > 0;

  const mapFilterPanelConfig = useMemo(
    () => ({
      filterCount,
      search: {
        placeholder: 'Rechercher un projet...',
        value: search,
        onChange: setSearch,
      },
      statusSelect: {
        name: 'status_filter',
        placeholder: 'Tous les statuts',
        options: [
          {
            value: 'all',
            title: 'Tous les statuts',
            subtitle: 'Inclut chaque statut',
            icon: <Circle className="h-4 w-4 text-slate-400" />,
          },
        ],
        value: 'all',
        onChange: () => {},
        icon: <CheckCircle className="h-4 w-4 text-primary" />,
        disabled: true,
      },
      typeSelect: {
        name: 'type_filter',
        placeholder: 'Tous les types',
        options: typeSelectOptions,
        value: selectedType,
        onChange: value => setSelectedType(value as LegendFilterType),
        icon: <Sparkles className="h-4 w-4 text-primary" />,
        disabled: false,
      },
      partnerSelect: {
        name: 'partner_filter',
        placeholder: 'Tous les partenaires',
        options: [
          {
            value: 'all',
            title: 'Tous les partenaires',
            subtitle: 'Affiche chaque partenaire',
            icon: <Circle className="h-4 w-4 text-slate-400" />,
          },
        ],
        value: 'all',
        onChange: () => {},
        icon: <Building2 className="h-4 w-4 text-primary" />,
        disabled: true,
      },
      countrySelect: {
        name: 'country_filter',
        placeholder: 'Tous les pays',
        options: [
          {
            value: 'all',
            title: 'Toutes les zones',
            subtitle: 'Carte globale',
            icon: <Circle className="h-4 w-4 text-slate-400" />,
          },
        ],
        value: 'all',
        onChange: () => {},
        icon: <Globe className="h-4 w-4 text-primary" />,
        disabled: true,
      },
      sortSelect: {
        name: 'sort_filter',
        placeholder: 'Tri personnalisé',
        options: [
          {
            value: 'default',
            title: 'Tri standard',
            subtitle: 'Ordonner par défaut',
            icon: <Circle className="h-4 w-4 text-slate-400" />,
          },
        ],
        value: 'default',
        onChange: () => {},
        icon: <ArrowUpDown className="h-4 w-4 text-primary" />,
        disabled: true,
      },
      impactTypeSelect: {
        name: 'impact_types_filter',
        placeholder: 'Types d’impact',
        options: [],
        onChange: () => {},
        icon: <Target className="h-4 w-4 text-primary" />,
        disabled: true,
      },
      selectedImpactTypes,
      onImpactTypeRemove: handleImpactTypeRemove,
      activeOnly: {
        value: activeOnly,
        onChange: value => setActiveOnly(value),
        label: 'Projets actifs uniquement',
        disabled: true,
      },
      hasActiveFilters,
      onClearFilters: clearFilters,
      legend: {
        label: 'Typologie de projets',
        description: 'Filtrer par catégorie d’impact',
        active: legendActiveType,
        onSelect: handleLegendSelect,
        counts: mapLegendCounts,
      },
      projectLabel: (count: number) =>
        `${count} projet${count > 1 ? 's' : ''} affiché${
          count > 1 ? 's' : ''
        }`,
      tagsLabel: 'Types d’impact',
    }),
    [
      filterCount,
      search,
      typeSelectOptions,
      selectedType,
      selectedImpactTypes,
      handleImpactTypeRemove,
      activeOnly,
      hasActiveFilters,
      clearFilters,
      legendActiveType,
      handleLegendSelect,
      mapLegendCounts,
    ]
  );

  const getProjectIcon = (type: string) => {
    const config = projectTypeConfig[type as keyof typeof projectTypeConfig];
    return config?.icon || MapPin;
  };

  const getProjectColor = (type: string) => {
    const config = projectTypeConfig[type as keyof typeof projectTypeConfig];
    return config?.color || 'bg-gray-500';
  };

  return (
    <AdminPageContainer>
      <AdminPageHeader>
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {isPendingProjects ? (
              <span aria-live="polite">Chargement des projets…</span>
            ) : (
              <span>
                {projectLocations.length} projet
                {projectLocations.length > 1 ? 's' : ''} localisé
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/projects/new">
              <Button className="flex items-center gap-2" size="sm">
                <Plus className="h-4 w-4" />
                Nouveau projet
              </Button>
            </Link>
            <ViewToggle availableViews={['map']} value={view} onChange={setView} />
          </div>
        </div>
      </AdminPageHeader>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Localisation des Projets
          </CardTitle>
          <CardDescription>
            Cliquez sur les marqueurs pour voir les détails de chaque projet
          </CardDescription>
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-sm text-amber-800">
              <strong>ℹ️ Note:</strong> Les coordonnées affichées sont
              approximatives basées sur les villes. Pour des coordonnées GPS
              précises, une intégration avec une bibliothèque PostGIS serait
              nécessaire.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {isPendingProjects ? (
            <div className="flex h-[600px] w-full animate-pulse items-center justify-center rounded-lg bg-gray-100">
              <div className="text-center">
                <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-500">Chargement de la carte...</p>
              </div>
            </div>
          ) : (
            <MapContainer
              projects={deferredFilteredProjects}
              selectedProject={selectedProject}
              selectedType={selectedType}
              onProjectSelect={setSelectedProject}
              filterPanel={mapFilterPanelConfig}
            />
          )}
        </CardContent>
      </Card>

      {selectedProject && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-full p-2 ${getProjectColor(selectedProject.type)}`}
                >
                  {(() => {
                    const Icon = getProjectIcon(selectedProject.type);
                    return <Icon className="h-5 w-5 text-white" />;
                  })()}
                </div>
                <div>
                  <CardTitle className="text-xl">
                    {selectedProject.name}
                  </CardTitle>
                  <CardDescription>
                    {selectedProject.city}, {selectedProject.country}
                  </CardDescription>
                </div>
              </div>
              <Badge color="blue">
                {
                  projectTypeConfig[
                    selectedProject.type as keyof typeof projectTypeConfig
                  ]?.label
                }
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Financement
                </p>
                <p className="text-2xl font-bold">
                  {selectedProject.fundingProgress}%
                </p>
                <p className="text-muted-foreground text-sm">
                  {selectedProject.currentFunding}€ /{' '}
                  {selectedProject.targetBudget}€
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  CO2 Compensé
                </p>
                <p className="text-2xl font-bold">
                  {selectedProject.impactMetrics.co2_offset_kg_per_year || 0}
                  kg/an
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Emplois Créés
                </p>
                <p className="text-2xl font-bold">
                  {selectedProject.impactMetrics.local_jobs_created || 0}
                </p>
              </div>
            </div>

            {selectedProject.description && (
              <div>
                <p className="text-muted-foreground mb-2 text-sm font-medium">
                  Description
                </p>
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
  );
};

export default ProjectsMapPage;
