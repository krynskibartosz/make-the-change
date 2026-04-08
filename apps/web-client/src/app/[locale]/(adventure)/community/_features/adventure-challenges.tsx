'use client'

import { useMemo, useState } from 'react'
import { BookOpen, CheckCircle2, Sparkles, UsersRound } from 'lucide-react'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

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
		href: '/aventure?tab=mouvement',
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

type EcoFactReaderProps = {
	open: boolean
	onValidate: () => void
	onClose: () => void
}

function EcoFactReader({ open, onValidate, onClose }: EcoFactReaderProps) {
	if (!open) return null

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md'
			onClick={onClose}
		>
			<div
				className='w-full max-w-md bg-card rounded-3xl overflow-hidden shadow-2xl relative flex flex-col animate-in zoom-in-95 fade-in duration-200'
				onClick={(event) => event.stopPropagation()}
			>
				<button
					type='button'
					aria-label='Fermer'
					onClick={onClose}
					className='absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md text-white/80 hover:text-white hover:bg-black/70 transition-colors'
				>
					✕
				</button>

				<div className='w-full h-48 sm:h-56 relative shrink-0'>
					<img
						src='/images/home-header-poster.jpeg'
						alt='Forêt tropicale'
						className='w-full h-full object-cover'
					/>
					<div className='absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-card to-transparent'></div>
				</div>

				<div className='p-6 pt-2 flex-1 overflow-y-auto'>
					<p className='text-lime-300 font-semibold text-[10px] tracking-[0.18em] uppercase mb-2'>
						ÉCO-FACT #001
					</p>
					<h3 className='text-[30px] sm:text-[32px] font-black text-white tracking-[-0.025em] leading-[1.03] mb-3 text-balance'>
						Le Poumon Vert
					</h3>
					<p className='text-white/75 text-[14px] leading-[1.7] mb-7 max-w-[34ch]'>
						La forêt amazonienne abrite une biodiversité unique au monde.
						Quand la déforestation progresse, des milliers d’espèces perdent
						leur habitat. Protéger ces forêts, c’est protéger l’équilibre du
						climat global.
					</p>
					<button
						type='button'
						onClick={onValidate}
						className='w-full py-3.5 rounded-2xl bg-lime-500 text-black font-black text-[16px] tracking-tight active:scale-[0.98] transition-transform'
					>
						Valider & Gagner 50 🌱
					</button>
				</div>
			</div>
		</div>
	)
}

type DailyHarvestModalProps = {
	open: boolean
	onClose: () => void
	onClaim: () => void
}

function DailyHarvestModal({ open, onClose, onClaim }: DailyHarvestModalProps) {
	if (!open) return null

	return (
		<div
			className='bg-black/80 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center p-4'
			onClick={onClose}
		>
			<div
				className='bg-card border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)] w-full max-w-sm rounded-3xl p-6 text-center overflow-hidden relative'
				onClick={(event) => event.stopPropagation()}
			>
				<div className='absolute top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-lime-500/20 blur-3xl rounded-full -z-10'></div>
				<img
					src='/images/logo-icon-bee.png'
					alt='Mascotte Abeille'
					className='w-32 h-32 mx-auto object-contain drop-shadow-2xl mb-4'
				/>
				<p className='text-lime-300 font-semibold tracking-[0.18em] text-[10px] uppercase mb-1.5'>
					RÉCOMPENSE QUOTIDIENNE
				</p>
				<h3 className='text-[30px] font-black text-white tracking-[-0.02em] leading-[1.05] mb-2 text-balance'>
					Le Nectar du Jour
				</h3>
				<p className='text-white/70 text-[14px] leading-[1.65] mb-8 max-w-[32ch] mx-auto'>
					Ton abeille a travaillé toute la nuit. Récupère tes graines pour
					financer de nouveaux projets !
				</p>
				<button
					type='button'
					onClick={onClaim}
					className='w-full py-4 rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 text-black font-black text-[17px] tracking-tight active:scale-95 transition-transform flex items-center justify-center gap-2'
				>
					<span>Récolter 50</span> <span className='text-xl'>🌱</span>
				</button>
			</div>
		</div>
	)
}

export function AdventureChallenges() {
	const [dailyQuests, setDailyQuests] = useState(initialDailyQuests)
	const [isEcoFactReaderOpen, setIsEcoFactReaderOpen] = useState(false)
	const [isDailyHarvestOpen, setIsDailyHarvestOpen] = useState(false)
	const [userSeedBalance, setUserSeedBalance] = useState(240)

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

		if (ecoFactQuest && ecoFactQuest.progress < ecoFactQuest.max) {
			setUserSeedBalance((value) => value + ecoFactQuest.reward)
		}

		setIsEcoFactReaderOpen(false)
	}

	const handleDailyHarvestClaim = () => {
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
						<span>7 H</span>
						<span className='tabular-nums'>{userSeedBalance} 🌱</span>
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
			<DailyHarvestModal
				open={isDailyHarvestOpen}
				onClose={() => setIsDailyHarvestOpen(false)}
				onClaim={handleDailyHarvestClaim}
			/>
		</section>
	)
}
