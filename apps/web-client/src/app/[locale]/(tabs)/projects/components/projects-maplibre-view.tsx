'use client'

import {
  Layer,
  type LayerProps,
  type MapLayerMouseEvent,
  Map as MapLibreMap,
  type MapRef,
  Source,
} from '@vis.gl/react-maplibre'
import { AnimatePresence, motion, type Transition, type Variants } from 'framer-motion'
import {
  ArrowUpRight,
  Bug,
  ChevronDown,
  ChevronUp,
  List,
  MapPin,
  TreePine,
  Waves,
  X,
} from 'lucide-react'
import { type GeoJSONSource, LngLatBounds, type MapGeoJSONFeature } from 'maplibre-gl'
import { type PointerEvent, useCallback, useMemo, useRef, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { formatCompact } from '@/lib/formatters'
import { sanitizeImageUrl } from '@/lib/image-url'
import {
  buildProjectMapFeatureCollection,
  type ProjectMapFeature,
  type ProjectMapFeatureCollection,
  type ProjectMapFeatureProperties,
  type ProjectMapSourceProject,
} from '../_features/project-map-data'

type ProjectsMapViewProps = {
  isVisible: boolean
  projects: ProjectMapSourceProject[]
  dockLayoutId: string
  dockTransition: Transition
  onShowCurrentView: () => void
}

const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'
const SOURCE_ID = 'projects-map-source'
const CLUSTER_LAYER_ID = 'projects-map-clusters'
const CLUSTER_COUNT_LAYER_ID = 'projects-map-cluster-count'
const POINT_HALO_LAYER_ID = 'projects-map-point-halo'
const POINT_LAYER_ID = 'projects-map-points'

const dockContentVariants = {
  initial: { opacity: 0, scale: 0.985, y: 8 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1], delay: 0.03 },
  },
  exit: {
    opacity: 0,
    scale: 0.985,
    y: -6,
    transition: { duration: 0.12, ease: [0.4, 0, 1, 1] },
  },
} satisfies Variants

const INITIAL_WORLD_VIEW = {
  longitude: 8,
  latitude: 24,
  zoom: 1.25,
}

const clusterLayer: LayerProps = {
  id: CLUSTER_LAYER_ID,
  type: 'circle' as const,
  source: SOURCE_ID,
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': ['step', ['get', 'point_count'], '#a3e635', 8, '#34d399', 20, '#22d3ee'],
    'circle-radius': ['step', ['get', 'point_count'], 19, 8, 25, 20, 33],
    'circle-stroke-color': 'rgba(11,15,21,0.88)',
    'circle-stroke-width': 4,
    'circle-opacity': 0.95,
  },
}

const clusterCountLayer: LayerProps = {
  id: CLUSTER_COUNT_LAYER_ID,
  type: 'symbol' as const,
  source: SOURCE_ID,
  filter: ['has', 'point_count'],
  layout: {
    'text-field': ['get', 'point_count_abbreviated'],
    'text-size': 12,
    'text-font': ['Noto Sans Bold'],
  },
  paint: {
    'text-color': '#0b0f15',
  },
}

const pointHaloLayer: LayerProps = {
  id: POINT_HALO_LAYER_ID,
  type: 'circle' as const,
  source: SOURCE_ID,
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': [
      'match',
      ['get', 'impactKind'],
      'reef',
      '#22d3ee',
      'orchard',
      '#84cc16',
      '#facc15',
    ],
    'circle-radius': 15,
    'circle-opacity': 0.18,
  },
}

const pointLayer: LayerProps = {
  id: POINT_LAYER_ID,
  type: 'circle' as const,
  source: SOURCE_ID,
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': [
      'match',
      ['get', 'impactKind'],
      'reef',
      '#22d3ee',
      'orchard',
      '#84cc16',
      '#facc15',
    ],
    'circle-radius': 7,
    'circle-stroke-color': '#0b0f15',
    'circle-stroke-width': 3,
  },
}

