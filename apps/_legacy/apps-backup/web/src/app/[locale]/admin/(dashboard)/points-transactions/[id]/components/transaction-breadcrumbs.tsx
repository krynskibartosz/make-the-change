'use client';

import { ChevronRight, Coins, Home } from 'lucide-react';
import Link from 'next/link';
import { type FC } from 'react';

type TransactionBreadcrumbsProps = {
  transaction: any;
};

export const TransactionBreadcrumbs: FC<TransactionBreadcrumbsProps> = ({
  transaction,
}) => {
  const formatTransactionLabel = (trans: any) => {
    const amount = trans.amount > 0 ? `+${trans.amount}` : trans.amount;
    return `${amount} pts`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-4 pb-2 md:px-8 md:pt-6">
      <nav
        aria-label="Breadcrumb"
        className="text-muted-foreground flex items-center gap-2 text-sm"
      >
        <Link
          className="hover:text-foreground flex items-center gap-1 transition-colors"
          href="/admin"
        >
          <Home className="h-4 w-4" />
          <span>Tableau de bord</span>
        </Link>

        <ChevronRight className="h-4 w-4" />

        <Link
          className="hover:text-foreground flex items-center gap-1 transition-colors"
          href="/admin/points-transactions"
        >
          <Coins className="h-4 w-4" />
          <span>Transactions de Points</span>
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="text-foreground max-w-[200px] truncate font-medium md:max-w-none">
          {formatTransactionLabel(transaction)}
        </span>
      </nav>
    </div>
  );
};
