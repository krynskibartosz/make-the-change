'use client'

import { AlertTriangle, MapPin } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '@/i18n/navigation'
import type { ClientCatalogProject } from './client-catalog-project-card'

type ProjectsGoogleMapViewProps = {
  projects: ClientCatalogProject[]
}

type ProjectPosition = {
  project: ClientCatalogProject
  position: { lat: number; lng: number }
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
const GOOGLE_MAPS_SCRIPT_ID = 'mtc-google-maps-script'
const geocodeCache = new Map<string, { lat: number; lng: number } | null>()

let googleMapsLoaderPromise: Promise<any> | null = null

const loadGoogleMaps = async (apiKey: string): Promise<any> => {
  if (typeof window === 'undefined') {
    throw new Error('Google Maps is only available in the browser')
  }

  const windowWithGoogle = window as Window & { google?: any }
  if (windowWithGoogle.google?.maps) {
    return windowWithGoogle.google
  }

  if (googleMapsLoaderPromise) {
    return googleMapsLoaderPromise
  }

  googleMapsLoaderPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID) as HTMLScriptElement | null

    const handleLoad = () => {
      const google = (window as Window & { google?: any }).google
      if (google?.maps) {
        resolve(google)
      } else {
        reject(new Error('Google Maps API loaded but unavailable on window'))
      }
    }

    const handleError = () => {
      reject(new Error('Failed to load Google Maps script'))
    }

    if (existingScript) {
      existingScript.addEventListener('load', handleLoad, { once: true })
      existingScript.addEventListener('error', handleError, { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = GOOGLE_MAPS_SCRIPT_ID
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly`
    script.async = true
    script.defer = true
    script.addEventListener('load', handleLoad, { once: true })
    script.addEventListener('error', handleError, { once: true })
    document.head.appendChild(script)
  })

  return googleMapsLoaderPromise
}

const resolveProjectQuery = (project: ClientCatalogProject) =>
  [project.address_city, project.address_country_code].filter(Boolean).join(', ').trim()

const resolveProjectPosition = async (
  google: any,
  project: ClientCatalogProject,
): Promise<{ lat: number; lng: number } | null> => {
  if (typeof project.latitude === 'number' && typeof project.longitude === 'number') {
    return { lat: project.latitude, lng: project.longitude }
  }

  const query = resolveProjectQuery(project)
  if (!query) return null

  if (geocodeCache.has(query)) {
    return geocodeCache.get(query) || null
  }

  const geocoder = new google.maps.Geocoder()
  const geocodeResult = await new Promise<{ lat: number; lng: number } | null>((resolve) => {
    geocoder.geocode({ address: query }, (results: any, status: any) => {
      if (status !== 'OK' || !results?.[0]?.geometry?.location) {
        resolve(null)
        return
      }
      const location = results[0].geometry.location
      resolve({ lat: location.lat(), lng: location.lng() })
    })
  })

  geocodeCache.set(query, geocodeResult)
  return geocodeResult
}

export function ProjectsGoogleMapView({ projects }: ProjectsGoogleMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [mapError, setMapError] = useState<string | null>(null)
  const [googleReady, setGoogleReady] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [mappedProjectIds, setMappedProjectIds] = useState<string[]>([])

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) || null,
    [projects, selectedProjectId],
  )

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setMapError('Clé Google Maps manquante (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY).')
      return
    }

    let isCancelled = false

    loadGoogleMaps(GOOGLE_MAPS_API_KEY)
      .then(() => {
        if (!isCancelled) {
          setGoogleReady(true)
        }
      })
      .catch((error) => {
        if (!isCancelled) {
          setMapError(error instanceof Error ? error.message : 'Impossible de charger Google Maps.')
        }
      })

    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    if (!googleReady || !mapContainerRef.current || mapRef.current) {
      return
    }

    const google = (window as Window & { google?: any }).google
    if (!google?.maps) {
      setMapError('Google Maps est indisponible.')
      return
    }

    mapRef.current = new google.maps.Map(mapContainerRef.current, {
      center: { lat: 20, lng: 0 },
      zoom: 2,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    })
  }, [googleReady])

  useEffect(() => {
    if (!googleReady || !mapRef.current) {
      return
    }

    let isCancelled = false
    const google = (window as Window & { google?: any }).google

    const clearMarkers = () => {
      for (const marker of markersRef.current) {
        marker.setMap(null)
      }
      markersRef.current = []
    }

    const renderMarkers = async () => {
      clearMarkers()
      setMappedProjectIds([])

      const resolvedPositions = await Promise.all(
        projects.map(async (project): Promise<ProjectPosition | null> => {
          const position = await resolveProjectPosition(google, project)
          if (!position) return null
          return { project, position }
        }),
      )

      if (isCancelled) return

      const validPositions = resolvedPositions.filter(
        (entry): entry is ProjectPosition => entry !== null,
      )

      const bounds = new google.maps.LatLngBounds()
      const markers: any[] = []
      const mappedIds: string[] = []

      for (const entry of validPositions) {
        const marker = new google.maps.Marker({
          map: mapRef.current,
          position: entry.position,
          title: entry.project.name_default,
        })

        marker.addListener('click', () => {
          setSelectedProjectId(entry.project.id)
          mapRef.current?.panTo(entry.position)
        })

        bounds.extend(entry.position)
        mappedIds.push(entry.project.id)
        markers.push(marker)
      }

      markersRef.current = markers
      setMappedProjectIds(mappedIds)

      const firstPosition = validPositions[0]?.position

      if (validPositions.length === 1 && firstPosition) {
        mapRef.current.setCenter(firstPosition)
        mapRef.current.setZoom(8)
      } else if (validPositions.length > 1) {
        mapRef.current.fitBounds(bounds, 80)
      } else {
        mapRef.current.setCenter({ lat: 20, lng: 0 })
        mapRef.current.setZoom(2)
      }
    }

    renderMarkers().catch((error) => {
      if (!isCancelled) {
        setMapError(error instanceof Error ? error.message : 'Impossible de placer les projets sur la carte.')
      }
    })

    return () => {
      isCancelled = true
      clearMarkers()
    }
  }, [googleReady, projects])

  if (mapError) {
    return (
      <div className="rounded-3xl border border-amber-500/40 bg-amber-500/10 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-400" />
          <div>
            <p className="text-sm font-semibold text-amber-200">Carte indisponible</p>
            <p className="mt-1 text-sm text-amber-100/80">{mapError}</p>
          </div>
        </div>
      </div>
    )
  }

  const mappedCount = mappedProjectIds.length

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-card p-4">
        <p className="text-sm text-muted-foreground">
          {mappedCount.toLocaleString('fr-FR')} projet(s) localisé(s) sur la carte.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-muted">
        <div ref={mapContainerRef} className="h-[56vh] min-h-[380px] w-full" />
      </div>

      {selectedProject ? (
        <div className="rounded-3xl border border-white/10 bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Projet sélectionné
          </p>
          <h3 className="mt-2 text-xl font-bold tracking-tight">{selectedProject.name_default}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {[selectedProject.address_city, selectedProject.address_country_code]
              .filter(Boolean)
              .join(', ') || 'Localisation non renseignée'}
          </p>
          <div className="mt-4">
            <Link
              href={`/projects/${selectedProject.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-lime-400 px-4 py-2 text-sm font-semibold text-black"
            >
              <MapPin className="h-4 w-4" />
              Voir le projet
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}
