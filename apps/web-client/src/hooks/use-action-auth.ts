'use client'

import { useCallback } from 'react'
import { useMockAuth } from '@/lib/mock/mock-auth-context'

/**
 * useActionAuth — Soft Wall universel
 *
 * Utilisation :
 *   const { guardAction } = useActionAuth()
 *   <button onClick={() => guardAction(() => handleValidateQuest())} />
 *
 * → Si connecté : exécute immédiatement la callback
 * → Si non connecté : mémorise la callback + ouvre la modale d'auth
 *   Après inscription/connexion + choix de faction → la callback s'exécute automatiquement
 */
export function useActionAuth() {
  const { isMockLoggedIn, openAuthModal, setPendingAction } = useMockAuth()

  const guardAction = useCallback(
    (action: () => void) => {
      if (isMockLoggedIn) {
        action()
        return
      }

      // Mémoriser l'action et ouvrir la modale
      setPendingAction(action)
      openAuthModal()
    },
    [isMockLoggedIn, openAuthModal, setPendingAction]
  )

  return { guardAction, isMockLoggedIn }
}
