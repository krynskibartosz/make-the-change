import { Lock, Target, Trophy } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getBiodexPreviewData } from '@/lib/api/biodex-preview.service'
import { getFactionCampaigns } from '@/lib/mock/mock-factions'
import { getFactionThemeByKey } from '@/lib/faction-theme'

function LockedImpactCard({
  icon,
  label,
}: {
  icon: string
  label: string
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center opacity-50 grayscale transition-all">
      <div className="mb-2 text-xl">{icon}</div>
      <div className="text-2xl font-black tabular-nums text-white">-</div>
      <div className="mt-1 text-[10px] uppercase tracking-widest text-white/60">{label}</div>
    </div>
  )
}

export default async function GuestProfilePage() {
  const { lockedSpecies } = await getBiodexPreviewData({
    unlockedLimit: 0,
    lockedLimit: 4,
  })
  const factionCampaigns = getFactionCampaigns()

  return (
    <div className="min-h-screen bg-[#0B0F15] pb-32 text-white">
      <main className="w-full pt-[max(0.75rem,env(safe-area-inset-top))]">
        <section className="flex flex-col items-center px-5 pb-6 pt-8">
          <div className="relative mb-5 h-28 w-28">
            <img src="/images/logo-icon-bee.png" alt="Mascotte" className="h-full w-full object-contain drop-shadow-xl" />
          </div>
          <h1 className="mt-4 text-center text-2xl font-black tracking-tight text-white">L&apos;Aventure vous attend</h1>
          <p className="mx-auto mt-2 max-w-[280px] text-center text-sm leading-relaxed text-white/60">
            Identifiez-vous pour debloquer votre BioDex, suivre votre impact et choisir la faction qui vous ressemble.
          </p>
        </section>

        <section className="mb-10 mt-8 flex w-full flex-col gap-3 px-5">
          <Link
            href="/login?provider=apple&returnTo=%2Fdashboard%2Fprofile"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white font-bold text-black transition-transform active:scale-95"
          >
            <span className="text-lg"></span> Continuer avec Apple
          </Link>
          <Link
            href="/login?provider=google&returnTo=%2Fdashboard%2Fprofile"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#1C1C22] font-bold text-white transition-transform active:scale-95"
          >
            Continuer avec Google
          </Link>
          <Link
            href="/login?returnTo=%2Fdashboard%2Fprofile"
            className="mt-2 text-center text-xs text-white/40 underline decoration-white/20 transition-colors active:text-white"
          >
            Ou utiliser une adresse email
          </Link>
        </section>

        <section className="mx-5 mb-8 grid grid-cols-2 gap-3">
          <LockedImpactCard icon="🐝" label="ABEILLES SAUVEES" />
          <LockedImpactCard icon="🍯" label="MIEL GENERE" />
          <LockedImpactCard icon="💨" label="CO2 CAPTURE" />

          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center opacity-50 grayscale transition-all">
            <div className="mb-2 text-xl">🎁</div>
            <div className="text-2xl font-black tabular-nums text-white">0</div>
            <div className="mt-1 text-[10px] uppercase tracking-widest text-white/60">+500 Graines</div>
          </div>
        </section>

        <section className="mb-2">
          <h2 className="mb-3 px-5 text-lg font-bold text-white">Debloquez le BioDex</h2>

          <div className="hide-scrollbar flex snap-x gap-4 overflow-x-auto px-5 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {lockedSpecies.map((species) => (
              <div
                key={species.id}
                className="relative flex aspect-[4/5] w-40 shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-3"
              >
                <div className="mb-2 flex shrink-0 justify-end">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5">
                    <Lock className="h-3 w-3 text-white/30" />
                  </div>
                </div>
                <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-white/5">
                  <img
                    src={species.image}
                    alt={species.name}
                    className="h-full w-full scale-105 object-cover grayscale contrast-125 opacity-40 blur-[2px]"
                  />
                </div>
                <div className="mt-2 shrink-0">
                  <p className="truncate text-sm font-semibold leading-tight text-white/60">{species.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between px-5">
            <h2 className="text-lg font-bold text-white">Classement des factions</h2>
            <span className="text-[11px] uppercase tracking-[0.18em] text-white/40">Mobile first</span>
          </div>

          <div className="flex flex-col gap-3 px-5">
            {factionCampaigns.map((campaign) => {
              const theme = getFactionThemeByKey(campaign.themeKey)

              return (
                <div
                  key={campaign.themeKey}
                  className={`rounded-3xl border bg-white/5 p-4 ${theme.accentBorder}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${theme.accentTextSoft}`}>
                        #{campaign.rank} du mois
                      </p>
                      <h3 className="mt-2 text-base font-black text-white">{campaign.label}</h3>
                      <p className="mt-1 text-sm text-white/60">{campaign.tagline}</p>
                    </div>
                    <div className={`rounded-full border px-3 py-1 text-xs font-bold ${theme.badgeClassName} ${theme.accentText}`}>
                      {campaign.score.toLocaleString('fr-FR')}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/45">
                        <Target className={`h-4 w-4 ${theme.accentText}`} />
                        Quete
                      </div>
                      <p className="mt-2 text-sm font-bold text-white">{campaign.monthlyQuestTitle}</p>
                      <div className="mt-3 h-2 rounded-full bg-white/10">
                        <div className={`h-full rounded-full ${theme.accentBg}`} style={{ width: `${campaign.monthlyQuestProgress}%` }} />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/45">
                        <Trophy className={`h-4 w-4 ${theme.accentText}`} />
                        Recompense
                      </div>
                      <p className="mt-2 text-sm font-bold text-white">{campaign.rewardTitle}</p>
                      <p className={`mt-1 text-xs font-semibold ${theme.accentText}`}>+{campaign.rewardSeeds} graines</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
