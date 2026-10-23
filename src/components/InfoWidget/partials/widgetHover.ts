/**
 * Hover and press feedback shared by the info widgets: a soft pill that bleeds
 * out past the content, so the content itself stays put. The tint is white over
 * the homescreen's photo, and darker in the sidebar, which sets `--widget-hover`.
 */
/** Just the tint, for controls that bring their own shape. */
export const widgetTint = "hover:bg-(--widget-hover,rgb(255_255_255/0.4))";

export const widgetHover = `-mx-3 -my-2 rounded-2xl px-3 py-2 duration-150 hover:text-current hover:backdrop-blur-sm ${widgetTint}`;

export const widgetPress = "active:scale-95 active:opacity-70";
