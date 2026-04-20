import {
  MOCK_BLOG_POST_1_ID,
  MOCK_BLOG_POST_1_SLUG,
  MOCK_BLOG_POST_2_ID,
  MOCK_BLOG_POST_2_SLUG,
  MOCK_BLOG_POST_3_ID,
  MOCK_BLOG_POST_3_SLUG,
  MOCK_BLOG_POST_4_ID,
  MOCK_BLOG_POST_4_SLUG,
  MOCK_BLOG_POST_5_ID,
  MOCK_BLOG_POST_5_SLUG,
  MOCK_BLOG_POST_6_ID,
  MOCK_BLOG_POST_6_SLUG,
} from '@/lib/mock/mock-ids'
import type { BlogPostContent } from './blog-types'

type MockBlogPostSeed = {
  id: string
  slug: string
  title_default: string
  title_i18n?: Record<string, string> | null
  excerpt_default: string
  excerpt_i18n?: Record<string, string> | null
  content: BlogPostContent
  cover_image_url: string
  author_name: string
  author_avatar_url?: string | null
  published_at: string
  tags: string[]
  featured: boolean
}

const MOCK_BLOG_POSTS: MockBlogPostSeed[] = [
  {
    id: MOCK_BLOG_POST_1_ID,
    slug: MOCK_BLOG_POST_1_SLUG,
    title_default: "L'impact des mielleries mobiles sur l'apiculture à Madagascar",
    title_i18n: {
      fr: "L'impact des mielleries mobiles sur l'apiculture à Madagascar",
      en: 'The Impact of Mobile Honey Houses on Beekeeping in Madagascar',
    },
    excerpt_default:
      'Découvrez comment nos miellies mobiles tout-terrain révolutionnent la collecte du miel dans les régions les plus isolées de Madagascar, tout en soutenant les apiculteurs locaux.',
    excerpt_i18n: {
      fr: 'Découvrez comment nos mielleries mobiles tout-terrain révolutionnent la collecte du miel dans les régions les plus isolées de Madagascar, tout en soutenant les apiculteurs locaux.',
      en: 'Discover how our all-terrain mobile honey houses revolutionize honey collection in the most remote regions of Madagascar, while supporting local beekeepers.',
    },
    content: {
      kind: 'legacyText',
      text: "Les mielleries mobiles sont un concept innovant utilisé par notre société pour accéder aux ruchers difficiles d'accès dans les différentes régions de Madagascar. Il s'agit de camions tout-terrain aménagés en mielleries permettant la récolte directement sur place, à l'abri de la poussière et de l'humidité, selon les bonnes pratiques apicoles modernes.\n\nCes unités sont équipées d'un matériel de récolte professionnel, tel que des extracteurs de miel électriques, des cuves d'assèchement, une cuve de filtration, des centrifugeuses, des filtres à miel et un compartiment de stockage à basse température pour conserver le miel brut jusqu'à la miellerie. Elles sont également équipées de générateurs pour alimenter les machines et de réservoirs d'eau pour le lavage des équipements.\n\nCela permet aux apiculteurs d'Ilanga Nature d'accéder à des ruchers situés dans des zones difficiles d'accès - comme les forêts tropicales ou les montagnes - où les abeilles récoltent un nectar rare et de grande qualité. Les apiculteurs peuvent ainsi récolter un miel de la plus haute qualité et maximiser les rendements tout en réduisant les coûts de transport et de main-d'œuvre.\n\nNotre école les utilise également pour former les apiculteurs locaux. Les formateurs peuvent se rendre directement dans les ruchers pour faire la démonstration des techniques de récolte et de traitement du miel, et les participants peuvent immédiatement mettre en pratique les compétences qu'ils ont acquises.\n\nCes unités d'extraction/récolte sont approuvées par le ministère de l'élevage pour l'exportation vers l'Union européenne.",
    },
    cover_image_url: '/miellerie-mobile.png',
    author_name: 'Équipe Ilanga Nature',
    author_avatar_url: '/images/logo-icon-bee.png',
    published_at: '2026-04-15T08:00:00.000Z',
    tags: ['Projets', 'Tech'],
    featured: true,
  },
  {
    id: MOCK_BLOG_POST_2_ID,
    slug: MOCK_BLOG_POST_2_SLUG,
    title_default: 'Oliviers de Sardaigne : une agriculture durable',
    title_i18n: {
      fr: 'Oliviers de Sardaigne : une agriculture durable',
      en: 'Sardinia Olive Trees: Sustainable Agriculture',
    },
    excerpt_default:
      'Notre projet en Sardaigne compte 10 000 oliviers issus de plusieurs variétés toscanes prestigieuses, avec un moulin à huile installé directement sur site pour une qualité optimale.',
    excerpt_i18n: {
      fr: 'Notre projet en Sardaigne compte 10 000 oliviers issus de plusieurs variétés toscanes prestigieuses, avec un moulin à huile installé directement sur site pour une qualité optimale.',
      en: 'Our project in Sardinia features 10,000 olive trees from prestigious Tuscan varieties, with an oil mill installed directly on site for optimal quality.',
    },
    content: {
      kind: 'legacyText',
      text: "Notre projet en Sardaigne compte 10 000 oliviers issus de plusieurs variétés toscanes prestigieuses : Leccino, Frantoio et Leccio del Corno. Ces variétés sont réputées pour produire des huiles d'olive de haute qualité aux arômes complexes et équilibrés.\n\nUn moulin à huile moderne est installé directement sur le site, permettant le pressage des olives immédiatement après la récolte. Cette approche de 'ferme à bouteille' garantit une fraîcheur optimale et préserve les qualités organoleptiques de l'huile.\n\nLe projet s'inscrit dans une démarche d'agriculture durable, respectant les cycles naturels des oliviers et minimisant l'impact environnemental. Les techniques culturales privilégient la biodiversité et la santé des sols, sans utilisation de produits chimiques de synthèse.\n\nCette exploitation contribue à la préservation du paysage oléicole traditionnel sard, tout en innovant avec des méthodes modernes de production et de transformation.",
    },
    cover_image_url: '/images/projects/miellerie-manakara.jpg',
    author_name: 'Équipe Oliviers de Sardaigne',
    author_avatar_url: '/images/logo-icon-bee.png',
    published_at: '2026-04-10T08:00:00.000Z',
    tags: ['Projets'],
    featured: false,
  },
  {
    id: MOCK_BLOG_POST_3_ID,
    slug: MOCK_BLOG_POST_3_SLUG,
    title_default: "Comment nous utilisons la technologie pour suivre les ruches",
    title_i18n: {
      fr: "Comment nous utilisons la technologie pour suivre les ruches",
      en: 'How We Use Technology to Track Hives',
    },
    excerpt_default:
      "Découvrez notre système de suivi IoT qui permet de surveiller en temps réel la santé des colonies, la température et l'activité des abeilles pour une apiculture plus intelligente.",
    excerpt_i18n: {
      fr: "Découvrez notre système de suivi IoT qui permet de surveiller en temps réel la santé des colonies, la température et l'activité des abeilles pour une apiculture plus intelligente.",
      en: 'Discover our IoT tracking system that allows real-time monitoring of colony health, temperature, and bee activity for smarter beekeeping.',
    },
    content: {
      kind: 'legacyText',
      text: "Chez Make The Change, nous intégrons la technologie moderne pour améliorer l'apiculture traditionnelle. Nos ruches sont équipées de capteurs IoT qui surveillent en temps réel plusieurs paramètres cruciaux :\n\n**Température et humidité** : Les capteurs mesurent la température interne et externe de la ruche ainsi que le taux d'humidité. Ces données nous alertent en cas de conditions anormales qui pourraient affecter la santé de la colonie.\n\n**Poids de la ruche** : Des balances connectées nous indiquent le poids de la ruche, ce qui nous permet de suivre l'évolution des réserves de miel et d'anticiper les besoins de nourrissement.\n\n**Activité des abeilles** : Des compteurs d'entrée/sortie nous renseignent sur l'intensité de l'activité de la colonie, un indicateur clé de sa santé et de sa productivité.\n\nToutes ces données sont transmises en temps réel via réseau cellulaire ou satellite vers notre plateforme centralisée. Nos apiculteurs reçoivent des alertes automatiques en cas d'anomalie et peuvent intervenir rapidement pour protéger les colonies.\n\nCette technologie nous permet également de collecter des données précieuses pour la recherche et l'amélioration continue de nos pratiques apicoles.",
    },
    cover_image_url: '/images/projects/antsirabe-ruchers-1.jpg',
    author_name: 'Équipe Technique',
    author_avatar_url: '/images/logo-icon-bee.png',
    published_at: '2026-04-05T08:00:00.000Z',
    tags: ['Tech'],
    featured: false,
  },
  {
    id: MOCK_BLOG_POST_4_ID,
    slug: MOCK_BLOG_POST_4_SLUG,
    title_default: 'Rencontre avec Andraina, apiculteur à Antsirabe',
    title_i18n: {
      fr: 'Rencontre avec Andraina, apiculteur à Antsirabe',
      en: 'Meeting Andraina, Beekeeper in Antsirabe',
    },
    excerpt_default:
      "Portrait d'un apiculteur passionné qui gère 45 ruches près de la réserve d'Analamazoatra et contribue à la préservation de la biodiversité malgache.",
    excerpt_i18n: {
      fr: "Portrait d'un apiculteur passionné qui gère 45 ruches près de la réserve d'Analamazoatra et contribue à la préservation de la biodiversité malgache.",
      en: 'Portrait of a passionate beekeeper managing 45 hives near the Analamazoatra reserve and contributing to the preservation of Malagasy biodiversity.',
    },
    content: {
      kind: 'legacyText',
      text: "Andraina est apiculteur depuis plus de 15 ans. Il gère aujourd'hui 45 ruches réparties sur un site situé derrière son habitation, à quelques mètres de la réserve spéciale d'Analamazoatra.\n\nCette forêt tropicale est un hotspot de biodiversité, abritant de nombreuses espèces de lémuriens, dont l'Indri, ainsi que des caméléons, plus de 100 espèces d'oiseaux et une grande diversité d'amphibiens et de plantes endémiques.\n\n« Les abeilles sont essentielles pour la pollinisation de toutes ces plantes », explique Andraina. « Sans elles, beaucoup d'espèces ne pourraient pas survivre. C'est pourquoi je suis fier de contribuer à leur protection. »\n\nAndraina a reçu ses premières ruches de la part d'Ilanga Nature, qui soutient le développement d'une apiculture locale durable. Depuis, il a pu étendre son activité et former d'autres apiculteurs de la région.\n\n« La coopérative m'a permis d'accéder à un matériel de qualité et à une formation professionnelle », raconte-t-il. « Aujourd'hui, je peux vivre de mon activité et transmettre mon savoir à la prochaine génération. »\n\nSon miel, récolté dans les forêts d'eucalyptus environnantes, est particulièrement apprécié pour ses notes aromatiques uniques et sa texture onctueuse.",
    },
    cover_image_url: '/images/projects/antsirabe-ruchers-2.mov',
    author_name: 'Marie Dupont',
    author_avatar_url: '/images/logo-icon-bee.png',
    published_at: '2026-03-28T08:00:00.000Z',
    tags: ['Interviews'],
    featured: false,
  },
  {
    id: MOCK_BLOG_POST_5_ID,
    slug: MOCK_BLOG_POST_5_SLUG,
    title_default: 'Restauration des récifs coralliens en Indonésie',
    title_i18n: {
      fr: 'Restauration des récifs coralliens en Indonésie',
      en: 'Coral Reef Restoration in Indonesia',
    },
    excerpt_default:
      'Notre projet de restauration des récifs coralliens à Karimunjawa implante de nouveaux fragments de corail pour recréer des zones de biodiversité marine active et protéger les côtes.',
    excerpt_i18n: {
      fr: 'Notre projet de restauration des récifs coralliens à Karimunjawa implante de nouveaux fragments de corail pour recréer des zones de biodiversité marine active et protéger les côtes.',
      en: 'Our coral reef restoration project in Karimunjawa plants new coral fragments to recreate active marine biodiversity zones and protect coastlines.',
    },
    content: {
      kind: 'legacyText',
      text: "Notre projet de restauration des récifs coralliens se déroule à Karimunjawa, en Indonésie, où nous implantons de nouveaux fragments de corail pour recréer des zones de biodiversité marine active. Les coraux sont les fondements des écosystèmes tropicaux, fournissant un habitat essentiel à des milliers d'espèces marines.\n\nLes coraux restaurés ont 60 à 85% de chance de survie sur 12 mois, créant des micro-habitats pour les poissons tropicaux et régénérant 0,02 m² de récif par corail. Chaque structure complète (18 coraux) restaure 0,3 à 0,5 m² de récif.\n\nCe projet a un impact environnemental majeur : recréation d'habitats marins, augmentation de la biodiversité, retour des poissons tropicaux, développement d'écosystèmes complets et protection des côtes contre l'érosion.\n\nSur le plan social et économique, nous employons des plongeurs et des équipes locales, développons un tourisme durable et sensibilisons les populations locales à l'importance de la conservation marine.\n\n« Avant, les récifs étaient morts », raconte Budi, un plongeur local. « Maintenant, on voit de plus en plus de poissons revenir. C'est un espoir pour l'avenir de notre communauté. »",
    },
    cover_image_url: '/coral-karimunjawa.jpg',
    author_name: 'Équipe Trilogy Ocean Restoration',
    author_avatar_url: '/images/logo-icon-bee.png',
    published_at: '2026-03-20T08:00:00.000Z',
    tags: ['Projets'],
    featured: false,
  },
  {
    id: MOCK_BLOG_POST_6_ID,
    slug: MOCK_BLOG_POST_6_SLUG,
    title_default: "Notre approche de l'apiculture durable",
    title_i18n: {
      fr: "Notre approche de l'apiculture durable",
      en: 'Our Approach to Sustainable Beekeeping',
    },
    excerpt_default:
      "Découvrez les principes qui guident notre pratique apicole : respect des abeilles, préservation de l'environnement, et soutien aux communautés locales pour une api-écologie éthique.",
    excerpt_i18n: {
      fr: "Découvrez les principes qui guident notre pratique apicole : respect des abeilles, préservation de l'environnement, et soutien aux communautés locales pour une api-écologie éthique.",
      en: 'Discover the principles guiding our beekeeping practice: respect for bees, environmental preservation, and support for local communities for ethical api-ecology.',
    },
    content: {
      kind: 'legacyText',
      text: "Chez Make The Change, notre approche de l'apiculture repose sur trois piliers fondamentaux :\n\n**Respect des abeilles** : Nous pratiquons une apiculture qui respecte le cycle naturel des colonies. Nous ne récoltons que le surplus de miel, laissant toujours suffisamment de réserves aux abeilles pour l'hiver. Nous évitons l'utilisation de produits chimiques synthétiques et privilégions des méthodes naturelles de lutte contre les maladies et les parasites.\n\n**Préservation de l'environnement** : Nos ruches sont installées dans des zones riches en biodiversité, loin des cultures traitées aux pesticides. Nous encourageons la plantation de fleurs mellifères et la préservation des habitats naturels. Chaque ruche contribue à la pollinisation des plantes sauvages et cultivées dans un rayon de plusieurs kilomètres.\n\n**Soutien aux communautés locales** : Nous travaillons en étroite collaboration avec les apiculteurs locaux, en leur fournissant une formation, un matériel de qualité et un accès équitable aux marchés. Notre modèle économique vise à créer des emplois durables et à valoriser le savoir-faire traditionnel.\n\nCette approche d'api-écologie éthique nous permet de produire un miel de qualité exceptionnelle tout en ayant un impact positif sur l'environnement et les sociétés dans lesquelles nous opérons.",
    },
    cover_image_url: '/images/projects/miellerie-manakara.jpg',
    author_name: 'Équipe Ilanga Nature',
    author_avatar_url: '/images/logo-icon-bee.png',
    published_at: '2026-03-10T08:00:00.000Z',
    tags: ['Tech'],
    featured: false,
  },
]

export const getMockBlogPosts = (): MockBlogPostSeed[] => MOCK_BLOG_POSTS

export const getMockBlogPostBySlug = (slug: string): MockBlogPostSeed | null =>
  MOCK_BLOG_POSTS.find((post) => post.slug === slug) || null

export const getMockBlogPostById = (id: string): MockBlogPostSeed | null =>
  MOCK_BLOG_POSTS.find((post) => post.id === id) || null
