'use client'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { ArrowLeft, Leaf, Users } from 'lucide-react'
import { useState, useCallback } from 'react'
import { GuildMembershipButton } from '../_features/guild-membership-button'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ActiveMission = {
	title: string
	goal_label: string
	goal_target: number
	goal_current: number
	goal_unit: string
	ends_at: string
	reward_species_name: string
	reward_species_emoji: string
}

export type GuildDetailMember = {
	user_id: string
	avatar_url?: string | null
	full_name?: string | null
}

type ImpactEvent = {
	id: string
	name: string
	avatarColor: string
	time: string
	action: string
	bravos: number
}

// ─── Mock System Feed ─────────────────────────────────────────────────────────

const buildFeed = (guildName: string): ImpactEvent[] => [
	{
		id: 'f1',
		name: 'Sarah L.',
		avatarColor: 'bg-purple-500/20 text-purple-400',
		time: 'Il y a 3 min',
		action: `👋 Vient de rejoindre ${guildName}`,
		bravos: 4,
	},
	{
		id: 'f2',
		name: 'Thomas M.',
		avatarColor: 'bg-blue-500/20 text-blue-400',
		time: 'Il y a 18 min',
		action: `🌱 A fait gagner 150 pts à la tribu avec un don`,
		bravos: 11,
	},
	{
		id: 'f3',
		name: 'ÉcoGuerrier',
		avatarColor: 'bg-lime-500/20 text-lime-400',
		time: 'Il y a 2 heures',
		action: `🏆 La tribu vient de franchir 50% de son objectif mensuel !`,
		bravos: 38,
	},
	{
		id: 'f4',
		name: 'Marie-Claire B.',
		avatarColor: 'bg-rose-500/20 text-rose-400',
		time: 'Hier',
		action: `🦋 A débloqué une espèce grâce à la tribu`,
		bravos: 22,
	},
	{
		id: 'f5',
		name: 'Lucas V.',
		avatarColor: 'bg-emerald-500/20 text-emerald-400',
		time: 'Hier',
		action: `🌍 A soutenu un projet lié à la mission de la tribu`,
		bravos: 16,
	},
]

// ─── Impact Feed Card ─────────────────────────────────────────────────────────

