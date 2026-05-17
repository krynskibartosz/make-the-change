'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Hero immersif pour la page producteur.
 * 
 * Architecture:
 * - Cover image full-width premium
 * - Portrait partenaire 96px avec bordure subtile
 * - Double localisation (terrain + structure)
 * - Tagline éditoriale
 * 
 * Mobile-first, gradient doux, rythme respirant.
 */

import { getRandomProducerImage } from '@/lib/placeholder-images'
import type { ProducerLocation, VisualAssets, EditorialIdentity } from '@/app/[locale]/(site)/producers/_features/mock-producers'

type ProducerHeroProps = {
  name: string
  tagline?: string
  partnerType?: string
  locations?: ProducerLocation
  images: string[]
  visualAssets?: VisualAssets
  editorialIdentity?: EditorialIdentity
}

export function ProducerHero({
  name,
  tagline,
  partnerType,
  locations,
  images,
  visualAssets,
  editorialIdentity,
}: ProducerHeroProps) {
  // ── Assets intelligents avec fallbacks (Phase 1) ──
  const cacheBust = process.env.NODE_ENV === 'development' ? `?v=${Date.now()}` : ''
  const coverImage = (visualAssets?.hero || images[0] || getRandomProducerImage(name.length)) + cacheBust
  const portraitImage = (visualAssets?.portrait || images[1] || images[0] || getRandomProducerImage(name.length + 1)) + cacheBust
  
  // ── Tagline priorité : editorialIdentity > tagline > fallback ──
  const displayTagline = editorialIdentity?.tagline || tagline

  // ── Double localisation enrichie ──
  const fieldLocation = locations?.fieldDetail 
    ? `${locations.field} · ${locations.fieldDetail}`
    : locations?.field
  
  const europeanLocation = locations?.europeanDetail
    ? `${locations.european} · ${locations.europeanDetail}`
    : locations?.european
    
  // ── Partner type priorité ──
  const displayPartnerType = editorialIdentity?.partnerType || partnerType

  return (
    <div className="relative">
      {/* ── Cover Image ── */}
      <div className="relative h-[360px] w-full overflow-hidden bg-[#1A1F26] sm:h-[420px]">
        <img 
          src={coverImage} 
          alt={name} 
          className="h-full w-full object-cover" 
        />
        {/* Gradient profond pour lisibilité texte */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/40 to-[#0B0F15]/10" />
      </div>

      {/* ── Identity Header ── */}
      <div className="relative px-4">
        {/* Portrait - 80px plus compact */}
        <div className="absolute -top-10 left-4 z-10 h-20 w-20 rounded-full border-2 border-[#0B0F15] bg-[#0B0F15] p-0.5 shadow-xl">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white/5">
            <img 
              src={portraitImage} 
              alt={name} 
              className="h-full w-full object-cover" 
            />
          </div>
        </div>

        {/* Spacer réduit */}
        <div className="h-12" />

        {/* Nom et tagline compacte */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-[26px] font-black leading-tight tracking-tight text-white">
              {name}
            </h1>
            
            {displayTagline && (
              <p className="mt-1.5 text-[14px] font-medium text-white/60 leading-snug">
                {displayTagline}
              </p>
            )}

            {/* Localisations fusionnées */}
            {(fieldLocation || europeanLocation) && (
              <div className="mt-2 flex items-center gap-2 text-xs">
                {fieldLocation && (
                  <span className="flex items-center gap-1 text-white/50">
                    <span>🇲🇬</span>
                    <span className="uppercase tracking-wide">{locations?.field}</span>
                  </span>
                )}
                {europeanLocation && (
                  <span className="flex items-center gap-1 text-white/40">
                    <span>🇧🇪</span>
                    <span>{locations?.european}</span>
                  </span>
                )}
              </div>
            )}

            {/* Tag type partenaire compact */}
            {displayPartnerType && (
              <p className="mt-2 inline-flex rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/70">
                {displayPartnerType}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
