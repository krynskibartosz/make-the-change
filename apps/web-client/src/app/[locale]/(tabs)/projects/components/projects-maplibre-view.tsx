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
import { ArrowUpRight, Bug, ChevronUp, List, MapPin, TreePine, Waves, X } from 'lucide-react'
import { type GeoJSONSource, LngLatBounds, type MapGeoJSONFeature } from 'maplibre-gl'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { formatCompact } from '@/lib/formatters'
import { sanitizeImageUrl } from '@/lib/image-url'
import {
  buildProjectMapFeatureCollection,
  getProjectFocusCameraOptions,
  type ProjectMapFeature,
  type ProjectMapFeatureCollection,
  type ProjectMapFeatureProperties,
  type ProjectMapSourceProject,
} from '../_features/project-map-data'

type ProjectsMapViewProps = {
  isVisible: boolean
  isBootPlaceholderVisible: boolean
  projects: ProjectMapSourceProject[]
  dockLayoutId: string
  dockTransition: Transition
  onShellReady: () => void
  onShowCurrentView: () => void
}

const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/dark'
const SOURCE_ID = 'projects-map-source'
const CLUSTER_LAYER_ID = 'projects-map-clusters'
const CLUSTER_COUNT_LAYER_ID = 'projects-map-cluster-count'
const POINT_HALO_LAYER_ID = 'projects-map-point-halo'
const POINT_LAYER_ID = 'projects-map-points'
const MAP_DOCK_BOTTOM = 'calc(4.5rem + env(safe-area-inset-bottom) + 0.9rem)'

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
    'circle-color': ['step', ['get', 'point_count'], '#9AE600', 8, '#5EEA8D', 20, '#38BDF8'],
    'circle-radius': ['step', ['get', 'point_count'], 18, 8, 24, 20, 31],
    'circle-stroke-color': 'rgba(5,7,10,0.92)',
    'circle-stroke-width': 4,
    'circle-opacity': 0.9,
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
    'text-color': '#05070A',
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
      '#38BDF8',
      'orchard',
      '#A3E635',
      '#FACC15',
    ],
    'circle-radius': 15,
    'circle-opacity': 0.2,
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
      '#38BDF8',
      'orchard',
      '#A3E635',
      '#FACC15',
    ],
    'circle-radius': 7,
    'circle-stroke-color': '#05070A',
    'circle-stroke-width': 3,
  },
}

