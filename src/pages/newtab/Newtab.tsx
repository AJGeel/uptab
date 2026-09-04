import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";

import Homescreen from "@/src/components/Homescreen/Homescreen";
import { useEasterEggs } from "@/src/hooks/useEasterEggs";

const queryClient = new QueryClient();

export default function Newtab() {
  useEasterEggs();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        <QueryClientProvider client={queryClient}>
          <Homescreen />
        </QueryClientProvider>
      </motion.div>
    </AnimatePresence>
  );
}
