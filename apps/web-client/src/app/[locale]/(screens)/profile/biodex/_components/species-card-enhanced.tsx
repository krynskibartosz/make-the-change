'use client'
import type { SpeciesContext } from '@/types/species'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

interface SpeciesCardEnhancedProps {
	species: SpeciesContext
	showUserStatus?: boolean
	onLockedClick?: (species: SpeciesContext) => void
}

// ─── Rareté déduite du statut de conservation IUCN ───────────────────────────
type Rarity = 'common' | 'rare' | 'legendary'

function getRarity(status: string | null | undefined): Rarity {
	switch (status?.toUpperCase()) {
		case 'EN':
		case 'CR':
		case 'EW':
		case 'EX':
			return 'legendary'
		case 'VU':
		case 'NT':
			return 'rare'
		default:
			return 'common'
	}
}

// ─── Emoji silhouette basé sur le statut de conservation ─────────────────────
function getSpeciesEmoji(
	status: string | null | undefined,
	name: string
): string {
	const s = status?.toUpperCase()
	// Legendary / critically endangered
	if (s === 'CR' || s === 'EW' || s === 'EX') return '🦁'
	if (s === 'EN') return '🐺'
	if (s === 'VU') return '🦉'
	if (s === 'NT') return '🦊'
	// Fallback based on name hints
	const n = name.toLowerCase()
	if (n.includes('abeille') || n.includes('bee') || n.includes('apis'))
		return '🐝'
	if (n.includes('aigle') || n.includes('eagle') || n.includes('hawk'))
		return '🦅'
	if (n.includes('ours') || n.includes('bear')) return '🐻'
	if (n.includes('loup') || n.includes('wolf')) return '🐺'
	if (n.includes('renard') || n.includes('fox')) return '🦊'
	if (n.includes('cerf') || n.includes('deer')) return '🦌'
	if (n.includes('lynx') || n.includes('chat') || n.includes('cat')) return '🐱'
	if (n.includes('baleine') || n.includes('whale') || n.includes('dauphin'))
		return '🐋'
	if (n.includes('tortue') || n.includes('turtle')) return '🐢'
	if (n.includes('papillon') || n.includes('butterfly')) return '🦋'
	return '🌿'
}

const RARITY_STYLES: Record<
	Rarity,
	{ textColor: string; label: string }
> = {
	common: {
		textColor: 'text-emerald-500/60',
		label: 'Commun',
	},
	rare: {
		textColor: 'text-blue-400/70',
		label: 'Rare',
	},
	legendary: {
		textColor: 'text-amber-400/80',
		label: 'Légendaire',
	},
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
