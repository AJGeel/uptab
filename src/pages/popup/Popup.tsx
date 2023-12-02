import "@assets/styles/tailwind.css";

export default function Popup(): JSX.Element {
  return (
    <div className="max-h-screen min-h-screen bg-sky-800 flex flex-col items-center justify-center max-w-[300px] w-full mx-auto gap-4">
      <img src="/icon-128.png" />
      <p className="font-bold text-base text-white">What&apos;s UpTab?</p>
    </div>
  );
}
