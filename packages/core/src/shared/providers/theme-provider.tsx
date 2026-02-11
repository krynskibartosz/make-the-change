'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'
import type { Brand } from '../ui/types'

type ThemeContextType = {
  brand: Brand
  setBrand: (brand: Brand) => void
  customVars: Record<string, string>
  setCustomVars: (vars: Record<string, string>) => void
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined)

export interface AppThemeProviderProps extends ThemeProviderProps {
  brandStorageKey?: string
  customVarsStorageKey?: string
  initialBrand?: Brand
  initialCustomVars?: Record<string, string>
}

export function AppThemeProvider({ 
  children, 
  brandStorageKey = 'app-brand',
  customVarsStorageKey = 'app-custom-vars',
  initialBrand,
  initialCustomVars,
  ...props 
}: AppThemeProviderProps) {
  const [brand, setBrand] = React.useState<Brand>(initialBrand || 'default')
  const [customVars, setCustomVars] = React.useState<Record<string, string>>(initialCustomVars || {})
  const [mounted, setMounted] = React.useState(false)

  // Initialize from localStorage if no initial props provided
  React.useEffect(() => {
    setMounted(true)
    if (!initialBrand) {
      const savedBrand = localStorage.getItem(brandStorageKey) as Brand
      if (savedBrand) {
        setBrand(savedBrand)
      }
    }
    if (!initialCustomVars) {
      const savedVars = localStorage.getItem(customVarsStorageKey)
      if (savedVars) {
        try {
          setCustomVars(JSON.parse(savedVars))
        } catch (e) {
          console.error('Failed to parse custom vars', e)
        }
      }
    }
  }, [brandStorageKey, customVarsStorageKey, initialBrand, initialCustomVars])

  // Update data-theme attribute and custom variables
  React.useEffect(() => {
    if (!mounted) return
    
    const root = window.document.documentElement
    
    // Handle brand attribute
    if (brand === 'default') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', brand)
    }
    
    // Handle custom variables injection
    if (brand === 'custom') {
      Object.entries(customVars).forEach(([key, value]) => {
        root.style.setProperty(key, value)
      })
    } else {
      // Clear inline styles when not in custom mode
      root.removeAttribute('style')
    }
    
    localStorage.setItem(brandStorageKey, brand)
    localStorage.setItem(customVarsStorageKey, JSON.stringify(customVars))
  }, [brand, customVars, mounted, brandStorageKey, customVarsStorageKey])

  return (
    <NextThemesProvider {...props}>
      <ThemeContext.Provider value={{ brand, setBrand, customVars, setCustomVars }}>
        {children}
      </ThemeContext.Provider>
    </NextThemesProvider>
  )
}

export const useThemeBrand = () => {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useThemeBrand must be used within a AppThemeProvider')
  }
  return context
}
