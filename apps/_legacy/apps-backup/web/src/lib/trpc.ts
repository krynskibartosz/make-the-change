import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';

import type { AppRouter } from '@make-the-change/api';
import type { inferRouterOutputs, inferRouterInputs } from '@trpc/server';

export const trpc = createTRPCReact<AppRouter>();

export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;

export const trpcClient = trpc.createClient({
  links: [
    loggerLink({
      enabled: opts => {
        const shouldLogError = opts.direction === 'down' && opts.result instanceof Error;

        if (shouldLogError) {
          const errorWithData = opts.result as { data?: { code?: string } };
          if (errorWithData?.data?.code === 'NOT_FOUND') {
            return false;
          }
        }

        return process.env.NODE_ENV === 'development' || shouldLogError;
      },
    }),
    httpBatchLink({
      url: '/api/trpc',
      async headers() {
        const headers: Record<string, string> = {};

        if (typeof window !== 'undefined') {
          try {
            const supabaseAuth = localStorage.getItem(
              'sb-ebmjxinsyyjwshnynwwu-auth-token'
            );
            if (supabaseAuth) {
              const authData = JSON.parse(supabaseAuth);
              if (authData?.access_token) {
                headers.authorization = `Bearer ${authData.access_token}`;
              }
            }
          } catch (error) {
            console.error('Error getting auth token:', error);
          }
        }

        return headers;
      },
    }),
  ],
});
