import { Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { Award, Medal, Trophy } from 'lucide-react'
import type { FC } from 'react'

type BadgeItem = {
  name: string
  date?: string
  iconType?: 'trophy' | 'medal' | 'award'
}

type BadgesSectionProps = {
  badges: BadgeItem[]
  className?: string
}

export const BadgesSection: FC<BadgesSectionProps> = ({ badges, className }) => {
  if (badges.length === 0) return null

  return (
    <Card className={className}>
      <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Award className="h-5 w-5 text-primary" />
          Mes Badges & Succès
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0 sm:p-8 sm:pt-0">
        <div className="flex flex-wrap gap-3">
          {badges.map((badge, i) => (
            <div
              key={`${badge.name}-${i}`}
              className="flex items-center gap-3 rounded-2xl border bg-background/50 p-3 shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                {badge.iconType === 'trophy' ? (
                  <Trophy className="h-5 w-5" />
                ) : badge.iconType === 'medal' ? (
                  <Medal className="h-5 w-5" />
                ) : (
                  <Award className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold">{badge.name}</p>
                {badge.date && <p className="text-[10px] text-muted-foreground">{badge.date}</p>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
