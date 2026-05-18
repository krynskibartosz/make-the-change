import { getMockProducts } from '@/app/[locale]/(screens)/products/_features/mock-products'
import { getMockProjects } from '@/app/[locale]/(tabs)/projects/_features/mock-projects'
import { ILANGA_PATHS } from '@/lib/media/ilanga'
import { HABEEBEE_PATHS } from '@/lib/media/habeebee'
import { TRILOGY_PATHS } from '@/lib/media/trilogy'

export type MockProducerListProduct = {
  id: string
  slug: string | null
  name_default: string
  image_url: string | null
  price_points: number | null
}

export type MockProducerListProject = {
  id: string
  slug: string | null
  name_default: string
  hero_image_url: string | null
  status: string | null
  type: string | null
  current_funding: number | null
  address_city: string | null
  address_country_code: string | null
}

export type MockProducerSpeciesCard = {
  id: string
  name: string
  image: string
  unlocked: boolean
  rarity: 'Commun' | 'Rare' | 'Légendaire'
  role?: string
}

// ── Nouveaux types éditoriaux ──
export type MissionPillar = {
  icon: string
  title: string
  description: string
  shortDescription?: string
  summary?: string
  detail?: string
  keyPoints?: string[]
  whyItMatters?: string
  sourceLabel?: string
}

export type ProofCard = {
  label: string
  value?: string
  icon: string
  proofType: 'location' | 'certification' | 'method' | 'partner' | 'field_operation' | 'other'
  detail?: string
  notes?: string[]
  caution?: string
}

export type StoryBlock = {
  title: string
  body: string
  imageUrl: string
}

export type ImpactSummary = {
  estimate?: number
  unit: string
  wording: string
  disclaimer: string
}

export type ProducerLocation = {
  field: string      // "Madagascar"
  fieldDetail?: string // "Manakara, Antsirabe"
  european?: string  // "Belgique"
  europeanDetail?: string // "Mariembourg"
}

export type EditorialIdentity = {
  legalName: string
  shortName: string
  foundedYear?: number
  founderNames?: string[]
  fieldDirector?: string
  nextGeneration?: string[]
  partnerType: string
  tagline: string
  summary: string
  emotionalStatement?: string
  missionIntro?: string
  speciesSubtitle?: string
}

export type VisualAsset = {
  id: string
  url: string
  role: 'hero' | 'portrait' | 'story' | 'field_proof' | 'product' | 'logo' | 'certification'
  type: 'field_photo' | 'branding_photo' | 'product_studio' | 'logo'
  alt: string
  sourceUrl?: string
}

export type VisualAssets = {
  hero?: string
  portrait?: string
  logo?: string
  story?: VisualAsset[]
}

export type PartnerCatalogFamily = {
  label: string
  examples: string[]
  origin?: string
}

export type PartnerCatalogOverview = {
  title: string
  disclaimer: string
  families: PartnerCatalogFamily[]
}

export type SectionOrder = {
  hero: number
  mission: number
  proofs: number
  story?: number
  projects: number
  species: number
  products: number
  impact: number
  cta: number
}

export type MockProducerSeed = {
  id: string
  slug: string
  name_default: string
  description_default: string
  address_city: string | null
  address_country_code: string | null
  type: string
  images: string[]
  certifications: string[]
  contact_website: string | null
  projects: MockProducerListProject[]
  products: MockProducerListProduct[]
  species: MockProducerSpeciesCard[]
  
  // ── Nouveaux champs éditoriaux ──
  tagline?: string
  locations?: ProducerLocation
  partnerType?: string
  missionPillars?: MissionPillar[]
  proofCards?: ProofCard[]
  storyBlocks?: StoryBlock[]
  impactSummary?: ImpactSummary
  
  // ── Champs enrichis (Phase 1) ──
  editorialIdentity?: EditorialIdentity
  visualAssets?: VisualAssets
  sectionOrder?: SectionOrder
  
  // ── Gamme partenaire (informatif, pas le catalogue app) ──
  partnerCatalogOverview?: PartnerCatalogOverview
}

function getRarityFromStatus(status: string): MockProducerSpeciesCard['rarity'] {
  const s = status?.toUpperCase()
  if (['EN', 'CR', 'EW', 'EX'].includes(s)) return 'Légendaire'
  if (['VU', 'NT'].includes(s)) return 'Rare'
  return 'Commun'
}

const dedupeById = <T extends { id: string }>(items: T[]): T[] => {
  const seen = new Set<string>()

  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false
    }

    seen.add(item.id)
    return true
  })
}

