'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
	BookOpen,
	CheckCircle2,
	ChevronRight,
	Sparkles,
	UsersRound,
	X,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import { Link } from '@/i18n/navigation'
import {
	ClientCatalogProjectCard,
	type ClientCatalogProject,
} from '@/app/[locale]/(marketing)/projects/components/client-catalog-project-card'
import { cn } from '@/lib/utils'
import { useHaptic } from '@/hooks/use-haptic'

type DailyQuestType = 'education' | 'social' | 'daily_harvest'

type DailyQuest = {
	id: number
	type: DailyQuestType
	title: string
	description: string
	progress: number
	max: number
	reward: number
	href?: string
}

type QuestTheme = {
	icon: typeof BookOpen
	iconClassName: string
	progressClassName: string
}

const initialDailyQuests: DailyQuest[] = [
	{
		id: 1,
		type: 'education',
		title: "L'Éco-Fact du jour",
		description: "Lis l'article sur la déforestation.",
		progress: 0,
		max: 1,
		reward: 50,
	},
	{
		id: 2,
		type: 'social',
		title: "L'Esprit d'Équipe",
		description: 'Distribue 3 Bravos dans le Collectif.',
		progress: 1,
		max: 3,
		reward: 100,
		href: '/collectif',
	},
	{
		id: 3,
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

const monthlyQuest = {
	title: "Quête d'Avril",
	timeLeft: '22 JOURS RESTANTS',
	objective: 'Valide 20 jours de Série',
	progress: 8,
	max: 20,
}

const ecoFactDeepDiveProject: ClientCatalogProject = {
	id: 'amazonie-restauration',
	slug: 'foret-mediterraneenne',
	name_default: 'Reforestation : Forêt Méditerranéenne',
	description_default:
		'Aidez à restaurer des habitats forestiers critiques et à sécuriser des couloirs pour les pollinisateurs et la faune locale.',
	target_budget: 150000,
	current_funding: 75000,
	funding_progress: 50,
	address_city: 'Bassin méditerranéen',
	address_country_code: 'FR',
	featured: true,
	hero_image_url:
		'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
}

type EcoFactReaderProps = {
	open: boolean
	onValidate: () => void
	onClose: () => void
}

type EcoFactArticleViewProps = {
	open: boolean
	onClose: () => void
}

function EcoFactArticleView({ open, onClose }: EcoFactArticleViewProps) {
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
							src='https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1400&q=80'
							alt='Forêt amazonienne'
							className='h-full w-full object-cover'
						/>
						<div className='absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/70 to-transparent' />
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

					<h1 className='mt-6 mb-4 px-5 text-3xl font-black leading-tight text-white'>
						Le Poumon Vert : Pourquoi l&apos;Amazonie est vitale.
					</h1>

					<div className='mx-5 mb-8 rounded-2xl border border-lime-400/20 bg-lime-400/10 p-5'>
						<h3 className='mb-3 text-xs font-bold uppercase tracking-widest text-lime-400'>
							En 3 points clés
						</h3>
						<ul className='space-y-3 text-sm text-white/80'>
							<li className='flex gap-2'>
								<span className='text-lime-400'>•</span>
								<span>
									L&apos;Amazonie régule le climat mondial en stockant
									plusieurs milliards de tonnes de carbone.
								</span>
							</li>
							<li className='flex gap-2'>
								<span className='text-lime-400'>•</span>
								<span>
									Elle influence les cycles de pluie bien au-delà de
									l&apos;Amérique du Sud, jusqu&apos;aux systèmes agricoles
									globaux.
								</span>
							</li>
							<li className='flex gap-2'>
								<span className='text-lime-400'>•</span>
								<span>
									Des milliers d&apos;espèces y dépendent d&apos;habitats
									fragiles menacés par la fragmentation forestière.
								</span>
							</li>
						</ul>
					</div>

					<div className='px-5 pb-8 text-base leading-relaxed text-white/80'>
						<p>
							La forêt amazonienne est souvent décrite comme le poumon vert de la
							planète, mais cette formule ne raconte qu&apos;une partie de son rôle.
							Elle fonctionne comme un système vivant complexe qui connecte les
							arbres, les sols, les rivières atmosphériques, les insectes
							pollinisateurs et les espèces animales dans un équilibre
							extrêmement précis.
						</p>

						<img
							src='https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=1200&q=80'
							alt='Canopée amazonienne'
							className='my-6 h-48 w-full rounded-2xl object-cover'
						/>

						<p>
							Lorsque la couverture forestière diminue, cet équilibre se dégrade
							rapidement. Les sols se dessèchent, les cycles de pluie se
							dérèglent, et de nombreuses espèces perdent leurs zones de
							reproduction et d&apos;alimentation. Ce n&apos;est pas un phénomène
							abstrait : cela impacte directement la sécurité alimentaire, la
							résilience des territoires et la stabilité climatique.
						</p>

						<blockquote className='my-8 border-l-4 border-lime-400 pl-5 text-xl font-medium italic text-white'>
							&quot;Chaque minute, l&apos;équivalent de 30 terrains de football
							disparaît.&quot;
						</blockquote>

						<p>
							La restauration écologique permet de renverser cette trajectoire :
							replanter intelligemment, reconnecter les habitats, renforcer
							l&apos;apiculture locale et protéger les zones critiques redonne une
							capacité d&apos;adaptation aux écosystèmes. Chaque projet soutenu agit
							comme une brique concrète dans une stratégie globale de
							préservation du vivant.
						</p>

						<img
							src='https://images.unsplash.com/photo-1523978591478-c753949ff840?auto=format&fit=crop&w=1200&q=80'
							alt='Restauration et biodiversité'
							className='my-6 h-48 w-full rounded-2xl object-cover'
						/>
					</div>

					<div className='mt-12 mb-16 px-5'>
						<h2 className='mb-2 text-2xl font-black text-white'>
							Passez à l&apos;action
						</h2>
						<p className='mb-6 text-sm text-white/60'>
							Maintenant que vous savez, aidez-nous à protéger ces espaces
							vitaux.
						</p>
						<ClientCatalogProjectCard
							project={ecoFactDeepDiveProject}
							labels={{
								viewLabel: 'Voir le projet',
								progressLabel: 'Progression',
								fundedLabel: 'Collectés',
								goalLabel: 'Obj.',
								featuredLabel: 'Coup de cœur',
								activeLabel: 'En cours',
							}}
						/>
					</div>
				</motion.div>
			) : null}
		</AnimatePresence>
	)
}

