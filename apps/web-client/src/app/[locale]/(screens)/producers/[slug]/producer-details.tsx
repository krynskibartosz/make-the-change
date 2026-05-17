'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Page producteur - Architecture éditoriale premium
 * 
 * Structure:
 * 1. Hero immersif (double localisation)
 * 2. Mission (pourquoi ils existent)
 * 3. Preuves (crédibilité terrain)
 * 4. Impact (estimation prudente)
 * 5. Projets (actions terrain)
 * 6. Espèces (lien biodiversité)
 * 7. Histoire (modulaire)
 * 8. Produits (conséquence naturelle)
 * 9. CTA (engagement)
 * 
 * Mobile-first, storytelling, preuves, rythme.
 */

import type { PublicProducer } from './producer-detail-data'
import { ProducerHero } from './_components/producer-hero'
import { MissionSection } from './_components/mission-section'
import { ProofGrid } from './_components/proof-grid'
import { ImpactSummarySection } from './_components/impact-summary'
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

      {/* 4. Impact (estimation prudente) */}
      <ImpactSummarySection summary={producer.impactSummary} />

      {/* 5. Projets */}
      <ProjectsSection projects={producer.projects} />

      {/* 6. Espèces */}
      <SpeciesSection species={producer.species} />

      {/* 7. Histoire modulaire */}
      <StoryBlocks 
        blocks={producer.storyBlocks} 
        producerName={producer.name_default} 
      />

      {/* 8. Produits */}
      <ProductsSection 
        products={producer.products}
        producerFieldLocation={producer.locations?.field}
      />

      {/* 9. CTA */}
      <CtaFinal website={producer.contact_website} />
    </div>
  )
}
