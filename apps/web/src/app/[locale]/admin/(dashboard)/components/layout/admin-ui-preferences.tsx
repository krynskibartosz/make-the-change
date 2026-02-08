'use client'

import type { FC, PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type AdminUiPreferences = {
  workMode: boolean
  setWorkMode: (enabled: boolean) => void
  toggleWorkMode: () => void
}

const AdminUiPreferencesContext = createContext<AdminUiPreferences | null>(null)

const STORAGE_KEY = 'mtc.admin.workMode'
const HTML_DATA_ATTR = 'data-admin-work-mode'

/**
 * Provides UI preferences for the admin dashboard shell.
 *
 * Work mode reduces decorative/ornamental UI to improve scanning speed and
 * cognitive fluency during long admin sessions.
 */
export const AdminUiPreferencesProvider: FC<PropsWithChildren> = ({ children }) => {
  const [workMode, setWorkModeState] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw === 'true') setWorkModeState(true)
    } catch {
      setWorkModeState(false)
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(workMode))
    } catch {
      // ignore write failures
    }

    if (workMode) {
      document.documentElement.setAttribute(HTML_DATA_ATTR, 'true')
    } else {
      document.documentElement.removeAttribute(HTML_DATA_ATTR)
    }
  }, [workMode])

  const setWorkMode = useCallback((enabled: boolean) => setWorkModeState(enabled), [])

  const toggleWorkMode = useCallback(() => {
    setWorkModeState((prev) => !prev)
  }, [])

  const value = useMemo<AdminUiPreferences>(
    () => ({
      workMode,
      setWorkMode,
      toggleWorkMode,
    }),
    [setWorkMode, toggleWorkMode, workMode],
  )

  return (
    <AdminUiPreferencesContext.Provider value={value}>
      {children}
    </AdminUiPreferencesContext.Provider>
  )
}

/**
 * Reads UI preferences for the admin dashboard.
 *
 * @throws if used outside {@link AdminUiPreferencesProvider}.
 */
export const useAdminUiPreferences = (): AdminUiPreferences => {
  const ctx = useContext(AdminUiPreferencesContext)
  if (!ctx) {
    throw new Error('useAdminUiPreferences must be used within an AdminUiPreferencesProvider')
  }
  return ctx
}
