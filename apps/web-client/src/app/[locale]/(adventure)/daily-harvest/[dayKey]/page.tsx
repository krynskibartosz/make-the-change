'use client'

import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, CheckCircle2, Lock, Sparkles, Sprout, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import { useHaptic } from '@/hooks/use-haptic'
import { Link } from '@/i18n/navigation'
import { getFactionTheme, resolveFactionThemeKey, type FactionTheme } from '@/lib/faction-theme'
import { recordClientMockChallengeCompletion } from '@/lib/mock/mock-challenge-progress'
import { getClientMockViewerSession } from '@/lib/mock/mock-session'
import type { MockChallengeDetail } from '@/lib/mock/mock-challenges'
import type { Faction } from '@/lib/mock/types'
import { cn } from '@/lib/utils'

const FACTION_CONTENT = {
  neutral: {
    title: "Les Défis Quotidiens",
    mascotImg: '/images/logo-icon-bee.png',
  },
  pollinisateurs: {
    title: 'Quête de Melli',
    mascotImg: '/abeille-transparente.png',
  },
  forets: {
    title: 'Quête de Sylva',
    mascotImg: '/sylva.png',
  },
  mers: {
    title: "Quête d'Ondine",
    mascotImg: '/ondine.png',
  },
} as const

export default function DailyHarvestPage({ params }: { params: { dayKey: string; locale: string } }) {
  const searchParams = useSearchParams()
  const haptic = useHaptic()
  const [phase, setPhase] = useState<'idle' | 'charging' | 'revealed'>('idle')
  const [progress, setProgress] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Get params from URL
  const factionParam = searchParams.get('faction') as Faction | null
  const challengeId = searchParams.get('challengeId')
  const viewerId = searchParams.get('viewerId')

  // Mock data - in production this would be fetched from API
  const session = getClientMockViewerSession()
  const hasFaction = !!factionParam || !!session?.faction
  const themeKey = resolveFactionThemeKey(factionParam || session?.faction || null)
  const accentTheme = getFactionTheme(factionParam || session?.faction || null)

  // Mock challenge data
  const challenge: MockChallengeDetail | null = {
    id: challengeId || 'daily-harvest-1',
    type: 'daily_harvest',
    title: 'Récolte quotidienne',
    description: 'Charge ton rituel quotidien pour recevoir tes graines.',
    progress: isCompleted ? 1 : 0,
    max: 1,
    reward: 50,
    rewardBadge: 'Gardien du quotidien',
    completedAt: isCompleted ? new Date().toISOString() : null,
    claimedAt: isCompleted ? new Date().toISOString() : null,
    dayKey: params.dayKey,
    metadata: {},
  }

  const clearChargeInterval = useCallback(() => {
    if (!intervalRef.current) {
      return
    }

    clearInterval(intervalRef.current)
    intervalRef.current = null
  }, [])

  useEffect(() => {
    clearChargeInterval()
    setPhase('idle')
    setProgress(0)

    return () => {
      clearChargeInterval()
    }
  }, [clearChargeInterval])

  const startCharging = useCallback(() => {
    if (phase === 'revealed' || intervalRef.current) {
      return
    }

    setPhase('charging')
    intervalRef.current = setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + 4, 100)
        if (next >= 100) {
          clearChargeInterval()
          setPhase('revealed')
        }
        return next
      })
    }, 25)
  }, [clearChargeInterval, phase])

  const stopCharging = useCallback(() => {
    if (phase !== 'charging') {
      return
    }

    clearChargeInterval()
    setPhase('idle')
    setProgress(0)
  }, [clearChargeInterval, phase])

  const handleClaim = useCallback(() => {
    const timestamp = new Date().toISOString()
    setIsCompleted(true)
    clearChargeInterval()
    setPhase('idle')
    setProgress(0)

    // Record completion in mock system
    if (viewerId && params.dayKey) {
      recordClientMockChallengeCompletion({
        viewerId,
        dayKey: params.dayKey,
        archetypeId: 'daily-harvest',
        max: challenge?.max || 1,
        timestamp,
      })
    }

    haptic.lightTap()
  }, [viewerId, params.dayKey, challenge?.max, haptic, clearChargeInterval])

  const contentKey = themeKey === 'neutral' ? 'forets' : themeKey
  const pageTitle = hasFaction ? FACTION_CONTENT[contentKey as keyof typeof FACTION_CONTENT]?.title : "Les Défis Quotidiens"

  return (
    <div className='min-h-screen bg-[#0B0F15]'>
      {/* Header with back button */}
      <div className='sticky top-0 z-50 bg-[#0B0F15]/80 backdrop-blur-md border-b border-white/10'>
        <div className='px-6 py-4'>
          <Link
            href='/adventure/community'
            className='inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors'
          >
            <ArrowLeft className='h-5 w-5' />
            <span className='text-sm font-medium'>Retour aux défis</span>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className='relative flex min-h-[calc(100vh-73px)] flex-col items-center justify-center overflow-hidden px-6'>
        {/* Gradient de remplissage full screen */}
        <div
          className='absolute inset-0 transition-all duration-75 ease-linear'
          style={{
            opacity: progress / 100,
            background: accentTheme.key === 'pollinisateurs'
              ? 'linear-gradient(to top, rgba(251, 191, 36, 0.3) 0%, transparent 100%)'
              : accentTheme.key === 'forets'
              ? 'linear-gradient(to top, rgba(52, 211, 153, 0.3) 0%, transparent 100%)'
              : accentTheme.key === 'mers'
              ? 'linear-gradient(to top, rgba(59, 130, 246, 0.3) 0%, transparent 100%)'
              : 'linear-gradient(to top, rgba(163, 230, 53, 0.3) 0%, transparent 100%)',
          }}
        />

        {/* Bordure de progression sur tout l'écran */}
        <div
          className='absolute inset-0 pointer-events-none transition-all duration-75 ease-linear'
          style={{
            clipPath: `inset(0 0 ${100 - progress}% 0)`,
            opacity: 0.3,
            background: accentTheme.key === 'pollinisateurs'
              ? 'rgba(251, 191, 36, 1)'
              : accentTheme.key === 'forets'
              ? 'rgba(52, 211, 153, 1)'
              : accentTheme.key === 'mers'
              ? 'rgba(59, 130, 246, 1)'
              : 'rgba(163, 230, 53, 1)',
          }}
        />

        <div className='pointer-events-none absolute top-1/4 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-yellow-500/20 blur-[80px]' />

        {phase !== 'revealed' ? (
          <div className='relative z-10 flex flex-col items-center w-full h-full'>
            {/* Zone tactile full screen */}
            <button
              type='button'
              onMouseDown={startCharging}
              onMouseUp={stopCharging}
              onMouseLeave={stopCharging}
              onTouchStart={(event) => {
                event.preventDefault()
                startCharging()
              }}
              onTouchEnd={(event) => {
                event.preventDefault()
                stopCharging()
              }}
              onTouchCancel={(event) => {
                event.preventDefault()
                stopCharging()
              }}
              className='absolute inset-0 flex flex-col items-center justify-center'
            >
              {/* Cercle de progression autour de la mascotte */}
              <div className='relative'>
                <svg className='absolute inset-0 -rotate-90' width={220} height={220} viewBox='0 0 220 220'>
                  <circle
                    cx='110'
                    cy='110'
                    r='100'
                    fill='none'
                    stroke='rgba(255,255,255,0.1)'
                    strokeWidth='8'
                  />
                  <circle
                    cx='110'
                    cy='110'
                    r='100'
                    fill='none'
                    stroke={
                      accentTheme.key === 'pollinisateurs'
                        ? '#FBBF24'
                        : accentTheme.key === 'forets'
                        ? '#34D399'
                        : accentTheme.key === 'mers'
                        ? '#3B82F6'
                        : '#A3E635'
                    }
                    strokeWidth='8'
                    strokeLinecap='round'
                    strokeDasharray={628}
                    strokeDashoffset={628 - (628 * progress) / 100}
                    className='transition-all duration-75 ease-linear'
                    style={{
                      filter: accentTheme.key === 'pollinisateurs'
                        ? 'drop-shadow(0 0 8px rgba(251,191,36,0.5))'
                        : accentTheme.key === 'forets'
                        ? 'drop-shadow(0 0 8px rgba(52,211,153,0.5))'
                        : accentTheme.key === 'mers'
                        ? 'drop-shadow(0 0 8px rgba(59,130,246,0.5))'
                        : 'drop-shadow(0 0 8px rgba(163,230,53,0.5))',
                    }}
                  />
                </svg>
                {hasFaction ? (
                  // Utilisateur connecté : afficher sa mascotte
                  <img
                    src={FACTION_CONTENT[contentKey as keyof typeof FACTION_CONTENT]?.mascotImg || '/images/logo-icon-bee.png'}
                    alt='Mascotte'
                    className={cn(
                      'h-48 w-48 object-contain drop-shadow-2xl transition-all duration-100 pointer-events-none',
                      phase === 'charging' ? 'scale-110 opacity-100' : 'scale-100 opacity-80',
                    )}
                    draggable='false'
                    style={{
                      filter: phase === 'charging' ? 'drop-shadow(0 0 20px rgba(163,230,53,0.6))' : 'none',
                    }}
                  />
                ) : (
                  // Utilisateur non connecté : afficher les 3 mascottes
                  <div className="flex gap-2">
                    <img
                      src="/abeille-transparente.png"
                      alt="Melli"
                      className={cn(
                        'h-20 w-20 object-contain drop-shadow-2xl transition-all duration-100 pointer-events-none',
                        phase === 'charging' ? 'scale-110 opacity-100' : 'scale-100 opacity-80',
                      )}
                      draggable='false'
                      style={{
                        filter: phase === 'charging' ? 'drop-shadow(0 0 20px rgba(163,230,53,0.6))' : 'none',
                      }}
                    />
                    <img
                      src="/sylva.png"
                      alt="Sylva"
                      className={cn(
                        'h-20 w-20 object-contain drop-shadow-2xl transition-all duration-100 pointer-events-none',
                        phase === 'charging' ? 'scale-110 opacity-100' : 'scale-100 opacity-80',
                      )}
                      draggable='false'
                      style={{
                        filter: phase === 'charging' ? 'drop-shadow(0 0 20px rgba(163,230,53,0.6))' : 'none',
                      }}
                    />
                    <img
                      src="/ondine.png"
                      alt="Ondine"
                      className={cn(
                        'h-20 w-20 object-contain drop-shadow-2xl transition-all duration-100 pointer-events-none',
                        phase === 'charging' ? 'scale-110 opacity-100' : 'scale-100 opacity-80',
                      )}
                      draggable='false'
                      style={{
                        filter: phase === 'charging' ? 'drop-shadow(0 0 20px rgba(163,230,53,0.6))' : 'none',
                      }}
                    />
                  </div>
                )}
              </div>

              <p className='mt-12 text-center text-2xl font-bold uppercase tracking-widest text-white/90 pointer-events-none select-none'>
                {phase === 'charging' ? `${Math.round(progress)}%` : 'Maintiens pour récolter'}
              </p>
              <p className='mt-3 max-w-[280px] text-center text-base text-white/70'>
                {phase === 'charging' ? 'Continue...' : (challenge?.description || 'Charge ton rituel quotidien pour recevoir tes graines.')}
              </p>
            </button>
          </div>
        ) : (
          <div className='animate-in zoom-in slide-in-from-bottom-10 duration-700 z-10 flex flex-col items-center'>
            <h2 className={cn('mb-2 text-sm font-bold uppercase tracking-widest pointer-events-none select-none', accentTheme.accentText)}>
              Récompense quotidienne
            </h2>
            <div className='relative mb-4'>
              <div className='pointer-events-none absolute inset-0 -z-10 flex items-center justify-center'>
                <div className={cn('h-64 w-64 rounded-full blur-2xl', accentTheme.accentGlow)} />
              </div>
              <div className={cn('text-7xl font-black pointer-events-none select-none', accentTheme.accentText, accentTheme.accentShadow)}>
                + {challenge?.reward ?? 50}{' '}
                <Sprout className='inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400' />
              </div>
            </div>
            <p className='max-w-[250px] text-center text-white/60 pointer-events-none select-none'>
              Ton compagnon a travaillé toute la nuit. Reviens demain pour continuer ta série.
            </p>
            <button
              type='button'
              onClick={handleClaim}
              className={cn(
                'mt-12 h-14 rounded-2xl px-8 font-bold text-black transition-transform active:scale-95',
                !hasFaction ? 'bg-lime-400' : 'bg-white'
              )}
            >
              {!hasFaction ? (
                <span className='flex items-center gap-2'>
                  Rejoindre pour récolter {challenge?.reward ?? 50}
                  <Sprout className='inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400' />
                </span>
              ) : (
                'Génial !'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
