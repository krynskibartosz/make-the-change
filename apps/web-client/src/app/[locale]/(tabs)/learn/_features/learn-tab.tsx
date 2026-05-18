import { ArrowRight, BookOpen, GitBranch, Sparkles } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import {
  MOCK_PROJECT_CORAL_SLUG,
  MOCK_PROJECT_HABEEBEE_SLUG,
  MOCK_PROJECT_MANAKARA_SLUG,
} from '@/lib/mock/mock-ids'
import type { SpeciesContext } from '@/types/species'
import { SeedsFloatingBadge } from './seeds-floating-badge'
import {
  AtlasDomainCard,
  LearningCourseCard,
  LearningPlayButton,
  LearningPathCard,
  LearningScreenIntro,
  LearningSectionTitle,
  PROJECT_LABEL_BY_SLUG,
} from './learning-cards'
import { getAllLearningPaths } from '@/lib/learning/catalog'
import { getLearningHome } from '@/lib/learning/selectors'

type LearnTabProps = {
  seeds: number
  species: SpeciesContext[]
}

const DEFAULT_PROJECT_SLUGS = [
  MOCK_PROJECT_MANAKARA_SLUG,
  MOCK_PROJECT_CORAL_SLUG,
  MOCK_PROJECT_HABEEBEE_SLUG,
]

