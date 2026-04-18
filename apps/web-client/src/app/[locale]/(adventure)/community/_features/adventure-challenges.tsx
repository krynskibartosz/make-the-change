'use client'

import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState, type UIEvent } from 'react'
import { 
	BookOpen,
	CheckCircle2,
	ChevronRight,
	Lock,
	Sparkles,
	UsersRound,
	X,
	Sprout
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import { useHaptic } from '@/hooks/use-haptic'
import { useActionAuth } from '@/hooks/use-action-auth'
import { Link } from '@/i18n/navigation'
import { getFactionTheme, resolveFactionThemeKey, type FactionTheme } from '@/lib/faction-theme'
import { recordClientMockChallengeCompletion } from '@/lib/mock/mock-challenge-progress'
import type { MockChallengeDetail, MockMonthlyQuestOverview } from '@/lib/mock/mock-challenges'
import type { Faction } from '@/lib/mock/types'
import { cn } from '@/lib/utils'

type DailyQuest = MockChallengeDetail

type DailyQuestType = DailyQuest['type']

type QuestTheme = {
	icon: typeof BookOpen
	iconClassName: string
	progressClassName: string
}

const initialDailyQuests = [
	{
		id: 'legacy-eco-fact',
		type: 'education',
		title: "L'Éco-Fact du jour",
		description: "Lis l'article sur la déforestation.",
		progress: 0,
		max: 1,
		reward: 50,
	},
	{
		id: 'legacy-collective-bravo',
		type: 'social',
		title: "L'Esprit d'Équipe",
		description: 'Distribue 3 Bravos dans le Collectif.',
		progress: 1,
		max: 3,
		reward: 100,
		href: '/collectif',
	},
	{
		id: 'legacy-daily-harvest',
		type: 'daily_harvest',
		title: 'La Récolte Quotidienne',
		description: 'Récupère le nectar du jour.',
		progress: 0,
		max: 1,
		reward: 50,
	},
]

const questThemes: Record<DailyQuestType, QuestTheme> = {
	education: {
		icon: BookOpen,
		iconClassName: 'text-sky-200',
		progressClassName: 'bg-sky-300',
	},
	social: {
		icon: UsersRound,
		iconClassName: 'text-lime-300',
		progressClassName: 'bg-lime-400',
	},
	daily_harvest: {
		icon: Sparkles,
		iconClassName: 'text-amber-200',
		progressClassName: 'bg-amber-300',
	},
}

const EMPTY_MONTHLY_QUEST: MockMonthlyQuestOverview = {
	title: 'Cycle du mois',
	timeLeft: '0 jour restant',
	objective: 'Valide 20 jours de presence',
	progress: 0,
	max: 20,
	completedDays: 0,
	currentDayKey: '',
	monthKey: '',
}

const monthlyQuest = {
	title: "Quête d'Avril",
	timeLeft: '22 JOURS RESTANTS',
	objective: 'Valide 20 jours de Série',
	progress: 8,
	max: 20,
}

const FACTION_CONTENT = {
	pollinisateurs: {
		title: "Quête de l'Essaim",
		mascotImg: '/abeille-transparente.png',
	},
	forets: {
		title: 'Quête de la Forêt',
		mascotImg: '/sylva.png',
	},
	artisans: {
		title: 'Quête du Terroir',
		mascotImg: '/aura.png',
	},
} as const

type EcoFactReaderProps = {
	accentTheme: FactionTheme
	challenge: DailyQuest | null
	open: boolean
	onValidate: () => void
	onClose: () => void
}

type EcoFactArticleViewProps = {
	accentTheme: FactionTheme
	challenge: DailyQuest | null
	open: boolean
	onClose: () => void
}

function EcoFactArticleView({ accentTheme, challenge, open, onClose }: EcoFactArticleViewProps) {
	const articleTitle = challenge?.metadata.articleTitle || challenge?.title || "L'Eco-Fact du jour"
	const articleSummary =
		challenge?.metadata.articleSummary ||
		'Un geste simple peut renforcer le vivant quand il s inscrit dans une boucle quotidienne.'
	const articleBody = challenge?.metadata.articleBody ?? []
	const articleFacts = [
		challenge?.metadata.hint,
		challenge?.metadata.articleSummary,
		challenge?.metadata.nextStep,
	].filter((value): value is string => Boolean(value))
	const articleTagline = challenge?.metadata.themeLabel || 'Observation du jour'
	const articleCtaHref = challenge?.metadata.ctaHref || '/projects'
	const articleCtaLabel = challenge?.metadata.ctaLabel || 'Continuer vers les projets'
	const articleBadge = challenge?.rewardBadge || 'Rituel quotidien'
	const articleQuote =
		articleBody[1] ||
		articleSummary
	const articleParagraphs =
		articleBody.length > 0
			? articleBody
			: [
				articleSummary,
				challenge?.description || 'Chaque observation quotidienne renforce ta comprehension du vivant.',
				challenge?.metadata.nextStep || 'Reviens demain pour poursuivre ta serie.',
			]

	return (
		<AnimatePresence>
			{open ? (
				<motion.div
					initial={{ y: '100%' }}
					animate={{ y: 0 }}
					exit={{ y: '100%' }}
					transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
					className='fixed inset-0 z-[95] overflow-y-auto bg-[#0B0F15]'
					onClick={(event) => event.stopPropagation()}
				>
					<div className='relative h-72 w-full'>
						<img
							src='https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=80'
							alt={articleTagline}
							className='h-full w-full object-cover'
						/>
						<div className='absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/40 to-transparent' />
						<button
							type='button'
							onClick={(event) => {
								event.stopPropagation()
								onClose()
							}}
							className='absolute left-5 top-6 z-20 rounded-full bg-black/50 p-2 backdrop-blur-md'
							aria-label='Fermer l article'
						>
							<X className='h-5 w-5 text-white' />
						</button>
					</div>

					<div className='px-6 pt-8'>
						<div className='flex flex-wrap items-center gap-2'>
							<span className={cn('rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]', accentTheme.accentBorder, accentTheme.accentText)}>
								{articleTagline}
							</span>
							<span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/55'>
								{articleBadge}
							</span>
						</div>
						<h1 className='mb-6 mt-5 text-3xl font-black leading-[1.05] tracking-tight text-white'>
							{articleTitle}
						</h1>
					</div>

					<div
						className={cn(
							'mx-6 mb-8 rounded-2xl border p-5',
							accentTheme.accentBgSoft,
							accentTheme.accentBorder
						)}
					>
						<h3 className={cn('mb-3 text-[10px] font-bold uppercase tracking-widest', accentTheme.accentText)}>
							En bref
						</h3>
						<ul className='space-y-3 text-sm text-white/80'>
							{articleFacts.map((fact) => (
								<li key={fact} className='flex items-start gap-3'>
									<span className='mt-1 text-lg leading-none text-lime-400'>•</span>
									<span className='flex-1'>{fact}</span>
								</li>
							))}
						</ul>
					</div>

					<div className='space-y-6 px-6 pb-24'>
						{articleParagraphs.slice(0, 2).map((paragraph) => (
							<p key={paragraph} className='text-[17px] leading-relaxed text-white/80'>
								{paragraph}
							</p>
						))}
					</div>

					<div className='my-10 px-6'>
						<img
							src='https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=1200&q=80'
							alt={articleTagline}
							className='h-48 w-full rounded-2xl object-cover opacity-90'
						/>
					</div>

					<div className='space-y-6 px-6 pb-24'>
						{articleParagraphs.slice(2).map((paragraph) => (
							<p key={paragraph} className='text-[17px] leading-relaxed text-white/80'>
								{paragraph}
							</p>
						))}
						<blockquote className={cn('my-12 border-l-4 py-2 pl-6', accentTheme.accentBorder)}>
							<p className='text-2xl font-medium italic leading-snug text-white'>
								&quot;{articleQuote}&quot;
							</p>
						</blockquote>
					</div>

					<div
						className={cn(
							'mx-6 mb-12 mt-16 rounded-3xl border p-6 text-center',
							accentTheme.accentBgSoft,
							accentTheme.accentBorder
						)}
					>
						<h3 className={cn('mb-2 text-xl font-black', accentTheme.accentText)}>
							Passe a l action
						</h3>
						<p className='mb-4 text-sm text-white/70'>{articleSummary}</p>
						<Link
							href={articleCtaHref}
							onClick={onClose}
							className={cn(
								'inline-flex w-full items-center justify-center rounded-full px-6 py-3 font-bold text-black',
								accentTheme.accentBg
							)}
						>
							{articleCtaLabel}
						</Link>
					</div>

					<div className='pb-40' />
				</motion.div>
			) : null}
		</AnimatePresence>
	)

	return (
		<AnimatePresence>
			{open ? (
				<motion.div
					initial={{ y: '100%' }}
					animate={{ y: 0 }}
					exit={{ y: '100%' }}
					transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
					className='fixed inset-0 z-[95] overflow-y-auto bg-[#0B0F15]'
					onClick={(event) => event.stopPropagation()}
				>
					<div className='relative w-full h-72'>
						<img
							src='https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=80'
							alt='Forêt amazonienne'
							className='h-full w-full object-cover'
						/>
						<div className='absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/40 to-transparent' />
						<button
							type='button'
							onClick={(event) => {
								event.stopPropagation()
								onClose()
							}}
							className='absolute top-6 left-5 z-20 rounded-full bg-black/50 p-2 backdrop-blur-md'
							aria-label='Fermer l’article'
						>
							<X className='h-5 w-5 text-white' />
						</button>
					</div>

					<h1 className='text-3xl font-black text-white px-6 mt-8 mb-6 leading-[1.05] tracking-tight'>
						{articleTitle}
					</h1>

					<div
						className={cn(
							'mx-6 rounded-2xl p-5 mt-6 mb-8 border',
							accentTheme.accentBgSoft,
							accentTheme.accentBorder
						)}
					>
						<h3 className={cn('font-bold mb-3 uppercase tracking-widest text-[10px]', accentTheme.accentText)}>
							En bref
						</h3>
						<ul className='space-y-3 text-sm text-white/80'>
							<li className='flex items-start gap-3'>
								<span className='text-lime-400 text-lg leading-none mt-1'>•</span>
								<span className='flex-1'>Régulateur vital du climat mondial.</span>
							</li>
							<li className='flex items-start gap-3'>
								<span className='text-lime-400 text-lg leading-none mt-1'>•</span>
								<span className='flex-1'>
									Habitat de milliers d&apos;espèces menacées.
								</span>
							</li>
							<li className='flex items-start gap-3'>
								<span className='text-lime-400 text-lg leading-none mt-1'>•</span>
								<span className='flex-1'>
									Votre impact aide à restaurer cet équilibre.
								</span>
							</li>
						</ul>
					</div>

					<div className='px-6 space-y-6 pb-24'>
						<p className='text-white/80 text-[17px] leading-relaxed'>
							La forêt amazonienne couvre près de{' '}
							<strong className='text-white'>5,5 millions de km²</strong> et agit
							comme un immense régulateur climatique. Son équilibre hydrique
							alimente des rivières atmosphériques qui influencent les pluies sur
							tout un continent.
						</p>
						<p className='text-white/80 text-[17px] leading-relaxed'>
							Quand les forêts sont fragmentées, les pollinisateurs disparaissent
							et les{' '}
							<strong className='text-white'>cycles de pluie se dérèglent</strong>
							. À terme, cette rupture fragilise la biodiversité locale et les
							populations humaines qui dépendent des services écologiques.
						</p>
					</div>

					<div className='my-10 px-6'>
						<img
							src='https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=1200&q=80'
							alt='Détail Amazonie'
							className='w-full h-48 object-cover rounded-2xl opacity-90'
						/>
					</div>

					<div className='px-6 space-y-6 pb-24'>
						<p className='text-white/80 text-[17px] leading-relaxed'>
							Chaque action de préservation contribue à ralentir cette bascule.
							Reboiser, restaurer des corridors écologiques et soutenir une
							apiculture durable sont des leviers concrets pour préserver le
							vivant.
						</p>

						<blockquote className={cn('border-l-4 pl-6 my-12 py-2', accentTheme.accentBorder)}>
							<p className='italic text-2xl font-medium text-white leading-snug'>
								&quot;Chaque minute, l&apos;équivalent de 30 terrains de football
								disparaît.&quot;
							</p>
						</blockquote>
					</div>

					<div
						className={cn(
							'mx-6 mt-16 mb-12 p-6 rounded-3xl text-center border',
							accentTheme.accentBgSoft,
							accentTheme.accentBorder
						)}
					>
						<h3 className={cn('font-black text-xl mb-2', accentTheme.accentText)}>
							Passez à l&apos;action
						</h3>
						<p className='text-white/70 text-sm mb-4'>
							Soutenez un projet de reforestation dès aujourd&apos;hui.
						</p>
						<Link
							href='/projects'
							onClick={onClose}
							className={cn(
								'text-black font-bold px-6 py-3 rounded-full w-full inline-flex items-center justify-center',
								accentTheme.accentBg
							)}
						>
							Découvrir les projets
						</Link>
					</div>

					<div className='pb-40' />
				</motion.div>
			) : null}
		</AnimatePresence>
	)
}

function EcoFactReader({ accentTheme, challenge, open, onValidate, onClose }: EcoFactReaderProps) {
	const haptic = useHaptic()
	const [isArticleOpen, setIsArticleOpen] = useState(false)
	const [scrollProgress, setScrollProgress] = useState(0)
	const [isUnlocked, setIsUnlocked] = useState(false)
	const contentRef = useRef<HTMLDivElement | null>(null)
	const articleTitle = challenge?.metadata.articleTitle || challenge?.title || "L'Eco-Fact du jour"
	const articleSummary = challenge?.metadata.articleSummary || challenge?.description || 'Une lecture courte pour comprendre l impact du jour.'
	const challengeLabel = challenge?.metadata.themeLabel || 'Observation du jour'
	const challengeBadge = challenge?.rewardBadge || 'Rituel quotidien'
	const challengeNumber = challenge?.dayKey ? challenge.dayKey.slice(-2) : '01'
	const questMeta = [
		challengeLabel,
		challenge?.metadata.linkedSpeciesId ? 'Biodex' : null,
		challenge?.metadata.linkedProjectSlug ? 'Projet terrain' : null,
	].filter((value): value is string => Boolean(value))

	useEffect(() => {
		if (!open) return
		setIsArticleOpen(false)
		setScrollProgress(0)
		setIsUnlocked(false)
	}, [open])

	const handleScroll = useCallback(
		(event: UIEvent<HTMLDivElement>) => {
			const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
			const maxScrollable = scrollHeight - clientHeight

			if (maxScrollable <= 0) {
				setScrollProgress(0)
				return
			}

			const scrollPercentage = (scrollTop / maxScrollable) * 100
			const clampedProgress = Math.min(100, Math.max(0, scrollPercentage))
			setScrollProgress(clampedProgress)

			if (clampedProgress >= 90 && !isUnlocked) {
				setIsUnlocked(true)
				haptic.mediumTap()
			}
		},
		[haptic, isUnlocked]
	)

	useEffect(() => {
		if (!open) return

		const checkScrollable = () => {
			const element = contentRef.current
			if (!element) return

			const maxScrollable = element.scrollHeight - element.clientHeight
			if (maxScrollable <= 0) {
				if (!isUnlocked) {
					setIsUnlocked(true)
				}
				setScrollProgress(100)
				return
			}

			const progress = (element.scrollTop / maxScrollable) * 100
			setScrollProgress(Math.min(100, Math.max(0, progress)))
		}

		const rafId = window.requestAnimationFrame(() => {
			window.requestAnimationFrame(checkScrollable)
		})
		const timeoutId = window.setTimeout(checkScrollable, 350)
		window.addEventListener('resize', checkScrollable)

		return () => {
			window.cancelAnimationFrame(rafId)
			window.clearTimeout(timeoutId)
			window.removeEventListener('resize', checkScrollable)
		}
	}, [isUnlocked, open])

	const openArticle = (event: { stopPropagation: () => void }) => {
		event.stopPropagation()
		haptic.mediumTap()
		setIsArticleOpen(true)
	}

	return (
		<AnimatePresence>
			{open ? (
				<motion.div
					initial={{ y: '100%' }}
					animate={{ y: 0 }}
					exit={{ y: '100%' }}
					transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
					className='fixed inset-0 z-[80] flex flex-col overflow-hidden bg-[#0B0F15]'
				>
					<button
						type='button'
						aria-label='Fermer'
						onClick={(event) => {
							event.stopPropagation()
							onClose()
						}}
						className='absolute right-6 top-6 z-50 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-colors hover:text-white'
					>
						<X className='h-4 w-4' />
					</button>

					<div
						ref={contentRef}
						onScroll={handleScroll}
						className='relative flex-1 overflow-y-auto pb-44'
					>
						<div className='relative isolate min-h-[46vh] px-6 pt-6'>
							<div className='pointer-events-none absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-yellow-500/20 blur-[80px]' />
							<motion.img
								src='/images/logo-icon-bee.png'
								alt={challengeLabel}
								initial={{ opacity: 0, scale: 0.85, y: 18 }}
								animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
								transition={{
									opacity: { duration: 0.35, delay: 0.15 },
									scale: { duration: 0.35, delay: 0.15 },
									y: {
										duration: 4,
										repeat: Number.POSITIVE_INFINITY,
										repeatType: 'mirror',
										ease: 'easeInOut',
										delay: 0.55,
									},
								}}
								className='relative z-10 mx-auto mt-16 h-56 w-56 object-contain drop-shadow-2xl'
							/>
							<motion.div
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: 0.25 }}
								className='mb-2 mt-6 px-6'
							>
								<div className='flex flex-wrap gap-2'>
									<span className='inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50'>
										Eco-Fact #{challengeNumber}
									</span>
									<span className={cn('inline-block rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]', accentTheme.accentBorder, accentTheme.accentText)}>
										{challengeLabel}
									</span>
								</div>
							</motion.div>
						</div>

						<motion.div
							initial='hidden'
							animate='show'
							variants={{
								hidden: {},
								show: {
									transition: {
										staggerChildren: 0.12,
										delayChildren: 0.35,
									},
								},
							}}
							className='mt-8 flex flex-col'
						>
							<motion.h1
								variants={{
									hidden: { opacity: 0, y: 14 },
									show: { opacity: 1, y: 0 },
								}}
								className='text-balance px-6 text-3xl font-black leading-tight tracking-tight text-white md:text-4xl'
							>
								{articleTitle}
							</motion.h1>

							<motion.div
								variants={{
									hidden: { opacity: 0, y: 14 },
									show: { opacity: 1, y: 0 },
								}}
								className='mb-8 mt-4 flex flex-wrap gap-2 px-6'
							>
								{questMeta.map((meta) => (
									<span
										key={meta}
										className='rounded-full border border-lime-400/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-lime-400'
									>
										{meta}
									</span>
								))}
							</motion.div>

							<motion.div
								variants={{
									hidden: { opacity: 0, y: 14 },
									show: { opacity: 1, y: 0 },
								}}
								className='grid grid-cols-2 gap-3 px-6'
							>
								<div className='col-span-2 flex items-center gap-5 rounded-2xl border border-white/10 bg-white/5 p-6'>
									<div className='flex shrink-0 items-baseline text-lime-400'>
										<span className='text-6xl font-black leading-none tracking-tighter'>
											{challenge?.reward ?? 50}
										</span>
										<span className='ml-1 text-xs font-medium uppercase tracking-[0.22em] opacity-70'>
											graines
										</span>
									</div>
									<p className='text-[13px] leading-relaxed text-white/70'>{articleSummary}</p>
								</div>

								<div className='col-span-1 flex flex-col justify-center rounded-2xl border border-white/10 bg-white/5 p-4'>
									<span className='mb-1 text-[10px] font-bold uppercase tracking-widest text-white/40'>
										Progression
									</span>
									<div className='flex items-baseline gap-1'>
										<span className='text-2xl font-black tracking-tight text-white'>
											{challenge?.progress ?? 0}
										</span>
										<span className='text-xs font-medium text-white/60'>/ {challenge?.max ?? 1}</span>
									</div>
								</div>

								<div className='col-span-1 flex flex-col justify-center rounded-2xl border border-white/10 bg-white/5 p-4'>
									<span className='mb-1 text-[10px] font-bold uppercase tracking-widest text-white/40'>
										Badge
									</span>
									<span className='line-clamp-2 text-sm font-black leading-tight text-white'>
										{challengeBadge}
									</span>
								</div>
							</motion.div>

							<div className='flex justify-center px-5'>
								<button
									type='button'
									onClick={openArticle}
									className='mx-auto mb-32 mt-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 transition-all hover:bg-white/10 active:bg-white/15'
								>
									<BookOpen className='h-4 w-4 text-lime-400' />
									<span className='text-sm font-bold text-white'>Explorer le dossier complet</span>
									<ChevronRight className='h-4 w-4 text-white/30' />
								</button>
							</div>
						</motion.div>
					</div>

					<div className='absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/95 to-transparent px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-12'>
						<div className='mb-4 h-1 w-full overflow-hidden rounded-full bg-white/10'>
							<div
								className={cn('h-full transition-all duration-100 ease-out', accentTheme.accentBg)}
								style={{ width: `${isUnlocked ? 100 : scrollProgress}%` }}
							/>
						</div>

						<button
							type='button'
							disabled={!isUnlocked}
							onClick={(event) => {
								event.stopPropagation()
								if (!isUnlocked) return
								onValidate()
							}}
							className={cn(
								'flex h-14 w-full items-center justify-center rounded-2xl text-lg font-black transition-all duration-500',
								isUnlocked
									? cn(accentTheme.accentBg, 'text-[#0B0F15] active:scale-95', accentTheme.accentShadow)
									: 'border border-white/10 bg-white/5 text-white/40'
							)}
						>
							{isUnlocked ? (
								<span className='flex items-center gap-2 animate-in zoom-in duration-300'>
									C est note ! <span className='font-normal opacity-50'>|</span> +50{' '}
									<Sprout className='inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400' />
								</span>
							) : (
								<span className='flex items-center gap-2'>
									<Lock className='h-4 w-4' /> Faites defiler pour debloquer
								</span>
							)}
						</button>
					</div>

					<EcoFactArticleView
						accentTheme={accentTheme}
						challenge={challenge}
						open={isArticleOpen}
						onClose={() => setIsArticleOpen(false)}
					/>
				</motion.div>
			) : null}
		</AnimatePresence>
	)

	return (
		<AnimatePresence>
			{open ? (
				<motion.div
					initial={{ y: '100%' }}
					animate={{ y: 0 }}
					exit={{ y: '100%' }}
					transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
					className='fixed inset-0 z-[80] flex flex-col overflow-hidden bg-[#0B0F15]'
				>
					<button
						type='button'
						aria-label='Fermer'
						onClick={(event) => {
							event.stopPropagation()
							onClose()
						}}
						className='absolute right-6 top-6 z-50 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-colors hover:text-white'
					>
						<X className='h-4 w-4' />
					</button>

					<div
						ref={contentRef}
						onScroll={handleScroll}
						className='relative flex-1 overflow-y-auto pb-44'
					>
						<div className='relative isolate min-h-[46vh] px-6 pt-6'>
							<div className='pointer-events-none absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-yellow-500/20 blur-[80px]' />
							<motion.img
								src='/images/logo-icon-bee.png'
								alt='Le saviez-vous ?'
								initial={{ opacity: 0, scale: 0.85, y: 18 }}
								animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
								transition={{
									opacity: { duration: 0.35, delay: 0.15 },
									scale: { duration: 0.35, delay: 0.15 },
									y: {
										duration: 4,
										repeat: Number.POSITIVE_INFINITY,
										repeatType: 'mirror',
										ease: 'easeInOut',
										delay: 0.55,
									},
								}}
								className='relative z-10 mx-auto mt-16 h-56 w-56 object-contain drop-shadow-2xl'
							/>
							<motion.div
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: 0.25 }}
								className='px-6 mt-6 mb-2'
							>
								<span className='inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/50 tracking-[0.2em] uppercase font-bold'>
									Éco-Fact #001
								</span>
							</motion.div>
						</div>

						<motion.div
							initial='hidden'
							animate='show'
							variants={{
								hidden: {},
								show: {
									transition: {
										staggerChildren: 0.12,
										delayChildren: 0.35,
									},
								},
							}}
							className='mt-8 flex flex-col'
						>
							<motion.h1
								variants={{
									hidden: { opacity: 0, y: 14 },
									show: { opacity: 1, y: 0 },
								}}
								className='text-3xl md:text-4xl font-black text-white px-6 mb-4 leading-tight text-balance tracking-tight'
							>
								Le Poumon Vert de la planète
							</motion.h1>

							<motion.div
								variants={{
									hidden: { opacity: 0, y: 14 },
									show: { opacity: 1, y: 0 },
								}}
								className='px-6 flex flex-wrap gap-2 mb-8'
							>
								<span className='px-3 py-1 rounded-full border border-lime-400/30 text-lime-400 text-[10px] font-bold uppercase tracking-widest'>
									Amazonie
								</span>
								<span className='px-3 py-1 rounded-full border border-lime-400/30 text-lime-400 text-[10px] font-bold uppercase tracking-widest'>
									Biodiversité
								</span>
								<span className='px-3 py-1 rounded-full border border-lime-400/30 text-lime-400 text-[10px] font-bold uppercase tracking-widest'>
									Déforestation
								</span>
							</motion.div>

							<motion.div
								variants={{
									hidden: { opacity: 0, y: 14 },
									show: { opacity: 1, y: 0 },
								}}
								className='px-6 grid grid-cols-2 gap-3'
							>
								<div className='col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-5'>
									<div className='flex items-baseline text-lime-400 shrink-0'>
										<span className='text-6xl font-black tracking-tighter leading-none'>20</span>
										<span className='text-3xl font-bold ml-0.5 opacity-80 leading-none'>%</span>
									</div>
									<p className='text-[13px] text-white/70 leading-relaxed'>
										De la biodiversité mondiale est abritée par la forêt amazonienne.
										Sa déforestation menace des milliers d&apos;espèces.
									</p>
								</div>

								<div className='col-span-1 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center'>
									<span className='text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1'>
										Surface
									</span>
									<div className='flex items-baseline gap-1'>
										<span className='text-white font-black text-2xl tracking-tight'>5,5</span>
										<span className='text-white/60 font-medium text-xs'>M km²</span>
									</div>
								</div>

								<div className='col-span-1 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center'>
									<span className='text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1'>
										Déforestation
									</span>
									<div className='flex flex-col'>
										<span className='text-white font-black text-2xl tracking-tight leading-none'>
											30
										</span>
										<span className='text-white/60 font-medium text-xs mt-0.5'>
											terrains / min
										</span>
									</div>
								</div>
							</motion.div>

							<div className='px-5 flex justify-center'>
								<button
									type='button'
									onClick={openArticle}
									className='mt-6 mb-32 mx-auto flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 rounded-full transition-all'
								>
									<BookOpen className='w-4 h-4 text-lime-400' />
									<span className='text-sm font-bold text-white'>
										Explorer le dossier complet (3 min)
									</span>
									<ChevronRight className='w-4 h-4 text-white/30' />
								</button>
							</div>
						</motion.div>
					</div>

					<div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/95 to-transparent pt-12 pb-[max(1.5rem,env(safe-area-inset-bottom))] px-5 z-40'>
						<div className='w-full h-1 bg-white/10 rounded-full mb-4 overflow-hidden'>
							<div
								className={cn('h-full transition-all duration-100 ease-out', accentTheme.accentBg)}
								style={{ width: `${isUnlocked ? 100 : scrollProgress}%` }}
							/>
						</div>

						<button
							type='button'
							disabled={!isUnlocked}
							onClick={(event) => {
								event.stopPropagation()
								if (!isUnlocked) return
								onValidate()
							}}
							className={cn(
								'w-full h-14 rounded-2xl font-black text-lg flex items-center justify-center transition-all duration-500',
								isUnlocked
									? cn(accentTheme.accentBg, 'text-[#0B0F15] active:scale-95', accentTheme.accentShadow)
									: 'bg-white/5 text-white/40 border border-white/10'
							)}
						>
							{isUnlocked ? (
								<span className='flex items-center gap-2 animate-in zoom-in duration-300'>
									C&apos;est noté !{' '}
									<span className='opacity-50 font-normal'>|</span> +50 <Sprout className="inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400" />
								</span>
							) : (
								<span className='flex items-center gap-2'>
									<Lock className='w-4 h-4' /> Faites défiler pour débloquer
								</span>
							)}
						</button>
					</div>

					<EcoFactArticleView
						accentTheme={accentTheme}
						challenge={challenge}
						open={isArticleOpen}
						onClose={() => setIsArticleOpen(false)}
					/>
				</motion.div>
			) : null}
		</AnimatePresence>
	)
}
type DailyHarvestModalProps = {
	accentTheme: FactionTheme
	open: boolean
	onClose: () => void
	onClaim: () => void
}

