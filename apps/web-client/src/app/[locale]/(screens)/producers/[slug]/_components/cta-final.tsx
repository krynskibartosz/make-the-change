'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Section CTA Final
 * 
 * CTA principal: "Découvrir leur univers"
 * CTA secondaire: site web
 * 
 * Plus engageant que "Visiter leur site web".
 */

import { ExternalLink, Compass } from 'lucide-react'

type CtaFinalProps = {
  website?: string | null
  primaryLabel?: string
  secondaryLabel?: string
}

export function CtaFinal({ 
  website,
  primaryLabel = "Découvrir leur univers",
  secondaryLabel = "Visiter leur site"
}: CtaFinalProps) {
  if (!website) {
    return <div className="h-8" /> // Spacer minimal
  }

  return (
    <section className="mt-12 border-t border-white/5 px-5 pb-12 pt-8">
      <div className="flex flex-col gap-3">
        {/* CTA Principal */}
        <a
          href={website}
          target="_blank"
          rel="noreferrer"
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white text-sm font-black text-[#0B0F15] transition-all active:scale-95"
        >
          <Compass className="h-4 w-4" />
          {primaryLabel}
        </a>
        
        {/* CTA Secondaire */}
        <a
          href={website}
          target="_blank"
          rel="noreferrer"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 text-sm font-bold text-white/70 transition-all active:scale-95"
        >
          <ExternalLink className="h-4 w-4" />
          {secondaryLabel}
        </a>
      </div>
    </section>
  )
}
