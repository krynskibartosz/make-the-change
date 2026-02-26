'use client'

import { Card, CardContent, CardHeader, CardTitle, Badge } from '@make-the-change/core/ui'
import { getTranslations } from 'next-intl/server'
import { Package, Leaf, Droplet, Sun, Pickaxe } from 'lucide-react'

// Icon mapping based on item type/slug
const getIcon = (itemType: string, slug: string) => {
    if (slug.includes('seed') || slug.includes('graine')) return <Leaf className="h-4 w-4" />
    if (slug.includes('water') || slug.includes('eau')) return <Droplet className="h-4 w-4 text-blue-500" />
    if (slug.includes('sun') || slug.includes('soleil')) return <Sun className="h-4 w-4 text-yellow-500" />
    if (slug.includes('tool') || slug.includes('outil')) return <Pickaxe className="h-4 w-4" />
    return <Package className="h-4 w-4" />
}

export function UserInventory({ inventory }: { inventory: any[] }) {
    if (!inventory || inventory.length === 0) {
        return (
            <Card className="border bg-background/70 shadow-sm backdrop-blur h-full">
                <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                        <Package className="h-5 w-5 text-client-amber-600" />
                        Mon Inventaire
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 sm:p-8 sm:pt-0">
                    <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30">
                        <p className="text-sm text-muted-foreground">Votre sac à dos est vide.</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border bg-background/70 shadow-sm backdrop-blur h-full">
            <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-client-amber-600" />
                    Mon Inventaire
                </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 sm:p-8 sm:pt-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {inventory.map((entry) => (
                        <div
                            key={entry.id}
                            className="relative flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center transition-colors hover:bg-muted/50"
                        >
                            <Badge className="absolute -top-2 -right-2 h-6 min-w-6 flex items-center justify-center rounded-full">
                                {entry.quantity}
                            </Badge>
                            <div className="h-12 w-12 rounded-full bg-linear-to-br from-client-emerald-500/20 to-client-teal-500/20 flex items-center justify-center text-client-emerald-700">
                                {getIcon(entry.item.type, entry.item.slug)}
                            </div>
                            <span className="text-sm font-medium leading-tight">
                                {/* Fallback translation handling without useTranslations hook for simplicity in this demo */}
                                {entry.item.name_i18n?.fr || entry.item.name_default}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
