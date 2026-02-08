'use client';

import { ChevronRight, Coins, Home } from 'lucide-react';
import Link from 'next/link';
import { type FC } from 'react';

import type { Investment } from '@/lib/types/investment';

type InvestmentBreadcrumbsProps = {
  investment: Investment;
};

export const InvestmentBreadcrumbs: FC<InvestmentBreadcrumbsProps> = ({
  investment,
}) => {
  const projectName = investment.project?.name ?? 'Investissement';

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
          href="/admin/investments"
        >
          <Coins className="h-4 w-4" />
          <span>Investissements</span>
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="text-foreground max-w-[200px] truncate font-medium md:max-w-none">
          {projectName}
        </span>
      </nav>
    </div>
  );
};
