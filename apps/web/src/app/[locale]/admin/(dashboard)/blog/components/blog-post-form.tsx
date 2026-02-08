'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { FormInput, FormSelect, FormTextArea } from '@make-the-change/core/ui/rhf'
import { FileText, Save, Trash2 } from 'lucide-react'
import type { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from '@/i18n/navigation'
import {
  type BlogPostFormData,
  blogPostFormSchema,
} from '@/lib/validators/blog'
import { createBlogPostAction, deleteBlogPostAction, updateBlogPostAction } from '../actions'

type BlogPostFormProps = {
  initialData?: BlogPostFormData & { id: string }
  authors?: Array<{ id: string; name: string }>
  categories?: Array<{ id: string; name: string }>
  projects?: Array<{ id: string; name: string }>
}

const statusOptions = [
    { value: 'draft', label: 'Brouillon' },
    { value: 'published', label: 'Publié' },
    { value: 'archived', label: 'Archivé' },
]

export const BlogPostForm: FC<BlogPostFormProps> = ({ initialData, authors = [], categories = [], projects = [] }) => {
  const router = useRouter()
  const { toast } = useToast()
  const isEditMode = !!initialData

  // Helper to extract text from TipTap JSON for display in TextArea
  const getInitialContentText = () => {
    if (!initialData?.content) return '';
    if (typeof initialData.content === 'string') return initialData.content;
    // Basic extraction (very naive)
    try {
        if (initialData.content.type === 'doc' && Array.isArray(initialData.content.content)) {
            return initialData.content.content
                .map((node: any) => node.content?.map((n: any) => n.text).join('') || '')
                .join('\n\n');
        }
    } catch (e) {
        return '';
    }
    return '';
  }

  const form = useForm<BlogPostFormData & { contentText: string }>({
    defaultValues: {
        ...(initialData || {
            title: '',
            slug: '',
            status: 'draft',
            excerpt: '',
            seo_title: '',
            seo_description: '',
            seo_keywords: '',
            cover_image_url: '',
            author_id: null,
            category_id: null,
            project_id: null,
        }),
        contentText: getInitialContentText(),
    },
    mode: 'onChange',
    resolver: zodResolver(blogPostFormSchema.extend({ content: z.any() })), // Relax validation for form usage
  })

  const handleSubmit = form.handleSubmit(async (value) => {
    try {
      // Convert text back to simple TipTap JSON
      const tipTapContent = {
        type: 'doc',
        content: value.contentText.split('\n\n').map(para => ({
            type: 'paragraph',
            content: para.trim() ? [{ type: 'text', text: para.trim() }] : []
        })).filter(p => p.content.length > 0)
      };

      const payload = {
          ...value,
          content: tipTapContent
      };
      
      // Remove temporary field
      delete (payload as any).contentText;

      const result = isEditMode
        ? await updateBlogPostAction(initialData.id, payload)
        : await createBlogPostAction(payload)

      if (!result.success) {
        throw new Error(result.error || 'Une erreur est survenue')
      }

      toast({
        variant: 'success',
        title: isEditMode ? 'Article mis à jour' : 'Article créé',
        description: isEditMode
          ? 'L\'article a été mis à jour avec succès'
          : 'L\'article a été créé avec succès',
      })

      if (!isEditMode && result.data?.id) {
        router.push(`/admin/blog/${result.data.id}`)
      } else {
        router.refresh()
      }
    } catch (error: unknown) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
      })
    }
  })

  const handleDelete = async () => {
    if (!isEditMode || !confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return

    try {
        const result = await deleteBlogPostAction(initialData.id)
        if (!result.success) {
            throw new Error(result.error || 'Impossible de supprimer l\'article')
        }
        toast({
            variant: 'success',
            title: 'Article supprimé',
            description: 'L\'article a été supprimé avec succès',
        })
        router.push('/admin/blog')
    } catch (error: unknown) {
        toast({
            variant: 'destructive',
            title: 'Erreur',
            description: error instanceof Error ? error.message : 'Impossible de supprimer l\'article',
        })
    }
  }

  return (
    <FormProvider {...form}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Contenu
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <FormInput
                    name="title"
                    required
                    label="Titre"
                    placeholder="Titre de l'article"
                />

                <FormInput
                    name="slug"
                    required
                    label="Slug"
                    placeholder="titre-de-l-article"
                />

                <FormTextArea
                    name="excerpt"
                    label="Extrait"
                    placeholder="Bref résumé..."
                    rows={3}
                />

                <FormTextArea
                    name="contentText" // Using temporary field
                    label="Contenu (Texte brut - sera converti en paragraphes)"
                    placeholder="Rédigez votre article ici..."
                    rows={15}
                />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>SEO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormInput
                        name="seo_title"
                        label="Titre SEO"
                    />
                    <FormTextArea
                        name="seo_description"
                        label="Description SEO"
                        rows={3}
                    />
                    <FormInput
                        name="seo_keywords"
                        label="Mots-clés"
                    />
                </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
                <CardHeader>
                <CardTitle>Publication</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <FormSelect
                    name="status"
                    label="Statut"
                    options={statusOptions}
                />
                
                <FormSelect
                    name="author_id"
                    label="Auteur"
                    options={[{ value: null, label: 'Aucun' }, ...authors.map(a => ({ value: a.id, label: a.name }))]}
                    placeholder="Sélectionner un auteur"
                />

                <FormSelect
                    name="category_id"
                    label="Catégorie"
                    options={[{ value: null, label: 'Aucune' }, ...categories.map(c => ({ value: c.id, label: c.name }))]}
                    placeholder="Sélectionner une catégorie"
                />

                <FormSelect
                    name="project_id"
                    label="Projet lié"
                    options={[{ value: null, label: 'Aucun' }, ...projects.map(p => ({ value: p.id, label: p.name }))]}
                    placeholder="Sélectionner un projet"
                />
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Image de couverture</CardTitle>
                </CardHeader>
                <CardContent>
                    <FormInput
                        name="cover_image_url"
                        label="URL de l'image"
                        placeholder="https://..."
                    />
                </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          {isEditMode && (
            <Button type="button" variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
            </Button>
          )}
          
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annuler
          </Button>

          <Button
            className="flex items-center gap-2"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            type="submit"
          >
            {form.formState.isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
