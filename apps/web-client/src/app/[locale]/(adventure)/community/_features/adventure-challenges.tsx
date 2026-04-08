'use client'

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
	href: string
}

type QuestTheme = {
	icon: typeof BookOpen
	iconClassName: string
	progressClassName: string
}

const dailyQuests: DailyQuest[] = [
	{
		id: 1,
		type: 'education',
		title: "L'Éco-Fact du jour",
		description: "Lis l'article sur la déforestation.",
		progress: 0,
		max: 1,
		reward: 50,
		href: '/blog',
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
		description: 'Récupère le nectar du jour depuis la page d’accueil.',
		progress: 0,
		max: 1,
		reward: 50,
		href: '/',
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

export function AdventureChallenges() {
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
					<span>7 H</span>
				</h2>

				{dailyQuests.map((quest) => {
					const theme = questThemes[quest.type]
					const Icon = theme.icon
					const progress = Math.min((quest.progress / quest.max) * 100, 100)
					const isComplete = quest.progress >= quest.max

					return (
						<Link
							key={quest.id}
							href={quest.href}
							className='w-full flex items-center gap-4 py-4 px-6 border-b border-white/5 bg-transparent active:bg-white/5 transition-colors'
						>
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
						</Link>
					)
				})}
			</div>
		</section>
	)
}