export function ProjectsMapView({
  isVisible,
  isBootPlaceholderVisible,
  projects,
  dockLayoutId,
  dockTransition,
  onShellReady,
  onShowCurrentView,
}: ProjectsMapViewProps) {
  const mapRef = useRef<MapRef | null>(null)
  const isMapReadyRef = useRef(false)
  const mapReadyFallbackTimeoutRef = useRef<number | null>(null)
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

  useLayoutEffect(() => {
    onShellReady()
  }, [onShellReady])

  const clearMapReadyFallback = useCallback(() => {
    if (mapReadyFallbackTimeoutRef.current === null) {
      return
    }

    window.clearTimeout(mapReadyFallbackTimeoutRef.current)
    mapReadyFallbackTimeoutRef.current = null
  }, [])

  const markMapReady = useCallback(() => {
    if (isMapReadyRef.current) {
      return
    }

    isMapReadyRef.current = true
    clearMapReadyFallback()
    setIsMapReady(true)
  }, [clearMapReadyFallback])

  useEffect(() => clearMapReadyFallback, [clearMapReadyFallback])

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

  const handleShowCurrentView = useCallback(() => {
    collapseDock()
    onShowCurrentView()
  }, [collapseDock, onShowCurrentView])

  const toggleDockExpanded = useCallback(() => {
    setSelectedProjectId(null)
    setIsDockExpanded((isExpanded) => !isExpanded)
  }, [])

  const focusProjectOnMap = useCallback((feature: ProjectMapFeature) => {
    setSelectedProjectId(feature.properties.id)
    setIsDockExpanded(true)

    const map = mapRef.current
    if (!map) {
      return
    }

    map.easeTo(getProjectFocusCameraOptions(feature.geometry.coordinates, map.getZoom()))
  }, [])

  const handleMapLoad = useCallback(() => {
    fitProjectsInView()
    clearMapReadyFallback()
    if (!isMapReadyRef.current) {
      mapReadyFallbackTimeoutRef.current = window.setTimeout(markMapReady, 2200)
    }
  }, [clearMapReadyFallback, fitProjectsInView, markMapReady])

  const handleMapIdle = useCallback(() => {
    markMapReady()
  }, [markMapReady])

  const handleMapRender = useCallback(() => {
    if (mapRef.current?.loaded()) {
      markMapReady()
    }
  }, [markMapReady])

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
        const map = mapRef.current
        map?.easeTo(getProjectFocusCameraOptions(coordinates, map.getZoom()))
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
      <MapPreparingCanvas isVisible={isVisible && !isMapReady} />

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

      <MapAttributionOverlay
        isVisible={
          isVisible &&
          !isBootPlaceholderVisible &&
          isMapReady &&
          mappedProjectsCount > 0 &&
          !selectedFeature &&
          !isDockExpanded
        }
      />

      {mappedProjectsCount === 0 ? (
        isVisible && <MapEmptyState onShowCurrentView={handleShowCurrentView} />
      ) : (
        <>
          <AnimatePresence initial={false}>
            {isVisible && !isBootPlaceholderVisible && (
              <ProjectMapDock
                dockLayoutId={dockLayoutId}
                dockTransition={dockTransition}
                featureCollection={featureCollection}
                isMapReady={isMapReady}
                isExpanded={isDockExpanded}
                mappedProjectsCount={mappedProjectsCount}
                selectedFeature={selectedFeature}
                onCollapse={collapseDock}
                onSelectProject={focusProjectOnMap}
                onShowCurrentView={handleShowCurrentView}
                onToggleExpanded={toggleDockExpanded}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  )
}

function MapPreparingCanvas({ isVisible }: { isVisible: boolean }) {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-10 bg-[#08111A]"
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden
    >
      <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(163,230,53,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.07)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="absolute left-[-16%] top-[6%] h-[25%] w-[58%] rounded-[52%] bg-[#123225]/72" />
      <div className="absolute right-[-18%] top-[22%] h-[28%] w-[62%] rounded-[50%] bg-[#0E2A3B]/68" />
      <div className="absolute bottom-[18%] left-[12%] h-[20%] w-[48%] rounded-[48%] bg-[#182A1D]/66" />
      <div className="absolute inset-0 bg-[#05070A]/35" />
    </motion.div>
  )
}

function MapDockLoadingButton({ showSlowHint }: { showSlowHint: boolean }) {
  return (
    <div
      className="relative flex h-11 min-w-0 flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-lime-400 px-3 text-[13px] font-black text-[#0B0F15] shadow-[0_8px_24px_rgba(163,230,53,0.2)]"
      aria-live="polite"
    >
      <motion.span
        className="absolute inset-y-0 left-0 w-16 bg-white/35"
        animate={{ x: ['-110%', '680%'] }}
        transition={{ duration: 1.45, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
      />
      <span className="relative h-2.5 w-2.5 rounded-full bg-[#0B0F15]">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#0B0F15]/45" />
      </span>
      <span className="relative truncate">
        {showSlowHint ? 'Connexion lente' : 'Carte en préparation'}
      </span>
    </div>
  )
}

function MapDockReadyButton({
  mappedProjectsCount,
  onToggleExpanded,
}: {
  mappedProjectsCount: number
  onToggleExpanded: () => void
}) {
  return (
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
  isMapReady,
  isExpanded,
  mappedProjectsCount,
  selectedFeature,
  onCollapse,
  onSelectProject,
  onShowCurrentView,
  onToggleExpanded,
}: {
  dockLayoutId: string
  dockTransition: Transition
  featureCollection: ProjectMapFeatureCollection
  isMapReady: boolean
  isExpanded: boolean
  mappedProjectsCount: number
  selectedFeature: ProjectMapFeature | null
  onCollapse: () => void
  onSelectProject: (feature: ProjectMapFeature) => void
  onShowCurrentView: () => void
  onToggleExpanded: () => void
}) {
  const featuredProjects = featureCollection.features.slice(0, 6)
  const isOpen = Boolean(selectedFeature) || isExpanded
  const [showSlowHint, setShowSlowHint] = useState(false)

  useEffect(() => {
    if (isMapReady) {
      setShowSlowHint(false)
      return
    }

    const timeoutId = window.setTimeout(() => setShowSlowHint(true), 4500)
    return () => window.clearTimeout(timeoutId)
  }, [isMapReady])

  return (
    <motion.section
      layout
      layoutId={dockLayoutId}
      transition={dockTransition}
      initial={false}
      animate={{ borderRadius: isOpen ? 24 : 999, padding: isOpen ? 0 : 4 }}
      className={`fixed z-50 overflow-hidden border border-white/10 bg-[#0B0F15]/92 shadow-[0_-18px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl transform-gpu will-change-transform ${
        isOpen ? 'inset-x-3 mx-auto max-w-xl' : 'inset-x-0 mx-auto w-fit max-w-[calc(100%-1.5rem)]'
      }`}
      style={{ bottom: MAP_DOCK_BOTTOM }}
      aria-label={selectedFeature ? 'Projet sélectionné' : 'Projets visibles sur la carte'}
    >
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
            <SelectedProjectCard feature={selectedFeature} onClose={onCollapse} />
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
              isMapReady={isMapReady}
              mappedProjectsCount={mappedProjectsCount}
              showSlowHint={showSlowHint}
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
            <div className="flex items-center justify-between gap-3 px-4 pt-3">
              <h2 className="min-w-0 flex-1 truncate text-[18px] font-black tracking-tight text-white">
                {featureCollection.features.length.toLocaleString('fr-FR')} projets localisés
              </h2>
              <button
                type="button"
                onClick={onCollapse}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.07] text-white/72 transition hover:bg-white/10 active:scale-95"
                aria-label="Fermer le panneau des projets"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="scrollbar-hide mt-3 grid auto-cols-[10.25rem] grid-flow-col gap-2.5 overflow-x-auto px-4 pb-4">
              {featuredProjects.map((feature) => (
                <ProjectMiniTile
                  key={feature.properties.id}
                  feature={feature}
                  onSelectProject={onSelectProject}
                />
              ))}
            </div>
            <div className="px-4 pb-4">
              <MapAttribution compact />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

function CollapsedMapDock({
  isMapReady,
  mappedProjectsCount,
  showSlowHint,
  onShowCurrentView,
  onToggleExpanded,
}: {
  isMapReady: boolean
  mappedProjectsCount: number
  showSlowHint: boolean
  onShowCurrentView: () => void
  onToggleExpanded: () => void
}) {
  return (
    <div className="flex max-w-full items-center gap-1.5">
      <button
        type="button"
        onClick={onShowCurrentView}
        className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white/[0.08] px-4 text-[13px] font-black text-white/82 transition hover:bg-white/[0.12] active:scale-[0.98]"
        aria-label="Revenir à la liste des projets"
      >
        <List className="h-4 w-4" />
        <span>Liste</span>
      </button>
      {isMapReady ? (
        <MapDockReadyButton
          mappedProjectsCount={mappedProjectsCount}
          onToggleExpanded={onToggleExpanded}
        />
      ) : (
        <MapDockLoadingButton showSlowHint={showSlowHint} />
      )}
    </div>
  )
}

function SelectedProjectCard({
  feature,
  onClose,
}: {
  feature: ProjectMapFeature
  onClose: () => void
}) {
  const imageUrl = sanitizeImageUrl(feature.properties.imageUrl)
  const Icon = getImpactIcon(feature.properties.impactKind)
  const iconColor = getImpactIconColor(feature.properties.impactKind)
  const iconBg = getImpactIconBg(feature.properties.impactKind)

  return (
    <article>
      {/* Image — propre, sans overlay ni texte */}
      <div className="relative aspect-[16/9] overflow-hidden bg-white/10">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-white/10" />
        )}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#0B0F15]/72 text-white/82 shadow-[0_8px_24px_rgba(0,0,0,0.28)] backdrop-blur-md transition hover:bg-[#0B0F15]/82 active:scale-95"
          aria-label="Fermer le projet sélectionné"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Info — titre, lieu, métrique colorée uniquement sur l'icône */}
      <div className="min-w-0 px-4 pb-4 pt-3">
        <h2 className="line-clamp-2 text-[20px] font-black leading-tight tracking-tight text-white">
          {feature.properties.name}
        </h2>
        <p className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-white/50">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{feature.properties.location}</span>
        </p>

        {/* Métrique : icône colorée par type, valeur + label en neutre */}
        <div className="mt-3 flex items-center gap-2">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${iconBg}`}
          >
            <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
          </span>
          <p className="min-w-0 text-[13px] leading-none">
            {feature.properties.impactValue > 0 ? (
              <>
                <span className="font-black text-white/90">
                  {formatCompact(feature.properties.impactValue)}
                </span>
                <span className="ml-1 font-medium text-white/55">
                  {feature.properties.impactLabel}
                </span>
              </>
            ) : (
              <span className="font-medium text-white/55">{feature.properties.impactLabel}</span>
            )}
          </p>
        </div>

        <Link
          href={`/projects/${feature.properties.slug}`}
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-lime-400 px-5 text-[13px] font-black text-[#0B0F15] shadow-[0_8px_24px_rgba(163,230,53,0.25)] transition active:scale-95"
        >
          Voir le projet
          <ArrowUpRight className="h-4 w-4" />
        </Link>
        <MapAttribution compact />
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

function ProjectMiniTile({
  feature,
  onSelectProject,
}: {
  feature: ProjectMapFeature
  onSelectProject: (feature: ProjectMapFeature) => void
}) {
  const imageUrl = sanitizeImageUrl(feature.properties.imageUrl)
  const Icon = getImpactIcon(feature.properties.impactKind)
  const iconColor = getImpactIconColor(feature.properties.impactKind)

  return (
    <button
      type="button"
      onClick={() => onSelectProject(feature)}
      className="min-w-0 overflow-hidden rounded-2xl bg-white/[0.055] text-left transition active:scale-[0.98]"
      aria-label={`Afficher ${feature.properties.name} sur la carte`}
    >
      {/* Image — format paysage 4/3, sans overlay ni texte */}
      <div className="aspect-[4/3] overflow-hidden bg-white/10">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-white/10" />
        )}
      </div>

      {/* Info — titre sur 2 lignes + métrique compacte */}
      <div className="px-2.5 pb-2.5 pt-2">
        <p className="line-clamp-2 text-[12px] font-bold leading-tight text-white/85">
          {feature.properties.name}
        </p>
        {/* Métrique : icône colorée par type, valeur neutre */}
        <div className="mt-1.5 flex items-center gap-1">
          <Icon className={`h-3 w-3 shrink-0 ${iconColor}`} />
          <p className="min-w-0 truncate text-[11px] leading-none">
            {feature.properties.impactValue > 0 ? (
              <>
                <span className="font-black text-white/85">
                  {formatCompact(feature.properties.impactValue)}
                </span>
                <span className="ml-0.5 font-medium text-white/45">
                  {feature.properties.impactLabel}
                </span>
              </>
            ) : (
              <span className="font-medium text-white/45">{feature.properties.impactLabel}</span>
            )}
          </p>
        </div>
      </div>
    </button>
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

/** Couleur de l'icône selon le type d'impact — seule la couleur varie, pas le texte */
function getImpactIconColor(kind: ProjectMapFeatureProperties['impactKind']): string {
  if (kind === 'orchard') return 'text-emerald-400'
  if (kind === 'reef') return 'text-sky-400'
  return 'text-amber-400'
}

/** Fond de l'icône (SelectedProjectCard uniquement) */
function getImpactIconBg(kind: ProjectMapFeatureProperties['impactKind']): string {
  if (kind === 'orchard') return 'bg-emerald-400/15'
  if (kind === 'reef') return 'bg-sky-400/15'
  return 'bg-amber-400/15'
}
