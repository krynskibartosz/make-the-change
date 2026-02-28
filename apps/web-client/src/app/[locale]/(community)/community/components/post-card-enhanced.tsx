import { Avatar, AvatarFallback, AvatarImage, Badge, Button, Card, CardContent } from '@make-the-change/core/ui'
import { PostContext } from '@/types/context'
import Link from 'next/link'
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react'

interface PostCardEnhancedProps {
  post: PostContext
}

export function PostCardEnhanced({ post }: PostCardEnhancedProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch (e) {
      return dateString
    }
  }

  return (
    <Card className="group border border-border/50 bg-background/50 hover:bg-background/80 transition-all">
      <CardContent className="p-6">
        {/* Badge source */}
        {post.source_badge && (
          <div className="mb-4">
            <Link href={post.source_badge.link || '#'}>
              <Badge 
                className="cursor-pointer hover:opacity-80 transition-opacity border-none"
                style={{ 
                  backgroundColor: getSourceBadgeColor(post.source_badge.type),
                  color: 'white'
                }}
              >
                <span className="mr-1">{post.source_badge.icon || ''}</span>
                {post.source_badge.name}
              </Badge>
            </Link>
          </div>
        )}
        
        {/* En-tête avec auteur */}
        <div className="flex items-start gap-3 mb-4">
          <Avatar>
            <AvatarImage src={post.author_avatar || undefined} />
            <AvatarFallback>{post.author_name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{post.author_name}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDate(post.created_at)}
            </p>
          </div>
        </div>
        
        {/* Contenu */}
        <p className="mb-4 text-foreground whitespace-pre-wrap">{post.content}</p>
        
        {/* Entité liée */}
        {post.linked_entity && (
          <div className="mb-4 p-3 border border-border/50 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              {post.linked_entity.image && (
                <img 
                  src={post.linked_entity.image} 
                  alt={post.linked_entity.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <p className="font-semibold text-sm">{post.linked_entity.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                  {post.linked_entity.description}
                </p>
                {post.linked_entity.link && (
                  <Link 
                    href={post.linked_entity.link}
                    className="text-xs text-primary hover:underline mt-1 inline-block font-medium"
                  >
                    Voir →
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Engagement */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4 pt-2 border-t border-border/50">
          <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {post.engagement.likes}</span>
          <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {post.engagement.comments}</span>
          <span className="flex items-center gap-1"><Share2 className="w-4 h-4" /> {post.engagement.shares}</span>
          <span className="flex items-center gap-1"><Bookmark className="w-4 h-4" /> {post.engagement.bookmarks}</span>
        </div>
        
        {/* Actions utilisateur */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={post.user_state.hasLiked ? "default" : "outline"}
            className="flex-1"
          >
            {post.user_state.hasLiked ? 'Aimé' : 'J\'aime'}
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            Commenter
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            Partager
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function getSourceBadgeColor(type: string | undefined): string {
  const colors = {
    project: '#22c55e', // green-500
    species: '#3b82f6', // blue-500
    challenge: '#eab308', // yellow-500
    producer: '#f97316', // orange-500
    post: '#6b7280' // gray-500
  }
  return colors[(type || 'post') as keyof typeof colors] || '#6b7280'
}
