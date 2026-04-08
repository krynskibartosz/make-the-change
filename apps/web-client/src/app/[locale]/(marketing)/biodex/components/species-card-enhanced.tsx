'use client'
import type { SpeciesContext } from '@/types/context'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Lock } from 'lucide-react'

interface SpeciesCardEnhancedProps {
	species: SpeciesContext
	showUserStatus?: boolean
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
	{ border: string; badge: string; label: string }
> = {
	common: {
		border: 'border-white/5',
		badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
		label: 'Commun',
	},
	rare: {
		border: 'border-white/5',
		badge: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
		label: 'Rare',
	},
	legendary: {
		border: 'border-white/5',
		badge: 'bg-amber-400/15 text-amber-400 border-amber-400/20',
		label: 'Légendaire',
	},
}

export function SpeciesCardEnhanced({
	species,
	showUserStatus = true,
}: SpeciesCardEnhancedProps) {
	const isLocked = showUserStatus && !species.user_status?.isUnlocked
	const rarity = getRarity(species.conservation_status)
	const rarityStyle = RARITY_STYLES[rarity]
	const silhouetteEmoji = getSpeciesEmoji(
		species.conservation_status,
		species.name_default
	)

	const associatedProjects = species.associated_projects ?? []
	const associatedProject =
		associatedProjects.length === 1 ? associatedProjects[0] : null

	const unlockTarget = associatedProject
		? {
				type: 'project' as const,
				slug: associatedProject.id,
			}
		: null

	const cardInner = (
		<div
			className={cn(
				'relative flex flex-col p-3 aspect-[4/5] w-full overflow-hidden rounded-3xl border',
				'transition-transform duration-150 active:scale-[0.97]',
				isLocked
					? 'bg-white/5 border-white/5'
					: 'bg-background/50 border-white/5'
			)}
		>
			{/* Top row: rarity badge OR small lock icon (top-right) */}
			<div className='flex justify-end shrink-0 mb-2'>
				{isLocked ? (
					<div className='flex items-center justify-center h-6 w-6 rounded-full bg-white/5 border border-white/10'>
						<Lock className='h-3 w-3 text-white/30' />
					</div>
				) : (
					<span
						className={cn(
							'text-[9px] font-black uppercase tracking-widest rounded-full px-2 py-0.5 border',
							rarityStyle.badge
						)}
					>
						{rarityStyle.label}
					</span>
				)}
			</div>

			{/* Middle: visual area (flex-1) */}
			<div
				className={cn(
					'flex-1 rounded-2xl overflow-hidden relative flex items-center justify-center',
					isLocked && 'bg-white/5 border border-white/5'
				)}
			>
				{isLocked ? (
					<img
						src={'/images/diorama-chouette.png'}
						alt={species.name_default}
						className='h-full w-full scale-105 object-cover grayscale contrast-125 opacity-40 blur-[2px] transition-all duration-700'
					/>
				) : true ? (
					<img
						src={'/images/diorama-chouette.png'}
						alt={species.name_default}
						className='h-full w-full object-cover'
					/>
				) : (
					<span className='text-4xl opacity-20'>🌿</span>
				)}
			</div>

			{/* Bottom: species name */}
			<div className='shrink-0 mt-2'>
				{isLocked ? (
					<span className='text-sm italic text-white/40'>Espèce inconnue</span>
				) : (
					<p className='text-sm font-semibold truncate leading-tight text-white/90'>
						{species.name_default}
					</p>
				)}
			</div>
		</div>
	)

	if (unlockTarget) {
		return (
			<Link
				href={`/projets/${unlockTarget.slug}`}
				className='block w-full text-left'
			>
				{cardInner}
			</Link>
		)
	}

	if (!isLocked) {
		return (
			<Link
				href={`/aventure/biodex/${species.id}`}
				className='block w-full text-left'
			>
				{cardInner}
			</Link>
		)
	}

	return <div className='w-full'>{cardInner}</div>
}
