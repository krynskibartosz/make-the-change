import { MarketingSection } from '@/app/[locale]/(marketing)/_features/marketing-section'
import type { BlogPost } from '@/app/[locale]/(marketing)/blog/_features/blog-types'
import { BlogCard } from '@/app/[locale]/(marketing)/blog/_features/components/blog-card'
import { HomeSectionViewAllAction } from './home-section-view-all-action'

type HomeBlogSectionProps = {
  title: string
  viewAllLabel: string
  posts: BlogPost[]
  variant?: 'default' | 'muted'
}

export const HomeBlogSection = ({ title, viewAllLabel, posts, variant = 'default' }: HomeBlogSectionProps) => (
  <MarketingSection
    title={title}
    action={<HomeSectionViewAllAction href="/blog" label={viewAllLabel} />}
    size="lg"
    className="py-20"
    variant={variant}
  >
    <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
      {posts.slice(0, 3).map((post) => (
        <li key={post.id}>
          <BlogCard post={post} />
        </li>
      ))}
    </ul>
  </MarketingSection>
);
