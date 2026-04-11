'use client'
import { Users, Leaf } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useHaptic } from '@/hooks/use-haptic'

// ─── Types ────────────────────────────────────────────────────────────────────

type Guild = {
	id: string
	slug: string
	name: string
	banner_url?: string | null
	logo_url?: string | null
	members_count?: number | null
	is_member?: boolean
}

type ImpactEvent = {
	id: string
	profileId?: string
	name: string
	avatar?: string
	time: string
	action: string
	actionHighlight?: string
	likes: number
	bravos: number
	avatarColor: string
	isTribe?: boolean
	tribeName?: string
	tribeSlug?: string
}

// ─── Mock Collective Goals ────────────────────────────────────────────────────
// Clé = guild.slug, valeur = objectif mensuel mocké
type TribeGoal = { label: string; percent: number }
const TRIBE_GOALS: Record<string, TribeGoal> & { default: TribeGoal } = {
	'agroforest-pioneers': { label: '5 000 arbres', percent: 73 },
	'ocean-mangrove-circle': { label: '12 récifs suivis', percent: 48 },
	'campus-biodiversity-lab': { label: '30 zones vivantes', percent: 57 },
	'zero-dechet': { label: '500 kg de déchets évités', percent: 91 },
	default: { label: 'Objectif mensuel commun', percent: 62 },
}

const DISCOVERY_GUILD_SUGGESTIONS: Guild[] = [
	{
		id: 'suggested-agroforest-pioneers',
		slug: 'agroforest-pioneers',
		name: 'Agroforest Pioneers',
		banner_url:
			'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=900',
		logo_url:
			'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=200',
		members_count: 42,
		is_member: false,
	},
	{
		id: 'suggested-ocean-mangrove-circle',
		slug: 'ocean-mangrove-circle',
		name: 'Ocean Mangrove Circle',
		banner_url:
			'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=900',
		logo_url:
			'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&q=80&w=200',
		members_count: 48,
		is_member: false,
	},
	{
		id: 'suggested-campus-biodiversity-lab',
		slug: 'campus-biodiversity-lab',
		name: 'Campus Biodiversity Lab',
		banner_url:
			'https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&q=80&w=900',
		logo_url:
			'https://images.unsplash.com/photo-1516571748831-5d81767b788d?auto=format&fit=crop&q=80&w=200',
		members_count: 64,
		is_member: false,
	},
]

// ─── Mock Impact Feed ─────────────────────────────────────────────────────────

const MOCK_IMPACT_FEED: ImpactEvent[] = [
	{
		id: 'evt-1',
		name: 'Thomas M.',
		profileId: 'thomas-m',
		time: 'Il y a 2 min',
		action: '🌱 Vient de soutenir le projet Forêt Méditerranéenne',
		actionHighlight: 'Forêt Méditerranéenne',
		likes: 24,
		bravos: 8,
		avatarColor: 'bg-blue-500/20 text-blue-400',
	},
	{
		id: 'evt-2',
		name: 'ÉcoGuerrier',
		profileId: 'eco-guerrier',
		time: 'Il y a 14 min',
		action: '🏆 A validé une Série de 7 jours',
		likes: 41,
		bravos: 17,
		avatarColor: 'bg-lime-500/20 text-lime-400',
	},
	{
		id: 'tribe-1',
		name: 'Agroforest Pioneers',
		time: 'Il y a 30 min',
		action:
			'🏆 Vient d’atteindre son objectif mensuel : 5 000 arbres plantés !',
		likes: 284,
		bravos: 96,
		avatarColor: 'bg-lime-500/20 text-lime-400',
		isTribe: true,
		tribeName: 'Agroforest Pioneers',
		tribeSlug: 'agroforest-pioneers',
	},
	{
		id: 'evt-3',
		name: 'Sarah L.',
		profileId: 'sarah-l',
		time: 'Il y a 1 heure',
		action: '🦋 A débloqué le Lynx Boréal dans le BioDex',
		likes: 63,
		bravos: 22,
		avatarColor: 'bg-purple-500/20 text-purple-400',
	},
	{
		id: 'evt-4',
		name: 'Citoyen Anonyme',
		profileId: 'citoyen-anonyme',
		time: 'Il y a 2 heures',
		action: '🤝 A rejoint la Tribu Agroforest Pioneers',
		likes: 18,
		bravos: 5,
		avatarColor: 'bg-zinc-500/20 text-zinc-400',
		tribeName: 'Agroforest Pioneers',
		tribeSlug: 'agroforest-pioneers',
	},
	{
		id: 'evt-5',
		name: 'Marie-Claire B.',
		profileId: 'marie-claire-b',
		time: 'Il y a 3 heures',
		action: '🌍 A participé à la collecte de fonds Zones Humides',
		likes: 89,
		bravos: 31,
		avatarColor: 'bg-rose-500/20 text-rose-400',
	},
	{
		id: 'tribe-2',
		name: 'Ocean & Mangrove Circle',
		time: 'Il y a 4 heures',
		action:
			'💧 A franchi la barre des 12 récifs suivis ce mois-ci !',
		likes: 178,
		bravos: 61,
		avatarColor: 'bg-blue-500/20 text-blue-400',
		isTribe: true,
		tribeName: 'Ocean & Mangrove Circle',
		tribeSlug: 'ocean-mangrove-circle',
	},
	{
		id: 'evt-6',
		name: 'Lucas V.',
		profileId: 'lucas-v',
		time: 'Il y a 5 heures',
		action: '🌿 A validé le défi « Zéro Déchet » de la semaine',
		likes: 35,
		bravos: 12,
		avatarColor: 'bg-emerald-500/20 text-emerald-400',
	},
	{
		id: 'evt-7',
		name: 'NaturaMind',
		profileId: 'natura-mind',
		time: 'Hier',
		action: '⭐ Vient de débloquer le badge Gardien des Forêts',
		likes: 112,
		bravos: 47,
		avatarColor: 'bg-amber-500/20 text-amber-400',
	},
	{
		id: 'evt-8',
		name: 'Amira K.',
		profileId: 'amira-k',
		time: 'Hier',
		action: "🦅 A découvert l'Aigle de Bonelli dans le BioDex",
		likes: 57,
		bravos: 19,
		avatarColor: 'bg-cyan-500/20 text-cyan-400',
	},
]

