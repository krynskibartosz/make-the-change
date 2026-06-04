import { Search } from 'lucide-react'
import type { Metadata } from 'next'
import {
  LearningCourseCard,
  LearningScreenIntro,
  LearningSectionTitle,
  learningInteractiveClassName,
  PROJECT_LABEL_BY_SLUG,
} from '@/app/[locale]/(tabs)/learn/_features/learning-cards'
import { LEARNING_ATLAS_DOMAINS } from '@/lib/learning/catalog'
import type { LearningDomainId, LearningLevel } from '@/lib/learning/schema'
import { searchLearningCourses } from '@/lib/learning/selectors'
import { cn } from '@/lib/utils'

type LearningCoursesPageProps = {
  searchParams?: Promise<{
    q?: string
    domain?: LearningDomainId | 'all'
    level?: LearningLevel | 'all'
    duration?: string
    project?: string
    species?: string
  }>
}

export const metadata: Metadata = {
  title: 'Tous les cours | Make the Change',
}

const LEVEL_OPTIONS: Array<{ value: LearningLevel | 'all'; label: string }> = [
  { value: 'all', label: 'Tous niveaux' },
  { value: 'base', label: 'Base' },
  { value: 'intermediaire', label: 'Intermédiaire' },
  { value: 'avance', label: 'Avancé' },
]

const PROJECT_OPTIONS = [
  { value: 'all', label: 'Tous projets' },
  ...Object.entries(PROJECT_LABEL_BY_SLUG).map(([value, label]) => ({ value, label })),
]

const filterControlClassName =
  'min-h-12 rounded-2xl border border-white/10 bg-[#101820] px-3 text-[13px] font-semibold text-white/78 outline-none'

export default async function LearningCoursesPage({ searchParams }: LearningCoursesPageProps) {
  const params = await searchParams
  const maxDurationMinutes = params?.duration === '5' ? 5 : undefined
  const courses = searchLearningCourses({
    query: params?.q,
    domain: params?.domain ?? 'all',
    level: params?.level ?? 'all',
    maxDurationMinutes,
    projectSlug: params?.project && params.project !== 'all' ? params.project : undefined,
    speciesId: params?.species,
  })

  return (
    <main className="min-h-[100dvh] bg-[#0B0F15] text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.75rem,env(safe-area-inset-top))]">
        <LearningScreenIntro eyebrow="Catalogue" title="Tous les cours">
          Trouve vite un cours par thème, niveau, durée ou projet. Le catalogue reste libre, sans
          bloquer la progression Academy.
        </LearningScreenIntro>

        <form
          className="rounded-[1.35rem] border border-white/8 bg-white/[0.025] p-3"
          role="search"
        >
          <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-black/18 px-4 text-white/70 focus-within:border-teal-200/45">
            <Search className="h-4 w-4 text-white/35" aria-hidden="true" />
            <span className="sr-only">Rechercher un cours</span>
            <input
              name="q"
              defaultValue={params?.q ?? ''}
              placeholder="Abeilles, coraux, impact..."
              className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-white outline-none placeholder:text-white/25"
            />
          </label>
          <div className="mt-3 grid gap-2 md:grid-cols-4">
            {/* Native select: Server Component form GET — see docs/superpowers/specs/2026-06-03-base-ui-vague-2-design.md §3.6 */}
            <select
              name="domain"
              defaultValue={params?.domain ?? 'all'}
              aria-label="Filtrer par domaine"
              className={cn(filterControlClassName, learningInteractiveClassName)}
            >
              <option value="all">Tous domaines</option>
              {LEARNING_ATLAS_DOMAINS.map((domain) => (
                <option key={domain.id} value={domain.id}>
                  {domain.title}
                </option>
              ))}
            </select>
            {/* Native select: Server Component form GET — see docs/superpowers/specs/2026-06-03-base-ui-vague-2-design.md §3.6 */}
            <select
              name="level"
              defaultValue={params?.level ?? 'all'}
              aria-label="Filtrer par niveau"
              className={cn(filterControlClassName, learningInteractiveClassName)}
            >
              {LEVEL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {/* Native select: Server Component form GET — see docs/superpowers/specs/2026-06-03-base-ui-vague-2-design.md §3.6 */}
            <select
              name="duration"
              defaultValue={params?.duration ?? 'all'}
              aria-label="Filtrer par durée"
              className={cn(filterControlClassName, learningInteractiveClassName)}
            >
              <option value="all">Toute durée</option>
              <option value="5">5 min max</option>
            </select>
            {/* Native select: Server Component form GET — see docs/superpowers/specs/2026-06-03-base-ui-vague-2-design.md §3.6 */}
            <select
              name="project"
              defaultValue={params?.project ?? 'all'}
              aria-label="Filtrer par projet"
              className={cn(filterControlClassName, learningInteractiveClassName)}
            >
              {PROJECT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            className={cn(
              'mt-3 min-h-12 rounded-2xl bg-teal-300 px-4 text-[14px] font-black text-[#04110e]',
              learningInteractiveClassName,
            )}
            type="submit"
          >
            Filtrer
          </button>
        </form>

        <section>
          <LearningSectionTitle title={`${courses.length} cours`} />
          <div className="grid gap-3 md:grid-cols-2">
            {courses.map((course) => (
              <LearningCourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
