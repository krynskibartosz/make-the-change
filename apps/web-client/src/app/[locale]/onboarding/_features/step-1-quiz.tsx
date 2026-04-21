'use client'

import { useState } from 'react'
import { CheckCircle2, HelpCircle, Trophy, X } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export function Step1Quiz() {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const correctAnswer = 2 // "4 millions de fleurs"

  return (
    <div className="fixed inset-0 z-[100] h-[100dvh] w-full bg-[#0B0F15] flex flex-col overflow-hidden">
      {/* 1. HEADER (Fixe en haut) */}
      <div className="flex-none pt-safe-top px-6 py-4 flex items-center">
        <Link
          href="/onboarding/step-0"
          className="w-10 h-10 rounded-full bg-[#1A1F26] border border-white/5 flex items-center justify-center active:scale-95 transition-transform"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
      </div>

      {/* 2. BODY (La zone de contenu, centrée verticalement) */}
      <div className="flex-1 overflow-y-auto px-6 no-scrollbar flex flex-col justify-center pb-8">
        <div className="flex flex-col text-center mb-8">
          <h1 className="text-3xl font-black text-white leading-tight mb-2 text-balance">
            Faisons un test rapide.
          </h1>
          <p className="text-base text-gray-400 font-medium leading-relaxed text-pretty">
            Combien de fleurs une abeille doit-elle butiner pour produire 1 kilo de miel ?
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
          {[
            "100 000 fleurs",
            "1 million de fleurs",
            "4 millions de fleurs",
          ].map((answer, i) => {
            const isSelected = selectedAnswer === i
            const isCorrect = i === correctAnswer
            const showResult = selectedAnswer !== null

            return (
              <button
                key={i}
                onClick={() => setSelectedAnswer(i)}
                disabled={selectedAnswer !== null}
                className={`w-full p-5 rounded-2xl border text-left active:scale-[0.98] transition-transform flex justify-between items-center ${
                  showResult
                    ? isSelected && !isCorrect
                      ? "bg-red-500/10 border-2 border-red-500"
                      : isCorrect
                        ? "bg-emerald-500/10 border-2 border-emerald-500"
                        : "bg-[#1A1F26] border-white/5 opacity-50"
                    : "bg-[#1A1F26] border-white/5"
                }`}
              >
                <span className={`text-lg font-bold ${
                  showResult
                    ? isSelected && !isCorrect
                      ? "text-red-400"
                      : isCorrect
                        ? "text-emerald-400"
                        : "text-white"
                    : "text-white"
                }`}>
                  {answer}
                </span>
                {showResult && isCorrect && (
                  <CheckCircle2 size={20} className="text-emerald-400" strokeWidth={3} />
                )}
                {showResult && isSelected && !isCorrect && (
                  <X size={20} className="text-red-400" strokeWidth={3} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. FOOTER (Totalement FIXE en bas) */}
      <div className="flex-none px-6 pb-8 pt-4 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/95 to-transparent relative z-20">
        {selectedAnswer === correctAnswer && (
          <div className="w-full max-w-md mx-auto mb-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md flex gap-4 items-start animate-in zoom-in-95 duration-300">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Trophy size={20} className="text-emerald-400" />
            </div>
            <div className="flex flex-col pt-0.5">
              <span className="text-sm font-black text-emerald-400 mb-0.5">C'est exact !</span>
              <p className="text-xs text-gray-300 leading-relaxed">
                Le travail des pollinisateurs est colossal. Voici <span className="text-lime-400 font-bold">500 Graines</span> pour récompenser votre curiosité.
              </p>
            </div>
          </div>
        )}

        <Link
          href="/onboarding/step-2"
          className={`w-full max-w-md mx-auto h-16 rounded-2xl bg-lime-400 text-[#0B0F15] font-black text-lg flex items-center justify-center shadow-[0_0_20px_rgba(132,204,22,0.2)] active:scale-[0.98] transition-transform ${selectedAnswer !== correctAnswer ? 'opacity-50 pointer-events-none' : ''}`}
        >
          Continuer
        </Link>
      </div>
    </div>
  )
}
