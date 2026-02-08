'use client';
import { cn } from '../cn';

import type { FC, PropsWithChildren } from 'react';

type AdminPageContentProps = {
  className?: string;
};

export const AdminPageContent: FC<
  PropsWithChildren & AdminPageContentProps
> = ({ children, className }) => (
  <main
    className={cn(
      'admin-content content-wrapper content-wrapper-dark',
      className
    )}
  >
    <div className="relative z-[1] p-6 pt-40 pb-8 md:pt-52">{children}</div>
  </main>
);
