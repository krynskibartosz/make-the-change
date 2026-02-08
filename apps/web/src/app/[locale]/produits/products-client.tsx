'use client'

import { Package, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { LocalizedLink } from '@/components/localized-link'
import { cn } from '@make-the-change/core/shared/utils'
import type { Category, Product } from '@make-the-change/core/schema'

export function ProductsClient({
  initialProducts = [],
  categories = [],
}: {
  initialProducts?: Product[]
  categories?: Category[]
}) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const displayCategories = [{ id: 'all', name_default: 'Tous' }, ...categories]

  useEffect(() => {
    filterProducts()
  }, [initialProducts, selectedCategory, searchTerm])

  const filterProducts = () => {
    let filtered = initialProducts

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => product.category_id === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          (product.name_default || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description_default || '').toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredProducts(filtered)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Nos Produits
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Découvrez notre sélection de produits durables et éthiques, soutenant nos projets
          environnementaux.
        </p>
      </div>

      {/* Category Cards (Only show top 4 real categories) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.slice(0, 4).map((category) => (
          <div
            key={category.id}
            className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedCategory(category.id)}
          >
            <div className="h-48 bg-gradient-to-br from-primary/60 to-accent/80 relative">
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-semibold">{category.name_default}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {displayCategories.map((category) => (
            <button
              key={category.id}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80',
              )}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name_default}
            </button>
          ))}
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="flex-1 sm:w-64 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
          <button className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-semibold mb-2">Aucun produit trouvé</h2>
          <p className="text-muted-foreground max-w-md">
            {searchTerm || selectedCategory !== 'all'
              ? 'Essayez de modifier vos filtres ou votre recherche.'
              : 'Nos produits sont en cours de préparation. Revenez bientôt!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 relative">
                {product.featured && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold">
                    Vedette
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name_default}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.description_default}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    {product.price_eur_equivalent
                      ? `${Number.parseFloat(product.price_eur_equivalent).toFixed(2)}€`
                      : 'Prix sur demande'}
                  </span>
                  <LocalizedLink href={`/produits/${product.slug || product.id}`}>
                    <button className="px-3 py-1 border border-input rounded-md text-sm hover:bg-muted transition-colors">
                      Voir
                    </button>
                  </LocalizedLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
