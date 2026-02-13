'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'

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
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Affiche un fun fact aléatoire au début
    setCurrentFact(diversityFacts[Math.floor(Math.random() * diversityFacts.length)])
    setProgress(0)

    // Change de fun fact toutes les 5 secondes
    const interval = setInterval(() => {
      const randomFact = diversityFacts[Math.floor(Math.random() * diversityFacts.length)]
      setCurrentFact(randomFact)
      setProgress(0)
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

  // Calcule le rayon et la circonférence pour le cercle
  const radius = 8
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="flex justify-center pt-2">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20 shadow-sm w-80 justify-center">
        <div className="relative">
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
        <Heart className="h-4 w-4 text-primary flex-shrink-0" />
        <span className="text-xs font-medium text-foreground text-center truncate">
          Fun fact: {currentFact}
        </span>
      </div>
    </div>
  )
}
