'use client'

import { useState } from 'react'
import type { StoryBlock } from '@/app/[locale]/(site)/producers/_features/mock-producers'
import { producerTypography as typo } from './producer-typography'

const BODY_TRUNCATE_THRESHOLD = 120

type StoryBlocksProps = {
  blocks?: StoryBlock[]
  producerName?: string
}

export function StoryBlocks({ blocks, producerName }: StoryBlocksProps) {
  const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(new Set())

  if (!blocks || blocks.length === 0) return null

  const MAX_STORY_BLOCKS = 4
  const visibleBlocks = blocks.slice(0, MAX_STORY_BLOCKS)

  const storySubtitle = producerName
    ? `Quelques repères sur l'histoire ${/^[AEIOUHaeiouÀ-Ö]/i.test(producerName) ? "d'" : 'de '}${producerName}.`
    : "Quelques repères sur l'histoire de ce partenaire."

  function toggleExpand(index: number) {
    setExpandedIndexes((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <section className="px-4">
      <h2 className={typo.sectionTitle}>L&apos;histoire</h2>
      <p className={`mt-1.5 mb-4 ${typo.sectionSubtitle}`}>{storySubtitle}</p>

      <div className="flex flex-col gap-6">
        {visibleBlocks.map((block, index) => {
          const isLong = block.body.length > BODY_TRUNCATE_THRESHOLD
          const isExpanded = expandedIndexes.has(index)

          return (
            <article key={index} className="flex flex-col gap-3">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#1A1F26]">
                <img src={block.imageUrl} alt={block.title} className="h-full w-full object-cover" />
              </div>

              <div>
                <h3 className={typo.cardTitleLarge}>{block.title}</h3>
                <p
                  className={`mt-1.5 text-[14px] leading-relaxed text-white/64 ${!isExpanded && isLong ? 'line-clamp-3' : ''}`}
                >
                  {block.body}
                </p>
                {isLong && (
                  <button
                    type="button"
                    onClick={() => toggleExpand(index)}
                    className="mt-1.5 text-[13px] font-semibold text-white/45 transition-colors hover:text-white/65"
                  >
                    {isExpanded ? 'Réduire' : 'Lire la suite'}
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