const ecoFactWordContainer = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.05,
		},
	},
}

const ecoFactWordChild = {
	hidden: { opacity: 0, y: 5, filter: 'blur(4px)' },
	visible: {
		opacity: 1,
		y: 0,
		filter: 'blur(0px)',
		transition: {
			type: 'spring' as const,
			damping: 12,
			stiffness: 100,
		},
	},
}

type EcoFactWordRevealProps = {
	text: string
	shouldAnimate: boolean
	onComplete?: () => void
}

function EcoFactWordReveal({
	text,
	shouldAnimate,
	onComplete,
}: EcoFactWordRevealProps) {
	const words = useMemo(() => text.split(' '), [text])

	if (!shouldAnimate) {
		return <p className='text-sm leading-relaxed text-white/75'>{text}</p>
	}

	return (
		<motion.p
			className='text-sm leading-relaxed text-white/75'
			variants={ecoFactWordContainer}
			initial='hidden'
			animate='visible'
			onAnimationComplete={onComplete}
		>
			{words.map((word, index) => (
				<motion.span
					// eslint-disable-next-line react/no-array-index-key
					key={`${word}-${index}`}
					className='inline-block mr-1'
					variants={ecoFactWordChild}
				>
					{word}
				</motion.span>
			))}
		</motion.p>
	)
}

