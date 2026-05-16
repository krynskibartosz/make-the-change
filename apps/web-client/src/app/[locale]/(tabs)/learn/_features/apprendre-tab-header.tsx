import { BookOpen, Sprout } from 'lucide-react'
import { formatCompact } from '@/lib/formatters'

type ApprendreTabHeaderProps = {
  seeds: number
}

export function ApprendreTabHeader({ seeds }: ApprendreTabHeaderProps) {
  return (
    <div className="relative z-50 flex w-full items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-teal-400/10 text-teal-300 shadow-sm">
          <BookOpen className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">Academy & BioDex</p>
          <p className="truncate text-sm font-black text-white">Apprendre</p>
        </div>
      </div>

      <div className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-white/5 bg-black/40 px-3 shadow-sm backdrop-blur-md">
        <Sprout className="h-3.5 w-3.5 text-teal-300" aria-hidden="true" />
        <span className="text-[12px] font-black tabular-nums text-white">{formatCompact(seeds)}</span>
      </div>
    </div>
  )
}
