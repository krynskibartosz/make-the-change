import { motion } from 'framer-motion'
import type { AtlasTerritoryConfig, LearningDomainId } from '@/lib/learning/schema'
import { getTerritoryPoint } from '../../_utils/atlas-geometry'

// ─── Connection graph ────────────────────────────────────────────────────────
// Pairs of domain IDs that share a visible connection line in world view.
// Chosen to form a fully connected graph matching the geographic layout.

const WORLD_CONNECTION_PAIRS: Array<[LearningDomainId, LearningDomainId]> = [
  ['alphabet-du-vivant', 'relations-du-vivant'],
  ['milieux-habitats', 'relations-du-vivant'],
  ['milieux-habitats', 'menaces'],
  ['relations-du-vivant', 'menaces'],
  ['relations-du-vivant', 'solutions'],
  ['menaces', 'lire-impact'],
  ['solutions', 'lire-impact'],
]

export function WorldConnectionLines({
  territories,
  visible,
  highlightedDomainId,
  reduceMotion,
}: {
  territories: AtlasTerritoryConfig[]
  visible: boolean
  highlightedDomainId: LearningDomainId | null
  reduceMotion: boolean
}) {
  const centerMap = new Map(territories.map((t) => [t.domain.id, getTerritoryPoint(t)]))

  return (
    <motion.g
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      aria-hidden="true"
    >
      {WORLD_CONNECTION_PAIRS.map(([fromId, toId]) => {
        const from = centerMap.get(fromId)
        const to = centerMap.get(toId)
        if (!from || !to) return null
        
        const isHighlighted = highlightedDomainId === fromId || highlightedDomainId === toId

        return (
          <g key={`${fromId}-${toId}`}>
            {/* The connection path itself */}
            <motion.path
              d={`M ${from.x} ${from.y} Q ${from.x + (to.x - from.x) / 2 + 50} ${from.y + (to.y - from.y) / 2 - 50} ${to.x} ${to.y}`}
              fill="transparent"
              animate={
                isHighlighted
                  ? {
                      stroke: ['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.45)', 'rgba(255,255,255,0.18)'],
                      strokeWidth: [4, 5.5, 4],
                    }
                  : {
                      stroke: 'rgba(255,255,255,0.09)',
                      strokeWidth: 4,
                    }
              }
              transition={
                isHighlighted
                  ? {
                      repeat: Infinity,
                      duration: 3,
                      ease: 'easeInOut',
                    }
                  : { duration: 0.3 }
              }
              strokeDasharray="4 14"
              strokeLinecap="round"
            />
            {/* Sap pulse — a faint dot that travels along the path */}
            {!reduceMotion && (
              <circle r="3.5" fill="rgba(255,255,255,0.28)">
                <animateMotion
                  dur={`${7 + (fromId.length + toId.length) % 5}s`}
                  repeatCount="indefinite"
                  path={`M ${from.x} ${from.y} Q ${from.x + (to.x - from.x) / 2 + 50} ${from.y + (to.y - from.y) / 2 - 50} ${to.x} ${to.y}`}
                />
              </circle>
            )}
          </g>
        )
      })}
    </motion.g>
  )
}
