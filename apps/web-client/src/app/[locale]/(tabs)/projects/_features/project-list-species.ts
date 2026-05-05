export type ProjectListSpeciesSeed = {
  id: string
  name: string
  icon: string | null
}

export type ProjectSpeciesPreview = {
  id: string
  name: string
  imageUrl: string | null
  isUnlocked: boolean | null
}

type ProjectSpeciesPreviewProject = {
  id: string | null
  slug: string | null
  species?: ProjectListSpeciesSeed[] | null
}

type BiodexAssociatedProject = {
  id?: string | null
  slug?: string | null
}

type BiodexSpeciesSource = {
  id: string
  name_default: string
  image_url: string | null
  associated_projects: BiodexAssociatedProject[] | null
  user_status: { isUnlocked?: boolean } | null
}

export function getProjectSpeciesPreviews(
  project: ProjectSpeciesPreviewProject,
  biodexSpecies: BiodexSpeciesSource[],
): ProjectSpeciesPreview[] {
  const associatedSpecies = biodexSpecies
    .filter((species) => isSpeciesAssociatedWithProject(species, project))
    .map((species) => ({
      id: species.id,
      name: species.name_default,
      imageUrl: species.image_url,
      isUnlocked: Boolean(species.user_status?.isUnlocked),
    }))

  if (associatedSpecies.length > 0) {
    return dedupeSpeciesPreviews(associatedSpecies)
  }

  return dedupeSpeciesPreviews(
    (project.species || []).map((species) => ({
      id: species.id,
      name: species.name,
      imageUrl: species.icon,
      isUnlocked: null,
    })),
  )
}

function isSpeciesAssociatedWithProject(
  species: BiodexSpeciesSource,
  project: ProjectSpeciesPreviewProject,
) {
  return Boolean(
    species.associated_projects?.some((associatedProject) => {
      const sameSlug = project.slug && associatedProject.slug === project.slug
      const sameId = project.id && associatedProject.id === project.id
      return sameSlug || sameId
    }),
  )
}

function dedupeSpeciesPreviews(species: ProjectSpeciesPreview[]): ProjectSpeciesPreview[] {
  const seen = new Set<string>()
  return species.filter((entry) => {
    if (seen.has(entry.id)) {
      return false
    }
    seen.add(entry.id)
    return true
  })
}
