'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowRight, BookOpen, Check, RotateCcw, X } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import { HexGridCanvas } from './_components/hex-grid-canvas'
import { HexHud } from './_components/hex-hud'
import {
  getAcademyUrl,
  getAllPathways,
  type Pathway,
} from './_lib/hex-grid-data'
import { loadMasteredIds, resetProgress, saveMasteredIds } from './_lib/progress'

export default function KinnuV2Page() {
  const router = useRouter()
  const allPathways = useMemo(() => getAllPathways(), [])
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set())
  const [selectedPathway, setSelectedPathway] = useState<Pathway | null>(null)
  const [isReady, setIsReady] = useState(false)

  // Hydratation depuis localStorage
  useEffect(() => {
    setMasteredIds(loadMasteredIds())
    setIsReady(true)
  }, [])

  const handlePathwayClick = useCallback((pathway: Pathway) => {
    setSelectedPathway(pathway)
  }, [])

  /** Phase 3 : démarrer un Pathway → naviguer vers l'Academy */
  const handleStartPathway = useCallback(() => {
    if (!selectedPathway) return
    const url = getAcademyUrl(selectedPathway)
    if (url) {
      router.push(url)
    }
    // Fallback : si pas d'URL Academy, on ferme juste le sheet
    setSelectedPathway(null)
  }, [selectedPathway, router])

  /** Toggle direct du statut (debug / fallback quand pas d'Academy mappée) */
  const handleToggleMaster = useCallback(() => {
    if (!selectedPathway) return
    setMasteredIds((prev) => {
      const next = new Set(prev)
      if (next.has(selectedPathway.id)) {
        next.delete(selectedPathway.id)
      } else {
        next.add(selectedPathway.id)
      }
      saveMasteredIds(next)
      return next
    })
    setSelectedPathway(null)
  }, [selectedPathway])

  const handleReset = useCallback(() => {
    resetProgress()
    setMasteredIds(new Set())
    setSelectedPathway(null)
  }, [])

  const isSelectedMastered = selectedPathway ? masteredIds.has(selectedPathway.id) : false
  const selectedAcademyUrl = selectedPathway ? getAcademyUrl(selectedPathway) : null

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-[#05050A] text-white">
      {/* Ambiance radiale */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-emerald-500/8 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-amber-500/6 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/4 blur-3xl" />
      </div>

      {/* Background dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, rgba(255,255,255,0.55) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* HUD */}
      <HexHud masteredCount={masteredIds.size} totalPathways={allPathways.length} />

      {/* Reset (debug) */}
      <button
        type="button"
        onClick={handleReset}
        className="absolute bottom-6 left-6 z-30 flex items-center gap-2 rounded-full border border-red-300/20 bg-red-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-red-200 backdrop-blur-md transition-colors hover:bg-red-500/20"
        title="Réinitialiser la progression locale"
      >
        <RotateCcw className="h-3 w-3" />
        Reset
      </button>

      {/* Canvas */}
      <div className="absolute inset-0">
        {isReady ? (
          <HexGridCanvas masteredIds={masteredIds} onPathwayClick={handlePathwayClick} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-emerald-400" />
          </div>
        )}
      </div>

      {/* Bottom Sheet */}
      {selectedPathway && (
        <div
          className="absolute inset-0 z-40 flex items-end justify-center"
          onClick={() => setSelectedPathway(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Sheet */}
          <div
            className="relative z-10 w-full max-w-xl rounded-t-[32px] border-t border-white/10 bg-[#161A23]/95 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] backdrop-blur-2xl shadow-[0_-20px_60px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'kinnu-v2-sheet-up 280ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {/* Drag handle */}
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/15" />

            {/* Close */}
            <button
              type="button"
              onClick={() => setSelectedPathway(null)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Illustration placeholder */}
            <div
              className="mb-5 flex h-40 w-full items-center justify-center overflow-hidden rounded-2xl"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${getPathwayColor(selectedPathway)}55, transparent 60%), linear-gradient(135deg, ${getPathwayColor(selectedPathway)}33, rgba(0,0,0,0.4))`,
              }}
            >
              <span className="text-5xl font-black tracking-tight text-white/40">
                {selectedPathway.shortLabel}
              </span>
            </div>

            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-white/40">
              Pathway · {selectedPathway.islandId}
            </p>
            <h2 className="mb-2 text-2xl font-black leading-tight text-white">
              {selectedPathway.title}
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-white/55">
              {selectedPathway.description}
            </p>

            {/* CTA principal : Démarrer / Revoir → Academy */}
            {selectedAcademyUrl ? (
              <button
                type="button"
                onClick={handleStartPathway}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-sm font-black text-black shadow-[0_5px_0_#065f46] transition-transform active:translate-y-[3px] active:shadow-[0_2px_0_#065f46]"
              >
                {isSelectedMastered ? (
                  <>
                    <BookOpen className="h-4 w-4" />
                    Revoir ce Pathway
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Démarrer ce Pathway
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            ) : (
              <div className="rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4 text-center">
                <p className="text-[11px] font-bold text-amber-200/80">
                  Cours Academy bientôt disponible pour ce Pathway.
                </p>
              </div>
            )}

            {/* CTA secondaire : toggle direct (debug / mock) */}
            <button
              type="button"
              onClick={handleToggleMaster}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              {isSelectedMastered ? (
                <>
                  <X className="h-3 w-3" />
                  Démasteriser (debug)
                </>
              ) : (
                <>
                  <Check className="h-3 w-3" />
                  Marquer comme maîtrisé (mock)
                </>
              )}
            </button>

            {isSelectedMastered && (
              <p className="mt-3 text-center text-[11px] font-bold text-emerald-300">
                ✓ Déjà maîtrisé
              </p>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes kinnu-v2-sheet-up {
          from { transform: translateY(100%); opacity: 0.4; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </main>
  )
}

// Helper local pour récupérer la couleur du pathway via son île
function getPathwayColor(pathway: Pathway): string {
  const colorMap: Record<string, string> = {
    foundations: '#F5B842',
    waters: '#2D9CDB',
    continents: '#27AE60',
    air: '#9B5DE5',
    anthropocene: '#E84855',
    guardians: '#F2D16B',
  }
  return colorMap[pathway.islandId] ?? '#27AE60'
}
