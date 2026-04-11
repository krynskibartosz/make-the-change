'use client'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { ArrowLeft, ChevronRight, Leaf, Lock, Users } from 'lucide-react'
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
	userId?: string
	name: string
	avatarUrl?: string | null
	avatarColor: string
	time: string
	action: string
	actionHighlight?: string
	bravos: number
}

const SOCIAL_AVATAR_PLACEHOLDERS = Array.from(
	{ length: 5 },
	(_, index) =>
		`https://source.unsplash.com/random/100x100/?portrait&sig=${index + 1}`
)

const GUILD_LOGO_PLACEHOLDER =
	'https://source.unsplash.com/random/200x200/?nature,logo'

const BIODEX_REWARD_IMAGE_URL = '/images/diorama-chouette.png'

function getSocialAvatarPlaceholder(index: number) {
	return (
		SOCIAL_AVATAR_PLACEHOLDERS[index] ??
		'https://source.unsplash.com/random/100x100/?portrait'
	)
}

function getMemberInitials(name?: string | null) {
	const parts = name?.trim().split(/\s+/).filter(Boolean) ?? []

	if (parts.length === 0) {
		return 'M'
	}

	return parts
		.slice(0, 2)
		.map((part) => part.charAt(0))
		.join('')
		.toUpperCase()
}

function MemberStackAvatar({
	member,
	index,
	total,
}: {
	member: GuildDetailMember
	index: number
	total: number
}) {
	const [imageFailed, setImageFailed] = useState(false)
	const avatarUrl = member.avatar_url ?? getSocialAvatarPlaceholder(index)
	const className = cn(
		'h-8 w-8 rounded-full border-2 border-background bg-muted shadow-sm',
		index > 0 && '-ml-2'
	)
	const style = { zIndex: total - index }

	if (!imageFailed && avatarUrl) {
		return (
			<img
				src={avatarUrl}
				alt={
					member.full_name ? `Avatar de ${member.full_name}` : 'Portrait de membre'
				}
				className={cn(className, 'object-cover')}
				style={style}
				onError={() => setImageFailed(true)}
			/>
		)
	}

	return (
		<div
			className={cn(
				className,
				'flex items-center justify-center text-[10px] font-bold text-white bg-white/10'
			)}
			style={style}
			aria-label={member.full_name ? `Avatar de ${member.full_name}` : 'Membre'}
		>
			{getMemberInitials(member.full_name)}
		</div>
	)
}

// ─── Mock System Feed ─────────────────────────────────────────────────────────

const getFeedMember = (
	members: GuildDetailMember[],
	index: number,
	fallbackName: string
) => {
	const member = members[index]

	return {
		userId: member?.user_id,
		name: member?.full_name || fallbackName,
		avatarUrl: member?.avatar_url ?? null,
	}
}

const buildFeed = (
	guildName: string,
	members: GuildDetailMember[]
): ImpactEvent[] => {
	const sarah = getFeedMember(members, 0, 'Sarah L.')
	const thomas = getFeedMember(members, 1, 'Thomas M.')
	const ecoGuerrier = getFeedMember(members, 2, 'ÉcoGuerrier')
	const marieClaire = getFeedMember(members, 3, 'Marie-Claire B.')
	const lucas = getFeedMember(members, 4, 'Lucas V.')

	return [
		{
			id: 'f1',
			...sarah,
			avatarColor: 'bg-purple-500/20 text-purple-400',
			time: 'Il y a 3 min',
			action: `👋 Vient de rejoindre ${guildName}`,
			actionHighlight: guildName,
			bravos: 4,
		},
		{
			id: 'f2',
			...thomas,
			avatarColor: 'bg-blue-500/20 text-blue-400',
			time: 'Il y a 18 min',
			action: `🌱 A fait gagner 150 pts à la tribu avec un don`,
			bravos: 11,
		},
		{
			id: 'f3',
			...ecoGuerrier,
			avatarColor: 'bg-lime-500/20 text-lime-400',
			time: 'Il y a 2 heures',
			action: `🏆 La tribu vient de franchir 50% de son objectif mensuel !`,
			bravos: 38,
		},
		{
			id: 'f4',
			...marieClaire,
			avatarColor: 'bg-rose-500/20 text-rose-400',
			time: 'Hier',
			action: `🦋 A débloqué une espèce grâce à la tribu`,
			bravos: 22,
		},
		{
			id: 'f5',
			...lucas,
			avatarColor: 'bg-emerald-500/20 text-emerald-400',
			time: 'Hier',
			action: `🌍 A soutenu un projet lié à la mission de la tribu`,
			bravos: 16,
		},
	]
}

