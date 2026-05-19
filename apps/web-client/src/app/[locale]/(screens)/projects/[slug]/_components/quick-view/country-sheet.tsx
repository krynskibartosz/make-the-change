'use client'

import { useState } from 'react'
import { Map as MapLibreMap } from '@vis.gl/react-maplibre'
import { Link } from '@/i18n/navigation'
import { MobileSheet } from '../shared/mobile-sheet'
import { sanitizeImageUrl } from '@/lib/image-url'
import { resolveCountryCode, getCountryFlag } from '@/lib/location'
import { getLocalizedContent } from '@/lib/utils'

const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/dark'

type RelatedProject = {
  id: string
  slug: string
  type: string | null
  name_default: string
  name_i18n?: Record<string, string> | null
  hero_image_url: string | null
  current_funding: number | null
}

type ProjectCountrySheetProps = {
  countryCode: string
  countryName: string
  city?: string | null
  projectType?: string | null
  speciesCount: number
  relatedProjects: RelatedProject[]
  latitude?: number | null
  longitude?: number | null
  locale: string
}


function getEcosystemLabel(projectType: string | null | undefined): string {
  const t = projectType?.toLowerCase() ?? ''
  if (t.includes('coral') || t.includes('reef')) return 'Récifs & océans tropicaux'
  if (t.includes('orchard') || t.includes('olive')) return 'Terres agricoles vivantes'
  return 'Pollinisateurs & forêts'
}

function LocationMap({
  latitude,
  longitude,
  city,
}: {
  latitude: number
  longitude: number
  city?: string | null
}) {
  return (
    <div className="relative mt-3 h-44 overflow-hidden rounded-2xl border border-white/[0.08]">
      <MapLibreMap
        initialViewState={{ longitude, latitude, zoom: 9 }}
        mapStyle={MAP_STYLE_URL}
        scrollZoom={false}
        dragRotate={false}
        touchZoomRotate={false}
        attributionControl={false}
        style={{ width: '100%', height: '100%' }}
      />
      {/* Project marker — overlay centré sur les coordonnées */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="h-3 w-3 rounded-full bg-sky-400 shadow-[0_0_12px_5px_rgba(14,165,233,0.55)]" />
          <div
            className="absolute -inset-3 animate-ping rounded-full bg-sky-400/20"
            style={{ animationDuration: '2.4s' }}
          />
          {city ? (
            <p className="absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              {city}
            </p>
          ) : null}
        </div>
      </div>
      {/* Attribution */}
      <p className="pointer-events-none absolute bottom-2 right-2 text-[9px] font-medium text-white/35">
        © OpenFreeMap © OSM
      </p>
    </div>
  )
}

// Fixed pseudo-random positions for up to 5 related project dots
const RELATED_DOT_POSITIONS = [
  { left: '20%', top: '25%' },
  { left: '72%', top: '35%' },
  { left: '35%', top: '70%' },
  { left: '78%', top: '68%' },
  { left: '15%', top: '60%' },
]

function RegionMap({
  city,
  countryName,
  relatedCount,
}: {
  city?: string | null
  countryName: string
  relatedCount: number
}) {
  const dotCount = Math.min(relatedCount, RELATED_DOT_POSITIONS.length)

  return (
    <div className="relative mt-3 h-32 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#05070A]">
      {/* Grid */}
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(163,230,53,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.06)_1px,transparent_1px)] [background-size:28px_28px]" />
      {/* Blobs */}
      <div className="absolute left-[-10%] top-[5%] h-[55%] w-[55%] rounded-[52%] bg-[#123225]/60" />
      <div className="absolute right-[-12%] top-[20%] h-[50%] w-[58%] rounded-[50%] bg-[#0E2A3B]/55" />
      <div className="absolute bottom-[10%] left-[15%] h-[35%] w-[40%] rounded-[48%] bg-[#182A1D]/55" />
      <div className="absolute inset-0 bg-[#05070A]/30" />

      {/* Related project dots */}
      {RELATED_DOT_POSITIONS.slice(0, dotCount).map((pos, i) => (
        <div
          key={i}
          className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/25"
          style={{ left: pos.left, top: pos.top }}
        />
      ))}

      {/* Active project dot (current) — centered */}
      <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2">
        <div className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_10px_4px_rgba(14,165,233,0.55)]" />
        <div
          className="absolute -inset-3 animate-ping rounded-full bg-sky-400/20"
          style={{ animationDuration: '2.4s' }}
        />
        {city ? (
          <p className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-[9px] font-bold text-white/60">
            {city}
          </p>
        ) : null}
      </div>

      {/* Country label */}
      <p className="absolute bottom-2.5 right-3 text-[10px] font-bold text-white/25">
        {countryName}
      </p>

      {/* Legend */}
      <div className="absolute bottom-2.5 left-3 flex items-center gap-2.5">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-sky-400" />
          <span className="text-[9px] font-semibold text-white/30">Ce projet</span>
        </span>
        {dotCount > 0 ? (
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full border border-white/20 bg-white/25" />
            <span className="text-[9px] font-semibold text-white/30">Autres</span>
          </span>
        ) : null}
      </div>
    </div>
  )
}