export function ProjectsMapView({
  isVisible,
  projects,
  dockLayoutId,
  dockTransition,
  onShowCurrentView,
}: ProjectsMapViewProps) {
  const mapRef = useRef<MapRef | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [isDockExpanded, setIsDockExpanded] = useState(false)
  const [isMapReady, setIsMapReady] = useState(false)
  const featureCollection = useMemo(() => buildProjectMapFeatureCollection(projects), [projects])
  const mappedProjectsCount = featureCollection.features.length

  const selectedFeature = useMemo(
    () =>
      featureCollection.features.find((feature) => feature.properties.id === selectedProjectId) ||
      null,
    [featureCollection.features, selectedProjectId],
  )

  const fitProjectsInView = useCallback(() => {
    const map = mapRef.current
    if (!map || featureCollection.features.length === 0) {
      return
    }

    if (featureCollection.features.length === 1) {
      const coordinates = featureCollection.features[0]?.geometry.coordinates
      if (coordinates) {
        map.flyTo({ center: coordinates, zoom: 4.5, duration: 700 })
      }
      return
    }

    const bounds = new LngLatBounds()
    for (const feature of featureCollection.features) {
      bounds.extend(feature.geometry.coordinates)
    }

    map.fitBounds(bounds, {
      padding: { top: 72, right: 36, bottom: 180, left: 36 },
      maxZoom: 4.6,
      duration: 800,
    })
  }, [featureCollection.features])

  const collapseDock = useCallback(() => {
    setSelectedProjectId(null)
    setIsDockExpanded(false)
  }, [])

  const clearSelectedProject = useCallback(() => {
    setSelectedProjectId(null)
  }, [])

  const toggleDockExpanded = useCallback(() => {
    setSelectedProjectId(null)
    setIsDockExpanded((isExpanded) => !isExpanded)
  }, [])

  const handleMapLoad = useCallback(() => {
    fitProjectsInView()
    window.setTimeout(() => setIsMapReady(true), 2800)
  }, [fitProjectsInView])

  const handleMapIdle = useCallback(() => {
    setIsMapReady(true)
  }, [])

  const handleMapRender = useCallback(() => {
    if (mapRef.current?.loaded()) {
      setIsMapReady(true)
    }
  }, [])

  const handleMapTransitionComplete = useCallback(() => {
    if (isVisible) {
      mapRef.current?.resize()
    }
  }, [isVisible])

  const handleMapClick = useCallback(
    async (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0]
      const coordinates = getFeaturePointCoordinates(feature)
      if (!feature || !coordinates) {
        collapseDock()
        return
      }

      if (feature.layer.id === CLUSTER_LAYER_ID) {
        collapseDock()
        const source = mapRef.current?.getSource(SOURCE_ID) as GeoJSONSource | undefined
        const clusterId = Number(feature.properties?.cluster_id)
        if (!source || !Number.isFinite(clusterId)) {
          return
        }

        const zoom = await source.getClusterExpansionZoom(clusterId)
        mapRef.current?.easeTo({
          center: coordinates,
          zoom,
          duration: 520,
        })
        return
      }

      if (feature.layer.id === POINT_LAYER_ID || feature.layer.id === POINT_HALO_LAYER_ID) {
        const properties = feature.properties as Partial<ProjectMapFeatureProperties> | null
        if (!properties?.id) {
          return
        }

        setSelectedProjectId(properties.id)
        setIsDockExpanded(true)
        mapRef.current?.easeTo({
          center: coordinates,
          zoom: Math.max(mapRef.current.getZoom(), 3.2),
          offset: [0, -92],
          duration: 480,
        })
      }
    },
    [collapseDock],
  )

  return (
    <motion.div
      className={`fixed inset-0 z-40 overflow-hidden bg-[#05070A] text-white ${
        isVisible ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={handleMapTransitionComplete}
      aria-hidden={!isVisible}
    >
      <MapLibreMap
        ref={mapRef}
        initialViewState={INITIAL_WORLD_VIEW}
        mapStyle={MAP_STYLE_URL}
        minZoom={1}
        maxZoom={12}
        attributionControl={false}
        interactiveLayerIds={[CLUSTER_LAYER_ID, POINT_LAYER_ID, POINT_HALO_LAYER_ID]}
        onClick={handleMapClick}
        onIdle={handleMapIdle}
        onLoad={handleMapLoad}
        onRender={handleMapRender}
        cursor="pointer"
        style={{ width: '100%', height: '100dvh' }}
      >
        <Source
          id={SOURCE_ID}
          type="geojson"
          data={featureCollection}
          cluster
          clusterMaxZoom={5}
          clusterRadius={48}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...pointHaloLayer} />
          <Layer {...pointLayer} />
        </Source>
      </MapLibreMap>

      {isVisible && !isMapReady && <MapLoadingOverlay />}

      <MapAttributionOverlay
        isVisible={
          isVisible && isMapReady && mappedProjectsCount > 0 && !selectedFeature && !isDockExpanded
        }
      />

      {mappedProjectsCount === 0 ? (
        isVisible && <MapEmptyState onShowCurrentView={onShowCurrentView} />
      ) : (
        <AnimatePresence initial={false}>
          {isVisible && (
            <ProjectMapDock
              dockLayoutId={dockLayoutId}
              dockTransition={dockTransition}
              featureCollection={featureCollection}
              isExpanded={isDockExpanded}
              mappedProjectsCount={mappedProjectsCount}
              selectedFeature={selectedFeature}
              onClearSelection={clearSelectedProject}
              onCollapse={collapseDock}
              onShowCurrentView={onShowCurrentView}
              onToggleExpanded={toggleDockExpanded}
            />
          )}
        </AnimatePresence>
      )}
    </motion.div>
  )
}

function MapLoadingOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] flex items-end justify-center bg-[#05070A] px-5 pb-[calc(4.5rem+env(safe-area-inset-bottom)+6.5rem)] text-white">
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-[#0B0F15]/90 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-lime-400 shadow-[0_0_18px_rgba(163,230,53,0.75)]" />
        <span className="text-[13px] font-black">Chargement de la carte</span>
      </div>
    </div>
  )
}

function MapAttributionOverlay({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) {
    return null
  }

  return (
    <p
      className="fixed left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#0B0F15]/45 px-2 py-1 text-[10px] font-semibold leading-none text-white/45 shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur-md"
      style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom) + 4.45rem)' }}
    >
      &copy; OpenFreeMap &copy; OpenStreetMap contributors
    </p>
  )
}

function ProjectMapDock({
  dockLayoutId,
  dockTransition,
  featureCollection,
  isExpanded,
  mappedProjectsCount,
  selectedFeature,
  onClearSelection,
  onCollapse,
  onShowCurrentView,
  onToggleExpanded,
}: {
  dockLayoutId: string
  dockTransition: Transition
  featureCollection: ProjectMapFeatureCollection
  isExpanded: boolean
  mappedProjectsCount: number
  selectedFeature: ProjectMapFeature | null
  onClearSelection: () => void
  onCollapse: () => void
  onShowCurrentView: () => void
  onToggleExpanded: () => void
}) {
  const dragStartY = useRef<number | null>(null)
  const featuredProjects = featureCollection.features.slice(0, 6)
  const isOpen = Boolean(selectedFeature) || isExpanded

  const handleHandlePointerDown = useCallback((event: PointerEvent<HTMLButtonElement>) => {
    dragStartY.current = event.clientY
    event.currentTarget.setPointerCapture(event.pointerId)
  }, [])

  const handleHandlePointerUp = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      const startY = dragStartY.current
      dragStartY.current = null

      if (startY !== null && event.clientY - startY > 28) {
        onCollapse()
      }
    },
    [onCollapse],
  )

  return (
    <motion.section
      layout
      layoutId={dockLayoutId}
      transition={dockTransition}
      initial={false}
      animate={{ borderRadius: isOpen ? 22 : 999, padding: isOpen ? 12 : 4 }}
      className="fixed inset-x-3 z-50 mx-auto max-w-xl overflow-hidden border border-white/10 bg-[#0B0F15]/92 shadow-[0_-18px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl transform-gpu will-change-transform"
      style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom) + 0.9rem)' }}
      aria-label={selectedFeature ? 'Projet sélectionné' : 'Projets visibles sur la carte'}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {isOpen && (
          <motion.button
            key="map-dock-handle"
            type="button"
            onClick={onCollapse}
            onPointerDown={handleHandlePointerDown}
            onPointerUp={handleHandlePointerUp}
            className="mx-auto mb-2 flex h-4 w-16 items-center justify-center rounded-full text-white/45 transition hover:text-white/70 active:scale-95"
            aria-label="Replier le dock de la carte"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
          >
            <span className="h-1 w-10 rounded-full bg-current" />
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence initial={false} mode="popLayout">
        {selectedFeature ? (
          <motion.div
            key={`selected-${selectedFeature.properties.id}`}
            layout
            variants={dockContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <SelectedProjectCard feature={selectedFeature} onClearSelection={onClearSelection} />
          </motion.div>
        ) : !isExpanded ? (
          <motion.div
            key="collapsed"
            layout
            variants={dockContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <CollapsedMapDock
              mappedProjectsCount={mappedProjectsCount}
              onShowCurrentView={onShowCurrentView}
              onToggleExpanded={onToggleExpanded}
            />
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            layout
            variants={dockContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="flex items-center justify-between gap-2 px-1">
              <button
                type="button"
                onClick={onShowCurrentView}
                className="flex h-10 shrink-0 items-center gap-2 rounded-full bg-white/[0.07] px-3 text-[13px] font-bold text-white/82 transition hover:bg-white/10 active:scale-95"
              >
                <List className="h-4 w-4 text-lime-400" />
                Projets
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
                  Explorer
                </p>
                <div className="mt-0.5 flex min-w-0 items-baseline gap-1.5">
                  <h2 className="shrink-0 text-[18px] font-black tracking-tight text-white">
                    {featureCollection.features.length.toLocaleString('fr-FR')} projets
                  </h2>
                  <span className="truncate text-[12px] font-bold text-white/48">sur la carte</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onCollapse}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.07] text-white/72 transition hover:bg-white/10 active:scale-95"
                aria-label="Replier le dock de la carte"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <div className="scrollbar-hide mt-3 grid auto-cols-[8.75rem] grid-flow-col gap-2 overflow-x-auto pb-1">
              {featuredProjects.map((feature) => (
                <ProjectMiniTile key={feature.properties.id} feature={feature} />
              ))}
            </div>
            <MapAttribution />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

function CollapsedMapDock({
  mappedProjectsCount,
  onShowCurrentView,
  onToggleExpanded,
}: {
  mappedProjectsCount: number
  onShowCurrentView: () => void
  onToggleExpanded: () => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={onShowCurrentView}
        className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-white/[0.07] px-3 text-[12px] font-bold text-white/78 transition hover:bg-white/10 active:scale-95"
        aria-label="Revenir aux projets"
      >
        <List className="h-4 w-4" />
        Liste
      </button>

      <button
        type="button"
        onClick={onToggleExpanded}
        className="flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-lime-400 px-3 text-[13px] font-black text-[#0B0F15] shadow-[0_8px_24px_rgba(163,230,53,0.2)] transition active:scale-[0.98]"
        aria-expanded={false}
      >
        <MapPin className="h-4 w-4 shrink-0" />
        <span className="truncate">
          {mappedProjectsCount.toLocaleString('fr-FR')} projet
          {mappedProjectsCount > 1 ? 's' : ''} localisé
          {mappedProjectsCount > 1 ? 's' : ''}
        </span>
        <ChevronUp className="h-4 w-4 shrink-0" />
      </button>
    </div>
  )
}

function SelectedProjectCard({
  feature,
  onClearSelection,
}: {
  feature: ProjectMapFeature
  onClearSelection: () => void
}) {
  const imageUrl = sanitizeImageUrl(feature.properties.imageUrl)
  const Icon = getImpactIcon(feature.properties.impactKind)

  return (
    <article className="grid grid-cols-[86px_minmax(0,1fr)] gap-3">
      <div className="relative h-full min-h-[112px] overflow-hidden rounded-2xl bg-white/10">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-white/10" />
        )}
      </div>

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="line-clamp-2 text-[17px] font-black leading-tight tracking-tight text-white">
              {feature.properties.name}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-[12px] font-medium text-white/52">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{feature.properties.location}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClearSelection}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/8 text-white/70 transition hover:bg-white/12 active:scale-95"
            aria-label="Fermer le projet sélectionné"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lime-400/15 text-lime-400">
            <Icon className="h-3.5 w-3.5" />
          </span>
          <p className="min-w-0 text-[12px] font-semibold text-white/75">
            {feature.properties.impactValue > 0 ? (
              <>
                <span className="font-black text-lime-400">
                  {formatCompact(feature.properties.impactValue)}
                </span>{' '}
                {feature.properties.impactLabel}
              </>
            ) : (
              feature.properties.impactLabel
            )}
          </p>
        </div>

        <Link
          href={`/projects/${feature.properties.slug}`}
          className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-lime-400 px-4 text-[13px] font-black text-[#0B0F15] shadow-[0_8px_24px_rgba(163,230,53,0.25)] transition active:scale-95"
        >
          Voir le projet
          <ArrowUpRight className="h-4 w-4" />
        </Link>
        <MapAttribution />
      </div>
    </article>
  )
}

function MapAttribution({ compact = false }: { compact?: boolean }) {
  return (
    <p
      className={`px-1 text-[10px] font-medium leading-none text-white/35 ${
        compact ? 'mt-1.5 text-center' : 'mt-3'
      }`}
    >
      &copy; OpenFreeMap &copy; OpenStreetMap contributors
    </p>
  )
}

function ProjectMiniTile({ feature }: { feature: ProjectMapFeature }) {
  const imageUrl = sanitizeImageUrl(feature.properties.imageUrl)

  return (
    <Link
      href={`/projects/${feature.properties.slug}`}
      className="min-w-0 overflow-hidden rounded-2xl bg-white/[0.055] transition active:scale-[0.98]"
    >
      <div className="aspect-[4/3] bg-white/10">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-white/10" />
        )}
      </div>
      <p className="truncate px-2 py-2 text-[11px] font-bold text-white/80">
        {feature.properties.name}
      </p>
    </Link>
  )
}

function MapEmptyState({ onShowCurrentView }: { onShowCurrentView: () => void }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center px-6">
      <div className="pointer-events-auto max-w-sm rounded-[1.5rem] border border-white/10 bg-[#0B0F15]/92 p-5 text-center shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-lime-400/15 text-lime-400">
          <MapPin className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-xl font-black tracking-tight text-white">
          Aucun projet géolocalisé
        </h2>
        <p className="mt-2 text-sm font-medium leading-6 text-white/62">
          Les projets restent disponibles dans la vue actuelle.
        </p>
        <button
          type="button"
          onClick={onShowCurrentView}
          className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-lime-400 px-5 text-sm font-black text-[#0B0F15] transition active:scale-95"
        >
          Revenir aux projets
        </button>
      </div>
    </div>
  )
}

function getFeaturePointCoordinates(
  feature: MapGeoJSONFeature | undefined,
): [number, number] | null {
  if (!feature || feature.geometry.type !== 'Point') {
    return null
  }

  const [longitude, latitude] = feature.geometry.coordinates
  if (typeof longitude !== 'number' || typeof latitude !== 'number') {
    return null
  }

  return [longitude, latitude]
}

function getImpactIcon(kind: ProjectMapFeatureProperties['impactKind']) {
  if (kind === 'orchard') return TreePine
  if (kind === 'reef') return Waves
  return Bug
}
