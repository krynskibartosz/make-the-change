import { Bug, Droplets, Gift, Wind } from 'lucide-react'
import { CurrencyIcon } from '@/components/currency'
import { Link } from '@/i18n/navigation'
import { getBiodexPreviewData } from '@/lib/api/biodex-preview.service'

import { getFactionThemeByKey } from '@/lib/faction-theme'
import { TabScreen } from '@/app/[locale]/(tabs)/_components/tab-screen'
import { ProfileSettingsHeader } from '@/app/[locale]/(tabs)/profile/_components/profile-settings-header'
import { BioDexCard } from '@/app/[locale]/(tabs)/_components/biodex-card'
import { ImpactCard } from '@/app/[locale]/(tabs)/profile/_components/impact-card'

function FactionMascotSelector() {
  const factions = [
    { id: 'pollinisateurs', name: 'Melli', image: '/images/mascots/melli.png' },
    { id: 'forets', name: 'Sylva', image: '/images/mascots/sylva.png' },
    { id: 'mers', name: 'Ondine', image: '/images/mascots/ondine.png' },
  ]

  return (
    <ul className="mt-10 flex gap-4 mb-6 m-0 p-0 list-none">
      {factions.map((faction) => (
        <li key={faction.id}>
          <Link
            href={`/onboarding/step-2?preselected=${faction.id}`}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-24 h-24 rounded-full border border-white/10 bg-white/5 p-2 shadow-lg transition-all hover:scale-105 hover:bg-white/10 hover:border-white/20 animate-[float_3s_ease-in-out_infinite]">
              <img src={faction.image} alt={faction.name} className="w-full h-full object-contain" />
            </div>
            <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors">
              {faction.name}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default async function GuestProfile() {
  const { lockedSpecies } = await getBiodexPreviewData({
    unlockedLimit: 0,
    lockedLimit: 4,
  })


  return (
    <TabScreen header={<ProfileSettingsHeader href="/profile/settings" />}>
      <div className="min-h-screen text-white">
        <main className="mx-auto w-full max-w-3xl">
        <section className="flex flex-col items-center px-5 pb-6 pt-8">
          <h1 className="mb-4 text-center text-2xl font-black tracking-tight text-white">L&apos;Aventure vous attend</h1>
          <p className="mx-auto mt-2 max-w-[280px] text-center text-sm leading-relaxed text-white/60">
            Choisissez votre compagnon pour débloquer votre BioDex, suivre votre parcours et rejoindre l'effort collectif.
          </p>
          <FactionMascotSelector />
          <Link
            href="/login"
            className="mt-6 mb-6 text-sm text-white/40 hover:text-white/60 underline underline-offset-4 transition-colors"
          >
            Déjà un Gardien ? Se connecter
          </Link>
        </section>

        <ul className="mx-5 mb-8 grid grid-cols-2 gap-3 m-0 p-0 list-none">
          <li>
            <ImpactCard variant="locked" icon={<Bug className="h-5 w-5 text-amber-400" aria-hidden="true" />} label="ESPÈCES LIÉES" />
          </li>
          <li>
            <ImpactCard variant="locked" icon={<Droplets className="h-5 w-5 text-orange-400" aria-hidden="true" />} label="RÉCOLTE ESTIMÉE" />
          </li>
          <li>
            <ImpactCard variant="locked" icon={<Wind className="h-5 w-5 text-blue-400" aria-hidden="true" />} label="CO₂ ASSOCIÉ" />
          </li>
          <li>
            <ImpactCard
              variant="locked"
              icon={<CurrencyIcon kind="impactCredits" className="h-5 w-5 text-amber-400" />}
              value="—"
              label="CRÉDITS IMPACT"
            />
          </li>
        </ul>

        <section className="mb-2">
          <h2 className="mb-3 px-5 text-lg font-bold text-white">Découvrez le BioDex</h2>

          <ul aria-label="Aperçu du BioDex" className="hide-scrollbar flex list-none snap-x gap-4 overflow-x-auto px-5 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden m-0 p-0">
            {lockedSpecies.map((species) => (
              <li key={species.id}>
                <BioDexCard
                  species={species}
                  variant="locked"
                  href="/onboarding/step-0"
                />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
    </TabScreen>
  )
}
