'use client'

import { Button } from '@make-the-change/core/ui'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Sparkles, TreeDeciduous, Honey, Clock } from 'lucide-react'
import { getMockViewerSession } from '@/lib/mock/mock-session-server'
import type { MockPointsTransactionRecord } from '@/lib/mock/mock-member-data'
import { useEffect, useState } from 'react'

type UserState = 'connected_with_points' | 'connected_zero_points' | 'not_connected'

// Utility functions
const calculateBeeEquivalence = (points: number): number => {
  return Math.round(points * 1.22)
}

const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return "Hier"
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`
  return `Il y a ${Math.floor(diffDays / 30)} mois`
}

const getTransactionIcon = (label: string) => {
  const lowerLabel = label.toLowerCase()
  if (lowerLabel.includes('commande') || lowerLabel.includes('miel')) return Honey
  if (lowerLabel.includes('contribution') || lowerLabel.includes('projet')) return TreeDeciduous
  return Sparkles
}

// Components
const BalanceCard = ({ balance }: { balance: number }) => (
  <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-black via-black to-amber-950/20 p-6">
    <div className="absolute inset-0 bg-gradient-radial from-amber-400/5 via-transparent to-transparent opacity-50" />
    <div className="relative">
      <p className="mb-2 text-xs font-medium tracking-widest text-white/50 uppercase">
        Graines disponibles
      </p>
      <p className="text-5xl font-black text-white tabular-nums">
        ✨ {balance.toLocaleString('fr-FR')}
      </p>
    </div>
  </div>
)

const ImpactEquivalenceBadge = ({ points }: { points: number }) => {
  const bees = calculateBeeEquivalence(points)
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
      <span className="text-lg">🐝</span>
      <span className="text-sm font-medium text-white/80">
        Équivaut à ~{bees.toLocaleString('fr-FR')} abeilles sauvées
      </span>
    </div>
  )
}

const GoalProgressBar = () => {
  const progress = 80
  const remaining = 50
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-white">
          Objectif en cours : Miel de Manakara
        </span>
        <span className="text-xs text-white/60">{progress}%</span>
      </div>
      <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-white/10">
        <div 
          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-white/60">
        Plus que {remaining} ✨ pour débloquer !
      </p>
    </div>
  )
}

const ImpactHistoryList = ({ transactions }: { transactions: MockPointsTransactionRecord[] }) => (
  <div className="space-y-3">
    <h3 className="text-sm font-medium tracking-widest text-white/50 uppercase">
      Historique d'impact
    </h3>
    {transactions.map((transaction) => {
      const Icon = getTransactionIcon(transaction.label)
      const isPositive = transaction.delta > 0
      return (
        <div key={transaction.id} className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
            isPositive ? 'bg-lime-400/20 text-lime-400' : 'bg-white/10 text-white/80'
          }`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">{transaction.label}</p>
            <p className="text-xs text-white/50">{formatRelativeDate(transaction.createdAt)}</p>
          </div>
          <p className={`text-sm font-bold tabular-nums ${
            isPositive ? 'text-lime-400' : 'text-white/80'
          }`}>
            {isPositive ? '+' : ''}{transaction.delta} ✨
          </p>
        </div>
      )
    })}
  </div>
)

