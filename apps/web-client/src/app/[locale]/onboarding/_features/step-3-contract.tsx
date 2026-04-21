'use client'

import { useState } from 'react'
import { Check, Hourglass } from 'lucide-react'
import { Link } from '@/i18n/navigation'

const TIME_OPTIONS = [
  {
    id: '1min',
    time: "1 min",
    desc: "Juste récupérer mes graines",
    tag: "",
  },
  { id: '3min', time: "3 min", desc: "Lecture + Défis", tag: "Recommandé" },
  { id: '5min', time: "5+ min", desc: "Impact Maximum", tag: "" },
]

export function Step3Contract() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

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
          <Hourglass size={24} className="text-emerald-400" />
        </div>
        <div className="w-10"></div>
      </div>

      {/* 2. BODY (La zone de contenu, centrée) */}
      <div className="flex-1 overflow-y-auto px-6 no-scrollbar flex flex-col justify-center pb-8 mt-4">
        <div className="flex flex-col text-center mb-10">
          <h1 className="text-3xl font-black text-white leading-tight mb-3 text-balance">L'impact, c'est la régularité.</h1>
          <p className="text-base text-gray-400 font-medium leading-relaxed max-w-sm mx-auto text-pretty">
            Même quelques minutes suffisent. Combien de temps pouvez-vous nous accorder par jour&nbsp;?
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
          {TIME_OPTIONS.map((option) => {
            const isSelected = selectedOption === option.id
            return (
              <button
                key={option.id}
                onClick={() => setSelectedOption(option.id)}
                className={`w-full p-5 rounded-2xl flex justify-between items-center active:scale-[0.98] transition-all text-left ${
                  isSelected
                    ? "bg-emerald-500/10 border-2 border-emerald-500"
                    : "bg-[#1A1F26] border border-white/5"
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-lg font-bold ${isSelected ? "text-emerald-400" : "text-white"}`}>
                      {option.time}
                    </span>
                    {option.tag && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase bg-emerald-500 text-[#0B0F15]">
                        {option.tag}
                      </span>
                    )}
                  </div>
                  <span className={`text-sm ${isSelected ? "text-gray-400" : "text-gray-500"}`}>{option.desc}</span>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  isSelected
                    ? "bg-emerald-500"
                    : "border-2 border-white/20"
                }`}>
                  {isSelected && <Check size={12} className="text-[#0B0F15]" strokeWidth={4} />}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. FOOTER (Totalement FIXE en bas) */}
      <div className="flex-none px-6 pb-8 pt-4 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/95 to-transparent relative z-20">
        <Link
          href="/onboarding/step-4"
          className={`w-full max-w-md mx-auto h-16 rounded-2xl bg-emerald-500 text-[#0B0F15] font-black text-lg flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-[0.98] transition-transform ${!selectedOption ? 'opacity-50 pointer-events-none' : ''}`}
        >
          Continuer
        </Link>
      </div>
    </div>
  )
}
