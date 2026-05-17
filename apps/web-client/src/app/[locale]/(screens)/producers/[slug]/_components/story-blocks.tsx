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
  producerName: string
}

export function StoryBlocks({ blocks, producerName }: StoryBlocksProps) {
  if (!blocks || blocks.length === 0) return null

  return (
    <section className="mt-12 px-5">
      <h2 className="mb-6 text-lg font-bold text-white/90">
        L&apos;histoire de {producerName}
      </h2>
      
      <div className="flex flex-col gap-8">
        {blocks.map((block, index) => (
          <article 
            key={index}
            className="flex flex-col gap-4"
          >
            {/* Image 16/9 */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#1A1F26]">
              <img 
                src={block.imageUrl} 
                alt={block.title}
                className="h-full w-full object-cover"
              />
            </div>
            
            {/* Texte */}
            <div>
              <h3 className="text-[17px] font-bold text-white leading-snug">
                {block.title}
              </h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-white/60">
                {block.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
