'use client'
import type { SpeciesContext } from '@/types/species'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { getRarity, getSpeciesEmoji, RARITY_STYLES } from '@/lib/species-utils'

interface SpeciesCardEnhancedProps {
	species: SpeciesContext
	showUserStatus?: boolean
	onLockedClick?: (species: SpeciesContext) => void
}

export function SpeciesCardEnhanced({
	species,
	showUserStatus = true,
	onLockedClick,
}: SpeciesCardEnhancedProps) {
	const isLocked = showUserStatus && !species.user_status?.isUnlocked
	const rarity = getRarity(species.conservation_status)
	const rarityStyle = RARITY_STYLES[rarity]
	const silhouetteEmoji = getSpeciesEmoji(
		species.conservation_status,
		species.name_default
	)

	const cardInner = (
		<div className='flex flex-col items-center gap-2 transition-transform duration-150 active:scale-[0.97]'>
			{/* Floating image — no container */}
			<div className='w-full aspect-square'>
				{species.image_url ? (
					<img
						src={species.image_url}
						alt={species.name_default}
						className={cn(
							'h-full w-full object-contain transition-all duration-700',
							isLocked && 'grayscale opacity-40 blur-sm'
						)}
					/>
				) : (
					<div className='h-full w-full flex items-center justify-center'>
						<span className={cn('text-5xl', isLocked && 'opacity-20')}>{silhouetteEmoji}</span>
					</div>
				)}
			</div>

			{/* Species name — centered, wraps naturally */}
			<p
				className={cn(
					'text-sm font-medium text-center leading-snug',
					isLocked ? 'text-white/40' : 'text-white/90'
				)}
			>
				{species.name_default}
			</p>

			{/* Rarity — subtle typographic indicator */}
			<p
				className={cn(
					'text-[10px] uppercase tracking-wider font-medium',
					isLocked ? 'text-white/20' : rarityStyle.textColor
				)}
			>
				{rarityStyle.label}
			</p>
		</div>
	)

	if (!isLocked) {
		return (
			<Link
				href={`/profile/biodex/${species.id}`}
				className='block w-full'
			>
				{cardInner}
			</Link>
		)
	}

	return (
		<button
			type='button'
			onClick={() => onLockedClick?.(species)}
			className='w-full'
		>
			{cardInner}
		</button>
	)
}
