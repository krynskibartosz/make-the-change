import { Star } from 'lucide-react'
import {
  MOCK_PRODUCT_LITCHI_140G_ID,
  MOCK_PRODUCT_LITCHI_ID,
  MOCK_PRODUCT_SAVON_DOUX_ID,
  MOCK_PRODUCT_SHAMPOING_ID,
} from '@/lib/mock/mock-ids'

type Review = {
  id: string
  author: string
  date: string
  rating: number
  text: string
  source: string
}

const LITCHI_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Ca V. S.',
    date: 'Mars 2024',
    rating: 5,
    text: 'Je me suis lancée dans cette découverte et… une merveille ! Parfum les infusions, ou tout simplement à la cuillère. Différent des miels habituels.',
    source: 'Amazon',
  },
  {
    id: '2',
    author: 'Aurore H.',
    date: 'Février 2025',
    rating: 5,
    text: 'Je l’utilise dans le cadre de soins du visage et du corps au naturel avec de l’arôme au litchi et il est juste parfait ! Mes clientes adorent.',
    source: 'Amazon',
  },
  {
    id: '3',
    author: 'Jean-Michel G.',
    date: 'Septembre 2023',
    rating: 5,
    text: 'Au petit déjeuner, c’est juste merveilleux !',
    source: 'Amazon',
  },
]

const PRODUCT_REVIEWS: Record<string, Review[]> = {
  [MOCK_PRODUCT_SAVON_DOUX_ID]: [
    {
      id: '1',
      author: 'Fanny',
      date: 'Mars 2026',
      rating: 5,
      text: 'Ce savon naturel, sans parfum que celui de la cire d’abeille et de l’huile d’olive, est mon préféré : il laisse la peau fraîche et douce, sans la désécher.',
      source: 'Sebio',
    },
  ],
  [MOCK_PRODUCT_SHAMPOING_ID]: [
    {
      id: '1',
      author: 'Marie-Noëlle D.',
      date: 'Octobre 2025',
      rating: 5,
      text: 'Le meilleur shampoing solide parmi tous ceux que j’ai essayé : mousse abondante, cheveux superbes après usage, très économique.',
      source: 'Sebio',
    },
    {
      id: '2',
      author: 'Laurence L.',
      date: 'Juin 2025',
      rating: 5,
      text: 'J’ai eu beaucoup de mal à trouver un shampoing solide qui convienne à toute la famille. Le shampoing Habeebee est désormais notre chouchou. Il mousse très facilement et le cheveu est propre et doux en un seul shampoing.',
      source: 'Sebio',
    },
    {
      id: '3',
      author: 'Anonyme',
      date: 'Février 2026',
      rating: 5,
      text: 'Ce shampoing solide est parfait. Il mousse vraiment bien (ce qui est rare pour du naturel), ne laisse aucun dépôt sur le cheveu et dure très longtemps. C’est un vrai geste pour la planète sans sacrifier le plaisir d’un bon lavage.',
      source: 'Sebio',
    },
  ],
  [MOCK_PRODUCT_LITCHI_ID]: LITCHI_REVIEWS,
  [MOCK_PRODUCT_LITCHI_140G_ID]: LITCHI_REVIEWS,
}

export function ProductReviews({ productId }: { productId: string }) {
  const reviews = PRODUCT_REVIEWS[productId] ?? []

  if (reviews.length === 0) return null

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  const avgFormatted = avg.toFixed(1).replace('.', ',')

  return (
    <div className="px-4 pt-8">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-base font-black text-white">Avis</h2>
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-black text-lime-300">{avgFormatted}</span>
          <span className="text-[11px] text-white/40">/ 5 · {reviews.length} avis</span>
        </div>
      </div>
      <div className="space-y-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[12px] font-bold text-white/80">{review.author}</p>
                <p className="mt-0.5 text-[11px] text-white/35">
                  {review.date} · {review.source}
                </p>
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
