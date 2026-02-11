/**
 * Investment Module Types
 * Projects, Partners, Investments
 */

import { z } from 'zod'

// Project Types
export const ProjectTypeEnum = z.enum(['beehive', 'olive_tree', 'vineyard', 'forest', 'marine'])
export type ProjectType = z.infer<typeof ProjectTypeEnum>

// Project Status
export const ProjectStatusEnum = z.enum(['draft', 'active', 'funded', 'completed', 'archived'])
export type ProjectStatus = z.infer<typeof ProjectStatusEnum>

// Risk Level
export const RiskLevelEnum = z.enum(['LOW', 'MEDIUM', 'HIGH'])
export type RiskLevel = z.infer<typeof RiskLevelEnum>

// Coordinates Schema
export const CoordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
})
export type Coordinates = z.infer<typeof CoordinatesSchema>

// Project Schema
export const ProjectSchema = z.object({
  id: z.string().uuid(),
  type: ProjectTypeEnum,
  slug: z.string().min(1),
  location: z.string().optional(),
  producer_id: z.string().uuid(),
  target_budget: z.number().positive(),
  current_funding: z.number().min(0).default(0),
  launch_date: z.date().optional(),
  maturity_date: z.date().optional(),
  certification_labels: z.array(z.string()).default([]),
  impact_metrics: z.unknown().optional(),
  metadata: z.unknown().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  featured: z.boolean().default(false),
  created_at: z.date(),
  updated_at: z.date(),
  species_id: z.string().uuid().optional(),
  deleted_at: z.date().optional(),
  name_default: z.string().min(1),
  description_default: z.string().optional(),
  funding_progress: z.number().optional(),
  address_street: z.string().optional(),
  address_city: z.string().optional(),
  address_postal_code: z.string().optional(),
  address_country_code: z.string().optional(),
  address_region: z.string().optional(),
  hero_image_url: z.string().optional(),
  avatar_image_url: z.string().optional(),
  gallery_image_urls: z.array(z.string()).default([]),
  long_description_default: z.string().optional(),
  status: ProjectStatusEnum.default('draft'),
})

export type Project = z.infer<typeof ProjectSchema>

// Create Project Schema
export const CreateProjectSchema = ProjectSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  current_funding: true,
})

export type CreateProject = z.infer<typeof CreateProjectSchema>

// Partner Status
export const PartnerStatusEnum = z.enum(['pending', 'active', 'inactive', 'suspended', 'archived'])
export type PartnerStatus = z.infer<typeof PartnerStatusEnum>

// Partner Schema
export const PartnerSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  type: z.enum(['farmer', 'cooperative', 'association', 'company', 'individual']),
  location: z.string().optional(),
  status: PartnerStatusEnum.default('pending'),
  name_default: z.string().min(1),
  description_default: z.string().optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().optional(),
  contact_website: z.string().optional(),
  owner_user_id: z.string().uuid().optional(),
  created_at: z.date(),
  updated_at: z.date(),
})

export type Partner = z.infer<typeof PartnerSchema>

// Investment Type (for points calculation)
export type InvestmentType = 'beehive' | 'olive_tree' | 'vineyard'

export type Investment = {
  type: InvestmentType
  amount_eur: number
  bonus_percentage: number
}

// Points Calculation Result
export type PointsCalculation = {
  base_points: number
  bonus_points: number
  total_points: number
  euro_value_equivalent: number
  investment_type?: string
  calculated_at: Date
}
