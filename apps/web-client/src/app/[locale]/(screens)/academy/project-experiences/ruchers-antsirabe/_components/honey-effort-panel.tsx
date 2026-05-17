'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import {
  HONEY_EFFORT_CONTENT,
  HONEY_TIERS,
  type HoneyTierId,
} from '../_lib/antsirabe-experience-content'
import { ANTSIRABE_SOURCES } from '../_lib/antsirabe-sources'

const HONEY_SOURCE = ANTSIRABE_SOURCES.find((s) => s.id === 'worker-lifespan')

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  tierId,
  value,
  label,
  note,
  accent,
}: {
  tierId: HoneyTierId
  value: string
  label: string
  note?: string
  accent?: boolean
}) {
  return (
    <motion.div
      key={tierId}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      className={`rounded-2xl border p-4 text-center ${
        accent
          ? 'border-emerald-500/30 bg-emerald-500/10'
          : 'border-white/10 bg-white/[0.04]'
      }`}
    >
      <p className={`text-2xl font-black ${accent ? 'text-emerald-300' : 'text-white'}`}>
        {value}
      </p>
      <p className="mt-0.5 text-xs font-bold text-white/50">{label}</p>
      {note && <p className="mt-1.5 text-[10px] leading-relaxed text-white/30">{note}</p>}
    </motion.div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function HoneyEffortPanel({ onNext }: { onNext: (() => void) | null }) {
  const [selectedId, setSelectedId] = useState<HoneyTierId>('1tsp')
  const [sourcesOpen, setSourcesOpen] = useState(false)

  const tier = HONEY_TIERS.find((t) => t.id === selectedId)!

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#05050A] pb-[max(2rem,env(safe-area-inset-bottom))]">
      {/* Header */}
      <div className="px-6 pb-4 pt-6">
        <h2 className="text-2xl font-black text-white">{HONEY_EFFORT_CONTENT.title}</h2>
        <p className="mt-1 text-sm text-white/45">{HONEY_EFFORT_CONTENT.subtitle}</p>
      </div>

      {/* Tier selector */}
      <div className="mx-6 mb-5 flex gap-2">
        {HONEY_TIERS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSelectedId(t.id)}
            className={`flex-1 rounded-2xl border py-2.5 text-xs font-black transition-all ${
              t.id === selectedId
                ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-200'
                : 'border-white/10 bg-white/[0.04] text-white/45 hover:bg-white/10'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* Flowers + Flight — side by side */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                tierId={selectedId}
                value={tier.flowers.display}
                label="fleurs visitées"
              />
              <StatCard
                tierId={selectedId}
                value={tier.flight.display}
                label="vol collectif"
                note={tier.flight.context}
              />
            </div>

            {/* Bees — full width, accented */}
            <StatCard
              tierId={selectedId}
              value={tier.bees.display}
              label="vies de butineuses"
              note={tier.bees.note}
              accent
            />

            {/* Wow statement */}
            <motion.div
              key={`wow-${selectedId}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.35 }}
              className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3.5"
            >
              <p className="text-base font-black text-white">{tier.wow}</p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Disclaimer + source */}
      <div className="mx-6 mt-5 space-y-2">
        <p className="text-[10px] leading-relaxed text-white/25">
          {HONEY_EFFORT_CONTENT.disclaimer}
        </p>

        {HONEY_SOURCE && (
          <div>
            <button
              type="button"
              onClick={() => setSourcesOpen((v) => !v)}
              className="text-[10px] text-white/25 underline-offset-2 hover:text-white/45 hover:underline"
            >
              {sourcesOpen ? 'Masquer la source' : 'Source'}
            </button>
            <AnimatePresence>
              {sourcesOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="mt-1.5 text-[10px] leading-relaxed text-white/30">
                    {HONEY_SOURCE.claim}
                  </p>
                  <p className="mt-0.5 text-[10px] text-white/20">{HONEY_SOURCE.label}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="mx-6 mt-8">
        {onNext ? (
          <button
            type="button"
            onClick={onNext}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-base font-black text-black shadow-[0_5px_0_#065f46] transition-all hover:translate-y-0.5 hover:shadow-[0_3px_0_#065f46] active:translate-y-[4px] active:shadow-[0_1px_0_#065f46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
          >
            Continuer
            <ArrowRight className="h-5 w-5" />
          </button>
        ) : (
          <div className="flex w-full flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.04] py-4 text-center">
            <span className="text-sm font-black text-white/30">Suite en préparation</span>
            <span className="text-[11px] text-white/20">Impact · Récapitulatif</span>
          </div>
        )}
      </div>
    </div>
  )
}
