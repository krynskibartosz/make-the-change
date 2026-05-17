'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import {
  WAGGLE_DANCE_CONTENT,
  WAGGLE_SCENARIO,
} from '../_lib/antsirabe-experience-content'
import { ANTSIRABE_SOURCES } from '../_lib/antsirabe-sources'

type Phase = 'observe' | 'direction' | 'distance' | 'reveal'
type DirectionId = 'sun-left' | 'sun-toward' | 'sun-right' | 'sun-away'
type DistanceId = '500m' | '1km' | '2km' | '4km'

const DIRECTION_OPTIONS: { id: DirectionId; label: string }[] = [
  { id: 'sun-left',   label: 'À gauche du soleil' },
  { id: 'sun-toward', label: 'Vers le soleil' },
  { id: 'sun-right',  label: 'À droite du soleil' },
  { id: 'sun-away',   label: "À l'opposé du soleil" },
]

const DISTANCE_OPTIONS: { id: DistanceId; label: string }[] = [
  { id: '500m', label: '≈ 500 m' },
  { id: '1km',  label: '≈ 1 km' },
  { id: '2km',  label: '≈ 2 km' },
  { id: '4km',  label: '≈ 4 km' },
]

// Figure-8 dance path keyframes in SVG viewBox 0 0 100 100
// Waggle run (zigzag up) → left return arc → waggle run → right return arc
const BEE_CX = [50, 47, 53, 47, 53, 50, 26, 18, 26, 50, 47, 53, 47, 53, 50, 74, 82, 74, 50]
const BEE_CY = [68, 61, 54, 47, 40, 33, 38, 52, 66, 68, 61, 54, 47, 40, 33, 38, 52, 66, 68]
const BEE_TIMES = BEE_CX.map((_, i) => i / (BEE_CX.length - 1))

const WAGGLE_SOURCE = ANTSIRABE_SOURCES.find((s) => s.id === 'waggle-dance')

// ─── Reveal lines ─────────────────────────────────────────────────────────────

const REVEAL_LINES = [
  { text: "1 abeille a trouvé une floraison d'eucalyptus.", className: 'text-base text-white/70', delay: 0 },
  { text: '1 danse.',                                       className: 'text-4xl font-black text-white', delay: 0.9 },
  { text: '→ 300 butineuses mobilisées.',                  className: 'text-lg font-bold text-emerald-300', delay: 1.8 },
  { text: '→ Des milliers de fleurs visitées.',            className: 'text-lg font-bold text-emerald-300', delay: 2.6 },
]

// ─── Observe ──────────────────────────────────────────────────────────────────

