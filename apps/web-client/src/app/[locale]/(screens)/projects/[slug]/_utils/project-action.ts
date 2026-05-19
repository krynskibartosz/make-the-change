type ProjectPrimaryActionInput = {
  slug: string
  type?: string | null
  is_donation_project?: boolean | null
  donation_options?: unknown[] | null
}

type ProjectPrimaryActionKind = 'donation' | 'support'

export type ProjectPrimaryAction = {
  href: string
  label: string
  kind: ProjectPrimaryActionKind
}

export function getProjectPrimaryAction(
  project: ProjectPrimaryActionInput,
  source?: string,
): ProjectPrimaryAction {
  const hasDonationOptions = Array.isArray(project.donation_options) && project.donation_options.length > 0
  const isDonation = Boolean(project.is_donation_project || hasDonationOptions || project.type === 'reef' || project.type === 'coral')
  const baseHref = `/projects/${project.slug}/${isDonation ? 'donate' : 'support'}`
  const href = source ? `${baseHref}?source=${encodeURIComponent(source)}` : baseHref

  return {
    href,
    label: isDonation ? 'Faire un don' : 'Soutenir ce projet',
    kind: isDonation ? 'donation' : 'support',
  }
}
