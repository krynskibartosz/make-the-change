'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Crown, Lock, Sparkles, Zap } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'

type PlanType = 'monthly' | 'annual'

export default function SubscriptionPage() {
  const router = useRouter()
  const [planType, setPlanType] = useState<PlanType>('annual')

  useEffect(() => {
    // Hide mobile bottom nav when subscription page is active
    const bottomNav = document.getElementById('mobile-bottom-nav')
    if (bottomNav) {
      bottomNav.style.display = 'none'
    }

    return () => {
      // Restore mobile bottom nav when component unmounts
      if (bottomNav) {
        bottomNav.style.display = ''
      }
    }
  }, [])

  const pricing = {
    monthly: { price: '4,99', period: '/ mois', savings: null },
    annual: { price: '49,90', period: '/ an', savings: 'Vous économisez 10€ par an' },
  }

  return (
    <div className="min-h-screen bg-[#0B0F15] text-white flex flex-col pb-32">
      {/* Header */}
      <div className="sticky top-0 z-50 px-4 py-4 flex items-center bg-[#0B0F15]/80 backdrop-blur-md border-b border-white/5">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <span className="flex-1 text-center text-base font-semibold text-white">Le Cercle des Gardiens</span>
        <div className="w-10" />
      </div>

      {/* Hero with VIP Aura */}
      <div className="relative px-6 pt-12 pb-8 text-center">
        <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-64 w-full -translate-x-1/2 bg-lime-500/20 blur-[120px]" />
        <div className="relative z-10">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-lime-400/10">
            <Crown className="h-10 w-10 text-lime-400" />
          </div>
          <h1 className="mb-3 text-4xl font-black tracking-tight text-white">Devenez un Gardien</h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
            Rejoignez l'élite du collectif et débloquez des privilèges exclusifs.
          </p>
        </div>
      </div>

      {/* Segmented Control */}
      <div className="mx-6 mb-6 p-1 bg-[#1A1F26] rounded-2xl flex gap-1 border border-white/5 relative z-10">
        <button
          onClick={() => setPlanType('monthly')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex flex-col items-center ${
            planType === 'monthly' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'
          }`}
        >
          <span>Mensuel</span>
        </button>
        <button
          onClick={() => setPlanType('annual')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex flex-col items-center relative ${
            planType === 'annual' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'
          }`}
        >
          <span>Annuel</span>
          <span className="absolute -top-2 -right-1 px-2 py-0.5 rounded-full bg-lime-400 text-[#0B0F15] text-[9px] font-black uppercase tracking-widest">
            -20%
          </span>
        </button>
      </div>

      {/* Bento Grid of Privileges */}
      <div className="px-6 space-y-4">
        {/* Boost Card (Larger, highlighted) */}
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-lime-400/10 to-[#1A1F26] p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-lime-400/20">
              <Zap className="h-7 w-7 text-lime-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">Boost de Points</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Gagnez 50% de points en plus sur chaque investissement. Votre impact s'accélère.
              </p>
            </div>
          </div>
        </div>

        {/* Private Sales Card */}
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#1A1F26] p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/5">
              <Lock className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">Ventes Privées</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Accès anticipé aux produits limités et réassorts exclusifs avant tout le monde.
              </p>
            </div>
          </div>
        </div>

        {/* Faction Glow Card */}
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#1A1F26] p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/5">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">Glow de Faction</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Un halo lumineux autour de votre profil. Signez votre appartenance à l'élite.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15] to-transparent z-50">
        <div className="flex flex-col gap-3">
          <div className="flex items-end justify-center gap-1 mb-2">
            <span className="text-4xl font-black text-white leading-none">{pricing[planType].price} €</span>
            <span className="text-sm font-bold text-gray-500">{pricing[planType].period}</span>
          </div>
          {pricing[planType].savings && (
            <span className="text-xs text-lime-400 font-bold text-center -mt-2 mb-1">
              {pricing[planType].savings}
            </span>
          )}
          <button className="w-full bg-lime-400 text-[#0B0F15] font-black text-lg h-14 rounded-2xl active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(132,204,22,0.2)]">
            Devenir Gardien
          </button>
          <span className="text-[10px] text-gray-500 text-center uppercase tracking-widest">
            Facturé annuellement. Sans engagement.
          </span>
        </div>
      </div>
    </div>
  )
}
