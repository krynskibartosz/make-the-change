import { Gift } from 'lucide-react'
import { CurrencyIcon } from '@/components/currency'
import { Link } from '@/i18n/navigation'
import { formatCompact } from '@/lib/formatters'

type AdvantagesTabHeaderProps = {
  impactCredits: number
}

export function AdvantagesTabHeader({ impactCredits }: AdvantagesTabHeaderProps) {
  return (
    <div className="relative z-50 flex w-full items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-lime-400/10 text-lime-300 shadow-sm">
          <Gift className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">Club partenaire</p>
          <p className="truncate text-sm font-black text-white">Avantages</p>
        </div>
      </div>

      <Link
        href="/advantages/balance"
        prefetch={false}
        aria-label={`${impactCredits} Credits Impact`}
        className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-white/5 bg-black/40 px-3 shadow-sm backdrop-blur-md transition-colors active:bg-white/10"
      >
        <CurrencyIcon kind="impactCredits" className="h-3.5 w-3.5" />
        <span className="text-[12px] font-black tabular-nums text-white">{formatCompact(impactCredits)}</span>
      </Link>
    </div>
  )
}
