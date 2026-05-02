'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useHaptic } from '@/hooks/use-haptic'

export function ImpactDisclaimer({ children }: { children: React.ReactNode }) {
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const haptic = useHaptic()

  const toggleDisclaimer = () => {
    haptic.lightTap()
    setShowDisclaimer((prev) => !prev)
  }

  return (
    <div className="mb-4 flex flex-col">
      <div className="flex items-start justify-between gap-4">
        {children}
        <button
          type="button"
          onClick={toggleDisclaimer}
          className={cn(
            "group relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all active:scale-95",
            showDisclaimer ? "bg-white/20 text-white" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80"
          )}
          aria-label="Informations sur les estimations"
          aria-expanded={showDisclaimer}
        >
          <Info className="h-4 w-4" />
        </button>
      </div>

      <AnimatePresence>
        {showDisclaimer && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-lime-400/20 bg-lime-400/10 p-4 text-sm leading-relaxed text-lime-50/90 shadow-sm">
              <strong className="block text-lime-400 mb-1">Pourquoi des estimations ?</strong>
              La nature est vivante et imprévisible. Ces chiffres sont des projections scientifiques de votre impact potentiel, afin de garantir une transparence totale sans greenwashing.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}