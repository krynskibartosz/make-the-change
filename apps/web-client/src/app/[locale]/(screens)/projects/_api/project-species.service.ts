import { isMockDataSource } from '@/lib/mock/data-source'
import { getMockSpeciesContextList } from '@/lib/mock/mock-biodex'
import { createClient } from '@/lib/supabase/server'
import { asString, isRecord } from '@/lib/type-guards'
import type { ProjectSpecies } from '../_types/project'

function conservationStatusToRarity(status: string): number {
  const s = status?.toUpperCase() ?? ''
  if (s === 'EX' || s === 'EW') return 10
  if (s === 'CR') return 9
  if (s === 'EN') return 8
  if (s === 'VU') return 7
  if (s === 'NT') return 6
  return 4
}

export async function getSpeciesForProject(
  projectSlug: string,
  projectId?: string,
): Promise<ProjectSpecies[]> {
  if (isMockDataSource) {
    const allSpecies = await getMockSpeciesContextList(null, null)

    return allSpecies
      .filter((species) =>
        species.associated_projects?.some(
          (ap) => ap.slug === projectSlug || (projectId && ap.id === projectId),
        ),
      )
      .map((species) => {
        const assocProject = species.associated_projects?.find(
          (ap) => ap.slug === projectSlug || (projectId && ap.id === projectId),
        )
        return {
          id: species.id,
          name: species.name_default,
          scientificName: species.scientific_name ?? '',
          icon: species.image_url,
          rarity: conservationStatusToRarity(species.conservation_status ?? ''),
          status: species.conservation_status ?? '',
          role: assocProject?.role ?? '',
        }
      })
  }

  const supabase = await createClient()
  const { data, error } = await supabase.from('v_species_context').select('*')

  if (error) {
    console.error('[project-species] fetch failed', error)
    return []
  }

  if (!Array.isArray(data)) return []

  return data
    .filter((row) => {
      if (!isRecord(row)) return false
      const projects = row.associated_projects
      if (!Array.isArray(projects)) return false
      return projects.some((ap: unknown) => {
        if (!isRecord(ap)) return false
        const slug = asString(ap.slug)
        const id = asString(ap.id)
        return slug === projectSlug || (Boolean(projectId) && id === projectId)
      })
    })
    .map((row) => {
      const projects = Array.isArray(row.associated_projects) ? row.associated_projects : []
      const assocProject = projects.find((ap: unknown) => {
        if (!isRecord(ap)) return false
        const slug = asString(ap.slug)
        const id = asString(ap.id)
        return slug === projectSlug || (Boolean(projectId) && id === projectId)
      })
      return {
        id: asString(row.id) ?? '',
        name: asString(row.name_default) ?? '',
        scientificName: asString(row.scientific_name) ?? '',
        icon: asString(row.image_url) ?? null,
        rarity: conservationStatusToRarity(asString(row.conservation_status) ?? ''),
        status: asString(row.conservation_status) ?? '',
        role: isRecord(assocProject) ? (asString(assocProject.role) ?? '') : '',
      }
    })
    .filter((s) => s.id && s.name)
}
