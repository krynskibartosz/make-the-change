'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { MobileSheet } from '../ui/mobile-sheet'

type ProjectStorySheetProps = {
  description: string
  title: string
  producerName?: string
  producerDescription?: string
  producerLabel?: string
  projectType?: string | null
  isDonationProject?: boolean
}

function getSupportBullets(projectType: string | null | undefined, isDonationProject: boolean): string[] {
  const type = projectType?.toLowerCase() ?? ''

  if (isDonationProject || type.includes('coral') || type.includes('reef')) {
    return [
      "l'implantation et le suivi des fragments de corail",
      "les équipements de plongée et de suivi sous-marin",
      "le suivi photographique et scientifique du site",
      "l'entretien des structures de nurserie",
    ]
  }

  if (type.includes('orchard') || type.includes('olive')) {
    return [
      "la taille et l'entretien des oliviers",
      "les équipements de récolte",
      "la transformation et la valorisation de l'huile",
      "les circuits de distribution locale",
    ]
  }

  return [
    "l'entretien et le suivi des ruches",
    "les déplacements terrain du producteur",
    "le matériel apicole",
    "le suivi sanitaire des colonies",
    "la récolte et la valorisation du miel",
  ]
}

function Bullet({ children }: { children: string }) {
  return (
    <li className="flex items-start gap-2 text-sm text-white/65">
      <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/25" />
      {children}
    </li>
  )
}

export function ProjectStorySheet({
  description,
  title,
  producerName,
  producerDescription,
  producerLabel,
  projectType,
  isDonationProject = false,
}: ProjectStorySheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!description && !producerName) return null

  const supportVerb = isDonationProject ? 'don' : 'soutien'
  const supportBullets = getSupportBullets(projectType, isDonationProject)
  const receiveBullets = isDonationProject
    ? [
        'photos et vidéos du site sous-marin',
        'nouvelles du projet de restauration',
        'étapes de progression documentées',
        'informations du partenaire terrain',
      ]
    : [
        'photos et nouvelles terrain',
        'étapes importantes du projet',
        'informations du partenaire',
        'mises à jour de la production',
      ]

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-white/50 transition-colors hover:text-white/80"
      >
        Lire l&apos;histoire du projet
        <ChevronRight className="h-3.5 w-3.5" />
      </button>

      <MobileSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title={title}>
        {/* Bloc 1 — Description complète */}
        {description ? (
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-white/75">
            {description}
          </p>
        ) : null}

        {/* Bloc 2 — Partenaire */}
        {producerName ? (
          <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
              {producerLabel ?? 'Partenaire'}
            </p>
            <p className="text-sm font-bold text-white">{producerName}</p>
            {producerDescription ? (
              <p className="mt-1 text-sm leading-relaxed text-white/50">{producerDescription}</p>
            ) : null}
          </div>
        ) : null}

        {/* Bloc 3 — Ce que ce soutien/don peut permettre */}
        <div className="mt-6">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
            Ce {supportVerb} peut permettre
          </p>
          <ul className="space-y-2">
            {supportBullets.map((bullet) => (
              <Bullet key={bullet}>{bullet}</Bullet>
            ))}
          </ul>
        </div>

        {/* Bloc 4 — Ce que vous pourrez recevoir */}
        <div className="mt-6 pb-2">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
            Vous pourrez recevoir
          </p>
          <ul className="space-y-2">
            {receiveBullets.map((item) => (
              <Bullet key={item}>{item}</Bullet>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-white/30">
            Ces éléments dépendent du projet et du partenaire. Ils ne constituent pas une promesse contractuelle.
          </p>
        </div>
      </MobileSheet>
    </>
  )
}
