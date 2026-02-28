import { Badge, Button, Card, CardContent } from '@make-the-change/core/ui'
import { ProjectChallenge } from '@/types/context'

interface ProjectChallengesSectionProps {
  challenges: ProjectChallenge[] | null
  userParticipation?: boolean
}

export function ProjectChallengesSection({ challenges }: ProjectChallengesSectionProps) {
  if (!challenges || challenges.length === 0) return null

  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <div className="h-10 w-1 rounded-full bg-primary" />
        <h2 className="text-3xl font-black tracking-tight">Challenges Disponibles</h2>
      </div>
      <div className="space-y-4">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </section>
  )
}

function ChallengeCard({ challenge }: { challenge: ProjectChallenge }) {
  return (
    <Card className="rounded-2xl border-border/50 bg-background/50 hover:bg-background/80 transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg">{challenge.name}</h3>
          <Badge variant={getDifficultyVariant(challenge.difficulty)}>
            {challenge.difficulty}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{challenge.type}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {challenge.userParticipation && (
              <Badge variant="default" className="bg-green-500 hover:bg-green-600">Participé</Badge>
            )}
            {challenge.rewards.length > 0 && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                🎁 {challenge.rewards.length} récompenses
              </span>
            )}
          </div>
          <Button size="sm" variant={challenge.userParticipation ? "secondary" : "default"}>
            {challenge.userParticipation ? 'Voir progression' : 'Participer'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function getDifficultyVariant(difficulty: string): "default" | "secondary" | "destructive" | "outline" {
  switch (difficulty?.toLowerCase()) {
    case 'hard':
    case 'expert':
      return 'destructive'
    case 'medium':
      return 'secondary'
    case 'easy':
    default:
      return 'outline'
  }
}
