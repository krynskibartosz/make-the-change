'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Hero immersif pour la page producteur — entièrement générique.
 *
 * Architecture:
 * - Cover image full-width premium
 * - Portrait partenaire avec bordure subtile
 * - Double localisation dynamique (terrain + structure, drapeaux auto)
 * - Statement émotionnel depuis editorialIdentity.emotionalStatement (optionnel)
 * - Trust line depuis prop (foundedYear + certification, calculé dans producer-details)
 *
 * Mobile-first, gradient doux, rythme respirant.
 */

import { getRandomProducerImage } from '@/lib/placeholder-images'
import type { ProducerLocation, VisualAssets, EditorialIdentity } from '@/app/[locale]/(site)/producers/_features/mock-producers'

const COUNTRY_FLAGS: Record<string, string> = {
  'Madagascar': '🇲🇬',
  'Belgique': '🇧🇪',
  'France': '🇫🇷',
  'Italie': '🇮🇹',
  'Sardaigne': '🇮🇹',
  'Île Maurice': '🇲🇺',
  'La Réunion': '🇷🇪',
  'Pays-Bas': '🇳🇱',
  'Royaume-Uni': '🇬🇧',
}

function getCountryFlag(countryName?: string): string {
  if (!countryName) return ''
  const base = countryName.split(' · ')[0].split(',')[0].trim()
  return COUNTRY_FLAGS[base] ?? ''
}

type ProducerHeroProps = {
  name: string
  tagline?: string
  partnerType?: string
  locations?: ProducerLocation
  images: string[]
  visualAssets?: VisualAssets
  editorialIdentity?: EditorialIdentity
  trustLine?: string
}

export function ProducerHero({
  name,
  tagline,
  partnerType,
  locations,
  images,
  visualAssets,
  editorialIdentity,
  trustLine,
}: ProducerHeroProps) {
  const coverImage = visualAssets?.hero || images[0] || getRandomProducerImage(name.length)
  const portraitImage = visualAssets?.portrait || images[1] || images[0] || getRandomProducerImage(name.length + 1)

  const displayTagline = editorialIdentity?.tagline || tagline
  const emotionalStatement = editorialIdentity?.emotionalStatement
  const displayPartnerType = editorialIdentity?.partnerType || partnerType

  const fieldLocation = locations?.fieldDetail
    ? `${locations.field} · ${locations.fieldDetail}`
    : locations?.field

  const europeanLocation = locations?.europeanDetail
    ? `${locations.european} · ${locations.europeanDetail}`
    : locations?.european

  // N'affiche la seconde localisation que si le pays est différent
  const showEuropean = europeanLocation && locations?.european !== locations?.field

  return (
    <div className="relative">
      {/* ── Cover Image ── */}
      <div className="relative h-[360px] w-full overflow-hidden bg-[#1A1F26] sm:h-[420px]">
        <img
          src={coverImage}
          alt={name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0B0F15] to-transparent" />
      </div>

      {/* ── Identity Header ── */}
      <div className="relative px-4">
        {/* Portrait signature */}
        <div className="absolute -top-[30px] left-4 z-10 h-[60px] w-[60px] rounded-full border border-white/[0.05] bg-transparent shadow-[0_6px_20px_rgba(0,0,0,0.25)]">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white/[0.03]">
            <img
              src={portraitImage}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="h-10" />

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-[26px] font-black leading-tight tracking-tight text-white">
              {name}
            </h1>

            {displayTagline && (
              <p className="mt-1 text-[13px] font-medium text-white/55 leading-snug">
                {displayTagline}
              </p>
            )}

            {emotionalStatement && (
              <p className="mt-2 max-w-xs text-[13px] leading-snug text-white/70 italic">
                {emotionalStatement}
              </p>
            )}

            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              {fieldLocation && (
                <span className="inline-flex items-center gap-1 text-[11px] text-white/60">
                  {getCountryFlag(locations?.field) && (
                    <span>{getCountryFlag(locations?.field)}</span>
                  )}
                  <span>{fieldLocation}</span>
                </span>
              )}
              {showEuropean && (
                <span className="inline-flex items-center gap-1 text-[11px] text-white/45">
                  {getCountryFlag(locations?.european) && (
                    <span>{getCountryFlag(locations?.european)}</span>
                  )}
                  <span>{europeanLocation}</span>
                </span>
              )}
            </div>

            {trustLine && (
              <p className="mt-1.5 text-[11px] font-medium text-white/60">
                {trustLine}
              </p>
            )}

            {displayPartnerType && (
              <p className="mt-1 text-[10px] text-white/35">
                {displayPartnerType}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
