'use client'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { MobileSheet } from '@/components/ui/mobile-sheet'
import type { SpeciesContext } from '@/types/species'


type StatusKind = 'documented' | 'pending' | 'unavailable'

const STATUS_DOT: Record<StatusKind, string> = {
  documented: 'bg-emerald-400',
  pending: 'bg-amber-400/70',
  unavailable: 'bg-white/20',
}

interface StatusRowProps {
  label: string
  value: string
  status: StatusKind
  sheetTitle?: string
  sheetContent?: ReactNode
}

function StatusRow({ label, value, status, sheetTitle, sheetContent }: StatusRowProps) {
  const [open, setOpen] = useState(false)
  const isClickable = !!sheetContent

  return (
    <>
      <button
        type={isClickable ? 'button' : undefined}
        onClick={isClickable ? () => setOpen(true) : undefined}
        disabled={!isClickable}
        className={`flex w-full items-center justify-between py-2.5 text-left ${isClickable ? 'transition-opacity active:opacity-60' : ''}`}
      >
        <p className='text-xs text-white/40'>{label}</p>
        <div className='flex items-center gap-2'>
          <p className='text-xs font-semibold text-white/65'>{value}</p>
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[status]}`} aria-hidden='true' />
        </div>
      </button>

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

  return (
    <section className='mx-5'>
      <p className='mb-1 text-[11px] font-black uppercase tracking-[0.16em] text-white/35'>
        Fiabilité des informations
      </p>
      <div className='divide-y divide-white/[0.05]'>
        <StatusRow
          label='Image pédagogique'
          value='Représentation naturalisée'
          status='documented'
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

        <StatusRow
          label='Photo terrain'
          value='Non disponible'
          status='unavailable'
          sheetTitle='Photo terrain'
          sheetContent={
            <p>
              Une photo terrain documentée peut être ajoutée si un partenaire la fournit. Elle sera
              clairement distinguée de la représentation pédagogique.
            </p>
          }
        />

        <StatusRow
          label='Lien projet'
          value={hasProject ? 'Documenté' : 'À documenter'}
          status={hasProject ? 'documented' : 'pending'}
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

        <StatusRow
          label='Données scientifiques'
          value='À vérifier'
          status='pending'
          sheetTitle='Données scientifiques'
          sheetContent={
            <div className='space-y-3'>
              <p>
                Certaines données présentes dans cette fiche sont issues de recherches documentaires
                et n&apos;ont pas encore été vérifiées par un expert terrain ou une publication
                scientifique identifiable.
              </p>
              <p className='text-xs text-white/40'>
                Make the Change s&apos;engage à afficher les données avec leur niveau de fiabilité.
              </p>
            </div>
          }
        />

        <StatusRow
          label='Données locales'
          value='À documenter'
          status='pending'
          sheetTitle='Données locales'
          sheetContent={
            <div className='space-y-3'>
              <p>
                Les données de terrain (observations locales, comptages, comportements saisonniers)
                n&apos;ont pas encore été recueillies avec le partenaire.
              </p>
              <p className='text-xs text-white/40'>
                Ces données permettront d&apos;affiner le rôle réel de l&apos;espèce dans ce
                contexte spécifique.
              </p>
            </div>
          }
        />
      </div>
    </section>
  )
}
