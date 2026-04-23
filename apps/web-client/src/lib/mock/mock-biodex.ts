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
  MOCK_SPECIES_HOOPoe_ID,
  MOCK_SPECIES_INDRI_ID,
  MOCK_SPECIES_KINGFISHER_ID,
  MOCK_SPECIES_LADYBUG_ID,
  MOCK_SPECIES_LITTLE_OWL_ID,
  MOCK_SPECIES_MEGACHILE_ID,
  MOCK_SPECIES_OLIVE_TREE_ID,
  MOCK_SPECIES_OSMIA_ID,
  MOCK_SPECIES_SEAHORSE_ID,
  MOCK_SPECIES_SIFAKA_ID,
  MOCK_SPECIES_SYRPHID_ID,
  MOCK_SPECIES_TOMATO_FROG_ID,
  MOCK_SPECIES_VARI_ID,
  MOCK_SPECIES_WEEVIL_ID,
  MOCK_SPECIES_LIOTRIGONA_ID,
  MOCK_SPECIES_APIS_LIGUSTICA_ID,
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
    id: MOCK_SPECIES_BLACK_BEE_ID,
    name_default: 'Abeille Noire',
    scientific_name: 'Apis mellifera unicolor',
    description_default:
      'L\'abeille noire de Madagascar est une sous-espèce endémique essentielle à l\'équilibre de l\'écosystème malgache. Elle pollinise une grande partie des plantes locales et soutient les économies apicoles traditionnelles. Cette abeille est réputée pour sa docilité et son adaptabilité aux différents climats de l\'île.',
    description_scientific:
      'L\'abeille noire de Madagascar, réputée comme l\'une des plus dociles au monde, est une sous-espèce endémique d\'une homogénéité génétique exceptionnelle due à un isolement d\'un million d\'années. En tant qu\'insecte clé de voûte doté d\'un comportement hygiénique naturel unique pour se défendre des parasites, elle garantit la structure des réseaux trophiques insulaires en assurant la reproduction végétale continue. Elle présente une divergence évolutive avec les autres abeilles africaines continentales datant d\'environ 1 million d\'années, et son génome représente 99,6 % de l\'ADN échantillonné au sein des colonies sur l\'île, témoignant d\'une absence presque totale d\'introgression par des sous-espèces étrangères.',
    conservation_status: 'DD',
    image_url: '/images/diaromas/Abeilles pollinisatrices.png',
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
    habitat: [
      'Forêts Primaires Humides de l\'Est et Zones Côtières (Z4)',
      'Mosaïques de Prairies Boisées et Hauts Plateaux du Centre (Z3)',
      'Forêts Décidues Sèches de l\'Ouest et du Nord (Z1, Z2)',
      'Succulentes et Fourrés Épineux du Sud et Sud-Ouest (Z5, Z6)',
      'Écotones Anthropisés et Plantations Agricoles',
      'Forêts pluviales',
      'Lisières forestières',
      'Zones agricoles',
      'Plantations',
      'Jardins tropicaux',
    ],
    threats: [
      'Déforestation massive (tavy)',
      'Varroa destructor (introduction 2010)',
      'Intoxication agrochimique (65-85% des ruchers exposés)',
      'Changement climatique',
      'Pratiques traditionnelles destructrices',
      'Insécurité rurale (vols, destruction)',
      'Perte d\'habitat',
      'Épuisement des ressources florales',
    ],
  },
  {
    id: MOCK_SPECIES_LADYBUG_ID,
    name_default: 'Coccinelle a 7 points',
    scientific_name: 'Coccinella septempunctata',
    description_default:
      'Coléoptère prédateur iconique au corps rouge vif. C\'est l\'un des piliers naturels de la lutte biologique dans les systèmes agricoles tempérés.',
    conservation_status: 'LC',
    image_url: '/images/diaromas/Coccinelle.png',
    associated_projects: [],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Champs agricoles', 'Prairies', 'Jardins'],
    threats: ['Pesticides toxiques', 'Compétition avec la coccinelle asiatique'],
  },
  // Espèces déjà définies mais non implémentés
  {
    id: MOCK_SPECIES_OLIVE_TREE_ID,
    name_default: 'Olivier',
    scientific_name: 'Olea europaea',
    description_default:
      'Arbre fondateur du maquis dont la variété sauvage (oléastre) recèle un riche patrimoine génétique. Il souffre massivement d\'infections racinaires à Phytophthora en Sardaigne.',
    conservation_status: 'DD',
    image_url: '/images/diaromas/Olivier .png',
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
    habitat: ['Maquis méditerranéen', 'Zones agroforestières', 'Garrigues', 'Terrains arides'],
    threats: ['Bactérie Xylella fastidiosa', 'Phytophthora (clades 2, 6, 8)', 'Changement climatique', 'Abandon des terrains agricoles'],
  },
  {
    id: MOCK_SPECIES_CORAL_ID,
    name_default: 'Acropora corne de cerf',
    scientific_name: 'Acropora muricata',
    description_default:
      'Espèce de corail scléractiniaire arborescent qui construit la topographie complexe du récif. Il est fortement menacé par le blanchissement thermique et le Syndrome Blanc.',
    conservation_status: 'VU',
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
    habitat: ['Récifs coralliens peu profonds', 'Lagons', 'Pentés récifales externes', 'Zones de forte luminosité'],
    threats: ['Blanchissement thermique', 'Syndrome Blanc des Acroporidés', 'Acidification des océans', 'Destructuration des récifs'],
  },
  {
    id: MOCK_SPECIES_BUMBLEBEE_ID,
    name_default: 'Bourdon terrestre',
    scientific_name: 'Bombus terrestris',
    description_default:
      'Grand pollinisateur eusocial à l\'efficacité redoutable, souvent commercialisé. Ses ouvrières sont capables d\'apprendre les couleurs des fleurs pour optimiser le butinage.',
    conservation_status: 'LC',
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
    habitat: ['Prairies agricoles', 'Jardins urbains', 'Lisières de bois', 'Cultures sous serre'],
    threats: ['Pollution par les pesticides', 'Perte de ressources florales', 'Maladies pathogènes'],
  },
  {
    id: MOCK_SPECIES_OSMIA_ID,
    name_default: 'Osmie rousse',
    scientific_name: 'Osmia bicornis',
    description_default:
      'Abeille maçonne solitaire recouverte de poils roux denses. Elle gère intelligemment la répartition des sexes de sa progéniture en fonction de sa propre taille corporelle.',
    conservation_status: 'LC',
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
    habitat: ['Vergers', 'Jardins', 'Zones urbaines', 'Lisières forestières'],
    threats: ['Perte de sites de nidification', 'Pesticides', 'Urbanisation'],
  },
  {
    id: MOCK_SPECIES_MEGACHILE_ID,
    name_default: 'Mégachile',
    scientific_name: 'Megachile centuncularis',
    description_default:
      'Abeille solitaire coupeuse de feuilles qui maçonne ses nids au-dessus du sol. Elle subit une forte compétition de la part d\'espèces invasives dans les hôtels à insectes.',
    conservation_status: 'LC',
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
    habitat: ['Jardins', 'Prairies fleuries', 'Zones rudérales'],
    threats: ['Intensification agricole', 'Compétition par la Mégachile sculptée invasive'],
  },
  {
    id: MOCK_SPECIES_SYRPHID_ID,
    name_default: 'Syrphe ceinturé',
    scientific_name: 'Episyrphus balteatus',
    description_default:
      'Mouche déguisée en guêpe (mimétisme batésien) et excellent migrateur. Elle présente une écologie duelle fascinante entre son stade larvaire et adulte.',
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
    habitat: ['Cultures agricoles', 'Prairies', 'Jardins', 'Lisières'],
    threats: ['Application de pesticides à large spectre', 'Monoculture'],
  },
  {
    id: MOCK_SPECIES_BUTTERFLY_CITRON_ID,
    name_default: 'Papillon citron',
    scientific_name: 'Gonepteryx rhamni',
    description_default:
      'Lépidoptère robuste aux ailes mimétiques de feuilles, capable d\'hiverner à l\'état adulte. Il apparaît aux premiers jours chauds de l\'année.',
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
    habitat: ['Lisières boisées', 'Haies', 'Jardins', 'Vergers'],
    threats: ['Perte de plantes hôtes (Rhamnus)', 'Pesticides', 'Fragmentation'],
  },
  {
    id: MOCK_SPECIES_BUTTERFLY_PEACOCK_ID,
    name_default: 'Paon-du-jour',
    scientific_name: 'Aglais io',
    description_default:
      'Papillon vif orné d\'ocelles dissuasives. Ses chenilles dépendent quasi exclusivement de la présence d\'orties dioïques pour leur développement.',
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
    habitat: ['Prairies humides', 'Lisières forestières', 'Jardins'],
    threats: ['Fauchage agricole intensif', 'Éradication des orties par herbicides'],
  },
  {
    id: MOCK_SPECIES_HEDGEHOG_ID,
    name_default: 'Hérisson européen',
    scientific_name: 'Erinaceus europaeus',
    description_default:
      'Petit mammifère omnivore récemment reclassé à cause de graves déclins démographiques (jusqu\'à 50% dans certaines régions). Il est hautement vulnérable à la fragmentation de son territoire.',
    conservation_status: 'NT',
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
    habitat: ['Prairies', 'Haies', 'Jardins', 'Lisières forestières'],
    threats: ['Trafic routier', 'Perte d\'habitat', 'Pesticides (anti-limaces)', 'Suppression des haies'],
  },
  // Espèces secondaires - Madagascar
  {
    id: MOCK_SPECIES_INDRI_ID,
    name_default: 'Indri',
    scientific_name: 'Indri indri',
    description_default:
      'L\'Indri est le plus grand lémurien vivant, célèbre pour ses puissants chants territoriaux audibles à plusieurs kilomètres. En tant que folivore strict, sa survie est intimement liée à l\'intégrité de la forêt primaire. Il évolue en petits groupes familiaux et effectue des sauts spectaculaires d\'arbre en arbre.',
    description_scientific:
      'L\'Indri, plus grand lémurien existant, est un folivore strict incapable de survivre en captivité en raison d\'un microbiome intestinal hautement spécialisé. Évoluant dans la canopée au sein de petits groupes familiaux à dominance matriarcale, il est célèbre pour ses sauts verticaux spectaculaires et ses chants territoriaux polyphoniques audibles à plus de 2 km. Son microbiome abrite 47 espèces de bactéries intestinales totalement inconnues, strictement spécifiques à l\'espèce, ce qui explique l\'échec de toutes les tentatives de conservation ex-situ.',
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
    habitat: [
      'Forêts pluviales tropicales primaires de basse altitude',
      'Forêts denses humides sempervirentes',
      'Forêts de montagne et de moyenne altitude',
      'Intérieur des forêts primaires intactes',
      'Corridors forestiers secondaires anciens',
      'Canopée forestière',
      'Côte est de Madagascar',
    ],
    threats: [
      'Destruction de l\'habitat par le Tavy (agriculture sur brûlis)',
      'Exploitation forestière illégale',
      'Pression de chasse (bushmeat)',
      'Changement climatique',
      'Fragmentation forestière',
      'Microbiome intestinal (incapacité de survie en captivité)',
      'Déforestation intensive',
      'Chasse illégale',
    ],
  },
  {
    id: MOCK_SPECIES_SIFAKA_ID,
    name_default: 'Sifaka diadème',
    scientific_name: 'Propithecus diadema',
    description_default:
      'Le Sifaka à diadème est l\'un des plus grands et des plus colorés lémuriens arboricoles de Madagascar. Il évolue en groupes sociaux très soudés et effectue des bonds spectaculaires d\'arbre en arbre. Son régime alimentaire très sélectif exige de vastes territoires avec des arbres massifs non fragmentés.',
    description_scientific:
      'Le Sifaka à diadème, l\'un des plus grands et des plus colorés lémuriens arboricoles, évolue en groupes sociaux matriarcaux très soudés. Doté d\'un métabolisme de grand folivore-frugivore au régime alimentaire hautement sélectif (utilisant même son flair pour trouver des plantes parasites), il exige d\'immenses territoires aux arbres massifs non fragmentés pour exécuter ses spectaculaires bonds verticaux propulsifs. Son tractus gastro-intestinal démesurément long et son caecum élargi lui permettent de fermenter la cellulose des feuilles coriaces, mais cette adaptation impose des limites physiologiques strictes en cas de dégradation de l\'habitat.',
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
    habitat: [
      'Forêts pluviales humides de l\'est et du nord-est de Madagascar',
      'Canopée forestière avec grands arbres matures',
      'Forêts primaires continues',
      'Forêts de moyenne altitude',
      'Domaine vital de 20 à 30 hectares',
      'Fragments forestiers dégradés',
      'Forêts de haute altitude',
      'Corridors forestiers',
    ],
    threats: [
      'Agriculture sur brûlis (Tavy)',
      'Exploitation forestière',
      'Exploitation minière',
      'Chasse illégale (bushmeat)',
      'Changements climatiques',
      'Fragmentation forestière',
      'Prédation par le Fossa',
      'Malnutrition chronique',
      'Déforestation',
      'Fragmentation de l\'habitat',
    ],
  },
  {
    id: MOCK_SPECIES_VARI_ID,
    name_default: 'Vari noir et blanc',
    scientific_name: 'Varecia variegata',
    description_default:
      'Le Vari noir et blanc est le plus grand lémurien frugivore de Madagascar, vivant exclusivement dans la haute canopée des forêts primaires. Il évolue en groupes sociaux complexes et joue un rôle écologique unique en tant que pollinisateur majeur des plantes endémiques monumentales comme l\'Arbre du voyageur.',
    description_scientific:
      'Le Vari noir et blanc est le plus grand lémurien frugivore strictement inféodé à la haute canopée malgache. Évoluant selon une structure sociale complexe de type fission-fusion organisée autour d\'une dominance matriarcale, il joue un rôle écologique absolument singulier : il est l\'un des très rares primates mondiaux à agir comme un pollinisateur majeur pour les plantes endémiques monumentales. Son museau allongé et sa langue agile, adaptations crâniennes pour la nectarivorie, lui permettent de transférer d\'immenses quantités de pollen dans son pelage.',
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
    habitat: [
      'Forêts pluviales primaires',
      'Forêts secondaires anciennes non perturbées',
      'Haute canopée forestière avec grands arbres émergents',
      'Zones de basses à moyennes altitudes',
      'Réserve Spéciale de Manombo',
      'Marécages et forêts littorales',
      'Région sud-est (Manakara, Farafangana)',
      'Domaine vital de 3,5 hectares minimum',
    ],
    threats: [
      'Tavy (agriculture sur brûlis)',
      'Exploitation forestière sélective',
      'Chasse insoutenable (bushmeat)',
      'Fragmentation de l\'habitat',
      'Changements climatiques et cyclones',
      'Perte des arbres matures',
      'Érosion des tabous culturels',
      'Déforestation',
      'Perte de grands arbres matures',
    ],
  },
  {
    id: MOCK_SPECIES_CHAMELEON_ID,
    name_default: 'Caméléon de Parson',
    scientific_name: 'Calumma parsonii',
    description_default:
      'Le Caméléon de Parson est l\'un des plus grands caméléons au monde, pouvant atteindre 70 cm et peser jusqu\'à 700 grammes. Ce prédateur en embuscade régule les populations d\'insectes arboricoles dans les forêts primaires de l\'est de Madagascar. Sa survie dépend entièrement des forêts anciennes et non fragmentées.',
    description_scientific:
      'Le Caméléon de Parson est le caméléon le plus massif au monde, avec une croissance indéterminée et des ornements crâniens prononcés chez les mâles. En tant que prédateur supérieur de la canopée opérant par embuscade, il régule les populations d\'arthropodes arboricoles grâce à son mimétisme cryptique et son appareil hyo-lingual balistique. Sa diapause embryonnaire unique exigeant 14 à 24 mois d\'incubation et sa dépendance stricte à la stabilité thermique et hydrique des forêts primaires le rendent extrêmement vulnérable à la fragmentation forestière et au changement climatique.',
    conservation_status: 'NT',
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
    habitat: [
      'Forêts primaires canopéennes',
      'Forêts de montagne / nuages',
      'Corridors de moyenne altitude',
      'Forêts littorales denses',
      'Lisières forestières matures',
      'Forêts humides primaires tropicales et subtropicales',
      'Forêts de l\'est et du nord de Madagascar',
      'Zones avec précipitations annuelles élevées (jusqu\'à 3810 mm)',
    ],
    threats: [
      'Perte d\'habitat due à l\'agriculture sur brûlis (tavy)',
      'Exploitation forestière illégale',
      'Collecte historique insoutenable pour le commerce international',
      'Fragmentation génétique',
      'Changement climatique',
      'Commerce international d\'animaux exotiques',
      'Déforestation',
    ],
  },
  {
    id: MOCK_SPECIES_PANTHER_CHAMELEON_ID,
    name_default: 'Caméléon panthère',
    scientific_name: 'Furcifer pardalis',
    description_default:
      'Le Caméléon panthère est célèbre pour son dimorphisme sexuel spectaculaire et sa coloration variable selon l\'origine géographique. Ce prédateur d\'insectes hautement spécialisé possède une langue balistique et une vision à 360° qui lui permettent de prospérer dans une grande variété d\'habitats, des forêts secondaires aux zones anthropisées.',
    description_scientific:
      'Le Caméléon panthère appartient au genre Furcifer (du latin "fourche", référence à la zygodactylie) et se distingue par une plasticité écologique exceptionnelle. Évoluant comme "spécialiste de lisière", il colonise les écotones, forêts secondaires et paysages anthropisés grâce à une tolérance thermique remarquable. Son mécanisme de coloration active repose sur des nanostructures d\'iridophores modifiant l\'interférence des longueurs d\'onde. Des études phylogéographiques (Grbic et al., 2015) révèlent l\'existence de 11 haplogroupes génétiquement distincts suggérant un complexe d\'espèces cryptiques.',
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
    habitat: [
      'Forêts caducifoliées sèches de basse altitude',
      'Ripisylves riveraines et végétation secondaire',
      'Écotones et trouées forestières',
      'Plantations de vanille, cacao, jardins domestiques',
      'Lisières de routes et paysages anthropisés',
      'Bordures du Canal des Pangalanes',
      'Zones littorales (1 à 950 mètres d\'altitude)',
      'Forêts de l\'est et du nord de Madagascar',
    ],
    threats: [
      'Commerce international d\'animaux exotiques et collecte sélective',
      'Abattage d\'arbres et fragmentation forestière',
      'Perte d\'habitat par le feu (tavy)',
      'Perte d\'habitat due à l\'urbanisation',
      'Braconnage illégal malgré CITES Annexe II',
    ],
  },
  {
    id: MOCK_SPECIES_WEEVIL_ID,
    name_default: 'Charançon girafe',
    scientific_name: 'Trachelophorus giraffa',
    description_default:
      'Coléoptère unique au long cou et au comportement de roulement défensif. Les femelles construisent des nids complexes pour leurs larves sur des feuilles de plantes hôtes.',
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
    habitat: ['Forêts humides', 'Zones de transition forestière', 'Plantations'],
    threats: ['Déforestation', 'Perte de plantes hôtes', 'Fragmentation'],
  },
  {
    id: MOCK_SPECIES_TOMATO_FROG_ID,
    name_default: 'Grenouille tomate',
    scientific_name: 'Dyscophus antongilii',
    description_default:
      'La Grenouille tomate de Madagascar est un amphibien terrestre massif et fouisseur, célèbre pour sa coloration rouge vif aposématique qui avertit les prédateurs de sa toxine adhésive. Sa reproduction est explosive et liée aux pluies torrentielles, ses têtards jouant un rôle vital de purification biologique dans les eaux stagnantes.',
    description_scientific:
      'La Grenouille tomate (Dyscophus antongilii) appartient à la famille des Microhylidae, sous-famille des Dyscophinae, un clade strictement endémique de Madagascar. Amphibien terrestre fouisseur présentant un dimorphisme sexuel prononcé (femelles jusqu\'à 10,5 cm, 230g ; mâles 6-6,5 cm, 41g), elle arbore une coloration rouge vif aposématique signalant une défense chimique puissante : une sécrétion muqueuse adhésive et irritante capable d\'engluer les prédateurs et de provoquer des réactions inflammatoires des muqueuses. Sa reproduction explosive synchronisée avec les moussons (octobre-janvier) produit 1000-1500 œufs flottants éclosant en 36 heures. Les têtards filtreurs pélagiques jouent un rôle écologique crucial en prévenant l\'eutrophisation des micro-bassins. Initialement classée NT et inscrite à l\'Annexe I de la CITES en 1987 suite au braconnage massif pour le commerce terrariophile, l\'espèce a été reclassée LC en 2017 et transférée à l\'Annexe II en 2016 grâce au succès de l\'élevage en captivité ex-situ et à sa plasticité écologique remarquable.',
    conservation_status: 'LC',
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
    habitat: [
      'Forêts humides de basse altitude (0-200m, parfois jusqu\'à 600m)',
      'Marécages, plaines d\'inondation intermittentes et zones humides d\'eau douce',
      'Mares temporaires et piscines forestières à très faible courant hydrique',
      'Canaux de drainage, fossés urbains et eaux stagnantes anthropisées',
      'Jardins ruraux, plantations agricoles (café) et zones urbaines dégradées',
    ],
    threats: [
      'Perte, dégradation et fragmentation de l\'habitat forestier',
      'Pollution chimique des eaux de reproduction (pesticides, effluents urbains)',
      'Urbanisation croissante et bétonnage',
      'Menace de maladies pathogènes (chytridiomycose)',
      'Compétition d\'espèces invasives (Crapaud asiatique)',
    ],
  },
  {
    id: MOCK_SPECIES_KINGFISHER_ID,
    name_default: 'Martin-chasseur pygmée',
    scientific_name: 'Corythornis madagascariensis',
    description_default:
      'Petit martin-pêcheur endémique au plumage écarlate et bleu profond. Il dépend des rivières et zones humides intactes pour se nourrir de poissons et d\'amphibiens.',
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
    habitat: ['Cours d\'eau', 'Rivières', 'Zones humides', 'Forêts riveraines'],
    threats: ['Pollution de l\'eau', 'Destruction des ripisylves', 'Perte de zones humides'],
  },
  {
    id: MOCK_SPECIES_COUA_ID,
    name_default: 'Coua bleu',
    scientific_name: 'Coua caerulea',
    description_default:
      'Coucou terrestre endémique au plumage bleu iridescent, capable de se déplacer rapidement au sol. Il est un important disperseur de graines dans les forêts malgaches.',
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
    habitat: ['Forêts sèches', 'Forêts humides', 'Zones de transition'],
    threats: ['Déforestation', 'Fragmentation', 'Perte d\'habitat'],
  },
  {
    id: MOCK_SPECIES_GECKO_ID,
    name_default: 'Gecko diurne',
    scientific_name: 'Phelsuma laticauda',
    description_default:
      'Gecko diurne au corps vert vif et à la queue écarlate, capable de se nourrir de nectar et de pollen. Il est un pollinisateur important pour les plantes forestières malgaches.',
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
    habitat: ['Forêts humides', 'Forêts sèches', 'Plantations', 'Zones arbustives'],
    threats: ['Commerce international illégal', 'Perte d\'habitat', 'Déforestation'],
  },
  {
    id: MOCK_SPECIES_LITTLE_OWL_ID,
    name_default: 'Chouette chevêche',
    scientific_name: 'Athene superciliaris',
    description_default:
      'Chouette endémique de Madagascar au plumage brun strié et aux yeux jaunes. Elle dépend des arbres creux et des zones ouvertes pour chasser les petits mammifères et insectes.',
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
    habitat: ['Bocages', 'Vergers', 'Prairies', 'Zones ouvertes'],
    threats: ['Pesticides', 'Disparition des arbres creux', 'Perte d\'habitat'],
  },
  {
    id: MOCK_SPECIES_HOOPoe_ID,
    name_default: 'Huppe fasciée',
    scientific_name: 'Upupa epops',
    description_default:
      'Oiseau au plumage brun orangé et à la huppe spectaculaire. Il est un insectivore important des zones agricoles et des vergers, se nourrissant de larves et d\'insectes du sol.',
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
    habitat: ['Vergers', 'Prairies', 'Bocages', 'Zones agricoles'],
    threats: ['Pesticides', 'Disparition des vieux arbres', 'Perte d\'habitat'],
  },
  // Espèces associées - Coraux
  {
    id: MOCK_SPECIES_ACROPORA_ID,
    name_default: 'Acropora corne de cerf',
    scientific_name: 'Acropora muricata',
    description_default:
      'Espèce de corail scléractiniaire arborescent qui construit la topographie complexe du récif. Il est fortement menacé par le blanchissement thermique et le Syndrome Blanc.',
    conservation_status: 'VU',
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
    habitat: ['Récifs coralliens peu profonds', 'Lagons', 'Pentés récifales externes', 'Zones de forte luminosité'],
    threats: ['Blanchissement thermique', 'Syndrome Blanc des Acroporidés', 'Acidification des océans', 'Destructuration des récifs'],
  },
  {
    id: MOCK_SPECIES_CLOWNFISH_ID,
    name_default: 'Poisson clown',
    scientific_name: 'Amphiprion ocellaris',
    description_default:
      'Poisson emblématique en symbiose obligatoire avec les anémones. Il est essentiel à l\'équilibre du récif et dépend entièrement de la santé des coraux hôtes.',
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
    habitat: ['Récifs coralliens', 'Anémones', 'Zones de faible profondeur'],
    threats: ['Dégradation des récifs', 'Commerce aquariophile', 'Blanchissement des coraux hôtes'],
  },
  {
    id: MOCK_SPECIES_BLUE_DEMOISELLE_ID,
    name_default: 'Demoiselle bleue',
    scientific_name: 'Chrysiptera cyanea',
    description_default:
      'Poisson récifal au bleu électrique vif, territorial et agressif. Il est un indicateur sensible de la santé du récif corallien et de la qualité de l\'eau.',
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
    habitat: ['Récifs coralliens', 'Pentés externes', 'Zones de fort courant'],
    threats: ['Dégradation des récifs', 'Blanchissement', 'Pollution'],
  },
  {
    id: MOCK_SPECIES_BUTTERFLYFISH_ID,
    name_default: 'Poisson-papillon',
    scientific_name: 'Chaetodon auriga',
    description_default:
      'Poisson aux motifs spectaculaires et spécialiste des coraux pour l\'alimentation. Il dépend fortement de la santé des coraux branchus pour sa survie.',
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
    habitat: ['Récifs coralliens', 'Pentés externes', 'Zones de forte luminosité'],
    threats: ['Perte de coraux', 'Blanchissement', 'Dégradation des récifs'],
  },
  {
    id: MOCK_SPECIES_SEAHORSE_ID,
    name_default: 'Hippocampe',
    scientific_name: 'Hippocampus bargibanti',
    description_default:
      'Hippocampe pygmée endémique des gorgones des récifs tropicaux. Il est extrêmement spécialisé et dépend entièrement de la présence de gorgones saines pour sa survie.',
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
    habitat: ['Récifs coralliens', 'Gorgones', 'Herbiers marins', 'Zones de faible profondeur'],
    threats: ['Commerce international', 'Dégradation des récifs', 'Pollution', 'Perte de gorgones'],
  },
  {
    id: MOCK_SPECIES_GREEN_TURTLE_ID,
    name_default: 'Tortue verte',
    scientific_name: 'Chelonia mydas',
    description_default:
      'Tortue marine herbivore majestueuse, essentielle à l\'équilibre des herbiers et récifs. Elle parcourt des milliers de kilomètres entre ses sites de reproduction et d\'alimentation.',
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
    habitat: ['Récifs coralliens', 'Herbiers marins', 'Zones côtières', 'Sites de reproduction'],
    threats: ['Chasse', 'Pollution', 'Prises accidentelles', 'Destruction des sites de nidification', 'Changement climatique'],
  },
  // Espèces supplémentaires - Nouvelles espèces identifiées
  {
    id: MOCK_SPECIES_LIOTRIGONA_ID,
    name_default: 'Abeille pollinisatrice',
    scientific_name: 'Liotrigona bitika',
    description_default:
      'Considérée comme la plus petite abeille sans dard du monde, plus petite qu\'une drosophile. Sa taille microscopique lui permet de polliniser des fleurs endémiques minuscules, inaccessibles aux autres insectes pollinisateurs.',
    conservation_status: 'NE',
    image_url: '/images/diaromas/Abeilles pollinisatrices.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_ANTSIRABE_ID,
        slug: MOCK_PROJECT_ANTSIRABE_SLUG,
        name: "Ruchers d'apiculteurs independants a Antsirabe",
        type: 'beehive',
        role: 'Espece secondaire',
        impact: 'Pollinisation des fleurs endémiques minuscules dans les forêts malgaches.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Forêts pluviales', 'Lisières forestières', 'Grands arbres de nidification', 'Canopée'],
    threats: ['Perte de grands arbres de nidification', 'Compétition avec les fourmis invasives', 'Fragmentation'],
  },
  {
    id: MOCK_SPECIES_APIS_LIGUSTICA_ID,
    name_default: 'Abeille mellifère italienne',
    scientific_name: 'Apis mellifera ligustica',
    description_default:
      'Sous-espèce apicole extrêmement populaire originaire de la péninsule italienne. Elle soutient le rendement commercial et la résilience florale des paysages secs.',
    conservation_status: 'NE',
    image_url: '/images/diaromas/Abeilles pollinisatrices.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_SARDINIA_ID,
        slug: MOCK_PROJECT_SARDINIA_SLUG,
        name: 'Oliviers de Sardaigne',
        type: 'agroforestry',
        role: 'Pollinisateur principal',
        impact: 'Pollinisation des oliviers et plantes aromatiques du maquis méditerranéen.',
        userParticipation: false,
      },
    ],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Maquis', 'Vergers', 'Zones agroforestières', 'Jardins'],
    threats: ['Acariens parasites (Varroa)', 'Pesticides systémiques', 'Aléas climatiques'],
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

  if (species.id === MOCK_SPECIES_BLACK_BEE_ID) {
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
