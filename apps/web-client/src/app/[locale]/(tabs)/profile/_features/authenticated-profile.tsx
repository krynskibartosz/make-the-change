import { ArrowRight, Bug, Cloud, Crown, Droplets, Flame, Gift, Settings, Target, Sparkles } from 'lucide-react'
import { CurrencyIcon } from '@/components/currency'
import { Link } from '@/i18n/navigation'
import { getBiodexPreviewData } from '@/lib/api/biodex-preview.service'
import { getFactionTheme, resolveFactionThemeKey } from '@/lib/faction-theme'
import { AnimatedMascot } from '@/app/[locale]/(tabs)/profile/_components/animated-mascot'
import { TabScreen } from '@/app/[locale]/(tabs)/_components/tab-screen'
import { ProfileSettingsHeader } from '@/app/[locale]/(tabs)/profile/_components/profile-settings-header'
import { BioDexCard } from '@/app/[locale]/(tabs)/_components/biodex-card'
import { ImpactCard } from '@/app/[locale]/(tabs)/profile/_components/impact-card'
import { formatCompact } from '@/lib/formatters'
import type { Faction } from '@/lib/domain/types'

const FACTION_LABEL: Record<Faction, string> = {
  'Vie Sauvage': 'Melli',
  'Terres & Forêts': 'Sylva',
  'Gardiens des mers': 'Ondine',
}

