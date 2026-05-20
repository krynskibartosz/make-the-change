import type { SpeciesContext } from '@/types/species'

function formatDiet(diet: string): string {
  const d = diet.toLowerCase()
  if (d.includes('nectarivore') && d.includes('pollinivore')) return 'Nectar & pollen'
  if (d.includes('insectivore')) return 'Insectes'
  if (d.includes('herbivore')) return 'Végétaux'
  if (d.includes('carnivore')) return 'Carnivore'
  if (d.includes('omnivore')) return 'Omnivore'
  return diet
}

function getMainHabitat(habitats: string[]): string | null {
  const simple = habitats.find((h) => !h.includes('(Z'))
  return simple ?? (habitats[0] ?? null)
}

interface SpeciesQuickStatsProps {
  species: SpeciesContext
}

export function SpeciesQuickStats({ species }: SpeciesQuickStatsProps) {
  const hasAny =
    species.origin_country || species.diet || species.size || (species.habitat?.length ?? 0) > 0
  if (!hasAny) return null

  const dietLabel = species.diet ? formatDiet(species.diet) : null

  const sizeLabel = (() => {
    if (species.size && species.weight) return `${species.size} · ${species.weight}`
    if (species.size) return species.size
    if (species.weight) return species.weight
    return null
  })()

  const habitatLabel = getMainHabitat(species.habitat ?? [])

  const rows: { label: string; value: string }[] = []
  if (species.origin_country) rows.push({ label: 'Origine', value: species.origin_country })
  if (dietLabel) rows.push({ label: 'Régime', value: dietLabel })
  if (sizeLabel) rows.push({ label: 'Taille / Poids', value: sizeLabel })
  if (habitatLabel) rows.push({ label: 'Habitat', value: habitatLabel })

  return (
    <section className='mx-5'>
      <p className='mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-white/35'>
        Repères
      </p>
      <div className='divide-y divide-white/[0.06]'>
        {rows.map((row) => (
          <div key={row.label} className='flex items-start justify-between gap-4 py-2.5'>
            <p className='shrink-0 text-xs text-white/40'>{row.label}</p>
            <p className='text-right text-sm font-semibold text-white/80'>{row.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
