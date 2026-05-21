'use client'
import { useMemo } from 'react'
import { ChevronRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getCoursesForSpecies } from '@/lib/learning/selectors'
import type { SpeciesContext } from '@/types/species'
import { SpeciesHero } from './species-hero'
import { SpeciesWhyItMatters } from './species-why-it-matters'
import { SpeciesQuickStats } from './species-quick-stats'
import { SpeciesKnowledgeSection } from './species-knowledge-section'
import { SpeciesProjectsZone } from './species-projects-zone'
import { SpeciesLinkedSpecies } from './species-linked-species'
import { SpeciesLinkedProducts, type SpeciesLinkedProducerData } from './species-linked-products'
import type { LinkedProject } from './species-linked-projects'
import type { SpeciesLinkedPartnerData } from './species-linked-partners'

interface SpeciesDetailClientProps {
  species: SpeciesContext
  linkedProjects: LinkedProject[]
  linkedProducers: SpeciesLinkedProducerData[]
  linkedPartners: SpeciesLinkedPartnerData[]
}

export function SpeciesDetailClient({ species, linkedProjects, linkedProducers, linkedPartners }: SpeciesDetailClientProps) {
  const learningCourses = useMemo(() => getCoursesForSpecies(species.id, 3), [species.id])

  return (
    <div className='pb-12'>

      {/* 1. Hero naturaliste */}
      <SpeciesHero species={species} />

      <div className='mt-6'>

        {/* 2. Rôle dans le vivant */}
        <SpeciesWhyItMatters species={species} />

        {/* 3. Repères biologiques */}
        <div className='mt-10'>
          <SpeciesQuickStats species={species} />
        </div>

        {/* 4. Explorer son rôle */}
        <div className='mt-12'>
          <SpeciesKnowledgeSection species={species} />
        </div>

        {/* 5. Liens avec les projets */}
        <div className='mt-14'>
          <SpeciesProjectsZone linkedProjects={linkedProjects} linkedPartners={linkedPartners} />
        </div>

        {/* 6. Dans le même écosystème */}
        <div className='mt-14'>
          <SpeciesLinkedSpecies linkedProjects={linkedProjects} currentSpeciesId={species.id} />
        </div>

        {/* 7. Continuer à apprendre */}
        {learningCourses.length > 0 && (
          <section className='mx-5 mt-14'>
            <p className='mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-white/35'>
              Continuer à apprendre
            </p>
            <p className='mb-4 text-sm leading-relaxed text-white/48'>
              Cours reliés à son rôle, son habitat et ses relations dans le vivant.
            </p>
            <ul className='m-0 list-none divide-y divide-white/[0.06] p-0'>
              {learningCourses.map((course) => (
                <li key={course.id}>
                  <Link
                    href={`/learn/courses/${course.id}`}
                    className='flex items-center justify-between gap-3 py-3 text-sm font-semibold text-white/75 active:opacity-60'
                  >
                    <span className='line-clamp-1'>{course.title}</span>
                    <ChevronRight className='h-4 w-4 shrink-0 text-white/30' aria-hidden='true' />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 8. Savoir-faire partenaire */}
        <div className='mt-16'>
          <SpeciesLinkedProducts producers={linkedProducers} />
        </div>

        {/* 9. Sources & limites */}
        <section className='mt-16 border-t border-white/5 px-5 pb-8 pt-6'>
          <p className='mb-2 text-[10px] font-black uppercase tracking-[0.14em] text-white/25'>
            Sources & limites
          </p>
          <p className='text-xs leading-relaxed text-white/35'>
            Cette fiche aide à comprendre une espèce et ses liens avec des projets documentés dans
            l&apos;app. Elle ne constitue pas une preuve de protection de l&apos;espèce.
          </p>
        </section>

      </div>
    </div>
  )
}
