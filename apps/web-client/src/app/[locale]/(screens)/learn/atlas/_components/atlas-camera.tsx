import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { AtlasKinnuMapView, LearningDomainId, LearningProgress } from '@/lib/learning/schema'
import type { MapHexCell } from '@/lib/learning/hex-generation'
import { getSubdomainMapCells, getSubdomainProgress } from '@/lib/learning/selectors'
import { ARTBOARD_HEIGHT, ARTBOARD_WIDTH, COURSE_LEVEL_SCALE, SUBDOMAIN_LABEL_SCALE, SUBDOMAIN_VISIBLE_SCALE } from '../_utils/atlas-config'
import { WorldConnectionLines } from './elements/world-connection-lines'
import { HexTerritorySvg } from './elements/hex-territory-svg'
import { SubdomainSvg } from './elements/subdomain-svg'
import { TerritoryLabel } from './elements/territory-label'
import { SubdomainLabel } from './elements/subdomain-label'
import { CourseCellLabels } from './elements/course-cell-labels'

export function AtlasCamera({
  map,
  selectedTerritoryId,
  camera,
  isInteracting,
  isWorldView,
  reduceMotion,
  onSelectTerritory,
  progress,
  onSelectSubdomain,
  selectedSubdomainDomainId,
  onSelectCell,
}: {
  map: AtlasKinnuMapView
  selectedTerritoryId: LearningDomainId | null
  camera: { x: number; y: number; scale: number }
  isInteracting: boolean
  /** True when camera is at world zoom level — shows connection lines. */
  isWorldView: boolean
  reduceMotion: boolean
  onSelectTerritory: (domainId: LearningDomainId) => void
  progress: LearningProgress | null
  onSelectSubdomain: (domainId: LearningDomainId, subdomainId: string) => void
  selectedSubdomainDomainId: LearningDomainId | null
  onSelectCell: (contentId: string, kind: 'module' | 'course', color: string) => void
}) {
  const isDeepZoom = camera.scale >= COURSE_LEVEL_SCALE

  // Compute map cells for all subdomains (memoized by progress reference)
  const allMapCells = useMemo(() => {
    const cells = new Map<string, MapHexCell[]>()
    for (const territory of map.territories) {
      for (const subdomain of territory.subdomains) {
        const key = `${territory.domain.id}:${subdomain.id}`
        cells.set(key, getSubdomainMapCells(territory.domain.id, subdomain.id, progress))
      }
    }
    return cells
  }, [map.territories, progress])

  return (
    <motion.div
      className="absolute left-0 top-0 bg-[#202020]"
      initial={false}
      animate={{ x: camera.x, y: camera.y, scale: camera.scale }}
      transition={{
        duration: isInteracting ? 0 : reduceMotion ? 0.18 : 0.42,
        ease: [0.2, 0.82, 0.2, 1],
      }}
      style={{
        width: 'var(--atlas-map-width)',
        height: 'var(--atlas-map-height)',
        transformOrigin: '0 0',
      }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${ARTBOARD_WIDTH} ${ARTBOARD_HEIGHT}`}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="atlas-kinnu-vignette" cx="50%" cy="44%" r="70%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="52%" stopColor="rgba(255,255,255,0.015)" />
            {/* Transparent at edges — avoids visible container boundary against the screen bg */}
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>

        <rect width={ARTBOARD_WIDTH} height={ARTBOARD_HEIGHT} fill="transparent" />

        {/* World view connection lines — drawn below hex territories */}
        <WorldConnectionLines 
          territories={map.territories} 
          visible={isWorldView} 
          highlightedDomainId={selectedSubdomainDomainId}
          reduceMotion={reduceMotion}
        />

        {map.territories.map((territory) => {
          const hasProgress = territory.subdomains.some(
            (s) => getSubdomainProgress(territory.domain.id, s.id, progress) > 0
          )
          return (
            <HexTerritorySvg
              key={territory.domain.id}
              territory={territory}
              selected={selectedTerritoryId === territory.domain.id}
              dimmed={Boolean(selectedTerritoryId && selectedTerritoryId !== territory.domain.id)}
              hasProgress={hasProgress}
            />
          )
        })}

        {map.territories.flatMap((territory) =>
          territory.subdomains.map((subdomain) => {
            const ratio = getSubdomainProgress(territory.domain.id, subdomain.id, progress)
            const key = `${territory.domain.id}:${subdomain.id}`
            const mapCells = allMapCells.get(key) ?? []
            return (
              <SubdomainSvg
                key={`${territory.domain.id}-${subdomain.id}`}
                subdomain={subdomain}
                visible={camera.scale >= SUBDOMAIN_VISIBLE_SCALE}
                progressRatio={ratio}
                onClick={() => onSelectSubdomain(territory.domain.id, subdomain.id)}
                mapCells={mapCells}
                isDeepZoom={isDeepZoom}
              />
            )
          }),
        )}

        <rect width={ARTBOARD_WIDTH} height={ARTBOARD_HEIGHT} fill="url(#atlas-kinnu-vignette)" />
      </svg>

      <div className="absolute inset-0">
        {map.territories.map((territory) => (
          <TerritoryLabel
            key={territory.domain.id}
            territory={territory}
            selected={selectedTerritoryId === territory.domain.id}
            dimmed={Boolean(selectedTerritoryId && selectedTerritoryId !== territory.domain.id)}
            onSelect={() => onSelectTerritory(territory.domain.id)}
          />
        ))}

        {map.territories.flatMap((territory) =>
          territory.subdomains.map((subdomain) => {
            const key = `${territory.domain.id}:${subdomain.id}`
            const mapCells = allMapCells.get(key) ?? []
            return (
              <SubdomainLabel
                key={`label-${territory.domain.id}-${subdomain.id}`}
                subdomain={subdomain}
                visible={camera.scale >= SUBDOMAIN_LABEL_SCALE}
                isDeepZoom={isDeepZoom}
                onClick={() => onSelectSubdomain(territory.domain.id, subdomain.id)}
              />
            )
          }),
        )}

        {/* Per-cell course labels at deep zoom */}
        {isDeepZoom &&
          map.territories.flatMap((territory) =>
            territory.subdomains.map((subdomain) => {
              const key = `${territory.domain.id}:${subdomain.id}`
              const mapCells = allMapCells.get(key) ?? []
              if (mapCells.length === 0) return null
              return (
                <CourseCellLabels
                  key={`cells-${territory.domain.id}-${subdomain.id}`}
                  subdomain={subdomain}
                  territoryColor={territory.color}
                  mapCells={mapCells}
                  visible={isDeepZoom}
                  onCellClick={onSelectCell}
                />
              )
            }),
          )}
      </div>
    </motion.div>
  )
}
