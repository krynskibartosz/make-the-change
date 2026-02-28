import { Badge, Button, Card, CardContent } from '@make-the-change/core/ui'
import { ProducerProduct } from '@/types/context'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

interface ProjectProducerProductsSectionProps {
  products: ProducerProduct[] | null
}

export function ProjectProducerProductsSection({ products }: ProjectProducerProductsSectionProps) {
  if (!products || products.length === 0) return null

  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <div className="h-10 w-1 rounded-full bg-primary" />
        <h2 className="text-3xl font-black tracking-tight">Produits du Producteur</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: ProducerProduct }) {
  return (
    <Card className="rounded-2xl border-border/50 bg-background/50 hover:bg-background/80 transition-all">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-xl bg-muted overflow-hidden flex-shrink-0">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-2xl">📦</div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            {product.impactPercentage}% reversés
          </Badge>
          <span className="font-bold text-lg">{formatCurrency(product.price)}</span>
        </div>
        
        <Link href={`/products/${product.id}`}>
          <Button className="w-full" variant="outline">
            Voir le produit →
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
