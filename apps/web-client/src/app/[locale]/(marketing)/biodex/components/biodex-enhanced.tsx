'use client'
import { ArrowRight, Leaf, Lock, Sparkles, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { SpeciesCardEnhanced } from './species-card-enhanced'
import type { SpeciesContext } from '@/types/context'
import { Link } from '@/i18n/navigation'

interface BiodexEnhancedProps {
	species: SpeciesContext[]
	initialFaction?: string | null
}

const FALLBACK_SPECIES_PROJECTS = [
	{
		id: 'mock-project-ruchers-antsirabe',
		slug: 'ruchers-apiculteurs-independants-antsirabe',
		name: "Ruchers d'apiculteurs indépendants à Antsirabe",
		impact: 'Pollinisation locale, protection de la biodiversité et soutien aux apiculteurs.',
	},
]

const FACTIONS = [
	{ key: 'Vie Sauvage', label: 'Vie Sauvage', emoji: '🐝', description: 'Protégez pollinisateurs et faune locale', color: 'border-amber-500/40 bg-amber-500/10 text-amber-400' },
	{ key: 'Terres & Forêts', label: 'Terres & Forêts', emoji: '🌲', description: 'Régénérez sols, haies et forêts nourricières', color: 'border-lime-500/40 bg-lime-500/10 text-lime-400' },
	{ key: 'Artisans Locaux', label: 'Artisans Locaux', emoji: '🏺', description: "Transformez l'impact en gestes concrets", color: 'border-sky-500/40 bg-sky-500/10 text-sky-400' },
]

const getProjectDetailHref = (project: {
	id?: string | null
	slug?: string | null
	name?: string | null
}) => {
	const slug = project.slug?.trim()
	if (slug) return `/projects/${slug}`

	const id = project.id?.trim()
	if (id) return `/projects/${id}`

	const name = project.name?.trim()
	if (name) return `/projects?search=${encodeURIComponent(name)}&status=active`

	return '/projects?status=active'
}

export function BiodexEnhanced({ species, initialFaction }: BiodexEnhancedProps) {
	const t = useTranslations('marketing_pages.biodex')
	const [selectedLockedSpecies, setSelectedLockedSpecies] =
		useState<SpeciesContext | null>(null)
	const [showFactionModal, setShowFactionModal] = useState(false)
	const [selectedFaction, setSelectedFaction] = useState<string | null>(null)

	// Afficher la modale faction si l'utilisateur n'en a pas (retour Magic Link)
	useEffect(() => {
		if (!initialFaction && typeof window !== 'undefined') {
			const dismissed = sessionStorage.getItem('faction-onboarding-dismissed')
			if (!dismissed) {
				const timer = setTimeout(() => setShowFactionModal(true), 800)
				return () => clearTimeout(timer)
			}
		}
	}, [initialFaction])

	const handleDismissFactionModal = () => {
		sessionStorage.setItem('faction-onboarding-dismissed', '1')
		setShowFactionModal(false)
	}

	const sortedSpecies = useMemo(() => {
		return [...species].sort((a, b) => {
			const aUnlocked = a.user_status?.isUnlocked ?? false
			const bUnlocked = b.user_status?.isUnlocked ?? false
			if (aUnlocked && !bUnlocked) return -1
			if (!aUnlocked && bUnlocked) return 1
			return a.name_default.localeCompare(b.name_default, 'fr')
		})
	}, [species])

	const unlockedCount = sortedSpecies.filter((s) => s.user_status?.isUnlocked).length
	const totalCount = species.length
	const progressPercent = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0

	const actionableProjects =
		selectedLockedSpecies?.associated_projects &&
		selectedLockedSpecies.associated_projects.length > 0
			? selectedLockedSpecies.associated_projects
			: FALLBACK_SPECIES_PROJECTS

	return (
		<>
			{/* Inline Header */}
			<div className='w-full px-4 sm:px-6 pt-6 pb-5'>
				<h1 className='text-3xl font-bold tracking-tight text-white mb-1'>Mon BioDex</h1>
				<p className='text-sm text-white/50 mb-4'>Espèces sauvées grâce à vos dons</p>
				<div className='flex items-center gap-3'>
					<div className='flex-1 relative h-1.5 rounded-full bg-white/10 overflow-hidden'>
						<div
							className='absolute inset-y-0 left-0 bg-gradient-to-r from-lime-500 to-emerald-500 rounded-full transition-all duration-700 ease-out'
							style={{ width: `${progressPercent}%` }}
						/>
					</div>
					<span className='text-xs font-semibold text-white/50 tabular-nums shrink-0'>
						{unlockedCount} / {totalCount}
					</span>
				</div>
			</div>

			{/* Grid */}
			<div className='w-full px-4 pb-36 pt-2'>
				{sortedSpecies.length > 0 ? (
					<div className='grid grid-cols-2 gap-3'>
						{sortedSpecies.map((item) => (
							<SpeciesCardEnhanced
								key={item.id}
								species={item}
								onLockedClick={(lockedSpecies) => setSelectedLockedSpecies(lockedSpecies)}
							/>
						))}
					</div>
				) : (
					<div className='flex min-h-[40vh] items-center justify-center rounded-[3rem] border-2 border-dashed bg-muted/20 p-12 text-center animate-in fade-in zoom-in-95 duration-700'>
						<div className='space-y-4'>
							<div className='mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-muted'>
								<Leaf className='h-10 w-10 text-muted-foreground/30' />
							</div>
							<div className='space-y-2'>
								<p className='text-xl font-black tracking-tight'>{t('empty_title')}</p>
								<p className='mx-auto max-w-xs font-medium text-muted-foreground'>{t('empty_description')}</p>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Modale espèce verrouillée */}
			{selectedLockedSpecies ? (
				<div className='fixed inset-0 z-[80]'>
					<button
						type='button'
						aria-label='Fermer la modale'
						className='absolute inset-0 bg-black/70 backdrop-blur-md'
						onClick={() => setSelectedLockedSpecies(null)}
					/>
					<div className='absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-3xl border border-white/10 bg-[#0B0F15] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]'>
						<div className='mb-4 flex items-center justify-between'>
							<div className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1'>
								<Lock className='h-3.5 w-3.5 text-white/50' />
								<span className='text-[10px] font-bold uppercase tracking-widest text-white/50'>Espèce verrouillée</span>
							</div>
							<button
								type='button'
								onClick={() => setSelectedLockedSpecies(null)}
								className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70'
								aria-label='Fermer'
							>
								<X className='h-4 w-4' />
							</button>
						</div>
						<h3 className='text-2xl font-black tracking-tight text-white'>{selectedLockedSpecies.name_default}</h3>
						<p className='mt-2 text-sm leading-relaxed text-white/70'>
							Soutenez un projet lié à cette espèce pour la débloquer dans votre BioDex et découvrir sa fiche complète.
						</p>
						<div className='mt-5 space-y-3'>
							<p className='text-[11px] font-bold uppercase tracking-widest text-white/40'>Projets qui peuvent l'aider</p>
							{actionableProjects.map((project) => (
								<Link
									key={project.id}
									href={getProjectDetailHref(project)}
									className='block rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10'
									onClick={() => setSelectedLockedSpecies(null)}
								>
									<div className='flex items-start justify-between gap-3'>
										<div className='min-w-0'>
											<p className='truncate text-sm font-bold text-white'>{project.name}</p>
											<p className='mt-1 text-xs text-white/50'>{project.impact ?? "Contribuez à la protection de cette espèce"}</p>
										</div>
										<ArrowRight className='mt-0.5 h-4 w-4 shrink-0 text-lime-400' />
									</div>
								</Link>
							))}
						</div>
						<Link
							href='/projects?status=active'
							onClick={() => setSelectedLockedSpecies(null)}
							className='mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-lime-400 text-base font-black text-black active:scale-[0.98]'
						>
							Voir les projets <ArrowRight className='h-4 w-4' />
						</Link>
					</div>
				</div>
			) : null}

			{/* ── MICRO-ONBOARDING FACTION (Post-Magic Link) ── */}
			{showFactionModal && (
				<div className='fixed inset-0 z-[90]'>
					<button
						type='button'
						aria-label='Ignorer'
						className='absolute inset-0 bg-black/60 backdrop-blur-sm'
						onClick={handleDismissFactionModal}
					/>
					<div className='absolute inset-x-0 bottom-0 animate-in slide-in-from-bottom-4 duration-500 rounded-t-3xl border-t border-white/10 bg-[#0D1117] p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]'>
						<div className='mx-auto mb-5 h-1 w-10 rounded-full bg-white/20' />
						<div className='mb-2 flex items-start justify-between'>
							<div>
								<p className='text-[10px] font-bold uppercase tracking-[0.22em] text-lime-400'>Bienvenue dans le mouvement</p>
								<h2 className='mt-1 text-2xl font-black tracking-tight text-white'>Choisissez votre Faction</h2>
								<p className='mt-1 text-sm text-white/50'>Pour dépenser vos points et rejoindre les classements.</p>
							</div>
							<button
								type='button'
								onClick={handleDismissFactionModal}
								className='inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60'
								aria-label='Plus tard'
							>
								<X className='h-4 w-4' />
							</button>
						</div>
						<div className='mt-5 space-y-2.5'>
							{FACTIONS.map((faction) => (
								<button
									key={faction.key}
									type='button'
									onClick={() => setSelectedFaction(faction.key)}
									className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all active:scale-[0.98] ${
										selectedFaction === faction.key ? faction.color : 'border-white/10 bg-white/5 text-white/80'
									}`}
								>
									<span className='text-2xl'>{faction.emoji}</span>
									<div className='min-w-0 flex-1'>
										<p className='font-bold text-white'>{faction.label}</p>
										<p className='text-xs text-white/50'>{faction.description}</p>
									</div>
									{selectedFaction === faction.key && <Sparkles className='h-4 w-4 shrink-0 text-current' />}
								</button>
							))}
						</div>
						<Link
							href={selectedFaction ? `/welcome/setup?faction=${encodeURIComponent(selectedFaction)}` : '/welcome/setup'}
							onClick={() => sessionStorage.setItem('faction-onboarding-dismissed', '1')}
							className={`mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-black transition-all active:scale-[0.98] ${
								selectedFaction ? 'bg-lime-400 text-black shadow-[0_0_25px_rgba(163,230,53,0.35)]' : 'bg-white/10 text-white/50'
							}`}
						>
							{selectedFaction ? `Rejoindre ${selectedFaction}` : 'Choisir ma faction'}
							<ArrowRight className='h-5 w-5' />
						</Link>
						<button
							type='button'
							onClick={handleDismissFactionModal}
							className='mt-3 w-full py-2 text-sm text-white/30 transition-colors hover:text-white/50'
						>
							Plus tard
						</button>
					</div>
				</div>
			)}
		</>
	)
}
