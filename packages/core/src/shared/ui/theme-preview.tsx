'use client'

import * as React from 'react'
import { cn } from '../../shared/utils/cn'

interface ThemePreviewProps {
  brand: string
  currentTheme: string
  className?: string
  customVars?: Record<string, string>
}

export const ThemePreview = ({ brand, currentTheme, className, customVars }: ThemePreviewProps) => {
  return (
    <div 
      data-theme={(brand === 'default' || brand === 'custom') ? undefined : brand}
      className={cn(
        "w-full aspect-[16/10] rounded-lg border overflow-hidden transition-all duration-300 relative group/preview",
        currentTheme === 'dark' ? 'dark bg-[#0f1419]' : 'bg-white',
        className
      )}
      style={{
        backgroundColor: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
        borderColor: 'hsl(var(--border))',
        ...customVars
      }}
    >
      <div className="flex h-full w-full">
        {/* Mini Sidebar */}
        <div 
          className="w-1/4 h-full border-r p-1.5 space-y-1.5"
          style={{ backgroundColor: 'hsl(var(--muted) / 0.3)', borderColor: 'hsl(var(--border))' }}
        >
          <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: 'hsl(var(--primary) / 0.2)' }} />
          <div className="h-1 w-3/4 rounded-full" style={{ backgroundColor: 'hsl(var(--muted-foreground) / 0.2)' }} />
          <div className="h-1 w-5/6 rounded-full" style={{ backgroundColor: 'hsl(var(--muted-foreground) / 0.2)' }} />
          <div className="pt-2">
            <div className="h-1 w-full rounded-full" style={{ backgroundColor: 'hsl(var(--muted-foreground) / 0.1)' }} />
          </div>
        </div>
        
        {/* Mini Content */}
        <div className="flex-1 p-2 space-y-2">
          {/* Header Area */}
          <div className="flex justify-between items-center pb-1">
            <div className="h-2 w-1/3 rounded-full" style={{ backgroundColor: 'hsl(var(--foreground) / 0.15)' }} />
            <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: 'hsl(var(--primary))' }} />
          </div>
          
          {/* Card Mockup */}
          <div 
            className="rounded p-2 space-y-1.5 shadow-sm border"
            style={{ 
              backgroundColor: 'hsl(var(--card))', 
              color: 'hsl(var(--card-foreground))',
              borderColor: 'hsl(var(--border))'
            }}
          >
            <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: 'hsl(var(--foreground) / 0.1)' }} />
            <div className="h-1 w-2/3 rounded-full" style={{ backgroundColor: 'hsl(var(--foreground) / 0.05)' }} />
            
            <div className="flex gap-1 pt-1">
              <div className="h-2.5 w-6 rounded-sm shadow-sm" style={{ backgroundColor: 'hsl(var(--primary))' }} />
              <div className="h-2.5 w-6 rounded-sm border" style={{ backgroundColor: 'hsl(var(--secondary))', borderColor: 'hsl(var(--border))' }} />
              <div className="h-2.5 w-2.5 rounded-full ml-auto" style={{ backgroundColor: 'hsl(var(--accent))' }} />
            </div>
          </div>

          {/* Bottom area */}
          <div className="flex gap-1.5">
            <div className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: 'hsl(var(--muted) / 0.5)' }} />
            <div className="h-1.5 w-4 rounded-full" style={{ backgroundColor: 'hsl(var(--success) / 0.4)' }} />
          </div>
        </div>
      </div>
      
      {/* Label overlays for education */}
      <div className="absolute bottom-1 right-1 opacity-0 group-hover/preview:opacity-100 transition-opacity pointer-events-none">
        <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-black/50 text-white backdrop-blur-sm">
          {brand}
        </span>
      </div>
    </div>
  )
}
