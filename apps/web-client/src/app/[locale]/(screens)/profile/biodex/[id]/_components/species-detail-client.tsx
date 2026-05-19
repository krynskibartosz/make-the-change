'use client'
import { useMemo } from 'react'
import { BookOpen, ChevronRight, GitBranch } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getCoursesForSpecies } from '@/lib/learning/selectors'
import type { SpeciesContext } from '@/types/species'
import { SpeciesHero } from './species-hero'
import { SpeciesLinkedProjects, type LinkedProject } from './species-linked-projects'
import { SpeciesLinkedSpecies } from './species-linked-species'
import { SpeciesLinkedProducts, type SpeciesLinkedProducerData } from './species-linked-products'
import { SpeciesLinkedPartners, type SpeciesLinkedPartnerData } from './species-linked-partners'
import { SpeciesWhyItMatters } from './species-why-it-matters'
import { SpeciesQuickStats } from './species-quick-stats'
import { SpeciesKnowledgeSection } from './species-knowledge-section'
import { SpeciesDocumentationSection } from './species-documentation-section'

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

      <div className='mt-5 space-y-5'>

        {/* 2. Projet lié */}
        <SpeciesLinkedProjects projects={linkedProjects} />

        {/* 3. Pourquoi elle compte */}
        <SpeciesWhyItMatters species={species} />

        {/* 4. Repères rapides */}
        <SpeciesQuickStats species={species} />

        {/* 5. Ce qu'on peut comprendre */}
        <SpeciesKnowledgeSection species={species} />

        {/* 6. Espèces du même projet */}
        <SpeciesLinkedSpecies linkedProjects={linkedProjects} currentSpeciesId={species.id} />

        {/* 7. Ce qui est documenté */}
        <SpeciesDocumentationSection species={species} />

        {/* 6. Approfondir dans Apprendre */}
        {learningCourses.length > 0 && (
          <section className='mx-5'>
            <p className='mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-white/35'>
              Approfondir dans Apprendre
            </p>
            <div className='rounded-3xl border border-white/8 bg-white/[0.045] p-4'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <div className='flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-teal-200/65'>
                    <BookOpen className='h-4 w-4' aria-hidden='true' />
                    Cours liés
                  </div>
                  <p className='mt-1 text-sm leading-relaxed text-white/48'>
                    Cours reliés à son rôle, son habitat et ses relations dans le vivant.
                  </p>
                </div>
                {firstEcosystemId && (
                  <Link
                    href={`/ecosysteme/${firstEcosystemId}${firstNodeId ? `?node=${firstNodeId}` : ''}`}
                    className='shrink-0 text-teal-300 active:text-teal-200'
                    aria-label='Explorer dans la Toile vivante'
                  >
                    <GitBranch className='h-5 w-5' aria-hidden='true' />
                  </Link>
                )}
              </div>
              <div className='mt-4 grid gap-2'>
                {learningCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/learn/courses/${course.id}`}
                    className='flex items-center justify-between gap-3 rounded-2xl bg-white/[0.045] px-3 py-2.5 text-sm font-semibold text-white/75 active:bg-white/[0.07]'
                  >
                    <span className='line-clamp-1'>{course.title}</span>
                    <ChevronRight className='h-4 w-4 shrink-0 text-white/30' aria-hidden='true' />
                  </Link>
                ))}
              </div>
              {firstEcosystemId && (
                <Link
                  href={`/ecosysteme/${firstEcosystemId}${firstNodeId ? `?node=${firstNodeId}` : ''}`}
                  className='mt-3 flex items-center justify-center gap-2 rounded-2xl border border-teal-500/20 bg-teal-500/8 py-2.5 text-sm font-semibold text-teal-300 active:bg-teal-500/15'
                >
                  <GitBranch className='h-4 w-4' aria-hidden='true' />
                  Explorer dans la Toile vivante
                </Link>
              )}
            </div>
          </section>
        )}

        {/* 8. Partenaires liés */}
        <SpeciesLinkedPartners partners={linkedPartners} />

        {/* 9. Produits du partenaire lié */}
        <SpeciesLinkedProducts producers={linkedProducers} />

        {/* 9. Sources & limites */}
        <section className='mx-5 pb-4'>
          <div className='rounded-2xl border border-white/5 bg-white/[0.025] px-4 py-4'>
            <p className='mb-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/25'>
              Sources & limites
            </p>
            <p className='text-xs leading-relaxed text-white/35'>
              Cette fiche est une trace pédagogique. Elle ne constitue pas une preuve que
              l&apos;espèce est protégée ou sauvée.
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}
