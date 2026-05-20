import { motion } from 'framer-motion'
import { Compass, BookOpen, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AtlasSubdomainConfig } from '@/lib/learning/schema'
import type { MapHexCell } from '@/lib/learning/hex-generation'
import { ARTBOARD_HEIGHT, ARTBOARD_WIDTH, SUBDOMAIN_HEX_RADIUS } from '../_utils/atlas-config'
import { getHexCenter, getSubdomainPoint } from '../_utils/atlas-geometry'

/**
 * Per-cell course/module labels rendered at deep zoom inside the subdomain.
 * Each cell shows a short title when the user zooms close enough.
 */
export function CourseCellLabels({
  subdomain,
  territoryColor,
  mapCells,
  visible,
  onCellClick,
}: {
  subdomain: AtlasSubdomainConfig
  territoryColor: string
  mapCells: MapHexCell[]
  visible: boolean
  onCellClick: (contentId: string, kind: 'module' | 'course', color: string) => void
}) {
  const center = getSubdomainPoint(subdomain)

  if (!visible || mapCells.length === 0) return null

  return (
    <>
      {mapCells.map((mc) => {
        const { x: cellX, y: cellY } = getHexCenter(mc, SUBDOMAIN_HEX_RADIUS)
        const cx = center.x + cellX
        const cy = center.y + cellY

        const isModule = mc.kind === 'module'
        const status = mc.status
        const isCompleted = status === 'completed'
        const isInProgress = status === 'in-progress'
        const isNotStarted = status === 'not-started'
        
        const Icon = isModule ? Compass : BookOpen

        return (
          <motion.div
            key={`cell-label-${mc.contentId}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute z-40 pointer-events-none flex flex-col items-center"
            style={{
              left: `${(cx / ARTBOARD_WIDTH) * 100}%`,
              top: `${(cy / ARTBOARD_HEIGHT) * 100}%`,
              transform: 'translate(-50%, -100%)', // Anchor bottom to cell center
            }}
          >
            {/* The Label/Button */}
            <button
              type="button"
              className={cn(
                'pointer-events-auto flex items-center gap-1.5 rounded-full px-2.5 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.15)] active:scale-95 transition-transform min-w-[3rem]',
                isModule
                  ? 'bg-white text-amber-600 font-bold ring-1 ring-black/10'
                  : 'bg-[#1a1a1a]/80 backdrop-blur-md text-white font-medium ring-1 ring-white/10',
                isNotStarted ? 'opacity-80' : '',
                isInProgress ? 'ring-2 ring-white/50 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : '',
                isCompleted ? 'opacity-100' : ''
              )}
              onClick={(e) => {
                e.stopPropagation()
                onCellClick(mc.contentId, mc.kind, territoryColor)
              }}
            >
              <div className="relative flex items-center justify-center shrink-0">
                <Icon size={12} strokeWidth={2.5} />
                {isCompleted && (
                  <div className="absolute -bottom-1 -right-1 z-20 bg-green-500 rounded-full text-white ring-[1.5px] ring-white">
                    <CheckCircle2 size={8} strokeWidth={3} />
                  </div>
                )}
              </div>
              <span className="text-[0.72rem] leading-none whitespace-nowrap pt-0.5">
                {mc.title}
              </span>
            </button>

            {/* The Anchor Pin */}
            <div className="flex flex-col items-center pointer-events-none">
              <div className={cn("w-px h-3", isModule ? "bg-amber-500/70" : "bg-white/40")} />
              <div className={cn("w-1.5 h-1.5 rounded-full shadow-sm ring-1 ring-black/20", isModule ? "bg-amber-500" : "bg-white/60")} />
            </div>
          </motion.div>
        )
      })}
    </>
  )
}