function DailyHarvestModal({ accentTheme, open, onClose, onClaim }: DailyHarvestModalProps) {
	const [phase, setPhase] = useState<'idle' | 'charging' | 'exploding' | 'revealed'>('idle')
	const [progress, setProgress] = useState(0)
	const [animatedReward, setAnimatedReward] = useState(0)
	const [isCounterDone, setIsCounterDone] = useState(false)
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
	const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const counterFrameRef = useRef<number | null>(null)
	const progressRef = useRef(0)

	const vibrate = useCallback((pattern: number | number[]) => {
		if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return
		try {
			navigator.vibrate(pattern)
		} catch {
			// no-op: vibration can be blocked by browser/device
		}
	}, [])

	const clearTimers = useCallback(() => {
		if (timerRef.current) {
			clearInterval(timerRef.current)
			timerRef.current = null
		}
		if (revealTimeoutRef.current) {
			clearTimeout(revealTimeoutRef.current)
			revealTimeoutRef.current = null
		}
		if (counterFrameRef.current !== null) {
			cancelAnimationFrame(counterFrameRef.current)
			counterFrameRef.current = null
		}
	}, [])

	const resetModalState = useCallback(() => {
		clearTimers()
		progressRef.current = 0
		setProgress(0)
		setAnimatedReward(0)
		setIsCounterDone(false)
		setPhase('idle')
	}, [clearTimers])

	useEffect(() => {
		if (open) {
			resetModalState()
		} else {
			clearTimers()
		}

		return () => {
			clearTimers()
		}
	}, [open, clearTimers, resetModalState])

	useEffect(() => {
		if (phase !== 'revealed') return

		const target = 50
		const duration = 800
		let startTimestamp: number | null = null

		setAnimatedReward(0)
		setIsCounterDone(false)

		const step = (timestamp: number) => {
			if (startTimestamp === null) {
				startTimestamp = timestamp
			}
			const progressRatio = Math.min((timestamp - startTimestamp) / duration, 1)
			const easeOut =
				progressRatio === 1 ? 1 : 1 - Math.pow(2, -10 * progressRatio)
			const nextCount = Math.floor(easeOut * target)
			setAnimatedReward(nextCount)

			if (progressRatio < 1) {
				counterFrameRef.current = window.requestAnimationFrame(step)
				return
			}

			setAnimatedReward(target)
			setIsCounterDone(true)
			counterFrameRef.current = null
		}

		counterFrameRef.current = window.requestAnimationFrame(step)

		return () => {
			if (counterFrameRef.current !== null) {
				cancelAnimationFrame(counterFrameRef.current)
				counterFrameRef.current = null
			}
		}
	}, [phase])

	const startCharging = useCallback(() => {
		if (phase === 'exploding' || phase === 'revealed') return
		if (timerRef.current) return

		setPhase('charging')
		timerRef.current = setInterval(() => {
			vibrate(15)
			const nextProgress = Math.min(progressRef.current + 2, 100)
			progressRef.current = nextProgress
			setProgress(nextProgress)

			if (nextProgress >= 100) {
				clearTimers()
				setPhase('exploding')
				vibrate([50, 100, 150])

				revealTimeoutRef.current = setTimeout(() => {
					setPhase('revealed')
				}, 500)
			}
		}, 30)
	}, [phase, clearTimers, vibrate])

	const stopCharging = useCallback(() => {
		if (phase !== 'charging') return
		clearTimers()

		if (progressRef.current < 100) {
			progressRef.current = 0
			setProgress(0)
			setPhase('idle')
		}
	}, [phase, clearTimers])

	const handleClose = useCallback(() => {
		resetModalState()
		onClose()
	}, [onClose, resetModalState])

	const handleClaim = useCallback(() => {
		onClaim()
		resetModalState()
	}, [onClaim, resetModalState])

	return (
		<AnimatePresence>
			{open ? (
				<motion.div
					initial={{ y: '100%' }}
					animate={{ y: 0 }}
					exit={{ y: '100%' }}
					transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
					className='fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#0B0F15]/95 backdrop-blur-md'
				>
					<button
						type='button'
						aria-label='Fermer'
						onClick={handleClose}
						className='absolute top-6 right-6 z-50 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-colors hover:text-white'
					>
						<X className='h-4 w-4' />
					</button>

					<div className='pointer-events-none absolute top-1/4 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-yellow-500/20 blur-[80px]' />

					{phase === 'idle' || phase === 'charging' ? (
						<div className='relative z-10 flex flex-col items-center'>
							<div
								className='relative cursor-pointer select-none touch-none'
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
								onTouchMove={(event) => {
									event.preventDefault()
								}}
								onContextMenu={(event) => {
									event.preventDefault()
								}}
								role='button'
								aria-label='Maintenir pour récolter'
								tabIndex={0}
								style={{
									WebkitTouchCallout: 'none',
									WebkitUserSelect: 'none',
									WebkitTapHighlightColor: 'transparent',
									userSelect: 'none',
								}}
								onKeyDown={(event) => {
									if (event.key === 'Enter' || event.key === ' ') {
										event.preventDefault()
										startCharging()
									}
								}}
								onKeyUp={(event) => {
									if (event.key === 'Enter' || event.key === ' ') {
										event.preventDefault()
										stopCharging()
									}
								}}
							>
								<img
									src='/images/logo-icon-bee.png'
									alt='Mascotte'
									draggable='false'
									onDragStart={(event) => event.preventDefault()}
									className={cn(
										'h-48 w-48 select-none object-contain drop-shadow-2xl transition-transform duration-75 pointer-events-none',
										phase === 'charging'
											? 'scale-110 animate-[loot-shake_0.2s_ease-in-out_infinite]'
											: 'animate-pulse'
									)}
									style={{
										WebkitTouchCallout: 'none',
										WebkitUserSelect: 'none',
										userSelect: 'none',
									}}
								/>
							</div>

							<p className='mt-8 animate-pulse text-sm font-bold uppercase tracking-widest text-white/50'>
								Maintenez pour récolter
							</p>
							<div className='mt-4 h-2 w-48 overflow-hidden rounded-full bg-white/10'>
								<div
									className={cn('h-full transition-all duration-75 ease-linear', accentTheme.accentBg)}
									style={{ width: `${progress}%` }}
								/>
							</div>
						</div>
					) : null}

					{phase === 'exploding' ? (
						<div className='absolute inset-0 z-50 bg-white animate-[loot-fade-out_0.5s_ease-out_forwards]' />
					) : null}

					{phase === 'revealed' ? (
						<div className='animate-in zoom-in slide-in-from-bottom-10 duration-700 z-10 flex flex-col items-center'>
							<h2 className={cn('mb-2 text-sm font-bold uppercase tracking-widest', accentTheme.accentText)}>
								Récompense Quotidienne
							</h2>
							<div className='relative mb-4'>
								<div className='pointer-events-none absolute inset-0 -z-10 flex items-center justify-center'>
									<div className={cn('h-64 w-64 rounded-full blur-2xl animate-[spin_4s_linear_infinite]', accentTheme.accentGlow)} />
								</div>
								<div className={cn('text-7xl font-black animate-[loot-spring-pop_0.6s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]', accentTheme.accentText, accentTheme.accentShadow)}>
									+ {animatedReward} <Sprout className="inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400" />
								</div>
							</div>
							<p
								className={cn(
									'max-w-[250px] text-center text-white/60',
									isCounterDone
										? 'animate-in fade-in duration-500 [animation-delay:700ms] [animation-fill-mode:backwards]'
										: 'opacity-0'
								)}
							>
								Ton abeille a travaillé toute la nuit. Reviens demain !
							</p>
							<button
								type='button'
								onClick={handleClaim}
								className={cn(
									'mt-12 h-14 rounded-2xl bg-white px-8 font-bold text-black transition-transform active:scale-95',
									isCounterDone
										? 'animate-in fade-in duration-500 [animation-delay:700ms] [animation-fill-mode:backwards]'
										: 'opacity-0 pointer-events-none'
								)}
							>
								Génial !
							</button>
						</div>
					) : null}

					<style jsx global>{`
						@keyframes loot-shake {
							0% { transform: translateX(0) rotate(0deg); }
							25% { transform: translateX(-2px) rotate(-1.2deg); }
							50% { transform: translateX(2px) rotate(1.1deg); }
							75% { transform: translateX(-1px) rotate(-0.8deg); }
							100% { transform: translateX(0) rotate(0deg); }
						}

						@keyframes loot-fade-out {
							0% { opacity: 1; }
							100% { opacity: 0; }
						}

						@keyframes loot-spring-pop {
							0% { transform: scale(0.5); opacity: 0; }
							80% { transform: scale(1.1); opacity: 1; }
							100% { transform: scale(1); opacity: 1; }
						}
					`}</style>
				</motion.div>
			) : null}
		</AnimatePresence>
	)
}

