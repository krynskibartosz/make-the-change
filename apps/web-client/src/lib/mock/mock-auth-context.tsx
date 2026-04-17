'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  MOCK_AUTH_KEY,
  MOCK_USER,
  type MockFaction,
  type MockUser,
} from '@/lib/mock/mock-data'

// ============================================================
// TYPES
// ============================================================

type MockAuthState = {
  isMockLoggedIn: boolean
  mockUser: MockUser | null
  isAuthModalOpen: boolean
  pendingAction: (() => void) | null
}

type MockAuthContextValue = MockAuthState & {
  mockLogin: (name?: string) => void
  mockLogout: () => void
  setFaction: (faction: MockFaction) => void
  openAuthModal: () => void
  closeAuthModal: () => void
  setPendingAction: (fn: () => void) => void
  clearPendingAction: () => void
}

// ============================================================
// CONTEXT
// ============================================================

const MockAuthContext = createContext<MockAuthContextValue | null>(null)

// ============================================================
// HELPERS — sessionStorage read/write
// ============================================================

function readAuthFromSession(): { user: MockUser; isLoggedIn: boolean } | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(MOCK_AUTH_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { user: MockUser; isLoggedIn: boolean }
    if (!parsed.isLoggedIn || !parsed.user) return null
    return parsed
  } catch {
    return null
  }
}

function writeAuthToSession(user: MockUser | null, isLoggedIn: boolean) {
  if (typeof window === 'undefined') return
  try {
    if (!isLoggedIn || !user) {
      sessionStorage.removeItem(MOCK_AUTH_KEY)
      return
    }
    sessionStorage.setItem(MOCK_AUTH_KEY, JSON.stringify({ user, isLoggedIn }))
  } catch {
    // Ignore sessionStorage quota errors
  }
}

// ============================================================
// PROVIDER
// ============================================================

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MockAuthState>({
    isMockLoggedIn: false,
    mockUser: null,
    isAuthModalOpen: false,
    pendingAction: null,
  })

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    const saved = readAuthFromSession()
    if (saved) {
      setState((prev) => ({
        ...prev,
        isMockLoggedIn: true,
        mockUser: saved.user,
      }))
    }
  }, [])

  const mockLogin = useCallback((name?: string) => {
    const user: MockUser = {
      ...MOCK_USER,
      name: name || MOCK_USER.name,
    }
    writeAuthToSession(user, true)
    setState((prev) => ({
      ...prev,
      isMockLoggedIn: true,
      mockUser: user,
      isAuthModalOpen: false,
    }))
  }, [])

  const mockLogout = useCallback(() => {
    writeAuthToSession(null, false)
    setState((prev) => ({
      ...prev,
      isMockLoggedIn: false,
      mockUser: null,
      pendingAction: null,
    }))
  }, [])

  const setFaction = useCallback((faction: MockFaction) => {
    setState((prev) => {
      if (!prev.mockUser) return prev
      const updated = { ...prev.mockUser, faction }
      writeAuthToSession(updated, true)
      return { ...prev, mockUser: updated }
    })
  }, [])

  const openAuthModal = useCallback(() => {
    setState((prev) => ({ ...prev, isAuthModalOpen: true }))
  }, [])

  const closeAuthModal = useCallback(() => {
    setState((prev) => ({ ...prev, isAuthModalOpen: false }))
  }, [])

  const setPendingAction = useCallback((fn: () => void) => {
    setState((prev) => ({ ...prev, pendingAction: fn }))
  }, [])

  const clearPendingAction = useCallback(() => {
    setState((prev) => ({ ...prev, pendingAction: null }))
  }, [])

  return (
    <MockAuthContext.Provider
      value={{
        ...state,
        mockLogin,
        mockLogout,
        setFaction,
        openAuthModal,
        closeAuthModal,
        setPendingAction,
        clearPendingAction,
      }}
    >
      {children}
    </MockAuthContext.Provider>
  )
}

// ============================================================
// HOOK
// ============================================================

export function useMockAuth() {
  const ctx = useContext(MockAuthContext)
  if (!ctx) {
    throw new Error('useMockAuth must be used inside <MockAuthProvider>')
  }
  return ctx
}
