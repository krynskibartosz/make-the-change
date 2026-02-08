'use client'

import { Button, Input, SimpleSelect } from '@make-the-change/core/ui'
import { FileText, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useQueryStates } from 'nuqs'
import { type FC } from 'react'
import { useDebouncedCallback } from '@/app/[locale]/admin/(dashboard)/components/hooks/use-debounced-callback'
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header'
import { AdminPagination } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-pagination'
import { AdminListItem } from '@/app/[locale]/admin/(dashboard)/components/ui/admin-list-item'
import { LocalizedLink } from '@/components/localized-link'
import { DataList } from '@make-the-change/core/ui'
import { blogSearchParams } from './blog-search-params'

type BlogPost = {
  id: string
  title: string
  slug: string
  status: string
  created_at: string
  author_name?: string | null
}

type BlogClientProps = {
  initialData: {
    items: BlogPost[]
    total: number
  }
}

const PAGE_SIZE = 10

export const BlogClient: FC<BlogClientProps> = ({ initialData }) => {
  const t = useTranslations()

  const [filters, setFilters] = useQueryStates(blogSearchParams, {
    shallow: false,
    throttleMs: 400,
  })

  const { q: search, page, sort } = filters

  const posts = initialData.items
  const totalPosts = initialData.total
  const totalPages = Math.max(1, Math.ceil(totalPosts / PAGE_SIZE))

  const debouncedSearch = useDebouncedCallback((value: string) => {
    void setFilters({ q: value, page: 1 })
  }, 400)

  const sortOptions = [
    { value: 'created_at_desc', label: t('admin.common.sort.newest') },
    { value: 'created_at_asc', label: t('admin.common.sort.oldest') },
    { value: 'title_asc', label: t('admin.common.sort.name_asc') }, // Mapping name to title
    { value: 'title_desc', label: t('admin.common.sort.name_desc') },
  ]

  return (
    <AdminPageContainer>
      <AdminPageHeader title={t('admin.blog.title')}>
        <div className="flex items-center gap-2">
          <LocalizedLink href="/admin/blog/new">
            <Button icon={<Plus />} size="sm">
              {t('admin.blog.new_post')}
            </Button>
          </LocalizedLink>
        </div>
      </AdminPageHeader>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder={t('admin.common.search')}
              defaultValue={search}
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>
          <SimpleSelect
            className="w-44"
            options={sortOptions}
            value={sort}
            onValueChange={(value) => setFilters({ sort: value })}
          />
        </div>

        <DataList
            isLoading={false}
            items={posts}
            variant="list"
            getItemKey={(item) => item.id}
            emptyState={{
                icon: FileText,
                title: t('admin.blog.empty_state.title'),
                description: t('admin.blog.empty_state.description'),
                action: (
                    <LocalizedLink href="/admin/blog/new">
                        <Button size="sm" variant="outline">
                            {t('admin.blog.new_post')}
                        </Button>
                    </LocalizedLink>
                )
            }}
            renderItem={(post) => (
                <LocalizedLink key={post.id} href={`/admin/blog/${post.id}`} className="block">
                    <AdminListItem
                        title={post.title}
                        subtitle={post.slug}
                        status={post.status === 'published' ? 'active' : 'inactive'}
                        meta={[
                            post.author_name ? `Par ${post.author_name}` : 'Auteur inconnu',
                            new Date(post.created_at).toLocaleDateString()
                        ]}
                    />
                </LocalizedLink>
            )}
        />

        {totalPages > 1 && (
          <div className="mt-6">
            <AdminPagination
              pagination={{
                currentPage: page,
                pageSize: PAGE_SIZE,
                totalItems: totalPosts,
                totalPages,
              }}
              onPageChange={(p) => setFilters({ page: p })}
            />
          </div>
        )}
      </div>
    </AdminPageContainer>
  )
}

export default BlogClient