function getSpeciesFallbackEmoji(name: string): string {
  const normalizedName = name.toLowerCase()
  if (normalizedName.includes('abeille') || normalizedName.includes('bee') || normalizedName.includes('apis')) return '🐝'
  if (normalizedName.includes('corail') || normalizedName.includes('coral') || normalizedName.includes('acropora')) return '🪸'
  if (normalizedName.includes('caméléon') || normalizedName.includes('chameleon')) return '🦎'
  if (normalizedName.includes('lemur') || normalizedName.includes('vari') || normalizedName.includes('lémur')) return '🐒'
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
    speciesIds: unlockedSpeciesIds.length > 0 ? unlockedSpeciesIds : species.slice(0, 6).map((entry) => entry.id),
  })
  const paths = getAllLearningPaths()
  const continueCourse =
    home.continueCourse ??
    home.allCourses.find((course) => course.id === 'academy-le-pouvoir-du-soleil') ??
    home.allCourses[0] ??
    null
  const biodexPreview = species
    .filter((entry) => entry.user_status?.isUnlocked)
    .slice(0, 5)

  return (
    <section className="relative isolate w-full overflow-x-hidden pb-32 pt-[max(1.75rem,env(safe-area-inset-top))] md:pb-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4">
        <LearningScreenIntro title="Apprendre">
          Le hub pour choisir quoi comprendre maintenant : continuer un cours, explorer l’Atlas, relier tes projets,
          approfondir ton BioDex ou ouvrir la Toile vivante.
        </LearningScreenIntro>

        <SeedsFloatingBadge seeds={seeds} />

        {continueCourse && (
          <section>
            <LearningSectionTitle title="Continuer" />
            <div className="overflow-hidden rounded-[1.6rem] border border-teal-200/14 bg-gradient-to-br from-teal-300/12 via-white/[0.045] to-emerald-300/6 p-4">
              <div className="flex items-start gap-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[22px] bg-teal-300 text-[#04110e] shadow-lg shadow-teal-300/15">
                  <BookOpen className="h-7 w-7" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-teal-100/55">
                    {continueCourse.theme} · {continueCourse.durationMinutes} min
                  </p>
                  <h2 className="mt-1 text-[20px] font-black leading-tight text-white">{continueCourse.title}</h2>
                  <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-white/50">
                    {continueCourse.subtitle}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <LearningPlayButton course={continueCourse} returnTo="/learn" label="Continuer" />
                <Link
                  href={`/learn/courses/${continueCourse.id}`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 text-[14px] font-black text-white/70 active:bg-white/[0.06]"
                >
                  Voir la fiche <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>
        )}

        <section>
          <LearningSectionTitle title="Pour toi aujourd’hui" href="/learn/courses?duration=5" action="Cours courts" />
          <div className="grid gap-3 md:grid-cols-2">
            {home.today.slice(0, 4).map((course) => (
              <LearningCourseCard key={course.id} course={course} compact />
            ))}
          </div>
        </section>

        <section>
          <LearningSectionTitle title="Lié à tes projets" href="/learn/courses?project=all" action="Explorer" />
          <div className="grid gap-3 md:grid-cols-3">
            {home.projectGroups.map((group) => (
              <div key={group.projectSlug} className="rounded-[1.35rem] border border-white/8 bg-white/[0.035] p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-teal-200/60">
                  {PROJECT_LABEL_BY_SLUG[group.projectSlug] ?? group.projectSlug}
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  {group.courses.slice(0, 3).map((course) => (
                    <Link
                      key={course.id}
                      href={`/learn/courses/${course.id}`}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.045] px-3 py-2 text-[13px] font-semibold text-white/75 active:bg-white/[0.07]"
                    >
                      <span className="line-clamp-1">{course.title}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/30" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <LearningSectionTitle title="Explorer par thème" href="/learn/atlas" action="Atlas" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {home.atlasDomains.map((domain) => (
              <AtlasDomainCard key={domain.id} domain={domain} />
            ))}
          </div>
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
          <LearningSectionTitle title="Toile vivante" href="/ecosysteme" action="Ouvrir" />
          <div className="grid gap-3 md:grid-cols-3">
            {home.livingWebCourses.map((course) => (
              <Link
                key={course.id}
                href={course.entry.href}
                className="block rounded-[1.35rem] border border-white/8 bg-white/[0.045] p-4 active:bg-white/[0.07]"
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-300/10 text-teal-200">
                  <GitBranch className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-[16px] font-black leading-tight text-white">{course.title}</h3>
                <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-white/48">{course.subtitle}</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <LearningSectionTitle title="BioDex à approfondir" href="/profile/biodex" action="BioDex" />
          <div className="grid gap-3 md:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[1.35rem] border border-white/8 bg-white/[0.035] p-4">
              <div className="flex flex-wrap gap-3">
                {biodexPreview.length > 0 ? biodexPreview.map((entry) => (
                  <Link key={entry.id} href={`/profile/biodex/${entry.id}`} className="w-[84px] shrink-0">
                    <div className="grid aspect-square place-items-center overflow-hidden rounded-[18px] bg-white/[0.05]">
                      {entry.image_url ? (
                        <img src={entry.image_url} alt={entry.name_default} className="h-full w-full object-contain" />
                      ) : (
                        <span className="text-3xl">{getSpeciesFallbackEmoji(entry.name_default)}</span>
                      )}
                    </div>
                    <p className="mt-2 line-clamp-1 text-[11px] font-semibold text-white/70">{entry.name_default}</p>
                  </Link>
                )) : (
                  <p className="text-[13px] leading-relaxed text-white/45">
                    Débloque des espèces dans le BioDex pour recevoir des cours reliés à leur rôle écologique.
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-3">
              {home.biodexCourses.slice(0, 3).map((course) => (
                <LearningCourseCard key={course.id} course={course} compact />
              ))}
            </div>
          </div>
        </section>

        <section>
          <Link
            href="/learn/courses"
            className="flex items-center justify-between gap-4 rounded-[1.6rem] border border-white/8 bg-white/[0.045] p-5 active:bg-white/[0.07]"
          >
            <div>
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-teal-200/60">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Tous les cours
              </div>
              <h2 className="mt-2 text-[20px] font-black text-white">Recherche, filtres et catalogue complet</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-white/48">
                Domaine, niveau, durée, projet, BioDex : retrouve chaque cours par son contexte d’usage.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-white/35" aria-hidden="true" />
          </Link>
        </section>
      </div>
    </section>
  )
}
