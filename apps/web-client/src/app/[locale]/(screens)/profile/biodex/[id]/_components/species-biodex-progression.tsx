import { Check } from 'lucide-react'
import { CurrencyIcon } from '@/components/currency'

interface SpeciesBiodexProgressionProps {
  progressionLevel: number
  currentSeeds: number
}

const STEPS = [
  { level: 1, label: 'Découvrir son rôle', seeds: null },
  { level: 2, label: 'Comprendre son habitat', seeds: 500 },
  { level: 3, label: 'Explorer ses relations', seeds: 800 },
  { level: 4, label: 'Lire ses fragilités', seeds: 1200 },
] as const

export function SpeciesBiodexProgression({
  progressionLevel,
  currentSeeds,
}: SpeciesBiodexProgressionProps) {
  return (
    <section className='mx-5'>
      <p className='mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-white/35'>
        Fiche BioDex
      </p>
      <div className='space-y-2 rounded-3xl border border-white/8 bg-white/[0.04] p-4'>
        {STEPS.map((step) => {
          const isUnlocked = progressionLevel >= step.level
          const isNext = progressionLevel === step.level - 1
          const canAfford = step.seeds !== null && currentSeeds >= step.seeds

          return (
            <div
              key={step.level}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 ${
                isUnlocked ? 'bg-emerald-500/10' : 'bg-white/[0.03]'
              }`}
            >
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  isUnlocked ? 'border-emerald-400 bg-emerald-400' : 'border-white/20 bg-transparent'
                }`}
              >
                {isUnlocked && <Check className='h-2.5 w-2.5 text-black' strokeWidth={3} />}
              </div>

              <span
                className={`flex-1 text-sm font-semibold ${isUnlocked ? 'text-white/90' : 'text-white/35'}`}
              >
                {step.label}
              </span>

              {isUnlocked && (
                <span className='text-[10px] font-bold uppercase tracking-wider text-emerald-400/60'>
                  Disponible
                </span>
              )}
              {!isUnlocked && step.seeds !== null && (
                <div className='flex items-center gap-1'>
                  <CurrencyIcon kind='seeds' className='h-3 w-3' />
                  <span
                    className={`text-xs font-bold tabular-nums ${isNext && canAfford ? 'text-emerald-300' : 'text-white/30'}`}
                  >
                    {step.seeds}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
