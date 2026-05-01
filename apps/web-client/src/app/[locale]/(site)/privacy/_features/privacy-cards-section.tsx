import { CheckCircle2, Fingerprint, Lock, Server } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { PrivacyCardsProps } from './privacy.types'

export function PrivacyCardsSection({
  minimalCollection,
  dataOwnership,
  security,
  contact,
}: PrivacyCardsProps) {
  return (
    <div className="relative z-10 grid grid-cols-2 gap-3 px-6 sm:gap-4">
      {/* CARTE 1 — LA PROMESSE (fullwidth) */}
      <div className="col-span-2 flex flex-col items-start gap-4 rounded-3xl border border-white/5 bg-[#1A1F26] p-6 transition-colors hover:bg-white/[0.02]">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-lime-400/20 bg-lime-400/10">
          <Fingerprint className="h-5 w-5 text-lime-400" />
        </div>
        <div>
          <h3 className="mb-2 text-lg font-bold leading-tight text-white">
            {dataOwnership.title}
          </h3>
          <p className="text-pretty text-sm font-light leading-relaxed text-gray-400">
            {dataOwnership.description}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>{dataOwnership.guarantee}</span>
        </div>
      </div>

      {/* CARTE 2 — COLLECTE MINIMALE */}
      <div className="col-span-1 flex h-full flex-col gap-3 rounded-3xl border border-white/5 bg-[#1A1F26] p-5 transition-colors hover:bg-white/[0.02]">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-lime-400/20 bg-lime-400/10">
          <Server className="h-5 w-5 text-lime-400" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-bold leading-snug text-white">
            {minimalCollection.title}
          </h3>
          <p className="text-pretty text-[11px] leading-relaxed text-gray-400">
            {minimalCollection.description}
          </p>
        </div>
      </div>

      {/* CARTE 3 — SÉCURITÉ RENFORCÉE */}
      <div className="col-span-1 flex h-full flex-col gap-3 rounded-3xl border border-white/5 bg-[#1A1F26] p-5 transition-colors hover:bg-white/[0.02]">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-lime-400/20 bg-lime-400/10">
          <Lock className="h-5 w-5 text-lime-400" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-bold leading-snug text-white">
            {security.title}
          </h3>
          <p className="text-pretty text-[11px] leading-relaxed text-gray-400">
            {security.description}
          </p>
        </div>
      </div>

      {/* CARTE 4 — CTA (fullwidth, centré) */}
      <div className="relative col-span-2 mt-2 flex flex-col items-center overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-b from-[#1A1F26] to-[#0B0F15] p-6 text-center">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-full bg-white/[0.04] blur-2xl" />
        <div className="relative z-10 flex flex-col gap-1 mb-4">
          <h3 className="text-lg font-bold text-white">{contact.title}</h3>
          <p className="mx-auto max-w-[260px] text-xs leading-relaxed text-gray-400">
            {contact.description}
          </p>
        </div>
        <Link
          href="/contact"
          className="relative z-10 flex h-12 w-full items-center justify-center rounded-2xl bg-lime-400 text-base font-black text-[#0B0F15] shadow-[0_0_20px_rgba(132,204,22,0.15)] transition-all active:scale-[0.98]"
        >
          {contact.cta}
        </Link>
      </div>
    </div>
  )
}