function EcoFactReader({ open, onValidate, onClose }: EcoFactReaderProps) {
	const haptic = useHaptic()
	const [isSkipped, setIsSkipped] = useState(false)
	const [isTextAnimationDone, setIsTextAnimationDone] = useState(false)
	const [isArticleOpen, setIsArticleOpen] = useState(false)
	const hasTriggeredCtaHaptic = useRef(false)

	const longEcoFactText =
		'La forêt amazonienne couvre près de 5,5 millions de km² et agit comme un immense régulateur climatique. Quand les forêts sont fragmentées, les pollinisateurs disparaissent, les sols s’appauvrissent et les cycles de pluie se dérèglent. À terme, cela affecte autant la faune locale que les communautés humaines qui dépendent de ces écosystèmes.'

	const supportingEcoFactText =
		'Protéger un habitat, c’est préserver des chaînes entières de vie : insectes, oiseaux, amphibiens, plantes et micro-organismes. Chaque action de restauration ou de préservation aide à maintenir l’équilibre de ce vivant invisible mais essentiel.'

	useEffect(() => {
		if (!open) return
		setIsSkipped(false)
		setIsTextAnimationDone(false)
		setIsArticleOpen(false)
		hasTriggeredCtaHaptic.current = false
	}, [open])

	useEffect(() => {
		if (!open || !isTextAnimationDone || hasTriggeredCtaHaptic.current) return
		haptic.lightTap()
		hasTriggeredCtaHaptic.current = true
	}, [haptic, isTextAnimationDone, open])

	const handleSkipReveal = () => {
		if (isTextAnimationDone) return
		setIsSkipped(true)
		setIsTextAnimationDone(true)
	}

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
					onClick={handleSkipReveal}
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

					<div className='relative flex-1 overflow-y-auto pb-44'>
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
								className='mt-3 flex justify-center'
							>
								<span className='rounded-full border border-white/5 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white/70'>
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
							className='mt-8 flex flex-col gap-4 px-6'
						>
							<motion.h2
								variants={{
									hidden: { opacity: 0, y: 14 },
									show: { opacity: 1, y: 0 },
								}}
								className='text-3xl font-black leading-tight tracking-tight text-white'
							>
								Le Poumon Vert de la planète
							</motion.h2>

							<motion.div
								variants={{
									hidden: { opacity: 0, y: 14 },
									show: { opacity: 1, y: 0 },
								}}
								className='flex flex-wrap items-center gap-2'
							>
								<span className='rounded-full border border-lime-400/25 bg-lime-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-lime-300'>
									Amazonie
								</span>
								<span className='rounded-full border border-sky-400/25 bg-sky-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-sky-300'>
									Biodiversité
								</span>
								<span className='rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-300'>
									Déforestation
								</span>
							</motion.div>

							<motion.div
								variants={{
									hidden: { opacity: 0, y: 14 },
									show: { opacity: 1, y: 0 },
								}}
								className='flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5'
							>
								<div className='text-4xl font-black tracking-tighter tabular-nums text-lime-400'>
									20%
								</div>
								<p className='text-sm leading-relaxed text-white/70'>
									De la biodiversité mondiale est abritée par la forêt
									amazonienne. Sa déforestation menace des milliers
									d&apos;espèces.
								</p>
							</motion.div>

							<motion.div
								variants={{
									hidden: { opacity: 0, y: 14 },
									show: { opacity: 1, y: 0 },
								}}
								className='rounded-2xl border border-white/10 bg-white/5 p-5'
							>
								<EcoFactWordReveal
									text={longEcoFactText}
									shouldAnimate={!isSkipped}
									onComplete={() => {
										setIsTextAnimationDone(true)
									}}
								/>
								<p className='mt-3 text-sm leading-relaxed text-white/65'>
									{supportingEcoFactText}
								</p>
							</motion.div>
						</motion.div>

						<div className='px-5 mt-4 mb-32 flex justify-center'>
							<button
								type='button'
								onClick={openArticle}
								className='flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 rounded-full transition-all group'
							>
								<BookOpen className='w-4 h-4 text-lime-400' />
								<span className='text-sm font-bold text-white group-hover:text-white/80 transition-colors'>
									Explorer le dossier complet
								</span>
								<span className='text-xs font-medium text-white/40 ml-1'>
									(3 min)
								</span>
								<ChevronRight className='w-4 h-4 text-white/30 group-hover:translate-x-1 transition-transform' />
							</button>
						</div>
					</div>

					<div className='absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15] to-transparent p-6 pb-[max(1.25rem,env(safe-area-inset-bottom))]'>
						<AnimatePresence>
							{isTextAnimationDone ? (
								<motion.button
									type='button'
									initial={{ opacity: 0, y: 12 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 8 }}
									transition={{ duration: 0.45, delay: 0.7 }}
									onClick={(event) => {
										event.stopPropagation()
										onValidate()
									}}
									className='flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-lime-400 text-lg font-black text-black shadow-[0_0_30px_rgba(132,204,22,0.2)] transition-transform active:scale-95'
								>
									C&apos;est noté !
									<span className='opacity-50'>|</span>
									+50 🌱
								</motion.button>
							) : null}
						</AnimatePresence>
					</div>
					<EcoFactArticleView
						open={isArticleOpen}
						onClose={() => setIsArticleOpen(false)}
					/>
				</motion.div>
			) : null}
		</AnimatePresence>
	)
}