type AdventureChallengesProps = {
	initialFaction?: Faction | null
	viewerId?: string | null
	initialDayKey?: string | null
	initialDayLabel?: string
	initialDailyQuests?: DailyQuest[]
	initialMonthlyQuest?: MockMonthlyQuestOverview | null
}

export function AdventureChallenges({
	initialFaction = null,
	viewerId = null,
	initialDayKey = null,
	initialDayLabel = 'aujourd hui',
	initialDailyQuests = [],
	initialMonthlyQuest = null,
}: AdventureChallengesProps) {
	const haptic = useHaptic()
	const searchParams = useSearchParams()
	const { guardAction } = useActionAuth()

	const themeKey = resolveFactionThemeKey(initialFaction)
	const contentKey = themeKey === 'neutral' ? 'forets' : themeKey
	const accentTheme = getFactionTheme(initialFaction)
	const factionTheme = {
		...FACTION_CONTENT[contentKey],
		accentBg: accentTheme.accentBg,
		accentText: accentTheme.accentText,
		badgeBg: accentTheme.badgeClassName,
		bgGradient: accentTheme.heroGradient,
	}
	const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>(() => initialDailyQuests)
	const [monthlyQuestState, setMonthlyQuestState] = useState<MockMonthlyQuestOverview | null>(
		() => initialMonthlyQuest
	)
	const activeMonthlyQuest = monthlyQuestState ?? initialMonthlyQuest
	const resolvedMonthlyQuest = activeMonthlyQuest ?? EMPTY_MONTHLY_QUEST
	const monthlyProgressRatio =
		resolvedMonthlyQuest.max > 0
			? Math.min((resolvedMonthlyQuest.progress / resolvedMonthlyQuest.max) * 100, 100)
			: 0
	const dayHeading =
		initialDayLabel && initialDayLabel !== 'aujourd hui'
			? `Quetes du ${initialDayLabel}`
			: 'Quetes du jour'
	const [isEcoFactReaderOpen, setIsEcoFactReaderOpen] = useState(false)
	const [isDailyHarvestOpen, setIsDailyHarvestOpen] = useState(false)
	const [, setUserSeedBalance] = useState(240)
	const [floatingReward, setFloatingReward] = useState<{
		id: number
		amount: number
	}>({
		id: 0,
		amount: 0,
	})

	const ecoFactQuest = useMemo(
		() => dailyQuests.find((quest) => quest.type === 'education') ?? null,
		[dailyQuests]
	)
	const dailyHarvestQuest = useMemo(
		() => dailyQuests.find((quest) => quest.type === 'daily_harvest') ?? null,
		[dailyQuests]
	)

	useEffect(() => {
		setDailyQuests(initialDailyQuests)
		setMonthlyQuestState(initialMonthlyQuest)
	}, [initialDailyQuests, initialMonthlyQuest])

	const incrementMonthlyQuestIfNeeded = useCallback(() => {
		const hadCompletedQuest = dailyQuests.some((quest) => Boolean(quest.completedAt || quest.claimedAt))
		if (hadCompletedQuest) {
			return
		}

		setMonthlyQuestState((current) => {
			if (!current) {
				return current
			}

			return {
				...current,
				progress: Math.min(current.progress + 1, current.max),
				completedDays: current.completedDays + 1,
			}
		})
	}, [dailyQuests])

	const handleEcoFactOpen = () => {
		guardAction(
			() => {
				setIsEcoFactReaderOpen(true)
			},
			{ intent: 'eco-fact' }
		)
	}

	useEffect(() => {
		const intent = searchParams.get('intent')

		if (intent === 'eco-fact') {
			setIsEcoFactReaderOpen(true)
		} else if (intent === 'daily-harvest') {
			setIsDailyHarvestOpen(true)
		} else {
			return
		}

		const nextParams = new URLSearchParams(searchParams.toString())
		nextParams.delete('intent')
		nextParams.delete('targetId')
		const nextQuery = nextParams.toString()
		const nextUrl = nextQuery ? `${window.location.pathname}?${nextQuery}` : window.location.pathname
		window.history.replaceState(window.history.state, '', nextUrl)
	}, [searchParams])

	useEffect(() => {
		if (floatingReward.amount <= 0) return
		const timeout = setTimeout(() => {
			setFloatingReward({
				id: 0,
				amount: 0,
			})
		}, 1300)

		return () => clearTimeout(timeout)
	}, [floatingReward])

	const handleEcoFactValidate = () => {
		const now = new Date().toISOString()
		setDailyQuests((current) =>
			current.map((quest) => {
				if (quest.type !== 'education') {
					return quest
				}

				if (quest.progress >= quest.max) {
					return quest
				}

				return {
					...quest,
					progress: quest.max,
					completedAt: quest.completedAt || now,
					claimedAt: quest.claimedAt || now,
					status: 'claimed',
				}
			})
		)

		const canCollectReward = Boolean(
			ecoFactQuest && ecoFactQuest.progress < ecoFactQuest.max
		)

		if (canCollectReward && ecoFactQuest) {
			incrementMonthlyQuestIfNeeded()
			setUserSeedBalance((value) => value + ecoFactQuest.reward)
			setFloatingReward({
				id: Date.now(),
				amount: ecoFactQuest.reward,
			})
			haptic.lightTap()

			if (viewerId && initialDayKey) {
				recordClientMockChallengeCompletion({
					viewerId,
					dayKey: initialDayKey,
					archetypeId: 'eco-fact',
					max: ecoFactQuest.max,
					timestamp: now,
				})
			}
		}

		setIsEcoFactReaderOpen(false)
	}

	const handleDailyHarvestClaim = () => {
		haptic.lightTap()
		const now = new Date().toISOString()

		setDailyQuests((current) =>
			current.map((quest) => {
				if (quest.type !== 'daily_harvest') {
					return quest
				}

				if (quest.progress >= quest.max) {
					return quest
				}

				return {
					...quest,
					progress: quest.max,
					completedAt: quest.completedAt || now,
					claimedAt: quest.claimedAt || now,
					status: 'claimed',
				}
			})
		)

		if (dailyHarvestQuest && dailyHarvestQuest.progress < dailyHarvestQuest.max) {
			incrementMonthlyQuestIfNeeded()
			setUserSeedBalance((value) => value + dailyHarvestQuest.reward)

			if (viewerId && initialDayKey) {
				recordClientMockChallengeCompletion({
					viewerId,
					dayKey: initialDayKey,
					archetypeId: 'daily-harvest',
					max: dailyHarvestQuest.max,
					timestamp: now,
				})
			}
		}

		setIsDailyHarvestOpen(false)
	}

	return (
		<section className='w-full animate-in fade-in slide-in-from-bottom-2 pb-36 duration-500 md:pb-10'>
			<div className='relative isolate w-full overflow-hidden'>
				<div className={`absolute inset-0 z-[-1] bg-gradient-to-b ${factionTheme.bgGradient}`}></div>

				<div className='relative z-20 px-6 pb-24 pt-12'>
					<p className={`text-[11px] font-bold uppercase tracking-widest ${factionTheme.accentText}`}>
						{resolvedMonthlyQuest.title}
					</p>
					<h1 className='mt-1 text-3xl font-black tracking-tight text-white drop-shadow-md'>
						{factionTheme.title}
					</h1>
					<p className={`mt-2 text-[11px] font-bold uppercase tracking-widest ${factionTheme.accentText}`}>
						⏱ {resolvedMonthlyQuest.timeLeft}
					</p>
				</div>

				<div className='absolute bottom-0 right-[-10px] z-10 h-40 w-40 opacity-90'>
					<img
						src={factionTheme.mascotImg}
						alt={factionTheme.title}
						className='h-full w-full object-contain object-bottom drop-shadow-2xl'
						onError={(event) => {
							event.currentTarget.style.display = 'none'
						}}
					/>
					<div className='absolute inset-0 -z-10 flex items-end justify-center text-8xl'>🐝</div>
				</div>
			</div>

			<div className='relative z-30 -mt-12 mb-8 px-4'>
				<div className='rounded-2xl border border-white/10 bg-card/95 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.5)] backdrop-blur-xl'>
					<div className='mb-4 flex items-center justify-between gap-3'>
						<h2 className='text-base font-bold tracking-tight text-white'>
							{resolvedMonthlyQuest.objective}
						</h2>
						<span className={`rounded-full px-2 py-1 text-[10px] font-bold tabular-nums ${factionTheme.badgeBg} ${factionTheme.accentText}`}>
							+500 <Sprout className='inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400' />
						</span>
					</div>

					<div className='h-3 w-full overflow-hidden rounded-full bg-white/5'>
						<div
							className={`h-full rounded-full ${factionTheme.accentBg}`}
							style={{ width: `${monthlyProgressRatio}%` }}
						></div>
					</div>
					<div className='mt-2 text-right text-[11px] font-medium tabular-nums text-white/50'>
						{resolvedMonthlyQuest.progress} / {resolvedMonthlyQuest.max} jours
					</div>
				</div>
			</div>

			<div className='flex w-full flex-col'>
				<h2 className='mb-2 flex justify-between px-6 text-xs font-bold uppercase tracking-wider text-muted-foreground'>
					<span>{dayHeading}</span>
					<span className='flex items-center gap-2'>
						<span>{initialDayLabel}</span>
					</span>
				</h2>

				{dailyQuests.map((quest) => {
					const theme = questThemes[quest.type]
					const Icon = theme.icon
					const progress = Math.min((quest.progress / quest.max) * 100, 100)
					const isComplete = quest.progress >= quest.max
					const rowContent = (
						<>
							<div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/5'>
								<Icon className={cn('h-5 w-5', theme.iconClassName)} />
							</div>

							<div className='min-w-0 flex-1'>
								<div className='flex min-w-0 items-center gap-2'>
									<h3 className='truncate text-sm font-semibold text-white'>{quest.title}</h3>
									{isComplete ? <CheckCircle2 className='h-4 w-4 shrink-0 text-lime-400' /> : null}
								</div>
								<p className='mt-0.5 line-clamp-2 text-[12px] leading-tight text-white/60'>
									{quest.description}
								</p>

								<div className='mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10'>
									<div
										className={cn('h-full rounded-full transition-all duration-700', theme.progressClassName)}
										style={{ width: `${progress}%` }}
									/>
								</div>
								<p className='mt-1 text-[10px] font-medium tabular-nums text-white/40'>
									{quest.progress} / {quest.max}
								</p>
							</div>

							<div
								className={cn(
									'shrink-0 rounded-full px-2 py-1 text-[10px] font-bold tabular-nums whitespace-nowrap',
									accentTheme.badgeClassName,
									accentTheme.accentText,
								)}
							>
								+{quest.reward} <Sprout className='inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400' />
							</div>
						</>
					)

					if (quest.type === 'education') {
						return (
							<button
								key={quest.id}
								type='button'
								onClick={handleEcoFactOpen}
								className='flex w-full items-center gap-4 border-b border-white/5 bg-transparent px-6 py-4 text-left transition-colors active:bg-white/5'
							>
								{rowContent}
							</button>
						)
					}

					if (quest.type === 'daily_harvest') {
						return (
							<button
								key={quest.id}
								type='button'
								onClick={() =>
									guardAction(
										() => {
											setIsDailyHarvestOpen(true)
										},
										{ intent: 'daily-harvest' },
									)
								}
								className='flex w-full items-center gap-4 border-b border-white/5 bg-transparent px-6 py-4 text-left transition-colors active:bg-white/5'
							>
								{rowContent}
							</button>
						)
					}

					return (
						<Link
							key={quest.id}
							href={quest.href || '/'}
							className='flex w-full items-center gap-4 border-b border-white/5 bg-transparent px-6 py-4 transition-colors active:bg-white/5'
						>
							{rowContent}
						</Link>
					)
				})}
			</div>

			<EcoFactReader
				accentTheme={accentTheme}
				challenge={ecoFactQuest}
				open={isEcoFactReaderOpen}
				onValidate={handleEcoFactValidate}
				onClose={() => setIsEcoFactReaderOpen(false)}
			/>
			<AnimatePresence>
				{floatingReward.amount > 0 ? (
					<motion.div
						key={floatingReward!.id}
						initial={{ opacity: 0, y: 18, scale: 0.9 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -24, scale: 1.06 }}
						transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
						className='pointer-events-none fixed inset-x-0 top-[18%] z-[95] flex justify-center px-4'
					>
						<div
							className={cn(
								'rounded-full px-4 py-2 text-sm font-black backdrop-blur-md',
								accentTheme.badgeClassName,
								accentTheme.accentText,
								accentTheme.accentShadow,
							)}
						>
							+{floatingReward.amount} graines gagnees
						</div>
					</motion.div>
				) : null}
			</AnimatePresence>
			<DailyHarvestModal
				accentTheme={accentTheme}
				open={isDailyHarvestOpen}
				onClose={() => setIsDailyHarvestOpen(false)}
				onClaim={handleDailyHarvestClaim}
			/>
		</section>
	)

	return (
		<section className='w-full animate-in fade-in slide-in-from-bottom-2 duration-500 pb-36 md:pb-10'>
			{/* 1. LE HERO HEADER (Le Decor Emeraude) */}
			<div className='relative w-full isolate overflow-hidden'>
				{/* Le Fond Colore dynamique */}
				<div className={`absolute inset-0 bg-gradient-to-b ${factionTheme.bgGradient} z-[-1]`}></div>

				{/* Le Contenu Textuel (Couche 2 - Toujours au dessus) */}
				<div className='relative z-20 px-6 pt-12 pb-24'>
					<h1 className='text-3xl font-black text-white tracking-tight drop-shadow-md'>
						{factionTheme.title}
					</h1>
					<p className={`font-bold text-[11px] tracking-widest uppercase mt-1 ${factionTheme.accentText}`}>
						⏱ {monthlyQuest.timeLeft}
					</p>
				</div>

				{/* La Mascotte (Couche 1 - Derriere le texte, devant le fond) */}
				<div className='absolute bottom-0 right-[-10px] w-40 h-40 z-10 opacity-90'>
					<img
						src={factionTheme.mascotImg}
						alt={factionTheme.title}
						className='w-full h-full object-contain object-bottom drop-shadow-2xl'
						onError={(e) => {
							e.currentTarget.style.display = 'none'
						}}
					/>
					{/* Fallback si l'image ne charge pas : un emoji geant */}
					<div className='absolute inset-0 flex items-end justify-center text-8xl -z-10'>
						🐝
					</div>
				</div>
			</div>

			{/* 2. LA CARTE DE PROGRESSION (L'Overlap) */}
			<div className='relative z-30 -mt-12 px-4 mb-8'>
				<div className='bg-card/95 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)]'>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-base font-bold text-white tracking-tight'>
							{activeMonthlyQuest?.objective || monthlyQuest.objective}
						</h2>
						<span className={`px-2 py-1 rounded-full text-[10px] font-bold tabular-nums ${factionTheme.badgeBg} ${factionTheme.accentText}`}>
							+500 <Sprout className="inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400" />
						</span>
					</div>

					{/* Progress Bar */}
					<div className='h-3 w-full bg-white/5 rounded-full overflow-hidden'>
						<div className={`h-full w-[40%] rounded-full ${factionTheme.accentBg}`}></div>
					</div>
					<div className='text-right text-[11px] font-medium text-white/50 tabular-nums mt-2'>
						{activeMonthlyQuest?.progress || monthlyQuest.progress} / {activeMonthlyQuest?.max || monthlyQuest.max} jours
					</div>
				</div>
			</div>

			<div className='w-full flex flex-col'>
				<h2 className='text-xs text-muted-foreground font-bold tracking-wider uppercase px-6 mb-2 flex justify-between'>
					<span>Quêtes du jour</span>
					<span className='flex items-center gap-2'>
						
						<span>⏱ 7 H</span>
						
					</span>
				</h2>

				{dailyQuests.map((quest) => {
					const theme = questThemes[quest.type]
					const Icon = theme.icon
					const progress = Math.min((quest.progress / quest.max) * 100, 100)
					const isComplete = quest.progress >= quest.max
					const rowContent = (
						<>
							<div className='flex w-12 h-12 shrink-0 items-center justify-center rounded-full bg-white/5'>
								<Icon className={cn('h-5 w-5', theme.iconClassName)} />
							</div>

							<div className='min-w-0 flex-1'>
								<div className='flex min-w-0 items-center gap-2'>
									<h3 className='truncate text-sm font-semibold text-white'>
										{quest.title}
									</h3>
									{isComplete ? (
										<CheckCircle2 className='h-4 w-4 shrink-0 text-lime-400' />
									) : null}
								</div>
								<p className='line-clamp-1 text-[12px] font-normal text-white/60 leading-tight mt-0.5'>
									{quest.description}
								</p>

								<div className='mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10'>
									<div
										className={cn(
											'h-full rounded-full transition-all duration-700',
											theme.progressClassName
										)}
										style={{ width: `${progress}%` }}
									/>
								</div>
								<p className='mt-1 text-[10px] font-medium text-white/40 tabular-nums'>
									{quest.progress} / {quest.max}
								</p>
							</div>

							<div
								className={cn(
									'shrink-0 rounded-full px-2 py-1 text-[10px] font-bold tabular-nums whitespace-nowrap',
									accentTheme.badgeClassName,
									accentTheme.accentText
								)}
							>
								+{quest.reward} <Sprout className="inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400" />
							</div>
						</>
					)

					if (quest.type === 'education') {
						return (
							<button
								key={quest.id}
								type='button'
								onClick={handleEcoFactOpen}
								className='w-full flex items-center gap-4 py-4 px-6 border-b border-white/5 bg-transparent active:bg-white/5 transition-colors text-left'
							>
								{rowContent}
							</button>
						)
					}

					if (quest.type === 'daily_harvest') {
						return (
							<button
								key={quest.id}
								type='button'
								onClick={() =>
									guardAction(
										() => {
											setIsDailyHarvestOpen(true)
										},
										{ intent: 'daily-harvest' }
									)
								}
								className='w-full flex items-center gap-4 py-4 px-6 border-b border-white/5 bg-transparent active:bg-white/5 transition-colors text-left'
							>
								{rowContent}
							</button>
						)
					}

					return (
						<Link
							key={quest.id}
							href={quest.href || '/'}
							className='w-full flex items-center gap-4 py-4 px-6 border-b border-white/5 bg-transparent active:bg-white/5 transition-colors'
						>
							{rowContent}
						</Link>
					)
				})}
			</div>

			<EcoFactReader
				accentTheme={accentTheme}
				challenge={ecoFactQuest}
				open={isEcoFactReaderOpen}
				onValidate={handleEcoFactValidate}
				onClose={() => setIsEcoFactReaderOpen(false)}
			/>
			<AnimatePresence>
				{floatingReward.amount > 0 ? (
					<motion.div
						key={floatingReward.id}
						initial={{ opacity: 0, y: 18, scale: 0.9 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -24, scale: 1.06 }}
						transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
						className='pointer-events-none fixed inset-x-0 top-[18%] z-[95] flex justify-center px-4'
					>
						<div
							className={cn(
								'rounded-full px-4 py-2 text-sm font-black backdrop-blur-md',
								accentTheme.badgeClassName,
								accentTheme.accentText,
								accentTheme.accentShadow
							)}
						>
							+{floatingReward.amount} graines gagnées
						</div>
					</motion.div>
				) : null}
			</AnimatePresence>
			<DailyHarvestModal
				accentTheme={accentTheme}
				open={isDailyHarvestOpen}
				onClose={() => setIsDailyHarvestOpen(false)}
				onClaim={handleDailyHarvestClaim}
			/>
		</section>
	)
}
