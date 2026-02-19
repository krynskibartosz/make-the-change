'use client'

import { Button } from '@make-the-change/core/ui'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = resolvedTheme ?? theme
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark'

  const toggleTheme = () => {
    setTheme(nextTheme)
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="control-button" aria-label="Toggle theme">
        <span className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      aria-label={nextTheme === 'dark' ? 'Activer le mode sombre' : 'Activer le mode clair'}
      variant="ghost"
      size="icon"
      className={cn('control-button', currentTheme === 'dark' && 'ring-2 ring-primary/30')}
      onClick={toggleTheme}
    >
      {currentTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
