import { ArrowRight, Bug, Crown, Droplets, Flame, Gift, Lock, Settings, Sparkles, Target, Trophy, Wind, Sprout } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getBiodexPreviewData } from '@/lib/api/biodex-preview.service'
import { getFactionTheme } from '@/lib/faction-theme'
import { getCollectiveGoal, getFactionContribution } from '@/lib/mock/mock-factions'
import { getCurrentProfile } from '@/lib/mock/mock-session-server'

export default async function ProfilePage() {
  const profile = await getCurrentProfile()
  const accentTheme = getFactionTheme(profile?.faction ?? null)
  const collectiveGoal = getCollectiveGoal()
  const factionContribution = getFactionContribution(profile?.faction ?? null)
  const { unlockedSpecies, lockedSpecies, unlockedCount, totalCount } = await getBiodexPreviewData({
    unlockedLimit: 2,
    lockedLimit: 2,
  })

  return (
    <div className="min-h-screen bg-[#0B0F15] pb-32 text-white">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0B0F15]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-end px-4">
          <Link
            href="/dashboard/settings"
            aria-label="Parametres"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4">
        <section className="relative pt-6">
          <div
            className={`pointer-events-none absolute left-1/2 top-12 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl ${accentTheme.accentGlow}`}
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

          <div
            className={`mx-auto mt-2 flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${accentTheme.badgeClassName} ${accentTheme.accentText} ${accentTheme.accentShadow}`}
          >
            <Flame className="h-3.5 w-3.5 fill-current" />
            {profile?.streakDays || 12} jours de serie
          </div>

          <p className="mt-2 text-center text-xs font-medium tracking-wide text-white/60">
            @{profile?.username || 'bartosz_k'} • Membre depuis {(profile?.memberSince || '2026-01-01').slice(0, 4)}
          </p>
        </section>

        <section className="mb-10 mt-8 grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center">
            <Bug className="h-5 w-5 text-amber-400" />
            <div className="mt-2 text-2xl font-black tabular-nums text-white">
              {(profile?.beesSaved || 3800).toLocaleString('fr-FR')}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-widest text-white/50">ABEILLES SAUVÉES</div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center">
            <Droplets className="h-5 w-5 text-orange-400" />
            <div className="mt-2 text-2xl font-black tabular-nums text-white">
              {(profile?.honeyGeneratedKg || 0.77).toLocaleString('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              kg
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-widest text-white/50">MIEL GÉNÉRÉ</div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center">
            <Wind className="h-5 w-5 text-blue-400" />
            <div className="mt-2 text-2xl font-black tabular-nums text-white">
              {(profile?.co2CapturedKg || 3.85).toLocaleString('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              kg
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-widest text-white/50">CO2 CAPTURÉ</div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center">
            <Sparkles className={`h-5 w-5 ${accentTheme.accentText}`} />
            <div className={`mt-2 text-2xl font-black tabular-nums ${accentTheme.accentText}`}>
              {(profile?.points || 2450).toLocaleString('fr-FR')}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-widest text-white/50">POINTS D&apos;IMPACT</div>
          </div>
        </section>

        <section className="mb-10 px-0">
          <Link
            href="/paywall"
            className="flex items-center justify-between gap-4 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-5 transition-colors hover:bg-amber-500/20 active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Crown className="h-6 w-6 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-amber-400">Passez au niveau supérieur</span>
                <span className="mt-0.5 text-xs font-medium text-amber-400/80">Découvrez les privilèges des Gardiens.</span>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-amber-400/50" />
          </Link>
        </section>

        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tight text-white">Mon BioDex</h2>
            <span className="text-sm font-bold tabular-nums text-white/60">
              ({unlockedCount} / {totalCount})
            </span>
          </div>

          <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {unlockedSpecies.map((species) => (
              <Link
                key={species.id}
                href={`/biodex/${species.id}`}
                className="relative w-40 shrink-0 snap-center rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <span className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-emerald-400">
                  {species.rarity}
                </span>
                <div className="mt-3 aspect-square overflow-hidden rounded-xl bg-black/20">
                  <img src={species.image} alt={species.name} className="h-full w-full object-cover" />
                </div>
                <p className="mt-3 text-sm font-bold text-white">{species.name}</p>
              </Link>
            ))}

            {lockedSpecies.map((species) => (
              <button
                key={species.id}
                type="button"
                className="relative w-40 shrink-0 snap-center rounded-2xl border border-white/10 bg-white/5 p-4 text-left"
              >
                <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-black/30">
                  <Lock className="h-3.5 w-3.5 text-white/55" />
                </span>
                <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white/40">
                  Verrouille
                </span>
                <div className="mt-3 aspect-square overflow-hidden rounded-xl bg-black/30">
                  <img
                    src={species.image}
                    alt={species.name}
                    className="h-full w-full scale-105 object-cover grayscale contrast-125 opacity-40 blur-[2px] transition-all duration-700"
                  />
                </div>
                <p className="mt-3 text-sm font-semibold text-white/60">{species.name}</p>
              </button>
            ))}
          </div>

          <Link
            href="/aventure?tab=biodex"
            className={`mt-1 inline-flex items-center gap-2 text-sm font-semibold transition-colors ${accentTheme.accentText}`}
          >
            Voir la liste complete du BioDex
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {factionContribution ? (
          <section className="mt-8">
            {/* IDENTITY POD */}
            <div className={`relative rounded-3xl border p-5 ${accentTheme.accentBorder} ${accentTheme.accentBgSoft}`}>
              {/* Halo d'ambiance - encapsulé pour ne pas déborder */}
              <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl pointer-events-none">
                <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl opacity-40 ${accentTheme.accentBg}`} />
              </div>

              {/* LAYOUT HAUT : Mascotte + Infos */}
              <div className="relative z-10 flex flex-row items-center justify-between">
                {/* Mascotte 3D flottante (Scale up + dépassement) */}
                <div className="relative -mt-10 h-28 w-[30%] shrink-0 drop-shadow-2xl">
                  <img
                    src={
                      factionContribution.themeKey === 'pollinisateurs'
                        ? '/abeille-transparente.png'
                        : factionContribution.themeKey === 'forets'
                          ? '/sylva.png'
                          : '/aura.png'
                    }
                    alt={factionContribution.label}
                    className="h-full w-full origin-bottom scale-[1.3] object-contain"
                    style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))' }}
                  />
                </div>

                {/* Infos faction */}
                <div className="min-w-0 w-[70%] pl-2 text-left pt-2 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
                    Ma Faction
                  </p>
                  <h2 className={`mt-0.5 text-xl font-black tracking-tight ${accentTheme.accentText}`}>
                    {factionContribution.label}
                  </h2>
                  <p className="mt-2 text-sm font-medium text-white/60">
                    <Sprout className="inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400" />{' '}
                    <span className="font-black text-white">
                      {(profile?.totalSeedsContributed ?? factionContribution.contributionSeeds).toLocaleString('fr-FR')}
                    </span>{' '}
                    graines apportées
                  </p>
                </div>
              </div>

              {/* PONT : Teasing + CTA */}
              <div className="relative z-10 mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Flame className={`h-4 w-4 shrink-0 ${accentTheme.accentText}`} />
                  <p className="text-xs font-semibold text-white/80">
                    Ta faction génère{' '}
                    <span className={`font-black ${accentTheme.accentText}`}>
                      {factionContribution.contributionShare}%
                    </span>{' '}
                    de l'effort collectif ce mois-ci
                  </p>
                </div>

                <Link
                  href="/collectif"
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold transition-transform active:scale-[0.98] ${accentTheme.badgeClassName} ${accentTheme.accentText}`}
                >
                  Rejoindre la quête du mois
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <section className="mt-8">
            {/* GUEST IDENTITY POD */}
            <div className={`relative rounded-3xl border p-5 ${accentTheme.accentBorder} ${accentTheme.accentBgSoft}`}>
              {/* Halo d'ambiance */}
              <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl pointer-events-none">
                <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl opacity-20 ${accentTheme.accentBg}`} />
              </div>

              {/* LAYOUT HAUT : Icône + Infos */}
              <div className="relative z-10 flex flex-row items-center justify-between">
                <div className="relative flex -mt-8 h-24 w-[30%] shrink-0 items-center justify-center drop-shadow-2xl">
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
                    Rejoignez les rangs pour orienter l'effort de l'Essaim.
                  </p>
                </div>
              </div>

              {/* PONT : Teasing + CTA */}
              <div className="relative z-10 mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className={`h-4 w-4 shrink-0 ${accentTheme.accentText}`} />
                  <p className="text-xs font-semibold text-white/80">
                    Multipliez votre impact en équipe
                  </p>
                </div>

                <Link
                  href="/welcome/setup"
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold transition-transform active:scale-[0.98] ${accentTheme.badgeClassName} ${accentTheme.accentText}`}
                >
                  Choisir ma Faction
                  <ArrowRight className="h-4 w-4" />
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
          />
          <div className="relative z-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Gift className={`h-7 w-7 ${accentTheme.accentTextSoft}`} />
            </div>
            <h3 className="mt-3 text-lg font-black text-white">Invitez vos amis</h3>
            <p className="mb-4 mt-2 text-balance text-sm text-white/70">
              Faites grandir le mouvement. Gagnez <span className={`font-bold ${accentTheme.accentText}`}>500 graines</span>{' '}
              chacun pour chaque ami parrainé.
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
  )
}
