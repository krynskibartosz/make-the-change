import type { SpeciesContext } from '@/types/species'

const IUCN_QUICK_LABELS: Record<string, string> = {
  CR: 'En danger critique',
  EN: 'En danger',
  VU: 'Vulnérable',
  NT: 'Quasi menacé',
  LC: 'Préoccupation mineure',
  DD: 'Données locales limitées',
  EW: "Éteint à l'état sauvage",
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

  const rows: { label: string; value: string }[] = []
  if (species.origin_country) rows.push({ label: 'Origine', value: species.origin_country })
  if (dietLabel) rows.push({ label: 'Régime', value: dietLabel })
  if (sizeLabel) rows.push({ label: 'Taille / Poids', value: sizeLabel })
  rows.push({ label: 'Statut', value: statusLabel })

  return (
    <section className='mx-5'>
      <p className='mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-white/35'>
        Repères
      </p>
      <div className='divide-y divide-white/[0.06]'>
        {rows.map((row) => (
          <div key={row.label} className='flex items-center justify-between py-2.5'>
            <p className='text-xs text-white/40'>{row.label}</p>
            <p className='text-sm font-semibold text-white/80'>{row.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
