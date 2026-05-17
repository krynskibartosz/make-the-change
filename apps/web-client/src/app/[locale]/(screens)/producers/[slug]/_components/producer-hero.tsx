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
      <div className="relative h-[360px] w-full overflow-hidden bg-[#1A1F26] sm:h-[420px]">
        <img 
          src={coverImage} 
          alt={name} 
          className="h-full w-full object-cover" 
        />
        {/* Gradient: centre vivant, bas lisible */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0B0F15] to-transparent" />
      </div>

      {/* ── Identity Header ── */}
      <div className="relative px-4">
        {/* Portrait signature — plus petit, contour minimal */}
        <div className="absolute -top-[34px] left-4 z-10 h-[68px] w-[68px] rounded-full border border-white/[0.06] bg-transparent shadow-[0_10px_32px_rgba(0,0,0,0.3)]">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white/[0.03]">
            <img 
              src={portraitImage} 
              alt={name} 
              className="h-full w-full object-cover" 
            />
          </div>
        </div>

        {/* Spacer portrait signature */}
        <div className="h-12" />

        {/* Nom et tagline compacte */}
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

            {/* Statement émotionnel — mémorisable */}
            <p className="mt-2 max-w-xs text-[13px] leading-snug text-white/70 italic">
              Entre biodiversité, producteurs et savoir-faire malgaches.
            </p>

            {/* Confiance prioritaire — ancienneté + certif + pays */}
            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              {fieldLocation && (
                <span className="inline-flex items-center gap-1 text-[11px] text-white/60">
                  <span>🇲🇬</span>
                  <span>Madagascar</span>
                </span>
              )}
              {europeanLocation && (
                <span className="inline-flex items-center gap-1 text-[11px] text-white/45">
                  <span>🇧🇪</span>
                  <span>Belgique</span>
                </span>
              )}
            </div>

            {/* Trust line — prioritaire visuellement */}
            <p className="mt-1.5 text-[11px] font-medium text-white/60">
              Depuis 2017 • Certification Ecocert
            </p>

            {/* Badge partenaire — discret, secondaire */}
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
