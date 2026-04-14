import {
  ArrowRight,
  Bug,
  ChevronRight,
  Droplets,
  Flame,
  Gift,
  Lock,
  Settings,
  Sparkles,
  Users,
  Wind,
} from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getBiodexPreviewData } from '@/lib/api/biodex-preview.service'

export default async function ProfilePage() {
  const { unlockedSpecies, lockedSpecies, unlockedCount, totalCount } = await getBiodexPreviewData({
    unlockedLimit: 2,
    lockedLimit: 2,
  })

  return (
    <div className="min-h-screen bg-[#0B0F15] text-white pb-32">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0B0F15]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-end px-4">
          <Link
            href="/dashboard/settings"
            aria-label="Paramètres"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 ">
        <section className="relative pt-6">
          <div className="pointer-events-none absolute left-1/2 top-12 h-40 w-40 -translate-x-1/2 rounded-full bg-lime-500/10 blur-3xl" />

          <div className="relative z-10 mx-auto mt-4 h-28 w-28 overflow-hidden rounded-full border-4 border-[#0B0F15] shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1545167622-3a6ac756afa4"
              alt="Avatar de Bartosz Krynski"
              className="h-full w-full object-cover"
            />
          </div>

          <h1 className="mt-3 text-center text-3xl font-black tracking-tight text-white">
            Bartosz Krynski
          </h1>

          <div className="mx-auto mt-2 flex w-fit items-center gap-1.5 rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-xs font-semibold tracking-wide text-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.2)]">
            <Flame className="h-3.5 w-3.5 fill-current" />
            12 jours de série
          </div>

          <p className="mt-2 text-center text-xs font-medium tracking-wide text-white/60">
            @bartosz_k • Membre depuis 2026
          </p>
        </section>

        <section className=" mt-8 mb-10 grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center">
            <Bug className="h-5 w-5 text-amber-400" />
            <div className="mt-2 text-2xl font-black text-white tabular-nums">3 800</div>
            <div className="mt-1 text-[10px] uppercase tracking-widest text-white/50">
              ABEILLES SAUVÉES
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center">
            <Droplets className="h-5 w-5 text-orange-400" />
            <div className="mt-2 text-2xl font-black text-white tabular-nums">0,77 kg</div>
            <div className="mt-1 text-[10px] uppercase tracking-widest text-white/50">
              MIEL GÉNÉRÉ
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center">
            <Wind className="h-5 w-5 text-blue-400" />
            <div className="mt-2 text-2xl font-black text-white tabular-nums">3,85 kg</div>
            <div className="mt-1 text-[10px] uppercase tracking-widest text-white/50">
              CO₂ CAPTURÉ
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center">
            <Sparkles className="h-5 w-5 text-lime-400" />
            <div className="mt-2 text-2xl font-black text-lime-400 tabular-nums">2 450</div>
            <div className="mt-1 text-[10px] uppercase tracking-widest text-white/50">
              POINTS D&apos;IMPACT
            </div>
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
                  <img
                    src={species.image}
                    alt={species.name}
                    className="h-full w-full object-cover"
                  />
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
                  Verrouillé
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
            className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-lime-400 transition-colors hover:text-lime-300"
          >
            Voir la liste complète du BioDex
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section>
          <div className="mt-8 mb-4 flex items-end justify-between ">
            <h2 className="text-xl font-bold text-white">Mes Tribus</h2>
            <button type="button" className="text-xs font-medium text-lime-400 hover:text-lime-300">
              Voir tout
            </button>
          </div>

          <div className="hide-scrollbar flex snap-x gap-4 overflow-x-auto  pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              className="w-48 shrink-0 snap-center rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition-transform active:scale-95"
            >
              <div className="mb-3 h-20 w-full overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400"
                  alt="Agroforest Pioneers"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="w-full truncate text-sm font-bold text-white">Agroforest Pioneers</h3>
                <div className="mt-1 flex items-center gap-1 text-xs text-white/50">
                  <Users className="h-3 w-3" /> 42 membres
                </div>
              </div>
            </button>

            <button
              type="button"
              className="w-48 shrink-0 snap-center rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition-transform active:scale-95"
            >
              <div className="mb-3 h-20 w-full overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&q=80&w=400"
                  alt="Océan"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="w-full truncate text-sm font-bold text-white">Ocean Mangroves</h3>
                <div className="mt-1 flex items-center gap-1 text-xs text-white/50">
                  <Users className="h-3 w-3" /> 128 membres
                </div>
              </div>
            </button>
          </div>
        </section>

        <section className="relative  mt-10 mb-8 overflow-hidden rounded-3xl border border-lime-500/30 bg-gradient-to-br from-lime-500/20 to-emerald-900/20 p-6 text-center">
          <div className="pointer-events-none absolute left-1/2 mt-[-3rem] h-40 w-40 -translate-x-1/2 rounded-full bg-lime-400/15 blur-3xl" />
          <div className="relative z-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Gift className="h-7 w-7 text-lime-300" />
            </div>
            <h3 className="mt-3 text-lg font-black text-white">Invitez vos amis</h3>
            <p className="mt-2 mb-4 text-sm text-balance text-white/70">
              Faites grandir le mouvement. Gagnez{' '}
              <span className="font-bold text-lime-400">500 Graines 🌱</span> chacun pour chaque
              ami parrainé.
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
