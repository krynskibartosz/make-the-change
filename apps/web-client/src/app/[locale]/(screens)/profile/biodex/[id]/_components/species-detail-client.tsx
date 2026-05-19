'use client'
import { useMemo } from 'react'
import { ChevronRight, GitBranch } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getCoursesForSpecies } from '@/lib/learning/selectors'
import type { SpeciesContext } from '@/types/species'
import { SpeciesHero } from './species-hero'
import { SpeciesWhyItMatters } from './species-why-it-matters'
import { SpeciesQuickStats } from './species-quick-stats'
import { SpeciesKnowledgeSection } from './species-knowledge-section'
import { SpeciesProjectsZone } from './species-projects-zone'
import { SpeciesLinkedSpecies } from './species-linked-species'
import { SpeciesDocumentationSection } from './species-documentation-section'
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
  const livingWebCourse = learningCourses.find((c) => c.relatedEcosystemIds.length > 0)
  const firstEcosystemId = livingWebCourse?.relatedEcosystemIds[0]
  const firstNodeId = livingWebCourse?.relatedNodeIds[0]

  return (
    <div className='pb-12'>

      {/* 1. Hero naturaliste */}
      <SpeciesHero species={species} />

      <div className='mt-5 space-y-8'>

        {/* 2. Pourquoi elle compte — juste sous le hero, texte ouvert */}
        <SpeciesWhyItMatters species={species} />

        {/* 3. Repères biologiques — grille légère */}
        <SpeciesQuickStats species={species} />

        {/* 4. Explorer son rôle — accordéons */}
        <SpeciesKnowledgeSection species={species} />

        {/* 5. Liens avec les projets — zone fusionnée */}
        <SpeciesProjectsZone linkedProjects={linkedProjects} linkedPartners={linkedPartners} />

        {/* 6. Dans le même écosystème */}
        <SpeciesLinkedSpecies linkedProjects={linkedProjects} currentSpeciesId={species.id} />

        {/* 7. Ce qui est documenté — statuts visuels */}
        <SpeciesDocumentationSection species={species} />

        {/* 8. Continuer à apprendre */}
        {learningCourses.length > 0 && (
          <section className='mx-5'>
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
            {firstEcosystemId && (
              <Link
                href={`/ecosysteme/${firstEcosystemId}${firstNodeId ? `?node=${firstNodeId}` : ''}`}
                className='mt-4 flex items-center justify-center gap-2 rounded-2xl border border-teal-500/20 bg-teal-500/8 py-2.5 text-sm font-semibold text-teal-300 active:bg-teal-500/15'
              >
                <GitBranch className='h-4 w-4' aria-hidden='true' />
                Explorer dans la Toile vivante
              </Link>
            )}
          </section>
        )}

        {/* 9. Savoir-faire lié */}
        <SpeciesLinkedProducts producers={linkedProducers} />

        {/* 10. Sources & limites */}
        <section className='border-t border-white/5 px-5 pb-8 pt-6'>
          <p className='mb-2 text-[10px] font-black uppercase tracking-[0.14em] text-white/25'>
            Sources & limites
          </p>
          <p className='text-xs leading-relaxed text-white/35'>
            Cette fiche sert à apprendre et à relier une espèce à des projets documentés dans
            l&apos;app. Elle ne prouve pas que l&apos;espèce est sauvée ou protégée.
          </p>
        </section>

      </div>
    </div>
  )
}
