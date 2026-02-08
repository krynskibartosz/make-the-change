'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'

export type Brand = 
  | 'default' 
  | 'ocean' 
  | 'forest' 
  | 'minimal'
  | 'nostalgic'
  | 'neon'
  | 'vintage'
  | 'corporate'
  | 'eco'
  | 'pastel'
  | 'luxury'
  | 'retro'
  | 'neuro'
  | 'biolum'
  | 'heritage'

type ThemeContextType = {
  brand: Brand
  setBrand: (brand: Brand) => void
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [brand, setBrand] = React.useState<Brand>('default')
  const [mounted, setMounted] = React.useState(false)

  // Initialize from localStorage if available
  React.useEffect(() => {
    setMounted(true)
    const savedBrand = localStorage.getItem('app-brand') as Brand
    if (savedBrand) {
      setBrand(savedBrand)
    }
  }, [])

  // Update data-theme attribute
  React.useEffect(() => {
    if (!mounted) return
    
    const root = window.document.documentElement
    if (brand === 'default') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', brand)
    }
    localStorage.setItem('app-brand', brand)
  }, [brand, mounted])

  return (
    <NextThemesProvider {...props}>
      <ThemeContext.Provider value={{ brand, setBrand }}>
        {children}
      </ThemeContext.Provider>
    </NextThemesProvider>
  )
}

export const useThemeBrand = () => {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useThemeBrand must be used within a ThemeProvider')
  }
  return context
}
