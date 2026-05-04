import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Compass,
  Lock,
  Package,
  PawPrint,
  ShieldCheck,
  Sparkles,
  Sprout,
  UsersRound,
} from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getFactionTheme, resolveFactionThemeKey } from '@/lib/faction-theme'
import type { Faction } from '@/lib/mock/types'
import { cn } from '@/lib/utils'

export type AdventureQuestCard = {
  id: string
  title: string
  description: string
  href: string
  reward: number
  progress: number
  max: number
  type: 'education' | 'social' | 'daily_harvest'
  cta: string
}

export type AdventureProjectCard = {
  name: string
  description: string
  href: string
  location: string
  imageUrl: string | null
  fundingProgress: number
  typeLabel: string
  speciesName: string | null
}

export type AdventureSpeciesCard = {
  name: string
  scientificName: string | null
  imageUrl: string | null
  conservationStatus: string | null
  isUnlocked: boolean
  href: string
}

export type AdventureTabProps = {
  displayName: string | null
  faction: Faction | null
  dayLabel: string
  monthlyObjective: string
  monthlyProgress: number
  monthlyMax: number
  primaryQuest: AdventureQuestCard | null
  quests: AdventureQuestCard[]
  recommendedProject: AdventureProjectCard | null
  featuredSpecies: AdventureSpeciesCard | null
  collectiveProgress: number
  impactPoints: number
}

type FactionPresentation = {
  label: string
  mascotName: string
  mascotImage: string
  headline: string
  message: string
}

const FACTION_PRESENTATION: Record<
  ReturnType<typeof resolveFactionThemeKey>,
  FactionPresentation
> = {
  neutral: {
    label: 'Exploration libre',
    mascotName: 'Melli',
    mascotImage: '/abeille-transparente.png',
    headline: 'Choisis ton prochain pas pour le vivant.',
    message: 'Apprends, soutiens un projet concret et fais grandir ton impact.',
  },
  pollinisateurs: {
    label: 'Vie Sauvage',
    mascotName: 'Melli',
    mascotImage: '/abeille-transparente.png',
    headline: "Melli a repéré une action utile pour aujourd'hui.",
    message: 'Fais avancer les pollinisateurs sans perdre le fil de ton impact.',
  },
  forets: {
    label: 'Terres et Forêts',
    mascotName: 'Sylva',
    mascotImage: '/sylva.png',
    headline: "Sylva t'ouvre un chemin court et concret.",
    message: 'Un apprentissage, un projet, une espèce: garde le vivant visible.',
  },
  mers: {
    label: 'Gardiens des mers',
    mascotName: 'Ondine',
    mascotImage: '/ondine.png',
    headline: 'Ondine garde le cap sur ton impact du jour.',
    message: 'Explore, comprends et soutiens les écosystèmes qui en ont besoin.',
  },
}

const QUEST_ICONS: Record<AdventureQuestCard['type'], LucideIcon> = {
  education: BookOpen,
  social: UsersRound,
  daily_harvest: Sparkles,
}

function getProgressPercent(progress: number, max: number) {
  if (max <= 0) return 0
  return Math.min(Math.max((progress / max) * 100, 0), 100)
}

function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div
      className={cn(
        'h-2 overflow-hidden rounded-full bg-white/[0.07] ring-1 ring-white/[0.03]',
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-lime-400 shadow-[0_0_18px_rgba(163,230,53,0.36)]"
        style={{ width: `${Math.round(value)}%` }}
      />
    </div>
  )
}

function ProgressRing({ value, label }: { value: number; label: string }) {
  const roundedValue = Math.round(Math.min(Math.max(value, 0), 100))

  return (
    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r="32"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="8"
        />
        <circle
          cx="40"
          cy="40"
          r="32"
          fill="none"
          stroke="currentColor"
          strokeDasharray={`${roundedValue * 2.01} 201`}
          strokeLinecap="round"
          strokeWidth="8"
          className="text-lime-400 drop-shadow-[0_0_10px_rgba(163,230,53,0.45)]"
        />
      </svg>
      <span className="text-lg font-black tabular-nums text-white">{roundedValue}%</span>
      <span className="sr-only">{label}</span>
    </div>
  )
}

