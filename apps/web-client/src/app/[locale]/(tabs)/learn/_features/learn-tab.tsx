import { ArrowRight, BookOpen, FlaskConical, Map as MapIcon, Route, Sprout } from 'lucide-react'
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
  LEARNING_DOMAIN_LABELS,
  LearningPlayButton,
  LearningSectionTitle,
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

const LEARNING_MODE_LINKS = [
  {
    href: '/academy',
    title: 'Mode Duolingo',
    description: 'Le parcours Academy avec vies, série et niveaux.',
    meta: 'Principal',
    icon: Route,
    tone: 'border-emerald-200/18 bg-emerald-300/10 text-emerald-200',
  },
  {
    href: '/kinnu-v2',
    title: 'Mode test',
    description: 'La nouvelle carte hexagonale pour tester les pathways.',
    meta: 'V2 lab',
    icon: FlaskConical,
    tone: 'border-amber-200/18 bg-amber-300/10 text-amber-200',
  },
  {
    href: '/learn/atlas',
    title: 'Atlas du vivant',
    description: 'Explorer les grands territoires du vivant.',
    meta: 'Carte',
    icon: MapIcon,
    tone: 'border-cyan-200/18 bg-cyan-300/10 text-cyan-200',
  },
  {
    href: '/kinnu',
    title: 'Prototype exploration',
    description: 'Ancienne version non linéaire pour comparer.',
    meta: 'V1 lab',
    icon: Sprout,
    tone: 'border-lime-200/18 bg-lime-300/10 text-lime-200',
  },
]

const LAB_ENTRIES = [
  {
    href: '/lab/atlas-prototype',
    title: 'Atlas du vivant — Prototype',
    description: 'Interface immersive en cours de conception, avec carte Voronoï et navigation par territoires.',
    icon: FlaskConical,
  },
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
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4">
        <header className="px-1 pt-2">
          <h1 className="text-[28px] font-black tracking-tight text-white">Apprendre</h1>
          <p className="mt-1 max-w-[28rem] text-[15px] font-medium leading-relaxed text-white/55">
            Choisis ton entrée: parcours guidé, atlas ou versions test.
          </p>
        </header>

        <section aria-labelledby="learn-modes-title">
          <LearningSectionTitle title="Versions disponibles" />
          <div className="grid gap-2 md:grid-cols-2">
            {LEARNING_MODE_LINKS.map((mode) => {
              const Icon = mode.icon

              return (
                <Link
                  key={mode.href}
                  href={mode.href}
                  className={`group flex min-h-[5.5rem] items-center gap-3 rounded-[1.15rem] border border-white/[0.08] bg-white/[0.025] px-3.5 py-3 transition-colors active:bg-white/[0.06] ${learningInteractiveClassName}`}
                >
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-[0.95rem] border ${mode.tone}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-3">
                      <span className="truncate text-[15px] font-black text-white">
                        {mode.title}
                      </span>
                      <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.12em] text-white/30">
                        {mode.meta}
                      </span>
                    </span>
                    <span className="mt-1 line-clamp-2 text-[12px] font-semibold leading-relaxed text-white/45">
                      {mode.description}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-white/30 transition-transform group-active:translate-x-0.5" />
                </Link>
              )
            })}
          </div>
        </section>

        <section aria-labelledby="learn-lab-title">
          <div className="mb-4 flex items-center gap-3 px-1">
            <h2 className="text-xl font-black tracking-tight text-white">Lab</h2>
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/25 bg-amber-300/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-amber-200">
              <FlaskConical className="h-3 w-3" aria-hidden="true" />
              Expérimental
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {LAB_ENTRIES.map((entry) => {
              const Icon = entry.icon

              return (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className={`group flex items-center gap-3 rounded-[1.15rem] border border-amber-300/[0.10] bg-amber-300/[0.04] px-3.5 py-3.5 transition-colors active:bg-amber-300/[0.08] ${learningInteractiveClassName}`}
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[0.95rem] border border-amber-200/18 bg-amber-300/10 text-amber-200">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-black text-white">
                      {entry.title}
                    </span>
                    <span className="mt-1 line-clamp-2 text-[12px] font-semibold leading-relaxed text-white/45">
                      {entry.description}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-white/30 transition-transform group-active:translate-x-0.5" />
                </Link>
              )
            })}
          </div>
        </section>

        {continueCourse && (
          <section aria-labelledby="learn-continue-title">
            <LearningSectionTitle title="Reprendre" />
            <div className="border-y border-white/[0.08] py-4">
              <div className="flex items-start gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[1.05rem] border border-teal-200/18 bg-teal-300/12 text-teal-100">
                  <BookOpen className="h-6 w-6" aria-hidden="true" />
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
            <LearningSectionTitle title="Cours liés à tes projets" href="/learn/courses?project=all" action="Voir tous" />
            <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {projectLinkedCourses.map(({ course, projectLabel }) => (
                <Link
                  key={course.id}
                  href={`/learn/courses/${course.id}`}
                  className={`group flex items-center gap-3 py-3.5 transition-colors active:bg-white/[0.04] ${learningInteractiveClassName}`}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[0.9rem] border border-white/10 bg-white/[0.035] text-teal-200">
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-black uppercase tracking-[0.15em] text-teal-200/45">
                      {projectLabel} · {LEARNING_DOMAIN_LABELS[course.domain]}
                    </span>
                    <span className="mt-1 block truncate text-[15px] font-black text-white">
                      {course.title}
                    </span>
                    <span className="mt-0.5 block truncate text-[12px] font-semibold text-white/38">
                      {course.durationMinutes} min · {course.theme}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-white/28 transition-transform group-active:translate-x-0.5" />
                </Link>
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
