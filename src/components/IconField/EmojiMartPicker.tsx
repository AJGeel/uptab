import data from "@emoji-mart/data";
import { Picker } from "emoji-mart";
import { useEffect, useRef } from "react";

type Props = {
  onSelect: (emoji: string) => void;
};

/** emoji-mart's own element is used, as its React wrapper doesn't support React 19. */
const EmojiMartPicker = ({ onSelect }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  });

  useEffect(() => {
    const container = containerRef.current;

    const picker = new Picker({
      data,
      set: "native",
      theme: "light",
      previewPosition: "none",
      autoFocus: true,
      onEmojiSelect: ({ native }: { native: string }) =>
        onSelectRef.current(native),
    }) as unknown as HTMLElement;

    container?.appendChild(picker);

    return () => picker.remove();
  }, []);

  return <div ref={containerRef} className="h-88" />;
};

export default EmojiMartPicker;
