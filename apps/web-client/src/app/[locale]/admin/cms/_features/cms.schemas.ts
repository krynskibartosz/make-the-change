import { z } from 'zod'
import type {
  HomePageContent,
  MainMenuStructure,
  MegaMenuCategory,
  MegaMenuItem,
  MegaMenuSection,
} from '@/app/[locale]/admin/cms/_features/types'

const megaMenuItemSchema: z.ZodType<MegaMenuItem, z.ZodTypeDef, unknown> = z
  .object({
    title: z.string(),
    image: z.string(),
    href: z.string(),
    badge: z.string().optional(),
  })
  .transform((value) => ({
    title: value.title,
    image: value.image,
    href: value.href,
    ...(value.badge !== undefined ? { badge: value.badge } : {}),
  }))

const megaMenuSectionSchema: z.ZodType<MegaMenuSection, z.ZodTypeDef, unknown> = z.object({
  title: z.string(),
  items: z.array(megaMenuItemSchema),
})

const megaMenuCategorySchema: z.ZodType<MegaMenuCategory, z.ZodTypeDef, unknown> = z
  .object({
    title: z.string(),
    eyebrow: z.string().optional(),
    sections: z.array(megaMenuSectionSchema),
    featured: z
      .object({
        title: z.string(),
        image: z.string(),
        href: z.string(),
        ctaLabel: z.string(),
      })
      .optional(),
  })
  .transform((value) => ({
    title: value.title,
    sections: value.sections,
    ...(value.eyebrow !== undefined ? { eyebrow: value.eyebrow } : {}),
    ...(value.featured !== undefined ? { featured: value.featured } : {}),
  }))

export const mainMenuStructureSchema: z.ZodType<MainMenuStructure, z.ZodTypeDef, unknown> = z
  .object({
    projects: megaMenuCategorySchema,
    products: megaMenuCategorySchema,
    discover: megaMenuCategorySchema,
  })
  .catchall(megaMenuCategorySchema)

type HomeUniverseCard = HomePageContent['universe']['cards']['projects']

const universeCardSchema: z.ZodType<HomeUniverseCard, z.ZodTypeDef, unknown> = z
  .object({
    title: z.string(),
    description: z.string(),
    badge: z.string().optional(),
    cta: z.string(),
    image: z.string().optional(),
  })
  .transform((value) => ({
    title: value.title,
    description: value.description,
    cta: value.cta,
    ...(value.badge !== undefined ? { badge: value.badge } : {}),
    ...(value.image !== undefined ? { image: value.image } : {}),
  }))

const featureItemSchema = z.object({
  title: z.string(),
  description: z.string(),
})

export const homePageContentSchema: z.ZodType<HomePageContent, z.ZodTypeDef, unknown> = z
  .object({
    hero: z.object({
      badge: z.string(),
      title: z.string(),
      subtitle: z.string(),
      cta_primary: z.string(),
      cta_secondary: z.string(),
    }),
    stats: z.object({
      projects: z.string(),
      members: z.string(),
      global_impact: z.string(),
      points_generated: z.string(),
      points_label: z.string(),
    }),
    universe: z.object({
      title: z.string(),
      description: z.string(),
      cards: z.object({
        projects: universeCardSchema,
        products: universeCardSchema,
        community: universeCardSchema,
      }),
    }),
    features: z.object({
      title: z.string(),
      invest: featureItemSchema,
      earn: featureItemSchema,
      redeem: featureItemSchema,
      explore: z.string(),
    }),
    cta: z.object({
      title: z.string(),
      description: z.string(),
      button: z.string(),
      stats: z.object({
        engagement: z.string(),
        transparency: z.string(),
        community: z.string(),
      }),
    }),
    partners: z
      .object({
        title: z.string(),
        description: z.string(),
      })
      .optional(),
    blog: z
      .object({
        title: z.string(),
      })
      .optional(),
  })
  .transform((value) => ({
    hero: value.hero,
    stats: value.stats,
    universe: value.universe,
    features: value.features,
    cta: value.cta,
    ...(value.partners !== undefined ? { partners: value.partners } : {}),
    ...(value.blog !== undefined ? { blog: value.blog } : {}),
  }))
