import type { LucideIcon } from 'lucide-react'
import { Atom, ChevronRight, Flower2, Sprout, TreePine, Waves } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import type { SpeciesContext } from '@/types/species'
import { SeedsFloatingBadge } from './seeds-floating-badge'

type LearnTabProps = {
  seeds: number
  species: SpeciesContext[]
}

type ProjectModule = {
  id: string
  title: string
  context: string
  detail: string
  reward: string
  imageUrl: string
  href: string
}

type LearningPath = {
  id: string
  title: string
  subtitle: string
  progress: number
  icon: LucideIcon
  active: boolean
  href: string
}

type Ecosystem = {
  id: string
  title: string
  subtitle: string
  count: string
  icon: LucideIcon
  accentClass: string
  nodes: string[]
  locked: boolean
  href: string
}

const PROJECT_MODULES: ProjectModule[] = [
  {
    id: 'honey-chain',
    title: 'De la ruche au pot de miel',
    context: 'Ilanga Nature · Manakara',
    detail: 'Module terrain · 5 min',
    reward: '+70 Graines',
    imageUrl: '/images/projects/miellerie-manakara.png',
    href: '/ecosysteme/foret-manakara',
  },
  {
    id: 'coral-cutting',
    title: 'Comment bouture-t-on un corail ?',
    context: 'Récif · Karimunjawa',
    detail: 'Making-of · 7 min',
    reward: '+90 Graines',
    imageUrl: '/images/projects/coral-karimunjawa.png',
    href: '/ecosysteme/recif-karimunjawa',
  },
]

const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'mechanics',
    title: 'Mécanique du Vivant',
    subtitle: 'Les bases pour comprendre les écosystèmes.',
    progress: 28,
    icon: Atom,
    active: true,
    href: '/academy',
  },
  {
    id: 'pollinators',
    title: 'Pollinisation & récoltes',
    subtitle: 'Abeilles, fleurs, fruits et producteurs.',
    progress: 0,
    icon: Flower2,
    active: false,
    href: '/academy/chapters',
  },
  {
    id: 'oceans',
    title: 'Récifs & océans vivants',
    subtitle: 'Coraux, refuges et restauration marine.',
    progress: 0,
    icon: Waves,
    active: false,
    href: '/academy/chapters',
  },
]

const ECOSYSTEMS: Ecosystem[] = [
  {
    id: 'manakara',
    title: 'Forêt de Manakara',
    subtitle: 'Abeilles, sols, orchidées et canopée',
    count: '7 liens',
    icon: TreePine,
    accentClass: 'bg-gradient-to-br from-emerald-400/20 to-teal-500/8 text-emerald-200',
    nodes: ['Abeille', 'Orchidées', 'Tavy'],
    locked: false,
    href: '/ecosysteme/foret-manakara',
  },
  {
    id: 'reef',
    title: 'Récif de Karimunjawa',
    subtitle: 'Coraux, poissons refuges et stress thermique',
    count: '6 liens',
    icon: Waves,
    accentClass: 'bg-gradient-to-br from-cyan-400/20 to-blue-500/8 text-cyan-200',
    nodes: ['Corail', 'Poisson-clown', 'Tortue'],
    locked: false,
    href: '/ecosysteme/recif-karimunjawa',
  },
  {
    id: 'pollinators-belgium',
    title: 'Pollinisateurs de Belgique',
    subtitle: 'Haies, bourdons, osmies et auxiliaires',
    count: 'Bientôt',
    icon: Flower2,
    accentClass: 'bg-gradient-to-br from-amber-400/12 to-yellow-500/5 text-amber-200/50',
    nodes: ['Bourdon', 'Osmie', 'Haie'],
    locked: true,
    href: '/ecosysteme/pollinisateurs-belgique',
  },
]

