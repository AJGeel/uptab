import { HotkeyType } from "./HotkeysModal";

const Hotkey = ({ description, k: key }: HotkeyType) => (
  <div className="mt-2 flex items-center justify-between border-t pt-2 first:mt-0 first:border-t-0">
    <p className="text-gray-900">{description}</p>
    <div className="flex items-center gap-1">
      {Array.from(key).map((item, index) => (
        <>
          {index >= 1 && <p className="font-mono text-sm text-gray-400">+</p>}
          <code
            className="flex w-10 items-center justify-center rounded-sm border bg-white py-1.5 font-sans text-xs text-sky-800 shadow"
            key={item}
          >
            {item}
          </code>
        </>
      ))}
    </div>
  </div>
);

export default Hotkey;
