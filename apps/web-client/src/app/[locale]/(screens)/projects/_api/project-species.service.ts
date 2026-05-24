import { unstable_cache } from 'next/cache'
import { getMockSpeciesContextList } from '@/lib/mock/mock-biodex'
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

async function _getSpeciesForProject(
  projectSlug: string,
  projectId?: string,
): Promise<ProjectSpecies[]> {
  const allSpecies = await getMockSpeciesContextList(null, null)

  return allSpecies
    .filter((species) =>
      species.associated_projects?.some(
        (associatedProject) =>
          associatedProject.slug === projectSlug ||
          (projectId && associatedProject.id === projectId),
      ),
    )
    .map((species) => {
      const associatedProject = species.associated_projects?.find(
        (entry) => entry.slug === projectSlug || (projectId && entry.id === projectId),
      )

      return {
        id: species.id,
        name: species.name_default,
        scientificName: species.scientific_name ?? '',
        icon: species.image_url,
        rarity: conservationStatusToRarity(species.conservation_status ?? ''),
        status: species.conservation_status ?? '',
        role: associatedProject?.role ?? '',
      }
    })
}

export const getSpeciesForProject = unstable_cache(
  _getSpeciesForProject,
  ['project-species'],
  { revalidate: 3600, tags: ['projects-list'] },
)