// ─── Borderless Impact Post ───────────────────────────────────────────────────

function splitAction(action: string) {
	const firstSpace = action.indexOf(' ')

	if (firstSpace === -1) {
		return { emoji: '', text: action }
	}

	return {
		emoji: action.slice(0, firstSpace),
		text: action.slice(firstSpace + 1),
	}
}

function ImpactAction({ event, text }: { event: ImpactEvent; text: string }) {
	if (
		!event.tribeSlug ||
		!event.tribeName ||
		!text.includes(event.tribeName)
	) {
		if (!event.actionHighlight || !text.includes(event.actionHighlight)) {
			return <>{text}</>
		}

		const [before, after] = text.split(event.actionHighlight)

		return (
			<>
				{before}
				<strong className='font-semibold text-white'>
					{event.actionHighlight}
				</strong>
				{after}
			</>
		)
	}

	const [before, after] = text.split(event.tribeName)

	return (
		<>
			{before}
			<Link
				href={`/community/guilds/${event.tribeSlug}`}
				className='font-semibold text-white active:opacity-50 transition-opacity'
			>
				{event.tribeName}
			</Link>
			{after}
		</>
	)
}

function ImpactCard({ event }: { event: ImpactEvent }) {
	const haptic = useHaptic()
	const [bravo, setBravo] = useState(false)

	const handleBravo = useCallback(() => {
		haptic.mediumTap()
		setBravo((prev) => !prev)
	}, [haptic])

	const isTribe = event.isTribe === true
	const headerHref =
		isTribe && event.tribeSlug
			? `/community/guilds/${event.tribeSlug}`
			: `/profile/${event.profileId}`
	const action = splitAction(event.action)

	return (
		<div className='py-5 border-b border-white/5 last:border-b-0'>
			<Link
				href={headerHref}
				prefetch={false}
				className='mb-3 flex items-center gap-3 active:opacity-50 transition-opacity cursor-pointer'
			>
				{/* Avatar */}
				<div
					className={cn(
						'h-10 w-10 shrink-0 flex items-center justify-center text-sm font-bold border',
						event.avatarColor,
						isTribe
							? 'rounded-xl border-lime-500/30'
							: 'rounded-full border-border/30'
					)}
				>
					{event.name[0]}
				</div>
				<div className='flex items-center gap-1.5 min-w-0 flex-wrap'>
					<span className='font-bold text-white text-[15px] tracking-tight truncate'>
						{event.name}
					</span>
					<span className='text-muted-foreground text-xs'>·</span>
					<span className='text-muted-foreground text-xs'>{event.time}</span>
				</div>
			</Link>

			<p className='text-[15px] text-white/70 leading-snug mt-1 mb-3 flex items-start gap-2'>
				{action.emoji && <span>{action.emoji}</span>}
				<span>
					<ImpactAction event={event} text={action.text} />
				</span>
			</p>

			<div className='flex items-center gap-2'>
				<button
					onClick={handleBravo}
					className={cn(
						'flex items-center gap-1.5 text-xs font-semibold tracking-wide px-3 py-1.5 rounded-full transition-colors hover:bg-white/5',
						bravo
							? 'text-lime-400'
							: 'text-muted-foreground hover:text-lime-400'
					)}
				>
					<Leaf
						className={cn(
							'h-4 w-4 transition-transform active:scale-125',
							bravo && 'fill-lime-400'
						)}
					/>
					Bravo{' '}
					<span className='text-sm font-medium tabular-nums opacity-60 ml-1'>
						{event.bravos + (bravo ? 1 : 0)}
					</span>
				</button>

				{isTribe && event.tribeSlug && (
					<Link
						href={`/community/guilds/${event.tribeSlug}`}
						className='flex items-center gap-1 text-xs font-semibold text-lime-400 hover:bg-lime-400/10 px-3 py-1.5 rounded-full transition-colors'
					>
						👉 Rejoindre
					</Link>
				)}
			</div>
		</div>
	)
}

