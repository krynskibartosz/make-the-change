'use client'

import * as React from 'react'
import { useThemeBrand } from '@/components/theme-provider'
import { cn } from '@make-the-change/core/shared/utils'
import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export const ThemeSelection = () => {
  const { setTheme, theme } = useTheme()
  const { brand, setBrand } = useThemeBrand()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const themes = [
    {
      id: 'default',
      name: 'Défaut',
      description: 'Le style classique de l\'application',
      colors: ['bg-slate-900', 'bg-slate-500', 'bg-slate-200'],
    },
    {
      id: 'ocean',
      name: 'Océan',
      description: 'Inspiré par la profondeur des mers',
      colors: ['bg-[#006064]', 'bg-[#0ea5e9]', 'bg-[#e0f7fa]'],
    },
    {
      id: 'forest',
      name: 'Forêt',
      description: 'Des tons naturels et apaisants',
      colors: ['bg-[#1b4332]', 'bg-[#2d4a2b]', 'bg-[#d8f3dc]'],
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Épuré, simple et efficace',
      colors: ['bg-[#212529]', 'bg-[#6c757d]', 'bg-[#f8f9fa]'],
    },
    {
      id: 'nostalgic',
      name: 'Nostalgique',
      description: 'Chaleureux et authentique',
      colors: ['bg-[#F0F0DB]', 'bg-[#E67E22]', 'bg-[#40513B]'],
    },
    {
      id: 'neon',
      name: 'Néon',
      description: 'Futuriste et énergique',
      colors: ['bg-[#0C0C0C]', 'bg-[#00E8FF]', 'bg-[#8A00FF]'],
    },
    {
      id: 'vintage',
      name: 'Vintage',
      description: 'Sophistiqué et naturel',
      colors: ['bg-[#F1E9E9]', 'bg-[#B85042]', 'bg-[#F9C6B0]'],
    },
    {
      id: 'corporate',
      name: 'Corporate',
      description: 'Confiance et autorité',
      colors: ['bg-[#FFFFFF]', 'bg-[#002C54]', 'bg-[#C5001A]'],
    },
    {
      id: 'eco',
      name: 'Éco-Luxe',
      description: 'Connecté à la nature',
      colors: ['bg-[#F9F9F9]', 'bg-[#2B9348]', 'bg-[#556B2F]'],
    },
    {
      id: 'pastel',
      name: 'Pastel',
      description: 'Doux et calmant',
      colors: ['bg-[#FDFDFD]', 'bg-[#A78BFA]', 'bg-[#CFFFEA]'],
    },
    {
      id: 'luxury',
      name: 'Luxe',
      description: 'Élégance et prestige',
      colors: ['bg-[#000000]', 'bg-[#D9B648]', 'bg-[#323231]'],
    },
    {
      id: 'retro',
      name: 'Rétro Pop',
      description: 'Ludique et nostalgique',
      colors: ['bg-[#FFF5C5]', 'bg-[#138A7D]', 'bg-[#FFCF36]'],
    },
    {
      id: 'neuro',
      name: 'Neuro-Inclusif',
      description: 'Confort visuel optimal',
      colors: ['bg-[#F7F5F2]', 'bg-[#374151]', 'bg-[#4B7BEC]'],
    },
    {
      id: 'biolum',
      name: 'Bioluminescent',
      description: 'Profondeur organique',
      colors: ['bg-[#050510]', 'bg-[#00FF94]', 'bg-[#BC13FE]'],
    },
    {
      id: 'heritage',
      name: 'Héritage',
      description: 'Fusion passé-futur',
      colors: ['bg-[#F3E5AB]', 'bg-[#002FA7]', 'bg-[#D4AF37]'],
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Mode d'affichage</h3>
        <div className="grid grid-cols-3 gap-4 max-w-md">
          <button
            onClick={() => setTheme('light')}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
              mounted && theme === 'light' 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-border hover:border-primary/50 hover:bg-accent/50"
            )}
          >
            <Sun className="h-6 w-6 mb-2" />
            <span className="font-medium">Clair</span>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
              mounted && theme === 'dark' 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-border hover:border-primary/50 hover:bg-accent/50"
            )}
          >
            <Moon className="h-6 w-6 mb-2" />
            <span className="font-medium">Sombre</span>
          </button>
          <button
            onClick={() => setTheme('system')}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
              mounted && theme === 'system' 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-border hover:border-primary/50 hover:bg-accent/50"
            )}
          >
            <Monitor className="h-6 w-6 mb-2" />
            <span className="font-medium">Système</span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Thème visuel</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setBrand(t.id as any)}
              className={cn(
                "group relative flex flex-col items-start p-4 rounded-xl border-2 transition-all text-left h-full",
                mounted && brand === t.id 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50 hover:bg-accent/50"
              )}
            >
              {mounted && brand === t.id && (
                <div className="absolute top-3 right-3 text-primary">
                  <Check className="h-5 w-5" />
                </div>
              )}
              
              <div className="flex gap-1.5 mb-4">
                {t.colors.map((color, i) => (
                  <div 
                    key={i} 
                    className={cn("h-6 w-6 rounded-full shadow-sm ring-1 ring-inset ring-black/10", color)} 
                  />
                ))}
              </div>
              
              <span className={cn(
                "text-base font-semibold mb-1",
                mounted && brand === t.id ? "text-primary" : "text-foreground"
              )}>
                {t.name}
              </span>
              <span className="text-sm text-muted-foreground leading-relaxed">
                {t.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
