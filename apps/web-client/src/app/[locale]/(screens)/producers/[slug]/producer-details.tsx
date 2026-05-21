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

import { CtaFinal } from './_components/cta-final'
import { MissionSection } from './_components/mission-section'
import { ProducerHero } from './_components/producer-hero'
import { ProductsSection } from './_components/products-section'
import { ProjectsSection } from './_components/projects-section'
import { ProofGrid } from './_components/proof-grid'
import { SpeciesSection } from './_components/species-section'
import { StoryBlocks } from './_components/story-blocks'
import type { PublicProducer } from './producer-detail-data'

type ProducerDetailsProps = {
  producer: PublicProducer
}

export function ProducerDetails({ producer }: ProducerDetailsProps) {
  const firstCertif = producer.proofCards?.find((c) => c.proofType === 'certification')
  const certifName = firstCertif?.label.replace(/^Certification\s+/i, '')
  const trustLine = producer.editorialIdentity?.foundedYear
    ? `Depuis ${producer.editorialIdentity.foundedYear}${certifName ? ` • ${certifName}` : ''}`
    : undefined

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
        trustLine={trustLine}
      />

      <div className="mt-6">
        {/* 2. Mission */}
        <MissionSection
          pillars={producer.missionPillars}
          subtitle={producer.editorialIdentity?.missionIntro}
        />

        {/* 3. Preuves & crédibilité */}
        <div className="mt-10">
          <ProofGrid cards={producer.proofCards} />
        </div>

        {/* 4. Projets — estimation intégrée dans le sous-titre */}
        <div className="mt-16">
          <ProjectsSection
            projects={producer.projects}
            impactSummary={producer.impactSummary}
            producerName={producer.editorialIdentity?.shortName || producer.name_default}
          />
        </div>

        {/* 5. Espèces */}
        <div className="mt-16">
          <SpeciesSection
            species={producer.species}
            subtitle={
              producer.editorialIdentity?.speciesSubtitle ??
              `Espèces et milieux associés aux projets portés par ${producer.editorialIdentity?.shortName || producer.name_default}.`
            }
          />
        </div>

        {/* 6. Histoire modulaire */}
        <div className="mt-20">
          <StoryBlocks
            blocks={producer.storyBlocks}
            producerName={producer.editorialIdentity?.shortName || producer.name_default}
          />
        </div>

        {/* 7. Produits - filières puis produits app */}
        <div className="mt-20">
          <ProductsSection
            products={producer.products}
            partnerCatalog={producer.partnerCatalogOverview}
          />
        </div>

        {/* 8. CTA */}
        <div className="mt-20">
          <CtaFinal
            website={producer.contact_website}
            contextText={
              producer.editorialIdentity?.shortName
                ? `Explorez les projets documentés liés à ${producer.editorialIdentity.shortName} dans l'app.`
                : producer.tagline
            }
            internalHref="/projects"
            partnerName={producer.editorialIdentity?.shortName || producer.name_default}
          />
        </div>
      </div>
    </div>
  )
}
