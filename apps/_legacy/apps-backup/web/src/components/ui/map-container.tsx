'use client';

import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { Icon, DivIcon, Map as LeafletMap, latLngBounds } from 'leaflet';
import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './map-container.css';
import MarkerClusterGroup from 'react-leaflet-cluster';
import {
  Leaf,
  Badge,
  TreePine,
  Grape,
  ExternalLink,
  TrendingUp,
  Users,
  Zap,
  MapPin,
  X,
  ChevronRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@make-the-change/core/shared/utils';
import {
  MapFilterPanel,
  type LegendFilterType,
  type MapFilterSelectConfig,
} from '@/components/ui/map-filter-panel';

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

type MapLegendCounts = Record<'beehive' | 'olive_tree' | 'vineyard', number>;

type MapFilterConfig = {
  filterCount: number;
  search: {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
  };
  statusSelect: MapFilterSelectConfig;
  typeSelect: MapFilterSelectConfig;
  partnerSelect: MapFilterSelectConfig;
  countrySelect: MapFilterSelectConfig;
  sortSelect: MapFilterSelectConfig;
  impactTypeSelect: Omit<MapFilterSelectConfig, 'value'>;
  selectedImpactTypes: string[];
  onImpactTypeRemove: (value: string) => void;
  activeOnly: {
    value: boolean;
    onChange: (value: boolean) => void;
    label: string;
    disabled?: boolean;
  };
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  legend: {
    label: string;
    description?: string;
    active: LegendFilterType;
    onSelect: (value: LegendFilterType) => void;
    counts: MapLegendCounts;
  };
  projectLabel: (count: number) => string;
  tagsLabel: string;
};

type MapContainerProps = {
  projects: ProjectLocation[];
  selectedProject: ProjectLocation | null;
  onProjectSelect: (project: ProjectLocation) => void;
  selectedType: string;
  filterPanel: MapFilterConfig;
};

const projectTypeLabels = {
  beehive: 'Ruche',
  olive_tree: 'Olivier',
  vineyard: 'Vigne',
};

const projectTypeIcons = {
  beehive: `<path d="M12 2C13.1 2 14 2.9 14 4V5H17C18.1 5 19 5.9 19 7V10C19 11.1 18.1 12 17 12H16V14H17C18.1 14 19 14.9 19 16V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V16C5 14.9 5.9 14 7 14H8V12H7C5.9 12 5 11.1 5 10V7C5 5.9 5.9 5 7 5H10V4C10 2.9 10.9 2 12 2ZM16 7H8V10H10V12H8V14H16V12H14V10H16V7Z" fill="white"/>`,
  olive_tree: `<path d="M12 3C8.1 3 5 6.1 5 10C5 13.9 8.1 17 12 17C15.9 17 19 13.9 19 10C19 6.1 15.9 3 12 3ZM12 21L10.5 19.5C6.4 15.4 4 12 4 8.5C4 5.4 6.4 3 9.5 3C10.8 3 12.1 3.5 13 4.4C13.9 3.5 15.2 3 16.5 3C19.6 3 22 5.4 22 8.5C22 12 19.6 15.4 15.5 19.5L12 21Z" fill="white"/>`,
  vineyard: `<path d="M9.75 12C11.13 12 12.25 10.88 12.25 9.5S11.13 7 9.75 7S7.25 8.12 7.25 9.5S8.37 12 9.75 12ZM15.75 12C17.13 12 18.25 10.88 18.25 9.5S17.13 7 15.75 7S13.25 8.12 13.25 9.5S14.37 12 15.75 12ZM9.75 16C11.13 16 12.25 14.88 12.25 13.5S11.13 11 9.75 11S7.25 12.12 7.25 13.5S8.37 16 9.75 16ZM15.75 16C17.13 16 18.25 14.88 18.25 13.5S17.13 11 15.75 11S13.25 12.12 13.25 13.5S14.37 16 15.75 16ZM12 21L10.5 19.5C6.4 15.4 4 12 4 8.5C4 5.4 6.4 3 9.5 3C10.8 3 12.1 3.5 13 4.4C13.9 3.5 15.2 3 16.5 3C19.6 3 22 5.4 22 8.5C22 12 19.6 15.4 15.5 19.5L12 21Z" fill="white"/>`,
};

const BRAND_PRIMARY_START = '#3B82F6';
const BRAND_PRIMARY_END = '#14B8A6';
const ACCENT_START = '#FDE74C';
const ACCENT_END = '#FFC700';

const PROJECT_TYPE_THEME: Record<
  ProjectLocation['type'],
  {
    base: string;
    progressStart: string;
    progressEnd: string;
  }
> = {
  beehive: {
    base: '#F59E0B',
    progressStart: '#FCD34D',
    progressEnd: '#F59E0B',
  },
  olive_tree: {
    base: '#10B981',
    progressStart: '#6EE7B7',
    progressEnd: '#047857',
  },
  vineyard: {
    base: '#8B5CF6',
    progressStart: '#DDD6FE',
    progressEnd: '#7C3AED',
  },
};

const TYPE_BADGE_STYLES: Record<ProjectLocation['type'], string> = {
  beehive: 'bg-amber-100 text-amber-700 ring-amber-200',
  olive_tree: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  vineyard: 'bg-violet-100 text-violet-700 ring-violet-200',
};

const currencyFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('fr-FR', {
  maximumFractionDigits: 0,
});

const formatCurrency = (value: number) =>
  currencyFormatter.format(Math.max(0, value || 0));

const formatNumber = (value: number | undefined) =>
  typeof value === 'number' ? numberFormatter.format(value) : null;

const createProjectIcon = (
  type: ProjectLocation['type'],
  progress: number = 0,
  isHighlighted: boolean = false
) => {
  const theme = PROJECT_TYPE_THEME[type] ?? PROJECT_TYPE_THEME.beehive;
  const iconSvg =
    projectTypeIcons[type as keyof typeof projectTypeIcons] ||
    projectTypeIcons.beehive;

  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  const size = isHighlighted ? 64 : 56;
  const height = size + 16;
  const progressRadius = 17.5;
  const circumference = 2 * Math.PI * progressRadius;
  const progressStroke = (normalizedProgress / 100) * circumference;
  const remainingStroke = Math.max(circumference - progressStroke, 0);

  const svgString = `
    <svg width="${size}" height="${height}" viewBox="0 0 56 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="markerGradient${type}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${BRAND_PRIMARY_START}"/>
          <stop offset="100%" stop-color="${BRAND_PRIMARY_END}"/>
        </linearGradient>
        <linearGradient id="progressGradient${type}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${theme.progressStart}"/>
          <stop offset="100%" stop-color="${theme.progressEnd}"/>
        </linearGradient>
        <filter id="markerShadow${type}" x="-40%" y="-40%" width="180%" height="220%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="rgba(15,23,42,0.25)"/>
        </filter>
      </defs>

      <g filter="url(#markerShadow${type})">
        <path d="M28 2C18 2 8 10.7 8 22.5C8 33.5 25.5 54 27.3 55.9C27.7 56.3 28.3 56.3 28.7 55.9C30.5 54 48 33.5 48 22.5C48 10.7 38 2 28 2Z" fill="url(#markerGradient${type})"/>
        <circle cx="28" cy="22" r="19.5" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.35)" stroke-width="1.2"/>
        <circle cx="28" cy="22" r="16" fill="${theme.base}" />
        <circle
          cx="28"
          cy="22"
          r="${progressRadius}"
          fill="none"
          stroke="url(#progressGradient${type})"
          stroke-width="3.8"
          stroke-linecap="round"
          stroke-dasharray="${progressStroke.toFixed(1)} ${remainingStroke.toFixed(1)}"
          transform="rotate(-90 28 22)"
        />
        <g transform="translate(21, 15) scale(0.6)">
          ${iconSvg}
        </g>
      </g>

      <path d="M28 55L20.5 69H35.5L28 55Z" fill="url(#markerGradient${type})" stroke="rgba(255,255,255,0.6)" stroke-width="1.2"/>

      ${
        isHighlighted
          ? `<circle cx="28" cy="22" r="26" fill="none" stroke="rgba(59,130,246,0.55)" stroke-width="1.6" stroke-dasharray="6 6">
              <animate attributeName="stroke-dashoffset" values="0;12" dur="4s" repeatCount="indefinite"/>
            </circle>`
          : ''
      }
    </svg>
  `;

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgString)}`,
    iconSize: [size, height],
    iconAnchor: [size / 2, height - 6],
    popupAnchor: [0, -(height * 0.55)],
  });
};

const createClusterIcon = (count: number) => {
  const size = count > 60 ? 76 : count > 25 ? 68 : 60;
  const fontSize = count > 60 ? 24 : count > 25 ? 20 : 18;

  const html = `
    <div class="cluster-marker" style="
      width:${size}px;
      height:${size}px;
      background:linear-gradient(135deg, ${BRAND_PRIMARY_START}, ${BRAND_PRIMARY_END});
      box-shadow:0 24px 40px -22px rgba(30, 64, 175, 0.55);
      border:3px solid rgba(255,255,255,0.68);
      color:#fff;
      font-weight:700;
      font-family: 'Inter', sans-serif;
      display:flex;
      align-items:center;
      justify-content:center;
      position:relative;
      border-radius:9999px;
    ">
      <span style="font-size:${fontSize}px;">${count}</span>
      <span style="
        position:absolute;
        inset:-10px;
        border-radius:9999px;
        border:2px solid rgba(255,255,255,0.25);
        opacity:0.7;
      "></span>
    </div>
  `;

  return new DivIcon({
    html,
    className: 'project-cluster-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

export default function MapContainer({
  projects,
  selectedProject,
  onProjectSelect,
  selectedType,
  filterPanel,
}: MapContainerProps) {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<LeafletMap | null>(null);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  const {
    filterCount,
    search,
    statusSelect,
    typeSelect,
    partnerSelect,
    countrySelect,
    sortSelect,
    impactTypeSelect,
    selectedImpactTypes,
    onImpactTypeRemove,
    activeOnly: activeOnlyConfig,
    hasActiveFilters,
    onClearFilters,
    legend,
    projectLabel,
    tagsLabel,
  } = filterPanel;

  const clusterIconFactory = useCallback(
    (cluster: { getChildCount: () => number }) =>
      createClusterIcon(cluster.getChildCount()),
    []
  );

  const handleZoom = useCallback(
    (direction: 'in' | 'out') => {
      if (!mapInstance) return;
      if (direction === 'in') {
        mapInstance.zoomIn();
      } else {
        mapInstance.zoomOut();
      }
    },
    [mapInstance]
  );

  const filtersSignatureRef = useRef<string | null>(null);

  const filteredProjects = useMemo(() => {
    return selectedType === 'all'
      ? projects
      : projects.filter(p => p.type === selectedType);
  }, [projects, selectedType]);

  const filteredProjectsSignature = useMemo(
    () => filteredProjects.map(project => project.id).join('|'),
    [filteredProjects]
  );

  const filteredCoordinates = useMemo(
    () => filteredProjects.map(project => project.coordinates),
    [filteredProjects]
  );

  const handleProjectHover = useCallback((project: ProjectLocation | null) => {
    setHoveredProject(project?.id || null);
  }, []);

  const handleProjectClick = useCallback((project: ProjectLocation) => {
    onProjectSelect(project);
  }, [onProjectSelect]);

  const defaultCenter = useMemo(() => {
    if (projects.length === 0) return [46.603_354, 1.888_334];

    const lats = projects
      .map(p => p.coordinates[0])
      .filter(lat => lat !== 0);
    const lngs = projects
      .map(p => p.coordinates[1])
      .filter(lng => lng !== 0);

    if (lats.length === 0 || lngs.length === 0) return [46.603_354, 1.888_334];

    const avgLat = lats.reduce((sum, lat) => sum + lat, 0) / lats.length;
    const avgLng = lngs.reduce((sum, lng) => sum + lng, 0) / lngs.length;

    return [avgLat, avgLng];
  }, [projects]);

  const defaultZoom = useMemo(
    () => (projects.length <= 1 ? 8 : 5),
    [projects.length]
  );

  const selectedProjectId = selectedProject?.id ?? null;
  const selectedProjectCoordinates = selectedProject?.coordinates;

  useEffect(() => {
    if (!mapInstance) return;
    if (!selectedProject || !selectedProjectCoordinates) return;

    const [lat, lng] = selectedProjectCoordinates;

    requestAnimationFrame(() => {
      mapInstance.flyTo([lat, lng], Math.max(mapInstance.getZoom(), 9), {
        duration: 0.8,
        easeLinearity: 0.25,
      });
    });
  }, [mapInstance, selectedProjectId, selectedProjectCoordinates]);

  useEffect(() => {
    if (!mapInstance) return;

    if (selectedProject) {
      filtersSignatureRef.current = filteredProjectsSignature;
      return;
    }

    if (!filteredCoordinates.length) {
      filtersSignatureRef.current = null;
      return;
    }

    if (filteredProjectsSignature === filtersSignatureRef.current) {
      return;
    }

    filtersSignatureRef.current = filteredProjectsSignature;

    if (filteredCoordinates.length === 1) {
      const [lat, lng] = filteredCoordinates[0];

      requestAnimationFrame(() => {
        mapInstance.flyTo([lat, lng], Math.max(mapInstance.getZoom(), 8), {
          duration: 0.8,
          easeLinearity: 0.25,
        });
      });
      return;
    }

    if (filteredCoordinates.length > 200) {
      return;
    }

    requestAnimationFrame(() => {
      const targetBounds = latLngBounds(filteredCoordinates);
      const paddedBounds = targetBounds.pad(0.22);
      const currentBounds = mapInstance.getBounds();

      if (currentBounds.contains(paddedBounds)) {
        return;
      }

      mapInstance.flyToBounds(paddedBounds, {
        duration: 0.9,
        easeLinearity: 0.25,
        padding: [120, 120] as [number, number],
      });
    });
  }, [filteredCoordinates, filteredProjectsSignature, mapInstance, selectedProject]);

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-xl border bg-gradient-to-br from-blue-50 to-green-50 shadow-lg">
      <LeafletMapContainer
        zoomControl={false}
        center={defaultCenter as [number, number]}
        style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        className="rounded-xl"
        whenCreated={instance => {
          setMapInstance(instance);
          requestAnimationFrame(() => {
            instance.invalidateSize();
          });
        }}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          opacity={0.9}
        />

        <MarkerClusterGroup
          chunkedLoading
          spiderfyOnMaxZoom
          showCoverageOnHover={false}
          maxClusterRadius={60}
          iconCreateFunction={clusterIconFactory}
        >
          {filteredProjects.map(project => {
            if (
              !project.coordinates ||
              project.coordinates[0] === 0 ||
              project.coordinates[1] === 0 ||
              Number.isNaN(project.coordinates[0]) ||
              Number.isNaN(project.coordinates[1])
            ) {
              return null;
            }

            const isHovered = hoveredProject === project.id;
            const isSelected = selectedProject?.id === project.id;
            const markerIcon = createProjectIcon(
              project.type,
              project.fundingProgress,
              isSelected || isHovered
            );

            const metrics: Array<{
              key: string;
              icon: JSX.Element;
              label: string;
              value: string;
              gradient: string;
            }> = [];

            if (project.impactMetrics.co2_offset_kg_per_year) {
              metrics.push({
                key: 'co2',
                icon: <Leaf className="h-4 w-4 text-emerald-500" />, 
                label: 'CO₂ compensé',
                value: `${formatNumber(project.impactMetrics.co2_offset_kg_per_year)} kg/an`,
                gradient: 'from-emerald-50 to-emerald-100',
              });
            }

            if (project.impactMetrics.local_jobs_created) {
              metrics.push({
                key: 'jobs',
                icon: <Users className="h-4 w-4 text-sky-500" />, 
                label: 'Emplois locaux',
                value: `${formatNumber(project.impactMetrics.local_jobs_created) ?? '—'}`,
                gradient: 'from-sky-50 to-sky-100',
              });
            }

            if (project.impactMetrics.biodiversity_score) {
              metrics.push({
                key: 'biodiversity',
                icon: <TreePine className="h-4 w-4 text-violet-500" />, 
                label: 'Biodiversité',
                value: `${formatNumber(project.impactMetrics.biodiversity_score) ?? '—'}/100`,
                gradient: 'from-violet-50 to-violet-100',
              });
            }

            if (project.impactMetrics.educational_visits) {
              metrics.push({
                key: 'visits',
                icon: <Badge className="h-4 w-4 text-amber-500" />, 
                label: 'Visites pédagogiques',
                value: `${formatNumber(project.impactMetrics.educational_visits) ?? '—'}`,
                gradient: 'from-amber-50 to-amber-100',
              });
            }

            return (
              <Marker
                key={project.id}
                icon={markerIcon}
                position={project.coordinates as [number, number]}
                eventHandlers={{
                  click: () => handleProjectClick(project),
                  mouseover: () => handleProjectHover(project),
                  mouseout: () => handleProjectHover(null),
                }}
              >
                <Popup closeButton={false} className="custom-popup">
                  <div className="map-popup-card w-[320px] max-w-[360px] overflow-hidden rounded-3xl border border-white/40 bg-white/95 shadow-[0_22px_50px_-28px_rgba(30,64,175,0.45)] backdrop-blur-2xl">
                    <div className="relative bg-[linear-gradient(135deg,rgba(59,130,246,0.9),rgba(20,184,166,0.9))] p-5 text-white">
                      <div className="flex items-start justify-between gap-4">
                        <div className="max-w-[220px]">
                          <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">
                            {projectTypeLabels[project.type]}
                          </p>
                          <h3 className="mt-1 text-lg font-semibold leading-tight">
                            {project.name}
                          </h3>
                          <p className="mt-1 text-sm text-white/75">
                            {project.partnerName}
                          </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/30 bg-white/15 backdrop-blur-sm">
                          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                            {project.type === 'beehive' && (
                              <path d="M12 2C13.1 2 14 2.9 14 4V5H17C18.1 5 19 5.9 19 7V10C19 11.1 18.1 12 17 12H16V14H17C18.1 14 19 14.9 19 16V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V16C5 14.9 5.9 14 7 14H8V12H7C5.9 12 5 11.1 5 10V7C5 5.9 5.9 5 7 5H10V4C10 2.9 10.9 2 12 2ZM16 7H8V10H10V12H8V14H16V12H14V10H16V7Z" fill="white"/>
                            )}
                            {project.type === 'olive_tree' && (
                              <path d="M12 3C8.1 3 5 6.1 5 10C5 13.9 8.1 17 12 17C15.9 17 19 13.9 19 10C19 6.1 15.9 3 12 3ZM12 21L10.5 19.5C6.4 15.4 4 12 4 8.5C4 5.4 6.4 3 9.5 3C10.8 3 12.1 3.5 13 4.4C13.9 3.5 15.2 3 16.5 3C19.6 3 22 5.4 22 8.5C22 12 19.6 15.4 15.5 19.5L12 21Z" fill="white"/>
                            )}
                            {project.type === 'vineyard' && (
                              <path d="M9.75 12C11.13 12 12.25 10.88 12.25 9.5S11.13 7 9.75 7S7.25 8.12 7.25 9.5S8.37 12 9.75 12ZM15.75 12C17.13 12 18.25 10.88 18.25 9.5S17.13 7 15.75 7S13.25 8.12 13.25 9.5S14.37 12 15.75 12ZM9.75 16C11.13 16 12.25 14.88 12.25 13.5S11.13 11 9.75 11S7.25 12.12 7.25 13.5S8.37 16 9.75 16ZM15.75 16C17.13 16 18.25 14.88 18.25 13.5S17.13 11 15.75 11S13.25 12.12 13.25 13.5S14.37 16 15.75 16ZM12 21L10.5 19.5C6.4 15.4 4 12 4 8.5C4 5.4 6.4 3 9.5 3C10.8 3 12.1 3.5 13 4.4C13.9 3.5 15.2 3 16.5 3C19.6 3 22 5.4 22 8.5C22 12 19.6 15.4 15.5 19.5L12 21Z" fill="white"/>
                            )}
                          </svg>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-white/80">
                        <MapPin className="h-4 w-4" />
                        <span>{project.city}, {project.country}</span>
                      </div>
                    </div>

                    <div className="space-y-4 p-5">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-600">
                          <span className={cn('inline-flex h-2.5 w-2.5 rounded-full', {
                            'bg-amber-400': project.type === 'beehive',
                            'bg-emerald-400': project.type === 'olive_tree',
                            'bg-violet-400': project.type === 'vineyard',
                          })} />
                          {projectTypeLabels[project.type]}
                        </span>
                        <span className="rounded-full border border-white/40 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-500">
                          {project.fundingProgress.toFixed(0)}% financé
                        </span>
                      </div>

                      {project.description && (
                        <p className="text-sm text-slate-600 line-clamp-3">
                          {project.description}
                        </p>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                          <span>Financement</span>
                          <span className="text-slate-700">
                            {Math.round(project.fundingProgress)}%
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-200/70">
                          <div
                            className="h-full rounded-full bg-[linear-gradient(120deg,var(--color-accent-start),var(--color-accent-end))] transition-all duration-500"
                            style={{ width: `${Math.min(project.fundingProgress, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] font-medium text-slate-400">
                          <span>{formatCurrency(project.currentFunding)}</span>
                          <span>{formatCurrency(project.targetBudget)}</span>
                        </div>
                      </div>

                      {metrics.length > 0 && (
                        <div className="grid grid-cols-2 gap-3">
                          {metrics.map(metric => (
                            <div
                              key={metric.key}
                              className={cn(
                                'rounded-2xl border border-white/50 bg-gradient-to-br p-3 shadow-sm backdrop-blur-sm',
                                metric.gradient
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white/80 text-slate-600 shadow-sm">
                                  {metric.icon}
                                </span>
                                <div>
                                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                    {metric.label}
                                  </p>
                                  <p className="text-sm font-semibold text-slate-800">
                                    {metric.value}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          <TrendingUp className="h-4 w-4 text-[color:var(--brand-primary-start)]" />
                          <span>L’anneau reflète la progression du financement.</span>
                        </div>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] shadow-sm',
                            TYPE_BADGE_STYLES[project.type]
                          )}
                        >
                          Impact
                        </span>
                      </div>

                      <Button
                        variant="default"
                        size="sm"
                        className="mt-2 w-full justify-between px-4"
                        onClick={() => handleProjectClick(project)}
                      >
                        <span>Voir le projet</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </LeafletMapContainer>

      {/* Floating Filter Panel */}
      <div className="pointer-events-none absolute left-6 top-6 z-[1200]">
        <div className="pointer-events-auto">
          <MapFilterPanel
            collapsed={isPanelCollapsed}
            onToggleCollapse={() => setIsPanelCollapsed(prev => !prev)}
            filterCount={filterCount}
            search={search}
            statusSelect={statusSelect}
            typeSelect={typeSelect}
            partnerSelect={partnerSelect}
            countrySelect={countrySelect}
            sortSelect={sortSelect}
            impactTypeSelect={impactTypeSelect}
            selectedImpactTypes={selectedImpactTypes}
            onImpactTypeRemove={onImpactTypeRemove}
            activeOnly={activeOnlyConfig}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={onClearFilters}
            legend={legend}
            projectCount={filteredProjects.length}
            projectLabel={projectLabel}
            tagsLabel={tagsLabel}
          />
        </div>
      </div>

      {/* Custom Zoom Controls */}
      <div className="absolute bottom-6 right-6 z-[1100] flex flex-col gap-2">
        <button
          type="button"
          aria-label="Zoomer"
          className="floating h-12 w-12 rounded-2xl border border-white/40 bg-white/80 shadow-[0_18px_35px_-20px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-all duration-200 hover:scale-105 hover:bg-white"
          onClick={() => handleZoom('in')}
        >
          <span className="text-2xl font-semibold leading-none text-slate-600">
            +
          </span>
        </button>
        <button
          type="button"
          aria-label="Dézoomer"
          className="floating h-12 w-12 rounded-2xl border border-white/40 bg-white/80 shadow-[0_18px_35px_-20px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-all duration-200 hover:scale-105 hover:bg-white"
          onClick={() => handleZoom('out')}
        >
          <span className="text-2xl font-semibold leading-none text-slate-600">
            −
          </span>
        </button>
      </div>
    </div>
  );
}
