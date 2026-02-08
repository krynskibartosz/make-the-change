'use client';

import { type FC } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';

import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout';
import { AdminDetailLayout } from '@/components/admin/admin-detail-layout';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { trpc } from '@/lib/trpc';
import { ArrowLeft, Save } from 'lucide-react';
import { LocalizedLink } from '@/components/localized-link';

const categorySchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  slug: z.string().min(1, 'Le slug est requis'),
  description: z.string().optional(),
  parent_id: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  sort_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const AdminCategoryCreatePage: FC = () => {
  const t = useTranslations('admin.categories');
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data: allCategories } = trpc.admin.categories.list.useQuery({
    activeOnly: false,
  });

  const createCategory = trpc.admin.categories.create.useMutation({
    onSuccess: (data) => {
      utils.admin.categories.list.invalidate();
      utils.admin.categories.listPaginated.invalidate();
      router.push(`/admin/categories/${data.id}`);
    },
  });

  const form = useForm<CategoryFormData>({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      parent_id: undefined,
      image_url: '',
      sort_order: 0,
      is_active: true,
      seo_title: '',
      seo_description: '',
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: categorySchema,
    },
    onSubmit: async ({ value }) => {
      await createCategory.mutateAsync(value);
    },
  });

  const rootCategories = allCategories?.filter(cat => !cat.parent_id) || [];

  return (
    <AdminPageLayout>
      <form
        className="contents"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <AdminDetailLayout
          headerContent={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <LocalizedLink href="/admin/categories">
                  <Button icon={<ArrowLeft />} size="sm" variant="ghost">
                    {t('back_to_list')}
                  </Button>
                </LocalizedLink>
                <div>
                  <h1 className="text-2xl font-bold">{t('new_category')}</h1>
                  <p className="text-muted-foreground text-sm">
                    {t('create_description')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  disabled={form.state.isSubmitting}
                  icon={<Save />}
                  size="sm"
                  type="submit"
                  variant="accent"
                >
                  {form.state.isSubmitting ? t('saving') : t('create')}
                </Button>
              </div>
            </div>
          }
        >
          <DetailView gridCols={2} spacing="md" variant="cards">
            {/* Informations essentielles */}
            <div className="bg-card border-border space-y-4 rounded-xl border p-6">
              <h2 className="text-lg font-semibold">{t('sections.essential_info')}</h2>
              
              <form.Field name="name">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('fields.name')}</Label>
                    <Input
                      id="name"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors && (
                      <p className="text-destructive text-sm">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field name="slug">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="slug">{t('fields.slug')}</Label>
                    <Input
                      id="slug"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors && (
                      <p className="text-destructive text-sm">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="description">{t('fields.description')}</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                )}
              </form.Field>
            </div>

            {/* Configuration */}
            <div className="bg-card border-border space-y-4 rounded-xl border p-6">
              <h2 className="text-lg font-semibold">{t('sections.configuration')}</h2>

              <form.Field name="parent_id">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="parent_id">{t('fields.parent_category')}</Label>
                    <select
                      id="parent_id"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={field.state.value || ''}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value || undefined)}
                    >
                      <option value="">{t('fields.no_parent')}</option>
                      {rootCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </form.Field>

              <form.Field name="sort_order">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="sort_order">{t('fields.sort_order')}</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="is_active">
                {(field) => (
                  <div className="flex items-center space-x-2">
                    <input
                      id="is_active"
                      type="checkbox"
                      checked={field.state.value}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      className="border-input bg-background ring-offset-background focus-visible:ring-ring h-4 w-4 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    />
                    <Label htmlFor="is_active">{t('fields.is_active')}</Label>
                  </div>
                )}
              </form.Field>
            </div>

            {/* Image */}
            <div className="bg-card border-border space-y-4 rounded-xl border p-6">
              <h2 className="text-lg font-semibold">{t('sections.image')}</h2>
              
              <form.Field name="image_url">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="image_url">{t('fields.image_url')}</Label>
                    <Input
                      id="image_url"
                      type="url"
                      placeholder="https://..."
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors && (
                      <p className="text-destructive text-sm">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            {/* SEO */}
            <div className="bg-card border-border space-y-4 rounded-xl border p-6">
              <h2 className="text-lg font-semibold">{t('sections.seo')}</h2>

              <form.Field name="seo_title">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="seo_title">{t('fields.seo_title')}</Label>
                    <Input
                      id="seo_title"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="seo_description">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="seo_description">{t('fields.seo_description')}</Label>
                    <Textarea
                      id="seo_description"
                      rows={3}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                )}
              </form.Field>
            </div>
          </DetailView>
        </AdminDetailLayout>
      </form>
    </AdminPageLayout>
  );
};

export default AdminCategoryCreatePage;
