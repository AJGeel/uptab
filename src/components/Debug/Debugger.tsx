type Props = {
  data: Object;
};

export const Debugger = ({ data }: Props) => (
  <code className="top-4 right-4 bg-black text-white font-mono text-[10px] max-w-xl w-full rounded-2xl p-3 absolute z-50 whitespace-pre overflow-y-auto max-h-96">
    {JSON.stringify(data, null, 2)}
  </code>
);