// ─── Impact Feed Card ─────────────────────────────────────────────────────────

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

function ImpactEventAction({ event, text }: { event: ImpactEvent; text: string }) {
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

function ImpactEventCard({ event }: { event: ImpactEvent }) {
	const [bravo, setBravo] = useState(false)
	const handleBravo = useCallback(() => {
		navigator.vibrate?.(10)
		setBravo((p) => !p)
	}, [])
	const action = splitAction(event.action)

	return (
		<div className='border-b border-white/5 pb-4 mb-4 last:mb-0 last:border-0'>
			{event.userId ? (
				<Link
					href={`/profile/${event.userId}`}
					prefetch={false}
					className='inline-flex max-w-full items-center gap-3 active:opacity-50 transition-opacity'
				>
					{event.avatarUrl ? (
						<img
							src={event.avatarUrl}
							alt={`Avatar de ${event.name}`}
							className='h-8 w-8 shrink-0 rounded-full object-cover border border-white/10'
						/>
					) : (
						<div
							className={cn(
								'h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold border border-white/10',
								event.avatarColor
							)}
						>
							{event.name[0]}
						</div>
					)}
					<div className='flex items-center gap-1.5 min-w-0 flex-wrap'>
						<span className='font-bold text-white text-[15px] tracking-tight'>
							{event.name}
						</span>
						<span className='text-muted-foreground text-xs'>·</span>
						<span className='text-muted-foreground text-xs'>{event.time}</span>
					</div>
				</Link>
			) : (
				<div className='inline-flex max-w-full items-center gap-3'>
					<div
						className={cn(
							'h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold border border-white/10',
							event.avatarColor
						)}
					>
						{event.name[0]}
					</div>
					<div className='flex items-center gap-1.5 min-w-0 flex-wrap'>
						<span className='font-bold text-white text-[15px] tracking-tight'>
							{event.name}
						</span>
						<span className='text-muted-foreground text-xs'>·</span>
						<span className='text-muted-foreground text-xs'>{event.time}</span>
					</div>
				</div>
			)}
			<p className='ml-11 text-[15px] text-white/70 leading-snug mt-1 flex items-start gap-2'>
				{action.emoji && <span>{action.emoji}</span>}
				<span>
					<ImpactEventAction event={event} text={action.text} />
				</span>
			</p>
			<button
				onClick={handleBravo}
				className={cn(
					'ml-11 mt-3 flex items-center gap-1.5 text-xs font-semibold tracking-wide px-3 py-1.5 rounded-full transition-colors hover:bg-white/5',
					bravo ? 'text-lime-400' : 'text-muted-foreground hover:text-lime-400'
				)}
			>
				<Leaf className={cn('h-4 w-4', bravo && 'fill-lime-400')} />
				Bravo{' '}
				<span className='text-sm font-medium tabular-nums opacity-60 ml-1'>
					{event.bravos + (bravo ? 1 : 0)}
				</span>
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
	logoUrl,
	membersCount,
	isMember,
	activeMission,
	members,
}: GuildDetailClientProps) {
	const feed = buildFeed(guildName, members)

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
	const socialAvatarStack =
		avatarStack.length > 0
			? avatarStack
			: SOCIAL_AVATAR_PLACEHOLDERS.map((avatarUrl, index) => ({
					user_id: `placeholder-${index}`,
					full_name: null,
					avatar_url: avatarUrl,
				}))
	const guildAvatarUrl = logoUrl ?? GUILD_LOGO_PLACEHOLDER

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
						href='/community/guilds'
						className='inline-flex items-center gap-1.5 text-sm text-white/90 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10'
					>
						<ArrowLeft className='h-4 w-4' />
						Les Tribus
					</Link>
				</div>

				<div className='relative z-10 p-5 pb-6'>
					{/* Squircle Avatar */}
					<div className='h-14 w-14 rounded-2xl border border-white/20 mb-3 overflow-hidden shadow-lg shadow-black/30 bg-black/20'>
						<img
							src={guildAvatarUrl}
							alt={`Avatar de la tribu ${guildName}`}
							className='h-full w-full object-cover'
						/>
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
			<div className='mx-4 mt-4 rounded-3xl bg-gradient-to-br from-emerald-950/60 to-background border border-emerald-500/20 shadow-lg shadow-emerald-900/20 p-5'>
				{activeMission ? (
					<>
						<div className='flex items-center gap-2 mb-1'>
							<span className='text-lime-400 font-bold text-[11px] tracking-widest uppercase'>
								⚔️ MISSION D'AVRIL
							</span>
						</div>
						<p className='text-xl font-bold tracking-tight text-white mb-4'>
							La Forêt Vivante
						</p>

						{/* Jauge — progression à gauche, % à droite */}
						<div className='flex justify-between items-center mb-2'>
							<span className='tabular-nums text-sm font-medium text-white/75'>
								{activeMission.goal_current.toLocaleString()} /{' '}
								{activeMission.goal_target.toLocaleString()}{' '}
								{activeMission.goal_unit}
							</span>
							<span className='tabular-nums text-sm font-medium text-lime-400'>
								{missionPercent}%
							</span>
						</div>
						<div className='h-3 w-full bg-white/10 rounded-full overflow-hidden mb-2'>
							<div
								className='h-full bg-lime-500 rounded-full transition-all duration-700'
								style={{ width: `${missionPercent}%` }}
							/>
						</div>

						{/* Récompense — silhouette mystère */}
						<div className='flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2 mb-4 border border-white/10'>
							<div className='relative w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden'>
								<img
									src={BIODEX_REWARD_IMAGE_URL}
									alt='Récompense mystère'
									className='object-cover w-full h-full brightness-0 opacity-50'
								/>
								<Lock className='absolute right-1 bottom-1 w-3 h-3 text-white/40' />
							</div>
							<div>
								<p className='text-[11px] text-muted-foreground uppercase tracking-wider'>
									Récompense si mission accomplie
								</p>
								<p className='text-sm font-bold text-white'>
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
									🌱 Participer à l'effort collectif
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
			<div className='mx-4 mt-4'>
				<Link
					href={`/community/guilds/${guildSlug}/members`}
					prefetch={false}
					className='flex items-center w-full active:opacity-50 active:scale-[0.99] transition-all'
				>
					<div className='flex min-w-0 flex-1 items-center gap-3 px-1'>
						{/* Avatar stack */}
						{socialAvatarStack.length > 0 && (
							<div className='flex shrink-0'>
								{socialAvatarStack.map((member, i) => (
									<MemberStackAvatar
										key={member.user_id}
										member={member}
										index={i}
										total={socialAvatarStack.length}
									/>
								))}
							</div>
						)}
						<div className='flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground'>
							<Users className='h-4 w-4 shrink-0' />
							<span className='truncate'>
								<span className='font-bold text-foreground'>
									{membersCount.toLocaleString()}
								</span>{' '}
								membres actifs
							</span>
						</div>
					</div>
					<ChevronRight className='h-4 w-4 shrink-0 text-muted-foreground' />
				</Link>
			</div>

			{/* ── D. FLUX D'IMPACT LOCAL ───────────────────────────────── */}
			<div className='mx-4 mt-5 pb-28'>
				<h2 className='text-xl font-bold tracking-tight text-white mb-3'>
					Activité de la tribu
				</h2>
				<div>
					{feed.map((event) => (
						<ImpactEventCard key={event.id} event={event} />
					))}
				</div>
			</div>

			{/* ── CTA flottant Rejoindre — glassmorphism (non-membre uniquement) ── */}
			{!isMember && (
				<>
					<div
						className='fixed left-0 w-full p-4 border-t border-white/10 bg-background/55 backdrop-blur-lg z-40 md:hidden'
						style={{
							bottom: 'calc(4rem + env(safe-area-inset-bottom))',
						}}
					>
						<GuildMembershipButton
							guildId={guildId}
							isMember={false}
							className='w-full h-12 rounded-full bg-lime-500 text-black font-bold shadow-lg shadow-lime-500/15 [@media(hover:hover)]:hover:bg-lime-400'
						/>
					</div>
					<div className='fixed bottom-0 left-0 w-full p-4 border-t border-white/10 bg-background/55 backdrop-blur-lg z-40 hidden md:block'>
						<GuildMembershipButton
							guildId={guildId}
							isMember={false}
							className='w-full h-12 rounded-full bg-lime-500 text-black font-bold shadow-lg shadow-lime-500/15 [@media(hover:hover)]:hover:bg-lime-400'
						/>
					</div>
				</>
			)}
		</div>
	)
}
