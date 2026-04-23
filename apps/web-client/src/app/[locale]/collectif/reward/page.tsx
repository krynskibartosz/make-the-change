import type { Metadata } from 'next'
import { Gift, Sprout, Droplets, Sparkles, Lock, Crown } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getCollectiveGoal, getFactionContribution } from '@/lib/mock/mock-factions'
import { getMockProducts } from '@/app/[locale]/(marketing)/products/_features/mock-products'
import { getFactionThemeByKey } from '@/lib/faction-theme'
import { getClientMockViewerSession } from '@/lib/mock/mock-session'
import { getMockSubscription } from '@/lib/mock/mock-member-data'
import type { Faction } from '@/lib/mock/types'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Récompense du Mois | Make the Change`,
  }
}

export default async function CollectifRewardPage() {
  const session = getClientMockViewerSession()
  const initialFaction: Faction | null = session?.faction ?? null
  const subscription = session ? getMockSubscription(session.viewerId) : null
  const hasSubscription = subscription?.status === 'active'
  const isConnected = !!session

  const collectiveGoal = getCollectiveGoal()
  const activeContribution = getFactionContribution(initialFaction)
  const ilangaProducts = getMockProducts().filter(
    (p) => p.producer_id === 'mock-producer-ilanga-nature',
  )

  let mascotSrc = '/sylva.png'
  if (activeContribution?.themeKey === 'pollinisateurs') mascotSrc = '/abeille-transparente.png'
  else if (activeContribution?.themeKey === 'mers') mascotSrc = '/ondine.png'

  const activeTheme = getFactionThemeByKey(activeContribution?.themeKey ?? 'forets')

  return (
    <div className="min-h-screen bg-[#0B0F15]">
      <div className="flex min-h-screen flex-col relative">
        {/* Back button */}
        <div className="absolute left-5 top-8 sm:left-6 z-10">
          <Link
            href="/collectif"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            ←
          </Link>
        </div>

        <div className="flex flex-col gap-8 px-5 pb-28 pt-8 sm:px-6">
          {/* En-tête : Mascotte & Titre */}
          <div className="flex flex-col items-center text-center">
            {initialFaction ? (
              <div className="relative mb-4 flex h-24 w-24 items-center justify-center">
                <div className={`absolute inset-0 rounded-full blur-2xl opacity-40 ${activeTheme.accentBg}`} />
                <img src={mascotSrc} alt="Mascotte faction" className="relative z-10 h-full w-full object-contain drop-shadow-2xl" />
              </div>
            ) : (
              <div className="relative mb-4 flex h-24 items-center justify-center gap-3">
                <img src="/abeille-transparente.png" alt="Melli" className="h-16 w-16 object-contain drop-shadow-2xl" />
                <img src="/sylva.png" alt="Sylva" className="h-16 w-16 object-contain drop-shadow-2xl" />
                <img src="/ondine.png" alt="Ondine" className="h-16 w-16 object-contain drop-shadow-2xl" />
              </div>
            )}
            <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${activeTheme.accentTextSoft}`}>
              La Récompense du Mois
            </p>
            <h2 className="mt-1 text-2xl font-black text-white">Le Privilège de l'Essaim</h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
              Si l'Essaim atteint 100%, notre partenaire{' '}
              <span className="font-semibold text-white">Ilanga Nature</span>{' '}
              débloquera un privilège exclusif sur sa boutique — un geste de gratitude pour tous les Gardiens participants.
            </p>
          </div>

          {/* Jauge de progression (Focus) */}
          <div>
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>Progression collective</span>
              <span className="font-bold text-white">{collectiveGoal.progress}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#1A222C]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-lime-400 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000"
                style={{ width: `${collectiveGoal.progress}%` }}
              />
            </div>
            <p className="mt-2 text-center text-[11px] text-white/40">
              Plus que {(collectiveGoal.targetSeeds - collectiveGoal.currentSeeds).toLocaleString('fr-FR')} <Sprout className="inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400" /> restantes
            </p>
          </div>

          {/* Récompenses (Sleek List) */}
          <div className="space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">Ce qui vous attend</p>

            <div className="flex items-center gap-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400/10">
                <Droplets className="h-4 w-4 text-amber-400" />
              </div>
              <div className="flex-1 border-b border-white/5 pb-4">
                <p className="text-base font-bold text-white">15% de privilège</p>
                <p className="text-sm text-white/50">Sur la récolte de miel Ilanga Nature</p>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-400/10">
                <Sparkles className="h-4 w-4 text-violet-400" />
              </div>
              <div className="flex-1 pb-2">
                <p className="text-base font-bold text-white">{collectiveGoal.prestigeRewardTitle}</p>
                <p className="text-sm text-white/50">{collectiveGoal.prestigeRewardSummary}</p>
              </div>
            </div>
          </div>

          {/* Produits du partenaire */}
          {ilangaProducts.length > 0 && (
            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
                La récolte d'Ilanga Nature
              </p>
              <div className="relative -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-5 sm:-mx-6 sm:pl-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {ilangaProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    prefetch={false}
                    className="group flex w-44 shrink-0 snap-center flex-col overflow-hidden transition-transform active:scale-[0.97]"
                  >
                    <div className="aspect-square w-full overflow-hidden rounded-[1.5rem] bg-white/5 border border-white/5">
                      <img
                        src={product.image_url}
                        alt={product.name_default}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-3 flex flex-col gap-0.5">
                      <p className="text-sm font-bold text-white line-clamp-1">{product.name_default}</p>
                      <p className="text-xs text-white/50 line-clamp-1">{product.short_description_default}</p>
                      <p className="mt-1 text-sm font-black text-amber-400">{product.price_points} <Sprout className="inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400" /></p>
                    </div>
                  </Link>
                ))}
                <div className="w-1 shrink-0" />
              </div>
            </div>
          )}
        </div>

        {/* Encart abonnement contextuel si connecté sans abonnement */}
        {isConnected && initialFaction && !hasSubscription && (
          <div className="mx-5 mb-4 flex items-center gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3.5 sm:mx-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400/10">
              <Sparkles className="h-5 w-5 text-amber-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white/60">Accès Récompenses</span>
                <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-amber-400">
                  👑 Gardiens
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-white/40">
                Débloquez les récompenses exclusives de la saison collective.
              </p>
            </div>
            <Lock className="h-4 w-4 shrink-0 text-white/25" />
          </div>
        )}

        {/* Bouton Sticky */}
        <div className="sticky bottom-0 z-20 w-full border-t border-white/5 bg-[#0B0F15]/80 p-5 backdrop-blur-xl sm:px-6">
          {!isConnected ? (
            <Link
              href="/onboarding/step-0"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-lime-400 text-sm font-bold text-black shadow-[0_0_25px_rgba(163,230,53,0.3)] transition-transform hover:scale-[1.02] active:scale-95"
            >
              Rejoindre pour participer <Sprout className="inline h-[1.2em] w-[1.2em] align-text-bottom" />
            </Link>
          ) : !initialFaction ? (
            <Link
              href="/welcome/setup"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-lime-400 text-sm font-bold text-black shadow-[0_0_25px_rgba(163,230,53,0.3)] transition-transform hover:scale-[1.02] active:scale-95"
            >
              Choisir votre faction <Sprout className="inline h-[1.2em] w-[1.2em] align-text-bottom" />
            </Link>
          ) : !hasSubscription ? (
            <Link
              href="/dashboard/subscription"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 text-sm font-bold text-black shadow-[0_0_25px_rgba(251,191,36,0.3)] transition-transform hover:scale-[1.02] active:scale-95"
            >
              Débloquer les récompenses <Crown className="inline h-[1.2em] w-[1.2em] align-text-bottom" />
            </Link>
          ) : (
            <Link
              href="/collectif"
              className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-95"
            >
              Retour au collectif
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}