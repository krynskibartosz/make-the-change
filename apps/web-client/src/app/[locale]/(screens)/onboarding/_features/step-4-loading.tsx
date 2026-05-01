'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'

export function Step4Loading() {
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Analyse de votre profil...")
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => router.push('/onboarding/step-5'), 400)
          return 100
        }
        const newProgress = prev + 1
        if (newProgress === 25)
          setLoadingText("Assignation de votre Mascotte...")
        if (newProgress === 50)
          setLoadingText("Préparation de votre BioDex...")
        if (newProgress === 75)
          setLoadingText("Génération des recommandations éthiques...")
        return newProgress
      });
    }, 40);
    return () => clearInterval(interval);
  }, [router])

  return (
    <div className="fixed inset-0 z-[100] h-[100dvh] w-full bg-[#0B0F15] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-none pt-safe-top px-6 py-4 flex items-center justify-between">
        <Link
          href="/onboarding/step-3"
          className="w-10 h-10 rounded-full bg-[#1A1F26] border border-white/5 flex items-center justify-center active:scale-95 transition-transform"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <div className="w-10"></div>
        <div className="w-10"></div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 no-scrollbar flex flex-col justify-center">
        <div className="flex flex-col items-center justify-center max-w-md mx-auto w-full">
          <div className="relative w-32 h-32 mb-8">
            <svg
              className="w-full h-full animate-spin text-emerald-500/20"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                strokeDasharray="60 40"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-black text-white">
                {loadingProgress}%
              </span>
            </div>
          </div>
          <h2 className="text-2xl font-black text-center mb-4">
            Création de votre expérience...
          </h2>
          <div className="h-6 overflow-hidden">
            <p className="text-emerald-400 text-sm font-medium animate-pulse text-center">
              {loadingText}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-none px-6 pb-8 pt-4 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/95 to-transparent relative z-20">
        <div className="w-full max-w-md mx-auto"></div>
      </div>
    </div>
  )
}
