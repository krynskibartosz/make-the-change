'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { MOCK_FACTIONS } from '@/lib/mock/mock-data'
import { useMockAuth } from '@/lib/mock/mock-auth-context'

/**
 * WelcomeSetup — Écran plein écran de choix de faction
 * S'affiche automatiquement quand isMockLoggedIn && !mockUser.faction
 * Après le choix, exécute la pendingAction s'il en existe une
 */
export function WelcomeSetup() {
  const { isMockLoggedIn, mockUser, setFaction, pendingAction, clearPendingAction } = useMockAuth()

  const isVisible = isMockLoggedIn && mockUser !== null && mockUser.faction === null

  const handleSelectFaction = (factionId: (typeof MOCK_FACTIONS)[number]['id']) => {
    setFaction(factionId)
  }

  // Execute pending action once faction is set
  useEffect(() => {
    if (!isMockLoggedIn || !mockUser || mockUser.faction === null) return
    if (!pendingAction) return

    // Small delay to let the setup screen close first
    const timer = setTimeout(() => {
      pendingAction()
      clearPendingAction()
    }, 400)

    return () => clearTimeout(timer)
  }, [isMockLoggedIn, mockUser, pendingAction, clearPendingAction])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="welcome-setup"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col bg-[#0B0F15] overflow-y-auto"
        >
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-lime-500/10 blur-[120px]" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px]" />
          </div>

          <div className="relative z-10 flex flex-col items-center px-5 pt-16 pb-12">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-10"
            >
              <div className="text-5xl mb-4">🌿</div>
              <h1 className="text-3xl font-black text-white tracking-tight mb-3">
                Bienvenue, {mockUser?.name} !
              </h1>
              <p className="text-white/60 text-[16px] leading-relaxed max-w-xs mx-auto">
                Choisis ta <strong className="text-white">Faction</strong> — elle définit ta mission
                et ta communauté sur Make the Change.
              </p>
            </motion.div>

            {/* Faction Cards */}
            <div className="flex flex-col gap-4 w-full max-w-sm">
              {MOCK_FACTIONS.map((faction, index) => (
                <motion.button
                  key={faction.id}
                  type="button"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.08 }}
                  onClick={() => handleSelectFaction(faction.id)}
                  className={`
                    relative flex items-center gap-5 p-5 rounded-2xl border text-left
                    active:scale-[0.97] transition-all duration-200 overflow-hidden
                    ${faction.bgColor} ${faction.borderColor}
                    hover:brightness-110
                  `}
                >
                  {/* Gradient glow */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${faction.color} opacity-5`} />

                  <div className="text-4xl shrink-0 relative z-10">{faction.emoji}</div>

                  <div className="relative z-10 flex-1">
                    <p className={`text-lg font-black ${faction.textColor} tracking-tight`}>
                      {faction.label}
                    </p>
                    <p className="text-white/50 text-[13px] leading-tight mt-0.5">
                      {faction.description}
                    </p>
                  </div>

                  <div className={`shrink-0 relative z-10 ${faction.textColor} opacity-50`}>
                    →
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Skip hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-white/25 text-[11px] text-center uppercase tracking-widest"
            >
              Tu pourras changer de faction depuis ton profil
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
