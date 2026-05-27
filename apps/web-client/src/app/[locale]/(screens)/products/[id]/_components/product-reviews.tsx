import { Star } from 'lucide-react'

const MOCK_REVIEWS = [
  {
    id: '1',
    author: 'Sophie M.',
    date: 'Avril 2026',
    rating: 5,
    text: 'Excellente qualité, je suis vraiment satisfaite. La traçabilité et l’origine sont bien expliquées.',
  },
  {
    id: '2',
    author: 'Julien D.',
    date: 'Mars 2026',
    rating: 5,
    text: 'Livraison rapide et produit conforme à la description. Je recommande sans hésiter.',
  },
  {
    id: '3',
    author: 'Amandine R.',
    date: 'Février 2026',
    rating: 4,
    text: 'Très beau produit, parfait pour offrir. Le lien avec le producteur est un vrai plus.',
  },
]

export function ProductReviews() {
  return (
    <div className="px-4 pt-8">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-base font-black text-white">Avis</h2>
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-black text-lime-300">4,8</span>
          <span className="text-[11px] text-white/40">/ 5 · 12 avis</span>
        </div>
      </div>
      <div className="space-y-3">
        {MOCK_REVIEWS.map((review) => (
          <div
            key={review.id}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[12px] font-bold text-white/80">{review.author}</p>
                <p className="mt-0.5 text-[11px] text-white/35">{review.date}</p>
              </div>
              <span
                className="flex shrink-0 items-center gap-0.5"
                role="img"
                aria-label={`${review.rating} étoiles sur 5`}
              >
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-lime-300 text-lime-300" aria-hidden="true" />
                ))}
              </span>
            </div>
            <p className="mt-2 text-[13px] font-medium leading-relaxed text-white/60">
              {review.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
