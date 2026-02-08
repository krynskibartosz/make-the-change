'use client';

import { type FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Plus } from 'lucide-react';

import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout';
import { useToast } from '@/hooks/use-toast';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { Button } from '@/components/ui/button';
import { InputV2 } from '@/components/ui/input-v2';
import { Textarea } from '@/components/ui/textarea';
import { LocalizedLink } from '@/components/localized-link';
import { trpc } from '@/lib/trpc';

import {
  blogPostFormSchema,
  DEFAULT_BLOG_POST_FORM_VALUES,
  type BlogPostFormData,
} from '../[id]/types/blog-post-form.types';

/**
 * Blog Post Creation Page
 *
 * Simplified form for creating new blog posts
 * After creation, redirects to the edit page for full editing
 */
const AdminBlogPostNewPage: FC = () => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: DEFAULT_BLOG_POST_FORM_VALUES,
    mode: 'onChange',
  });

  const createMutation = trpc.admin.blogPosts.create.useMutation({
    onSuccess: (data) => {
      toast({ 
        variant: 'success', 
        title: 'Article créé', 
        description: 'L\'article a été créé avec succès' 
      });
      router.push(`/admin/blog/${data.id}`);
    },
    onError: (error) => {
      toast({ 
        variant: 'destructive', 
        title: 'Erreur de création', 
        description: error.message 
      });
      setIsCreating(false);
    },
  });

  const onSubmit = async (data: BlogPostFormData) => {
    setIsCreating(true);
    createMutation.mutate({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || undefined,
      status: data.status,
    });
  };

  // Watch title for auto-slug generation
  const title = form.watch('title');

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    form.setValue('title', value);

    const currentSlug = form.getValues('slug');
    if (!currentSlug) {
      const generatedSlug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      form.setValue('slug', generatedSlug);
    }
  };

  return (
    <AdminPageLayout>
      <FormProvider {...form}>
        <form
          className="flex h-full flex-col bg-surface-1"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Header */}
          <div className="border-b border-border-subtle bg-surface-1 px-4 py-4 md:px-8">
            <div className="mx-auto flex max-w-3xl items-center justify-between">
              <div className="flex items-center gap-4">
                <LocalizedLink href="/admin/blog">
                  <Button icon={<ArrowLeft />} size="sm" variant="ghost">
                    Retour
                  </Button>
                </LocalizedLink>
                <div>
                  <h1 className="text-text-primary text-xl font-semibold">
                    Nouvel article de blog
                  </h1>
                  <p className="text-text-secondary text-sm">
                    Créez un nouveau article pour votre blog
                  </p>
                </div>
              </div>

              <Button
                icon={<Plus />}
                size="sm"
                type="submit"
                variant="accent"
                disabled={isCreating || !form.formState.isValid}
                loading={isCreating}
              >
                Créer l'article
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto py-8">
            <div className="mx-auto max-w-3xl px-4 md:px-8">
              <div className="bg-surface-2 border-border-subtle space-y-6 rounded-xl border p-6">
                {/* Title */}
                <DetailView.Field
                  label="Titre de l'article"
                  required
                  error={form.formState.errors.title?.message}
                  description="Le titre principal de votre article"
                >
                  <Controller
                    name="title"
                    control={form.control}
                    render={({ field }) => (
                      <InputV2
                        {...field}
                        placeholder="Entrez le titre de l'article"
                        onChange={(e) => handleTitleChange(e.target.value)}
                      />
                    )}
                  />
                </DetailView.Field>

                {/* Slug */}
                <DetailView.Field
                  label="Slug (URL)"
                  required
                  error={form.formState.errors.slug?.message}
                  description="URL-friendly identifier (généré automatiquement)"
                >
                  <Controller
                    name="slug"
                    control={form.control}
                    render={({ field }) => (
                      <InputV2 {...field} placeholder="slug-de-larticle" />
                    )}
                  />
                </DetailView.Field>

                {/* Excerpt */}
                <DetailView.Field
                  label="Extrait"
                  error={form.formState.errors.excerpt?.message}
                  description="Courte description de l'article (optionnel)"
                >
                  <Controller
                    name="excerpt"
                    control={form.control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        value={field.value || ''}
                        className="min-h-[100px]"
                        placeholder="Entrez un court extrait de l'article..."
                      />
                    )}
                  />
                </DetailView.Field>

                {/* Info Box */}
                <div className="bg-accent/10 border-accent/20 rounded-lg border p-4">
                  <p className="text-text-secondary text-sm">
                    <strong>Astuce:</strong> Après la création, vous pourrez ajouter le
                    contenu, les images, les relations et optimiser le SEO depuis la page
                    d'édition complète.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </AdminPageLayout>
  );
};

export default AdminBlogPostNewPage;
