'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Page producteur - Architecture éditoriale premium
 *
 * Structure:
 * 1. Hero immersif (double localisation)
 * 2. Mission (pourquoi ils existent)
 * 3. Preuves (crédibilité terrain)
 * 4. Projets (actions terrain) — estimation intégrée ici
 * 5. Espèces (lien biodiversité)
 * 6. Histoire (modulaire)
 * 7. Produits (conséquence naturelle)
 * 8. CTA (engagement)
 *
 * Mobile-first, storytelling, preuves, rythme.
 */

import type { PublicProducer } from './producer-detail-data'
import { ProducerHero } from './_components/producer-hero'
import { MissionSection } from './_components/mission-section'
import { ProofGrid } from './_components/proof-grid'
import { ProjectsSection } from './_components/projects-section'
import { SpeciesSection } from './_components/species-section'
import { StoryBlocks } from './_components/story-blocks'
import { ProductsSection } from './_components/products-section'
import { CtaFinal } from './_components/cta-final'

type ProducerDetailsProps = {
  producer: PublicProducer
  showFollowButton?: boolean
  isFollowingProducer?: boolean
}

export function ProducerDetails({
  producer,
}: ProducerDetailsProps) {
  return (
    <div className="bg-[#0B0F15] text-white pb-8">
      {/* 1. Hero immersif */}
      <ProducerHero
        name={producer.name_default}
        tagline={producer.tagline}
        partnerType={producer.partnerType}
        locations={producer.locations}
        images={producer.images}
        visualAssets={producer.visualAssets}
        editorialIdentity={producer.editorialIdentity}
      />

      {/* 2. Mission */}
      <MissionSection pillars={producer.missionPillars} />

      {/* 3. Preuves & crédibilité */}
      <ProofGrid cards={producer.proofCards} />

      {/* 4. Projets — estimation intégrée dans le sous-titre */}
      <ProjectsSection
        projects={producer.projects}
        impactSummary={producer.impactSummary}
      />

      {/* 5. Espèces */}
      <SpeciesSection species={producer.species} />

      {/* 7. Histoire modulaire */}
      <StoryBlocks 
        blocks={producer.storyBlocks} 
      />

      {/* 8. Produits - séparation app vs gamme partenaire */}
      <ProductsSection 
        products={producer.products}
        partnerCatalog={producer.partnerCatalogOverview}
      />

      {/* 9. CTA */}
      <CtaFinal website={producer.contact_website} />
    </div>
  )
}
