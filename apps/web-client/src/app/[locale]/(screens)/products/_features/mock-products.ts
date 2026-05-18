import {
  MOCK_PRODUCT_EUCALYPTUS_ID,
  MOCK_PRODUCT_EUCALYPTUS_SLUG,
  MOCK_PRODUCT_EUCALYPTUS_140G_ID,
  MOCK_PRODUCT_EUCALYPTUS_140G_SLUG,
  MOCK_PRODUCT_MANAKARA_ID,
  MOCK_PRODUCT_MANAKARA_SLUG,
  MOCK_PRODUCT_SAVON_DOUX_ID,
  MOCK_PRODUCT_SAVON_DOUX_SLUG,
  MOCK_PRODUCT_HUILE_VISAGE_ID,
  MOCK_PRODUCT_HUILE_VISAGE_SLUG,
  MOCK_PRODUCT_SHAMPOING_ID,
  MOCK_PRODUCT_SHAMPOING_SLUG,
  MOCK_PRODUCT_HUILE_LECCINO_ID,
  MOCK_PRODUCT_HUILE_LECCINO_SLUG,
  MOCK_PRODUCT_HUILE_FRANTOIO_ID,
  MOCK_PRODUCT_HUILE_FRANTOIO_SLUG,
  MOCK_PRODUCER_ILANGA_ID,
  MOCK_PRODUCER_ILANGA_SLUG,
  MOCK_PRODUCER_HABEEBEE_ID,
  MOCK_PRODUCER_HABEEBEE_SLUG,
  MOCK_PRODUCER_SARDINIA_ID,
  MOCK_PRODUCER_SARDINIA_SLUG,
} from '@/lib/mock/mock-ids'

type MockProductProducer = {
  id: string
  slug: string | null
  name_default: string | null
  name_i18n?: Record<string, string> | null
  description_default: string | null
  description_i18n?: Record<string, string> | null
  images: string[] | null
  address_city: string | null
  address_country_code: string | null
  contact_website: string | null
}

type MockProductCategory = {
  id: string
  name_default: string | null
  name_i18n?: Record<string, string> | null
}

export type ProductVariant = {
  id: string
  slug?: string | null
  format_label: string
  format_label_i18n?: Record<string, string> | null
  price_points: number
  price_eur_equivalent: number
  stock_quantity: number
  image_url?: string | null
}

export type MockProductSeed = {
  id: string
  slug: string | null
  name_default: string
  name_i18n?: Record<string, string> | null
  short_description_default?: string | null
  short_description_i18n?: Record<string, string> | null
  description_default: string
  description_i18n?: Record<string, string> | null
  producer_id: string | null
  category_id: string | null
  featured: boolean
  is_hero_product: boolean
  tags: string[]
  stock_quantity: number
  price_points: number
  price_eur_equivalent: number
  fulfillment_method: 'ship' | 'pickup' | 'digital' | 'experience'
  image_url: string
  images: string[]
  certifications: string[]
  created_at: string
  updated_at: string
  producer: MockProductProducer
  category: MockProductCategory
  variants?: ProductVariant[] | null
}

