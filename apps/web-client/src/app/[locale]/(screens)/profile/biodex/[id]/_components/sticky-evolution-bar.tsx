'use client'
import { Lock, Sprout } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StickyEvolutionBarProps {
  currentSeeds: number
  requiredSeeds: number
  canEvolve: boolean
  onDisabledClick: () => void
}

export function StickyEvolutionBar({
  currentSeeds,
  requiredSeeds,
  canEvolve,
  onDisabledClick,
}: StickyEvolutionBarProps) {
  const progress = Math.min((currentSeeds / requiredSeeds) * 100, 100)

  return (
    <div className='fixed inset-x-0 bottom-0 z-[60] border-t border-white/5 bg-background/80 px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] backdrop-blur-md'>
      <div className='mx-auto flex w-full max-w-2xl items-center gap-4'>
        <div className='min-w-0 flex-1'>
          <div className='mb-1.5 flex items-center justify-between'>
            <span className='text-xs text-white/40'>Améliorer la fiche</span>
            <div className='flex items-center gap-1'>
              <Sprout className='h-3 w-3 text-lime-400' />
              <span
                className={cn(
                  'text-xs font-bold tabular-nums',
                  canEvolve ? 'text-lime-400' : 'text-white/40',
                )}
              >
                {currentSeeds} / {requiredSeeds}
              </span>
            </div>
          </div>
          <div className='h-0.5 w-full overflow-hidden rounded-full bg-white/10'>
            <div
              className='h-full rounded-full bg-lime-400 transition-all duration-700'
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          type='button'
          onClick={canEvolve ? undefined : onDisabledClick}
          className={cn(
            'h-11 shrink-0 rounded-2xl px-5 text-sm font-bold transition-all',
            canEvolve
              ? 'bg-lime-400 text-black active:scale-95'
              : 'cursor-pointer border border-white/10 bg-white/5 text-white/30',
          )}
        >
          {canEvolve ? (
            <>Améliorer ({requiredSeeds} 🌱)</>
          ) : (
            <span className='flex items-center gap-1.5'>
              <Lock className='h-3.5 w-3.5' />
              Améliorer
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
