'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ArrowRight, BookOpen, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { TERRITORY_CONTENT } from '../_lib/antsirabe-experience-content'
import { ANTSIRABE_PROJECT } from '../_lib/antsirabe-estimates'
import { ANTSIRABE_SOURCES } from '../_lib/antsirabe-sources'

const RING_COLORS = [
  'rgba(16,185,129,0.35)',  // inner — ruche
  'rgba(16,185,129,0.18)',  // mid — butinage
  'rgba(16,185,129,0.07)',  // outer — pollinisé
]

const RING_LABELS = [
  { text: 'Ruche + colonie', angle: -40, radiusPct: 0.22 },
  { text: 'Zone de butinage (≈ 3 km)', angle: 20,  radiusPct: 0.55 },
  { text: 'Réseau pollinisé', angle: -20, radiusPct: 0.84 },
]

const HIVE_POSITIONS = [
  { x: 50, y: 50 },
  { x: 44, y: 46 }, { x: 56, y: 46 },
  { x: 41, y: 53 }, { x: 50, y: 54 }, { x: 59, y: 53 },
  { x: 46, y: 58 }, { x: 54, y: 58 },
]

const TERRITORY_SOURCES = ANTSIRABE_SOURCES.filter((s) =>
  ['foraging-radius', 'apis-unicolor'].includes(s.id)
)

export function TerritoryMap({ onNext }: { onNext: (() => void) | null }) {
  const [activated, setActivated] = useState(false)
  const [sourcesOpen, setSourcesOpen] = useState(false)

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-[#05050A] pb-[max(2rem,env(safe-area-inset-bottom))]">
      {/* Header */}
      <div className="px-6 pb-4 pt-6">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-1 text-2xl font-black text-white"
        >
          {TERRITORY_CONTENT.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm leading-relaxed text-white/55"
        >
          {TERRITORY_CONTENT.intro}
        </motion.p>
      </div>

      {/* Radial visualization */}
      <div className="relative mx-auto w-full max-w-sm px-6">
        <div className="relative aspect-square w-full">
          <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
            {[0.95, 0.65, 0.38].map((scale, i) => (
              <motion.circle
                key={i}
                cx="50"
                cy="50"
                r={scale * 48}
                fill={RING_COLORS[i]}
                stroke="rgba(16,185,129,0.3)"
                strokeWidth="0.3"
                initial={{ scale: 0, opacity: 0 }}
                animate={activated ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                style={{ transformOrigin: '50px 50px' }}
                transition={{ delay: i * 0.18, duration: 0.6, ease: 'easeOut' }}
              />
            ))}

            <motion.circle
              cx="50" cy="50" r="6"
              fill="none"
              stroke="rgba(16,185,129,0.5)"
              strokeWidth="0.5"
              animate={{ r: [6, 12, 6], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />

            {HIVE_POSITIONS.map((pos, i) => (
              <text
                key={i}
                x={pos.x}
                y={pos.y + 1.5}
                textAnchor="middle"
                fontSize="3.5"
                className="select-none"
              >
                🐝
              </text>
            ))}
          </svg>

          <AnimatePresence>
            {activated && RING_LABELS.map((label, i) => {
              const rad = (label.angle * Math.PI) / 180
              const r = label.radiusPct * 50
              const x = 50 + r * Math.cos(rad)
              const y = 50 + r * Math.sin(rad)
              return (
                <motion.div
                  key={label.text}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.35 + i * 0.15 }}
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <span className="whitespace-nowrap rounded-full border border-emerald-500/25 bg-black/70 px-2 py-0.5 text-[10px] font-bold text-emerald-300 backdrop-blur-sm">
                    {label.text}
                  </span>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Activate button / stats */}
        <AnimatePresence mode="wait">
          {!activated ? (
            <motion.button
              key="activate"
              type="button"
              onClick={() => setActivated(true)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileTap={{ scale: 0.97 }}
              className="mx-auto mt-2 flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 px-6 py-3 text-sm font-black text-emerald-300 transition-colors hover:bg-emerald-500/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
            >
              🐝 {TERRITORY_CONTENT.activateCta}
            </motion.button>
          ) : (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-2 grid grid-cols-2 gap-3"
            >
              {TERRITORY_CONTENT.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center"
                >
                  <p className="text-2xl font-black text-emerald-400">{stat.value}</p>
                  <p className="text-xs font-bold text-white/70">{stat.label}</p>
                  <p className="mt-1 text-[10px] text-white/35">{stat.note}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Context note */}
      <AnimatePresence>
        {activated && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mx-6 mt-4 text-[11px] leading-relaxed text-white/30"
          >
            Ordres de grandeur — {ANTSIRABE_PROJECT.hiveCount} ruches, {ANTSIRABE_PROJECT.apiculteur}, {ANTSIRABE_PROJECT.location}.
          </motion.p>
        )}
      </AnimatePresence>

      {/* Sources */}
      <AnimatePresence>
        {activated && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mx-6 mt-3"
          >
            <button
              type="button"
              onClick={() => setSourcesOpen((v) => !v)}
              className="flex items-center gap-1.5 text-[11px] text-white/30 transition-colors hover:text-white/50"
            >
              <BookOpen className="h-3 w-3" />
              Sources scientifiques
              {sourcesOpen ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
            <AnimatePresence>
              {sourcesOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 space-y-2 rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                    {TERRITORY_SOURCES.map((source) => (
                      <div key={source.id} className="space-y-0.5">
                        <p className="text-[10px] leading-relaxed text-white/40">{source.claim}</p>
                        {source.url ? (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-emerald-500/60 hover:text-emerald-500/90"
                          >
                            {source.label}
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ) : (
                          <p className="text-[10px] text-white/25">{source.label}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <AnimatePresence>
        {activated && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mx-6 mt-6"
          >
            {onNext ? (
              <button
                type="button"
                onClick={onNext}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-base font-black text-black shadow-[0_5px_0_#065f46] transition-all hover:translate-y-0.5 hover:shadow-[0_3px_0_#065f46] active:translate-y-[4px] active:shadow-[0_1px_0_#065f46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
              >
                {TERRITORY_CONTENT.cta}
                <ArrowRight className="h-5 w-5" />
              </button>
            ) : (
              <div className="flex w-full flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] py-4 text-center">
                <span className="text-sm font-black text-white/30">{TERRITORY_CONTENT.comingSoon}</span>
                <span className="text-[11px] text-white/20">Pollinisation · La danse · Le miel · Impact</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