// States
const VisitorState = () => (
  <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
    {/* Faux portefeuille en arrière-plan avec glassmorphism */}
    <div className="absolute inset-0 bg-gradient-to-b from-amber-400/10 via-transparent to-black/50 backdrop-blur-xl" />
    
    <div className="relative z-10 flex flex-col items-center gap-6">
      <div className="flex gap-4">
        <img src="/abeille-transparente.png" alt="Melli" className="h-32 w-32 object-contain drop-shadow-2xl" />
        <img src="/sylva.png" alt="Sylva" className="h-32 w-32 object-contain drop-shadow-2xl" />
        <img src="/ondine.png" alt="Ondine" className="h-32 w-32 object-contain drop-shadow-2xl" />
      </div>
      <h1 className="text-3xl font-black text-white">
        Ton impact a de la valeur.
      </h1>
      <p className="max-w-md text-lg text-white/70">
        Rejoins le collectif pour collecter des Graines ✨ à chaque action et débloque des récompenses éco-responsables exclusives.
      </p>
      <div className="flex w-full max-w-sm flex-col gap-3">
        <Link href="/onboarding/step-0">
          <Button size="lg" className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:from-amber-500 hover:to-amber-600">
            Créer un compte
          </Button>
        </Link>
        <Link href="/login">
          <Button size="lg" variant="ghost" className="w-full text-white/80 hover:text-white hover:bg-white/5">
            Me connecter
          </Button>
        </Link>
      </div>
    </div>
  </div>
)

const BeginnerState = () => (
  <div className="flex min-h-screen flex-col items-center px-6 py-8">
    <header className="mb-8 text-center">
      <h2 className="text-2xl font-bold text-white">Portefeuille</h2>
    </header>
    
    <div className="w-full max-w-md space-y-8">
      {/* Carte solde */}
      <div className="flex flex-col items-center rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-5xl font-black text-white tabular-nums">✨ 0</p>
        <div className="mt-4">
          <img src="/sylva.png" alt="Sylva" className="h-24 w-24 object-contain drop-shadow-2xl" />
        </div>
      </div>

      {/* Message d'encouragement */}
      <div className="text-center">
        <h3 className="mb-2 text-2xl font-bold text-white">
          Tout commence par une graine.
        </h3>
        <p className="text-white/70">
          Ton portefeuille est prêt. Soutiens ton premier projet pour commencer ta récolte et faire grandir ton impact.
        </p>
      </div>

      {/* CTA */}
      <Link href="/projects" className="block">
        <Button size="lg" className="w-full">
          Découvrir les projets
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Link>

      {/* Historique squelette */}
      <div className="text-center">
        <h3 className="mb-2 text-sm font-medium tracking-widest text-white/50 uppercase">
          Mon Carnet de Route
        </h3>
        <p className="text-sm text-white/30">
          Tes futures actions s'afficheront ici
        </p>
      </div>
    </div>
  </div>
)

const WarriorState = ({ balance, transactions }: { balance: number; transactions: MockPointsTransactionRecord[] }) => (
  <div className="flex min-h-screen flex-col px-6 py-8">
    <header className="mb-8 text-center">
      <h2 className="text-2xl font-bold text-white">Portefeuille</h2>
    </header>
    
    <div className="w-full max-w-md space-y-6">
      {/* Carte de solde */}
      <BalanceCard balance={balance} />

      {/* Équivalence écologique */}
      <div className="flex justify-center">
        <ImpactEquivalenceBadge points={balance} />
      </div>

      {/* Tracker d'objectif */}
      <GoalProgressBar />

      {/* Historique d'impact */}
      <ImpactHistoryList transactions={transactions} />
    </div>
  </div>
)

export function BalanceModalContent() {
  const [userState, setUserState] = useState<UserState>('not_connected')
  const [points, setPoints] = useState<number>(0)
  const [transactions, setTransactions] = useState<MockPointsTransactionRecord[]>([])

  useEffect(() => {
    async function loadUserState() {
      try {
        const session = await getMockViewerSession()
        if (!session) {
          setUserState('not_connected')
          return
        }

        const { getCurrentMockImpactPoints, getMockPointsTransactions } = await import('@/lib/mock/mock-member-data-server')
        const userPoints = await getCurrentMockImpactPoints(session.viewerId, session.faction)
        const userTransactions = await getMockPointsTransactions(session.viewerId)
        
        setPoints(userPoints)
        setTransactions(userTransactions)

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
    return <WarriorState balance={points} transactions={transactions} />
  }

  if (userState === 'connected_zero_points') {
    return <BeginnerState />
  }

  return <VisitorState />
}
