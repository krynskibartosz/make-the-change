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
  const [progress, setProgress] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    // Affiche un fun fact aléatoire au début
    const initialFact = diversityFacts[Math.floor(Math.random() * diversityFacts.length)]
    setCurrentFact(initialFact)
    setProgress(0)
    setIsTyping(true)

    // Change de fun fact toutes les 5 secondes
    const interval = setInterval(() => {
      const randomFact = diversityFacts[Math.floor(Math.random() * diversityFacts.length)]
      setCurrentFact(randomFact)
      setProgress(0)
      setIsTyping(true)
    }, 5000)

    // Met à jour la progression toutes les 100ms
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2
        return newProgress >= 100 ? 0 : newProgress
      })
    }, 100)

    return () => {
      clearInterval(interval)
      clearInterval(progressInterval)
    }
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

  // Calcule le rayon et la circonférence pour le cercle
  const radius = 8
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="flex justify-center pt-2">
      <div className="flex items-start gap-3 px-6 py-4 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20 shadow-sm w-96 justify-start min-h-[52px]">
        <div className="relative flex-shrink-0 mt-0.5">
          <svg className="h-5 w-5 -rotate-90">
            <circle
              cx="10"
              cy="10"
              r={radius}
              stroke="hsl(var(--primary) / 0.2)"
              strokeWidth="2"
              fill="none"
            />
            <circle
              cx="10"
              cy="10"
              r={radius}
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-100 ease-linear"
            />
          </svg>
        </div>
        <Lightbulb className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <span className="text-xs font-medium text-foreground text-left block">
            Fun fact: {displayedText}
            {isTyping && <span className="inline-block w-1 h-3 bg-primary ml-1 animate-pulse" />}
          </span>
        </div>
      </div>
    </div>
  )
}