function ImpactEventCard({ event }: { event: ImpactEvent }) {
	const [bravo, setBravo] = useState(false)
	const handleBravo = useCallback(() => {
		navigator.vibrate?.(10)
		setBravo((p) => !p)
	}, [])

	return (
		<div className='flex items-start gap-3 py-3 border-b border-white/5 last:border-0'>
			<div
				className={cn(
					'h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold border border-white/10',
					event.avatarColor
				)}
			>
				{event.name[0]}
			</div>
			<div className='flex-1 min-w-0'>
				<div className='flex items-baseline gap-1.5 flex-wrap'>
					<span className='font-semibold text-sm text-foreground'>
						{event.name}
					</span>
					<span className='text-xs text-muted-foreground'>{event.time}</span>
				</div>
				<p className='text-sm text-foreground/75 leading-relaxed mt-0.5'>
					{event.action}
				</p>
			</div>
			<button
				onClick={handleBravo}
				className={cn(
					'shrink-0 flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors hover:bg-white/5',
					bravo ? 'text-lime-400' : 'text-muted-foreground hover:text-lime-400'
				)}
			>
				<Leaf className={cn('h-3 w-3', bravo && 'fill-lime-400')} />
				<span>{event.bravos + (bravo ? 1 : 0)}</span>
			</button>
		</div>
	)
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface GuildDetailClientProps {
	guildId: string
	guildName: string
	guildSlug: string
	description?: string | null
	bannerUrl?: string | null
	logoUrl?: string | null
	type?: string | null
	membersCount: number
	isMember: boolean
	activeMission?: ActiveMission | null
	members: GuildDetailMember[]
}

export function GuildDetailClient({
	guildId,
	guildName,
	guildSlug,
	description,
	bannerUrl,
	membersCount,
	isMember,
	activeMission,
	members,
}: GuildDetailClientProps) {
	const feed = buildFeed(guildName)

	const missionPercent = activeMission
		? Math.min(
				100,
				Math.round(
					(activeMission.goal_current / activeMission.goal_target) * 100
				)
			)
		: null

	// Avatar stack — affiche jusqu'à 5 membres
	const avatarStack = members.slice(0, 5)

	return (
		<div className='flex flex-col min-h-screen bg-background pb-24'>
			{/* ── A. HERO IMMERSIF — Full Bleed ────────────────────────── */}
			<div
				className='relative w-full overflow-hidden min-h-[260px] flex flex-col justify-end'
				style={
					bannerUrl
						? {
								backgroundImage: `url(${bannerUrl})`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
							}
						: undefined
				}
			>
				{/* Gradient overlay pour lisibilité */}
				<div
					className={cn(
						'absolute inset-0',
						bannerUrl
							? 'bg-gradient-to-t from-black/90 via-black/50 to-black/20'
							: 'bg-gradient-to-br from-emerald-950 via-lime-950 to-slate-950'
					)}
				/>

				{/* Back button — floating over the image */}
				<div className='absolute top-4 left-4 z-20'>
					<Link
						href='/aventure/guilds'
						className='inline-flex items-center gap-1.5 text-sm text-white/90 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10'
					>
						<ArrowLeft className='h-4 w-4' />
						Les Tribus
					</Link>
				</div>

				<div className='relative z-10 p-5 pb-6'>
					{/* Squircle Avatar — vibrant solid background */}
					<div className='h-14 w-14 rounded-2xl bg-emerald-600 flex items-center justify-center mb-3 overflow-hidden shadow-lg shadow-black/30'>
						<span className='text-xl font-black text-white'>
							{guildName[0]}
						</span>
					</div>

					{/* Badges */}
					<div className='flex items-center gap-2 mb-2'>
						<span className='text-[10px] font-semibold uppercase tracking-widest text-lime-400 bg-lime-400/10 px-2 py-0.5 rounded-full border border-lime-400/20'>
							Tribu Publique
						</span>
					</div>

					<h1 className='text-2xl font-black tracking-tight text-white leading-tight'>
						{guildName}
					</h1>

					{description && (
						<p className='text-sm text-white/75 mt-1.5 leading-relaxed max-w-sm'>
							{description}
						</p>
					)}
				</div>
			</div>

			{/* ── B. MISSION DU MOIS — Le Raid Boss ───────────────────── */}
			<div className='mx-4 mt-4 rounded-3xl bg-lime-950/40 border border-lime-500/20 p-5'>
				{activeMission ? (
					<>
						<div className='flex items-center gap-2 mb-1'>
							<span className='text-xs font-bold uppercase tracking-widest text-lime-400'>
								⚔️ {activeMission.title}
							</span>
						</div>
						<p className='text-base font-bold text-white mb-1'>
							{activeMission.goal_label}
						</p>

						{/* Jauge — objectif à gauche, % à droite */}
						<div className='flex justify-between items-center mb-1.5'>
							<span className='text-xs text-muted-foreground'>
								🎯 {activeMission.goal_target.toLocaleString()}{' '}
								{activeMission.goal_unit}
							</span>
							<span className='text-xs font-bold text-lime-400 tabular-nums'>
								{missionPercent}%
							</span>
						</div>
						<div className='h-1.5 w-full bg-white/20 rounded-full overflow-hidden mb-4'>
							<div
								className='h-full bg-lime-400 rounded-full transition-all duration-700'
								style={{ width: `${missionPercent}%` }}
							/>
						</div>

						{/* Récompense — silhouette mystère */}
						<div className='flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2 mb-4 border border-white/10'>
							{/* Silhouette teasing — emoji verrouillé */}
							<div className='w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0'>
								<span
									className='text-2xl'
									style={{ filter: 'brightness(0)', opacity: 0.4 }}
									aria-label='Récompense mystère'
								>
									{activeMission.reward_species_emoji}
								</span>
							</div>
							<div>
								<p className='text-xs text-muted-foreground'>
									Récompense si mission accomplie
								</p>
								<p className='text-sm font-semibold text-white'>
									{activeMission.reward_species_name}
								</p>
							</div>
						</div>

						{/* CTA — membre seulement (pas de bouton Rejoindre ici) */}
						{isMember && (
							<Link
								href='/projets'
								className='flex items-center justify-center gap-2 w-full bg-lime-400/10 hover:bg-lime-400/20 text-lime-400 border border-lime-400/20 font-semibold rounded-2xl py-3 transition-colors text-sm'
							>
								🌱 Faire un don → contribuer à la mission
							</Link>
						)}
					</>
				) : (
					<div className='text-center py-4'>
						<p className='text-2xl mb-2'>⚔️</p>
						<p className='font-semibold text-foreground'>
							Aucune mission active
						</p>
						<p className='text-sm text-muted-foreground mt-1'>
							La prochaine mission arrive bientôt.
						</p>
					</div>
				)}
			</div>

			{/* ── C. PREUVE SOCIALE ────────────────────────────────────── */}
			<div className='mx-4 mt-4 flex items-center gap-3 px-1'>
				{/* Avatar stack */}
				{avatarStack.length > 0 && (
					<div className='flex'>
						{avatarStack.map((member, i) => (
							<div
								key={member.user_id}
								className={cn(
									'h-8 w-8 rounded-full border-2 border-background bg-emerald-600 flex items-center justify-center text-xs font-bold text-white shadow-sm',
									i > 0 && '-ml-2'
								)}
								style={{ zIndex: avatarStack.length - i }}
							>
								{member.full_name?.[0] ?? '?'}
							</div>
						))}
					</div>
				)}
				<div className='flex items-center gap-1.5 text-sm text-muted-foreground'>
					<Users className='h-4 w-4' />
					<span>
						<span className='font-bold text-foreground'>
							{membersCount.toLocaleString()}
						</span>{' '}
						membres actifs
					</span>
				</div>
			</div>

			{/* ── D. FLUX D'IMPACT LOCAL ───────────────────────────────── */}
			<div className='mx-4 mt-5 pb-28'>
				<h2 className='text-base font-bold tracking-tight mb-3 text-foreground/90'>
					Activité de la tribu
				</h2>
				<div className='rounded-2xl bg-white/5 border border-white/10 px-4 divide-y-0'>
					{feed.map((event) => (
						<ImpactEventCard key={event.id} event={event} />
					))}
				</div>
			</div>

			{/* ── CTA flottant Rejoindre — glassmorphism (non-membre uniquement) ── */}
			{!isMember && (
				<div className='fixed bottom-[var(--navbar-height,80px)] left-0 w-full p-4 bg-background/80 backdrop-blur-xl border-t border-white/5 z-40'>
					<GuildMembershipButton guildId={guildId} isMember={false} />
				</div>
			)}
		</div>
	)
}
