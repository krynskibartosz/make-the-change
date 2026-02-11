import { Button } from '@make-the-change/core/ui'
import { ArrowRight } from 'lucide-react'
import { MarketingSection } from '@/components/marketing/marketing-section'
import type { BlogPost } from '@/features/blog/blog-types'
import { BlogCard } from '@/features/blog/components/blog-card'
import { Link } from '@/i18n/navigation'

type HomeBlogSectionProps = {
  title: string
  viewAllLabel: string
  posts: BlogPost[]
}

export function HomeBlogSection({ title, viewAllLabel, posts }: HomeBlogSectionProps) {
  return (
    <MarketingSection
      title={title}
      action={
        <Link href="/blog">
          <Button
            variant="ghost"
            className="flex items-center font-bold uppercase tracking-widest text-xs"
          >
            {viewAllLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      }
      size="lg"
      className="py-20"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </MarketingSection>
  )
}
