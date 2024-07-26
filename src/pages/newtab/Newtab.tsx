import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Homescreen from "@/src/components/Homescreen/Homescreen";
import { useEasterEggs } from "@/src/hooks/useEasterEggs";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
    },
  },
});

export default function Newtab() {
  useEasterEggs();

  return (
    <QueryClientProvider client={queryClient}>
      <Homescreen />
    </QueryClientProvider>
  );
}
