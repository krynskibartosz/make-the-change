import { Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Calendar } from 'lucide-react'
import Image from 'next/image'

export type ProjectUpdate = {
  id: string
  title: string
  content: string | null
  type: 'production' | 'maintenance' | 'harvest' | 'impact' | 'news' | 'milestone'
  published_at: string | null
  images: string[] | null
}

export function ProjectTimeline({ updates }: { updates: ProjectUpdate[] }) {
  if (!updates || updates.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Actualités du projet</h2>
      <div className="relative border-l border-muted pl-6 space-y-8">
        {updates.map((update) => (
          <div key={update.id} className="relative">
            <div className="absolute -left-[2.4rem] flex h-8 w-8 items-center justify-center rounded-full bg-background border ring-4 ring-background">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground capitalize">
                  {update.type === 'news' ? 'Actualité' : update.type}
                </span>
                <span>•</span>
                <time dateTime={update.published_at || ''}>
                  {update.published_at
                    ? formatDistanceToNow(new Date(update.published_at), {
                        addSuffix: true,
                        locale: fr,
                      })
                    : 'Récemment'}
                </time>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{update.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {update.content && (
                    <p className="text-muted-foreground whitespace-pre-wrap">{update.content}</p>
                  )}

                  {update.images && update.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {update.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-video overflow-hidden rounded-md border bg-muted"
                        >
                          {/* Note: In a real app, use a proper image component with blurhash support */}
                          <Image
                            src={img}
                            alt={`Image ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
