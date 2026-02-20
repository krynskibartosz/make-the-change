import { z } from 'zod'
import type { HomePageContent, MainMenuStructure } from '@/app/[locale]/admin/cms/_features/types'

const megaMenuItemSchema = z.object({
  title: z.string(),
  image: z.string(),
  href: z.string(),
  badge: z.string().optional(),
})

const megaMenuSectionSchema = z.object({
  title: z.string(),
  items: z.array(megaMenuItemSchema),
})

const megaMenuCategorySchema = z.object({
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

export const mainMenuStructureSchema: z.ZodType<MainMenuStructure> = z
  .object({
    projects: megaMenuCategorySchema,
    products: megaMenuCategorySchema,
    discover: megaMenuCategorySchema,
  })
  .catchall(megaMenuCategorySchema)

const universeCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  badge: z.string().optional(),
  cta: z.string(),
  image: z.string().optional(),
})

const featureItemSchema = z.object({
  title: z.string(),
  description: z.string(),
})

export const homePageContentSchema: z.ZodType<HomePageContent> = z.object({
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
