import { MOCK_PROJECTS } from './mock-projects'
import type { DonationOption } from '@/types/context'

export const getDonationOptionsByProjectId = (projectId: string): DonationOption[] => {
  const project = MOCK_PROJECTS.find((p) => p.id === projectId)
  return project?.donation_options || []
}

export const getDonationOptionById = (optionId: string): DonationOption | null => {
  for (const project of MOCK_PROJECTS) {
    const option = project.donation_options?.find((o) => o.id === optionId)
    if (option) return option
  }
  return null
}
