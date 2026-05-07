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
import type { SpeciesContext } from '@/types/species'

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
    weight: '0.1 g',
    size: '12 mm',
    diet: 'Nectarivore / Pollinivore',
    origin_country: 'Madagascar',
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
    description_scientific:
      'La Coccinella septempunctata est le coléoptère prédateur le plus répandu en Europe tempérée, consommant jusqu\'a 5 000 pucerons par an. Ses sept points noirs sur élytres rouges constituent un signal aposématique renforcé par la réflexe autohémorragique : la coccinelle sécrète une hémolymphe amère (coccinelline) depuis ses articulations tibiales. Elle est capable de diapause imaginale dans les litières forestières, supportant des froids jusqu\'a -20°C. L\'invasion de la coccinelle asiatique (Harmonia axyridis), introduite par les jardineries, déplace les populations locales par compétition alimentaire et pathogènes transmis.',
    conservation_status: 'LC',
    image_url: '/images/diaromas/Coccinelle.png',
    associated_projects: [],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    weight: '30 mg',
    size: '5–8 mm',
    diet: 'Insectivore (pucerons)',
    origin_country: 'France',
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
    description_scientific:
      'L\'Olea europaea est un arbre millénaire dont certains spécimens sarden atteignent 3 000 ans. Sa résilience au stress hydrique repose sur un système racinaire profond et des feuilles coriàces à épicuticule cireuse réduisant la transpiration de 70 %. En Sardaigne, la sous-variété sylvestris (oléastre) constitue un réservoir génétique unique face aux pathogènes. La bactérie Xylella fastidiosa, vectée par Philaenus spumarius, colonise le xylème et provoque le syndrome d\'assèchement rapide de l\'olivier (OQDS), menaçant un patrimoine agronomique millénaire. La sous-espèce maderensis constitue un refuge génétique insulaire pour la biodiversité de l\'espèce.',
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
    weight: null,
    size: '8–15 m',
    diet: null,
    origin_country: 'Sardinia',
    habitat: ['Maquis méditerranéen', 'Zones agroforestières', 'Garrigues', 'Terrains arides'],
    threats: ['Bactérie Xylella fastidiosa', 'Phytophthora (clades 2, 6, 8)', 'Changement climatique', 'Abandon des terrains agricoles'],
  },
  {
    id: MOCK_SPECIES_CORAL_ID,
    name_default: 'Acropora corne de cerf',
    scientific_name: 'Acropora muricata',
    description_default:
      'Espèce de corail scléractiniaire arborescent qui construit la topographie complexe du récif. Il est fortement menacé par le blanchissement thermique et le Syndrome Blanc.',
    description_scientific:
      'Acropora muricata est un constructeur de récifs dont les branches digitées peuvent atteindre 2 m de diamètre. Sa croissance (10–15 cm/an) dépend d\'une symbiose obligatoire avec des dinoflagellés endosymbiotes (Symbiodinium spp.) fournissant jusqu\'à 90 % de son énergie via la photosynthèse. Un stress thermique de +1°C soutenu sur 4 semaines provoque la rupture de cette symbiose et le blanchissement. Les fragments peuvent être bouturés en pépinières sous-marines pour la restauration des récifs de Karimunjawa.',
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
    weight: null,
    size: 'jusqu\'a 2 m',
    diet: 'Zooxanthelles (photosynthèse)',
    origin_country: 'Indonésie',
    habitat: ['Récifs coralliens peu profonds', 'Lagons', 'Pentés récifales externes', 'Zones de forte luminosité'],
    threats: ['Blanchissement thermique', 'Syndrome Blanc des Acroporidés', 'Acidification des océans', 'Destructuration des récifs'],
  },
  {
    id: MOCK_SPECIES_BUMBLEBEE_ID,
    name_default: 'Bourdon terrestre',
    scientific_name: 'Bombus terrestris',
    description_default:
      'Grand pollinisateur eusocial à l\'efficacité redoutable, souvent commercialisé. Ses ouvrières sont capables d\'apprendre les couleurs des fleurs pour optimiser le butinage.',
    description_scientific:
      'Bombus terrestris est le bourdon le plus étudié au monde et le pollinisateur commercial le plus vendu (colonies exportées dans 60 pays). Son efficacité de pollinisation par « buzz » (sonication vibratoire à 400 Hz) libère le pollen des anthères poriticides jusqu\'a 50× plus efficacement que l\'abeille domestique. Ses colonies annuelles (400–600 ouvrières) prennent des décisions collectives via des signaux chimiques. Son succès commercial constitue paradoxalement une menace pour les bourdons natifs : propagation de pathogènes et compétition alimentaire avec les espèces sauvages locales.',
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
    weight: '0.3–0.85 g',
    size: '20–26 mm',
    diet: 'Nectarivore / Pollinivore',
    origin_country: 'Belgium',
    habitat: ['Prairies agricoles', 'Jardins urbains', 'Lisières de bois', 'Cultures sous serre'],
    threats: ['Pollution par les pesticides', 'Perte de ressources florales', 'Maladies pathogènes'],
  },
  {
    id: MOCK_SPECIES_OSMIA_ID,
    name_default: 'Osmie rousse',
    scientific_name: 'Osmia bicornis',
    description_default:
      'Abeille maçonne solitaire recouverte de poils roux denses. Elle gère intelligemment la répartition des sexes de sa progéniture en fonction de sa propre taille corporelle.',
    description_scientific:
      'Osmia bicornis est une abeille solitaire à nidification primotemporale (mars–juin) dont les femelles maçonnent des cellules avec de la boue dans des cavités préexistantes. Sa capacité de pollinisation est jusqu\'a 2 500× supérieure à celle d\'Apis mellifera par visite florale. Elle ajuste la ratio des sexes de sa progéniture selon sa taille corporelle : les femelles (plus grandes) sont placées dans les cellules du fond, les mâles à l\'avant, optimisant la survie selon le modèle de Trivers-Willard. L\'extinction de son parasitoïde naturel Cacoxenus indagator est essentielle à la réussite des hôtels à insectes.',
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
    weight: '70 mg',
    size: '10–12 mm',
    diet: 'Pollinivore',
    origin_country: 'Belgium',
    habitat: ['Vergers', 'Jardins', 'Zones urbaines', 'Lisières forestières'],
    threats: ['Perte de sites de nidification', 'Pesticides', 'Urbanisation'],
  },
  {
    id: MOCK_SPECIES_MEGACHILE_ID,
    name_default: 'Mégachile',
    scientific_name: 'Megachile centuncularis',
    description_default:
      'Abeille solitaire coupeuse de feuilles qui maçonne ses nids au-dessus du sol. Elle subit une forte compétition de la part d\'espèces invasives dans les hôtels à insectes.',
    description_scientific:
      'Megachile centuncularis découpe des disques de feuilles (rosiers, lilas) avec ses mandibules pour tapisser ses cellules de nidification. Elle transporte le pollen sur les poils scopaux de l\'abdomen, non sur les pattes, ce qui la rend très efficace pour la pollinisation des légumineuses et des rosées. Sa présence dans les hôtels à insectes est un bioindicateur de la disponibilité en végétation florale diversifiée dans un rayon de 300 m. La Mégachile sculptée (M. sculpturalis), espèce invasive nord-américaine arrivée en Europe en 2008, la concurrence directement pour les sites de nidification.',
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
    weight: '40 mg',
    size: '11–13 mm',
    diet: 'Pollinivore',
    origin_country: 'Belgium',
    habitat: ['Jardins', 'Prairies fleuries', 'Zones rudérales'],
    threats: ['Intensification agricole', 'Compétition par la Mégachile sculptée invasive'],
  },
  {
    id: MOCK_SPECIES_SYRPHID_ID,
    name_default: 'Syrphe ceinturé',
    scientific_name: 'Episyrphus balteatus',
    description_default:
      'Mouche déguisée en guêpe (mimétisme batésien) et excellent migrateur. Elle présente une écologie duelle fascinante entre son stade larvaire et adulte.',
    description_scientific:
      'Episyrphus balteatus est l\'un des insectes migrateurs les plus actifs d\'Europe, réalisant des mouvements de masse au-dessus des cols alpins (jusqu\'a 4 milliards d\'individus/an). Son mimétisme batésien imite les bandes jaunes et noires des guêpes. Ses larves aphidiphages consomment jusqu\'a 800 pucerons avant la nymphose. Les adultes s\'orientent par détection du flux optique pour un vol à contre-vent précis, capacité aéronautique étudiée pour la robotique des micro-drones. L\'adulte se nourrit de nectar et joue un rôle de pollinisateur généraliste essentiel dans les aérosystèmes tempérés.',
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
    weight: '20–35 mg',
    size: '10–12 mm',
    diet: 'Adulte : Nectarivore / Larve : Aphidiphage',
    origin_country: 'Belgium',
    habitat: ['Cultures agricoles', 'Prairies', 'Jardins', 'Lisières'],
    threats: ['Application de pesticides à large spectre', 'Monoculture'],
  },
  {
    id: MOCK_SPECIES_BUTTERFLY_CITRON_ID,
    name_default: 'Papillon citron',
    scientific_name: 'Gonepteryx rhamni',
    description_default:
      'Lépidoptère robuste aux ailes mimétiques de feuilles, capable d\'hiverner à l\'état adulte. Il apparaît aux premiers jours chauds de l\'année.',
    description_scientific:
      'Gonepteryx rhamni détient le record de longévité imaginale chez les Lépidoptères européens : jusqu\'à 13 mois, grâce à une double diapause (étivation + hibernation). Son aile antérieure mimétique d\'une feuille (nervures en relief, pointe apicale typique) est l\'une des adaptations camouflantes les plus parfaites du règne animal. Sa production de glycérol permet la survie cellulaire jusqu\'à -20°C. Le dimorphisme sexuel est spectaculaire : le mâle est jaune citron pur, la femelle blanc-verdâtre, mimétisant respectivement les feuilles jeunes et ternies.',
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
    weight: '0.2–0.3 g',
    size: '52–60 mm (envergure)',
    diet: 'Nectarivore',
    origin_country: 'Belgium',
    habitat: ['Lisières boisées', 'Haies', 'Jardins', 'Vergers'],
    threats: ['Perte de plantes hôtes (Rhamnus)', 'Pesticides', 'Fragmentation'],
  },
  {
    id: MOCK_SPECIES_BUTTERFLY_PEACOCK_ID,
    name_default: 'Paon-du-jour',
    scientific_name: 'Aglais io',
    description_default:
      'Papillon vif orné d\'ocelles dissuasives. Ses chenilles dépendent quasi exclusivement de la présence d\'orties dioïques pour leur développement.',
    description_scientific:
      'Aglais io possède quatre faux-yeux (ocelles) reproduisant la physionomie faciale d\'un hibou. La réponse de sursaut de ces ocelles réduit les attaques de prédateurs de 60 % dans les expériences de terrain. Ses chenilles grégaires construisent des toiles protectrices sur les orties. Les adultes hibernent dans les fissures et grottes jusqu\'à 9 mois grâce à une baisse du métabolisme de 95 %, se gorgeant de nectar de saule lors des redoux hivernaux pour reconstituer leurs réserves énergétiques avant le froid définitif.',
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
    weight: '0.3–0.5 g',
    size: '55–65 mm (envergure)',
    diet: 'Nectarivore',
    origin_country: 'Belgium',
    habitat: ['Prairies humides', 'Lisières forestières', 'Jardins'],
    threats: ['Perte d\'habitat (orties)', 'Pesticides', 'Fragmentation'],
  },
  {
    id: MOCK_SPECIES_HEDGEHOG_ID,
    name_default: 'Hérisson européen',
    scientific_name: 'Erinaceus europaeus',
    description_default:
      'Petit mammifère omnivore récemment reclassé à cause de graves déclins démographiques (jusqu\'à 50% dans certaines régions). Il est hautement vulnérable à la fragmentation de son territoire.',
    description_scientific:
      'Erinaceus europaeus possède entre 5 000 et 7 000 épines kératinées creuses, capables de se hérisser via le muscle orbicularis en moins de 100 ms. Sa résistance aux venins de serpents (facteur protéique sérique ERINACIN) et aux toxines végétales est documentée. En hibernation, sa température corporelle chute à 2°C et son rythme cardiaque de 190 à 20 bpm, réduisant le métabolisme de 93 %. Les populations britanniques ont décliné de 75 % depuis les années 1950 ; en Belgique, l\'espèce est menacée par la densification des réseaux routiers et l\'emploi massif de slug pellets au méthiocarbe.',
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
    weight: '600–1 200 g',
    size: '23–27 cm',
    diet: 'Insectivore / Omnivore',
    origin_country: 'Belgium',
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
    weight: '6–9.5 kg',
    size: '64–72 cm',
    diet: 'Folivore strict',
    origin_country: 'Madagascar',
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
    weight: '6–8.5 kg',
    size: '47–55 cm',
    diet: 'Folivore / Frugivore',
    origin_country: 'Madagascar',
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
    weight: '3–3.8 kg',
    size: '51–57 cm',
    diet: 'Frugivore / Nectarivore',
    origin_country: 'Madagascar',
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
    weight: '700g',
    size: '70cm',
    origin_country: 'Madagascar',
    diet: 'Insectivore',
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
    weight: '60–180 g',
    size: '38–52 cm',
    diet: 'Insectivore',
    origin_country: 'Madagascar',
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
    description_scientific:
      'Trachelophorus giraffa doit son nom au cou extrêmement allongé du mâle, résultat d\'une sélection sexuelle intense pour les combats intrasexuels. La femelle, au cou bien plus court, découpe et roule méticuleusement une feuille de Dichaetanthera (arbuste malgache) en un cylindre protecteur autour d\'un unique œuf. Ce comportement de construction de nid foliaire, unique chez les coléoptères de cette complexité, est entièrement instinctif. Le mâle monte la garde durant l\'oviposition, éloignant les rivaux par des affrontements spectaculaires au coup de cou.',
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
    weight: '< 1 g',
    size: '25–30 mm',
    diet: 'Herbivore (feuilles)',
    origin_country: 'Madagascar',
    habitat: ['Forêts humides', 'Zones de transition forestière', 'Plantations'],
    threats: ['Déforestation', 'Perte de plantes hôtes', 'Fragmentation'],
  },
  {
    id: MOCK_SPECIES_TOMATO_FROG_ID,
    name_default: 'Grenouille tomate',
    scientific_name: 'Dyscophus antongilii',
    description_default:
      'La Grenouille tomate de Madagascar est un amphibien terrestre massif et fouisseur, célèbre pour sa coloration rouge vif aposématique qui avertit les prédateurs de sa toxine adhésive. Sa reproduction est explosive et liée aux pluies torrentielles, ses têtards jouant un rôle vital de purification biologique dans les eaux stagnantes.',
    weight: '40–230 g',
    size: '6–10.5 cm',
    diet: 'Insectivore',
    origin_country: 'Madagascar',
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
    description_scientific:
      'Corythornis madagascariensis est l\'un des deux martin-pêcheurs endémiques de Madagascar. Il chasse en plongeant depuis un perchoir fixe au-dessus de l\'eau, localisant ses proies grâce à une vision qui compense la réfraction optique de l\'interface air-eau. Ses nids sont forés dans les berges argileuses par les deux parents. Sa dépendance aux cours d\'eau forestiers clairs en fait un indicateur biologique fiable de la qualité des eaux douces malgaches, menacées par l\'érosion et la déforestation.',
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
    weight: '14–18 g',
    size: '13 cm',
    diet: 'Piscivore / Insectivore',
    origin_country: 'Madagascar',
    habitat: ['Cours d\'eau', 'Rivières', 'Zones humides', 'Forêts riveraines'],
    threats: ['Pollution de l\'eau', 'Destruction des ripisylves', 'Perte de zones humides'],
  },
  {
    id: MOCK_SPECIES_COUA_ID,
    name_default: 'Coua bleu',
    scientific_name: 'Coua caerulea',
    description_default:
      'Coucou terrestre endémique au plumage bleu iridescent, capable de se déplacer rapidement au sol. Il est un important disperseur de graines dans les forêts malgaches.',
    description_scientific:
      'Coua caerulea est un coucou terrestre endémique de Madagascar, connu pour son plumage bleu iridescent et sa capacité à se déplacer rapidement au sol. Il est un important disperseur de graines dans les forêts malgaches, contribuant ainsi à la régénération des écosystèmes forestiers. Il se nourrit d\'invertébrés, de fruits et de lézards, et est considéré comme une espèce clé pour le maintien de la biodiversité dans les forêts malgaches.',
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
    weight: '170–200 g',
    size: '48–52 cm',
    diet: 'Omnivore (invertébrés, fruits, lézards)',
    origin_country: 'Madagascar',
    habitat: ['Forêts sèches', 'Forêts humides', 'Zones de transition'],
    threats: ['Déforestation', 'Fragmentation', 'Perte d\'habitat'],
  },
  {
    id: MOCK_SPECIES_GECKO_ID,
    name_default: 'Gecko diurne',
    scientific_name: 'Phelsuma laticauda',
    description_default:
      'Gecko diurne au corps vert vif et à la queue écarlate, capable de se nourrir de nectar et de pollen. Il est un pollinisateur important pour les plantes forestières malgaches.',
    description_scientific:
      'Phelsuma laticauda est un gecko diurne endémique de Madagascar, connu pour son corps vert vif et sa queue écarlate. Il est un important pollinisateur pour les plantes forestières malgaches, se nourrissant de nectar et de pollen. Il est également un indicateur de la santé des écosystèmes forestiers, car il dépend de la présence de plantes à fleurs pour sa survie.',
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
    weight: '10–20 g',
    size: '10–14 cm',
    diet: 'Insectivore / Nectarivore',
    origin_country: 'Madagascar',
    habitat: ['Forêts humides', 'Forêts sèches', 'Plantations', 'Zones arbustives'],
    threats: ['Commerce international illégal', 'Perte d\'habitat', 'Déforestation'],
  },
  {
    id: MOCK_SPECIES_LITTLE_OWL_ID,
    name_default: 'Chouette chevêche',
    scientific_name: 'Athene superciliaris',
    description_default:
      'Chouette endémique de Madagascar au plumage brun strié et aux yeux jaunes. Elle dépend des arbres creux et des zones ouvertes pour chasser les petits mammifères et insectes.',
    description_scientific:
      'Athene superciliaris est une chouette endémique de Madagascar aux sourcils blancs distinctifs. Rapace nocturne, elle chasse des insectes, petits vertébrés (geckos, caméléons) et rongeurs depuis un poste d\'afflút fixe. Sa nidification dans les cavités d\'arbres matures en fait un indicateur de la présence de vieux arbres creux, ressource critique pour de nombreuses espèces de la faune malgache.',
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
    weight: '100–180 g',
    size: '23–27 cm',
    diet: 'Insectivore / Carnivore',
    origin_country: 'Madagascar',
    habitat: ['Bocages', 'Vergers', 'Prairies', 'Zones ouvertes'],
    threats: ['Pesticides', 'Disparition des arbres creux', 'Perte d\'habitat'],
  },
  {
    id: MOCK_SPECIES_HOOPoe_ID,
    name_default: 'Huppe fasciée',
    scientific_name: 'Upupa epops',
    description_default:
      'Oiseau au plumage brun orangé et à la huppe spectaculaire. Il est un insectivore important des zones agricoles et des vergers, se nourrissant de larves et d\'insectes du sol.',
    description_scientific:
      'Upupa epops possède un bec long et courbé permettant de sonder la terre et les écorces pour extraire des larves et des vers. Les femelles produisent une sécrétion antimicrobienne via une glande uropygiale spécialisée, riche en bactéries productrices d\'antibiotiques naturels. Dans les oliveraies sardes, elle joue un rôle crucial de régulation des ravageurs (Bactrocera oleae, Prays oleae), réduisant les besoins en pesticides.',
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
    weight: '46–89 g',
    size: '25–32 cm',
    diet: 'Insectivore (larves, vers de terre)',
    origin_country: 'Sardinia',
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
    description_scientific:
      'Acropora muricata est un constructeur de récifs dont les branches digitées atteignent 2 m de diamètre. Sa croissance (10–15 cm/an) dépend de la symbiose obligatoire avec des dinoflagellés endosymbiotes (Symbiodinium spp.) fournissant jusqu\'à 90 % de son énergie. Sous un stress thermique (+1°C sur 4 semaines), cette symbiose se rompt, provoquant le blanchissement. Les fragments de corail peuvent être bouturés pour la restauration artificielle des récifs dans l\'archipel de Karimunjawa.',
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
    weight: null,
    size: 'jusqu\'à 2 m',
    diet: 'Zooxanthelles (photosynthèse)',
    origin_country: 'Indonésie',
    habitat: ['Récifs coralliens peu profonds', 'Lagons', 'Pentés récifales externes', 'Zones de forte luminosité'],
    threats: ['Blanchissement thermique', 'Syndrome Blanc des Acroporidés', 'Acidification des océans', 'Destructuration des récifs'],
  },
  {
    id: MOCK_SPECIES_CLOWNFISH_ID,
    name_default: 'Poisson clown',
    scientific_name: 'Amphiprion ocellaris',
    description_default:
      'Poisson emblématique en symbiose obligatoire avec les anémones. Il est essentiel à l\'équilibre du récif et dépend entièrement de la santé des coraux hôtes.',
    description_scientific:
      'Amphiprion ocellaris vit en symbiose mutualiste avec l\'anémone de mer, qu\'il protège de ses prédateurs en échange d\'abri. Sa protection contre le venin de l\'anémone repose sur une glycoprotéine spéciale dans son mucus. C\'est une espèce hermaphrodite protéandrique : si la femelle dominante disparaît, le mâle dominant se transforme en femelle. La popularité aquariophile massive post-Nemo (2003) a provoqué une surpêche de 40 % des populations sauvages en deux ans.',
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
    weight: '10–30 g',
    size: '8–11 cm',
    diet: 'Omnivore (plancton, algues)',
    origin_country: 'Indonésie',
    habitat: ['Récifs coralliens', 'Anémones', 'Zones de faible profondeur'],
    threats: ['Dégradation des récifs', 'Commerce aquariophile', 'Blanchissement des coraux hôtes'],
  },
  {
    id: MOCK_SPECIES_BLUE_DEMOISELLE_ID,
    name_default: 'Demoiselle bleue',
    scientific_name: 'Chrysiptera cyanea',
    description_default:
      'Poisson récifal au bleu électrique vif, territorial et agressif. Il est un indicateur sensible de la santé du récif corallien et de la qualité de l\'eau.',
    description_scientific:
      'Chrysiptera cyanea est un poisson récifal hautement territorial qui cultive des jardins d\'algues filamenteuses sur son territoire. Son bleu électrique est produit par des nanostructures d\'iridophores réfléchissant préférentiellement à 450 nm. Sa présence en grand nombre signale des récifs à forte couverture corallienne et à faible sédimentation, en faisant un bioindicateur de la santé récifale.',
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
    weight: '3–8 g',
    size: '6–8 cm',
    diet: 'Herbivore / Omnivore (algues, zooplancton)',
    origin_country: 'Indonésie',
    habitat: ['Récifs coralliens', 'Pentés externes', 'Zones de fort courant'],
    threats: ['Dégradation des récifs', 'Blanchissement', 'Pollution'],
  },
  {
    id: MOCK_SPECIES_BUTTERFLYFISH_ID,
    name_default: 'Poisson-papillon',
    scientific_name: 'Chaetodon auriga',
    description_default:
      'Poisson aux motifs spectaculaires et spécialiste des coraux pour l\'alimentation. Il dépend fortement de la santé des coraux branchus pour sa survie.',
    description_scientific:
      'Chaetodon auriga se spécialise dans le raclage des polypes coralliens grâce à son museau allongé et à ses dents fine-incisives. Le faux-œil postérieur sur la nageoire dorsale constitue un leurre confondant les prédateurs sur la direction de fuite. Sa densité décline avant même que le blanchissement corallien soit visible à l\'œil nu, en faisant l\'un des premiers indicateurs de stress des récifs.',
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
    weight: '60–130 g',
    size: '18–23 cm',
    diet: 'Corallivore / Carnivore (polypes, vers)',
    origin_country: 'Indonésie',
    habitat: ['Récifs coralliens', 'Pentés externes', 'Zones de forte luminosité'],
    threats: ['Perte de coraux', 'Blanchissement', 'Dégradation des récifs'],
  },
  {
    id: MOCK_SPECIES_SEAHORSE_ID,
    name_default: 'Hippocampe',
    scientific_name: 'Hippocampus bargibanti',
    description_default:
      'Hippocampe pygmée endémique des gorgones des récifs tropicaux. Il est extrêmement spécialisé et dépend entièrement de la présence de gorgones saines pour sa survie.',
    description_scientific:
      'Hippocampus bargibanti est le maître du camouflage récifal : ses tubercules cutanés reproduisent exactement la couleur et la texture de la gorgone hôte (Muricella plectana), avec une précision telle qu\'il a été découvert par accident en 1969. Incapable de nager sur de longues distances, il passe toute sa vie sur une seule gorgone. Comme tous les hippocampes, c\'est le mâle qui gestate les jeunes dans une poche ventrale.',
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
    weight: '< 1 g',
    size: '1.4–2.7 cm',
    diet: 'Carnivore (copépodes, amphipodes)',
    origin_country: 'Indonésie',
    habitat: ['Récifs coralliens', 'Gorgones', 'Herbiers marins', 'Zones de faible profondeur'],
    threats: ['Commerce international', 'Dégradation des récifs', 'Pollution', 'Perte de gorgones'],
  },
  {
    id: MOCK_SPECIES_GREEN_TURTLE_ID,
    name_default: 'Tortue verte',
    scientific_name: 'Chelonia mydas',
    description_default:
      'Tortue marine herbivore majestueuse, essentielle à l\'équilibre des herbiers et récifs. Elle parcourt des milliers de kilomètres entre ses sites de reproduction et d\'alimentation.',
    description_scientific:
      'Chelonia mydas est le seul reptile herbivore exclusivement marin à l\'âge adulte, se nourrissant d\'herbiers et d\'algues. Ce régime contribue à maintenir les herbiers courts et productifs, un service écologique unique. Elle réalise des migrations de 2 000 km entre sites d\'alimentation et plages de nidification natales (philopatrie). L\'élévation des températures des plages de nidification féminise massivement les portées, menaçant la viabilité des populations à long terme.',
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
    weight: '136–200 kg',
    size: '80–120 cm',
    diet: 'Herbivore (herbiers marins, algues)',
    origin_country: 'Indonésie',
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
    description_scientific:
      'Liotrigona bitika est l\'une des plus petites abeilles eusociales au monde (< 2 mm), appartenant au groupe des Méliponines sans dard. Sa taille microscopique lui permet d\'accéder aux fleurs tubulaires minuscules inaccessibles aux autres pollinisateurs. Les colonies nichent exclusivement dans les cavités des grands arbres matures des forêts décidues sèches de l\'ouest malgache. La disparition de ces arbres centenaires constitue la menace principale pour l\'espèce.',
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
    weight: '< 2 mg',
    size: '1.8–2 mm',
    diet: 'Pollinivore / Nectarivore',
    origin_country: 'Madagascar',
    habitat: ['Forêts pluviales', 'Lisières forestières', 'Grands arbres de nidification', 'Canopée'],
    threats: ['Perte de grands arbres de nidification', 'Compétition avec les fourmis invasives', 'Fragmentation'],
  },
  {
    id: MOCK_SPECIES_APIS_LIGUSTICA_ID,
    name_default: 'Abeille mellifère italienne',
    scientific_name: 'Apis mellifera ligustica',
    description_default:
      'Sous-espèce apicole extrêmement populaire originaire de la péninsule italienne. Elle soutient le rendement commercial et la résilience florale des paysages secs.',
    description_scientific:
      'Apis mellifera ligustica est la sous-espèce la plus commercialisée au monde (tempérament doux, forte production de miel, faible essaimage). En Sardaigne, elle constitue un pollinisateur clé des oliveraies et du maquis méditerranéen. Cependant, son introduction massive crée une compétition alimentaire sévère avec les abeilles sauvages locales pour les ressources florales, constituant une menace indirecte pour la biodiversité.',
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
    weight: '0.1 g',
    size: '12–15 mm',
    diet: 'Nectarivore / Pollinivore',
    origin_country: 'Sardinia',
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
): Promise<{ name_default: string; image_url?: string | null } | null> => {
  const species = MOCK_SPECIES.find((entry) => entry.id === id)
  return species ? { name_default: species.name_default, image_url: species.image_url } : null
}
