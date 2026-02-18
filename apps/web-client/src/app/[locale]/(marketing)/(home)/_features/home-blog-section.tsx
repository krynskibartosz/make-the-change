import { Button } from '@make-the-change/core/ui'
import { ArrowRight } from 'lucide-react'
import { MarketingSection } from '@/app/[locale]/(marketing)/_features/marketing-section'
import type { BlogPost } from '@/app/[locale]/(marketing)/blog/_features/blog-types'
import { BlogCard } from '@/app/[locale]/(marketing)/blog/_features/components/blog-card'
import { Link } from '@/i18n/navigation'

type HomeBlogSectionProps = {
  title: string
  viewAllLabel: string
  posts: BlogPost[]
  variant?: 'default' | 'muted'
}

export function HomeBlogSection({ title, viewAllLabel, posts, variant = 'default' }: HomeBlogSectionProps) {
  return (
    <MarketingSection
      title={title}
      action={
        <Link href="/blog" aria-label={viewAllLabel}>
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
      variant={variant}
    >
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 list-none m-0 p-0">
        {posts.slice(0, 3).map((post) => (
          <li key={post.id}>
            <BlogCard post={post} />
          </li>
        ))}
      </ul>
    </MarketingSection>
  )
}