function ObservePhase({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-between bg-[#05050A] px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-8">
      <div className="w-full text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-400/60">
          {WAGGLE_DANCE_CONTENT.title}
        </p>
        <p className="mt-2 text-sm text-white/40">{WAGGLE_DANCE_CONTENT.intro}</p>
      </div>

      {/* SVG figure-8 animation */}
      <div className="flex h-56 w-full items-center justify-center">
        <svg viewBox="0 0 100 100" className="h-full w-full max-w-[13rem]">
          {/* Background hex dots */}
          {[[20,20],[50,14],[80,20],[12,50],[88,50],[20,80],[50,86],[80,80]].map(([x,y],i)=>(
            <circle key={i} cx={x} cy={y} r={0.8} fill="rgba(16,185,129,0.12)" />
          ))}

          {/* Figure-8 path (dashed static trace) */}
          <path
            d="M 50 68 L 47 61 L 53 54 L 47 47 L 53 40 L 50 33 C 20 33 18 68 50 68 L 47 61 L 53 54 L 47 47 L 53 40 L 50 33 C 80 33 82 68 50 68 Z"
            fill="none"
            stroke="rgba(16,185,129,0.18)"
            strokeWidth="0.7"
            strokeDasharray="1.5 1.5"
          />

          {/* Waggle run highlight */}
          <line
            x1={50} y1={68} x2={50} y2={33}
            stroke="rgba(16,185,129,0.35)"
            strokeWidth="1"
            strokeDasharray="1 1.5"
          />

          {/* "frétillement" label */}
          <text x={55} y={52} fontSize="3.2" fill="rgba(16,185,129,0.45)" fontWeight="bold">
            frétillement
          </text>

          {/* Animated bee dot */}
          <motion.circle
            cx={50} cy={68} r={3}
            fill="rgba(16,185,129,0.95)"
            animate={{ cx: BEE_CX, cy: BEE_CY }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'linear', times: BEE_TIMES }}
          />
        </svg>
      </div>

      <div className="w-full">
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mb-6 text-center text-xl font-black text-white"
        >
          {WAGGLE_DANCE_CONTENT.observation}
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          type="button"
          onClick={onNext}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-base font-black text-black shadow-[0_5px_0_#065f46] transition-all hover:translate-y-0.5 hover:shadow-[0_3px_0_#065f46] active:translate-y-[4px] active:shadow-[0_1px_0_#065f46]"
        >
          Décoder
          <ArrowRight className="h-5 w-5" />
        </motion.button>
      </div>
    </div>
  )
}

// ─── Direction ────────────────────────────────────────────────────────────────

function DirectionPhase({ onNext }: { onNext: () => void }) {
  const [chosen, setChosen] = useState<DirectionId | null>(null)
  const isCorrect = chosen === WAGGLE_SCENARIO.correctDirection

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#05050A] px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6">
      <div className="mb-3 shrink-0">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-400/60">Direction</p>
        <h2 className="mt-0.5 text-xl font-black text-white">Dans quelle direction vole-t-elle ?</h2>
        <p className="mt-0.5 text-sm text-white/40">
          La danse indique la direction par rapport au soleil.
        </p>
      </div>

      {/* Compass SVG */}
      <div className="mb-3 flex shrink-0 justify-center">
        <svg viewBox="0 0 100 100" className="h-36 w-36">
          {/* Ring */}
          <circle cx={50} cy={50} r={40} fill="rgba(16,185,129,0.04)" stroke="rgba(16,185,129,0.15)" strokeWidth="0.5" />

          {/* Cardinal ticks */}
          {[0, 90, 180, 270].map((deg) => {
            const rad = (deg - 90) * (Math.PI / 180)
            return (
              <line
                key={deg}
                x1={50 + 37 * Math.cos(rad)} y1={50 + 37 * Math.sin(rad)}
                x2={50 + 41 * Math.cos(rad)} y2={50 + 41 * Math.sin(rad)}
                stroke="rgba(255,255,255,0.2)" strokeWidth="0.7"
              />
            )
          })}

          {/* Sun at top */}
          <text x={50} y={13} textAnchor="middle" fontSize="10">☀️</text>

          {/* Dance direction arrow: 60° clockwise from up (sun) */}
          {/* SVG angle: -90° + 60° = -30° from pos x-axis → end = (50+28·cos(-30°), 50+28·sin(-30°)) = (74, 36) */}
          <motion.path
            d="M 50 50 L 74 36"
            stroke="rgba(16,185,129,0.9)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />

          {/* Arrowhead */}
          <motion.circle
            cx={74} cy={36} r={2.5}
            fill="rgba(16,185,129,1)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          />

          {/* Bee at tip */}
          <motion.text
            x={74} y={31}
            textAnchor="middle"
            fontSize="7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            🐝
          </motion.text>

          {/* Angle label */}
          <motion.text
            x={61} y={45}
            fontSize="3.5"
            fill="rgba(16,185,129,0.55)"
            fontWeight="bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            60°
          </motion.text>

          <circle cx={50} cy={50} r={1.5} fill="rgba(255,255,255,0.5)" />
        </svg>
      </div>

      {/* Buttons / feedback */}
      <AnimatePresence mode="wait">
        {chosen === null ? (
          <motion.div
            key="choices"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid flex-1 grid-cols-2 gap-2"
          >
            {DIRECTION_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setChosen(opt.id)}
                className="rounded-2xl border border-white/15 bg-white/[0.05] px-3 py-3.5 text-left text-xs font-bold text-white/80 transition-all hover:bg-white/10 active:scale-[0.97]"
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col rounded-3xl border p-4 ${
              isCorrect
                ? 'border-emerald-500/30 bg-emerald-500/10'
                : 'border-sky-500/30 bg-sky-500/10'
            }`}
          >
            <p className={`text-xs font-black uppercase tracking-wider ${isCorrect ? 'text-emerald-400' : 'text-sky-400'}`}>
              {isCorrect ? 'Exact !' : 'Pas tout à fait'}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-white/80">
              {WAGGLE_DANCE_CONTENT.directionRule}.{' '}
              Ici, la floraison est {WAGGLE_SCENARIO.directionLabel}.
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-white/40">
              L'abeille utilise le soleil comme boussole. Par temps couvert, elle se repère sur la lumière polarisée du ciel.
            </p>
            <button
              type="button"
              onClick={onNext}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-white/10 py-3 text-sm font-black text-white hover:bg-white/15"
            >
              Continuer
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Distance ─────────────────────────────────────────────────────────────────

function DistancePhase({ onNext }: { onNext: () => void }) {
  const [chosen, setChosen] = useState<DistanceId | null>(null)
  const [choicesReady, setChoicesReady] = useState(false)
  const isCorrect = chosen === WAGGLE_SCENARIO.correctDistance

  useEffect(() => {
    const t = setTimeout(() => setChoicesReady(true), 2200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#05050A] px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6">
      <div className="mb-4 shrink-0">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-400/60">Distance</p>
        <h2 className="mt-0.5 text-xl font-black text-white">À quelle distance se trouve la floraison ?</h2>
        <p className="mt-0.5 text-sm text-white/40">Observe la durée du frétillement.</p>
      </div>

      {/* Waggle duration indicator */}
      <div className="mb-5 shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] text-white/40">Phase frétillante</span>
          <span className="text-[11px] font-bold text-emerald-400/70">≈ 2 s</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-emerald-500"
            initial={{ width: '0%' }}
            animate={{ width: '70%' }}
            transition={{ duration: 1.9, ease: 'easeInOut', delay: 0.3 }}
          />
        </div>
        <p className="mt-2 text-[10px] text-white/25">
          1 s de frétillement ≈ 1 km — ordre de grandeur, pas une mesure exacte.
        </p>
      </div>

      {/* Buttons / feedback */}
      <AnimatePresence mode="wait">
        {chosen === null ? (
          <motion.div
            key="choices"
            animate={{ opacity: choicesReady ? 1 : 0.25 }}
            transition={{ duration: 0.4 }}
            className="space-y-2"
          >
            {DISTANCE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => { if (choicesReady) setChosen(opt.id) }}
                className="flex w-full items-center rounded-2xl border border-white/15 bg-white/[0.05] px-4 py-3.5 text-sm font-bold text-white/80 transition-all hover:bg-white/10 active:scale-[0.98]"
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col rounded-3xl border p-4 ${
              isCorrect
                ? 'border-emerald-500/30 bg-emerald-500/10'
                : 'border-sky-500/30 bg-sky-500/10'
            }`}
          >
            <p className={`text-xs font-black uppercase tracking-wider ${isCorrect ? 'text-emerald-400' : 'text-sky-400'}`}>
              {isCorrect ? 'Exact !' : 'Pas tout à fait'}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-white/80">
              {WAGGLE_DANCE_CONTENT.distanceRule}.{' '}
              La {WAGGLE_SCENARIO.flowerPatch} est à environ {WAGGLE_SCENARIO.distanceKm} km.
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-white/40">
              Plus le frétillement dure, plus la source est loin. La relation exacte varie selon le contexte — c'est une approximation utile, pas une règle absolue.
            </p>
            <button
              type="button"
              onClick={onNext}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-white/10 py-3 text-sm font-black text-white hover:bg-white/15"
            >
              Voir la suite
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Reveal ───────────────────────────────────────────────────────────────────

function RevealPhase({ onNext }: { onNext: (() => void) | null }) {
  return (
    <div className="flex h-full flex-col justify-between bg-[#05050A] px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-8">
      <div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 text-xs font-bold uppercase tracking-wider text-emerald-400/60"
        >
          {WAGGLE_DANCE_CONTENT.networkReveal}
        </motion.p>

        <div className="space-y-5">
          {REVEAL_LINES.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: line.delay, duration: 0.5 }}
              className={`leading-snug ${line.className}`}
            >
              {line.text}
            </motion.p>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.6 }}
          className="mt-8 text-sm font-bold text-white/50"
        >
          {WAGGLE_DANCE_CONTENT.success}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4.4 }}
        className="space-y-3"
      >
        {WAGGLE_SOURCE && (
          <div>
            <p className="text-[10px] leading-relaxed text-white/25">{WAGGLE_SOURCE.claim}</p>
            {WAGGLE_SOURCE.url && (
              <a
                href={WAGGLE_SOURCE.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-emerald-500/50 hover:text-emerald-500/80"
              >
                {WAGGLE_SOURCE.label}
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            )}
          </div>
        )}

        {onNext ? (
          <button
            type="button"
            onClick={onNext}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-base font-black text-black shadow-[0_5px_0_#065f46] transition-all hover:translate-y-0.5 hover:shadow-[0_3px_0_#065f46] active:translate-y-[4px] active:shadow-[0_1px_0_#065f46]"
          >
            Continuer
            <ArrowRight className="h-5 w-5" />
          </button>
        ) : (
          <div className="flex w-full flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.04] py-4 text-center">
            <span className="text-sm font-black text-white/30">Suite en préparation</span>
            <span className="text-[11px] text-white/20">Le miel · Impact</span>
          </div>
        )}
      </motion.div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function WaggleDanceDecoder({ onNext }: { onNext: (() => void) | null }) {
  const [phase, setPhase] = useState<Phase>('observe')

  return (
    <div className="relative h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ type: 'spring', stiffness: 360, damping: 34 }}
          className="absolute inset-0"
        >
          {phase === 'observe'   && <ObservePhase   onNext={() => setPhase('direction')} />}
          {phase === 'direction' && <DirectionPhase onNext={() => setPhase('distance')} />}
          {phase === 'distance'  && <DistancePhase  onNext={() => setPhase('reveal')} />}
          {phase === 'reveal'    && <RevealPhase    onNext={onNext} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
