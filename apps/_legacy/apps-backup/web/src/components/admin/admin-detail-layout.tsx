'use client';

import { cn } from '@make-the-change/core/shared/utils';

import type { FC, ReactNode } from 'react';

export type AdminDetailLayoutProps = {
  children: ReactNode;
  headerContent?: ReactNode;
  sidebar?: ReactNode;
  stickyHeader?: boolean;
  className?: string;
  testId?: string;
};

export const AdminDetailLayout: FC<AdminDetailLayoutProps> = ({
  children,
  headerContent,
  sidebar,
  stickyHeader: _stickyHeader = true,
  className,
  testId = 'admin-detail-layout',
}) => (
  <div
    data-testid={testId}
    className={cn(
      'flex min-h-screen flex-col bg-background-base text-text-primary transition-colors duration-300',
      className
    )}
  >
    {/* Header Section - Sticky et compact */}
    {headerContent && (
      <div
        className={cn(
          'sticky top-0 z-40 border-b border-border-subtle/60 bg-surface-1/95 text-text-primary backdrop-blur-sm',
          'shadow-glow-md'
        )}
      >
        {headerContent}
      </div>
    )}

    {/* Content Section - Espacement réduit */}
    <div
      className={cn(
        'flex-1 overflow-y-auto content-wrapper content-wrapper-dark',
        headerContent ? 'py-6' : 'pt-8 pb-6'
      )}
    >
      <div className="relative z-[1] mx-auto max-w-7xl space-y-4 px-4 md:space-y-6 md:px-8">
        {sidebar ? (
          <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-4">
            <div className="space-y-6 lg:col-span-3">{children}</div>
            <div className="space-y-4 lg:col-span-1">{sidebar}</div>
          </div>
        ) : (
          <div className="w-full">{children}</div>
        )}
      </div>
    </div>
  </div>
);
