'use client';

import { type FC } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams } from 'next/navigation';

import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { useEntityErrorHandler } from '@/hooks/use-entity-error-handler';
import { trpc } from '@/lib/trpc';

import { BlogPostDetailSkeleton } from './components/blog-post-detail-skeleton';
import { useBlogPostFormOptimistic } from './hooks/use-blog-post-form-optimistic';
import {
  BlogPostCoverSection,
  BlogPostEditHeader,
  EssentialInfoSection,
  ContentSection,
  PublicationSection,
  RelationsSection,
  SeoSection,
  MetadataSection,
} from './components';
import type { RawBlogPostData } from './types/blog-post-form.types';

/**
 * Blog Post Edit Page - React Hook Form Implementation
 *
 * Architecture (alignée avec categories/partners/biodex):
 * - Uses React Hook Form for form state management
 * - Auto-save with 1.5s debounce + immediate blur flush
 * - Optimistic UI with automatic rollback on error
 * - Error handling with automatic redirect to list page
 * - Cover section with breadcrumb overlay
 * - Sticky header with save status
 */

const AdminBlogPostEditPage: FC = () => {
  const params = useParams<{ id: string }>();
  const postIdParam = typeof params.id === 'string' ? params.id : undefined;

  const {
    data: post,
    isPending: isLoadingPost,
    error,
  } = trpc.admin.blogPosts.detail.useQuery(
    { id: postIdParam! },
    { enabled: Boolean(postIdParam) }
  );

  useEntityErrorHandler(error, {
    redirectTo: '/admin/blog',
    entityType: 'article de blog',
  });

  // Conditions APRÈS tous les hooks
  if (!postIdParam) {
    return <BlogPostDetailSkeleton />;
  }

  if (isLoadingPost || !post) {
    return <BlogPostDetailSkeleton />;
  }

  return (
    <AdminPageLayout>
      <BlogPostFormWrapperWithHook
        postId={postIdParam}
        postTitle={post.title}
        coverImageUrl={post.cover_image_url}
        initialData={post}
      />
    </AdminPageLayout>
  );
};

/**
 * Inner component that uses the form hook
 *
 * Layout standard aligné avec categories/partners/biodex:
 * - Cover section avec breadcrumb overlay (full width)
 * - Header avec statut de sauvegarde (PAS de bouton Save manuel)
 * - Scrollable content area avec form sections
 * - Auto-save automatique 1.5s debounce + flush on blur
 */
function BlogPostFormWrapperWithHook({
  postId,
  postTitle,
  coverImageUrl,
  initialData,
}: {
  postId: string;
  postTitle: string;
  coverImageUrl?: string | null;
  initialData: RawBlogPostData;
}) {
  const { form, autoSave, hasUnsavedChanges } = useBlogPostFormOptimistic({
    postId,
    initialData,
    debug: process.env.NODE_ENV === 'development',
  });

  return (
    <FormProvider {...form}>
      <form
        className="flex h-full flex-col bg-surface-1 text-text-primary transition-colors duration-300 dark:bg-transparent"
        onSubmit={(event) => {
          event.preventDefault();
          void autoSave.saveNow();
        }}
      >
        {/* All content scrollable together */}
        <div className="content-wrapper content-wrapper-dark flex-1 overflow-y-auto">
          {/* Cover Section - scrolls away */}
          <BlogPostCoverSection
            postId={postId}
            postTitle={postTitle}
            coverImageUrl={coverImageUrl}
            autoSave={autoSave}
          />

          {/* Header - scrolls with content (NO SAVE BUTTON!) */}
          <div className="border-b border-border-subtle/60 bg-surface-1/95 shadow-glow-md backdrop-blur-sm">
            <BlogPostEditHeader
              autoSave={autoSave}
              hasUnsavedChanges={hasUnsavedChanges}
            />
          </div>

          {/* Content */}
          <div className="relative z-[1] py-6">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              <DetailView variant="cards" gridCols={2} spacing="lg">
                <EssentialInfoSection autoSave={autoSave} />
                <PublicationSection autoSave={autoSave} />
                <ContentSection autoSave={autoSave} />
                <RelationsSection autoSave={autoSave} />
                <SeoSection autoSave={autoSave} />
                <MetadataSection post={initialData} />
              </DetailView>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

export default AdminBlogPostEditPage;
