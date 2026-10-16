import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { AnimatePresence, motion } from "motion/react";

import Homescreen from "@/src/components/Homescreen/Homescreen";
import { useEasterEggs } from "@/src/hooks/useEasterEggs";
import { persistOptions } from "@/src/services/persistQueries";

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
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={persistOptions}
        >
          <Homescreen />
        </PersistQueryClientProvider>
      </motion.div>
    </AnimatePresence>
  );
}
