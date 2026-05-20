'use client'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MobileSheet } from '@/components/ui/mobile-sheet'
import type { SpeciesContext } from '@/types/species'

// ── Helpers ─────────────────────────────────────────────────────────────────

function isSimpleHabitat(habitat: string): boolean {
  return !habitat.includes('(Z')
}

// Strip parenthetical detail for pill display: "Varroa destructor (2010)" → "Varroa destructor"
function simplifyThreat(threat: string): string {
  const idx = threat.indexOf(' (')
  return idx > 0 ? threat.slice(0, idx) : threat
}

// ── AccordionItem ────────────────────────────────────────────────────────────

interface AccordionItemProps {
  title: string
  number: string
  children: ReactNode
  defaultOpen?: boolean
}

function AccordionItem({ title, number, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className='border-b border-white/8 last:border-0'>
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='flex w-full items-center gap-3 py-4 text-left transition-opacity active:opacity-70'
        aria-expanded={open}
      >
        <span className='text-[11px] font-black tabular-nums text-white/25'>{number}</span>
        <span className='flex-1 text-sm font-bold text-white/80'>{title}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-white/30 transition-transform duration-200',
            open && 'rotate-180',
          )}
          aria-hidden='true'
        />
      </button>
      {open && <div className='pb-5'>{children}</div>}
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

interface SpeciesKnowledgeSectionProps {
  species: SpeciesContext
}

export function SpeciesKnowledgeSection({ species }: SpeciesKnowledgeSectionProps) {
  const [habitatSheetOpen, setHabitatSheetOpen] = useState(false)
  const [threatsSheetOpen, setThreatsSheetOpen] = useState(false)

  const allHabitats = species.habitat ?? []
  const simpleHabitats = allHabitats.filter(isSimpleHabitat)
  const technicalHabitats = allHabitats.filter((h) => !isSimpleHabitat(h))
  const hasHabitat = allHabitats.length > 0

  const allThreats = species.threats ?? []
  const hasThreats = allThreats.length > 0

  return (
    <>
      <section className='mx-5'>
        <p className='mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-white/35'>
          Explorer son rôle
        </p>
        <div className='px-0'>

          {/* 01 – Habitat */}
          <AccordionItem title='Habitat' number='01' defaultOpen>
            {hasHabitat ? (
              <div className='space-y-3'>
                {simpleHabitats.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {simpleHabitats.map((h, i) => (
                      <span
                        key={i}
                        className='rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70'
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                )}
                {technicalHabitats.length > 0 && (
                  <button
                    type='button'
                    onClick={() => setHabitatSheetOpen(true)}
                    className='flex items-center gap-1.5 text-xs font-semibold text-white/40 transition-colors active:text-white/60'
                  >
                    Zones documentées
                    <ChevronRight className='h-3 w-3' aria-hidden='true' />
                  </button>
                )}
              </div>
            ) : (
              <p className='text-xs text-white/35'>Habitat à documenter avec le partenaire.</p>
            )}
          </AccordionItem>

          {/* 02 – Relations dans le vivant */}
          <AccordionItem title='Relations dans le vivant' number='02'>
            <p className='text-xs text-white/35'>
              Plantes mellifères, pollinisateurs associés, cultures locales, prédateurs — à documenter avec les données terrain.
            </p>
          </AccordionItem>

          {/* 03 – Menaces & fragilités */}
          <AccordionItem title='Menaces & fragilités' number='03'>
            {hasThreats ? (
              <div className='space-y-3'>
                <div className='flex flex-wrap gap-2'>
                  {allThreats.map((t, i) => (
                    <div
                      key={i}
                      className='rounded-full border border-orange-500/20 bg-orange-500/8 px-3 py-1.5 text-xs text-white/70'
                    >
                      {simplifyThreat(t)}
                    </div>
                  ))}
                </div>
                <button
                  type='button'
                  onClick={() => setThreatsSheetOpen(true)}
                  className='flex items-center gap-1.5 text-xs font-semibold text-white/40 transition-colors active:text-white/60'
                >
                  Voir les détails
                  <ChevronRight className='h-3 w-3' aria-hidden='true' />
                </button>
              </div>
            ) : (
              <p className='text-xs text-white/35'>
                Certaines pressions peuvent fragiliser cette espèce. Les données locales sont à
                documenter avec le partenaire.
              </p>
            )}
          </AccordionItem>

        </div>
      </section>

      {/* Bottom sheet — Zones documentées */}
      <MobileSheet
        isOpen={habitatSheetOpen}
        onClose={() => setHabitatSheetOpen(false)}
        title='Zones documentées'
      >
        <div className='space-y-4 pb-2 pt-1'>
          <div className='space-y-2'>
            {technicalHabitats.map((h, i) => (
              <div
                key={i}
                className='rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2.5 text-sm text-white/65'
              >
                {h}
              </div>
            ))}
          </div>
          <p className='text-xs leading-relaxed text-white/30'>
            Ces zones décrivent des contextes écologiques possibles. Les données locales du projet
            restent à documenter avec le partenaire.
          </p>
        </div>
      </MobileSheet>

      {/* Bottom sheet — Détails menaces */}
      <MobileSheet
        isOpen={threatsSheetOpen}
        onClose={() => setThreatsSheetOpen(false)}
        title='Menaces & fragilités'
      >
        <div className='space-y-4 pb-2 pt-1'>
          <div className='space-y-2'>
            {allThreats.map((t, i) => (
              <div
                key={i}
                className='rounded-xl border border-orange-500/15 bg-orange-500/5 px-3 py-2.5 text-sm text-white/65'
              >
                {t}
              </div>
            ))}
          </div>
          <p className='text-xs leading-relaxed text-white/30'>
            Les niveaux de pression locaux doivent être confirmés avec le partenaire ou une source
            scientifique identifiable. Ces données sont indicatives.
          </p>
        </div>
      </MobileSheet>
    </>
  )
}
