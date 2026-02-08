'use client';

import { useMemo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Link, User, Folder, Building, Leaf } from 'lucide-react';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { CustomSelect, type SelectOption } from '@/components/ui/custom-select';
import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';
import type { BlogPostFormData } from '../types/blog-post-form.types';
import { trpc } from '@/lib/trpc';

interface RelationsSectionProps {
  autoSave: AutoSaveReturn;
}

/**
 * Relations Section - RHF Component for Blog Posts
 *
 * Fields:
 * - Author
 * - Category
 * - Project
 * - Producer
 */
export function RelationsSection({ autoSave }: RelationsSectionProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<BlogPostFormData>();

  // Fetch authors
  const { data: authors } = trpc.admin.blogAuthors.list.useQuery({ search: undefined });

  // Fetch blog categories
  const { data: blogCategories } = trpc.admin.blogCategories.list.useQuery({ search: undefined });

  // Fetch projects
  const { data: projects } = trpc.admin.projects.list.useQuery({});

  // Build author options
  const authorOptions = useMemo<SelectOption[]>(() => {
    const options: SelectOption[] = [
      {
        value: '',
        title: 'Aucun auteur',
        subtitle: 'Pas d\'auteur assigné',
        icon: <User className="h-4 w-4 text-muted-foreground" />,
      },
    ];

    if (authors) {
      authors.forEach(author => {
        options.push({
          value: author.id,
          title: author.name,
          subtitle: author.bio || '',
          icon: <User className="h-4 w-4 text-primary" />,
        });
      });
    }

    return options;
  }, [authors]);

  // Build category options
  const categoryOptions = useMemo<SelectOption[]>(() => {
    const options: SelectOption[] = [
      {
        value: '',
        title: 'Aucune catégorie',
        subtitle: 'Pas de catégorie assignée',
        icon: <Folder className="h-4 w-4 text-muted-foreground" />,
      },
    ];

    if (blogCategories) {
      blogCategories.forEach(category => {
        options.push({
          value: category.id,
          title: category.name,
          subtitle: category.slug,
          icon: <Folder className="h-4 w-4 text-primary" />,
        });
      });
    }

    return options;
  }, [blogCategories]);

  // Build project options
  const projectOptions = useMemo<SelectOption[]>(() => {
    const options: SelectOption[] = [
      {
        value: '',
        title: 'Aucun projet',
        subtitle: 'Pas de projet lié',
        icon: <Leaf className="h-4 w-4 text-muted-foreground" />,
      },
    ];

    // Vérifier que projects est un tableau avant d'utiliser forEach
    if (projects && Array.isArray(projects)) {
      projects.forEach(project => {
        options.push({
          value: project.id,
          title: project.name,
          subtitle: project.description || '',
          icon: <Leaf className="h-4 w-4 text-success" />,
        });
      });
    }

    return options;
  }, [projects]);

  return (
    <DetailView.Section icon={Link} title="Relations">
      <DetailView.FieldGroup layout="grid-2">
        {/* Author */}
        <DetailView.Field
          label="Auteur"
          error={errors.author_id?.message}
          description="L'auteur de cet article"
        >
          <Controller
            name="author_id"
            control={control}
            render={({ field }) => (
              <CustomSelect
                name="author_id"
                contextIcon={<User className="h-5 w-5" />}
                options={authorOptions}
                value={field.value || ''}
                onChange={(value) => {
                  field.onChange(value || null);
                  autoSave.triggerSave();
                  autoSave.saveNow();
                }}
              />
            )}
          />
        </DetailView.Field>

        {/* Category */}
        <DetailView.Field
          label="Catégorie"
          error={errors.category_id?.message}
          description="La catégorie de cet article"
        >
          <Controller
            name="category_id"
            control={control}
            render={({ field }) => (
              <CustomSelect
                name="category_id"
                contextIcon={<Folder className="h-5 w-5" />}
                options={categoryOptions}
                value={field.value || ''}
                onChange={(value) => {
                  field.onChange(value || null);
                  autoSave.triggerSave();
                  autoSave.saveNow();
                }}
              />
            )}
          />
        </DetailView.Field>

        {/* Project */}
        <DetailView.Field
          label="Projet lié"
          error={errors.project_id?.message}
          description="Projet environnemental associé (optionnel)"
        >
          <Controller
            name="project_id"
            control={control}
            render={({ field }) => (
              <CustomSelect
                name="project_id"
                contextIcon={<Leaf className="h-5 w-5" />}
                options={projectOptions}
                value={field.value || ''}
                onChange={(value) => {
                  field.onChange(value || null);
                  autoSave.triggerSave();
                  autoSave.saveNow();
                }}
              />
            )}
          />
        </DetailView.Field>

        {/* Producer - Placeholder for now */}
        <DetailView.Field
          label="Producteur"
          error={errors.producer_id?.message}
          description="Producteur associé (optionnel)"
        >
          <Controller
            name="producer_id"
            control={control}
            render={({ field }) => (
              <CustomSelect
                name="producer_id"
                contextIcon={<Building className="h-5 w-5" />}
                options={[
                  {
                    value: '',
                    title: 'Aucun producteur',
                    subtitle: 'Pas de producteur lié',
                    icon: <Building className="h-4 w-4 text-muted-foreground" />,
                  },
                ]}
                value={field.value || ''}
                onChange={(value) => {
                  field.onChange(value || null);
                  autoSave.triggerSave();
                  autoSave.saveNow();
                }}
              />
            )}
          />
        </DetailView.Field>
      </DetailView.FieldGroup>
    </DetailView.Section>
  );
}
