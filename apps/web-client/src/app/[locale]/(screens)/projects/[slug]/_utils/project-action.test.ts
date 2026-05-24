import { describe, expect, it } from 'vitest'
import { getProjectPrimaryAction } from './project-action'

describe('getProjectPrimaryAction', () => {
  it('routes donation projects to the donation flow', () => {
    expect(
      getProjectPrimaryAction({
        slug: 'coraux-karimunjawa',
        is_donation_project: true,
        donation_options: [{ id: 'donation-1' }],
      }),
    ).toEqual({
      href: '/projects/coraux-karimunjawa/contribute',
      label: 'Faire un don',
      kind: 'donation',
    })
  })

  it('routes producer projects to the support flow', () => {
    expect(
      getProjectPrimaryAction({
        slug: 'antsirabe',
        type: 'beehive',
      }),
    ).toEqual({
      href: '/projects/antsirabe/support',
      label: 'Soutenir ce projet',
      kind: 'support',
    })
  })
})
