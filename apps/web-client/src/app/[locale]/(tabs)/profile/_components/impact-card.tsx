import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ImpactCardProps {
  icon: ReactNode
  value?: ReactNode
  label: ReactNode
  variant?: 'locked' | 'unlocked'
  valueClassName?: string
}

export function ImpactCard({
  icon,
  value,
  label,
  variant = 'unlocked',
  valueClassName,
}: ImpactCardProps) {
  const isLocked = variant === 'locked'
  const displayValue = value !== undefined ? value : (isLocked ? '-' : '0')

  return (
    <div
      className={cn(
        'flex h-full flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center transition-all',
        isLocked && 'opacity-50 grayscale'
      )}
    >
      <div className="mb-2 flex h-5 w-5 items-center justify-center">{icon}</div>
      <div className={cn('text-2xl font-black tabular-nums text-white', valueClassName)}>
        {displayValue}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-widest text-white/50">
        {label}
      </div>
    </div>
  )
}