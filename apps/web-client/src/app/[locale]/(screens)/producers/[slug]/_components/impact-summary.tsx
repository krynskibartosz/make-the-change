'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Section Impact Summary
 * 
 * Remplace la grosse métrique isolée par une estimation prudente:
 * - Wording: "Estimation", "concernées", "liée à"
 * - Disclaimer visible
 * - Style différent des preuves (estimation vs fait)
 * 
 * Make the Change doctrine: pas de claim environnemental fort sans preuve.
 */

import { Info } from 'lucide-react'
import { formatCompact } from '@/lib/formatters'
import type { ImpactSummary } from '@/app/[locale]/(site)/producers/_features/mock-producers'

type ImpactSummaryProps = {
  summary?: ImpactSummary
}

export function ImpactSummarySection({ summary }: ImpactSummaryProps) {
  if (!summary || !summary.estimate) return null

  return (
    <section className="mt-10 px-5">
      <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-amber-500/5 to-transparent p-5">
        {/* Label prudent */}
        <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400/60">
          {summary.wording}
        </p>
        
        {/* Valeur */}
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-black text-amber-400 tabular-nums">
            {formatCompact(summary.estimate)}
          </span>
          <span className="text-sm font-bold text-amber-400/60">
            {summary.unit}
          </span>
        </div>
        
        {/* Disclaimer */}
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-white/5 p-3">
          <Info className="h-4 w-4 shrink-0 text-white/40" />
          <p className="text-[12px] leading-relaxed text-white/50">
            {summary.disclaimer}
          </p>
        </div>
      </div>
    </section>
  )
}
