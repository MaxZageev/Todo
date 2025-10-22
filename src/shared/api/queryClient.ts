import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      retryOnMount: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 2
    }
  }
});

export default queryClient;