// ─── Immersive Tribe Banner Card ──────────────────────────────────────────────

function TribeCard({ guild }: { guild: Guild }) {
	const goal = TRIBE_GOALS[guild.slug] ?? TRIBE_GOALS.default

	return (
		<Link
			href={`/community/guilds/${guild.slug}`}
			prefetch={false}
			className='block shrink-0 w-56 snap-start active:scale-[0.98] transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
		>
			<div className='relative overflow-hidden rounded-2xl h-44 flex flex-col'>
				{/* Cover photo background */}
				{guild.banner_url ? (
					<Image
						src={guild.banner_url}
						alt={`Couverture de la tribu ${guild.name}`}
						fill
						className='object-cover absolute inset-0'
						sizes='224px'
					/>
				) : (
					<div className='absolute inset-0 bg-gradient-to-br from-emerald-900 to-lime-950' />
				)}

				{/* Dark gradient mask for readability */}
				<div className='absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10' />

				{/* Avatar (squircle) top-left */}
				<div className='relative z-20 p-3'>
					{guild.logo_url ? (
						<div className='w-10 h-10 rounded-xl border border-white/20 overflow-hidden shrink-0'>
							<Image
								src={guild.logo_url}
								alt={`Logo de la tribu ${guild.name}`}
								width={40}
								height={40}
								className='object-cover w-full h-full'
							/>
						</div>
					) : (
						<div className='w-10 h-10 rounded-xl border border-white/20 bg-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-300 shrink-0'>
							{guild.name[0]}
						</div>
					)}
				</div>

				{/* Content pushed to bottom */}
				<div className='relative z-20 mt-auto px-3 pb-3 space-y-2'>
					{/* Name + member count */}
					<div>
						<p className='text-base font-bold text-white tracking-tight leading-tight line-clamp-1'>
							{guild.name}
						</p>
						<p className='text-[12px] font-medium text-white/80 mt-1 flex items-center gap-1'>
							<Users className='h-3 w-3' />
							{(guild.members_count || 0).toLocaleString()} membres
						</p>
					</div>

					{/* Progress gauge — cleaned up layout */}
					<div>
						<div className='flex items-center justify-between mb-1'>
							<span className='text-[10px] text-white/70 truncate'>
								🎯 {goal.label}
							</span>
							<span className='text-[10px] font-bold text-lime-400 tabular-nums ml-2 shrink-0'>
								{goal.percent}%
							</span>
						</div>
						<div className='h-1.5 w-full bg-white/20 rounded-full overflow-hidden'>
							<div
								className='h-full bg-lime-400 rounded-full transition-all duration-700'
								style={{ width: `${goal.percent}%` }}
							/>
						</div>
					</div>
				</div>
			</div>
		</Link>
	)
}

// ─── Main component ────────────────────────────────────────────────────────────

interface AdventureMovementClientProps {
	guilds: Guild[]
}

export function AdventureMovementClient({
	guilds,
}: AdventureMovementClientProps) {
	const userTribes = guilds.filter((guild) => guild.is_member)
	const publicTribes = guilds.filter((guild) => !guild.is_member)
	const discoveryTribes = [
		...publicTribes,
		...DISCOVERY_GUILD_SUGGESTIONS.filter(
			(suggestedGuild) =>
				!publicTribes.some((guild) => guild.slug === suggestedGuild.slug)
		),
	].slice(0, 3)

	return (
		<div className='space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-24'>
			{/* Mes Tribus */}
			<section className='space-y-4 px-4 sm:px-6'>
				<div className='flex items-center justify-between'>
					<h2 className='text-xl font-bold tracking-tight text-white'>
						{userTribes.length > 0 ? 'Mes Tribus' : 'Tribus à découvrir'}
					</h2>
					{userTribes.length > 3 && (
						<Link
							href='/community/guilds'
							className='text-sm text-primary font-medium hover:underline'
						>
							Voir tout
						</Link>
					)}
				</div>

				<div
					className='flex overflow-x-auto gap-4 pb-4 pr-2 sm:mx-0 snap-x snap-mandatory hide-scrollbar'
					style={{ paddingLeft: 'max(1rem, env(safe-area-inset-left))' }}
				>
					{(userTribes.length > 0 ? userTribes : discoveryTribes).map(
						(guild) => (
							<TribeCard key={guild.id} guild={guild} />
						)
					)}
				</div>
			</section>

			{/* Impact Global */}
			<section className='space-y-0 px-4 sm:px-6 pt-2 border-t border-white/5'>
				<div className='flex items-center mb-4'>
					<h2 className='text-xl font-bold tracking-tight text-white'>
						Impact Global
					</h2>
				</div>
				<div className='relative z-0 w-full'>
					{MOCK_IMPACT_FEED.map((event) => (
						<ImpactCard key={event.id} event={event} />
					))}
				</div>
			</section>
		</div>
	)
}
