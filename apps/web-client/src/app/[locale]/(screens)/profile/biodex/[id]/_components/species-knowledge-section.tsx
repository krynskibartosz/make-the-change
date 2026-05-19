'use client'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SpeciesContext } from '@/types/species'
import { SizeWeightWidget } from './bento-size-weight'
import { OriginWidget } from './bento-origin'
import { DietWidget } from './bento-diet'

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

interface SpeciesKnowledgeSectionProps {
  species: SpeciesContext
  isLevel2Unlocked: boolean
}

export function SpeciesKnowledgeSection({ species, isLevel2Unlocked }: SpeciesKnowledgeSectionProps) {
  const hasHabitat = !!species.habitat?.length
  const hasSizeOrWeight = !!(species.size || species.weight)
  const hasOrigin = !!species.origin_country
  const hasDiet = !!species.diet
  const hasThreats = !!species.threats?.length
  const hasBentoContent = hasSizeOrWeight || hasOrigin || hasDiet

  return (
    <section className='mx-5'>
      <p className='mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-white/35'>
        Ce qu&apos;on peut comprendre
      </p>
      <div className='rounded-3xl border border-white/8 bg-white/[0.04] px-4'>

        {/* 01 – Habitat */}
        <AccordionItem title='Habitat' number='01' defaultOpen>
          {hasHabitat ? (
            <div className='flex flex-wrap gap-2'>
              {species.habitat!.map((h, i) => (
                <span
                  key={i}
                  className='rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70'
                >
                  {h}
                </span>
              ))}
            </div>
          ) : (
            <p className='text-xs text-white/35'>Habitat à documenter avec le partenaire.</p>
          )}
        </AccordionItem>

        {/* 02 – Rôle écologique */}
        <AccordionItem title='Rôle écologique' number='02'>
          {hasBentoContent && (
            <div className='mb-4 grid grid-cols-2 gap-3'>
              {hasSizeOrWeight && <SizeWeightWidget size={species.size} weight={species.weight} />}
              {hasOrigin && <OriginWidget originCountry={species.origin_country} />}
              {hasDiet && <DietWidget diet={species.diet} />}
            </div>
          )}
          {species.description_default ? (
            <p className='text-sm leading-relaxed text-white/60'>{species.description_default}</p>
          ) : (
            <p className='text-xs text-white/35'>Données à documenter.</p>
          )}
        </AccordionItem>

        {/* 03 – Relations dans le vivant */}
        <AccordionItem title='Relations dans le vivant' number='03'>
          {isLevel2Unlocked && species.description_scientific ? (
            <p className='text-sm leading-relaxed text-white/60'>{species.description_scientific}</p>
          ) : (
            <div className='space-y-2'>
              <div className='h-2 w-full rounded-full bg-white/8' />
              <div className='h-2 w-4/5 rounded-full bg-white/8' />
              <div className='h-2 w-3/5 rounded-full bg-white/8' />
              <p className='mt-3 text-xs text-white/30'>
                Approfondissez la fiche (étape 2) pour explorer les relations.
              </p>
            </div>
          )}
        </AccordionItem>

        {/* 04 – Menaces & fragilités */}
        <AccordionItem title='Menaces & fragilités' number='04'>
          {hasThreats ? (
            <div className='flex flex-wrap gap-2'>
              {species.threats!.map((t, i) => (
                <div
                  key={i}
                  className='rounded-full border border-orange-500/20 bg-orange-500/8 px-3 py-1.5 text-xs text-white/70'
                >
                  {t}
                </div>
              ))}
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
  )
}
