'use client'

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Separator } from '@make-the-change/core/ui'
import { ArrowLeft, ArrowRight, ShoppingBag, Sparkles, ShieldCheck, Truck, CreditCard, Leaf } from 'lucide-react'
import { useRef } from 'react'
import { CartLineItem } from '@/features/commerce/cart/cart-line-item'
import { useCartUI } from '@/features/commerce/cart/cart-ui-provider'
import { useCart, useCartTotals } from '@/features/commerce/cart/use-cart'
import { Link, useRouter } from '@/i18n/navigation'
import { formatPoints, formatCurrency, cn } from '@/lib/utils'

const isOutOfStockSnapshot = (stockQuantity?: number | null) =>
  stockQuantity !== null && stockQuantity !== undefined && stockQuantity <= 0

export default function CartPage() {
  const router = useRouter()
  const { items, hydrated, setQuantity, removeItem, replaceItems, clear } = useCart()
  const { itemsCount, totalPoints, totalEuros } = useCartTotals()
  const { showSnackbar } = useCartUI()
  const itemsRef = useRef(items)
  itemsRef.current = items

  const hasOutOfStock = items.some((i) => isOutOfStockSnapshot(i.snapshot.stockQuantity))
  const canCheckout = itemsCount > 0 && !hasOutOfStock

  const handleBack = () => {
    router.push('/products')
  }

  const handleClear = () => {
    const previous = items
    clear()
    showSnackbar({
      message: 'Panier vidé',
      actionLabel: 'Annuler',
      onAction: () => replaceItems(previous),
    })
  }

  const handleRemove = (productId: string) => {
    const removedIndex = items.findIndex((i) => i.productId === productId)
    const removedItem = items[removedIndex]
    if (!removedItem) return

    removeItem(productId)
    showSnackbar({
      message: 'Article supprimé',
      actionLabel: 'Annuler',
      onAction: () => {
        const current = itemsRef.current
        const existingIndex = current.findIndex((i) => i.productId === removedItem.productId)

        if (existingIndex >= 0) {
          const next = [...current]
          const existing = next[existingIndex]
          next[existingIndex] = {
            ...existing,
            quantity: (existing.quantity || 0) + (removedItem.quantity || 0),
            snapshot: { ...existing.snapshot, ...removedItem.snapshot },
          }
          replaceItems(next)
          return
        }

        const next = [...current]
        const insertAt = Math.min(Math.max(0, removedIndex), next.length)
        next.splice(insertAt, 0, removedItem)
        replaceItems(next)
      },
    })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background selection:bg-primary/20">
      {/* Background Elements (Dribbble 2026 Style) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px] animate-pulse duration-[4000ms]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-teal-400/5 blur-[120px] animate-pulse duration-[6000ms]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-12 lg:py-24">
        {/* Header Section */}
        <div className="mb-12 md:mb-16">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack} 
            className="mb-6 hover:bg-primary/10 hover:text-primary transition-colors rounded-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continuer mes achats
          </Button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary backdrop-blur-md mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Sparkles className="h-3 w-3" />
                <span className="uppercase tracking-widest">Votre Panier</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-6 duration-700">
                Récapitulatif <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">Impact.</span>
              </h1>
            </div>
            
            {itemsCount > 0 && (
              <Button 
                variant="outline" 
                onClick={handleClear} 
                className="text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5 rounded-full transition-all animate-in fade-in slide-in-from-right-4 duration-700 delay-100"
              >
                Vider le panier
              </Button>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            {!hydrated ? (
              // Loading State
              <div className="space-y-4 animate-pulse">
                {[1, 2].map((i) => (
                  <div key={i} className="h-32 rounded-[2rem] bg-muted/50 border border-border/50" />
                ))}
              </div>
            ) : itemsCount === 0 ? (
              // Empty State
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm shadow-xl rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-500">
                <CardContent className="flex flex-col items-center justify-center gap-6 py-24 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-background to-muted border border-white/10 shadow-inner">
                      <ShoppingBag className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h3 className="text-2xl font-black tracking-tight">Votre panier est vide</h3>
                    <p className="text-muted-foreground font-medium">
                      On dirait que vous n'avez pas encore trouvé votre bonheur. Explorez nos projets à impact et commencez à faire la différence.
                    </p>
                  </div>
                  <Button asChild size="lg" className="mt-4 rounded-full px-8 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                    <Link href="/products">
                      Explorer la boutique
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              // Items List
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                {hasOutOfStock && (
                  <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-6 py-4 flex items-center gap-3 text-destructive animate-pulse">
                    <div className="h-2 w-2 rounded-full bg-destructive" />
                    <span className="font-semibold">Un article est en rupture de stock.</span>
                  </div>
                )}
                
                {items.map((item, index) => (
                  <div 
                    key={item.productId}
                    className="group relative transition-all duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CartLineItem
                      item={item}
                      onQuantityChange={(next) => setQuantity(item.productId, next)}
                      onRemove={() => handleRemove(item.productId)}
                      className="border-border/50 bg-background/60 backdrop-blur-md shadow-sm hover:shadow-xl hover:border-primary/20 rounded-[2rem] transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Summary (Sticky) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6 animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
              <Card className="border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/50 pb-6">
                  <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Total commande
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-medium">Sous-total</span>
                      <span className="font-bold">{formatPoints(totalPoints)} pts</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-medium">Livraison</span>
                      <span className="text-emerald-500 font-bold">Gratuite</span>
                    </div>
                    <Separator className="bg-border/50" />
                    <div className="flex justify-between items-end">
                      <span className="text-lg font-black uppercase tracking-tight">Total</span>
                      <div className="text-right">
                        <div className="text-3xl font-black text-primary leading-none">
                          {formatPoints(totalPoints)} <span className="text-lg">pts</span>
                        </div>
                        {totalEuros > 0 && (
                          <div className="text-sm text-muted-foreground font-medium mt-1">
                            ~ {formatCurrency(totalEuros)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all bg-gradient-to-r from-primary to-teal-500 border-none"
                    size="lg"
                    disabled={!canCheckout}
                    onClick={() => router.push('/checkout')}
                  >
                    Passer au paiement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/50 border border-border/50 text-center">
                      <ShieldCheck className="h-5 w-5 text-emerald-500 mb-2" />
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">Paiement Sécurisé</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/50 border border-border/50 text-center">
                      <Leaf className="h-5 w-5 text-emerald-500 mb-2" />
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">100% Impact</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <div className="rounded-3xl bg-blue-500/5 border border-blue-500/10 p-6 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm mb-1">Livraison Instantanée</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Vos crédits d'impact sont crédités sur votre compte immédiatement après validation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
