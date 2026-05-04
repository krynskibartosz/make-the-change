'use client'

import {
  Layer,
  type LayerProps,
  type MapLayerMouseEvent,
  Map as MapLibreMap,
  type MapRef,
  NavigationControl,
  Source,
} from '@vis.gl/react-maplibre'
import { ArrowUpRight, Bug, List, MapPin, TreePine, Waves, X } from 'lucide-react'
import { type GeoJSONSource, LngLatBounds, type MapGeoJSONFeature } from 'maplibre-gl'
import { useCallback, useMemo, useRef, useState } from 'react'
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
  projects: ProjectMapSourceProject[]
  onShowCurrentView: () => void
}

const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'
const SOURCE_ID = 'projects-map-source'
const CLUSTER_LAYER_ID = 'projects-map-clusters'
const CLUSTER_COUNT_LAYER_ID = 'projects-map-cluster-count'
const POINT_HALO_LAYER_ID = 'projects-map-point-halo'
const POINT_LAYER_ID = 'projects-map-points'

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

export function ProjectsMapView({ projects, onShowCurrentView }: ProjectsMapViewProps) {
  const mapRef = useRef<MapRef | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
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
      padding: { top: 120, right: 40, bottom: 280, left: 40 },
      maxZoom: 4.6,
      duration: 800,
    })
  }, [featureCollection.features])

  const handleMapClick = useCallback(async (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0]
    const coordinates = getFeaturePointCoordinates(feature)
    if (!feature || !coordinates) {
      return
    }

    if (feature.layer.id === CLUSTER_LAYER_ID) {
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
      mapRef.current?.easeTo({
        center: coordinates,
        zoom: Math.max(mapRef.current.getZoom(), 3.2),
        duration: 480,
      })
    }
  }, [])

  return (
    <div className="fixed inset-0 z-40 overflow-hidden bg-[#05070A] text-white">
      <MapLibreMap
        ref={mapRef}
        initialViewState={INITIAL_WORLD_VIEW}
        mapStyle={MAP_STYLE_URL}
        minZoom={1}
        maxZoom={12}
        attributionControl={false}
        interactiveLayerIds={[CLUSTER_LAYER_ID, POINT_LAYER_ID, POINT_HALO_LAYER_ID]}
        onClick={handleMapClick}
        onLoad={fitProjectsInView}
        cursor="pointer"
        style={{ width: '100%', height: '100dvh' }}
      >
        <NavigationControl position="top-right" showCompass={false} visualizePitch={false} />
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

      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-[max(0.85rem,env(safe-area-inset-top))]">
        <div className="mx-auto flex max-w-3xl items-start justify-between gap-3">
          <button
            type="button"
            onClick={onShowCurrentView}
            className="pointer-events-auto flex h-11 items-center gap-2 rounded-full border border-white/10 bg-[#0B0F15]/88 px-3 text-[13px] font-bold text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl transition active:scale-95"
          >
            <List className="h-4 w-4 text-lime-400" />
            Projets
          </button>

          <div className="pointer-events-auto rounded-2xl border border-white/10 bg-[#0B0F15]/82 px-3 py-2 text-right shadow-[0_10px_30px_rgba(0,0,0,0.32)] backdrop-blur-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-lime-400">
              Carte mondiale
            </p>
            <p className="mt-0.5 text-[12px] font-semibold text-white/75">
              {mappedProjectsCount.toLocaleString('fr-FR')} projet
              {mappedProjectsCount > 1 ? 's' : ''} localisé
              {mappedProjectsCount > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {mappedProjectsCount === 0 ? (
        <MapEmptyState onShowCurrentView={onShowCurrentView} />
      ) : (
        <ProjectMapSheet
          featureCollection={featureCollection}
          selectedFeature={selectedFeature}
          onClearSelection={() => setSelectedProjectId(null)}
        />
      )}
    </div>
  )
}

function ProjectMapSheet({
  featureCollection,
  selectedFeature,
  onClearSelection,
}: {
  featureCollection: ProjectMapFeatureCollection
  selectedFeature: ProjectMapFeature | null
  onClearSelection: () => void
}) {
  const featuredProjects = featureCollection.features.slice(0, 3)

  return (
    <section
      className="fixed inset-x-3 z-50 mx-auto max-w-xl rounded-[1.35rem] border border-white/10 bg-[#0B0F15]/92 p-3 shadow-[0_-18px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl"
      style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom) + 0.75rem)' }}
      aria-label={selectedFeature ? 'Projet sélectionné' : 'Projets visibles sur la carte'}
    >
      {selectedFeature ? (
        <SelectedProjectCard feature={selectedFeature} onClearSelection={onClearSelection} />
      ) : (
        <div>
          <div className="flex items-center justify-between gap-3 px-1">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
                Explorer
              </p>
              <h2 className="mt-0.5 text-[17px] font-black tracking-tight text-white">
                {featureCollection.features.length.toLocaleString('fr-FR')} projets sur la carte
              </h2>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-400/15 text-lime-400">
              <MapPin className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {featuredProjects.map((feature) => (
              <ProjectMiniTile key={feature.properties.id} feature={feature} />
            ))}
          </div>
          <MapAttribution />
        </div>
      )}
    </section>
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

function MapAttribution() {
  return (
    <p className="mt-3 px-1 text-[10px] font-medium leading-none text-white/35">
      © OpenFreeMap © OpenStreetMap contributors
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
