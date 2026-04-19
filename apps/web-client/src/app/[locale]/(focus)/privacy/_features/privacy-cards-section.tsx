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
      <div className="col-span-2 flex flex-col items-start gap-4 rounded-3xl border border-white/5 bg-[#1A1F26] p-6 shadow-sm">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
          <Fingerprint className="h-5 w-5 text-lime-400" />
        </div>
        <div>
          <h3 className="mb-2 text-lg font-bold leading-tight text-white">
            {dataOwnership.title}
          </h3>
          <p className="text-sm font-light leading-relaxed text-gray-400">
            {dataOwnership.description}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>{dataOwnership.guarantee}</span>
        </div>
      </div>

      {/* CARTE 2 — COLLECTE MINIMALE (carré) */}
      <div className="col-span-1 flex aspect-square flex-col justify-between rounded-[24px] border border-white/5 bg-[#1A1F26] p-5 shadow-sm">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
          <Server className="h-5 w-5 text-lime-400" />
        </div>
        <div>
          <h3 className="mb-1 text-base font-bold leading-tight text-white">
            {minimalCollection.title}
          </h3>
          <p className="line-clamp-3 text-xs leading-relaxed text-gray-400">
            {minimalCollection.description}
          </p>
        </div>
      </div>

      {/* CARTE 3 — SÉCURITÉ RENFORCÉE (carré) */}
      <div className="col-span-1 flex aspect-square flex-col justify-between rounded-[24px] border border-white/5 bg-[#1A1F26] p-5 shadow-sm">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
          <Lock className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="mb-1 text-base font-bold leading-tight text-white">
            {security.title}
          </h3>
          <p className="line-clamp-3 text-xs leading-relaxed text-gray-400">
            {security.description}
          </p>
        </div>
      </div>

      {/* CARTE 4 — CTA (fullwidth, centré) */}
      <div className="col-span-2 mt-2 flex flex-col items-center rounded-3xl border border-white/5 bg-[#1A1F26] p-6 text-center shadow-sm">
        <h3 className="mb-2 text-lg font-bold text-white">{contact.title}</h3>
        <p className="mb-5 text-sm font-light leading-relaxed text-gray-400">
          {contact.description}
        </p>
        <Link
          href="/contact"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-lime-400 text-base font-black text-[#0B0F15] shadow-[0_0_20px_rgba(132,204,22,0.15)] transition-all active:scale-[0.98]"
        >
          {contact.cta}
        </Link>
      </div>
    </div>
  )
}
