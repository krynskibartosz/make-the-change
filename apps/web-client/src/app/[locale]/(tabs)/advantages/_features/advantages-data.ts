import {
  type Advantage,
  getMockAdvantages,
} from '@/app/[locale]/(screens)/advantages/_features/mock-advantages'
import { HABEEBEE_PATHS } from '@/lib/media/habeebee'
import { ILANGA_PATHS } from '@/lib/media/ilanga'
import { MOCK_PRODUCER_HABEEBEE_SLUG, MOCK_PRODUCER_ILANGA_SLUG } from '@/lib/mock/mock-ids'

export type AdvantageCategory = {
  id: 'discount' | 'experience'
  title: string
  description: string
  href: string
}

export type AdvantagePartner = {
  id: string
  name: string
  description: string
  location: string
  imageUrl: string
  href: string
}

export type AdvantagesData = {
  availableAdvantages: Advantage[]
  categories: AdvantageCategory[]
  partners: AdvantagePartner[]
}

export function getAdvantagesData(): AdvantagesData {
  return {
    availableAdvantages: getMockAdvantages(),
    categories: [
      {
        id: 'discount',
        title: 'Réductions partenaires',
        description: 'Débloque une remise appliquée au checkout Make the Change.',
        href: '/advantages/catalog?type=discount',
      },
      {
        id: 'experience',
        title: 'Expériences',
        description: 'Rencontres terrain à venir, sur disponibilité confirmée.',
        href: '/advantages/catalog?type=experience',
      },
    ],
    partners: [
      {
        id: 'ilanga',
        name: 'Ilanga Nature',
        description: 'Miels et filière apicole sélectionnés pour la boutique partenaire.',
        location: 'Mariembourg, Belgique',
        imageUrl: ILANGA_PATHS.identity.portrait,
        href: `/producers/${MOCK_PRODUCER_ILANGA_SLUG}`,
      },
      {
        id: 'habeebee',
        name: 'Habeebee',
        description: 'Soins artisanaux et futures rencontres autour de la ruche.',
        location: 'Bruxelles, Belgique',
        imageUrl: HABEEBEE_PATHS.identity.portrait,
        href: `/producers/${MOCK_PRODUCER_HABEEBEE_SLUG}`,
      },
    ],
  }
}
