'use client'

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { LearningDomainId, AtlasKinnuMapView, LearningProgress } from '@/lib/learning/schema'
import { readLearningProgress } from '@/lib/learning/progress'
import { getSubdomainContent, getSubdomainProgress } from '@/lib/learning/selectors'
import { useAtlasCamera } from '../_hooks/use-atlas-camera'
import { AtlasSubdomainSheet } from './atlas-subdomain-sheet'
import { AtlasCourseSheet } from './atlas-course-sheet'
import { AtlasHeader } from './atlas-header'
import { AtlasActionDock } from './atlas-action-dock'
import { AtlasCamera } from './atlas-camera'

export function AtlasWorldMap({ map }: { map: AtlasKinnuMapView }) {
  const reduceMotion = useReducedMotion() ?? false

  const [progress, setProgress] = useState<LearningProgress | null>(null)
  const [selectedSubdomain, setSelectedSubdomain] = useState<{
    domainId: LearningDomainId
    subdomainId: string
  } | null>(null)
  const [selectedCell, setSelectedCell] = useState<{
    contentId: string
    kind: 'module' | 'course'
    color: string
  } | null>(null)

  useEffect(() => {
    setProgress(readLearningProgress('default'))
  }, [])

  const {
    camera,
    isInteracting,
    selectedTerritoryId,
    selectedTerritory,
    dimensions,
    mainRef,
    snapToWorld,
    snapToTerritory,
    handlePointerDown,
    handlePointerMove,
    handlePointerEnd,
    wasDragged,
  } = useAtlasCamera({ map })

  // Connection lines and top gradient adjust based on whether we're in world or territory view
  const isWorldView = !selectedTerritoryId

  const handleSelectSubdomain = (domainId: LearningDomainId, subdomainId: string) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(12)
      } catch (e) {
        // ignore vibrate error
      }
    }
    setSelectedCell(null)
    setSelectedSubdomain({ domainId, subdomainId })
  }

  const handleSelectCell = (contentId: string, kind: 'module' | 'course', color: string) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(12)
      } catch (e) {
        // ignore vibrate error
      }
    }
    setSelectedSubdomain(null)
    setSelectedCell({ contentId, kind, color })
  }

  const subdomainContent = selectedSubdomain
    ? getSubdomainContent(selectedSubdomain.domainId, selectedSubdomain.subdomainId, progress)
    : null

  const hasStartedDomain = selectedTerritory
    ? selectedTerritory.subdomains.some(
        (s) => getSubdomainProgress(selectedTerritory.domain.id, s.id, progress) > 0
      )
    : false

  return (
    <main
      ref={mainRef}
      className="relative h-[100dvh] min-h-[40rem] touch-none overflow-hidden bg-[#161A12] text-white"
      style={{
        '--atlas-map-width': `${dimensions.width}px`,
        '--atlas-map-height': `${dimensions.height}px`,
      } as React.CSSProperties}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerCancel={handlePointerEnd}
      onPointerUp={handlePointerEnd}
      onClickCapture={(e) => {
        // Prevent accidental clicks on domains/cells when finishing a map pan/zoom gesture
        if (wasDragged()) {
          e.stopPropagation()
          e.preventDefault()
        }
      }}
    >
      <h1 className="sr-only">Atlas du vivant</h1>

      {/* Organic grain texture — SVG feTurbulence overlay */}
      <svg className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-[0.038]" xmlns="http://www.w3.org/2000/svg">
        <filter id="atlas-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#atlas-grain)" />
      </svg>

      {/* Ambient background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_34%,rgba(255,255,255,0.04),transparent_28%),linear-gradient(180deg,#191C17_0%,#161A12_52%,#141810_100%)]" />

      {/* Top gradient: smaller in world view (h-36) to not eat island space, taller in territory view (h-72) for header separation */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 z-40 bg-gradient-to-b from-[#161A12] via-[#161A12]/92 to-transparent"
        animate={{ height: isWorldView ? '9rem' : '18rem' }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
      />

      {/* Bottom gradient */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-36 bg-gradient-to-t from-[#161A12] via-[#161A12]/90 to-transparent" />

      {/* Left / right edge gradients — prevent map boundary visibility when panning */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-40 w-16 bg-gradient-to-r from-[#161A12] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-40 w-16 bg-gradient-to-l from-[#161A12] to-transparent" />

      {/* Domain vignette — semantic color identity per territory when zoomed */}
      {selectedTerritory && (
        <motion.div
          key={selectedTerritory.domain.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, ${selectedTerritory.color}18 0%, transparent 70%),
                         radial-gradient(ellipse at 50% 0%,   ${selectedTerritory.color}10 0%, transparent 60%)`,
          }}
        />
      )}

      <AtlasCamera
        map={map}
        selectedTerritoryId={selectedTerritoryId}
        camera={camera}
        isInteracting={isInteracting}
        isWorldView={isWorldView}
        reduceMotion={reduceMotion}
        onSelectTerritory={snapToTerritory}
        progress={progress}
        onSelectSubdomain={handleSelectSubdomain}
        selectedSubdomainDomainId={selectedSubdomain?.domainId ?? null}
        onSelectCell={handleSelectCell}
      />

      <AtlasHeader selectedTerritory={selectedTerritory} onBackToWorld={snapToWorld} />
      <AtlasActionDock selectedTerritory={selectedTerritory} hasStartedDomain={hasStartedDomain} />

      <AtlasSubdomainSheet
        isOpen={selectedSubdomain !== null}
        onClose={() => setSelectedSubdomain(null)}
        content={subdomainContent}
        territoryColor={subdomainContent?.territory.color ?? '#A7F36B'}
        territoryTextColor={subdomainContent?.territory.textColor ?? '#111'}
        progress={progress}
      />

      <AtlasCourseSheet
        isOpen={selectedCell !== null}
        onClose={() => setSelectedCell(null)}
        contentId={selectedCell?.contentId ?? null}
        kind={selectedCell?.kind ?? null}
        territoryColor={selectedCell?.color ?? '#A7F36B'}
        progress={progress}
      />

      <div className="sr-only" aria-live="polite">
        {selectedTerritory
          ? `${selectedTerritory.domain.title} affiche ses sous-domaines`
          : 'Atlas du vivant prêt'}
      </div>
    </main>
  )
}
