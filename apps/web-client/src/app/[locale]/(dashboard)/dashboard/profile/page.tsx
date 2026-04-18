import { ArrowRight, Bug, Droplets, Flame, Gift, Lock, Settings, Sparkles, Target, Trophy, Wind } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getBiodexPreviewData } from '@/lib/api/biodex-preview.service'
import { getFactionTheme } from '@/lib/faction-theme'
import { getFactionCampaign } from '@/lib/mock/mock-factions'
import { getCurrentProfile } from '@/lib/mock/mock-session-server'

export default async function ProfilePage() {
  const profile = await getCurrentProfile()
  const accentTheme = getFactionTheme(profile?.faction ?? null)
  const factionCampaign = getFactionCampaign(profile?.faction ?? null)
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
            <div className="mt-1 text-[10px] uppercase tracking-widest text-white/50">ABEILLES SAUVEES</div>
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
            <div className="mt-1 text-[10px] uppercase tracking-widest text-white/50">MIEL GENERE</div>
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
            <div className="mt-1 text-[10px] uppercase tracking-widest text-white/50">CO2 CAPTURE</div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center">
            <Sparkles className={`h-5 w-5 ${accentTheme.accentText}`} />
            <div className={`mt-2 text-2xl font-black tabular-nums ${accentTheme.accentText}`}>
              {(profile?.points || 2450).toLocaleString('fr-FR')}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-widest text-white/50">POINTS D&apos;IMPACT</div>
          </div>
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

        {factionCampaign ? (
          <section
            className={`mt-8 overflow-hidden rounded-3xl border bg-gradient-to-br p-5 ${accentTheme.accentBorder} ${accentTheme.heroGradient}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${accentTheme.accentTextSoft}`}>
                  Ma faction
                </p>
                <h2 className="mt-2 text-xl font-black text-white">{factionCampaign.label}</h2>
                <p className="mt-2 text-sm text-white/70">{factionCampaign.tagline}</p>
              </div>
              <div className={`rounded-full border px-3 py-1 text-xs font-bold ${accentTheme.badgeClassName} ${accentTheme.accentText}`}>
                #{factionCampaign.rank}
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/50">
                  <Target className={`h-4 w-4 ${accentTheme.accentText}`} />
                  Quete principale du mois
                </div>
                <p className="mt-3 text-base font-black text-white">{factionCampaign.monthlyQuestTitle}</p>
                <p className="mt-1 text-sm text-white/70">{factionCampaign.monthlyQuestSummary}</p>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full ${accentTheme.accentBg}`}
                    style={{ width: `${factionCampaign.monthlyQuestProgress}%` }}
                  />
                </div>
                <p className={`mt-2 text-xs font-semibold ${accentTheme.accentText}`}>
                  {factionCampaign.monthlyQuestProgress}% de progression collective
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/50">
                    <Trophy className={`h-4 w-4 ${accentTheme.accentText}`} />
                    Classement
                  </div>
                  <p className="mt-3 text-2xl font-black text-white">{factionCampaign.score.toLocaleString('fr-FR')}</p>
                  <p className="mt-1 text-sm text-white/60">{factionCampaign.members} membres actifs</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/50">
                    <Gift className={`h-4 w-4 ${accentTheme.accentText}`} />
                    Recompense
                  </div>
                  <p className="mt-3 text-base font-black text-white">{factionCampaign.rewardTitle}</p>
                  <p className="mt-1 text-sm text-white/60">{factionCampaign.rewardSummary}</p>
                </div>
              </div>
            </div>
          </section>
        ) : null}

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
              chacun pour chaque ami parraine.
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
