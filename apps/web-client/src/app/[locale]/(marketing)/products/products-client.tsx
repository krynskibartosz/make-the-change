'use client'

import { Search, Package, Building2, Folder, ArrowUpDown, Tag, Filter, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { type FC, useMemo, useState, useEffect } from 'react'

import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DataList,
  DataCard,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Checkbox,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@make-the-change/core/ui'

export interface Product {
  id: string
  name_default: string
  description_default?: string
  price?: number
  price_points?: number
  featured?: boolean
  category_id?: string
  producer_id?: string
  image_url?: string
  tags?: string[]
  created_at: string
}

export interface Category {
  id: string
  name_default: string
}

export interface Producer {
  id: string
  name_default: string
}

interface ProductsClientProps {
  products: Product[]
  categories: Category[]
  producers: Producer[]
  initialCategory: string
  initialProducer: string
  initialSearch: string
}

type SelectOption = { value: string; label: string }

const createSelectOptions = <T extends { id: string; name_default: string }>(
  items: T[] | undefined,
  allLabel: string,
): SelectOption[] => [
  { value: '', label: allLabel },
  ...(items?.map((item) => ({ value: item.id, label: item.name_default })) || []),
]

const getSortOptions = (t: (key: string) => string): SelectOption[] => [
  { value: 'featured_first', label: t('products.sort.featured') },
  { value: 'name_asc', label: t('products.sort.name_asc') },
  { value: 'name_desc', label: t('products.sort.name_desc') },
  { value: 'price_asc', label: t('products.sort.price_asc') },
  { value: 'price_desc', label: t('products.sort.price_desc') },
]

export const ProductsClient: FC<ProductsClientProps> = ({
  products,
  categories,
  producers,
  initialCategory,
  initialProducer,
  initialSearch,
}) => {
  const t = useTranslations()

  const [search, setSearch] = useState(initialSearch)
  const [category, setCategory] = useState(initialCategory)
  const [producer, setProducer] = useState(initialProducer)
  const [tag, setTag] = useState('')
  const [sort, setSort] = useState('featured_first')

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    if (search.length >= 2) {
      filtered = filtered.filter((product) =>
        product.name_default.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category) {
      filtered = filtered.filter((product) => product.category_id === category)
    }

    if (producer) {
      filtered = filtered.filter((product) => product.producer_id === producer)
    }

    if (tag) {
      filtered = filtered.filter((product) => product.tags?.includes(tag))
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sort) {
        case 'featured_first':
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'name_asc':
          return a.name_default.localeCompare(b.name_default)
        case 'name_desc':
          return b.name_default.localeCompare(a.name_default)
        case 'price_asc':
          return (a.price || 0) - (b.price || 0)
        case 'price_desc':
          return (b.price || 0) - (a.price || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [products, search, category, producer, sort])

  const producerOptions = useMemo(
    () => createSelectOptions(producers, t('products.filters.all_producers')),
    [producers, t],
  )

  const categoryOptions = useMemo(
    () => createSelectOptions(categories, t('products.filters.all_categories')),
    [categories, t],
  )

  const sortOptions = useMemo(() => getSortOptions(t), [t])

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    products.forEach((p) => p.tags?.forEach((t) => tags.add(t)))
    return Array.from(tags).sort()
  }, [products])

  const tagOptions = useMemo(
    () => [
      { value: '', label: t('products.filters.all_tags') },
      ...allTags.map((tag) => ({ value: tag, label: tag })),
    ],
    [allTags, t],
  )

  const resetFilters = () => {
    setSearch('')
    setCategory('')
    setProducer('')
    setTag('')
    setSort('featured_first')
  }

  const isFilterActive = !!(
    search ||
    category ||
    producer ||
    tag ||
    sort !== 'featured_first'
  )

  const ProductCard: FC<{ product: Product }> = ({ product }) => (
    <DataCard
      href={`/products/${product.id}`}
      // Removed image prop to avoid double rendering by DataCard internals
      // image={product.image_url}
      // imageAlt={product.name_default}
    >
      {/* Custom Image Display */}
      <div className="relative aspect-square w-full mb-4 overflow-hidden rounded-lg bg-muted">
        <style jsx>{`
          .image-failed::after {
            content: '';
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: hsl(var(--muted));
          }
          .image-failed::before {
            content: '📦';
            position: absolute;
            font-size: 3rem;
            opacity: 0.2;
            z-index: 1;
          }
        `}</style>
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name_default}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              // Show fallback by adding a class to parent
              const parent = target.parentElement;
              if (parent) {
                parent.classList.add('image-failed');
              }
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <Package className="h-12 w-12 text-muted-foreground/20" />
          </div>
        )}
      </div>

      <DataCard.Header className="mb-2">
        <DataCard.Title>{product.name_default}</DataCard.Title>
      </DataCard.Header>
      <DataCard.Content>
        {product.description_default && (
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {product.description_default}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex flex-col gap-1">
            {product.price_points && (
              <span className="text-primary font-bold text-lg">
                {product.price_points} points
              </span>
            )}
            {product.price && product.price > 0 && (
              <span className="text-muted-foreground text-sm">
                €{product.price.toFixed(2)}
              </span>
            )}
          </div>
          {product.featured && (
            <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium">
              {t('products.featured')}
            </span>
          )}
        </div>
      </DataCard.Content>
    </DataCard>
  )

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{t('common.filter')}</h3>
        {isFilterActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-auto px-2 text-muted-foreground hover:text-foreground"
          >
            {t('products.filters.clear_filters')}
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={['categories', 'producers', 'tags']} className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger className="text-sm font-medium">
            {t('products.filters.all_categories')}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {categoryOptions.filter(o => o.value).map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <Checkbox
                    id={`cat-${option.value}`}
                    checked={category === option.value}
                    onCheckedChange={(checked) => setCategory(checked ? option.value : '')}
                  />
                  <label
                    htmlFor={`cat-${option.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="producers">
          <AccordionTrigger className="text-sm font-medium">
            {t('products.filters.all_producers')}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {producerOptions.filter(o => o.value).map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <Checkbox
                    id={`prod-${option.value}`}
                    checked={producer === option.value}
                    onCheckedChange={(checked) => setProducer(checked ? option.value : '')}
                  />
                  <label
                    htmlFor={`prod-${option.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tags">
          <AccordionTrigger className="text-sm font-medium">
            {t('products.filters.all_tags')}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {tagOptions.filter(o => o.value).map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <Checkbox
                    id={`tag-${option.value}`}
                    checked={tag === option.value}
                    onCheckedChange={(checked) => setTag(checked ? option.value : '')}
                  />
                  <label
                    htmlFor={`tag-${option.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-20">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <FilterSidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            {/* Mobile Filter Sheet */}
            <Sheet>
              <SheetTrigger>
                <div className="inline-flex lg:hidden">
                  <div className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                    <Filter className="h-4 w-4" />
                    {t('common.filter')}
                  </div>
                </div>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>{t('common.filter')}</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="text-sm text-muted-foreground hidden sm:block">
              {filteredProducts.length} {t('products.product_list')}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-[300px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9 bg-background"
                placeholder={t('products.search_placeholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Select
              value={sort}
              onValueChange={(value) => setSort(value || 'featured_first')}
            >
              <SelectTrigger className="w-[160px] bg-background">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder={t('products.filters.sort_by')} />
                </div>
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products List */}
        <DataList
          isLoading={false}
          items={filteredProducts}
          getItemKey={(product) => product.id}
          gridCols={4 as const}
          emptyState={{
            icon: Package,
            title: t('products.empty_state.title'),
            description: t('products.empty_state.description'),
            action: isFilterActive ? (
              <Button size="sm" variant="outline" onClick={resetFilters}>
                {t('products.filters.clear_filters')}
              </Button>
            ) : undefined,
          }}
          renderItem={(product: Product) => <ProductCard product={product} />}
          renderSkeleton={() => (
            <DataCard>
              <div className="aspect-square w-full bg-muted animate-pulse rounded-lg mb-4" />
              <DataCard.Header>
                <DataCard.Title>
                  <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
                </DataCard.Title>
              </DataCard.Header>
              <DataCard.Content>
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                </div>
              </DataCard.Content>
            </DataCard>
          )}
        />
      </div>
    </div>
  )
}

export default ProductsClient
