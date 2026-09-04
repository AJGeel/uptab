type Props = {
  data: object;
};

export const Debugger = ({ data }: Props) => (
  <code className="absolute right-4 top-4 z-50 max-h-96 w-full max-w-xl overflow-y-auto whitespace-pre rounded-2xl bg-black p-3 font-mono text-[10px] text-white">
    {JSON.stringify(data, null, 2)}
  </code>
);
