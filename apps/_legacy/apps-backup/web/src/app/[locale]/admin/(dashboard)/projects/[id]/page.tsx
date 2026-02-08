'use client';

import { type FC, useMemo } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams } from 'next/navigation';

import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { useEntityErrorHandler } from '@/hooks/use-entity-error-handler';
import { trpc } from '@/lib/trpc';

import { ProjectDetailSkeleton } from './components/project-detail-skeleton';
import {
  ProjectCoverSectionRHF,
  ProjectDescriptionSectionRHF,
  ProjectEditHeaderRHF,
  ProjectEssentialSectionRHF,
  ProjectFundingSectionRHF,
  ProjectImagesSectionRHF,
} from './components/rhf';
import { useProjectFormRHF } from './hooks/use-project-form-rhf';

import type { ProductBlurHash } from '@/types/blur';

const AdminProjectEditPageRHF: FC = () => {
  const params = useParams<{ id: string }>();
  const projectId = typeof params?.id === 'string' ? params.id : undefined;

  const {
    data: project,
    isPending: isLoading,
    error,
  } = trpc.admin.projects.byId.useQuery(
    { id: projectId ?? '' },
    { enabled: Boolean(projectId) }
  );

  useEntityErrorHandler(error, {
    redirectTo: '/admin/projects',
    entityType: 'project',
  });

  // TOUS les hooks AVANT les conditions (règles de React)
  const projectForm = useProjectFormRHF({
    projectId: projectId ?? '',
    initialData: project,
  });

  const imageBlurMap = useMemo(() => {
    const map = project?.image_blur_map as Record<string, unknown> | undefined;
    if (!map) return {} as Record<string, ProductBlurHash>;

    const normalized: Record<string, ProductBlurHash> = {};
    for (const [url, value] of Object.entries(map)) {
      if (value && typeof value === 'object') {
        const raw = value as Record<string, unknown>;
        normalized[url] = {
          url,
          blurHash:
            (raw.blurHash as string | undefined) ??
            (raw.blur_hash as string | undefined) ??
            '',
          blurDataURL:
            (raw.blurDataURL as string | undefined) ??
            (raw.blur_data_url as string | undefined) ??
            undefined,
          width: (raw.width as number | undefined) ?? undefined,
          height: (raw.height as number | undefined) ?? undefined,
          fileSize:
            (raw.fileSize as number | undefined) ??
            (raw.file_size as number | undefined) ??
            undefined,
        };
      }
    }
    return normalized;
  }, [project?.image_blur_map]);

  // Conditions APRÈS tous les hooks
  if (!projectId) {
    return <ProjectDetailSkeleton />;
  }

  if (isLoading || !project || !projectForm.isInitialized) {
    return <ProjectDetailSkeleton />;
  }

  return (
    <AdminPageLayout>
      <FormProvider {...projectForm.form}>
        <form
          className="flex h-full flex-col bg-surface-1 text-text-primary transition-colors duration-300 dark:bg-transparent"
          onSubmit={event => {
            event.preventDefault();
            void projectForm.submitNow();
          }}
        >
          {/* All content scrollable together */}
          <div className="content-wrapper content-wrapper-dark flex-1 overflow-y-auto">
            {/* Cover Section - scrolls away */}
            <ProjectCoverSectionRHF
              projectId={projectId}
              projectName={project?.name}
            />

            {/* Header - scrolls with content */}
            <div className="border-b border-border-subtle/60 bg-surface-1/95 shadow-glow-md backdrop-blur-sm">
              <ProjectEditHeaderRHF
                errorMessage={projectForm.saveError}
                hasUnsavedChanges={projectForm.hasUnsavedChanges}
                isSaving={projectForm.isSaving}
                lastSavedAt={projectForm.lastSavedAt}
                onManualSave={projectForm.submitNow}
              />
            </div>

            {/* Content */}
            <div className="relative z-[1] py-6">
              <div className="mx-auto max-w-7xl px-4 md:px-8">
                <DetailView variant="cards" gridCols={2} spacing="lg">
                  <ProjectEssentialSectionRHF />
                  <ProjectFundingSectionRHF />
                  <ProjectDescriptionSectionRHF />
                  <ProjectImagesSectionRHF
                    imageBlurMap={imageBlurMap}
                    projectId={projectId}
                  />
                </DetailView>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </AdminPageLayout>
  );
};

export default AdminProjectEditPageRHF;
