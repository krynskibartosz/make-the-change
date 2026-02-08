'use client';

import { TransactionBreadcrumbs } from '@/app/[locale]/admin/(dashboard)/points-transactions/[id]/components/transaction-breadcrumbs';
import { TransactionCompactHeader } from '@/app/[locale]/admin/(dashboard)/points-transactions/[id]/components/transaction-compact-header';
import { TransactionDetailLayout } from '@/app/[locale]/admin/(dashboard)/points-transactions/[id]/components/transaction-detail-layout';
import { TransactionDetails } from '@/app/[locale]/admin/(dashboard)/points-transactions/[id]/components/transaction-details';
import { TransactionUserContext } from '@/app/[locale]/admin/(dashboard)/points-transactions/[id]/components/transaction-user-context';

type TransactionDetailControllerProps = {
  transaction: any;
};

export const TransactionDetailController = ({
  transaction,
}: TransactionDetailControllerProps) => {
  return (
    <TransactionDetailLayout
      breadcrumbs={<TransactionBreadcrumbs transaction={transaction} />}
      header={<TransactionCompactHeader transaction={transaction} />}
      content={
        <div className="space-y-6">
          <TransactionDetails transaction={transaction} />
          <TransactionUserContext transaction={transaction} />
        </div>
      }
    />
  );
};
