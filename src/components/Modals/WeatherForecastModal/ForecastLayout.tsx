import { ReactNode } from "react";

import AnimatedHeight from "../../ui/AnimatedHeight";

type ForecastLayoutProps = {
  summaries: ReactNode;
  /** Fills the chart's box. */
  children: ReactNode;
};

/**
 * The forecast's frame: the day summaries, then the chart's box. The chart and
 * its loading and error placeholders all use it, so the modal keeps its size
 * as they swap.
 */
const ForecastLayout = ({ summaries, children }: ForecastLayoutProps) => (
  <div className="mt-2">
    {/*
     * More or fewer days change the rows: the space follows smoothly. The
     * padding gives the days' hover rings room, the margin cancels it, and
     * box-content keeps the animated height to the rows alone.
     */}
    <AnimatedHeight className="-m-3 box-content p-3">
      {summaries}
    </AnimatedHeight>

    <div className="mt-[50px] h-70 w-full">{children}</div>
  </div>
);

export default ForecastLayout;
