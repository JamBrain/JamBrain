import { QueryClient, isServer } from "@tanstack/solid-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: !isServer,
      staleTime: 3000,
      refetchOnWindowFocus: false,
    },
  },
});
