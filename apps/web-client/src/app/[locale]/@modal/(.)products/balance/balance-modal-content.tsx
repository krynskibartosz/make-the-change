'use client'

import { Button } from '@make-the-change/core/ui'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Sparkles } from 'lucide-react'
import { getMockViewerSession } from '@/lib/mock/mock-session-server'
import { useEffect, useState } from 'react'

type UserState = 'connected_with_points' | 'connected_zero_points' | 'not_connected'

export function BalanceModalContent() {
  const [userState, setUserState] = useState<UserState>('not_connected')
  const [points, setPoints] = useState<number>(0)

  useEffect(() => {
    async function loadUserState() {
      try {
        const session = await getMockViewerSession()
        if (!session) {
          setUserState('not_connected')
          return
        }

        const { getCurrentMockImpactPoints } = await import('@/lib/mock/mock-member-data-server')
        const userPoints = await getCurrentMockImpactPoints(session.viewerId, session.faction)
        setPoints(userPoints)

        if (userPoints > 0) {
          setUserState('connected_with_points')
        } else {
          setUserState('connected_zero_points')
        }
      } catch (error) {
        setUserState('not_connected')
      }
    }

    loadUserState()
  }, [])

  if (userState === 'connected_with_points') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-lime-400/20">
          <Sparkles className="h-16 w-16 text-lime-400" />
        </div>
        <h1 className="mb-2 text-3xl font-black text-white">
          Vous avez récolté {points.toLocaleString('fr-FR')} Graines ! 🌱
        </h1>
        <p className="mb-8 text-lg text-white/60">
          Encore {Math.max(0, 50 - (points % 1000))} Graines et vous pouvez débloquer le Miel d'Eucalyptus.
        </p>
        <Link href="/adventure">
          <Button size="lg" className="w-full max-w-sm">
            Comment gagner plus ?
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    )
  }

  if (userState === 'connected_zero_points') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-white/10">
          <Sparkles className="h-16 w-16 text-white/60" />
        </div>
        <h1 className="mb-2 text-3xl font-black text-white">
          Votre portefeuille est vide
        </h1>
        <p className="mb-8 text-lg text-white/60">
          Il est temps de planter votre première graine ! Soutenez un projet pour commencer à cumuler des récompenses.
        </p>
        <Link href="/projects">
          <Button size="lg" className="w-full max-w-sm">
            Découvrir les projets
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    )
  }

  // Utilisateur non connecté
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="mb-6 flex gap-4">
        <img src="/abeille-transparente.png" alt="Melli" className="h-24 w-24 object-contain drop-shadow-2xl" />
        <img src="/sylva.png" alt="Sylva" className="h-24 w-24 object-contain drop-shadow-2xl" />
        <img src="/ondine.png" alt="Ondine" className="h-24 w-24 object-contain drop-shadow-2xl" />
      </div>
      <h1 className="mb-2 text-3xl font-black text-white">
        Rejoignez le collectif !
      </h1>
      <p className="mb-8 text-lg text-white/60">
        Créez un compte gratuit pour transformer votre impact positif en récompenses réelles.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <Link href="/onboarding/step-0">
          <Button size="lg" className="w-full">
            Créer un compte
          </Button>
        </Link>
        <Link href="/login">
          <Button size="lg" variant="ghost" className="w-full text-white/80 hover:text-white">
            Me connecter
          </Button>
        </Link>
      </div>
    </div>
  )
}
