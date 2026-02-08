'use client'

import { useCallback, useRef, useState } from 'react'

// ============================================================================
// Types
// ============================================================================

export type SaveStatus =
  | 'pristine' // Tout sauvegardé
  | 'pending' // Modifications en attente (debounce actif)
  | 'saving' // Sauvegarde en cours
  | 'saved' // Sauvegardé récemment (feedback 3s)
  | 'error' // Erreur de sauvegarde

export type SaveFn<T> = (data: T) => Promise<void>

export interface AutoSaveOptions<T> {
  // Fonction de sauvegarde (doit être stable - useCallback recommandé)
  saveFn: SaveFn<T>

  // Debounce avant sauvegarde (défaut: 1500ms)
  debounceMs?: number

  // Durée d'affichage du statut "saved" (défaut: 3000ms)
  savedIndicatorMs?: number

  // Activer le retry automatique en cas d'erreur (défaut: true)
  enableRetry?: boolean

  // Nombre max de tentatives (défaut: 3)
  maxRetries?: number

  // Activer les logs de debug (défaut: false)
  debug?: boolean

  // Toast handler function (optional - must be provided by consumer)
  onToast?: (toast: {
    title: string
    description?: string
    variant?: 'info' | 'destructive'
  }) => void
}

export interface AutoSaveReturn<T> {
  // Statut actuel de la sauvegarde
  status: SaveStatus

  // Dernière sauvegarde réussie
  lastSavedAt: Date | null

  // Message d'erreur si status = 'error'
  errorMessage: string | null

  // Déclencher une sauvegarde immédiate (ex: au blur)
  saveNow: () => Promise<void>

  // Marquer qu'il y a des modifications (lance le debounce)
  // On passe les données à sauvegarder
  update: (data: Partial<T>) => void

  // Annuler le debounce en cours
  cancel: () => void

  // Données en attente de sauvegarde
  pendingData: Partial<T>
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook d'auto-save optimisé avec les meilleures pratiques UX.
 * Adapté pour les Server Actions.
 */
export function useOptimisticAutoSave<T extends Record<string, unknown>>({
  saveFn,
  debounceMs = 1500,
  savedIndicatorMs = 3000,
  enableRetry = true,
  maxRetries = 3,
  debug = false,
  onToast,
}: AutoSaveOptions<T>): AutoSaveReturn<T> {
  // State
  const [status, setStatus] = useState<SaveStatus>('pristine')
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [pendingData, setPendingData] = useState<Partial<T>>({})

  // Refs
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const savedIndicatorTimerRef = useRef<NodeJS.Timeout | null>(null)
  const retryCountRef = useRef(0)
  const isSavingRef = useRef(false)
  // On stocke les données accumulées dans une ref pour avoir toujours la version la plus récente
  // lors de l'exécution du save, même si le state React n'est pas encore à jour dans la closure
  const pendingDataRef = useRef<Partial<T>>({})

  // Debug logger
  const log = useCallback(
    (...args: unknown[]) => {
      if (debug) {
        console.log('[useOptimisticAutoSave]', ...args)
      }
    },
    [debug],
  )

  // Cleanup timers
  const clearTimers = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }
    if (savedIndicatorTimerRef.current) {
      clearTimeout(savedIndicatorTimerRef.current)
      savedIndicatorTimerRef.current = null
    }
  }, [])

  // Core save function with retry logic
  const executeSave = useCallback(async () => {
    // Si rien à sauvegarder
    if (Object.keys(pendingDataRef.current).length === 0) {
      return
    }

    if (isSavingRef.current) {
      log('Save already in progress, skipping')
      return
    }

    try {
      isSavingRef.current = true
      setStatus('saving')
      setErrorMessage(null)
      clearTimers()

      // On capture les données à sauvegarder
      const dataToSave = { ...pendingDataRef.current } as T
      log('Executing save...', { retryCount: retryCountRef.current, data: dataToSave })

      // Execute save function
      await saveFn(dataToSave)

      // Success
      // On retire seulement les clés qui ont été sauvegardées
      // (Au cas où de nouvelles modifs seraient arrivées entre temps - edge case rare mais possible)
      // Pour simplifier ici, on considère que tout pendingDataRef a été traité.
      // Si on voulait être puriste, on ferait un diff, mais avec les Server Actions
      // on envoie souvent des patchs partiels.

      // Reset pending data seulement si aucune nouvelle donnée n'est arrivée pendant la sauvegarde
      // (Approche naïve mais robuste pour 99% des cas)
      // Une approche plus robuste serait de ne supprimer que les clés envoyées.
      // Mais ici pendingDataRef est mutable.

      // On va supposer que saveFn a réussi pour TOUT le paquet.
      // On vide pendingDataRef MAIS on doit faire attention si de nouvelles données sont arrivées ?
      // Non, car isSavingRef bloque les nouveaux appels à executeSave,
      // MAIS update() peut continuer à remplir pendingDataRef.
      // DONC : il faut vider de pendingDataRef ce qu'on a envoyé.

      // Pour l'instant, on vide tout ce qui était présent au moment du début de la sauvegarde ?
      // Simplification : on vide pendingDataRef des clés envoyées.
      for (const key of Object.keys(dataToSave)) {
        delete pendingDataRef.current[key]
      }
      setPendingData({ ...pendingDataRef.current })

      isSavingRef.current = false
      retryCountRef.current = 0
      setLastSavedAt(new Date())
      setStatus('saved')

      log('Save successful')

      // Show "saved" indicator for 3 seconds
      savedIndicatorTimerRef.current = setTimeout(() => {
        setStatus('pristine')
      }, savedIndicatorMs)
    } catch (error) {
      isSavingRef.current = false
      const message = error instanceof Error ? error.message : 'Erreur de sauvegarde'

      log('Save failed:', message, { retryCount: retryCountRef.current })

      // Retry logic
      if (enableRetry && retryCountRef.current < maxRetries) {
        retryCountRef.current++
        const backoffMs = Math.min(1000 * 2 ** (retryCountRef.current - 1), 8000)

        log(`Retrying in ${backoffMs}ms (attempt ${retryCountRef.current}/${maxRetries})`)

        onToast?.({
          title: 'Nouvelle tentative de sauvegarde...',
          description: `Tentative ${retryCountRef.current}/${maxRetries}`,
          variant: 'info',
        })

        setTimeout(() => {
          void executeSave()
        }, backoffMs)
      } else {
        // Max retries exceeded or retry disabled
        setStatus('error')
        setErrorMessage(message)

        onToast?.({
          title: 'Échec de sauvegarde',
          description: message,
          variant: 'destructive',
        })
      }
    }
  }, [saveFn, enableRetry, maxRetries, savedIndicatorMs, log, clearTimers, onToast])

  // Public: Update data and schedule save
  const update = useCallback(
    (data: Partial<T>) => {
      // Merge new data into pending refs
      pendingDataRef.current = { ...pendingDataRef.current, ...data }
      setPendingData({ ...pendingDataRef.current })

      setStatus('pending')

      // Reset debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        void executeSave()
      }, debounceMs)
    },
    [debounceMs, executeSave],
  )

  // Public: Force immediate save
  const saveNow = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }
    await executeSave()
  }, [executeSave])

  // Public: Cancel pending save
  const cancel = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }
    setStatus('pristine')
    pendingDataRef.current = {}
    setPendingData({})
  }, [])

  return {
    status,
    lastSavedAt,
    errorMessage,
    saveNow,
    update,
    cancel,
    pendingData,
  }
}
