'use client'
import { useMemo, useState } from 'react'
import { BookOpen, ChevronRight, GitBranch } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getCoursesForSpecies } from '@/lib/learning/selectors'
import type { SpeciesContext } from '@/types/species'
import { SpeciesHero } from './species-hero'
import { SpeciesProjectLinkCard } from './species-project-link-card'
import { SpeciesWhyItMatters } from './species-why-it-matters'
import { SpeciesBiodexProgression } from './species-biodex-progression'
import { SpeciesKnowledgeSection } from './species-knowledge-section'
import { SpeciesDocumentationSection } from './species-documentation-section'
import { StickyEvolutionBar } from './sticky-evolution-bar'

const REQUIRED_SEEDS = 500

interface SpeciesDetailClientProps {
  species: SpeciesContext
  userSeedsBalance: number
}

export function SpeciesDetailClient({ species, userSeedsBalance }: SpeciesDetailClientProps) {
  const [showToast, setShowToast] = useState(false)

  const canEvolve = userSeedsBalance >= REQUIRED_SEEDS
  const progressionLevel = species.user_status?.progressionLevel ?? 1
  const isLevel2Unlocked = progressionLevel >= 2

  const learningCourses = useMemo(() => getCoursesForSpecies(species.id, 3), [species.id])
  const livingWebCourse = learningCourses.find((c) => c.relatedEcosystemIds.length > 0)
  const firstEcosystemId = livingWebCourse?.relatedEcosystemIds[0]
  const firstNodeId = livingWebCourse?.relatedNodeIds[0]

  const handleDisabledClick = () => {
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  return (
    <>
      <div className='pb-28'>

        {/* 1. Hero naturaliste */}
        <SpeciesHero species={species} />

        <div className='mt-5 space-y-5'>

          {/* 2. Projet lié */}
          <SpeciesProjectLinkCard projects={species.associated_projects} />

          {/* 3. Pourquoi elle compte */}
          <SpeciesWhyItMatters species={species} />

          {/* 4. Fiche BioDex — progression */}
          <SpeciesBiodexProgression
            progressionLevel={progressionLevel}
            currentSeeds={userSeedsBalance}
          />

          {/* 5. Ce qu'on peut comprendre */}
          <SpeciesKnowledgeSection species={species} isLevel2Unlocked={isLevel2Unlocked} />

          {/* 6. Ce qui est documenté */}
          <SpeciesDocumentationSection species={species} />

          {/* 7. Cours liés & Toile vivante */}
          {learningCourses.length > 0 && (
            <section className='mx-5'>
              <div className='rounded-3xl border border-white/8 bg-white/[0.045] p-4'>
                <div className='flex items-start justify-between gap-4'>
                  <div>
                    <div className='flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-teal-200/65'>
                      <BookOpen className='h-4 w-4' aria-hidden='true' />
                      Approfondir dans Apprendre
                    </div>
                    <p className='mt-1 text-sm leading-relaxed text-white/48'>
                      Cours reliés à son rôle, son habitat ou ses liens dans la Toile vivante.
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
              </div>
            </section>
          )}

        </div>
      </div>

      {/* 8. Sticky bar d'approfondissement */}
      <StickyEvolutionBar
        currentSeeds={userSeedsBalance}
        requiredSeeds={REQUIRED_SEEDS}
        canEvolve={canEvolve}
        onDisabledClick={handleDisabledClick}
      />

      {/* Toast */}
      {showToast && (
        <div className='pointer-events-none fixed inset-x-4 bottom-28 z-[60] flex items-center justify-center'>
          <div className='animate-in fade-in slide-in-from-bottom-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-medium text-white/90 shadow-xl backdrop-blur-md duration-300'>
            Continue l&apos;Aventure ou Apprendre pour gagner des Graines !
          </div>
        </div>
      )}
    </>
  )
}
