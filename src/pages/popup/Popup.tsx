import "@assets/styles/tailwind.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Bookmarks from "@src/components/Bookmarks/Bookmarks";

const queryClient = new QueryClient();

export default function Popup(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="mx-auto flex max-h-screen min-h-screen w-full max-w-[300px] flex-col items-center justify-center gap-4 bg-sky-500/10 p-4">
        <img className="h-12 w-12" src="/icon-128.png" />
        <p className="text-base font-bold text-sky-800">What&apos;s UpTab?</p>
        <Bookmarks displayMode="Popup" />
      </div>
    </QueryClientProvider>
  );
}
