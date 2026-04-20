'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Crown, ShieldCheck } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'

type PlanType = 'monthly' | 'annual'

export default function SubscriptionPage() {
  const router = useRouter()
  const [planType, setPlanType] = useState<PlanType>('annual')

  useEffect(() => {
    const bottomNav = document.getElementById('mobile-bottom-nav')
    if (bottomNav) {
      bottomNav.style.display = 'none'
    }

    return () => {
      if (bottomNav) {
        bottomNav.style.display = ''
      }
    }
  }, [])

  const pricing = {
    monthly: {
      price: '4,99',
      period: '/ mois',
      savings: null,
      disclaimer: 'Facturé mensuellement. Sans engagement.',
    },
    annual: {
      price: '47,90',
      period: '/ an',
      savings: 'Vous économisez 12€ par an',
      disclaimer: 'Facturé annuellement. Sans engagement.',
    },
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
        <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-full aspect-square bg-lime-500/15 blur-[120px] rounded-full z-0" />
        <div className="relative z-10">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-lime-400/10">
            <Crown className="h-10 w-10 text-lime-400" />
          </div>
          <h1 className="mb-4 text-4xl sm:text-5xl font-black tracking-tighter text-white text-balance text-center">
            Devenez un Gardien.
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed text-pretty max-w-[300px] mx-auto text-center">
            Menez votre faction à la victoire et accédez aux privilèges exclusifs du collectif.
          </p>
        </div>
      </div>

      {/* Segmented Control */}
      <div className="mx-6 mt-6 p-1 bg-[#1A1F26] rounded-2xl flex gap-1 border border-white/5 relative z-10">
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
          <span className="absolute -top-2 right-2 px-2 py-0.5 rounded-full bg-lime-400 text-[#0B0F15] text-[9px] font-black uppercase tracking-widest">
            -20%
          </span>
        </button>
      </div>

      {/* Bento Grid of Privileges */}
      <div className="px-6 mt-8 grid grid-cols-2 gap-3 mb-8 relative z-10">
        {/* Card 1 — Moteur de l'Essaim (full width) */}
        <div className="col-span-2 p-6 rounded-3xl bg-gradient-to-br from-lime-400/10 to-[#1A1F26] border border-lime-400/20 flex flex-col items-start gap-2 relative overflow-hidden">
          <span className="text-3xl mb-2">🛡️</span>
          <h3 className="text-lg font-bold text-white leading-tight">Moteur de l'Essaim</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Vos quêtes rapportent{' '}
            <strong className="text-lime-400">2x plus de graines</strong> pour votre Sanctuaire
            et propulsent la progression collective de votre Faction deux fois plus vite dans le classement.
          </p>
        </div>

        {/* Card 2 — Accès Privilège (square) */}
        <div className="col-span-1 p-5 rounded-3xl bg-[#1A1F26] border border-white/5 flex flex-col gap-2 h-full">
          <span className="text-2xl mb-auto">⏳</span>
          <h3 className="text-sm font-bold text-white leading-snug mt-4">Accès Privilège</h3>
          <p className="text-[10px] text-gray-400 leading-relaxed">
            Accès anticipé de 24h aux récoltes limitées et{' '}
            <strong className="text-white">livraison toujours offerte</strong>.
          </p>
        </div>

        {/* Card 3 — L'Aura du Gardien (square) */}
        <div className="col-span-1 p-5 rounded-3xl bg-[#1A1F26] border border-white/5 flex flex-col gap-2 h-full relative overflow-hidden">
          <div className="absolute top-4 left-4 w-12 h-12 bg-lime-500/20 blur-xl rounded-full" />
          <span className="text-2xl mb-auto relative z-10">✨</span>
          <h3 className="text-sm font-bold text-white leading-snug mt-4 relative z-10">L'Aura du Gardien</h3>
          <p className="text-[10px] text-gray-400 leading-relaxed relative z-10">
            Débloquez le halo lumineux exclusif autour de votre profil public.
          </p>
        </div>
      </div>

      {/* Trust Badge */}
      <div className="flex items-center justify-center gap-2 px-6 mt-2 mb-4 opacity-70">
        <ShieldCheck className="h-3.5 w-3.5 text-gray-400 shrink-0" />
        <span className="text-[10px] text-gray-400 uppercase tracking-widest text-center">
          Votre impact financier sur les projets reste authentique et non modifié.
        </span>
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
            {pricing[planType].disclaimer}
          </span>
        </div>
      </div>
    </div>
  )
}
