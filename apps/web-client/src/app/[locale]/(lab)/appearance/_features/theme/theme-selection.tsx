'use client'

import {
  THEMES,
  ThemeBuilder,
  type ThemeConfig,
  ThemePalette,
  ThemePreview,
  useThemeBrand,
} from '@make-the-change/core'
import { cn } from '@make-the-change/core/shared/utils'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  Input,
  Toggle,
  ToggleGroup,
} from '@make-the-change/core/ui'
import {
  ChevronRight,
  Cloud,
  History,
  Loader2,
  Monitor,
  Moon,
  Palette,
  Sparkles,
  Sun,
  Trash2,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'
import { deleteUserTheme, saveUserTheme } from './actions'

interface ThemeSelectionProps {
  initialConfig?: ThemeConfig | null
}

export const ThemeSelection = ({ initialConfig }: ThemeSelectionProps) => {
  const { setTheme, theme } = useTheme()
  const { brand, setBrand, customVars, setCustomVars } = useThemeBrand()
  const [mounted, setMounted] = React.useState(false)
  const [activeCategory, setActiveCategory] = React.useState<string>('All')
  const [isSaving, setIsSaving] = React.useState(false)
  const [saveStatus, setSaveStatus] = React.useState<{ success?: string; error?: string } | null>(
    null,
  )

  const [config, setConfig] = React.useState<ThemeConfig>(
    initialConfig || { activeThemeId: 'default', customThemes: [] },
  )
  const [newThemeName, setNewThemeName] = React.useState('')
  const [showNaming, setShowNaming] = React.useState(false)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [themeIdToDelete, setThemeIdToDelete] = React.useState<string | null>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleBrandSelect = async (newBrandId: string) => {
    const isPredefined = THEMES.some((t) => t.id === newBrandId && t.id !== 'custom')

    if (isPredefined) {
      setBrand(newBrandId as Parameters<typeof setBrand>[0])
      setIsSaving(true)
      const result = await saveUserTheme(newBrandId)
      if (result.themeConfig) setConfig(result.themeConfig)
      setSaveStatus(result)
      setIsSaving(false)
    } else {
      const customTheme = config.customThemes.find((t) => t.id === newBrandId)
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

  const openDeleteThemeDialog = (e: React.MouseEvent, themeId: string) => {
    e.stopPropagation()
    setThemeIdToDelete(themeId)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteTheme = async () => {
    if (!themeIdToDelete) return
    setIsSaving(true)
    const result = await deleteUserTheme(themeIdToDelete)
    if (result.themeConfig) setConfig(result.themeConfig)
    setSaveStatus(result)
    setIsSaving(false)
    setDeleteDialogOpen(false)
    setThemeIdToDelete(null)
  }

  const categories = ['All', 'Classic', 'Nature', 'Cyber', 'Special', 'Mes Créations']

  const filteredThemes = React.useMemo(() => {
    if (activeCategory === 'Mes Créations') return []
    return activeCategory === 'All' ? THEMES : THEMES.filter((t) => t.category === activeCategory)
  }, [activeCategory])

  const userThemes = config.customThemes || []

  if (!mounted) return null

  return (
    <div className="space-y-12 noise-overlay pb-12">
      {/* Header & Category Filter */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-border/40 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-2xl ring-1 ring-primary/20">
              <Palette className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight uppercase">Atelier Visuel</h3>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">
                  Synchronisation Cloud Active
                </p>
              </div>
            </div>
          </div>
        </div>

        <ToggleGroup
          value={[activeCategory]}
          onValueChange={(next) => {
            const nextCategory = next[0]
            if (typeof nextCategory === 'string') {
              setActiveCategory(nextCategory)
            }
          }}
          className="flex flex-wrap gap-2 p-1.5 bg-muted/30 rounded-[2rem] border border-border/50"
        >
          {categories.map((cat) => (
            <Toggle
              key={cat}
              value={cat}
              className={cn(
                'px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all',
                activeCategory === cat
                  ? 'bg-background text-primary shadow-xl ring-1 ring-client-black/5 scale-105'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/40',
              )}
            >
              {cat}
            </Toggle>
          ))}
        </ToggleGroup>
      </div>

      {/* Mode d'affichage (Quick Switch) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            id: 'light',
            icon: Sun,
            label: 'Mode Clair',
            desc: 'Pour une lecture optimale en journée',
          },
          {
            id: 'dark',
            icon: Moon,
            label: 'Mode Sombre',
            desc: 'Confort visuel pour les sessions nocturnes',
          },
          {
            id: 'system',
            icon: Monitor,
            label: 'Auto (Système)',
            desc: "S'adapte selon vos réglages système",
          },
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => setTheme(mode.id)}
            className={cn(
              'group flex flex-col items-start p-6 rounded-3xl border-2 transition-all text-left',
              mounted && theme === mode.id
                ? 'bg-background border-primary shadow-2xl ring-1 ring-primary/10 -translate-y-1'
                : 'bg-background/40 border-border/50 hover:border-primary/30 hover:bg-background/60',
            )}
          >
            <div
              className={cn(
                'p-3 rounded-2xl mb-4 transition-colors',
                mounted && theme === mode.id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary',
              )}
            >
              <mode.icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-black uppercase tracking-tight mb-1">{mode.label}</span>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed opacity-70">
              {mode.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-6">
          {isSaving && (
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary animate-pulse">
              <Loader2 className="h-3 w-3 animate-spin" />
              Mise à jour du profil...
            </div>
          )}
          {saveStatus?.success && (
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-success">
              <Cloud className="h-3.5 w-3.5" />
              Univers synchronisé
            </div>
          )}
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">
          V4.0 • Design Engine
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-12">
        {/* Custom Theme Editor */}
        {mounted &&
          brand === 'custom' &&
          (activeCategory === 'All' || activeCategory === 'Mes Créations') && (
            <div className="relative p-8 rounded-[3rem] border-2 border-primary/20 bg-primary/[0.02] shadow-inner overflow-hidden animate-in fade-in zoom-in-95 duration-700">
              {/* Background Decorative Element */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary text-primary-foreground rounded-2xl shadow-xl shadow-primary/20">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black uppercase tracking-tight">
                        Atelier Sur-Mesure
                      </h4>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                        Éditez et enregistrez votre propre style
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {showNaming ? (
                      <div className="flex items-center gap-2 animate-in slide-in-from-right-8 duration-500">
                        <Input
                          placeholder="Nom de votre chef-d'œuvre..."
                          value={newThemeName}
                          onChange={(e) => setNewThemeName(e.target.value)}
                          className="h-12 rounded-2xl bg-background border-primary/30 focus:border-primary w-64 shadow-xl text-xs font-bold"
                          autoFocus
                        />
                        <Button
                          onClick={handleSaveCustom}
                          loading={isSaving}
                          className="h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/30"
                        >
                          Enregistrer
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => setShowNaming(false)}
                          className="h-12 w-12 p-0 rounded-2xl hover:bg-background/50"
                        >
                          <ChevronRight className="h-5 w-5 rotate-180" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setShowNaming(true)}
                        className="h-12 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/30 hover:scale-105 transition-transform"
                      >
                        Enregistrer cette Création
                      </Button>
                    )}
                  </div>
                </div>
                <ThemeBuilder />
              </div>
            </div>
          )}

        {/* Theme Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Mes Créations Empty State */}
          {activeCategory === 'Mes Créations' && userThemes.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-8">
              <div className="p-8 bg-muted/30 rounded-[3rem] border-2 border-dashed border-border/50">
                <History className="h-12 w-12 text-muted-foreground/30 mb-4 mx-auto" />
                <h5 className="text-lg font-black uppercase tracking-tight opacity-40">
                  Aucune création pour le moment
                </h5>
                <p className="text-xs text-muted-foreground/60 max-w-xs mx-auto font-medium leading-relaxed mt-2">
                  Utilisez l'Atelier Sur-Mesure pour enregistrer vos propres combinaisons de
                  couleurs.
                </p>
              </div>
            </div>
          )}

          {/* User Themes */}
          {(activeCategory === 'All' || activeCategory === 'Mes Créations') &&
            userThemes.map((t) => (
              <button
                key={t.id}
                onClick={() => handleBrandSelect(t.id)}
                className={cn(
                  'group relative flex flex-col items-start p-6 rounded-[2.5rem] border-2 transition-all text-left h-full',
                  mounted && config.activeThemeId === t.id
                    ? 'border-primary bg-primary/[0.03] shadow-[0_32px_64px_-12px_rgba(var(--primary-rgb),0.15)] ring-1 ring-primary/20 scale-[1.02] z-10'
                    : 'border-border/60 hover:border-primary/40 hover:bg-accent/30 hover:-translate-y-2',
                )}
              >
                {/* Active Indicator Floating */}
                {mounted && config.activeThemeId === t.id && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-xl z-20 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-client-white animate-pulse" />
                    Actif
                  </div>
                )}

                <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => openDeleteThemeDialog(e, t.id)}
                    className="h-9 w-9 p-0 rounded-2xl bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive hover:text-client-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="w-full mb-8 relative">
                  <ThemePreview
                    brand="custom"
                    currentTheme={theme || 'light'}
                    customVars={t.customVars}
                    className={cn(
                      'shadow-xl rounded-3xl overflow-hidden',
                      mounted && config.activeThemeId === t.id ? 'ring-2 ring-primary/20' : '',
                    )}
                  />
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={cn(
                      'text-xl font-black tracking-tight uppercase',
                      mounted && config.activeThemeId === t.id ? 'text-primary' : 'text-foreground',
                    )}
                  >
                    {t.name}
                  </span>
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/10">
                    Création
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 font-black uppercase tracking-widest">
                  <History className="h-3 w-3" />
                  Dernière édition {new Date(t.updated_at).toLocaleDateString()}
                </div>
              </button>
            ))}

          {/* Predefined Themes */}
          {filteredThemes.map((t) => (
            <button
              key={t.id}
              onClick={() => handleBrandSelect(t.id)}
              className={cn(
                'group relative flex flex-col items-start p-6 rounded-[2.5rem] border-2 transition-all text-left h-full',
                mounted && config.activeThemeId === t.id
                  ? 'border-primary bg-primary/[0.03] shadow-[0_32px_64px_-12px_rgba(var(--primary-rgb),0.15)] ring-1 ring-primary/20 scale-[1.02] z-10'
                  : 'border-border/60 hover:border-primary/40 hover:bg-accent/30 hover:-translate-y-2',
              )}
            >
              {mounted && config.activeThemeId === t.id && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-xl z-20 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-client-white animate-pulse" />
                  Actif
                </div>
              )}

              <div className="w-full mb-8">
                <ThemePreview
                  brand={t.id}
                  currentTheme={theme || 'light'}
                  customVars={t.id === 'custom' ? customVars : undefined}
                  className={cn(
                    'shadow-xl rounded-3xl overflow-hidden',
                    mounted && config.activeThemeId === t.id ? 'ring-2 ring-primary/20' : '',
                  )}
                />
              </div>

              <div className="flex items-center gap-3 mb-2">
                <span
                  className={cn(
                    'text-xl font-black tracking-tight uppercase',
                    mounted && config.activeThemeId === t.id ? 'text-primary' : 'text-foreground',
                  )}
                >
                  {t.name}
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-muted text-muted-foreground/60">
                  {t.category}
                </span>
              </div>

              <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium mb-6">
                {t.description}
              </p>

              {mounted && config.activeThemeId === t.id && (
                <div className="mt-auto w-full pt-6 border-t border-border/50 animate-in fade-in slide-in-from-top-4 duration-700">
                  <div className="flex items-center gap-2 mb-4">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">
                      Palette Technique
                    </h4>
                    <div className="h-px flex-1 bg-border/40" />
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>Supprimer ce thème personnalisé ?</DialogTitle>
          <DialogDescription>
            Cette action est irréversible. Le thème sera retiré de votre compte.
          </DialogDescription>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Annuler</Button>} />
            <Button
              variant="destructive"
              loading={isSaving}
              onClick={() => void confirmDeleteTheme()}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
