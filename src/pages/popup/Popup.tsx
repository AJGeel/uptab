import "@/assets/styles/tailwind.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { JSX } from "react";

import Bookmarks from "@/src/components/Bookmarks/Bookmarks";
import { useAccent } from "@/src/hooks/useAccent";

const queryClient = new QueryClient();

/** Applies the accent colour; the hook needs to sit inside the provider. */
const Accent = () => {
  useAccent();

  return null;
};

export default function Popup(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <Accent />
      <div className="mx-auto flex max-h-screen min-h-screen w-full max-w-75 flex-col items-center justify-center gap-4 bg-sky-500/10 p-4">
        <img className="size-12" src="/icon-128.png" />
        <p className="text-base font-bold text-sky-800">What&apos;s UpTab?</p>
        <Bookmarks displayMode="Popup" />
      </div>
    </QueryClientProvider>
  );
}
