'use client'

import * as React from 'react'
import { useThemeBrand } from '../providers/theme-provider'
import { cn } from '../utils/cn'
import { ThemePreview } from './theme-preview'
import { hexToHsl, hslToHex, parseHsl, generatePaletteFromPrimary } from '../utils/color'
import { Wand2, RefreshCw, Palette, Sparkles, Sliders, Eye, Check } from 'lucide-react'
import { Badge } from './base/badge'

const EDITABLE_VARS = [
  { label: 'Primaire', variable: '--primary', default: '221 83% 53%', category: 'Brand' },
  { label: 'Secondaire', variable: '--secondary', default: '210 40% 96%', category: 'Brand' },
  { label: 'Accent', variable: '--accent', default: '210 40% 96%', category: 'Brand' },
  { label: 'Fond', variable: '--background', default: '0 0% 100%', category: 'Surface' },
  { label: 'Texte', variable: '--foreground', default: '222 47% 11%', category: 'Surface' },
  { label: 'Bordure', variable: '--border', default: '214 32% 91%', category: 'Surface' },
]

export const ThemeBuilder = () => {
  const { brand, setBrand, customVars, setCustomVars } = useThemeBrand()
  const [mounted, setMounted] = React.useState(false)
  const [isGenerating, setIsGenerating] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const updateVar = (variable: string, value: string) => {
    setCustomVars({
      ...customVars,
      [variable]: value
    })
    if (brand !== 'custom') {
      setBrand('custom')
    }
  }

  const handleHexChange = (variable: string, hex: string) => {
    const hsl = hexToHsl(hex)
    updateVar(variable, hsl)
  }

  const handleMagicPalette = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const primary = customVars['--primary'] || '221 83% 53%'
      const newPalette = generatePaletteFromPrimary(primary)
      setCustomVars(newPalette)
      if (brand !== 'custom') setBrand('custom')
      setIsGenerating(false)
    }, 600)
  }

  const resetCustom = () => {
    const defaults: Record<string, string> = {}
    EDITABLE_VARS.forEach(v => {
      defaults[v.variable] = v.default
    })
    setCustomVars(defaults)
    setBrand('custom')
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Tools Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/20 pb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-foreground text-background rounded-xl">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] opacity-80">Configuration Technique</h4>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Ajustez les tokens CSS en temps réel</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleMagicPalette}
            disabled={isGenerating}
            className={cn(
              "group flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20",
              isGenerating && "opacity-50 cursor-not-allowed"
            )}
          >
            {isGenerating ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 group-hover:animate-pulse" />
            )}
            {isGenerating ? "Alchimie en cours..." : "Générer l'Harmonie"}
          </button>
          
          <button 
            onClick={resetCustom}
            className="p-3 rounded-2xl bg-muted hover:bg-muted/80 transition-all hover:rotate-180 duration-500"
            title="Réinitialiser"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Controls Section */}
        <div className="lg:col-span-3 space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {EDITABLE_VARS.map((v) => {
              const hslValue = customVars[v.variable] || v.default
              const { h, s, l } = parseHsl(hslValue)
              const hexValue = hslToHex(h, s, l)

              return (
                <div key={v.variable} className="group flex flex-col gap-3 p-5 rounded-3xl bg-background/50 border border-border/40 hover:border-primary/40 transition-all hover:shadow-2xl hover:shadow-primary/5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-muted text-muted-foreground/60">
                        {v.category}
                      </span>
                      <label className="text-xs font-black uppercase tracking-tight">{v.label}</label>
                    </div>
                    <code className="text-[8px] font-mono opacity-20 group-hover:opacity-40 transition-opacity">{v.variable}</code>
                  </div>
                  
                  <div className="flex gap-4 items-center">
                    <div className="relative h-14 w-14 shrink-0">
                      <input
                        type="color"
                        value={hexValue}
                        onChange={(e) => handleHexChange(v.variable, e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div 
                        className="w-full h-full rounded-2xl border-2 border-background shadow-lg transition-transform group-hover:scale-110"
                        style={{ backgroundColor: hexValue }}
                      />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={hslValue}
                        onChange={(e) => updateVar(v.variable, e.target.value)}
                        className="w-full bg-transparent text-sm font-black focus:outline-none focus:text-primary transition-colors tracking-tight"
                        placeholder="H S% L%"
                      />
                      <div className="text-[9px] font-mono opacity-40 uppercase tracking-widest">{hexValue}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="p-6 rounded-3xl bg-muted/30 border border-border/20">
            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-40">Conseils d'Expert</h5>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Utilisez le bouton <span className="text-primary font-bold">Générer l'Harmonie</span> après avoir choisi votre couleur primaire. Notre moteur calculera automatiquement les contrastes et les teintes complémentaires pour garantir une accessibilité parfaite.
            </p>
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 opacity-40" />
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Rendu Temps Réel</label>
            </div>
            <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest bg-primary/5 border-primary/20 text-primary px-3 py-1">
              Édition Live
            </Badge>
          </div>
          
          <div className="sticky top-8">
            <div className="group relative p-1 rounded-[3rem] bg-gradient-to-br from-primary/20 via-border/10 to-primary/5 border border-border/20 shadow-2xl transition-all hover:scale-[1.02]">
              <ThemePreview 
                brand="custom" 
                currentTheme="light" 
                customVars={customVars}
                className="rounded-[2.8rem] overflow-hidden shadow-inner" 
              />
              
              {/* Floating Status Badge */}
              <div className="absolute -bottom-4 -right-4 bg-background border-2 border-primary/20 p-4 rounded-3xl shadow-2xl animate-bounce duration-1000">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-tight">Prêt pour</span>
                    <span className="block text-[8px] font-bold uppercase tracking-widest opacity-50 text-muted-foreground">Production</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 space-y-4 px-6">
              <div className="h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
              <p className="text-[11px] text-muted-foreground font-medium leading-relaxed text-center italic opacity-60">
                "La simplicité est la sophistication suprême."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
