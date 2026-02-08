// in /apps/web/src/components/layout/PageHeader.tsx
import React from 'react';

interface Breadcrumb {
  name: string;
  href: string;
}

interface PageHeaderProps {
  breadcrumbs: Breadcrumb[];
  actions: React.ReactNode;
  statusIndicator?: string;
}

export const PageHeader = ({ breadcrumbs, actions, statusIndicator }: PageHeaderProps) => {
  return (
    <header className="bg-background border-b p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <nav className="flex items-center text-sm font-medium text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.href}>
              {index > 0 && <span className="mx-2">/</span>}
              <a href={crumb.href} className="hover:text-foreground">
                {crumb.name}
              </a>
            </React.Fragment>
          ))}
        </nav>
        {statusIndicator && (
          <span className="text-sm text-muted-foreground italic">
            {statusIndicator === 'saving' && 'Saving...'}
            {statusIndicator === 'saved' && 'Saved'}
          </span>
        )}
      </div>
      <div>{actions}</div>
    </header>
  );
};
