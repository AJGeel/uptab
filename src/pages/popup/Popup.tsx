import "@assets/styles/tailwind.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Bookmarks from "@src/components/Bookmarks/Bookmarks";

export default function Popup(): JSX.Element {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-h-screen min-h-screen bg-sky-800 flex flex-col items-center justify-center max-w-[300px] w-full mx-auto gap-4 p-4">
        <img className="w-12 h-12" src="/icon-128.png" />
        <p className="font-bold text-base text-white">What&apos;s UpTab?</p>
        <Bookmarks autoFocus={true} />
      </div>
    </QueryClientProvider>
  );
}
