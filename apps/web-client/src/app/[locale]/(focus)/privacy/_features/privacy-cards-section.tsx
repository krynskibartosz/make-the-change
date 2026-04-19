import { CheckCircle2, Fingerprint, Lock, Mail, Server } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { PrivacyCardsProps } from './privacy.types'

export function PrivacyCardsSection({
  minimalCollection,
  dataOwnership,
  security,
  contact,
}: PrivacyCardsProps) {
  return (
    <div className="relative z-10 px-6 grid grid-cols-1 gap-3 md:grid-cols-3">
      {/* Card 1: Collecte minimale */}
      <div className="md:col-span-2 rounded-3xl border border-white/5 bg-[#1A1F26] p-6 shadow-sm">
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
          <Server className="h-5 w-5 text-lime-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{minimalCollection.title}</h3>
        <p className="text-sm font-light leading-relaxed text-gray-400">
          {minimalCollection.description}
        </p>
      </div>

      {/* Card 2: Vos données vous appartiennent */}
      <div className="md:col-span-1 md:row-span-2 rounded-3xl border border-white/5 bg-[#1A1F26] p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
            <Fingerprint className="h-5 w-5 text-lime-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{dataOwnership.title}</h3>
          <p className="text-sm font-light leading-relaxed text-gray-400 mb-6">
            {dataOwnership.description}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>{dataOwnership.guarantee}</span>
        </div>
      </div>

      {/* Card 3: Sécurité renforcée */}
      <div className="md:col-span-1 rounded-3xl border border-white/5 bg-[#1A1F26] p-6 shadow-sm">
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
          <Lock className="h-5 w-5 text-emerald-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{security.title}</h3>
        <p className="text-sm font-light leading-relaxed text-gray-400">
          {security.description}
        </p>
      </div>

      {/* Card 4: Contact */}
      <div className="md:col-span-1 rounded-3xl border border-white/5 bg-[#1A1F26] p-6 shadow-sm flex flex-col">
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
          <Mail className="h-5 w-5 text-lime-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{contact.title}</h3>
        <p className="text-sm font-light leading-relaxed text-gray-400">{contact.description}</p>
        <Link
          href="/contact"
          className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-lime-400 text-base font-black text-[#0B0F15] shadow-[0_0_20px_rgba(132,204,22,0.15)] transition-all active:scale-[0.98]"
        >
          {contact.cta}
        </Link>
      </div>
    </div>
  )
}
