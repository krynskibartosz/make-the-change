'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Section Histoire Modulaire
 * 
 * Remplace le "mur de texte" par 4-6 blocs narratifs:
 * - Image 16/9
 * - Titre
 * - 2 lignes max
 * 
 * Rythme vertical avec respiration.
 * Apple-like segmentation.
 */

import type { StoryBlock } from '@/app/[locale]/(site)/producers/_features/mock-producers'

type StoryBlocksProps = {
  blocks?: StoryBlock[]
  producerName?: string
}

export function StoryBlocks({ blocks, producerName }: StoryBlocksProps) {
  if (!blocks || blocks.length === 0) return null

  const visibleBlocks = blocks.slice(0, 4)

  const storySubtitle = producerName
    ? `Quelques repères sur l'histoire ${/^[AEIOUHaeiouÀ-Ö]/i.test(producerName) ? "d'" : "de "}${producerName}.`
    : "Quelques repères sur l'histoire de ce partenaire."

  return (
    <section className="mt-10 px-4">
      <h2 className="text-[17px] font-bold text-white/80">
        L&apos;histoire
      </h2>
      <p className="mt-1 mb-4 text-[13px] text-white/50">
        {storySubtitle}
      </p>

      <div className="flex flex-col gap-6">
        {visibleBlocks.map((block, index) => (
          <article 
            key={index}
            className="flex flex-col gap-3"
          >
            {/* Image 16/9 plus compacte */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#1A1F26]">
              <img 
                src={block.imageUrl} 
                alt={block.title}
                className="h-full w-full object-cover"
              />
            </div>
            
            {/* Texte condensé */}
            <div>
              <h3 className="text-[16px] font-bold text-white leading-tight">
                {block.title}
              </h3>
              <p className="mt-1 text-[14px] leading-snug text-white/60 line-clamp-3">
                {block.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
