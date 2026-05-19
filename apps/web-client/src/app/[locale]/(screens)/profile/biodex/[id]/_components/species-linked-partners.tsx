'use client'
import { ChevronRight } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'
import { resolveLocationDisplay } from '@/lib/location'

export type SpeciesLinkedPartnerData = {
  slug: string
  name: string
  tagline: string | null
  addressCity: string | null
  addressCountryCode: string | null
  projectsCount: number
  relationship: string | null
  imageUrl: string | null
}

interface SpeciesLinkedPartnersProps {
  partners: SpeciesLinkedPartnerData[]
}

export function SpeciesLinkedPartners({ partners }: SpeciesLinkedPartnersProps) {
  const locale = useLocale()
  if (partners.length === 0) return null

  return (
    <section className='mx-5'>
      <p className='mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-white/35'>
        Partenaires liés à cette espèce
      </p>
      <div className='space-y-2'>
        {partners.map((partner) => (
          <PartnerCard key={partner.slug} partner={partner} locale={locale} />
        ))}
      </div>
      <p className='mt-3 text-center text-[11px] leading-relaxed text-white/25'>
        Organisations associées aux projets où cette espèce apparaît dans l&apos;app.
      </p>
    </section>
  )
}

function PartnerCard({ partner, locale }: { partner: SpeciesLinkedPartnerData; locale: string }) {
  const location = resolveLocationDisplay(partner.addressCountryCode, partner.addressCity, locale)
  const imageUrl = sanitizeImageUrl(partner.imageUrl)
  const projectsLabel =
    partner.projectsCount === 1 ? '1 projet documenté' : `${partner.projectsCount} projets documentés`

  return (
    <Link
      href={`/producers/${partner.slug}`}
      className='flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.045] px-4 py-3 transition-colors active:bg-white/[0.07]'
    >
      <div className='h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white/5'>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={partner.name}
            className='h-full w-full object-cover'
            loading='lazy'
          />
        ) : (
          <div className='h-full w-full bg-white/5' aria-hidden='true' />
        )}
      </div>

      <div className='min-w-0 flex-1'>
        <p className='text-sm font-black text-white/90'>{partner.name}</p>
        {partner.tagline && (
          <p className='line-clamp-1 text-xs text-white/50'>{partner.tagline}</p>
        )}
        <div className='mt-1 flex items-center gap-2'>
          {location && (
            <span className='text-[11px] text-white/35'>
              {location.flag} {location.label}
            </span>
          )}
          {location && partner.projectsCount > 0 && (
            <span className='text-[11px] text-white/20'>·</span>
          )}
          {partner.projectsCount > 0 && (
            <span className='text-[11px] text-white/35'>{projectsLabel}</span>
          )}
        </div>
      </div>

      <ChevronRight className='h-4 w-4 shrink-0 text-white/20' aria-hidden='true' />
    </Link>
  )
}