export const getMockProducers = (): MockProducerSeed[] => {
  const mockProducts = getMockProducts()
  const mockProjects = getMockProjects()

  const producerIds = new Set<string>()
  for (const product of mockProducts) {
    if (product.producer.id) {
      producerIds.add(product.producer.id)
    }
  }

  for (const project of mockProjects) {
    if (project.producer.id) {
      producerIds.add(project.producer.id)
    }
  }

  return Array.from(producerIds).map((producerId) => {
    const producerProjects = mockProjects.filter((project) => project.producer.id === producerId)
    const producerProducts = mockProducts.filter((product) => product.producer.id === producerId)
    const producerMeta = producerProducts[0]?.producer ?? producerProjects[0]?.producer
    const addressCity =
      producerProducts[0]?.producer.address_city ?? producerProjects[0]?.address_city ?? null
    const addressCountryCode =
      producerProducts[0]?.producer.address_country_code ??
      producerProjects[0]?.address_country_code ??
      null

    const species = dedupeById(
      producerProjects.flatMap((project) =>
        (project.species || []).map((species) => ({
          id: species.id,
          name: species.name,
          image: species.icon || '/images/diorama-chouette.png',
          unlocked: true,
          rarity: getRarityFromStatus(species.status || ''),
          role: species.role || undefined,
        })),
      ),
    )

    const products = producerProducts.map((product) => ({
      id: product.id,
      slug: product.slug,
      name_default: product.name_default,
      image_url: product.image_url,
      price_points: product.price_points,
    }))

    const projects = producerProjects.map((project) => ({
      id: project.id,
      slug: project.slug,
      name_default: project.name_default,
      hero_image_url: project.hero_image_url,
      status: project.status,
      type: project.type,
      current_funding: project.current_funding,
      address_city: project.address_city,
      address_country_code: project.address_country_code,
    }))

    // Base producer object
    const baseProducer: MockProducerSeed = {
      id: producerId,
      slug: producerMeta?.slug || producerId,
      name_default: producerMeta?.name_default || 'Producteur partenaire',
      description_default:
        producerMeta?.description_default ||
        "Partenaire local engage dans des projets a impact positif et des productions artisanales.",
      address_city: addressCity,
      address_country_code: addressCountryCode,
      type: 'partenaire',
      images: producerMeta?.images || [],
      certifications: dedupeById(
        producerProducts.flatMap((product, index) =>
          (product.certifications || []).map((certification) => ({
            id: `${index}-${certification}`,
            value: certification,
          })),
        ),
      ).map((entry) => entry.value),
      contact_website: producerMeta?.contact_website || null,
      projects,
      products,
      species,
    }

    // Enrich specific producers with editorial data
    return enrichProducerWithEditorialData(baseProducer)
  })
}