const MOCK_PRODUCTS: MockProductSeed[] = [
  {
    id: MOCK_PRODUCT_EUCALYPTUS_ID,
    slug: MOCK_PRODUCT_EUCALYPTUS_SLUG,
    name_default: 'Miel d’Eucalyptus',
    name_i18n: {
      fr: 'Miel d’Eucalyptus',
      en: 'Eucalyptus Honey',
    },
    short_description_default:
      'Miel artisanal de Madagascar, ambré, boisé et aromatique, issu des forêts d’eucalyptus.',
    short_description_i18n: {
      fr: 'Miel artisanal de Madagascar, ambré, boisé et aromatique, issu des forêts d’eucalyptus.',
      en: 'Artisanal Madagascar honey from eucalyptus forests, with amber color and woody aromatic notes.',
    },
    description_default:
      "Issu des forêts d’eucalyptus de Madagascar, ce miel se distingue par sa robe ambrée et son goût intense, légèrement boisé avec des notes fraîches et aromatiques.\n\nRécolté de manière artisanale, il reflète la richesse des écosystèmes locaux et le travail des apiculteurs engagés. Sa texture onctueuse et son caractère unique en font un miel à la fois authentique et puissant.\n\nAu-delà de ses qualités gustatives, ce miel soutient une apiculture durable et participe à la préservation du vivant grâce à la pollinisation.",
    description_i18n: {
      fr: "Issu des forêts d’eucalyptus de Madagascar, ce miel se distingue par sa robe ambrée et son goût intense, légèrement boisé avec des notes fraîches et aromatiques.\n\nRécolté de manière artisanale, il reflète la richesse des écosystèmes locaux et le travail des apiculteurs engagés. Sa texture onctueuse et son caractère unique en font un miel à la fois authentique et puissant.\n\nAu-delà de ses qualités gustatives, ce miel soutient une apiculture durable et participe à la préservation du vivant grâce à la pollinisation.",
      en: 'Harvested in Madagascar eucalyptus forests, this honey has an amber robe and a powerful, slightly woody aromatic profile. It supports sustainable local beekeeping and biodiversity preservation through pollination.',
    },
    producer_id: MOCK_PRODUCER_ILANGA_ID,
    category_id: 'mock-category-honey',
    featured: true,
    is_hero_product: true,
    tags: ['Miel', 'Ruche', 'Abeilles', 'Abeille noire'],
    stock_quantity: 165,
    price_points: 350,
    price_eur_equivalent: 3.5,
    fulfillment_method: 'ship',
    image_url: '/images/products/miel-eucalyptus-ilanga.png',
    images: ['/images/products/miel-eucalyptus-ilanga.png'],
    certifications: ['Artisanal', 'Origine Madagascar'],
    created_at: '2026-04-11T08:00:00.000Z',
    updated_at: '2026-04-17T08:00:00.000Z',
    variants: [
      {
        id: MOCK_PRODUCT_EUCALYPTUS_140G_ID,
        slug: MOCK_PRODUCT_EUCALYPTUS_140G_SLUG,
        format_label: '140g',
        format_label_i18n: { fr: '140g', en: '140g' },
        price_points: 350,
        price_eur_equivalent: 3.5,
        stock_quantity: 45,
        image_url: '/images/products/miel-eucalyptus-ilanga.png',
      },
      {
        id: MOCK_PRODUCT_EUCALYPTUS_ID,
        slug: MOCK_PRODUCT_EUCALYPTUS_SLUG,
        format_label: '250g',
        format_label_i18n: { fr: '250g', en: '250g' },
        price_points: 550,
        price_eur_equivalent: 5.5,
        stock_quantity: 120,
        image_url: '/images/products/miel-eucalyptus-ilanga.png',
      },
    ],
    producer: {
      id: MOCK_PRODUCER_ILANGA_ID,
      slug: MOCK_PRODUCER_ILANGA_SLUG,
      name_default: 'Ilanga Nature',
      name_i18n: {
        fr: 'Ilanga Nature',
        en: 'Ilanga Nature',
      },
      description_default: "Fondée par un voyageur passionné installé à Madagascar, Ilanga Nature est aujourd'hui conduite par ses enfants Nathan et Naya. Bien plus qu'une marque, c'est une coopérative de petits producteurs engagés, gardiens d'un savoir-faire ancestral.\n\nDepuis Mariembourg en Belgique, ils parcourent Madagascar pour valoriser ses trésors agricoles : miels de litchi, niaouli et forêts primaires, épices rares, produits artisanaux. Chaque produit est entièrement traçable, de la ruche jusqu'au consommateur.\n\nIlanga soutient directement des apiculteurs locaux en leur fournissant ruches, formation et mielleries mobiles capables d'atteindre les zones les plus reculées. Leurs miels sont certifiés UE par le Ministère malgache de l'élevage. Fournisseurs du Ritz Paris, de Ladurée, du Shangri-La et du Marriott.",
      description_i18n: {
        fr: "Fondée par un voyageur passionné installé à Madagascar, Ilanga Nature est aujourd'hui conduite par ses enfants Nathan et Naya. Bien plus qu'une marque, c'est une coopérative de petits producteurs engagés, gardiens d'un savoir-faire ancestral.\n\nDepuis Mariembourg en Belgique, ils parcourent Madagascar pour valoriser ses trésors agricoles : miels de litchi, niaouli et forêts primaires, épices rares, produits artisanaux. Chaque produit est entièrement traçable, de la ruche jusqu'au consommateur.\n\nIlanga soutient directement des apiculteurs locaux en leur fournissant ruches, formation et mielleries mobiles capables d'atteindre les zones les plus reculées. Leurs miels sont certifiés UE par le Ministère malgache de l'élevage. Fournisseurs du Ritz Paris, de Ladurée, du Shangri-La et du Marriott.",
        en: "Founded by a passionate traveler who settled in Madagascar, Ilanga Nature is now led by his children Nathan and Naya. More than a brand, it is a cooperative of committed small producers preserving ancestral know-how.\n\nFrom Mariembourg, Belgium, they travel across Madagascar to source its agricultural treasures: litchi, niaouli and primary forest honeys, rare spices, handcrafted items. Every product is fully traceable from hive to consumer.\n\nIlanga directly supports local beekeepers by providing hives, training and all-terrain mobile honey houses that reach the most remote areas. Their honeys are EU-certified by the Malagasy Ministry of Livestock. Suppliers to the Ritz Paris, Ladurée, Shangri-La and Marriott.",
      },
      images: ['/images/projects/miellerie-manakara.jpg', '/images/projects/antsirabe-ruchers-1.jpg'],
      address_city: 'Mariembourg',
      address_country_code: 'Belgique',
      contact_website: 'https://www.ilanga-nature.com',
    },
    category: {
      id: 'mock-category-honey',
      name_default: 'Miel',
      name_i18n: {
        fr: 'Miel',
        en: 'Honey',
      },
    },
  },
  {
    id: MOCK_PRODUCT_MANAKARA_ID,
    slug: MOCK_PRODUCT_MANAKARA_SLUG,
    name_default: 'Miel de Manakara',
    name_i18n: {
      fr: 'Miel de Manakara',
      en: 'Manakara Honey',
    },
    short_description_default:
      'Un miel floral plus rond, issu des ruchers partenaires de Manakara et conditionne localement.',
    short_description_i18n: {
      fr: 'Un miel floral plus rond, issu des ruchers partenaires de Manakara et conditionne localement.',
      en: 'A rounder floral honey sourced from Manakara partner apiaries and packed locally.',
    },
    description_default:
      "Ce miel de Manakara prolonge l'impact du projet local en valorisant la filiere complete : collecte, extraction et mise en pot sur place.\n\nSon profil est plus floral, avec une texture souple et une longueur douce. Chaque commande soutient directement les producteurs relies a la miellerie.",
    description_i18n: {
      fr: "Ce miel de Manakara prolonge l'impact du projet local en valorisant la filiere complete : collecte, extraction et mise en pot sur place.\n\nSon profil est plus floral, avec une texture souple et une longueur douce. Chaque commande soutient directement les producteurs relies a la miellerie.",
      en: 'This Manakara honey extends the local impact by supporting the full value chain: harvesting, extraction, and local packaging.',
    },
    producer_id: MOCK_PRODUCER_ILANGA_ID,
    category_id: 'mock-category-honey',
    featured: true,
    is_hero_product: false,
    tags: ['Miel', 'Manakara', 'Abeilles', 'Madagascar'],
    stock_quantity: 64,
    price_points: 650,
    price_eur_equivalent: 6.5,
    fulfillment_method: 'ship',
    image_url: '/images/products/miel-mnakara.png',
    images: ['/images/products/miel-mnakara.png'],
    certifications: ['Artisanal', 'Impact local'],
    created_at: '2026-04-13T08:00:00.000Z',
    updated_at: '2026-04-18T08:00:00.000Z',
    producer: {
      id: MOCK_PRODUCER_ILANGA_ID,
      slug: MOCK_PRODUCER_ILANGA_SLUG,
      name_default: 'Ilanga Nature',
      name_i18n: {
        fr: 'Ilanga Nature',
        en: 'Ilanga Nature',
      },
      description_default: "Fondée par un voyageur passionné installé à Madagascar, Ilanga Nature est aujourd'hui conduite par ses enfants Nathan et Naya. Bien plus qu'une marque, c'est une coopérative de petits producteurs engagés, gardiens d'un savoir-faire ancestral.\n\nDepuis Mariembourg en Belgique, ils parcourent Madagascar pour valoriser ses trésors agricoles : miels de litchi, niaouli et forêts primaires, épices rares, produits artisanaux. Chaque produit est entièrement traçable, de la ruche jusqu'au consommateur.\n\nIlanga soutient directement des apiculteurs locaux en leur fournissant ruches, formation et mielleries mobiles capables d'atteindre les zones les plus reculées. Leurs miels sont certifiés UE par le Ministère malgache de l'élevage. Fournisseurs du Ritz Paris, de Ladurée, du Shangri-La et du Marriott.",
      description_i18n: {
        fr: "Fondée par un voyageur passionné installé à Madagascar, Ilanga Nature est aujourd'hui conduite par ses enfants Nathan et Naya. Bien plus qu'une marque, c'est une coopérative de petits producteurs engagés, gardiens d'un savoir-faire ancestral.\n\nDepuis Mariembourg en Belgique, ils parcourent Madagascar pour valoriser ses trésors agricoles : miels de litchi, niaouli et forêts primaires, épices rares, produits artisanaux. Chaque produit est entièrement traçable, de la ruche jusqu'au consommateur.\n\nIlanga soutient directement des apiculteurs locaux en leur fournissant ruches, formation et mielleries mobiles capables d'atteindre les zones les plus reculées. Leurs miels sont certifiés UE par le Ministère malgache de l'élevage. Fournisseurs du Ritz Paris, de Ladurée, du Shangri-La et du Marriott.",
        en: "Founded by a passionate traveler who settled in Madagascar, Ilanga Nature is now led by his children Nathan and Naya. More than a brand, it is a cooperative of committed small producers preserving ancestral know-how.\n\nFrom Mariembourg, Belgium, they travel across Madagascar to source its agricultural treasures: litchi, niaouli and primary forest honeys, rare spices, handcrafted items. Every product is fully traceable from hive to consumer.\n\nIlanga directly supports local beekeepers by providing hives, training and all-terrain mobile honey houses that reach the most remote areas. Their honeys are EU-certified by the Malagasy Ministry of Livestock. Suppliers to the Ritz Paris, Ladurée, Shangri-La and Marriott.",
      },
      images: ['/images/projects/miellerie-manakara.jpg', '/images/projects/antsirabe-ruchers-1.jpg'],
      address_city: 'Mariembourg',
      address_country_code: 'Belgique',
      contact_website: 'https://www.ilanga-nature.com',
    },
    category: {
      id: 'mock-category-honey',
      name_default: 'Miel',
      name_i18n: {
        fr: 'Miel',
        en: 'Honey',
      },
    },
  },
  {
    id: MOCK_PRODUCT_SAVON_DOUX_ID,
    slug: MOCK_PRODUCT_SAVON_DOUX_SLUG,
    name_default: 'Savon DOUX',
    name_i18n: {
      fr: 'Savon DOUX',
      en: 'DOUX Soap',
    },
    short_description_default: 'Savon artisanal doux pour le corps, fabriqué avec des ingrédients naturels.',
    short_description_i18n: {
      fr: 'Savon artisanal doux pour le corps, fabriqué avec des ingrédients naturels.',
      en: 'Gentle artisanal body soap made with natural ingredients.',
    },
    description_default:
      "Savon artisanal doux pour le corps, fabriqué à la main avec des ingrédients naturels respectueux de la peau et de l'environnement.\n\nCe savon est parfait pour les peaux sensibles et convient à toute la famille. Il ne contient pas de parfums synthétiques ni de conservateurs agressifs.\n\nEn choisissant ce produit, vous soutenez l'apiculture durable en Belgique et la protection des abeilles locales.",
    description_i18n: {
      fr: "Savon artisanal doux pour le corps, fabriqué à la main avec des ingrédients naturels respectueux de la peau et de l'environnement.\n\nCe savon est parfait pour les peaux sensibles et convient à toute la famille. Il ne contient pas de parfums synthétiques ni de conservateurs agressifs.\n\nEn choisissant ce produit, vous soutenez l'apiculture durable en Belgique et la protection des abeilles locales.",
      en: 'Gentle artisanal body soap handcrafted with natural ingredients that respect both skin and environment. Perfect for sensitive skin and suitable for the whole family. No synthetic fragrances or harsh preservatives. By choosing this product, you support sustainable beekeeping in Belgium and the protection of local bees.',
    },
    producer_id: MOCK_PRODUCER_HABEEBEE_ID,
    category_id: 'mock-category-soap',
    featured: true,
    is_hero_product: false,
    tags: ['Savon', 'Naturel', 'Abeilles', 'Belgique'],
    stock_quantity: 80,
    price_points: 450,
    price_eur_equivalent: 4.5,
    fulfillment_method: 'ship',
    image_url: '/images/products/savon-doux-habeebee.png',
    images: ['/images/products/savon-doux-habeebee.png'],
    certifications: ['Artisanal', 'Naturel', 'Origine Belgique'],
    created_at: '2026-04-10T08:00:00.000Z',
    updated_at: '2026-04-16T08:00:00.000Z',
    producer: {
      id: MOCK_PRODUCER_HABEEBEE_ID,
      slug: MOCK_PRODUCER_HABEEBEE_SLUG,
      name_default: 'Habeebee',
      name_i18n: {
        fr: 'Habeebee',
        en: 'Habeebee Belgium',
      },
      description_default: 'Apiculteur engagé dans la protection des abeilles en Belgique.',
      description_i18n: {
        fr: 'Apiculteur engagé dans la protection des abeilles en Belgique.',
        en: 'Beekeeper committed to protecting bees in Belgium.',
      },
      images: ['/images/projects/habeebee-belgique.jpg'],
      address_city: 'Bruxelles',
      address_country_code: 'Belgique',
      contact_website: 'https://habeebee.be',
    },
    category: {
      id: 'mock-category-soap',
      name_default: 'Savon',
      name_i18n: {
        fr: 'Savon',
        en: 'Soap',
      },
    },
  },
  {
    id: MOCK_PRODUCT_HUILE_VISAGE_ID,
    slug: MOCK_PRODUCT_HUILE_VISAGE_SLUG,
    name_default: 'Huile visage',
    name_i18n: {
      fr: 'Huile visage',
      en: 'Face Oil',
    },
    short_description_default: 'Huile nourrissante pour le visage, enrichie en cire d\'abeille naturelle.',
    short_description_i18n: {
      fr: 'Huile nourrissante pour le visage, enrichie en cire d\'abeille naturelle.',
      en: 'Nourishing face oil enriched with natural beeswax.',
    },
    description_default:
      "Huile nourrissante pour le visage, formulée avec des huiles végétales précieuses et enrichie en cire d'abeille naturelle pour une protection optimale.\n\nCette huile pénètre rapidement sans laisser de film gras. Elle nourrit, régénère et protège la peau tout au long de la journée. Convient à tous les types de peau.\n\nEn achetant ce produit, vous contribuez à la préservation des abeilles en Belgique.",
    description_i18n: {
      fr: "Huile nourrissante pour le visage, formulée avec des huiles végétales précieuses et enrichie en cire d'abeille naturelle pour une protection optimale.\n\nCette huile pénètre rapidement sans laisser de film gras. Elle nourrit, régénère et protège la peau tout au long de la journée. Convient à tous les types de peau.\n\nEn achetant ce produit, vous contribuez à la préservation des abeilles en Belgique.",
      en: 'Nourishing face oil formulated with precious plant oils and enriched with natural beeswax for optimal protection. This oil absorbs quickly without leaving a greasy film. It nourishes, regenerates and protects the skin throughout the day. Suitable for all skin types. By purchasing this product, you contribute to the preservation of bees in Belgium.',
    },
    producer_id: MOCK_PRODUCER_HABEEBEE_ID,
    category_id: 'mock-category-oil',
    featured: true,
    is_hero_product: false,
    tags: ['Huile', 'Visage', 'Cire d\'abeille', 'Naturel'],
    stock_quantity: 55,
    price_points: 850,
    price_eur_equivalent: 8.5,
    fulfillment_method: 'ship',
    image_url: '/images/products/savon-doux-habeebee.png',
    images: ['/images/products/savon-doux-habeebee.png'],
    certifications: ['Naturel', 'Bio', 'Origine Belgique'],
    created_at: '2026-04-12T08:00:00.000Z',
    updated_at: '2026-04-18T08:00:00.000Z',
    producer: {
      id: MOCK_PRODUCER_HABEEBEE_ID,
      slug: MOCK_PRODUCER_HABEEBEE_SLUG,
      name_default: 'Habeebee',
      name_i18n: {
        fr: 'Habeebee',
        en: 'Habeebee Belgium',
      },
      description_default: 'Apiculteur engagé dans la protection des abeilles en Belgique.',
      description_i18n: {
        fr: 'Apiculteur engagé dans la protection des abeilles en Belgique.',
        en: 'Beekeeper committed to protecting bees in Belgium.',
      },
      images: ['/images/projects/habeebee-belgique.jpg'],
      address_city: 'Bruxelles',
      address_country_code: 'Belgique',
      contact_website: 'https://habeebee.be',
    },
    category: {
      id: 'mock-category-oil',
      name_default: 'Huile',
      name_i18n: {
        fr: 'Huile',
        en: 'Oil',
      },
    },
  },
  {
    id: MOCK_PRODUCT_SHAMPOING_ID,
    slug: MOCK_PRODUCT_SHAMPOING_SLUG,
    name_default: 'Shampoing solide',
    name_i18n: {
      fr: 'Shampoing solide',
      en: 'Solid Shampoo',
    },
    short_description_default: 'Shampoing solide naturel et écologique, sans plastique.',
    short_description_i18n: {
      fr: 'Shampoing solide naturel et écologique, sans plastique.',
      en: 'Natural and eco-friendly solid shampoo, plastic-free.',
    },
    description_default:
      "Shampoing solide naturel et écologique, formulé sans plastique pour réduire votre empreinte environnementale.\n\nCe shampoing doux nettoie le cheveu en douceur tout en respectant le cuir chevelu. Il est enrichi en miel pour ses propriétés hydratantes et apaisantes.\n\nDurée de vie équivalente à 2 bouteilles de shampoing liquide. Zéro déchet, zéro plastique.\n\nEn choisissant ce produit, vous soutenez l'apiculture durable et la protection des abeilles.",
    description_i18n: {
      fr: "Shampoing solide naturel et écologique, formulé sans plastique pour réduire votre empreinte environnementale.\n\nCe shampoing doux nettoie le cheveu en douceur tout en respectant le cuir chevelu. Il est enrichi en miel pour ses propriétés hydratantes et apaisantes.\n\nDurée de vie équivalente à 2 bouteilles de shampoing liquide. Zéro déchet, zéro plastique.\n\nEn choisissant ce produit, vous soutenez l'apiculture durable et la protection des abeilles.",
      en: 'Natural and eco-friendly solid shampoo, formulated without plastic to reduce your environmental footprint. This gentle shampoo cleanses hair gently while respecting the scalp. Enriched with honey for its moisturizing and soothing properties. Lasts as long as 2 bottles of liquid shampoo. Zero waste, zero plastic. By choosing this product, you support sustainable beekeeping and the protection of bees.',
    },
    producer_id: MOCK_PRODUCER_HABEEBEE_ID,
    category_id: 'mock-category-shampoo',
    featured: true,
    is_hero_product: false,
    tags: ['Shampoing', 'Solide', 'Zéro déchet', 'Miel'],
    stock_quantity: 70,
    price_points: 550,
    price_eur_equivalent: 5.5,
    fulfillment_method: 'ship',
    image_url: '/images/products/shampoing-solide-habeebee.png',
    images: ['/images/products/shampoing-solide-habeebee.png'],
    certifications: ['Naturel', 'Zéro déchet', 'Vegan'],
    created_at: '2026-04-14T08:00:00.000Z',
    updated_at: '2026-04-20T08:00:00.000Z',
    producer: {
      id: MOCK_PRODUCER_HABEEBEE_ID,
      slug: MOCK_PRODUCER_HABEEBEE_SLUG,
      name_default: 'Habeebee',
      name_i18n: {
        fr: 'Habeebee',
        en: 'Habeebee Belgium',
      },
      description_default: 'Apiculteur engagé dans la protection des abeilles en Belgique.',
      description_i18n: {
        fr: 'Apiculteur engagé dans la protection des abeilles en Belgique.',
        en: 'Beekeeper committed to protecting bees in Belgium.',
      },
      images: ['/images/projects/habeebee-belgique.jpg'],
      address_city: 'Bruxelles',
      address_country_code: 'Belgique',
      contact_website: 'https://habeebee.be',
    },
    category: {
      id: 'mock-category-shampoo',
      name_default: 'Shampoing',
      name_i18n: {
        fr: 'Shampoing',
        en: 'Shampoo',
      },
    },
  },
  {
    id: MOCK_PRODUCT_HUILE_LECCINO_ID,
    slug: MOCK_PRODUCT_HUILE_LECCINO_SLUG,
    name_default: 'Huile Leccino',
    name_i18n: {
      fr: 'Huile Leccino',
      en: 'Leccino Oil',
    },
    short_description_default: 'Huile d\'olive extra vierge de la variété Leccino, produite en Sardaigne.',
    short_description_i18n: {
      fr: 'Huile d\'olive extra vierge de la variété Leccino, produite en Sardaigne.',
      en: 'Extra virgin olive oil from the Leccino variety, produced in Sardinia.',
    },
    description_default:
      "Huile d'olive extra vierge de la variété Leccino, produite dans les oliveraies traditionnelles de Sardaigne.\n\nCette huile se distingue par son fruité délicat et ses notes d'amande et d'herbes fraîches. Elle est idéale pour assaisonner les plats à cru et sublimer les saveurs méditerranéennes.\n\nProduite selon des méthodes traditionnelles respectueuses de l'environnement, elle soutient la préservation des oliviers millénaires.",
    description_i18n: {
      fr: "Huile d'olive extra vierge de la variété Leccino, produite dans les oliveraies traditionnelles de Sardaigne.\n\nCette huile se distingue par son fruité délicat et ses notes d'amande et d'herbes fraîches. Elle est idéale pour assaisonner les plats à cru et sublimer les saveurs méditerranéennes.\n\nProduite selon des méthodes traditionnelles respectueuses de l'environnement, elle soutient la préservation des oliviers millénaires.",
      en: 'Extra virgin olive oil from the Leccino variety, produced in the traditional olive groves of Sardinia. This oil is distinguished by its delicate fruity profile and notes of almond and fresh herbs. Ideal for seasoning raw dishes and enhancing Mediterranean flavors. Produced using environmentally friendly traditional methods, it supports the preservation of millennium-old olive trees.',
    },
    producer_id: MOCK_PRODUCER_ILANGA_ID,
    category_id: 'mock-category-olive-oil',
    featured: true,
    is_hero_product: false,
    tags: ['Huile d\'olive', 'Sardaigne', 'Bio', 'Traditionnel'],
    stock_quantity: 90,
    price_points: 1200,
    price_eur_equivalent: 12,
    fulfillment_method: 'ship',
    image_url: '/images/products/huile-leccino.png',
    images: ['/images/products/huile-leccino.png'],
    certifications: ['Bio', 'AOP', 'Traditionnel'],
    created_at: '2026-04-08T08:00:00.000Z',
    updated_at: '2026-04-14T08:00:00.000Z',
    producer: {
      id: MOCK_PRODUCER_ILANGA_ID,
      slug: MOCK_PRODUCER_ILANGA_SLUG,
      name_default: 'Ilanga Nature',
      name_i18n: {
        fr: 'Ilanga Nature',
        en: 'Ilanga Nature',
      },
      description_default: 'Producteur de miels biologiques et produits artisanaux malgaches.',
      description_i18n: {
        fr: 'Producteur de miels biologiques et produits artisanaux malgaches.',
        en: 'Producer of organic honey and artisanal Malagasy products.',
      },
      images: ['/images/projects/miellerie-manakara.jpg', '/images/projects/antsirabe-ruchers-1.jpg'],
      address_city: 'Mariembourg',
      address_country_code: 'Belgique',
      contact_website: 'https://www.ilanga-nature.com',
    },
    category: {
      id: 'mock-category-olive-oil',
      name_default: 'Huile d\'olive',
      name_i18n: {
        fr: 'Huile d\'olive',
        en: 'Olive Oil',
      },
    },
  },
  {
    id: MOCK_PRODUCT_HUILE_FRANTOIO_ID,
    slug: MOCK_PRODUCT_HUILE_FRANTOIO_SLUG,
    name_default: 'Huile Frantoio',
    name_i18n: {
      fr: 'Huile Frantoio',
      en: 'Frantoio Oil',
    },
    short_description_default: 'Huile d\'olive extra vierge de la variété Frantoio, intense et aromatique.',
    short_description_i18n: {
      fr: 'Huile d\'olive extra vierge de la variété Frantoio, intense et aromatique.',
      en: 'Extra virgin olive oil from the Frantoio variety, intense and aromatic.',
    },
    description_default:
      "Huile d'olive extra vierge de la variété Frantoio, réputée pour son intensité et ses arômes puissants.\n\nCette huile présente un fruité vert marqué avec des notes de piquant et d'amertume caractéristiques de la variété Frantoio. Parfaite pour les plats nécessitant une huile de caractère.\n\nProduite en Sardaigne selon des méthodes artisanales, elle contribue à la préservation du patrimoine oléicole méditerranéen.",
    description_i18n: {
      fr: "Huile d'olive extra vierge de la variété Frantoio, réputée pour son intensité et ses arômes puissants.\n\nCette huile présente un fruité vert marqué avec des notes de piquant et d'amertume caractéristiques de la variété Frantoio. Parfaite pour les plats nécessitant une huile de caractère.\n\nProduite en Sardaigne selon des méthodes artisanales, elle contribue à la préservation du patrimoine oléicole méditerranéen.",
      en: 'Extra virgin olive oil from the Frantoio variety, renowned for its intensity and powerful aromas. This oil has a marked green fruity profile with spicy and bitter notes characteristic of the Frantoio variety. Perfect for dishes requiring an oil with character. Produced in Sardinia using artisanal methods, it contributes to the preservation of the Mediterranean olive heritage.',
    },
    producer_id: MOCK_PRODUCER_ILANGA_ID,
    category_id: 'mock-category-olive-oil',
    featured: true,
    is_hero_product: false,
    tags: ['Huile d\'olive', 'Sardaigne', 'Intense', 'Aromatique'],
    stock_quantity: 75,
    price_points: 1350,
    price_eur_equivalent: 13.5,
    fulfillment_method: 'ship',
    image_url: '/images/products/huile-frantoio.png',
    images: ['/images/products/huile-frantoio.png'],
    certifications: ['Bio', 'AOP', 'Premium'],
    created_at: '2026-04-09T08:00:00.000Z',
    updated_at: '2026-04-15T08:00:00.000Z',
    producer: {
      id: MOCK_PRODUCER_ILANGA_ID,
      slug: MOCK_PRODUCER_ILANGA_SLUG,
      name_default: 'Ilanga Nature',
      name_i18n: {
        fr: 'Ilanga Nature',
        en: 'Ilanga Nature',
      },
      description_default: 'Producteur de miels biologiques et produits artisanaux malgaches.',
      description_i18n: {
        fr: 'Producteur de miels biologiques et produits artisanaux malgaches.',
        en: 'Producer of organic honey and artisanal Malagasy products.',
      },
      images: ['/images/projects/miellerie-manakara.jpg', '/images/projects/antsirabe-ruchers-1.jpg'],
      address_city: 'Mariembourg',
      address_country_code: 'Belgique',
      contact_website: 'https://www.ilanga-nature.com',
    },
    category: {
      id: 'mock-category-olive-oil',
      name_default: 'Huile d\'olive',
      name_i18n: {
        fr: 'Huile d\'olive',
        en: 'Olive Oil',
      },
    },
  },
]

export const getMockProducts = (): MockProductSeed[] => MOCK_PRODUCTS

export const getMockProductById = (id: string): MockProductSeed | null =>
  MOCK_PRODUCTS.find((product) => product.id === id) || null

export const getMockProductByIdentifier = (identifier: string): MockProductSeed | null =>
  MOCK_PRODUCTS.find(
    (product) => product.id === identifier || (product.slug !== null && product.slug === identifier),
  ) || null

export const getMockProductVariantById = (
  id: string,
): { product: MockProductSeed; variant: ProductVariant } | null => {
  for (const product of MOCK_PRODUCTS) {
    if (product.variants) {
      const variant = product.variants.find((v) => v.id === id)
      if (variant) return { product, variant }
    }
  }
  return null
}
