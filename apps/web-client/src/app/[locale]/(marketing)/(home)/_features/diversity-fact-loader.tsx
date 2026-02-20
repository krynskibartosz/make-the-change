'use client'

import { Lightbulb } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useEffect, useState } from 'react'

const FACT_ROTATION_INTERVAL_MS = 5000
const TYPEWRITER_SPEED_MS = 50

const diversityFactsByLocale = {
  fr: {
    label: 'Le saviez-vous ?',
    facts: [
      'Plus de 7 000 langues sont parlées dans le monde',
      '1 personne sur 4 dans le monde est bilingue',
      'Il existe plus de 195 pays dans le monde',
      'La diversité culturelle augmente la créativité de 83%',
      'Les équipes diversifiées sont 35% plus performantes',
      'Plus de 180 nationalités collaborent sur des projets durables',
      'La diversité génère 2,3x plus de cash flow par employé',
      'Les entreprises inclusives ont 2,6x plus de revenus',
      '80% des consommateurs préfèrent les marques inclusives',
      "La biodiversité compte 8,7 millions d'espèces sur Terre",
    ],
  },
  en: {
    label: 'Did you know?',
    facts: [
      'More than 7,000 languages are spoken worldwide',
      '1 in 4 people in the world is bilingual',
      'There are over 195 countries in the world',
      'Cultural diversity increases creativity by 83%',
      'Diverse teams are 35% more effective',
      'More than 180 nationalities collaborate on sustainable projects',
      'Diversity generates 2.3x more cash flow per employee',
      'Inclusive companies generate 2.6x more revenue',
      '80% of consumers prefer inclusive brands',
      "Biodiversity includes around 8.7 million species on Earth",
    ],
  },
  nl: {
    label: 'Wist je dat?',
    facts: [
      'Er wereldwijd meer dan 7.000 talen worden gesproken',
      '1 op de 4 mensen in de wereld tweetalig is',
      'Er meer dan 195 landen in de wereld zijn',
      'Culturele diversiteit de creativiteit met 83% verhoogt',
      'Diverse teams 35% beter presteren',
      'Meer dan 180 nationaliteiten samenwerken aan duurzame projecten',
      'Diversiteit 2,3x meer cashflow per werknemer oplevert',
      'Inclusieve bedrijven 2,6x meer omzet genereren',
      '80% van de consumenten inclusieve merken verkiest',
      'Biodiversiteit ongeveer 8,7 miljoen soorten op aarde omvat',
    ],
  },
} as const

const getAnyFact = (facts: readonly string[]): string =>
  facts[Math.floor(Math.random() * facts.length)] ?? ''

const getRandomFact = (facts: readonly string[], previousFact?: string): string => {
  if (facts.length <= 1) {
    return facts[0] ?? ''
  }

  let nextFact = getAnyFact(facts)
  while (nextFact === previousFact) {
    nextFact = getAnyFact(facts)
  }

  return nextFact
}

export function DiversityFactLoader() {
  const locale = useLocale()
  const factsConfig =
    diversityFactsByLocale[locale as keyof typeof diversityFactsByLocale] ?? diversityFactsByLocale.en

  const [currentFact, setCurrentFact] = useState('')
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const initialFact = getRandomFact(factsConfig.facts)
    setCurrentFact(initialFact)
    setIsTyping(true)

    const interval = setInterval(() => {
      setCurrentFact((previousFact) => getRandomFact(factsConfig.facts, previousFact))
      setIsTyping(true)
    }, FACT_ROTATION_INTERVAL_MS)

    return () => {
      clearInterval(interval)
    }
  }, [factsConfig])

  useEffect(() => {
    if (!isTyping || !currentFact) {
      return
    }

    setDisplayedText('')
    let index = 0

    const typingInterval = setInterval(() => {
      if (index < currentFact.length) {
        setDisplayedText(currentFact.slice(0, index + 1))
        index += 1
        return
      }

      setIsTyping(false)
      clearInterval(typingInterval)
    }, TYPEWRITER_SPEED_MS)

    return () => {
      clearInterval(typingInterval)
    }
  }, [currentFact, isTyping])

  return (
    <div role="status" aria-live="polite" className="flex justify-center pt-8">
      <div className="flex min-h-[52px] max-w-lg items-center gap-4 rounded-full border border-primary/10 bg-primary/5 px-6 py-3 shadow-sm backdrop-blur-sm">
        <Lightbulb
          className="h-5 w-5 flex-shrink-0 animate-pulse text-primary"
          aria-hidden="true"
        />
        <p className="text-sm font-medium leading-snug text-foreground/80">
          <span className="mr-2 font-bold text-primary">{factsConfig.label}</span>
          {displayedText}
          {isTyping ? (
            <span
              className="ml-1 inline-block h-4 w-1 animate-pulse bg-primary align-middle"
              aria-hidden="true"
            />
          ) : null}
        </p>
      </div>
    </div>
  )
}
