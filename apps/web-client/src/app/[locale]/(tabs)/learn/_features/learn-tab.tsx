import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  BookOpen,
  Compass,
  GitBranch,
  Route,
  Search,
  Sparkles,
  Sprout,
} from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { formatCompact } from '@/lib/formatters'
import { getAllLearningPaths } from '@/lib/learning/catalog'
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
  LearningPathCard,
  LearningPlayButton,
  LearningSectionTitle,
  learningInteractiveClassName,
  PROJECT_LABEL_BY_SLUG,
} from './learning-cards'
import { SeedsFloatingBadge } from './seeds-floating-badge'

type LearnTabProps = {
  seeds: number
  species: SpeciesContext[]
}

const DEFAULT_PROJECT_SLUGS = [
  MOCK_PROJECT_MANAKARA_SLUG,
  MOCK_PROJECT_CORAL_SLUG,
  MOCK_PROJECT_HABEEBEE_SLUG,
]

type LearnRouteCardProps = {
  href: string
  icon: LucideIcon
  title: string
  subtitle: string
  tone: 'atlas' | 'path' | 'project' | 'catalog'
}

const ROUTE_TONE: Record<LearnRouteCardProps['tone'], string> = {
  atlas: 'border-emerald-200/15 bg-emerald-300/8 text-emerald-100',
  path: 'border-cyan-200/15 bg-cyan-300/8 text-cyan-100',
  project: 'border-amber-200/15 bg-amber-300/8 text-amber-100',
  catalog: 'border-sky-200/15 bg-sky-300/8 text-sky-100',
}

