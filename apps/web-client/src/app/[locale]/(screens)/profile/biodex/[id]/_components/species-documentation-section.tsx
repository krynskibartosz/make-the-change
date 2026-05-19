'use client'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { Info } from 'lucide-react'
import { MobileSheet } from '@/components/ui/mobile-sheet'
import type { SpeciesContext } from '@/types/species'

const IUCN_LABELS: Record<string, string> = {
  CR: 'En danger critique',
  EN: 'En danger',
  VU: 'Vulnérable',
  NT: 'Quasi menacé',
  LC: 'Préoccupation mineure',
  DD: 'Données locales limitées',
  EW: 'Éteint à l\'état sauvage',
  EX: 'Éteint',
}

interface DocCardProps {
  label: string
  value: string
  sheetTitle?: string
  sheetContent?: ReactNode
}

function DocCard({ label, value, sheetTitle, sheetContent }: DocCardProps) {
  const [open, setOpen] = useState(false)
  const isClickable = !!sheetContent

  return (
    <>
      <div
        className={`flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 ${
          isClickable ? 'cursor-pointer transition-colors active:bg-white/[0.07]' : ''
        }`}
        onClick={isClickable ? () => setOpen(true) : undefined}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onKeyDown={isClickable ? (e) => e.key === 'Enter' && setOpen(true) : undefined}
      >
        <div>
          <p className='text-[10px] font-black uppercase tracking-[0.14em] text-white/35'>{label}</p>
          <p className='mt-0.5 text-sm font-semibold text-white/75'>{value}</p>
        </div>
        {isClickable && <Info className='h-4 w-4 shrink-0 text-white/25' aria-hidden='true' />}
      </div>

      {isClickable && sheetTitle && (
        <MobileSheet isOpen={open} onClose={() => setOpen(false)} title={sheetTitle}>
          <div className='pb-2 pt-1 text-sm leading-relaxed text-white/60'>{sheetContent}</div>
        </MobileSheet>
      )}
    </>
  )
}

interface SpeciesDocumentationSectionProps {
  species: SpeciesContext
}

export function SpeciesDocumentationSection({ species }: SpeciesDocumentationSectionProps) {
  const hasProject = !!species.associated_projects?.length
  const conservationLabel = species.conservation_status
    ? (IUCN_LABELS[species.conservation_status] ?? species.conservation_status)
    : null

  return (
    <section className='mx-5'>
      <p className='mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-white/35'>
        Ce qui est documenté
      </p>
      <div className='space-y-2'>

        <DocCard
          label='Image principale'
          value='Représentation naturaliste'
          sheetTitle='À propos de cette image'
          sheetContent={
            <div className='space-y-3'>
              <p>
                Cette image illustre l&apos;espèce et son milieu. Elle a été créée comme
                représentation naturaliste à des fins pédagogiques.
              </p>
              <p>
                Elle ne constitue pas une photo de suivi terrain ni une preuve de présence ou de
                protection de l&apos;espèce.
              </p>
            </div>
          }
        />

        <DocCard
          label='Lien projet'
          value={hasProject ? 'Documenté' : 'À documenter'}
          sheetTitle='Trace pédagogique'
          sheetContent={
            <div className='space-y-3'>
              <p>
                Cette fiche garde une trace pédagogique du lien entre l&apos;espèce et un projet
                soutenu.
              </p>
              <p className='text-xs text-white/40'>
                Elle ne constitue pas une preuve que l&apos;espèce est protégée ou sauvée.
              </p>
            </div>
          }
        />

        <DocCard
          label='Photo terrain'
          value='Non disponible à ce jour'
          sheetTitle='Photo terrain'
          sheetContent={
            <p>
              Une photo terrain documentée peut être ajoutée si un partenaire la fournit. Elle sera
              clairement distinguée de la représentation naturaliste.
            </p>
          }
        />

        <DocCard
          label='Statut de conservation'
          value={conservationLabel ?? 'À documenter'}
          sheetTitle='Statut de conservation'
          sheetContent={
            <div className='space-y-3'>
              <p>
                Le statut de conservation peut varier selon le périmètre évalué : espèce,
                sous-espèce, population sauvage ou population locale.
              </p>
              <p>
                Les données locales liées au projet restent à documenter avec le partenaire.
              </p>
              <p className='text-xs text-white/40'>
                Ce statut n&apos;est pas une validation de l&apos;impact du projet sur
                l&apos;espèce.
              </p>
            </div>
          }
        />

        <DocCard
          label='Données scientifiques'
          value='À vérifier avant publication'
          sheetTitle='Données scientifiques'
          sheetContent={
            <div className='space-y-3'>
              <p>
                Certaines données scientifiques présentes dans cette fiche sont issues de recherches
                documentaires et n&apos;ont pas encore été vérifiées par un expert terrain ou une
                publication scientifique identifiable.
              </p>
              <p className='text-xs text-white/40'>
                Make the Change s&apos;engage à afficher les données avec leur niveau de fiabilité.
              </p>
            </div>
          }
        />

      </div>

      <p className='mt-5 text-center text-xs leading-relaxed text-white/25'>
        Cette fiche est une trace pédagogique. Elle ne constitue pas une preuve que l&apos;espèce
        est protégée ou sauvée.
      </p>
    </section>
  )
}
