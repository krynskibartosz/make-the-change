import { Lock, Settings } from 'lucide-react'
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

function FactionMascotSelector() {
  const factions = [
    { id: 'pollinisateurs', name: 'Melli', image: '/abeille-transparente.png' },
    { id: 'forets', name: 'Sylva', image: '/sylva.png' },
    { id: 'artisans', name: 'Aura', image: '/aura.png' },
  ]

  return (
    <div className="mt-10 flex gap-4 mb-6">
      {factions.map((faction) => (
        <Link
          key={faction.id}
          href={`/onboarding/step-2?preselected=${faction.id}`}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-24 h-24 rounded-full border border-white/10 bg-white/5 p-2 shadow-lg transition-all hover:scale-105 hover:bg-white/10 hover:border-white/20 animate-[float_3s_ease-in-out_infinite]">
            <img src={faction.image} alt={faction.name} className="w-full h-full object-contain" />
          </div>
          <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors">
            {faction.name}
          </span>
        </Link>
      ))}
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
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0B0F15]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-end px-4">
          <Link
            href="/login?returnTo=/dashboard/settings"
            aria-label="Paramètres"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </header>
      <main className="w-full pt-[max(0.75rem,env(safe-area-inset-top))]">
        <section className="flex flex-col items-center px-5 pb-6 pt-8">
          <h1 className="mb-4 text-center text-2xl font-black tracking-tight text-white">L&apos;Aventure vous attend</h1>
          <p className="mx-auto mt-2 max-w-[280px] text-center text-sm leading-relaxed text-white/60">
            Choisissez votre compagnon pour débloquer votre BioDex, sauvegarder votre impact et rejoindre l'effort collectif.
          </p>
          <FactionMascotSelector />
          <Link
            href="/login"
            className="mt-6 text-sm text-white/40 hover:text-white/60 underline underline-offset-4 transition-colors"
          >
            Déjà un Gardien ? Se connecter
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
      </main>
    </div>
  )
}
