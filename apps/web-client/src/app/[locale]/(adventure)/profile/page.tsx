import { Gift, Lock, Mail, Target, Trophy } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getBiodexPreviewData } from '@/lib/api/biodex-preview.service'
import { getCollectiveGoal, getFactionContributions } from '@/lib/mock/mock-factions'
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
  const collectiveGoal = getCollectiveGoal()
  const factionContributions = getFactionContributions()

  return (
    <div className="min-h-screen bg-[#0B0F15] pb-32 text-white">
      <main className="w-full pt-[max(0.75rem,env(safe-area-inset-top))]">
        <section className="flex flex-col items-center px-5 pb-6 pt-8">
          <div className="relative mb-5 h-28 w-28">
            <img src="/images/logo-icon-bee.png" alt="Mascotte" className="h-full w-full object-contain drop-shadow-xl" />
          </div>
          <h1 className="mt-4 text-center text-2xl font-black tracking-tight text-white">L&apos;Aventure vous attend</h1>
          <p className="mx-auto mt-2 max-w-[280px] text-center text-sm leading-relaxed text-white/60">
            Identifiez-vous pour débloquer votre BioDex, suivre votre impact et aider votre faction à faire avancer l'objectif commun.
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
            className="mt-2 flex items-center justify-center gap-2 text-center text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            <Mail className="h-4 w-4" />
            Ou utiliser une adresse email
          </Link>
        </section>

        <section className="mx-5 mb-8 grid grid-cols-2 gap-3">
          <LockedImpactCard icon="🐝" label="ABEILLES SAUVÉES" />
          <LockedImpactCard icon="🍯" label="MIEL GÉNÉRÉ" />
          <LockedImpactCard icon="💨" label="CO2 CAPTURÉ" />

          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center opacity-50 grayscale transition-all">
            <div className="mb-2 text-xl">🎁</div>
            <div className="text-2xl font-black tabular-nums text-white">0</div>
            <div className="mt-1 text-[10px] uppercase tracking-widest text-white/60">+500 GRAINES</div>
          </div>
        </section>

        <section className="mb-2">
          <h2 className="mb-3 px-5 text-lg font-bold text-white">Découvrez le BioDex</h2>

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

        <section className="mb-8 px-5">
          <h2 className="mb-4 text-lg font-bold text-white">Choisissez votre Faction</h2>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="mb-5 text-sm leading-relaxed text-white/60">
              Rejoignez l’un des trois camps et orientez l’effort collectif selon vos valeurs.
            </p>

            <div className="space-y-3">
              {factionContributions.map((contribution) => {
                const theme = getFactionThemeByKey(contribution.themeKey)
                return (
                  <div
                    key={contribution.themeKey}
                    className={`flex items-center gap-4 rounded-2xl border p-4 ${theme.accentBorder} ${theme.accentBgSoft}`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${theme.accentBg} bg-opacity-20`}>
                      <img
                        src={
                          contribution.themeKey === 'pollinisateurs'
                            ? '/images/logo-icon-bee.png'
                            : contribution.themeKey === 'forets'
                              ? '/sylva.png'
                              : '/aura.png'
                        }
                        alt={contribution.label}
                        className="h-6 w-6 object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-bold ${theme.accentText}`}>{contribution.label}</p>
                      <p className="text-xs text-white/50">{contribution.impactValue} {contribution.impactLabel}</p>
                    </div>
                    <div className={`rounded-full border px-2.5 py-1 text-[10px] font-black ${theme.badgeClassName} ${theme.accentText}`}>
                      #{contribution.rank === 1 ? '1' : contribution.rank === 2 ? '2' : '3'}
                    </div>
                  </div>
                )
              })}
            </div>

            <Link
              href="/welcome/setup"
              className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-lime-400 text-base font-black text-black shadow-[0_0_25px_rgba(163,230,53,0.3)] transition-transform active:scale-95"
            >
              Choisir ma Faction
              <span className="text-lg">→</span>
            </Link>
            <p className="mt-3 text-center text-xs text-white/30">
              Gratuit — Rejoignez l’aventure en 30 secondes
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
