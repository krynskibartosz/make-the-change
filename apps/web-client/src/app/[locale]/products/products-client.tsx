'use client'

import type { Category, Product } from '@make-the-change/core/schema'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Checkbox,
  Input,
  Separator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@make-the-change/core/ui'
import { Filter, Search, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState, useTransition } from 'react'
import { ProductCard } from '@/features/commerce/products/product-card'
import { usePathname, useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

interface Producer {
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

export function ProductsClient({
  products,
  categories,
  producers,
  initialCategory,
  initialProducer,
  initialSearch,
}: ProductsClientProps) {
  const t = useTranslations('products')
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  
  // State
  const [search, setSearch] = useState(initialSearch)
  const [category, setCategory] = useState(initialCategory)
  const [producer, setProducer] = useState(initialProducer)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [isHeaderHidden, setIsHeaderHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Derived state
  const activeCategoryName = categories.find((cat) => cat.id === category)?.name_default || ''
  const activeProducerName = producers.find((p) => p.id === producer)?.name_default || ''
  
  // Extract unique tags from products for the filter sidebar
  const allTags = Array.from(new Set(products.flatMap((p) => p.tags || []))).sort()
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Scroll handler for hiding header (Nike style)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Threshold for activation (wait until scrolled down a bit)
      if (currentScrollY < 100) {
        setIsHeaderHidden(false)
        setLastScrollY(currentScrollY)
        return
      }

      // Determine direction and magnitude
      const scrollDiff = currentScrollY - lastScrollY
      const scrollUpMagnitude = lastScrollY - currentScrollY

      // INCREASED THRESHOLDS: less jumpy behavior
      if (scrollDiff > 20) {
        // Scrolling DOWN significantly -> Hide
        setIsHeaderHidden(true)
      } else if (scrollUpMagnitude > 60) {
        // Scrolling UP significantly -> Show
        // Increased from 20 to 60 to require a more deliberate scroll up
        setIsHeaderHidden(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Inject styles to hide main header when scrolling down
  useEffect(() => {
    // Target the main site header specifically
    // We assume the header is the first sticky element or <header> tag
    // Since we wrapped it in a div in layout.tsx, let's target the wrapper if possible or just the header
    const header = document.querySelector('header') || document.querySelector('.sticky.top-0') as HTMLElement
    if (header) {
      // Add transition class if missing
      if (!header.classList.contains('transition-transform')) {
         header.classList.add('transition-transform', 'duration-300')
      }

      if (isHeaderHidden) {
        header.style.transform = 'translateY(-100%)'
      } else {
        header.style.transform = 'translateY(0)'
      }
    }
  }, [isHeaderHidden])


  // Filter products client-side for tags (since server only filters by category/search currently)
  const filteredProducts = products.filter(product => {
    if (selectedTags.length > 0) {
      const productTags = product.tags || []
      const hasTag = selectedTags.some(tag => productTags.includes(tag))
      if (!hasTag) return false
    }
    return true
  })

  const updateFilters = (newCategory: string, newProducer: string, newSearch: string) => {
    const params = new URLSearchParams()
    if (newCategory) params.set('category', newCategory)
    if (newProducer) params.set('producer', newProducer)
    if (newSearch) params.set('search', newSearch)

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory)
    updateFilters(newCategory, producer, search)
    setMobileFiltersOpen(false)
  }

  const handleProducerChange = (newProducer: string) => {
    setProducer(newProducer)
    updateFilters(category, newProducer, search)
    setMobileFiltersOpen(false)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters(category, producer, search)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearAllFilters = () => {
    setCategory('')
    setProducer('')
    setSearch('')
    setSelectedTags([])
    updateFilters('', '', '')
    setMobileFiltersOpen(false)
  }

  // Sidebar Component (Reusable for Desktop & Mobile Sheet)
  const FilterSidebar = () => (
    <div className="space-y-8">
      {/* Search */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">Recherche</h3>
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('filter.search_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </form>
      </div>

      <Separator />

      {/* Categories */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">Catégories</h3>
          {category && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleCategoryChange('')}
              className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
            >
              Effacer
            </Button>
          )}
        </div>
        <div className="space-y-1">
          <button
            onClick={() => handleCategoryChange('')}
            className={cn(
              "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
              category === '' 
                ? "bg-primary/10 font-medium text-primary" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <span>{t('filter.all')}</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
                category === cat.id 
                  ? "bg-primary/10 font-medium text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span>{cat.name_default}</span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Producers / Partners */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">Partenaires</h3>
          {producer && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleProducerChange('')}
              className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
            >
              Effacer
            </Button>
          )}
        </div>
        <div className="space-y-1">
          <button
            onClick={() => handleProducerChange('')}
            className={cn(
              "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
              producer === '' 
                ? "bg-primary/10 font-medium text-primary" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <span>Tous</span>
          </button>
          {producers.map((prod) => (
            <button
              key={prod.id}
              onClick={() => handleProducerChange(prod.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
                producer === prod.id 
                  ? "bg-primary/10 font-medium text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span>{prod.name_default}</span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Tags (Collapsible) */}
      {allTags.length > 0 && (
        <Accordion type="single" collapsible defaultValue="tags">
          <AccordionItem value="tags" className="border-none">
            <AccordionTrigger className="py-0 text-sm font-medium tracking-wide text-muted-foreground uppercase hover:no-underline">
              Filtres
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="space-y-3">
                {allTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`tag-${tag}`} 
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => toggleTag(tag)}
                    />
                    <label
                      htmlFor={`tag-${tag}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {tag}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  )

  return (
    <div className="flex flex-col lg:flex-row lg:gap-10 pb-20 relative">
      
      {/* Mobile Search Bar (Moved to main view as requested) */}
      <div className="lg:hidden mb-4 px-1">
         <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('filter.search_placeholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary/30 border-none h-11 rounded-xl"
            />
          </form>
      </div>

      {/* Mobile Header & Filters */}
      <div 
        className={cn(
          "lg:hidden mb-6 space-y-4 sticky z-40 bg-background/95 backdrop-blur py-2 -mx-4 px-4 border-b transition-all duration-300",
          // FIXED: Use top-0 when header hidden, otherwise 64px (approx header height).
          // If the gap was too big, 64px might be too much if the header is smaller or scrolls partially.
          // Let's ensure smooth transition.
          isHeaderHidden ? "top-0" : "top-0" // Always top-0 now since main header is hidden on mobile
        )}
      >
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            variant={category === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryChange('')}
            className="rounded-full px-4"
          >
            Tous
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={category === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange(cat.id)}
              className="rounded-full px-4 whitespace-nowrap"
            >
              {cat.name_default}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {filteredProducts.length} produits
          </span>
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtres
                {(selectedTags.length > 0) && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {selectedTags.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="mb-6 text-left">
                <SheetTitle>Filtres</SheetTitle>
              </SheetHeader>
              <FilterSidebar />
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
                <Button className="w-full" onClick={() => setMobileFiltersOpen(false)}>
                  Voir les resultats
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar (Sticky) */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div 
          className={cn(
            "sticky max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 scrollbar-thin transition-all duration-300",
            isHeaderHidden ? "top-24" : "top-32" 
          )}
        >
           <FilterSidebar />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-h-[100vh]">
        {/* Desktop Header */}
        <div 
          className={cn(
            "hidden lg:flex items-center justify-between mb-8 sticky bg-background/95 backdrop-blur z-30 py-4 border-b transition-all duration-300",
            isHeaderHidden ? "top-0" : "top-[64px]"
          )}
        >
          <h2 className="text-2xl font-bold tracking-tight">
            {activeCategoryName 
              ? (activeProducerName ? `${activeCategoryName} - ${activeProducerName}` : activeCategoryName)
              : (activeProducerName || t('filter.all'))
            }
          </h2>
          <span className="text-muted-foreground">
            {filteredProducts.length} résultats
          </span>
        </div>

        {/* Active Filters Display */}
        {(selectedTags.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {/* Search badge removed from here since search is visible above on mobile */}
            {selectedTags.map(tag => (
              <Badge key={tag} variant="secondary" className="gap-1 pl-2 pr-1 py-1">
                {tag}
                <button onClick={() => toggleTag(tag)} className="ml-1 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-7 text-xs">
              Tout effacer
            </Button>
          </div>
        )}

        {/* Product Grid */}
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10", isPending && "opacity-60")}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-muted-foreground">Aucun produit ne correspond à vos critères.</p>
              <Button variant="link" onClick={clearAllFilters} className="mt-2">
                Effacer les filtres
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