export function AdventureTab({
  displayName,
  faction,
  dayLabel,
  monthlyObjective,
  monthlyProgress,
  monthlyMax,
  primaryQuest,
  quests,
  recommendedProject,
  featuredSpecies,
  collectiveProgress,
  impactPoints,
}: AdventureTabProps) {
  const themeKey = resolveFactionThemeKey(faction)
  const presentation = FACTION_PRESENTATION[themeKey]
  const theme = getFactionTheme(faction)
  const firstName = displayName?.split(' ')[0] || 'Explorateur'
  const primaryIcon = primaryQuest ? QUEST_ICONS[primaryQuest.type] : Compass
  const PrimaryIcon = primaryIcon
  const academyProgress = getProgressPercent(monthlyProgress, monthlyMax)
  const questProgress = primaryQuest
    ? getProgressPercent(primaryQuest.progress, primaryQuest.max)
    : 0
  const completedQuests = quests.filter((quest) => quest.progress >= quest.max).length
  const biodexActionsLeft = featuredSpecies?.isUnlocked ? 0 : Math.max(2 - completedQuests, 1)
  const speciesName = featuredSpecies?.name || 'emblématique'
  const projectName = recommendedProject?.name || 'Projet de restauration'

  return (
    <section className="relative isolate w-full overflow-x-hidden pb-32 md:pb-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[-2] h-[24rem] bg-gradient-to-b from-white/[0.03] to-[#0B0F15]" />
      <div
        className={cn(
          'pointer-events-none absolute left-1/2 top-[-10%] z-[-1] h-[500px] w-[120%] -translate-x-1/2 rounded-full blur-[100px] opacity-15',
          theme.accentGlow,
        )}
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col pb-8 pt-2">
        <div className="mb-8 flex flex-col">
          <div className="px-5 pb-5">
            <h1 className="text-[26px] font-black tracking-tight text-white">
              Salut {firstName} !
            </h1>
            <p className="mt-1 text-sm font-medium leading-relaxed text-white/60">
              L'espèce <strong className="text-white">{speciesName}</strong> a besoin de la faction{' '}
              <strong className={cn(theme.accentText)}>{presentation.label}</strong> aujourd'hui.
            </p>
          </div>

          <div className="px-4">
            <article className="overflow-hidden rounded-[28px] border border-white/10 bg-[#15151A]/90 shadow-[0_18px_60px_rgba(0,0,0,0.36)] backdrop-blur-xl">
              <div className="relative h-52 overflow-hidden bg-[#080b0f]">
                <div className="absolute inset-0 grid grid-cols-2">
                  <div className="relative bg-[#080b0f]">
                    {featuredSpecies?.imageUrl ? (
                      <img
                        src={featuredSpecies.imageUrl}
                        alt=""
                        className={cn(
                          'h-full w-full object-cover',
                          !featuredSpecies.isUnlocked && 'grayscale opacity-35',
                        )}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-white/[0.03]">
                        <PawPrint className="h-12 w-12 text-white/15" />
                      </div>
                    )}
                    {!featuredSpecies?.isUnlocked && (
                      <div className="absolute left-3 top-3 rounded-full bg-black/55 p-1.5 backdrop-blur-sm">
                        <Lock className="h-3.5 w-3.5 text-white/75" />
                      </div>
                    )}
                  </div>
                  <div className="relative bg-[#10151c]">
                    {recommendedProject?.imageUrl ? (
                      <img
                        src={recommendedProject.imageUrl}
                        alt=""
                        className="h-full w-full object-cover opacity-95"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-white/[0.03]">
                        <Sprout className="h-12 w-12 text-white/15" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-y-0 left-1/2 -ml-8 w-16 bg-gradient-to-r from-[#080b0f] via-[#080b0f]/45 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/72 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em]',
                        theme.badgeClassName,
                        theme.accentText,
                      )}
                    >
                      {recommendedProject?.typeLabel || 'Mission terrain'}
                    </span>
                    <span className="rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/60 backdrop-blur-sm">
                      {recommendedProject?.location || 'Terrain partenaire'}
                    </span>
                  </div>
                  <h2 className="text-lg font-black leading-tight text-white drop-shadow-md">
                    {projectName}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-white/68 drop-shadow-md">
                    {recommendedProject?.description ||
                      'Un projet concret pour protéger le vivant.'}
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-4 pt-3">
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs font-bold text-white/52">
                    <span>{recommendedProject?.speciesName || speciesName}</span>
                    <span className="tabular-nums">
                      {Math.round(recommendedProject?.fundingProgress ?? 0)}%
                    </span>
                  </div>
                  <ProgressBar value={recommendedProject?.fundingProgress ?? 0} />
                </div>

                <Link
                  href={recommendedProject?.href || '/projects'}
                  className={cn(
                    'flex h-14 w-full items-center justify-center gap-2 rounded-[20px] text-[17px] font-black text-[#0B0F15] transition-transform active:scale-[0.98]',
                    theme.accentBg,
                    theme.accentShadow,
                  )}
                >
                  Soutenir & Débloquer
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          </div>
        </div>

        <div className="space-y-4 px-4">
          <div className="flex items-end justify-between px-1">
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">
                Prochaines actions
              </h2>
              <p className="mt-1 text-sm font-medium text-white/64">
                Des widgets qui poussent la mission, pas un menu.
              </p>
            </div>
          </div>

          <Link
            href="/challenges"
            className="group block overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.055] shadow-[0_14px_44px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-transform active:scale-[0.985]"
          >
            <div className="grid grid-cols-[5.5rem_1fr] gap-4 p-4">
              <div
                className={cn(
                  'relative flex min-h-28 items-center justify-center overflow-hidden rounded-[22px] border border-white/10',
                  theme.accentBgSoft,
                )}
              >
                <div className={cn('absolute inset-0 opacity-50', theme.accentGlow)} />
                <BookOpen className={cn('relative h-9 w-9', theme.accentText)} />
                <Sparkles className="absolute right-3 top-3 h-4 w-4 text-white/45" />
              </div>
              <div className="min-w-0 py-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-white/36">
                    Academy
                  </p>
                  <span className="rounded-full bg-white/[0.06] px-2 py-1 text-[10px] font-bold text-white/54">
                    {dayLabel}
                  </span>
                </div>
                <h3 className="mt-2 text-[17px] font-black leading-tight text-white">
                  {monthlyObjective}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-white/52">
                  Continue le chapitre en cours et transforme ton apprentissage en graines d'impact.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <ProgressBar value={academyProgress} className="flex-1" />
                  <span className={cn('text-xs font-black tabular-nums', theme.accentText)}>
                    {Math.round(academyProgress)}%
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <Link
            href={primaryQuest?.href || '/challenges'}
            className="block rounded-[26px] border border-white/10 bg-[#15151A]/92 p-4 shadow-[0_14px_44px_rgba(0,0,0,0.24)] backdrop-blur-xl transition-transform active:scale-[0.985]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 gap-3">
                <span
                  className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-white/[0.06]',
                    theme.accentText,
                  )}
                >
                  {primaryQuest && primaryQuest.progress >= primaryQuest.max ? (
                    <CheckCircle2 className="h-6 w-6 text-lime-400" />
                  ) : (
                    <PrimaryIcon className="h-6 w-6" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-white/36">
                    Défi du jour
                  </p>
                  <h3 className="mt-1 text-[16px] font-black leading-tight text-white">
                    {primaryQuest?.title || "Aucune quête pour aujourd'hui"}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-white/52">
                    {primaryQuest?.description ||
                      'Reviens demain pour une nouvelle contribution gratuite.'}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <span
                  className={cn(
                    'rounded-full border px-2.5 py-1 text-xs font-black tabular-nums',
                    primaryQuest && primaryQuest.progress >= primaryQuest.max
                      ? 'border-lime-400/30 bg-lime-400/10 text-lime-300'
                      : 'border-white/10 bg-white/[0.05] text-white/64',
                  )}
                >
                  {primaryQuest ? `${primaryQuest.progress}/${primaryQuest.max}` : '0/1'}
                </span>
                <ChevronRight className="h-4 w-4 text-white/24" />
              </div>
            </div>
            {primaryQuest && (
              <div className="mt-4 flex items-center gap-3">
                <ProgressBar value={questProgress} className="flex-1" />
                <span className="flex items-center gap-1 text-xs font-black text-lime-300">
                  +{primaryQuest.reward}
                  <Sprout className="h-3.5 w-3.5" />
                </span>
              </div>
            )}
          </Link>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              href={featuredSpecies?.href || '/profile/biodex'}
              className="group block min-h-48 overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.055] p-4 shadow-[0_14px_44px_rgba(0,0,0,0.24)] backdrop-blur-xl transition-transform active:scale-[0.985]"
            >
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.14em] text-white/36">
                      BioDex
                    </p>
                    <h3 className="mt-1 text-[17px] font-black text-white">
                      {featuredSpecies?.isUnlocked ? 'Espèce suivie' : 'Débloque ton BioDex'}
                    </h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-black/25 p-2">
                    {featuredSpecies?.isUnlocked ? (
                      <PawPrint className="h-4 w-4 text-lime-300" />
                    ) : (
                      <Lock className="h-4 w-4 text-white/60" />
                    )}
                  </span>
                </div>
                <div className="mt-5 flex items-end gap-4">
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-[#080b0f]">
                    {featuredSpecies?.imageUrl ? (
                      <img
                        src={featuredSpecies.imageUrl}
                        alt=""
                        className={cn(
                          'h-full w-full object-cover',
                          !featuredSpecies.isUnlocked && 'grayscale opacity-25',
                        )}
                      />
                    ) : (
                      <PawPrint className="h-9 w-9 text-white/12" />
                    )}
                    {!featuredSpecies?.isUnlocked && (
                      <div className="absolute inset-0 bg-black/18" />
                    )}
                  </div>
                  <div className="min-w-0 pb-1">
                    <p className="line-clamp-3 text-sm font-semibold leading-snug text-white/68">
                      {featuredSpecies?.isUnlocked
                        ? `${speciesName} est dans ton carnet vivant.`
                        : `Plus que ${biodexActionsLeft} actions pour révéler ${speciesName}.`}
                    </p>
                    <p className={cn('mt-2 text-xs font-black', theme.accentText)}>
                      Voir le BioDex
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              href="/impact"
              className="block min-h-48 rounded-[26px] border border-white/10 bg-[#15151A]/92 p-4 shadow-[0_14px_44px_rgba(0,0,0,0.24)] backdrop-blur-xl transition-transform active:scale-[0.985]"
            >
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.14em] text-white/36">
                      Objectif de faction
                    </p>
                    <h3 className="mt-1 text-[17px] font-black leading-tight text-white">
                      {presentation.label} est presque au but
                    </h3>
                  </div>
                  <ShieldCheck className={cn('h-5 w-5', theme.accentText)} />
                </div>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-snug text-white/64">
                      Chaque action collective renforce la saison en cours.
                    </p>
                    <p className="mt-2 text-xs font-bold text-white/38">
                      {formatImpactPoints(impactPoints)} crédits impact disponibles
                    </p>
                  </div>
                  <ProgressRing
                    value={collectiveProgress}
                    label={`Objectif de faction ${Math.round(collectiveProgress)}%`}
                  />
                </div>
              </div>
            </Link>
          </div>

          <Link
            href="/products"
            className="flex items-center justify-between rounded-[24px] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl transition-transform active:scale-[0.985]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-white/[0.06] text-amber-300">
                <Package className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[15px] font-black text-white">Avantages disponibles</p>
                <p className="text-xs font-medium text-white/46">
                  Convertis tes crédits en récompenses utiles.
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-white/24" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function formatImpactPoints(value: number) {
  return new Intl.NumberFormat('fr-FR', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}
