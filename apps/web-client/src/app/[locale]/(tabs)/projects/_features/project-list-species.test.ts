import { describe, expect, it } from 'vitest'
import { getProjectSpeciesPreviews } from './project-list-species'

describe('getProjectSpeciesPreviews', () => {
  it('uses BioDex associated projects to expose linked species on project cards', () => {
    const previews = getProjectSpeciesPreviews(
      {
        id: 'project-1',
        slug: 'ruchers-antsirabe',
        species: null,
      },
      [
        {
          id: 'black-bee',
          name_default: 'Abeille Noire',
          image_url: '/images/diaromas/abeille-noire.png',
          user_status: { isUnlocked: false },
          associated_projects: [
            {
              id: 'other-project',
              slug: 'other',
            },
            {
              id: 'project-1',
              slug: 'ruchers-antsirabe',
            },
          ],
        },
      ],
    )

    expect(previews).toEqual([
      {
        id: 'black-bee',
        name: 'Abeille Noire',
        imageUrl: '/images/diaromas/abeille-noire.png',
        isUnlocked: false,
      },
    ])
  })

  it('falls back to project species when no BioDex association is available', () => {
    const previews = getProjectSpeciesPreviews(
      {
        id: 'project-1',
        slug: 'ruchers-antsirabe',
        species: [
          {
            id: 'black-bee',
            name: 'Abeille Noire',
            icon: '/images/diaromas/abeille-noire.png',
          },
        ],
      },
      [],
    )

    expect(previews).toEqual([
      {
        id: 'black-bee',
        name: 'Abeille Noire',
        imageUrl: '/images/diaromas/abeille-noire.png',
        isUnlocked: null,
      },
    ])
  })
})
