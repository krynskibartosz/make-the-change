'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import type { ExperienceStepId } from '../_lib/antsirabe-experience-content'
import { EXPERIENCE_STEPS } from '../_lib/antsirabe-experience-content'
import { IntroCinematic } from './intro-cinematic'
import { TerritoryMap } from './territory-map'

const IMPLEMENTED_STEPS = EXPERIENCE_STEPS.filter((s) => s.implemented).map((s) => s.id)

function ProgressDots({ current }: { current: ExperienceStepId }) {
  const currentIndex = IMPLEMENTED_STEPS.indexOf(current)
  return (
    <div className="flex items-center gap-1.5">
      {IMPLEMENTED_STEPS.map((id, i) => (
        <motion.div
          key={id}
          animate={{
            width: i === currentIndex ? 20 : 6,
            backgroundColor:
              i <= currentIndex ? 'rgba(16,185,129,0.9)' : 'rgba(255,255,255,0.15)',
          }}
          transition={{ duration: 0.3 }}
          className="h-1.5 rounded-full"
        />
      ))}
    </div>
  )
}

export function AntsirabeExperienceShell() {
  const [step, setStep] = useState<ExperienceStepId>('intro')

  const currentIndex = IMPLEMENTED_STEPS.indexOf(step)
  const nextStep = IMPLEMENTED_STEPS[currentIndex + 1] ?? null

  const goNext = nextStep ? () => setStep(nextStep) : null

  const isIntro = step === 'intro'

  return (
    <FullScreenSlideModal
      headerMode={isIntro ? 'close' : 'dynamic'}
      title="Ruchers Antsirabe"
      fallbackHref="/learn"
      className="bg-[#05050A] text-white"
      contentClassName="relative flex h-full flex-col overflow-hidden"
      headerRight={!isIntro ? <ProgressDots current={step} /> : undefined}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          className="absolute inset-0"
        >
          {step === 'intro'     && <IntroCinematic onNext={goNext ?? (() => setStep('territory'))} />}
          {step === 'territory' && <TerritoryMap   onNext={goNext} />}
        </motion.div>
      </AnimatePresence>
    </FullScreenSlideModal>
  )
}
