import { Check, Flame, HelpCircle } from 'lucide-react'

interface EvolutionTimelineProps {
  currentLevel: number
  maxLevel?: number
}

export function EvolutionTimeline({ currentLevel, maxLevel = 3 }: EvolutionTimelineProps) {
  const levels = Array.from({ length: maxLevel }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-center gap-3 py-3">
      {levels.map((level) => {
        const isCurrent = level === currentLevel
        const isNext = level === currentLevel + 1
        const isLocked = level > currentLevel

        return (
          <div key={level} className="flex items-center">
            <div
              className={`
                relative flex h-8 w-8 items-center justify-center rounded-full
                ${isCurrent ? 'bg-amber-600' : ''}
                ${isNext ? 'bg-amber-400' : ''}
                ${isLocked ? 'bg-black blur-sm' : ''}
              `}
            >
              {isCurrent && <Check className="h-4 w-4 text-white" />}
              {isNext && <Flame className="h-4 w-4 text-black" />}
              {isLocked && <HelpCircle className="h-4 w-4 text-white/50" />}
            </div>
            {level < maxLevel && (
              <div className="mx-1 h-0.5 w-8 bg-white/20" />
            )}
          </div>
        )
      })}
    </div>
  )
}
