import {
  MOCK_CHALLENGE_COLLECTIVE_BRAVO_ID,
  MOCK_CHALLENGE_DAILY_HARVEST_ID,
  MOCK_CHALLENGE_ECO_FACT_ID,
  MOCK_PRODUCT_EUCALYPTUS_ID,
  MOCK_PRODUCT_MANAKARA_ID,
  MOCK_PRODUCER_ILANGA_ID,
  MOCK_PROJECT_ANTSIRABE_ID,
  MOCK_PROJECT_ANTSIRABE_SLUG,
  MOCK_PROJECT_CORAL_ID,
  MOCK_PROJECT_CORAL_SLUG,
  MOCK_PROJECT_HABEEBEE_ID,
  MOCK_PROJECT_HABEEBEE_SLUG,
  MOCK_PROJECT_MANAKARA_ID,
  MOCK_PROJECT_MANAKARA_SLUG,
  MOCK_PROJECT_SARDINIA_ID,
  MOCK_PROJECT_SARDINIA_SLUG,
  MOCK_SPECIES_ACROPORA_ID,
  MOCK_SPECIES_BLACK_BEE_ID,
  MOCK_SPECIES_BLUE_DEMOISELLE_ID,
  MOCK_SPECIES_BUMBLEBEE_ID,
  MOCK_SPECIES_BUTTERFLYFISH_ID,
  MOCK_SPECIES_BUTTERFLY_CITRON_ID,
  MOCK_SPECIES_BUTTERFLY_PEACOCK_ID,
  MOCK_SPECIES_CHAMELEON_ID,
  MOCK_SPECIES_PANTHER_CHAMELEON_ID,
  MOCK_SPECIES_CLOWNFISH_ID,
  MOCK_SPECIES_CORAL_ID,
  MOCK_SPECIES_COUA_ID,
  MOCK_SPECIES_GECKO_ID,
  MOCK_SPECIES_GREEN_TURTLE_ID,
  MOCK_SPECIES_HEDGEHOG_ID,
  MOCK_SPECIES_HONEY_BEE_ID,
  MOCK_SPECIES_HOOPoe_ID,
  MOCK_SPECIES_INDRI_ID,
  MOCK_SPECIES_KINGFISHER_ID,
  MOCK_SPECIES_LADYBUG_ID,
  MOCK_SPECIES_LITTLE_OWL_ID,
  MOCK_SPECIES_MEGACHILE_ID,
  MOCK_SPECIES_OLIVE_TREE_ID,
  MOCK_SPECIES_OSMIA_ID,
  MOCK_SPECIES_OWL_ID,
  MOCK_SPECIES_SEAHORSE_ID,
  MOCK_SPECIES_SIFAKA_ID,
  MOCK_SPECIES_SYRPHID_ID,
  MOCK_SPECIES_TOMATO_FROG_ID,
  MOCK_SPECIES_VARI_ID,
  MOCK_SPECIES_WEEVIL_ID,
} from '@/lib/mock/mock-ids'
import type { Faction } from '@/lib/mock/types'
import type { SpeciesContext } from '@/types/context'

const createUserStatus = (isUnlocked: boolean, level: number) => ({
  isUnlocked,
  unlockedDate: isUnlocked ? '2026-04-02T09:00:00.000Z' : null,
  unlockSource: isUnlocked ? 'mock_participation_graph' : null,
  progressionLevel: level,
})

