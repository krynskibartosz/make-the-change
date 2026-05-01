'use client'

import { Card, CardContent, CardHeader, CardTitle, Badge } from '@make-the-change/core/ui'
import { Leaf, Droplet, Sun, Wind, MapPin } from 'lucide-react'

interface EcosystemCardProps {
    ecosystem: any
}

// Map ecosystem icons
const getEcosystemIcon = (iconName?: string) => {
    switch (iconName) {
        case 'forest': return <Leaf className="h-5 w-5 text-green-600" />
        case 'water': return <Droplet className="h-5 w-5 text-blue-500" />
        case 'solar': return <Sun className="h-5 w-5 text-yellow-500" />
        case 'wind': return <Wind className="h-5 w-5 text-gray-500" />
        default: return <Leaf className="h-5 w-5 text-green-600" />
    }
}

export function EcosystemCard({ ecosystem }: EcosystemCardProps) {
    if (!ecosystem) return null

    // In a real app we would use next-intl translations
    const name = ecosystem.name_i18n?.fr || ecosystem.name_default || ecosystem.slug
    const description = ecosystem.description_i18n?.fr || ecosystem.description_default

    return (
        <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-border/80">
            {ecosystem.image_url && (
                <div className="relative h-32 w-full bg-muted">
                    <img
                        src={ecosystem.image_url}
                        alt={name}
                        className="h-full w-full object-cover"
                    />
                </div>
            )}

            <CardHeader className="p-5 pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        {getEcosystemIcon(ecosystem.icon_name)}
                    </div>
                    {name}
                </CardTitle>
            </CardHeader>

            <CardContent className="p-5 pt-2">
                {description && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {description}
                    </p>
                )}

                {ecosystem.attributes && Object.keys(ecosystem.attributes).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {Object.entries(ecosystem.attributes).map(([key, value]) => (
                            <Badge key={key} variant="secondary" className="text-xs bg-muted/60">
                                <span className="opacity-70 mr-1">{key}:</span> {String(value)}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
