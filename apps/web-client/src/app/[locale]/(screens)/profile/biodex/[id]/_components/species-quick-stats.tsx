import type { SpeciesContext } from '@/types/species'

const IUCN_QUICK_LABELS: Record<string, string> = {
  CR: 'En danger critique',
  EN: 'En danger',
  VU: 'Vulnérable',
  NT: 'Quasi menacé',
  LC: 'Préoccupation mineure',
  DD: 'Données locales limitées',
  EW: 'Éteint à l\'état sauvage',
  EX: 'Éteint',
}

function formatDiet(diet: string): string {
  const d = diet.toLowerCase()
  if (d.includes('nectarivore') && d.includes('pollinivore')) return 'Nectar & pollen'
  if (d.includes('insectivore')) return 'Insectes'
  if (d.includes('herbivore')) return 'Végétaux'
  if (d.includes('carnivore')) return 'Carnivore'
  if (d.includes('omnivore')) return 'Omnivore'
  return diet
}

interface StatCardProps {
  label: string
  value: string
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className='rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3'>
      <p className='text-[10px] font-black uppercase tracking-[0.14em] text-white/30'>{label}</p>
      <p className='mt-1 text-sm font-semibold text-white/80'>{value}</p>
    </div>
  )
}

interface SpeciesQuickStatsProps {
  species: SpeciesContext
}

export function SpeciesQuickStats({ species }: SpeciesQuickStatsProps) {
  const hasAny =
    species.origin_country || species.diet || species.size || species.conservation_status
  if (!hasAny) return null

  const statusLabel = species.conservation_status
    ? (IUCN_QUICK_LABELS[species.conservation_status] ?? 'À documenter')
    : 'À documenter'

  const dietLabel = species.diet ? formatDiet(species.diet) : null

  const sizeLabel = (() => {
    if (species.size && species.weight) return `${species.size} · ${species.weight}`
    if (species.size) return species.size
    if (species.weight) return species.weight
    return null
  })()

  const cards: { label: string; value: string }[] = []
  if (species.origin_country) cards.push({ label: 'Origine', value: species.origin_country })
  if (dietLabel) cards.push({ label: 'Régime', value: dietLabel })
  if (sizeLabel) cards.push({ label: 'Taille / Poids', value: sizeLabel })
  cards.push({ label: 'Statut', value: statusLabel })

  return (
    <section className='mx-5'>
      <p className='mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-white/35'>
        Repères
      </p>
      <div className='grid grid-cols-2 gap-2'>
        {cards.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} />
        ))}
      </div>
    </section>
  )
}
