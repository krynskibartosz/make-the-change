'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { LoginForm } from '@/components/auth/login-form'
import { useMockAuth } from '@/lib/mock/mock-auth-context'

/**
 * AuthModal — Bottom-sheet de connexion/inscription
 * Contrôlé par MockAuthContext.isAuthModalOpen
 */
export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, mockLogin } = useMockAuth()

  if (!isAuthModalOpen) return null

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="auth-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
            onClick={closeAuthModal}
          />

          {/* Sheet */}
          <motion.div
            key="auth-modal-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 left-0 right-0 z-[91] flex flex-col rounded-t-[2.5rem] bg-[#0B0F15] border-t border-white/10 overflow-hidden max-h-[92dvh]"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={closeAuthModal}
              className="absolute top-5 right-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white transition-colors"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Note: LoginForm is wrapped to intercept success and call mockLogin */}
            <div className="flex-1 overflow-y-auto p-4 pb-safe">
              <MockLoginFormWrapper onSuccess={(name) => mockLogin(name)} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/**
 * Wrapper around LoginForm that intercepts success
 * to trigger mockLogin instead of redirecting
 */
function MockLoginFormWrapper({ onSuccess }: { onSuccess: (name: string) => void }) {
  // We use LoginForm in modal mode — its useEffect handles redirectUrl
  // We additionally call onSuccess via context side-effect in the form
  // For simplicity, we provide a simple inline form here
  return (
    <div className="flex flex-col gap-4 px-2">
      <div className="text-center pt-2 pb-4">
        <h2 className="text-2xl font-black text-white tracking-tight">Rejoins l'aventure</h2>
        <p className="text-white/60 text-sm mt-2">
          Connecte-toi pour valider tes défis et cumuler des points d'impact.
        </p>
      </div>

      <button
        type="button"
        onClick={() => onSuccess('Explorateur')}
        className="w-full h-14 rounded-2xl bg-lime-400 text-[#0B0F15] font-black text-[17px] flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-lime-400/20"
      >
        ⚡ Continuer sans email
        <span className="text-[13px] font-medium opacity-70">(Mode Test)</span>
      </button>

      <div className="relative flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-white/30 text-xs font-medium">ou</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Real login form */}
      <LoginForm modal />
    </div>
  )
}
