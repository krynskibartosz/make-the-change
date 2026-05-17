'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Section CTA Final
 *
 * Un seul CTA externe — deux boutons vers la même destination créent
 * une fausse hiérarchie et une friction inutile.
 */

import { ExternalLink } from 'lucide-react'

type CtaFinalProps = {
  website?: string | null
  label?: string
}

function extractHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function CtaFinal({
  website,
  label = "Découvrir leur univers",
}: CtaFinalProps) {
  if (!website) {
    return <div className="h-8" />
  }

  const hostname = extractHostname(website)

  return (
    <section className="mt-12 border-t border-white/5 px-5 pb-12 pt-8">
      <a
        href={website}
        target="_blank"
        rel="noreferrer"
        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white text-sm font-black text-[#0B0F15] transition-all active:scale-95"
      >
        {label}
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
      <p className="mt-2 text-center text-[11px] text-white/30">
        Site officiel · {hostname}
      </p>
    </section>
  )
}
