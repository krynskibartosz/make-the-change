'use client'

import { type ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from '@/i18n/navigation'

type OnboardingLayoutProps = {
  children: ReactNode
  currentStep: number
  totalSteps: number
  prevStep?: number
}

export function OnboardingLayout({ children, currentStep, totalSteps, prevStep }: OnboardingLayoutProps) {
  const currentProgress = (currentStep / totalSteps) * 100

  return (
    <div className="min-h-screen bg-[#0B0F15] text-white font-sans flex flex-col relative overflow-hidden selection:bg-emerald-500/30">
      {/* Barre de progression */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/5 z-50">
        <div
          className="h-full bg-emerald-500 transition-all duration-500 ease-out"
          style={{ width: `${currentProgress}%` }}
        />
      </div>

      {/* Bouton Retour */}
      {prevStep !== undefined && (
        <Link
          href={`/onboarding/step-${prevStep}`}
          className="absolute top-6 left-6 z-50 w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} className="text-white/70" />
        </Link>
      )}

      <main className="flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </main>
    </div>
  )
}
