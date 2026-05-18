import type { Metadata } from 'next'
import { Search } from 'lucide-react'
import { TabScreen } from '@/app/[locale]/(tabs)/_components/tab-screen'
import { LEARNING_ATLAS_DOMAINS } from '@/lib/learning/catalog'
import type { LearningDomainId, LearningLevel } from '@/lib/learning/schema'
import { searchLearningCourses } from '@/lib/learning/selectors'
import {
  LearningCourseCard,
  LearningScreenIntro,
  LearningSectionTitle,
  PROJECT_LABEL_BY_SLUG,
} from '../_features/learning-cards'

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
    <TabScreen className="bg-[#0B0F15]">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pb-28 pt-[max(1.75rem,env(safe-area-inset-top))]">
        <LearningScreenIntro eyebrow="Catalogue" title="Tous les cours">
          Recherche précise, filtres par domaine, niveau, durée, projet et BioDex. Un même cours peut apparaître dans
          plusieurs contextes.
        </LearningScreenIntro>

        <form className="rounded-[1.5rem] border border-white/8 bg-white/[0.045] p-4">
          <label className="flex min-h-12 items-center gap-3 rounded-2xl bg-black/20 px-4 text-white/70">
            <Search className="h-4 w-4 text-white/35" aria-hidden="true" />
            <input
              name="q"
              defaultValue={params?.q ?? ''}
              placeholder="Abeilles, coraux, impact..."
              className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-white outline-none placeholder:text-white/25"
            />
          </label>
          <div className="mt-3 grid gap-2 md:grid-cols-4">
            <select
              name="domain"
              defaultValue={params?.domain ?? 'all'}
              className="h-11 rounded-2xl border border-white/8 bg-[#111820] px-3 text-[13px] font-semibold text-white/75 outline-none"
            >
              <option value="all">Tous domaines</option>
              {LEARNING_ATLAS_DOMAINS.map((domain) => (
                <option key={domain.id} value={domain.id}>
                  {domain.title}
                </option>
              ))}
            </select>
            <select
              name="level"
              defaultValue={params?.level ?? 'all'}
              className="h-11 rounded-2xl border border-white/8 bg-[#111820] px-3 text-[13px] font-semibold text-white/75 outline-none"
            >
              {LEVEL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              name="duration"
              defaultValue={params?.duration ?? 'all'}
              className="h-11 rounded-2xl border border-white/8 bg-[#111820] px-3 text-[13px] font-semibold text-white/75 outline-none"
            >
              <option value="all">Toute durée</option>
              <option value="5">5 min max</option>
            </select>
            <select
              name="project"
              defaultValue={params?.project ?? 'all'}
              className="h-11 rounded-2xl border border-white/8 bg-[#111820] px-3 text-[13px] font-semibold text-white/75 outline-none"
            >
              {PROJECT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button className="mt-3 h-11 rounded-2xl bg-teal-300 px-4 text-[14px] font-black text-[#04110e]" type="submit">
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
      </main>
    </TabScreen>
  )
}
