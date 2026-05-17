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
        partnerType: "Partenaire apicole documenté",
        tagline: "Réseau apicole & produits naturels",
        summary: "Fondée en 2017 par un entrepreneur belge installé à Madagascar, Ilanga Nature structure une filière apicole locale avec mielleries mobiles, formation des apiculteurs et certification biologique Ecocert. L'entreprise exporte des miels, vanilles, épices et confitures artisanaux issus de Madagascar, de l'île Maurice, de La Réunion et de Sardaigne."
      },
      
      // ── Visual Assets (Phase 1) ──
      visualAssets: {
        hero: "/images/producteurs/illanga-nature/cover.png",
        portrait: "/images/producteurs/illanga-nature/logo-ilanga-nature-compact.png",
        logo: "/images/producteurs/illanga-nature/logo-ilanga-nature-hd.webp",
        story: [
          {
            id: "story-1",
            url: "/images/producteurs/illanga-nature/portrait-famille-laurent.webp",
            role: "story",
            type: "field_photo",
            alt: "La famille Laurent — Olivier, Nathan et Naya, fondateurs d'Ilanga Nature",
            sourceUrl: "https://www.ilanga-nature.com/notre-histoire"
          },
          {
            id: "story-2",
            url: "/images/producteurs/illanga-nature/portrait-apiculteur-fort-dauphin.webp",
            role: "story",
            type: "field_photo",
            alt: "Apiculteur au travail à Fort-Dauphin, Madagascar",
            sourceUrl: "https://www.ilanga-nature.com/notre-histoire"
          },
          {
            id: "story-3",
            url: "/images/producteurs/illanga-nature/miellerie-manakara-exterieur.webp",
            role: "field_proof",
            type: "field_photo",
            alt: "Miellerie Ilanga Nature à Manakara, Madagascar",
            sourceUrl: "https://www.ilanga-nature.com/en/des-mielleries-a-madagascar"
          },
          {
            id: "story-4",
            url: "/images/producteurs/illanga-nature/mielleries-mobiles-terrain.webp",
            role: "field_proof",
            type: "field_photo",
            alt: "Unité mobile d'extraction Ilanga Nature — substitué à la barge (photo non disponible)",
            sourceUrl: "https://miarakap.com/entrepreneur/ilanga-nature/"
          },
          {
            id: "story-5",
            url: "/images/producteurs/illanga-nature/ecole-apiculture-fort-dauphin.webp",
            role: "story",
            type: "field_photo",
            alt: "École de formation apicole Ilanga Academy à Fort-Dauphin",
            sourceUrl: "https://www.ilanga-nature.com/nos-valeurs"
          },
          {
            id: "story-6",
            url: "/images/producteurs/illanga-nature/produits-miels-trio.jpg",
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
      
      // ── Story Blocks (6 blocs narratifs condensés mobile-first) ──
      storyBlocks: [
        {
          title: "Née à Madagascar en 2017",
          body: "Fondée par Olivier Laurent, entrepreneur belge fasciné par la Grande Île. Une vocation : révéler les savoir-faire apicoles malgaches avec une approche terrain, durable et humaine.",
          imageUrl: "/images/producteurs/illanga-nature/hero-lemures-miel-fort-dauphin.webp"
        },
        {
          title: "Une famille, un réseau",
          body: "Olivier, Laura, Nathan et Naya. Quatre personnes, une mission : structurer une filière apicole locale avec des apiculteurs partenaires et un savoir-faire ancestral.",
          imageUrl: "/images/producteurs/illanga-nature/portrait-famille-laurent.webp"
        },
        {
          title: "3 mielleries, 2 unités mobiles",
          body: "Antananarivo, Manakara, Fort-Dauphin. Chaque miellerie est homologuée par le Ministère malgache et certifiée Ecocert pour les miels biologiques.",
          imageUrl: "/images/producteurs/illanga-nature/miellerie-manakara-exterieur.webp"
        },
        {
          title: "Logistique légère",
          body: "Une barge motorisée sur le canal des Pangalanes et des unités mobiles permettent d'atteindre les apiculteurs dans les zones reculées de la côte est.",
          imageUrl: "/images/producteurs/illanga-nature/mielleries-mobiles-terrain.webp"
        },
        {
          title: "Former pour durer",
          body: "L'Académie Ilanga à Fort-Dauphin forme les producteurs. Partenaire de Hope Madagascar et de l'association ADAMA pour la protection des forêts.",
          imageUrl: "/images/producteurs/illanga-nature/ecole-apiculture-fort-dauphin.webp"
        },
        {
          title: "Du rucher à votre table",
          body: "12 miels biologiques, vanilles, épices et confitures. Traçabilité complète. Transport maritime retour à vide pour limiter l'empreinte carbone.",
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
      
      // ── Gamme partenaire (informatif — pas le catalogue app) ──
      partnerCatalogOverview: {
        title: "Ce qu'ils produisent",
        disclaimer: "Cette section présente la gamme documentée d'Ilanga Nature. Seuls certains produits sont sélectionnés et disponibles dans l'app Make the Change.",
        families: [
          {
            label: "Miels de Madagascar",
            examples: ["Litchi", "Niaouli", "Cactus", "Jujubier (bio)", "Forêt primaire", "Forêt sèche", "Eucalyptus", "Baies roses", "Mokarana (bio)"],
            origin: "Madagascar — Manakara, Fort-Dauphin, Antananarivo"
          },
          {
            label: "Vanilles",
            examples: ["Vanille Bourbon de Manakara", "Vanille Tahiti"],
            origin: "Madagascar (Manakara) · Polynésie Française"
          },
          {
            label: "Épices",
            examples: ["Poivre noir", "Gingembre", "Cannelle", "Curcuma"],
            origin: "Madagascar"
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

  return producer
}

export const getMockProducerBySlug = (slug: string): MockProducerSeed | null =>
  getMockProducers().find((producer) => producer.slug === slug) || null
