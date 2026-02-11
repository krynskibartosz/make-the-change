'use client'

import * as React from 'react'
import { useThemeBrand, ThemePreview, ThemePalette, THEMES, ThemeBuilder } from '@make-the-change/core'
import { cn } from '@make-the-change/core/shared/utils'
import { Check, Monitor, Moon, Sun, Save, Loader2, Plus, Trash2, Edit2, ChevronRight } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button, Input } from '@make-the-change/core/ui'
import { saveUserTheme, deleteUserTheme, type ThemeConfig, type UserTheme } from './actions'

interface ThemeSelectionProps {
  initialConfig?: ThemeConfig | null
}

export const ThemeSelection = ({ initialConfig }: ThemeSelectionProps) => {
  const { setTheme, theme } = useTheme()
  const { brand, setBrand, customVars, setCustomVars } = useThemeBrand()
  const [mounted, setMounted] = React.useState(false)
  const [activeCategory, setActiveCategory] = React.useState<string>('All')
  const [isSaving, setIsSaving] = React.useState(false)
  const [saveStatus, setSaveStatus] = React.useState<{ success?: string; error?: string } | null>(null)
  
  const [config, setConfig] = React.useState<ThemeConfig>(initialConfig || { activeThemeId: 'default', customThemes: [] })
  const [newThemeName, setNewThemeName] = React.useState('')
  const [showNaming, setShowNaming] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleBrandSelect = async (newBrandId: string) => {
    // If it's a predefined brand
    const isPredefined = THEMES.some(t => t.id === newBrandId && t.id !== 'custom')
    
    if (isPredefined) {
      setBrand(newBrandId as any)
      setIsSaving(true)
      const result = await saveUserTheme(newBrandId)
      if (result.themeConfig) setConfig(result.themeConfig)
      setSaveStatus(result)
      setIsSaving(false)
    } else {
      // It's a custom theme ID
      const customTheme = config.customThemes.find(t => t.id === newBrandId)
      if (customTheme) {
        setBrand('custom')
        setCustomVars(customTheme.customVars)
        setIsSaving(true)
        const result = await saveUserTheme(newBrandId)
        if (result.themeConfig) setConfig(result.themeConfig)
        setSaveStatus(result)
        setIsSaving(false)
      }
    }
  }

  const handleSaveCustom = async () => {
    if (!newThemeName.trim()) {
      setShowNaming(true)
      return
    }

    setIsSaving(true)
    const result = await saveUserTheme('custom', newThemeName, customVars)
    if (result.themeConfig) {
      setConfig(result.themeConfig)
      setNewThemeName('')
      setShowNaming(false)
    }
    setSaveStatus(result)
    setIsSaving(false)
  }

  const handleDeleteTheme = async (e: React.MouseEvent, themeId: string) => {
    e.stopPropagation()
    if (!confirm('Voulez-vous vraiment supprimer ce thème ?')) return

    setIsSaving(true)
    const result = await deleteUserTheme(themeId)
    if (result.themeConfig) setConfig(result.themeConfig)
    setSaveStatus(result)
    setIsSaving(false)
  }

  const categories = ['All', 'Classic', 'Nature', 'Cyber', 'Special', 'Mes Créations']
  
  const filteredThemes = React.useMemo(() => {
    if (activeCategory === 'Mes Créations') return []
    return activeCategory === 'All' 
      ? THEMES 
      : THEMES.filter(t => t.category === activeCategory)
  }, [activeCategory])

  const userThemes = config.customThemes || []

  return (
    <div className="space-y-10">
      {/* Mode d'affichage - Segmented UI */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70 mb-4">Mode d'affichage</h3>
        <div className="inline-flex p-1 bg-muted/50 rounded-xl border max-w-md w-full">
          {[
            { id: 'light', icon: Sun, label: 'Clair' },
            { id: 'dark', icon: Moon, label: 'Sombre' },
            { id: 'system', icon: Monitor, label: 'Système' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setTheme(mode.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                mounted && theme === mode.id 
                  ? "bg-background text-foreground shadow-sm ring-1 ring-black/5" 
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              )}
            >
              <mode.icon className={cn("h-4 w-4", mounted && theme === mode.id ? "text-primary" : "")} />
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Thème visuel */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">Thème visuel</h3>
          
          <div className="flex items-center gap-4">
            {isSaving && (
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary animate-pulse">
                <Loader2 className="h-3 w-3 animate-spin" />
                Synchronisation...
              </div>
            )}
            {saveStatus?.success && (
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-success">
                <Check className="h-3 w-3" />
                Sauvegardé
              </div>
            )}
            {/* Category Tabs */}
            <div className="flex gap-1 p-1 bg-muted/30 rounded-lg border border-border/50 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-tight transition-all",
                    activeCategory === cat 
                      ? "bg-background text-primary shadow-xs" 
                      : "text-muted-foreground hover:bg-background/50"
                  )}
                >
                  {cat === 'All' ? 'Tous' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {mounted && brand === 'custom' && (
          <div className="mb-8 p-6 rounded-[2rem] border-2 border-primary/20 bg-primary/5 shadow-inner animate-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tight text-sm">Nouvelle Création</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Enregistrez vos réglages actuels</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {showNaming ? (
                  <div className="flex items-center gap-2 animate-in slide-in-from-right-4">
                    <Input 
                      placeholder="Nom de votre thème..." 
                      value={newThemeName}
                      onChange={(e) => setNewThemeName(e.target.value)}
                      className="h-10 rounded-xl bg-background border-primary/20 focus:border-primary w-48"
                      autoFocus
                    />
                    <Button 
                      size="sm" 
                      onClick={handleSaveCustom} 
                      loading={isSaving}
                      className="h-10 px-4 rounded-xl font-black uppercase tracking-widest text-[10px]"
                    >
                      Enregistrer
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowNaming(false)}
                      className="h-10 w-10 p-0 rounded-xl"
                    >
                      <ChevronRight className="h-4 w-4 rotate-180" />
                    </Button>
                  </div>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={() => setShowNaming(true)} 
                    className="h-10 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
                  >
                    Sauvegarder ce thème
                  </Button>
                )}
              </div>
            </div>
            <ThemeBuilder />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* User Themes First if in "Mes Créations" or "All" */}
          {(activeCategory === 'All' || activeCategory === 'Mes Créations') && userThemes.map((t) => (
            <button
              key={t.id}
              onClick={() => handleBrandSelect(t.id)}
              className={cn(
                "group relative flex flex-col items-start p-5 rounded-[2rem] border-2 transition-all text-left h-full",
                mounted && config.activeThemeId === t.id 
                  ? "border-primary bg-primary/[0.03] shadow-xl ring-1 ring-primary/20" 
                  : "border-border/60 hover:border-primary/40 hover:bg-accent/30"
              )}
            >
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleDeleteTheme(e, t.id)}
                  className="h-8 w-8 p-0 rounded-full bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
                {mounted && config.activeThemeId === t.id && (
                  <div className="bg-primary text-primary-foreground rounded-full p-1 shadow-lg animate-in fade-in zoom-in duration-300">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
              
              <div className="w-full mb-5">
                <ThemePreview 
                  brand="custom" 
                  currentTheme={theme || 'light'} 
                  customVars={t.customVars}
                  className={cn(
                    "shadow-sm group-hover:shadow-md transition-shadow duration-300 rounded-2xl",
                    mounted && config.activeThemeId === t.id ? "border-primary/20" : ""
                  )}
                />
              </div>
              
              <div className="flex items-center gap-2 mb-1.5">
                <span className={cn(
                  "text-lg font-black tracking-tight",
                  mounted && config.activeThemeId === t.id ? "text-primary" : "text-foreground"
                )}>
                  {t.name}
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  Création
                </span>
              </div>
              
              <span className="text-xs text-muted-foreground/80 leading-relaxed font-bold uppercase tracking-tighter">
                Personnalisé le {new Date(t.created_at).toLocaleDateString()}
              </span>
            </button>
          ))}

          {filteredThemes.map((t) => (
            <button
              key={t.id}
              onClick={() => handleBrandSelect(t.id)}
              className={cn(
                "group relative flex flex-col items-start p-5 rounded-[2rem] border-2 transition-all text-left h-full",
                mounted && config.activeThemeId === t.id 
                  ? "border-primary bg-primary/[0.03] shadow-xl ring-1 ring-primary/20" 
                  : "border-border/60 hover:border-primary/40 hover:bg-accent/30"
              )}
            >
              {mounted && config.activeThemeId === t.id && (
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full p-1 shadow-lg z-10 animate-in fade-in zoom-in duration-300">
                  <Check className="h-3.5 w-3.5" />
                </div>
              )}
              
              <div className="w-full mb-5">
                <ThemePreview 
                  brand={t.id} 
                  currentTheme={theme || 'light'} 
                  customVars={t.id === 'custom' ? customVars : undefined}
                  className={cn(
                    "shadow-sm group-hover:shadow-md transition-shadow duration-300 rounded-2xl",
                    mounted && config.activeThemeId === t.id ? "border-primary/20" : ""
                  )}
                />
              </div>
              
              <div className="flex items-center gap-2 mb-1.5">
                <span className={cn(
                  "text-lg font-black tracking-tight",
                  mounted && config.activeThemeId === t.id ? "text-primary" : "text-foreground"
                )}>
                  {t.name}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded bg-muted text-muted-foreground/70">
                  {t.category}
                </span>
              </div>
              
              <span className="text-sm text-muted-foreground/80 leading-relaxed font-medium">
                {t.description}
              </span>
              
              {mounted && config.activeThemeId === t.id && (
                <div className="mt-8 w-full animate-in fade-in slide-in-from-top-4 duration-700">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-border/50" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Palette Technique</h4>
                    <div className="h-px flex-1 bg-border/50" />
                  </div>
                  <ThemePalette 
                    brand={t.id} 
                    currentTheme={theme || 'light'} 
                    customVars={t.id === 'custom' ? customVars : undefined}
                  />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
