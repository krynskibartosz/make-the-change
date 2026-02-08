'use client';
import {
  MapPin,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Circle,
  Sparkles,
  TreeDeciduous,
  Grape,
  Trees,
  Sun,
  Building2,
  Globe,
  ArrowUpDown,
  TrendingDown,
  TrendingUp,
  SortAsc,
  SortDesc,
  DollarSign,
  Star,
  Target,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import {
  type FC,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
  useTransition,
  useDeferredValue,
  useOptimistic,
} from 'react';

import {
  AdminPageLayout,
  Filters,
  FilterModal,
} from '@/app/[locale]/admin/(dashboard)/components/admin-layout';
import { FilterButton } from '@/app/[locale]/admin/(dashboard)/components/admin-layout/filter-modal';
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/admin-layout/header';
import { AdminPagination } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-pagination';
import { CheckboxWithLabel } from '@/app/[locale]/admin/(dashboard)/components/ui/checkbox';
import { DataList } from '@make-the-change/core/ui';
import { EmptyState } from '@make-the-change/core/ui';
import {
  ViewToggle,
  type ViewMode,
} from '@/app/[locale]/admin/(dashboard)/components/ui/view-toggle';
import { Project } from '@/app/[locale]/admin/(dashboard)/projects/components/project';
import {
  ProjectCardSkeleton,
  ProjectListSkeleton,
} from '@/app/[locale]/admin/(dashboard)/projects/components/project-card-skeleton';
import { LocalizedLink } from '@/components/localized-link';
import { Button } from '@/components/ui/button';
import {
  CustomSelect,
  type SelectOption as CustomSelectOption,
} from '@/components/ui/custom-select';
import type {
  LegendFilterType,
  MapFilterSelectConfig,
} from '@/components/ui/map-filter-panel';
import { trpc } from '@/lib/trpc';

// Dynamically import MapContainer to avoid SSR issues with Leaflet
const MapContainer = dynamic(() => import('@/components/ui/map-container'), {
  ssr: false,
  loading: () => (
    <div className="bg-muted flex h-[600px] items-center justify-center rounded-lg border">
      <div className="text-center">
        <div className="border-primary mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
        <p className="text-muted-foreground text-sm">
          Chargement de la carte...
        </p>
      </div>
    </div>
  ),
});

const pageSize = 18;

type ProjectSortOption =
  | 'created_at_desc'
  | 'created_at_asc'
  | 'name_asc'
  | 'name_desc'
  | 'target_budget_desc'
  | 'target_budget_asc'
  | 'featured_first';

type ProjectStatus = 'active' | 'funded' | 'closed' | 'suspended';

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

type ApiProject = {
  id: string;
  name?: string;
  type?: 'beehive' | 'olive_tree' | 'vineyard';
  latitude?: string | number;
  longitude?: string | number;
  location?: string;
  funding_progress?: number;
  target_budget?: number;
  total_invested?: number;
  impact_metrics?: {
    local_jobs_created?: number;
    co2_offset_kg_per_year?: number;
    educational_visits?: number;
    biodiversity_score?: number;
  };
  address?: {
    country?: string;
    city?: string;
  };
  description?: string;
  long_description?: string;
  partner?: {
    name?: string;
  };
  partner_name?: string;
};

// Fonction pour extraire les coordonnées d'une géometry PostGIS hexadécimale
const extractCoordinatesFromLocation = (
  locationHex: string
): [number, number] | null => {
  try {
    if (!locationHex || locationHex.length < 50) return null;

    // Format WKB: 0101000020E6100000 + longitude (8 bytes) + latitude (8 bytes)
    // Header: 01 01 00 00 20 E6 10 00 00 = 18 characters
    const startIdx = 18;

    // Extract longitude (next 16 hex chars = 8 bytes)
    const lonHex = locationHex.slice(startIdx, startIdx + 16);
    // Extract latitude (next 16 hex chars = 8 bytes)
    const latHex = locationHex.slice(startIdx + 16, startIdx + 32);

    if (lonHex.length !== 16 || latHex.length !== 16) return null;

    // Convert hex to bytes for little-endian float64
    const lonBytes = new Uint8Array(8);
    const latBytes = new Uint8Array(8);

    // Parse longitude bytes (little-endian order from hex)
    for (let i = 0; i < 8; i++) {
      lonBytes[i] = Number.parseInt(lonHex.slice(i * 2, i * 2 + 2), 16);
    }

    // Parse latitude bytes (little-endian order from hex)
    for (let i = 0; i < 8; i++) {
      latBytes[i] = Number.parseInt(latHex.slice(i * 2, i * 2 + 2), 16);
    }

    // Convert bytes to Float64
    const lonView = new DataView(lonBytes.buffer);
    const latView = new DataView(latBytes.buffer);

    const longitude = lonView.getFloat64(0, true); // true = little-endian
    const latitude = latView.getFloat64(0, true);

    // Validate coordinates are reasonable
    if (
      longitude < -180 ||
      longitude > 180 ||
      latitude < -90 ||
      latitude > 90
    ) {
      return null;
    }

    return [latitude, longitude];
  } catch (error) {
    console.warn('Failed to extract coordinates from location hex:', error);
    return null;
  }
};

// Transformation des projets pour la carte
const transformProjectsForMap = (projects: ApiProject[]): ProjectLocation[] => {
  return projects
    .filter(project => {
      // Filtrer les projets qui ont une localisation
      if (project.latitude && project.longitude) {
        return (
          !Number.isNaN(Number(project.latitude)) && !Number.isNaN(Number(project.longitude))
        );
      }
      // Ou qui ont un champ location
      return project.location;
    })
    .map(project => {
      let coordinates: [number, number];

      if (project.latitude && project.longitude) {
        coordinates = [Number(project.latitude), Number(project.longitude)];
      } else if (project.location) {
        const extracted = extractCoordinatesFromLocation(project.location);
        if (!extracted) return null;
        coordinates = extracted;
      } else {
        return null;
      }

      return {
        id: project.id,
        name: project.name || 'Projet sans nom',
        type: project.type || 'beehive',
        coordinates,
        fundingProgress: project.funding_progress || 0,
        targetBudget: project.target_budget || 0,
        currentFunding: project.total_invested || 0,
        impactMetrics: {
          local_jobs_created: project.impact_metrics?.local_jobs_created,
          co2_offset_kg_per_year:
            project.impact_metrics?.co2_offset_kg_per_year,
          educational_visits: project.impact_metrics?.educational_visits,
          biodiversity_score: project.impact_metrics?.biodiversity_score,
        },
        country: project.address?.country || 'Non spécifié',
        city: project.address?.city || 'Non spécifié',
        description: project.description || project.long_description || '',
        partnerName:
          project.partner?.name ||
          project.partner_name ||
          'Partenaire non renseigné',
      };
    })
    .filter(Boolean) as ProjectLocation[];
};

/**
 * Crée les options riches pour le filtre de statut de projet
 */
const createProjectStatusOptions = (t: (key: string) => string): CustomSelectOption[] => [
  {
    value: 'all',
    title: t('admin.projects.filters.all_statuses'),
    subtitle: 'Tous les projets',
    icon: <Circle className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: 'active',
    title: t('admin.projects.statuses.active'),
    subtitle: 'Projets actifs',
    icon: <CheckCircle className="h-4 w-4 text-success" />,
  },
  {
    value: 'funded',
    title: t('admin.projects.statuses.funded'),
    subtitle: 'Projets financés',
    icon: <Star className="h-4 w-4 text-accent" />,
  },
  {
    value: 'closed',
    title: t('admin.projects.statuses.closed'),
    subtitle: 'Projets fermés',
    icon: <XCircle className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: 'suspended',
    title: t('admin.projects.statuses.suspended'),
    subtitle: 'Projets suspendus',
    icon: <AlertCircle className="h-4 w-4 text-destructive" />,
  },
];

/**
 * Crée les options riches pour le filtre de type de projet
 */
const createProjectTypeOptions = (t: (key: string) => string): CustomSelectOption[] => [
  {
    value: 'all',
    title: t('admin.projects.filters.all_types'),
    subtitle: 'Tous les types',
    icon: <Circle className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: 'beehive',
    title: t('admin.projects.type.beehive'),
    subtitle: 'Ruches et apiculture',
    icon: <Sparkles className="h-4 w-4 text-accent" />,
  },
  {
    value: 'olive_tree',
    title: t('admin.projects.type.olive_tree'),
    subtitle: 'Oliviers et huiles',
    icon: <TreeDeciduous className="h-4 w-4 text-success" />,
  },
  {
    value: 'vineyard',
    title: t('admin.projects.type.vineyard'),
    subtitle: 'Vignobles et vins',
    icon: <Grape className="h-4 w-4 text-primary" />,
  },
  {
    value: 'forest',
    title: t('admin.projects.type.forest'),
    subtitle: 'Forêts et reboisement',
    icon: <Trees className="h-4 w-4 text-success" />,
  },
  {
    value: 'solar',
    title: t('admin.projects.type.solar'),
    subtitle: 'Énergie solaire',
    icon: <Sun className="h-4 w-4 text-accent" />,
  },
];

/**
 * Crée les options riches pour le filtre de partenaire
 */
const createPartnerOptions = (
  partners: { id: string; name: string }[] | undefined,
  t: (key: string) => string
): CustomSelectOption[] => {
  const baseOptions: CustomSelectOption[] = [
    {
      value: 'all',
      title: t('admin.projects.filters.all_partners'),
      subtitle: 'Tous les partenaires',
      icon: <Circle className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  if (!partners) return baseOptions;

  return [
    ...baseOptions,
    ...partners.map(partner => ({
      value: partner.id,
      title: partner.name,
      subtitle: 'Partenaire du projet',
      icon: <Building2 className="h-4 w-4 text-primary" />,
    })),
  ];
};

/**
 * Crée les options riches pour le filtre de pays
 */
const createCountryOptions = (
  countries: { id: string; name: string }[] | undefined,
  t: (key: string) => string
): CustomSelectOption[] => {
  const baseOptions: CustomSelectOption[] = [
    {
      value: 'all',
      title: t('admin.projects.filters.all_countries'),
      subtitle: 'Tous les pays',
      icon: <Circle className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  if (!countries) return baseOptions;

  return [
    ...baseOptions,
    ...countries.map(country => ({
      value: country.id,
      title: country.name,
      subtitle: 'Pays du projet',
      icon: <Globe className="h-4 w-4 text-primary" />,
    })),
  ];
};

/**
 * Crée les options riches pour le filtre de tri
 */
const createSortOptions = (t: (key: string) => string): CustomSelectOption[] => [
  {
    value: 'created_at_desc',
    title: t('admin.projects.sort.newest'),
    subtitle: 'Plus récents en premier',
    icon: <TrendingDown className="h-4 w-4 text-primary" />,
  },
  {
    value: 'created_at_asc',
    title: t('admin.projects.sort.oldest'),
    subtitle: 'Plus anciens en premier',
    icon: <TrendingUp className="h-4 w-4 text-primary" />,
  },
  {
    value: 'name_asc',
    title: t('admin.projects.sort.name_asc'),
    subtitle: 'Ordre alphabétique A-Z',
    icon: <SortAsc className="h-4 w-4 text-primary" />,
  },
  {
    value: 'name_desc',
    title: t('admin.projects.sort.name_desc'),
    subtitle: 'Ordre alphabétique Z-A',
    icon: <SortDesc className="h-4 w-4 text-primary" />,
  },
  {
    value: 'target_budget_desc',
    title: t('admin.projects.sort.budget_desc'),
    subtitle: 'Budget le plus élevé',
    icon: <DollarSign className="h-4 w-4 text-destructive" />,
  },
  {
    value: 'target_budget_asc',
    title: t('admin.projects.sort.budget_asc'),
    subtitle: 'Budget le plus bas',
    icon: <DollarSign className="h-4 w-4 text-success" />,
  },
  {
    value: 'featured_first',
    title: t('admin.projects.sort.featured'),
    subtitle: 'Projets mis en avant',
    icon: <Star className="h-4 w-4 text-accent" />,
  },
];

/**
 * Crée les options riches pour le filtre de types d'impact
 */
const formatImpactTypeLabel = (value: string) =>
  value
    .split(/[_-]/g)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const createImpactTypeOptions = (
  impactTypes: string[] | undefined
): CustomSelectOption[] => {
  if (!impactTypes || impactTypes.length === 0) return [];

  return impactTypes.map(type => ({
    value: type,
    title: formatImpactTypeLabel(type),
    subtitle: "Type d'impact",
    icon: <Target className="h-4 w-4 text-primary" />,
  }));
};

const getSortSelectionItems = (t: (key: string) => string) =>
  createSortOptions(t).map(option => ({
    id: option.value,
    name: option.title,
  }));

const ProjectsPage: FC = () => {
  const t = useTranslations();

  const [search, setSearch] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<
    string | undefined
  >();
  const [selectedStatus, setSelectedStatus] = useState<
    ProjectStatus | undefined
  >();
  const [selectedProjectType, setSelectedProjectType] = useState<
    string | undefined
  >();
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>();
  const [selectedImpactTypes, setSelectedImpactTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<ProjectSortOption>('created_at_desc');
  const [cursor, setCursor] = useState<string | undefined>();
  const [view, setView] = useState<ViewMode>('grid');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<ProjectLocation | null>(null);

  const [isPendingFilters, startFilterTransition] = useTransition();
  const deferredSearch = useDeferredValue(search);
  const [optimisticImpactTypes, removeOptimisticImpactType] = useOptimistic(
    selectedImpactTypes,
    (currentTypes, typeToRemove: string) =>
      currentTypes.filter(type => type !== typeToRemove)
  );

  const queryParams = useMemo(
    () => ({
      cursor,
      search: deferredSearch || undefined,
      activeOnly: activeOnly || undefined,
      status: selectedStatus,
      partnerId: selectedPartnerId === 'all' ? undefined : selectedPartnerId,
      projectType:
        selectedProjectType === 'all' ? undefined : selectedProjectType,
      country: selectedCountry === 'all' ? undefined : selectedCountry,
      impactTypes:
        selectedImpactTypes.length > 0 ? selectedImpactTypes : undefined,
      sortBy: sortBy || undefined,
      limit: pageSize,
    }),
    [
      cursor,
      deferredSearch,
      activeOnly,
      selectedPartnerId,
      selectedStatus,
      selectedProjectType,
      selectedCountry,
      selectedImpactTypes,
      sortBy,
    ]
  );

  const { data: partners, isPending: isPendingPartners } =
    trpc.admin.projects.partners.useQuery();
  const { data: countries, isPending: isPendingCountries } =
    trpc.admin.projects.countries.useQuery({ activeOnly: true });
  const { data: impactTypesData, isPending: isPendingImpactTypes } =
    trpc.admin.projects.impactTypes.useQuery({
      activeOnly: true,
      withStats: true,
    });
  const {
    data: projectsData,
    isPending: isPendingProjects,
    isFetching,
    isError,
    error,
    refetch,
  } = trpc.admin.projects.list.useQuery(queryParams);

  const projects = useMemo(
    () => projectsData?.items || [],
    [projectsData?.items]
  );
  const totalProjects = projectsData?.total || 0;
  const totalPages = Math.ceil(totalProjects / pageSize);

  // Transform projects for map view
  const projectsForMap = useMemo(
    () => transformProjectsForMap(projects),
    [projects]
  );
  const deferredProjectsForMap = useDeferredValue(projectsForMap);

  const isFilterActive = useMemo(
    () =>
      !!(
        deferredSearch ||
        activeOnly ||
        (selectedPartnerId && selectedPartnerId !== 'all') ||
        selectedStatus ||
        (selectedProjectType && selectedProjectType !== 'all') ||
        (selectedCountry && selectedCountry !== 'all') ||
        (selectedImpactTypes && selectedImpactTypes.length > 0) ||
        (sortBy && sortBy !== 'created_at_desc')
      ),
    [
      deferredSearch,
      activeOnly,
      selectedPartnerId,
      selectedStatus,
      selectedProjectType,
      selectedCountry,
      selectedImpactTypes,
      sortBy,
    ]
  );

  const partnerOptions = useMemo(
    (): CustomSelectOption[] => createPartnerOptions(partners, t),
    [partners, t]
  );

  const countryOptions = useMemo(
    (): CustomSelectOption[] => createCountryOptions(countries, t),
    [countries, t]
  );

  const impactTypeOptions = useMemo(
    (): CustomSelectOption[] => createImpactTypeOptions(impactTypesData?.types),
    [impactTypesData]
  );

  const statusOptions = useMemo(
    (): CustomSelectOption[] => createProjectStatusOptions(t),
    [t]
  );

  const typeOptions = useMemo(
    (): CustomSelectOption[] => createProjectTypeOptions(t),
    [t]
  );

  const sortOptions = useMemo(
    (): CustomSelectOption[] => createSortOptions(t),
    [t]
  );

  const sortSelectionItems = useMemo(() => getSortSelectionItems(t), [t]);

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        search.trim() ||
          activeOnly ||
          selectedPartnerId ||
          selectedStatus ||
          selectedProjectType ||
          selectedCountry ||
          selectedImpactTypes.length > 0 ||
          sortBy !== 'created_at_desc'
      ),
    [
      search,
      activeOnly,
      selectedPartnerId,
      selectedStatus,
      selectedProjectType,
      selectedCountry,
      selectedImpactTypes,
      sortBy,
    ]
  );

  const handleFilterChange = useCallback(
    (filterFn: () => void) => {
      startFilterTransition(filterFn);
    },
    [startFilterTransition]
  );

  const resetFilters = useCallback(() => {
    startFilterTransition(() => {
      setSearch('');
      setActiveOnly(false);
      setSelectedPartnerId(undefined);
      setSelectedStatus(undefined);
      setSelectedProjectType(undefined);
      setSelectedCountry(undefined);
      setSelectedImpactTypes([]);
      setSortBy('created_at_desc');
      setCursor(undefined);
    });
    refetch();
  }, [refetch, startFilterTransition]);

  const handleRemoveImpactType = useCallback(
    (typeToRemove: string) => {
      removeOptimisticImpactType(typeToRemove);
      handleFilterChange(() => {
        setSelectedImpactTypes(prev =>
          prev.filter(type => type !== typeToRemove)
        );
      });
    },
    [removeOptimisticImpactType, handleFilterChange]
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      handleFilterChange(() =>
        setSelectedStatus(value === 'all' ? undefined : (value as ProjectStatus))
      );
    },
    [handleFilterChange]
  );

  const handleProjectTypeChange = useCallback(
    (value: string) => {
      handleFilterChange(() =>
        setSelectedProjectType(value === 'all' ? undefined : value)
      );
    },
    [handleFilterChange]
  );

  const handlePartnerChange = useCallback(
    (value: string) => {
      handleFilterChange(() =>
        setSelectedPartnerId(value === 'all' ? undefined : value)
      );
    },
    [handleFilterChange]
  );

  const handleCountryChange = useCallback(
    (value: string) => {
      handleFilterChange(() =>
        setSelectedCountry(value === 'all' ? undefined : value)
      );
    },
    [handleFilterChange]
  );

  const handleSortChange = useCallback(
    (value: string) => {
      handleFilterChange(() => setSortBy(value as ProjectSortOption));
    },
    [handleFilterChange]
  );

  const handleImpactTypeAdd = useCallback(
    (value: string) => {
      if (!value || selectedImpactTypes.includes(value)) return;
      handleFilterChange(() =>
        setSelectedImpactTypes(prev => [...prev, value])
      );
    },
    [handleFilterChange, selectedImpactTypes]
  );

  const handleActiveOnlyToggle = useCallback(
    (next: boolean) => {
      handleFilterChange(() => setActiveOnly(next));
    },
    [handleFilterChange]
  );

  const mapLegendCounts = useMemo(
    () => ({
      beehive: projectsForMap.filter(project => project.type === 'beehive').length,
      olive_tree: projectsForMap.filter(project => project.type === 'olive_tree').length,
      vineyard: projectsForMap.filter(project => project.type === 'vineyard').length,
    }),
    [projectsForMap]
  );

  const legendActiveType: LegendFilterType = selectedProjectType
    ? (selectedProjectType as LegendFilterType)
    : 'all';

  const handleLegendSelect = useCallback(
    (type: LegendFilterType) => {
      if (type === 'all') {
        handleProjectTypeChange('all');
        return;
      }
      handleFilterChange(() => {
        setSelectedProjectType(prev => (prev === type ? undefined : type));
      });
    },
    [handleFilterChange, handleProjectTypeChange]
  );

  const mapFilterCount = useMemo(() => {
    let count = 0;
    if (search.trim()) count += 1;
    if (activeOnly) count += 1;
    if (selectedPartnerId) count += 1;
    if (selectedStatus) count += 1;
    if (selectedProjectType) count += 1;
    if (selectedCountry) count += 1;
    if (selectedImpactTypes.length > 0) count += selectedImpactTypes.length;
    if (sortBy !== 'created_at_desc') count += 1;
    return count;
  }, [
    search,
    activeOnly,
    selectedPartnerId,
    selectedStatus,
    selectedProjectType,
    selectedCountry,
    selectedImpactTypes.length,
    sortBy,
  ]);

  const projectCountLabel = useCallback(
    (count: number) =>
      `${count} projet${count > 1 ? 's' : ''} affiché${count > 1 ? 's' : ''}`,
    []
  );

  const mapFilterPanelConfig = useMemo(
    () => ({
      filterCount: mapFilterCount,
      search: {
        placeholder: t('admin.projects.search_placeholder'),
        value: search,
        onChange: setSearch,
      },
      statusSelect: {
        name: 'status_filter',
        placeholder: t('admin.projects.filters.all_statuses'),
        options: statusOptions,
        value: selectedStatus || 'all',
        onChange: handleStatusChange,
        icon: <CheckCircle className="h-4 w-4 text-primary" />,
        disabled: isPendingFilters,
      },
      typeSelect: {
        name: 'type_filter',
        placeholder: t('admin.projects.filters.all_types'),
        options: typeOptions,
        value: selectedProjectType || 'all',
        onChange: handleProjectTypeChange,
        icon: <Sparkles className="h-4 w-4 text-primary" />,
        disabled: isPendingFilters,
      },
      partnerSelect: {
        name: 'partner_filter',
        placeholder: t('admin.projects.filters.all_partners'),
        options: partnerOptions,
        value: selectedPartnerId || 'all',
        onChange: handlePartnerChange,
        icon: <Building2 className="h-4 w-4 text-primary" />,
        disabled: isPendingPartners || !partners || isPendingFilters,
      },
      countrySelect: {
        name: 'country_filter',
        placeholder: t('admin.projects.filters.all_countries'),
        options: countryOptions,
        value: selectedCountry || 'all',
        onChange: handleCountryChange,
        icon: <Globe className="h-4 w-4 text-primary" />,
        disabled: isPendingCountries || !countries || isPendingFilters,
      },
      sortSelect: {
        name: 'sort_filter',
        placeholder: t('admin.projects.filters.sort_by'),
        options: sortOptions,
        value: sortBy,
        onChange: handleSortChange,
        icon: <ArrowUpDown className="h-4 w-4 text-primary" />,
        disabled: isPendingFilters,
      },
      impactTypeSelect: {
        name: 'impact_types_filter',
        placeholder: t('admin.projects.filters.impact_types'),
        options: impactTypeOptions,
        onChange: handleImpactTypeAdd,
        icon: <Target className="h-4 w-4 text-primary" />,
        disabled: isPendingImpactTypes || !impactTypesData || isPendingFilters,
      },
      selectedImpactTypes,
      onImpactTypeRemove: handleRemoveImpactType,
      activeOnly: {
        value: activeOnly,
        onChange: handleActiveOnlyToggle,
        label: t('admin.projects.filters.active_only'),
        disabled: isPendingFilters,
      },
      hasActiveFilters,
      onClearFilters: resetFilters,
      legend: {
        label: 'Typologie de projets',
        description: 'Affinez la vue par typologie d’impact.',
        active: legendActiveType,
        onSelect: handleLegendSelect,
        counts: mapLegendCounts,
      },
      projectLabel: projectCountLabel,
      tagsLabel: t('admin.projects.filters.impact_types'),
    }),
    [
      mapFilterCount,
      t,
      search,
      statusOptions,
      selectedStatus,
      handleStatusChange,
      isPendingFilters,
      typeOptions,
      selectedProjectType,
      handleProjectTypeChange,
      partnerOptions,
      selectedPartnerId,
      handlePartnerChange,
      isPendingPartners,
      partners,
      countryOptions,
      selectedCountry,
      handleCountryChange,
      isPendingCountries,
      countries,
      sortOptions,
      sortBy,
      handleSortChange,
      impactTypeOptions,
      handleImpactTypeAdd,
      isPendingImpactTypes,
      impactTypesData,
      selectedImpactTypes,
      handleRemoveImpactType,
      activeOnly,
      handleActiveOnlyToggle,
      hasActiveFilters,
      resetFilters,
      legendActiveType,
      handleLegendSelect,
      mapLegendCounts,
      projectCountLabel,
    ]
  );

  return (
    <AdminPageLayout>
      <AdminPageHeader>
        <div className="space-y-3 md:hidden">
          <div className="flex items-center gap-2">
            <AdminPageHeader.Search
              isLoading={isPendingProjects || isFetching}
              placeholder={t('admin.projects.search_placeholder')}
              value={search}
              onChange={setSearch}
            />
            <FilterButton
              isActive={isFilterActive}
              onClick={() => setIsFilterModalOpen(true)}
            />
          </div>
          <LocalizedLink className="w-full" href="/admin/projects/new">
            <Button className="w-full" size="sm" variant="accent">
              {t('admin.projects.new_project')}
            </Button>
          </LocalizedLink>
        </div>

        {/* Desktop Layout - reproduction exacte */}
        <div className="hidden space-y-4 md:block">
          <div className="flex items-center gap-4">
            <div className="max-w-md flex-1">
              <AdminPageHeader.Search
                isLoading={isPendingProjects || isFetching}
                placeholder={t('admin.projects.search_placeholder')}
                value={search}
                onChange={setSearch}
              />
            </div>
            <div className="flex items-center gap-3">
              <LocalizedLink href="/admin/projects/new">
                <Button className="w-full" icon={<Plus />} size="sm">
                  {t('admin.projects.new_project')}
                </Button>
              </LocalizedLink>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              {view !== 'map' && (
                <>
                  {/* Status Filter */}
                  <CustomSelect
                    name="status_filter"
                    contextIcon={<CheckCircle className="h-5 w-5" />}
                    className="w-52"
                    options={statusOptions}
                    placeholder={t('admin.projects.filters.all_statuses')}
                    value={selectedStatus || 'all'}
                    onChange={handleStatusChange}
                  />

                  {/* Project Type Filter */}
                  <CustomSelect
                    name="type_filter"
                    contextIcon={<Sparkles className="h-5 w-5" />}
                    className="w-56"
                    disabled={isPendingFilters}
                    options={typeOptions}
                    placeholder={t('admin.projects.filters.all_types')}
                    value={selectedProjectType || 'all'}
                    onChange={handleProjectTypeChange}
                  />

                  {/* Partner Filter */}
                  <CustomSelect
                    name="partner_filter"
                    contextIcon={<Building2 className="h-5 w-5" />}
                    className="w-56"
                    disabled={isPendingPartners || !partners || isPendingFilters}
                    options={partnerOptions}
                    placeholder={t('admin.projects.filters.all_partners')}
                    value={selectedPartnerId || 'all'}
                    onChange={handlePartnerChange}
                  />

                  {/* Country Filter */}
                  <CustomSelect
                    name="country_filter"
                    contextIcon={<Globe className="h-5 w-5" />}
                    className="w-48"
                    disabled={isPendingCountries || !countries || isPendingFilters}
                    options={countryOptions}
                    placeholder={t('admin.projects.filters.all_countries')}
                    value={selectedCountry || 'all'}
                    onChange={handleCountryChange}
                  />

                  {/* Sort */}
                  <CustomSelect
                    name="sort_filter"
                    contextIcon={<ArrowUpDown className="h-5 w-5" />}
                    className="w-52"
                    disabled={isPendingFilters}
                    options={sortOptions}
                    placeholder={t('admin.projects.filters.sort_by')}
                    value={sortBy}
                    onChange={handleSortChange}
                  />

                  {/* Impact Types */}
                  <CustomSelect
                    name="impact_types_filter"
                    contextIcon={<Target className="h-5 w-5" />}
                    className="w-48"
                    options={impactTypeOptions}
                    placeholder={t('admin.projects.filters.impact_types')}
                    value=""
                    disabled={
                      isPendingImpactTypes || !impactTypesData || isPendingFilters
                    }
                    onChange={handleImpactTypeAdd}
                  />

                  {/* Active Only Checkbox */}
                  <CheckboxWithLabel
                    checked={activeOnly}
                    disabled={isPendingFilters}
                    label={t('admin.projects.filters.active_only')}
                    onCheckedChange={value =>
                      handleActiveOnlyToggle(Boolean(value))
                    }
                  />
                </>
              )}

              {/* View Toggle */}
              <ViewToggle
                availableViews={['grid', 'list', 'map']}
                value={view}
                onChange={setView}
              />

              {/* Clear Filters */}
              {view !== 'map' && hasActiveFilters && (
                <Button
                  className="text-muted-foreground hover:text-foreground h-auto border-dashed px-3 py-2 text-xs"
                  size="sm"
                  variant="outline"
                  onClick={resetFilters}
                >
                  {t('admin.projects.filters.clear_filters')}
                </Button>
              )}

              {/* Impact Type Tags */}
              {view !== 'map' && optimisticImpactTypes.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {optimisticImpactTypes.map(type => (
                    <span
                      key={type}
                      className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 focus:ring-primary/20 inline-flex cursor-pointer items-center gap-1 rounded-md border px-2 py-1 text-xs focus:ring-2 focus:outline-none"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleRemoveImpactType(type)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleRemoveImpactType(type);
                        }
                      }}
                    >
                      {formatImpactTypeLabel(type)}
                      <span className="text-primary/60 hover:text-primary">
                        ×
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminPageHeader>

      <AdminPageLayout.Content>
        {(() => {
          if (isError) {
            return (
              <EmptyState
                icon={MapPin}
                title={t('admin.projects.error.loading_title')}
                variant="muted"
                action={
                  <Button size="sm" variant="outline" onClick={() => refetch()}>
                    {t('admin.projects.error.retry')}
                  </Button>
                }
                description={
                  error?.message || t('admin.projects.error.loading_description')
                }
              />
            );
          }

          if (view === 'map') {
            if (isPendingProjects) {
              return (
                <div className="bg-muted flex h-[600px] items-center justify-center rounded-lg border">
                  <div className="text-center">
                    <div className="border-primary mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
                    <p className="text-muted-foreground text-sm">
                      Chargement de la carte...
                    </p>
                  </div>
                </div>
              );
            }

            if (projectsForMap.length === 0) {
              return (
                <div className="bg-muted flex h-[600px] items-center justify-center rounded-lg border">
                  <div className="text-center">
                    <MapPin className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                    <h3 className="mb-2 text-lg font-semibold">
                      Aucun projet avec localisation
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Les projets doivent avoir des coordonnées GPS pour apparaître
                      sur la carte.
                    </p>
                    <Button size="sm" variant="outline" onClick={resetFilters}>
                      Réinitialiser les filtres
                    </Button>
                  </div>
                </div>
              );
            }

            return (
              <MapContainer
                projects={deferredProjectsForMap}
                selectedProject={selectedProject}
                selectedType={legendActiveType}
                onProjectSelect={setSelectedProject}
                filterPanel={mapFilterPanelConfig}
              />
            );
          }

          // Grid/List View
          return (
            <DataList
              isLoading={isPendingProjects}
              items={projects}
              variant={view}
              emptyState={{
                icon: MapPin,
                title: t('admin.projects.empty_state.title'),
                description: t('admin.projects.empty_state.description'),
                action: (
                  <Button size="sm" variant="outline" onClick={resetFilters}>
                    {t('admin.projects.filters.reset')}
                  </Button>
                ),
              }}
              renderItem={project => (
                <Project
                  key={project.id}
                  project={project}
                  queryParams={queryParams}
                  view={view}
                  onFilterChange={{
                    setProjectType: (type: string) =>
                      handleFilterChange(() => setSelectedProjectType(type)),
                    setPartner: (partnerId: string) =>
                      handleFilterChange(() => setSelectedPartnerId(partnerId)),
                    setCountry: (country: string) =>
                      handleFilterChange(() => setSelectedCountry(country)),
                    addImpactType: (type: string) => {
                      if (!selectedImpactTypes.includes(type)) {
                        handleFilterChange(() =>
                          setSelectedImpactTypes([...selectedImpactTypes, type])
                        );
                      }
                    },
                  }}
                />
              )}
              renderSkeleton={() =>
                view === 'grid' ? (
                  <ProjectCardSkeleton />
                ) : (
                  <ProjectListSkeleton />
                )
              }
            />
          );
        })()}

        {totalProjects > pageSize && (
          <div className="mt-6">
            <AdminPagination
              pagination={{
                currentPage: Math.max(
                  1,
                  Math.floor((totalProjects - projects.length) / pageSize) + 1
                ),
                pageSize,
                totalItems: totalProjects,
                totalPages,
              }}
            />
          </div>
        )}
      </AdminPageLayout.Content>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      >
        <Filters>
          <Filters.View view={view} onViewChange={setView} />

          <Filters.Selection
            allLabel=""
            items={sortSelectionItems}
            label={t('admin.projects.filters.sort_by')}
            selectedId={sortBy}
            onSelectionChange={id =>
              handleFilterChange(() =>
                setSortBy((id || 'created_at_desc') as ProjectSortOption)
              )
            }
          />

          <Filters.Selection
            allLabel={t('admin.projects.filters.all_statuses')}
            label={t('admin.projects.labels.status')}
            selectedId={selectedStatus}
            items={
              statusOptions?.map(opt => ({ id: opt.value, name: opt.label })) ||
              []
            }
            onSelectionChange={id =>
              handleFilterChange(() =>
                setSelectedStatus(
                  !id || id === 'all' ? undefined : (id as ProjectStatus)
                )
              )
            }
          />

          <Filters.Selection
            allLabel={t('admin.projects.filters.all_partners')}
            items={partners || []}
            label={t('admin.projects.filter_modal.partner')}
            selectedId={selectedPartnerId}
            onSelectionChange={id =>
              handleFilterChange(() => setSelectedPartnerId(id))
            }
          />

          <Filters.Selection
            allLabel={t('admin.projects.filters.all_types')}
            label={t('admin.projects.filter_modal.type')}
            selectedId={selectedProjectType}
            items={
              typeOptions?.map(opt => ({ id: opt.value, name: opt.label })) ||
              []
            }
            onSelectionChange={id =>
              handleFilterChange(() => setSelectedProjectType(id))
            }
          />

          <Filters.Selection
            allLabel={t('admin.projects.filters.all_countries')}
            items={countries || []}
            label={t('admin.projects.filter_modal.country')}
            selectedId={selectedCountry}
            onSelectionChange={id =>
              handleFilterChange(() => setSelectedCountry(id))
            }
          />

          <Filters.Selection
            allLabel=""
            label={t('admin.projects.filter_modal.impact_types')}
            selectedId=""
            items={
              impactTypesData?.types?.map(type => ({
                id: type,
                name: formatImpactTypeLabel(type),
              })) ||
              []
            }
            onSelectionChange={typeId => {
              if (typeId && !selectedImpactTypes.includes(typeId)) {
                handleFilterChange(() =>
                  setSelectedImpactTypes([...selectedImpactTypes, typeId])
                );
              }
            }}
          />

          <Filters.Toggle
            checked={activeOnly}
            label={t('admin.projects.filter_modal.active_only_description')}
            onCheckedChange={v => handleFilterChange(() => setActiveOnly(v))}
          />

          {hasActiveFilters && (
            <div className="border-border/30 border-t pt-4">
              <Button
                className="text-muted-foreground hover:text-foreground w-full border-dashed"
                size="sm"
                variant="outline"
                onClick={() => {
                  resetFilters();
                  setIsFilterModalOpen(false);
                }}
              >
                {t('admin.projects.filters.clear_all_filters')}
              </Button>
            </div>
          )}
        </Filters>
      </FilterModal>
    </AdminPageLayout>
  );
};

export default ProjectsPage;
