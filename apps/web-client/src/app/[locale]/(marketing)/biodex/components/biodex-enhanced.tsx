'use client'
import { Leaf } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { SpeciesCardEnhanced } from './species-card-enhanced'
import type { SpeciesContext } from '@/types/context'

interface BiodexEnhancedProps {
	species: SpeciesContext[]
}

export function BiodexEnhanced({ species }: BiodexEnhancedProps) {
	const t = useTranslations('marketing_pages.biodex')

	// Tri automatique : Unlocked → Locked (pas de filtres manuels)
	const sortedSpecies = useMemo(() => {
		return [...species].sort((a, b) => {
			const aUnlocked = a.user_status?.isUnlocked ?? false
			const bUnlocked = b.user_status?.isUnlocked ?? false

			// 1. Débloquées en premier
			if (aUnlocked && !bUnlocked) return -1
			if (!aUnlocked && bUnlocked) return 1

			// 2. Puis alphabétique
			return a.name_default.localeCompare(b.name_default, 'fr')
		})
	}, [species])

	const unlockedCount = sortedSpecies.filter(
		(s) => s.user_status?.isUnlocked
	).length
	const totalCount = species.length
	const progressPercent =
		totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0

	return (
		<>
			{/* Inline Header — No Card container */}
			<div className='w-full px-4 sm:px-6 pt-6 pb-5'>
				<h1 className='text-3xl font-bold tracking-tight text-white mb-1'>
					Mon BioDex
				</h1>
				<p className='text-sm text-white/50 mb-4'>
					Espèces sauvées grâce à vos dons
				</p>

				{/* Progress row */}
				<div className='flex items-center gap-3'>
					<div className='flex-1 relative h-1.5 rounded-full bg-white/10 overflow-hidden'>
						<div
							className='absolute inset-y-0 left-0 bg-gradient-to-r from-lime-500 to-emerald-500 rounded-full transition-all duration-700 ease-out'
							style={{ width: `${progressPercent}%` }}
						/>
					</div>
					<span className='text-xs font-semibold text-white/50 tabular-nums shrink-0'>
						{unlockedCount} / {totalCount}
					</span>
				</div>
			</div>

			{/* Main Content Area : 2-column trading card grid */}
			<div className='w-full px-4 pb-36 pt-2'>
				{sortedSpecies.length > 0 ? (
					<div className='grid grid-cols-2 gap-3'>
						{sortedSpecies.map((item) => (
							<SpeciesCardEnhanced key={item.id} species={item} />
						))}
					</div>
				) : (
					<div className='flex min-h-[40vh] items-center justify-center rounded-[3rem] border-2 border-dashed bg-muted/20 p-12 text-center animate-in fade-in zoom-in-95 duration-700'>
						<div className='space-y-4'>
							<div className='mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-muted'>
								<Leaf className='h-10 w-10 text-muted-foreground/30' />
							</div>
							<div className='space-y-2'>
								<p className='text-xl font-black tracking-tight'>
									{t('empty_title')}
								</p>
								<p className='mx-auto max-w-xs font-medium text-muted-foreground'>
									{t('empty_description')}
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	)
}
