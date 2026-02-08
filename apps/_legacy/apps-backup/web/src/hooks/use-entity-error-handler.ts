'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export interface UseEntityErrorHandlerOptions {
  redirectTo: string;
  entityType: string;
  errorMessage?: string;
}

export function useEntityErrorHandler(
  error: { message: string } | null | undefined,
  options: UseEntityErrorHandlerOptions
): void {
  const router = useRouter();
  const { toast } = useToast();
  const { redirectTo, entityType, errorMessage } = options;

  useEffect(() => {
    if (!error) return;

    let message = errorMessage || 'Une erreur est survenue';

    toast({
      variant: 'destructive',
      title: message,
      description: error.message,
    });

    router.push(redirectTo);
  }, [error, redirectTo, entityType, errorMessage, router, toast]);
}
