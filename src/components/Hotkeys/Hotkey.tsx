import { HotkeyType as HotkeyType } from "./HotkeysModal";

const Hotkey = ({ description, k: key }: HotkeyType) => (
  <div className="flex justify-between items-center first:border-t-0 border-t pt-2 mt-2 first:mt-0">
    <p className="text-gray-900">{description}</p>
    <div className="flex items-center gap-1">
      {Array.from(key).map((item, index) => (
        <>
          {index >= 1 && <p className="font-mono text-sm text-gray-400">+</p>}
          <code
            className="font-mono bg-white shadow border rounded-sm w-10 py-1.5 text-xs flex items-center justify-center text-sky-800"
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
