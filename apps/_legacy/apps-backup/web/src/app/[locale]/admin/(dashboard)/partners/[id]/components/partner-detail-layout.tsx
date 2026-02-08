'use client';

import type { FC, ReactNode } from 'react';

type PartnerDetailLayoutProps = {
  header: ReactNode;
  toolbar: ReactNode;
  content: ReactNode;
  sidebar?: ReactNode;
  className?: string;
};

export const PartnerDetailLayout: FC<PartnerDetailLayoutProps> = ({
  header,
  toolbar,
  content,
  sidebar,
  className = '',
}) => {
  return (
    <div className={`relative h-screen bg-background-base text-text-primary ${className}`}>
      {}
      <div className="absolute top-0 right-0 left-0 z-40">
        <div
          className="border-border-subtle/70 border-b bg-surface-1/95 shadow-glow-md backdrop-blur-[20px]"
          style={{
            background: 'var(--filters-bg)',
            boxShadow: 'var(--elevation-filters)',
          }}
        >
          {header}

          {}
          <div className="hidden px-8 pb-4 md:block">{toolbar}</div>
        </div>
      </div>

      {}
      <div className="content-wrapper content-wrapper-dark h-full overflow-y-auto pt-48 pb-20 sm:pt-48 md:pt-64 md:pb-8 lg:pt-56">
        <div className="relative z-[1] mx-auto max-w-7xl space-y-4 px-4 md:space-y-6 md:px-8">
          {sidebar ? (
            <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-4">
              <div className="lg:col-span-3">{content}</div>
              <div className="lg:col-span-1">{sidebar}</div>
            </div>
          ) : (
            <div className="w-full">{content}</div>
          )}
        </div>
      </div>
    </div>
  );
};