export default async function AuthenticatedProfile({ profile }: { profile: NonNullable<Awaited<ReturnType<typeof import('@/lib/mock/mock-session-server').getCurrentProfile>>> }) {
  const userFaction: Faction | null = profile?.faction ?? null
  const accentTheme = getFactionTheme(userFaction)
  const factionLabel = userFaction ? FACTION_LABEL[userFaction] : null
  const factionThemeKey = resolveFactionThemeKey(userFaction)
  const { unlockedSpecies, lockedSpecies, unlockedCount, totalCount } = await getBiodexPreviewData({
    unlockedLimit: 2,
    lockedLimit: 2,
  })

  return (
    <TabScreen header={<ProfileSettingsHeader href="/profile/settings" />}>
      <div className="min-h-screen text-white">
        <main className="mx-auto w-full max-w-3xl px-4">
          <section className="relative pt-6">
            <div
              className={`pointer-events-none absolute left-1/2 top-12 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl ${accentTheme.accentGlow}`}
              aria-hidden="true"
            />

            <div className="relative z-10 mx-auto mt-4 h-28 w-28 overflow-hidden rounded-full border-4 border-[#0B0F15] shadow-xl">
              <img
                src={
                  profile?.avatarUrl ||
                  'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?auto=format&fit=crop&w=320&q=80'
                }
                alt={`Avatar de ${profile?.displayName || 'Bartosz Krynski'}`}
                className="h-full w-full object-cover"
              />
            </div>

            <h1 className="mt-3 text-center text-3xl font-black tracking-tight text-white">
              {profile?.displayName || 'Bartosz Krynski'}
            </h1>

            {factionLabel && (
              <p className={`mt-1 text-center text-xs font-bold tracking-wide ${accentTheme.accentText}`}>
                {factionLabel}
              </p>
            )}

            <div
              className={`mx-auto mt-2 flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${accentTheme.badgeClassName} ${accentTheme.accentText} ${accentTheme.accentShadow}`}
            >
              <Flame className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
              {profile?.streakDays || 12} jours de série
            </div>

            <p className="mt-2 text-center text-xs font-medium tracking-wide text-white/60">
              @{profile?.username || 'bartosz_k'} • Membre depuis {(profile?.memberSince || '2026-01-01').slice(0, 4)}
            </p>
          </section>

          <ul className="mb-10 mt-8 grid grid-cols-2 gap-3 m-0 p-0 list-none">
            <li>
              <ImpactCard
                icon={<Bug className="h-5 w-5 text-amber-400" aria-hidden="true" />}
                value={formatCompact(profile?.beesSaved || 3800)}
                label="ABEILLES SOUTENUES"
              />
            </li>

            <li>
              <ImpactCard
                icon={<Droplets className="h-5 w-5 text-orange-400" aria-hidden="true" />}
                value={`${formatCompact(profile?.honeyGeneratedKg || 0.77, true)} kg`}
                label="RÉCOLTE ESTIMÉE"
              />
            </li>

            <li>
              <ImpactCard
                icon={<Cloud className="h-5 w-5 text-sky-400" aria-hidden="true" />}
                value={`${formatCompact(profile?.co2CapturedKg || 3.85, true)} kg`}
                label="CO₂ ASSOCIÉ"
              />
            </li>

            <li>
              <ImpactCard
                icon={<CurrencyIcon kind="impactCredits" className="h-5 w-5" />}
                value={formatCompact(profile?.impactCreditsBalance ?? 2450)}
                label="CRÉDITS IMPACT"
                valueClassName="text-amber-400"
              />
            </li>
          </ul>

          <section className="mb-10 px-0">
            <Link
              href="/profile/subscription"
              className="flex items-center justify-between gap-4 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-5 transition-colors hover:bg-amber-500/20 active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <Crown className="h-6 w-6 text-amber-400" aria-hidden="true" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-amber-400">Devenir Ambassadeur</span>
                  <p className="mt-0.5 text-xs font-medium text-amber-400/80 m-0">Soutenez la biodiversité chaque mois et débloquez une expérience enrichie.</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-amber-400/50" aria-hidden="true" />
            </Link>
          </section>

          <section className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-black tracking-tight text-white">Mon BioDex</h2>
              <span className="text-sm font-bold tabular-nums text-white/60">
                ({unlockedCount} / {totalCount})
              </span>
            </div>

            <ul className="-mx-4 flex list-none snap-x gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden m-0 p-0">
              {unlockedSpecies.map((species) => (
                <li key={species.id}>
                  <BioDexCard
                    species={species}
                    variant="unlocked"
                    href={`/profile/biodex/${species.id}`}
                  />
                </li>
              ))}

              {lockedSpecies.map((species) => (
                <li key={species.id}>
                  <BioDexCard
                    species={species}
                    variant="locked"
                  />
                </li>
              ))}
            </ul>

            <Link
              href="/profile/biodex"
              className="mt-1 inline-flex items-center gap-2 text-sm font-semibold transition-colors text-lime-400"
            >
              Voir la liste complète du BioDex
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>

          {factionLabel ? (
            <section className="mt-8">
              {/* IDENTITY POD */}
              <div className={`relative rounded-3xl border p-5 ${accentTheme.accentBorder} ${accentTheme.accentBgSoft}`}>
                {/* Halo d'ambiance */}
                <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl pointer-events-none" aria-hidden="true">
                  <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl opacity-40 ${accentTheme.accentBg}`} />
                </div>

                {/* LAYOUT HAUT : Mascotte + Infos */}
                <div className="relative z-10 flex flex-row items-center justify-between">
                  <div className="relative -mt-12 h-32 w-[35%] shrink-0 drop-shadow-2xl z-20">
                    <AnimatedMascot themeKey={factionThemeKey === 'neutral' ? 'forets' : factionThemeKey} label={factionLabel} />
                  </div>

                  {/* Infos faction */}
                  <div className="min-w-0 w-[70%] pl-2 text-left pt-2 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
                      Ma mascotte
                    </p>
                    <h2 className={`mt-0.5 text-xl font-black tracking-tight ${accentTheme.accentText}`}>
                      {factionLabel}
                    </h2>
                    <p className="mt-2 text-sm font-medium text-white/60">
                      Ton guide à travers les écosystèmes que tu soutiens.
                    </p>
                  </div>
                </div>

                {/* PONT : CTA */}
                <div className="relative z-10 mt-6 space-y-4">
                  <Link
                    href="/collectif"
                    className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold transition-transform active:scale-[0.98] ${accentTheme.badgeClassName} ${accentTheme.accentText}`}
                  >
                    Voir le collectif
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </section>
          ) : (
            <section className="mt-8">
              {/* GUEST IDENTITY POD */}
              <div className={`relative rounded-3xl border p-5 ${accentTheme.accentBorder} ${accentTheme.accentBgSoft}`}>
                {/* Halo d'ambiance */}
                <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl pointer-events-none" aria-hidden="true">
                  <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl opacity-20 ${accentTheme.accentBg}`} />
                </div>

                {/* LAYOUT HAUT : Icône + Infos */}
                <div className="relative z-10 flex flex-row items-center justify-between">
                  <div className="relative flex -mt-8 h-24 w-[30%] shrink-0 items-center justify-center drop-shadow-2xl" aria-hidden="true">
                    <div className={`absolute inset-0 scale-[1.2] rounded-full blur-2xl opacity-30 ${accentTheme.accentBg}`} />
                    <Target className={`relative z-10 h-10 w-10 scale-[1.1] ${accentTheme.accentText}`} />
                  </div>

                  <div className="min-w-0 w-[70%] pl-2 text-left pt-2 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
                      Ma Faction
                    </p>
                    <h2 className="mt-0.5 text-xl font-black tracking-tight text-white">
                      Aucune Faction
                    </h2>
                    <p className="mt-2 text-balance text-sm font-medium text-white/60">
                      Rejoignez les rangs pour orienter l&apos;effort de l&apos;Essaim.
                    </p>
                  </div>
                </div>

                {/* PONT : Teasing + CTA */}
                <div className="relative z-10 mt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className={`h-4 w-4 shrink-0 ${accentTheme.accentText}`} aria-hidden="true" />
                    <p className="text-xs font-semibold text-white/80">
                      Multipliez votre impact en équipe
                    </p>
                  </div>

                  <Link
                    href="/onboarding/setup"
                    className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold transition-transform active:scale-[0.98] ${accentTheme.badgeClassName} ${accentTheme.accentText}`}
                  >
                    Choisir ma Faction
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </section>
          )}

          <section
            className={`relative mb-8 mt-10 overflow-hidden rounded-3xl border bg-gradient-to-br p-6 text-center ${accentTheme.accentBorder} ${accentTheme.heroGradient}`}
          >
            <div
              className={`pointer-events-none absolute left-1/2 mt-[-3rem] h-40 w-40 -translate-x-1/2 rounded-full blur-3xl ${accentTheme.accentGlow}`}
              aria-hidden="true"
            />
            <div className="relative z-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <Gift className={`h-7 w-7 ${accentTheme.accentTextSoft}`} aria-hidden="true" />
              </div>
              <h3 className="mt-3 text-lg font-black text-white">Invitez vos amis</h3>
              <p className="mb-4 mt-2 text-balance text-sm text-white/70">
                Faites grandir le mouvement. Vous recevez chacun{' '}
                <span className={`font-bold ${accentTheme.accentText}`}>une trace BioDex</span>{' '}
                lorsque votre ami rejoint l&apos;aventure et réalise sa première action.
              </p>
              <button
                type="button"
                className="w-full rounded-xl bg-white py-3 font-bold text-black shadow-lg transition-transform active:scale-95"
              >
                Partager mon lien
              </button>
            </div>
          </section>
        </main>
      </div>
    </TabScreen>
  )
}
