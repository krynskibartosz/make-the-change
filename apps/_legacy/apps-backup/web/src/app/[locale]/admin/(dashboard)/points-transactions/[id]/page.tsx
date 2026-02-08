'use client';

import { useParams } from 'next/navigation';

import { TransactionDetailController } from '@/app/[locale]/admin/(dashboard)/points-transactions/[id]/components/transaction-detail-controller';
import { trpc } from '@/lib/trpc';

const AdminTransactionDetailPage = () => {
  const params = useParams<{ id: string }>();
  const transactionId = params?.id as string | undefined;

  const {
    data: transaction,
    isLoading,
    error,
  } = trpc.admin.pointsTransactions.detail.useQuery(
    { id: transactionId! },
    {
      enabled: Boolean(transactionId),
      retry: 1,
      retryDelay: 500,
    }
  );

  if (!transactionId) {
    return <div className="p-8 text-sm text-muted-foreground">Identifiant manquant.</div>;
  }

  if (isLoading && !transaction) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-semibold text-red-600">Erreur</h3>
        <p className="text-muted-foreground">
          {error?.message ?? 'La transaction est introuvable.'}
        </p>
      </div>
    );
  }

  return <TransactionDetailController transaction={transaction} />;
};

export default AdminTransactionDetailPage;