function getRarityInfo(status: string | null | undefined) {
  switch (status?.toUpperCase()) {
    case 'EN':
    case 'CR':
    case 'EW':
    case 'EX':
      return { label: 'Légendaire', color: 'text-amber-400/75' }
    case 'VU':
    case 'NT':
      return { label: 'Rare', color: 'text-blue-400/70' }
    default:
      return { label: 'Commun', color: 'text-emerald-500/60' }
  }
}

function getSpeciesFallbackEmoji(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('abeille') || n.includes('bee') || n.includes('apis')) return '🐝'
  if (n.includes('corail') || n.includes('coral') || n.includes('acropora')) return '🪸'
  if (n.includes('caméléon') || n.includes('chameleon')) return '🦎'
  if (n.includes('lemur') || n.includes('vari') || n.includes('lémur')) return '🐒'
  if (n.includes('tortue') || n.includes('turtle')) return '🐢'
  if (n.includes('baleine') || n.includes('whale') || n.includes('dauphin')) return '🐋'
  if (n.includes('aigle') || n.includes('eagle')) return '🦅'
  if (n.includes('papillon') || n.includes('butterfly')) return '🦋'
  return '🌿'
}

export function LearnTab({ seeds, species }: LearnTabProps) {
  const sortedPreview = [
    ...species.filter((s) => s.user_status?.isUnlocked),
    ...species.filter((s) => !s.user_status?.isUnlocked),
  ].slice(0, 6)

  const missionSpecies =
    species.find((s) => s.id === 'species-abeille-noire') ??
    species.find((s) => s.user_status?.isUnlocked) ??
    null

  return (
    <section className="relative isolate w-full overflow-x-hidden pb-32 pt-[max(1.75rem,env(safe-area-inset-top))] md:pb-10">

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4">

        {/* ── Intro ── */}
        <div className="px-1 pt-2">
          <h1 className="text-[26px] font-black tracking-tight text-white">Apprendre</h1>
          <p className="mt-2 text-[15px] font-medium leading-relaxed text-white/55">
            Comprends le vivant à travers des leçons, des espèces et les projets que tu soutiens.
          </p>
        </div>

        {/* Sentinel + badge flottant Graines — apparaît après le scroll de l'intro */}
        <SeedsFloatingBadge seeds={seeds} />

        {/* ── 1. Continuer ── */}
        <section>
          <h2 className="mb-4 px-1 text-xl font-black tracking-tight text-white">Continuer</h2>
          <Link
            href="/academy"
            className="group block overflow-hidden rounded-[1.75rem] border border-teal-200/14 bg-gradient-to-br from-teal-300/12 via-white/[0.045] to-emerald-300/6 transition-transform active:scale-[0.985]"
          >
            <div className="flex gap-3 p-4">
              <div className="relative grid h-[66px] w-[66px] shrink-0 place-items-center rounded-[22px] bg-black/20">
                <div className="absolute inset-0 rounded-[22px] bg-[radial-gradient(circle,rgba(45,255,193,.22),transparent_58%)]" />
                <div className="relative grid h-10 w-10 place-items-center rounded-full bg-teal-300 text-[#04110e] shadow-md shadow-teal-300/25">
                  <Atom className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
              <div className="min-w-0 flex-1 py-0.5">
                <p className="text-[10px] font-bold text-teal-100/50">Chapitre 1 · Mécanique du Vivant</p>
                <h3 className="mt-0.5 text-[17px] font-black leading-tight tracking-tight text-white">L'Alphabet Originel</h3>
                <p className="mt-1 line-clamp-1 text-[12px] text-white/45">Comprends les forces invisibles qui relient l'eau, le soleil, les sols et les espèces.</p>
              </div>
            </div>
            <div className="border-t border-white/[0.06] px-4 py-3">
              <div className="mb-2 flex items-center justify-between text-[11px]">
                <span className="text-white/48">8 / 28 unités</span>
                <span className="font-black text-teal-200">28 %</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[28%] rounded-full bg-gradient-to-r from-teal-300 to-lime-300" />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-[11px] text-white/42">
                  <Sprout className="h-3.5 w-3.5 text-teal-200" aria-hidden="true" />
                  +60 Graines · 3 min
                </span>
                <span className="flex h-8 items-center gap-1 rounded-xl bg-teal-300 px-3 text-[12px] font-black text-[#04110e]">
                  Continuer <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </div>
            </div>
          </Link>
        </section>

        {/* ── 2. Lié à tes projets ── */}
        <section>
          <h2 className="mb-4 px-1 text-xl font-black tracking-tight text-white">Lié à tes projets</h2>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {PROJECT_MODULES.map((module) => (
              <li key={module.id}>
                <Link
                  href={module.href}
                  className="flex items-center gap-4 rounded-[1.5rem] border border-white/7 bg-white/[0.045] p-4 transition-colors active:bg-white/[0.07]"
                >
                  <div className="h-[60px] w-[60px] shrink-0 overflow-hidden rounded-2xl bg-white/5">
                    <img src={module.imageUrl} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-white/40">{module.context} · {module.detail}</p>
                    <h3 className="mt-0.5 text-[14px] font-semibold leading-snug text-white">{module.title}</h3>
                    <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-teal-200/75">
                      <Sprout className="h-3 w-3" aria-hidden="true" /> {module.reward}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-white/25" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ── 3. Mission espèce ── */}
        {missionSpecies && (
          <section>
            <h2 className="mb-4 px-1 text-xl font-black tracking-tight text-white">Mission espèce</h2>
            <Link
              href={`/profile/biodex/${missionSpecies.id}`}
              className="group block overflow-hidden rounded-[1.75rem] border border-teal-200/12 bg-gradient-to-br from-teal-300/10 via-white/[0.035] to-emerald-300/6 transition-transform active:scale-[0.985]"
            >
              <div className="flex gap-4 p-4">
                <div className="relative h-[96px] w-[96px] shrink-0 overflow-hidden rounded-[22px] bg-black/20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(45,255,193,.18),transparent_60%)]" />
                  {missionSpecies.image_url ? (
                    <img
                      src={missionSpecies.image_url}
                      alt={missionSpecies.name_default}
                      className="relative h-full w-full object-contain"
                    />
                  ) : (
                    <div className="relative grid h-full w-full place-items-center">
                      <span className="text-[44px]">{getSpeciesFallbackEmoji(missionSpecies.name_default)}</span>
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 py-0.5">
                  <p className="text-[10px] font-bold text-teal-100/50">Mission espèce</p>
                  <h3 className="mt-0.5 text-[17px] font-black leading-tight text-white">{missionSpecies.name_default}</h3>
                  <p className="mt-0.5 text-[11px] italic text-white/32">{missionSpecies.scientific_name}</p>
                  <p className="mt-1.5 line-clamp-2 text-[12px] leading-snug text-white/48">
                    Comprends son rôle dans la pollinisation et ses liens avec la forêt de Manakara.
                  </p>
                </div>
              </div>
              <div className="border-t border-white/[0.06] px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-semibold text-white/70">4 étapes · +120 Graines</p>
                    <p className="mt-0.5 text-[11px] font-medium text-teal-200/60">Révèle un lien dans la Toile vivante</p>
                  </div>
                  <span className="rounded-full bg-teal-300 px-3 py-1.5 text-[12px] font-black text-[#04110e]">
                    Commencer
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* ── 4. Parcours ── */}
        <section>
          <h2 className="mb-4 px-1 text-xl font-black tracking-tight text-white">Parcours</h2>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {LEARNING_PATHS.map((path) => {
              const Icon = path.icon
              return (
                <li key={path.id}>
                  <Link
                    href={path.href}
                    className={cn(
                      'flex items-center gap-3 rounded-[1.25rem] border p-3.5 transition-colors active:bg-white/[0.07]',
                      path.active
                        ? 'border-teal-200/18 bg-teal-300/8'
                        : 'border-white/7 bg-white/[0.04]',
                    )}
                  >
                    <span
                      className={cn(
                        'grid h-10 w-10 shrink-0 place-items-center rounded-2xl',
                        path.active ? 'bg-teal-300 text-[#04110e]' : 'bg-white/[0.06] text-white/38',
                      )}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className={cn('text-[14px] font-semibold', path.active ? 'text-white' : 'text-white/75')}>
                        {path.title}
                      </h3>
                      <p className="mt-0.5 line-clamp-1 text-[12px] text-white/38">{path.subtitle}</p>
                    </div>
                    <span className={cn('shrink-0 text-[12px] font-black', path.active ? 'text-teal-200' : 'text-white/30')}>
                      {path.progress} %
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-white/22" aria-hidden="true" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>

        {/* ── 5. Toile vivante ── */}
        <section>
          <h2 className="mb-1 px-1 text-xl font-black tracking-tight text-white">Toile vivante</h2>
          <p className="mb-4 px-1 text-[13px] font-medium leading-snug text-white/42">
            Explore les connexions entre espèces, habitats, menaces et projets.
          </p>
          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ECOSYSTEMS.map((eco) => {
              const Icon = eco.icon
              return (
                <Link
                  key={eco.id}
                  href={eco.href}
                  className={cn(
                    'w-[192px] shrink-0 snap-start rounded-[1.5rem] border border-white/8 p-4 transition-transform active:scale-[0.97]',
                    eco.locked ? 'bg-white/[0.025] opacity-55' : 'bg-white/[0.05]',
                  )}
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <span className={cn('flex h-10 w-10 items-center justify-center rounded-[14px]', eco.accentClass)}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className={cn(
                      'mt-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                      eco.locked ? 'text-white/25' : 'bg-white/[0.06] text-white/52',
                    )}>
                      {eco.count}
                    </span>
                  </div>
                  <h3 className="line-clamp-2 text-[14px] font-semibold leading-tight text-white">{eco.title}</h3>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-white/42">{eco.subtitle}</p>
                  {!eco.locked && (
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {eco.nodes.map((node) => (
                        <span key={node} className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] text-white/48">
                          {node}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className={cn('mt-3 text-[12px] font-black', eco.locked ? 'text-white/25' : 'text-teal-200')}>
                    {eco.locked ? 'Bientôt' : 'Explorer →'}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ── 6. Mon BioDex ── */}
        <section>
          <div className="mb-4 flex items-center justify-between gap-4 px-1">
            <h2 className="text-xl font-black tracking-tight text-white">Mon BioDex</h2>
            <Link
              href="/profile/biodex"
              className="flex items-center gap-1 text-sm font-black text-teal-300 active:text-teal-200"
            >
              Voir tout <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sortedPreview.map((sp) => {
              const isLocked = !sp.user_status?.isUnlocked
              const rarity = getRarityInfo(sp.conservation_status)
              return (
                <Link
                  key={sp.id}
                  href={`/profile/biodex/${sp.id}`}
                  className="w-[128px] shrink-0 snap-start"
                >
                  <div className="aspect-square w-full overflow-hidden rounded-[18px] bg-white/[0.04]">
                    {sp.image_url ? (
                      <img
                        src={sp.image_url}
                        alt={sp.name_default}
                        className={cn('h-full w-full object-contain', isLocked && 'grayscale opacity-40 blur-sm')}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className={cn('text-[40px]', isLocked && 'opacity-20')}>
                          {getSpeciesFallbackEmoji(sp.name_default)}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className={cn('mt-2 line-clamp-1 text-[12px] font-semibold', isLocked ? 'text-white/28' : 'text-white/85')}>
                    {sp.name_default}
                  </p>
                  <p className={cn('text-[10px] font-medium uppercase tracking-wide', isLocked ? 'text-white/15' : rarity.color)}>
                    {rarity.label}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>

      </div>
    </section>
  )
}
