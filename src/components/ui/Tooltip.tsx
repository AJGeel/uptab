import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { ReactElement } from "react";

type Props = {
  label: string;
  side?: "top" | "bottom";
  disabled?: boolean;
  /** The element that gets the tooltip: it needs to accept props and a ref. */
  children: ReactElement<Record<string, unknown>>;
};

/** A short explanation, shown after hovering or focusing for a moment. */
const Tooltip = ({ label, side = "top", disabled, children }: Props) => (
  <BaseTooltip.Root disabled={disabled}>
    <BaseTooltip.Trigger delay={700} render={children} />

    <BaseTooltip.Portal>
      <BaseTooltip.Positioner side={side} sideOffset={10} className="z-50">
        <BaseTooltip.Popup className="origin-(--transform-origin) rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs text-white shadow-lg transition-[opacity,scale] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          <BaseTooltip.Arrow className="flex size-2 data-[side=bottom]:-top-1 data-[side=top]:-bottom-1">
            <span className="size-2 rotate-45 rounded-[1px] bg-gray-900" />
          </BaseTooltip.Arrow>
          {label}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  </BaseTooltip.Root>
);

export default Tooltip;
