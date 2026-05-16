import type { Metadata } from 'next'
import { Sprout, Droplets, Sparkles, Lock, Crown } from 'lucide-react'
import { CurrencyAmount } from '@/components/currency'
import { Link } from '@/i18n/navigation'
import { getCollectiveGoal, getFactionContribution } from '@/lib/mock/mock-factions'
import { getMockProducts } from '@/app/[locale]/(screens)/products/_features/mock-products'
import { getFactionThemeByKey } from '@/lib/faction-theme'
import { getMockViewerSession } from '@/lib/mock/mock-session-server'
import { getMockSubscription } from '@/lib/mock/mock-member-data'
import { MOCK_PRODUCER_ILANGA_ID } from '@/lib/mock/mock-ids'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import type { Faction } from '@/lib/domain/types'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Récompense du Mois | Make the Change`,
  }
}

export default async function ImpactRewardPage() {
  const session = await getMockViewerSession()
  const initialFaction: Faction | null = session?.faction ?? null
  const subscription = session ? getMockSubscription(session.viewerId) : null
  const hasSubscription = subscription?.status === 'active'
  const isConnected = !!session

  const collectiveGoal = getCollectiveGoal()
  const activeContribution = getFactionContribution(initialFaction)
  const ilangaProducts = getMockProducts().filter(
    (p) => p.producer_id === MOCK_PRODUCER_ILANGA_ID,
  )

  let mascotSrc = '/images/mascots/sylva.png'
  if (activeContribution?.themeKey === 'pollinisateurs') mascotSrc = '/images/mascots/melli.png'
  else if (activeContribution?.themeKey === 'mers') mascotSrc = '/images/mascots/ondine.png'

  const activeTheme = getFactionThemeByKey(activeContribution?.themeKey ?? 'forets')
  const remainingSeeds = Math.max(collectiveGoal.targetSeeds - collectiveGoal.currentSeeds, 0)
  const isGoalReached = collectiveGoal.progress >= 100

  return (
    <FullScreenSlideModal
      title="AVANTAGE DU MOIS"
      fallbackHref="/impact"
      headerMode="dynamic"
      className="bg-[#0B0F15] pt-2"
      contentClassName="overflow-y-auto overscroll-contain"
    >
      <div className="flex flex-col">
        <div className="flex flex-col gap-8 px-5 pb-28 pt-16 sm:px-6">
          {/* En-t�te : Mascotte & Titre */}
          <div className="flex flex-col items-center text-center">
            {initialFaction ? (
              <div className="relative mb-4 flex h-24 w-24 items-center justify-center">
                <div className={`absolute inset-0 rounded-full blur-2xl opacity-40 ${activeTheme.accentBg}`} />
                <img src={mascotSrc} alt="Mascotte faction" className="relative z-10 h-full w-full object-contain drop-shadow-2xl" />
              </div>
            ) : (
              <div className="relative mb-4 flex h-24 items-center justify-center gap-3">
                <img src="/images/mascots/melli.png" alt="Melli" className="h-16 w-16 object-contain drop-shadow-2xl" />
                <img src="/images/mascots/sylva.png" alt="Sylva" className="h-16 w-16 object-contain drop-shadow-2xl" />
                <img src="/images/mascots/ondine.png" alt="Ondine" className="h-16 w-16 object-contain drop-shadow-2xl" />
              </div>
            )}
            <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${activeTheme.accentTextSoft}`}>
              AVANTAGE DU MOIS
            </p>
            <h2 className="mt-1 text-2xl font-black text-white">Le D�fi Ilanga Nature</h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
              Atteignons ensemble les 100�% en r�coltant des Graines�! En remerciement de cet effort commun, notre partenaire{' '}
              <span className="font-semibold text-white">Ilanga Nature</span>{' '}
              d�bloquera des avantages exclusifs pour toute la communaut�.
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
              Plus que <CurrencyAmount kind="seeds" value={remainingSeeds} className="font-bold" /> � r�colter
            </p>
          </div>

          {/* Avantages (Sleek List) */}
          <div className="space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/60">Avantages � d�bloquer</p>

            <div className="flex items-center gap-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400/10">
                <Droplets className="h-4 w-4 text-amber-400" />
              </div>
              <div className="flex-1 border-b border-white/5 pb-4">
                <p className="text-base font-bold text-white">-15% sur les miels Ilanga Nature</p>
                <p className="text-sm text-white/50">D�bloqu� pour toute la communaut� si l'objectif est atteint.</p>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-400/10">
                <Sparkles className="h-4 w-4 text-violet-400" />
              </div>
              <div className="flex-1 pb-2">
                <p className="text-base font-bold text-white">Halo de victoire</p>
                <p className="text-sm text-white/50">La faction ayant r�colt� le plus de Graines obtiendra un �clat cosm�tique exclusif.</p>
              </div>
            </div>
          </div>

          {/* Produits du partenaire */}
          {ilangaProducts.length > 0 && (
            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
                La r�colte d'Ilanga Nature
              </p>
              <div className="relative -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-5 sm:-mx-6 sm:pl-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {ilangaProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
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
                      {product.producer?.name_default && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                          {product.producer.name_default}
                        </span>
                      )}
                      <p className="text-sm font-bold text-white line-clamp-1">{product.name_default}</p>
                      {isGoalReached ? (
                        <CurrencyAmount
                          kind="impactCredits"
                          value={product.price_points}
                          className="text-sm font-black"
                        />
                      ) : (
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-white/25 line-through">{product.price_points} ?</span>
                            <span className="flex items-center gap-1 text-sm font-black text-white/40">
                              {Math.round(product.price_points * 0.85)} ?
                              <Lock className="h-3 w-3" />
                            </span>
                          </div>
                          <span className="text-[10px] text-white/30">D�bloqu� si la communaut� atteint 100%</span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
                <div className="w-1 shrink-0" />
              </div>
            </div>
          )}
        </div>

        {/* Section : Comment contribuer ? */}
        {!isGoalReached && (
          <div className="mx-5 mb-4 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-4 sm:mx-6">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-white/40">Comment contribuer ?</p>
            <ul className="space-y-2.5">
              {([
                { label: "Continuer l'Academy", detail: '+25 Graines par le�on' },
                { label: 'Soutenir un projet li�', detail: '+ contribution symbolique' },
                { label: 'Envoyer un Bravo', detail: '+ micro-contribution sociale' },
                { label: 'D�couvrir une esp�ce BioDex', detail: 'Progression de faction' },
              ] as Array<{ label: string; detail: string }>).map((item) => (
                <li key={item.label} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-white/70">{item.label}</span>
                  <span className="shrink-0 text-xs font-semibold text-white/30">{item.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Encart abonnement contextuel si connect� sans abonnement */}
        {isConnected && initialFaction && !hasSubscription && (
          <div className="mx-5 mb-4 flex items-center gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3.5 sm:mx-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400/10">
              <Sparkles className="h-5 w-5 text-amber-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white/60">Acc�s Avantages</span>
                <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-amber-400">
                  ?? Gardiens
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-white/40">
                D�bloquez les avantages exclusifs de la saison collective.
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
              Contribuer � l'objectif <Sprout className="inline h-[1.2em] w-[1.2em] align-text-bottom" />
            </Link>
          ) : !initialFaction ? (
            <Link
              href="/onboarding/setup"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-lime-400 text-sm font-bold text-black shadow-[0_0_25px_rgba(163,230,53,0.3)] transition-transform hover:scale-[1.02] active:scale-95"
            >
              Choisir votre faction <Sprout className="inline h-[1.2em] w-[1.2em] align-text-bottom" />
            </Link>
          ) : !hasSubscription ? (
            <Link
              href="/profile/subscription"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 text-sm font-bold text-black shadow-[0_0_25px_rgba(251,191,36,0.3)] transition-transform hover:scale-[1.02] active:scale-95"
            >
              D�bloquer les avantages <Crown className="inline h-[1.2em] w-[1.2em] align-text-bottom" />
            </Link>
          ) : isGoalReached ? (
            <Link
              href="/impact"
              className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-95"
            >
              Retour au collectif
            </Link>
          ) : (
            <Link
              href="/adventure"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-lime-400 text-sm font-bold text-black shadow-[0_0_25px_rgba(163,230,53,0.3)] transition-transform hover:scale-[1.02] active:scale-95"
            >
              Contribuer � l'objectif <Sprout className="inline h-[1.2em] w-[1.2em] align-text-bottom" />
            </Link>
          )}
        </div>
      </div>
    </FullScreenSlideModal>
  )
}