export const MOCK_SPECIES: SpeciesContext[] = [
  {
    id: MOCK_SPECIES_OWL_ID,
    name_default: 'Chouette Effraie',
    scientific_name: 'Tyto alba',
    description_default:
      'Gardienne nocturne des paysages agricoles vivants, elle aide a reguler naturellement les ecosystemes.',
    conservation_status: 'LC',
    image_url: '/images/diaromas/Chouette chevêche.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_ANTSIRABE_ID,
        slug: MOCK_PROJECT_ANTSIRABE_SLUG,
        name: "Ruchers d'apiculteurs independants a Antsirabe",
        type: 'beehive',
        role: 'Habitat indirect',
        impact: 'Les zones melliferes favorisent aussi les chaines ecologiques locales.',
        userParticipation: false,
      },
    ],
    associated_producers: [
      {
        id: MOCK_PRODUCER_ILANGA_ID,
        name: 'Ilanga Nature',
        location: 'Madagascar',
        relationship: 'Producteur partenaire',
        projectsCount: 2,
      },
    ],
    associated_challenges: [
      {
        id: MOCK_CHALLENGE_ECO_FACT_ID,
        name: 'Eco-Fact du jour',
        type: 'education',
        difficulty: 'easy',
        rewards: ['50 graines'],
        userProgress: 0,
      },
    ],
    user_status: createUserStatus(false, 1),
    habitat: ['Bocages', 'Vergers', 'Prairies'],
    threats: ['Disparition des haies', 'Artificialisation des sols'],
  },
  {
    id: MOCK_SPECIES_HONEY_BEE_ID,
    name_default: 'Abeille mellifere',
    scientific_name: 'Apis mellifera',
    description_default:
      'Pollinisatrice essentielle, elle soutient la reproduction de nombreuses plantes cultivees et sauvages.',
    conservation_status: 'NT',
    image_url: '/images/diaromas/Abeilles pollinisatrices.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_MANAKARA_ID,
        slug: MOCK_PROJECT_MANAKARA_SLUG,
        name: 'Miellerie de Manakara',
        type: 'beehive',
        role: 'Pollinisation',
        impact: "Le projet structure une apiculture durable autour de l'abeille noire et du miel local.",
        userParticipation: false,
      },
    ],
    associated_producers: [
      {
        id: MOCK_PRODUCER_ILANGA_ID,
        name: 'Ilanga Nature',
        location: 'Manakara',
        relationship: 'Producteur engage',
        projectsCount: 2,
      },
    ],
    associated_challenges: [
      {
        id: MOCK_CHALLENGE_DAILY_HARVEST_ID,
        name: 'Récolte quotidienne',
        type: 'daily_harvest',
        difficulty: 'easy',
        rewards: ['50 graines'],
        userProgress: 0,
      },
    ],
    user_status: createUserStatus(false, 1),
    habitat: ['Jardins', 'Prairies', 'Forets claires'],
    threats: ['Pesticides', 'Parasites', 'Uniformisation florale'],
  },
  {
    id: MOCK_SPECIES_BLACK_BEE_ID,
    name_default: 'Abeille Noire',
    scientific_name: 'Apis mellifera mellifera',
    description_default:
      'Espece emblematique des ecosystemes temperes, robuste et precieuse pour la biodiversite locale.',
    conservation_status: 'VU',
    image_url: '/images/diaromas/abeille noire.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_MANAKARA_ID,
        slug: MOCK_PROJECT_MANAKARA_SLUG,
        name: 'Miellerie de Manakara',
        type: 'beehive',
        role: 'Protection des pollinisateurs',
        impact: 'Renforce les pratiques agricoles favorables aux abeilles noires.',
        userParticipation: false,
      },
    ],
    associated_producers: [
      {
        id: MOCK_PRODUCER_ILANGA_ID,
        name: 'Ilanga Nature',
        location: 'Madagascar',
        relationship: 'Eleveur partenaire',
        projectsCount: 2,
      },
    ],
    associated_challenges: [
      {
        id: MOCK_CHALLENGE_COLLECTIVE_BRAVO_ID,
        name: "L'Esprit d'Equipe",
        type: 'social',
        difficulty: 'medium',
        rewards: ['100 graines'],
        userProgress: 0,
      },
    ],
    user_status: createUserStatus(false, 1),
    habitat: ['Lisieres', 'Prairies fleuries'],
    threats: ["Perte d'habitat", 'Pathogenes'],
  },
  {
    id: MOCK_SPECIES_LADYBUG_ID,
    name_default: 'Coccinelle a 7 points',
    scientific_name: 'Coccinella septempunctata',
    description_default:
      "Predatrice naturelle des pucerons, elle contribue a l'equilibre des cultures et des jardins.",
    conservation_status: 'LC',
    image_url: '/images/diaromas/Coccinelle.png',
    associated_projects: [],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Cultures', 'Jardins', 'Haies'],
    threats: ["Usage intensif d'intrants"],
  },
  // Espèces déjà définies mais non implémentés
  {
    id: MOCK_SPECIES_OLIVE_TREE_ID,
    name_default: 'Olivier',
    scientific_name: 'Olea europaea',
    description_default:
      'Arbre emblematique mediterraneen, pilier de lagriculture regenerative et de la biodiversite.',
    conservation_status: 'LC',
    image_url: '/images/diaromas/abeille noire.png', // À remplacer par image olivier quand disponible
    associated_projects: [
      {
        id: MOCK_PROJECT_SARDINIA_ID,
        slug: MOCK_PROJECT_SARDINIA_SLUG,
        name: 'Oliviers de Sardaigne',
        type: 'agroforestry',
        role: 'Espece principale',
        impact: 'Projet de regeneration agro-ecologique avec 10 000 oliviers.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Vergers', 'Paysages mediterraneens'],
    threats: ['Changement climatique', 'Abandon des terres'],
  },
  {
    id: MOCK_SPECIES_CORAL_ID,
    name_default: 'Coraux tropicaux',
    scientific_name: 'Scleractinia',
    description_default:
      'Fondateurs des recifs coralliens, ils abritent 25% des especes marines malgre 0.1% de locean.',
    conservation_status: 'CR',
    image_url: '/images/diaromas/Acropora  Corail corne de cerf.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_CORAL_ID,
        slug: MOCK_PROJECT_CORAL_SLUG,
        name: 'Restauration des recifs Karimunjawa',
        type: 'coral_restoration',
        role: 'Espece principale',
        impact: 'Restauration de fragments coralliens et reconstruction dhabitat marin.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Recifs coralliens', 'Eaux tropicales'],
    threats: ['Rechauffement climatique', 'Acidification des oceans', 'Pollution'],
  },
  {
    id: MOCK_SPECIES_BUMBLEBEE_ID,
    name_default: 'Bourdon terrestre',
    scientific_name: 'Bombus terrestris',
    description_default:
      'Pollinisateur robuste essentiel pour lagriculture europeenne, especially en climat tempere.',
    conservation_status: 'NT',
    image_url: '/images/diaromas/Bourdon terrestre.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_HABEEBEE_ID,
        slug: MOCK_PROJECT_HABEEBEE_SLUG,
        name: 'Habeebee Belgique',
        type: 'beehive',
        role: 'Pollinisateur principal',
        impact: 'Projet dancrage local des pollinisateurs en Belgique.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Prairies', 'Jardins', 'Cultures'],
    threats: ['Pesticides', 'Perte dhabitat'],
  },
  {
    id: MOCK_SPECIES_OSMIA_ID,
    name_default: 'Osmie rousse',
    scientific_name: 'Osmia rufa',
    description_default:
      'Abeille solitaire tres efficace pour la pollinisation des arbres fruitiers et petits fruits.',
    conservation_status: 'NT',
    image_url: '/images/diaromas/Osmie rousse.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_HABEEBEE_ID,
        slug: MOCK_PROJECT_HABEEBEE_SLUG,
        name: 'Habeebee Belgique',
        type: 'beehive',
        role: 'Pollinisateur complementaire',
        impact: 'Renforcement du reseau de pollinisateurs locaux.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Jardins', 'Vergers', 'Haies'],
    threats: ['Perte de sites de nidification'],
  },
  {
    id: MOCK_SPECIES_MEGACHILE_ID,
    name_default: 'Mégachile',
    scientific_name: 'Megachile sp.',
    description_default:
      'Abeille coupeuse de feuilles, excellente pollinisatrice pour les legumes et fleurs.',
    conservation_status: 'NT',
    image_url: '/images/diaromas/Mégachile.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_HABEEBEE_ID,
        slug: MOCK_PROJECT_HABEEBEE_SLUG,
        name: 'Habeebee Belgique',
        type: 'beehive',
        role: 'Pollinisateur specialise',
        impact: 'Diversification des espèces pollinisatrices.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Jardins', 'Prairies fleuries'],
    threats: ['Pesticides', 'Manque de materiaux de nidification'],
  },
  {
    id: MOCK_SPECIES_SYRPHID_ID,
    name_default: 'Syrphe ceinturé',
    scientific_name: 'Syrphus ribesii',
    description_default:
      'Mouche a fleurs imitant les abeilles, larves voraces de pucerons, adultes pollinisateurs.',
    conservation_status: 'LC',
    image_url: '/images/diaromas/Syrphe ceinturé.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_HABEEBEE_ID,
        slug: MOCK_PROJECT_HABEEBEE_SLUG,
        name: 'Habeebee Belgique',
        type: 'beehive',
        role: 'Pollinisateur auxiliaire',
        impact: 'Lutte biologique contre les pucerons et pollinisation.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Jardins', 'Prairies', 'Cultures'],
    threats: ['Pesticides'],
  },
  {
    id: MOCK_SPECIES_BUTTERFLY_CITRON_ID,
    name_default: 'Papillon citron',
    scientific_name: 'Gonepteryx rhamni',
    description_default:
      'Papillon elegant vert citron, pollinisateur des arbres a feuilles caduques et buissons.',
    conservation_status: 'LC',
    image_url: '/images/diaromas/Papillon citron.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_HABEEBEE_ID,
        slug: MOCK_PROJECT_HABEEBEE_SLUG,
        name: 'Habeebee Belgique',
        type: 'beehive',
        role: 'Pollinisateur esthetique',
        impact: 'Indicateur de biodiversite dans les haies et bosquets.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Haies', 'Bosquets', 'Jardins'],
    threats: ['Disparition des haies'],
  },
  {
    id: MOCK_SPECIES_BUTTERFLY_PEACOCK_ID,
    name_default: 'Paon-du-jour',
    scientific_name: 'Aglais io',
    description_default:
      'Papillon spectaculaire aux ailes ocellees, pollinisateur commun des jardins et prairies.',
    conservation_status: 'LC',
    image_url: '/images/diaromas/Paon-du-jour.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_HABEEBEE_ID,
        slug: MOCK_PROJECT_HABEEBEE_SLUG,
        name: 'Habeebee Belgique',
        type: 'beehive',
        role: 'Pollinisateur emblematique',
        impact: 'Symbole de la biodiversite des jardins europeens.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Jardins', 'Prairies', 'Bosquets'],
    threats: ['Pesticides', 'Disparition des orties (plante hote)'],
  },
  {
    id: MOCK_SPECIES_HEDGEHOG_ID,
    name_default: 'Hérisson européen',
    scientific_name: 'Erinaceus europaeus',
    description_default:
      'Petit mammifere insectivore, auxiliaire precious des jardins contre les limaces et insectes.',
    conservation_status: 'LC',
    image_url: '/images/diaromas/Hérisson européen.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_HABEEBEE_ID,
        slug: MOCK_PROJECT_HABEEBEE_SLUG,
        name: 'Habeebee Belgique',
        type: 'beehive',
        role: 'Faune auxiliaire',
        impact: 'Regulation naturelle des populations dinsectes nuisibles.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Jardins', 'Haies', 'Bocages'],
    threats: ['Routes', 'Pesticides', 'Fragmentation'],
  },
  // Espèces secondaires - Madagascar
  {
    id: MOCK_SPECIES_INDRI_ID,
    name_default: 'Indri',
    scientific_name: 'Indri indri',
    description_default:
      'Plus grand lémurien vivant, embleme des forets humides de Madagascar, chants uniques.',
    conservation_status: 'CR',
    image_url: '/images/diaromas/Indri.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_ANTSIRABE_ID,
        slug: MOCK_PROJECT_ANTSIRABE_SLUG,
        name: "Ruchers d'apiculteurs independants a Antsirabe",
        type: 'beehive',
        role: 'Espece secondaire',
        impact: 'Les zones melliferes preservent lhabitat des lémuriens.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Forets humides', 'Analamazaotra'],
    threats: ['Deforestation', 'Fragmentation'],
  },
  {
    id: MOCK_SPECIES_SIFAKA_ID,
    name_default: 'Sifaka diadème',
    scientific_name: 'Propithecus diadema',
    description_default:
      'Lémurien au pelage spectaculaire, acrobate des forets de Madagascar, espèce en danger critique.',
    conservation_status: 'CR',
    image_url: '/images/diaromas/Sifaka diadème.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_ANTSIRABE_ID,
        slug: MOCK_PROJECT_ANTSIRABE_SLUG,
        name: "Ruchers d'apiculteurs independants a Antsirabe",
        type: 'beehive',
        role: 'Espece secondaire',
        impact: 'Preservation des corridors forestiers.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Forets humides', 'Analamazaotra'],
    threats: ['Deforestation', 'Chasse'],
  },
  {
    id: MOCK_SPECIES_VARI_ID,
    name_default: 'Vari noir et blanc',
    scientific_name: 'Varecia variegata',
    description_default:
      'Lémurien au pelage noir et blanc distinctif, le plus grand des lémuriens diurnes.',
    conservation_status: 'CR',
    image_url: '/images/diaromas/Vari noir et blanc.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_ANTSIRABE_ID,
        slug: MOCK_PROJECT_ANTSIRABE_SLUG,
        name: "Ruchers d'apiculteurs independants a Antsirabe",
        type: 'beehive',
        role: 'Espece secondaire',
        impact: 'Protection des grandes forets continues.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Forets humides'],
    threats: ['Deforestation', 'Chasse', 'Captures'],
  },
  {
    id: MOCK_SPECIES_CHAMELEON_ID,
    name_default: 'Caméléon de Parson',
    scientific_name: 'Calumma parsonii',
    description_default:
      'Plus grand caméléon du monde, embleme de la faune unique de Madagascar.',
    conservation_status: 'VU',
    image_url: '/images/diaromas/Caméléon de Parson.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_ANTSIRABE_ID,
        slug: MOCK_PROJECT_ANTSIRABE_SLUG,
        name: "Ruchers d'apiculteurs independants a Antsirabe",
        type: 'beehive',
        role: 'Espece secondaire',
        impact: 'Indicateur de sante des forets.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Forets humides', 'Broussailles'],
    threats: ['Commerce international', 'Perte dhabitat'],
  },
  {
    id: MOCK_SPECIES_PANTHER_CHAMELEON_ID,
    name_default: 'Caméléon panthère',
    scientific_name: 'Furcifer pardalis',
    description_default:
      'Caméléon spectaculaire aux couleurs vibrantes, embleme de la biodiversite malgache.',
    conservation_status: 'LC',
    image_url: '/images/diaromas/Caméléon panthère.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_ANTSIRABE_ID,
        slug: MOCK_PROJECT_ANTSIRABE_SLUG,
        name: "Ruchers d'apiculteurs independants a Antsirabe",
        type: 'beehive',
        role: 'Espece secondaire',
        impact: 'Indicateur de la sante des ecosystemes forestiers.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Forets humides', 'Broussailles', 'Plantations'],
    threats: ['Commerce international', 'Perte dhabitat'],
  },
  {
    id: MOCK_SPECIES_WEEVIL_ID,
    name_default: 'Charançon girafe',
    scientific_name: 'Trachelophorus giraffa',
    description_default:
      'Insecte unique au long cou, endemique de Madagascar, symbole de ladaptation evolutive.',
    conservation_status: 'VU',
    image_url: '/images/diaromas/Charançon girafe.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_ANTSIRABE_ID,
        slug: MOCK_PROJECT_ANTSIRABE_SLUG,
        name: "Ruchers d'apiculteurs independants a Antsirabe",
        type: 'beehive',
        role: 'Espece secondaire',
        impact: 'Biodiversite des micro-habitats forestiers.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Forets'],
    threats: ['Deforestation'],
  },
  {
    id: MOCK_SPECIES_TOMATO_FROG_ID,
    name_default: 'Grenouille tomate',
    scientific_name: 'Dyscophus antongilii',
    description_default:
      'Grenouille spectaculaire rouge vif, endemique de Madagascar, symbole de la conservation.',
    conservation_status: 'EN',
    image_url: '/images/diaromas/Grenouille tomate.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_ANTSIRABE_ID,
        slug: MOCK_PROJECT_ANTSIRABE_SLUG,
        name: "Ruchers d'apiculteurs independants a Antsirabe",
        type: 'beehive',
        role: 'Espece secondaire',
        impact: 'Indicateur de qualite des eaux et forets.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Forets humides', 'Marecages'],
    threats: ['Commerce des animaux', 'Perte dhabitat'],
  },
  {
    id: MOCK_SPECIES_KINGFISHER_ID,
    name_default: 'Martin-chasseur pygmée',
    scientific_name: 'Corythornis madagascariensis',
    description_default:
      'Petit oiseau aquatique brillant, pecheur agile des cours deeau malgaches.',
    conservation_status: 'LC',
    image_url: '/images/diaromas/Martin-chasseur pygmée.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_ANTSIRABE_ID,
        slug: MOCK_PROJECT_ANTSIRABE_SLUG,
        name: "Ruchers d'apiculteurs independants a Antsirabe",
        type: 'beehive',
        role: 'Espece secondaire',
        impact: 'Preservation des zones humides et cours deau.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Cours deau', 'Forets riveraines'],
    threats: ['Pollution de leau', 'Destruction des ripisylves'],
  },
  {
    id: MOCK_SPECIES_COUA_ID,
    name_default: 'Coua bleu',
    scientific_name: 'Coua caerulea',
    description_default:
      'Oiseau endemique au plumage bleu iridescent, coureur des forets de Madagascar.',
    conservation_status: 'LC',
    image_url: '/images/diaromas/Coua bleu.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_ANTSIRABE_ID,
        slug: MOCK_PROJECT_ANTSIRABE_SLUG,
        name: "Ruchers d'apiculteurs independants a Antsirabe",
        type: 'beehive',
        role: 'Espece secondaire',
        impact: 'Disperseur de graines forestieres.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Forets sèches', 'Forets humides'],
    threats: ['Deforestation'],
  },
  {
    id: MOCK_SPECIES_GECKO_ID,
    name_default: 'Gecko diurne',
    scientific_name: 'Phelsuma sp.',
    description_default:
      'Gecko coloré diurne, endemique de Madagascar, important pour la pollinisation.',
    conservation_status: 'LC',
    image_url: '/images/diaromas/Gecko diurne.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_ANTSIRABE_ID,
        slug: MOCK_PROJECT_ANTSIRABE_SLUG,
        name: "Ruchers d'apiculteurs independants a Antsirabe",
        type: 'beehive',
        role: 'Espece secondaire',
        impact: 'Pollinisation des plantes forestieres.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Forets', 'Plantations'],
    threats: ['Commerce international', 'Perte dhabitat'],
  },
  {
    id: MOCK_SPECIES_LITTLE_OWL_ID,
    name_default: 'Chouette chevêche',
    scientific_name: 'Athene noctua',
    description_default:
      'Petite chouette terrestre, regulatrice des populations de rongeurs et dinsectes.',
    conservation_status: 'LC',
    image_url: '/images/diaromas/Chouette chevêche.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_ANTSIRABE_ID,
        slug: MOCK_PROJECT_ANTSIRABE_SLUG,
        name: "Ruchers d'apiculteurs independants a Antsirabe",
        type: 'beehive',
        role: 'Espece secondaire',
        impact: 'Equilibre des ecosystemes agricoles.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Bocages', 'Vergers', 'Prairies'],
    threats: ['Pesticides', 'Disparition des arbres creux'],
  },
  {
    id: MOCK_SPECIES_HOOPoe_ID,
    name_default: 'Huppe fasciée',
    scientific_name: 'Upupa epops',
    description_default:
      'Oiseau au plumage spectaculaire et crete unique, insectivore des zones ouvertes.',
    conservation_status: 'LC',
    image_url: '/images/diaromas/Huppe fasciée.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_SARDINIA_ID,
        slug: MOCK_PROJECT_SARDINIA_SLUG,
        name: 'Oliviers de Sardaigne',
        type: 'agroforestry',
        role: 'Espece secondaire',
        impact: 'Lutte biologique dans les vergers doliviers.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Vergers', 'Prairies', 'Bocages'],
    threats: ['Pesticides', 'Disparition des vieux arbres'],
  },
  // Espèces associées - Coraux
  {
    id: MOCK_SPECIES_ACROPORA_ID,
    name_default: 'Acropora corne de cerf',
    scientific_name: 'Acropora spp.',
    description_default:
      'Corail branchu rapide, fondateur des recifs tropicaux, habitat essentiel pour les poissons.',
    conservation_status: 'CR',
    image_url: '/images/diaromas/Acropora  Corail corne de cerf.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_CORAL_ID,
        slug: MOCK_PROJECT_CORAL_SLUG,
        name: 'Restauration des recifs Karimunjawa',
        type: 'coral_restoration',
        role: 'Espece principale',
        impact: 'Restauration prioritaire pour reconstruction du recif.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Recifs coralliens', 'Eaux tropicales peu profondes'],
    threats: ['Rechauffement', 'Blanchissement', 'Acidification'],
  },
  {
    id: MOCK_SPECIES_CLOWNFISH_ID,
    name_default: 'Poisson clown',
    scientific_name: 'Amphiprion spp.',
    description_default:
      'Poisne emblematique symbiotique des anemones, essentiel a lequilibre du recif.',
    conservation_status: 'LC',
    image_url: '/images/diaromas/Poisson clown.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_CORAL_ID,
        slug: MOCK_PROJECT_CORAL_SLUG,
        name: 'Restauration des recifs Karimunjawa',
        type: 'coral_restoration',
        role: 'Espece associee',
        impact: 'Beneficiaire direct de la restauration corallienne.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Recifs coralliens', 'Anemones'],
    threats: ['Degradation des recifs', 'Commerce aquariophile'],
  },
  {
    id: MOCK_SPECIES_BLUE_DEMOISELLE_ID,
    name_default: 'Demoiselle bleue',
    scientific_name: 'Chrysiptera spp.',
    description_default:
      'Poisson reef bleu vibrant, indicateur de sante du recif corallien.',
    conservation_status: 'LC',
    image_url: '/images/diaromas/Demoiselle bleue.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_CORAL_ID,
        slug: MOCK_PROJECT_CORAL_SLUG,
        name: 'Restauration des recifs Karimunjawa',
        type: 'coral_restoration',
        role: 'Espece associee',
        impact: 'Poisson reef beneficiaire de lhabitat restaure.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Recifs coralliens'],
    threats: ['Degradation des recifs'],
  },
  {
    id: MOCK_SPECIES_BUTTERFLYFISH_ID,
    name_default: 'Poisson-papillon',
    scientific_name: 'Chaetodon spp.',
    description_default:
      'Poisson aux motifs spectaculaires, specialist des coraux pour lalimentation.',
    conservation_status: 'LC',
    image_url: '/images/diaromas/Poisson-papillon.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_CORAL_ID,
        slug: MOCK_PROJECT_CORAL_SLUG,
        name: 'Restauration des recifs Karimunjawa',
        type: 'coral_restoration',
        role: 'Espece associee',
        impact: 'Specialiste dependant des coraux sains.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Recifs coralliens'],
    threats: ['Perte de coraux', 'Blanchissement'],
  },
  {
    id: MOCK_SPECIES_SEAHORSE_ID,
    name_default: 'Hippocampe',
    scientific_name: 'Hippocampus spp.',
    description_default:
      'Poisson unique au corps vertical, fragile et emblematique des recifs.',
    conservation_status: 'VU',
    image_url: '/images/diaromas/Hippocampe.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_CORAL_ID,
        slug: MOCK_PROJECT_CORAL_SLUG,
        name: 'Restauration des recifs Karimunjawa',
        type: 'coral_restoration',
        role: 'Espece associee rare',
        impact: 'Espece fragile beneficiaire de lhabitat complexe.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Recifs coralliens', 'Herbiers marins'],
    threats: ['Commerce', 'Degradation des recifs', 'Pollution'],
  },
  {
    id: MOCK_SPECIES_GREEN_TURTLE_ID,
    name_default: 'Tortue verte',
    scientific_name: 'Chelonia mydas',
    description_default:
      'Tortue marine herbivore majestueuse, essentielle a lequilibre des herbiers et recifs.',
    conservation_status: 'EN',
    image_url: '/images/diaromas/Tortue verte.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_CORAL_ID,
        slug: MOCK_PROJECT_CORAL_SLUG,
        name: 'Restauration des recifs Karimunjawa',
        type: 'coral_restoration',
        role: 'Espece associee premium',
        impact: 'Visiteur regulier des recifs restaures.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Recifs coralliens', 'Herbiers marins'],
    threats: ['Chasse', 'Pollution', 'Prises accidentelles'],
  },
]

