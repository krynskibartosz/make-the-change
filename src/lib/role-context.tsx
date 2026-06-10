'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type AppRole = 'ouvrier' | 'chef' | 'admin' | 'client'

interface RoleContextType {
  role: AppRole
  setRole: (role: AppRole) => void
  isReady: boolean
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<AppRole>('admin')
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const savedRole = localStorage.getItem('clarus_app_role') as AppRole | null
    if (savedRole && ['ouvrier', 'chef', 'admin', 'client'].includes(savedRole)) {
      setRoleState(savedRole)
    }
    setIsReady(true)
  }, [])

  const setRole = (newRole: AppRole) => {
    setRoleState(newRole)
    localStorage.setItem('clarus_app_role', newRole)
  }

  return (
    <RoleContext.Provider value={{ role, setRole, isReady }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return context
}
