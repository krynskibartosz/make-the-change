import { Lock } from 'lucide-react'
import { Link } from '@/i18n/navigation'

const lockedSpecies = ['Espèce Inconnue', 'Espèce Inconnue', 'Espèce Inconnue']

const tribes = [
  {
    id: 'agroforest-pioneers',
    name: 'Agroforest Pioneers',
    members: 42,
    image:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'ocean-mangroves',
    name: 'Ocean Mangroves',
    members: 128,
    image:
      'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'pollinator-circle',
    name: 'Pollinator Circle',
    members: 67,
    image:
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=400',
  },
]

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

export default function GuestProfilePage() {
  return (
    <div className="min-h-screen bg-[#0B0F15] pb-32 text-white">
      <main className="w-full pt-[max(0.75rem,env(safe-area-inset-top))]">
        <section className="flex flex-col items-center px-5 pb-6 pt-8">
          <div className="relative mb-5 h-28 w-28">
            <img
              src="/images/logo-icon-bee.png"
              alt="Mascotte"
              className="h-full w-full object-contain drop-shadow-xl"
            />
          </div>
          <h1 className="text-2xl font-black text-white text-center tracking-tight mt-4">
            L&apos;Aventure vous attend
          </h1>
          <p className="text-white/60 text-sm text-center mt-2 max-w-[280px] leading-relaxed mx-auto">
            Identifiez-vous pour débloquer votre BioDex, suivre votre impact et rejoindre une
            tribu.
          </p>
        </section>

        <section className="w-full px-5 mt-8 mb-10 flex flex-col gap-3">
          <Link
            href="/login?provider=apple&returnTo=%2Fdashboard%2Fprofile"
            className="w-full bg-white text-black font-bold h-14 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <span className="text-lg"></span> Continuer avec Apple
          </Link>
          <Link
            href="/login?provider=google&returnTo=%2Fdashboard%2Fprofile"
            className="w-full bg-[#1C1C22] border border-white/10 text-white font-bold h-14 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            Continuer avec Google
          </Link>
          <Link
            href="/login?returnTo=%2Fdashboard%2Fprofile"
            className="text-white/40 text-xs text-center mt-2 underline decoration-white/20 active:text-white transition-colors"
          >
            Ou utiliser une adresse email
          </Link>
        </section>

        <section className="mx-5 mb-8 grid grid-cols-2 gap-3">
          <LockedImpactCard icon="🐝" label="ABEILLES SAUVÉES" />
          <LockedImpactCard icon="🍯" label="MIEL GÉNÉRÉ" />
          <LockedImpactCard icon="💨" label="CO₂ CAPTURÉ" />

          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center opacity-50 grayscale transition-all">
            <div className="mb-2 text-xl">🎁</div>
            <div className="text-2xl font-black tabular-nums text-white">0</div>
            <div className="mt-1 text-[10px] uppercase tracking-widest text-white/60">
              +500 Graines
            </div>
          </div>
        </section>

        <section className="mb-2">
          <h2 className="mb-3 px-5 text-lg font-bold text-white">Débloquez le BioDex</h2>

          <div className="hide-scrollbar flex snap-x gap-4 overflow-x-auto px-5 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {lockedSpecies.map((name, index) => (
              <div
                key={`${name}-${index + 1}`}
                className="flex min-h-[140px] w-36 shrink-0 snap-center flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center"
              >
                <div className="mb-2 rounded-full border border-white/10 bg-white/5 p-2">
                  <Lock className="h-4 w-4 text-white/50" />
                </div>
                <div className="h-14 w-14 rounded-xl bg-white/5" />
                <p className="mt-3 text-xs font-semibold text-white/45">{name}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 px-5 text-lg font-bold text-white">Tribus populaires</h2>

          <div className="hide-scrollbar flex snap-x gap-4 overflow-x-auto px-5 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tribes.map((tribe) => (
              <button
                key={tribe.id}
                type="button"
                className="relative w-44 shrink-0 snap-center rounded-2xl border border-white/10 bg-white/5 p-3 text-left active:scale-95"
              >
                <div className="absolute right-2 top-2 rounded-md bg-black/55 px-2 py-1 text-[10px] font-bold text-white/75 backdrop-blur-md">
                  <Lock className="inline h-3 w-3" />
                </div>
                <div className="mb-3 h-20 w-full overflow-hidden rounded-xl">
                  <img
                    src={tribe.image}
                    alt={tribe.name}
                    className="h-full w-full object-cover brightness-75"
                  />
                </div>
                <h3 className="truncate text-sm font-bold text-white">{tribe.name}</h3>
                <p className="mt-1 text-xs text-white/50">{tribe.members} membres</p>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