type MockParticipationGraph = {
  investedProjectSlugs: Set<string>
  orderedProductIds: Set<string>
  completedChallengeIds: Set<string>
  currentChallengeProgress: Map<string, number>
}

const getParticipationGraph = async (
  viewerId?: string | null,
  faction?: Faction | null,
): Promise<MockParticipationGraph> => {
  if (!viewerId) {
    return {
      investedProjectSlugs: new Set<string>(),
      orderedProductIds: new Set<string>(),
      completedChallengeIds: new Set<string>(),
      currentChallengeProgress: new Map<string, number>(),
    }
  }

  // Import server-only modules only when this function is called
  const { getCurrentMockCompletedChallengeSeriesIds, getCurrentMockDailyChallenges } = await import('@/lib/mock/mock-challenge-progress-server')
  const { getMockInvestments } = await import('@/lib/mock/mock-member-data')
  const { getCurrentMockOrders } = await import('@/lib/mock/mock-order-history-server')

  const [orders, completedChallengeIds, currentDailyChallenges] = await Promise.all([
    getCurrentMockOrders(viewerId),
    getCurrentMockCompletedChallengeSeriesIds(viewerId),
    getCurrentMockDailyChallenges({ viewerId, faction: faction ?? null }),
  ])

  const investedProjectSlugs = new Set(
    getMockInvestments(viewerId).map((investment) => investment.project.slug),
  )
  const orderedProductIds = new Set(
    orders.flatMap((order) =>
      order.items
        .map((item) => item.product?.id || null)
        .filter((productId): productId is string => Boolean(productId)),
    ),
  )

  return {
    investedProjectSlugs,
    orderedProductIds,
    completedChallengeIds: new Set(completedChallengeIds),
    currentChallengeProgress: new Map(
      currentDailyChallenges.map((challenge) => [challenge.seriesId, challenge.progress]),
    ),
  }
}

