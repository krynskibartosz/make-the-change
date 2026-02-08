'use client';

import { type FC } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { useEntityErrorHandler } from '@/hooks/use-entity-error-handler';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';

import { useUserFormOptimistic } from './hooks/use-user-form-optimistic';
import {
  UserCoverSection,
  UserEditHeader,
  EssentialInfoSection,
  ContactSection,
  KYCSection,
  MetadataSection,
} from './components/rhf';
import type { EnrichedUserData } from './types/user-form.types';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * User Edit Page - React Hook Form Implementation
 *
 * Architecture (matching partners pattern):
 * - Uses React Hook Form for form state management
 * - Auto-save with 1.5s debounce + immediate blur flush
 * - Optimistic UI with automatic rollback on error
 * - Error handling with automatic redirect to list page
 * - Cover image + Avatar with custom scroll layout
 * - Sticky header with breadcrumb overlay on cover
 */
const AdminUserEditPage: FC = () => {
  const params = useParams<{ id: string | string[] }>();
  const rawId = params?.id;
  const userId = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!userId) {
    return <div className="p-8">ID utilisateur manquant</div>;
  }

  if (!UUID_REGEX.test(userId)) {
    return (
      <div className="p-8">
        Identifiant utilisateur invalide. Veuillez revenir à la liste des
        utilisateurs.
      </div>
    );
  }

  return <AdminUserEditPageWithId userId={userId} />;
};

const AdminUserEditPageWithId: FC<{ userId: string }> = ({ userId }) => {
  const {
    data: user,
    isPending: isLoadingUser,
    error,
  } = trpc.admin.users.detail.useQuery(
    { userId },
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );

  const isNotFound = error?.data?.code === 'NOT_FOUND';

  useEntityErrorHandler(isNotFound ? null : error, {
    redirectTo: '/admin/users',
    entityType: 'user',
  });

  if (isNotFound) {
    return (
      <AdminPageLayout>
        <UserNotFound />
      </AdminPageLayout>
    );
  }

  if (isLoadingUser || !user) {
    return <div className="p-8">Chargement…</div>;
  }

  return (
    <AdminPageLayout>
      <UserFormWrapperWithHook
        userId={userId}
        userEmail={user.email}
        initialData={user as EnrichedUserData}
      />
    </AdminPageLayout>
  );
};

const UserNotFound: FC = () => (
  <div className="flex h-full items-center justify-center">
    <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-border-subtle/60 bg-surface-1/95 p-8 text-center shadow-glow-md">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-text-primary">Utilisateur introuvable</h1>
        <p className="text-sm text-text-secondary">
          L’utilisateur que vous recherchez n’existe plus ou son identifiant est incorrect.
          Retournez à la liste pour sélectionner un autre utilisateur.
        </p>
      </div>
      <Button asChild>
        <Link href="/admin/users">Retour à la liste des utilisateurs</Link>
      </Button>
    </div>
  </div>
);

/**
 * Inner component that uses form hook
 *
 * Layout original restauré (matching partners):
 * - Cover section avec breadcrumb overlay (full width)
 * - Header avec statut de sauvegarde (PAS de bouton Save manuel)
 * - Scrollable content area avec form sections
 * - Auto-save automatique 1.5s debounce + flush on blur
 */
function UserFormWrapperWithHook({
  userId,
  userEmail,
  initialData,
}: {
  userId: string;
  userEmail: string;
  initialData: EnrichedUserData;
}) {
  const { form, autoSave, hasUnsavedChanges } = useUserFormOptimistic({
    userId,
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
          <UserCoverSection
            userId={userId}
            userEmail={userEmail}
            autoSave={autoSave}
          />

          {/* Header - scrolls with content (NO SAVE BUTTON!) */}
          <div className="border-b border-border-subtle/60 bg-surface-1/95 shadow-glow-md backdrop-blur-sm">
            <UserEditHeader
              autoSave={autoSave}
              hasUnsavedChanges={hasUnsavedChanges}
            />
          </div>

          {/* Content */}
          <div className="relative z-[1] py-6">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              <DetailView variant="cards" gridCols={2} spacing="lg">
                <EssentialInfoSection autoSave={autoSave} />
                <ContactSection autoSave={autoSave} />
                <KYCSection autoSave={autoSave} />
                <MetadataSection autoSave={autoSave} />
              </DetailView>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

export default AdminUserEditPage;
