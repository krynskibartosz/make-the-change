'use client'

import { useState, useEffect } from 'react'
import { Lightbulb } from 'lucide-react'

const diversityFacts = [
  "Plus de 7 000 langues sont parlées dans le monde",
  "1 personne sur 4 dans le monde est bilingue",
  "Il existe plus de 195 pays dans le monde",
  "La diversité culturelle augmente la créativité de 83%",
  "Les équipes diversifiées sont 35% plus performantes",
  "Plus de 180 nationalités collaborent sur des projets durables",
  "La diversité génère 2,3x plus de cash flow par employé",
  "Les entreprises inclusives ont 2,6x plus de revenus",
  "80% des consommateurs préfèrent les marques inclusives",
  "La biodiversité compte 8,7 millions d'espèces sur Terre"
]

export function DiversityFactLoader() {
  const [currentFact, setCurrentFact] = useState('')
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    // Affiche un fun fact aléatoire au début
    const initialFact = diversityFacts[Math.floor(Math.random() * diversityFacts.length)]
    setCurrentFact(initialFact)
    setIsTyping(true)

    // Change de fun fact toutes les 5 secondes
    const interval = setInterval(() => {
      const randomFact = diversityFacts[Math.floor(Math.random() * diversityFacts.length)]
      setCurrentFact(randomFact)
      setIsTyping(true)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Effet typewriter
  useEffect(() => {
    if (!isTyping || !currentFact) return

    setDisplayedText('')
    let index = 0
    const typingSpeed = 50 // ms par caractère

    const typingInterval = setInterval(() => {
      if (index < currentFact.length) {
        setDisplayedText(currentFact.slice(0, index + 1))
        index++
      } else {
        setIsTyping(false)
        clearInterval(typingInterval)
      }
    }, typingSpeed)

    return () => clearInterval(typingInterval)
  }, [currentFact, isTyping])



  return (
    <div aria-label="Le saviez-vous ?" className="flex justify-center pt-8">
      <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-primary/5 backdrop-blur-sm border border-primary/10 shadow-sm max-w-lg min-h-[52px]">
        <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 animate-pulse" aria-hidden="true" />
        <p className="text-sm font-medium text-foreground/80 leading-snug">
          <span className="font-bold text-primary mr-2">Le saviez-vous ?</span>
          {displayedText}
          {isTyping && <span className="inline-block w-1 h-4 align-middle bg-primary ml-1 animate-pulse" aria-hidden="true" />}
        </p>
      </div>
    </div>
  )
}
