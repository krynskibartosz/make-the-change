import { Users, Leaf, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { getTranslations } from 'next-intl/server'

export async function CommunityStatsCard() {
    const t = await getTranslations('navigation') // Reusing namespace for simplicity, ideally 'community'

    // Mocking global stats for visual richness
    const stats = [
        {
            label: 'Membres actifs',
            value: '42,593',
            icon: Users,
            color: 'text-client-emerald-500',
        },
        {
            label: 'Points distribués',
            value: '8.4M',
            icon: Globe,
            color: 'text-client-amber-500',
        },
        {
            label: 'Projets soutenus',
            value: '156',
            icon: Leaf,
            color: 'text-primary',
        },
    ]

    return (
        <Card className="overflow-hidden border-border/50 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Impact Global</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon
                    return (
                        <div key={i} className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-full bg-muted/50 ${stat.color}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
