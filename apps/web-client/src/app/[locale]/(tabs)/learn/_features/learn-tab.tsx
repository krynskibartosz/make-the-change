import { ArrowRight, BookOpen } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getAtlasIslandViews, getLearningHome } from '@/lib/learning/selectors'
import {
  MOCK_PROJECT_CORAL_SLUG,
  MOCK_PROJECT_HABEEBEE_SLUG,
  MOCK_PROJECT_MANAKARA_SLUG,
} from '@/lib/mock/mock-ids'
import type { SpeciesContext } from '@/types/species'
import { LearnAtlasPreview } from './learn-atlas-preview'
import {
  LearningCourseCard,
  LearningPlayButton,
  learningInteractiveClassName,
  PROJECT_LABEL_BY_SLUG,
} from './learning-cards'

type LearnTabProps = {
  species: SpeciesContext[]
}

const DEFAULT_PROJECT_SLUGS = [
  MOCK_PROJECT_MANAKARA_SLUG,
  MOCK_PROJECT_CORAL_SLUG,
  MOCK_PROJECT_HABEEBEE_SLUG,
]

export function LearnTab({ species }: LearnTabProps) {
  const unlockedSpeciesIds = species
    .filter((entry) => entry.user_status?.isUnlocked)
    .map((entry) => entry.id)
  const home = getLearningHome({
    projectSlugs: DEFAULT_PROJECT_SLUGS,
    speciesIds:
      unlockedSpeciesIds.length > 0
        ? unlockedSpeciesIds
        : species.slice(0, 6).map((entry) => entry.id),
  })
  const atlasIslands = getAtlasIslandViews()
  const continueCourse =
    home.continueCourse ??
    home.allCourses.find((course) => course.id === 'academy-le-pouvoir-du-soleil') ??
    home.allCourses[0] ??
    null

  // Aplatir les cours liés aux projets, en gardant l'info de projet pour le tag
  const projectLinkedCourses = home.projectGroups
    .flatMap((group) =>
      group.courses.slice(0, 2).map((course) => ({
        course,
        projectLabel: PROJECT_LABEL_BY_SLUG[group.projectSlug] ?? group.projectSlug,
      })),
    )
    .slice(0, 4)

  return (
    <section className="relative isolate w-full overflow-x-hidden pb-32 pt-[max(1.75rem,env(safe-area-inset-top))] md:pb-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[-2] h-[24rem] bg-[linear-gradient(180deg,rgba(22,68,62,0.20),rgba(11,15,21,0))]" />
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4">
        <header className="px-1 pt-2">
          <h1 className="text-[31px] font-black tracking-tight text-white">Apprendre</h1>
          <p className="mt-1 max-w-[28rem] text-[14px] font-medium leading-relaxed text-white/52">
            Comprends les écosystèmes que tu soutiens, à ton rythme.
          </p>
        </header>

        {continueCourse && (
          <section aria-labelledby="learn-continue-title">
            <div className="mb-3 flex items-center justify-between px-1">
              <h2
                id="learn-continue-title"
                className="text-[18px] font-black tracking-tight text-white"
              >
                Reprendre
              </h2>
              <span className="text-[12px] font-bold text-white/34">Dernier fil</span>
            </div>
            <div className="overflow-hidden rounded-[1.45rem] border border-teal-200/14 bg-gradient-to-br from-teal-300/12 via-white/[0.035] to-emerald-300/6 p-4 shadow-[0_18px_54px_rgba(0,0,0,0.22)]">
              <div className="flex items-start gap-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[22px] bg-teal-300 text-[#04110e] shadow-lg shadow-teal-300/15">
                  <BookOpen className="h-7 w-7" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-teal-100/55">
                    {continueCourse.theme} · {continueCourse.durationMinutes} min
                  </p>
                  <h2 className="mt-1 text-[20px] font-black leading-tight text-white">
                    {continueCourse.title}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-white/50">
                    {continueCourse.subtitle}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <LearningPlayButton course={continueCourse} returnTo="/learn" label="Continuer" />
                <Link
                  href={`/learn/courses/${continueCourse.id}`}
                  className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 text-[14px] font-black text-white/70 active:bg-white/[0.06] ${learningInteractiveClassName}`}
                >
                  Voir la fiche <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Section 1 — Cours liés à tes projets */}
        {projectLinkedCourses.length > 0 && (
          <section aria-labelledby="learn-projects-title">
            <div className="mb-3 flex items-center justify-between px-1">
              <h2
                id="learn-projects-title"
                className="text-[18px] font-black tracking-tight text-white"
              >
                Cours liés à tes projets
              </h2>
              <Link
                href="/learn/courses?project=all"
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-white/45 hover:text-white/65"
              >
                Voir tous
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {projectLinkedCourses.map(({ course, projectLabel }) => (
                <div key={course.id} className="relative">
                  <p className="mb-1.5 px-1 text-[10px] font-black uppercase tracking-[0.16em] text-teal-200/55">
                    {projectLabel}
                  </p>
                  <LearningCourseCard course={course} compact />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 2 — Atlas du vivant */}
        <LearnAtlasPreview islands={atlasIslands} />
      </div>
    </section>
  )
}