const cloneSpecies = async (
  species: SpeciesContext,
  viewerId?: string | null,
  faction?: Faction | null,
): Promise<SpeciesContext> => {
  const graph = await getParticipationGraph(viewerId, faction)

  const associatedProjects =
    species.associated_projects?.map((project) => ({
      ...project,
      userParticipation: graph.investedProjectSlugs.has(project.slug || ''),
    })) || []

  const associatedChallenges =
    species.associated_challenges?.map((challenge) => ({
      ...challenge,
      userProgress: graph.currentChallengeProgress.get(challenge.id) ?? null,
    })) || []

  let isUnlocked = false
  let progressionLevel = 1

  if (species.id === MOCK_SPECIES_OWL_ID) {
    isUnlocked =
      graph.investedProjectSlugs.has(MOCK_PROJECT_ANTSIRABE_SLUG) ||
      graph.completedChallengeIds.has(MOCK_CHALLENGE_ECO_FACT_ID)
    progressionLevel = graph.investedProjectSlugs.has(MOCK_PROJECT_ANTSIRABE_SLUG) ? 2 : 1
  } else if (species.id === MOCK_SPECIES_HONEY_BEE_ID) {
    isUnlocked =
      graph.investedProjectSlugs.has(MOCK_PROJECT_MANAKARA_SLUG) &&
      graph.orderedProductIds.has(MOCK_PRODUCT_EUCALYPTUS_ID)
    progressionLevel = graph.completedChallengeIds.has(MOCK_CHALLENGE_DAILY_HARVEST_ID) ? 2 : 1
  } else if (species.id === MOCK_SPECIES_BLACK_BEE_ID) {
    isUnlocked =
      graph.investedProjectSlugs.has(MOCK_PROJECT_MANAKARA_SLUG) &&
      graph.completedChallengeIds.has(MOCK_CHALLENGE_COLLECTIVE_BRAVO_ID)
    progressionLevel =
      graph.investedProjectSlugs.has(MOCK_PROJECT_MANAKARA_SLUG) ||
      graph.orderedProductIds.has(MOCK_PRODUCT_MANAKARA_ID)
        ? 2
        : 1
  } else if (species.id === MOCK_SPECIES_OLIVE_TREE_ID) {
    isUnlocked = graph.investedProjectSlugs.has(MOCK_PROJECT_SARDINIA_SLUG)
    progressionLevel = isUnlocked ? 2 : 1
  } else if (species.id === MOCK_SPECIES_CORAL_ID || species.id === MOCK_SPECIES_ACROPORA_ID) {
    isUnlocked = graph.investedProjectSlugs.has(MOCK_PROJECT_CORAL_SLUG)
    progressionLevel = isUnlocked ? 2 : 1
  } else if (
    species.id === MOCK_SPECIES_BUMBLEBEE_ID ||
    species.id === MOCK_SPECIES_OSMIA_ID ||
    species.id === MOCK_SPECIES_MEGACHILE_ID ||
    species.id === MOCK_SPECIES_SYRPHID_ID ||
    species.id === MOCK_SPECIES_BUTTERFLY_CITRON_ID ||
    species.id === MOCK_SPECIES_BUTTERFLY_PEACOCK_ID ||
    species.id === MOCK_SPECIES_HEDGEHOG_ID
  ) {
    isUnlocked = graph.investedProjectSlugs.has(MOCK_PROJECT_HABEEBEE_SLUG)
    progressionLevel = isUnlocked ? 2 : 1
  } else if (
    species.id === MOCK_SPECIES_INDRI_ID ||
    species.id === MOCK_SPECIES_SIFAKA_ID ||
    species.id === MOCK_SPECIES_VARI_ID ||
    species.id === MOCK_SPECIES_CHAMELEON_ID ||
    species.id === MOCK_SPECIES_PANTHER_CHAMELEON_ID ||
    species.id === MOCK_SPECIES_WEEVIL_ID ||
    species.id === MOCK_SPECIES_TOMATO_FROG_ID ||
    species.id === MOCK_SPECIES_KINGFISHER_ID ||
    species.id === MOCK_SPECIES_COUA_ID ||
    species.id === MOCK_SPECIES_GECKO_ID ||
    species.id === MOCK_SPECIES_LITTLE_OWL_ID
  ) {
    isUnlocked = graph.investedProjectSlugs.has(MOCK_PROJECT_ANTSIRABE_SLUG)
    progressionLevel = isUnlocked ? 2 : 1
  } else if (species.id === MOCK_SPECIES_HOOPoe_ID) {
    isUnlocked = graph.investedProjectSlugs.has(MOCK_PROJECT_SARDINIA_SLUG)
    progressionLevel = isUnlocked ? 2 : 1
  } else if (
    species.id === MOCK_SPECIES_CLOWNFISH_ID ||
    species.id === MOCK_SPECIES_BLUE_DEMOISELLE_ID ||
    species.id === MOCK_SPECIES_BUTTERFLYFISH_ID ||
    species.id === MOCK_SPECIES_SEAHORSE_ID ||
    species.id === MOCK_SPECIES_GREEN_TURTLE_ID
  ) {
    isUnlocked = graph.investedProjectSlugs.has(MOCK_PROJECT_CORAL_SLUG)
    progressionLevel = isUnlocked ? 2 : 1
  }

  return {
    ...species,
    associated_projects: associatedProjects,
    associated_producers: species.associated_producers?.map((producer) => ({ ...producer })) || [],
    associated_challenges: associatedChallenges,
    habitat: species.habitat ? [...species.habitat] : [],
    threats: species.threats ? [...species.threats] : [],
    user_status: createUserStatus(isUnlocked, progressionLevel),
  }
}

export const getMockSpeciesContextList = async (
  viewerId?: string | null,
  faction?: Faction | null,
): Promise<SpeciesContext[]> => {
  return Promise.all(MOCK_SPECIES.map((species) => cloneSpecies(species, viewerId, faction)))
}

export const getMockSpeciesContext = async (
  id: string,
  viewerId?: string | null,
  faction?: Faction | null,
): Promise<SpeciesContext | null> => {
  const species = MOCK_SPECIES.find((entry) => entry.id === id)
  return species ? cloneSpecies(species, viewerId, faction) : null
}

// Client-safe version that doesn't use server-only imports
export const getMockSpeciesContextClient = async (
  id: string,
): Promise<{ name_default: string } | null> => {
  const species = MOCK_SPECIES.find((entry) => entry.id === id)
  return species ? { name_default: species.name_default } : null
}
