'use client'

import { Shield, ChevronRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export function Step3Contract() {
  return (
    <div className="fixed inset-0 z-[100] h-[100dvh] w-full bg-[#0B0F15] flex flex-col overflow-hidden">
      {/* 1. HEADER (Fixe en haut) */}
      <div className="flex-none pt-safe-top px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/onboarding/step-2"
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md active:scale-95 transition-transform"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <div className="w-10"></div>
        </div>
      </div>

      {/* 2. BODY (Zone de contenu) */}
      <div className="flex-1 overflow-y-auto px-6 no-scrollbar flex flex-col items-center">
        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <Shield size={32} />
        </div>
        <h2 className="text-3xl font-black text-center mb-2 leading-tight">
          L'impact, c'est<br />la régularité.
        </h2>
        <p className="text-white/50 text-center mb-10 text-sm px-4">
          Même quelques minutes suffisent. Combien de temps pouvez-vous nous
          accorder par jour ?
        </p>

        <div className="w-full space-y-3 max-w-md mx-auto pb-8">
          {[
            {
              time: "1 min",
              desc: "Juste récupérer mes graines",
              tag: "",
            },
            { time: "3 min", desc: "Lecture + Défis", tag: "Recommandé" },
            { time: "5+ min", desc: "Impact Maximum", tag: "" },
          ].map((option, i) => (
            <Link
              key={i}
              href="/onboarding/step-4"
              className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 active:scale-95 transition-all flex items-center justify-between group"
            >
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-lg text-white">
                    {option.time}
                  </span>
                  {option.tag && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                      {option.tag}
                    </span>
                  )}
                </div>
                <span className="text-white/40 text-sm">{option.desc}</span>
              </div>
              <ChevronRight className="text-white/20 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