function ProjectListRow({ project, locale }: { project: RelatedProject; locale: string }) {
  const title = getLocalizedContent(project.name_i18n, locale, project.name_default)
  const imageUrl = sanitizeImageUrl(project.hero_image_url) ?? null

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="flex items-center gap-3 border-b border-white/[0.06] py-3 last:border-0 transition-colors active:bg-white/[0.03]"
    >
      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-white/[0.06]">
        {imageUrl ? (
          <img src={imageUrl} alt={title} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-white/[0.06]" />
        )}
      </div>
      <p className="min-w-0 flex-1 truncate text-sm font-semibold text-white/75">{title}</p>
      <span className="shrink-0 text-xs text-white/25">→</span>
    </Link>
  )
}

export function ProjectCountrySheet({
  countryCode,
  countryName,
  city,
  projectType,
  speciesCount,
  relatedProjects,
  latitude,
  longitude,
  locale,
}: ProjectCountrySheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  const flag = getCountryFlag(resolveCountryCode(countryCode) ?? '')
  const ecosystemLabel = getEcosystemLabel(projectType)
  const totalProjects = relatedProjects.length + 1

  const statsLine = [
    `${totalProjects} projet${totalProjects > 1 ? 's' : ''}`,
    speciesCount > 0 ? `${speciesCount} espèce${speciesCount > 1 ? 's' : ''}` : null,
    ecosystemLabel,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="mt-2">
      {/* Location line — flag + country + city, clickable */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-xs font-semibold text-white/50 transition-colors hover:text-white/75"
      >
        {flag} {countryName}{city ? ` · ${city}` : ''} ›
      </button>

      <MobileSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`${flag} ${countryName}`}
      >
        {/* Compact stats line */}
        <p className="mt-1 text-xs text-white/40">{statsLine}</p>

        {/* Map */}
        {latitude != null && longitude != null ? (
          <LocationMap latitude={latitude} longitude={longitude} city={city} />
        ) : (
          <RegionMap city={city} countryName={countryName} relatedCount={relatedProjects.length} />
        )}

        {/* Related projects — vertical list */}
        {relatedProjects.length > 0 ? (
          <div className="mt-5">
            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
              Projets dans cette région
            </p>
            <div>
              {relatedProjects.map((project) => (
                <ProjectListRow key={project.id} project={project} locale={locale} />
              ))}
            </div>
          </div>
        ) : null}

        {/* CTA — vrai bouton secondaire */}
        <div className="mt-5 pb-2">
          <Link
            href="/projects"
            className="flex w-full items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] py-3 text-sm font-bold text-white/60 transition-colors hover:bg-white/[0.07] hover:text-white/80 active:scale-[0.98]"
          >
            Voir sur la carte complète
          </Link>
        </div>
      </MobileSheet>
    </div>
  )
}
