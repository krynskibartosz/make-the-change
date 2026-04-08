'use client'
import { Users, Leaf } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

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
	name: string
	avatar?: string
	time: string
	action: string
	likes: number
	bravos: number
	avatarColor: string
	isTribe?: boolean
	tribeSlug?: string
}

// ─── Mock Collective Goals ────────────────────────────────────────────────────
// Clé = guild.slug, valeur = objectif mensuel mocké
type TribeGoal = { label: string; percent: number }
const TRIBE_GOALS: Record<string, TribeGoal> & { default: TribeGoal } = {
	'agroforest-pioneers': { label: '5 000 arbres', percent: 73 },
	'gardiens-de-leau': { label: "10 000 L d'eau économisés", percent: 48 },
	'zero-dechet': { label: '500 kg de déchets évités', percent: 91 },
	default: { label: 'Objectif mensuel commun', percent: 62 },
}

// ─── Mock Impact Feed ─────────────────────────────────────────────────────────

const MOCK_IMPACT_FEED: ImpactEvent[] = [
	{
		id: 'evt-1',
		name: 'Thomas M.',
		time: 'Il y a 2 min',
		action: '🌱 Vient de soutenir le projet Forêt Méditerranéenne',
		likes: 24,
		bravos: 8,
		avatarColor: 'bg-blue-500/20 text-blue-400',
	},
	{
		id: 'evt-2',
		name: 'ÉcoGuerrier',
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
		tribeSlug: 'agroforest-pioneers',
	},
	{
		id: 'evt-3',
		name: 'Sarah L.',
		time: 'Il y a 1 heure',
		action: '🦋 A débloqué le Lynx Boréal dans le BioDex',
		likes: 63,
		bravos: 22,
		avatarColor: 'bg-purple-500/20 text-purple-400',
	},
	{
		id: 'evt-4',
		name: 'Citoyen Anonyme',
		time: 'Il y a 2 heures',
		action: '🤝 A rejoint la Tribu Agroforest Pioneers',
		likes: 18,
		bravos: 5,
		avatarColor: 'bg-zinc-500/20 text-zinc-400',
	},
	{
		id: 'evt-5',
		name: 'Marie-Claire B.',
		time: 'Il y a 3 heures',
		action: '🌍 A participé à la collecte de fonds Zones Humides',
		likes: 89,
		bravos: 31,
		avatarColor: 'bg-rose-500/20 text-rose-400',
	},
	{
		id: 'tribe-2',
		name: 'Gardiens de l’Eau',
		time: 'Il y a 4 heures',
		action:
			'💧 A franchi la barre des 5 000 litres d’eau économisés ce mois-ci !',
		likes: 178,
		bravos: 61,
		avatarColor: 'bg-blue-500/20 text-blue-400',
		isTribe: true,
		tribeSlug: 'gardiens-de-leau',
	},
	{
		id: 'evt-6',
		name: 'Lucas V.',
		time: 'Il y a 5 heures',
		action: '🌿 A validé le défi « Zéro Déchet » de la semaine',
		likes: 35,
		bravos: 12,
		avatarColor: 'bg-emerald-500/20 text-emerald-400',
	},
	{
		id: 'evt-7',
		name: 'NaturaMind',
		time: 'Hier',
		action: '⭐ Vient de débloquer le badge Gardien des Forêts',
		likes: 112,
		bravos: 47,
		avatarColor: 'bg-amber-500/20 text-amber-400',
	},
	{
		id: 'evt-8',
		name: 'Amira K.',
		time: 'Hier',
		action: "🦅 A découvert l'Aigle de Bonelli dans le BioDex",
		likes: 57,
		bravos: 19,
		avatarColor: 'bg-cyan-500/20 text-cyan-400',
	},
]

// ─── Borderless Impact Post ───────────────────────────────────────────────────

function ImpactCard({ event }: { event: ImpactEvent }) {
	const [bravo, setBravo] = useState(false)

	const handleBravo = useCallback(() => {
		navigator.vibrate?.(10)
		setBravo((prev) => !prev)
	}, [])

	const isTribe = event.isTribe === true
	const timeLabel = isTribe ? `Tribu • ${event.time}` : event.time

	return (
		<div className='pb-6 border-b border-white/5 last:border-b-0 last:pb-0'>
			<div className='flex items-center gap-3 mb-3'>
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
				<div className='flex flex-col min-w-0'>
					<span className='font-semibold text-sm text-foreground leading-none truncate'>
						{event.name}
					</span>
					<span
						className={cn(
							'text-xs mt-1',
							isTribe ? 'text-lime-500/80' : 'text-muted-foreground'
						)}
					>
						{timeLabel}
					</span>
				</div>
			</div>

			<p className='text-sm font-normal text-foreground/80 leading-relaxed mb-3'>
				{event.action}
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
					<span className='opacity-60 font-normal ml-1'>
						{event.bravos + (bravo ? 1 : 0)}
					</span>
				</button>

				{isTribe && event.tribeSlug && (
					<Link
						href={`/aventure/guilds/${event.tribeSlug}`}
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
			href={`/aventure/guilds/${guild.slug}`}
			prefetch={false}
			className='block shrink-0 w-56 snap-start transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
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
				<div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 z-10' />

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
						<p className='text-sm font-bold text-white leading-tight line-clamp-1'>
							{guild.name}
						</p>
						<p className='text-xs text-white/70 flex items-center gap-1 mt-0.5'>
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
	return (
		<div className='space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-24'>
			{/* Mes Tribus */}
			<section className='space-y-4 px-4 sm:px-6'>
				<div className='flex items-center justify-between'>
					<h2 className='text-xl font-bold tracking-tight'>Mes Tribus</h2>
					<Link
						href='/aventure/guilds'
						className='text-sm text-primary font-medium hover:underline'
					>
						Voir tout
					</Link>
				</div>

				<div
					className='flex overflow-x-auto gap-4 pb-4 pr-2 sm:mx-0 snap-x snap-mandatory hide-scrollbar'
					style={{ paddingLeft: 'max(1rem, env(safe-area-inset-left))' }}
				>
					{guilds.length > 0 ? (
						guilds.map((guild) => <TribeCard key={guild.id} guild={guild} />)
					) : (
						<div className='bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 w-full shrink-0'>
							<Users className='w-8 h-8 text-lime-400 opacity-80' />
							<div>
								<p className='text-foreground font-medium'>
									L&apos;union fait la force
								</p>
								<p className='text-sm text-muted-foreground mt-1'>
									Rejoignez une tribu pour multiplier votre impact.
								</p>
							</div>
							<Link
								href='/aventure/guilds'
								className='bg-white/10 hover:bg-white/20 text-white rounded-full px-5 py-2 text-sm transition-colors mt-2'
							>
								Explorer les tribus
							</Link>
						</div>
					)}
				</div>
			</section>

			{/* Impact Global */}
			<section className='space-y-0 px-4 sm:px-6 pt-2 border-t border-white/5'>
				<div className='flex items-center mb-4'>
					<h2 className='text-xl font-bold tracking-tight'>Impact Global</h2>
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
