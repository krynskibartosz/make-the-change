'use client'

import { useState } from 'react'
import { ArrowLeft, Check, ChevronRight, Copy, ExternalLink, Sparkles } from 'lucide-react'
import { Link, useRouter } from '@/i18n/navigation'
import { CurrencyAmount } from '@/components/currency'
import type { Advantage } from '@/app/[locale]/(screens)/advantages/_features/mock-advantages'

const TYPE_LABELS: Partial<Record<string, string>> = {
  partner_code: 'Code partenaire',
  content: 'Contenu terrain',
  experience: 'Expérience terrain',
}

const MOCK_CODES: Record<string, string> = {
  'code-ilanga-coffret-10': 'MTC-ILANGA-10',
  'code-habeebee-livraison': 'MTC-HABEE-SHIP',
}

type Props = {
  advantage: Advantage
  /** Affiche un bouton retour flottant sur l'image — pour les pages directes sans header */
  showFloatingBack?: boolean
}

export function AdvantageDetail({ advantage, showFloatingBack }: Props) {
  const router = useRouter()
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

  const ctaLabel = isSoon
    ? 'Bientôt disponible'
    : advantage.type === 'partner_code' || advantage.type === 'content'
      ? `Débloquer · ${advantage.priceCredits.toLocaleString('fr-FR')} Credits Impact`
      : `Réserver · ${advantage.priceCredits.toLocaleString('fr-FR')} Credits Impact`

  const isActioned =
    advantage.type === 'partner_code' || advantage.type === 'content' ? unlocked : reserved

  return (
    <div className="relative flex h-full flex-col">

      {/* ── Glow ambient ── */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -right-20 -top-24 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(163, 230, 53, 0.07)' }}
        />
        <div
          className="absolute -bottom-20 -left-24 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(163, 230, 53, 0.09)' }}
        />
      </div>

      {/* ── Zone scrollable ── */}
      <div className="relative flex-1 overflow-y-auto overscroll-contain pb-4">

        {/* Bouton retour flottant (pages directes) */}
        {showFloatingBack && (
          <div className="fixed left-4 top-[max(1rem,env(safe-area-inset-top))] z-50">
            <button
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/45 backdrop-blur-sm transition-colors active:bg-black/60"
              aria-label="Retour"
            >
              <ArrowLeft className="h-5 w-5 text-white" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Hero image pleine largeur */}
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
          <img
            src={advantage.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/20 to-transparent" />
          {typeLabel && (
            <div className="absolute bottom-4 left-4">
              <span className="inline-flex items-center rounded-full bg-lime-300/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-lime-300 backdrop-blur-sm">
                {typeLabel}
              </span>
            </div>
          )}
        </div>

        {/* Bloc identité */}
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

        {/* Bannière bientôt */}
        {isSoon && (
          <div className="mx-4 mt-5 flex items-center gap-3 rounded-2xl border border-white/7 bg-white/[0.04] px-4 py-3">
            <Sparkles className="h-4 w-4 shrink-0 text-lime-300/70" aria-hidden="true" />
            <p className="text-sm font-bold text-white/60">
              Bientôt disponible — cet avantage sera débloqué prochainement.
            </p>
          </div>
        )}

        {/* Code débloqué */}
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

        {/* Réservation confirmée */}
        {advantage.type === 'experience' && reserved && (
          <div className="mx-4 mt-5 rounded-2xl border border-lime-300/20 bg-lime-300/[0.07] px-5 py-5 text-center">
            <Check className="mx-auto mb-2 h-6 w-6 text-lime-300" aria-hidden="true" />
            <p className="font-black text-white">Réservation enregistrée</p>
            <p className="mt-1 text-sm font-medium text-white/50">
              Tu recevras les détails par email.
            </p>
          </div>
        )}

        {/* ── Rangée Partenaire/Producteur (style product-quick-view) ── */}
        {advantage.producerSlug && (
          <Link
            href={`/producers/${advantage.producerSlug}`}
            className="group mt-6 flex items-center gap-3 border-y border-white/5 px-4 py-3 transition-opacity active:opacity-70"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-300/10 text-xs font-black text-lime-300">
              {advantage.partner[0]?.toUpperCase() ?? 'P'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                Partenaire
              </p>
              <p className="truncate text-sm font-semibold text-white/80 transition-colors group-hover:text-white">
                {advantage.partner}
                {advantage.location ? ` · ${advantage.location}` : ''}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-white/20 transition-colors group-hover:text-white/50" aria-hidden="true" />
          </Link>
        )}

        {/* ── Sections ── */}
        <div className="flex flex-col gap-8 px-4 pt-8">

          {advantage.whatYouGet && (
            <section>
              <h2 className="text-base font-black text-white">
                {advantage.type === 'experience'
                  ? 'Ce que tu vas vivre'
                  : advantage.type === 'content'
                    ? 'Ce que tu vas découvrir'
                    : 'Ce que tu obtiens'}
              </h2>
              <p className="mt-2 text-[15px] font-medium leading-relaxed text-white/60">
                {advantage.whatYouGet}
              </p>
            </section>
          )}

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

          {advantage.projectSlug && (
            <section>
              <h2 className="text-base font-black text-white">Projet lié</h2>
              <Link
                href={`/projects/${advantage.projectSlug}`}
                className="mt-3 flex items-center justify-between rounded-2xl border border-white/7 bg-white/[0.045] px-4 py-3 transition-opacity active:opacity-70"
              >
                <span className="text-[15px] font-semibold text-white">Voir le projet</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-white/30" aria-hidden="true" />
              </Link>
            </section>
          )}

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

      {/* ── CTA sticky ── */}
      <div className="relative shrink-0">
        <div className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-t from-[#0B0F15] to-transparent" />
        <div className="border-t border-white/5 bg-[#0B0F15]/60 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
          {isSoon ? (
            <div className="flex w-full cursor-not-allowed items-center justify-center rounded-2xl bg-white/5 py-4 text-[15px] font-black text-white/25">
              Bientôt disponible
            </div>
          ) : isActioned ? (
            <div className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/5 py-4 text-[15px] font-black text-lime-300">
              <Check className="h-4 w-4" aria-hidden="true" />
              {advantage.type === 'partner_code' ? 'Code débloqué' : 'Réservation enregistrée'}
            </div>
          ) : (
            <button
              onClick={() =>
                advantage.type === 'partner_code' || advantage.type === 'content'
                  ? setUnlocked(true)
                  : setReserved(true)
              }
              className="flex w-full items-center justify-center rounded-2xl bg-lime-300 py-4 text-[15px] font-black text-[#0B0F15] transition-opacity active:opacity-80"
            >
              {ctaLabel}
            </button>
          )}
        </div>
      </div>

    </div>
  )
}
