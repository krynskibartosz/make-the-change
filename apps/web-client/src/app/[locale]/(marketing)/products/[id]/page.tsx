import { Badge, Button, Card, CardContent } from '@make-the-change/core/ui'
import { ArrowLeft, Package, Share2, Building2, Sparkles, Leaf, Globe, Star, ShoppingCart, Award, Clock } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/ui/page-hero'
import { SectionContainer } from '@/components/ui/section-container'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import { FloatingActionButtons } from './floating-action-buttons'

interface ProductDetailPageProps {
  params: Promise<{
    id: string
    locale: string
  }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params
  const t = await getTranslations('products')
  const supabase = await createClient()

  const { data: productData, error } = await (supabase as any)
    .from('public_products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error || !productData) {
    console.error('Error fetching product:', error)
    notFound()
  }

  // Fetch related data in parallel
  const [producerResult, categoryResult] = await Promise.all([
    productData.producer_id 
      ? supabase.from('producers').select('*').eq('id', productData.producer_id).single() 
      : Promise.resolve({ data: null }),
    productData.category_id 
      ? supabase.from('categories').select('*').eq('id', productData.category_id).single() 
      : Promise.resolve({ data: null })
  ])

  const product = {
    ...productData,
    producer: producerResult.data,
    category: categoryResult.data
  }

  // Determine cover image using image_url from public_products view
  const coverImage = (product as any).image_url || (
    (product as any).images && 
    Array.isArray((product as any).images) && 
    (product as any).images.length > 0 ? 
    (product as any).images[0] : 
    undefined
  )
  const producerImage = product.producer?.images && Array.isArray(product.producer.images) && product.producer.images.length > 0 ? product.producer.images[0] : undefined
  
  // Calculate price display
  const displayPoints = product.price_points || 0
  const displayPrice = displayPoints > 0 ? displayPoints / 100 : 0
  
  // Stock status
  const inStock = (product.stock_quantity || 0) > 0
  const stockStatus = inStock 
    ? `${product.stock_quantity || 0} disponibles` 
    : 'Rupture de stock'

  return (
    <>
      {/* Modern Hero Section - 2026 Style */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 min-h-[90vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] h-[800px] w-[800px] rounded-full bg-primary/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-3000" />
          <div className="absolute bottom-[-20%] right-[-10%] h-[800px] w-[800px] rounded-full bg-emerald-400/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-5000 delay-1000" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-100 text-foreground/20 mask-image-gradient" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            {/* Content Column */}
            <div className="space-y-8 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm">
                <Sparkles className="h-4 w-4" />
                <span className="uppercase tracking-widest text-xs font-bold">Produit Authentique</span>
              </div>
              
              <h1 className={`
                font-black tracking-tighter mb-8 text-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 drop-shadow-sm
                ${product.name_default.length > 40 
                  ? 'text-4xl sm:text-5xl lg:text-6xl' 
                  : product.name_default.length > 25 
                    ? 'text-5xl sm:text-6xl lg:text-7xl' 
                    : 'text-6xl sm:text-7xl lg:text-8xl'
                }
              `}>
                {product.name_default}
              </h1>
              
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 max-w-xl">
                {product.description_default}
              </p>

              {/* Product Meta Info */}
              <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                {product.category && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="font-medium">{product.category?.name_default || ''}</span>
                  </div>
                )}
                {product.producer && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span className="font-medium">{product.producer?.name_default || ''}</span>
                  </div>
                )}
                {product.featured && (
                  <Badge className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none">
                    <Star className="h-3 w-3 mr-1" />
                    {t('featured')}
                  </Badge>
                )}
                {product.is_hero_product && (
                  <Badge className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none">
                    <Award className="h-3 w-3 mr-1" />
                    Produit Vedette
                  </Badge>
                )}
              </div>
              
