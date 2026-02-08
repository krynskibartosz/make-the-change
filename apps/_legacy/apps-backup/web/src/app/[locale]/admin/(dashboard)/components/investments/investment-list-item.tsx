'use client';

import { type FC, type ReactNode } from 'react';

import { AdminListItem } from '@/app/[locale]/admin/(dashboard)/components/ui/admin-list-item';
import type { Investment } from '@/lib/types/investment';

import { InvestmentListHeader } from './investment-list-header';
import { InvestmentListMetadata } from './investment-list-metadata';

type InvestmentListItemProps = {
  investment: Investment;
  actions?: ReactNode;
};

export const InvestmentListItem: FC<InvestmentListItemProps> = ({
  investment,
  actions,
}) => (
  <AdminListItem
    actions={actions}
    header={<InvestmentListHeader investment={investment} />}
    href={`/admin/investments/${investment.id}`}
    metadata={<InvestmentListMetadata investment={investment} />}
  />
);
