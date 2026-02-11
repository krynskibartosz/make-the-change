'use client'

import * as React from 'react'
import { cn } from '../../shared/utils/cn'

interface ThemePaletteProps {
  brand: string
  currentTheme: string
  className?: string
  customVars?: Record<string, string>
}

const PALETTE_GROUPS = [
  {
    name: 'Base',
    items: [
      { label: 'Fond', variable: '--background' },
      { label: 'Texte', variable: '--foreground' },
      { label: 'Bordure', variable: '--border' },
      { label: 'Entrée', variable: '--input' },
    ]
  },
  {
    name: 'Marque',
    items: [
      { label: 'Primaire', variable: '--primary' },
      { label: 'Secondaire', variable: '--secondary' },
      { label: 'Accent', variable: '--accent' },
      { label: 'Ring', variable: '--ring' },
    ]
  },
  {
    name: 'Statut',
    items: [
      { label: 'Succès', variable: '--success' },
      { label: 'Erreur', variable: '--destructive' },
      { label: 'Alerte', variable: '--warning' },
      { label: 'Info', variable: '--info' },
    ]
  }
]

export const ThemePalette = ({ brand, currentTheme, className, customVars }: ThemePaletteProps) => {
  return (
    <div 
      data-theme={(brand === 'default' || brand === 'custom') ? undefined : brand}
      className={cn(
        "w-full transition-all duration-300",
        className
      )}
      style={{
        ...customVars
      }}
    >
      <div className="space-y-6">
        {PALETTE_GROUPS.map((group) => (
          <div key={group.name} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-30">{group.name}</span>
              <div className="h-px flex-1 bg-border/20" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {group.items.map((item) => (
                <div key={item.variable} className="group relative flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors">
                  <div 
                    className="h-10 w-10 shrink-0 rounded-lg border shadow-sm ring-1 ring-black/5 group-hover:scale-110 transition-transform"
                    style={{ 
                      backgroundColor: `hsl(var(${item.variable}))`,
                      borderColor: 'hsl(var(--border))'
                    }}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-tight text-foreground/80 truncate">
                      {item.label}
                    </span>
                    <code className="text-[8px] font-mono text-foreground/30 opacity-60">
                      {item.variable}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-4 border-t border-dashed border-border/40 flex items-center justify-between">
        <div className="flex -space-x-2">
          {['--primary', '--secondary', '--accent', '--success'].map((v) => (
            <div 
              key={v}
              className="h-5 w-5 rounded-full border-2 border-background ring-1 ring-black/5" 
              style={{ backgroundColor: `hsl(var(${v}))` }} 
            />
          ))}
        </div>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-20">
          Source: {brand.toUpperCase()} ENGINE
        </span>
      </div>
    </div>
  )
}