              {/* Tags */}
              {product.tags && Array.isArray(product.tags) && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                  {product.tags.map((tag: string | null, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary">
                      {tag ?? ''}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Image Column */}
            <div className="relative order-1 lg:order-2">
              <div className="aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/20 border border-border/50 bg-muted relative z-10 rotate-3 transition-transform duration-700 hover:rotate-0">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={product.name_default || 'Product'}
                    className="h-full w-full object-cover scale-110 transition-transform duration-700 hover:scale-100"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center">
                    <Package className="h-24 w-24 text-primary/50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              </div>
              
              {/* Floating Element - Price & Stock Badge */}
              <div className="absolute -bottom-10 -left-10 z-20 p-6 rounded-3xl bg-background/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 animate-in slide-in-from-left-4 duration-1000 delay-300">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-primary/30">
                    {inStock ? (
                      <ShoppingCart className="h-7 w-7" />
                    ) : (
                      <Clock className="h-7 w-7" />
                    )}
                  </div>
                  <div>
                    <p className="text-3xl font-black leading-none mb-1">{formatCurrency(displayPrice)}</p>
                    <p className="text-sm text-muted-foreground font-medium">
                      {inStock ? stockStatus : 'Indisponible'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Decorative blob behind */}
              <div className="absolute inset-0 bg-primary/20 blur-[80px] -z-10 rounded-full scale-125" />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Product Details Section */}
      <SectionContainer size="lg" className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="group relative overflow-hidden rounded-[2.5rem] border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-background/80 hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-10">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                    <Globe className="h-3 w-3" />
                    <span>Description</span>
                  </div>
                  <h2 className="text-4xl font-black tracking-tight mb-4">{t('detail.description')}</h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="whitespace-pre-wrap text-lg leading-relaxed text-muted-foreground font-medium">
                    {product.description_default}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            <Card className="group sticky top-24 relative overflow-hidden rounded-[2.5rem] border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-background/80 hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-8 space-y-8">
                {/* Price Section */}
                <div className="relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Leaf className="h-16 w-16" />
                  </div>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-5xl font-black text-primary">
                        {formatCurrency(displayPrice)}
                      </span>
                      {displayPoints > 0 && (
                        <span className="ml-3 text-2xl font-bold text-muted-foreground">
                          ou {displayPoints} pts
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-tight">
                      {inStock ? stockStatus : 'Rupture de stock'}
                    </p>
                    {inStock && (
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Button 
                    className="w-full h-14 text-lg font-bold rounded-full bg-primary hover:bg-primary/90 hover:scale-105 transition-all shadow-lg" 
                    size="lg" 
                    disabled={!inStock}
                  >
                    {inStock ? (
                      <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        {t('card.add_to_cart')}
                      </>
                    ) : (
                      <>
                        <Clock className="mr-2 h-5 w-5" />
                        Rupture de stock
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="w-full h-14 text-lg font-bold rounded-full border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-all">
                    <Share2 className="mr-2 h-5 w-5" />
                    {t('detail.exchange')}
                  </Button>
                </div>

                {/* Enhanced Producer Section */}
                {product.producer && (
                  <div className="pt-8 border-t border-border/50">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold uppercase tracking-wider mb-6">
                      <Building2 className="h-3 w-3" />
                      <span>{t('detail.producer')}</span>
                    </div>
                    <div className="group relative overflow-hidden p-6 rounded-3xl border border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-background/80 hover:shadow-xl hover:-translate-y-1">
                      <div className="flex items-start gap-4">
                        {producerImage ? (
                          <div className="h-16 w-16 rounded-2xl overflow-hidden bg-muted flex-shrink-0 border border-border/50 group-hover:scale-110 transition-transform">
                            <img 
                              src={producerImage} 
                              alt={product.producer?.name_default || 'Producer'} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0 text-xl">
                            {product.producer?.name_default?.[0]?.toUpperCase() || 'P'}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-black text-xl leading-tight mb-2">
                            {product.producer?.name_default || ''}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-3">
                            {product.producer?.description_default || ''}
                          </div>
                          {product.producer.address_city && (
                            <div className="text-xs text-muted-foreground mb-2">
                              📍 {product.producer?.address_city || ''}{product.producer?.address_country_code ? `, ${product.producer.address_country_code}` : ''}
                            </div>
                          )}
                            {product.producer?.contact_website && (
                            <a 
                              href={product.producer?.contact_website || ''} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline group-hover:gap-3 transition-all"
                            >
                              Visiter le site web
                              <ArrowLeft className="h-3 w-3 rotate-180" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Product Certifications */}
                {product.certifications && Array.isArray(product.certifications) && product.certifications.length > 0 && (
                  <div className="pt-6 border-t border-border/50">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-4">
                      <Award className="h-3 w-3" />
                      <span>Certifications</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.certifications.map((cert: string, index: number) => (
                        <Badge key={index} className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Modern Navigation */}
        <div className="mt-16">
          <Link href="/products">
            <Button variant="ghost" className="pl-0 hover:pl-2 transition-all group">
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">{t('title')}</span>
            </Button>
          </Link>
        </div>
      </SectionContainer>

      {/* Modern CTA Section - Eco-Futurism Style */}
      <div className="container mx-auto px-4 pb-20 lg:pb-32 pt-20">
        <div 
          className="relative rounded-[3rem] !bg-[#0A1A14] !text-white p-12 md:p-24 overflow-hidden isolate shadow-2xl shadow-emerald-900/20"
          style={{ backgroundColor: '#0A1A14', color: 'white' }}
        >
          {/* Animated Noise Texture */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] animate-grain" />
          </div>

          {/* Organic Gradient Orbs */}
          <div className="absolute -top-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-emerald-500/20 blur-[120px] mix-blend-screen animate-pulse duration-[4000ms]" />
          <div className="absolute -bottom-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-teal-600/20 blur-[120px] mix-blend-screen animate-pulse duration-[6000ms]" />
          
          {/* Topographic Lines */}
          <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEiL2Q+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Globe className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-bold tracking-widest uppercase text-emerald-100">Impact Durable</span>
            </div>

            {/* Main Title */}
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              <span className="block text-white">Soutenir les</span>
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-300% animate-gradient">
                producteurs locaux.
              </span>
            </h2>

            {/* Description */}
            <p className="text-xl md:text-2xl text-emerald-100/80 font-medium leading-relaxed max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Chaque achat est un vote pour un avenir plus durable et équitable.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <Button size="lg" className="h-16 px-10 text-lg rounded-full font-bold bg-emerald-500 text-white hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_50px_-10px_rgba(16,185,129,0.4)] border-none">
                Découvrir plus de produits
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 text-lg rounded-full font-bold border-white/20 bg-transparent text-white hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-sm">
                En savoir plus
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Mobile Action Buttons */}
      <FloatingActionButtons
        productId={product.id}
        displayPrice={displayPrice}
        inStock={inStock}
      />
    </>
  )
}
