'use client'

import { Card, CardContent, CardHeader, CardTitle, Progress, Button, Badge } from '@make-the-change/core/ui'
import { Target, CheckCircle2, Navigation, Gift } from 'lucide-react'
import { useOptimistic, startTransition, useState } from 'react'
import { claimQuestReward } from '@/lib/gamification/quest.actions'
import { useToast } from '@/components/ui/use-toast'

export function UserQuests({ quests }: { quests: any[] }) {
    const { toast } = useToast()

    // Local state for optimistic UI updates (since Server Actions might be slow)
    const [localQuests, setLocalQuests] = useState(quests)

    const handleClaim = async (questId: string) => {
        // Optimistic update
        setLocalQuests(current =>
            current.map(q =>
                q.id === questId
                    ? { ...q, user_progress: { ...q.user_progress, status: 'claimed' } }
                    : q
            )
        )

        try {
            const res = await claimQuestReward(questId)
            toast({
                title: "Récompense réclamée !",
                description: `Vous avez gagné ${res.reward_points} XP.`,
                variant: "success"
            })
        } catch (error: any) {
            // Revert on error
            setLocalQuests(quests)
            toast({
                title: "Erreur",
                description: error.message || "Impossible de réclamer la récompense.",
                variant: "destructive"
            })
        }
    }

    if (!localQuests || localQuests.length === 0) {
        return (
            <Card className="border bg-background/70 shadow-sm backdrop-blur h-full">
                <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                        <Target className="h-5 w-5 text-client-teal-500" />
                        Mes Quêtes
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 sm:p-8 sm:pt-0">
                    <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30">
                        <p className="text-sm text-muted-foreground">Aucune quête n'est active pour le moment.</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border bg-background/70 shadow-sm backdrop-blur h-full">
            <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-client-teal-500" />
                    Mes Quêtes
                </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 sm:p-8 sm:pt-0 space-y-4">
                {localQuests.map((quest) => {
                    const status = quest.user_progress?.status || 'active'
                    const progress = quest.user_progress?.progress || 0
                    const isCompleted = status === 'completed' || progress >= 100
                    const isClaimed = status === 'claimed'

                    return (
                        <div key={quest.id} className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between rounded-xl border bg-muted/20 p-4">
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-semibold">{quest.title}</h4>
                                    {isClaimed && <Badge variant="secondary"><CheckCircle2 className="h-3 w-3 mr-1" /> Terminé</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground">{quest.description}</p>

                                {!isClaimed && (
                                    <div className="mt-2 pr-4 space-y-1">
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Progression</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <Progress value={progress} className="h-1.5" />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 shrink-0">
                                <div className="text-xs font-medium bg-muted/50 px-3 py-1.5 rounded-md flex items-center justify-center gap-1.5">
                                    <Gift className="h-3.5 w-3.5 mt-[-1px]" />
                                    <span>{quest.reward_points} XP</span>
                                </div>

                                {isCompleted && !isClaimed && (
                                    <Button size="sm" onClick={() => handleClaim(quest.id)} className="w-full">
                                        Réclamer
                                    </Button>
                                )}
                                {!isCompleted && !isClaimed && (
                                    <Button size="sm" variant="outline" className="w-full pointer-events-none opacity-50">
                                        En cours
                                    </Button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
