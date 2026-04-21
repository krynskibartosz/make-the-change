'use client'

import { useState } from 'react'
import { Bug, Hexagon, Cloud } from 'lucide-react'
import { Link } from '@/i18n/navigation'

const IMPACT_LEVELS = [
  { id: 0, label: 'Découverte', bees: '500', honey: '0,1', co2: '2', percentage: 0 },
  { id: 1, label: 'Engagé', bees: '1500', honey: '0,3', co2: '6', percentage: 50 },
  { id: 2, label: 'Gardien', bees: '3000', honey: '0,6', co2: '12', percentage: 100 },
]

export function Step3Contract() {
  const [selectedLevel, setSelectedLevel] = useState(1) // Default to "Engagé"

  const currentMetrics = IMPACT_LEVELS[Math.max(0, Math.min(selectedLevel, IMPACT_LEVELS.length - 1))]

  return (
    <div className="fixed inset-0 z-[100] h-[100dvh] w-full bg-[#0B0F15] flex flex-col overflow-hidden">
      {/* 1. HEADER (Fixe en haut) */}
      <div className="flex-none pt-safe-top px-6 py-4 flex items-center justify-between">
        <Link
          href="/onboarding/step-2"
          className="w-10 h-10 rounded-full bg-[#1A1F26] border border-white/5 flex items-center justify-center active:scale-95 transition-transform"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] flex items-center justify-center">
          <span className="text-xl">🎯</span>
        </div>
        <div className="w-10"></div>
      </div>

      {/* 2. BODY (Zone de contenu) */}
      <div className="flex-1 overflow-y-auto px-6 no-scrollbar flex flex-col justify-center pb-4 mt-2">
        <div className="flex flex-col text-center mb-8">
          <h1 className="text-3xl font-black text-white leading-tight mb-3 text-balance">Fixez votre objectif.</h1>
          <p className="text-base text-gray-400 font-medium leading-relaxed max-w-sm mx-auto text-pretty">
            Quel impact collectif souhaitez-vous générer ce mois-ci&nbsp;? Vous pourrez l'ajuster plus tard.
          </p>
        </div>

        {/* LE TABLEAU DE BORD DYNAMIQUE */}
        <div className="w-full max-w-md mx-auto bg-[#1A1F26]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>

          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block text-center mb-5">Votre impact estimé</span>

          <div className="grid grid-cols-3 gap-2 divide-x divide-white/5">
            <div className="flex flex-col items-center px-2">
              <Bug className="text-lime-400 mb-2 h-6 w-6" />
              <span className="text-2xl font-black text-white mb-0.5">{currentMetrics.bees}</span>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Abeilles</span>
            </div>
            <div className="flex flex-col items-center px-2">
              <Hexagon className="text-amber-500 mb-2 h-6 w-6" />
              <span className="text-2xl font-black text-white mb-0.5">{currentMetrics.honey}<span className="text-sm text-gray-400 font-bold">kg</span></span>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Miel</span>
            </div>
            <div className="flex flex-col items-center px-2">
              <Cloud className="text-sky-400 mb-2 h-6 w-6" />
              <span className="text-2xl font-black text-white mb-0.5">{currentMetrics.co2}<span className="text-sm text-gray-400 font-bold">kg</span></span>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">CO2</span>
            </div>
          </div>
        </div>

        {/* LE SLIDER PREMIUM */}
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-between px-2 mb-3">
            <span className={`text-xs font-bold uppercase ${selectedLevel === 0 ? 'text-emerald-400' : 'text-gray-500'}`}>Découverte</span>
            <span className={`text-xs font-bold uppercase ${selectedLevel === 1 ? 'text-emerald-400' : 'text-gray-500'}`}>Engagé</span>
            <span className={`text-xs font-bold uppercase ${selectedLevel === 2 ? 'text-emerald-400' : 'text-gray-500'}`}>Gardien</span>
          </div>

          <div className="relative h-14 bg-[#1A1F26] rounded-full border border-white/5 flex items-center px-1.5">
            <div className="absolute left-1.5 top-1.5 bottom-1.5 bg-emerald-500/20 rounded-full transition-all duration-500" style={{ width: `${currentMetrics.percentage}%` }}></div>

            <div
              className={`absolute w-12 h-11 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center transition-all duration-500 cursor-grab active:cursor-grabbing z-10`}
              style={{
                left: `calc(${currentMetrics.percentage}% + 6px)`,
                transform: 'translateX(-50%)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B0F15" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
            </div>

            <div className="absolute inset-0 flex z-20">
              <button onClick={() => setSelectedLevel(0)} className="flex-1 h-full" aria-label="Découverte"></button>
              <button onClick={() => setSelectedLevel(1)} className="flex-1 h-full" aria-label="Engagé"></button>
              <button onClick={() => setSelectedLevel(2)} className="flex-1 h-full" aria-label="Gardien"></button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FOOTER (Totalement FIXE en bas) */}
      <div className="flex-none px-6 pb-8 pt-4 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/95 to-transparent relative z-20">
        <Link
          href="/onboarding/step-4"
          className="w-full max-w-md mx-auto h-16 rounded-2xl bg-emerald-500 text-[#0B0F15] font-black text-lg flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-[0.98] transition-transform"
        >
          Valider mon objectif
        </Link>
      </div>
    </div>
  )
}
