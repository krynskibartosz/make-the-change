import { getMockProducts } from '@/app/[locale]/(screens)/products/_features/mock-products'
import { getMockProjects } from '@/app/[locale]/(tabs)/projects/_features/mock-projects'

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
}

// ── Nouveaux types éditoriaux ──
export type MissionPillar = {
  icon: string
  title: string
  description: string
}

export type ProofCard = {
  label: string
  value?: string
  icon: string
  proofType: 'location' | 'certification' | 'method' | 'partner' | 'field_operation' | 'other'
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
  european: string   // "Belgique"
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
        partnerType: "Réseau apicole partenaire",
        tagline: "Natural & Ethic Food",
        summary: "Fondée en 2017 par un entrepreneur belge installé à Madagascar, Ilanga Nature structure une filière apicole locale avec mielleries mobiles, formation des apiculteurs et certification biologique Ecocert. L'entreprise exporte des miels, vanilles, épices et confitures artisanaux issus de Madagascar, de l'île Maurice, de La Réunion et de Sardaigne."
      },
      
      // ── Visual Assets (Phase 1) ──
      visualAssets: {
        hero: "/images/producteurs/illanga-nature/hero-lemurs-miel.webp",
        portrait: "/images/producteurs/illanga-nature/portrait-famille-laurent.webp",
        logo: "/images/producteurs/illanga-nature/logo-officiel.webp",
        story: [
          {
            id: "story-1",
            url: "/images/producteurs/illanga-nature/story-aventure-madagascar.webp",
            role: "story",
            type: "field_photo",
            alt: "Famille Laurent - Fondation Ilanga Nature",
            sourceUrl: "https://www.ilanga-nature.com/notre-histoire"
          },
          {
            id: "story-2",
            url: "/images/producteurs/illanga-nature/story-apiculteur-fort-dauphin.webp",
            role: "story",
            type: "field_photo",
            alt: "Apiculteur formé à Fort-Dauphin",
            sourceUrl: "https://www.ilanga-nature.com/notre-histoire"
          },
          {
            id: "story-3",
            url: "/images/producteurs/illanga-nature/story-miellerie-interieur.webp",
            role: "field_proof",
            type: "field_photo",
            alt: "Intérieur miellerie Madagascar",
            sourceUrl: "https://www.ilanga-nature.com/en/des-mielleries-a-madagascar"
          },
          {
            id: "story-4",
            url: "/images/producteurs/illanga-nature/story-barge-pangalanes.webp",
            role: "field_proof",
            type: "field_photo",
            alt: "Barge apicole sur le canal des Pangalanes",
            sourceUrl: "https://miarakap.com/entrepreneur/ilanga-nature/"
          },
          {
            id: "story-5",
            url: "/images/producteurs/illanga-nature/story-ecole-apiculture.webp",
            role: "story",
            type: "field_photo",
            alt: "École d'apiculture à Fort-Dauphin",
            sourceUrl: "https://www.ilanga-nature.com/nos-valeurs"
          },
          {
            id: "story-6",
            url: "/images/producteurs/illanga-nature/story-miels-certifies.webp",
            role: "field_proof",
            type: "field_photo",
            alt: "Miels certifiés Ecocert",
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
      
      // ── Mission Pillars (5 piliers enrichis) ──
      missionPillars: [
        {
          icon: "Users",
          title: "Soutien aux apiculteurs locaux",
          description: "Formation, fourniture de ruches et approvisionnement équitable auprès des apiculteurs partenaires à Madagascar. Une école d'apiculture est en place à Fort-Dauphin."
        },
        {
          icon: "Ship",
          title: "Mielleries mobiles & infrastructures terrain",
          description: "2 mielleries mobiles + 3 mielleries fixes (Antananarivo, Manakara, Fort-Dauphin) + une barge motorisée sur le canal des Pangalanes pour collecter le miel en un seul passage."
        },
        {
          icon: "BadgeCheck",
          title: "Traçabilité et certification biologique",
          description: "Mielleries homologuées par le Ministère malgache de l'Élevage. Certification Ecocert pour les miels biologiques. Contrôle de l'humidité (16–18%) pour prévenir la fermentation."
        },
        {
          icon: "Globe",
          title: "Valorisation des filières malgaches",
          description: "Contribution au rayonnement international de Madagascar. Préservation des savoir-faire ancestraux. Génération de revenus décents pour les communautés rurales."
        },
        {
          icon: "Hand",
          title: "Préservation des savoir-faire artisanaux",
          description: "Collection de plus de 60 références artisanales (miels, épices, vanilles, confitures, huiles, sel, sucre). Sélection rigoureuse des matières premières avec des producteurs locaux partenaires."
        }
      ],
      
      // ── Proof Cards (10+ preuves réelles) ──
      proofCards: [
        {
          label: "Certification Ecocert",
          value: "Certifié biologique",
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
          value: "Collecte légère et non perturbante",
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
          value: "Fort-Dauphin",
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
      
      // ── Story Blocks (6 blocs narratifs V2 premium) ──
      storyBlocks: [
        {
          title: "Une aventure née à Madagascar",
          body: "Ilanga Nature est née en 2017 de la vision d'Olivier Laurent, entrepreneur belge fasciné par la Grande Île. Une vocation : révéler les richesses naturelles de Madagascar, de manière durable et respectueuse des hommes et de la terre.",
          imageUrl: "/images/producteurs/illanga-nature/hero-lemures-miel-fort-dauphin.webp"
        },
        {
          title: "Un réseau de producteurs engagés",
          body: "Aux côtés d'Olivier, Laura Razanajatovo dirige les opérations sur le terrain. Nathan et Naya représentent la nouvelle génération. Ensemble, ils forment un réseau d'apiculteurs partenaires unis autour d'un savoir-faire ancestral malgache.",
          imageUrl: "/images/producteurs/illanga-nature/portrait-famille-laurent.webp"
        },
        {
          title: "Des mielleries au plus près du terrain",
          body: "Trois mielleries fixes — Antananarivo, Manakara, Fort-Dauphin — et deux unités mobiles. Chaque miellerie est homologuée par le Ministère malgache de l'Élevage et certifiée Ecocert pour les miels biologiques.",
          imageUrl: "/images/producteurs/illanga-nature/miellerie-manakara-exterieur.webp"
        },
        {
          title: "Une barge sur le canal des Pangalanes",
          body: "Une barge apicole motorisée sur le canal des Pangalanes permet d'atteindre les apiculteurs dans les zones reculées de la côte est. Financée avec le soutien de Miarakap, elle illustre une logistique légère et respectueuse.",
          imageUrl: "/images/producteurs/illanga-nature/story-barge-pangalanes.webp"
        },
        {
          title: "Former pour pérenniser",
          body: "L'école d'apiculture 'Académie Ilanga' à Fort-Dauphin forme les producteurs aux techniques modernes. Ilanga est aussi partenaire de Hope Madagascar pour l'accompagnement des jeunes et de l'association ADAMA pour la protection des forêts.",
          imageUrl: "/images/producteurs/illanga-nature/ecole-apiculture-fort-dauphin.webp"
        },
        {
          title: "Des produits tracés, du rucher à votre table",
          body: "Douze variétés de miel certifiées biologiques, vanilles de Manakara, épices rares, confitures artisanales. Transport maritime en retour à vide pour une logistique moins polluante. Chaque produit raconte son terroir.",
          imageUrl: "/images/producteurs/illanga-nature/produits-miels-trio.jpg"
        }
      ],
      
      // ── Impact Summary (estimation prudente) ──
      impactSummary: {
        estimate: 428000,
        unit: "abeilles",
        wording: "Estimation : abeilles concernées par les projets liés aux ruchers",
        disclaimer: "Estimation pédagogique basée sur les hypothèses de financement des projets, pas une mesure terrain."
      },
    }
  }

  return producer
}

export const getMockProducerBySlug = (slug: string): MockProducerSeed | null =>
  getMockProducers().find((producer) => producer.slug === slug) || null