function LearnRouteCard({ href, icon: Icon, title, subtitle, tone }: LearnRouteCardProps) {
  return (
    <Link
      href={href}
      className={`group flex min-h-[5.75rem] items-center gap-4 rounded-[1.25rem] border border-white/8 bg-white/[0.035] p-4 transition-colors active:bg-white/[0.07] ${learningInteractiveClassName}`}
    >
      <span
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl border ${ROUTE_TONE[tone]}`}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-black leading-tight text-white">{title}</span>
        <span className="mt-0.5 block truncate text-[12px] font-semibold text-white/42">
          {subtitle}
        </span>
      </span>
      <ArrowRight
        className="h-5 w-5 shrink-0 text-white/28 transition-transform group-active:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  )
}

function getSpeciesFallbackEmoji(name: string): string {
  const normalizedName = name.toLowerCase()
  if (
    normalizedName.includes('abeille') ||
    normalizedName.includes('bee') ||
    normalizedName.includes('apis')
  )
    return '🐝'
  if (
    normalizedName.includes('corail') ||
    normalizedName.includes('coral') ||
    normalizedName.includes('acropora')
  )
    return '🪸'
  if (normalizedName.includes('caméléon') || normalizedName.includes('chameleon')) return '🦎'
  if (
    normalizedName.includes('lemur') ||
    normalizedName.includes('vari') ||
    normalizedName.includes('lémur')
  )
    return '🐒'
  if (normalizedName.includes('tortue') || normalizedName.includes('turtle')) return '🐢'
  if (normalizedName.includes('papillon') || normalizedName.includes('butterfly')) return '🦋'
  return '🌿'
}

export function LearnTab({ seeds, species }: LearnTabProps) {
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
  const paths = getAllLearningPaths()
  const atlasIslands = getAtlasIslandViews()
  const continueCourse =
    home.continueCourse ??
    home.allCourses.find((course) => course.id === 'academy-le-pouvoir-du-soleil') ??
    home.allCourses[0] ??
    null
  const biodexPreview = species.filter((entry) => entry.user_status?.isUnlocked).slice(0, 5)

  return (
    <section className="relative isolate w-full overflow-x-hidden pb-32 pt-[max(1.75rem,env(safe-area-inset-top))] md:pb-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[-2] h-[24rem] bg-[linear-gradient(180deg,rgba(22,68,62,0.20),rgba(11,15,21,0))]" />
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4">
        <header className="flex items-start justify-between gap-4 px-1 pt-2">
          <div>
            <h1 className="text-[31px] font-black tracking-tight text-white">Apprendre</h1>
            <p className="mt-1 max-w-[28rem] text-[14px] font-medium leading-relaxed text-white/52">
              Continue, explore l’Atlas ou ouvre un parcours quand un vrai chemin vaut le coup.
            </p>
          </div>
          <Link
            href="/profile/seeds"
            prefetch={false}
            className={`flex min-h-11 shrink-0 items-center gap-2 rounded-2xl border border-emerald-200/12 bg-emerald-300/8 px-3 py-2 text-emerald-100 ${learningInteractiveClassName}`}
            aria-label={`Solde : ${seeds} Graines`}
          >
            <Sprout className="h-4 w-4" aria-hidden="true" />
            <span className="text-[13px] font-black tabular-nums">{formatCompact(seeds)}</span>
          </Link>
        </header>

        <SeedsFloatingBadge seeds={seeds} />

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

        <LearnAtlasPreview islands={atlasIslands} />

        <section aria-label="Entrées d’apprentissage" className="grid gap-3 md:grid-cols-2">
          <LearnRouteCard
            href="/learn/atlas"
            icon={Compass}
            title="Atlas du vivant"
            subtitle="Tout visualiser par îles"
            tone="atlas"
          />
          <LearnRouteCard
            href="/learn/parcours"
            icon={Route}
            title="Parcours guidés"
            subtitle="Quand l’ordre compte"
            tone="path"
          />
          <LearnRouteCard
            href="/learn/courses?project=all"
            icon={Sparkles}
            title="Cours liés à tes projets"
            subtitle="Comprendre tes actions"
            tone="project"
          />
          <LearnRouteCard
            href="/learn/courses"
            icon={Search}
            title="Tous les cours"
            subtitle="Recherche et filtres"
            tone="catalog"
          />
        </section>

        <section>
          <LearningSectionTitle title="Parcours guidés" href="/learn/parcours" action="Voir" />
          <div className="grid gap-3 md:grid-cols-2">
            {paths.slice(0, 4).map((path) => (
              <LearningPathCard key={path.id} path={path} />
            ))}
          </div>
        </section>

        <section>
          <LearningSectionTitle
            title="Aujourd'hui et projets"
            href="/learn/courses?duration=5"
            action="Cours courts"
          />
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-3 md:grid-cols-2">
              {home.today.slice(0, 2).map((course) => (
                <LearningCourseCard key={course.id} course={course} compact />
              ))}
            </div>
            <div className="divide-y divide-white/8 rounded-[1.25rem] border border-white/8 bg-white/[0.025]">
              {home.projectGroups.slice(0, 2).map((group) => (
                <div key={group.projectSlug} className="px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-teal-200/55">
                    {PROJECT_LABEL_BY_SLUG[group.projectSlug] ?? group.projectSlug}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {group.courses.slice(0, 2).map((course) => (
                      <Link
                        key={course.id}
                        href={`/learn/courses/${course.id}`}
                        className={`rounded-full border border-white/8 bg-white/[0.045] px-3 py-2 text-[12px] font-bold text-white/66 active:bg-white/[0.07] ${learningInteractiveClassName}`}
                      >
                        {course.subject}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <LearningSectionTitle title="BioDex & Toile vivante" href="/ecosysteme" action="Toile" />
          <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
            <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.025] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-[16px] font-black text-white">Espèces à approfondir</h3>
                  <p className="mt-1 text-[12px] font-semibold text-white/42">
                    Rôles écologiques et cours liés
                  </p>
                </div>
                <Link
                  href="/profile/biodex"
                  className={`rounded-xl px-2 py-1 text-[12px] font-black text-teal-300 ${learningInteractiveClassName}`}
                >
                  BioDex
                </Link>
              </div>
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {biodexPreview.length > 0 ? (
                  biodexPreview.map((entry) => (
                    <Link
                      key={entry.id}
                      href={`/profile/biodex/${entry.id}`}
                      className={`w-[72px] shrink-0 rounded-[18px] ${learningInteractiveClassName}`}
                    >
                      <div className="grid aspect-square place-items-center overflow-hidden rounded-[18px] bg-white/[0.05]">
                        {entry.image_url ? (
                          <img
                            src={entry.image_url}
                            alt={entry.name_default}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <span className="text-3xl">
                            {getSpeciesFallbackEmoji(entry.name_default)}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 line-clamp-1 text-[11px] font-semibold text-white/66">
                        {entry.name_default}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p className="text-[13px] leading-relaxed text-white/45">
                    Débloque des espèces pour recevoir des cours reliés à leur rôle écologique.
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-3">
              {home.livingWebCourses.slice(0, 2).map((course) => (
                <Link
                  key={course.id}
                  href={course.entry.href}
                  className={`flex min-h-[5.25rem] items-center gap-4 rounded-[1.25rem] border border-white/8 bg-white/[0.035] p-4 active:bg-white/[0.07] ${learningInteractiveClassName}`}
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-teal-300/10 text-teal-200">
                    <GitBranch className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-black text-white">{course.title}</span>
                    <span className="mt-0.5 block line-clamp-1 text-[12px] font-semibold text-white/42">
                      {course.subject}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}
