'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Section CTA Final
 *
 * Hiérarchie:
 * 1. Contexte (tagline partenaire)
 * 2. CTA interne primaire — projets liés (ancrage dans l'app)
 * 3. CTA externe secondaire — site officiel (en sortie)
 */

import { ArrowRight, ExternalLink } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { producerTypography as typo } from './producer-typography'

type CtaFinalProps = {
  website?: string | null
  contextText?: string
  internalHref?: string
  partnerName?: string
}

function extractHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function CtaFinal({ website, contextText, internalHref = '/projects', partnerName }: CtaFinalProps) {
  const hasExternal = Boolean(website)
  const ctaLabel = partnerName ? `Voir les projets de ${partnerName}` : 'Voir les projets liés'

  return (
    <section className="mt-12 border-t border-white/5 px-5 pb-12 pt-8">
      {contextText && (
        <p className="mb-5 text-center text-[14px] leading-relaxed text-white/58">{contextText}</p>
      )}

      {/* CTA interne — primaire */}
      <Link
        href={internalHref}
        className={`flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/[0.12] text-white/92 transition-all active:scale-95 active:bg-white/[0.16] ${typo.buttonText}`}
      >
        {ctaLabel}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>

      {/* CTA externe — secondaire */}
      {hasExternal && website && (
        <div className="mt-3">
          <a
            href={website}
            target="_blank"
            rel="noreferrer"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 text-[14px] font-semibold text-white/68 transition-all active:scale-95"
          >
            {website.includes('linktr.ee') ? 'Liens officiels' : 'Site officiel'}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <p className="mt-1.5 text-center text-[12px] font-medium text-white/42">
            {extractHostname(website)}
          </p>
        </div>
      )}

      {!hasExternal && <div className="h-2" />}
    </section>
  )
}