// ── Enrich specific producers with premium editorial data (Phase 1) ──
function enrichProducerWithEditorialData(producer: MockProducerSeed): MockProducerSeed {
  // Ilanga Nature enrichment with real editorial data
  if (producer.slug === 'ilanga-nature' || producer.name_default?.toLowerCase().includes('ilanga')) {
    return {
      ...producer,
      tagline: "Du rucher malgache à votre table.",
      locations: {
        field: "Madagascar",
        fieldDetail: "Antananarivo, Manakara, Fort-Dauphin · Canal des Pangalanes",
        european: "Belgique",
        europeanDetail: "Mariembourg",
      },
      
      // ── Editorial Identity (Phase 1) ──
      editorialIdentity: {
        legalName: "Senteurs et Saveurs du Monde – Ilanga Nature",
        shortName: "Ilanga Nature",
        foundedYear: 2017,
        founderNames: ["Olivier Laurent"],
        fieldDirector: "Laura Razanajatovo",
        nextGeneration: ["Nathan Laurent", "Naya Laurent"],
        partnerType: "Partenaire apicole documenté",
        tagline: "Réseau apicole & produits naturels",
        summary: "Fondée en 2017 par un entrepreneur belge installé à Madagascar, Ilanga Nature structure une filière apicole locale avec mielleries mobiles, formation des apiculteurs et certification biologique Ecocert. L'entreprise exporte des miels, vanilles, épices et confitures artisanaux issus de Madagascar, de l'île Maurice, de La Réunion et de Sardaigne.",
        emotionalStatement: "Entre biodiversité, producteurs et savoir-faire malgaches."
      },
      
      // ── Visual Assets (Phase 1) ──
      visualAssets: {
        hero: ILANGA_PATHS.identity.cover,
        portrait: ILANGA_PATHS.identity.portrait,
        logo: ILANGA_PATHS.identity.logo,
        story: [
          {
            id: "story-1",
            url: ILANGA_PATHS.media.portraitFamilleLaurent,
            role: "story",
            type: "field_photo",
            alt: "La famille Laurent — Olivier, Nathan et Naya, fondateurs d'Ilanga Nature",
            sourceUrl: "https://www.ilanga-nature.com/notre-histoire"
          },
          {
            id: "story-2",
            url: ILANGA_PATHS.media.portraitApiculteurFortDauphin,
            role: "story",
            type: "field_photo",
            alt: "Apiculteur au travail à Fort-Dauphin, Madagascar",
            sourceUrl: "https://www.ilanga-nature.com/notre-histoire"
          },
          {
            id: "story-3",
            url: ILANGA_PATHS.media.miellerieManakaraExterieur,
            role: "field_proof",
            type: "field_photo",
            alt: "Miellerie Ilanga Nature à Manakara, Madagascar",
            sourceUrl: "https://www.ilanga-nature.com/en/des-mielleries-a-madagascar"
          },
          {
            id: "story-4",
            url: ILANGA_PATHS.media.miellieriesMobilesTerrain,
            role: "field_proof",
            type: "field_photo",
            alt: "Unité mobile d'extraction Ilanga Nature — substitué à la barge (photo non disponible)",
            sourceUrl: "https://miarakap.com/entrepreneur/ilanga-nature/"
          },
          {
            id: "story-5",
            url: ILANGA_PATHS.media.ecoleApicultureFortDauphin,
            role: "story",
            type: "field_photo",
            alt: "École de formation apicole Ilanga Academy à Fort-Dauphin",
            sourceUrl: "https://www.ilanga-nature.com/nos-valeurs"
          },
          {
            id: "story-6",
            url: ILANGA_PATHS.media.produitsMielsTrio,
            role: "field_proof",
            type: "product_studio",
            alt: "Trois pots de miel Ilanga Nature — niaouli, cactus, baies roses",
            sourceUrl: "https://www.ilanga-nature.com/en/des-mielleries-a-madagascar"
          }
        ]
      },
      
      // ── Section Order (Phase 2) ──
      sectionOrder: {
        hero: 1,
        mission: 2,
        proofs: 3,
        story: 4,
        projects: 5,
        species: 6,
        products: 7,
        impact: 8,
        cta: 9
      },
      
      // ── Mission Pillars (3 piliers éditoriaux condensés) ──
      missionPillars: [
        {
          icon: "Users",
          title: "Apiculteurs locaux",
          summary: "Formation • ruches • approvisionnement équitable",
          detail: "École d'apiculture à Fort-Dauphin.",
          shortDescription: "Formation, ruches et accompagnement terrain.",
          description: "Ilanga accompagne des apiculteurs partenaires à Madagascar en combinant formation terrain, fourniture de ruches et approvisionnement équitable.",
          keyPoints: [
            "Formation terrain pratique",
            "Fourniture de ruches agréées",
            "Approvisionnement à prix équitables",
            "École d'apiculture à Fort-Dauphin"
          ],
          whyItMatters: "Un meilleur accompagnement aide à structurer une filière locale plus durable. Ces actions s'inscrivent dans une logique de soutien documenté, sans constituer une preuve d'impact mesuré.",
          sourceLabel: "Information partenaire documentée"
        },
        {
          icon: "Ship",
          title: "Filières malgaches",
          summary: "Miels • vanilles • épices • savoir-faire locaux",
          detail: "60+ références artisanales sélectionnées.",
          shortDescription: "Miels, vanilles, épices et savoir-faire locaux préservés.",
          description: "Ilanga sélectionne et valorise des produits artisanaux malgaches à l'international : miels, vanilles, épices et confitures issus de petits producteurs locaux.",
          keyPoints: [
            "Miels mono-floraux et toutes fleurs",
            "Vanilles et épices malgaches",
            "Savoir-faire artisanaux documentés",
            "60+ références sélectionnées"
          ],
          whyItMatters: "Valoriser ces filières localement aide à créer des débouchés économiques pour les producteurs. Cela reste une démarche de mise en marché éthique, pas une mesure d'impact écologique.",
          sourceLabel: "Information partenaire documentée"
        },
        {
          icon: "BadgeCheck",
          title: "Traçabilité bio",
          summary: "Mielleries documentées • certification Ecocert",
          detail: "Humidité contrôlée 16–18% à chaque récolte.",
          shortDescription: "Mielleries documentées et certification Ecocert.",
          description: "Chaque production est suivie et certifiée biologiquement par Ecocert. L'humidité des miels est contrôlée entre 16 et 18% à chaque récolte.",
          keyPoints: [
            "Certification biologique Ecocert",
            "Humidité contrôlée 16–18%",
            "Mielleries homologuées",
            "Contrôle qualité rigoureux"
          ],
          whyItMatters: "La certification et le suivi de qualité garantissent la cohérence du produit. Il s'agit d'une démarche de critères documentés, pas d'une garantie d'impact environnemental mesuré.",
          sourceLabel: "Information partenaire documentée"
        }
      ],
      
      // ── Proof Cards (10+ preuves réelles) ──
      proofCards: [
        {
          label: "Certification Ecocert",
          value: "Certification biologique",
          icon: "BadgeCheck",
          proofType: "certification"
        },
        {
          label: "Homologation Ministère malgache de l'Élevage",
          value: "Mielleries approuvées",
          icon: "Building",
          proofType: "certification"
        },
        {
          label: "3 mielleries fixes",
          value: "Antananarivo, Manakara, Fort-Dauphin",
          icon: "MapPin",
          proofType: "location"
        },
        {
          label: "2 mielleries mobiles",
          value: "Collecte mobile de proximité",
          icon: "Truck",
          proofType: "field_operation"
        },
        {
          label: "Barge motorisée",
          value: "Canal des Pangalanes",
          icon: "Ship",
          proofType: "field_operation"
        },
        {
          label: "École d'apiculture",
          value: "Formation locale à Fort-Dauphin",
          icon: "GraduationCap",
          proofType: "field_operation"
        },
        {
          label: "Accompagnement Miarakap / IIP",
          value: "Programme Mitsiry",
          icon: "Handshake",
          proofType: "partner"
        },
        {
          label: "Partenariat USAID",
          value: "À confirmer",
          icon: "Shield",
          proofType: "partner"
        },
        {
          label: "Plus de 60 références",
          value: "Produits artisanaux",
          icon: "Package",
          proofType: "method"
        },
        {
          label: "Contrôle humidité",
          value: "16–18%",
          icon: "Droplet",
          proofType: "method"
        },
        {
          label: "Partenariat ADAMA",
          value: "Protection forêts malgaches",
          icon: "TreePine",
          proofType: "partner"
        },
        {
          label: "Partenariat Hope Madagascar",
          value: "Accompagnement jeunes",
          icon: "Heart",
          proofType: "partner"
        },
        {
          label: "Transport maritime à vide",
          value: "Logistique bas-carbone",
          icon: "Ship",
          proofType: "method"
        }
      ],
      
      // ── Story Blocks — 4 blocs visibles (slice(0,4) dans le composant) ──
      // Ordre : Née → Famille → Mielleries → Formation [visible]
      //         Logistique → Produits [réservés, non affichés par défaut]
      storyBlocks: [
        {
          title: "Née à Madagascar en 2017",
          body: "Fondée par Olivier Laurent, entrepreneur belge fasciné par la Grande Île. Une vocation : révéler les savoir-faire apicoles malgaches avec une approche terrain, durable et humaine.",
          imageUrl: ILANGA_PATHS.media.auxOrigines
        },
        {
          title: "Une famille, un réseau",
          body: "Olivier, Laura, Nathan et Naya. Quatre personnes, une mission : structurer une filière apicole locale avec des apiculteurs partenaires et un savoir-faire ancestral.",
          imageUrl: ILANGA_PATHS.media.portraitFamilleLaurent
        },
        {
          title: "3 mielleries, 2 unités mobiles",
          body: "Antananarivo, Manakara, Fort-Dauphin. Chaque miellerie est homologuée par le Ministère malgache et certifiée Ecocert pour les miels biologiques.",
          imageUrl: ILANGA_PATHS.media.miellerieManakaraExterieur
        },
        {
          title: "Former pour durer",
          body: "L'Académie Ilanga à Fort-Dauphin forme des producteurs aux pratiques apicoles et participe à la transmission des savoir-faire locaux.",
          imageUrl: ILANGA_PATHS.media.ecoleApicultureFortDauphin
        },
        {
          title: "Collecter au plus près du terrain",
          body: "Une barge motorisée et des unités mobiles permettent de rejoindre les zones de production reculées, notamment le long du canal des Pangalanes.",
          imageUrl: ILANGA_PATHS.media.heroLemures
        },
        {
          title: "Des filières jusqu'aux produits",
          body: "12 miels biologiques, vanilles, épices et confitures prolongent les filières accompagnées par Ilanga Nature, avec une traçabilité complète de la ruche au produit fini.",
          imageUrl: ILANGA_PATHS.media.produitsMielsTrio
        }
      ],
      
      // ── Impact Summary (estimation prudente) ──
      impactSummary: {
        estimate: 428000,
        unit: "abeilles",
        wording: "Estimation : abeilles concernées par les projets liés aux ruchers",
        disclaimer: "Estimation pédagogique basée sur les hypothèses de financement des projets, pas une mesure terrain."
      },
      
      // ── Gamme partenaire (informatif — pas le catalogue app) ──
      partnerCatalogOverview: {
        title: "Les filières qu'ils valorisent",
        disclaimer: "Ilanga Nature valorise plusieurs filières. Seule une partie de ces produits est disponible dans l'app.",
        families: [
          {
            label: "Miels de Madagascar",
            examples: ["Litchi", "Niaouli", "Cactus", "Jujubier (bio)", "Forêt primaire", "Forêt sèche", "Eucalyptus", "Baies roses", "Mokarana (bio)"],
            origin: "Manakara · Fort-Dauphin · Antananarivo"
          },
          {
            label: "Vanilles & épices",
            examples: ["Vanille Bourbon de Manakara", "Poivre noir", "Gingembre", "Cannelle", "Curcuma"],
            origin: "Madagascar · Polynésie française"
          },
          {
            label: "Confitures artisanales",
            examples: ["Fruit de la passion", "Fruits exotiques locaux"],
            origin: "Madagascar"
          },
          {
            label: "Huile d'olive",
            examples: ["Leccino", "Frantoio", "Variété toscane oubliée"],
            origin: "Sardaigne, Italie"
          }
        ]
      },
    }
  }

  // ── Habeebee enrichment ──
  if (producer.slug === 'habeebee-belgique' || producer.name_default?.toLowerCase().includes('habeebee')) {
    return {
      ...producer,
      tagline: "De la ruche à l'atelier, des soins naturels fabriqués à Bruxelles.",
      locations: {
        field: "Belgique",
        fieldDetail: "Watermael-Boitsfort",
        european: "Belgique",
        europeanDetail: "Bruxelles",
      },
      editorialIdentity: {
        legalName: "Habeebee",
        shortName: "Habeebee",
        foundedYear: 2016,
        founderNames: ["Alexia"],
        fieldDirector: "Alexia",
        nextGeneration: ["Léonard", "Quentin"],
        partnerType: "Savonnerie apicole documentée",
        tagline: "De la ruche à l'atelier, des soins naturels fabriqués à Bruxelles.",
        summary: "Habeebee est une savonnerie artisanale et un projet d'apiculture fondés en 2016 par Alexia à Bruxelles. L'entreprise fabrique à la main des savons solides et des cosmétiques bio utilisant de la cire d'abeille et de la propolis, avec une approche de saponification à froid. En 2024, Léonard et Quentin ont rejoint l'aventure comme associés pour développer le potentiel de la marque.",
        emotionalStatement: "Valoriser les matières de la ruche, fabriquer localement et transmettre une apiculture familiale.",
        missionIntro: "Valoriser les matières de la ruche, fabriquer localement et transmettre une apiculture familiale.",
      },
      visualAssets: {
        hero: HABEEBEE_PATHS.identity.cover,
        portrait: HABEEBEE_PATHS.identity.portrait,
        logo: HABEEBEE_PATHS.identity.logo,
        story: [
          {
            id: "story-1",
            url: HABEEBEE_PATHS.media.story1Formation,
            role: "field_proof" as const,
            type: "field_photo" as const,
            alt: "Initiation à l'apiculture avec HabeebeeCulture",
            sourceUrl: "https://habeebee.be/pages/formation-apiculteur-bruxelles",
          },
          {
            id: "story-2",
            url: HABEEBEE_PATHS.media.story2Cycle,
            role: "field_proof" as const,
            type: "branding_photo" as const,
            alt: "Illustration du cycle HabeebeeCulture",
            sourceUrl: "https://habeebee.be/pages/formation-apiculteur-bruxelles",
          },
          {
            id: "story-3",
            url: HABEEBEE_PATHS.media.story3Ruche,
            role: "field_proof" as const,
            type: "field_photo" as const,
            alt: "Vue rapprochée d'un rayon de cire rempli d'abeilles",
            sourceUrl: "https://habeebee.be/pages/formation-apiculteur-bruxelles",
          },
          {
            id: "story-4",
            url: HABEEBEE_PATHS.media.story4TedyArtisan,
            role: "story" as const,
            type: "branding_photo" as const,
            alt: "Tedy, artisan chez Habeebee",
            sourceUrl: "https://habeebee.be/pages/savonnerie-artisanale-bruxelles-cire-abeille",
          },
          {
            id: "story-5",
            url: HABEEBEE_PATHS.media.story5TedyFabrication,
            role: "field_proof" as const,
            type: "field_photo" as const,
            alt: "Tedy en pleine coupe de savons dans l'atelier",
            sourceUrl: "https://habeebee.be/pages/savonnerie-artisanale-bruxelles-cire-abeille",
          },
          {
            id: "story-6",
            url: HABEEBEE_PATHS.media.story6Scouts,
            role: "field_proof" as const,
            type: "field_photo" as const,
            alt: "Quatre jeunes scouts avec savon Scout Toujours",
            sourceUrl: "https://habeebee.be/pages/engagements-et-certifications",
          },
          {
            id: "story-7",
            url: HABEEBEE_PATHS.media.story7Insertion,
            role: "field_proof" as const,
            type: "field_photo" as const,
            alt: "Préparation d'un colis Habeebee par une personne en situation",
            sourceUrl: "https://habeebee.be/pages/engagements-et-certifications",
          },
          {
            id: "story-8",
            url: HABEEBEE_PATHS.media.story8Certificat,
            role: "field_proof" as const,
            type: "branding_photo" as const,
            alt: "Logo de certification ECOGARANTIE",
            sourceUrl: "https://habeebee.be/pages/engagements-et-certifications",
          },
        ],
      },
      sectionOrder: {
        hero: 1,
        mission: 2,
        proofs: 3,
        story: 4,
        projects: 5,
        species: 6,
        products: 7,
        impact: 8,
        cta: 9,
      },
      missionPillars: [
        {
          icon: "Hammer",
          title: "Savonnerie artisanale locale",
          summary: "Fabrication à main • saponification à froid • production belge",
          detail: "Atelier artisanal à Watermael-Boitsfort.",
          shortDescription: "Fabrication 100% à la main, saponification à froid, production locale en Belgique.",
          description: "Habeebee fabrique ses savons à la main dans sa savonnerie à Bruxelles, en utilisant la méthode de saponification à froid. La production est locale et artisanale, avec une équipe dédiée qui produit chaque jour des soins pour la peau.",
          keyPoints: [
            "Fabrication 100% à la main",
            "Saponification à froid",
            "Production locale en Belgique",
            "Peu d'ingrédients, mais de qualité",
          ],
          whyItMatters: "Une production artisanale locale permet de maîtriser les processus de fabrication et de réduire l'empreinte transport. Ces pratiques documentées s'inscrivent dans une logique de production locale, sans constituer une preuve d'impact mesuré.",
          sourceLabel: "Information partenaire documentée",
        },
        {
          icon: "Hexagon",
          title: "Apiculture familiale",
          summary: "Formation • collecte de cire • sensibilisation",
          detail: "Programme HabeebeeCulture d'apiculture familiale.",
          shortDescription: "Formation apiculture familiale, collecte de cire et propolis, récolte à vélo.",
          description: "Habeebee propose des packs et formations pour apprendre l'apiculture familiale et naturelle à Bruxelles. Le programme inclut la collecte de cire et de propolis, avec un cycle de récolte à vélo pour minimiser l'impact transport.",
          keyPoints: [
            "Formation apiculture familiale",
            "Collecte de cire et propolis",
            "Récolte à vélo",
            "Cycle de proximité ruche-cire-savon",
          ],
          whyItMatters: "L'apiculture familiale et naturelle vise à sensibiliser au monde des abeilles et à développer des pratiques de proximité. Ces actions documentées s'inscrivent dans une logique de transmission, sans constituer une preuve d'impact mesuré.",
          sourceLabel: "Information partenaire documentée",
        },
        {
          icon: "HeartHandshake",
          title: "Soutien associatif local",
          summary: "Scouts • associations • réinsertion • solidarité bruxelloise",
          detail: "Partenariats avec mouvements de jeunesse et structures d'insertion.",
          shortDescription: "Soutien scouts, associations non lucratives, partenariat réinsertion sociale.",
          description: "Habeebee soutient des initiatives locales à travers des partenariats solidaires. Le savon 'Scout Toujours' est proposé à prix exclusif pour les scouts, le savon 'Qui a Bon Fond' pour les associations non lucratives, et l'entreprise collabore avec des structures de réinsertion sociale.",
          keyPoints: [
            "Savon Scout Toujours pour mouvements de jeunesse",
            "Savon Qui a Bon Fond pour associations",
            "Partenariat réinsertion sociale",
            "Prix accessibles pour initiatives solidaires",
          ],
          whyItMatters: "Soutenir des initiatives locales et des structures d'insertion permet de renforcer le tissu social local. Ces partenariats documentés s'inscrivent dans une logique de solidarité, sans constituer une preuve d'impact mesuré.",
          sourceLabel: "Information partenaire documentée",
        },
      ],
      proofCards: [
        { label: "Certification ECOGARANTIE", value: "Control Certisys", icon: "BadgeCheck", proofType: "certification" },
        { label: "Collecte locale à vélo", value: "Récolte de cire & propolis", icon: "Bike", proofType: "field_operation" },
        { label: "Saponification à froid", icon: "FlaskConical", proofType: "method" },
        { label: "Atelier à Bruxelles", value: "Watermael-Boitsfort", icon: "MapPin", proofType: "location" },
        { label: "Certification BIO", icon: "BadgeCheck", proofType: "certification" },
        { label: "Cire & propolis", value: "Ingrédients de la ruche", icon: "Leaf", proofType: "method" },
        { label: "Apiculture familiale", value: "Programme HabeebeeCulture", icon: "Hexagon", proofType: "method" },
        { label: "Soutien scouts & associations", value: "Scout Toujours • Qui a Bon Fond", icon: "Users", proofType: "partner" },
        { label: "Partenariat réinsertion", icon: "HeartHandshake", proofType: "partner" },
        { label: "Certification Artisanat Certifié", icon: "Award", proofType: "certification" },
        { label: "Fabrication 100% à la main", icon: "Hand", proofType: "method" },
      ],
      storyBlocks: [
        {
          title: "Née à Bruxelles en 2016",
          body: "Alexia fonde Habeebee pour relier les abeilles, les soins naturels et l'artisanat local bruxellois.",
          imageUrl: HABEEBEE_PATHS.media.portrait,
        },
        {
          title: "Une équipe qui fabrique localement",
          body: "En 2024, l'équipe se renforce pour structurer l'atelier, organiser la production et faire grandir le réseau local.",
          imageUrl: HABEEBEE_PATHS.media.story4V2,
        },
        {
          title: "Savonnerie artisanale",
          body: "Un atelier à la main à Watermael-Boitsfort. Chaque savon est saponifié à froid avec de la cire d'abeille et de la propolis.",
          imageUrl: HABEEBEE_PATHS.media.savonnerieInterieur,
        },
        {
          title: "HabeebeeCulture",
          body: "Transmettre l'apiculture naturelle aux familles. De la ruche à la cire, du vélo de récolte aux savons artisanaux.",
          imageUrl: HABEEBEE_PATHS.media.story1V2,
        },
        {
          title: "Soutien local",
          body: "Savon Scout Toujours pour les mouvements de jeunesse, Qui a Bon Fond pour les associations, et partenariat réinsertion.",
          imageUrl: HABEEBEE_PATHS.media.story6Scouts,
        },
        {
          title: "Certifications documentées",
          body: "ECOGARANTIE (Control Certisys), Artisanat Certifié, certification BIO — des labels qui attestent de pratiques contrôlées.",
          imageUrl: HABEEBEE_PATHS.media.story8Certificat,
        },
      ],
      partnerCatalogOverview: {
        title: "Leur gamme",
        disclaimer: "Une partie de ces produits est disponible dans l'app.",
        families: [
          {
            label: "Savons solides",
            examples: ["Think Pink", "Cire d'abeille DOUX", "TONIC", "HABABY", "VERTUEUX", "FLOWER POWER", "PROPRE ET LISSE", "Scout Toujours"],
            origin: "Bruxelles, Belgique",
          },
          {
            label: "Shampoings solides",
            examples: ["L'abeille s'en mêle — cire d'abeille & rhassoul"],
            origin: "Bruxelles, Belgique",
          },
          {
            label: "Baumes",
            examples: ["Baumes cire d'abeille et propolis"],
            origin: "Bruxelles, Belgique",
          },
          {
            label: "Huiles & soins",
            examples: ["Soins liquides", "Huiles végétales"],
            origin: "Bruxelles, Belgique",
          },
          {
            label: "Coffrets cadeaux",
            examples: ["Box SAVONS LE MONDE", "Coffret 7 mini savons", "Coffrets personnalisables"],
            origin: "Bruxelles, Belgique",
          },
        ],
      },
    }
  }

  // ── Trilogy Ocean Restoration enrichment ──
  if (producer.slug === 'trilogy-ocean-restoration' || producer.name_default?.toLowerCase().includes('trilogy')) {
    return {
      ...producer,
      tagline: "Restauration corallienne & éducation marine",
      locations: {
        field: "Indonésie",
        fieldDetail: "Karimunjawa, Java central",
      },
      editorialIdentity: {
        legalName: "Trilogy Ocean Restoration",
        shortName: "Trilogy Ocean Restoration",
        foundedYear: 2024,
        founderNames: [],
        fieldDirector: "Novri Julfiansyah & Daniel Jackson Subianto",
        nextGeneration: ["Vincentio Joshua", "Arindiana Janidya Alifsativarini"],
        partnerType: "Organisation de restauration des écosystèmes océaniques",
        tagline: "Restauration corallienne & éducation marine",
        summary: "Trilogy Ocean Restoration est une organisation indonésienne fondée en 2024, basée à Karimunjawa, Java central. Elle se concentre sur la réparation et la restauration des récifs coralliens, mangroves et herbiers marins. En partenariat avec Karimunjawa Scuba Diving, Scuba School International et Seacrest Indonesia, Trilogy propose des programmes de formation, des excursions éducatives et des actions de propagation corallienne documentées sur le terrain.",
        emotionalStatement: "À Karimunjawa, Trilogy replante des fragments de corail, suit les récifs et transmet les savoirs marins.",
        missionIntro: "Restaurer les récifs, transmettre les savoirs marins et impliquer les visiteurs dans la protection des coraux.",
        speciesSubtitle: "Coraux, espèces récifales et habitats associés aux jardins sous-marins.",
      },
      visualAssets: {
        hero: TRILOGY_PATHS.identity.cover,
        portrait: TRILOGY_PATHS.identity.portrait,
        logo: TRILOGY_PATHS.identity.logo,
        story: [
          { id: "story-1", url: TRILOGY_PATHS.media.story1CoralDiver, role: "story" as const, type: "field_photo" as const, alt: "Plongeur sur le récif de Karimunjawa", sourceUrl: "https://www.tiktok.com/@trilogyoceanrestoration" },
          { id: "story-2", url: TRILOGY_PATHS.media.youtube9CilikIsland, role: "field_proof" as const, type: "field_photo" as const, alt: "Coral Restoration at Cilik Island", sourceUrl: "https://www.youtube.com/@TrilogyOceanRestoration" },
          { id: "story-3", url: TRILOGY_PATHS.media.youtube7Monitoring, role: "field_proof" as const, type: "field_photo" as const, alt: "Effective monitoring for coral restoration", sourceUrl: "https://www.youtube.com/@TrilogyOceanRestoration" },
          { id: "story-4", url: TRILOGY_PATHS.media.story12DiveEdutrip, role: "story" as const, type: "field_photo" as const, alt: "Dive Edutrip Karimunjawa", sourceUrl: "https://www.tiktok.com/@trilogyoceanrestoration" },
          { id: "story-5", url: TRILOGY_PATHS.media.youtube8PlantingCoral, role: "field_proof" as const, type: "field_photo" as const, alt: "Planting coral fragments", sourceUrl: "https://www.youtube.com/@TrilogyOceanRestoration" },
          { id: "story-6", url: TRILOGY_PATHS.media.story9ExploreBiodiversity, role: "story" as const, type: "field_photo" as const, alt: "Exploration biodiversité Karimunjawa", sourceUrl: "https://www.tiktok.com/@trilogyoceanrestoration" },
        ],
      },
      missionPillars: [
        {
          icon: "Waves",
          title: "Restauration corallienne",
          summary: "Plantation • Suivi • Jardins sous-marins",
          detail: "Programme de restauration des récifs coralliens à Karimunjawa.",
          shortDescription: "Plantation de fragments de corail et suivi des jardins sous-marins à Cilik Island.",
          description: "Trilogy Ocean Restoration implante de nouveaux fragments de corail pour recréer des zones de biodiversité marine active, documentant les sites comme Cilik Island. Chaque intervention est suivie pour mesurer la survie et la croissance des nouvelles colonies.",
          keyPoints: [
            "Plantation de fragments de corail sur structures",
            "Surveillance documentée des jardins coralliens",
            "Sites de restauration identifiés (Cilik Island)",
          ],
          whyItMatters: "Les coraux sont les fondements des écosystèmes tropicaux, fournissant un habitat essentiel à des milliers d'espèces marines. Ces actions de restauration sont documentées qualitativement via vidéos terrain, sans métriques d'impact quantifiées par le partenaire.",
          sourceLabel: "Information partenaire documentée — TikTok & YouTube @TrilogyOceanRestoration",
        },
        {
          icon: "GraduationCap",
          title: "Éducation marine",
          summary: "Formation • Excursions éducatives • Sensibilisation",
          detail: "Programmes éducatifs sur la conservation marine et la plongée.",
          shortDescription: "Formation de moniteurs certifiés SSI et excursions d'exploration de la biodiversité marine.",
          description: "Trilogy propose des cours de formation de moniteurs de plongée certifiés Scuba School International (SSI), des Dive Edutrips et des programmes de sensibilisation à la biodiversité marine de Karimunjawa.",
          keyPoints: [
            "Formation moniteurs de plongée (SSI — Scuba Schools International)",
            "Excursions Dive Edutrip pour visiteurs et locaux",
            "Exploration biodiversité Karimunjawa",
          ],
          whyItMatters: "Former des moniteurs locaux crée une capacité durable de transmission des savoirs. La certification SSI est un signal de compétence, pas une preuve directe d'impact écologique.",
          sourceLabel: "Information partenaire documentée — LinkedIn & YouTube",
        },
        {
          icon: "HandHeart",
          title: "Adoption de coraux",
          summary: "Programme d'adoption • Engagement communautaire",
          detail: "Programme d'adoption de coraux pour soutenir la restauration.",
          shortDescription: "Programme permettant aux individus de soutenir la restauration corallienne.",
          description: "Trilogy propose un programme d'adoption de coraux permettant à des individus et organisations de soutenir concrètement les efforts de restauration. Ce mécanisme d'engagement communautaire contribue à la durabilité financière du projet.",
          keyPoints: [
            "Coral Adoption Program",
            "Engagement individuel et collectif",
            "Lien direct avec la restauration terrain",
          ],
          whyItMatters: "Ce programme crée un lien direct entre soutien financier et action terrain documentée. C'est un mécanisme d'engagement, pas une garantie de résultat mesuré.",
          sourceLabel: "Information partenaire documentée — Peek Holidays & réseaux sociaux",
        },
      ],
      proofCards: [
        { label: "Site de restauration", value: "Cilik Island, Karimunjawa", icon: "Waves", proofType: "field_operation" },
        { label: "Fragments coralliens implantés", value: "Structures de restauration documentées", icon: "Sprout", proofType: "field_operation" },
        { label: "Programme d'adoption de coraux", value: "Coral Adoption Program", icon: "HandHeart", proofType: "method" },
        { label: "Localisation documentée", value: "Karimunjawa, Java central", icon: "MapPin", proofType: "location" },
        { label: "Partenariat conservation", value: "Seacrest Indonesia", icon: "Handshake", proofType: "partner" },
        { label: "Formation certifiée SSI", value: "Scuba Schools International", icon: "Award", proofType: "partner" },
        { label: "Partenariat plongée", value: "Karimunjawa Scuba Diving", icon: "Users", proofType: "partner" },
        { label: "Formation moniteurs", value: "Instructor Training Course", icon: "GraduationCap", proofType: "method" },
        { label: "Biodiversité marine documentée", value: "Exploration Karimunjawa", icon: "Fish", proofType: "field_operation" },
        { label: "Présence en ligne", value: "YouTube, TikTok, Instagram", icon: "Smartphone", proofType: "method" },
      ],
      storyBlocks: [
        {
          title: "Dive • Explore • Restore",
          body: "Plonger pour explorer, comprendre pour restaurer. Une approche terrain documentée à Karimunjawa depuis 2024.",
          imageUrl: TRILOGY_PATHS.media.story1V2,
        },
        {
          title: "Restauration à Cilik Island",
          body: "Des fragments de corail sont fixés sur des structures de restauration, puis suivis dans le temps pour mesurer leur croissance.",
          imageUrl: TRILOGY_PATHS.media.trilogyCilikIsland,
        },
        {
          title: "Suivi des jardins sous-marins",
          body: "Le monitoring documente la survie et la croissance des coraux restaurés sur les sites de Karimunjawa.",
          // TODO: remplacer par trilogy-coral-monitoring-underwater.png quand disponible
          imageUrl: TRILOGY_PATHS.media.trilogyOceanRestoration,
        },
        {
          title: "Éducation et excursions marines",
          body: "Les Dive Edutrips transmettent les bases de la plongée, de la biodiversité et de la conservation marine.",
          imageUrl: TRILOGY_PATHS.media.trilogyMarineEducation,
        },
      ],
      sectionOrder: {
        hero: 1,
        mission: 2,
        proofs: 3,
        story: 4,
        projects: 5,
        species: 6,
        products: 7,
        impact: 8,
        cta: 9,
      },
      partnerCatalogOverview: {
        title: "Leurs actions et programmes",
        disclaimer: "Ces programmes ne sont pas disponibles directement dans l'app.",
        families: [
          {
            label: "Adoption de coraux",
            examples: ["Coral Adoption Program", "Parrainage de fragments coralliens"],
            origin: "Karimunjawa, Indonésie",
          },
          {
            label: "Formation de plongée",
            examples: ["Instructor Training Course SSI", "Cours certifiés Scuba Schools International"],
            origin: "Karimunjawa, Indonésie",
          },
          {
            label: "Excursions éducatives",
            examples: ["Dive Edutrip", "Exploration biodiversité Karimunjawa", "Coral Education Trip"],
            origin: "Karimunjawa, Indonésie",
          },
          {
            label: "Conservation marine",
            examples: ["Plantation de coraux", "Monitoring récifs Cilik Island", "Restauration corallienne"],
            origin: "Karimunjawa, Indonésie",
          },
        ],
      },
      contact_website: "https://linktr.ee/underwatergardeners",
    }
  }

  return producer
}

export const getMockProducerBySlug = (slug: string): MockProducerSeed | null =>
  getMockProducers().find((producer) => producer.slug === slug) || null
