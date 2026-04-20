'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export function Step1Quiz() {
  const [quizAnswered, setQuizAnswered] = useState(false)

  return (
    <div className="px-6 flex flex-col items-center max-w-md mx-auto w-full pt-12">
      <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center text-3xl mb-6 border border-emerald-500/30">
        🤔
      </div>
      <h2 className="text-2xl font-black text-center mb-2">
        Faisons un test rapide.
      </h2>
      <p className="text-white/50 text-center mb-10">
        Combien de fleurs une abeille doit-elle butiner pour produire 1 kilo
        de miel ?
      </p>

      <div className="w-full space-y-3">
        {[
          "100 000 fleurs",
          "1 million de fleurs",
          "4 millions de fleurs",
        ].map((answer, i) => (
          <button
            key={i}
            onClick={() => setQuizAnswered(true)}
            disabled={quizAnswered}
            className={`w-full p-5 rounded-2xl border flex items-center justify-between text-lg font-bold transition-all ${quizAnswered
                ? i === 2
                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                  : "bg-white/5 border-white/5 opacity-50"
                : "bg-white/5 border-white/10 hover:bg-white/10 active:scale-95"
              }`}
          >
            {answer}
            {quizAnswered && i === 2 && (
              <CheckCircle2 size={20} className="text-emerald-400" />
            )}
          </button>
        ))}
      </div>

      {quizAnswered && (
        <div className="mt-8 p-5 bg-gradient-to-br from-emerald-900/40 to-transparent border border-emerald-500/30 rounded-2xl w-full animate-in zoom-in-95 duration-300">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🎉</div>
            <div>
              <h3 className="font-bold text-white mb-1">C'est exact !</h3>
              <p className="text-white/60 text-sm leading-snug mb-4">
                Le travail des pollinisateurs est colossal. Voici{" "}
                <strong className="text-emerald-400">500 Graines</strong>{" "}
                pour récompenser votre curiosité.
              </p>
              <Link
                href="/onboarding/step-2"
                className="bg-emerald-500 text-[#0B0F15] px-6 py-2 rounded-xl font-bold text-sm w-full inline-block text-center"
              >
                Continuer
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
