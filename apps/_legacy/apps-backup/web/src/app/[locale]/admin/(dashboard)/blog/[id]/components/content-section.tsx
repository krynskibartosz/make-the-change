'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { FileEdit } from 'lucide-react';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { Textarea } from '@/components/ui/textarea';
import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';
import type { BlogPostFormData } from '../types/blog-post-form.types';

interface ContentSectionProps {
  autoSave: AutoSaveReturn;
}

/**
 * Content Section - RHF Component for Blog Posts
 *
 * Fields:
 * - Content (JSONB - for now using textarea, can be replaced with rich text editor)
 *
 * Note: In production, this should use a rich text editor like TipTap, Lexical, or Plate
 * For now, we're using a textarea as a placeholder
 */
export function ContentSection({ autoSave }: ContentSectionProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<BlogPostFormData>();

  return (
    <DetailView.Section icon={FileEdit} title="Contenu de l'article">
      <DetailView.Field
        label="Contenu"
        description="Le contenu principal de votre article. Dans une version future, ceci sera un éditeur riche (TipTap/Lexical)."
        error={errors.content?.message}
      >
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              value={typeof field.value === 'string' ? field.value : JSON.stringify(field.value || '', null, 2)}
              className="font-mono min-h-[400px]"
              placeholder="Entrez le contenu de l'article (JSON pour l'instant)..."
              onBlur={() => {
                field.onBlur();
                autoSave.saveNow();
              }}
              onChange={(e) => {
                try {
                  // Try to parse as JSON, fallback to string
                  const value = e.target.value;
                  let parsed = value;
                  try {
                    parsed = JSON.parse(value);
                  } catch {
                    // Keep as string if not valid JSON
                  }
                  field.onChange(parsed);
                } catch {
                  field.onChange(e.target.value);
                }
                autoSave.triggerSave();
              }}
            />
          )}
        />
      </DetailView.Field>

      <div className="bg-accent/10 border-accent/20 rounded-lg border p-4">
        <p className="text-text-secondary text-sm">
          <strong>Note:</strong> Cette zone de contenu utilise actuellement un textarea simple.
          Pour une expérience optimale, nous recommandons d'intégrer un éditeur WYSIWYG comme{' '}
          <a
            className="text-accent hover:underline"
            href="https://tiptap.dev"
            rel="noopener noreferrer"
            target="_blank"
          >
            TipTap
          </a>{' '}
          ou{' '}
          <a
            className="text-accent hover:underline"
            href="https://lexical.dev"
            rel="noopener noreferrer"
            target="_blank"
          >
            Lexical
          </a>
          .
        </p>
      </div>
    </DetailView.Section>
  );
}
