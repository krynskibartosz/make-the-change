'use client'

import type { Locale } from '@make-the-change/core/i18n'
import { Badge, Button } from '@make-the-change/core/ui'
import { Check, Globe } from 'lucide-react'
import { type FC, useMemo } from 'react'

import { useTranslation } from './translation-context'

interface LanguageSwitcherProps {
  className?: string
}

export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({ className }) => {
  const { currentLanguage, setCurrentLanguage, translationCompletion } = useTranslation()

  const languages = useMemo(
    () => [
      { code: 'fr', label: 'FR', flag: '🇫🇷' },
      { code: 'en', label: 'EN', flag: '🇬🇧' },
      { code: 'nl', label: 'NL', flag: '🇳🇱' },
    ],
    [],
  )

  return (
    <div className={`flex items-center gap-2 bg-muted/30 p-1 rounded-lg border ${className}`}>
      <div className="hidden sm:flex items-center px-2 text-muted-foreground">
        <Globe className="h-4 w-4 mr-2" />
        <span className="text-xs font-medium uppercase">Langue</span>
      </div>
      
      <div className="flex items-center gap-1">
        {languages.map((lang) => {
          const isActive = currentLanguage === lang.code
          const completion = translationCompletion[lang.code as Locale]
          const isComplete = completion === 100

          return (
            <Button
              key={lang.code}
              variant={isActive ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentLanguage(lang.code as Locale)}
              className={`relative h-8 px-3 text-xs font-medium transition-all ${
                isActive ? 'shadow-sm' : 'hover:bg-background/50'
              }`}
            >
              <span className="mr-1.5 text-base">{lang.flag}</span>
              {lang.label}
              
              {/* Completion Indicator */}
              {!isActive && completion < 100 && lang.code !== 'fr' && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-warning text-[9px] text-warning-foreground shadow-sm ring-1 ring-background">
                  {completion}
                </span>
              )}

              {/* Success Indicator */}
              {lang.code !== 'fr' && isComplete && !isActive && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-success text-success-foreground shadow-sm ring-1 ring-background">
                  <Check className="h-2 w-2" />
                </span>
              )}
              
              {/* Active Completion Badge */}
              {isActive && lang.code !== 'fr' && (
                <Badge 
                  variant="secondary" 
                  className="ml-2 h-5 px-1.5 text-[10px] bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 border-0"
                >
                  {completion}%
                </Badge>
              )}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
