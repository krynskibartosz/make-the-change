'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/navigation'

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
    <div className="px-6 flex flex-col items-center justify-center max-w-md mx-auto w-full h-full">
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
  )
}
