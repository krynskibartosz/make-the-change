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

import { MapPin } from 'lucide-react'
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
  const coverImage = visualAssets?.hero || images[0] || getRandomProducerImage(name.length)
  const portraitImage = visualAssets?.portrait || images[1] || images[0] || getRandomProducerImage(name.length + 1)
  
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
      <div className="relative h-64 w-full overflow-hidden bg-[#1A1F26]">
        <img 
          src={coverImage} 
          alt={name} 
          className="h-full w-full object-cover" 
        />
        {/* Gradient plus doux, commence plus bas */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/20 to-transparent" />
      </div>

      {/* ── Identity Header ── */}
      <div className="relative px-5">
        {/* Portrait - plus grand (96px) avec bordure subtile */}
        <div className="absolute -top-14 left-5 z-10 h-24 w-24 rounded-[2.5rem] border-[3px] border-[#0B0F15] bg-[#0B0F15] p-1 shadow-2xl">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[2rem] bg-white/5">
            <img 
              src={portraitImage} 
              alt={name} 
              className="h-full w-full object-cover" 
            />
          </div>
        </div>

        {/* Spacer pour le portrait */}
        <div className="h-14" />

        {/* Nom et tagline */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-[28px] font-black leading-none tracking-tighter text-white">
              {name}
            </h1>
            
            {displayTagline && (
              <p className="mt-2 text-[15px] font-medium text-white/70 leading-snug">
                {displayTagline}
              </p>
            )}

            {/* Double localisation */}
            {(fieldLocation || europeanLocation) && (
              <div className="mt-3 flex flex-col gap-1">
                {fieldLocation && (
                  <p className="flex items-center gap-1.5 text-sm font-bold text-white/50">
                    <span className="text-base">🇲🇬</span>
                    <span className="uppercase tracking-wider">{fieldLocation}</span>
                  </p>
                )}
                {europeanLocation && (
                  <p className="flex items-center gap-1.5 text-xs font-medium text-white/40">
                    <span className="text-sm">🇧🇪</span>
                    <span>Structure partenaire basée en {europeanLocation}</span>
                  </p>
                )}
              </div>
            )}

            {/* Tag type partenaire */}
            {displayPartnerType && (
              <p className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white/60">
                {displayPartnerType}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