type DailyHarvestModalProps = {
	open: boolean
	onClose: () => void
	onClaim: () => void
}

function DailyHarvestModal({ open, onClose, onClaim }: DailyHarvestModalProps) {
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
									className='h-full bg-yellow-400 transition-all duration-75 ease-linear'
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
							<h2 className='mb-2 text-sm font-bold uppercase tracking-widest text-yellow-400'>
								Récompense Quotidienne
							</h2>
							<div className='relative mb-4'>
								<div className='pointer-events-none absolute inset-0 -z-10 flex items-center justify-center'>
									<div className='h-64 w-64 rounded-full bg-gradient-to-tr from-lime-400/0 via-lime-400/20 to-yellow-400/0 blur-2xl animate-[spin_4s_linear_infinite]' />
								</div>
								<div className='text-7xl font-black text-lime-400 drop-shadow-[0_0_40px_rgba(163,230,53,0.5)] animate-[loot-spring-pop_0.6s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]'>
									+ {animatedReward} 🌱
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

export function AdventureChallenges() {
	const haptic = useHaptic()
	const [dailyQuests, setDailyQuests] = useState(initialDailyQuests)
	const [isEcoFactReaderOpen, setIsEcoFactReaderOpen] = useState(false)
	const [isDailyHarvestOpen, setIsDailyHarvestOpen] = useState(false)
	const [userSeedBalance, setUserSeedBalance] = useState(240)
	const [floatingReward, setFloatingReward] = useState<{
		id: number
		amount: number
	} | null>(null)

	const ecoFactQuest = useMemo(
		() => dailyQuests.find((quest) => quest.type === 'education') ?? null,
		[dailyQuests]
	)
	const dailyHarvestQuest = useMemo(
		() => dailyQuests.find((quest) => quest.type === 'daily_harvest') ?? null,
		[dailyQuests]
	)

	const handleEcoFactOpen = () => {
		setIsEcoFactReaderOpen(true)
	}

	useEffect(() => {
		if (!floatingReward) return
		const timeout = setTimeout(() => {
			setFloatingReward(null)
		}, 1300)

		return () => clearTimeout(timeout)
	}, [floatingReward])

	const handleEcoFactValidate = () => {
		setDailyQuests((current) =>
			current.map((quest) => {
				if (quest.type !== 'education') {
					return quest
				}

				if (quest.progress >= quest.max) {
					return quest
				}

				return { ...quest, progress: quest.max }
			})
		)

		const canCollectReward = Boolean(
			ecoFactQuest && ecoFactQuest.progress < ecoFactQuest.max
		)

		if (canCollectReward && ecoFactQuest) {
			setUserSeedBalance((value) => value + ecoFactQuest.reward)
			setFloatingReward({
				id: Date.now(),
				amount: ecoFactQuest.reward,
			})
			haptic.lightTap()
		}

		setIsEcoFactReaderOpen(false)
	}

	const handleDailyHarvestClaim = () => {
		haptic.lightTap()

		setDailyQuests((current) =>
			current.map((quest) => {
				if (quest.type !== 'daily_harvest') {
					return quest
				}

				if (quest.progress >= quest.max) {
					return quest
				}

				return { ...quest, progress: quest.max }
			})
		)

		if (dailyHarvestQuest && dailyHarvestQuest.progress < dailyHarvestQuest.max) {
			setUserSeedBalance((value) => value + dailyHarvestQuest.reward)
		}

		setIsDailyHarvestOpen(false)
	}

	return (
		<section className='w-full animate-in fade-in slide-in-from-bottom-2 duration-500 pb-36 md:pb-10'>
			{/* 1. LE HERO HEADER (Le Decor Emeraude) */}
			<div className='relative w-full isolate overflow-hidden'>
				{/* Le Fond Colore (Couche -1) */}
				<div className='absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-900 to-background z-[-1]'></div>

				{/* Le Contenu Textuel (Couche 2 - Toujours au dessus) */}
				<div className='relative z-20 px-6 pt-12 pb-24'>
					<h1 className='text-3xl font-black text-white tracking-tight drop-shadow-md'>
						{monthlyQuest.title}
					</h1>
					<p className='text-lime-400 font-bold text-[11px] tracking-widest uppercase mt-1'>
						⏱ {monthlyQuest.timeLeft}
					</p>
				</div>

				{/* La Mascotte (Couche 1 - Derriere le texte, devant le fond) */}
				<div className='absolute bottom-0 right-[-10px] w-40 h-40 z-10 opacity-90'>
					<img
						src='/images/logo-icon-bee.png'
						alt='Mascotte Abeille'
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
							{monthlyQuest.objective}
						</h2>
						<span className='px-2 py-1 rounded-full bg-lime-500/10 text-lime-400 text-[10px] font-bold tabular-nums'>
							+500 🌱
						</span>
					</div>

					{/* Progress Bar */}
					<div className='h-3 w-full bg-white/5 rounded-full overflow-hidden'>
						<div className='h-full bg-lime-500 w-[40%] rounded-full'></div>
					</div>
					<div className='text-right text-[11px] font-medium text-white/50 tabular-nums mt-2'>
						{monthlyQuest.progress} / {monthlyQuest.max} jours
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

							<div className='shrink-0 rounded-full bg-lime-500/10 px-2 py-1 text-[10px] font-bold tabular-nums whitespace-nowrap text-lime-400'>
								+{quest.reward} 🌱
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
								onClick={() => setIsDailyHarvestOpen(true)}
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
				open={isEcoFactReaderOpen}
				onValidate={handleEcoFactValidate}
				onClose={() => setIsEcoFactReaderOpen(false)}
			/>
			<AnimatePresence>
				{floatingReward ? (
					<motion.div
						key={floatingReward.id}
						initial={{ opacity: 0, y: 18, scale: 0.9 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -24, scale: 1.06 }}
						transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
						className='pointer-events-none fixed inset-x-0 top-[18%] z-[95] flex justify-center px-4'
					>
						<div className='rounded-full border border-lime-400/40 bg-lime-400/15 px-4 py-2 text-sm font-black text-lime-300 backdrop-blur-md shadow-[0_0_20px_rgba(132,204,22,0.35)]'>
							+{floatingReward.amount} graines gagnées
						</div>
					</motion.div>
				) : null}
			</AnimatePresence>
			<DailyHarvestModal
				open={isDailyHarvestOpen}
				onClose={() => setIsDailyHarvestOpen(false)}
				onClaim={handleDailyHarvestClaim}
			/>
		</section>
	)
}
