'use client'

import { Lightbulb } from 'lucide-react'
import { useEffect, useState } from 'react'

const FACT_ROTATION_INTERVAL_MS = 5000
const TYPEWRITER_SPEED_MS = 50

const diversityFacts = [
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
]

const getRandomFact = (previousFact?: string) => {
  if (diversityFacts.length <= 1) {
    return diversityFacts[0] ?? ''
  }

  let nextFact = diversityFacts[Math.floor(Math.random() * diversityFacts.length)]
  while (nextFact === previousFact) {
    nextFact = diversityFacts[Math.floor(Math.random() * diversityFacts.length)]
  }

  return nextFact
}

export function DiversityFactLoader() {
  const [currentFact, setCurrentFact] = useState('')
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const initialFact = getRandomFact()
    setCurrentFact(initialFact)
    setIsTyping(true)

    const interval = setInterval(() => {
      setCurrentFact((previousFact) => getRandomFact(previousFact))
      setIsTyping(true)
    }, FACT_ROTATION_INTERVAL_MS)

    return () => {
      clearInterval(interval)
    }
  }, [])

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
          <span className="mr-2 font-bold text-primary">Le saviez-vous ?</span>
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
