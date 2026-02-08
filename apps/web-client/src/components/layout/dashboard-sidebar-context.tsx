'use client'

import { createContext, type FC, type PropsWithChildren, useContext, useState } from 'react'

type DashboardSidebarContextType = {
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
  toggleMobileSidebar: () => void
}

const DashboardSidebarContext = createContext<DashboardSidebarContextType | undefined>(undefined)

export const DashboardSidebarProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const toggleMobileSidebar = () => setIsMobileOpen((prev) => !prev)

  return (
    <DashboardSidebarContext.Provider
      value={{ isMobileOpen, setIsMobileOpen, toggleMobileSidebar }}
    >
      {children}
    </DashboardSidebarContext.Provider>
  )
}

export const useDashboardSidebar = () => {
  const context = useContext(DashboardSidebarContext)
  if (!context) {
    throw new Error('useDashboardSidebar must be used within DashboardSidebarProvider')
  }
  return context
}
