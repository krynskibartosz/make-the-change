'use client'

import { useState } from 'react'
import { ArrowRight, Check, Copy, ExternalLink, Sparkles } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { CurrencyAmount } from '@/components/currency'
import type { Advantage } from '@/app/[locale]/(screens)/advantages/_features/mock-advantages'

const TYPE_LABELS: Partial<Record<string, string>> = {
  partner_code: 'Code partenaire',
  live: 'Live en ligne',
  experience: 'Expérience terrain',
}

const MOCK_CODES: Record<string, string> = {
  'code-ilanga-coffret-10': 'MTC-ILANGA-10',
  'code-habeebee-livraison': 'MTC-HABEE-SHIP',
}

export function AdvantageDetail({ advantage }: { advantage: Advantage }) {
  const [unlocked, setUnlocked] = useState(false)
  const [reserved, setReserved] = useState(false)
  const [copied, setCopied] = useState(false)

  const typeLabel = TYPE_LABELS[advantage.type] ?? null
  const mockCode = MOCK_CODES[advantage.id]
  const isSoon = advantage.status === 'soon'

  function handleCopy() {
    if (!mockCode) return
    navigator.clipboard.writeText(mockCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const ctaLabel = (() => {
    if (isSoon) return 'Bientôt disponible'
    if (advantage.type === 'partner_code') return `Débloquer · ${advantage.priceCredits.toLocaleString('fr-FR')} Credits Impact`
    return `Réserver · ${advantage.priceCredits.toLocaleString('fr-FR')} Credits Impact`
  })()

  return (
    <>
      {/* ── Scrollable content ── */}
      <div className="pb-32">

        {/* Hero image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <img
            src={advantage.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/25 to-transparent" />
          {typeLabel && (
            <div className="absolute bottom-4 left-4">
              <span className="inline-flex items-center rounded-full bg-lime-300/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-lime-300 backdrop-blur-sm">
                {typeLabel}
              </span>
            </div>
          )}
        </div>

        {/* Header block */}
        <div className="px-4 pt-5">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/35">
            {advantage.partner}
            {advantage.location && (
              <span className="text-white/20"> · {advantage.location}</span>
            )}
          </p>
          <h1 className="mt-2 text-[24px] font-black leading-tight tracking-tight text-white">
            {advantage.title}
          </h1>
          {advantage.details && (
            <p className="mt-1.5 text-[13px] font-medium text-white/50">{advantage.details}</p>
          )}
          <div className="mt-3">
            <CurrencyAmount
              kind="impactCredits"
              value={advantage.priceCredits}
              className="text-[18px] font-black"
            />
          </div>
        </div>

        {/* Soon banner */}
        {isSoon && (
          <div className="mx-4 mt-5 flex items-center gap-3 rounded-2xl border border-white/7 bg-white/[0.04] px-4 py-3">
            <Sparkles className="h-4 w-4 shrink-0 text-lime-300/70" aria-hidden="true" />
            <p className="text-sm font-bold text-white/60">
              Bientôt disponible — cet avantage sera débloqué prochainement.
            </p>
          </div>
        )}

        {/* Unlocked code display (inline, before CTA) */}
        {advantage.type === 'partner_code' && unlocked && (
          <div className="mx-4 mt-5 flex items-center justify-between rounded-2xl border border-lime-300/20 bg-lime-300/[0.07] px-5 py-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-lime-300/60">
                Code débloqué
              </p>
              <p className="mt-0.5 font-mono text-xl font-black tracking-wider text-white">
                {mockCode}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors active:bg-white/10"
              aria-label="Copier le code"
            >
              {copied ? (
                <Check className="h-4 w-4 text-lime-300" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        )}

        {/* Reserved confirmation */}
        {(advantage.type === 'live' || advantage.type === 'experience') && reserved && (
          <div className="mx-4 mt-5 rounded-2xl border border-lime-300/20 bg-lime-300/[0.07] px-5 py-5 text-center">
            <Check className="mx-auto mb-2 h-6 w-6 text-lime-300" aria-hidden="true" />
            <p className="font-black text-white">Réservation enregistrée</p>
            <p className="mt-1 text-sm font-medium text-white/50">
              Tu recevras les détails par email.
            </p>
          </div>
        )}

        {/* Separator */}
        <div className="mx-4 mt-8 border-t border-white/7" />

        {/* Sections */}
        <div className="flex flex-col gap-8 px-4 pt-8">

          {/* Ce que tu obtiens / vas vivre */}
          {advantage.whatYouGet && (
            <section>
              <h2 className="text-base font-black text-white">
                {advantage.type === 'live' || advantage.type === 'experience'
                  ? 'Ce que tu vas vivre'
                  : 'Ce que tu obtiens'}
              </h2>
              <p className="mt-2 text-[15px] font-medium leading-relaxed text-white/60">
                {advantage.whatYouGet}
              </p>
            </section>
          )}

          {/* Comment ça marche */}
          {advantage.howItWorks && advantage.howItWorks.length > 0 && (
            <section>
              <h2 className="text-base font-black text-white">Comment ça marche</h2>
              <ol className="m-0 mt-3 flex list-none flex-col gap-3 pl-0">
                {advantage.howItWorks.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime-300/15 text-[11px] font-black text-lime-300">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-[14px] font-medium leading-snug text-white/60">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Partenaire */}
          {advantage.producerSlug && (
            <section>
              <h2 className="text-base font-black text-white">Partenaire</h2>
              <Link
                href={`/producers/${advantage.producerSlug}`}
                className="mt-3 flex items-center justify-between rounded-2xl border border-white/7 bg-white/[0.045] px-4 py-3 transition-opacity active:opacity-70"
              >
                <span className="text-[15px] font-semibold text-white">{advantage.partner}</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-white/30" aria-hidden="true" />
              </Link>
            </section>
          )}

          {/* Projet lié */}
          {advantage.projectSlug && (
            <section>
              <h2 className="text-base font-black text-white">Projet lié</h2>
              <Link
                href={`/projects/${advantage.projectSlug}`}
                className="mt-3 flex items-center justify-between rounded-2xl border border-white/7 bg-white/[0.045] px-4 py-3 transition-opacity active:opacity-70"
              >
                <span className="text-[15px] font-semibold text-white">Voir le projet</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-white/30" aria-hidden="true" />
              </Link>
            </section>
          )}

          {/* Conditions */}
          {advantage.conditions && advantage.conditions.length > 0 && (
            <section>
              <h2 className="text-base font-black text-white">Conditions</h2>
              <ul className="m-0 mt-2 flex list-none flex-col gap-1 pl-0">
                {advantage.conditions.map((c, i) => (
                  <li key={i} className="text-[13px] font-medium text-white/40">
                    · {c}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Lien externe (après code débloqué) */}
          {advantage.type === 'partner_code' && unlocked && advantage.externalUrl && (
            <a
              href={advantage.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] py-4 text-[14px] font-bold text-white/70 transition-opacity active:opacity-70"
            >
              Ouvrir le site partenaire
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          )}

        </div>
      </div>

      {/* ── Sticky CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-[#0B0F15]/88 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-lg">
        {isSoon ? (
          <div className="flex w-full cursor-not-allowed items-center justify-center rounded-2xl bg-white/5 py-4 text-[15px] font-black text-white/25">
            Bientôt disponible
          </div>
        ) : advantage.type === 'partner_code' && !unlocked ? (
          <button
            onClick={() => setUnlocked(true)}
            className="flex w-full items-center justify-center rounded-2xl bg-lime-300 py-4 text-[15px] font-black text-[#0B0F15] transition-opacity active:opacity-80"
          >
            {ctaLabel}
          </button>
        ) : advantage.type === 'partner_code' && unlocked ? (
          <div className="flex w-full items-center justify-center rounded-2xl bg-white/5 py-4 text-[15px] font-black text-lime-300">
            <Check className="mr-2 h-4 w-4" aria-hidden="true" />
            Code débloqué
          </div>
        ) : (advantage.type === 'live' || advantage.type === 'experience') && !reserved ? (
          <button
            onClick={() => setReserved(true)}
            className="flex w-full items-center justify-center rounded-2xl bg-lime-300 py-4 text-[15px] font-black text-[#0B0F15] transition-opacity active:opacity-80"
          >
            {ctaLabel}
          </button>
        ) : (
          <div className="flex w-full items-center justify-center rounded-2xl bg-white/5 py-4 text-[15px] font-black text-lime-300">
            <Check className="mr-2 h-4 w-4" aria-hidden="true" />
            Réservation enregistrée
          </div>
        )}
      </div>
    </>
  )
}
