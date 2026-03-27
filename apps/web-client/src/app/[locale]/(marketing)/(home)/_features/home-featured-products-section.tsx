'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { MarketingSection } from '@/app/[locale]/(marketing)/_features/marketing-section'
import type { ProductCardProduct } from '@/app/[locale]/(marketing)/products/_features/product-card'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'

type HomeFeaturedProductsSectionProps = {
  title: string
  viewAllLabel: string
  discoverLabel: string
  pointsLabel: string
  products: ProductCardProduct[]
  variant?: 'default' | 'muted'
}

const pointsFormatter = new Intl.NumberFormat('fr-FR')

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0 },
}

export const HomeFeaturedProductsSection = ({
  title,
  viewAllLabel,
  discoverLabel,
  pointsLabel,
  products,
  variant = 'default',
}: HomeFeaturedProductsSectionProps) => {
  const visibleProducts = products.filter((product) => (product.stock_quantity || 0) > 0)

  return (
    <MarketingSection title={title} variant="muted" size="lg">
      <motion.ul
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
        className="m-0 flex list-none gap-4 overflow-x-auto p-0 px-6 pb-2 snap-x snap-mandatory scrollbar-hide"
      >
        {visibleProducts.map((product) => {
          const titleValue = product.name_default || 'Produit'
          const imageSrc =
            sanitizeImageUrl(product.images[0]) ||
            'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80'
          const points = pointsFormatter.format(product.price_points || 0)

          return (
            <motion.li key={product.id} variants={itemVariants} className="w-[85%] shrink-0 sm:w-[70%] lg:w-[32%]">
              <Link
                href={product.slug ? `/products/${product.slug}` : `/products/${product.id}`}
                className="group flex h-full min-h-[430px] snap-start flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:border-border/80 dark:shadow-none"
              >
                <div className="relative flex h-48 w-full overflow-hidden rounded-t-3xl border-b border-border/50">
                  <img
                    src={imageSrc}
                    alt={titleValue}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="flex flex-col flex-grow p-5">
                  <h3 className="min-h-[3.5rem] line-clamp-2 text-left text-lg font-bold text-foreground">
                    {titleValue}
                  </h3>

                  <div className="mt-3 mb-auto flex flex-wrap gap-2">
                    {product.tags && product.tags.length > 0 ? (
                      product.tags.slice(0, 2).map((tag, i) => (
                        <span
                          key={tag}
                          className={
                            i === 0
                              ? 'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground'
                              : 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border-lime-200 bg-lime-100 text-lime-700 dark:border-lime-500/20 dark:bg-lime-900/30 dark:text-lime-400'
                          }
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <>
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground">
                          Artisan local
                        </span>
                        {product.stock_quantity && product.stock_quantity < 20 && (
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-500/20 dark:bg-orange-900/30 dark:text-orange-400">
                            Stock limité
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  <div className="mt-auto flex flex-col gap-3 w-full border-t border-black/5 pt-4 dark:border-white/10">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black leading-none text-lime-600 dark:text-lime-400 tabular-nums">
                        {points}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {pointsLabel}
                      </span>
                    </div>

                    <span className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-colors group-hover:bg-primary/90">
                      {discoverLabel}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.li>
          )
        })}

        <motion.li variants={itemVariants} className="w-[85%] shrink-0 snap-center sm:w-[70%] lg:w-[32%]">
          <Link
            href="/products"
            className="group flex h-full min-h-[430px] flex-col items-center justify-center rounded-3xl border-2 border-dashed p-6 text-center transition-all duration-200 active:scale-95
              border-lime-300 bg-lime-50/50 text-lime-800 hover:bg-lime-100 active:bg-lime-200
              dark:border-lime-500/50 dark:bg-lime-900/10 dark:text-foreground dark:hover:bg-lime-900/20 dark:active:bg-lime-900/30"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full transition-transform group-hover:translate-x-2
              bg-lime-200 text-lime-700
              dark:bg-lime-500/20 dark:text-lime-500">
              <ArrowRight size={28} />
            </div>
            <span className="text-center text-lg font-bold">
              {viewAllLabel}
            </span>
          </Link>
        </motion.li>
      </motion.ul>
    </MarketingSection>
  )
}

