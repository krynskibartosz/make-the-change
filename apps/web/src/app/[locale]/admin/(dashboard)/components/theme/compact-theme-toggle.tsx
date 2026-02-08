'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { type FC, useEffect, useState } from 'react'

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn'

export const CompactThemeToggle: FC = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-gray-300">
        <div className="pointer-events-none block h-3 w-3 rounded-full bg-white shadow-sm ring-0 translate-x-1" />
      </div>
    )
  }

  const isDark = theme === 'dark'

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  return (
    <div className="flex items-center gap-1.5">
      <Sun
        className={cn(
          'h-3.5 w-3.5 transition-all duration-300',
          isDark ? 'text-muted-foreground' : 'text-yellow-500',
        )}
      />

      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="Basculer entre le mode clair et sombre"
        className={cn(
          'relative cursor-pointer inline-flex h-5 w-9 items-center rounded-full transition-colors',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1',
          isDark ? 'bg-primary' : 'bg-input dark:bg-muted',
        )}
        onClick={toggleTheme}
      >
        <span
          className={cn(
            'pointer-events-none block h-3 w-3 rounded-full bg-background shadow-sm ring-0 transition-transform',
            isDark ? 'translate-x-5' : 'translate-x-1',
          )}
        />
      </button>

      <Moon
        className={cn(
          'h-3.5 w-3.5 transition-all duration-300',
          isDark ? 'text-primary' : 'text-muted-foreground',
        )}
      />
    </div>
  )
}
