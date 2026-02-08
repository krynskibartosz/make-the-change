'use client'

import * as React from 'react'
import { Check, Moon, Sun, Monitor, Palette } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useThemeBrand } from '@/components/providers/theme-provider'
import { cn } from '@make-the-change/core/shared/utils'

export function ThemeSelector() {
  const { setTheme, theme } = useTheme()
  const { brand, setBrand } = useThemeBrand()
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          "hover:bg-accent hover:text-accent-foreground",
          "h-9 w-9"
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select theme"
      >
        <Palette className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-md z-50">
          <div className="px-2 py-1.5 text-sm font-semibold">Appearance</div>
          <div className="grid gap-1">
            <button
              onClick={() => setTheme('light')}
              className={cn(
                "flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                theme === 'light' && "bg-accent text-accent-foreground"
              )}
            >
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
              {theme === 'light' && <Check className="ml-auto h-4 w-4" />}
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={cn(
                "flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                theme === 'dark' && "bg-accent text-accent-foreground"
              )}
            >
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
              {theme === 'dark' && <Check className="ml-auto h-4 w-4" />}
            </button>
            <button
              onClick={() => setTheme('system')}
              className={cn(
                "flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                theme === 'system' && "bg-accent text-accent-foreground"
              )}
            >
              <Monitor className="mr-2 h-4 w-4" />
              <span>System</span>
              {theme === 'system' && <Check className="ml-auto h-4 w-4" />}
            </button>
          </div>
          
          <div className="my-1 h-px bg-muted" />
          
          <div className="px-2 py-1.5 text-sm font-semibold">Theme</div>
          <div className="grid gap-1">
            <button
              onClick={() => setBrand('default')}
              className={cn(
                "flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                brand === 'default' && "bg-accent text-accent-foreground"
              )}
            >
              <span className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 border border-slate-700" />
              <span>Default</span>
              {brand === 'default' && <Check className="ml-auto h-4 w-4" />}
            </button>
            <button
              onClick={() => setBrand('ocean')}
              className={cn(
                "flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                brand === 'ocean' && "bg-accent text-accent-foreground"
              )}
            >
              <span className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#0ea5e9]" />
              <span>Ocean</span>
              {brand === 'ocean' && <Check className="ml-auto h-4 w-4" />}
            </button>
            <button
              onClick={() => setBrand('forest')}
              className={cn(
                "flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                brand === 'forest' && "bg-accent text-accent-foreground"
              )}
            >
              <span className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#2d4a2b]" />
              <span>Forest</span>
              {brand === 'forest' && <Check className="ml-auto h-4 w-4" />}
            </button>
            <button
              onClick={() => setBrand('minimal')}
              className={cn(
                "flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                brand === 'minimal' && "bg-accent text-accent-foreground"
              )}
            >
              <span className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#36454f]" />
              <span>Minimal</span>
              {brand === 'minimal' && <Check className="ml-auto h-4 w-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
