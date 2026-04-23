'use client'

import { ArrowLeft, ArrowRight, Leaf, Lock, Sparkles, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { SpeciesCardEnhanced } from './species-card-enhanced'
import type { SpeciesContext } from '@/types/context'
import { Link } from '@/i18n/navigation'
import { FactionCarousel } from '@/app/[locale]/(auth)/_features/faction-carousel'
import { useRouter } from '@/i18n/navigation'
import { getFactionTheme, resolveFactionThemeKey, type FactionTheme } from '@/lib/faction-theme'
import { getClientMockViewerSession } from '@/lib/mock/mock-session'
import type { Faction } from '@/lib/mock/types'
import { cn } from '@/lib/utils'

const FALLBACK_SPECIES_PROJECTS = [
	{
		id: 'fallback-1',
		name: 'Protection des abeilles sauvages',
		impact: 'Contribuez à la protection de cette espèce',
		species_ids: ['bee-1'],
	},
	{
		id: 'fallback-2',
		name: 'Restauration des habitats forestiers',
		impact: 'Contribuez à la protection de cette espèce',
		species_ids: ['owl-1'],
	},
]

interface BiodexEnhancedProps {
	species: SpeciesContext[]
	initialFaction: Faction | null
}

export function BiodexEnhanced({ species, initialFaction }: BiodexEnhancedProps) {
	const t = useTranslations()
	const router = useRouter()
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedLockedSpecies, setSelectedLockedSpecies] = useState<SpeciesContext | null>(null)
	const [showFactionModal, setShowFactionModal] = useState(false)

	const session = getClientMockViewerSession()
	const userFaction = session?.faction ?? initialFaction

	const factionThemeKey = resolveFactionThemeKey(userFaction)
	const factionTheme = getFactionTheme(factionThemeKey)

	// Micro-onboarding: afficher FactionCarousel si l'utilisateur vient de se connecter via Magic Link et n'a pas encore choisi de faction
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search)
		const justLoggedIn = urlParams.get('justLoggedIn') === 'true'
		const hasFaction = !!userFaction

		if (justLoggedIn && !hasFaction) {
			setShowFactionModal(true)
		}
	}, [userFaction])

	const handleFactionSelect = (faction: Faction) => {
		setShowFactionModal(false)
		// Redirection vers une page de confirmation ou continuation
		router.push('/onboarding/step-0')
	}

	// Filtrage des espèces
	const filteredSpecies = useMemo(() => {
		if (!searchQuery) return species
		const query = searchQuery.toLowerCase()
		return species.filter((s) => s.name_default.toLowerCase().includes(query))
	}, [species, searchQuery])

	// Tri: Unlocked → Locked → Alphabétique
	const sortedSpecies = useMemo(() => {
		return [...filteredSpecies].sort((a, b) => {
			// D'abord par statut de déverrouillage
			if (a.user_status?.isUnlocked && !b.user_status?.isUnlocked) return -1
			if (!a.user_status?.isUnlocked && b.user_status?.isUnlocked) return 1

			// Ensuite par ordre alphabétique
			return a.name_default.localeCompare(b.name_default)
		})
	}, [filteredSpecies])

	// Projets actionnables pour une espèce verrouillée
	const actionableProjects = useMemo(() => {
		if (!selectedLockedSpecies) return []
		// En production, filtrer les projets réellement liés à cette espèce
		return FALLBACK_SPECIES_PROJECTS
	}, [selectedLockedSpecies])

	const getProjectDetailHref = (project: { id: string }) => `/projects/${project.id}`

	return (
		<>
			{/* Header avec navigation */}
			<div className='sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5 pt-[max(env(safe-area-inset-top),1rem)]'>
				<div className='px-2 sm:px-3'>
					<div className='flex items-center gap-3 py-3'>
						<Link
							href='/'
							className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70'
						>
							<ArrowLeft className='h-4 w-4' />
						</Link>
						<div className='flex-1'>
							<h1 className='text-lg font-black text-white'>{t('biodex.title')}</h1>
							<p className='text-xs text-white/50'>
								{sortedSpecies.filter((s) => s.user_status?.isUnlocked).length} / {sortedSpecies.length} {t('biodex.unlocked')}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Barre de recherche */}
			<div className='px-2 sm:px-3 py-4'>
				<div className='relative'>
					<Sparkles className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30' />
					<input
						type='text'
						placeholder={t('biodex.searchPlaceholder')}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-lime-400/50 focus:outline-none focus:ring-1 focus:ring-lime-400/50'
					/>
				</div>
			</div>

			{/* Grille d'espèces */}
			<div className='px-2 sm:px-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]'>
				{sortedSpecies.length === 0 ? (
					<div className='flex flex-col items-center justify-center py-16'>
						<Leaf className='h-12 w-12 text-white/20 mb-4' />
						<p className='text-sm text-white/50'>{t('biodex.noResults')}</p>
					</div>
				) : (
					<div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6'>
						{sortedSpecies.map((speciesItem) => (
							<SpeciesCardEnhanced
								key={speciesItem.id}
								species={speciesItem}
								showUserStatus
								onLockedClick={setSelectedLockedSpecies}
							/>
						))}
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

			{/* Micro-onboarding faction (post-Magic Link) */}
			{showFactionModal && <FactionCarousel onFactionSelect={handleFactionSelect} />}
		</>
	)
}
