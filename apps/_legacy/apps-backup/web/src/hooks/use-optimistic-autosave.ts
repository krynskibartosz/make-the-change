'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// ============================================================================
// Types
// ============================================================================

export type SaveStatus =
  | 'pristine'        // Tout sauvegardé
  | 'pending'         // Modifications en attente (debounce actif)
  | 'saving'          // Sauvegarde en cours
  | 'saved'           // Sauvegardé récemment (feedback 3s)
  | 'error';          // Erreur de sauvegarde

export type SaveFn<T> = (data: T) => Promise<void>;

export interface AutoSaveOptions<T> {
  // Fonction de sauvegarde (doit être stable - useCallback recommandé)
  saveFn: SaveFn<T>;

  // Debounce avant sauvegarde (défaut: 1500ms)
  debounceMs?: number;

  // Durée d'affichage du statut "saved" (défaut: 3000ms)
  savedIndicatorMs?: number;

  // Activer le retry automatique en cas d'erreur (défaut: true)
  enableRetry?: boolean;

  // Nombre max de tentatives (défaut: 3)
  maxRetries?: number;

  // Activer les logs de debug (défaut: false)
  debug?: boolean;
}

export interface AutoSaveReturn {
  // Statut actuel de la sauvegarde
  status: SaveStatus;

  // Dernière sauvegarde réussie
  lastSavedAt: Date | null;

  // Message d'erreur si status = 'error'
  errorMessage: string | null;

  // Déclencher une sauvegarde immédiate (ex: au blur)
  saveNow: () => Promise<void>;

  // Marquer qu'il y a des modifications (lance le debounce)
  markDirty: () => void;

  // Annuler le debounce en cours
  cancel: () => void;

  // Nombre de modifications en attente de sauvegarde
  pendingChanges: number;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook d'auto-save optimisé avec les meilleures pratiques UX 2025.
 *
 * Features:
 * - Debounce intelligent (1500ms par défaut)
 * - Flush immédiat au blur via saveNow()
 * - Retry automatique avec backoff exponentiel
 * - Queue de modifications pour éviter les race conditions
 * - Visual feedback (pristine/pending/saving/saved/error)
 * - Optimistic UI ready
 *
 * @example
 * ```tsx
 * const autoSave = useOptimisticAutoSave({
 *   saveFn: async (data) => {
 *     await updateProduct(data);
 *     await updateTranslations(data);
 *   }
 * });
 *
 * // Dans un onChange
 * setValue('name', newValue);
 * autoSave.markDirty();
 *
 * // Dans un onBlur
 * autoSave.saveNow();
 * ```
 */
export function useOptimisticAutoSave<T = unknown>({
  saveFn,
  debounceMs = 1500,
  savedIndicatorMs = 3000,
  enableRetry = true,
  maxRetries = 3,
  debug = false,
}: AutoSaveOptions<T>): AutoSaveReturn {
  const { toast } = useToast();

  // State
  const [status, setStatus] = useState<SaveStatus>('pristine');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState(0);

  // Refs
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const savedIndicatorTimerRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const isSavingRef = useRef(false);
  const dataQueueRef = useRef<T | null>(null);

  // Debug logger
  const log = useCallback((...args: unknown[]) => {
    if (debug) {
      console.log('[useOptimisticAutoSave]', ...args);
    }
  }, [debug]);

  // Cleanup timers
  const clearTimers = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (savedIndicatorTimerRef.current) {
      clearTimeout(savedIndicatorTimerRef.current);
      savedIndicatorTimerRef.current = null;
    }
  }, []);

  // Core save function with retry logic
  const executeSave = useCallback(async (data?: T) => {
    if (isSavingRef.current) {
      log('Save already in progress, skipping');
      return;
    }

    try {
      isSavingRef.current = true;
      setStatus('saving');
      setErrorMessage(null);
      clearTimers();

      log('Executing save...', { retryCount: retryCountRef.current });

      // Execute save function
      await saveFn(data as T);

      // Success
      isSavingRef.current = false;
      retryCountRef.current = 0;
      setPendingChanges(0);
      dataQueueRef.current = null;
      setLastSavedAt(new Date());
      setStatus('saved');

      log('Save successful');

      // Show "saved" indicator for 3 seconds
      savedIndicatorTimerRef.current = setTimeout(() => {
        setStatus('pristine');
      }, savedIndicatorMs);

    } catch (error) {
      isSavingRef.current = false;
      const message = error instanceof Error ? error.message : 'Erreur de sauvegarde';

      log('Save failed:', message, { retryCount: retryCountRef.current });

      // Retry logic
      if (enableRetry && retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        const backoffMs = Math.min(1000 * Math.pow(2, retryCountRef.current - 1), 8000);

        log(`Retrying in ${backoffMs}ms (attempt ${retryCountRef.current}/${maxRetries})`);

        toast({
          variant: 'default',
          title: 'Nouvelle tentative de sauvegarde...',
          description: `Tentative ${retryCountRef.current}/${maxRetries}`,
        });

        setTimeout(() => {
          void executeSave(data);
        }, backoffMs);

      } else {
        // Max retries exceeded or retry disabled
        setStatus('error');
        setErrorMessage(message);

        toast({
          variant: 'destructive',
          title: 'Échec de sauvegarde',
          description: message,
        });

        log('Max retries exceeded or retry disabled');
      }
    }
  }, [saveFn, enableRetry, maxRetries, savedIndicatorMs, clearTimers, log, toast]);

  // Save immediately (used on blur)
  const saveNow = useCallback(async () => {
    console.log('💾 [AutoSave] saveNow() called');

    // Cancel debounce
    clearTimers();

    // Execute immediately
    console.log('⚡ [AutoSave] Executing save NOW');
    await executeSave(dataQueueRef.current as T);
  }, [executeSave, clearTimers, log]);

  // Mark dirty (triggers debounce)
  const markDirty = useCallback(() => {
    console.log('🔵 [AutoSave] markDirty() called');

    // Clear existing debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Update status (use callback form to avoid dependency on status)
    setStatus(currentStatus => currentStatus === 'saving' ? currentStatus : 'pending');

    // Increment pending changes counter
    setPendingChanges(prev => prev + 1);

    // Schedule save
    debounceTimerRef.current = setTimeout(() => {
      console.log('⏰ [AutoSave] Debounce elapsed, executing save');
      void executeSave(dataQueueRef.current as T);
    }, debounceMs);

  }, [debounceMs, executeSave, log]); // ← Removed 'status' dependency

  // Cancel debounce
  const cancel = useCallback(() => {
    log('cancel() called');
    clearTimers();
    setPendingChanges(0);
    setStatus(currentStatus => currentStatus === 'pending' ? 'pristine' : currentStatus);
  }, [clearTimers, log]); // ← Removed 'status' dependency

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return {
    status,
    lastSavedAt,
    errorMessage,
    saveNow,
    markDirty,
    cancel,
    pendingChanges,
  };
}
