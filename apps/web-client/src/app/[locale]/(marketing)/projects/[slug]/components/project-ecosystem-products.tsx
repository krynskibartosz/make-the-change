type ProjectEcosystemProductsProps = {
  tags: string[]
}

type EcosystemProduct = {
  id: string
  title: string
  subtitle: string
  price: string
  graines: number
  emoji: string
}

const BEEHIVE_PRODUCTS: EcosystemProduct[] = [
  {
    id: 'honey-wild',
    title: "Miel Sauvage d'Antsirabe",
    subtitle: 'Récolte locale de la coopérative',
    price: '15,00 €',
    graines: 50,
    emoji: '🍯',
  },
  {
    id: 'pollen-bio',
    title: 'Pollen Bio',
    subtitle: 'Soutenez-les autrement',
    price: '12,50 €',
    graines: 35,
    emoji: '🌼',
  },
  {
    id: 'propolis',
    title: 'Propolis Pure',
    subtitle: 'Produit artisanal de la ruche',
    price: '18,00 €',
    graines: 60,
    emoji: '🐝',
  },
]

const PRODUCTS_BY_TAG: Record<string, EcosystemProduct[]> = {
  beehive: BEEHIVE_PRODUCTS,
  olive_tree: [
    {
      id: 'olive-oil',
      title: "Huile d'Olive Vierge",
      subtitle: 'Récolte & savoir-faire local',
      price: '19,00 €',
      graines: 55,
      emoji: '🫒',
    },
    {
      id: 'olive-tapenade',
      title: 'Tapenade Maison',
      subtitle: 'Issu de ce projet',
      price: '9,50 €',
      graines: 25,
      emoji: '🥖',
    },
    {
      id: 'olive-soap',
      title: "Savon à l'Olive",
      subtitle: 'Soutien direct à la filière',
      price: '7,00 €',
      graines: 20,
      emoji: '🧼',
    },
  ],
  vineyard: [
    {
      id: 'grape-juice',
      title: 'Jus de Raisin Naturel',
      subtitle: 'Transformation locale',
      price: '11,00 €',
      graines: 30,
      emoji: '🍇',
    },
    {
      id: 'vinegar',
      title: 'Vinaigre de Raisin',
      subtitle: "L'écosystème du projet",
      price: '13,00 €',
      graines: 40,
      emoji: '🍷',
    },
    {
      id: 'raisins-dried',
      title: 'Raisins Séchés',
      subtitle: 'Récoltes & Produits',
      price: '8,50 €',
      graines: 22,
      emoji: '☀️',
    },
  ],
}

const DEFAULT_PRODUCTS: EcosystemProduct[] = BEEHIVE_PRODUCTS

const pickProductsFromTags = (tags: string[]): EcosystemProduct[] => {
  const normalized = tags.map((tag) => tag.toLowerCase())
  for (const tag of normalized) {
    const products = PRODUCTS_BY_TAG[tag]
    if (products) return products
  }
  return DEFAULT_PRODUCTS
}

export function ProjectEcosystemProducts({ tags }: ProjectEcosystemProductsProps) {
  const products = pickProductsFromTags(tags).slice(0, 3)

  return (
    <section>
      <h3 className="text-xl font-bold text-white mb-4 px-4">Issu de ce projet</h3>

      <div className="flex overflow-x-scroll overflow-y-hidden snap-x snap-mandatory scrollbar-hide gap-4 px-4 pb-4 pr-10 touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <article
            key={product.id}
            className="min-w-[200px] w-[200px] shrink-0 snap-start bg-white/5 border border-white/5 rounded-2xl overflow-hidden flex flex-col"
          >
            <div className="h-32 bg-[#1a1f18] relative flex items-center justify-center">
              <span className="text-5xl leading-none" aria-hidden="true">
                {product.emoji}
              </span>
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-[10px] text-lime-400 font-bold px-2 py-1 rounded-full">
                + {product.graines} Graines
              </div>
            </div>

            <div className="p-3">
              <p className="text-sm font-bold text-white truncate">{product.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{product.subtitle}</p>
              <p className="text-lime-400 font-black text-sm mt-3 tabular-nums">{product.price}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
